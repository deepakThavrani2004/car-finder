
# 🚗 Car Finder Web App

A responsive React-based web application to help users browse, filter, and explore cars for sale or rent.

## 🔧 Tech Stack

- **Frontend**: React (Vite), Bootstrap
- **Backend/API**: JSON Server (Hosted on Render)
- **Deployment**: Vercel (Frontend), Render (Backend)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage for Wishlist

## ✨ Features

- 🔍 **Search** cars by name/model
- 🛠 **Filter** by fuel type and car type
- ↕️ **Sort** by price (Low to High / High to Low)
- ❤️ **Wishlist** with localStorage persistence
- 📄 **Car Details** in responsive modal
- 🌙 **Dark Mode** toggle
- 📱 Fully responsive for all screen sizes
- 🧭 **Pagination** – 10 cars per page
- 🎞 **Smooth Animations** for enhanced UX

## 📦 Sample Data

Includes 20 unique car entries with real-world specs and high-quality image URLs from Pixabay/Unsplash.

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/car-finder.git
cd car-finder

# Install dependencies
npm install

# Start JSON server (you need db.json)
npx json-server --watch db.json --port 5000

# In a separate terminal, start React app
npm run dev
