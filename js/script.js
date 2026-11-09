/**
 * ==============================================================================
 * PORTFOLIO JAVASCRIPT - ELUMALAI M
 * AI & Data Science Student | Python Developer | Aspiring AI/ML Engineer
 * Pure Vanilla JavaScript (ES6+) - Accessible, Responsive, Performant
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. DYNAMIC YEAR & TYPEWRITER EFFECT
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Typewriter effect for Hero subtitle
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const roles = [
      'AI & Data Science Student',
      'Python Developer',
      'Aspiring AI/ML Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeCycle = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at the end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeCycle, typingSpeed);
    };

    // Start typing after initial load
    setTimeout(typeCycle, 1200);
  }

  // ----------------------------------------------------------------------------
  // 2. STICKY HEADER & SCROLL SPY (ACTIVE NAV LINK)
  // ----------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollState = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header background elevation
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating Back to Top Button visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy: Highlight current active section
    let currentSectionId = '';
    const headerOffset = 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState(); // Initial check

  // Back to Top button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION MENU (HAMBURGER)
  // ----------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : navToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      navToggle.setAttribute('aria-expanded', String(newState));
      if (newState) {
        navToggle.classList.add('open');
        navMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      } else {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 4. SMOOTH SCROLLING FOR INTERNAL ANCHORS
  // ----------------------------------------------------------------------------
  const internalAnchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  internalAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus to section for accessibility
        targetElem.setAttribute('tabindex', '-1');
        targetElem.focus({ preventScroll: true });
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 5. PROJECT CATEGORY FILTERING
  // ----------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active tab button
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const selectedFilter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ----------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Collect elements to animate
    const animateTargets = document.querySelectorAll(
      '.narrative-card, .info-card, .skill-category-card, .project-card, .timeline-content, .cert-card, .achievement-card, .contact-item-card, .form-wrapper-card'
    );

    animateTargets.forEach(el => {
      el.classList.add('reveal-fade-up');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animateTargets.forEach(el => revealObserver.observe(el));
  }

  // ----------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // ----------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, iconClass = 'fa-solid fa-circle-check') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}" style="color: var(--color-cyan);" aria-hidden="true"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // ----------------------------------------------------------------------------
  // 8. COPY EMAIL TO CLIPBOARD
  // ----------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddress = document.getElementById('email-address');

  if (copyEmailBtn && emailAddress) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailAddress.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
        const tooltip = copyEmailBtn.querySelector('.tooltip');
        if (tooltip) {
          const originalText = tooltip.textContent;
          tooltip.textContent = 'Copied!';
          setTimeout(() => {
            tooltip.textContent = originalText;
          }, 2000);
        }
      }).catch(() => {
        showToast('Failed to copy email.', 'fa-solid fa-triangle-exclamation');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 9. MODAL DIALOG CONTROLLER (FOR REPO, DEMO & CREDENTIAL PREVIEWS)
  // ----------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalActionClose = document.getElementById('modal-action-close');

  const openModal = (title, contentHtml) => {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalActionClose) modalActionClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Project Info Details Buttons
  const demoButtons = document.querySelectorAll('.demo-info-btn');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Project Information';
      const notes = btn.getAttribute('data-notes') || 'Project developed by Elumalai M.';

      const content = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <p><strong>Overview:</strong></p>
          <p>${notes}</p>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 8px;">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              <i class="fa-solid fa-code-fork" style="color: var(--color-cyan); margin-right: 6px;"></i>
              <strong>Code Repository Status:</strong>
            </p>
            <p style="font-size: 0.85rem; margin-bottom: 0.5rem;">
              The GitHub repository for this project is linked to Elumalai's profile. You can inspect the source code, implementation details, and documentation in the linked repository.
            </p>
            <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0;">
              <em>Note for Evaluators: To view local live demos or database schemas, refer to the project documentation in the repository or get in touch via email.</em>
            </p>
          </div>
        </div>
      `;
      openModal(title, content);
    });
  });

  // Certificate Preview Buttons
  const viewCertButtons = document.querySelectorAll('.view-cert-btn');
  viewCertButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-cert-title') || 'Certificate Credential';
      const issuer = btn.getAttribute('data-cert-issuer') || 'Accredited Institution';
      const desc = btn.getAttribute('data-cert-desc') || 'Verified credential.';

      const content = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="text-align: center; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid var(--border-subtle);">
            <img src="assets/certificates/certificate-placeholder.svg" alt="${title}" style="max-height: 220px; margin: 0 auto; border-radius: 8px;">
          </div>
          <div>
            <h4 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 0.35rem;">${title}</h4>
            <p style="color: var(--color-cyan); font-size: 0.875rem; margin-bottom: 0.75rem;"><strong>Issued by:</strong> ${issuer}</p>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${desc}</p>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            Official certificate verification ID and soft copies are available on request for placement and evaluation purposes.
          </div>
        </div>
      `;
      openModal(title, content);
    });
  });

  // ----------------------------------------------------------------------------
  // 10. CONTACT FORM VALIDATION & INTERACTION
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const subjectInput = document.getElementById('user-subject');
    const messageInput = document.getElementById('user-message');

    const validateField = (input, validatorFn) => {
      const parent = input.closest('.form-group');
      const isValid = validatorFn(input.value.trim());
      if (!isValid) {
        parent.classList.add('has-error');
        input.classList.add('is-invalid');
        return false;
      } else {
        parent.classList.remove('has-error');
        input.classList.remove('is-invalid');
        return true;
      }
    };

    // Live validation on blur
    if (nameInput) {
      nameInput.addEventListener('blur', () => validateField(nameInput, val => val.length >= 2));
    }
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      });
    }
    if (subjectInput) {
      subjectInput.addEventListener('blur', () => validateField(subjectInput, val => val.length >= 3));
    }
    if (messageInput) {
      messageInput.addEventListener('blur', () => validateField(messageInput, val => val.length >= 10));
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, val => val.length >= 2);
      const isEmailValid = validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      const isSubjectValid = validateField(subjectInput, val => val.length >= 3);
      const isMessageValid = validateField(messageInput, val => val.length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const userName = nameInput.value.trim();
        const userEmail = emailInput.value.trim();
        const userSubject = subjectInput.value.trim();
        const userMsg = messageInput.value.trim();

        // Honest client-side demonstration: Display confirmation and trigger pre-filled mailto
        const recipientEmail = 'vgpelumalai2007@gmail.com';
        const mailtoUri = `mailto:${recipientEmail}?subject=${encodeURIComponent(userSubject)}&body=${encodeURIComponent(`From: ${userName} (${userEmail})\n\nMessage:\n${userMsg}`)}`;

        if (formFeedback) {
          formFeedback.className = 'form-feedback-banner success';
          formFeedback.innerHTML = `
            <i class="fa-solid fa-circle-check" aria-hidden="true" style="color: var(--color-emerald); font-size: 1.25rem;"></i>
            <div>
              <strong>Form Validated Successfully!</strong>
              <p style="margin: 4px 0 0 0; font-size: 0.85rem;">
                Opening your email client to deliver message directly to <strong>${recipientEmail}</strong>.
              </p>
            </div>
          `;
          formFeedback.style.display = 'flex';
        }

        showToast('Message validated! Opening email client...');

        // Launch mail client smoothly
        setTimeout(() => {
          window.location.href = mailtoUri;
        }, 800);

        contactForm.reset();
      } else {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-banner error';
          formFeedback.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true" style="color: var(--color-rose); font-size: 1.25rem;"></i>
            <div>
              <strong>Please check required fields</strong>
              <p style="margin: 4px 0 0 0; font-size: 0.85rem;">Make sure all fields are filled with valid details before sending.</p>
            </div>
          `;
          formFeedback.style.display = 'flex';
        }
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 11. SUBTLE KEYBOARD ACCESSIBILITY LOGIC
  // ----------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // Focus visible indicator helper
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  window.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
});
