import { createClient } from "@/lib/supabase/server";

export async function analyzeWeeklyContentAI() {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return { error: "No authenticated user found" };
		}

    console.log("AUTH USER ID:", user.id);

		const aWeekAgo = new Date();
		aWeekAgo.setDate(aWeekAgo.getDate() - 7);

		const { data: entries, error: entriesError } = await supabase
			.from("entries")
			.select("content, mood, created_at")
			.eq("user_id", user.id)
			.gte("created_at", aWeekAgo.toISOString());

		if (entriesError) {
			return { error: "Failed to fetch entries for analysis" };
		}

		const newInsight = {
			summary: `Based on ${entries?.length || 0} entries this week, you showed consistent self-reflection and growth.`,
			top_themes: ["Personal Growth"],
			mood_trend: [
				{ mood: "Happy", count: 4 },
				{ mood: "Neutral", count: 2 },
				{ mood: "Tired", count: 1 },
			],
			created_at: new Date().toISOString(),
		};

		const { error: insertError } = await supabase
			.from("weekly_insights")
			.insert([
				{
					user_id: user.id,
					week_start: aWeekAgo.toISOString().split("T")[0],
					week_end: new Date().toISOString().split("T")[0],
					summary: `Based on ${entries?.length ?? 0} entries this week, you showed consistent self-reflection and growth.`,
					top_themes: ["Personal Growth"],
					mood_trend: [
						{ mood: "Happy", count: 4 },
						{ mood: "Neutral", count: 2 },
						{ mood: "Tired", count: 1 },
					],
					entry_count: entries?.length ?? 0,
				},
			]);

		if (insertError) {
			console.error(`weekly error`, insertError);
			return { error: "failed to save insight" };
		}

		return { data: newInsight };
	} catch (err: any) {
		return { error: err.message };
	}
}
