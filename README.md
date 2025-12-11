# Inventory Management App

A full-stack inventory management system built with React (frontend), Node.js/Express (backend), and SQLite (database).

## Features

- Product CRUD (Create, Read, Update, Delete)
- Search & real-time category filtering
- Inline editing of product rows
- Import products via CSV file
- Export products as CSV
- Inventory change history tracking

## Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: SQLite

## Setup & Run Locally (in GitHub Codespaces)

### Backend

cd backend
npm install
npm run dev

text

### Frontend

cd frontend
npm install
npm start

text

## API Endpoints

- GET `/api/products`: List all products
- GET `/api/products/search?name={query}`: Search by name
- POST `/api/products/import` (multipart): Import from CSV
- GET `/api/products/export`: Export as CSV
- PUT `/api/products/:id`: Update product
- GET `/api/products/:id/history`: Get inventory history

## Deployment

- Backend deployed: `https://YOUR-BACKEND-URL/api`
- Frontend deployed: `https://YOUR-FRONTEND-URL`

## Usage

1. Start both backend and frontend servers.
2. Open the frontend URL in your browser.
3. Add products, test search/filter, import/export, and view history.

## Sample CSV Format (for import)

name,unit,category,brand,stock,status,image
Pen,pcs,Stationery,Faber,100,In Stock,
Book,pcs,Education,Oxford,50,In Stock,
Laptop,pcs,Electronics,Dell,10,In Stock,

text

## License