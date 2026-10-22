import React from 'react';
import Header from '../components/Header.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';

function Home({ studentData, skills, themeColor }) {
  return (
    <div className="page-container">
      <Header
        name={studentData.name}
        studentId={studentData.studentId}
        courseTitle={`${studentData.courseCode} - ${studentData.courseTitle}`}
        subtitle="Practical 2: Demonstrating State Management with useState and Multi-Page Routing using React Router."
        themeColor={themeColor}
      />

      <About
        bio={studentData.bio}
        education={studentData.education}
        department={studentData.department}
        institution={studentData.institution}
      />

      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
