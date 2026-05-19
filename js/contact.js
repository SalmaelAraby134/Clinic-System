/* === MediCare — contact.js === */

// ── Auth Guard ──────────────────────────────
(function () {
  const session = JSON.parse(localStorage.getItem('medicareSession') || '{}');
  if (!session.loggedIn) window.location.href = '../index.html';
  else {
    const el = document.getElementById('navUserPhone');
    if (el) el.textContent = session.phone || '';
  }
})();

// ── Navbar ──────────────────────────────────
function handleLogout() {
  localStorage.removeItem('medicareSession');
  window.location.href = '../index.html';
}
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  if (menu && ham && !menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
    ham.classList.remove('open');
  }
});

// ── Validation Helpers ───────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function setErr(inputId, errId, msg) {
  document.getElementById(inputId).classList.add('cf-err-field');
  document.getElementById(errId).textContent = msg;
  return false;
}
function clearErr(inputId, errId) {
  document.getElementById(inputId).classList.remove('cf-err-field');
  document.getElementById(errId).textContent = '';
}

// ── Contact Form Submit ──────────────────────
function handleContact(e) {
  e.preventDefault();

  const name    = document.getElementById('cfName').value.trim();
  const email   = document.getElementById('cfEmail').value.trim();
  const message = document.getElementById('cfMessage').value.trim();

  // Clear previous errors
  clearErr('cfName',    'cfNameErr');
  clearErr('cfEmail',   'cfEmailErr');
  clearErr('cfMessage', 'cfMessageErr');

  let valid = true;

  if (!name)              { valid = setErr('cfName',    'cfNameErr',    'Please enter your full name.'); }
  else if (name.length < 3) { valid = setErr('cfName',  'cfNameErr',    'Name must be at least 3 characters.'); }

  if (!email)             { valid = setErr('cfEmail',   'cfEmailErr',   'Please enter your email address.'); }
  else if (!isValidEmail(email)) { valid = setErr('cfEmail', 'cfEmailErr', 'Enter a valid email address.'); }

  if (!message)           { valid = setErr('cfMessage', 'cfMessageErr', 'Please write your message.'); }
  else if (message.length < 10) { valid = setErr('cfMessage', 'cfMessageErr', 'Message must be at least 10 characters.'); }

  if (!valid) return;

  // Show loading state
  const btn     = document.getElementById('cfSubmit');
  const btnText = document.getElementById('cfBtnText');
  const btnLoad = document.getElementById('cfBtnLoading');
  btn.disabled    = true;
  btnText.style.display = 'none';
  btnLoad.style.display = 'flex';

  // Simulate sending (1.5s) then show success
  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'flex';
  }, 1500);
}

// ── Reset Form ───────────────────────────────
function resetForm() {
  document.getElementById('cfName').value    = '';
  document.getElementById('cfEmail').value   = '';
  document.getElementById('cfMessage').value = '';

  const btn     = document.getElementById('cfSubmit');
  const btnText = document.getElementById('cfBtnText');
  const btnLoad = document.getElementById('cfBtnLoading');
  btn.disabled          = false;
  btnText.style.display = 'flex';
  btnLoad.style.display = 'none';

  document.getElementById('formSuccess').style.display = 'none';
  document.getElementById('contactForm').style.display  = 'flex';
}
