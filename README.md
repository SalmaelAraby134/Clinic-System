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

## Project Pages

- `index.html` - Main login/signup page for patients
- `home.html` - Authenticated landing page after sign-in
- `specialties.html` - Medical specialty overview
- `booking.html` - Appointment booking interface
- `contact.html` - Contact and support page
- `admin-login.html` - Admin portal login page

## Main Files

- `style.css` - Shared global styling and layout
- `script.js` - Login/signup logic and form validation
- `home.js` - Session guard, logout, and responsive navigation behavior
- `admin.css`, `admin-login.css` - Admin portal styles
- `admin-login.js` - Admin login interactions

## How to Use

1. Open `index.html` in a web browser.
2. Create an account using the sign-up form or log in with an existing user.
3. After successful login, the app redirects to `home.html`.
4. Use the navigation links to explore specialties, book appointments, or contact the clinic.
5. Visit `admin-login.html` to access the administration portal.

## Notes

- This project is a static frontend prototype and does not include a backend server.
- User accounts and sessions are stored locally in the browser using `localStorage`.
- For a production-ready app, replace `localStorage` with secure server-side authentication and data storage.

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Font Awesome icons
- Google Fonts
