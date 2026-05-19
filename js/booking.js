/* === MediCare — booking.js === */

// ── Auth Guard ──────────────────────────────
(function () {
  const session = JSON.parse(localStorage.getItem('medicareSession') || '{}');
  if (!session.loggedIn) {
    window.location.href = '../index.html';
  } else {
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

// ── Bookings Data ────────────────────────────
function getBookings() {
  return JSON.parse(localStorage.getItem('medicareBookings') || '[]');
}
function saveBookings(data) {
  localStorage.setItem('medicareBookings', JSON.stringify(data));
}

// ── Specialty Icons Map ──────────────────────
const specIcons = {
  'Internal Medicine': 'fa-solid fa-heart-pulse',
  'Surgery':           'fa-solid fa-scissors',
  'Cosmetic':          'fa-solid fa-spa',
  'Neurology':         'fa-solid fa-brain',
  'Psychiatry':        'fa-solid fa-head-side-virus',
  'Ophthalmology':     'fa-solid fa-eye',
};

// ── Render Page ──────────────────────────────
function renderBookings() {
  const bookings  = getBookings();
  const listEl    = document.getElementById('bookingList');
  const emptyEl   = document.getElementById('bookingEmpty');
  const clearWrap = document.getElementById('clearWrap');
  const statsEl   = document.getElementById('bookingStats');

  listEl.innerHTML  = '';
  statsEl.innerHTML = '';

  if (bookings.length === 0) {
    emptyEl.style.display   = 'flex';
    clearWrap.style.display = 'none';
    statsEl.style.display   = 'none';
    return;
  }

  emptyEl.style.display   = 'none';
  clearWrap.style.display = 'flex';
  statsEl.style.display   = 'flex';

  const uniqueSpecs = [...new Set(bookings.map(b => b.specialty))].length;
  const last        = bookings[bookings.length - 1];

  statsEl.innerHTML = `
    <div class="bk-stat">
      <div class="bk-stat-icon"><i class="fa-solid fa-calendar-check"></i></div>
      <div class="bk-stat-info">
        <span class="bk-stat-num">${bookings.length}</span>
        <span class="bk-stat-label">Total Appointments</span>
      </div>
    </div>
    <div class="bk-stat">
      <div class="bk-stat-icon"><i class="fa-solid fa-stethoscope"></i></div>
      <div class="bk-stat-info">
        <span class="bk-stat-num">${uniqueSpecs}</span>
        <span class="bk-stat-label">Specialties</span>
      </div>
    </div>
    <div class="bk-stat">
      <div class="bk-stat-icon"><i class="fa-solid fa-clock"></i></div>
      <div class="bk-stat-info">
        <span class="bk-stat-num" style="font-size:18px;">${last.bookedAt || last.date}</span>
        <span class="bk-stat-label">Latest Booking</span>
      </div>
    </div>
  `;

  bookings.forEach((bk, i) => {
    const icon       = specIcons[bk.specialty] || 'fa-solid fa-user-doctor';
    const bookingNum = bk.bookingNum || (i + 1);
    const card       = document.createElement('div');
    card.className   = 'bk-card';
    card.style.setProperty('--delay', `${i * 0.07}s`);
    card.id          = `bk-card-${bk.id}`;
    card.innerHTML   = `
      <div class="bk-num">#${bookingNum}</div>
      <div class="bk-info">
        <div class="bk-field">
          <span class="bk-field-label">Doctor</span>
          <span class="bk-field-value">${bk.doctor}</span>
        </div>
        <div class="bk-field">
          <span class="bk-field-label">Specialty</span>
          <span class="bk-field-value highlight">
            <i class="${icon}" style="margin-right:5px;font-size:12px;"></i>${bk.specialty}
          </span>
        </div>
        <div class="bk-field">
          <span class="bk-field-label">Doctor's Time</span>
          <span class="bk-field-value">${bk.day ? bk.day + ' at ' + bk.time : bk.time}</span>
        </div>
        <div class="bk-field">
          <span class="bk-field-label">Your Phone</span>
          <span class="bk-field-value">${bk.phone}</span>
        </div>
        <div class="bk-field">
          <span class="bk-field-label">Booking Date</span>
          <div class="bk-date-badge">
            <i class="fa-solid fa-calendar-days"></i> ${bk.date}
          </div>
        </div>
        <div class="bk-field">
          <span class="bk-field-label">Booked At</span>
          <div class="bk-date-badge" style="background:rgba(10,147,150,0.1);border-color:rgba(10,147,150,0.2);">
            <i class="fa-solid fa-clock"></i> ${bk.bookedAt || '—'}
          </div>
        </div>
      </div>
      <button class="bk-remove-btn" onclick="confirmRemove(${bk.id})" title="Remove booking">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    listEl.appendChild(card);
  });
}

// ── Modal Logic ──────────────────────────────
function confirmRemove(id) {
  document.getElementById('modalTitle').textContent  = 'Remove Appointment?';
  document.getElementById('modalMsg').textContent    = 'Are you sure you want to cancel this booking?';
  document.getElementById('modalConfirmBtn').onclick = () => removeBooking(id);
  openModal();
}

function confirmClearAll() {
  document.getElementById('modalTitle').textContent  = 'Clear All Appointments?';
  document.getElementById('modalMsg').textContent    = 'This will permanently remove all your bookings.';
  document.getElementById('modalConfirmBtn').onclick = clearAll;
  openModal();
}

function openModal()  { document.getElementById('modalOverlay').classList.add('show'); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('show'); }

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── Remove Single ────────────────────────────
function removeBooking(id) {
  closeModal();
  const card = document.getElementById(`bk-card-${id}`);
  if (card) {
    card.style.transition = 'opacity 0.35s, transform 0.35s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(40px)';
    setTimeout(() => {
      const bookings = getBookings().filter(b => b.id !== id);
      saveBookings(bookings);
      renderBookings();
      showToast('Appointment removed successfully.');
    }, 350);
  }
}

// ── Clear All ────────────────────────────────
function clearAll() {
  closeModal();
  saveBookings([]);
  renderBookings();
  showToast('All appointments cleared.');
}

// ── Toast ────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('bookingToast');
  document.getElementById('bookingToastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderBookings);
