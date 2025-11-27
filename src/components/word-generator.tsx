"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Type, Trash2, AlertCircle, Palette, Move, Maximize2 } from "lucide-react";
import Image from "next/image";

// Valid characters mapping (letters and numbers, will be converted to uppercase)
const VALID_CHARS = /^[a-zA-Z0-9 ]*$/;

// Time to wait for images to fully render before capturing (in ms)
const IMAGE_RENDER_DELAY_MS = 100;

// Background color presets
const BACKGROUND_PRESETS = [
  { name: "Transparent", value: "transparent" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Pink", value: "#e91e8b" },
] as const;

// Padding options in pixels
const PADDING_OPTIONS = [0, 8, 16, 24, 32] as const;

// Size presets for social media
const SIZE_PRESETS = [
  { name: "Auto", width: 0, height: 0 },
  { name: "IG Post", width: 1080, height: 1080 },
  { name: "IG Story", width: 1080, height: 1920 },
  { name: "FB Post", width: 1200, height: 630 },
  { name: "X Post", width: 1200, height: 675 },
  { name: "LinkedIn", width: 1200, height: 627 },
] as const;

// Get image path for a character (all uppercase letters and numbers use PNG)
function getCharImagePath(char: string): string {
  return `/letters/${char}.png`;
}

export default function WordGenerator() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [padding, setPadding] = useState(8);
  const [selectedSize, setSelectedSize] = useState(SIZE_PRESETS[0]);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow alphanumeric characters and spaces, convert to uppercase
      if (VALID_CHARS.test(value)) {
        setInputText(value.toUpperCase());
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

      const options: Parameters<typeof toPng>[1] = {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
        skipFonts: true, // Skip font embedding to avoid cross-origin CSS errors
      };

      // Apply size preset if not auto
      if (selectedSize.width > 0 && selectedSize.height > 0) {
        options.width = selectedSize.width;
        options.height = selectedSize.height;
        options.pixelRatio = 1; // Use exact dimensions for social media
      }

      const dataUrl = await toPng(previewRef.current, options);

      // Create download link
      const link = document.createElement("a");
      link.download = `kween-sans-${inputText
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
  }, [inputText, backgroundColor, selectedSize]);

  const characters = inputText.split("");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-3xl md:text-5xl" role="img" aria-label="queen">👑</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Kween Sans
          </h1>
          <span className="text-3xl md:text-5xl" role="img" aria-label="queen">👑</span>
        </div>
        <h2 className="text-xl md:text-2xl text-white/90 font-medium">
          Generator
        </h2>
        <p className="mt-4 text-white/80 max-w-lg mx-auto">
          Type your message using letters and numbers, then generate your beautiful image!
        </p>
      </div>

      {/* Main Content - Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section - Always first */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#e5e5e5] order-1 lg:row-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-[#e91e8b]" />
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
                className="h-12 text-lg bg-white border-2 border-[#e5e5e5] focus:border-[#e91e8b] transition-colors rounded-xl"
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
              className="h-12 px-4 border-2 border-[#e91e8b] text-[#e91e8b] hover:bg-[#e91e8b] hover:text-white transition-all rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <p className="mt-3 text-sm text-[#737373]">
            Letters, numbers, and spaces (auto-converted to uppercase)
          </p>
        </div>

        {/* Preview Section - Second on mobile, right column on desktop */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#e5e5e5] order-2 lg:row-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#3d3d3d]">Preview</h3>
            <div className="flex items-center gap-2">
              {selectedSize.width > 0 && (
                <span className="text-sm text-[#e91e8b] bg-[#e91e8b]/10 px-3 py-1 rounded-full">
                  {selectedSize.width}x{selectedSize.height}
                </span>
              )}
              {inputText.length > 0 && (
                <span className="text-sm text-[#737373] bg-[#f5f5f5] px-3 py-1 rounded-full">
                  {characters.filter((c) => c !== " ").length} characters
                </span>
              )}
            </div>
          </div>

          <div className="min-h-[200px] lg:min-h-[300px] flex items-center justify-center bg-[#f5f5f5] rounded-xl p-4 overflow-auto">
            {inputText.length === 0 ? (
              <p className="text-[#737373] italic text-center">
                Your preview will appear here...
              </p>
            ) : (
              <div
                ref={previewRef}
                className="flex flex-wrap items-center justify-center gap-1 rounded-lg"
                style={{
                  backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
                  padding: `${padding}px`,
                  ...(selectedSize.width > 0 && {
                    minWidth: `${selectedSize.width / 4}px`,
                    minHeight: `${selectedSize.height / 4}px`,
                    aspectRatio: `${selectedSize.width} / ${selectedSize.height}`,
                  }),
                }}
              >
                {characters.map((char, index) => (
                  <div
                    key={`${char}-${index}`}
                    className="relative"
                    style={{
                      width: char === " " ? "25px" : "auto",
                      height: "50px",
                    }}
                  >
                    {char !== " " ? (
                      <Image
                        src={getCharImagePath(char)}
                        alt={char}
                        width={0}
                        height={50}
                        sizes="100vw"
                        className="h-[50px] w-auto"
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

          {/* Generate Button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={handleGenerate}
              disabled={inputText.trim().length === 0 || isGenerating}
              className="h-14 px-8 text-lg font-semibold bg-[#e91e8b] hover:bg-[#c41574] text-white transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Options Section - Third on mobile, below input on desktop */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#e5e5e5] order-3 lg:row-span-1">
          <div className="space-y-5">
            {/* Background Color */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-[#e91e8b]" />
                <label className="text-base font-semibold text-[#3d3d3d]">
                  Background
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setBackgroundColor(preset.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      backgroundColor === preset.value
                        ? "ring-2 ring-[#e91e8b] ring-offset-2"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: preset.value === "transparent" ? "#f5f5f5" : preset.value,
                      color: preset.value === "#000000" || preset.value === "#7c3aed" || preset.value === "#e91e8b" ? "#fff" : "#3d3d3d",
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Move className="w-5 h-5 text-[#e91e8b]" />
                <label className="text-base font-semibold text-[#3d3d3d]">
                  Padding
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {PADDING_OPTIONS.map((value) => (
                  <button
                    key={value}
                    onClick={() => setPadding(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      padding === value
                        ? "bg-[#e91e8b] text-white"
                        : "bg-[#f5f5f5] text-[#3d3d3d] hover:bg-gray-200"
                    }`}
                  >
                    {value}px
                  </button>
                ))}
              </div>
            </div>

            {/* Size Preset */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Maximize2 className="w-5 h-5 text-[#e91e8b]" />
                <label className="text-base font-semibold text-[#3d3d3d]">
                  Output Size
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedSize(preset)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedSize.name === preset.name
                        ? "bg-[#e91e8b] text-white"
                        : "bg-[#f5f5f5] text-[#3d3d3d] hover:bg-gray-200"
                    }`}
                  >
                    {preset.name}
                    {preset.width > 0 && (
                      <span className="ml-1 text-xs opacity-75">
                        {preset.width}x{preset.height}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
