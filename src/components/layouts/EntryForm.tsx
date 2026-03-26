'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEntry } from '@/app/context/EntryContex';
import { useAiEnhancement } from '@/app/hooks/useAIEnhancement';
import { createNewEntry } from '@/app/entries/new/server';
import VoiceButton from "@/components/layouts/VoiceButton";

import ContentInput from './ContentInput';
import MoodPicker from './MoodPicker';
import TagInput from './TagInput';

export default function EntryForm() {
  const router = useRouter();
  const { content, setContent, selectedMood, tags, setTags, moodIntensity } = useEntry();
  const { tidyUp, isLoading: isAiLoading } = useAiEnhancement();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSave = async () => {
  if (!content.trim()) {
    setError("Journal content cannot be empty!");
    return;
  }

  setIsSaving(true);
  try {
    const result = await createNewEntry(content, selectedMood, tags, moodIntensity);

    if (!result.error) {
      // RESET FORM
      setContent("");
      setTags([]);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError("Failed to save. Please check your connection.");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <main className="container mx-auto max-w-2xl p-6 space-y-6 pb-24">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="relative space-y-4">
        <ContentInput />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <button 
              onClick={tidyUp} 
              disabled={isAiLoading || !content}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "✨ Tidy with AI"}
            </button>
            <VoiceButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-zinc-800">
        <MoodPicker />
        <TagInput />
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t dark:border-zinc-800 z-40">
        <div className="max-w-2xl mx-auto flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-500 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isAiLoading}
            className="flex-1 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-3 rounded-xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving Entry..." : "Save Journal Entry"}
          </button>
        </div>
      </div>
    </main>
  );
}