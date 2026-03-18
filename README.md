# 🌍 The Roaming Hub
### *An AI-Integrated Full-Stack Travel & Property Ecosystem*

[![Stack: Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![Stack: Python](https://img.shields.io/badge/AI--Service-Python-blue)](https://www.python.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![AI: Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange)](https://ai.google.dev/)

**The Roaming Hub** is a next-generation hotel booking platform that combines the power of the **MERN stack** with a specialized **AI RAG (Retrieval-Augmented Generation) Assistant**. Unlike traditional travel sites, it features a context-aware chatbot that "reads" your specific property database to provide mathematically accurate, hallucination-free recommendations.

---

## 🏗️ System Architecture
The project is built using a **Distributed Microservices** approach, separating the user-facing web logic from the heavy AI computation.

### 1. Core Web Service (Node.js/Express)
* **WanderLust Engine:** Handles user authentication, property listings (CRUD), and reviews.
* **Geospatial Integration:** Uses **Mapbox GL JS** to visualize property locations on interactive maps.
* **Financial Layer:** Integrated with **Razorpay API** for secure, real-time booking transactions in INR.

### 2. AI Intelligence Service (Python/Flask)
* **Semantic Search:** Uses **Sentence-Transformers** to convert hotel descriptions into vector embeddings.
* **Vector Store:** Powered by **ChromaDB** for lightning-fast retrieval of relevant context.
* **LLM Orchestration:** Bridges the retrieved data with **Gemini 1.5 Flash** to generate context-aware responses.

---

## 🤖 The RAG (Retrieval-Augmented Generation) Pipeline
This project implements a professional AI pipeline to ensure the chatbot actually knows about your unique listings:

1.  **Ingestion Phase:** `ingest.py` extracts hotel data from MongoDB, converts it into vectors, and stores it in the `hotel_memory/` directory.
2.  **Retrieval Phase:** When a user asks a question, the system queries **ChromaDB** for the top most relevant listings based on semantic meaning.
3.  **Augmentation Phase:** The retrieved hotel data is injected into a system prompt as "Ground Truth."
4.  **Generation Phase:** Gemini processes the prompt and the "private context" to give a human-like, accurate answer.

---

## 🛠️ Tech Stack

| Component          | Technology                                   |
|:-------------------|:---------------------------------------------|
| **Web Framework** | Node.js, Express.js                          |
| **Frontend** | EJS (Embedded JavaScript), Bootstrap 5, Custom CSS |
| **Primary Database**| MongoDB Atlas (Mongoose ODM)                |
| **AI Framework** | Python (Flask), Google Generative AI (Gemini)|
| **Vector Database**| ChromaDB                                     |
| **Payments & Maps**| Razorpay SDK, Mapbox GL JS                  |
| **Cloud Hosting** | Cloudinary (Image Management)                |

---

## 📂 Project Structure

```text
The-Roaming-Hub/
├── WanderLust/             # Main Web Application (MERN)
│   ├── app.js              # Entry point (Port 8080)
│   ├── models/             # MongoDB Schemas (User, Listing, Review)
│   ├── public/             # CSS (Chat bubbles), Frontend JS, Images
│   └── views/              # EJS Templates & Partials
└── Major Project AI/       # AI Microservice (Python)
    ├── chatbot.py          # Flask REST API (Port 5000)
    ├── ingest.py           # Data vectorization script
    ├── hotel_memory/       # ChromaDB local vector storage
    └── requirements.txt    # Python dependencies
