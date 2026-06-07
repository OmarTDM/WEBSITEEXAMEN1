document.addEventListener('DOMContentLoaded', () => {
    const oldmanSeat = document.querySelector('.oldman-seat-sprite');
    const zoomBackBtn = document.querySelector('.zoom-back-btn');
    const body = document.body;

    if (!oldmanSeat || !body) {
        return;
    }

    const toggleDrawerZoom = () => {
        body.classList.toggle('drawer-zoom-active');
    };

    oldmanSeat.addEventListener('click', toggleDrawerZoom);

    if (zoomBackBtn) {
        zoomBackBtn.addEventListener('click', () => {
            body.classList.remove('drawer-zoom-active');
        });
    }

    oldmanSeat.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDrawerZoom();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            body.classList.remove('drawer-zoom-active');
        }
    });
});
