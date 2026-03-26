import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { content } = await req.json();

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

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `
      Your role as a smart journal psychology assistant is to provide insights into journal entries and brief analyses with the following requirements:

      return STRICT format (JSON Only)

"summary":
A warm and insightful conclusion about the user's condition this week, using a maximum of two sentences.

"themes":
The three main topics or keywords that appear most frequently in user entries.
    Insight for this week: 
    """${content}"""
`;

		const result = await model.generateContent(prompt);
		const text = result.response.text();

		const cleanedText = text
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();
		const jsonResult = JSON.parse(cleanedText);

		return NextResponse.json({
			summary: jsonResult.summary,
			themes: jsonResult.themes,
		});
	} catch (error) {
		console.error("Gemini Error:", error);
		return NextResponse.json(
			{ error: "Failed to processed AI" },
			{ status: 500 },
		);
	}
}
