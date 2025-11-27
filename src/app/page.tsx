import WordGenerator from "@/components/word-generator";

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
          <span role="img" aria-label="queen">👑</span>
          <span>Made with love for Kween Yasmin</span>
          <span role="img" aria-label="queen">👑</span>
        </div>
      </footer>
    </div>
  );
}
