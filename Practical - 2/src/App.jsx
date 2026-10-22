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
  // 1. Dark/Light Mode state (Supplementary Requirement)
  const [darkMode, setDarkMode] = useState(false);

  // 2. Theme accent color state
  const [themeColor, setThemeColor] = useState('#2563eb');

  const studentData = {
    name: "Shubham Pansuriya",
    studentId: "24CS057",
    courseCode: "ITUE301",
    courseTitle: "Advanced Web Development Frameworks",
    academicYear: "2026-27",
    semester: "5th Semester",
    institution: "Charotar University of Science and Technology (CHARUSAT)",
    department: "Department of Computer Science & Engineering, CSPIT",
    email: "24cs057@charusat.edu.in",
    githubRepo: "https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%202.git",
    bio: "Passionate Computer Science engineering undergraduate at CHARUSAT with deep enthusiasm for modern frontend web technologies, component-based architectures, and reactive state management.",
    education: "B.Tech in Computer Science & Engineering (Pursuing, CGPA: 7.3)"
  };

  const skills = [
    { name: "React.js", level: "Advanced" },
    { name: "React Router v6", level: "Proficient" },
    { name: "useState & Hooks", level: "Advanced" },
    { name: "JavaScript (ES6+)", level: "Advanced" },
    { name: "Vite & Build Tooling", level: "Proficient" },
    { name: "HTML5 & CSS3", level: "Expert" },
    { name: "Node.js & Express", level: "Proficient" },
    { name: "Git & GitHub", level: "Proficient" }
  ];

  const projects = [
    {
      id: 1,
      title: "CivicVoice - Citizen Engagement Platform",
      category: "Full Stack Web App",
      description: "A comprehensive digital governance platform enabling citizens to voice infrastructure complaints, track resolutions, and interact with municipal departments.",
      tech: ["React Router", "Node.js", "Express", "MongoDB", "TailwindCSS"],
      link: "https://github.com/ShubhamPansuriya23"
    },
    {
      id: 2,
      title: "Student Portfolio React Application",
      category: "React & Vite Scaffolding",
      description: "Modular, multi-route portfolio engineered for AWDF Practical 2 demonstrating client-side routing, controlled forms, and reactive UI state management.",
      tech: ["React 19", "React Router v6", "Vite", "Modern CSS"],
      link: "https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%202.git"
    },
    {
      id: 3,
      title: "Odoo Hackathon Enterprise Solution",
      category: "Hackathon Project",
      description: "Innovative enterprise workflow prototype developed at the 2025 Odoo Hackathon in Gandhinagar, tackling resource distribution and automated tracking.",
      tech: ["Python", "JavaScript", "REST APIs", "PostgreSQL"],
      link: "https://github.com/ShubhamPansuriya23"
    }
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`portfolio-app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Navigation Bar across all routes */}
      <NavBar 
        darkMode={darkMode} 
        onToggleTheme={toggleTheme} 
      />

      {/* Main Routed Content */}
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Home studentData={studentData} skills={skills} themeColor={themeColor} />} 
          />
          <Route 
            path="/projects" 
            element={<Projects projectList={projects} />} 
          />
          <Route 
            path="/contact" 
            element={<Contact studentEmail={studentData.email} />} 
          />
          {/* Wildcard 404 Route */}
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </main>

      {/* Persistent Footer */}
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
