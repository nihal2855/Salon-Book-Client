# SalonBook — Salon Appointment Booking Platform (Client)

**SalonBook** is a modern, responsive, role-based salon appointment booking web application. Customers can explore active salon treatments, search and filter services, request appointments for specific dates and time slots, and pay for confirmed bookings securely through Stripe. Administrators can manage salon services, review and confirm or cancel appointment requests, manage registered users, and monitor verified payment transactions[cite: 1, 2, 3].
 
--- 
   
## Live Links & Repositories

- **Live Website:** https://salonbo.vercel.app
- **Live Backend API:** https://salonbo.onrender.com

---

## Important Features

### Public & Discovery Features
- **Home Page:** Includes a salon-themed hero banner, featured active services, interactive service categories, and a step-by-step booking guide[cite: 7, 8].
- **Browse Services:** Real-time search by service name, category-based filtering, and price sorting (Low to High / High to Low) without requiring login[cite: 8, 9].
- **Legal & Info Pages:** Dedicated **Privacy Policy** and **Terms & Conditions** pages accessible from the footer.

### Authentication & Role-Based Security
- **Better Auth Integration:** Supports Email & Password registration/login as well as Google OAuth sign-in[cite: 10, 11].
- **Strict Validation & Protection:** Enforces password complexity rules, blocks unauthorized access to role-specific dashboards, prevents blocked users from accessing protected features, and bridges sessions with signed JWTs for backend API verification[cite: 10, 11, 20].

### Customer Dashboard
- **Overview:** Displays total, pending, confirmed, and cancelled appointment counts[cite: 12].
- **My Appointments:** View full booking details, cancel `Pending` requests, and pay for `Confirmed` appointments via **Stripe Checkout**[cite: 12, 13, 17].
- **My Profile:** Update full name, phone number, and profile avatar (via ImgBB file upload or direct image URL)[cite: 13, 18].

### Admin Dashboard
- **Overview:** Displays key metrics including total customers, active services, appointment breakdowns, and successful payments[cite: 13].
- **Manage Services:** Create new services with ImgBB file uploads, edit service details, toggle `Active` / `Inactive` visibility, and delete services[cite: 13, 14].
- **Manage Appointments:** Inspect customer booking requests, confirm `Pending` appointments, and cancel `Pending` or `Confirmed` bookings[cite: 14, 15].
- **Manage Users:** View registered customers, inspect customer details, and block or unblock user accounts[cite: 15].
- **Transactions:** View read-only, webhook-verified Stripe payment records[cite: 15, 16].

---

## Technology Stack

- **Framework:** Next.js (App Router)[cite: 3]
- **Language:** JavaScript (ES6+)[cite: 3]
- **Styling & Icons:** Tailwind CSS, Lucide React
- **Authentication:** Better Auth (Credentials & Google OAuth) + JWT Bridge[cite: 10, 20]
- **Payments:** Stripe Checkout[cite: 2, 17]
- **Image Hosting:** ImgBB API[cite: 3]
- **Notifications:** React Hot Toast[cite: 19]
