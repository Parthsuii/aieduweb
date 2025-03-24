import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NotesSection from './NotesSection';

const ContentSection = ({ subject, onClose }) => {
  const [aiContent, setAiContent] = useState('Loading AI insights...');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchAIContent = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('API key is missing from .env file');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Provide a short educational summary about ${subject.name} in a futuristic tone, max 100 words.`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        setAiContent(responseText);
      } catch (error) {
        console.error('Gemini API Error:', error.message);
        setAiContent(`Failed to load AI content: ${error.message}. Please try again or check your API key.`);
      }
    };

    fetchAIContent();
  }, [subject]);

  return (
    <div className="content">
      <h2>{subject.name}</h2>
      <p>{aiContent}</p>
      <div className="content-buttons">
        <button onClick={() => setShowNotes(!showNotes)}>
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
      {showNotes && <NotesSection subject={subject} onClose={() => setShowNotes(false)} />}
    </div>
  );
};

export default ContentSection;