# Interview-prep-AI
A interview prep program that integrates AI to give mock interviews and provide real time realistic feedback.

## Overview
- Backend: Spring Boot (Java 21), PostgreSQL, REST APIs
- Frontend: React + TypeScript (Create React App)
- Voice: Browser Speech Recognition (capture) + Speech Synthesis (playback)
- AI: Optional OpenAI integration for dynamic questions and feedback

## Setup
### Prerequisites
- Node.js 18+ and npm
- Java 21 and Maven (or run via IDE)
- PostgreSQL running locally (default `interview_prep` DB)

### Configure Environment
Create the DB and set the password for the `postgres` user (used by `spring.datasource.password`). On Windows PowerShell:

```powershell
# Example: set DB password for this session
$env:DB_PASSWORD = "your_password"

# Optional: OpenAI key for dynamic questions/feedback
$env:OPENAI_API_KEY = "sk-..."
```

You can also put these values into your system environment or an IDE run configuration. The backend reads `OPENAI_API_KEY` and uses model `gpt-4o-mini` by default.

### Run Frontend

```powershell
cd frontend
npm install
npm start
```

### Run Backend
Open a terminal where Maven is available:

```powershell
cd backend
mvn spring-boot:run
```

If Maven is not installed, run from your IDE (IntelliJ/VS Code) using Spring Boot.

## Voice Features
- The app speaks questions and feedback using the browser's Speech Synthesis.
- Click “Record Answer” to capture your spoken answer (uses Web Speech API). If unsupported in your browser, type your answer.

## AI Integration
With `OPENAI_API_KEY` set, the backend will:
- Generate role-specific questions with hints and difficulty.
- Evaluate your answer and return strengths, areas for improvement, overall comments, and a score.

Without a key, the app falls back to stubbed questions and feedback.

## Notes
- CORS allows the frontend on `http://localhost:3000` to call the backend.
- The database is set to `update` schema automatically on startup.
