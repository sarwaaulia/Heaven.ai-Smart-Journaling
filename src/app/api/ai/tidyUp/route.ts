import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function detectLanguage(content: string): string {
	const lowerContent = content.toLowerCase().trim();

	const idWords = [
		"halo",
		"hi",
		"saya",
		"aku",
		"kamu",
		"anda",
		"kita",
		"kami",
		"mereka",
		"tolong",
		"bisa",
		"bantu",
		"gue",
		"tidak",
		"tahu",
		"apa",
		"buat",
		"ini",
		"gue",
		"gw",
		"gua",
		"lo",
		"elo",
		"lu",
		"itu",
		"dia",
		"sudah",
		"belum",
		"mohon",
		"jangan",
		"kapan",
		"kenapa",
		"di mana",
		"siapa",
		"bagaimana",
		"apa",
		"namun",
		"mengapa",
		"kemarin",
		"sekarang",
		"nanti",
		"hari ini",
		"besok",
		"lusa",
		"selamat",
		"terima",
		"kasih",
		"oleh",
		"belum",
		"sangat",
		"juga",
		"berapa",
		"bapak",
		"ibu",
		"adik",
		"kakak",
		"nenek",
		"kakek",
		"maaf",
		"juga",
		"lagi",
		"sangat",
		"bermanfaat",
		"lalu",
		"namun",
		"tapi",
		"atau",
		"jika",
		"seperti",
		"mau",
		"ingin",
		"bisa",
		"boleh",
		"seperti",
		"atau",
		"bulan",
		"tahun",
		"hari",
		"jam",
		"tanggal",
		"menit",
		"detik",
		"karena",
		"koreksi",
	];

	const engWords = [
		"hey",
		"hello",
		"hi",
		"welcome",
		"can",
		"you",
		"me",
		"i",
		"am",
		"they",
		"we",
		"she",
		"he",
		"it",
		"are",
		"is",
		"have",
		"should",
		"where",
		"when",
		"who",
		"do",
		"not",
		"which",
		"how",
		"help",
		"year",
		"month",
		"day",
		"second",
		"want",
		"this",
		"these",
		"those",
		"has",
		"please",
		"what",
		"but",
		"why",
		"yesterday",
		"later",
		"now",
		"today",
		"tomorrow",
		"congratulation",
		"thank",
		"from",
		"to",
		"very",
		"too",
		"much",
		"for",
		"of",
		"had",
		"my",
		"mine",
		"your",
		"yours",
		"their",
		"theirs",
		"them",
		"whose",
		"happy",
		"if",
		"or",
		"so",
		"yes",
		"no",
		"thanks",
		"will",
		"did",
		"does",
		"its",
		"then",
		"might",
		"may",
		"us",
		"her",
		"him",
		"our",
		"with",
		"on",
		"at",
		"on",
		"from",
		"about",
		"as",
		"was",
		"were",
		"be",
		"could",
		"would",
	];

	const engPatterns = [
		/\b(have|has|had|having)\b/gi,
		/\th\b/gi,
		/\b(hello|hi|hey|goodbye|bye|thanks|thank|please|sorry)\b/gi,
		/\b(what|how|why|when|where|who|which)\b/gi,
		/\b(i|you|he|she|we|they)\b/gi,
		/\b(am|is|are|was|were|be|been|being)\b/gi,
	];

	const idPatters = [
		/\b(apa|bagaimana|kenapa|kapan|dimana|siapa|mengapa)\b/gi,
		/[aiueo][bcdfghjklmnpqrstvwxyz]/gi,
		/\b(bapak|pak|ibu|bu)\b/gi,
		/\b(kamu|lu|loe|lo)\b/gi,
		/\b(saya|aku|gue|gw|gua|aku)\b/gi,
		/\b(selamat|terima|kasih|maaf)\b/gi,
		/\b(ng|ny|kh|sy)\b/gi,
	];

	let idScoreWords = 0;
	let engScoreWords = 0;

	// hitung perkata yang cocok
	idWords.forEach((word) => {
		if (lowerContent.includes(word)) idScoreWords++;
	});

	engWords.forEach((word) => {
		if (lowerContent.includes(word)) engScoreWords++;
	});

	engPatterns.forEach((pattern) => {
		if (pattern.test(lowerContent)) engScoreWords += 2;
	});

	idPatters.forEach((pattern) => {
		if (pattern.test(lowerContent)) idScoreWords += 2;
	});

	// jika kalimatnya pendek/singkat
	if (lowerContent.split(" ").length <= 3) {
		if (idScoreWords > engScoreWords) return "Indonesian";
		if (engScoreWords > idScoreWords) return "English";

		if (/\b(hello|hi|hey)\b/gi.test(lowerContent)) return "english";
		if (/\b(hai|halo|)\b/gi.test(lowerContent)) return "indonesian";

		// default language
		return "Indonesian";
	}

	//   jika kalimatnya panjang
	if (engScoreWords > idScoreWords) {
		return "English ";
	} else if (idScoreWords > engScoreWords) {
		return "Indonesian";
	} else {
		if (/\b(i|you|we|they)\b/gi.test(lowerContent)) return "English";
		if (/\b(saya|aku|kamu|kami|mereka|gue|gw|gua|kita)\b/gi.test(lowerContent))
			return "Indonesian";

		// Default to Indonesian
		return "indonesian";
	}
}

function generatePrompt(content: string, language: string): string {
	if (language === "Indonesian") {
		return `tolong koreksi dan rapihkan entri jurnal berikut agar jurnal saya terlihat lebih profesional dan terstruktur dengan memperhatikan hal berikut:
        1. jangan mengubah pesan dan makna atau menambah informasi baru, 
        2. perbaiki ejaan dan tata bahasa, 
        3. atur dengan lebih baik pemikiran jika perlu,
        4. gunakan tanda bahasa dan kapitalisasi yang tepat dan terstruktur,
        5. tingkatkan struktur kalimat dan nada asli, 
        6. buatkan agar lebih ringkas namun ekspresif
        
        Teks Asli: "${content}" 
        Kembalikan hanya versi yang diperbaiki tanpa teks atau penjelasan tambahan.`;
	} else {
		return `Please correct and tidy up the following journal entry to make it look more professional and structured by paying attention to the following:
        1. Do not change the message and meaning or add new information,
        2. Correct spelling and grammar,
        3. Better organize your thoughts if necessary,
        4. Use proper and structured punctuation and capitalization,
        5. Improve the sentence structure and tone of the original,
        6. Make it more concise yet expressive
        
        Original Text: "${content}"
        Revert only the corrected version without additional text or explanation.`;
	}
}

export async function POST(request: Request) {
	try {
		const { content } = await request.json();

		if (!content || typeof content !== "string") {
			return NextResponse.json(
				{ error: "Content is required" },
				{ status: 400 },
			);
		}

		const apiAIKey = process.env.GEMINI_API_KEY?.trim();
		if (!apiAIKey) {
			return NextResponse.json({ error: "AI Config missing" }, { status: 500 });
		}

		const genAi = new GoogleGenerativeAI(apiAIKey);
		const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

		const language = detectLanguage(content);
		const prompt = generatePrompt(content, language);

		const resultAI = await model.generateContent(prompt);

		const text = await resultAI.response.text();

		if (!text) {
			throw new Error("Empty response from AI");
		}

		return NextResponse.json({
			tidiedText: text.trim().replace(/['"]+/g, ""),
		});
	} catch (error: any) {
		console.error("DETAILED ERROR:", error.message);
		return NextResponse.json(
			{ error: error.message || "internal server error" },
			{ status: 500 },
		);
	}
}
