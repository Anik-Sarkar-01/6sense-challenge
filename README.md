# Backend Development Challenge

A backend API built with **Express**, **MongoDB (Mongoose)**, and **TypeScript** to manage products and categories.

---

## 📊 Data Model Diagram

![Data Model Diagram](/diagram/data-model.png)

> Category can have many Products.

> Product belongs to one Category.  

## ⚙️ Tech Stack

- Express.js
- MongoDB (Mongoose)
- TypeScript

---

## 📦 API Endpoints

### 🗂️ Categories

| Method | Route           | Description       |
|--------|------------------|-------------------|
| POST   | `/categories`    | Create a category |


### 🧾 Products

| Method | Route           | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/products`      | Create a new product                     |
| PUT    | `/products/:id`  | Update product status, discount, or description |
| GET    | `/products`      | Get all products (with filter and search)          

---

