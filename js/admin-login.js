/* === MediCare — admin-login.js === */

const ADMIN = {
  email:    'admin@medicare.com',
  phone:    '+20 100 123 4567',
  password: 'admin123'
};

// If already logged in as admin, go to dashboard
(function() {
  const s = JSON.parse(localStorage.getItem('adminSession') || '{}');
  if (s.isAdmin) window.location.href = 'admin.html';
})();

function toggleAdminPass(btn) {
  const input = btn.closest('.alog-input-wrap').querySelector('input');
  const icon  = btn.querySelector('i');
  if (input.type === 'password') { input.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
  else                           { input.type = 'password'; icon.className = 'fa-solid fa-eye'; }
}

function setErr(id, errId, msg) {
  document.getElementById(id).classList.add('alog-err-field');
  document.getElementById(errId).textContent = msg;
  return false;
}
function clearErr(id, errId) {
  document.getElementById(id).classList.remove('alog-err-field');
  document.getElementById(errId).textContent = '';
}

function showToast(msg, type) {
  const t = document.getElementById('alogToast');
  t.textContent = msg;
  t.className = `alog-toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function handleAdminLogin() {
  const email = document.getElementById('alogEmail').value.trim();
  const phone = document.getElementById('alogPhone').value.trim();
  const pass  = document.getElementById('alogPass').value;

  clearErr('alogEmail', 'alogEmailErr');
  clearErr('alogPhone', 'alogPhoneErr');
  clearErr('alogPass',  'alogPassErr');

  let valid = true;
  if (!email) { valid = setErr('alogEmail', 'alogEmailErr', 'Email is required.'); }
  if (!phone) { valid = setErr('alogPhone', 'alogPhoneErr', 'Phone is required.'); }
  if (!pass)  { valid = setErr('alogPass',  'alogPassErr',  'Password is required.'); }
  if (!valid) return;

  if (email !== ADMIN.email || phone !== ADMIN.phone || pass !== ADMIN.password) {
    showToast('Invalid admin credentials.', 'error');
    return;
  }

  localStorage.setItem('adminSession', JSON.stringify({ isAdmin: true, email }));
  showToast('Access granted! Redirecting…', 'success');
  setTimeout(() => { window.location.href = 'admin.html'; }, 1400);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAdminLogin();
});
