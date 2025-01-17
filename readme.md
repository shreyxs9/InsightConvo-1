
# InsightConvo

InsightConvo is a web application designed to facilitate candidate evaluations through interviews, resume analysis, and confidence assessments. The application includes both frontend and backend components.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Installing

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/InsightConvo.git
   cd InsightConvo
   ```

2. Set up the backend:
   ```sh
   cd backend
   npm install
   ```

3. Set up the frontend:
   ```sh
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the 

backend

 directory with the following content:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ASSEMBLY_AI_API_KEY=your_assembly_ai_api_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
   ```

### Running the Application

1. Start the backend server:
   ```sh
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```sh
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Usage

- Sign up or log in to the application.
- Admin users can manage meetings, evaluate candidates, and view evaluation results.
- Users can participate in interviews, upload resumes, and view their profiles.

## Project Structure

```
InsightConvo/
├── backend/
│   ├── .env
│   ├── index.js
│   ├── models/
│   │   ├── Emotion.js
│   │   ├── Evaluation.js
│   │   ├── Meeting.js
│   │   ├── Resume.js
│   │   ├── Transcript.js
│   │   └── user.js
│   ├── routes/
│   │   ├── admin_meeting.js
│   │   ├── auth.js
│   │   ├── candidates.js
│   │   ├── confidence-check.js
│   │   ├── evaluation.js
│   │   ├── resume.js
│   │   ├── transcription.js
│   │   └── userdetails.js
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   ├── admin_home.tsx
│   │   │   │   └── candidates.tsx
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   ├── user/
│   │   │   │   ├── Meeting.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   └── user_home.tsx
│   │   ├── models/
│   │   │   ├── addmeetings.tsx
│   │   │   ├── meetingcard.tsx
│   │   │   └── RulesAndRegulations.tsx
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── readme.md
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Thanks to all contributors and supporters.
- Special thanks to the developers of the libraries and tools used in this project.
```

