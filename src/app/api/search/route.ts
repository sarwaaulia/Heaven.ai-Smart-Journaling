import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const { searchParams } = new URL(req.url);
		const query = searchParams.get("query") || "";
		const mood = searchParams.get("mood");
		const category = searchParams.get("category");
		const startDate = searchParams.get("sDate");
		const endDate = searchParams.get("eDate");
		const sortBy = searchParams.get("relevance") || "date_desc";

		const limit = parseInt(searchParams.get("limit") || "10");
		const page = parseInt(searchParams.get("page") || "1");
		const offset = (page - 1) * limit;

		let dbQuery = supabase
			.from("entries")
			.select(`*, category ( name, color )`, { count: "exact" })
			.eq("user_id", user.id);

		// Text Search
		if (query.trim()) {
			dbQuery = dbQuery.or(`content.ilike.%${query}%,tags.cs.{${query}}`);
		}

		if (mood && mood !== "") {
			dbQuery = dbQuery.eq("mood", mood);
		}

		// Category Filter
		if (category && category !== "") {
			dbQuery = dbQuery.filter("category.name", "eq", category);
		}

		// Date Range Filter
		if (startDate)
			dbQuery = dbQuery.gte("created_at", `${startDate}T00:00:00Z`);
		if (endDate) dbQuery = dbQuery.lte("created_at", `${endDate}T23:59:59Z`);

		// Sorting
		if (sortBy === "date_asc") {
			dbQuery = dbQuery.order("created_at", { ascending: true });
		} else if (sortBy === "mood") {
			dbQuery = dbQuery.order("mood", { ascending: true });
		} else {
			dbQuery = dbQuery.order("created_at", { ascending: false });
		}

		const { data, error, count } = await dbQuery.range(
			offset,
			offset + limit - 1,
		);
		if (error) throw error;

		return NextResponse.json({
			entries: data || [],
			pagination: { total: count || 0, page, limit },
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
