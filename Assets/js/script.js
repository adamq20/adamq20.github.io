tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#F0F5FF',
                    100: '#E0EBFF',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#2563EB', // Classic Accessible Blue
                    600: '#1D4ED8',
                    900: '#1E3A8A',
                },
                neutral: {
                    50: '#F8FAFC',  // Main background
                    100: '#F1F5F9', // Secondary background
                    200: '#E2E8F0', // Borders
                    800: '#1E293B', // Main Text
                    900: '#0F172A', // Headings
                    950: '#030712', // Ultra Deep Background
                }
            },
            animation: {
                'fade-up': 'fadeUp 0.8s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    }
}


// Dark Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    html.classList.add('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Scroll Spy Logic
const activeClass = ['text-brand-600', 'dark:text-brand-400'];
const inactiveClass = ['text-neutral-500', 'dark:text-neutral-400'];

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');

// Helper to set active link
const setActiveLink = (id) => {
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1); // Remove '#'
        if (href === id) {
            link.classList.add(...activeClass);
            link.classList.remove(...inactiveClass);
        } else {
            link.classList.remove(...activeClass);
            link.classList.add(...inactiveClass);
        }
    });
};

// Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of section is visible
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});


// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');

if (cursor) {
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Smooth movement with requestAnimationFrame
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
    });

    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Show cursor when entering the window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    // Handle hover states
    const interactables = document.querySelectorAll('a, button, [role="button"]');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('scale-110');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('scale-110');
        });
    });

    // Typing Animation Logic
    const cursorText = document.getElementById('cursor-text');

    if (cursorText) {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Morning';
            if (hour < 18) return 'Afternoon';
            return 'Evening';
        };

        const phrases = ['Hola', `Good ${getGreeting()}`, 'Fellas'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        let isHovering = false; // Flag to stop typing when hovering

        const typeEffect = () => {
            // Stop typing loop if hovering or if finished sequence
            if (isHovering) return;

            const currentPhrase = phrases[phraseIndex];

            // If we ran out of phrases, we just clear the last one and stop
            if (!currentPhrase) {
                cursorText.textContent = '';
                cursorText.style.display = 'none'; // Hide badge when empty
                return;
            }

            cursorText.style.display = 'block'; // Ensure visible while typing

            if (isWaiting) {
                // Wait after typing before deleting
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    typeEffect();
                }, 2000); // Wait 2s before deleting
                return;
            }

            if (isDeleting) {
                cursorText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex++; // Move to next phrase
                    // If we finished the last phrase ("Fellas"), phraseIndex will be out of bounds, 
                    // which is handled at the start of next call (stop typing)
                    setTimeout(typeEffect, 500);
                } else {
                    setTimeout(typeEffect, 50);
                }
            } else {
                cursorText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentPhrase.length) {
                    isWaiting = true;
                    typeEffect();
                } else {
                    setTimeout(typeEffect, 100);
                }
            }
        };

        // Start typing
        setTimeout(typeEffect, 500);

        // Hover Logic (Dynamic Text)
        // Specific targets: Buttons, Menu (nav a), Expertise Cards, and Featured Work (articles)
        const hoverElements = document.querySelectorAll('button, [role="button"], nav a, #expertise .grid > div, #work article');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                isHovering = true;
                cursor.classList.add('scale-110');
                cursorText.style.display = 'block';

                // Determine text based on element type
                let text = '';

                if (el.matches('#expertise .grid > div')) {
                    // For Expertise Cards, grabbing the title (h4)
                    const title = el.querySelector('h4');
                    text = title ? title.innerText : 'Expertise';
                } else if (el.tagName === 'ARTICLE') {
                    // For Featured Work, grabbing the title (h3)
                    const title = el.querySelector('h3');
                    text = title ? title.innerText : 'View Case';
                } else {
                    // For buttons and links
                    text = el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '';
                }

                // Clean up text
                text = text.split('\n')[0].trim().substring(0, 50);

                if (text) {
                    if (el.tagName === 'A' && text.toLowerCase().includes('mail')) text = 'Send Email';
                    cursorText.textContent = text;
                } else {
                    cursorText.textContent = 'View';
                }
            });

            el.addEventListener('mouseleave', () => {
                isHovering = false;
                cursor.classList.remove('scale-110');
                cursorText.textContent = ''; // Clear text
                // If the opening sequence finished, keep it hidden. 
                // If it was interrupted, we technically could resume, but simpler to just leave it empty 
                // or restart the loop if desired. For now, let's keep it clean.
                if (phraseIndex >= phrases.length) {
                    cursorText.style.display = 'none';
                } else {
                    // Resume typing if interrupted? Or just let it stay cleared.
                    // Let's just hide it to be safe and clean.
                    cursorText.style.display = 'none';
                }
            });
        });
    }
}
