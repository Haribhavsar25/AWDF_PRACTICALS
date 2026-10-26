# AWDF PR-1 : Student Portfolio React Application

**Advanced Web Development Frameworks (ITUE301) - Practical 1**  
**Charotar University of Science and Technology (CHARUSAT)**  
**Faculty of Technology and Engineering | Department of Computer Science & Engineering**

---

### Student Information
- **Student Name:** Hari Bhavsar
- **Student ID:** 24CS009
- **Course Code:** ITUE301
- **Course Name:** Advanced Web Development Frameworks
- **Practical:** 1 (Introduction to React and Component Architecture)
- **Academic Year:** 2026-27
- **Semester:** 5th Semester
- **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%201.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%201.git)

---

## Practical Objectives
To set up a modern React development environment using Vite and build a modular, responsive static UI using independently structured, reusable components.

### Core Requirements Implemented:
1. **Vite Scaffolding:** Initialized React application using modern Vite build tooling.
2. **Reusable Component Architecture:**
   - `Navbar.jsx`: Sticky navigation bar with active section highlight and brand identifier.
   - `Header.jsx`: Hero presentation with student identification, course title, and dynamic `themeColor` inline style prop.
   - `About.jsx`: Profile overview, academic credentials, and CGPA highlights.
   - `Skills.jsx`: Technical competencies dynamically rendered from `skillList` array prop using `map()`.
   - `Projects.jsx`: Showcase of academic and hackathon projects with technology tags.
   - `Footer.jsx`: Contact information, university copyright, and GitHub repository deliverable link.
3. **Props Passing:** Props utilized to transfer data from parent (`App.jsx`) to multiple child components (`Header`, `About`, `Skills`, `Projects`, `Footer`).
4. **Clean Code & No Duplication:** Strict separation of concerns with reusable styles in `App.css`.

---

## Component Tree
```
App.jsx (Root Layout & State Management)
 ├── Navbar.jsx (Brand, Navigation Links, Active State)
 ├── Header.jsx (Receives: name, studentId, courseTitle, subtitle, themeColor)
 ├── About.jsx (Receives: bio, education, department, institution)
 ├── Skills.jsx (Receives: skillList prop, mapped with unique keys)
 ├── Projects.jsx (Receives: projectList prop, tech badges & repo links)
 └── Footer.jsx (Receives: studentName, studentId, email, repoUrl)
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+ or v11+)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%201.git

# Navigate into the project directory
cd AWDF-PR-1

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## Practical Report Document
The completed practical report with all institutional headers, tables, problem definitions, source code, screenshots, and viva analysis answers is included in this repository:
- **PDF Report:** [`24CS009_AWDF_Practical_1.pdf`](./24CS009_AWDF_Practical_1.pdf)
- **Word Document:** [`24CS009_AWDF_Practical_1.docx`](./24CS009_AWDF_Practical_1.docx)
