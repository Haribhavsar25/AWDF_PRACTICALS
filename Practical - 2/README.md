# AWDF PR-2 : State Management & Routing in React

**Advanced Web Development Frameworks (ITUE301) - Practical 2**  
**Charotar University of Science and Technology (CHARUSAT)**  
**Faculty of Technology and Engineering | Department of Computer Science & Engineering**

---

### Student Information
- **Student Name:** Shubham Pansuriya
- **Student ID:** 24CS057
- **Course Code:** ITUE301
- **Course Name:** Advanced Web Development Frameworks
- **Practical:** 2 (State Management and Routing in React)
- **Academic Year:** 2026-27
- **Semester:** 5th Semester
- **GitHub Repository:** [https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%202.git](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%202.git)

---

## Practical Objectives
To implement reactive state management using the `useState` hook and multi-page client-side navigation using `React Router v6` in the existing portfolio application without full page reloads.

### Core Requirements Implemented:
1. **React Router Integration:**
   - Wrapped `<App />` with `<BrowserRouter>` in `main.jsx`.
   - Built a top navigation bar using `<NavLink>` to prevent browser reloads.
   - Defined active routes in `App.jsx`:
     - `/` &rarr; Home Page (`Home.jsx`)
     - `/projects` &rarr; Projects Page (`Projects.jsx`)
     - `/contact` &rarr; Contact Page (`Contact.jsx`)
     - `*` &rarr; Custom 404 Error Page (`NotFound.jsx`)
2. **State Management (`useState`):**
   - **Controlled Inputs:** Real-time form fields in `Contact.jsx` bound to `useState` with instant live preview.
   - **UI Visibility Toggle:** Second `useState` variable controlling visibility of a help/guidance tooltip box.
   - **Live Character Count:** Dynamic counter calculating and displaying character limits below the input in real time.
   - **Theme Mode Toggle:** Root-level `darkMode` state dynamically applying light/dark CSS classes.
   - **Category Filter State:** Category filtering in `Projects.jsx` updating displayed items dynamically.

---

## Architecture & Component Tree
```
App.jsx (wrapped in <BrowserRouter>)
 ├── NavBar.jsx (links to all routes via <NavLink>, dark/light toggle)
 ├── Route: "/" → Home.jsx (Hero, About, Skills)
 ├── Route: "/projects" → Projects.jsx (Category filtering state)
 ├── Route: "/contact" → Contact.jsx (Controlled input, character count, tooltip toggle)
 ├── Route: "*" → NotFound.jsx (404 custom error page)
 └── Footer.jsx (Persistent footer with repo URL)
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+ or v11+)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%202.git

# Navigate into the project directory
cd AWDF-PR-2

# Install dependencies (includes react-router-dom)
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## Practical Report Document
The completed practical report with all institutional headers, tables, problem definitions, source code, screenshots, and viva analysis answers is included in this repository:
- **PDF Report:** [`24CS057_AWDF_Practical_2.pdf`](./24CS057_AWDF_Practical_2.pdf)
- **Word Document:** [`24CS057_AWDF_Practical_2.docx`](./24CS057_AWDF_Practical_2.docx)
