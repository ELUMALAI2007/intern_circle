/**
 * ==============================================================================
 * NEXORA – SaaS Pricing Website
 * Pure Vanilla JavaScript (ES6+)
 * Monthly/Yearly Toggle · FAQ Accordion · Mobile Nav · ScrollSpy · Back-to-Top
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================================
  // 1. updateCopyrightYear()
  // ============================================================================
  function updateCopyrightYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ============================================================================
  // 2. PRICING — Billing Toggle & Dynamic Price Calculations
  // ============================================================================

  // Pricing data: monthly prices & 20% discount for yearly
  const plans = {
    starter:    { monthly: 9,  yearlyTotal: 86.40,  yearlyMonthly: 7.20  },
    pro:        { monthly: 19, yearlyTotal: 182.40, yearlyMonthly: 15.20 },
    enterprise: { monthly: 49, yearlyTotal: 470.40, yearlyMonthly: 39.20 }
  };

  // DOM references
  const btnMonthly   = document.getElementById('btn-monthly');
  const btnYearly    = document.getElementById('btn-yearly');
  const toggleTrack  = document.getElementById('toggle-track');
  const billingNote  = document.getElementById('billing-note');

  const priceEls = {
    starter:    document.getElementById('price-starter'),
    pro:        document.getElementById('price-pro'),
    enterprise: document.getElementById('price-enterprise')
  };
  const periodEls = {
    starter:    document.getElementById('period-starter'),
    pro:        document.getElementById('period-pro'),
    enterprise: document.getElementById('period-enterprise')
  };
  const subtextEls = {
    starter:    document.getElementById('subtext-starter'),
    pro:        document.getElementById('subtext-pro'),
    enterprise: document.getElementById('subtext-enterprise')
  };

  let currentCycle = 'monthly'; // default

  /**
   * calculateYearlySavings(monthlyPrice)
   * Returns the dollar amount saved annually with a 20% discount.
   * Formula: 12 * monthlyPrice * 0.20
   */
  function calculateYearlySavings(monthlyPrice) {
    return (12 * monthlyPrice * 0.20).toFixed(2);
  }

  /**
   * updateActiveToggle()
   * Visually reflects the current billing cycle on the toggle buttons and switch.
   */
  function updateActiveToggle() {
    if (currentCycle === 'monthly') {
      btnMonthly.classList.add('active');
      btnMonthly.setAttribute('aria-pressed', 'true');
      btnYearly.classList.remove('active');
      btnYearly.setAttribute('aria-pressed', 'false');
      toggleTrack.classList.remove('yearly');
    } else {
      btnYearly.classList.add('active');
      btnYearly.setAttribute('aria-pressed', 'true');
      btnMonthly.classList.remove('active');
      btnMonthly.setAttribute('aria-pressed', 'false');
      toggleTrack.classList.add('yearly');
    }
  }

  /**
   * updatePrices()
   * Reads the current billing cycle and updates all three pricing cards
   * with the correct dollar amounts, period labels, and savings subtexts.
   */
  function updatePrices() {
    const keys = ['starter', 'pro', 'enterprise'];

    keys.forEach(key => {
      const plan = plans[key];
      const priceEl   = priceEls[key];
      const periodEl  = periodEls[key];
      const subEl     = subtextEls[key];

      if (!priceEl || !periodEl || !subEl) return;

      if (currentCycle === 'monthly') {
        priceEl.textContent   = plan.monthly;
        periodEl.textContent  = '/month';
        subEl.innerHTML       = '&nbsp;'; // No subtext for monthly
      } else {
        // Show effective monthly price when billed yearly
        priceEl.textContent   = plan.yearlyMonthly.toFixed(2);
        periodEl.textContent  = '/mo (billed yearly)';
        const savings = calculateYearlySavings(plan.monthly);
        subEl.textContent     = `Save $${savings}/year`;
      }
    });

    // Update the note below toggle
    if (billingNote) {
      if (currentCycle === 'monthly') {
        billingNote.innerHTML = 'Billed monthly &nbsp;·&nbsp; Cancel anytime';
      } else {
        billingNote.innerHTML = 'Billed annually at 20% off &nbsp;·&nbsp; Cancel anytime';
      }
    }
  }

  /**
   * updateBillingCycle(cycle)
   * Sets the new billing cycle, updates the toggle visual, and refreshes prices.
   */
  function updateBillingCycle(cycle) {
    currentCycle = cycle;
    updateActiveToggle();
    updatePrices();
  }

  /**
   * initializePricing()
   * Attaches event listeners to the billing toggle controls and sets defaults.
   */
  function initializePricing() {
    if (!btnMonthly || !btnYearly || !toggleTrack) return;

    btnMonthly.addEventListener('click', () => updateBillingCycle('monthly'));
    btnYearly.addEventListener('click',  () => updateBillingCycle('yearly'));
    toggleTrack.addEventListener('click', () => {
      updateBillingCycle(currentCycle === 'monthly' ? 'yearly' : 'monthly');
    });

    // Set initial state
    updateBillingCycle('monthly');
  }

  // ============================================================================
  // 3. initializeFAQ() — Accordion
  // ============================================================================
  function initializeFAQ() {
    const faqButtons = document.querySelectorAll('.faq-question');
    if (faqButtons.length === 0) return;

    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        // Close all other items (optional: accordion behaviour)
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            const openAnswer = openItem.querySelector('.faq-answer');
            openAnswer.classList.remove('open');
            openAnswer.setAttribute('hidden', '');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle the clicked item
        if (isOpen) {
          item.classList.remove('open');
          answer.classList.remove('open');
          answer.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          answer.classList.add('open');
          answer.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ============================================================================
  // 4. initializeMobileMenu() — Hamburger Menu
  // ============================================================================
  function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
      const isOpen = hamburger.classList.contains('open');

      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));

      // Lock body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          hamburger.classList.remove('open');
          navMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================================
  // 5. initializeNavigation() — Sticky header, ScrollSpy, Back-to-Top
  // ============================================================================
  function initializeNavigation() {
    const header      = document.getElementById('header');
    const navLinks    = document.querySelectorAll('.nav-link');
    const sections    = document.querySelectorAll('section[id]');
    const backToTop   = document.getElementById('back-to-top');

    const onScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Sticky header style
      if (header) {
        header.classList.toggle('scrolled', scrollY > 50);
      }

      // Back to top visibility
      if (backToTop) {
        backToTop.classList.toggle('visible', scrollY > 400);
      }

      // ScrollSpy — highlight active nav link
      let currentId = '';
      sections.forEach(section => {
        const top    = section.offsetTop - 100;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentId = section.id;
        }
      });

      if (currentId) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial run

    // Back to top click
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = header ? header.offsetHeight : 70;
          const pos    = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ============================================================================
  function initializeScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.feature-card, .pricing-card, .faq-item, .faq-cta-box, .compare-table'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  // ============================================================================
  // BOOT
  // ============================================================================
  updateCopyrightYear();
  initializePricing();
  initializeFAQ();
  initializeMobileMenu();
  initializeNavigation();
  initializeScrollReveal();
});
