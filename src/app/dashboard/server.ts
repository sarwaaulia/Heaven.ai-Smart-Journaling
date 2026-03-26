"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/server";

export async function DashboardUser() {
	return await getCurrentUser()
}

export async function getEntries() {
	try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return []; // Kembalikan array kosong jika tidak terautentikasi

        const { data, error } = await supabase
            .from("entries")
            .select(`
                *,
                category (
                    name,
                    color
                )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Database error:", error);
            return [];
        }

        return data || [];
	} catch (error) {
        console.error("internal server error", error)
        return[]
    }
}
