# Practical 3: API Integration and Data Rendering in React

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%203.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%203.git)

---

## 📌 Practical Overview & Objectives
The objective of this practical is to consume an external public REST API (GitHub REST API) in a React application and robustly manage asynchronous data fetching across all stages of a network lifecycle, including:
1. **Asynchronous Lifecycle Handling:** Triggering API fetch calls safely on component mount using `useEffect()`.
2. **Three-State Management:** Implementing separate React states for `repos` (data), `loading` (boolean), and `error` (string/null) via `useState()`.
3. **UI Feedback & State Presentation:**
   - Displaying an animated `<Spinner />` component during loading.
   - Displaying an `<ErrorMessage />` component with a **Retry** button upon network failure.
   - Rendering structured repository cards on success with repository name, HTML URL, star counts, fork counts, and primary language.
4. **Supplementary Enhancements:**
   - Live search input filter to filter loaded repositories by name in real-time.
   - GitHub star count display (`stargazers_count`).
   - Interactive button to test and demonstrate error state handling without needing physical network disconnection.

---

## 🏗️ Architecture & Component Hierarchy

```text
src/
 ├── App.jsx               # Root router provider, theme state management, and navbar/footer layout
 ├── App.css               # Clean, minimalist styling tokens and responsive grid system
 ├── main.jsx              # React 18 DOM mount point
 ├── components/
 │    ├── Navbar.jsx       # Navigation bar with active route indicators and Dark/Light toggle
 │    ├── Footer.jsx       # Academic footer with Student ID, subject, and GitHub repo link
 │    ├── Spinner.jsx      # Animated SVG loading spinner component
 │    └── ErrorMessage.jsx # Error display banner with interactive Retry Request callback
 └── pages/
      ├── Home.jsx         # Landing page introducing student profile & project overview
      ├── Projects.jsx     # Core Practical 3 API integration page (useEffect + fetch + 3 states)
      ├── Contact.jsx      # Form handling and submission feedback
      └── NotFound.jsx     # Fallback 404 route
```

---

## ⚙️ Technical Implementation Details

### 1. State Declaration
```javascript
const [repos, setRepos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
```

### 2. Side Effect & API Fetch
```javascript
useEffect(() => {
  fetchRepos();
}, []); // Empty dependency array ensures request fires strictly once on mount

const fetchRepos = (triggerError = false) => {
  setLoading(true);
  setError(null);

  const url = triggerError
    ? 'https://api.github.com/users/invalid-nonexistent-user-404/repos'
    : 'https://api.github.com/users/Haribhavsar25/repos';

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API Error: HTTP ${res.status} (${res.statusText})`);
      return res.json();
    })
    .then((data) => setRepos(Array.isArray(data) ? data : []))
    .catch((err) => setError(err.message || 'Failed to fetch repositories.'))
    .finally(() => setLoading(false));
};
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%203.git
cd AWDF-PR-3

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev

# Open in browser at:
# http://localhost:5173 or http://localhost:5176
```

### Production Build
```bash
# Build production bundle
npm run build
```

---

## 🧪 Verification & Output Checklist
- [x] Monochrome Windows Command Prompt (`cmd.exe`) terminal execution screenshot.
- [x] Loading state verification showing `<Spinner />`.
- [x] Success state rendering live GitHub repositories with star count and link.
- [x] Search filter verifying real-time dynamic filtering.
- [x] Error state verification showing `<ErrorMessage />` and working retry trigger.
- [x] DevTools Network tab showing HTTP 200 GET request and JSON payload.
- [x] Official lab document generated: `24CS009_AWDF_Practical_3.pdf`.
