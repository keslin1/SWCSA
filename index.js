// ===============================================================
//  index.js — Les Cayes Dropshipping v2.0
//  Tout lojik JavaScript pou paj dakèy (index.html)
//  NOUVO : Chatlcd IA, TopBar itilizatè, CTA Enskripsyon
//  PRESÈVE : Tout localStorage existant (lcd_user_balance, trading, etc.)
// ===============================================================

// ── PAGE LOADER ──────────────────────────────────────────────
window.goTo = function (url) {
  document.getElementById('page-loader').classList.add('show');
  setTimeout(function () { window.location.href = url; }, 480);
};

window.addEventListener('load', function () {
  var l = document.getElementById('page-loader');
  if (l) l.classList.remove('show');

  // Masque splash screen
  var s = document.getElementById('splash-screen');
  if (s) {
    setTimeout(function () {
      s.classList.add('hide');
      setTimeout(function () { s.remove(); }, 500);
    }, 600);
  }
});

// ── DRAWER ───────────────────────────────────────────────────
window.openDrawer = function () {
  document.getElementById('app-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  syncDrw();
};

window.closeDrawer = function () {
  document.getElementById('app-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
};

// Swipe gesture pour drawer (slide depuis bord gauche)
(function () {
  var sx = 0;
  document.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var d = document.getElementById('app-drawer');
    if (d.classList.contains('open') && dx < -60) closeDrawer();
    if (!d.classList.contains('open') && sx < 30 && dx > 60) openDrawer();
  }, { passive: true });
})();

// Synchronise drawer avec profil itilizatè
function syncDrw() {
  var p = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
  var n = document.getElementById('drw-nom');
  var l = document.getElementById('drw-loc');
  var b = document.getElementById('drw-balance');

  if (n) {
    var nm = (p.nom || '').trim();
    n.textContent = nm ? (nm.length > 20 ? nm.substring(0, 18) + '...' : nm) : 'Les Cayes Dropshipping';
  }
  if (l) {
    l.textContent = p.address
      ? p.address.split(',')[0].split(' ').slice(0, 2).join(' ')
      : 'Haiti-Sud';
  }
  if (b) {
    var sb = localStorage.getItem('lcd_user_balance');
    var ep = localStorage.getItem('lcd_epargne_montant');
    if (sb !== null && sb !== '') b.textContent = '$' + parseFloat(sb).toFixed(2);
    else if (ep !== null && ep !== '') b.textContent = parseFloat(ep).toFixed(2) + ' HTG';
    else b.textContent = 'Wè Tranzaksyon';
  }
}

// ── LOGOUT ───────────────────────────────────────────────────
// NOTE: Pa efase trading, lcd_user_balance, lcd_epargne_montant
window.logOut = function () {
  if (!confirm('Dekonekte?')) return;
  localStorage.removeItem('lcd_user_registered');
  closeDrawer();
  window.location.reload();
};

// Afiche overlay enskripsyon si itilizatè a vle kreye kont
window.showRegistrationOverlay = function () {
  var ov = document.getElementById('registration-overlay');
  if (ov) {
    ov.classList.remove('hidden');
    ov.style.opacity = '1';
  }
};

// ── NOTIFICATION DOT (top bar) ───────────────────────────────
function syncDot() {
  var m = JSON.parse(localStorage.getItem('lcd_user_messages') || '[]');
  var u = m.filter(function (x) { return !x.read; }).length;
  var d = document.getElementById('tb-dot');
  if (d) d.style.display = u > 0 ? 'block' : 'none';
}

// ── TOP BAR : Afiche non ak adrès itilizatè si konekte ───────
function refreshTopBar() {
  var profile  = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
  var titleEl  = document.getElementById('top-bar-title');
  if (!titleEl) return;

  // Si itilizatè gen non oswa adrès, montre yo nan top bar
  var nom    = (profile.nom || '').trim();
  var adress = (profile.address || '').trim();

  if (nom) {
    var vilAff = adress ? ' · ' + adress.split(',')[0].split(' ')[0] : '';
    titleEl.textContent = nom.length > 14 ? nom.substring(0, 12) + '...' + vilAff : nom + vilAff;
  } else {
    titleEl.textContent = 'Les Cayes Drop...';
  }
}

// ===== KONFIGIRASYON JENERAL =====
const MESSAGE_KEY = 'lcd_user_messages';
let baseLikes = 52;

// ===== SISTÈM LIKE =====
function initLikeSystem() {
  const likeCountElem = document.getElementById('like-count');
  const likeIcon      = document.getElementById('like-icon');
  const userHasLiked  = localStorage.getItem('user_has_liked') === 'true';

  let current  = 1;
  const duration = 1000;
  const interval = duration / baseLikes;

  const counter = setInterval(() => {
    current++;
    let displayTotal = userHasLiked ? (current + 1) : current;
    if (likeCountElem) likeCountElem.textContent = displayTotal;

    if (current >= baseLikes) {
      clearInterval(counter);
      if (userHasLiked && likeIcon) {
        likeIcon.textContent  = 'thumb_up';
        likeIcon.style.color  = '#5D4037';
      }
    }
  }, interval);
}

window.toggleLike = function () {
  const likeIcon      = document.getElementById('like-icon');
  const likeCountElem = document.getElementById('like-count');
  const sound         = document.getElementById('like-sound');

  let isLiked = localStorage.getItem('user_has_liked') === 'true';

  if (!isLiked) {
    if (sound) { sound.currentTime = 0; sound.play(); }
    if (likeIcon) {
      likeIcon.textContent          = 'thumb_up';
      likeIcon.style.color          = '#5D4037';
      likeIcon.style.transform      = "scale(1.3)";
      setTimeout(() => { likeIcon.style.transform = "scale(1)"; }, 200);
    }
    if (likeCountElem) likeCountElem.textContent = baseLikes + 1;
    localStorage.setItem('user_has_liked', 'true');
  } else {
    if (likeIcon) {
      likeIcon.textContent = 'thumb_up_off_alt';
      likeIcon.style.color = 'var(--bleu-marin)';
    }
    if (likeCountElem) likeCountElem.textContent = baseLikes;
    localStorage.setItem('user_has_liked', 'false');
  }
};

// ===== GESTION DU PROFIL ET DU HEADER =====
function refreshHeader() {
  const profile  = JSON.parse(localStorage.getItem('user_profile_data')) || {};
  const nameElem = document.getElementById('user-display-name');
  const cityElem = document.getElementById('user-display-city');

  if (profile.nom && nameElem) {
    let nomAntye = profile.nom.trim();
    nameElem.textContent = nomAntye.length > 12
      ? nomAntye.substring(0, 10) + "..."
      : nomAntye;
  } else if (nameElem) {
    nameElem.textContent = "Les Cayes Dropshipping";
  }

  if (profile.address && cityElem) {
    let vilNet = profile.address.split(',')[0].trim().split(' ')[0];
    cityElem.textContent = vilNet.length > 10
      ? vilNet.substring(0, 8) + "..."
      : vilNet;
  } else if (cityElem) {
    cityElem.textContent = "Haïti-Sud";
  }
}

// ===== BADGE FOOTER (MESAJ) =====
function updateHomeBadge() {
  const messages    = JSON.parse(localStorage.getItem('lcd_user_messages')) || [];
  const unreadCount = messages.filter(m => !m.read).length;
  const footerBadge = document.getElementById('footer-badge');
  if (footerBadge) {
    footerBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    footerBadge.textContent   = unreadCount;
  }
}

function updateNotifBadges() {
  try {
    const messages    = JSON.parse(localStorage.getItem('lcd_user_messages')) || [];
    const unreadCount = messages.filter(m => !m.read).length;
    const footerBadge = document.getElementById('footer-badge');
    if (footerBadge) {
      if (unreadCount > 0) {
        footerBadge.style.display = 'block';
        footerBadge.textContent   = unreadCount;
      } else {
        footerBadge.style.display = 'none';
        footerBadge.textContent   = '';
      }
    }
  } catch(e) {}
}

// ===== GESTION DES NOTIFICATIONS =====
function requestPermission() {
  if (!("Notification" in window)) {
    alert("Navigatè sa a pa sipòte notifikasyon.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      localStorage.setItem('notif_accepted', 'true');
      femenModalNotif();
      new Notification("Sistèm Aktive ✅", {
        body: "Ou kapab resevwa mesaj Les Cayes Dropshipping yo kounya.",
        icon: "/lescayesdropshipping.png",
        badge: "/lescayesdropshipping.png"
      });
    } else {
      refuseAccess();
    }
  });
}

function refuseAccess() {
  alert("Atansyon! Aplikasyon Les Cayes Dropshipping lan pa ka fonksyone san notifikasyon yo. Sa a nesesè pou sekirite ak swivi koli ou yo.");
}

function femenModalNotif() {
  const modal = document.getElementById('notif-modal');
  if (modal) modal.style.setProperty('display', 'none', 'important');
}

window.requestPermission = requestPermission;
window.refuseAccess      = refuseAccess;

// ===== ANIMASYON CAROUSEL BANNER (CHAK 10 SEKOND) =====
function initBannerCarousel() {
  const carousel  = document.getElementById('banner-carousel');
  const container = carousel ? carousel.querySelector('.carousel-container') : null;
  if (!carousel || !container) return;

  let scrollAmount = 0;
  const items      = container.querySelectorAll('.carousel-item');
  const totalItems = items.length;

  setInterval(() => {
    const itemWidth = items[0].offsetWidth + 15;
    if (scrollAmount >= (itemWidth * (totalItems - 1))) {
      scrollAmount = 0;
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollAmount += itemWidth;
      carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, 10000);
}

// ===== MODALS =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

window.onclick = function (event) {
  if (event.target.className === 'modal') {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

window.openModal  = openModal;
window.closeModal = closeModal;

// ===== SISTÈM AVIS KLIYAN =====

function getRefDate(daysAgo, minutesAgo) {
  minutesAgo = minutesAgo || 0;
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.getTime();
}

function formatDateRelative(timestamp) {
  const now        = Date.now();
  const diffMs     = now - timestamp;
  const diffMin    = Math.floor(diffMs / 60000);
  const diffHours  = Math.floor(diffMs / 3600000);
  const diffDays   = Math.floor(diffMs / 86400000);
  const diffWeeks  = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMin < 2)       return "kounye a";
  if (diffMin < 60)      return "sa gen " + diffMin + " minit";
  if (diffHours < 24)    return "sa gen " + diffHours + " è";
  if (diffDays === 1)    return "yè";
  if (diffDays === 2)    return "avan-yè";
  if (diffDays < 7)      return diffDays + " jou pase";
  if (diffWeeks === 1)   return "1 semèn pase";
  if (diffWeeks < 5)     return diffWeeks + " semèn pase";
  if (diffMonths === 1)  return "1 mwa pase";
  if (diffMonths < 12)   return diffMonths + " mwa pase";
  return "plis pase 1 an";
}

const simulationAvis = [
  { id: 101, non: "Valpare B.", stars: 5, text: "impotan pou biznis mw, psk ak ansyen transpo an m patka rantre kob m envesti yo.", publishedAt: getRefDate(3) },
  { id: 102, non: "Claire Suze D.", stars: 5, text: "Pinga warehouse sa vin bay pwob nn mesye Thomas!", publishedAt: getRefDate(1) },
  { id: 103, non: "Steeve P.", stars: 4, text: "m swete aprè 4,90 lan pa gen lòt frè, bon bgy.", publishedAt: getRefDate(5) },
  { id: 104, non: "Samuel H.", stars: 5, text: "Ou konn sa wap f an mister Thomas, nou avèw 👍. Livrezon an yon ti jan long, men nap avanse brother.", publishedAt: getRefDate(0, 45) },
  { id: 105, non: "Laika V.", stars: 4, text: "Ebyen gen espwa pou store mwen an la 😂🤣.", publishedAt: getRefDate(21) },
  { id: 106, non: "Tania S.", stars: 2, text: "Nanpwen anak, asistans red red. Machandiz mw rive an plizye okazyon, men yo rive san manke anyen.", publishedAt: getRefDate(59) },
  { id: 107, non: "Ricardo J.", stars: 1, text: "Okazyn chak mwa sèlman ki pwoblm pu mw, men pou pri a, sekirite; pa gen plenyen.", publishedAt: getRefDate(2) }
];

function buildStars(avisId, currentStars, isInteractive) {
  let html = '<span class="stars-row">';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= currentStars ? 'star' : 'star_border';
    const color  = i <= currentStars ? '#FFD700' : '#ccc';
    if (isInteractive) {
      html += `<i class="material-icons star-vote" 
                  style="font-size:18px; color:${color}; cursor:pointer;"
                  onclick="voterAvis(${avisId}, ${i})"
                  onmouseover="hoverStars(${avisId}, ${i})"
                  onmouseout="resetStarHover(${avisId})"
                  data-val="${i}">${filled}</i>`;
    } else {
      html += `<i class="material-icons" style="font-size:14px; color:${color};">${filled}</i>`;
    }
  }
  html += '</span>';
  return html;
}

window.voterAvis = function (avisId, nouvoStars) {
  let votes = JSON.parse(localStorage.getItem('avis_votes')) || {};
  votes[avisId] = nouvoStars;
  localStorage.setItem('avis_votes', JSON.stringify(votes));
  aficheAvis();
};

window.hoverStars = function (avisId, hoverVal) {
  const card = document.getElementById('comment-' + avisId);
  if (!card) return;
  card.querySelectorAll('.star-vote').forEach(star => {
    const val = parseInt(star.getAttribute('data-val'));
    star.textContent = val <= hoverVal ? 'star' : 'star_border';
    star.style.color = val <= hoverVal ? '#FFD700' : '#ccc';
  });
};

window.resetStarHover = function (avisId) {
  const votes = JSON.parse(localStorage.getItem('avis_votes')) || {};
  const stars = votes[avisId] || simulationAvis.find(a => a.id === avisId)?.stars || 0;
  const card  = document.getElementById('comment-' + avisId);
  if (!card) return;
  card.querySelectorAll('.star-vote').forEach(star => {
    const val = parseInt(star.getAttribute('data-val'));
    star.textContent = val <= stars ? 'star' : 'star_border';
    star.style.color = val <= stars ? '#FFD700' : '#ccc';
  });
};

// Genere initiales pour avatar
function getInitials(name) {
  return name ? name.split(' ').map(p => p[0]).join('').substring(0,2).toUpperCase() : '?';
}

// Afiche tout avis — design v2.0 avec avatar initiales
function aficheAvis() {
  const container = document.getElementById('comments-container');
  if (!container) return;

  let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
  let votes     = JSON.parse(localStorage.getItem('avis_votes')) || {};
  const toutAvis = [...localAvis, ...simulationAvis];

  container.innerHTML = toutAvis.map(a => {
    const isUser       = localAvis.some(la => la.id === a.id);
    const starsAffiche = votes[a.id] !== undefined ? votes[a.id] : (a.stars || 0);
    const dateAffiche  = a.publishedAt
      ? formatDateRelative(a.publishedAt)
      : formatDateRelative(a.id);
    const starsHTML  = buildStars(a.id, starsAffiche, true);
    const initials   = getInitials(a.non);

    return `
    <div class="comment-card" id="comment-${a.id}">
      <div class="comment-author">
        <div class="comment-avatar">${initials}</div>
        <span class="comment-name">${a.non}</span>
        ${starsHTML}
      </div>
      <p class="comment-text" id="text-${a.id}">${a.text}</p>
      <div class="comment-footer">
        <span class="comment-date">${dateAffiche}</span>
        ${isUser ? `
          <div class="user-actions">
            <button onclick="prepareEdit(${a.id})">Modifye</button>
            <button onclick="effacerAvis(${a.id})" style="color:red">Efase</button>
          </div>
        ` : ''}
      </div>
    </div>`;
  }).join('');
}

window.ajouterAvis = function () {
  const textInput = document.getElementById('user-comment');
  const text      = textInput.value;
  const editId    = textInput.getAttribute('data-edit-id');
  if (text.trim() === "") return;

  const profile  = JSON.parse(localStorage.getItem('user_profile_data')) || {};
  const userName = profile.fullname || profile.nom || "Oumenm";
  let localAvis  = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];

  if (editId) {
    localAvis = localAvis.map(a => a.id == editId ? {...a, text: text} : a);
    textInput.removeAttribute('data-edit-id');
  } else {
    localAvis.unshift({
      id: Date.now(),
      non: userName,
      text: text,
      stars: 0,
      publishedAt: Date.now()
    });
  }

  localStorage.setItem('user_simulated_avis', JSON.stringify(localAvis));
  textInput.value = "";
  aficheAvis();
};

window.prepareEdit = function (id) {
  let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
  const avis    = localAvis.find(a => a.id == id);
  if (avis) {
    const input = document.getElementById('user-comment');
    input.value = avis.text;
    input.setAttribute('data-edit-id', id);
    input.focus();
  }
};

window.effacerAvis = function (id) {
  if (confirm("Èske ou vle efase kòmantè sa a?")) {
    let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
    localAvis     = localAvis.filter(a => a.id != id);
    localStorage.setItem('user_simulated_avis', JSON.stringify(localAvis));
    aficheAvis();
  }
};



// ===== KALKIL PWA VOLIMIK + PWA BALANS =====
window.kalkile = function() {
    const L = parseFloat(document.getElementById('L')?.value) || 0;
    const l = parseFloat(document.getElementById('l')?.value) || 0;
    const H = parseFloat(document.getElementById('H')?.value) || 0;
    const pwaBalans = parseFloat(document.getElementById('pwa_balans')?.value) || 0;

    const pwaVolimik = (L * l * H) / 4000;
    let pwaFinal = pwaVolimik + pwaBalans;

    if (pwaFinal > 0) {
        let tarif = 4.90;
        if (pwaFinal >= 50) { tarif = 3.99; }
        const priTotal = pwaFinal * tarif;
        const dat = new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});

        const pRes = document.getElementById('p_res');
        const prRes = document.getElementById('pr_res');
        const tarifRes = document.getElementById('tarif_res');
        const currentRes = document.getElementById('currentRes');

        if (pRes) pRes.innerText = pwaFinal.toFixed(2) + " lb";
        if (prRes) prRes.innerText = priTotal.toFixed(2);
        if (tarifRes) tarifRes.innerText = "Tarif: $" + tarif + "/lb";
        if (currentRes) currentRes.style.display = 'block';
        if (typeof addHistory === 'function') addHistory(pwaFinal.toFixed(2), priTotal.toFixed(2), dat);
    }
};

// ===== INICIALIZASYON JENERAL LÈ PAJ LA CHAJE =====
document.addEventListener('DOMContentLoaded', () => {
  const regOverlay   = document.getElementById('registration-overlay');
  const regForm      = document.getElementById('registration-form');
  const installBanner = document.getElementById('install-banner');
  const installBtn   = document.getElementById('install-btn');
  let deferredPrompt;

  // 1. Tcheke si itilizatè a te deja konekte
  const isRegistered = localStorage.getItem('lcd_user_registered') === 'true';
  if (isRegistered) {
    if (regOverlay) regOverlay.classList.add('hidden');
  }

  // Affiche/masque la section CTA inscription
  const registerCTA = document.getElementById('register-cta');
  if (registerCTA) {
    registerCTA.classList.toggle('hidden', isRegistered);
  }

  // 2. Fonksyon pou kache Overlay a ak yon bèl tranzisyon
  function hideLoginOverlay() {
    if (!regOverlay) return;
    regOverlay.style.transition = 'opacity 0.5s ease';
    regOverlay.style.opacity    = '0';
    setTimeout(() => { regOverlay.classList.add('hidden'); }, 500);
    // Cache le CTA une fois inscrit
    if (registerCTA) registerCTA.classList.add('hidden');
  }

  // 3. Submit fòm enskripsyon — Profil konplè + Web3Forms
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nomVal       = (document.getElementById('reg-nom')?.value || '').trim();
      const emailVal     = (document.getElementById('reg-email')?.value || '').trim();
      const telVal       = (document.getElementById('reg-telephone')?.value || '').trim();
      const adressVal    = (document.getElementById('reg-address')?.value || '').trim();
      const refVal       = (document.getElementById('reg-reference')?.value || '').trim();

      if (!nomVal || !emailVal || !telVal || !adressVal || !refVal) return;

      // Sove pwofil konplè nan Kont (localStorage)
      let profile = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
      profile.nom       = nomVal;
      profile.email     = emailVal;
      profile.telephone = telVal;
      profile.address   = adressVal;
      profile.reference = refVal;
      localStorage.setItem('user_profile_data', JSON.stringify(profile));
      localStorage.setItem('lcd_user_registered', 'true');

      // Voye done yo sou Web3Forms (asenkwòn, pa bloke UI)
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '2ded0ed8-8bdb-4249-b804-ee4e27c06e8d',
            subject: 'Nouvo kont LCD — ' + nomVal,
            from_name: 'Les Cayes Dropshipping App',
            nom: nomVal,
            email: emailVal,
            telephone: telVal,
            adresse: adressVal,
            reference: refVal
          })
        });
      } catch(err) { console.log('Web3Forms err:', err); }

      hideLoginOverlay();
      refreshTopBar();
    });
  }

  // 4. Jesyon fenèt enstalasyon an
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!window.matchMedia('(display-mode: standalone)').matches) {
      if (installBanner) installBanner.classList.remove('hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted' && installBanner) {
          installBanner.classList.add('hidden');
        }
        deferredPrompt = null;
      }
    });
  }

  // 5. Cache badge NEW si moun nan te deja vizite transaction.html
  var newBadge = document.getElementById('new-badge');
  if (newBadge && localStorage.getItem('transaction_visited') === 'true') {
    newBadge.style.display = 'none';
  }

  // 6. (Splash screen de retour supprimé)

  // 7. Sistèm Like
  initLikeSystem();

  // 8. Header (non ak vil) + TopBar itilizatè
  refreshHeader();
  refreshTopBar();

  // 9. Badge mesaj + dot
  updateNotifBadges();
  syncDot();

  // 10. Avis kliyan
  aficheAvis();

  // 11. Carousel
  initBannerCarousel();

  // 12. Modal notifikasyon
  const dejaAksepteMemwa = localStorage.getItem('notif_accepted');
  const pèmisyonSistèm   = Notification.permission;

  if (pèmisyonSistèm === 'granted' || dejaAksepteMemwa === 'true') {
    femenModalNotif();
  } else {
    const modal = document.getElementById('notif-modal');
    if (modal) modal.style.display = 'flex';
  }

  // 13. Sync drawer (si drawer déjà ouvert)
  syncDrw();
});

// ===============================================================
//  INVENTÈ ATIK — openInv / closeInv / invAdd / invRender
//  / invEdit / invDelete / invClear / invCapture (export JPG)
//  NOTE : L'inventaire a maintenant sa propre page (inventaire.html)
//  Ces fonctions restent ici pour compatibilité si nécessaire
// ===============================================================

const INV_KEY = 'lcd_inventaire';

function invLoad() {
  return JSON.parse(localStorage.getItem(INV_KEY) || '[]');
}

function invSave(data) {
  localStorage.setItem(INV_KEY, JSON.stringify(data));
}

function invRender() {
  const tbody = document.getElementById('inv-tbody');
  if (!tbody) return;
  const items = invLoad();

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#aaa;padding:20px;">Pa gen atik pou kounye a</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, i) => `
    <tr>
      <td class="inv-td-num">${i + 1}</td>
      <td class="inv-td-nom">${escHtml(item.desc)}</td>
      <td class="inv-td-desc">${escHtml(item.tracking || '—')}</td>
      <td class="inv-td-date">${item.date ? formatInvDate(item.date) : '—'}</td>
      <td class="inv-td-del inv-hide-cap" style="display:flex;gap:6px;align-items:center;">
        <button class="inv-edit-btn" onclick="invEdit(${item.id})" title="Modifye">
          <span class="material-icons" style="font-size:14px;">edit</span>
        </button>
        <button class="inv-del-btn" onclick="invDelete(${item.id})" title="Efase">
          <span class="material-icons" style="font-size:14px;">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatInvDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

window.openInv = function () {
  // Redirige vers la page inventaire dédiée
  goTo('inventaire.html');
};

window.closeInv = function () {
  const invOverlay = document.getElementById('inv-overlay');
  const invPanel   = document.getElementById('inv-panel');
  if (invOverlay) invOverlay.classList.remove('open');
  if (invPanel)   invPanel.classList.remove('open');
  document.body.style.overflow = '';
};

window.invAdd = function () {
  const nomEl   = document.getElementById('inv-nom');
  const trackEl = document.getElementById('inv-tracking');
  const dateEl  = document.getElementById('inv-date');
  const addBtn  = document.querySelector('.inv-add-btn');
  const editId  = addBtn ? parseInt(addBtn.getAttribute('data-edit-id') || '0') : 0;

  if (!nomEl) return;
  const desc     = nomEl.value.trim();
  const tracking = trackEl ? trackEl.value.trim() : '';
  const date     = dateEl ? dateEl.value : '';

  if (!desc) {
    nomEl.classList.add('error');
    setTimeout(() => nomEl.classList.remove('error'), 1200);
    return;
  }

  let items = invLoad();

  if (editId) {
    items = items.map(it => it.id === editId ? { ...it, desc, tracking, date } : it);
    if (addBtn) {
      addBtn.innerHTML = '<span class="material-icons" style="font-size:18px;">add_circle</span> Ajoute';
      addBtn.setAttribute('data-edit-id', '');
    }
  } else {
    items.push({ id: Date.now(), desc, tracking, date });
  }

  invSave(items);
  nomEl.value = '';
  if (trackEl) trackEl.value = '';
  if (dateEl) dateEl.value = '';
  invRender();
};

window.invEdit = function (id) {
  const items = invLoad();
  const item  = items.find(it => it.id === id);
  if (!item) return;

  const nomEl   = document.getElementById('inv-nom');
  const trackEl = document.getElementById('inv-tracking');
  const dateEl  = document.getElementById('inv-date');

  if (nomEl)   nomEl.value   = item.desc || '';
  if (trackEl) trackEl.value = item.tracking || '';
  if (dateEl)  dateEl.value  = item.date || '';

  const addBtn = document.querySelector('.inv-add-btn');
  if (addBtn) {
    addBtn.innerHTML = '<span class="material-icons" style="font-size:18px;">save</span> Sove';
    addBtn.setAttribute('data-edit-id', String(id));
  }
  if (nomEl) nomEl.focus();
};

window.invDelete = function (id) {
  if (!confirm('Efase atik sa a?')) return;
  let items = invLoad().filter(it => it.id !== id);
  invSave(items);
  invRender();
};

window.invClear = function () {
  if (!confirm('Efase TOUT atik yo nan enventè a?')) return;
  invSave([]);
  invRender();
};

// Export JPG via html2canvas
window.invCapture = function () {
  const zone = document.getElementById('inv-cap-zone');
  if (!zone) return;

  document.querySelectorAll('.inv-hide-cap').forEach(el => el.style.display = 'none');

  if (typeof html2canvas === 'undefined') {
    alert('Bibliyotèk telechajman an pa chaje. Verifye koneksyon entènèt ou.');
    document.querySelectorAll('.inv-hide-cap').forEach(el => el.style.display = '');
    return;
  }

  html2canvas(zone, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  }).then(canvas => {
    document.querySelectorAll('.inv-hide-cap').forEach(el => el.style.display = '');
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.download = `inventaire-LCD-${date}.jpg`;
    link.href     = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  }).catch(err => {
    document.querySelectorAll('.inv-hide-cap').forEach(el => el.style.display = '');
    console.error('Erreur export:', err);
    alert('Telechajpan echwe. Eseye ankò.');
  });
};
