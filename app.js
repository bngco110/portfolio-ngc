/* ==========================================================================
   NGOC NGUYEN - UI/UX DESIGNER PORTFOLIO INTERACTIVE LOGIC
   Built on Minimalist Web System Design Tokens
   ========================================================================== */

/* ------------------------------------------------------------------------
   Global Handlers for "View More" & "View Less" In-Place Expansion
   ------------------------------------------------------------------------ */
window.handleViewMoreProjects = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const extraCards = document.querySelectorAll('.project-card-extra');
  const viewMoreBtn = document.getElementById('viewMoreProjectsBtn');
  const viewLessBtn = document.getElementById('viewLessProjectsBtn');

  extraCards.forEach(card => {
    card.classList.add('is-visible');
    card.style.display = 'flex';
  });

  if (viewMoreBtn) viewMoreBtn.style.display = 'none';
  if (viewLessBtn) {
    viewLessBtn.style.display = 'inline-flex';
    viewLessBtn.style.animation = 'ctaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  }
};

window.handleViewLessProjects = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const extraCards = document.querySelectorAll('.project-card-extra');
  const viewMoreBtn = document.getElementById('viewMoreProjectsBtn');
  const viewLessBtn = document.getElementById('viewLessProjectsBtn');

  extraCards.forEach(card => {
    card.classList.remove('is-visible');
    card.style.display = 'none';
  });

  if (viewLessBtn) viewLessBtn.style.display = 'none';
  if (viewMoreBtn) {
    viewMoreBtn.style.display = 'inline-flex';
    viewMoreBtn.style.animation = 'ctaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  }

  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function initApp() {

  /* ------------------------------------------------------------------------
     1. Toast Notification System
     ------------------------------------------------------------------------ */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid fa-check-circle" style="color: var(--color-brand-primary);"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     2. Custom Floating "View More" Cursor Follower for Product Cards
     ------------------------------------------------------------------------ */
  const cursorFollower = document.getElementById('view-more-cursor');

  if (cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let isTicking = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isTicking) {
        requestAnimationFrame(() => {
          cursorFollower.style.left = `${mouseX}px`;
          cursorFollower.style.top = `${mouseY}px`;
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });

    // Delegated hover handler for all product cards (including dynamically revealed cards)
    document.addEventListener('mouseover', (e) => {
      const modal = document.getElementById('project-detail-modal');
      if (modal && modal.classList.contains('is-active')) {
        cursorFollower.classList.remove('active');
        return;
      }
      if (e.target.closest('.project-card-interactive')) {
        cursorFollower.classList.add('active');
      } else {
        cursorFollower.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Header Glassmorphism on Scroll & Active ScrollSpy Navigation
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header') || document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Header Frosted Glass Effect
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // ScrollSpy Navigation
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}` || link.getAttribute('href') === `index.html#${currentId}`) {
          link.classList.add('active');
        }
      });
    }

    // Hero Avatar Physical Dimension Expansion on Scroll
    updateHeroAvatarSize();
  }

  /* ------------------------------------------------------------------------
     3a. Mobile Hamburger Menu & Drawer Toggle
     Replaces 3 header navigation texts with an animated hamburger button on
     mobile. Tapping opens a sleek slide-down drawer with Home, My projects,
     and About me.
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    if (!hamburgerBtn || !mobileNavDrawer) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!hamburgerBtn || !mobileNavDrawer) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.remove('is-open');
    }
    // Only clear overflow if project detail modal isn't open
    const modal = document.getElementById('project-detail-modal');
    if (!modal || !modal.classList.contains('is-active')) {
      document.body.style.overflow = '';
    }
  }

  function toggleMobileNav() {
    if (!mobileNavDrawer) return;
    const isOpen = mobileNavDrawer.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', () => {
      closeMobileNav();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileNav();
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     3b. Header Brand Logo & Home Link Smooth Scroll to Hero (Negative Space View)
     When clicking the BNG brand logo or Home nav link, smoothly scroll to top: 0
     so only the hero section with its negative space fills the viewport.
     ------------------------------------------------------------------------ */
  const homeTriggers = document.querySelectorAll('.brand-logo, a[href="#home"], a[href="index.html#home"]');
  homeTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const isIndexPage = window.location.pathname.endsWith('index.html') ||
                          window.location.pathname === '/' ||
                          !window.location.pathname.includes('.html');
      if (isIndexPage) {
        e.preventDefault();
        closeMobileNav();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, '#home');
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     3c. Hero Avatar Physical Size Expansion on Scroll
     As user scrolls down through the hero section, the physical dimensions
     of the photo frame gradually enlarge (from 400px to 520px) WITHOUT
     cropping or zooming into the image. Text 'Ngoc Nguyen' (56px) and right
     column stay completely unchanged in size.
     ------------------------------------------------------------------------ */
  const heroAvatarFrame = document.querySelector('.hero-avatar-frame');
  const heroAvatarImg = document.getElementById('hero-avatar-img');
  const heroSection = document.getElementById('home');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cachedHeroHeight = 0;
  function getHeroHeight() {
    if (!cachedHeroHeight && heroSection) {
      cachedHeroHeight = heroSection.offsetHeight || 480;
    }
    return cachedHeroHeight || 480;
  }
  window.addEventListener('resize', () => {
    cachedHeroHeight = 0;
  }, { passive: true });

  function updateHeroAvatarSize() {
    if (!heroAvatarFrame || !heroSection || prefersReducedMotion) return;

    // On mobile devices (<= 767px), maintain full responsive width without fixed pixel forcing
    if (window.innerWidth <= 767) {
      heroAvatarFrame.style.width = '100%';
      return;
    }

    // Ensure inner image is never cropped or zoomed
    if (heroAvatarImg && heroAvatarImg.style.transform) {
      heroAvatarImg.style.transform = '';
    }

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const heroHeight = getHeroHeight();
    const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

    // Expand width from 400px up to 520px (proportionally scaling 4:3 height)
    const parentWidth = heroAvatarFrame.parentElement ? heroAvatarFrame.parentElement.offsetWidth : 520;
    const maxTarget = Math.min(520, parentWidth);
    const minTarget = Math.min(400, maxTarget * 0.77);
    const currentWidth = minTarget + (progress * (maxTarget - minTarget));

    heroAvatarFrame.style.width = `${currentWidth.toFixed(1)}px`;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     4. Accordion Toggle for About Me Sub-sections
     ------------------------------------------------------------------------ */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = header.closest('.accordion-item') || header.parentElement;
      const body = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const icon = header.querySelector('.accordion-icon') || header.querySelector('.accordion-chevron');
      
      if (isExpanded) {
        // Collapse: switch to plus icon (+)
        header.setAttribute('aria-expanded', 'false');
        header.classList.add('collapsed');
        if (body) body.classList.add('collapsed');
        if (parentItem) {
          parentItem.classList.add('is-collapsed');
          parentItem.classList.remove('is-expanded');
        }
        if (icon) {
          icon.classList.remove('fa-minus');
          icon.classList.add('fa-plus');
        }
      } else {
        // Expand: switch to minus icon (-)
        header.setAttribute('aria-expanded', 'true');
        header.classList.remove('collapsed');
        if (body) body.classList.remove('collapsed');
        if (parentItem) {
          parentItem.classList.remove('is-collapsed');
          parentItem.classList.add('is-expanded');
        }
        if (icon) {
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
        }
      }
    });
  });

  // Allow clicking anywhere on accordion item row (including the line) to toggle
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const body = item.querySelector('.accordion-body');
      if (body && body.contains(e.target)) return;
      const header = item.querySelector('.accordion-header');
      if (header && !header.contains(e.target)) {
        header.click();
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Scroll Reveal Motion for My Projects Title & Product Cards
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '0px 0px 60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Immediately reveal elements that are already within initial viewport
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        }
      });
    }, 100);
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ------------------------------------------------------------------------
     6. "View More" & "View Less" Projects In-Place Expansion
        (Initially 4 cards. Clicking "View more" displays 6 extra cards and swaps to "View less".
         Clicking "View less" collapses back to 4 cards and swaps back to "View more".)
     ------------------------------------------------------------------------ */
  const viewMoreBtn = document.getElementById('viewMoreProjectsBtn');
  const viewLessBtn = document.getElementById('viewLessProjectsBtn');

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', window.handleViewMoreProjects);
  }
  if (viewLessBtn) {
    viewLessBtn.addEventListener('click', window.handleViewLessProjects);
  }

  /* ------------------------------------------------------------------------
     7. Project Detail Lightbox Modal (Click Product Card 1 to View Case Study)
     ------------------------------------------------------------------------ */
  const projectModal = document.getElementById('project-detail-modal');
  const projectModalImg = document.getElementById('project-modal-img');
  const projectModalClose = document.querySelector('.project-modal-close');
  const card1Fanidol = document.getElementById('project-card-fanidol');

  function openProjectModal(imgSrc, altText) {
    if (!projectModal) return;

    // 1. Immediately reset scroll position to the very top (đầu hình ảnh)
    projectModal.scrollTop = 0;

    if (projectModalImg && imgSrc) {
      projectModalImg.src = imgSrc;
      if (altText) projectModalImg.alt = altText;

      // When image asset finishes loading, guarantee scroll remains locked to the top
      projectModalImg.onload = function() {
        if (projectModal) {
          projectModal.scrollTop = 0;
        }
      };
    }

    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (cursorFollower) cursorFollower.classList.remove('active');

    // 2. Double-ensure scroll position is at the very top across render ticks
    projectModal.scrollTop = 0;
    requestAnimationFrame(() => {
      if (projectModal) {
        projectModal.scrollTop = 0;
        requestAnimationFrame(() => {
          if (projectModal) projectModal.scrollTop = 0;
        });
      }
    });
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Reset scroll to top on close so the next modal opened always starts at the top
    projectModal.scrollTop = 0;
  }

  // Click on any interactive product card to view enlarged image / case study detail
  const modalCards = document.querySelectorAll('.project-card-interactive');
  modalCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = card.getAttribute('data-modal-image') || (card.querySelector('img') ? card.querySelector('img').src : null);
      const titleEl = card.querySelector('h3');
      const cardTitle = titleEl ? titleEl.textContent.trim() : 'Project';
      if (imgSrc) {
        openProjectModal(imgSrc, `${cardTitle} — Case Study Detail`);
      }
    });
  });

  // Click on close button
  if (projectModalClose) {
    projectModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProjectModal();
    });
  }

  // Click on backdrop / overlay outside modal content to close
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (!e.target.closest('.project-modal-content')) {
        closeProjectModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
      closeProjectModal();
    }
  });

}

// Initialize immediately if DOM is already ready, or wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


