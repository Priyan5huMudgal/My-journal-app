# My Journal App 🖋️

A beautifully designed, full-stack journaling application built to be a vintage companion for growth, craft, and reflection. 

**Live Demo:** https://my-journal-app-theta.vercel.app/

![Journal Cover](client/public/images/Cover.jpg)

## Features ✨
* **Secure Authentication:** User registration and login using JWT and bcrypt.
* **Custom Profiles:** Users can upload profile pictures (stored securely via Cloudinary) and manage personal bio information.
* **Dynamic Journal Entries:** Create custom journal blocks every day (notes, tasks, metrics) rather than just a boring text box.
* **Timeline Logic:** Automatically tracks consecutive journal days.
* **Premium UI:** A warm, vintage, responsive layout optimized for modern browsers.

## Tech Stack 🛠️
* **Frontend:** React, Vite, Axios, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Storage:** Cloudinary (for profile image hosting)
* **Testing:** Jest

## Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Priyan5huMudgal/My-journal-app.git
cd My-journal-app
```

### 2. Install Dependencies
You need to install dependencies for both the backend and the frontend.
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Run the App
From the root directory, run the concurrent dev script:
```bash
npm run dev
```
The backend will start on `http://localhost:5000` and the frontend will automatically open on `http://localhost:5173`.

## Testing 🧪
The application features an automated test suite to verify timeline and day-skipping logic.
```bash
npm test
```

## Deployment 🚀
- **Frontend** hosted on Vercel
- **Backend** hosted on Render
- **Database** hosted on MongoDB Atlas

---
*The quietest pages know the loudest progress.*
