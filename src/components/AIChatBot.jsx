import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const orbRef = useRef(null);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    // GSAP animation for the orb
    if (orbRef.current) {
      gsap.from(orbRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    }

    // Log the initial state of isOpen
    console.log("Chatbot isOpen state on mount:", isOpen);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleChat = () => {
    console.log("Toggling chat, current isOpen:", isOpen);
    setIsOpen((prev) => {
      const newState = !prev;
      console.log("New isOpen state:", newState);
      if (chatRef.current) {
        gsap.to(chatRef.current, {
          y: newState ? 90 : 300,
          opacity: newState ? 1 : 0,
          duration: 0.5,
        });
      }
      return newState;
    });
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const prompt = `You are an AI tutor for an educational website. Answer this question in a clear, concise, and futuristic tone: "${text}"`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Generated response:", responseText);

      const botMessage = { sender: "bot", text: responseText };
      setMessages((prev) => [...prev, botMessage]);

      // Speak the response using Web Speech API
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      const errorMessage = {
        sender: "bot",
        text: `Error: ${error.message}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsListening(false);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
    setInput("");
  };

  const toggleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech recognition is not supported in your browser. Please use a modern browser like Chrome."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      console.log("Voice recognition started...");

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice input received:", transcript);
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Speech recognition error: ${event.error}` },
        ]);
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      <div
        ref={orbRef}
        className="chat-orb"
        onClick={toggleChat}
        title="Ask me anything!"
      >
        AI
      </div>
      <div ref={chatRef} className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>AI Tutor</h3>
          <button onClick={toggleChat}>X</button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleTextSubmit} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="glow-input"
          />
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`voice-btn ${isListening ? "listening" : ""}`}
          >
            {isListening ? "🎙️ Stop" : "🎙️ Speak"}
          </button>
          <button type="submit" className="supernova-btn">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatBot;
