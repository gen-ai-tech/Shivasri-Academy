/* ============================================================
   SHIVASHRI ACADEMY - JAVASCRIPT
   - Mobile navigation toggle
   - Active nav link on scroll
   - Testimonials slider with auto-play
   - Scroll reveal animations
   - Enquiry form validation and submission
   ============================================================ */

(function () {
  'use strict';

  /* ===== MOBILE NAVIGATION ===== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });


  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop) {
        currentSection = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ===== SCROLL REVEAL ANIMATIONS ===== */
  const revealElements = document.querySelectorAll(
    '.course-card, .why-card, .about-feature-item, .contact-detail-card, ' +
    '.about-text, .about-lead, .about-body, .about-features, ' +
    '.rating-summary, .testimonial-card, .section-label, ' +
    '.courses-cta, .footer-brand'
  );

  // Add reveal class programmatically
  revealElements.forEach(function (el, i) {
    el.classList.add('reveal');
    // Stagger within parent grid
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(function (c) { return c.classList.contains('reveal'); });
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 5) {
      el.classList.add('reveal-delay-' + idx);
    }
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ===== TESTIMONIALS SLIDER ===== */
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards         = Array.from(track.querySelectorAll('.testimonial-card'));
    let currentIndex    = 0;
    let autoPlayTimer   = null;
    let slidesPerView   = getSlidesPerView();
    let totalSlides     = Math.max(1, cards.length - slidesPerView + 1);

    function getSlidesPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateCardWidths() {
      slidesPerView = getSlidesPerView();
      totalSlides   = Math.max(1, cards.length - slidesPerView + 1);
      const gap     = 24;
      const containerWidth = track.parentElement.offsetWidth;
      const cardWidth = (containerWidth - gap * (slidesPerView - 1)) / slidesPerView;

      cards.forEach(function (card) {
        card.style.width = cardWidth + 'px';
        card.style.flexShrink = '0';
      });
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.dataset.index = i;
        dot.addEventListener('click', function () {
          goToSlide(parseInt(this.dataset.index, 10));
          resetAutoPlay();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.slider-dot').forEach(function (dot, i) {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      const gap     = 24;
      const cardW   = cards[0] ? cards[0].offsetWidth : 0;
      const offset  = currentIndex * (cardW + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
    }

    function next() {
      const newIndex = currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1;
      goToSlide(newIndex);
    }

    function prev() {
      const newIndex = currentIndex - 1 < 0 ? totalSlides - 1 : currentIndex - 1;
      goToSlide(newIndex);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(next, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    prevBtn.addEventListener('click', function () { prev(); resetAutoPlay(); });
    nextBtn.addEventListener('click', function () { next(); resetAutoPlay(); });

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', stopAutoPlay);
    track.parentElement.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        resetAutoPlay();
      }
    }, { passive: true });

    // Keyboard navigation
    track.parentElement.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); resetAutoPlay(); }
      if (e.key === 'ArrowRight') { next(); resetAutoPlay(); }
    });

    // Init
    updateCardWidths();
    buildDots();
    goToSlide(0);
    startAutoPlay();

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateCardWidths();
        buildDots();
        if (currentIndex >= totalSlides) currentIndex = 0;
        goToSlide(currentIndex);
      }, 200);
    });
  }


  /* ===== ENQUIRY FORM ===== */
  const form        = document.getElementById('enquiryForm');
  const successBox  = document.getElementById('formSuccess');

  if (form && successBox) {
    function showError(input, message) {
      input.classList.add('error');
      let errorEl = input.parentElement.querySelector('.form-error-msg');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error-msg';
        errorEl.style.cssText = 'display:block;font-size:0.8125rem;color:#ef4444;margin-top:4px;font-weight:500;';
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    function clearError(input) {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-error-msg');
      if (errorEl) errorEl.remove();
    }

    function validateForm() {
      let valid = true;

      const nameInput  = document.getElementById('fullName');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');

      clearError(nameInput);
      clearError(phoneInput);
      if (emailInput.value.trim()) clearError(emailInput);

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name.');
        valid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters.');
        valid = false;
      }

      if (!phoneInput.value.trim()) {
        showError(phoneInput, 'Please enter your phone number.');
        valid = false;
      } else if (!/^[0-9\s\+\-\(\)]{7,15}$/.test(phoneInput.value.trim())) {
        showError(phoneInput, 'Please enter a valid phone number.');
        valid = false;
      }

      if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        valid = false;
      }

      return valid;
    }

    // Clear error on input
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () { clearError(this); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      const submitBtn = document.getElementById('submitEnquiry');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const nameVal = document.getElementById('fullName').value.trim();
      const phoneVal = document.getElementById('phone').value.trim();
      const courseVal = document.getElementById('course').value.trim();
      const msgVal = document.getElementById('message').value.trim();
      
      let text = `Hello, I would like to enquire about ${courseVal ? courseVal : 'a course'}.\nName: ${nameVal}\nPhone: ${phoneVal}`;
      if (msgVal) text += `\nMessage: ${msgVal}`;
      
      const whatsappUrl = `https://wa.me/919047758203?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
      form.reset();
    });
  }


  /* ===== SMOOTH SCROLL POLYFILL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.site-header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  });


  /* ===== HEADER SCROLL SHADOW ===== */
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) {
      header.style.boxShadow = '0 4px 20px rgba(15,23,42,0.12)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(15,23,42,0.08)';
    }
  }, { passive: true });

  /* ===== FLOATING ACTION BUTTON ===== */
  const fabContainer = document.querySelector('.fab-container');
  const fabToggle = document.getElementById('fabToggle');
  const fabMenu = document.getElementById('fabMenu');

  if (fabToggle && fabMenu && fabContainer) {
    fabToggle.addEventListener('click', function () {
      const isOpen = fabMenu.classList.contains('open');
      if (isOpen) {
        fabMenu.classList.remove('open');
        fabContainer.classList.remove('open');
      } else {
        fabMenu.classList.add('open');
        fabContainer.classList.add('open');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (fabMenu.classList.contains('open') && !fabContainer.contains(e.target)) {
        fabMenu.classList.remove('open');
        fabContainer.classList.remove('open');
      }
    });
  }
})();
