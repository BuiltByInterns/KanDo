<h1 align="center">KanDo Kanban Board</h1>

<p align="center">
  An open-source, self-hosted kanban management tool — a lightweight alternative to Trello and Notion.
</p>

---

## 🚀 Features
- Self-hosted and open-source
- Built with **Next.js**, **Firebase**, and **TailwindCSS**
- Real-time updates with Firebase
- Simple and customizable UI

---


## 📦 Tech Stack

### Frontend
- **Core:** Next.js (15.4.1), React (19.1.0), React DOM (19.1.0)
- **Types:** @types/node (^20), @types/react (^19), @types/react-dom (^19)
- **Firebase Integration:** firebase (^12.0.0), react-firebase-hooks (^5.1.1)
- **Styling:** tailwindcss (^4), @tailwindcss/postcss (^4)

### Backend
- **Core:** Node.js
- **Environment Management:** dotenv (^17.2.0)
- **Firebase:** firebase (^12.0.0)

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/kando.git
cd kando
```

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env.local
```
- Update .env.local with your Firebase project credentials.
- Start the development server:
```bash
npm run dev
```

### 3. Backend Setup
```bash
cd ../server
npm install
cp .env.example .env
```
- Update .env with required environment variables.
- Start the backend:
```bash
npm start
```

--- 

## 📚 Project Structure
```bash
kando/
├── client/     # Frontend (Next.js + TailwindCSS + Firebase)
├── server/     # Backend (Node.js + Firebase + dotenv)
└── README.md   # Project documentation
```

## 🤝 Contributing
Contributions are welcome!
- Fork the repo
- Create a feature branch (`git checkout -b feature/new-feature`)
- Commit your changes (`git commit -m "Add new feature"`)
- Push to your branch and open a PR

## 📄 License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).