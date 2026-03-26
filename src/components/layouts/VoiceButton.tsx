'use client';
import { useSpeechRecognition } from '@/app/hooks/useSpechRecognition';
import { useEntry } from '@/app/context/EntryContex';
import { Mic, Square, Sparkles } from 'lucide-react';

export default function VoiceButton() {
  const { setContent } = useEntry();
  
  const { isRecording, toggle } = useSpeechRecognition((text) => {
    setContent((prev: string) => prev + text);
  });

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggle('id-ID')} // Set indonesia
        className={`relative group flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
          isRecording 
            ? 'bg-red-50 text-red-600 ring-2 ring-red-200' 
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
        }`}
      >
        <div className={`p-1.5 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-300'}`}>
          {isRecording ? <Square size={14} fill="currentColor" /> : <Mic size={16} />}
        </div>
        <span className="text-sm font-semibold">
          {isRecording ? 'Listening...' : 'Speak'}
        </span>

        {/* wave affect  */}
        {isRecording && (
          <div className="flex gap-1 items-center ml-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </button>
      
      {/* mini tooltip */}
      {!isRecording && (
        <span className="text-[10px] text-zinc-400 font-medium italic">
          "Tell your story today.."
        </span>
      )}
    </div>
  );
}