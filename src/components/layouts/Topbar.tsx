"use client";

import { Moon, Sun, ChevronRight, Menu, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface TopbarProps {
	isLandingPage?: boolean;
	onToggleSidebar?: () => void;
	isSideBarOpen?: boolean;
	onLogout?: () => Promise<void>;
	user?: {
		email?: string;
	} | null;
}

export default function Topbar({
	isLandingPage = true,
	onToggleSidebar,
	isSideBarOpen,
	onLogout,
	user,
}: TopbarProps) {
	const { isDarkMode, toggleTheme } = useTheme();

	return (
		<nav className="h-20 px-6 md:px-8 flex items-center justify-between bg-white/70 dark:bg-bg-main/70 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-100 dark:border-border-muted transition-colors">
			<div className="flex items-center gap-4">
				{/* only show sidebar when exclude on landing page */}
				{!isLandingPage && (
					<button
						onClick={onToggleSidebar}
						className="p-2 rounded-xl border border-slate-200 dark:border-border-muted text-text-secondary hover:bg-slate-50 dark:hover:bg-surface transition-all bg-white dark:bg-bg-main shadow-sm active:scale-95"
					>
						{isSideBarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
					</button>
				)}

				<h1 className="text-xl font-bold tracking-tight text-brand-dark dark:text-text-primary">
					heaven<span className="text-brand-purple">.ai</span>
				</h1>
			</div>

			<div className="flex items-center gap-3 md:gap-5">
				{/* button user info for protected route */}
				{!isLandingPage && user && (
					<div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-border-muted">
						<div className="hidden md:block text-right">
							<p className="text-sm font-bold text-text-primary leading-none">
								{user.email}
							</p>
						</div>
						<button
							onClick={onLogout}
							title="Logout"
							className="ml-1 p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors active:scale-95"
						>
							<LogOut size={18} />
						</button>
					</div>
				)}

				{/* toggle theme */}
				<button
					onClick={toggleTheme}
					className="p-2.5 rounded-xl border border-slate-200 dark:border-border-muted text-slate-600 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-surface transition-all bg-white dark:bg-bg-main shadow-sm active:scale-95"
				>
					{isDarkMode ? (
						<Sun size={20} className="text-amber-500 fill-amber-500/10" />
					) : (
						<Moon
							size={20}
							className="text-brand-purple fill-brand-purple/10"
						/>
					)}
				</button>
			</div>
		</nav>
	);
}
