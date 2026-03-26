"use server";

import { createClient } from "@/lib/supabase/server";

type JournalEntry = {
	id: string;
	content: string;
	mood?: string;
	category?: string;
	category_id?: string;
	categories?: {
		name: string;
		color: string;
	};
	tags?: string[];
	createdAt: string;
	updatedAt: string;
};

export async function getEntryData(id: string) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (!user || userError) {
			return { error: "No authenticated user found" };
		}

		// get user entry
		const { data, error } = await supabase
			.from('entries')
			.select(`*, category ( name, color )`)
			.eq(`id`, id)
			.eq("user_id", user.id)
			.single();

		if (error) {
			console.error("database error:", error);
			if (error.code === "PGRST116") {
				return { error: "Entry not found" };
			}
			return { error: "Failed to fetch entry" };
		}

		return { data: data as JournalEntry };
	} catch (error: any) {
		console.error(error.message);
		return { error: `failed to fetch entry` };
	}
}

export async function updateEntry(
	id: string,
	content: string,
	mood: string,
	categoryId?: string,
) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (!user || userError) {
			return { error: `user not authenticated yet` };
		}

		const { error } = await supabase
			.from('entries')
			.update({
				content,
				mood,
				category_id: categoryId,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.eq("user_id", user.id);

		if (error) {
			console.error(`database error`, error);
			return { error: "failed to update entry" };
		}

		return { success: true };
	} catch (error: any) {
		console.error(error.message);
		return { error: "Failed to update entry" };
	}
}

export async function deleteEntry(id: string) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (!user || userError) {
			console.error(`the user has not authenticated yet`, userError);
			return { error: `user not authenticated yet` };
		}

		console.log("Action: User authenticated:", user.id);

		const { error } = await supabase
			.from('entries')
			.delete()
			.eq("id", id)
			.eq("user_id", user.id);

		if (error) {
			console.error("database error:", error);
			return { error: "failed to delete entry" };
		}

		console.log("Action: Entry deleted successfully");
		return { success: true };
	} catch (error: any) {
        console.error(error.message)
        return {error: `failed to delete entry`}
    }
}
