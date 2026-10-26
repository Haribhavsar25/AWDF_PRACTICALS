import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('#2563eb');

  const studentData = {
    name: "Hari Bhavsar",
    studentId: "24CS009",
    courseCode: "ITUE301",
    courseTitle: "Advanced Web Development Frameworks",
    academicYear: "2026-27",
    semester: "5th Semester",
    institution: "Charotar University of Science and Technology (CHARUSAT)",
    department: "Department of Computer Science & Engineering, CSPIT",
    email: "24cs009@charusat.edu.in",
    githubRepo: "https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%203.git",
    bio: "Passionate Computer Science engineering undergraduate at CHARUSAT with deep enthusiasm for modern frontend web technologies, component-based architectures, and REST API integration.",
    education: "B.Tech in Computer Science & Engineering (Pursuing, CGPA: 7.3)"
  };

  const skills = [
    { name: "React.js", level: "Advanced" },
    { name: "REST API & Fetch", level: "Advanced" },
    { name: "useEffect & Async/Await", level: "Advanced" },
    { name: "React Router v6", level: "Proficient" },
    { name: "useState Hook", level: "Advanced" },
    { name: "JavaScript (ES6+)", level: "Advanced" },
    { name: "Vite & Build Tooling", level: "Proficient" },
    { name: "Git & GitHub", level: "Proficient" }
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`portfolio-app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <NavBar 
        darkMode={darkMode} 
        onToggleTheme={toggleTheme} 
      />

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Home studentData={studentData} skills={skills} themeColor={themeColor} />} 
          />
          <Route 
            path="/projects" 
            element={<Projects />} 
          />
          <Route 
            path="/contact" 
            element={<Contact studentEmail={studentData.email} />} 
          />
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </main>

      <Footer
        studentName={studentData.name}
        studentId={studentData.studentId}
        email={studentData.email}
        repoUrl={studentData.githubRepo}
      />
    </div>
  );
}

export default App;
