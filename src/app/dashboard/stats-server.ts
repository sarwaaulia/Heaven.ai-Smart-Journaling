"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStatsFromMood() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!user || userError) return { error: "Not authenticated" };

        const { data, error } = await supabase
            .from("mood")
            .select("intensity")
            .eq("user_id", user.id);

        if (error) throw error;

        const allMoods = data || [];
        
        if (allMoods.length === 0) {
            return { avgIntensity: 0, totalOfMoods: 0 };
        }

        const sum = allMoods.reduce((acc, curr) => acc + curr.intensity, 0);
        const avg = sum / allMoods.length;

        return {
            avgIntensity: Math.round(avg * 10) / 10,
            totalOfMoods: allMoods.length,
        };
    } catch (error) {
        console.error("Stats error:", error);
        return { error: "Failed to fetch stats", avgIntensity: 0, totalOfMoods: 0 };
    }
}