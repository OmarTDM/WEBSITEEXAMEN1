document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('drawer-popup-overlay');
    const titleEl = document.getElementById('drawer-popup-title');
    const shortEl = document.getElementById('drawer-popup-short');
    const bigEl = document.getElementById('drawer-popup-big');
    const triggerButtons = document.querySelectorAll('.drawer-card-btn, .drawer-card-btn-right, .drawer-card-btn-wartortle');

    if (!overlay || !titleEl || !shortEl || !bigEl || triggerButtons.length === 0) {
        return;
    }

    const openPopup = (title, shortText, bigText) => {
        titleEl.textContent = title;
        shortEl.textContent = shortText;
        bigEl.textContent = bigText;
        overlay.hidden = false;
    };

    const closePopup = () => {
        overlay.hidden = true;
    };

    triggerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const title = button.dataset.popupTitle || 'Untitled';
            const shortText = button.dataset.popupShort || 'No short description yet.';
            const bigText = button.dataset.popupBig || 'Big description goes here.';
            openPopup(title, shortText, bigText);
        });
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !overlay.hidden) {
            closePopup();
        }
    });
});
