document.addEventListener('DOMContentLoaded', () => {
  /* ================= AMBIL ELEMEN ================= */
  const overlay       = document.getElementById('musicOverlay');
  const screenTyping  = document.getElementById('screenTyping');
  const screenLove    = document.getElementById('screenLove');
  const screenSlides  = document.getElementById('screenSlides');
  const screenMessage = document.getElementById('screenMessage');
  const screenThanks  = document.getElementById('screenThanks');
  const typedText     = document.getElementById('typedText');
  const loveRainBox   = document.getElementById('loveRain');
  const music         = document.getElementById('bgMusic');
  const messageInner  = document.querySelector('.message-inner');
  const messageText   = document.getElementById('messageText');
  const stickerStage  = document.getElementById('stickerStage');

  if (!screenTyping || !screenLove || !screenSlides || !screenMessage || !screenThanks) {
    console.error('Elemen layar tidak ditemukan! Cek index.html');
    return;
  }

  /* ================= KONFIGURASI ================= */
  const TEXT = 'Untuk Novita Dewi Alfiah';
  const PESAN = `Aku nggak pernah nyangka bisa sedekat ini sama kamu.
Bersyukur banget bisa kenal dan dekat sama orang sebaik kamu.

Makasih ya, udah jadi alasan aku buat senyum tiap hari.
Aku cukup — cukup bahagia, cukup tenang, cukup semuanya, asal sama kamu. 🤍`;

  const SLIDE_DURATION   = 5000;
  const MESSAGE_DURATION = 6000;

  let musicStarted = false;
  let typingStarted = false;
  let tapped = false;
  let messageShown = false;
  let thanksShown = false;

  /* ================= FUNGSI MULAI MUSIK ================= */
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    if (!music) return;
    try {
      music.volume = 1;
      music.currentTime = 0;
      const p = music.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => console.warn('Musik gagal:', err));
      }
    } catch (e) { console.warn('Musik error:', e); }

    // sembunyikan overlay
    if (overlay) overlay.classList.add('hidden');
  }

  /* ================= OVERLAY PEMICU ================= */
  // Ketuk di mana saja pada overlay → musik main + sembunyikan overlay
  if (overlay) {
    overlay.addEventListener('click', startMusic);
    overlay.addEventListener('touchstart', startMusic, { passive: true });
  }

  /* ================= LAYAR 1: KETIKAN (mulai otomatis) ================= */
  function typeWriter(text, el, speed, callback) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  }

  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    setTimeout(() => {
      typeWriter(TEXT, typedText, 110, () => {
        setTimeout(goToLoveScreen, 1300);
      });
    }, 400);
  }

  // Ketikan langsung jalan saat halaman dibuka (overlay tetap di atas)
  startTyping();

  function goToLoveScreen() {
    screenTyping.classList.remove('active');
    setTimeout(() => screenLove.classList.add('active'), 500);
  }

  /* ================= KLIK LOVE ================= */
  screenLove.addEventListener('click', handleLoveTap);
  screenLove.addEventListener('touchstart', handleLoveTap, { passive: true });

  function handleLoveTap(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (tapped) return;
    tapped = true;

    // pastikan musik tetap jalan
    if (music && music.paused) {
      try { music.play().catch(()=>{}); } catch(err){}
    }
    // sembunyikan overlay kalau masih ada
    if (overlay && !musicStarted) startMusic();

    startLoveRain();

    setTimeout(() => {
      screenLove.classList.remove('active');
      setTimeout(() => {
        screenSlides.classList.add('active');
        startSlideshow();
      }, 500);
    }, 1200);
  }

  /* ================= HUJAN LOVE ================= */
  const HEARTS = ['❤️','💖','💕','💗','💓','🩷','💘'];
  function startLoveRain() {
    if (!loveRainBox) return;
    for (let i = 0; i < 60; i++) {
      setTimeout(createHeart, i * 45);
    }
    setTimeout(() => { loveRainBox.innerHTML = ''; }, 7000);
  }
  function createHeart() {
    const h = document.createElement('div');
    h.className = 'rain-heart';
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (16 + Math.random() * 20) + 'px';
    const dur = 2.5 + Math.random() * 2.5;
    h.style.animationDuration = dur + 's';
    loveRainBox.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 200);
  }

  /* ================= SLIDESHOW ================= */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function startSlideshow() {
    if (!slides.length) return;
    showSlide(0);
    currentSlide = 0;

    slideTimer = setInterval(() => {
      currentSlide++;
      if (currentSlide < slides.length) {
        showSlide(currentSlide);
      } else {
        clearInterval(slideTimer);
        setTimeout(showMessageScreen, 900);
      }
    }, SLIDE_DURATION);
  }

  /* ================= LAYAR 4: PESAN SYUKUR ================= */
  function showMessageScreen() {
    if (messageShown) return;
    messageShown = true;

    screenSlides.classList.remove('active');
    if (messageText) messageText.textContent = PESAN;

    setTimeout(() => {
      screenMessage.classList.add('active');
      if (messageInner) setTimeout(() => messageInner.classList.add('show'), 150);
      setTimeout(showThanksScreen, MESSAGE_DURATION);
    }, 600);
  }

  /* ================= LAYAR 5: TERIMA KASIH ================= */
  function showThanksScreen() {
    if (thanksShown) return;
    thanksShown = true;

    screenMessage.classList.remove('active');

    setTimeout(() => {
      screenThanks.classList.add('active');
      startStickers();
    }, 600);
  }

  /* ================= STIKER LUCU ================= */
  const CUTE_STICKERS = ['🐱','🐰','🐻','🐼','🐨','🦊','🐶','🐧','🐸','🐹'];

  function startStickers() {
    if (!stickerStage) return;
    for (let i = 0; i < 10; i++) createBouncySticker();
    let fallCount = 0;
    const fallInterval = setInterval(() => {
      createFallingSticker();
      fallCount++;
      if (fallCount > 40) clearInterval(fallInterval);
    }, 220);
  }

  function createBouncySticker() {
    const s = document.createElement('div');
    s.className = 'sticker';
    s.textContent = CUTE_STICKERS[Math.floor(Math.random() * CUTE_STICKERS.length)];
    s.style.left = (5 + Math.random() * 85) + 'vw';
    s.style.top  = (10 + Math.random() * 70) + 'vh';
    s.style.fontSize = (28 + Math.random() * 22) + 'px';
    s.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    stickerStage.appendChild(s);
  }

  function createFallingSticker() {
    const s = document.createElement('div');
    s.className = 'sticker-fall';
    s.textContent = CUTE_STICKERS[Math.floor(Math.random() * CUTE_STICKERS.length)];
    s.style.left = Math.random() * 95 + 'vw';
    s.style.fontSize = (22 + Math.random() * 18) + 'px';
    const dur = 3 + Math.random() * 2.5;
    s.style.animationDuration = dur + 's';
    stickerStage.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000 + 300);
  }

});