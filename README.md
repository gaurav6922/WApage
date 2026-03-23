# MediDesk, WhatsApp Appointment Booking for Doctors

Landing page for MediDesk, a WhatsApp appointment booking bot for doctors in India.

## Project Structure

```
WApage/
├── index.html          # Main HTML file
├── README.md           # This file
├── css/
│   ├── main.css        # Entry point - imports all CSS modules
│   ├── variables.css   # Design tokens (colors, typography, etc.)
│   ├── base.css        # Reset, typography, layout
│   ├── animations.css  # Keyframes and animation utilities
│   ├── components.css  # Navbar, buttons, section labels
│   ├── sections.css    # Hero, features, pricing, testimonials, etc.
│   └── responsive.css  # Mobile breakpoints
└── js/
    └── main.js         # All JavaScript (navbar, chat demo, carousel, FAQ)
```

## Running Locally

1. Open `index.html` in a browser, or
2. Use a local server (e.g. `npx serve .` or `python -m http.server 8000`)

## Features

- Responsive layout (mobile, tablet, desktop)
- Animated hero and scroll-triggered animations
- Interactive chat demo with quick replies
- Pricing toggle (monthly/yearly)
- Testimonial carousel with touch support
- FAQ accordion
- Mobile hamburger menu
