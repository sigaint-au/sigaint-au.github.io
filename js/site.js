(function () {
    'use strict';

    let contactModal = null;
    let modalTrigger = null;
    let focusTrapHandler = null;

    function isHomePage() {
        const page = document.body.dataset.page;
        if (page === 'home') return true;
        const path = window.location.pathname;
        return path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('');
    }

    function homeLink(hash) {
        return isHomePage() ? hash : `index.html${hash}`;
    }

    function setupMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        if (!mobileBtn) return;

        mobileBtn.addEventListener('click', () => {
            const nav = document.createElement('div');
            nav.className = 'fixed inset-0 z-[200] bg-[#f7f7f5] md:hidden';
            nav.innerHTML = `
                <div class="p-8">
                    <div class="flex justify-between items-center mb-10">
                        <a href="index.html" class="flex items-center gap-x-3">
                            <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 22C6 22 12 8 22 8C32 8 38 22 38 22C38 22 32 36 22 36C12 36 6 22 6 22Z" stroke="#0a0a0a" stroke-width="4.5" stroke-linejoin="round"/>
                                <circle cx="22" cy="22" r="6" fill="#0a0a0a"/>
                                <path d="M6 22H2" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/>
                                <path d="M38 22H42" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/>
                            </svg>
                            <span class="text-black text-3xl font-semibold tracking-tighter">Sigaint</span>
                        </a>
                        <button class="text-black text-4xl leading-none" aria-label="Close menu">&times;</button>
                    </div>

                    <div class="flex flex-col gap-y-6 text-xl text-black font-medium">
                        <a href="${homeLink('#features')}" class="py-1">Capabilities</a>
                        <a href="${homeLink('#proof')}" class="py-1">Experience</a>
                        <a href="${homeLink('#pricing')}" class="py-1">Engagements</a>
                        <a href="about.html" class="py-1">About</a>
                        <a href="approach.html" class="py-1">Our Approach</a>
                    </div>

                    <div class="pt-10">
                        <button type="button" data-action="consultation"
                                class="w-full py-4 bg-black text-white font-semibold rounded-full text-lg">
                            Book Consultation
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(nav);

            nav.querySelector('button').addEventListener('click', () => nav.remove());

            nav.querySelector('[data-action="consultation"]').addEventListener('click', () => {
                nav.remove();
                showContactModal();
            });

            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => nav.remove());
            });
        });
    }

    function showContactModal() {
        contactModal = document.getElementById('contact-modal');
        if (!contactModal) return;

        modalTrigger = document.activeElement;

        contactModal.classList.remove('hidden');
        contactModal.classList.add('flex');

        focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = contactModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        contactModal.addEventListener('keydown', focusTrapHandler);

        setTimeout(() => {
            const firstInput = document.getElementById('full-name');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    function hideContactModal() {
        if (contactModal) {
            contactModal.classList.remove('flex');
            contactModal.classList.add('hidden');
            if (focusTrapHandler) {
                contactModal.removeEventListener('keydown', focusTrapHandler);
                focusTrapHandler = null;
            }
        }
        if (modalTrigger) {
            modalTrigger.focus();
            modalTrigger = null;
        }
    }

    function submitContactForm(e) {
        e.preventDefault();

        const goalLabels = {
            'platform-modernisation': 'Platform modernisation',
            'zero-trust': 'Security architecture implementation',
            'security-audit': 'Security audit & compliance review',
            'gitops': 'Automation & delivery strategy',
            'ongoing-support': 'Ongoing platform partnership / retainer',
            'other': 'Other'
        };

        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const organisation = document.getElementById('organisation').value.trim();
        const role = document.getElementById('role').value.trim();
        const goal = document.getElementById('goal').value;
        const message = document.getElementById('message').value.trim();

        const goalText = goalLabels[goal] || goal;
        const body = [
            'Consultation request',
            '',
            `Name: ${fullName}`,
            `Email: ${email}`,
            `Organisation: ${organisation}`,
            role ? `Role: ${role}` : null,
            `Objective: ${goalText}`,
            message ? '' : null,
            message ? 'Additional details:' : null,
            message || null
        ].filter(line => line !== null).join('\n');

        const mailto = `mailto:consultation@sigaint.au?subject=${encodeURIComponent('Consultation Request')}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        hideContactModal();
    }

    function setupContactModal() {
        const modal = document.getElementById('contact-modal');
        if (!modal) return;

        modal.addEventListener('click', (event) => {
            if (event.target.id === 'contact-modal') hideContactModal();
        });

        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', submitContactForm);
        }

        document.querySelectorAll('[data-action="consultation"]').forEach(btn => {
            btn.addEventListener('click', showContactModal);
        });

        const closeBtn = modal.querySelector('[data-action="close-modal"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideContactModal);
        }
    }

    function setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
                if (activeModals.length > 0) {
                    const topModal = activeModals[activeModals.length - 1];
                    topModal.classList.add('hidden');
                    topModal.classList.remove('flex');
                }
            }

            if (e.key === '/' && document.activeElement.tagName === 'BODY') {
                e.preventDefault();
                showContactModal();
            }
        });
    }

    function setupSmoothScroll() {
        document.querySelectorAll('a[href*="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const hashIndex = href.indexOf('#');
                if (hashIndex === -1) return;

                const hash = href.slice(hashIndex);
                const isSamePage = href === hash || href.endsWith(window.location.pathname.split('/').pop() + hash);

                if (!isSamePage && !isHomePage()) return;

                const target = document.querySelector(hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function setupLogoInteraction() {
        const logo = document.querySelector('.logo-svg');
        if (!logo) return;

        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    function markActiveNav() {
        const currentPage = document.body.dataset.page;
        if (!currentPage || currentPage === 'home') return;

        document.querySelectorAll('[data-nav-page]').forEach(link => {
            if (link.dataset.navPage === currentPage) {
                link.classList.add('active', 'text-black');
            }
        });
    }

    function fixHomeNavLinks() {
        if (!isHomePage()) return;

        document.querySelectorAll('#site-nav a[href^="index.html#"]').forEach(link => {
            link.setAttribute('href', link.getAttribute('href').replace('index.html', ''));
        });
    }

    function init() {
        fixHomeNavLinks();
        setupMobileMenu();
        setupContactModal();
        setupKeyboardControls();
        setupSmoothScroll();
        setupLogoInteraction();
        markActiveNav();
    }

    window.Sigaint = {
        init,
        showContactModal,
        hideContactModal
    };
})();