# 🎯 GeniusPathMatrix - AI-Powered Career Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-Canary-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12.2-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**GeniusPathMatrix** (Path-GeniX™) is an intelligent career guidance platform that helps students and professionals discover their ideal career path through AI-powered assessments, personalized recommendations, and actionable goal planning.

---

## ✨ Features

### 🧠 **InsightX Assessment**
- Comprehensive personality, interests, and skills evaluation
- Scientific diagnostic tests for self-discovery
- AI-powered analysis using Groq AI engine

### 🧭 **PathXplore Career Explorer**
- AI-driven career matching based on your unique profile
- Top 5 career recommendations with detailed insights
- SWOT analysis for each career option
- Career Decision Matrix™ for informed decision-making
- Interactive career mapping reports

### 🎯 **GoalMint Planner™**
- Transform career choices into SMART goals
- Structured 1-year, 3-year, and 5-year action plans
- Progress tracking and milestone management

### 🤖 **MentorSuite AI**
- Intelligent AI mentor chatbot for career guidance
- Reflective questioning to develop metacognitive skills
- Personalized advice and insights

### 📊 **AI-Generated Reports**
- Comprehensive career analysis reports
- Downloadable PDF format
- Visual charts and data representations

---

## 🚀 Tech Stack

- **Frontend**: Next.js (Canary), React 18.3, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes, Firebase Admin
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **AI Engine**: Groq AI
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Deployment**: Firebase App Hosting

---

## 📦 Installation

### Prerequisites
- Node.js 20+ installed
- Firebase project set up
- Groq AI API key

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Geniuspathmatrix.git
cd Geniuspathmatrix
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🏗️ Project Structure

```
Geniuspathmatrix/
├── src/
│   ├── ai/                    # AI flows and configurations
│   │   ├── flows/             # Groq AI flow definitions
│   │   └── groq-client.ts     # Groq API client
│   ├── app/                   # Next.js app directory
│   │   ├── (main)/            # Main app routes
│   │   │   ├── assessment/    # InsightX Assessment
│   │   │   ├── pathxplore/    # Career Explorer
│   │   │   ├── goals/         # GoalMint Planner
│   │   │   ├── mentors/       # MentorSuite AI
│   │   │   └── reports/       # AI-generated reports
│   │   ├── (marketing)/       # Marketing pages
│   │   ├── auth/              # Authentication pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   └── layout/            # Layout components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and services
│   │   ├── firebase/          # Firebase configuration
│   │   └── actions.ts         # Server actions
│   └── data/                  # Static data
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
└── package.json
```

---

## 🔑 Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Next.js** | React framework with server-side rendering |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first CSS framework |
| **Radix UI** | Accessible component primitives |
| **Firebase** | Authentication, database, and hosting |
| **Groq AI** | Advanced AI career analysis |
| **Zod** | Schema validation |
| **React Hook Form** | Form state management |

---

## 🎨 Design System

GeniusPathMatrix uses a carefully crafted design system with:
- **Premium UI components** from shadcn/ui
- **Consistent color palette** and typography
- **Dark mode support** (optional)
- **Responsive layouts** for all devices
- **Accessible components** following WCAG guidelines

---

## 📱 Features in Detail

### InsightX Assessment
Students complete a comprehensive questionnaire covering:
- Personality traits and temperament
- Interests and hobbies
- Academic strengths and weaknesses
- Soft skills and work preferences
- Career aspirations

### PathXplore Career Explorer
After assessment completion, students receive:
- **Top 5 Career Matches** ranked by compatibility score
- **Detailed Career Profiles** with job descriptions, skills required, and growth prospects
- **SWOT Analysis** for each recommended career
- **Career Decision Matrix™** to compare options
- **Visual Reports** with charts and insights

### GoalMint Planner™
Convert career choices into actionable plans:
- Short-term goals (1 year)
- Medium-term milestones (3 years)
- Long-term vision (5 years)
- Education and skill development roadmap
- Progress tracking and reminders

### MentorSuite AI
Interactive AI mentor providing:
- Personalized career guidance
- Reflective questioning for deeper insights
- Skill development recommendations
- Industry trends and advice

---

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules to protect user data
- Environment variables for sensitive credentials
- Server-side validation and data sanitization

---

## 🚀 Deployment

### Firebase App Hosting

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dilsha**
- GitHub: [@dilsha3072](https://github.com/dilsha3072)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend infrastructure
- [Groq](https://groq.com/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives

---

## 📞 Support

For support, email support@geniuspathmatrix.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ for students and career seekers worldwide**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
