import { 
  register, 
  login, 
  getCourses, 
  getGrades, 
  getAssignments, 
  getAnnouncements 
} from './api.js';

// Store user data
let currentUser = null;
let currentUserId = null;

// Navigation - Show specific page
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    targetPage.classList.add('active');
    
    // Trigger page-specific load functions
    if (pageId === 'courses-page' && currentUserId) {
      loadCourses();
    }
    if (pageId === 'grades-page' && currentUserId) {
      loadGrades();
    }
  }
}

// Login Handler
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  const result = await login({ email, password });
  
  if (result.success) {
    currentUser = result.user;
    currentUserId = result.user.id;
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('userId', currentUserId);
    updateAuthUI();
    showPage('courses-page');
    loadCourses();
  } else {
    alert(result.error);
  }
}

// Register Handler
async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    role: formData.get('role'),
    student_id: formData.get('student_id')
  };
  
  const result = await register(data);
  
  if (result.success) {
    alert('Registration successful! Please login.');
    showPage('login-page');
  } else {
    alert(result.error);
  }
}

// Load Courses
async function loadCourses() {
  const result = await getCourses(currentUserId);
  
  if (result.success) {
    const coursesContainer = document.getElementById('courses-list');
    if (coursesContainer) {
      coursesContainer.innerHTML = '';
      
      result.courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
          <h3>${course.code}: ${course.name}</h3>
          <p>${course.description || 'No description'}</p>
          <p><strong>Teacher:</strong> ${course.teacher_first_name} ${course.teacher_last_name}</p>
          <p><strong>Credits:</strong> ${course.credits}</p>
          <button onclick="loadCourseDetails(${course.id})">View Details</button>
        `;
        coursesContainer.appendChild(courseCard);
      });
    }
  }
}

// Load Course Details
async function loadCourseDetails(courseId) {
  showPage('course-details-page');
  
  // Load assignments
  const assignmentsResult = await getAssignments(courseId);
  const announcementsResult = await getAnnouncements(courseId);
  
  const assignmentsList = document.getElementById('assignments-list');
  const announcementsList = document.getElementById('announcements-list');
  
  if (assignmentsList) {
    assignmentsList.innerHTML = '';
    assignmentsResult.assignments.forEach(assignment => {
      const assignmentItem = document.createElement('div');
      assignmentItem.className = 'assignment-item';
      assignmentItem.innerHTML = `
        <h4>${assignment.title}</h4>
        <p>Due: ${assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'Not set'}</p>
        <p>Max Score: ${assignment.max_score}</p>
      `;
      assignmentsList.appendChild(assignmentItem);
    });
  }
  
  if (announcementsList) {
    announcementsList.innerHTML = '';
    announcementsResult.pinned.forEach(announcement => {
      const announcementItem = document.createElement('div');
      announcementItem.className = 'announcement-item pinned';
      announcementItem.innerHTML = `
        <strong>${announcement.title}</strong>
        <p>${announcement.content}</p>
        <small>Posted by ${announcement.author_first_name} ${announcement.author_last_name}</small>
      `;
      announcementsList.appendChild(announcementItem);
    });
    
    announcementsResult.general.forEach(announcement => {
      const announcementItem = document.createElement('div');
      announcementItem.className = 'announcement-item';
      announcementItem.innerHTML = `
        <strong>${announcement.title}</strong>
        <p>${announcement.content}</p>
        <small>Posted by ${announcement.author_first_name} ${announcement.author_last_name}</small>
      `;
      announcementsList.appendChild(announcementItem);
    });
  }
}

// Load Grades
async function loadGrades() {
  const now = new Date();
  const semester = now.getMonth() < 6 ? 'Spring' : 'Fall';
  const year = now.getFullYear();
  
  const result = await getGrades(currentUserId, semester, year);
  
  if (result.success) {
    const gradesContainer = document.getElementById('grades-list');
    if (gradesContainer) {
      gradesContainer.innerHTML = '';
      
      result.grades.forEach(course => {
        const gradeCard = document.createElement('div');
        gradeCard.className = 'grade-card';
        gradeCard.innerHTML = `
          <h3>${course.course_code}: ${course.course_name}</h3>
          <p>Average: ${course.average}%</p>
          <div class="assignments">
            ${course.assignments.map(a => `
              <div class="assignment">
                <strong>${a.assignment_name}</strong>
                <span>${a.score !== null ? a.score + '/' + a.max_score : 'Not graded'}</span>
              </div>
            `).join('')}
          </div>
        `;
        gradesContainer.appendChild(gradeCard);
      });
    }
  }
}

// Update Auth UI (show/hide login/register/logout buttons)
function updateAuthUI() {
  const navLogin = document.getElementById('nav-login-btn');
  const navRegister = document.getElementById('nav-register-btn');
  const navLogout = document.getElementById('nav-logout-btn');
  
  if (currentUser) {
    if (navLogin) navLogin.classList.add('hidden');
    if (navRegister) navRegister.classList.add('hidden');
    if (navLogout) navLogout.classList.remove('hidden');
  } else {
    if (navLogin) navLogin.classList.remove('hidden');
    if (navRegister) navRegister.classList.remove('hidden');
    if (navLogout) navLogout.classList.add('hidden');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Student Portal App Starting');
  
  // Check for stored user
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    currentUserId = localStorage.getItem('userId');
    updateAuthUI();
    showPage('courses-page');
    loadCourses();
  }
  
  // Attach event listeners to login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Attach event listeners to register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Login page navigation links
  const loginToRegister = document.getElementById('login-to-register');
  if (loginToRegister) {
    loginToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('register-page');
    });
  }
  
  const registerToLogin = document.getElementById('register-to-login');
  if (registerToLogin) {
    registerToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('login-page');
    });
  }
  
  // Main navigation links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      
      if (page === 'home') {
        if (currentUser) {
          showPage('courses-page');
          loadCourses();
        } else {
          showPage('home-page');
        }
      } else if (page === 'courses') {
        if (currentUser) {
          showPage('courses-page');
          loadCourses();
        } else {
          showPage('login-page');
        }
      } else if (page === 'grades') {
        if (currentUser) {
          showPage('grades-page');
          loadGrades();
        } else {
          showPage('login-page');
        }
      } else if (page === 'assignments') {
        if (currentUser) {
          showPage('assignments-page');
        } else {
          showPage('login-page');
        }
      } else if (page === 'announcements') {
        if (currentUser) {
          showPage('announcements-page');
        } else {
          showPage('login-page');
        }
      }
    });
  });
  
  // Logout button
  const navLogout = document.getElementById('nav-logout-btn');
  if (navLogout) {
    navLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      currentUser = null;
      currentUserId = null;
      updateAuthUI();
      showPage('home-page');
    });
  }
  
  // Back buttons
  const backToCourses = document.getElementById('back-to-courses');
  if (backToCourses) {
    backToCourses.addEventListener('click', () => {
      showPage('courses-page');
    });
  }
  
  const backToCoursesFromGrades = document.getElementById('back-to-courses-from-grades');
  if (backToCoursesFromGrades) {
    backToCoursesFromGrades.addEventListener('click', () => {
      showPage('courses-page');
    });
  }
  
  const backToCoursesFromAssignments = document.getElementById('back-to-courses-from-assignments');
  if (backToCoursesFromAssignments) {
    backToCoursesFromAssignments.addEventListener('click', () => {
      showPage('courses-page');
    });
  }
  
  const backToCoursesFromAnnouncements = document.getElementById('back-to-courses-from-announcements');
  if (backToCoursesFromAnnouncements) {
    backToCoursesFromAnnouncements.addEventListener('click', () => {
      showPage('courses-page');
    });
  }
});

// Make functions globally available
window.showPage = showPage;
window.loadCourses = loadCourses;
window.loadCourseDetails = loadCourseDetails;
window.loadGrades = loadGrades;
