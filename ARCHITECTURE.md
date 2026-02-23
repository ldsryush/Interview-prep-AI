# Interview Prep AI - Current Architecture

## Overview
This project is split into two separate apps:
- **Backend (Spring Boot)**: session management, persistence, OpenAI calls, API endpoints.
- **Frontend (React + TypeScript)**: role/difficulty selection, conversational UI, mic input, speech output.

The system runs as a **session-based voice interview**:
1. Frontend starts a session.
2. Backend creates session + first interviewer message via OpenAI.
3. Candidate replies by text or mic transcription.
4. Backend stores candidate message and returns next interviewer response.
5. Frontend can end interview and receive final feedback.

---

## Backend

### Entry + config
- `backend/src/main/java/com/example/aiinterviewprep/AiInterviewPrepApplication.java`
  - Spring Boot application entry point.
- `backend/src/main/java/com/example/aiinterviewprep/config/CorsConfig.java`
  - Allows frontend origin (`http://localhost:3000`) for `/api/**`.
- `backend/src/main/resources/application.properties`
  - Main runtime config (DB, CORS, OpenAI, optional secrets import).

### Controllers
- `backend/src/main/java/com/example/aiinterviewprep/controller/InterviewController.java`
  - Main API under `/api/interview`.
  - Active endpoints:
    - `POST /session/start`
    - `POST /session/{sessionId}/message`
    - `GET /session/{sessionId}/messages`
    - `POST /session/{sessionId}/end`
- `backend/src/main/java/com/example/aiinterviewprep/controller/GlobalExceptionHandler.java`
  - Converts server exceptions to user-readable JSON `{ "message": "..." }`.
  - Maps OpenAI failures (e.g., auth/rate-limit) to clearer responses.

### Services
- `backend/src/main/java/com/example/aiinterviewprep/service/InterviewConversationService.java`
  - Core orchestration service.
  - Creates/ends sessions, stores messages, calls OpenAI service, returns DTO responses.
- `backend/src/main/java/com/example/aiinterviewprep/service/OpenAiClientService.java`
  - Calls OpenAI chat completions endpoint.
  - Generates:
    - opening interviewer question,
    - iterative interviewer replies,
    - final session feedback JSON.

### Persistence (JPA)
- Entities:
  - `backend/src/main/java/com/example/aiinterviewprep/entity/InterviewSession.java`
  - `backend/src/main/java/com/example/aiinterviewprep/entity/Message.java`
  - `backend/src/main/java/com/example/aiinterviewprep/entity/DifficultyLevel.java`
  - `backend/src/main/java/com/example/aiinterviewprep/entity/MessageRole.java`
- Repositories:
  - `backend/src/main/java/com/example/aiinterviewprep/repository/InterviewSessionRepository.java`
  - `backend/src/main/java/com/example/aiinterviewprep/repository/MessageRepository.java`

### Secrets
- Local secrets file pattern:
  - `backend/application-secrets.properties` (gitignored, local only)
  - `backend/application-secrets.properties.example` (template)
- OpenAI key can come from:
  - `OPENAI_API_KEY` env var, or
  - `openai.api.key.local` in local secrets file.

---

## Frontend

### Entry
- `frontend/src/index.tsx`
  - React bootstrap and root render.
- `frontend/src/App.tsx`
  - Main app state machine (`roleSelection` → `interviewSession`).
  - Calls API service methods and holds session/message/feedback state.
  - Displays backend-provided error messages.

### UI components
- `frontend/src/components/RoleSelection.tsx`
  - Select role + difficulty and start interview.
- `frontend/src/components/InterviewSession.tsx`
  - Conversation timeline UI.
  - Candidate response textarea + mic button.
  - End interview action + final feedback display.
  - Uses browser speech APIs:
    - `SpeechRecognition`/`webkitSpeechRecognition` (input)
    - `speechSynthesis` (output)

### API layer + types
- `frontend/src/services/api.ts`
  - Axios client for backend.
  - Types and methods for:
    - `startSession`
    - `sendSessionMessage`
    - `endSession`

### Browser speech typings
- `frontend/src/types/speech.d.ts`
  - TS declarations for Web Speech APIs in supported browsers.
