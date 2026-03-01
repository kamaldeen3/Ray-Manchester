(function () {
    const KEY = 'fontScalePercent';
    const DEFAULT = 100;
    const MIN = 85;
    const MAX = 130;
    const STEP = 5;

    function clamp(v) {
        return Math.min(MAX, Math.max(MIN, v));
    }

    function apply(percent) {
        document.documentElement.style.fontSize = percent + '%';
    }

    function save(percent) {
        localStorage.setItem(KEY, String(percent));
    }

    function load() {
        const v = parseInt(localStorage.getItem(KEY), 10);
        return Number.isFinite(v) ? v : DEFAULT;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('fontscale');
        const down = document.getElementById('fontDown');
        const up = document.getElementById('fontUp');
        const reset = document.getElementById('fontReset');

        if (!slider || !down || !up || !reset) return;

        const start = clamp(load());
        slider.value = start;
        apply(start);

        slider.addEventListener('input', () => {
            const val = clamp(parseInt(slider.value, 10));
            apply(val);
            save(val);
        });

        down.addEventListener('click', () => {
            const val = clamp(parseInt(slider.value, 10) - STEP);
            slider.value = val;
            apply(val);
            save(val);
        });

        up.addEventListener('click', () => {
            const val = clamp(parseInt(slider.value, 10) + STEP);
            slider.value = val;
            apply(val);
            save(val);
        });

        reset.addEventListener('click', () => {
            slider.value = DEFAULT;
            apply(DEFAULT);
            save(DEFAULT);
        });
    });
})();
