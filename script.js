/**
 * Julius Ochieng — Developer Portfolio Main Script
 * Handles responsive mobile menu toggles, scrolling navbar aesthetics,
 * contact form submissions, and the asynchronous data modal detail viewer.
 */

// Synchronously apply theme before DOMContentLoaded to prevent style flashes
(function preApplyTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const currentTheme = savedTheme || (systemPrefersLight ? "light" : "dark");
  if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initNavbarScroll();
  initProjectModal();
  initContactForm();
  initActiveNavHighlight();
  initProficiencyBars();
  initScrollProgressBar();
});

/**
 * Mobile Navbar hamburger menu toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.classList.contains("active");
    
    // Toggle active classes
    toggleBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    
    // Update Accessibility tags
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
  });

  // Close menu when clicking on any navigation link
  const navLinks = navMenu.querySelectorAll(".nav-link, .nav-cta-btn");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("active");
      navMenu.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking anywhere outside of navbar or menu
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleBtn.classList.remove("active");
      navMenu.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Aesthetic scrolling state feedback for sticky headers
 */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const scrollThreshold = 50;

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });
}

/**
 * Interactive preview detail modal using semantic HTML data-attributes
 */
function initProjectModal() {
  const modalOverlay = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  
  if (!modalOverlay || !modalClose) return;

  // Elements to populate within the modal
  const mTitle = document.getElementById("modal-project-title");
  const mSubtitle = document.getElementById("modal-project-subtitle");
  const mTagsContainer = document.getElementById("modal-project-tags");
  const mDesc = document.getElementById("modal-project-desc");
  const mAchievement = document.getElementById("modal-project-achievement");

  // Query all project cards
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach(card => {
    card.addEventListener("click", (e) => {
      // Prevent running if someone clicked a link within the footer of the card directly
      if (e.target.closest("a")) return;

      // Extract details from data elements
      const title = card.getAttribute("data-title") || "";
      const subtitle = card.getAttribute("data-subtitle") || "";
      const rawTags = card.getAttribute("data-tags") || "";
      const desc = card.getAttribute("data-desc") || "";
      const achievement = card.getAttribute("data-achievement") || "";

      // Populate content
      if (mTitle) mTitle.textContent = title;
      if (mSubtitle) mSubtitle.textContent = subtitle;
      if (mDesc) mDesc.textContent = desc;
      if (mAchievement) mAchievement.textContent = achievement;

      // Split and construct tech tags
      if (mTagsContainer) {
        mTagsContainer.innerHTML = "";
        const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);
        tags.forEach(tag => {
          const pill = document.createElement("span");
          pill.className = "tag-pill";
          pill.textContent = tag;
          mTagsContainer.appendChild(pill);
        });
      }

      // Show modal window with a smooth active toggle transition
      modalOverlay.style.display = "flex";
      // Reflow triggering to allow transition
      modalOverlay.offsetHeight;
      modalOverlay.classList.add("active");
      modalOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent background content scroll
    });
  });

  // Modal closure helpers
  const closeModal = () => {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Clear display after transition has ended (300ms)
    setTimeout(() => {
      modalOverlay.style.display = "none";
    }, 300);
  };

  modalClose.addEventListener("click", closeModal);

  // Close when clicking layout gray space outside the modal window
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * Handle fully functional simulation of structured contact form submission
 */
function initContactForm() {
  const form = document.getElementById("portfolio-contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-button");

  if (!form || !formStatus) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Visual loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin icon-right"></i>`;
    }

    const nameVal = document.getElementById("form-name")?.value || "";
    const emailVal = document.getElementById("form-email")?.value || "";
    const subjectVal = document.getElementById("form-subject")?.value || "";
    const msgVal = document.getElementById("form-message")?.value || "";

    // Simulate async submission request
    setTimeout(() => {
      // Re-enable and reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane icon-right"></i>`;
      }

      // Validate inputs
      if (!nameVal || !emailVal || !subjectVal || !msgVal) {
        formStatus.textContent = "Please fill in all requested fields.";
        formStatus.className = "form-status-msg error";
        return;
      }

      // Display successful status message
      formStatus.textContent = `Thank you, ${nameVal}! Julius has received your request regarding "${subjectVal}" and will respond within 24 hours.`;
      formStatus.className = "form-status-msg success";

      // Reset fields
      form.reset();

      // Clear successful state after 8 seconds
      setTimeout(() => {
        formStatus.className = "form-status-msg";
        formStatus.textContent = "";
      }, 8000);

    }, 1500);
  });
}

/**
 * Highlights current active layout section in scroll view
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPosition = window.scrollY + 120; // offset match for sticky headers

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.clientHeight;
      if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/**
 * Handle user choice in light/dark theme toggling
 * Updates UI icons dynamically and commits configuration to localStorage
 */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  const themeIcon = themeToggleBtn.querySelector("i");
  const root = document.documentElement;

  // Sync toggle button icon state to match the preApplied setting
  const isCurrentlyLight = root.getAttribute("data-theme") === "light";
  if (themeIcon) {
    themeIcon.className = isCurrentlyLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  // Handle active theme toggle event
  themeToggleBtn.addEventListener("click", () => {
    const isLightNow = root.getAttribute("data-theme") === "light";
    const nextTheme = isLightNow ? "dark" : "light";

    if (nextTheme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeIcon) {
        themeIcon.className = "fa-solid fa-sun";
      }
    } else {
      root.removeAttribute("data-theme");
      if (themeIcon) {
        themeIcon.className = "fa-solid fa-moon";
      }
    }
    
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

/**
 * Animated service card proficiency indicators using Intersection Observer.
 * When the 'service-proficiency' wrapper comes into view,
 * animate the bar's width and count the percentage text up to its target.
 */
function initProficiencyBars() {
  const proficiencySections = document.querySelectorAll(".service-proficiency");
  if (!proficiencySections.length) return;

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const bar = section.querySelector(".proficiency-bar");
        const pctEl = section.querySelector(".proficiency-pct");
        
        if (bar) {
          const targetPct = bar.getAttribute("data-target");
          bar.style.width = targetPct + "%";
          
          if (pctEl) {
            let start = 0;
            const end = parseInt(targetPct, 10) || 0;
            const duration = 1000; // ms
            const startTime = performance.now();

            const animateNumber = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(progress * (end - start) + start);
              pctEl.textContent = current + "%";

              if (progress < 1) {
                requestAnimationFrame(animateNumber);
              } else {
                pctEl.textContent = end + "%";
              }
            };
            requestAnimationFrame(animateNumber);
          }
        }
        
        // Stop observing once animated
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -20px 0px"
  });

  proficiencySections.forEach(sec => {
    animationObserver.observe(sec);
  });
}

/**
 * Handles the calculation and visual rendering of the scroll progress bar
 * at the top of the screen to indicate reading progress.
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById("scroll-progress-bar");
  if (!progressBar) return;

  const updateProgressBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    let scrollPercentage = 0;
    if (scrollHeight > 0) {
      scrollPercentage = (scrollTop / scrollHeight) * 100;
    }
    
    // Bounds check to stay 0-100
    scrollPercentage = Math.min(Math.max(scrollPercentage, 0), 100);
    progressBar.style.width = `${scrollPercentage}%`;
  };

  window.addEventListener("scroll", updateProgressBar, { passive: true });
  // Initial fill check
  updateProgressBar();
}

