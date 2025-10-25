# AI-Powered Interview Scheduler

A modern, full-stack web application for creating and conducting AI-powered interviews with voice-controlled interactions and real-time question generation.

## 🚀 Features

### 🔐 Authentication
- **Google OAuth Integration** - Secure login with Google accounts
- **Session Management** - Persistent user sessions with Supabase
- **User Profile Management** - Store and manage user information

### 🎯 Interview Management
- **Create Interviews** - Set up interviews with job positions and descriptions
- **AI-Generated Questions** - Dynamic question generation based on job requirements
- **Voice-Controlled Interface** - Natural conversation with AI interviewer
- **Real-time Interview Sessions** - Live interview experience with voice interaction

### 🎨 User Experience
- **Modern UI/UX** - Clean, responsive design with smooth animations
- **Real-time Updates** - Instant state changes without page refreshes
- **Mobile Responsive** - Works seamlessly across all devices
- **Loading States** - Professional loading indicators and transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Reliable relational database
- **Supabase Auth** - Authentication and session management
- **Supabase Realtime** - Real-time database subscriptions

### AI & Voice
- **VAPI AI** - Voice AI platform for interview interactions
- **OpenAI** - AI question generation and processing

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Git** - Version control

## 📁 Project Structure

```
interview_schedular/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── interview/         # Interview management
│   ├── components/        # Shared components
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── provider.jsx       # Context providers
├── components/            # UI components
│   └── ui/               # Reusable UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # External service clients
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview_schedular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   VAPI_API_KEY=your_vapi_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Set up the `Users` table with columns: `id`, `name`, `email`, `picture`
   - Configure Google OAuth in Supabase Auth settings
   - Add your redirect URL: `http://localhost:3000/auth/callback`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 How It Works

### Authentication Flow
1. User clicks "Login" → Redirected to Google OAuth
2. Google authenticates user → Redirects to `/auth/callback`
3. Callback exchanges code for session → Sets cookies
4. Provider detects session → Fetches/creates user in database
5. UI updates to show user profile

### Interview Creation
1. User clicks "Create New Interview"
2. Fills in job position and description
3. AI generates relevant questions
4. Interview link is created and can be shared

### Interview Session
1. Candidate visits interview link
2. Enters their name and joins session
3. Voice AI conducts the interview
4. Real-time question generation and responses

### Database Schema
```sql
-- Users table
CREATE TABLE Users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews table
CREATE TABLE interviews (
  interview_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jobPosition TEXT,
  jobDescription TEXT,
  duration TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Key Features Explained

### Context Management
- **UserDetailContext** - Manages user authentication state
- **InterviewDataContext** - Handles interview session data
- **Provider Pattern** - Centralized state management

### Authentication
- **Supabase Auth Helpers** - Seamless Next.js integration
- **Session Persistence** - Automatic session restoration
- **Secure Callbacks** - Protected authentication flow

### Voice AI Integration
- **VAPI Web SDK** - Real-time voice interactions
- **Dynamic Question Generation** - Context-aware interview questions
- **Natural Language Processing** - Human-like conversation flow

## Modules & Contributions
- **Frontend Development** - Dhayanithi S
- **Backend Development** - Deepak M
- **Database Integration** - Alagarsamy M
- **AI Configurations** - Eswaran J
- **Pipeline Configurations** - Rajesh R