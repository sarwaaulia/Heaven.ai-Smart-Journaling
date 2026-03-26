"use client";

import { useState, useEffect } from "react";
import { EntryProvider, useEntry } from "@/app/context/EntryContex";
import EntryForm from "@/components/layouts/EntryForm";
import AiResultModal from "@/components/layouts/AIResultModal";
import { useAiEnhancement } from "@/app/hooks/useAIEnhancement";
import EntryList from "@/components/layouts/EntryList";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import Topbar from "@/components/layouts/Topbar";
import Sidebar from "@/components/layouts/Sidebar";

function PageContent() {
  const { setContent, showAIResult, setShowAIResult, AIResult } = useEntry();
  const { isLoading } = useAiEnhancement();
  const router = useRouter();
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary transition-colors duration-300">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <Topbar 
          isLandingPage={false}
          isSideBarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          user={user}
        />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
          <div className="max-w-2xl mx-auto">
            
            <header className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                New Journal <span className="text-brand-purple text-accent-blue">Entry</span>
              </h1>
              <p className="text-text-secondary">
                Capture your thoughts and let AI help you reflect.
              </p>
            </header>

            <section className="bg-surface rounded-3xl p-1 border border-border-muted shadow-sm overflow-hidden">
               <EntryForm />
            </section>
            
            <div className="mt-20 pb-20 border-t border-border-muted pt-10">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight">Full History</h2>
                  <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                    Your journey so far
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <EntryList /> 
              </div>
            </div>
          </div>
        </main>
      </div>

      <AiResultModal
        open={showAIResult}
        loading={isLoading}
        result={AIResult}
        onClose={() => setShowAIResult(false)}
        onApply={(text) => {
          setContent(text);
          setShowAIResult(false);
        }}
      />
    </div>
  );
}

export default function NewEntryPage() {
  return (
    <EntryProvider>
      <PageContent />
    </EntryProvider>
  );
}