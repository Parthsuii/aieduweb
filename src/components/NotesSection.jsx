import React from 'react';

const NotesSection = ({ subject, onClose }) => {
  const notes = {
    math: "Key formulas: Quadratic equation: ax² + bx + c = 0, Pythagorean theorem: a² + b² = c².",
    science: "Scientific method: Observe, hypothesize, experiment, analyze, conclude.",
    ai: "AI concepts: Machine learning, neural networks, natural language processing.",
    geography: "Continents: Africa, Antarctica, Asia, Australia, Europe, North America, South America.",
    biology: "Cell structure: Nucleus, mitochondria, ribosomes, cell membrane.",
    physics: "Newton's Laws: 1. Inertia, 2. F=ma, 3. Action-Reaction.",
    chemistry: "Periodic Table: Elements like H (Hydrogen), O (Oxygen), C (Carbon).",
  };

  return (
    <div className="notes-section">
      <h3>Notes for {subject.name}</h3>
      <p>{notes[subject.id] || "No notes available for this subject."}</p>
      <button onClick={onClose}>Close Notes</button>
    </div>
  );
};

export default NotesSection;