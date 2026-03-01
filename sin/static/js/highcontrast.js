(function () {
    const KEY = 'highContrastEnabled';

    function setContrast(enabled) {
        document.documentElement.classList.toggle('high-contrast', enabled);
        localStorage.setItem(KEY, enabled ? '1' : '0');
    }

    function loadContrast() {
        return localStorage.getItem(KEY) === '1';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.getElementById('contrastToggle');
        if (!toggle) return;

        // Restore saved state
        const enabled = loadContrast();
        toggle.checked = enabled;
        setContrast(enabled);

        // Update on change
        toggle.addEventListener('change', () => {
            setContrast(toggle.checked);
        });
    });
})();
