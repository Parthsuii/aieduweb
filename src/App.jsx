import { useState, useEffect } from "react";
import CosmicBackground from "./components/CosmicBackground";
import SubjectPlanet from "./components/SubjectPlanet";
import ContentSection from "./components/ContentSection";
import AIChatBot from "./components/AIChatBot";
import "./App.css";

const subjects = [
  { id: "math", name: "Math", color: "#00f0ff" },
  { id: "science", name: "Science", color: "#ff00ff" },
  { id: "ai", name: "AI Technology", color: "#00ff99" },
  { id: "geography", name: "Geography", color: "#ffcc00" },
  { id: "biology", name: "Biology", color: "#66ff66" },
  { id: "physics", name: "Physics", color: "#ff6666" },
  { id: "chemistry", name: "Chemistry", color: "#cc66ff" },
];

const quotes = [
  "The universe is a pretty big place. If it's just us, seems like an awful waste of space. – Carl Sagan",
  "Somewhere, something incredible is waiting to be known. – Sharon Begley",
  "The important thing is not to stop questioning. Curiosity has its own reason for existing. – Albert Einstein",
  "Science is a way of thinking much more than it is a body of knowledge. – Carl Sagan",
  "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge. – Stephen Hawking",
];

function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <CosmicBackground />
      <div className="overlay">
        <h1>Welcome to the EduVerse</h1>
        <p className="tagline">Your Cosmic Gateway to Infinite Knowledge</p>
        <div className="subjects">
          {subjects.map((subject) => (
            <SubjectPlanet
              key={subject.id}
              subject={subject}
              onSelect={() => setSelectedSubject(subject)}
            />
          ))}
        </div>
        <div className="quote-section">
          <p className="quote">"{currentQuote}"</p>
        </div>
        {selectedSubject && (
          <ContentSection
            subject={selectedSubject}
            onClose={() => setSelectedSubject(null)}
          />
        )}
        <AIChatBot />
      </div>
    </div>
  );
}

export default App;
