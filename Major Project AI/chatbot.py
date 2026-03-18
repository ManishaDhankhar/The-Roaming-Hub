from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
import google.generativeai as genai
import os
from dotenv import load_dotenv

app=Flask(__name__)  #for location
CORS(app)

load_dotenv() # This looks for the .env file
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

# using gemini 1.5 flash for fast and smart response
model=genai.GenerativeModel('gemini-1.5-flash')

# connect to my memory
client=chromadb.PersistentClient(path='./hotel_memory')
collection=client.get_or_create_collection(name="wanderlust_rag")

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    user_query = data.get('message', '')
    
    try: 
        # 1. Retrieval
        results = collection.query(
            query_texts=[user_query],
            n_results=2
        )
        print(f"DEBUG: Found {len(results['documents'][0])} matching hotels.")
        
        # 2. Augmentation (Properly Indented)
        content_data = " ".join(results['documents'][0])

        prompt = f"""
        You are the AI Assistant for 'The Roaming Hub'.
        A user is asking a question. Use the following hotel listings to answer.
        If the answer is not in the listings, politely say we do not have that specific property yet.

        DATABASE LISTINGS:
        {content_data}

        USER QUESTION:
        {user_query}

        RESPONSE:
        """

        # 3. Generation
        response = model.generate_content(prompt)
        return jsonify({"reply": response.text})
    
    except Exception as e:
        print(f"❌ Python Error: {e}") # This prints the REAL error in your terminal
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Changing host to '0.0.0.0' makes it accessible across your system
    app.run(host='0.0.0.0', port=5000, debug=True)

