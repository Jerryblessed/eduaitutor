# EduAI Tutor - AI-Powered PDF Learning Assistant

![EduAI Tutor](https://img.shields.io/badge/Built%20with-Bolt-black?style=for-the-badge&logo=bolt)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)

## 🎯 Overview

EduAI Tutor is a revolutionary educational platform that transforms static PDF documents into interactive, AI-powered learning experiences. Built for the Bolt Hackathon, this application leverages cutting-edge AI technologies to make learning more accessible, engaging, and effective.

## ✨ Key Features

### 🤖 AI-Powered Learning
- **Smart PDF Processing**: Upload academic PDFs and extract content with intelligent parsing
- **AI Summarization**: Generate comprehensive summaries using Azure OpenAI GPT-4o
- **Interactive Chat**: Ask questions about your documents and receive contextual responses
- **Quiz Generation**: Auto-create personalized quizzes to test understanding

### 🎙️ Voice Integration
- **Natural Voice Narration**: Listen to summaries with ElevenLabs' Rachel voice
- **Voice Commands**: Control the app using speech recognition
- **Audio Learning**: Perfect for auditory learners and accessibility

### 👤 User Experience
- **Multi-Auth Support**: Email, Google, and Microsoft OAuth authentication
- **Progress Tracking**: Monitor learning progress and quiz scores
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Sync**: All data synchronized across devices

### 🔒 Security & Privacy
- **Row Level Security**: Supabase RLS ensures data privacy
- **Secure Authentication**: Industry-standard OAuth implementations
- **Data Encryption**: All user data encrypted in transit and at rest

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React/Vite)  │◄──►│   (Supabase)    │◄──►│   (Azure/11Labs)│
│                 │    │                 │    │                 │
│ • React Router  │    │ • PostgreSQL    │    │ • GPT-4o        │
│ • Tailwind CSS  │    │ • Auth          │    │ • ElevenLabs    │
│ • Framer Motion │    │ • Real-time     │    │ • Voice Synth   │
│ • TypeScript    │    │ • Storage       │    │ • Chat API      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Dropzone** - File upload handling

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data privacy
- **Real-time subscriptions** - Live updates

### AI & Voice Services
- **Azure OpenAI GPT-4o** - Text processing and chat
- **ElevenLabs** - Voice synthesis and narration
- **PDF.js** - PDF parsing and text extraction
- **Web Speech API** - Voice recognition

### Deployment & Infrastructure
- **Netlify** - Hosting and deployment
- **GitHub** - Version control
- **Environment Variables** - Secure configuration

## 📱 Pages & Features

### 🏠 Home Page
- Hero section with value proposition
- Feature highlights with animations
- User testimonials and social proof
- Call-to-action for registration

### 🔐 Authentication
- Email/password registration and login
- Google OAuth integration
- Microsoft OAuth integration
- Password reset functionality

### 📊 Dashboard
- Learning progress overview
- Recent documents and quiz results
- Quick action buttons
- Statistics and analytics

### 📤 Upload
- Drag-and-drop PDF upload
- Real-time processing status
- AI summary generation
- Voice narration creation

### 💬 Chat
- Document-based conversations
- AI-powered responses
- Voice input support
- Conversation history

### 🧠 Quiz
- AI-generated questions
- Multiple choice format
- Instant feedback
- Score tracking and history

### 👤 Profile
- User information management
- Learning preferences
- Account settings
- Progress statistics

### ℹ️ About
- Mission and vision
- Feature explanations
- Technology overview
- Impact statistics

### 🏆 Sponsors
- Technology partners
- Hackathon acknowledgments
- Partner descriptions
- External links

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Azure OpenAI access
- ElevenLabs API key

### Environment Variables
Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=http://localhost:5173
VITE_REDIRECT_URLS=your_redirect_urls

# Azure OpenAI Configuration
VITE_AZURE_OPENAI_API_BASE=your_azure_openai_base
VITE_AZURE_OPENAI_API_KEY=your_azure_openai_key
VITE_AZURE_OPENAI_API_VERSION=2023-06-01-preview
VITE_AZURE_OPENAI_MODEL=gpt-4o

# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_ELEVENLABS_API_BASE=https://api.elevenlabs.io/v1
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/eduai-tutor.git
cd eduai-tutor
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
```bash
# Run the migration to create database schema
# Upload the migration file to your Supabase project
```

4. **Configure authentication providers**
- Enable Google OAuth in Supabase Auth settings
- Enable Microsoft OAuth in Supabase Auth settings
- Set up redirect URLs

5. **Start development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

## 📊 Database Schema

### Tables
- **user_profiles** - Extended user information
- **documents** - Uploaded PDF metadata and content
- **summaries** - AI-generated summaries with voice URLs
- **quizzes** - Generated quiz questions and metadata
- **quiz_results** - User quiz attempts and scores
- **conversations** - Chat history with AI assistant

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Secure authentication flow

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Secondary**: Teal (#14B8A6) and Green (#10B981)
- **Accent**: Orange (#F97316) and Pink (#EC4899)
- **Neutral**: Slate color scale for text and backgrounds

### Typography
- **Headings**: Bold weights with proper hierarchy
- **Body**: 150% line spacing for readability
- **Code**: Monospace font for technical content

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Intuitive layout with breadcrumbs

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatically on git push

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to your preferred hosting service
# Upload the dist/ folder contents
```

## 🤝 Contributing

We welcome contributions to EduAI Tutor! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Technology Partners
- **[Bolt](https://bolt.new)** - AI-powered development platform
- **[Supabase](https://supabase.com)** - Backend infrastructure
- **[ElevenLabs](https://elevenlabs.io)** - Voice synthesis technology
- **[Microsoft Azure](https://azure.microsoft.com)** - OpenAI GPT-4o access
- **[Netlify](https://netlify.com)** - Hosting and deployment

### Hackathon
Built with ❤️ for the Bolt Hackathon, showcasing the power of AI-assisted development and innovative educational technology.

## 📞 Support

For support, email support@eduai-tutor.com or join our community discussions.

## 🔗 Links

- **Live Demo**: [https://eduai-tutor.netlify.app](https://eduai-tutor.netlify.app)
- **Documentation**: [https://docs.eduai-tutor.com](https://docs.eduai-tutor.com)
- **API Reference**: [https://api.eduai-tutor.com](https://api.eduai-tutor.com)

---

**Built with [Bolt](https://bolt.new) - The AI-powered development platform**