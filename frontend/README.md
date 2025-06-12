# Full Stack Web Application

A modern, professional full-stack web application built with **.NET 9.0** backend and **Next.js 14** frontend, featuring JWT authentication, role-based access control, and comprehensive user management with advanced table features.

![.NET](https://img.shields.io/badge/.NET-9.0-purple.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token handling
- **Role-based access control** (Admin/User roles)
- **Password hashing** with BCrypt for security
- **Protected routes** and API endpoints
- **Automatic token refresh** and logout handling

### 🎯 User Management (Admin Only)
- **Complete CRUD operations** for user accounts
- **Advanced data table** with professional design
- **Real-time search** across username, email, and role
- **Column sorting** (Username, Role, Created Date)
- **Smart pagination** with configurable page sizes
- **Responsive design** for all devices

### 📊 Advanced Table Features
- **Search functionality** with 300ms debouncing
- **Sortable columns** with visual indicators
- **Pagination controls** (5, 10, 25, 50 per page)
- **Results filtering** with clear search options
- **Loading states** and smooth transitions
- **Empty state handling** with helpful messages

### 🎨 Modern UI/UX
- **shadcn/ui component library** for professional design
- **Tailwind CSS** for responsive styling
- **Dark/Light theme** support
- **Toast notifications** for user feedback
- **Modal dialogs** for forms and confirmations
- **Mobile-first responsive** design

### 🏗️ Technical Architecture
- **Clean Architecture** with separation of concerns
- **Repository pattern** with Entity Framework Core
- **Dependency Injection** throughout the application
- **Global error handling** middleware
- **Comprehensive logging** with structured logs
- **Type-safe** TypeScript implementation

## 🛠️ Technology Stack

### Backend (.NET 9.0)
- **ASP.NET Core Web API** - RESTful API framework
- **Entity Framework Core** - ORM with SQLite/SQL Server support
- **JWT Bearer Authentication** - Stateless authentication
- **BCrypt.Net** - Password hashing and verification
- **Swagger/OpenAPI** - API documentation
- **Serilog** - Structured logging

### Frontend (Next.js 14)
- **Next.js 14** with App Router - React framework
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls

### Development Tools
- **Hot reload** for both frontend and backend
- **ESLint & Prettier** - Code formatting and linting
- **Jest** - Testing framework
- **Docker** support for containerization

## 📋 Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <rhttps://github.com/Assad-Ashraf/assessment-test.git>
cd fullstack-app
```

### 2. Backend Setup
```bash
cd Backend

# Restore dependencies
dotnet restore

# Run the application
dotnet run
```

The backend API will be available at `http://localhost:5283`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Access the Application

**🌐 Application URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5283
- Swagger Documentation: http://localhost:5283/swagger

**🔑 Demo Credentials:**
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| user | user123 | User |

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "Admin",
  "expiresAt": "2024-06-13T12:00:00Z"
}
```

#### GET /api/auth/dashboard
Get role-based dashboard data (requires authentication).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Admin Dashboard - Full access granted",
  "username": "admin",
  "role": "Admin",
  "timestamp": "2024-06-12T12:00:00Z"
}
```

### User Management Endpoints (Admin Only)

#### POST /api/users/search
Search and paginate users with sorting.

**Request:**
```json
{
  "page": 1,
  "pageSize": 10,
  "search": "john",
  "sortBy": "username",
  "sortDirection": "asc"
}
```

#### GET /api/users/paged
Get paginated users.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 10)

#### POST /api/users
Create a new user.

#### PUT /api/users/{id}
Update an existing user.

#### DELETE /api/users/{id}
Delete a user.

## 🎯 User Guide

### For Regular Users
1. **Login** with your credentials
2. **View dashboard** with personalized welcome message
3. **Access user features** available to your role

### For Administrators
1. **Login** with admin credentials
2. **Manage users** through the User Management section
3. **Search users** by username, email, or role
4. **Sort data** by clicking column headers
5. **Create new users** with the "Add User" button
6. **Edit users** using the dropdown menu
7. **Delete users** with confirmation dialog
8. **Navigate pages** using pagination controls

## 🔧 Configuration

### Backend Configuration

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-jwt-key-here-minimum-32-characters",
    "Issuer": "FullStackApp",
    "Audience": "FullStackApp"
  }
}
```

### Frontend Configuration

**.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5283/api
```

## 🧪 Testing

### Backend Tests
```bash
cd Backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Test Coverage
```bash
# Backend coverage
dotnet test --collect:"XPlat Code Coverage"

# Frontend coverage
npm run test:coverage
```

## 📁 Project Structure

```
fullstack-app/
├── Backend/
│   ├── Controllers/          # API Controllers
│   ├── Services/             # Business Logic
│   ├── Models/              # Data Models
│   ├── DTOs/                # Data Transfer Objects
│   ├── Data/                # Database Context & Seeding
│   ├── Middleware/          # Custom Middleware
│   └── Program.cs           # Application Entry Point
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router Pages
│   │   ├── components/      # Reusable UI Components
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── services/        # API Service Layer
│   │   ├── types/           # TypeScript Definitions
│   │   └── __tests__/       # Unit Tests
│   ├── public/              # Static Assets
│   └── package.json         # Dependencies
└── README.md
```

## 🔍 Key Features Showcase

### 🔐 Secure Authentication
- Passwords are hashed with BCrypt
- JWT tokens expire in 24 hours
- Automatic logout on token expiration
- Role-based route protection

### 📊 Advanced Data Table
- **20+ seeded users** for immediate demonstration
- **Real-time search** with debouncing
- **Multi-column sorting** with visual indicators
- **Smart pagination** with ellipsis for many pages
- **Configurable page sizes** (5, 10, 25, 50)
- **Responsive design** that works on mobile

### 🎨 Professional UI
- Modern **shadcn/ui** components
- **Consistent design system** throughout
- **Loading states** and **error handling**
- **Toast notifications** for user feedback
- **Modal dialogs** for actions

## 🚀 Production Deployment

### Backend Deployment
1. **Set production connection string**
2. **Configure secure JWT secret**
3. **Enable HTTPS** and security headers
4. **Set up logging** and monitoring

### Frontend Deployment
1. **Build for production:** `npm run build`
2. **Configure API URL** for production
3. **Deploy to Vercel/Netlify** or similar
4. **Enable CDN** for static assets

## 🔧 Development Commands

### Backend
```bash
# Run with hot reload
dotnet watch run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Build for production
dotnet build --configuration Release
```

### Frontend
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📈 Performance Features

- **Debounced search** (300ms) to reduce API calls
- **Server-side pagination** for large datasets
- **Efficient database queries** with Entity Framework
- **Lazy loading** and code splitting
- **Responsive images** and optimized assets

## 🛡️ Security Features

- **Input validation** on both client and server
- **SQL injection prevention** with parameterized queries
- **XSS protection** with React's built-in escaping
- **CORS configuration** for API security
- **Secure password storage** with salt and hashing

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Ensure .NET 9.0 SDK is installed
- Check if port 7001 is available
- Verify database connection

**Frontend not loading:**
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check if port 3000 is available

**Authentication issues:**
- Verify JWT secret configuration
- Check token expiration
- Ensure proper CORS setup


