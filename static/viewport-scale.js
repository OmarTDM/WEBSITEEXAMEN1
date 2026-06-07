(() => {
    const BASE_WIDTH = 2560;
    const BASE_HEIGHT = 1440;
    const SCALE_MODE = 'cover';

    function getStages() {
        return Array.from(document.querySelectorAll('.viewport-stage'));
    }

    function applyScale() {
        const stages = getStages();
        if (stages.length === 0) return;

        const scaleFn = SCALE_MODE === 'cover' ? Math.max : Math.min;
        const scale = scaleFn(window.innerWidth / BASE_WIDTH, window.innerHeight / BASE_HEIGHT);
        const offsetX = (window.innerWidth - BASE_WIDTH * scale) / 2;
        const offsetY = (window.innerHeight - BASE_HEIGHT * scale) / 2;

        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.setProperty('--viewport-scale', String(scale));
        document.body.style.overflow = 'hidden';

        for (const stage of stages) {
            stage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
    }

    window.addEventListener('resize', applyScale);
    window.addEventListener('orientationchange', applyScale);
    window.addEventListener('load', applyScale);
    applyScale();
})();
