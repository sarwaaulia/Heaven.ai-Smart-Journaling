"use client";

import { X, NotebookPen, LayoutDashboard, Sparkles, Cloud } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-brand-purple/10 text-brand-purple font-bold shadow-sm shadow-brand-purple/5"
        : "text-text-secondary hover:bg-surface hover:text-text-primary"
    }`;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-screen z-[70] bg-bg-main border-r border-border-muted
        transform transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
        flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-end p-6">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface rounded-full text-text-secondary transition-colors md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 mt-4">
          <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
            <LayoutDashboard size={18} className={pathname === "/dashboard" ? "text-brand-purple" : ""} />
            Dashboard
          </Link>
          <Link href="/entries/new" className={getLinkStyle("/entries")}>
            <NotebookPen size={18} className={pathname === "/entries" ? "text-brand-purple" : ""} />
            Entries
          </Link>
          <Link href="/insights" className={getLinkStyle("/insights")}>
            <Sparkles size={18} className={pathname === "/insights" ? "text-brand-purple" : ""} />
            AI Insights
          </Link>
        </nav>
      </aside>
    </>
  );
}