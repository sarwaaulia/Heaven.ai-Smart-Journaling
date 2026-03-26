"use client";

import { Heart, NotebookText, ChartLine } from "lucide-react";
import Link from "next/link";
import Topbar from "@/components/layouts/Topbar";

export default function Home() {
  
  return (
    <div className="min-h-screen bg-white dark:bg-bg-main transition-colors duration-300">

      {/* topbar */}
      <Topbar />

      <main className="relative z-10 container mx-auto px-6 py-20">

        {/* hero */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
            ✨ AI-Powered Journaling
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-brand-dark dark:text-text-primary">
            Write. Track. Grow.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-text-secondary max-w-2xl mx-auto mb-12">
            Helps you understand yourself better through journaling,
            mood tracking, and AI-powered insights.
          </p>

          <Link
            href="/auth/login"
            className="
              inline-flex items-center px-8 py-4 rounded-full 
              bg-brand-purple hover:bg-brand-purple/90 text-white text-lg font-semibold
              shadow-lg shadow-brand-purple/30 transition hover:-translate-y-1 cursor-pointer
            "
          >
            Start Journaling Free
          </Link>
        </section>

        {/* features */}
        <section className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">

          {/* ai insight */}
          <FeatureCard
            icon={<NotebookText />}
            title="AI Insights"
            desc="Gain meaningful insights from your journal using AI."
            color="purple"
          />

          {/* mood tracking */}
          <FeatureCard
            icon={<Heart />}
            title="Mood Tracking"
            desc="Understand what affects your emotions over time."
            color="blue"
          />

          {/* analytics */}
          <FeatureCard
            icon={<ChartLine />}
            title="Growth Analytics"
            desc="Visualize your progress with clean and simple analytics."
            color="green"
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: any) {
  const colorMap: any = {
    purple: "bg-brand-purple/10 text-brand-purple",
    blue: "bg-accent-blue/10 text-accent-blue",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };

  return (
    <div
      className="
        p-8 rounded-2xl border bg-white dark:bg-surface border-slate-200 dark:border-border-muted transition hover:shadow-xl hover:-translate-y-1
      "
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3 text-brand-dark dark:text-text-primary">
        {title}
      </h3>

      <p className="text-slate-600 dark:text-text-secondary">
        {desc}
      </p>
    </div>
  );
}
