"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Sparkles, Type, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";

// Valid characters mapping
const VALID_CHARS = /^[a-zA-Z0-9 ]*$/;

// Time to wait for images to fully render before capturing (in ms)
const IMAGE_RENDER_DELAY_MS = 100;

// Get image path for a character
function getCharImagePath(char: string): string {
  if (char === " ") {
    return "/letters/space.svg";
  }
  return `/letters/${char}.svg`;
}

export default function WordGenerator() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow alphanumeric characters and spaces
      if (VALID_CHARS.test(value)) {
        setInputText(value);
        setError(null); // Clear any previous error when typing
      }
    },
    []
  );

  const handleClear = useCallback(() => {
    setInputText("");
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!previewRef.current || inputText.trim().length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Wait for images to fully render before capturing
      await new Promise((resolve) => setTimeout(resolve, IMAGE_RENDER_DELAY_MS));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `kween-yasmin-${inputText
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [inputText]);

  const characters = inputText.split("");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-sm">
            Kween Yasmin
          </h1>
          <Sparkles className="w-8 h-8 text-[#ffb6c1] animate-pulse" />
        </div>
        <h2 className="text-xl md:text-2xl text-white/90 font-medium">
          Generator
        </h2>
        <p className="mt-4 text-white/80 max-w-lg mx-auto">
          Type your message using letters (a-z, A-Z) and numbers (0-9), then
          generate your beautiful image!
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#e5e5e5] mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-[#87ceeb]" />
          <label
            htmlFor="word-input"
            className="text-lg font-semibold text-[#3d3d3d]"
          >
            Enter Your Text
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              id="word-input"
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="h-12 text-lg bg-white border-2 border-[#e5e5e5] focus:border-[#87ceeb] transition-colors rounded-xl"
              maxLength={50}
              autoComplete="off"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#737373]">
              {inputText.length}/50
            </span>
          </div>

          <Button
            onClick={handleClear}
            variant="outline"
            className="h-12 px-4 border-2 border-[#ffb6c1] text-[#ffb6c1] hover:bg-[#ffb6c1] hover:text-white transition-all rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <p className="mt-3 text-sm text-[#737373]">
          Allowed: Letters (a-z, A-Z), Numbers (0-9), and Spaces
        </p>
      </div>

      {/* Preview Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#e5e5e5] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#3d3d3d]">Preview</h3>
          {inputText.length > 0 && (
            <span className="text-sm text-[#737373] bg-[#f5f5f5] px-3 py-1 rounded-full">
              {characters.filter((c) => c !== " ").length} characters
            </span>
          )}
        </div>

        <div className="min-h-[120px] flex items-center justify-center bg-[#f5f5f5] rounded-xl p-4 overflow-x-auto">
          {inputText.length === 0 ? (
            <p className="text-[#737373] italic text-center">
              Your preview will appear here...
            </p>
          ) : (
            <div
              ref={previewRef}
              className="flex flex-wrap items-center justify-center gap-1 p-2"
              style={{ backgroundColor: "transparent" }}
            >
              {characters.map((char, index) => (
                <div
                  key={`${char}-${index}`}
                  className="relative transition-transform hover:scale-110"
                  style={{
                    width: char === " " ? "25px" : "50px",
                    height: "50px",
                  }}
                >
                  {char !== " " ? (
                    <Image
                      src={getCharImagePath(char)}
                      alt={char}
                      width={50}
                      height={50}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={inputText.trim().length === 0 || isGenerating}
          className="h-14 px-8 text-lg font-semibold bg-[#87ceeb] hover:bg-[#6bb8da] text-white shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Generate & Download PNG
            </>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-[#87ceeb]" />
            <span className="text-sm text-[#737373]">Light Blue Theme</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-[#ffb6c1]" />
            <span className="text-sm text-[#737373]">Light Pink Theme</span>
          </div>
        </div>
      </div>
    </div>
  );
}
