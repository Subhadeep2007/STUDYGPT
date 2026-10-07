StudyGPT
AI-powered study companion built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Gemini and OpenRouter.
Live Apps
- Frontend: https://studygpt-88s8.vercel.app
- Backend API: https://studygpt-peach.vercel.app
Features
- AI study chat
- Authentication and email verification
- Login, logout, forgot/reset/change password
- Chat creation and chat history
- Edit and delete messages
- Markdown AI responses
- PDF/document/image/text/presentation upload support
- Cloudinary storage
- Gemini AI integration
- OpenRouter free-model fallback for text responses
- Profile and profile image management
- Responsive desktop/tablet/mobile UI
- Protected chat and profile routes
Tech Stack
Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios
- React Markdown
- Remark GFM
- React Dropzone
- Sonner
Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Joi
- Multer
- Cloudinary
- Google Gemini API
- OpenRouter API
- Helmet
- CORS
- Morgan
- Express Rate Limit
Project Structure
STUDYGPT/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
└── README.md
Authentication Flow
Register
   ↓
Email Verification OTP
   ↓
Login
   ↓
Access Token + Refresh Token
   ↓
Protected Routes
The refresh token is handled through an HttpOnly cookie and the frontend keeps the access token in application memory.
AI Response Flow
User Message
      ↓
Chat Controller
      ↓
Gemini AI
      ↓
Success → Save AI Response
      ↓ fail
OpenRouter Free
      ↓
Success → Save AI Response
      ↓ fail
Save Failed Message
The OpenRouter free route is a fallback for text responses and is subject to provider/account limits.
File Upload Flow
User selects files
       ↓
Frontend upload
       ↓
Backend validation
       ↓
Cloudinary
       ↓
Gemini File API
       ↓
MongoDB file record
Main API Routes
Authentication
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
Profile
GET    /api/profile
PATCH  /api/profile/username
PATCH  /api/profile/image
DELETE /api/profile/image
PATCH  /api/profile/password
Chat
POST   /api/chat
GET    /api/chat
GET    /api/chat/:chatId
GET    /api/chat/:chatId/full
PATCH  /api/chat/:chatId
DELETE /api/chat/:chatId
DELETE /api/chat/:chatId/permanent
POST   /api/chat/message
GET    /api/chat/message/:messageId
PATCH  /api/chat/message/:messageId
DELETE /api/chat/message/:messageId
GET    /api/chat/:chatId/messages
Files
POST   /api/files/upload
GET    /api/files/chat/:chatId
GET    /api/files/:fileId
DELETE /api/files/:fileId
Environment Variables
Never commit real credentials.
Backend
NODE_ENV=development
PORT=8080
ATLASDB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
EMAIL=your_email
PASS=your_email_password
FRONTEND_URL=http://localhost:5173
CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
Frontend
VITE_BACKEND_URL=http://localhost:8080
For production, use the deployed backend URL.
Local Setup
git clone https://github.com/Subhadeep2007/STUDYGPT.git
cd STUDYGPT
Backend
cd server
npm install
npm run dev
Backend: http://localhost:8080
Frontend
cd frontend
npm install
npm run dev
Frontend: http://localhost:5173
Deployment
Frontend
Deploy the frontend directory on Vercel.
Build command:
npm run build
Output directory:
dist
Backend
Deploy the server directory on Vercel using vercel.json and configure all environment variables in the Vercel project settings.
Security
- Keep .env files out of Git.
- Never expose API keys in frontend code.
- Never publish JWT access tokens.
- Rotate credentials if they are accidentally exposed.
- Keep provider credentials on the backend.
Goal
StudyGPT aims to give students one workspace for asking questions, understanding concepts, preparing exam answers, solving programming problems, studying uploaded materials, and organizing learning conversations.
License
This project is currently intended as a personal/educational project. Add a specific open-source license when ready.
