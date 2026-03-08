/* =============================================
   PulsePace — app.js
   ============================================= */
"use strict";

/* ============================================================
   HASH ROUTER
   ============================================================ */
const ROUTES = {
  "/"         : "page-landing",
  "/login"    : "page-login",
  "/register" : "page-register",
  "/home"     : "page-home",
  "/audio-cpr": "page-audio-cpr",
  "/speech-recognition": "page-speech-recognition",
  "/404"      : "page-404",
};
const PROTECTED = ["/home", "/audio-cpr", "/speech-recognition"];

function getHash() { return window.location.hash.slice(1) || "/"; }
function navigate(path) { window.location.hash = "#" + path; }

function router() {
  const path = getHash();
  const user = localStorage.getItem("pulsepace_user");

  if (PROTECTED.includes(path) && !user) { navigate("/login"); return; }

  document.querySelectorAll(".page").forEach(p => {
    p.classList.add("hidden");
    p.removeEventListener("scroll", onPageScroll);
  });

  updateScrollProgress(0);
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const pageId = ROUTES[path] || null;
  if (pageId) {
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.remove("hidden");
      page.scrollTop = 0;
      page.addEventListener("scroll", onPageScroll);
      onPageEnter(path);
    }
  } else {
    const p404 = document.getElementById("page-404");
    p404.classList.remove("hidden");
    p404.scrollTop = 0;
  }
}

function onPageEnter(path) {
  if (path === "/home")      initHomePage();
  if (path === "/audio-cpr") initAudioCPRPage();
  if (path === "/speech-recognition") initSpeechRecognitionPage();
  if (path === "/login")     initLoginPage();
  if (path === "/register")  initRegisterPage();
  if (path === "/")          initLandingPage();
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);


/* ============================================================
   SCROLL UTILITIES
   ============================================================ */
function onPageScroll(e) {
  const page = e.target;
  const scrollTop = page.scrollTop;
  const maxScroll = page.scrollHeight - page.clientHeight;
  const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  updateScrollProgress(pct);
  toggleScrollTopBtn(scrollTop > 280);
}
function updateScrollProgress(pct) {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  bar.style.width = pct + "%";
  bar.classList.toggle("visible", pct > 0 && pct < 100);
}
function toggleScrollTopBtn(show) {
  const btn = document.getElementById("scrollTopBtn");
  if (btn) btn.classList.toggle("visible", show);
}
function scrollToTop() {
  const activePage = document.querySelector(".page:not(.hidden)");
  if (activePage) activePage.scrollTo({ top: 0, behavior: "smooth" });
}


/* ============================================================
   TOAST
   ============================================================ */
let _toastTimer = null;
function showToast(title, description, isError) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = `<div class="toast-title">${title}</div>${description ? `<div class="toast-desc">${description}</div>` : ""}`;
  el.className = "toast" + (isError ? " error" : "");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = "toast hidden"; }, 3800);
}


/* ============================================================
   SHARED FORM UTILITIES
   ============================================================ */

/* Show/hide password */
function togglePassVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isText = inp.type === "text";
  inp.type = isText ? "password" : "text";
  // Swap icon: eye vs eye-off
  btn.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* Set field error/valid state */
function setFieldError(inputId, errId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) { inp.classList.add("invalid"); inp.classList.remove("valid"); }
  if (err) { err.textContent = msg; err.classList.remove("hidden"); }
}
function clearFieldError(inputId, errId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) { inp.classList.remove("invalid"); inp.classList.add("valid"); }
  if (err) { err.classList.add("hidden"); err.textContent = ""; }
}
function resetFieldState(inputId, errId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) { inp.classList.remove("invalid", "valid"); }
  if (err) { err.classList.add("hidden"); err.textContent = ""; }
}

/* Validators */
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v) { return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v.trim()); }
function isValidName(v)  { return v.trim().length >= 2 && /^[a-zA-Z\s'\-]+$/.test(v.trim()); }


/* ============================================================
   LANDING PAGE
   ============================================================ */
function initLandingPage() {
  // nothing extra needed — clean slate on each visit
}

function scrollToFeatures() {
  const el = document.getElementById("features");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}


/* ============================================================
   REGISTER PAGE
   ============================================================ */
function initRegisterPage() {
  ["regName","regEmail","regPhone","regPassword","regConfirm"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
    resetFieldState(id, id + "Err");
  });
  const terms = document.getElementById("regTerms");
  if (terms) terms.checked = false;
  resetFieldState("regTerms", "regTermsErr");
  // Reset pw strength
  const wrap = document.getElementById("pwStrengthWrap");
  if (wrap) wrap.style.display = "none";
  ["pwBar1","pwBar2","pwBar3","pwBar4"].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.className = "pw-bar";
  });
}

function updatePasswordStrength(val) {
  const wrap  = document.getElementById("pwStrengthWrap");
  const label = document.getElementById("pwLabel");
  const bars  = ["pwBar1","pwBar2","pwBar3","pwBar4"].map(id => document.getElementById(id));

  if (!val) { if (wrap) wrap.style.display = "none"; return; }
  if (wrap) wrap.style.display = "flex";

  // Score: length, uppercase, digit, special
  let score = 0;
  if (val.length >= 8)  score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;
  score = Math.min(score, 4);

  const levels = ["","weak","fair","good","strong"];
  const names  = ["","Weak","Fair","Good","Strong"];

  bars.forEach((b, i) => {
    if (!b) return;
    b.className = "pw-bar" + (i < score ? " " + levels[score] : "");
  });
  if (label) label.textContent = names[score] || "Weak";
}

function validateRegister() {
  let ok = true;

  const name     = document.getElementById("regName")?.value?.trim() || "";
  const email    = document.getElementById("regEmail")?.value?.trim() || "";
  const phone    = document.getElementById("regPhone")?.value?.trim() || "";
  const password = document.getElementById("regPassword")?.value || "";
  const confirm  = document.getElementById("regConfirm")?.value || "";
  const terms    = document.getElementById("regTerms")?.checked;

  // Name
  if (!name) {
    setFieldError("regName","regNameErr","Full name is required."); ok = false;
  } else if (!isValidName(name)) {
    setFieldError("regName","regNameErr","Enter a valid name (letters only, min 2 chars)."); ok = false;
  } else { clearFieldError("regName","regNameErr"); }

  // Email
  if (!email) {
    setFieldError("regEmail","regEmailErr","Email address is required."); ok = false;
  } else if (!isValidEmail(email)) {
    setFieldError("regEmail","regEmailErr","Enter a valid email address."); ok = false;
  } else { clearFieldError("regEmail","regEmailErr"); }

  // Phone
  if (!phone) {
    setFieldError("regPhone","regPhoneErr","Phone number is required."); ok = false;
  } else if (!isValidPhone(phone)) {
    setFieldError("regPhone","regPhoneErr","Enter a valid phone number (7–15 digits)."); ok = false;
  } else { clearFieldError("regPhone","regPhoneErr"); }

  // Password
  if (!password) {
    setFieldError("regPassword","regPasswordErr","Password is required."); ok = false;
  } else if (password.length < 8) {
    setFieldError("regPassword","regPasswordErr","Password must be at least 8 characters."); ok = false;
  } else if (!/[A-Z]/.test(password)) {
    setFieldError("regPassword","regPasswordErr","Include at least one uppercase letter."); ok = false;
  } else if (!/\d/.test(password)) {
    setFieldError("regPassword","regPasswordErr","Include at least one number."); ok = false;
  } else { clearFieldError("regPassword","regPasswordErr"); }

  // Confirm
  if (!confirm) {
    setFieldError("regConfirm","regConfirmErr","Please confirm your password."); ok = false;
  } else if (confirm !== password) {
    setFieldError("regConfirm","regConfirmErr","Passwords do not match."); ok = false;
  } else { clearFieldError("regConfirm","regConfirmErr"); }

  // Terms
  if (!terms) {
    setFieldError("regTerms","regTermsErr","You must agree to the Terms of Service."); ok = false;
  } else { clearFieldError("regTerms","regTermsErr"); }

  return ok;
}

function handleRegister() {
  if (!validateRegister()) return;

  const btn   = document.getElementById("registerBtn");
  const email = document.getElementById("regEmail")?.value?.trim();
  const name  = document.getElementById("regName")?.value?.trim();

  if (btn) { btn.textContent = "Creating account…"; btn.disabled = true; }

  setTimeout(() => {
    localStorage.setItem("pulsepace_user", JSON.stringify({ email, name }));
    if (btn) { btn.textContent = "Create Account"; btn.disabled = false; }
    showToast("🎉 Account Created!", `Welcome, ${name}! You're now signed in.`);
    setTimeout(() => navigate("/home"), 800);
  }, 900);
}


/* ============================================================
   LOGIN PAGE
   ============================================================ */
function initLoginPage() {
  ["loginEmail","loginPassword"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
    resetFieldState(id, id + "Err");
  });

  const onEnter = (e) => { if (e.key === "Enter") handleLogin(); };
  ["loginEmail","loginPassword"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.removeEventListener("keydown", onEnter); el.addEventListener("keydown", onEnter); }
  });
}

function validateLogin() {
  let ok = true;
  const email    = document.getElementById("loginEmail")?.value?.trim() || "";
  const password = document.getElementById("loginPassword")?.value || "";

  if (!email) {
    setFieldError("loginEmail","loginEmailErr","Email address is required."); ok = false;
  } else if (!isValidEmail(email)) {
    setFieldError("loginEmail","loginEmailErr","Enter a valid email address."); ok = false;
  } else { clearFieldError("loginEmail","loginEmailErr"); }

  if (!password) {
    setFieldError("loginPassword","loginPasswordErr","Password is required."); ok = false;
  } else if (password.length < 6) {
    setFieldError("loginPassword","loginPasswordErr","Password must be at least 6 characters."); ok = false;
  } else { clearFieldError("loginPassword","loginPasswordErr"); }

  return ok;
}

function handleLogin() {
  if (!validateLogin()) return;

  const email = document.getElementById("loginEmail")?.value?.trim();
  const btn   = document.getElementById("loginBtn");

  if (btn) { btn.textContent = "Signing in…"; btn.disabled = true; }

  setTimeout(() => {
    localStorage.setItem("pulsepace_user", JSON.stringify({ email }));
    if (btn) { btn.textContent = "Sign In"; btn.disabled = false; }
    navigate("/home");
  }, 800);
}

function handleLogout() {
  stopCPR();
  stopListening();
  localStorage.removeItem("pulsepace_user");
  navigate("/");
}


/* ============================================================
   HOME PAGE
   ============================================================ */
let homeLocation = null;
let locationSent = false;
let listening    = false;
let recognition  = null;

const AMBULANCE_DRIVER = { name: "John Parker", phone: "+1-555-0911", vehicle: "AMB-4521" };

function initHomePage() {
  closeMobileMenu();
  homeLocation = null;      // always re-acquire on page enter
  locationSent = false;
  hf.lat = null;
  hf.lon = null;
  fetchLocation();
  updateMicFab();
}

/* ── Location: request GPS, resolve address, then drive Hospital Finder ── */
function fetchLocation() {
  renderLocFetching("Requesting GPS access…");

  if (!navigator.geolocation) {
    renderLocError("GPS not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      homeLocation = {
        lat:      pos.coords.latitude,
        lng:      pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
      };
      renderLocResolving();           // show coords immediately, start address lookup
      resolveAddress(homeLocation.lat, homeLocation.lng);
    },
    err => {
      // Denied or unavailable — fall back to New Delhi coords so HF still works
      homeLocation = { lat: 28.6139, lng: 77.2090, accuracy: null, fallback: true };
      renderLocFallback();
      hfAutoRun();
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

/* Address resolution via OpenStreetMap Nominatim (free, no key) */
function resolveAddress(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  fetch(url, { headers: { "Accept-Language": "en" } })
    .then(r => r.json())
    .then(data => {
      const a = data.address || {};
      const parts = [
        a.road || a.pedestrian || a.footway,
        a.suburb || a.neighbourhood,
        a.city || a.town || a.village || a.county,
        a.state,
      ].filter(Boolean);
      homeLocation.address = parts.slice(0, 3).join(", ");
      homeLocation.city    = a.city || a.town || a.village || a.county || "";
      renderLocReady();
      hfAutoRun();
    })
    .catch(() => {
      homeLocation.address = null;
      renderLocReady();
      hfAutoRun();
    });
}

/* ── Location card render states ────────────────────────────────────────── */
function setLiveDot(state) { // "pending" | "live" | "fallback" | "error"
  const dot = document.getElementById("locLiveDot");
  if (!dot) return;
  dot.className = "loc-live-dot loc-dot-" + state;
}

function renderLocFetching(msg) {
  setLiveDot("pending");
  const el = document.getElementById("locationContent");
  if (!el) return;
  el.innerHTML = `
    <div class="loc-fetching">
      <div class="loc-spinner"></div>
      <span>${msg}</span>
    </div>`;
}

function renderLocResolving() {
  setLiveDot("live");
  const el = document.getElementById("locationContent");
  if (!el || !homeLocation) return;
  el.innerHTML = `
    <div class="loc-coords-row">
      <div class="loc-coord-item">
        <span class="loc-coord-label">LAT</span>
        <span class="loc-coord-val">${homeLocation.lat.toFixed(5)}</span>
      </div>
      <div class="loc-coord-item">
        <span class="loc-coord-label">LNG</span>
        <span class="loc-coord-val">${homeLocation.lng.toFixed(5)}</span>
      </div>
      ${homeLocation.accuracy !== null ? `
      <div class="loc-coord-item">
        <span class="loc-coord-label">ACC</span>
        <span class="loc-coord-val">±${homeLocation.accuracy}m</span>
      </div>` : ""}
    </div>
    <div class="loc-address-row loc-resolving">
      <div class="loc-spinner loc-spinner-sm"></div>
      <span>Resolving address…</span>
    </div>`;
}

function renderLocReady() {
  setLiveDot("live");
  const el = document.getElementById("locationContent");
  if (!el || !homeLocation) return;
  el.innerHTML = `
    <div class="loc-coords-row">
      <div class="loc-coord-item">
        <span class="loc-coord-label">LAT</span>
        <span class="loc-coord-val">${homeLocation.lat.toFixed(5)}</span>
      </div>
      <div class="loc-coord-item">
        <span class="loc-coord-label">LNG</span>
        <span class="loc-coord-val">${homeLocation.lng.toFixed(5)}</span>
      </div>
      ${homeLocation.accuracy !== null ? `
      <div class="loc-coord-item">
        <span class="loc-coord-label">ACC</span>
        <span class="loc-coord-val">±${homeLocation.accuracy}m</span>
      </div>` : ""}
    </div>
    ${homeLocation.address ? `
    <div class="loc-address-row">
      <svg style="width:11px;height:11px;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>${homeLocation.address}</span>
    </div>` : ""}
    <button id="sendLocBtn"
      class="btn ${locationSent ? "btn-sent" : "btn-primary glow-red-sm"} btn-full loc-send-btn"
      onclick="sendLocation()" ${locationSent ? "disabled" : ""}>
      ${locationSent
        ? `<svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Location Shared`
        : `<svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send to Emergency Services`}
    </button>`;
}

function renderLocFallback() {
  setLiveDot("fallback");
  const el = document.getElementById("locationContent");
  if (!el) return;
  el.innerHTML = `
    <div class="loc-fallback-banner">
      <svg style="width:13px;height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      GPS denied — using approximate location
    </div>
    <div class="loc-coords-row" style="margin-top:.5rem;">
      <div class="loc-coord-item">
        <span class="loc-coord-label">LAT</span>
        <span class="loc-coord-val">${homeLocation.lat.toFixed(5)}</span>
      </div>
      <div class="loc-coord-item">
        <span class="loc-coord-label">LNG</span>
        <span class="loc-coord-val">${homeLocation.lng.toFixed(5)}</span>
      </div>
    </div>
    <button class="btn btn-outline btn-full loc-retry-btn" onclick="fetchLocation()">
      <svg style="width:13px;height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      Retry GPS
    </button>`;
}

function renderLocError(msg) {
  setLiveDot("error");
  const el = document.getElementById("locationContent");
  if (!el) return;
  el.innerHTML = `
    <div class="loc-fallback-banner loc-banner-err">
      <svg style="width:13px;height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      ${msg}
    </div>
    <button class="btn btn-outline btn-full loc-retry-btn" onclick="fetchLocation()">
      <svg style="width:13px;height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      Retry
    </button>`;
}

function sendLocation() {
  if (!homeLocation || locationSent) return;
  locationSent = true;
  renderLocReady();
  showToast("📍 Location Shared!", "GPS coordinates sent to nearby hospitals and ambulance driver.");
}

let mobileMenuOpen = false;
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");
  mobileMenuOpen = !mobileMenuOpen;
  if (menu) menu.classList.toggle("hidden", !mobileMenuOpen);
  if (toggle) toggle.innerHTML = mobileMenuOpen
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
}
function closeMobileMenu() {
  const menu   = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");
  mobileMenuOpen = false;
  if (menu)   menu.classList.add("hidden");
  if (toggle) toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
}

function toggleVoice() { listening ? stopListening() : startListeningHome(); }
function startListeningHome() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast("Not Supported","Speech recognition unavailable.",true); return; }
  recognition = new SR();
  recognition.continuous = true; recognition.interimResults = false; recognition.lang = "en-US";
  recognition.onresult = (event) => {
    const t = event.results[event.results.length - 1][0].transcript.toLowerCase();
    if (t.includes("help") || t.includes("not breathing") || t.includes("cpr")) { sendLocation(); navigate("/audio-cpr"); }
    if (t.includes("stop")) stopListening();
  };
  recognition.onerror = () => { listening = false; updateMicFab(); };
  recognition.start(); listening = true; updateMicFab();
  showToast('🎤 Listening…', 'Say "CPR" or "Help" to launch CPR guide.');
}
function stopListening() {
  if (recognition) { recognition.stop(); recognition = null; }
  listening = false; updateMicFab();
}
function updateMicFab() {
  const fab  = document.getElementById("micFab");
  const icon = document.getElementById("micIcon");
  if (!fab || !icon) return;
  fab.classList.toggle("listening", listening);
  icon.innerHTML = listening
    ? `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/><line x1="3" y1="3" x2="21" y2="21"/>`
    : `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>`;
}


/* ============================================================
   AUDIO CPR PAGE
   ============================================================ */
const CPR_STEPS = [
  "Check if the person is responsive — tap shoulders and shout.",
  "Call emergency services immediately.",
  "Place the heel of your hand on the center of the chest.",
  "Push hard and fast — 2 inches deep, 100 to 120 compressions per minute.",
  "After 30 compressions, give 2 rescue breaths.",
  "Continue until help arrives.",
];

let audioCtx         = null;
let cprInterval      = null;
let cprActive        = false;
let currentStep      = 0;
let compressionCount = 0;
let stepAdvanceTimer = null;

function initAudioCPRPage() {
  cprActive = false; currentStep = 0; compressionCount = 0;
  renderCPRSteps(); updateCPRUI(false); resetCounter();
  if (sessionStorage.getItem("autoStartCPR") === "1") {
    sessionStorage.removeItem("autoStartCPR");
    setTimeout(startCPR, 400);
  }
}

function renderCPRSteps() {
  const container = document.getElementById("cprSteps");
  if (!container) return;
  container.innerHTML = CPR_STEPS.map((step, i) => `
    <div class="cpr-step ${i === currentStep ? "active" : ""}" onclick="setStep(${i})" id="step-${i}">
      <div class="cpr-step-num">${i + 1}</div><p>${step}</p>
    </div>`).join("");
}
function setStep(i) {
  currentStep = i;
  document.querySelectorAll(".cpr-step").forEach((el, idx) => el.classList.toggle("active", idx === i));
}
function updateCPRUI(active) {
  const ring    = document.getElementById("cprRing");
  const heart   = document.getElementById("cprHeartSvg");
  const ripple  = document.getElementById("cprRipple");
  const startBtn= document.getElementById("cprStartBtn");
  const stopBtn = document.getElementById("cprStopBtn");
  const status  = document.getElementById("cprStatus");
  if (ring)     ring.classList.toggle("beating", active);
  if (heart)    heart.classList.toggle("beat", active);
  if (ripple)   ripple.classList.toggle("active", active);
  if (startBtn) startBtn.classList.toggle("hidden", active);
  if (stopBtn)  stopBtn.classList.toggle("hidden", !active);
  if (status)   status.innerHTML = active
    ? `<p class="cpr-status-text active">🔴 <strong>CPR Active</strong> — Push hard and fast on center of chest.<br><span style="font-size:.875rem;">Keep pace with each beat you hear.</span></p>`
    : `<p class="cpr-status-text">Press <strong>Start</strong> to begin CPR guide</p>`;
}
function startCPR() {
  if (cprActive) return;
  cprActive = true; currentStep = 0; compressionCount = 0;
  updateCounter(); renderCPRSteps(); updateCPRUI(true);
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeat = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine"; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.15);
      compressionCount++; updateCounter();
      if (compressionCount % 5 === 0) {
        currentStep = Math.min(currentStep + 1, CPR_STEPS.length - 1);
        renderCPRSteps();
        const activeEl = document.getElementById(`step-${currentStep}`);
        if (activeEl) activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    playBeat(); cprInterval = setInterval(playBeat, 545);
  } catch (e) { console.warn("AudioContext error:", e); }
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance("CPR guide started. Push down 2 inches. Keep pace with each beat.");
    u.rate = 0.9; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  }
  showToast("❤️ CPR Started", "Audio metronome running at 110 BPM.");
}
function stopCPR() {
  if (!cprActive) return; cprActive = false;
  if (cprInterval) { clearInterval(cprInterval); cprInterval = null; }
  if (audioCtx)    { audioCtx.close(); audioCtx = null; }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  clearTimeout(stepAdvanceTimer); updateCPRUI(false);
  showToast("CPR Stopped", `Total compressions: ${compressionCount}`);
}
function stopCPRAndGoBack() { stopCPR(); navigate("/home"); }
function resetCounter()     { compressionCount = 0; updateCounter(); }
function updateCounter()    { const el = document.getElementById("compressionCount"); if (el) el.textContent = compressionCount; }


/* ═══════════════════════════════════════════════════════════════════════════
   HOSPITAL FINDER  —  GPS-driven proximity list
   Data ported from hospital_finder/backend/data/hospitals.py
   Geo  ported from hospital_finder/backend/services/geo_service.py
   ═══════════════════════════════════════════════════════════════════════════ */

const HF_DB = [
  { id:"HYD001", name:"Nizam's Institute of Medical Sciences (NIMS)", address:"Punjagutta, Hyderabad, Telangana 500082", city:"Hyderabad", lat:17.4239, lon:78.4538, type:"Government", emergency:true, departments:["Cardiology","Neurology","Oncology","Trauma","Orthopedics"], phone:"+914023489000" },
  { id:"HYD002", name:"Yashoda Hospitals",                            address:"Somajiguda, Hyderabad 500082",              city:"Hyderabad", lat:17.4291, lon:78.4601, type:"Private",    emergency:true, departments:["Cardiology","Neurosurgery","Nephrology"],            phone:"+914066455000" },
  { id:"HYD003", name:"Apollo Hospitals Jubilee Hills",               address:"Jubilee Hills, Hyderabad 500033",           city:"Hyderabad", lat:17.4323, lon:78.4071, type:"Private",    emergency:true, departments:["Cardiac Surgery","Oncology","Pediatrics"],           phone:"+914023607777" },
  { id:"HYD004", name:"Osmania General Hospital",                     address:"Afzalgunj, Hyderabad 500012",               city:"Hyderabad", lat:17.3840, lon:78.4739, type:"Government", emergency:true, departments:["General Medicine","Surgery","Gynecology"],           phone:"+914024600100" },
  { id:"HYD005", name:"Care Hospitals Banjara Hills",                 address:"Banjara Hills, Hyderabad 500034",           city:"Hyderabad", lat:17.4126, lon:78.4462, type:"Private",    emergency:true, departments:["Cardiology","Orthopedics","Urology"],               phone:"+914066901000" },
  { id:"MUM001", name:"KEM Hospital",                                 address:"Parel, Mumbai 400012",                      city:"Mumbai",    lat:19.0018, lon:72.8418, type:"Government", emergency:true, departments:["Trauma","Burns","Neurology","Cardiology"],           phone:"+912224136000" },
  { id:"MUM002", name:"Lilavati Hospital",                            address:"Bandra West, Mumbai 400050",                city:"Mumbai",    lat:19.0505, lon:72.8306, type:"Private",    emergency:true, departments:["Oncology","Cardiac Surgery","Neurosurgery"],         phone:"+912226751000" },
  { id:"BLR001", name:"Manipal Hospital Whitefield",                  address:"Whitefield, Bengaluru 560066",              city:"Bengaluru", lat:12.9822, lon:77.7272, type:"Private",    emergency:true, departments:["Cardiology","Neurology","Pediatrics"],               phone:"+918066999000" },
  { id:"BLR002", name:"Victoria Hospital",                            address:"Fort Road, Bengaluru 560002",               city:"Bengaluru", lat:12.9634, lon:77.5718, type:"Government", emergency:true, departments:["General Surgery","Orthopaedics","ENT"],              phone:"+918022971000" },
  { id:"DEL001", name:"AIIMS New Delhi",                              address:"Ansari Nagar, New Delhi 110029",            city:"New Delhi", lat:28.5672, lon:77.2100, type:"Government", emergency:true, departments:["Trauma","Cardiology","Oncology","Neurosurgery"],     phone:"+911126588501" },
  { id:"DEL002", name:"Safdarjung Hospital",                          address:"Ansari Nagar West, New Delhi 110029",       city:"New Delhi", lat:28.5691, lon:77.2055, type:"Government", emergency:true, departments:["Burns","Trauma","Gynecology","Pediatrics"],          phone:"+911126165001" },
  { id:"CHN001", name:"Government General Hospital Chennai",          address:"Park Town, Chennai 600003",                 city:"Chennai",   lat:13.0839, lon:80.2707, type:"Government", emergency:true, departments:["Trauma","Cardiology","General Surgery"],            phone:"+914425305001" },
  { id:"CHN002", name:"Apollo Hospital Greams Road",                  address:"Greams Lane, Chennai 600006",               city:"Chennai",   lat:13.0611, lon:80.2523, type:"Private",    emergency:true, departments:["Cardiac","Transplant","Neurology"],                  phone:"+914428290200" },
];

/* Geo engine — Haversine + bearing */
const hf = { lat: null, lon: null };

function hfHaversine(a, b, c, d) {
  const R = 6371, r = Math.PI / 180;
  const dL = (c-a)*r, dO = (d-b)*r;
  const x = Math.sin(dL/2)**2 + Math.cos(a*r)*Math.cos(c*r)*Math.sin(dO/2)**2;
  return +(R * 2 * Math.asin(Math.sqrt(x))).toFixed(1);
}
function hfBearing(a, b, c, d) {
  [a,b,c,d] = [a,b,c,d].map(v => v * Math.PI/180);
  const x = Math.sin(d-b)*Math.cos(c);
  const y = Math.cos(a)*Math.sin(c) - Math.sin(a)*Math.cos(c)*Math.cos(d-b);
  return ((Math.atan2(x,y)*180/Math.PI)+360)%360;
}
function hfCompass(b) { return ["N","NE","E","SE","S","SW","W","NW"][Math.round(b/45)%8]; }
function hfMins(km, spd) { return Math.max(1, Math.round(km/spd*60)); }

/* Called automatically once GPS resolves */
function hfAutoRun() {
  if (!homeLocation) return;
  hf.lat = homeLocation.lat;
  hf.lon = homeLocation.lng;
  hfRender();
}

function hfRender() {
  const box = document.getElementById("hfResults");
  const meta = document.getElementById("hfMeta");
  if (!box) return;

  if (hf.lat === null) {
    box.innerHTML = `<div class="hf-placeholder"><div class="loc-spinner" style="width:26px;height:26px;border-width:3px;"></div><p>Waiting for GPS fix…</p></div>`;
    return;
  }

  /* Compute distances for all hospitals, sort nearest first */
  const results = HF_DB
    .map(h => {
      const dist = hfHaversine(hf.lat, hf.lon, h.lat, h.lon);
      const bear = hfBearing(hf.lat, hf.lon, h.lat, h.lon);
      return {
        ...h, dist,
        dir:    hfCompass(bear),
        carMin: hfMins(dist, 50),
        ambMin: hfMins(dist, 80),
        dirUrl: `https://maps.google.com/maps/dir/${hf.lat},${hf.lon}/${h.lat},${h.lon}`,
        mapUrl: `https://maps.google.com/?q=${h.lat},${h.lon}`,
      };
    })
    .sort((a, b) => a.dist - b.dist);

  /* Summary chips */
  if (meta) {
    const nearest = results[0];
    meta.innerHTML =
      `<span class="hf-chip hf-chip-count">${results.length} hospitals</span>` +
      `<span class="hf-chip hf-chip-near">Nearest ${nearest.dist} km</span>`;
  }

  /* Cards */
  box.innerHTML = results.map((h, i) => `
    <div class="hf-card">
      <div class="hf-card-inner">

        <div class="hf-card-left">
          <div class="hf-rank-badge">${i + 1}</div>
        </div>

        <div class="hf-card-body">
          <div class="hf-name-row">
            <span class="hf-name">${h.name}</span>
            <span class="hf-dist-badge">${h.dist} km ${h.dir}</span>
          </div>

          <div class="hf-addr">
            <svg style="width:10px;height:10px;flex-shrink:0;opacity:.6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${h.address}
          </div>

          <div class="hf-meta-row">
            <span class="hf-tag ${h.type==='Government'?'hf-tag-govt':'hf-tag-pvt'}">${h.type==='Government'?'Govt':'Private'}</span>
            ${h.emergency ? '<span class="hf-tag hf-tag-emerg">🚨 Emergency</span>' : ''}
          </div>

          <div class="hf-travel-row">
            <span class="hf-travel-pill">🚗 ${h.carMin} min</span>
            <span class="hf-travel-pill hf-pill-amb">🚑 ${h.ambMin} min</span>
          </div>

          <div class="hf-action-row">
            <a href="${h.dirUrl}" target="_blank" class="hf-btn hf-btn-dir">
              <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Directions
            </a>
            <a href="tel:${h.phone}" class="hf-btn hf-btn-call">
              <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.12.5.28 1 .5 1.45a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.46.2.95.37 1.45.5a2 2 0 0 1 1.72 2z"/></svg>
              Call
            </a>
            <a href="${h.mapUrl}" target="_blank" class="hf-btn hf-btn-map">
              <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Map
            </a>
          </div>
        </div>

      </div>
    </div>`).join("");
}
