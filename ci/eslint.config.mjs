import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['ci/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Fonctions exposées sur `window` dans app.js et appelées depuis
        // des gestionnaires inline du HTML. Sans cette déclaration,
        // no-undef les signale à tort.
        openModal: 'writable',
        closeModal: 'writable',
        openLegalModal: 'writable',
        setContactInquiry: 'writable',
        switchFlagship: 'writable',
        switchPathway: 'writable',
        submitKumasiPageForm: 'writable',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // --- Erreurs réelles : bloquent la PR ---
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'no-unreachable': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': 'error',
      'no-func-assign': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-self-compare': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unsafe-negation': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-fallthrough': 'error',
      'no-redeclare': 'error',

      // --- Sécurité ---
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-proto': 'error',

      // --- Hygiène : signalé sans bloquer ---
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['warn', 'smart'],
    },
  },
];
