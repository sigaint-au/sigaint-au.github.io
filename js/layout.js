(function () {
    'use strict';

    const PARTIALS = {
        'site-nav': 'partials/nav.html',
        'site-footer': 'partials/footer.html',
        'site-contact-modal': 'partials/contact-modal.html'
    };

    async function loadPartial(id, url) {
        const container = document.getElementById(id);
        if (!container) return;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            container.innerHTML = await response.text();
        } catch (err) {
            console.error(`[Sigaint] Could not load partial: ${url}`, err);
        }
    }

    async function loadLayout() {
        await Promise.all(
            Object.entries(PARTIALS).map(([id, url]) => loadPartial(id, url))
        );

        if (window.Sigaint) {
            window.Sigaint.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLayout);
    } else {
        loadLayout();
    }
})();