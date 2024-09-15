# InsightConvo

InsightConvo is an AI-based video interviewing platform that improves the efficiency of the hiring process. It will replace human interviewers with an intelligent bot that conducts interviews, analyzes candidate responses, and provides insights. The platform will offer real-time emotion recognition, tone analysis, eye movement tracking, and automated speech-to-text transcription. It will generate follow-up questions, validate the quality and accuracy of the response given against the questions asked, compare responses to their CVs, and provide instant feedback. The system will finally provide a behavioral insights dashboard and an overall summary of the interview and rating of the candidate.

## Project Structure

INSIGHTCONVO
├── backend
│ ├── models
│ │ ├── meeting.js
│ │ └── user.js
│ ├── routes
│ │ ├── admin_meeting.js
│ │ ├── auth.js
│ │ └── user_meeting.js
│ ├── .env
│ ├── index.js
│ ├── package-lock.json
│ └── package.json
└── frontend
├── src
│ ├── components
│ │ ├── admin
│ │ │ └── admin_home.tsx
│ │ └── user
│ │ ├── login.tsx
│ │ ├── signup.tsx
│ │ ├── meeting.tsx
│ │ ├── Profile.tsx
│ │ └── user_home.tsx
│ ├── models
│ │ ├── addmeetings.tsx
│ │ ├── meetingcard.tsx
│ │ └── nav.tsx
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
└── tsconfig.json

## Environment Variables

Before running the backend, create a `.env` file in the `backend` folder with the following content:

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
BASE_FRONTEND_URL=http://localhost:5173

Replace `your_mongodb_uri`, `your_jwt_secret`, `your_google_client_id`, and `your_google_client_secret` with your actual credentials.

## Features

- User Authentication (Login and Signup)
- Meeting Management
- Admin and User Role Separation
- Responsive User Interface

## Technology Stack

- **Frontend:** TypeScript, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/cchaithanya83/InsightConvo.git
   cd InsightConvo


   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

To run the application:

1. Start the backend server:

   ```bash
   cd backend
   npm run test
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

Visit `http://localhost:5173` in your browser to access the application.
