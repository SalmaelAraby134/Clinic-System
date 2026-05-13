# MediCare Clinic

A responsive clinic portal prototype built with plain HTML, CSS, and JavaScript. It provides a polished patient-facing experience with login/signup, protected home navigation, specialty browsing, appointment booking, contact support, and an admin login screen.

## Key Features

- Login / Sign up interface with validation and feedback
- User session management using `localStorage`
- Protected home page that requires authentication
- Responsive navigation with desktop and mobile menu support
- Specialty browsing, booking, and contact pages for patients
- Admin login portal for restricted access
- Modern glassmorphism UI with animated backgrounds and toast notifications

## Project Structure

```
clini-system/
├── index.html              # Main login/signup page
├── README.md
├── css/
│   ├── style.css           # Shared global styling
│   ├── admin.css           # Admin portal styles
│   └── admin-login.css     # Admin login styles
├── js/
│   ├── script.js           # Login/signup logic and validation
│   ├── home.js             # Session management and navigation
│   ├── booking.js          # Booking functionality
│   ├── contact.js          # Contact form handling
│   ├── doctors.js          # Doctor specialties
│   ├── admin.js            # Admin dashboard
│   └── admin-login.js      # Admin login interactions
└── pages/
    ├── home.html           # Authenticated home page
    ├── specialties.html    # Medical specialties overview
    ├── booking.html        # Appointment booking
    ├── contact.html        # Contact and support
    ├── admin-login.html    # Admin portal login
    ├── admin.html          # Admin dashboard
    └── doctors-*.html      # Specialty pages
        ├── doctors-cosmetic.html
        ├── doctors-internal.html
        ├── doctors-neurology.html
        ├── doctors-ophthalmology.html
        ├── doctors-psychiatry.html
        └── doctors-surgery.html
```

## Main Files

**CSS Styling** (`css/`)
- `style.css` - Shared global styling, layout, and responsive design
- `admin.css` - Admin dashboard and portal styles
- `admin-login.css` - Admin login page styles

**JavaScript** (`js/`)
- `script.js` - Login/signup logic, form validation, and authentication
- `home.js` - Session management, logout, and responsive navigation
- `booking.js` - Appointment booking functionality
- `contact.js` - Contact form handling
- `doctors.js` - Specialty and doctor filtering
- `admin.js` - Admin dashboard interactions
- `admin-login.js` - Admin login interactions

**Pages** (`pages/`)
- `home.html` - Authenticated landing page after sign-in
- `specialties.html` - Medical specialty overview with filter options
- `booking.html` - Appointment booking interface
- `contact.html` - Contact and support page
- `admin-login.html` - Admin portal login page
- `admin.html` - Admin dashboard
- `doctors-*.html` - Individual specialty pages (6 specialties)

## Getting Started

1. Open `index.html` in a web browser.
2. Create an account using the sign-up form or log in with existing credentials.
3. After successful authentication, you'll be redirected to the home page (`pages/home.html`).
4. Use the navigation menu to explore:
   - **Specialties** - Browse medical departments and view doctors
   - **Booking** - Schedule appointments
   - **Contact** - Send messages to the clinic
5. Access the admin portal by clicking the "Admin Portal" link on the login page or navigating directly to `pages/admin-login.html`.

## Notes

- This project is a static frontend prototype and does not include a backend server.
- User accounts and sessions are stored locally in the browser using `localStorage`.
- For a production-ready app, replace `localStorage` with secure server-side authentication and data storage.
- **Project Organization**: Files are organized into logical folders (`css/`, `js/`, `pages/`) for better maintainability and scalability.

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Font Awesome icons
- Google Fonts
