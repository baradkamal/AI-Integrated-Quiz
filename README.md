# 🧠 AI-Powered Quiz App

An interactive quiz web application built with the **MEAN stack (MongoDB, Express.js, Angular 19, Node.js)** that allows users to play quizzes and receive AI-generated feedback on their answers. Admins can generate quizzes manually, via APIs, or using Gen AI.

> 📘 **This project is developed as part of my final year internship for the MCA program at Nirma University.**

## 🚀 Features

### 👤 User Features
- 🎯 Play quizzes based on selected topic & difficulty
- ✅ Get instant results with AI-powered explanations
- 🔄 Retry quizzes and improve understanding

### 🔐 Admin Features
- 📝 Create quizzes:
  - Manually
  - From [OpenTDB API](https://opentdb.com/)
  - Using Gen AI APIs
  - From stored questions in DB
- 📚 Manage questions and quizzes in a database

## 🛠️ Tech Stack

| Layer       | Tech                     |
|------------|--------------------------|
| Frontend    | Angular 19, Tailwind CSS |
| Backend     | Node.js, Express.js      |
| Database    | MongoDB                  |
| AI APIs     | Gen AI (for Q&A logic)   |

## 🧩 Project Structure
/client             → Angular frontend  
/server             → Express backend  
/server/models      → MongoDB schemas  
/server/routes      → API routes  
/server/controllers → logic  

