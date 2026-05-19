/* === MediCare — home.js === */

// Auth Guard
(function () {
  const session = JSON.parse(localStorage.getItem('medicareSession') || '{}');
  if (!session.loggedIn) {
    window.location.href = '../index.html';
  } else {
    const el = document.getElementById('navUserPhone');
    if (el) el.textContent = session.phone || '';
  }
})();

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
