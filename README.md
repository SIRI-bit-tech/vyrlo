# Vyrlo

Vyrlo is an AI-powered platform built exclusively for content creators. It provides deep analytical insights, trend tracking, and AI-generated content ideas tailored perfectly to a creator's specific niche, platform, and audience goals.

## 🚀 Features

- **Creator Onboarding & Profiling**: Seamlessly captures a creator's niche, target platforms (Instagram, TikTok, Twitter, etc.), current challenges, and primary goals to feed into the AI context engine.
- **Trend Analysis**: Fetches and aggregates the latest trends in the creator's specific niche, providing actionable insights on what's currently going viral.
- **AI Content Ideation**: Uses advanced AI (Google Gemini) to generate high-performing content ideas, complete with hooks, formats, and estimated engagement metrics based on the creator's unique profile.
- **Connected Accounts**: Allows creators to connect and monitor their social media accounts from a single unified dashboard.
- **Secure Authentication**: Passwordless OTP (One-Time Password) email verification and magic links powered by Better Auth and Resend.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL (via Prisma ORM & Prisma Accelerate)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **AI Engine**: Google Gemini API
- **Email Delivery**: Resend

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (Recommended package manager)
- A PostgreSQL database

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/yourusername/vyrlo.git
   cd vyrlo
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   bun install
   \`\`\`

3. **Set up environment variables:**
   Copy the \`.env.example\` file to \`.env\` and fill in your keys:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   *Make sure to provide your Database URL, Resend API Key, Better Auth secrets, and Gemini API Key.*

4. **Initialize the database:**
   \`\`\`bash
   bunx prisma generate
   bunx prisma db push
   \`\`\`

5. **Start the development server:**
   \`\`\`bash
   bun dev
   \`\`\`

6. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.


