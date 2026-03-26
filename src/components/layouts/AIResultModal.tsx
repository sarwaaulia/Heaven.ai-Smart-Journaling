"use client";

type ModalResult =
	| {
			tidiedText?: string;
			summary?: string;
			mood?: { emotion: string; label: string };
			themes?: string[];
	  }
	| string
	| null;

type Props = {
	open: boolean;
	loading: boolean;
	error?: string | null;
	result: ModalResult;
	onClose: () => void;
	onApply: (data: any) => void;
};

export default function AiResultModal({
	open,
	loading,
	error,
	result,
	onClose,
	onApply,
}: Props) {
	if (!open) return null;

	const displayResult =
		typeof result === "string" ? result : result?.tidiedText || result?.summary;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
				<div className="p-6 border-b border-gray-100 dark:border-zinc-800">
					<h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
						<span className="text-blue-500">✨</span> AI Analysis Result
					</h2>
				</div>

				<div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
					{loading ? (
						<div className="flex flex-col items-center py-10">
							<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
							<p className="text-gray-500">Analyzing your writing...</p>
						</div>
					) : (
						<div className="space-y-6">
							{/* mood detection */}
							{typeof result !== "string" && result?.mood && (
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">Mood:</span>
									<span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
										{result.mood.emotion} {result.mood.label}
									</span>
								</div>
							)}

							{/* tags detection */}
							{typeof result !== "string" && result?.themes && (
								<div className="flex flex-wrap gap-2">
									{result.themes.map((t) => (
										<span
											key={t}
											className="text-[10px] bg-zinc-100 dark:bg-zinc-800 p-1 rounded"
										>
											#{t}
										</span>
									))}
								</div>
							)}
							<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
								<label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
									Tidied Text / Suggestion
								</label>
								<p className="text-gray-700 dark:text-zinc-300 leading-relaxed mt-2 whitespace-pre-wrap">
									{displayResult || "No result found."}
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="p-4 bg-gray-50 dark:bg-zinc-800/50 flex gap-3 justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={() => onApply(result)}
						disabled={loading || !result}
						className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
					>
						Apply Analysis
					</button>
				</div>
			</div>
		</div>
	);
}
