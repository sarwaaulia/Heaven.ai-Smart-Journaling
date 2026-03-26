import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const tags = ["Work", "Personal", "Reflection", "Ideas", "Goals"];

export async function POST(req: Request) {
	try {
		const body = await req.json();
        const content = body.content;

		if (!content || typeof content !== "string") {
			return NextResponse.json(
				{ error: `invalid content, must be a string and it is required` },
				{ status: 400 },
			);
		}

		const apiAIKey = process.env.GEMINI_API_KEY;
		if (!apiAIKey) {
			return NextResponse.json(
				{ error: `internal server error. AI is not configured enough` },
				{ status: 500 },
			);
		}

		const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
		const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

		const predefinedTagsList = tags.map((tag) => `"${tag}"`).join(", ");

		const prompt = `Your role is to act as an intelligent content tagging assistant for journaling application. Analyze the following journal entry to capture the essence of the author's content tagging adn suggest for relevant tags. 
        rules:
        1. The text must be relevant to the content provided by the author.
        2. Select tags only from the following list ${tags}.
        3. The maximum number of tags per content is 3.
        4. Return only JSON format.
        5. If none of the tags match the author's preferences, write an empty array. 
        
        Consider the following pattern to determine tags selection:
        1. Work: career, meetings, projects, tasks, deadlines, jobs,
        2, Personal: friend, co-work, health, daily-life, family, relationships, hobby
        3. Reflection: self-growth, self analysis, memories, experiences,
        4. Ideas: inspiration, creative thoughts, innovation, brain storming,
        5. Goals: achievements, plans, target, resolution
        
        Journal entry: """${content}"""
        return format: ["Work", "Personal", "Meditation"]`;

		const resultAI = await model.generateContent(prompt);
		const responseAI = await resultAI.response;
		const raw = responseAI.text().trim();

		let suggestTags: string[] = [];

		try {
			const cleanJson = raw
				.replace(/```json/gi, "")
				.replace(/```/g, "")
				.trim();
			const parsed = JSON.parse(cleanJson);

			if (Array.isArray(parsed)) {
				suggestTags = parsed
					.filter((tag) => typeof tag === "string" && tags.includes(tag.trim()))
					.slice(0, 3);
			}
		} catch (error) {
			const tagSync = raw.match(/\b(Work|Personal|Ideas|Goals|Reflection)\b/gi);
			if (tagSync) {
				suggestTags = [
					...new Set(
						tagSync.map(
							(tag) => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(),
						),
					),
				].slice(0, 3);
			}
		}

		return NextResponse.json({
			suggestTags,
			predefinedTags: tags,
			raw,
		});
	} catch (error: any) {
        console.error(error.message)
        return NextResponse.json(
            {error: `failed to generated tags`},
            {status: 500}
        )
    }
}
