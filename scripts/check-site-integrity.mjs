#!/usr/bin/env node
/**
 * Vérifications propres au site OMEF, exécutées sur chaque pull request.
 *
 * Elles ciblent les régressions déjà rencontrées sur ce projet :
 *  - des formulaires qui affichent un accusé de réception sans rien envoyer
 *  - des champs sans attribut `name`, silencieusement ignorés par Netlify Forms
 *  - des liens ou des images pointant vers des fichiers absents
 *
 * Aucune dépendance : ce script tourne avec le Node fourni par le runner.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const read = (f) => readFileSync(join(ROOT, f), 'utf8');

if (htmlFiles.length === 0) fail('Aucun fichier HTML trouvé à la racine du dépôt.');

/* ------------------------------------------------------------------ *
 * 1. Formulaires : ils doivent réellement envoyer quelque chose.
 * ------------------------------------------------------------------ */
const EXPECTED_FORMS = [
  { file: 'contact.html', name: 'contact', fields: ['inquiry_type', 'name', 'email', 'message'] },
  { file: 'kumasi2027.html', name: 'kumasi2027', fields: ['name', 'email', 'participation_track'] },
];

for (const spec of EXPECTED_FORMS) {
  if (!existsSync(join(ROOT, spec.file))) {
    fail(`${spec.file} est introuvable — le formulaire "${spec.name}" a disparu du site.`);
    continue;
  }
  const html = read(spec.file);

  const formTag = html.match(new RegExp(`<form[^>]*name=["']${spec.name}["'][^>]*>`, 'i'));
  if (!formTag) {
    fail(`${spec.file} : aucune balise <form name="${spec.name}"> trouvée.`);
    continue;
  }
  const tag = formTag[0];
  const formStart = formTag.index;
  const formEnd = html.indexOf('</form>', formStart);
  if (formEnd === -1) {
    fail(`${spec.file} : la balise <form name="${spec.name}"> n'est jamais fermée.`);
    continue;
  }
  const formHtml = html.slice(formStart, formEnd);

  if (!/data-netlify=["']true["']/i.test(tag)) {
    fail(`${spec.file} : le formulaire "${spec.name}" n'a pas data-netlify="true" — Netlify ne le détectera pas et les envois seront perdus.`);
  }
  if (!/method=["']POST["']/i.test(tag)) {
    fail(`${spec.file} : le formulaire "${spec.name}" n'a pas method="POST".`);
  }
  if (!new RegExp(`<input[^>]*type=["']hidden["'][^>]*name=["']form-name["'][^>]*value=["']${spec.name}["']`, 'i').test(formHtml)) {
    fail(`${spec.file} : champ caché form-name="${spec.name}" manquant — Netlify rejettera l'envoi (404).`);
  }
  if (!/netlify-honeypot=/i.test(tag)) {
    warn(`${spec.file} : pas de netlify-honeypot sur "${spec.name}" — protection anti-spam absente.`);
  }

  for (const field of spec.fields) {
    if (!new RegExp(`name=["']${field}["']`, 'i').test(formHtml)) {
      fail(`${spec.file} : le champ obligatoire name="${field}" est absent — la donnée ne sera pas transmise.`);
    }
  }

  // Tout champ visible sans attribut `name` est ignoré à l'envoi.
  const controls = formHtml.match(/<(input|select|textarea)\b[^>]*>/gi) || [];
  for (const c of controls) {
    if (/type=["'](hidden|submit|button|reset)["']/i.test(c)) continue;
    if (!/\bname=/i.test(c)) {
      const id = (c.match(/id=["']([^"']+)["']/i) || [])[1] || c.slice(0, 60);
      fail(`${spec.file} : le champ "${id}" n'a pas d'attribut name — sa valeur sera silencieusement perdue.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 2. Garde anti-régression : pas de faux accusé de réception.
 * ------------------------------------------------------------------ */
const appJs = existsSync(join(ROOT, 'app.js')) ? read('app.js') : '';
if (appJs) {
  const handler = appJs.slice(appJs.indexOf('function initContactForm'));
  if (handler && !/fetch\s*\(/.test(handler)) {
    fail("app.js : initContactForm() ne contient aucun appel fetch — le formulaire de contact affiche probablement une confirmation sans rien envoyer.");
  }
  if (/removeNetlifyWatermark/.test(appJs)) {
    fail('app.js : removeNetlifyWatermark() est de retour. Le badge se désactive dans les réglages Netlify (Project configuration → General), pas en JavaScript.');
  }
}
if (existsSync(join(ROOT, 'kumasi2027.html'))) {
  const k = read('kumasi2027.html');
  const fn = k.slice(k.indexOf('function submitKumasiPageForm'));
  if (fn && !/fetch\s*\(/.test(fn)) {
    fail("kumasi2027.html : submitKumasiPageForm() n'envoie rien — confirmation affichée sans soumission réelle.");
  }
}

/* ------------------------------------------------------------------ *
 * 3. Liens internes et ressources : les cibles doivent exister.
 * ------------------------------------------------------------------ */
const CLEAN_URLS = new Set(['privacy', 'cookies', 'terms', 'intellectual-property', 'legal-notice']);
const resolveTarget = (raw) => {
  let t = raw.split('#')[0].split('?')[0].trim();
  if (!t || t === '/' || t.startsWith('http') || t.startsWith('mailto:') || t.startsWith('tel:') || t.startsWith('data:')) return null;
  if (t.startsWith('/')) t = t.slice(1);
  if (!t) return null;
  if (CLEAN_URLS.has(t)) return `${t}.html`; // réécritures définies dans netlify.toml
  return t;
};

for (const file of htmlFiles) {
  const html = read(file);
  const refs = [
    ...[...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/src=["']([^"']+)["']/gi)].map((m) => m[1]),
  ];
  for (const raw of refs) {
    const target = resolveTarget(raw);
    if (!target) continue;
    if (!existsSync(join(ROOT, target))) {
      fail(`${file} : lien mort vers "${raw}" — le fichier ${target} n'existe pas.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 4. Pages attendues et base SEO.
 * ------------------------------------------------------------------ */
for (const required of ['index.html', '404.html', 'contact.html', 'netlify.toml']) {
  if (!existsSync(join(ROOT, required))) fail(`Fichier obligatoire manquant : ${required}`);
}

for (const file of htmlFiles) {
  const html = read(file);
  if (!/<title>[^<]{3,}<\/title>/i.test(html)) fail(`${file} : balise <title> absente ou vide.`);
  if (!/<meta[^>]+name=["']description["'][^>]*>/i.test(html)) warn(`${file} : pas de meta description.`);
  if (!/<html[^>]+lang=/i.test(html)) warn(`${file} : l'attribut lang est absent sur <html>.`);
}

/* ------------------------------------------------------------------ *
 * 5. Rien de sensible dans les fichiers publiés.
 * ------------------------------------------------------------------ */
const SECRET_PATTERNS = [
  [/\bAKIA[0-9A-Z]{16}\b/, 'clé d\'accès AWS'],
  [/\bsk_live_[0-9a-zA-Z]{16,}\b/, 'clé secrète Stripe'],
  [/\bgh[pousr]_[0-9A-Za-z]{30,}\b/, 'jeton GitHub'],
  [/-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, 'clé privée'],
];
for (const file of [...htmlFiles, 'app.js', 'styles.css'].filter((f) => existsSync(join(ROOT, f)))) {
  const content = read(file);
  for (const [re, label] of SECRET_PATTERNS) {
    if (re.test(content)) fail(`${file} : ${label} détectée dans un fichier publié publiquement.`);
  }
}

/* ------------------------------------------------------------------ *
 * Rapport
 * ------------------------------------------------------------------ */
for (const w of warnings) console.log(`::warning::${w}`);
for (const e of errors) console.log(`::error::${e}`);

console.log(`\n${htmlFiles.length} pages analysées — ${errors.length} erreur(s), ${warnings.length} avertissement(s).`);
if (errors.length) {
  console.log('\nÉchec : corrigez les erreurs ci-dessus avant de fusionner.');
  process.exit(1);
}
console.log('Toutes les vérifications d\'intégrité passent.');
