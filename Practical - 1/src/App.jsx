import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  // Theme color state passed as prop to Header (Supplementary requirement)
  const [themeColor, setThemeColor] = useState('#4f46e5');
  const [activeSection, setActiveSection] = useState('home');

  // Student Profile Data
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
    githubRepo: "https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%201.git",
    bio: "Passionate Computer Science engineering undergraduate at CHARUSAT with deep enthusiasm for modern frontend web technologies, component-based architectures, and scalable full-stack software development.",
    education: "B.Tech in Computer Science & Engineering (Pursuing, CGPA: 7.3)"
  };

  // Skill array passed as prop to Skills component (Mandatory requirement)
  const skills = [
    { name: "React.js", level: "Advanced" },
    { name: "JavaScript (ES6+)", level: "Advanced" },
    { name: "Vite & Tooling", level: "Proficient" },
    { name: "HTML5 & CSS3", level: "Expert" },
    { name: "Node.js & Express", level: "Proficient" },
    { name: "MongoDB & SQL", level: "Intermediate" },
    { name: "C++ & Python", level: "Proficient" },
    { name: "Git & GitHub", level: "Proficient" }
  ];

  // Projects array passed as prop to Projects component (Supplementary requirement)
  const projects = [
    {
      id: 1,
      title: "CivicVoice - Citizen Engagement Platform",
      category: "Full Stack Web App",
      description: "A comprehensive digital governance platform enabling citizens to voice local infrastructure complaints, track resolution workflows, and engage with municipal bodies.",
      tech: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
      link: "https://github.com/ShubhamPansuriya23"
    },
    {
      id: 2,
      title: "Student Portfolio React Application",
      category: "React & Vite Scaffolding",
      description: "Modular, component-driven portfolio engineered for AWDF Practical 1 demonstrating functional components, dynamic props rendering, and responsive UI architecture.",
      tech: ["React 19", "Vite", "Modern CSS", "Component Architecture"],
      link: "https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%201.git"
    },
    {
      id: 3,
      title: "Odoo Hackathon Enterprise Solution",
      category: "Hackathon Project",
      description: "Innovative enterprise workflow automation prototype built during the 2025 Odoo Hackathon in Gandhinagar, tackling optimized resource distribution and real-time alerts.",
      tech: ["Python", "JavaScript", "REST APIs", "PostgreSQL"],
      link: "https://github.com/ShubhamPansuriya23"
    }
  ];

  // Palette options for theme customization
  const colorOptions = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Amber', value: '#d97706' },
  ];

  return (
    <div className="portfolio-app">
      {/* 1. Navbar Component */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={(sec) => setActiveSection(sec)} 
      />

      <div className="theme-selector-bar">
        <span>Customize Theme Color (Prop Demonstration):</span>
        <div className="theme-buttons">
          {colorOptions.map((c) => (
            <button
              key={c.name}
              className={`theme-dot ${themeColor === c.value ? 'selected' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setThemeColor(c.value)}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <main className="main-content">
        {/* 2. Header Component (receives name, studentId, course, and themeColor props) */}
        <Header
          name={studentData.name}
          studentId={studentData.studentId}
          courseTitle={`${studentData.courseCode} - ${studentData.courseTitle}`}
          subtitle="Building modern, performant web applications with modular component architecture."
          themeColor={themeColor}
        />

        {/* 3. About Component (receives bio, education, dept, institution props) */}
        <About
          bio={studentData.bio}
          education={studentData.education}
          department={studentData.department}
          institution={studentData.institution}
        />

        {/* 4. Skills Component (receives skillList prop dynamically rendered) */}
        <Skills skillList={skills} />

        {/* 5. Projects Component (receives projectList prop) */}
        <Projects projectList={projects} />
      </main>

      {/* 6. Footer Component (receives student & repository info) */}
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
