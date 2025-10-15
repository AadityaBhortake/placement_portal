v# Placement Portal Application

A comprehensive placement portal web application for educational institutions built with Node.js, Express, and vanilla HTML/CSS/JavaScript. This system facilitates campus recruitment and placement activities for students, companies, and placement coordinators.

## 🚀 Features

### For Students
- **Profile Management**: Complete student profile with academic details, skills, and resume
- **Browse Placement Drives**: View all upcoming and ongoing placement opportunities
- **Apply for Placements**: Apply for placement drives with eligibility checking
- **Application Tracking**: Track application status and interview schedules
- **Resume Builder**: Create and manage professional resumes

### For Companies
- **Company Registration**: Register and create company profiles
- **Post Placement Drives**: Create placement drives with job descriptions and requirements
- **Student Database Access**: Browse eligible student profiles
- **Application Management**: Review student applications and shortlist candidates
- **Interview Scheduling**: Schedule and manage interview rounds

### For Administrators/Placement Coordinators
- **Dashboard Overview**: Comprehensive statistics and analytics
- **Student Management**: Approve student registrations and manage profiles
- **Company Management**: Verify and approve company registrations
- **Placement Drive Oversight**: Monitor and manage all placement activities
- **Report Generation**: Generate placement statistics and reports

### General Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean UI**: Modern, professional interface with institutional branding
- **Real-time Search**: Instant filtering for students, companies, and drives
- **Form Validation**: Comprehensive client and server-side validation
- **Role-based Access**: Different interfaces for students, companies, and admins

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Vanilla ES6+ for interactivity and API communication

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **File-based Storage**: JSON files for demo (easily replaceable with database)

### Dependencies
- `express`: Web framework
- `body-parser`: Request body parsing middleware
- `cors`: Cross-origin resource sharing

## 📁 Project Structure

```
placement-portal/
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
├── frontend/                 # Client-side files
│   ├── index.html           # Home page
│   ├── student-dashboard.html# Student dashboard
│   ├── company-dashboard.html# Company dashboard
│   ├── admin-dashboard.html # Admin dashboard
│   ├── placement-drives.html# Placement drives listing
│   ├── auth.html            # Login/Register page
│   ├── styles.css           # CSS styling
│   └── script.js            # JavaScript functionality
└── backend/                 # Server-side files
    ├── server.js            # Express server
    └── data/                # Data storage
        ├── students.json    # Student profiles
        ├── companies.json   # Company profiles
        ├── placements.json  # Placement drives
        └── applications.json# Student applications
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   # Navigate to your desired directory
   cd "C:\Users\Aaditya\Desktop\SE project\job-portal"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to: `http://localhost:3000`
   - The placement portal will be running and ready to use!

### Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```
(Requires nodemon to be installed)

## 📚 API Endpoints

### Students
- **GET** `/api/students` - Fetch all student profiles
- **POST** `/api/students` - Register new student
- **PUT** `/api/students/:id` - Update student profile

### Companies
- **GET** `/api/companies` - Fetch all company profiles
- **POST** `/api/companies` - Register new company
- **PUT** `/api/companies/:id` - Update company profile

### Placement Drives
- **GET** `/api/placements` - Fetch all placement drives
- **POST** `/api/placements` - Create new placement drive
- **PUT** `/api/placements/:id` - Update placement drive

### Applications
- **GET** `/api/applications` - Fetch all applications
- **POST** `/api/applications` - Submit new application
- **PUT** `/api/applications/:id` - Update application status

### Authentication
- **POST** `/api/login` - User login (students, companies, admins)
- **POST** `/api/register` - User registration

### Example API Usage

#### Get All Jobs
```javascript
fetch('/api/jobs')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Post a New Job
```javascript
fetch('/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'New York, NY',
    description: 'We are looking for a skilled frontend developer...'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🧪 Testing the Application

### Demo Accounts
The application comes with pre-configured demo accounts for testing:

- **Demo User**: `demo_user` / `demo123`
- **Recruiter**: `recruiter` / `recruiter123`

### Test Scenarios

1. **Browse Jobs**
   - Visit the home page
   - Click "Browse All Jobs" or navigate to Jobs page
   - Use the search functionality to filter jobs

2. **Post a Job**
   - Navigate to "Post Job" page
   - Fill in the job details
   - Use "Preview Job" to see how it will look
   - Submit the job posting

3. **User Registration**
   - Go to Login/Register page
   - Create a new account
   - Test login with the new credentials

4. **Search Functionality**
   - Use the search bar on the home page
   - Try searching for different terms (e.g., "Frontend", "New York", "TechCorp")

## 🎨 Customization

### Styling
- Modify `frontend/styles.css` to customize the appearance
- The CSS uses CSS custom properties for easy theming
- Responsive breakpoints are defined for mobile-first design

### Branding
- Update the logo and company name in the navigation
- Modify colors in the CSS gradient variables
- Change the hero section content in `index.html`

### Database Integration
To replace JSON file storage with a real database:

1. Install your preferred database driver (e.g., `mysql2`, `pg`, `mongodb`)
2. Update the data access functions in `backend/server.js`
3. Replace `readJSONFile` and `writeJSONFile` with database queries

## 🔧 Configuration

### Port Configuration
The server runs on port 3000 by default. To change:
- Set environment variable: `PORT=8080`
- Or modify the port in `backend/server.js`

### Data Storage
- Job data is stored in `backend/data/jobs.json`
- User data is stored in `backend/data/users.json`
- Both files are created automatically with sample data

## 🚀 Deployment

### Local Deployment
The application is ready to run locally with `npm start`

### Production Deployment
For production deployment:

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=80
   ```

2. **Process Manager** (recommended)
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name job-portal
   ```

3. **Reverse Proxy** (for domain setup)
   - Configure Nginx or Apache to proxy requests to the Node.js server

## 🐳 Docker Setup

You can run the backend and MongoDB using Docker and docker-compose.

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually included with Docker Desktop)

### Steps
1. Build and start the containers:
   ```sh
   docker-compose up --build
   ```
   This will start both MongoDB and the backend server.

2. Access the backend at [http://localhost:3000](http://localhost:3000)

3. MongoDB will be available at `localhost:27017` (default credentials, no password).

### Stopping the containers
```sh
docker-compose down
```

### Notes
- The backend connects to MongoDB at `mongodb://mongo:27017/PlacementPortal` (see `docker-compose.yml`).
- Data is persisted in a Docker volume (`mongo_data`).
- You can view logs with:
  ```sh
  docker-compose logs
  ```

## 📱 Mobile Responsiveness

The application is fully responsive and includes:
- Mobile-friendly navigation with hamburger menu
- Touch-optimized buttons and form elements
- Responsive grid layouts for job cards
- Optimized typography for small screens

## 🔒 Security Considerations

**Note**: This is a demo application. For production use, implement:

- Password hashing (bcrypt)
- JWT-based authentication
- Input sanitization
- CSRF protection
- Rate limiting
- HTTPS enforcement
- Environment variable configuration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

**Happy Job Hunting! 🎯**