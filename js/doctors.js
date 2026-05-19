/* === MediCare — doctors.js === */

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

// ── Get specialty from page ──────────────────
function getPageSpecialty() {
  const map = {
    'doctors-internal.html':      'Internal Medicine',
    'doctors-surgery.html':       'Surgery',
    'doctors-cosmetic.html':      'Cosmetic',
    'doctors-neurology.html':     'Neurology',
    'doctors-psychiatry.html':    'Psychiatry',
    'doctors-ophthalmology.html': 'Ophthalmology',
  };
  const page = window.location.pathname.split('/').pop();
  return map[page] || null;
}

// ── Render admin doctors ─────────────────────
function renderAdminDoctors() {
  const specialty = getPageSpecialty();
  if (!specialty) return;
  const allDoctors = JSON.parse(localStorage.getItem('adminDoctors') || '[]');
  const filtered   = allDoctors.filter(d => d.spec === specialty);
  if (!filtered.length) return;
  const grid = document.getElementById('doc-grid');
  if (!grid) return;

  filtered.forEach((d, i) => {
    const timeSlots = d.times.split(',').map(t => t.trim()).filter(Boolean);
    const timesHTML = timeSlots.map(t => `<span class="doc-time-slot">${t}</span>`).join('');
    const card = document.createElement('div');
    card.className = 'doc-card';
    card.style.setProperty('--delay', `${(i + 0.4)}s`);
    card.innerHTML = `
      <div class="doc-card-accent"></div>
      <div class="doc-card-content">
        <div class="doc-avatar"><i class="fa-solid fa-user-doctor"></i></div>
        <div class="doc-name">${d.name}</div>
        <div class="doc-specialty-tag"><i class="fa-solid fa-circle-check"></i>${d.spec}<span class="admin-badge">New</span></div>
        <div class="doc-info">
          <div class="doc-info-row"><i class="fa-solid fa-location-dot"></i><span>${d.addr}</span></div>
          <div class="doc-info-row"><i class="fa-solid fa-phone"></i><span>${d.phone}</span></div>
          <div class="doc-info-row"><i class="fa-solid fa-clock"></i><span>Available Times:</span></div>
        </div>
        <div class="doc-times">${timesHTML}</div>
      </div>
      <div class="doc-card-footer">
        <button class="doc-book-btn" onclick='openBookingModal(${JSON.stringify(d.name)}, ${JSON.stringify(d.spec)}, ${JSON.stringify(timeSlots)})'>
          <i class="fa-solid fa-calendar-plus"></i> Book Now
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── Parse time slots into days + hours ───────
function parseSlots(timeSlotsArr) {
  // Each slot like "Mon 9AM-1PM" → { day: "Mon", from: "9AM", to: "1PM" }
  const days  = [];
  const hours = {};

  timeSlotsArr.forEach(slot => {
    const match = slot.match(/^(\w+)\s+(\S+)-(\S+)$/);
    if (!match) return;
    const day  = match[1];
    const from = match[2];
    const to   = match[3];
    if (!days.includes(day)) days.push(day);
    // Generate hours between from and to
    hours[day] = generateHours(from, to);
  });
  return { days, hours };
}

function parseHour(str) {
  // "9AM" → 9, "1PM" → 13, "12PM" → 12, "12AM" → 0
  const match = str.match(/^(\d+)(AM|PM)$/i);
  if (!match) return 9;
  let h = parseInt(match[1]);
  const period = match[2].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h;
}

function generateHours(from, to) {
  const start = parseHour(from);
  const end   = parseHour(to);
  const slots = [];
  for (let h = start; h < end; h++) {
    const period  = h < 12 ? 'AM' : 'PM';
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${display}:00 ${period}`);
    slots.push(`${display}:30 ${period}`);
  }
  return slots;
}

// ── Booking Modal ────────────────────────────
let currentBooking = {};

function openBookingModal(docName, specialty, timeSlotsArr) {
  currentBooking = { docName, specialty, timeSlotsArr };
  const { days, hours } = parseSlots(timeSlotsArr);

  // Build day options
  const daySelect = document.getElementById('modalDaySelect');
  daySelect.innerHTML = '<option value="">-- Select Day --</option>';
  days.forEach(d => {
    daySelect.innerHTML += `<option value="${d}">${d}</option>`;
  });

  // Clear hour select
  const hourSelect = document.getElementById('modalHourSelect');
  hourSelect.innerHTML = '<option value="">-- Select Day First --</option>';
  hourSelect.disabled = true;

  // Store hours map
  currentBooking.hoursMap = hours;

  // Update modal doctor info
  document.getElementById('modalDocName').textContent    = docName;
  document.getElementById('modalDocSpec').textContent    = specialty;
  document.getElementById('modalTimesStr').textContent   = timeSlotsArr.join(' | ');
  document.getElementById('bookingModal').classList.add('show');
}

function onDayChange() {
  const day        = document.getElementById('modalDaySelect').value;
  const hourSelect = document.getElementById('modalHourSelect');
  if (!day) {
    hourSelect.innerHTML = '<option value="">-- Select Day First --</option>';
    hourSelect.disabled  = true;
    return;
  }
  const hours = currentBooking.hoursMap[day] || [];
  hourSelect.innerHTML = '<option value="">-- Select Time --</option>';
  hours.forEach(h => {
    hourSelect.innerHTML += `<option value="${h}">${h}</option>`;
  });
  hourSelect.disabled = false;
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('show');
}

function confirmBooking() {
  const day  = document.getElementById('modalDaySelect').value;
  const hour = document.getElementById('modalHourSelect').value;
  const err  = document.getElementById('modalError');

  if (!day || !hour) {
    err.textContent = 'Please select both day and time!';
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';

  const session  = JSON.parse(localStorage.getItem('medicareSession') || '{}');
  const bookings = JSON.parse(localStorage.getItem('medicareBookings') || '[]');
  const now      = new Date();
  const bookingNum = bookings.length + 1;

  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const bookedAt = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const newBooking = {
    id:          now.getTime(),
    bookingNum:  bookingNum,
    doctor:      currentBooking.docName,
    specialty:   currentBooking.specialty,
    day:         day,
    time:        hour,
    phone:       session.phone || '',
    date:        dateStr,
    bookedAt:    bookedAt,
  };

  bookings.push(newBooking);
  localStorage.setItem('medicareBookings', JSON.stringify(bookings));

  closeBookingModal();

  // Mark button as booked
  document.querySelectorAll('.doc-book-btn').forEach(btn => {
    if (btn.onclick && btn.getAttribute('onclick') &&
        btn.getAttribute('onclick').includes(currentBooking.docName)) {
      btn.classList.add('booked');
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Booked!';
      btn.disabled  = true;
    }
  });

  showDocToast(`✅ Booking #${bookingNum} confirmed — ${day} at ${hour}`);
}

function showDocToast(message) {
  let toast = document.getElementById('docToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'docToast';
    toast.className = 'doc-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span id="docToastMsg"></span>`;
    document.body.appendChild(toast);
  }
  document.getElementById('docToastMsg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Open modal for static HTML doctors ───────
function openBookingModalFromHTML(docName, specialty, timesStr) {
  const timeSlotsArr = timesStr.split('/').map(t => t.trim()).filter(Boolean);
  openBookingModal(docName, specialty, timeSlotsArr);
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAdminDoctors();

  // Close modal on overlay click
  const overlay = document.getElementById('bookingModal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeBookingModal();
    });
  }
});
