/**
 * OUR MOTHER EARTH FOUNDATION (OMEF)
 * Main Interactive Application Logic (Multi-Page Architecture)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initFlagshipTabs();
  initPathwayTabs();
  initContactForm();
  initSearch();
  initBackToTop();
  initKeyboardShortcuts();
  removeNetlifyWatermark();
});

function removeNetlifyWatermark() {
  const clean = () => {
    const selectors = [
      '#netlify-feedback-drawer',
      'iframe#netlify-drawer',
      'div[data-netlify-drawer]',
      '[class*="netlify-drawer"]',
      '[id*="netlify-drawer"]',
      '[class*="feedback-drawer"]',
      '[data-testid*="netlify-drawer"]',
      '.netlify-badge'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  clean();
  const observer = new MutationObserver(clean);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

/* ==========================================================================
   HEADER SCROLL DYNAMICS
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('mobile-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-item');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   FLAGSHIP INITIATIVES TABS (Tano River vs Asanteman Digital Future)
   ========================================================================== */
function initFlagshipTabs() {
  window.switchFlagship = function(flagship) {
    const tanoBtn = document.getElementById('tab-btn-tano');
    const asantemanBtn = document.getElementById('tab-btn-asanteman');
    const tanoPanel = document.getElementById('flagship-panel-tano');
    const asantemanPanel = document.getElementById('flagship-panel-asanteman');

    if (flagship === 'tano') {
      if (tanoBtn) tanoBtn.classList.add('active');
      if (asantemanBtn) asantemanBtn.classList.remove('active');
      if (tanoPanel) tanoPanel.classList.add('active');
      if (asantemanPanel) asantemanPanel.classList.remove('active');
    } else {
      if (asantemanBtn) asantemanBtn.classList.add('active');
      if (tanoBtn) tanoBtn.classList.remove('active');
      if (asantemanPanel) asantemanPanel.classList.add('active');
      if (tanoPanel) tanoPanel.classList.remove('active');
    }
  };
}

/* ==========================================================================
   PORTFOLIO OVERVIEW: 5 PATHWAYS TABS
   ========================================================================== */
function initPathwayTabs() {
  const pathways = ['landscapes', 'recovery', 'education', 'innovation', 'community'];

  window.switchPathway = function(targetKey) {
    pathways.forEach(key => {
      const btn = document.getElementById(`tab-pathway-${key}`);
      const panel = document.getElementById(`pathway-panel-${key}`);
      if (btn && panel) {
        if (key === targetKey) {
          btn.classList.add('active');
          panel.classList.add('active');
        } else {
          btn.classList.remove('active');
          panel.classList.remove('active');
        }
      }
    });
  };
}

/* ==========================================================================
   MODAL MANAGEMENT
   ========================================================================== */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Autofocus first input if search modal
    if (modalId === 'search-modal') {
      setTimeout(() => {
        const input = document.getElementById('site-search-input');
        if (input) input.focus();
      }, 100);
    }
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

// Close modal on background overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

/* ==========================================================================
   LEGAL POLICIES MODAL CONTROLLER
   ========================================================================== */
const legalContents = {
  privacy: {
    title: 'Privacy Notice',
    tag: 'Data Protection & Ethics',
    content: `
      <p><strong>Our Mother Earth Foundation Privacy Notice:</strong></p>
      <p>We respect your privacy and protect all personal data submitted to the Foundation. We will use the information you provide exclusively to review and respond to your enquiry, manage partnerships, and communicate official programme updates in accordance with applicable data protection laws.</p>
      <p>We never sell, trade, or share user details with unauthorized commercial third parties.</p>
    `
  },
  terms: {
    title: 'Terms of Use',
    tag: 'Public Legal Terms',
    content: `
      <p><strong>Foundation Terms of Use:</strong></p>
      <p>All materials, including text, research papers, methodologies, and visual marks on this website, are published for public benefit and public-interest educational purposes.</p>
      <p>No party may misrepresent affiliation with Our Mother Earth Foundation or make unauthorized commercial use of our emblems and trademarks.</p>
    `
  },
  accessibility: {
    title: 'Accessibility Statement',
    tag: 'Inclusion Standard',
    content: `
      <p><strong>Commitment to Digital Accessibility:</strong></p>
      <p>OMEF is committed to ensuring digital accessibility for all people, including those with visual, auditory, cognitive, or physical impairments. This website complies with WCAG 2.1 AA guidelines, featuring high contrast ratios, screen reader compatibility, and keyboard navigation.</p>
    `
  },
  safeguarding: {
    title: 'Safeguarding Policy',
    tag: 'Protection & Integrity',
    content: `
      <p><strong>Do-No-Harm & Safeguarding Standards:</strong></p>
      <p>All OMEF community programs, river restoration projects, and youth educational initiatives operate under strict safeguarding protocols. We ensure informed community consent, respect for indigenous land rights, and safe environments for vulnerable youth and learners.</p>
    `
  },
  complaints: {
    title: 'Complaints & Grievance Mechanism',
    tag: 'Accountability Route',
    content: `
      <p><strong>Transparent Grievance Handling:</strong></p>
      <p>OMEF maintains an independent, confidential grievance and inquiry mechanism for community members, partners, and the public to raise concerns regarding program execution, governance integrity, or safeguarding.</p>
      <p>Enquiries can be directed to: <a href="mailto:governance@ourmotherearth.org" style="color: var(--gold-400);">governance@ourmotherearth.org</a>.</p>
    `
  },
  org: {
    title: 'Organisation Details & Public Status',
    tag: 'Constitutional Entity',
    content: `
      <p><strong>Legal Description:</strong></p>
      <p>Our Mother Earth Foundation (OMEF) is an international public-interest foundation dedicated to climate resilience, ecological restoration, sustainable development, and education.</p>
      <p>Convening Location: Kumasi, Ashanti Region, Ghana, with partner networks across Africa and globally.</p>
    `
  }
};

window.openLegalModal = function(policyKey) {
  const policy = legalContents[policyKey] || legalContents.privacy;
  const title = document.getElementById('legal-title');
  const tag = document.getElementById('legal-tag');
  const content = document.getElementById('legal-content');

  if (title) title.textContent = policy.title;
  if (tag) tag.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> ${policy.tag}`;
  if (content) content.innerHTML = policy.content;

  openModal('legal-modal');
};

/* ==========================================================================
   MULTI-TRACK CONTACT FORM HANDLING
   ========================================================================== */
window.setContactInquiry = function(inquiryType) {
  if (window.location.pathname.endsWith('contact.html')) {
    const select = document.getElementById('contact-inquiry-type');
    if (select) select.value = inquiryType;
    const formHub = document.getElementById('contact-hub');
    if (formHub) formHub.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = `contact.html?type=${encodeURIComponent(inquiryType)}`;
  }
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedbackArea = document.getElementById('contact-feedback-area');

  if (!form) return;

  // Check URL query param for inquiry type
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  if (typeParam) {
    const select = document.getElementById('contact-inquiry-type');
    if (select) select.value = typeParam;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (feedbackArea) feedbackArea.innerHTML = '';

    const inquiryType = document.getElementById('contact-inquiry-type');
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    const consent = document.getElementById('contact-consent');

    let isValid = true;
    [inquiryType, name, email, message].forEach(el => {
      if (el) el.classList.remove('error');
    });

    if (!inquiryType.value) {
      inquiryType.classList.add('error');
      isValid = false;
    }
    if (!name.value.trim()) {
      name.classList.add('error');
      isValid = false;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
      email.classList.add('error');
      isValid = false;
    }
    if (!message.value.trim()) {
      message.classList.add('error');
      isValid = false;
    }
    if (!consent || !consent.checked) {
      isValid = false;
    }

    if (!isValid) {
      if (feedbackArea) {
        feedbackArea.innerHTML = `
          <div style="margin-bottom: 20px; padding: 14px 18px; border-radius: var(--radius-sm); background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: var(--gold-300); display: flex; gap: 12px; align-items: center; font-size: 0.9rem;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem; color: var(--gold-400); flex-shrink: 0;"></i>
            <div>Please review the highlighted fields and provide the required information to send your enquiry.</div>
          </div>
        `;
        feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      form.reset();
      if (feedbackArea) {
        feedbackArea.innerHTML = `
          <div style="margin-bottom: 24px; padding: 20px 24px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); color: #ecfdf5; display: flex; gap: 16px; align-items: flex-start; font-size: 0.95rem; line-height: 1.65;">
            <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; color: var(--emerald-accent); margin-top: 2px; flex-shrink: 0;"></i>
            <div>
              <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 6px; font-weight: 600;">Enquiry Received</h4>
              <p>Thank you for contacting Our Mother Earth Foundation. We have received your enquiry and will direct it to the appropriate team. In the meantime, you may wish to explore our programmes, upcoming events or latest insights.</p>
            </div>
          </div>
        `;
        feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 800);
  });
}

/* ==========================================================================
   INSTANT SEARCH INDEX & MODAL (Multi-Page Deep Linking)
   ========================================================================== */
const searchDatabase = [
  {
    title: 'People. Nature. Future.',
    snippet: 'Core foundation philosophy and mission: what we protect today is the start of a better future.',
    link: 'index.html#hero'
  },
  {
    title: 'We Have Only One Mother Earth',
    snippet: 'Universal shared values: hope is a powerful thing when mixed with action.',
    link: 'index.html#philosophy'
  },
  {
    title: '3 Foundational Pillars',
    snippet: 'Where Man and Nature Meet: Landscapes of Restoration, Community Building, and Expand Opportunity.',
    link: 'index.html#pillars'
  },
  {
    title: 'The Story of Ourselves: Origin & Mission',
    snippet: 'Our origin, long-term public interest work, core mission, and vision for people and nature.',
    link: 'about.html#story'
  },
  {
    title: 'Mission & Vision',
    snippet: 'To build climate resilience, ecological restoration, sustainable development, and education.',
    link: 'about.html#mission-vision'
  },
  {
    title: 'Our 7 Core Beliefs',
    snippet: 'We love our children. We are sons and daughters of Mother Earth. There is power in partnership. It takes a village.',
    link: 'about.html#beliefs'
  },
  {
    title: 'Our Five-Point Operating Approach',
    snippet: '1. Listen first, 2. Build through partnership, 3. Beyond project cycle, 4. Measure what matters, 5. Learn openly.',
    link: 'about.html#approach'
  },
  {
    title: 'Leadership, Governance & Charter',
    snippet: 'Public interest governance framework, decision rights, and approved Charter documents.',
    link: 'about.html#governance'
  },
  {
    title: 'Portfolio Overview & 5 Delivery Pathways',
    snippet: 'Resilient Landscapes, Nature Recovery, Education & Digital, Methodologies, and Community Development.',
    link: 'our-work.html#pathways'
  },
  {
    title: 'How We Deliver: 6-Phase Discipline',
    snippet: 'Listen & understand, Co-design, Capable partnerships, Phased delivery, Measure & adapt, Proof points.',
    link: 'our-work.html#delivery'
  },
  {
    title: 'Tano River: A Vision',
    snippet: 'Flagship initiative: ecological restoration, water stewardship, sustainable agriculture, and The Oath.',
    link: 'our-work.html#tano'
  },
  {
    title: 'Asanteman Digital Future',
    snippet: 'Flagship initiative: The Pledge and Five Strands (Digital Foundations, Cybersecurity, Responsible AI, Entrepreneurship, Leadership).',
    link: 'our-work.html#asanteman'
  },
  {
    title: 'Africa Climate Week 2027 | Kumasi',
    snippet: 'Convening in Kumasi, Ghana: Seven Programme Themes, 8 stakeholder sectors, and delivery pathways.',
    link: 'kumasi2027.html'
  },
  {
    title: 'COP & The Climate Refugees Pavilion',
    snippet: 'Global convening for dignity, human stories, policy dialogue, and climate mobility.',
    link: 'our-work.html#events'
  },
  {
    title: 'Impact: How We Count Our Numbers',
    snippet: 'Standardized transparency labels: Verified Progress, Approved Target, Long-term Ambition, External Reference Point.',
    link: 'impact.html#labels'
  },
  {
    title: 'Four Dimensions of Sustainable Change',
    snippet: 'Nature, People, Future, and Systems with cross-cutting inclusion and community rights.',
    link: 'impact.html'
  },
  {
    title: 'Stories of Impact & Community Voices',
    snippet: '“The knowledge that is in the communities is not an add-on to the work. It is the foundation on which the work has to be built.”',
    link: 'impact.html#stories'
  },
  {
    title: 'Featured Partners Hub',
    snippet: 'Monarchex, ESG News, Cyber Future Foundation, AgriLedger, and Climate Live.',
    link: 'partners.html'
  },
  {
    title: 'Methodology Development Lifecycle Tracker',
    snippet: 'In Development, Submitted, Under Review, and Approved methodologies.',
    link: 'results.html#methodologies'
  },
  {
    title: 'News & Media Kit',
    snippet: 'Approved organization description, brand guidelines, and official logo download.',
    link: 'results.html#media'
  },
  {
    title: 'Get Involved & Support a Programme',
    snippet: 'Become a Partner, Support a Programme, Join Our Network, or Participate.',
    link: 'contact.html'
  },
  {
    title: 'Contact & Multi-Track Enquiry Hub',
    snippet: 'Direct connection for partnerships, programmes, Kumasi 2027, COP, and governance.',
    link: 'contact.html#contact-hub'
  }
];

function initSearch() {
  const input = document.getElementById('site-search-input');
  const resultsContainer = document.getElementById('search-results');

  function renderResults(query = '') {
    if (!resultsContainer) return;

    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed === '' 
      ? searchDatabase.slice(0, 7)
      : searchDatabase.filter(item => 
          item.title.toLowerCase().includes(trimmed) || 
          item.snippet.toLowerCase().includes(trimmed)
        );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No matching sections or initiatives found for "${query}".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
      <div class="search-result-item" data-link="${item.link}">
        <span class="search-result-title"><i class="fa-solid fa-angle-right" style="color: var(--gold-500); margin-right: 6px;"></i> ${item.title}</span>
        <span class="search-result-snippet">${item.snippet}</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach((elem, index) => {
      elem.addEventListener('click', () => {
        const item = filtered[index];
        closeModal('search-modal');
        window.location.href = item.link;
      });
    });
  }

  if (input) {
    input.addEventListener('input', (e) => renderResults(e.target.value));
    renderResults('');
  }
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   KEYBOARD SHORTCUTS (Ctrl + K to Search, Esc to Close Modals)
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openModal('search-modal');
    }

    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal.id);
      const drawer = document.getElementById('mobile-drawer');
      if (drawer && drawer.classList.contains('open')) {
        const closeBtn = document.getElementById('mobile-close-btn');
        if (closeBtn) closeBtn.click();
      }
    }
  });
}
