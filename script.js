/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Profile Avatar System with Persistent LocalStorage ---
  const profileDisplay = document.getElementById('profileDisplay');
  const imageUpload = document.getElementById('imageUpload');
  const avatarIcon = document.getElementById('avatar-icon');

  // Load avatar from localStorage if available
  const storedAvatar = localStorage.getItem('julius_portfolio_avatar');
  if (storedAvatar) {
    applyProfileImage(storedAvatar);
  }

  // Handle avatar upload change event
  if (imageUpload) {
    imageUpload.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        // Enforce a generous is-web-safe maximum size of 2.5MB to save Storage quota
        if (file.size > 2.5 * 1024 * 1024) {
          alert('Image size is too large (must be under 2.5MB). Please select a smaller photo.');
          imageUpload.value = ''; // Reset input
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          
          // Persist securely in browser state
          try {
            localStorage.setItem('julius_portfolio_avatar', base64String);
            applyProfileImage(base64String);
          } catch (storageError) {
            console.error('LocalStorage storage quota exceeded:', storageError);
            // Fallback: apply directly to UI even if localStorage is full
            applyProfileImage(base64String);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Helper function to apply the Base64 image to the profile avatar container
   * @param {string} dataUrl Base64 string representing the uploaded photo
   */
  function applyProfileImage(dataUrl) {
    if (profileDisplay) {
      profileDisplay.style.backgroundImage = `url("${dataUrl}")`;
      profileDisplay.style.backgroundSize = 'cover';
      profileDisplay.style.backgroundPosition = 'center';
      profileDisplay.style.backgroundRepeat = 'no-repeat';
    }
    // Hide standard user-astronaut font icon
    if (avatarIcon) {
      avatarIcon.style.display = 'none';
    }
  }


  // --- Sticky Navigation Scroll Background Change ---
  const navBar = document.getElementById('nav-bar');
  const stickyNavOffset = 80;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navBar?.classList.add('shadow-scrolled');
    } else {
      navBar?.classList.remove('shadow-scrolled');
    }
  });


  // --- Scroll-Based Highlight for Navigation Links ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    let currentSectionId = '';
    // Use an offset buffer matching the sticky header height
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Handle bottom of page edge case: activate the final section (contact)
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 30) {
      if (sections.length > 0) {
        currentSectionId = sections[sections.length - 1].getAttribute('id');
      }
    }

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Bind to scroll events and call immediately on load
  window.addEventListener('scroll', highlightNavOnScroll);
  highlightNavOnScroll();


  // --- Persistent Light / Dark Mode Toggle ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Retrieve existing selection or match system preference defaults
  const storedTheme = localStorage.getItem('julius_portfolio_theme');
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (userPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      // Persist set preferences
      localStorage.setItem('julius_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleIcon) {
      if (theme === 'dark') {
        themeToggleIcon.className = 'fa-solid fa-sun';
      } else {
        themeToggleIcon.className = 'fa-solid fa-moon';
      }
    }
  }


  // --- Scroll-Triggered Fade-In Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('.card-wrapper, .project-card, .skills-grid > *');
  
  // Progressively add the scroll-animate class to target elements to keep layout clean if standard JS fails
  animatedElements.forEach(el => {
    el.classList.add('scroll-animate');
  });

  const animObserverOptions = {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% of the element is visible
    rootMargin: '0px 0px -40px 0px' // slightly buffer before it enters the screen
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to trigger the animation transition exactly once per load
        observer.unobserve(entry.target);
      }
    });
  }, animObserverOptions);

  animatedElements.forEach(el => {
    animObserver.observe(el);
  });


  // --- Defensive Target Link Quality Assurance (External Opens) ---
  // Ensure all outbound anchors automatically conform with target="_blank" and secure referrers
  const allAnchors = document.querySelectorAll('a[href]');
  allAnchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:'))) {
      anchor.setAttribute('target', '_blank');
      // Adding rel="noopener" protects browser process context
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
