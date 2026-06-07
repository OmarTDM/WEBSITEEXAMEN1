(() => {
    const body = document.body;
    const trigger = document.querySelector('.whitehair-seat-sprite');
    const panel = document.querySelector('.recipe-panel');

    if (!trigger || !panel) {
        return;
    }

    const setRecipeOpen = (isOpen) => {
        body.classList.toggle('recipe-active', isOpen);
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    const toggleRecipe = () => {
        if (body.classList.contains('drawer-zoom-active')) {
            return;
        }

        const isOpen = body.classList.contains('recipe-active');
        setRecipeOpen(!isOpen);
    };

    trigger.addEventListener('click', toggleRecipe);

    trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleRecipe();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setRecipeOpen(false);
        }
    });
})();
