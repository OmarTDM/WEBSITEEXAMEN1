(() => {
    const ingredientButtons = document.querySelectorAll('.ingredient-btn');
    const overlay = document.getElementById('cinematic-overlay');

    if (!ingredientButtons.length || !overlay) {
        return;
    }

    const panels = [
        overlay.querySelector('.cinematic-panel-left'),
        overlay.querySelector('.cinematic-panel-middle'),
        overlay.querySelector('.cinematic-panel-right'),
    ];

    const dingBack = document.getElementById('cinematic-ding-back');
    const dingScreen = document.getElementById('cinematic-ding');
    const dingCupButtons = Array.from(document.querySelectorAll('.ding-cup-slot'));
    const dingCupImages = dingCupButtons.map((button) => button.querySelector('.ding-cup'));
    const detailPanel = document.getElementById('cup-detail-panel');
    const detailClose = document.getElementById('cup-detail-close');
    const detailImage = document.getElementById('cup-detail-image');
    const detailTitle = document.getElementById('cup-detail-title');
    const detailText = document.getElementById('cup-detail-text');
    const detailDocuments = document.getElementById('cup-detail-documents');
    const detailDocList = document.getElementById('cup-detail-doc-list');
    const detailMediaShell = document.querySelector('.cup-detail-media-shell');
    const detailMediaImage = document.getElementById('cup-detail-media-image');
    const detailMediaVideo = document.getElementById('cup-detail-media-video');
    const detailMediaPdf = document.getElementById('cup-detail-media-pdf');
    const detailMediaPlaceholder = document.getElementById('cup-detail-media-placeholder');
    let running = false;
    let selectedCupButton = null;
    let activeIngredientCode = '';
    let activeIngredientLabel = '';
    let activeCupDocuments = dingCupButtons.map(() => []);

    const cupTitleMap = {
        'cupofgingerbreadcoffee.png': 'Gingerbread Coffee',
        'cupofgrinchlatte.png': 'Grinch Latte',
        'cupofmatchalatte.png': 'Matcha Latte',
        'cupofminttea.png': 'Mint Tea',
        'cupofsleepymilktea.png': 'Sleepy Milk Tea',
        'cupofswirlymilktea.png': 'Swirly Milk Tea',
        'cupofanijstea.png': 'Anijs Tea',
        'cupofhoneyteadark.png': 'Honey Tea Dark',
        'cupoftealattefox.png': 'Tea Latte Fox',
        'cupofchurrochocolate.png': 'Churro Chocolate',
        'cupofheartchocolate.png': 'Heart Chocolate',
        'cupofunionjackchocolate.png': 'Union Jack Chocolate',
        'cupofblueflowertea.png': 'Blue Flower Tea',
        'cupofbluemarshmallow.png': 'Blue Marshmallow',
        'cupofswirlybluetea.png': 'Swirly Blue Tea',
        'cupofredtea.png': 'Red Tea',
        'cupofredtealatte.png': 'Red Tea Latte',
        'cupofredteapie.png': 'Red Tea Pie',
        'cupofcinnamonchristmas.png': 'Cinnamon Christmas',
        'cupofcinnamontea.png': 'Cinnamon Tea',
        'cupofteacinnamon.png': 'Tea Cinnamon',
        'cupoffivestarmatcha.png': 'Five Star Matcha',
    };

    // Add per-cup custom text or media here. mediaType supports: image, video, pdf.
    const cupDetailOverrides = {};

    const createDocument = (title, fileName, mediaType = '') => {
        const normalizedType = mediaType || (fileName.toLowerCase().endsWith('.png') ? 'image' : 'pdf');

        return {
            title,
            mediaType: normalizedType,
            mediaSrc: `/static/documents/${encodeURIComponent(fileName)}`,
            mediaAlt: title,
        };
    };

    const distributeAcrossCups = (documents) => {
        const cups = [[], [], []];

        documents.forEach((documentDetail, index) => {
            const cupIndex = Math.floor((index * cups.length) / documents.length);
            cups[cupIndex].push(documentDetail);
        });

        return cups;
    };

    // Documents are kept in the user-provided order and automatically spread across the 3 cups.
    const ingredientDocumentMap = {
        'B1-K1-W1': [
            createDocument('Voortgang Dashboard Project', 'Voortgang_Dashboard_Project.pdf'),
            createDocument('GitHub Samenwerking Bewijsmateriaal', 'GITHUBSAMENWERKINGBEWIJSMATERIAAL.pdf'),
            createDocument('Werkzaamheden Omar de Torbal', 'Werkzaamheden_Omar_de_Torbal_26__nov.pdf'),
            createDocument('Werkzaamheden VTV Sittard', 'Werkzaamhedenvtvsittard.pdf'),
        ],
        'B1-K1-W2': [
            createDocument('Behoefte Analyse Volkstuin Sittard', 'Behoefte_analyse_1_VOLKSTUINSITTARD (1).pdf'),
            createDocument('Functioneel Ontwerp', 'FO (1).pdf'),
            createDocument('Technisch Ontwerp 2.0', 'Technisch_Ontwerp_2.0.pdf'),
            createDocument('Behoefte Analyse', 'Behoefte_Analyse_ (1).pdf'),
            createDocument('Plan van Aanpak Dashboard Dipper', 'Plan_van_Aanpak_Dashboard_Dipper_Nieuw (1).pdf'),
            createDocument('VTV', 'VTV.png', 'image'),
        ],
        'B1-K1-W3': [
            createDocument('Code Bewijs Omar de Torbal Dipper', 'Code_Bewijs_Omar_de_Torbal_DIPPER.pdf'),
            createDocument('Dipper Demo', 'dipperdemo.mov', 'video'),
            createDocument('Werkzaamheden VTV Sittard', 'Werkzaamhedenvtvsittard.pdf'),
        ],
        'B1-K1-W4': [
            createDocument('Stage Testrapport', '20220110stage_testrapport_(1).pdf'),
            createDocument('Dipper Demo', 'dipperdemo.mov', 'video'),
        ],
        'B1-K1-W5': [
            createDocument('Verbetervoorstellingen Dipper', 'Verbetervoorstellingen_DIPPER_07.pdf'),
            createDocument('Reflectie 30 Jan', 'reflectie30jan.pdf'),
            createDocument('Bespreekt Overlegen en Verbetervoorstellen', 'bespreektoverlegenverbetervoorstellen.mov', 'video'),
        ],
        'B1-K2-W1': [
            createDocument('GitHub Samenwerking Bewijsmateriaal', 'GITHUBSAMENWERKINGBEWIJSMATERIAAL.pdf'),
            createDocument('Verandering 24 Jan 2025 VTV', 'verandering24jan2025vtv_(2).pdf'),
            createDocument('Bespreekt Overlegen en Verbetervoorstellen', 'bespreektoverlegenverbetervoorstellen.mov', 'video'),
        ],
        'B1-K2-W2': [
            createDocument('GitHub Samenwerking Bewijsmateriaal', 'GITHUBSAMENWERKINGBEWIJSMATERIAAL.pdf'),
            createDocument('Screenshots UI Dipper', 'Screenshots_UI_DIPPER.pdf'),
            createDocument('Wendy Gesprek', 'wendygesprek.mov', 'video'),
        ],
        'B1-K2-W3': [
            createDocument('Reflectie DI Lab', 'reflectie_di_lab.pdf'),
            createDocument('Reflectie 30 Jan', 'reflectie30jan.pdf'),
        ],
    };

    const getCupDetail = (cupFile) => {
        const baseTitle = cupTitleMap[cupFile] || 'Selected Cup';
        const override = cupDetailOverrides[cupFile] || {};

        return {
            title: override.title || baseTitle,
            description:
                override.description ||
                `Replace this text with your own note for ${baseTitle}. You can also add an image, video, or PDF for this cup in static/cinematic.js.`,
            mediaType: override.mediaType || '',
            mediaSrc: override.mediaSrc || '',
            mediaAlt: override.mediaAlt || baseTitle,
        };
    };

    const clearDetailMedia = () => {
        if (detailPanel) {
            detailPanel.dataset.mediaType = 'none';
        }

        if (detailMediaShell) {
            detailMediaShell.dataset.mediaType = 'none';
        }

        detailMediaImage.hidden = true;
        detailMediaVideo.hidden = true;
        detailMediaPdf.hidden = true;
        detailMediaPlaceholder.hidden = false;

        detailMediaImage.removeAttribute('src');
        detailMediaImage.alt = '';
        detailMediaVideo.pause();
        detailMediaVideo.removeAttribute('src');
        detailMediaVideo.load();
        detailMediaPdf.removeAttribute('src');
    };

    const clearDocumentButtons = () => {
        if (detailDocList) {
            detailDocList.replaceChildren();
        }

        if (detailDocuments) {
            detailDocuments.hidden = true;
        }
    };

    const ensureCupDocumentLabel = (button) => {
        let documentLabel = button.querySelector('.ding-cup-documents');

        if (!documentLabel) {
            documentLabel = document.createElement('span');
            documentLabel.className = 'ding-cup-documents';
            button.appendChild(documentLabel);
        }

        return documentLabel;
    };

    const renderCupDocumentLabel = (button, documents) => {
        const documentLabel = ensureCupDocumentLabel(button);
        documentLabel.replaceChildren();

        documents.forEach((documentDetail) => {
            const labelLine = document.createElement('span');
            labelLine.className = 'ding-cup-doc-line';
            labelLine.textContent = documentDetail.title;
            documentLabel.appendChild(labelLine);
        });
    };

    const resetCupSlot = (slot, image) => {
        slot.hidden = true;
        slot.disabled = true;
        slot.classList.remove('is-selected');
        slot.removeAttribute('data-cup-file');
        slot.removeAttribute('data-cup-title');
        slot.removeAttribute('aria-label');
        image.removeAttribute('src');
        image.alt = '';
        renderCupDocumentLabel(slot, []);
    };

    const startDetailVideoPlayback = () => {
        const playVideo = () => {
            detailMediaVideo.defaultMuted = false;
            detailMediaVideo.muted = false;
            detailMediaVideo.volume = 1;

            const playback = detailMediaVideo.play();

            if (playback && typeof playback.catch === 'function') {
                playback.catch(() => {
                    detailMediaVideo.controls = true;
                });
            }
        };

        if (detailMediaVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            playVideo();
            return;
        }

        detailMediaVideo.addEventListener('canplay', playVideo, { once: true });
    };

    const renderDetailMedia = (detail) => {
        clearDetailMedia();

        if (!detail.mediaType || !detail.mediaSrc) {
            return;
        }

        if (detailPanel) {
            detailPanel.dataset.mediaType = detail.mediaType;
        }

        if (detailMediaShell) {
            detailMediaShell.dataset.mediaType = detail.mediaType;
        }

        detailMediaPlaceholder.hidden = true;

        if (detail.mediaType === 'image') {
            detailMediaImage.hidden = false;
            detailMediaImage.src = detail.mediaSrc;
            detailMediaImage.alt = detail.mediaAlt;
            return;
        }

        if (detail.mediaType === 'video') {
            detailMediaVideo.hidden = false;
            detailMediaVideo.autoplay = true;
            detailMediaVideo.defaultMuted = false;
            detailMediaVideo.muted = false;
            detailMediaVideo.volume = 1;
            detailMediaVideo.src = detail.mediaSrc;
            detailMediaVideo.load();

            startDetailVideoPlayback();

            return;
        }

        if (detail.mediaType === 'pdf') {
            detailMediaPdf.hidden = false;
            detailMediaPdf.src = detail.mediaSrc;
        }
    };

    const selectDocumentButton = (button) => {
        if (!detailDocList) {
            return;
        }

        detailDocList.querySelectorAll('.cup-detail-doc-btn').forEach((node) => {
            node.classList.remove('is-selected');
        });

        if (button) {
            button.classList.add('is-selected');
        }
    };

    const renderIngredientDocuments = (cupDetail, cupIndex) => {
        const documents = activeCupDocuments[cupIndex] || [];

        clearDocumentButtons();

        if (!documents.length || !detailDocList || !detailDocuments) {
            renderDetailMedia(cupDetail);
            return;
        }

        detailDocuments.hidden = false;

        documents.forEach((documentDetail, index) => {
            const docButton = document.createElement('button');
            docButton.type = 'button';
            docButton.className = 'cup-detail-doc-btn';
            docButton.textContent = documentDetail.title;
            docButton.addEventListener('click', () => {
                selectDocumentButton(docButton);
                renderDetailMedia(documentDetail);
            });
            detailDocList.appendChild(docButton);

            if (index === 0) {
                selectDocumentButton(docButton);
                renderDetailMedia(documentDetail);
            }
        });
    };

    const closeCupDetail = () => {
        if (selectedCupButton) {
            selectedCupButton.classList.remove('is-selected');
            selectedCupButton = null;
        }

        dingScreen.classList.remove('ding-detail-open');
        detailPanel.classList.remove('is-visible');
        detailPanel.setAttribute('aria-hidden', 'true');
        detailPanel.hidden = true;
        clearDocumentButtons();
        clearDetailMedia();
    };

    const openCupDetail = (button) => {
        const cupFile = button.dataset.cupFile;
        const cupImage = button.querySelector('.ding-cup');
        const cupIndex = dingCupButtons.indexOf(button);

        if (!cupFile || !cupImage || !cupImage.getAttribute('src') || cupIndex < 0) {
            return;
        }

        const detail = getCupDetail(cupFile);

        if (selectedCupButton && selectedCupButton !== button) {
            selectedCupButton.classList.remove('is-selected');
        }

        selectedCupButton = button;
        selectedCupButton.classList.add('is-selected');

        detailImage.src = cupImage.getAttribute('src');
        detailImage.alt = detail.title;
        detailTitle.textContent = detail.title;
        detailText.textContent = activeIngredientLabel
            ? `${detail.description} Documents sorted under ${activeIngredientLabel} are listed below when available.`
            : detail.description;
        renderIngredientDocuments(detail, cupIndex);

        dingScreen.classList.add('ding-detail-open');
        detailPanel.hidden = false;
        detailPanel.classList.add('is-visible');
        detailPanel.setAttribute('aria-hidden', 'false');
    };

    const applyCupSelection = (button) => {
        const cupSourceNode = button.querySelector('.ingredient-cups-data');
        activeIngredientCode = button.dataset.ingredientCode || '';
        activeIngredientLabel = button.querySelector('.ingredient-tag')?.textContent?.trim() || activeIngredientCode;
        activeCupDocuments = distributeAcrossCups(ingredientDocumentMap[activeIngredientCode] || []);
        const cupFiles = cupSourceNode?.dataset.cups
            ?.split(',')
            .map((value) => value.trim())
            .filter(Boolean) || [];

        dingCupButtons.forEach((slot, index) => {
            const image = dingCupImages[index];
            const cupFile = cupFiles[index];
            const cupDocuments = activeCupDocuments[index] || [];

            if (!cupFile || !cupDocuments.length) {
                resetCupSlot(slot, image);
                return;
            }

            const detail = getCupDetail(cupFile);
            slot.hidden = false;
            slot.disabled = false;
            slot.dataset.cupFile = cupFile;
            slot.dataset.cupTitle = detail.title;
            slot.setAttribute('aria-label', `Open ${detail.title} details`);
            image.src = `/static/pictures/cupsofcoffee/${cupFile}`;
            image.alt = detail.title;
            renderCupDocumentLabel(slot, cupDocuments);
        });
    };

    const closeCinematic = () => {
        closeCupDetail();
        dingBack.classList.remove('ding-back-visible');
        dingScreen.classList.remove('ding-visible');
        setTimeout(() => {
            overlay.classList.remove('cinematic-slidedown');
            panels.forEach((p) => p.classList.remove('panel-visible'));
            running = false;
        }, 600);
    };

    if (dingBack) {
        dingBack.addEventListener('click', closeCinematic);
    }

    if (detailClose) {
        detailClose.addEventListener('click', closeCupDetail);
    }

    dingCupButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (!button.dataset.cupFile) {
                return;
            }

            if (selectedCupButton === button && detailPanel.classList.contains('is-visible')) {
                closeCupDetail();
                return;
            }

            openCupDetail(button);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && detailPanel.classList.contains('is-visible')) {
            closeCupDetail();
        }
    });

    const runCinematic = (event) => {
        if (running) {
            return;
        }
        running = true;

        closeCupDetail();
        applyCupSelection(event.currentTarget);

        // Reset state
        overlay.classList.remove('cinematic-slidedown');
        panels.forEach((p) => p.classList.remove('panel-visible'));

        // Fade in black overlay
        overlay.classList.add('cinematic-visible');

        // Left panel slides in
        setTimeout(() => panels[0] && panels[0].classList.add('panel-visible'), 550);

        // Middle panel fades in
        setTimeout(() => panels[1] && panels[1].classList.add('panel-visible'), 1200);

        // Right panel fades in
        setTimeout(() => panels[2] && panels[2].classList.add('panel-visible'), 1850);

        // Slide all panels down → reveal ding screen
        setTimeout(() => {
            overlay.classList.add('cinematic-slidedown');

            // Once panels are off-screen, fade overlay out and show ding on top
            setTimeout(() => {
                overlay.classList.remove('cinematic-visible');
                dingScreen.classList.add('ding-visible');
            }, 500);

            // Show back button once ding screen is fully visible
            setTimeout(() => {
                dingBack.classList.add('ding-back-visible');
            }, 1100);
        }, 3400);
    };

    ingredientButtons.forEach((btn) => {
        btn.addEventListener('click', runCinematic);
    });
})();
