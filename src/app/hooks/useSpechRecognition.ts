import { useRef, useState } from 'react';

export function useSpeechRecognition(onFinal: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const toggle = (lang: string) => {
    if (!('webkitSpeechRecognition' in window)) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SR = (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          text += e.results[i][0].transcript + ' ';
        }
      }
      onFinal(text);
    };

    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
  };

  return { isRecording, toggle };
}
