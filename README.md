# 📄 Resume Forge – AI-Powered Resume Builder  

Resume Forge is a **full-stack MERN application** that helps users create professional, ATS-friendly resumes with ease. It provides customizable templates, AI-powered feedback, and seamless PDF export to boost your job application success.  

---

## 🚀 Features  

- 🌐 **Full-Stack MERN Application** – Built using MongoDB, Express.js, React, and Node.js.  
- 🔐 **Secure Authentication** – Signup/Login with JWT authentication and password encryption.  
- 📄 **Smart Resume Builder** – Multi-step form to collect details like personal info, education, work experience, skills, and projects.  
- 🎨 **Custom Templates** – Choose from **5–6 Chitkara-approved professional resume templates**.  
- 🤖 **AI Integration (Google Gemini)** – Get AI-powered analysis for structure, formatting, and content relevance.  
- 📊 **Dynamic Score Meter** – Animated scoring system with AI-driven suggestions for improvement.  
- ⚡ **PDF Export** – Generate and download professional resumes instantly.  
- 📱 **Responsive UI** – Designed with **Vite + Tailwind CSS**, optimized for all devices.  

---

## 🛠 Tech Stack  

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB  
- **AI Integration:** Google Gemini API  
- **Deployment:** Vercel (Frontend) & Render (Backend)  


---

## ⚙️ Installation  

Clone the repository and set up both **frontend** and **backend** locally.  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/your-username/resume-forge.git
cd resume-forge
```

### 2️⃣ Setup Backend  
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with the following:  
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

Run backend server:  
```bash
npm start
```

### 3️⃣ Setup Frontend  
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend` with the following:  
```env
VITE_BACKEND_URL=http://localhost:5000
```

Run frontend:  
```bash
npm run dev
```

---

## 📂 Folder Structure  

```
resume-forge/
│── backend/           # Express + MongoDB backend  
│   ├── models/        # Mongoose schemas  
│   ├── routes/        # API routes  
│   ├── controllers/   # Business logic  
│   ├── middleware/    # Auth middleware  
│   ├── server.js      # Entry point  
│
│── frontend/          # React + Vite + Tailwind frontend  
│   ├── src/  
│   │   ├── components/  # Reusable UI components  
│   │   ├── pages/       # App pages (Login, Signup, Builder, Preview)  
│   │   ├── utils/       # Helper functions  
│   │   └── App.jsx      # Main app entry  
│
└── README.md
```

---

## 🌍 Deployment  

- **Frontend** – Deployed on [Vercel](https://ats-resume-checker-pi.vercel.app/)

---

## 🎯 Future Enhancements  

- 🔍 AI-powered job description matching  
- 💾 User dashboard for managing multiple resumes  
- 📤 Export options in Word format  
- 🖌️ More resume templates  

---

## 🤝 Contributing  

Contributions are welcome! Feel free to fork the repo, open issues, and submit PRs.  

---

## 📜 License  

This project is licensed under the **MIT License**.  

---

## 👨‍💻 Author  

**Atin Bhardwaj**  
- 🌐 [LinkedIn](https://www.linkedin.com/in/atin-bhardwaj-3396ab2b9/)  
- 💻 [GitHub](https://github.com/Atinb607)  
