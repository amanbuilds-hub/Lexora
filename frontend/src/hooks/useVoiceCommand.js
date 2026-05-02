import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const commands = {
    'check case status': '/dashboard/family',
    'केस स्टेटस': '/dashboard/family',
    'request lawyer': '/hearing/new',
    'वकील': '/hearing/new',
    'go to shop': '/shop',
    'दुकान': '/shop',
    'grievance': '/grievance'
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Can be adjusted for Hindi 'hi-IN'
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice Command:', transcript);

      for (const [cmd, path] of Object.entries(commands)) {
        if (transcript.includes(cmd)) {
          navigate(path);
          break;
        }
      }
    };

    recognition.start();
  };

  return { isListening, startListening };
};

export default useVoiceCommand;
