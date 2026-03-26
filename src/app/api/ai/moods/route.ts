import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const moods = [
	{ emoticon: "🙂", label: "neutral" },
	{ emoticon: "😊", label: "happy" },
	{ emoticon: "🤩", label: "excited" },
	{ emoticon: "🥰", label: "love" },
	{ emoticon: "🤣", label: "very_happy" },
	{ emoticon: "😭", label: "very_sad" },
	{ emoticon: "😡", label: "angry" },
	{ emoticon: "😰", label: "anxious" },
	{ emoticon: "🙏", label: "grateful" },
	{ emoticon: "😎", label: "proud" },
	{ emoticon: "🥺", label: "touched" },
	{ emoticon: "🔥", label: "on fire" },
	{ emoticon: "🤔", label: "thinking" },
	{ emoticon: "😕", label: "confused" },
	{ emoticon: "😴", label: "tired" },
	{ emoticon: "🙄", label: "boredom" },
];

export async function POST(request: Request) {
	const { content } = await request.json();
	if (!content || typeof content !== "string") {
		return NextResponse.json(
			{ error: `invalid content, must be a string and it is required` },
			{ status: 400 },
		);
	}

	const apiAIKey = process.env.GEMINI_API_KEY;
	if (!apiAIKey) {
		return NextResponse.json({ error: `AI Config missing` }, { status: 500 });
	}

	const genAi = new GoogleGenerativeAI(apiAIKey);
	const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

	const moodVariant = moods.map((m) => `${m.label}, ${m.emoticon}`).join(", ");

	const prompt = `Your role is to act as an intelligent mood-detecting assistant for journaling application. Analyze the following journal entry to capture the essence of the author's feelings. Analysis Steps:
    1. Choose one label that best represents the author's feelings from the list: ${moodVariant}.
    2. Rate the intensity of the emotion (1 = very mild, 10 = very intense). Pay attention to the details of the description and the use of capital letters.
    
    return STRICT format (JSON Only), no explanation, in this format: {"label": "happy", "emoji": "😊", "intensity": 7}
    
    Consider the following factors to determine intensity:
- How strongly the emotion is expressed
- Use of emotional language, punctuation (!!!), or capital letters
- Length and detail of the emotional description
- Use of extreme words (very, extremely, really, etc.)

Journal entry: """${content}"""`;

	const result = await model.generateContent(prompt);
	const text = await result.response.text();

	try {
		const cleanJson = text
			.replace(/```json/gi, "")
			.replace(/```/g, "")
			.trim();
		const parsed = JSON.parse(cleanJson);

		// fallback
		const fallback = { ...moods[0], intensity: 5 };

		const sync = moods.find(
			(m) =>
				m.label.toLowerCase() === parsed?.label?.toLowerCase() ||
				m.emoticon === parsed?.emoticon,
		);

		const finalMood = sync
			? {
					label: sync.label,
					emoticon: sync.emoticon,
					intensity: parsed.intensity || 5, // intensity dari ai
				}
			: fallback;

		return NextResponse.json({
			...finalMood,
			text,
		});
	} catch (error: any) {
		console.error(`internal server error`, error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
