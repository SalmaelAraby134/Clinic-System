/* === MediCare — script.js (Login/Signup page) === */

function switchTab(tab) {
  const loginSection  = document.getElementById('loginSection');
  const signupSection = document.getElementById('signupSection');
  const loginTab      = document.getElementById('loginTab');
  const signupTab     = document.getElementById('signupTab');
  const indicator     = document.getElementById('tabIndicator');
  clearAllErrors();
  if (tab === 'login') {
    loginSection.classList.add('active');
    signupSection.classList.remove('active');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    indicator.classList.remove('right');
  } else {
    signupSection.classList.add('active');
    loginSection.classList.remove('active');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    indicator.classList.add('right');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

function setError(fieldId, errId, message) {
  document.getElementById(fieldId).classList.add('error-field');
  document.getElementById(errId).textContent = message;
  return false;
}

function clearError(fieldId, errId) {
  document.getElementById(fieldId).classList.remove('error-field');
  document.getElementById(errId).textContent = '';
}

function clearAllErrors() {
  [['loginPhone','loginPhoneErr'],['loginPass','loginPassErr'],
   ['signupEmail','signupEmailErr'],['signupPhone','signupPhoneErr'],
   ['signupPass','signupPassErr']].forEach(([f,e]) => clearError(f,e));
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }
function isValidPhone(phone) { return /^[0-9]{10,11}$/.test(phone.trim()); }

function getUsers() { return JSON.parse(localStorage.getItem('medicareUsers') || '[]'); }
function saveUsers(users) { localStorage.setItem('medicareUsers', JSON.stringify(users)); }
function findUserByPhone(phone) { return getUsers().find(u => u.phone === phone.trim()); }

function handleSignup() {
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const pass  = document.getElementById('signupPass').value;
  let valid = true;
  clearError('signupEmail','signupEmailErr');
  clearError('signupPhone','signupPhoneErr');
  clearError('signupPass','signupPassErr');
  if (!email.trim())         { valid = setError('signupEmail','signupEmailErr','Email is required.'); }
  else if (!isValidEmail(email)) { valid = setError('signupEmail','signupEmailErr','Enter a valid email address.'); }
  if (!phone.trim())         { valid = setError('signupPhone','signupPhoneErr','Phone number is required.'); }
  else if (!isValidPhone(phone)) { valid = setError('signupPhone','signupPhoneErr','Phone must be 10–11 digits only.'); }
  else if (findUserByPhone(phone)) { valid = setError('signupPhone','signupPhoneErr','This phone is already registered.'); }
  if (!pass.trim())          { valid = setError('signupPass','signupPassErr','Password is required.'); }
  else if (pass.length < 6)  { valid = setError('signupPass','signupPassErr','Password must be at least 6 characters.'); }
  if (!valid) return;
  const users = getUsers();
  users.push({ email: email.trim(), phone: phone.trim(), password: pass });
  saveUsers(users);
  showToast('Account created successfully! 🎉', 'success');
  setTimeout(() => {
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPass').value  = '';
    switchTab('login');
  }, 1400);
}

function handleLogin() {
  const phone = document.getElementById('loginPhone').value;
  const pass  = document.getElementById('loginPass').value;
  let valid = true;
  clearError('loginPhone','loginPhoneErr');
  clearError('loginPass','loginPassErr');
  if (!phone.trim())         { valid = setError('loginPhone','loginPhoneErr','Phone number is required.'); }
  else if (!isValidPhone(phone)) { valid = setError('loginPhone','loginPhoneErr','Enter a valid phone number (10–11 digits).'); }
  if (!pass.trim())          { valid = setError('loginPass','loginPassErr','Password is required.'); }
  if (!valid) return;
  const user = findUserByPhone(phone);
  if (!user) { setError('loginPhone','loginPhoneErr','No account found with this phone number.'); return; }
  if (user.password !== pass) { setError('loginPass','loginPassErr','Incorrect password. Please try again.'); return; }
  localStorage.setItem('medicareSession', JSON.stringify({ phone: user.phone, email: user.email, loggedIn: true }));
  showToast('Welcome back! Redirecting…', 'success');
  setTimeout(() => { window.location.href = 'pages/home.html'; }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  ['loginPhone','signupPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, ''); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const loginActive = document.getElementById('loginSection').classList.contains('active');
    if (loginActive) handleLogin(); else handleSignup();
  });
});
