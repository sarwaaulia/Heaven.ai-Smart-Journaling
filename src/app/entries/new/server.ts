"use server";

import { createClient } from "@/lib/supabase/server";

export async function createNewEntry(
    content: string,
    mood: { emoticon: string, label: string },
    tags: string[],
    moodIntensity: number,
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "User not authenticated" };

        let categoryId = null;

        if (tags && tags.length > 0) {
            const primaryTag = tags[0]; 

            const { data: existingCat } = await supabase
                .from("category")
                .select("id")
                .eq("name", primaryTag)
                .eq("user_id", user.id)
                .single();

            if (existingCat) {
                categoryId = existingCat.id;
            } else {
                const { data: newCat } = await supabase
                    .from("category")
                    .insert([{ name: primaryTag, user_id: user.id, color: "#6366f1" }])
                    .select()
                    .single();
                if (newCat) categoryId = newCat.id;
            }
        }

        const { data: entryData, error: entryError } = await supabase
            .from("entries")
            .insert([{ 
                user_id: user.id,
                content,
                mood: mood.label,
                tags, 
                category_id: categoryId 
            }])
            .select().single();

        if (entryError) throw entryError;

        await supabase.from("mood").insert([{
            mood: mood.label,
            intensity: moodIntensity,
            user_id: user.id,
            entry_id: entryData.id,
        }]);

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
