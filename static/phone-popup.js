(() => {
    const phoneBtn = document.querySelector('.phone-btn');
    if (!phoneBtn) return;

    // Create popup phone image if not present
    let popup = document.getElementById('phone-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'phone-popup';
        popup.innerHTML = `
            <div class="phone-popup-shell">
                <img src="/static/pictures/phone/phone.png" alt="Telefoon" class="phone-popup-img">
                <button class="phone-popup-overmij-btn" type="button" data-app-target="overmij" aria-label="Open Over mij app">
                    <img src="/static/pictures/phone/over mij.png" alt="Over mij" class="phone-popup-overmij-img">
                </button>
                <button class="phone-popup-socials-btn" type="button" data-app-target="socials" aria-label="Open Socials app">
                    <img src="/static/pictures/phone/socials.png" alt="Socials" class="phone-popup-socials-img">
                </button>
                <button class="phone-popup-contact-btn" type="button" data-app-target="contact" aria-label="Open Contact app">
                    <img src="/static/pictures/phone/contact.png" alt="Contact" class="phone-popup-contact-img">
                </button>
                <button class="phone-popup-spotify-btn" type="button" data-app-target="spotify" aria-label="Open Spotify app">
                    <img src="/static/pictures/phone/spotify.png" alt="Spotify" class="phone-popup-spotify-img">
                </button>
                <div class="phone-app-overlay" aria-hidden="true">
                    <button class="phone-app-close" type="button" aria-label="Close app">Back</button>
                    <section class="phone-app-screen" data-app="overmij"><h3>Over mij</h3></section>
                    <section class="phone-app-screen" data-app="socials"><h3>Socials</h3></section>
                    <section class="phone-app-screen" data-app="contact"><h3>Contact</h3></section>
                    <section class="phone-app-screen" data-app="spotify"><h3>Spotify</h3></section>
                </div>
                <div class="phone-popup-top"></div>
            </div>
        `;
        document.body.appendChild(popup);
    }

    const popupTop = popup.querySelector('.phone-popup-top');
    const appOverlay = popup.querySelector('.phone-app-overlay');
    const appClose = popup.querySelector('.phone-app-close');
    const appButtons = popup.querySelectorAll('[data-app-target]');
    const appScreens = popup.querySelectorAll('.phone-app-screen');

    function showPhone() {
        popup.classList.add('phone-popup-visible');
        popup.setAttribute('aria-hidden', 'false');
    }

    function hidePhone() {
        popup.classList.remove('phone-popup-visible');
        popup.setAttribute('aria-hidden', 'true');
        closeAppOverlay();
    }

    function closeAppOverlay() {
        if (!appOverlay) return;
        appOverlay.classList.remove('phone-app-open');
        popup.classList.remove('phone-app-mode');
        appOverlay.setAttribute('aria-hidden', 'true');
        appScreens.forEach((screen) => {
            screen.classList.remove('phone-app-screen-visible');
        });
    }

    function openAppOverlay(appName) {
        if (!appOverlay) return;
        appOverlay.classList.add('phone-app-open');
        popup.classList.add('phone-app-mode');
        appOverlay.setAttribute('aria-hidden', 'false');
        appScreens.forEach((screen) => {
            const shouldShow = screen.getAttribute('data-app') === appName;
            screen.classList.toggle('phone-app-screen-visible', shouldShow);
        });
    }

    phoneBtn.addEventListener('click', showPhone);

    if (popupTop) {
        popupTop.addEventListener('click', hidePhone);
    }

    appButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-app-target');
            if (!target) return;
            openAppOverlay(target);
            button.blur();
        });
    });

    if (appClose) {
        appClose.addEventListener('click', () => {
            closeAppOverlay();
            appClose.blur();
        });
    }
})();
