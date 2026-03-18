import chromadb
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# 1. LOAD SECRET KEY
load_dotenv() # This looks for the .env file
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# 2. SETUP MEMORY
client = chromadb.PersistentClient(path="./hotel_memory")
collection = client.get_or_create_collection(name="wanderlust_rag")

# 3. LOAD DATA
with open("data.json", "r") as f:
 listings = json.load(f)

print("🚀 Starting secure ingestion...")

for hotel in listings:
# We use 'image' and 'url' because that matches your data.json structure
 image_url = hotel.get("image", {}).get("url", "")
 combined_text = f"Hotel: {hotel['title']} in {hotel['location']}. {hotel['description']} Price: ${hotel['price']}"
 collection.add(
   documents=[combined_text],#in this code our combine text of hotel list converted into vector and this is automatically done by chromadb embedded system
   ids=[hotel["_id"]],
   metadatas=[{
   "title": hotel["title"],
   "image": image_url
   }]
)

print("✅ DONE! Memory built safely.")