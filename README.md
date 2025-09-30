# Hospital Appointment Booking System

A NestJS backend system for managing appointment bookings across multiple hospitals with multi-tenancy support.

## Features

### Admin Features
- Create new hospitals with default admin accounts
- Manage hospital settings and SMTP configuration

### Staff Features
- Manage doctors (add/edit/remove)
- Define doctor working schedules by day of the week
- Set appointment slot durations per doctor
- View doctor-wise appointment schedules
- Book appointments on behalf of patients
- Cancel any appointment
- Manage hospital details and staff members

### Patient Features
- Register for an account
- View available hospitals
- View doctors by hospital with profiles and availability
- Browse available appointment slots by date
- Book appointments (requires login)
- Receive email notifications upon successful booking
- View and cancel upcoming appointments

### Scheduled Tasks
- Automated email reminders sent 1 day before appointments

## Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with refresh mechanisms
- **Email**: Nodemailer with hospital-specific SMTP settings
- **Scheduling**: NestJS Schedule for CRON tasks
- **Timezone**: Moment-timezone for timezone handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database and SMTP credentials.

4. Start the database:
   ```bash
   # Make sure PostgreSQL is running
   createdb hospital_booking
   ```

5. Run the application:
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires JWT)

### Hospitals
- `GET /hospitals` - List all hospitals
- `POST /hospitals` - Create hospital (admin only)
- `GET /hospitals/:id` - Get hospital details
- `PATCH /hospitals/:id` - Update hospital (admin only)
- `PATCH /hospitals/:id/settings` - Update hospital SMTP settings

### Doctors
- `GET /doctors` - List doctors (optionally filter by hospital)
- `POST /doctors` - Create doctor (staff only)
- `GET /doctors/:id` - Get doctor details
- `GET /doctors/:id/available-slots` - Get available time slots
- `PATCH /doctors/:id/schedule` - Update doctor schedule

### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Book appointment
- `GET /appointments/my-appointments` - Get user's appointments
- `PATCH /appointments/:id/cancel` - Cancel appointment

## Multi-Tenancy

The system supports multi-tenancy where each hospital operates independently:
- Hospital-specific user accounts
- Hospital-specific doctor schedules
- Hospital-specific SMTP settings
- Timezone support per hospital

## Timezone Handling

The system respects the `X-Timezone` header in API requests and handles timezone conversions for:
- Appointment scheduling
- Email notifications
- CRON task execution

## Database Schema

### Core Entities
- **Hospitals**: Hospital information and settings
- **Users**: Patients, staff, and admin users
- **Doctors**: Doctor profiles linked to users
- **Appointments**: Booking records
- **DoctorSchedules**: Weekly working schedules
- **HospitalSettings**: SMTP and other configurations

## Security

- JWT-based authentication for all protected endpoints
- Role-based access control (admin, staff, patient)
- Password hashing with bcrypt
- Input validation and sanitization

## Email System

- Hospital-specific SMTP configuration
- Appointment confirmation emails
- Automated reminder emails (1 day before)
- Configurable email templates

## Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the application: `npm run start:prod`

The application will be available at `http://localhost:3000` by default.
"# appointment-booking-nestjs" 
