# InsightConvo

InsightConvo is an AI-powered video interviewing platform designed to streamline the hiring process. This full-stack application features separate user and admin interfaces, real-time data handling, and advanced evaluation tools to ensure efficient and accurate assessments.

---

## Features

### **User Interface**
- **Login and Signup**: Secure authentication for users and admins.
- **Profile Management**: Users can manage their profiles and access meeting details.
- **Video Interviews**: Conduct video meetings with confidence evaluation.

### **Admin Interface**
- **Admin Dashboard**: Manage candidate interviews, evaluate responses, and oversee meeting schedules.
- **Candidate List**: View and manage registered candidates.

### **Backend**
- **Authentication**: Token-based authentication with protected routes.
- **Data Management**: MongoDB for storing user, meeting, and evaluation data.
- **API Endpoints**: Modularized endpoints for handling meetings, resumes, transcriptions, and evaluations.
- **Error Handling**: Middleware for managing errors and ensuring API reliability.

---

## Tech Stack

### **Frontend**
- **Framework**: React (with TypeScript)
- **Styling**: TailwindCSS
- **Routing**: React Router

### **Backend**
- **Framework**: Node.js with Express
- **Database**: MongoDB (via Mongoose)
- **Middleware**: CORS, Body-Parser, Cookie-Parser

---

## Directory Structure

```
shreyxs9-insightconvo-1/
├── readme.md
├── backend/
│   ├── index.js
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
```

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### **Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your-mongodb-uri
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/signup`: User signup

### Meetings
- `GET /admin/meetings`: Fetch admin meetings
- `POST /user/meetings`: Create user meeting

### Evaluations
- `POST /api/evaluation`: Submit evaluation

### Transcriptions
- `POST /api/transcription`: Upload and process transcription

For a complete list, refer to the backend `routes/` directory.

---

## Scripts

### **Frontend**
- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Lint the codebase

### **Backend**
- `npm start`: Start the server
- `npm run dev`: Start the server in development mode

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

Feel free to reach out for any queries or contributions!

