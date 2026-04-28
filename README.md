# VibeBlog - Full-Stack Blog Platform

A modern, high-performance blog platform built with React, Express, and MongoDB.

## Features

- **Full-Stack Architecture**: React (Vite) frontend + Node.js (Express) backend.
- **Authentication**: Secure JWT-based auth with password hashing (bcryptjs) and HTTP-only cookies.
- **Database**: MongoDB storage using Mongoose models for Users, Blogs, and Comments.
- **Modern UI**: Polished, responsive design with Tailwind CSS and Framer Motion.
- **Dark Mode**: System-aware dark mode toggle.
- **Blog Management**: Create, Read, Update, and Delete blogs (Markdown supported).
- **Interactions**: Like and Comment system.
- **Admin Dashboard**: Specialized view to manage all users and posts.
- **Profile System**: User profiles with custom avatars and usernames.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, JWT, Cookie-Parser, CORS.
- **Database**: MongoDB (Atlas recommended).

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js and a MongoDB connection string.
2. **Environment Variables**:
   Create a `.env` file (or update `.env.example`) with:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_secure_random_string"
   PORT=3000
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Folder Structure

- `/server`: Express backend logic (Models, Routes, Controllers, Middleware).
- `/src`: React frontend (Pages, Components, Context).
- `server.ts`: Entry point for the full-stack application.
