import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return NextResponse.json(
				{ error: `you have not authenticated yet`, userError },
				{ status: 401 },
			);
		}
		console.log(`data user id:`, user.id);

		const { data: entries, error: entriesError } = await supabase
			.from('entries')
			.select("id, user_id, content, created_at, user_id")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (entriesError) {
			console.error("Debug: Query error:", entriesError);
			return NextResponse.json(
				{ error: "cannot entry journal cause error", entriesError },
				{ status: 500 },
			);
		}

		const { data: allEntries, error: allEntriesError } = await supabase
			.from('entries')
			.select("id, user_id, created_at")
			.limit(5);

            console.log(`data for all entries for this user`, allEntries?.length || 0)

            return NextResponse.json( {
                success: true,
                userEntries: entries || [],
                userId: user.id,
                allEntriesData: allEntries || [], 
                error: {
                    userError, entriesError, allEntriesError
                }
            }
            )
	} catch (error: any) {
        console.error(error.message)
        return NextResponse.json({
            error: `internal server error`,
            status: 500
        })
    }
}
