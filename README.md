# CDMI Lab PC Allocation System

A full-stack management system for allocating lab PCs to students at CDMI.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express, MongoDB, JWT
- **Database**: MongoDB (Mongoose)

## Features
- Admin Authentication (JWT)
- Lab Management (Create labs, automatic PC generation)
- Student Management (CRUD)
- Interactive PC Grid (Allocation/Deallocation)
- Real-time UI updates
- Smart Auto Allocation
- Maintenance Mode
- Activity Log
- Dashboard Analytics
- Export Allocation Report (CSV)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret key for JWT
4. Seed the initial admin user:
   ```bash
   npm run seed
   ```
   *Default Admin: username: `admin`, password: `password123`*
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Usage
- Login with the admin credentials.
- Create a Lab (e.g., Lab A) to generate PCs.
- Add Students in the Student Management tab.
- Go to Lab Management, click on a lab, and start assigning PCs to students.

## Project Structure
- `/backend`: MVC architecture (Models, Controllers, Routes)
- `/frontend`: Modern React structure (Pages, Components, Context)
