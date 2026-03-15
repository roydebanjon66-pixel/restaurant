/* ==========================================================
   FLAME & SKEWER — JavaScript
   Interactive features, smooth scrolling, animations
   
   TABLE OF CONTENTS:
   1. Sticky Navbar (scroll effect)
   2. Mobile Menu Toggle
   3. Smooth Anchor Scrolling
   4. Menu Category Filtering
   5. Scroll-Reveal Animations
   6. Ember Particles (Hero Section)
   7. Active Nav Link Highlighting
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ────────────────────────────────────────────────────────
    // 1. STICKY NAVBAR
    // Makes navbar background solid when user scrolls down.
    // The "scrolled" class is toggled on the <nav> element.
    // Styling for .navbar.scrolled is in style.css
    // ────────────────────────────────────────────────────────

    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        // When user scrolls more than 60px, add "scrolled" class
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Using { passive: true } for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });


    // ────────────────────────────────────────────────────────
    // 2. MOBILE MENU TOGGLE
    // Opens/closes the full-screen mobile navigation menu.
    // The hamburger button transforms into an X when open.
    // Body scroll is locked when menu is open.
    // ────────────────────────────────────────────────────────

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Only run if hamburger exists on the page
    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', () => {
            // Toggle "active" class on hamburger (changes to X shape)
            hamburger.classList.toggle('active');
            // Toggle "mobile-open" class on nav-links (shows full-screen menu)
            navLinks.classList.toggle('mobile-open');
            // Lock/unlock body scroll
            document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
        });

        // Close mobile menu when any link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });
        });
    }


    // ────────────────────────────────────────────────────────
    // 3. SMOOTH ANCHOR SCROLLING
    // When clicking a link like href="#menu", smoothly
    // scrolls to that section instead of jumping.
    // Accounts for the fixed navbar height.
    // ────────────────────────────────────────────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if href is just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            // Calculate scroll position minus navbar height
            const navHeight = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    // ────────────────────────────────────────────────────────
    // 4. MENU CATEGORY FILTERING
    // Tab buttons filter menu items by category.
    // Each .mtab button has a data-cat attribute.
    // Each .menu-row has a data-category attribute.
    // When a tab is clicked, only matching items are shown.
    //
    // HOW TO ADD NEW CATEGORIES:
    // 1. Add a new <button class="mtab" data-cat="newcat">
    // 2. Add data-category="newcat" to matching menu-row elements
    // ────────────────────────────────────────────────────────

    const tabBtns = document.querySelectorAll('.mtab');
    const menuRows = document.querySelectorAll('.menu-row');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove "active" from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add "active" to clicked tab
            btn.classList.add('active');

            // Get filter category from button's data attribute
            const cat = btn.getAttribute('data-cat');

            menuRows.forEach(row => {
                const rowCat = row.getAttribute('data-category');

                if (cat === 'all' || cat === rowCat) {
                    // Show matching items
                    row.style.display = '';
                    // Add fade-in animation
                    row.style.opacity = '0';
                    row.style.transform = 'translateY(10px)';
                    requestAnimationFrame(() => {
                        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        row.style.opacity = '1';
                        row.style.transform = 'translateY(0)';
                    });
                } else {
                    // Hide non-matching items
                    row.style.display = 'none';
                }
            });
        });
    });


    // ────────────────────────────────────────────────────────
    // 5. SCROLL-REVEAL ANIMATIONS
    // Elements with [data-aos] attribute start hidden
    // and animate into view when scrolled into viewport.
    // Uses IntersectionObserver for performance.
    //
    // HOW TO USE:
    // Add data-aos to any element to make it fade-in on scroll.
    // Example: <div class="kebab-card" data-aos>
    // ────────────────────────────────────────────────────────

    const revealElements = document.querySelectorAll('[data-aos]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add "revealed" class to trigger CSS animation
                entry.target.classList.add('revealed');
                // Stop observing once revealed (animates only once)
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,          // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Offset from bottom of viewport
    });

    // Observe all elements with data-aos attribute
    revealElements.forEach(el => revealObserver.observe(el));


    // ────────────────────────────────────────────────────────
    // 6. EMBER PARTICLES (Hero Section Only)
    // Creates floating fire ember particles that rise up
    // from the bottom of the hero section.
    // Only runs if ember-container exists (index.html only).
    //
    // TO CUSTOMIZE:
    // - Change colors in the 'colors' array below
    // - Change spawn rate: change setInterval timing
    // - Change particle count: change loop count in spawnEmbers()
    // - Change particle size: change size calculation
    // ────────────────────────────────────────────────────────

    const emberContainer = document.getElementById('ember-container');

    if (emberContainer) {
        // Create a single ember particle
        function createEmber() {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            // Random horizontal position (0% to 100%)
            const x = Math.random() * 100;
            // Random size between 2px and 6px
            const size = Math.random() * 4 + 2;
            // Random animation duration (3 to 7 seconds)
            const duration = Math.random() * 4 + 3;
            // Random delay before starting (0 to 3 seconds)
            const delay = Math.random() * 3;

            ember.style.left = `${x}%`;
            ember.style.bottom = '0';
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.animationDuration = `${duration}s`;
            ember.style.animationDelay = `${delay}s`;

            // Random ember colors — change these to customize
            const colors = ['#ff5722', '#ff8a65', '#ffb300', '#d32f2f', '#ff6e40'];
            ember.style.background = colors[Math.floor(Math.random() * colors.length)];

            emberContainer.appendChild(ember);

            // Remove ember from DOM after animation completes
            setTimeout(() => {
                if (ember.parentNode) {
                    ember.remove();
                }
            }, (duration + delay) * 1000);
        }

        // Spawn multiple embers at once
        function spawnEmbers() {
            // Create 3 embers per interval — change this number for more/less
            for (let i = 0; i < 3; i++) {
                createEmber();
            }
        }

        // Initial burst of embers
        spawnEmbers();

        // Keep spawning embers every 800ms
        // Change 800 to a smaller number for more embers, larger for less
        setInterval(spawnEmbers, 800);
    }


    // ────────────────────────────────────────────────────────
    // 7. ACTIVE NAV LINK HIGHLIGHTING (for single-page sections)
    // Highlights the current nav link as user scrolls
    // through different sections on the page.
    // Uses IntersectionObserver for performance.
    // ────────────────────────────────────────────────────────

    const sections = document.querySelectorAll('section[id], header[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    // Check both hash-based links (#menu) and page-based links (menu.html)
                    allNavLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                        } else if (!href.startsWith('#') && !href.includes('.html')) {
                            // Don't remove active from page links
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

});
