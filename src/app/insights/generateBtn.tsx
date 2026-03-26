"use client";

import { useState } from "react";
import { generateWeeklyInsight } from "./server";
import { Loader2 } from "lucide-react";

export function GenerateBtn() {
	const [isPending, setIsPending] = useState(false);

	const handleGenerate = async () => {
		setIsPending(true);

		try {
			const result = await generateWeeklyInsight();

			if (result?.error) {
				alert(result.error);
			} else {
				console.log("generated successfully!");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Internal server error");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<button
			onClick={handleGenerate}
			disabled={isPending}
			className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all"
		>
			{isPending ? (
				<div className="flex items-center gap-2">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span>Processing...</span>
				</div>
			) : (
				"Generate Insight"
			)}
		</button>
	);
}
