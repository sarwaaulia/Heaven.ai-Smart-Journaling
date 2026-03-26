"use server";

import { createClient } from "@/lib/supabase/server";

export async function category(name: string, color: string) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (!user || userError) {
			return { error: `user not authenticated yet` };
		}

		const { data, error } = await supabase
			.from("category")
			.insert([
				{
					user_id: user.id,
					name: name.trim(),
					color,
				},
			])
			.select()
			.single();

		if (error) {
			console.error("cannot connect to database:", error);
			return { error: "Failed to add category" };
		}

		return { data };
	} catch (error: any) {
		console.error("internal server error", error);
		return { error: "Failed to add category" };
	}
}
