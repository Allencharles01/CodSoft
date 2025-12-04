🎯 Job Board Web Application

A full-stack job board platform where employers can post jobs and candidates can apply, track applications, and manage profiles.
Built as part of **CodSoft Web Development Internship – Level 2 Task 1**.

---

## 🚀 Features

### **🔹 Public Pages**

* Home page with welcome message + featured jobs
* Job listings page
* Job detail page with skills, company info, and apply button
* Search bar for filtering jobs

---

## **👤 Candidate Features**

* Register / Login
* Profile dashboard
* Apply for jobs with resume upload
* View application status (Accepted / Rejected / Pending)

---

## **🏢 Employer Features**

* Secure login for employers
* Dashboard with company and job posting controls
* Add new jobs
* Manage existing jobs
* View candidate applications
* Accept / Reject applications
* Email notifications sent to candidates upon status update

---

## 📧 **Email Notifications**

Candidates receive automated emails when:

* Their application is **accepted**
* Their application is **rejected**

---

## 🔒 **Authentication & Security**

* JWT authentication
* Password hashing
* Secured API routes

---

## 📱 **Mobile Responsiveness**

Frontend is built to be responsive across:

* Mobile
* Tablet
* Desktop

---

## 🛠 **Tech Stack**

### **Frontend**

* React.js
* Vite
* CSS

### **Backend**

* Node.js
* Express
* MongoDB (Mongoose)
* Multer (for file uploads)
* Nodemailer (for email notifications)

---

## 📂 Project Structure

```
job-board/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── styles.css
    │   ├── App.jsx
    │   └── api.js
    ├── index.html
    └── package.json
```

---

## 🚀 Deployment

Frontend: **Netlify**
Backend: Any Node hosting (Render, Railway, etc.)

---

## 📌 How to Run Locally

### **Clone Repo**

```
git clone https://github.com/Allencharles01/CodSoft.git
cd CodSoft
```

---

### **Backend Setup**

```
cd backend
npm install
npm start
```

Backend runs on **[http://localhost:5000](http://localhost:5000)**

---

### **Frontend Setup**

```
cd frontend
npm install
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**

---

## ✨ Author

**Allen Charles**
Built with dedication as part of the CodSoft Internship Program.
