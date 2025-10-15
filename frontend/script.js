// Global variables
let currentUser = null;
let allPlacements = [];
let allStudents = [];
let allCompanies = [];
let allApplications = [];
let currentRole = null;

// API Base URL
const API_BASE_URL = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    checkUserSession();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'placement-drives':
            initializePlacementDrivesPage();
            break;
        case 'student-dashboard':
            initializeStudentDashboard();
            break;
        case 'company-dashboard':
            initializeCompanyDashboard();
            break;
        case 'auth':
            initializeAuthPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') return 'index';
    if (page === 'placement-drives.html') return 'placement-drives';
    if (page === 'student-dashboard.html') return 'student-dashboard';
    if (page === 'company-dashboard.html') return 'company-dashboard';
    if (page === 'auth.html') return 'auth';
    
    return 'index';
}

function initializeNavigation() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function checkUserSession() {
    // Simple session check using localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    console.log('User logged in:', currentUser);
    // Update navigation or redirect based on user role
    if (currentUser) {
        currentRole = currentUser.role;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    currentRole = null;
    window.location.href = 'index.html';
}

// ===== HOME PAGE FUNCTIONALITY =====
function initializeHomePage() {
    loadDashboardStats();
    loadRecentPlacements();
}

async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const data = await response.json();
        
        if (data.success) {
            updateStatsDisplay(data.data);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function updateStatsDisplay(stats) {
    const elements = {
        totalStudents: document.getElementById('totalStudents'),
        totalCompanies: document.getElementById('totalCompanies'),
        activePlacements: document.getElementById('activePlacements'),
        successfulPlacements: document.getElementById('successfulPlacements')
    };

    if (elements.totalStudents) elements.totalStudents.textContent = stats.totalStudents + '+';
    if (elements.totalCompanies) elements.totalCompanies.textContent = stats.totalCompanies + '+';
    if (elements.activePlacements) elements.activePlacements.textContent = stats.activePlacements + '+';
    if (elements.successfulPlacements) elements.successfulPlacements.textContent = stats.selectedStudents + '+';
}

async function loadRecentPlacements() {
    try {
        const response = await fetch(`${API_BASE_URL}/placements`);
        const data = await response.json();
        
        if (data.success) {
            allPlacements = data.data;
            displayRecentPlacements(data.data.slice(0, 3)); // Show only 3 recent placements on home page
        }
    } catch (error) {
        console.error('Error loading placements:', error);
    }
}

function displayRecentPlacements(placements) {
    const container = document.getElementById('recentPlacementsContainer');
    if (!container) return;

    if (placements.length === 0) {
        container.innerHTML = '<p class="no-results">No placement drives available at the moment.</p>';
        return;
    }

    container.innerHTML = placements.map(placement => createPlacementCard(placement)).join('');
}

// ===== PLACEMENT DRIVES PAGE =====
function initializePlacementDrivesPage() {
    loadAllPlacements();
    initializeFilters();
}

async function loadAllPlacements() {
    try {
        showLoadingSpinner();
        const response = await fetch(`${API_BASE_URL}/placements`);
        const data = await response.json();
        
        if (data.success) {
            allPlacements = data.data;
            displayPlacements(allPlacements);
        }
    } catch (error) {
        console.error('Error loading placements:', error);
        showError('Failed to load placement drives');
    } finally {
        hideLoadingSpinner();
    }
}

function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const ctcFilter = document.getElementById('ctcFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterPlacements);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPlacements);
    }
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterPlacements);
    }
    if (ctcFilter) {
        ctcFilter.addEventListener('change', filterPlacements);
    }
}

function filterPlacements() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const departmentFilter = document.getElementById('departmentFilter')?.value || '';
    const ctcFilter = document.getElementById('ctcFilter')?.value || '';

    let filtered = allPlacements.filter(placement => {
        const matchesSearch = placement.title.toLowerCase().includes(searchTerm) ||
                            placement.companyName.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || placement.status === statusFilter;
        
        const matchesDepartment = !departmentFilter || 
                                placement.requirements.eligibleDepartments.includes(departmentFilter);
        
        const matchesCTC = !ctcFilter || checkCTCRange(placement.jobDetails.ctc, ctcFilter);

        return matchesSearch && matchesStatus && matchesDepartment && matchesCTC;
    });

    displayPlacements(filtered);
}

function checkCTCRange(ctc, range) {
    const ctcValue = parseFloat(ctc);
    
    switch(range) {
        case '0-5':
            return ctcValue >= 0 && ctcValue <= 5;
        case '5-8':
            return ctcValue > 5 && ctcValue <= 8;
        case '8-12':
            return ctcValue > 8 && ctcValue <= 12;
        case '12+':
            return ctcValue > 12;
        default:
            return true;
    }
}

function displayPlacements(placements) {
    const container = document.getElementById('placementsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;

    if (placements.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    container.innerHTML = placements.map(placement => createPlacementCard(placement)).join('');
    
    // Add click listeners to placement cards
    container.querySelectorAll('.placement-card').forEach((card, index) => {
        card.addEventListener('click', () => showPlacementDetails(placements[index]));
    });
}

function createPlacementCard(placement) {
    const statusClass = `status-${placement.status.replace('_', '-')}`;
    const deadline = new Date(placement.applicationDeadline).toLocaleDateString();
    
    return `
        <div class="placement-card" data-id="${placement.id}">
            <div class="placement-header">
                <h3>${placement.title}</h3>
                <p class="company-name">${placement.companyName}</p>
            </div>
            <div class="placement-body">
                <div class="placement-meta">
                    <div class="meta-item">
                        <div class="meta-label">CTC</div>
                        <div class="meta-value">${placement.jobDetails.ctc}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">${placement.jobDetails.location}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Min CGPA</div>
                        <div class="meta-value">${placement.requirements.minimumCGPA}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Deadline</div>
                        <div class="meta-value">${deadline}</div>
                    </div>
                </div>
                <p class="placement-description">${placement.description.substring(0, 120)}...</p>
                <div class="placement-footer">
                    <span class="status-badge ${statusClass}">${placement.status.replace('_', ' ')}</span>
                    <div class="placement-actions">
                        ${currentRole === 'student' ? 
                            `<button class="btn btn-primary btn-sm" onclick="applyToPlacement(${placement.id})">Apply Now</button>` : 
                            `<button class="btn btn-secondary btn-sm">View Details</button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== AUTHENTICATION =====
function initializeAuthPage() {
    initializeRoleSelection();
    initializeAuthForms();
}

function initializeRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    const authForms = document.querySelector('.auth-forms');
    const roleSelection = document.querySelector('.role-selection');
    const backToRoles = document.getElementById('backToRoles');

    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.id.replace('Role', '');
            selectRole(role);
            
            if (roleSelection) roleSelection.style.display = 'none';
            if (authForms) authForms.style.display = 'block';
        });
    });

    if (backToRoles) {
        backToRoles.addEventListener('click', function() {
            if (roleSelection) roleSelection.style.display = 'block';
            if (authForms) authForms.style.display = 'none';
        });
    }
}

function selectRole(role) {
    currentRole = role;
    
    // Update form titles
    const loginRoleTitle = document.getElementById('loginRoleTitle');
    const registerRoleTitle = document.getElementById('registerRoleTitle');
    const loginRole = document.getElementById('loginRole');
    
    if (loginRoleTitle) loginRoleTitle.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    if (registerRoleTitle) registerRoleTitle.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    if (loginRole) loginRole.value = role;

    // Show appropriate registration form
    document.querySelectorAll('.role-specific-form').forEach(form => {
        form.style.display = 'none';
    });
    
    const targetForm = document.getElementById(`${role}RegisterForm`);
    if (targetForm) {
        targetForm.style.display = 'block';
    }

    // Update demo credentials
    updateDemoCredentials(role);
}

function updateDemoCredentials(role) {
    const demoContainer = document.getElementById('demoCredentialsContent');
    if (!demoContainer) return;

    const credentials = {
        student: [
            { email: 'priya.sharma@university.edu', password: 'student123' },
            { email: 'rahul.gupta@university.edu', password: 'student123' }
        ],
        company: [
            { email: 'hr@techcorp.com', password: 'company123' },
            { email: 'careers@datavision.com', password: 'company123' }
        ],
        admin: [
            { email: 'admin@university.edu', password: 'admin123' }
        ]
    };

    const roleCreds = credentials[role] || [];
    demoContainer.innerHTML = roleCreds.map(cred => 
        `<div class="demo-credential">
            <strong>Email:</strong> ${cred.email} | <strong>Password:</strong> ${cred.password}
        </div>`
    ).join('');
}

function initializeAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration forms
    const studentForm = document.getElementById('studentRegisterForm');
    const companyForm = document.getElementById('companyRegisterForm');
    
    if (studentForm) {
        studentForm.addEventListener('submit', handleStudentRegistration);
    }
    if (companyForm) {
        companyForm.addEventListener('submit', handleCompanyRegistration);
    }

    // Tab switching
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (loginTab) loginTab.addEventListener('click', () => showTab('login'));
    if (registerTab) registerTab.addEventListener('click', () => showTab('register'));
}

function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tabName}Form`).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect based on role
            redirectAfterLogin(currentUser.role);
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    }
}

function redirectAfterLogin(role) {
    switch(role) {
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        case 'company':
            window.location.href = 'company-dashboard.html';
            break;
        case 'admin':
        case 'coordinator':
            window.location.href = 'admin-dashboard.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

async function handleStudentRegistration(e) {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        password: document.getElementById('studentPassword').value,
        studentId: document.getElementById('studentId').value,
        department: document.getElementById('studentDepartment').value,
        year: document.getElementById('studentYear').value,
        cgpa: parseFloat(document.getElementById('studentCGPA').value),
        phone: document.getElementById('studentPhone').value,
        skills: document.getElementById('studentSkills').value.split(',').map(s => s.trim()),
        address: ''
    };

    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Student registration successful! Please login to continue.');
            showTab('login');
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    }
}

async function handleCompanyRegistration(e) {
    e.preventDefault();
    
    const companyData = {
        name: document.getElementById('companyName').value,
        email: document.getElementById('companyEmail').value,
        password: document.getElementById('companyPassword').value,
        industry: document.getElementById('companyIndustry').value,
        companySize: document.getElementById('companySize').value,
        website: document.getElementById('companyWebsite').value,
        location: document.getElementById('companyLocation').value,
        description: document.getElementById('companyDescription').value,
        hrContactPerson: document.getElementById('hrContactPerson').value,
        hrPhone: document.getElementById('hrPhone').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData)
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Company registration successful! Your account is pending approval. Please login after approval.');
            showTab('login');
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    }
}

// ===== STUDENT DASHBOARD =====
function initializeStudentDashboard() {
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'auth.html';
        return;
    }

    loadStudentDashboard();
    initializeTabs();
}

async function loadStudentDashboard() {
    try {
        // Load student data
        await loadStudentProfile();
        await loadStudentApplications();
        await loadEligibleDrives();
        
        // Update stats
        updateStudentStats();
    } catch (error) {
        console.error('Error loading student dashboard:', error);
    }
}

async function loadStudentProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const data = await response.json();
        
        if (data.success) {
            const student = data.data.find(s => s.id === currentUser.id);
            if (student) {
                displayStudentProfile(student);
            }
        }
    } catch (error) {
        console.error('Error loading student profile:', error);
    }
}

function displayStudentProfile(student) {
    // Update welcome message
    const studentName = document.getElementById('studentName');
    if (studentName) studentName.textContent = student.name;

    // Update profile information
    const profileElements = {
        profileName: student.name,
        profileStudentId: student.studentId,
        profileEmail: student.email,
        profilePhone: student.phone,
        profileDepartment: student.department,
        profileYear: student.year,
        profileCGPA: student.cgpa
    };

    Object.entries(profileElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    // Update skills
    const skillsContainer = document.getElementById('profileSkills');
    if (skillsContainer && student.skills) {
        skillsContainer.innerHTML = student.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }
}

// ===== UTILITY FUNCTIONS =====
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

function showError(message) {
    alert('Error: ' + message); // Simple error display - could be improved with proper toast notifications
}

function showSuccess(message) {
    alert('Success: ' + message); // Simple success display - could be improved with proper toast notifications
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update content states
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

async function applyToPlacement(placementId) {
    if (!currentUser || currentUser.role !== 'student') {
        showError('Please login as a student to apply');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: currentUser.id,
                placementId: placementId
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Application submitted successfully!');
            // Refresh the page or update the UI
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showError(data.message || 'Application failed');
        }
    } catch (error) {
        console.error('Application error:', error);
        showError('Application failed. Please try again.');
    }
}

// Company Dashboard placeholder functions
function initializeCompanyDashboard() {
    if (!currentUser || currentUser.role !== 'company') {
        window.location.href = 'auth.html';
        return;
    }
    
    console.log('Company dashboard initialized');
    // TODO: Implement company dashboard functionality
}

// Additional functions for student applications, etc. would go here
async function loadStudentApplications() {
    // TODO: Implement loading student applications
    console.log('Loading student applications...');
}

async function loadEligibleDrives() {
    // TODO: Implement loading eligible drives for student
    console.log('Loading eligible drives...');
}

function updateStudentStats() {
    // TODO: Implement updating student statistics
    console.log('Updating student stats...');
}