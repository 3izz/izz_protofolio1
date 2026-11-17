// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // Cursor-tracked spotlight glow on cards
    document.querySelectorAll('.project-card, .certificate-card, .skill-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        });
    });

    // ============================
    // Izz AI Assistant
    // ============================
    (function initIzzAi() {
        const trigger = document.getElementById('izzAiTrigger');
        const panel = document.getElementById('izzAiPanel');
        const backdrop = document.getElementById('izzAiBackdrop');
        const closeBtn = document.getElementById('izzAiClose');
        const loaderLetters = document.getElementById('izzAiLoaderLetters');
        const messages = document.getElementById('izzAiMessages');
        const form = document.getElementById('izzAiForm');
        const input = document.getElementById('izzAiInput');

        if (!trigger || !panel) return;

        let introPlayed = false;
        let isOpen = false;

        // Word-by-word intro sequence inside the loader ring
        function playIntro(onDone) {
            const phrases = ['Welcome', 'to', "Izz's", 'AI'];
            let i = 0;

            function showNext() {
                loaderLetters.innerHTML = '';
                phrases[i].split('').forEach((ch, idx) => {
                    const span = document.createElement('span');
                    span.textContent = ch;
                    span.style.animationDelay = (idx * 0.08) + 's';
                    loaderLetters.appendChild(span);
                });
                i++;
                if (i < phrases.length) {
                    setTimeout(showNext, 650);
                } else {
                    setTimeout(onDone, 900);
                }
            }
            showNext();
        }

        // Small local knowledge base — answers are drawn only from the
        // real content already on this page (About/Skills/Projects/
        // Certificates/Experience/Contact). No external API is called,
        // so there's no key to expose and no cost per message.
        // Ordered from most specific to most generic — a message can contain
        // filler words like "about" or "work" alongside a specific keyword
        // (e.g. "tell me about the pos system"), so narrow topics are checked
        // first and only fall through to broad ones like About/Projects last.
        const knowledge = [
            { keys: ['ams', 'asset', 'dot', 'custody', 'inventory'],
              reply: "AMS is an Asset & Resource Management System Izz built for dot Jordan (Digital Opportunity Trust) and delivered in December 2025. It runs the full device lifecycle (request, approval, digital signature, handover, transfer and clearance) across 5 user roles, with QR asset tags and Arabic custody PDFs. Built with Laravel 12, MySQL 8, Livewire 3, Alpine.js and Tailwind. It's live at dot-jordan.com, and you'll find it as the first card in the Projects section." },
            { keys: ['drone'],
              reply: "The Drone Detection System uses Python, TensorFlow and computer vision to detect and track drones in real time from live video — it's the featured project card in the Projects section." },
            { keys: ['pos', 'yazori', 'supermarket'],
              reply: "The Al-Yazori Market project is a fully offline point-of-sale system for a real neighborhood supermarket — built with Laravel, PHP and SQLite, running entirely on a local Windows machine with no internet dependency." },
            { keys: ['certificate', 'certification', 'course'],
              reply: "Izz holds certificates from Anthropic (AI Fluency: Framework & Foundations, and Claude 101), Google (Data Analysis), Udemy (Generative AI), Udacity (AI & Data Analysis), HP (Agile Project Management, Data Science & Analytics) and Meta (Databases) — see the Certificates section." },
            { keys: ['cv', 'resume'],
              reply: "You can grab the CV from the About section above — there's a Download CV button right under the bio." },
            { keys: ['contact', 'email', 'phone', 'hire', 'reach', 'linkedin'],
              reply: "Best ways to reach Izz: 📧 izzdrrass33@gmail.com · 📞 +962 795 119 869 · LinkedIn: linkedin.com/in/izz-al-drrass. Based in Amman, Jordan." },
            { keys: ['experience', 'career', 'timeline', 'education'],
              reply: "Bachelor of AI & Data Science, Tafila Technical University (2021–2025) → freelance AI Developer (2025–2026) building custom ML solutions → currently an AI Engineer in the government sector since 2026." },
            { keys: ['skill', 'stack', 'technolog', 'language', 'programming'],
              reply: "Core skills: Programming, Frontend & Backend Development, Machine Learning and Data Analysis (all Advanced), plus Deep Learning, Big Data and Visualization. Full breakdown is in the Skills section above." },
            { keys: ['project', 'portfolio', 'built', 'build'],
              reply: "Highlights: AMS, a production asset management system for dot Jordan (Laravel 12 + MySQL, live at dot-jordan.com), the Drone Detection System (real-time YOLO-based detection — his featured project), an offline Laravel/SQLite POS system built for a real supermarket, an AI Log Detector, Jmooh AI, and several full-stack sites like agroberry.online, an e-commerce store, a quiz game, and MedFungi Insecta. See the Projects section for live/GitHub links." },
            { keys: ['about', 'background', 'bio'],
              reply: "Izz is an AI Engineer & Full-Stack Web Developer focused on AI, LLMs and Data Science — working with Hugging Face, model fine-tuning, and local inference with LM Studio. He also builds full-stack apps with PHP (Laravel), JavaScript and MySQL, and holds a Bachelor's in AI & Data Science from Tafila Technical University." },
            { keys: ['thank', 'shukran'],
              reply: "You're welcome! Feel free to ask anything else, or reach out directly via the Contact section. 🙌" },
            { keys: ['hello', 'hi', 'hey', 'marhaba', 'مرحبا'],
              reply: "Hey! 👋 I'm Izz AI — ask me about Izz's projects, skills, experience, certificates, or how to reach him." }
        ];

        function findReply(text) {
            // Word-boundary matching: short keys (e.g. "hi", "cv") must match a
            // whole word exactly, otherwise they false-positive inside unrelated
            // words (e.g. "hi" inside "him"). Longer keys may match as a stem
            // inside a word so "projects"/"project" both hit the same topic.
            const words = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
            for (let i = 0; i < knowledge.length; i++) {
                const isMatch = knowledge[i].keys.some(function(k) {
                    if (k.length <= 3) return words.includes(k);
                    return words.some(function(w) { return w.length >= 4 && w.includes(k); });
                });
                if (isMatch) return knowledge[i].reply;
            }
            return "That's outside what I can cover right now — you're seeing an early preview of Izz AI while the full custom language model is being integrated. In the meantime, ask me about Izz's projects, skills, certificates, experience, or how to get in touch.";
        }

        function addMessage(text, sender) {
            const el = document.createElement('div');
            el.className = 'izz-ai-msg ' + sender;
            el.textContent = text;
            messages.appendChild(el);
            messages.scrollTop = messages.scrollHeight;
            return el;
        }

        function addChips(topics) {
            const wrap = document.createElement('div');
            wrap.className = 'izz-ai-chips';
            topics.forEach(t => {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'izz-ai-chip';
                chip.textContent = t;
                chip.addEventListener('click', () => handleUserMessage(t));
                wrap.appendChild(chip);
            });
            messages.appendChild(wrap);
            messages.scrollTop = messages.scrollHeight;
        }

        function seedWelcome() {
            addMessage("Hi, I'm Izz AI 👋 Ask me about Izz's projects, skills, experience, or how to get in touch.", 'bot');
            addChips(['Projects', 'Skills', 'Experience', 'Contact']);
        }

        function handleUserMessage(raw) {
            const text = raw.trim();
            if (!text) return;
            addMessage(text, 'user');
            input.value = '';

            const typing = document.createElement('div');
            typing.className = 'izz-ai-msg bot typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                typing.remove();
                addMessage(findReply(text), 'bot');
            }, 500 + Math.random() * 400);
        }

        function openIzzAi() {
            panel.classList.add('active');
            panel.setAttribute('aria-hidden', 'false');
            backdrop.classList.add('active');
            isOpen = true;

            if (!introPlayed) {
                panel.classList.remove('show-chat');
                playIntro(() => {
                    panel.classList.add('show-chat');
                    introPlayed = true;
                    if (!messages.childElementCount) seedWelcome();
                    input.focus();
                });
            } else {
                panel.classList.add('show-chat');
                input.focus();
            }
        }

        function closeIzzAi() {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            backdrop.classList.remove('active');
            isOpen = false;
        }

        trigger.addEventListener('click', openIzzAi);
        closeBtn.addEventListener('click', closeIzzAi);
        backdrop.addEventListener('click', closeIzzAi);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) closeIzzAi();
        });
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUserMessage(input.value);
        });
    })();

    // Keyboard activation for clickable cards (role="button")
    document.querySelectorAll('[role="button"][tabindex="0"]').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

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
            contactForm.reset();
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

    // Open certificate modal function — reads the real data straight off the
    // clicked card so the modal always matches what's shown in the grid.
    window.openCertificateModal = function(cardEl) {
        if (!cardEl || !cardEl.querySelector) return;

        const img = cardEl.querySelector('.certificate-image');
        const title = cardEl.querySelector('.certificate-title')?.textContent.trim() || 'Certificate';
        const issuer = cardEl.querySelector('.certificate-issuer')?.textContent.trim() || '';
        const date = cardEl.querySelector('.certificate-date')?.textContent.trim() || '';
        const tags = Array.from(cardEl.querySelectorAll('.certificate-tags .tag'))
            .map(tag => `<span class="tag">${tag.textContent.trim()}</span>`)
            .join('');
        const imageSrc = img ? img.src : '';
        const verifyLink = cardEl.querySelector('.cert-verify-link');
        const verifyButton = verifyLink
            ? `<a href="${verifyLink.href}" target="_blank" rel="noopener" class="btn btn-secondary"><i class="fas fa-circle-check"></i> Verify Online</a>`
            : '';

        const modalContent = `
            <img src="${imageSrc}" alt="${title}" class="certificate-modal-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YxZjNlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM3Nzg4NzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkNlcnRpZmljYXRlIEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
            <h2>${title}</h2>
            <p><strong>Issued by:</strong> ${issuer}</p>
            <p>${date}</p>
            <div class="certificate-tags">${tags}</div>
            <div class="modal-actions">
                <a href="${imageSrc}" download="${title.replace(/\s+/g, '_')}.png" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download Certificate
                </a>
                ${verifyButton}
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
        ams: {
            title: 'AMS — Asset & Resource Management System',
            description: 'A production asset and custody management platform built for dot Jordan (Digital Opportunity Trust). Delivered in December 2025 and live at dot-jordan.com.',
            link: 'https://dot-jordan.com',
            linkLabel: 'Visit Live Site',
            linkIcon: 'fas fa-external-link-alt',
            gallery: [
                { src: 'ams/ams-login.jpg', caption: 'Sign-in: an Arabic-first, RTL interface in the dot Jordan brand.' },
                { src: 'ams/ams-new-request.jpg', caption: 'New custody request: personal or training custody, location, purpose and the device categories needed.' },
                { src: 'ams/ams-qr-label.jpg', caption: 'Every asset gets a QR code that can be printed as a thermal label or a multi-size PDF.' }
            ],
            details: `
                <h3>The Problem</h3>
                <p>dot Jordan is a non-profit that runs digital training programs for young people across several sites. Its warehouse holds laptops, tablets, phones, routers, SIM cards, printers and projectors. Some are owned by the organization and some are donated by partners. Tracking used to rely on an Excel sheet and paper custody forms, so it was hard to know who held which device, where it was, or whether it came back.</p>

                <h3>The Solution</h3>
                <p>AMS digitizes the whole asset lifecycle: <strong>request → approval → digital signature → handover → transfer → clearance</strong>. Every action is permission-checked and logged.</p>
                <ul>
                    <li><strong>Role-based workflow</strong>: employees, direct managers, HR, the logistics/warehouse manager and data-entry staff each see only what their role allows.</li>
                    <li><strong>Custody requests</strong>: personal custody (held until clearance) or training custody (returned after a course or project).</li>
                    <li><strong>Digital signatures</strong>: users sign on screen, and the system generates a binding Arabic custody PDF with every party's signature.</li>
                    <li><strong>Transfers &amp; clearance</strong>: custody moves between colleagues, and devices are cleared item by item (received / damaged).</li>
                    <li><strong>Asset registry</strong>: categories, warehouses, ownership vs. donation source, warranty dates and hidden/restricted assets.</li>
                    <li><strong>QR codes</strong>: each device gets a QR tag for thermal label printing, plus an in-app scanner for fast lookup.</li>
                    <li><strong>Operations</strong>: hospitality requests, an internal mailbox, document templates, reports, Excel import/export, daily backups and a full audit log.</li>
                    <li><strong>Notifications</strong>: an in-app notification center and transactional email for every workflow step.</li>
                </ul>

                <h3>Screenshots</h3>
                <div class="modal-gallery">{{gallery}}</div>

                <h3>Tech Stack</h3>
                <table class="tech-table">
                    <tr><th>Framework</th><td>Laravel 12 (PHP), with a clean architecture of service classes, Form Requests and Policies</td></tr>
                    <tr><th>Database</th><td>MySQL 8 (InnoDB, utf8mb4) with 50+ versioned migrations</td></tr>
                    <tr><th>Frontend</th><td>Blade + Livewire 3, Alpine.js and Tailwind CSS, built with Vite; fully RTL</td></tr>
                    <tr><th>Auth &amp; RBAC</th><td>Laravel Breeze plus spatie/laravel-permission for roles and permissions</td></tr>
                    <tr><th>Documents</th><td>mPDF + ar-php for correctly shaped Arabic PDFs; signature_pad canvas signatures</td></tr>
                    <tr><th>Assets &amp; Data</th><td>simple-qrcode for QR tags, maatwebsite/excel for import/export</td></tr>
                    <tr><th>Reliability</th><td>spatie/laravel-activitylog (audit trail), spatie/laravel-backup, queued background jobs</td></tr>
                    <tr><th>Email</th><td>Resend for transactional notifications</td></tr>
                    <tr><th>Testing</th><td>Pest / PHPUnit feature tests, Laravel Pint for code style</td></tr>
                    <tr><th>Deployment</th><td>Linux VPS with SSL</td></tr>
                </table>

                <h3>Outcome</h3>
                <p>Delivered in <strong>December 2025</strong> and running in production at dot-jordan.com. I also produced a set of narrated, role-by-role video tutorials so every user group can use the system without help.</p>
            `
        },
        drone: {
            title: 'Drone Detection System',
            image: 'Drone Detection Syst.png',
            description: 'Developed an intelligent system for detecting and tracking drones in real-time from live video using deep learning techniques.',
            link: 'https://github.com/3izz/Drone-detection-system-border-camera-computer-vison',
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
        
        const galleryHtml = (project.gallery || []).map(function(shot) {
            return `<figure><img src="${shot.src}" alt="${shot.caption}" loading="lazy"><figcaption>${shot.caption}</figcaption></figure>`;
        }).join('');
        const heroImage = project.image;

        const modalContent = `
            ${heroImage ? `<img src="${heroImage}" alt="${project.title}" class="modal-image">` : ''}
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="project-details">
                ${project.details.replace('{{gallery}}', galleryHtml)}
            </div>
            <div class="modal-actions">
                <a href="${project.link || '#'}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="${project.linkIcon || 'fab fa-github'}"></i> ${project.linkLabel || 'View Code'}
                </a>
            </div>
        `;

        modalBody.innerHTML = modalContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // AMS showcase card: swap the main screenshot when a thumbnail is clicked
    const amsMainShot = document.getElementById('amsMainShot');
    document.querySelectorAll('.showcase-thumb').forEach(function(thumb) {
        thumb.addEventListener('click', function() {
            if (!amsMainShot || thumb.classList.contains('active')) return;
            document.querySelectorAll('.showcase-thumb').forEach(function(t) { t.classList.remove('active'); });
            thumb.classList.add('active');
            amsMainShot.classList.add('swapping');
            setTimeout(function() {
                amsMainShot.src = thumb.dataset.shot;
                amsMainShot.alt = thumb.dataset.alt;
                amsMainShot.classList.remove('swapping');
            }, 200);
        });
    });

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
