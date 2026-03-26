"use client";

import { useEntry } from "@/app/context/EntryContex";
import { useSpeechRecognition } from "@/app/hooks/useSpechRecognition";

export default function ContentInput() {
	const limit = 1000;
	const { content, setContent } = useEntry();
	const { isRecording, toggle } = useSpeechRecognition((text) =>
		setContent((prev: any) => {
			const newContent = prev + " " + text;
			return newContent.slice(0, limit);
		}),
	);

	return (
		<div className="relative">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value.slice(0, limit))} // avoid typing max 1000 characters
				rows={8}
				className="w-full rounded-xl border p-4 focus:ring-2 focus:ring-purple-500 outline-none"
        placeholder="How was your day?"
			/>
			<div className="absolute bottom-4 right-4 flex items-center gap-3">
        <span className={`text-xs font-mono ${content.length >= limit ? 'text-red-500' : 'text-slate-400'}`}>
          {content.length}/{limit}
        </span>
        <button 
          onClick={() => toggle('id-ID')}
          className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
      </div>
    </div>
	);
}
