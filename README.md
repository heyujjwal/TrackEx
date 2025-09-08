# 🚀 TrackEx – AI Powered Expense Tracker

<img width="1306" height="666" alt="image" src="https://github.com/user-attachments/assets/c0ca93a6-f082-4d0d-bc22-749d2942eb94" />

  

> 💸 **TrackEx** is a modern expense and income tracking application powered by **AI-driven insights**, built with **Next.js**, **Supabase**, and enhanced with advanced tools like **Arcjet**, **Resend**, **InnJest**, **React Email**, and **Clerk** for authentication.  
Say goodbye to financial stress and hello to **financial freedom**! 🌟  

---

## ✨ Features  

✅ **Dashboard** – Get a clear overview of all your transactions  
✅ **Add Transactions** – Track expenses & income with ease  
✅ **AI-Powered Insights (Gemini)** – Intelligent recommendations to optimize your finances  
✅ **AI Smart Receipt Scanner** – Extract transaction data automatically 📸  
✅ **Budget Planning** – Plan, manage, and stick to your budget 💡  
✅ **Multi-Account & Multi-Currency** – Manage all your finances in one place 🌍  
✅ **Automated Reports & Analytics** – Visual breakdown of spending patterns 📊  
✅ **Secure Authentication (Clerk)** – Protect your data with enterprise-grade security 🔐  
✅ **Bot Protection & Rate Limiting (Arcjet)** – Keep your app safe from malicious traffic 🛡️  
✅ **Automated Cron Jobs (Inngest)** – Monthly email reports & budget alerts sent automatically 📧  


---

## 🖼️ Preview  

### Landing Page
<img width="1306" height="666" alt="image" src="https://github.com/user-attachments/assets/c0ca93a6-f082-4d0d-bc22-749d2942eb94" />

### Dashboard
<img width="1284" height="685" alt="image" src="https://github.com/user-attachments/assets/431a206b-ea0c-47bd-8645-5d37ada917c5" />


---

## ⚡ Tech Stack  

| Category            | Technology |
|---------------------|------------|
| **Frontend**        | [Next.js](https://nextjs.org/), [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Backend**         | [Supabase](https://supabase.com/), [Prisma](https://www.prisma.io/) |
| **Authentication**  | [Clerk](https://clerk.com/) |
| **AI**              | [Google Gemini](https://deepmind.google/technologies/gemini/) |
| **Email**           | [Resend](https://resend.com/), [React Email](https://react.email/) |
| **Security**        | [Arcjet](https://arcjet.com/) – rate limiting, bot protection |
| **Automation**      | [Inngest](https://www.inngest.com/) – cron jobs (monthly reports & budget alerts) |
| **Languages**       | JavaScript / TypeScript |
---

## ⚙️ Installation & Setup  

Follow these steps to run **TrackEx** locally:  

```bash
# 1️⃣ Clone the repository
git clone https://github.com/heyujjwal/trackex.git

# 2️⃣ Navigate into the project
cd trackex

# 3️⃣ Install dependencies
npm install

# 4️⃣ Setup environment variables
cp .env.example .env
# Fill in your Supabase, Clerk, Resend, Arcjet, Gemini API keys

# 5️⃣ Run Prisma migrations
npx prisma migrate dev

# 6️⃣ Start the development server
npm run dev
