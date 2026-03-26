"use client";

import { useEntry } from "@/app/context/EntryContex";
import { useState } from "react";
import { X, Tag as TagIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function TagInput() {
  const { tags, setTags } = useEntry();
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      if(tags.length >= 3) {
        toast.error(`Maximum 3 categories allowed`)
        return;
      }
      setTags([...tags, trimmed]);
      setInput('');
    }
  };

  return (
    <div className="space-y-3 p-5 rounded-2xl bg-surface border border-border-muted shadow-sm transition-colors">
      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
        <TagIcon size={14} className="text-brand-purple" /> Tags / Categories
      </label>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((t: any) => (
          <span 
            key={t} 
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded-xl border border-brand-purple/20 transition-all hover:bg-brand-purple/20"
          >
            #{t}
            <button 
              onClick={() => setTags(tags.filter((tag:any) => tag !== t))}
              className="hover:text-red-500 transition-colors"
            >
              <X size={12}/>
            </button>
          </span>
        ))}
      </div>

      <input
        placeholder="Add category... (Press Enter)"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
        className="w-full bg-transparent text-sm text-text-primary outline-none border-b border-border-muted focus:border-brand-purple pb-2 transition-all placeholder:text-text-secondary/50"
      />
    </div>
  );
}