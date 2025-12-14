// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('fade-out');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav);

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on initial load

    // Terminal typing effect
    const typingText = document.getElementById('typing-text');
    const text = "Izz AL-Drrass";
    let index = 0;
    
    function typeText() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 150);
        }
    }
    
    // Start typing effect when page loads
    setTimeout(typeText, 1000);

    // Particles animation for hero section
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        createParticles();
    }

    function createParticles() {
        const particleCount = 50;
        const binaryChars = ['0', '1'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Progress bars animation
    const progressBars = document.querySelectorAll('.progress-fill');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const skill = bar.getAttribute('data-skill');
            const rect = bar.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                bar.style.width = skill + '%';
            }
        });
    }

    window.addEventListener('scroll', animateProgressBars);
    animateProgressBars(); // Check on initial load

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
            const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
            const subject = formData.get('subject') || contactForm.querySelectorAll('input[type="text"]')[1].value;
            const message = formData.get('message') || contactForm.querySelector('textarea').value;
            
            // Create mailto link
            const mailtoLink = `mailto:izzdrrass33@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Email client opened! Please send the message.', 'success');
            
            // Clear form
            contactFormHandler.reset();
        });
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add slide animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    const certificateModal = document.getElementById('certificateModal');
    const certificateModalBody = document.getElementById('certificateModalBody');
    
    // Certificate data
    const certificateData = {
        cert1: {
            title: 'Certificate Title',
            image: 'certificate1.jpg',
            issuer: 'Issuing Organization',
            date: '2024',
            description: 'Professional certification demonstrating expertise in the field.'
        },
        cert2: {
            title: 'Certificate Title',
            image: 'certificate2.jpg',
            issuer: 'Issuing Organization',
            date: '2024',
            description: 'Technical certification validating specialized skills and knowledge.'
        },
        cert3: {
            title: 'Certificate Title',
            image: 'certificate3.jpg',
            issuer: 'Issuing Organization',
            date: '2024',
            description: 'Academic certificate recognizing excellence and achievement.'
        }
    };

    // Open certificate modal function
    window.openCertificateModal = function(certificateId) {
        const certificate = certificateData[certificateId];
        if (!certificate) return;
        
        const modalContent = `
            <img src="${certificate.image}" alt="${certificate.title}" class="certificate-modal-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YxZjNlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM3Nzg4NzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkNlcnRpZmljYXRlIEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
            <h2>${certificate.title}</h2>
            <p><strong>Issued by:</strong> ${certificate.issuer}</p>
            <p><strong>Date:</strong> ${certificate.date}</p>
            <p>${certificate.description}</p>
            <div class="modal-actions">
                <a href="${certificate.image}" download="${certificate.title.replace(/\s+/g, '_')}.jpg" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download Certificate
                </a>
            </div>
        `;
        
        certificateModalBody.innerHTML = modalContent;
        certificateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close certificate modal function
    window.closeCertificateModal = function() {
        certificateModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Close certificate modal on outside click
    certificateModal.addEventListener('click', function(e) {
        if (e.target === certificateModal) {
            closeCertificateModal();
        }
    });

    // Close certificate modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            closeCertificateModal();
        }
    });
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    // Project data
    const projectData = {
        drone: {
            title: 'Drone Detection System',
            image: 'Drone Detection Syst.png',
            description: 'Developed an intelligent system for detecting and tracking drones in real-time from live video using deep learning techniques.',
            details: `
                <h3>Project Overview</h3>
                <p>This advanced drone detection system uses state-of-the-art computer vision and deep learning algorithms to identify and track drones in real-time video streams.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Real-time drone detection with 95% accuracy</li>
                    <li>Multi-object tracking capabilities</li>
                    <li>Adaptive learning for different drone types</li>
                    <li>Low-latency processing for live video feeds</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <ul>
                    <li>Python</li>
                    <li>TensorFlow & Keras</li>
                    <li>OpenCV</li>
                    <li>YOLO Algorithm</li>
                    <li>Deep Learning</li>
                </ul>
                
                <h3>Results</h3>
                <p>Achieved 95% detection accuracy with minimal false positives. System can process video streams at 30 FPS while maintaining real-time performance.</p>
            `
        },
        disease: {
            title: 'Disease Prediction Model',
            image: 'Disease Prediction M.png',
            description: 'Developed a machine learning model to predict the likelihood of various diseases based on patient data.',
            details: `
                <h3>Project Overview</h3>
                <p>A comprehensive disease prediction system that analyzes patient data to assess the risk of various medical conditions.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Multi-disease prediction capabilities</li>
                    <li>Patient risk assessment scoring</li>
                    <li>Explainable AI for medical decisions</li>
                    <li>Integration with electronic health records</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <ul>
                    <li>Python</li>
                    <li>Scikit-learn</li>
                    <li>Pandas & NumPy</li>
                    <li>Machine Learning</li>
                    <li>Data Analytics</li>
                </ul>
                
                <h3>Results</h3>
                <p>Achieved 88% accuracy in disease prediction across multiple conditions. Model provides interpretable results for medical professionals.</p>
            `
        },
        fingerprint: {
            title: 'Fingerprint Tracking System',
            image: 'Criminal Fingerprint.png',
            description: 'Designed and implemented a fingerprint tracking system using erosion & dilation for criminal identification.',
            details: `
                <h3>Project Overview</h3>
                <p>An advanced fingerprint identification system that uses image processing techniques for criminal tracking and identification.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Automated fingerprint matching</li>
                    <li>Database integration for records</li>
                    <li>Real-time processing capabilities</li>
                    <li>High accuracy identification system</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <ul>
                    <li>Python</li>
                    <li>OpenCV</li>
                    <li>Image Processing</li>
                    <li>Pattern Recognition</li>
                    <li>Security Algorithms</li>
                </ul>
                
                <h3>Results</h3>
                <p>Achieved 92% accuracy in fingerprint matching. System can process and match fingerprints against large databases efficiently.</p>
            `
        },
        aircraft: {
            title: 'Aircraft Data Retrieval System',
            image: 'Aircraft Data Retrie.png',
            description: 'Developed a global aircraft data retrieval system to collect and analyze flight data from various sources.',
            details: `
                <h3>Project Overview</h3>
                <p>A comprehensive system for collecting, processing, and analyzing global aircraft data from multiple sources and APIs.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Real-time flight tracking</li>
                    <li>Multi-source data integration</li>
                    <li>Predictive analytics for flight patterns</li>
                    <li>Automated data processing pipeline</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <ul>
                    <li>Python</li>
                    <li>API Integration</li>
                    <li>Data Mining</li>
                    <li>Analytics</li>
                    <li>Big Data Processing</li>
                </ul>
                
                <h3>Results</h3>
                <p>Successfully integrated data from 15+ aviation APIs. System processes over 100,000 flight records daily with 99.9% uptime.</p>
            `
        }
    };

    // Open modal function
    window.openModal = function(projectId) {
        const project = projectData[projectId];
        if (!project) return;
        
        const modalContent = `
            <img src="${project.image}" alt="${project.title}" class="modal-image">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="project-details">
                ${project.details}
            </div>
            <div class="modal-actions">
                <a href="#" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
                <a href="#" class="btn btn-secondary">
                    <i class="fab fa-github"></i> View Code
                </a>
            </div>
        `;
        
        modalBody.innerHTML = modalContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close modal function
    window.closeModal = function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Contact form handling
    const contactFormHandler = document.getElementById('contactForm');
    if (contactFormHandler) {
        contactFormHandler.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactFormHandler);
            const name = contactFormHandler.querySelector('input[type="text"]').value;
            const email = contactFormHandler.querySelector('input[type="email"]').value;
            const subject = contactFormHandler.querySelectorAll('input[type="text"]')[1].value;
            const message = contactFormHandler.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would normally send the data to a server
            // For now, we'll show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Mobile menu toggle (if needed for responsive design)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu functionality if screen is small
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                const navContainer = document.querySelector('.nav-container');
                if (navContainer) {
                    navContainer.appendChild(mobileMenuToggle);
                }
            }
        } else {
            if (document.querySelector('.mobile-menu-toggle')) {
                mobileMenuToggle.remove();
            }
        }
    }

    window.addEventListener('resize', checkMobileMenu);
    checkMobileMenu();

    // Mobile menu toggle functionality
    mobileMenuToggle.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('mobile-active');
        }
    });

    // Add some CSS for mobile menu
    const mobileCSS = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 10px;
                padding: 0.5rem;
                color: var(--text-primary);
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .nav-links {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background: var(--dark-secondary);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 2rem;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                border-bottom: 1px solid var(--glass-border);
            }
            
            .nav-links.mobile-active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-menu-toggle {
                display: none !important;
            }
        }
    `;

    // Add mobile styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mobileCSS;
    document.head.appendChild(styleSheet);

    // Initialize everything
    highlightActiveNav();
    checkReveal();
    animateProgressBars();
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll function for better performance
function smoothScrollTo(target, duration = 800) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Performance optimization for scroll events
const optimizedScroll = debounce(function() {
    // Add any scroll-based optimizations here
}, 10);

window.addEventListener('scroll', optimizedScroll);
