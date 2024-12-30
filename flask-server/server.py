from flask import Flask, jsonify, request
from flask_cors import CORS
import pyttsx3
import wikipedia
import datetime
import pywhatkit
import webbrowser
import threading
import google.generativeai as genai

# Set your Gemini API key
genai.configure(api_key="AIzaSyDRvZefI1onYp2HGH9WLzhKcXph70r651Q")

# Create a model instance for Gemini
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Initialize text-to-speech engine
engine = pyttsx3.init()

# Function to speak the response
def respond(text):
    def speak():
        engine.say(text)
        engine.runAndWait()

    # Run speak in a separate thread
    threading.Thread(target=speak, daemon=True).start()
    return text  # Return the text response for the frontend

# Function to handle Gemini query and get the response
def handle_gemini_query(command):
    # Pass the command directly to the Gemini model
    prompt = f"You are an AI assistant. The user asked: {command}. Please provide a helpful and informative response."
    response = model.generate_content(prompt)
    
    # Restrict the response to 4 lines
    full_response = response.text
    lines = full_response.split("\n")  # Split response into lines
    limited_response = "\n".join(lines[:4])  # Take only the first 4 lines

    return limited_response


@app.route("/command", methods=["POST"])
def handle_command():
    command = request.json.get("command", "").lower()
    response_text = ""

    try:
        if 'hello' in command:
            response_text = respond("Hello! How can I help you?")

        elif 'time' in command:
            current_time = datetime.datetime.now().strftime('%H:%M:%S')
            response_text = f"The time is {current_time}"
            respond(response_text)

        elif 'tell me about yourself' in command:
            response_text = "I am your voice assistant. I can help you with various tasks such as searching Wikipedia, telling the time, opening websites, and more. Just let me know how I can assist you!"
            respond(response_text)

        elif 'wikipedia' in command:
            command = command.replace("wikipedia", "").strip()
            if command:
                respond("Searching Wikipedia...")
                try:
                    results = wikipedia.summary(command, sentences=1)
                    response_text = f"According to Wikipedia: {results}"
                    respond(response_text)
                except wikipedia.exceptions.DisambiguationError:
                    respond("The query is too ambiguous. Please be more specific.")
                except Exception:
                    respond("Sorry, I couldn't find information on that topic.")

        elif 'who is' in command or 'tell me about' in command:
            person_name = command.replace("who is", "").replace("tell me about", "").strip()
            if person_name:
                respond(f"Searching Wikipedia for {person_name}...")
                try:
                    results = wikipedia.summary(person_name, sentences=1)
                    response_text = f"According to Wikipedia: {results}"
                    respond(response_text)
                except wikipedia.exceptions.DisambiguationError:
                    respond("The query is too ambiguous. Please be more specific.")
                except Exception:
                    respond("Sorry, I couldn't find information on that person.")

        elif 'open youtube' in command:
            respond("Opening YouTube...")
            webbrowser.open("https://www.youtube.com")
            response_text = "YouTube is now open."

        elif 'play' in command:
            song = command.replace('play', '').strip()
            if song:
                respond(f"Playing {song} on YouTube...")
                pywhatkit.playonyt(song)
                response_text = f"Playing {song} on YouTube."

        elif 'weather' in command:
            respond("Checking the weather...")
            webbrowser.open("https://www.google.com/search?q=weather")
            response_text = "Checking the weather. Please return to the tab and confirm."

        elif 'google maps' in command:
            respond("Opening Google Maps...")
            webbrowser.open("https://www.google.com/maps")
            response_text = "Opening Google Maps. Please return to the tab and confirm."

        elif 'open google' in command:
            respond("Opening Google...")
            webbrowser.open("https://www.google.com")
            response_text = "Google is now open."

        elif 'stop' in command or 'bye' in command or 'exit' in command:
            respond("Goodbye! Have a great day!")
            response_text = "Goodbye! Have a great day!"

        elif 'creator' in command:
            respond("I was created by a group of students at the Medicaps University , Indore. By Anshul Kavishwar, Naman Bagrecha, Rhytham More")
            response_text = "I was created by a group of students at the Medicaps University , Indore. By Anshul Kavishwar, Naman Bagrecha, Rhytham More"

        else:
            # If no command matches, ask Gemini for a response
            response_text = handle_gemini_query(command)
            respond(response_text)

    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        response_text = "An error occurred while processing your request."

    return jsonify({"response": response_text})

if __name__ == "__main__":
    print("Starting server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
