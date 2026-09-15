(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  if (finePointer) doc.body.classList.add('cursor-enhanced');

  const translations = {
    el: {
      navWork: 'Έργα', navCapabilities: 'Δυνατότητες', navAbout: 'Σχετικά', navContact: 'Επικοινωνία',
      availability: 'Διαθέσιμος για επιλεγμένα projects', role: 'Ψηφιακά Συστήματα<br>AI & Commerce',
      scroll: 'Κάνε scroll για εξερεύνηση', introLabel: 'Εισαγωγή',
      manifestoTitle: 'Μετατρέπω σύνθετες επιχειρησιακές ανάγκες σε συνδεδεμένα ψηφιακά συστήματα.',
      manifestoBody: 'Από AI αναζήτηση και μεγάλης κλίμακας ροές δεδομένων μέχρι e-commerce και ERP εφαρμογές, συνδυάζω product thinking, σχεδιασμό και υλοποίηση σε μία ενιαία πορεία παράδοσης.',
      aboutMe: 'Σχετικά με εμένα', selectedWork: 'Επιλεγμένα έργα', workTitle: 'Συστήματα χτισμένα πάνω σε πραγματικές λειτουργίες.',
      carvibeType: 'Πλατφόρμα automotive e-commerce', erpType: 'Custom σύστημα εμπορικής διαχείρισης',
      erpStatus: 'Λειτουργικό demo / ενεργή ανάπτυξη',
      erpSummary: 'Αποθήκη, πελάτες, προμηθευτές, πωλήσεις, αγορές, ταμείο, δικαιώματα, audit trail και αναφορές — σχεδιασμένα ως μία συνδεδεμένη εφαρμογή καθημερινής εργασίας.',
      capabilitiesLabel: 'Δυνατότητες', capabilitiesTitle: 'Όχι απλώς websites. Συνδεδεμένες λύσεις.',
      aiCopy: 'AI assistants, agents, prompt systems και αυτοματισμοί συνδεδεμένοι με πραγματικά προϊόντα, περιεχόμενο και επιχειρησιακές διαδικασίες.',
      dataCopy: 'Μαζική εξαγωγή κωδικών προϊόντων, επεξεργασία XML και CSV, APIs, συγχρονισμός καταλόγων και ελεγχόμενες μεταφορές δεδομένων.',
      erpCopy: 'Εργαλεία λειτουργίας προσαρμοσμένα σε αποθήκη, πωλήσεις, αγορές, οικονομικά, αναφορές, δικαιώματα και καθημερινή εργασία.',
      commerceCopy: 'Κατάλογοι μεγάλου όγκου, έξυπνη αναζήτηση, vehicle fitment, custom plugins, checkout και customer journeys.',
      creativeCopy: 'Responsive interfaces, κίνηση, 3D/WebGL εμπειρίες, video και οπτικό περιεχόμενο με ενσωματωμένη βελτιστοποίηση.',
      growthCopy: 'Technical SEO, GEO/AEO, analytics, structured data και βελτιστοποίηση συνδεδεμένα με μετρήσιμα αποτελέσματα.',
      credentialsLabel: 'Πιστοποιήσεις', credentialsTitle: 'Γνώση που μετατρέπεται σε λειτουργικά συστήματα.',
      aboutLabel: 'Σχετικά', aboutTitle: 'Δουλεύω εκεί που συναντιούνται η επιχειρησιακή λογική, η τεχνολογία και η εμπειρία.',
      aboutCopy: 'Είμαι ο Γιώργος Αθανασόπουλος, Digital Solutions Specialist με βάση την Αθήνα. Μαθαίνω μία επιχείρηση από μέσα, εντοπίζω τι την καθυστερεί και κατασκευάζω το σύστημα που κάνει το επόμενο βήμα απλούστερο.',
      contactLabel: 'Επικοινωνία', contactTitle: 'Έχεις μία σύνθετη ιδέα;', contactAction: 'Ας την κάνουμε να λειτουργήσει.',
      footerNote: 'Σχεδιάστηκε και κατασκευάστηκε ως αυθεντική ψηφιακή εμπειρία.', backTop: 'Επιστροφή στην αρχή'
    }
  };

  const revealItems = [...doc.querySelectorAll('[data-reveal]')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  let locale = 'en';
  const languageButton = doc.querySelector('#language-toggle');
  languageButton?.addEventListener('click', () => {
    locale = locale === 'en' ? 'el' : 'en';
    root.lang = locale;
    languageButton.textContent = locale.toUpperCase();
    languageButton.setAttribute('aria-label', locale === 'el' ? 'Switch to English' : 'Switch to Greek');
    doc.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (!element.dataset.en) element.dataset.en = element.innerHTML;
      element.innerHTML = locale === 'el' && translations.el[key] ? translations.el[key] : element.dataset.en;
    });
  });

  const menuButton = doc.querySelector('.menu-toggle');
  const mobileMenu = doc.querySelector('#mobile-menu');
  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (mobileMenu) mobileMenu.hidden = !open;
    doc.body.classList.toggle('menu-open', open);
    if (open) mobileMenu?.querySelector('a')?.focus();
    else if (doc.activeElement?.closest?.('#mobile-menu')) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  let audioContext = null;
  let soundEnabled = false;
  const soundButton = doc.querySelector('#sound-toggle');
  const soundLabel = soundButton?.querySelector('.sound-label');
  const playTone = (frequency = 310, duration = .055) => {
    if (!soundEnabled) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, audioContext.currentTime + duration);
    gain.gain.setValueAtTime(.028, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };
  soundButton?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.setAttribute('aria-label', soundEnabled ? 'Disable interface sounds' : 'Enable interface sounds');
    if (soundLabel) soundLabel.textContent = soundEnabled ? 'ON' : 'OFF';
    if (soundEnabled) playTone(260, .12);
  });
  doc.querySelectorAll('[data-sound]').forEach((element) => element.addEventListener('pointerdown', () => playTone(350)));

  if (finePointer) {
    const dot = doc.querySelector('.cursor-dot');
    const ring = doc.querySelector('.cursor-ring');
    const ringLabel = ring?.querySelector('span');
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    addEventListener('pointermove', (event) => { mouseX = event.clientX; mouseY = event.clientY; });
    const animateCursor = () => {
      ringX += (mouseX - ringX) * .16;
      ringY += (mouseY - ringY) * .16;
      if (dot) dot.style.transform = `translate3d(${mouseX - 2.5}px,${mouseY - 2.5}px,0)`;
      if (ring) ring.style.transform = `translate3d(${ringX - ring.offsetWidth / 2}px,${ringY - ring.offsetHeight / 2}px,0)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    doc.querySelectorAll('a, button, [data-cursor]').forEach((element) => {
      element.addEventListener('pointerenter', () => {
        ring?.classList.add('is-active');
        if (ringLabel) ringLabel.textContent = element.dataset.cursor || (element.matches('a') ? 'OPEN' : 'SELECT');
      });
      element.addEventListener('pointerleave', () => ring?.classList.remove('is-active'));
    });
  }

  if (finePointer && !reducedMotion) {
    doc.querySelectorAll('.magnetic').forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .18;
        const y = (event.clientY - rect.top - rect.height / 2) * .18;
        item.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      item.addEventListener('pointerleave', () => { item.style.transform = ''; });
    });

    doc.querySelectorAll('[data-project-card] .project-media').forEach((media) => {
      media.addEventListener('pointermove', (event) => {
        const rect = media.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - .5) * -2.2;
        const ry = ((event.clientX - rect.left) / rect.width - .5) * 2.2;
        media.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      media.addEventListener('pointerleave', () => { media.style.transform = ''; });
    });
  }

  doc.querySelector('#current-year').textContent = new Date().getFullYear();
})();
