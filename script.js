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


  // --- IntersectionObserver for Nav Link Scroll-Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null, // viewport
    rootMargin: '-30% 0px -60% 0px', // check when element occupies middle third of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));


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
