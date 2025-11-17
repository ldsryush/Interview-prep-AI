# 🎯 AI Interview Prep

A full-stack AI-powered interview preparation application that helps users practice interview questions and receive realistic feedback.

## Features

- 🎭 **Multiple Role Support**: Practice for Software Engineer, Data Scientist, Product Manager, and Frontend Developer positions
- 🤖 **AI-Powered Questions**: Get role-specific interview questions
- 📝 **Answer Evaluation**: Submit your answers and receive detailed feedback
- 💯 **Scoring System**: Get scored on your responses (0-10 scale)
- 📊 **Detailed Feedback**: Receive insights on strengths and areas for improvement
- 🎨 **Modern UI**: Clean, responsive React interface with TypeScript

## Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: PostgreSQL (with H2 for testing)
- **ORM**: Spring Data JPA with Hibernate
- **API**: RESTful endpoints with JSON responses

#### Entities
- **Question**: Stores interview questions with role associations
- **Answer**: Stores user responses to questions
- **Feedback**: Stores AI-generated feedback with scores and recommendations

#### API Endpoints
- `GET /api/question?role={role}` - Generate a new question for the specified role
- `POST /api/answer` - Submit an answer and receive feedback

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with gradient themes
- **Components**:
  - RoleSelector: Dropdown for selecting interview role
  - QuestionDisplay: Shows the current interview question
  - AnswerInput: Textarea for submitting answers
  - FeedbackView: Displays AI-generated feedback

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- PostgreSQL 12+ (for production)

### Backend Setup

1. **Start PostgreSQL** (or use H2 for development):
   ```bash
   # Create database
   createdb interviewprep
   ```

2. **Configure database** (optional):
   Edit `backend/src/main/resources/application.yml` or set environment variables:
   ```bash
   export DATABASE_URL=jdbc:postgresql://localhost:5432/interviewprep
   export DATABASE_USERNAME=postgres
   export DATABASE_PASSWORD=your_password
   ```

3. **Build and run**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL** (optional):
   Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env if backend is not on localhost:8080
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

### Production Build

**Backend**:
```bash
cd backend
mvn clean package
java -jar target/interview-prep-backend-1.0.0.jar
```

**Frontend**:
```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred web server
```

## Usage

1. Open the application in your browser (`http://localhost:5173`)
2. Select an interview role from the dropdown
3. Click "Get Question" to receive an interview question
4. Type your answer in the text area
5. Click "Submit Answer" to receive AI feedback
6. Review your score, strengths, and areas for improvement
7. Click "Try Another Question" to practice more

## Future Enhancements

- [ ] **Voice Integration**: Add speech-to-text for answering questions verbally
- [ ] **Text-to-Speech**: Read questions aloud
- [ ] **Real AI Integration**: Connect to OpenAI GPT or similar services
- [ ] **User Authentication**: Save progress and track improvement over time
- [ ] **Question History**: Review past questions and answers
- [ ] **Advanced Analytics**: Track performance trends and weak areas
- [ ] **Custom Questions**: Allow users to add their own practice questions
- [ ] **Video Recording**: Practice with video responses
- [ ] **Peer Review**: Share answers with peers for feedback

## Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL / H2
- Maven
- Lombok
- Jakarta Validation

### Frontend
- React 18
- TypeScript
- Vite
- CSS3

## API Documentation

### Get Question
**Endpoint**: `GET /api/question`

**Parameters**:
- `role` (required): The interview role (e.g., "Software Engineer")

**Response**:
```json
{
  "id": 1,
  "role": "Software Engineer",
  "questionText": "Explain the difference between abstract classes and interfaces in Java."
}
```

### Submit Answer
**Endpoint**: `POST /api/answer`

**Request Body**:
```json
{
  "questionId": 1,
  "answerText": "Your detailed answer here..."
}
```

**Response**:
```json
{
  "id": 1,
  "answerId": 1,
  "feedbackText": "Good answer with reasonable detail...",
  "score": 7,
  "strengths": "Clear structure and good coverage of key concepts",
  "improvements": "Consider adding real-world examples..."
}
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Notes

- The current AI is simulated based on answer length and keywords
- For production use, integrate with actual AI services (OpenAI, Anthropic, etc.)
- CORS is configured to allow `localhost:5173` and `localhost:3000` by default
- Database tables are auto-created using JPA's `ddl-auto: update`

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for interview preparation
