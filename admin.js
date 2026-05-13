/* === MediCare — admin.js === */

// ── Admin Credentials ─────────────────────────
const ADMIN = {
  email:    'admin@medicare.com',
  phone:    '+20 100 123 4567',
  password: 'admin123'
};

// ── Auth Guard ────────────────────────────────
(function () {
  const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
  if (!session.isAdmin) {
    window.location.href = 'admin-login.html';
  }
})();

// ── Topbar Date ───────────────────────────────
document.getElementById('topbarDate').textContent =
  new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

// ── Sidebar Toggle ────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.querySelector('.sidebar-toggle');
  if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});

// ── Section Navigation ────────────────────────
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => {
    if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(name)) {
      l.classList.add('active');
    }
  });
  const titles = { overview:'Overview', doctors:'Manage Doctors', bookings:'All Bookings', settings:'Settings' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;
  if (name === 'overview')  renderOverview();
  if (name === 'doctors')   renderDoctors();
  if (name === 'bookings')  renderAllBookings();
}

// ── Logout ────────────────────────────────────
function adminLogout() {
  localStorage.removeItem('adminSession');
  window.location.href = 'admin-login.html';
}

// ── localStorage helpers ──────────────────────
function getDoctors()  { return JSON.parse(localStorage.getItem('adminDoctors')  || '[]'); }
function getBookings() { return JSON.parse(localStorage.getItem('medicareBookings') || '[]'); }
function getUsers()    { return JSON.parse(localStorage.getItem('medicareUsers')    || '[]'); }
function saveDoctors(d){ localStorage.setItem('adminDoctors', JSON.stringify(d)); }

// ── Toast ─────────────────────────────────────
function showToast(msg, isError = false) {
  const toast = document.getElementById('adminToast');
  document.getElementById('adminToastMsg').textContent = msg;
  toast.className = 'admin-toast' + (isError ? ' error-toast' : '');
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════
function renderOverview() {
  const doctors  = getDoctors();
  const bookings = getBookings();
  const users    = getUsers();

  document.getElementById('statDoctors').textContent  = doctors.length;
  document.getElementById('statBookings').textContent = bookings.length;
  document.getElementById('statUsers').textContent    = users.length;

  const el = document.getElementById('overviewBookings');
  if (bookings.length === 0) {
    el.innerHTML = '<p class="empty-msg">No bookings yet.</p>';
    return;
  }
  const recent = [...bookings].reverse().slice(0, 5);
  el.innerHTML = recent.map((b, i) => `
    <div class="booking-row" style="--delay:${i*0.07}s">
      <div class="booking-num">${i+1}</div>
      <div class="booking-row-info">
        <div class="booking-field">
          <span class="booking-field-label">Doctor</span>
          <span class="booking-field-value">${b.doctor}</span>
        </div>
        <div class="booking-field">
          <span class="booking-field-label">Specialty</span>
          <span class="booking-field-value spec">${b.specialty}</span>
        </div>
        <div class="booking-field">
          <span class="booking-field-label">Patient Phone</span>
          <span class="booking-field-value">${b.phone || '—'}</span>
        </div>
      </div>
      <span style="font-size:12px;color:var(--muted)">${b.date}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// DOCTORS
// ══════════════════════════════════════════════
function addDoctor() {
  const name  = document.getElementById('newDocName').value.trim();
  const spec  = document.getElementById('newDocSpec').value;
  const phone = document.getElementById('newDocPhone').value.trim();
  const addr  = document.getElementById('newDocAddr').value.trim();
  const times = document.getElementById('newDocTimes').value.trim();

  if (!name || !spec || !phone || !addr || !times) {
    showToast('Please fill all fields!', true); return;
  }

  const doctors = getDoctors();
  doctors.push({ id: Date.now(), name, spec, phone, addr, times });
  saveDoctors(doctors);

  document.getElementById('newDocName').value  = '';
  document.getElementById('newDocSpec').value  = '';
  document.getElementById('newDocPhone').value = '';
  document.getElementById('newDocAddr').value  = '';
  document.getElementById('newDocTimes').value = '';

  showToast(`Dr. ${name} added successfully!`);
  renderDoctors();
}

function renderDoctors() {
  const doctors = getDoctors();
  const el = document.getElementById('doctorsList');
  document.getElementById('doctorCount').textContent = `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''}`;

  if (doctors.length === 0) {
    el.innerHTML = '<p class="empty-msg">No doctors added yet. Use the form above to add one.</p>';
    return;
  }
  el.innerHTML = doctors.map((d, i) => `
    <div class="doctor-row" style="--delay:${i*0.06}s">
      <div class="doctor-avatar-sm"><i class="fa-solid fa-user-doctor"></i></div>
      <div class="doctor-row-info">
        <div class="doctor-row-name">${d.name}</div>
        <div class="doctor-row-sub"><i class="fa-solid fa-phone" style="font-size:10px;margin-right:4px;"></i>${d.phone} &nbsp;|&nbsp; <i class="fa-solid fa-location-dot" style="font-size:10px;margin-right:4px;"></i>${d.addr}</div>
        <div class="doctor-row-sub" style="margin-top:3px;"><i class="fa-solid fa-clock" style="font-size:10px;margin-right:4px;"></i>${d.times}</div>
      </div>
      <span class="doctor-row-spec">${d.spec}</span>
      <div class="doctor-row-actions">
        <button class="admin-btn edit-sm" onclick="openEditModal(${d.id})">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
        <button class="admin-btn danger-sm" onclick="deleteDoctor(${d.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteDoctor(id) {
  const doctors = getDoctors().filter(d => d.id !== id);
  saveDoctors(doctors);
  renderDoctors();
  showToast('Doctor removed successfully.');
}

function openEditModal(id) {
  const doc = getDoctors().find(d => d.id === id);
  if (!doc) return;
  document.getElementById('editDocId').value    = id;
  document.getElementById('editDocName').value  = doc.name;
  document.getElementById('editDocSpec').value  = doc.spec;
  document.getElementById('editDocPhone').value = doc.phone;
  document.getElementById('editDocAddr').value  = doc.addr;
  document.getElementById('editDocTimes').value = doc.times;
  document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('show');
}

function saveEditDoctor() {
  const id    = parseInt(document.getElementById('editDocId').value);
  const name  = document.getElementById('editDocName').value.trim();
  const spec  = document.getElementById('editDocSpec').value;
  const phone = document.getElementById('editDocPhone').value.trim();
  const addr  = document.getElementById('editDocAddr').value.trim();
  const times = document.getElementById('editDocTimes').value.trim();

  if (!name || !spec || !phone || !addr || !times) {
    showToast('Please fill all fields!', true); return;
  }

  const doctors = getDoctors().map(d => d.id === id ? { ...d, name, spec, phone, addr, times } : d);
  saveDoctors(doctors);
  closeEditModal();
  renderDoctors();
  showToast('Doctor updated successfully!');
}

// Close modal on overlay click
document.getElementById('editModal').addEventListener('click', function(e) {
  if (e.target === this) closeEditModal();
});

// ══════════════════════════════════════════════
// BOOKINGS
// ══════════════════════════════════════════════
function renderAllBookings() {
  const bookings = getBookings();
  const el = document.getElementById('allBookingsList');

  if (bookings.length === 0) {
    el.innerHTML = '<p class="empty-msg">No bookings found.</p>';
    return;
  }
  el.innerHTML = [...bookings].reverse().map((b, i) => `
    <div class="booking-row" style="--delay:${i*0.06}s">
      <div class="booking-num">${i+1}</div>
      <div class="booking-row-info">
        <div class="booking-field">
          <span class="booking-field-label">Doctor</span>
          <span class="booking-field-value">${b.doctor}</span>
        </div>
        <div class="booking-field">
          <span class="booking-field-label">Specialty</span>
          <span class="booking-field-value spec">${b.specialty}</span>
        </div>
        <div class="booking-field">
          <span class="booking-field-label">Patient</span>
          <span class="booking-field-value">${b.phone || '—'}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
        <span style="font-size:11.5px;color:var(--muted);white-space:nowrap;">${b.date}</span>
        <button class="admin-btn danger-sm" onclick="deleteBooking(${b.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteBooking(id) {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem('medicareBookings', JSON.stringify(bookings));
  renderAllBookings();
  showToast('Booking removed.');
}

function clearAllBookings() {
  localStorage.removeItem('medicareBookings');
  renderAllBookings();
  renderOverview();
  showToast('All bookings cleared.');
}

// ══════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════
function saveSettings() {
  showToast('Settings saved successfully!');
}

function clearUsers() {
  localStorage.removeItem('medicareUsers');
  showToast('All users cleared.');
}

function clearDoctors() {
  localStorage.removeItem('adminDoctors');
  renderDoctors();
  showToast('All doctors cleared.');
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderOverview();
});
