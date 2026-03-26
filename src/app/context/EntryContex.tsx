"use client";

import React, { createContext, useContext, useState } from "react";

const EntryContext = createContext<any>(null);

export function EntryProvider({ children }: { children: React.ReactNode }) {
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");

	const [selectedMood, setSelectedMood] = useState({ emoticon: "😊", label: "neutral" });
	const [moodIntensity, setMoodIntensity] = useState(5);
	const [isMood, setIsMood] = useState(false);
	const [aiDetectMood, setAiDetectMood] = useState("");

	const [tags, setTags] = useState<string[]>([]);
	const [message, setMessage] = useState("");
	const [AISuggestTags, setAISuggestTags] = useState<string[]>([]);

	const [AIResult, setAIResult] = useState("");
	const [showAIResult, setShowAIResult] = useState(false);
	const [editedResultFromAI, setEditedResultFromAI] = useState("");
	const [editAIResult, setEditAiResult] = useState(false);
	const [showSuggestionTag, setShowSuggestionTag] = useState(false)

	return (
		<EntryContext.Provider
			value={{
				content,
				setContent,
				selectedMood,
				setSelectedMood,
				isMood,
				setIsMood,
				aiDetectMood,
				setAiDetectMood,
				moodIntensity,
				setMoodIntensity,
				tags,
				setTags,
				AISuggestTags,
				setAISuggestTags,
				message,
				setMessage,
				AIResult,
				setAIResult,
				setEditAiResult,
				editedResultFromAI,
				setEditedResultFromAI,
				editAIResult,
				showAIResult,
				setShowAIResult,
				showSuggestionTag, 
				setShowSuggestionTag
			}}
		>
			{children}
		</EntryContext.Provider>
	);
}

export const useEntry = () => useContext(EntryContext);
