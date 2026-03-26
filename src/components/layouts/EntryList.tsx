"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, Edit3, Calendar, Tag } from "lucide-react";
import { deleteEntry } from "@/app/entries/read/actions";

const moodStyles: Record<string, string> = {
	"Very Happy": "bg-green-500/10 text-green-500 border-green-500/20",
	Happy: "bg-green-400/10 text-green-400 border-green-400/20",
	Neutral: "bg-amber-500/10 text-amber-500 border-amber-500/20",
	Sad: "bg-blue-500/10 text-blue-500 border-blue-500/20",
	Angry: "bg-red-500/10 text-red-500 border-red-500/20",
	Excited: "bg-pink-500/10 text-pink-500 border-pink-500/20",
	Anxious: "bg-purple-500/10 text-purple-500 border-purple-500/20",
	Tired: "bg-slate-500/10 text-text-secondary border-border-muted",
	Love: "bg-rose-500/10 text-rose-500 border-rose-500/20",
	Grateful: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
};

export default function EntryList() {
	const [entries, setEntries] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

	const fetchEntries = useCallback(
		async (uid: string) => {
			const { data } = await supabase
				.from("entries")
				.select("*")
				.eq("user_id", uid)
				.order("created_at", { ascending: false })
				.limit(10);

			if (data) setEntries(data);
			setLoading(false);
		},
		[supabase],
	);

	useEffect(() => {
		const setupRealtime = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				fetchEntries(user.id);
				const channel = supabase
					.channel(`realtime_entries_${user.id}`)
					.on(
						"postgres_changes",
						{
							event: "*",
							schema: "public",
							table: "entries",
						},
						(payload: any) => {
							const isOwner =
								payload.new?.user_id === user.id ||
								payload.old?.user_id === user.id;
							if (!isOwner) return;

							if (payload.eventType === "INSERT") {
								setEntries((prev) => [payload.new, ...prev]);
							} else if (payload.eventType === "DELETE") {
								setEntries((prev) =>
									prev.filter((e) => e.id !== payload.old.id),
								);
							}
						},
					)
					.subscribe();

				return channel;
			}
		};

		const channelPromise = setupRealtime();
		return () => {
			channelPromise.then((channel) => {
				if (channel) supabase.removeChannel(channel);
			});
		};
	}, [supabase, fetchEntries]);

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this entry?")) {
			const oldEntries = [...entries];
			setEntries((prev) => prev.filter((e) => e.id !== id));
			const result = await deleteEntry(id);
			if (result?.error) {
				alert("Delete failed");
				setEntries(oldEntries);
			}
		}
	};

	if (loading)
		return (
			<div className="flex justify-center p-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
			</div>
		);

	if (entries.length === 0)
		return (
			<div className="text-center py-12 border-2 border-dashed border-border-muted rounded-[2rem]">
				<p className="text-text-secondary">
					No entries found. Start journaling today!
				</p>
			</div>
		);

	return (
		<div className="grid gap-4">
			{entries.map((entry) => (
				<div
					key={entry.id}
					className="group relative p-6 bg-surface border border-border-muted rounded-[2rem] transition-all duration-300 hover:border-brand-purple/30 hover:shadow-xl hover:shadow-brand-purple/5"
				>
					<div className="flex justify-between items-start mb-4">
						<div
							className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-transform group-hover:scale-105 ${moodStyles[entry.mood] || "bg-bg-main text-text-secondary border-border-muted"}`}
						>
							<span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
							{entry.mood}
						</div>

						<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
							<button className="p-2.5 rounded-xl bg-bg-main border border-border-muted text-text-secondary hover:text-brand-purple hover:border-brand-purple/50 transition-all shadow-sm">
								<Edit3 size={16} />
							</button>
							<button
								onClick={() => handleDelete(entry.id)}
								className="p-2.5 rounded-xl bg-bg-main border border-border-muted text-text-secondary hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm"
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>

					<div className="relative">
						<p className="text-text-primary text-base leading-relaxed mb-6 whitespace-pre-wrap">
							{entry.content}
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-border-muted/50">
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5 text-text-secondary">
								<Calendar size={14} className="opacity-50" />
								<span className="text-xs font-medium">
									{new Date(entry.created_at).toLocaleDateString("id-ID", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</span>
							</div>
						</div>

						{entry.tags && entry.tags.length > 0 && (
							<div className="flex gap-2">
								{entry.tags.slice(0, 3).map((tag: string) => (
									<div
										key={tag}
										className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-main border border-border-muted text-[10px] font-bold text-text-secondary"
									>
										<Tag size={10} className="text-brand-purple opacity-60" />
										{tag}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
