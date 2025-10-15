const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/PlacementPortal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 3000;

// Mongoose models
const Student = require('./models/student');
const Company = require('./models/company');
const Placement = require('./models/placement');
const Application = require('./models/application');
const Admin = require('./models/admin');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Data file paths
const STUDENTS_FILE = path.join(__dirname, 'data', 'students.json');
const COMPANIES_FILE = path.join(__dirname, 'data', 'companies.json');
const PLACEMENTS_FILE = path.join(__dirname, 'data', 'placements.json');
const APPLICATIONS_FILE = path.join(__dirname, 'data', 'applications.json');
const ADMINS_FILE = path.join(__dirname, 'data', 'admins.json');

// Helper functions to read/write JSON files
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
    return false;
  }
};

// Authentication helper
const authenticateUser = async (email, password, role = null) => {
  let user = null;
  if (role === 'student' || !role) {
    user = await Student.findOne({ email, password });
    if (user) return { ...user.toObject(), role: 'student' };
  }
  if (role === 'company' || !role) {
    user = await Company.findOne({ email, password });
    if (user) return { ...user.toObject(), role: 'company' };
  }
  if (role === 'admin' || role === 'coordinator' || !role) {
    user = await Admin.findOne({ email, password });
    if (user) return { ...user.toObject(), role: 'admin' };
  }
  return null;
};

// Routes

// Authentication Routes
app.post('/api/login', (req, res) => {
  (async () => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }
      const user = await authenticateUser(email, password, role);
      if (user) {
        res.json({ success: true, message: 'Login successful', data: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error during login', error: error.message });
    }
  })();
});

// Student Routes
app.get('/api/students', (req, res) => {
  Student.find().then(students => {
    res.json({ success: true, data: students });
  }).catch(error => {
    res.status(500).json({ success: false, message: 'Error fetching students', error: error.message });
  });
});

app.post('/api/students', (req, res) => {
  (async () => {
    try {
      const studentData = req.body;
      console.log('Received registration data:', studentData);
      if (!studentData.name || !studentData.email) {
        console.log('Missing name or email');
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }
      const existingStudent = await Student.findOne({ $or: [{ email: studentData.email }, { id: studentData.studentId }] });
      if (existingStudent) {
        console.log('Student already exists:', existingStudent);
        return res.status(400).json({ success: false, message: 'Student with this email or student ID already exists' });
      }
      const newStudent = new Student({
        id: Date.now().toString(),
        ...studentData,
        role: 'student',
        registrationDate: new Date().toISOString(),
        status: 'active',
        appliedPlacements: [],
        eligibleForPlacements: true
      });
      try {
        const savedStudent = await newStudent.save();
        console.log('Student saved to DB:', savedStudent);
        res.status(201).json({ success: true, message: 'Student registered successfully', data: savedStudent });
      } catch (saveError) {
        console.error('Error saving student to DB:', saveError);
        res.status(500).json({ success: false, message: 'Error saving student to DB', error: saveError.message });
      }
    } catch (error) {
      console.error('Error in registration route:', error);
      res.status(500).json({ success: false, message: 'Error registering student', error: error.message });
    }
  })();
});

app.put('/api/students/:id', (req, res) => {
  (async () => {
    try {
      const studentId = req.params.id;
      const updateData = req.body;
      const student = await Student.findOneAndUpdate({ id: studentId }, updateData, { new: true });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      res.json({ success: true, message: 'Student updated successfully', data: student });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating student', error: error.message });
    }
  })();
});

// Company Routes
app.get('/api/companies', (req, res) => {
  Company.find().then(companies => {
    res.json({ success: true, data: companies });
  }).catch(error => {
    res.status(500).json({ success: false, message: 'Error fetching companies', error: error.message });
  });
});

app.post('/api/companies', (req, res) => {
  (async () => {
    try {
      const companyData = req.body;
      if (!companyData.name || !companyData.email) {
        return res.status(400).json({ success: false, message: 'Company name and email are required' });
      }
      const existingCompany = await Company.findOne({ email: companyData.email });
      if (existingCompany) {
        return res.status(400).json({ success: false, message: 'Company with this email already exists' });
      }
      const newCompany = new Company({
        id: Date.now().toString(),
        ...companyData,
        role: 'company',
        registrationDate: new Date().toISOString(),
        status: 'pending',
        placementDrives: []
      });
      await newCompany.save();
      res.status(201).json({ success: true, message: 'Company registered successfully', data: newCompany });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering company', error: error.message });
    }
  })();
});

// Placement Drives Routes
app.get('/api/placements', (req, res) => {
  Placement.find().then(placements => {
    res.json({ success: true, data: placements });
  }).catch(error => {
    res.status(500).json({ success: false, message: 'Error fetching placement drives', error: error.message });
  });
});

app.post('/api/placements', (req, res) => {
  (async () => {
    try {
      const placementData = req.body;
      if (!placementData.title || !placementData.companyId) {
        return res.status(400).json({ success: false, message: 'Title and company ID are required' });
      }
      const company = await Company.findOne({ id: placementData.companyId });
      if (!company) {
        return res.status(400).json({ success: false, message: 'Company not found' });
      }
      const newPlacement = new Placement({
        id: Date.now().toString(),
        ...placementData,
        companyName: company.name,
        postedDate: new Date().toISOString(),
        applicationsCount: 0,
        status: company.status === 'verified' ? 'active' : 'pending_approval'
      });
      await newPlacement.save();
      res.status(201).json({ success: true, message: 'Placement drive created successfully', data: newPlacement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating placement drive', error: error.message });
    }
  })();
});

// Applications Routes
app.get('/api/applications', (req, res) => {
  (async () => {
    try {
      const { studentId, companyId, placementId } = req.query;
      let query = {};
      if (studentId) query.studentId = studentId;
      if (companyId) query.companyId = companyId;
      if (placementId) query.placementId = placementId;
      const applications = await Application.find(query);
      res.json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
    }
  })();
});

app.post('/api/applications', (req, res) => {
  (async () => {
    try {
      const { studentId, placementId } = req.body;
      if (!studentId || !placementId) {
        return res.status(400).json({ success: false, message: 'Student ID and placement ID are required' });
      }
      const existingApplication = await Application.findOne({ studentId, placementId });
      if (existingApplication) {
        return res.status(400).json({ success: false, message: 'Already applied for this placement' });
      }
      const student = await Student.findOne({ id: studentId });
      const placement = await Placement.findOne({ id: placementId });
      if (!student || !placement) {
        return res.status(400).json({ success: false, message: 'Student or placement not found' });
      }
      // Check eligibility (if requirements exist)
      if (placement.requirements && placement.requirements.minimumCGPA && student.cgpa < placement.requirements.minimumCGPA) {
        return res.status(400).json({ success: false, message: 'CGPA requirement not met' });
      }
      const newApplication = new Application({
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        placementId: placement.id,
        placementTitle: placement.title,
        companyId: placement.companyId,
        companyName: placement.companyName,
        applicationDate: new Date().toISOString(),
        status: 'applied',
        currentRound: 'Application Review',
        roundsCompleted: [],
        nextRoundDate: null,
        feedback: {},
        documents: { resume: student.resume || '' },
        lastUpdated: new Date().toISOString()
      });
      await newApplication.save();
      // Update placement applications count
      placement.applicationsCount = (placement.applicationsCount || 0) + 1;
      await placement.save();
      res.status(201).json({ success: true, message: 'Application submitted successfully', data: newApplication });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error submitting application', error: error.message });
    }
  })();
});

// Dashboard Routes
app.get('/api/dashboard/stats', (req, res) => {
  (async () => {
    try {
      const students = await Student.find();
      const companies = await Company.find();
      const placements = await Placement.find();
      const applications = await Application.find();
      const stats = {
        totalStudents: students.length,
        totalCompanies: companies.length,
        activePlacements: placements.filter(p => p.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'applied').length,
        selectedStudents: applications.filter(a => a.status === 'selected').length,
        companiesVerified: companies.filter(c => c.status === 'verified').length,
        companiesPending: companies.filter(c => c.status === 'pending').length
      };
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching dashboard stats', error: error.message });
    }
  })();
});

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎓 Placement Portal server running on http://localhost:${PORT}`);
  console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
  console.log(`📊 Data stored in: ${path.join(__dirname, 'data')}`);
});

module.exports = app;