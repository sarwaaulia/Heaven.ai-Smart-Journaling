"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type MoodsCount = {
	mood: string;
	count: number;
};

type WeeklyInsight = {
	id: string;
	summary: string;
	topThemes: string[];
	moodTrend: MoodsCount[];
	createdAt: string;
};

export async function getInsightFromUser() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return { error: "user not authenticated yet" };
		}

		const { data, error } = await supabase
			.from("weekly_insights")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Database error:", error);
			return {
				data: [
					{
						id: "1",
						summary:
							"This week you really enjoyed your hobby which recently made you feel like improving that hobby and making goals so that the hobby you are currently pursuing can develop and make you a better person.",
						topThemes: ["Hobby", "Goals", "Personal"],
						moodTrend: [
							{ mood: "Happy", count: 3 },
							{ mood: "Neutral", count: 2 },
							{ mood: "Stressed", count: 1 },
						],
						createdAt: new Date().toISOString(),
					},
				] as WeeklyInsight[],
			};
		}

		const mappedInsights = (data ?? []).map((item) => ({
			id: item.id,
			summary: item.summary,
			topThemes: item.top_themes,
			moodTrend: item.mood_trend,
			createdAt: item.created_at,
		}));

		return { data: mappedInsights };
	} catch (error: any) {
		console.error(error.message);
		return { error: "Failed to fetch insights" };
	}
}

export async function generateWeeklyInsight() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) return { error: "No authenticated user found" };

		const aWeekAgo = new Date();
		aWeekAgo.setDate(aWeekAgo.getDate() - 7);

		const { data: entries, error: entriesError } = await supabase
			.from("entries")
			.select("content, mood, created_at")
			.eq("user_id", user.id)
			.gte("created_at", aWeekAgo.toISOString());

		if (entriesError) return { error: "Failed to fetch entries" };
		if (!entries || entries.length === 0)
			return { error: `There are no entries yet.` };

		const combinedContent = entries.map((e) => e.content).join("\n\n");

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
		const aiResponse = await fetch(`${baseUrl}/api/ai/insight`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: combinedContent }),
		});

		if (!baseUrl) {
			throw new Error("Cannot configure APP_URL in an env variable");
		}

		if (!aiResponse.ok) throw new Error("AI failed to analyze data");
		const aiResult = await aiResponse.json();

		const moodTrend = entries.reduce((acc: any, curr) => {
			const existing = acc.find((m: any) => m.mood === curr.mood);
			if (existing) existing.count += 1;
			else acc.push({ mood: curr.mood || "Neutral", count: 1 });
			return acc;
		}, []);

		// data for database
		const newInsightData = {
			user_id: user.id,
			week_start: aWeekAgo.toISOString().split("T")[0],
			week_end: new Date().toISOString().split("T")[0],
			summary: aiResult.summary,
			top_themes: aiResult.themes || ["General"],
			mood_trend: moodTrend,
			entry_count: entries.length,
		};

		const { error: insertError } = await supabase
			.from("weekly_insights")
			.insert([newInsightData]);

		if (insertError) {
			console.error(
				"Supabase Error:",
				insertError.message,
				insertError.details,
			);
			throw new Error(`Failed to save insight: ${insertError.message}`);
		}

		revalidatePath("/insights");
		return { success: true };
	} catch (error: any) {
		return { error: error.message || "Internal server error" };
	}
}
