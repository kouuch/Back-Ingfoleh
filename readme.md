# 🛍️ Ingfoleh Khas Kalsel

A fullstack Node.js application for managing products, users, feedback, and more — built with Express.js, MongoDB, EJS templating, and a modular MVC architecture.

---

## 🚀 Features

- 🔒 User Authentication (JWT)
- 🧾 CRUD Produk, Toko, User, Feedback
- 🖼️ Image Upload with Multer
- 📄 PDF Generator with jsPDF
- 📊 Dashboard Admin (with EJS & assets)
- 🛡️ Rate Limiting and Validation Middleware
- 📁 Organized MVC Folder Structure

---
## 📂 Folder Structure (Simplified)

src/
├── server.js # Entry point
├── routes/ # Express route handlers
├── models/ # Mongoose schemas
├── middleware/ # Auth & validation middleware
├── utils/ # Upload, error, logger
ui/
├── page/ # EJS pages
├── components/ # Modular EJS components
├── assets/ # CSS, JS, images
## 📦 Dependencies

**Main Libraries (`dependencies`):**
- `express` – backend framework
- `mongoose` – ODM MongoDB
- `ejs` – template engine
- `dotenv` – config via `.env`
- `jsonwebtoken` – token auth
- `bcryptjs` – password hashing
- `cookie-parser`, `cors` – HTTP security
- `express-validator` – input validation
- `express-rate-limit` – anti brute-force
- `multer` – upload handler
- `jspdf` – PDF generator
- `winston` – logging

**Dev Tools (`devDependencies`):**
- `nodemon` – auto-restart server
- `browser-sync` – live reload for frontend
- `concurrently` – run multiple dev scripts at once

---

## 🧑‍💻 Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev
```
## 🛠 NPM Scripts

```bash
npm start         # Run production server
npm run dev       # Run dev mode (backend + live UI)
npm run debug     # Start server in debug mode (port 9229)
```
