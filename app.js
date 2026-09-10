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
  initGovSubnav();
  checkCharterHash();
});

function checkCharterHash() {
  if (window.location.hash === '#charter' || window.location.hash === '#charter-modal') {
    setTimeout(() => {
      if (typeof openModal === 'function' && document.getElementById('charter-modal')) {
        openModal('charter-modal');
      }
    }, 250);
  }
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
   LEGAL POLICIES ROUTING (Direct Fallback for Legacy Calls)
   ========================================================================== */
window.openLegalModal = function(policyKey) {
  const map = {
    privacy: 'privacy.html',
    cookies: 'cookies.html',
    terms: 'terms.html',
    intellectual_property: 'intellectual-property.html',
    legal_notice: 'legal-notice.html',
    accessibility: 'terms.html',
    safeguarding: 'privacy.html',
    complaints: 'terms.html',
    org: 'legal-notice.html'
  };
  if (map[policyKey]) {
    window.location.href = map[policyKey];
  } else {
    window.location.href = 'privacy.html';
  }
};

/* ==========================================================================
   MULTI-TRACK CONTACT FORM HANDLING
   ========================================================================== */
window.setContactInquiry = function(inquiryType) {
  if (window.location.pathname.includes('contact')) {
    const select = document.getElementById('contact-inquiry-type');
    if (select) {
      for (let option of select.options) {
        if (option.value.toLowerCase().includes(inquiryType.toLowerCase()) || inquiryType.toLowerCase().includes(option.value.toLowerCase())) {
          select.value = option.value;
          break;
        }
      }
    }
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

  // Check URL query param for inquiry type (type or inquiry)
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type') || urlParams.get('inquiry');
  if (typeParam) {
    const select = document.getElementById('contact-inquiry-type');
    if (select) {
      for (let option of select.options) {
        if (option.value.toLowerCase().includes(typeParam.toLowerCase()) || typeParam.toLowerCase().includes(option.value.toLowerCase())) {
          select.value = option.value;
          break;
        }
      }
    }
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

    if (!inquiryType || !inquiryType.value) {
      if (inquiryType) inquiryType.classList.add('error');
      isValid = false;
    }
    if (!name || !name.value.trim()) {
      if (name) name.classList.add('error');
      isValid = false;
    }
    if (!email || !email.value.trim() || !email.value.includes('@')) {
      if (email) email.classList.add('error');
      isValid = false;
    }
    if (!message || !message.value.trim()) {
      if (message) message.classList.add('error');
      isValid = false;
    }
    if (consent && consent.hasAttribute('required') && !consent.checked) {
      isValid = false;
    }

    if (!isValid) {
      if (feedbackArea) {
        feedbackArea.innerHTML = `
          <div style="margin-bottom: 20px; padding: 16px 20px; border-radius: var(--radius-sm); background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: var(--gold-300); display: flex; gap: 12px; align-items: flex-start; font-size: 0.92rem; line-height: 1.6;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem; color: var(--gold-400); flex-shrink: 0; margin-top: 2px;"></i>
            <div>Please review the highlighted fields and provide the information needed to send your enquiry.</div>
          </div>
        `;
        feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending enquiry...`;
      submitBtn.disabled = true;
    }

    const successHTML = `
          <div style="margin-bottom: 24px; padding: 20px 24px; border-radius: var(--radius-sm); background: rgba(5, 150, 105, 0.15); border: 1px solid rgba(5, 150, 105, 0.35); color: #d1fae5; display: flex; gap: 14px; align-items: flex-start; line-height: 1.6;">
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem; color: var(--emerald-400); flex-shrink: 0; margin-top: 2px;"></i>
            <div>
              <strong style="color: #fff; font-size: 1.05rem; display: block; margin-bottom: 4px;">Thank you for contacting Our Mother Earth Foundation.</strong>
              We have received your enquiry and will direct it to the appropriate team. In the meantime, you may wish to explore our programmes, upcoming events or latest insights.
            </div>
          </div>
        `;

    const errorHTML = `
          <div style="margin-bottom: 24px; padding: 20px 24px; border-radius: var(--radius-sm); background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.35); color: #fee2e2; display: flex; gap: 14px; align-items: flex-start; line-height: 1.6;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem; color: #fca5a5; flex-shrink: 0; margin-top: 2px;"></i>
            <div>
              <strong style="color: #fff; font-size: 1.05rem; display: block; margin-bottom: 4px;">Your enquiry could not be sent.</strong>
              Something went wrong on our side. Please try again in a moment, or contact us using the email address listed on this page.
            </div>
          </div>
        `;

    const restoreButton = () => {
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    };

    const showFeedback = (html) => {
      if (!feedbackArea) return;
      feedbackArea.innerHTML = html;
      feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Real submission to Netlify Forms (form-encoded POST to the page itself).
    fetch(form.getAttribute('action') || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then((response) => {
        restoreButton();
        if (!response.ok) throw new Error('Submission failed with status ' + response.status);
        form.reset();
        showFeedback(successHTML);
      })
      .catch((err) => {
        console.error('Contact form submission failed:', err);
        restoreButton();
        showFeedback(errorHTML);
      });
  });
}

/* ==========================================================================
   GLOBAL SEARCH DATABASE & INDEX
   ========================================================================== */
const searchDatabase = [
  {
    title: 'Privacy & Data Protection Notice',
    snippet: 'Official UK GDPR and international data protection notice: rights, data controller contact, retention, and processing principles.',
    link: 'privacy.html'
  },
  {
    title: 'Cookies & Online Tracking Notice',
    snippet: 'Audited reality: 0 tracking or advertising cookies, strictly necessary CDN assets, and affirmative prior consent standards.',
    link: 'cookies.html'
  },
  {
    title: 'Website Terms of Use',
    snippet: 'Governing terms, acceptable use, disclaimers, external linking, and institutional copyright framework.',
    link: 'terms.html'
  },
  {
    title: 'Intellectual Property & Copyright Notice',
    snippet: 'Copyright guidelines, educational quotations, commercial licensing requests, and trademark usage rules.',
    link: 'intellectual-property.html'
  },
  {
    title: 'Website Legal Notice',
    snippet: 'Official operational scope, institutional contacts, legal jurisdiction, and regulatory transparency.',
    link: 'legal-notice.html'
  },
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
    title: 'O-M-E-F Core Beliefs',
    snippet: 'One Earth. Meaningful change is built. Every generation inherits. Future solutions start now. It takes a village.',
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
    link: 'governance.html'
  },
  {
    title: 'Public Governance & Organisational Structure',
    snippet: 'High-level public description of the governance architecture, Board oversight, and delivery of OMEF.',
    link: 'governance.html'
  },
  {
    title: 'Six Core Governance Principles',
    snippet: 'Mission protection, responsible stewardship, clear accountability, partnership, integrity & transparency, long-term thinking.',
    link: 'governance.html#principles'
  },
  {
    title: 'Public Governance Architecture (Board, Executive & Pillars)',
    snippet: 'Interactive hierarchical flow: Board of Directors, Executive Leadership, four functional delivery pillars, and local hubs.',
    link: 'governance.html#architecture'
  },
  {
    title: 'The Board of Directors & The Chair',
    snippet: 'Strategic oversight, mission preservation, resource stewardship, and clear operational boundaries.',
    link: 'governance.html#board'
  },
  {
    title: 'Executive Leadership (President & Managing Director)',
    snippet: 'Operational and technical execution, strategy implementation, institutional representation, and delivery coordination.',
    link: 'governance.html#executive'
  },
  {
    title: 'Public Disclosure Boundaries (What This Document Does Not Disclose)',
    snippet: 'Transparent governance boundaries regarding confidential procedures, legal privilege, voting, and personnel records.',
    link: 'governance.html#boundaries'
  },
  {
    title: 'Portfolio Overview & 5 Delivery Pathways',
    snippet: 'Resilient Landscapes, Nature Recovery, Education & Digital, Methodologies, and Community Development.',
    link: 'our-work.html#pathways'
  },
  {
    title: 'How We Deliver: 5-Phase Discipline',
    snippet: '1. Listen and understand, 2. Co-design the response, 3. Build capable partnerships, 4. Deliver in phases, 5. Measure and adapt.',
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
    snippet: 'ESG News, Cyber Future Foundation, AgriLedger, and Climate Live.',
    link: 'partners.html'
  },
  {
    title: 'Methodology Development Lifecycle Tracker',
    snippet: 'In Development, Submitted, Under Review, and Approved methodologies.',
    link: 'results.html#methodologies'
  },
  {
    title: 'News & Media Centre',
    snippet: 'A rolling record of programme developments, event announcements, approved short description, and media kit downloads.',
    link: 'results.html#news'
  },
  {
    title: 'Get Involved & Support a Programme',
    snippet: 'Become a Partner, Support a Programme, Join Our Network, or Participate.',
    link: 'contact.html#get-involved'
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

/* ==========================================================================
   GOVERNANCE SUBNAV SCROLLSPY
   ========================================================================== */
function initGovSubnav() {
  const subnavLinks = document.querySelectorAll('.gov-subnav-link');
  if (!subnavLinks.length) return;

  const sections = Array.from(subnavLinks).map(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    return id ? document.getElementById(id) : null;
  }).filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        subnavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-15% 0px -70% 0px',
    threshold: 0.1
  });

  sections.forEach(sec => observer.observe(sec));
}
