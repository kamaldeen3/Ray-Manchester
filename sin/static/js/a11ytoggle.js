(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('a11yToggle');
        const panel = document.getElementById('a11yPanel');
        if (!btn || !panel) return;

        function openPanel() {
            panel.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            panel.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (panel.hidden) openPanel();
            else closePanel();
        });

        // close if you click outside 
        document.addEventListener('click', () => closePanel());

        // don't close when clicking inside the panel
        panel.addEventListener('click', (e) => e.stopPropagation());

        // close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePanel();
        });
    });
})();
