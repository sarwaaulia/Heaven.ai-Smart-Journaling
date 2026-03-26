import { useEntry } from "../context/EntryContex";
import { useState } from "react";

export function useAiEnhancement() {
    const {
        content,
        setAIResult,
        setShowAIResult,
    } = useEntry();

    const [isLoading, setIsLoading] = useState(false);

    const tidyUp = async () => {
        if (!content || content.length < 5) {
            alert("Tulis dulu jurnalnya agak banyakan, baru dirapiin.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/ai/tidyUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            // Ambil body response dulu
            const data = await res.json();

            if (!res.ok) {
                // Cek pesan error dari Google yang dikirim balik oleh route API kita
                const errorMsg = data.error || data.details || "";
                
                if (res.status === 429 || errorMsg.includes("429") || errorMsg.includes("quota")) {
                    alert("⚠️ Jatah harian Gemini 2.5 lu abis (Limit 20/hari). Ganti API Key di .env terus restart npm run dev!");
                } else {
                    alert(`Waduh error: ${errorMsg}`);
                }
                return; // Stop di sini
            }

            setAIResult(data.tidiedText);
            setShowAIResult(true);
        } catch (error: any) {
            console.error("AI Error:", error);
            alert("Gagal konek ke server AI.");
        } finally {
            setIsLoading(false);
        }
    };

    return { tidyUp, isLoading };
}