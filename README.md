# Backend Development Challenge

A backend API built with **Express**, **MongoDB (Mongoose)**, and **TypeScript** to manage products and categories.

---

## Data Model Diagram

![Data Model Diagram](/diagram/data-model.png)

> Category can have many Products.

> Product belongs to one Category.  

## Tech Stack

- Express.js
- MongoDB (Mongoose)
- TypeScript

---

## API Endpoints

### Categories

| Method | Route           | Description       |
|--------|------------------|-------------------|
| POST   | `/api/categories`    | Create a category |


### Products

| Method | Route           | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/api/products`      | Create a new product                     |
| PUT    | `/api/products/:productId`  | Update product status, discount, or description |
| GET    | `/api/products`      | Get all products (with filter and search)          

---

