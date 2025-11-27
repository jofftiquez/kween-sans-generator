import WordGenerator from "@/components/word-generator";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <WordGenerator />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[#e5e5e5] bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-[#737373]">
          <Sparkles className="w-4 h-4 text-[#ffb6c1]" />
          <span>Made with love for Kween Yasmin</span>
          <Sparkles className="w-4 h-4 text-[#87ceeb]" />
        </div>
      </footer>
    </div>
  );
}
