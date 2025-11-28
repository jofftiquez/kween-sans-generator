"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Type, Trash2, AlertCircle, Palette, Move, MoveHorizontal, Scaling, Share2 } from "lucide-react";
import packageJson from "../../package.json";

// Valid characters mapping (letters and numbers, will be converted to uppercase)
const VALID_CHARS = /^[a-zA-Z0-9 ]*$/;

// All valid characters for preloading
const ALL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

// Convert image URL to base64 data URL
async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Preload all character images as base64
async function preloadAllImages(): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const promises = ALL_CHARS.map(async (char) => {
    const url = `/letters/${char}.png`;
    const base64 = await imageToBase64(url);
    cache.set(char, base64);
  });
  await Promise.all(promises);
  return cache;
}

// Wait for all images in an element to be fully loaded
async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  const promises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve anyway to not block
    });
  });
  await Promise.all(promises);
  // Small delay to ensure rendering is complete
  await new Promise((resolve) => setTimeout(resolve, 100));
}

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

// Letter size (height in pixels)
const MIN_LETTER_SIZE = 30;
const MAX_LETTER_SIZE = 150;
const DEFAULT_LETTER_SIZE = 50;

// Container width range
const MIN_CONTAINER_WIDTH = 200;
const MAX_CONTAINER_WIDTH = 1200;
const DEFAULT_CONTAINER_WIDTH = 500;

// Get image path for a character (all uppercase letters and numbers use PNG)
function getCharImagePath(char: string): string {
  return `/letters/${char}.png`;
}

export default function WordGenerator() {
  const [inputText, setInputText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [customColor, setCustomColor] = useState("#e91e8b");
  const [padding, setPadding] = useState(8);
  const [letterSize, setLetterSize] = useState(DEFAULT_LETTER_SIZE);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);
  const [canShare, setCanShare] = useState(false);
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  const previewRef = useRef<HTMLDivElement>(null);

  // Preload all images as base64 and check share API on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanShare(true);
    }
    // Preload images for better cross-browser compatibility
    preloadAllImages().then(setImageCache).catch(console.error);
  }, []);

  // Get image source - use cached base64 if available, fallback to path
  const getImageSrc = useCallback((char: string) => {
    return imageCache.get(char) || getCharImagePath(char);
  }, [imageCache]);

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

  // Helper to generate image data
  const generateImage = useCallback(async () => {
    if (!previewRef.current) throw new Error("Preview not available");

    await waitForImagesToLoad(previewRef.current);

    const options: Parameters<typeof toPng>[1] = {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
      skipFonts: true,
    };

    const dataUrl = await toPng(previewRef.current, options);
    const fileName = `kween-sans-${Date.now()}.png`;

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: "image/png" });

    return { dataUrl, fileName, file };
  }, [backgroundColor]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || inputText.trim().length === 0) return;

    setIsDownloading(true);
    setError(null);

    try {
      const { dataUrl, fileName } = await generateImage();
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error downloading image:", err);
      setError("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [inputText, generateImage]);

  const handleShare = useCallback(async () => {
    if (!previewRef.current || inputText.trim().length === 0) return;

    setIsSharing(true);
    setError(null);

    try {
      const { file } = await generateImage();

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Kween Sans Image",
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // User cancelled
      }
      console.error("Error sharing image:", err);
      setError("Failed to share image. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }, [inputText, generateImage]);

  const characters = inputText.split("");
  const words = inputText.split(" ").filter(word => word.length > 0);

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
        <p className="mt-3 text-sm text-white/60">
          Resources:{" "}
          <a
            href="https://public.canva.site/allpurposekween"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 underline hover:text-white transition-colors"
          >
            All-Purpose Kween Canva Assets
          </a>
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
            {inputText.length > 0 && (
              <span className="text-sm text-[#737373] bg-[#f5f5f5] px-3 py-1 rounded-full">
                {characters.filter((c) => c !== " ").length} characters
              </span>
            )}
          </div>

          <div className="min-h-[200px] lg:min-h-[300px] flex items-center justify-center bg-[#f5f5f5] rounded-xl p-4 overflow-auto">
            {inputText.length === 0 ? (
              <p className="text-[#737373] italic text-center">
                Your preview will appear here...
              </p>
            ) : (
              <div
                ref={previewRef}
                className="inline-flex flex-wrap items-center justify-center content-center rounded-lg"
                style={{
                  backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
                  padding: `${padding}px`,
                  minWidth: `${containerWidth}px`,
                  maxWidth: "100%",
                  gap: `${Math.max(4, letterSize * 0.08)}px ${Math.max(8, letterSize * 0.15)}px`,
                }}
              >
                {words.map((word, wordIndex) => (
                  <div
                    key={`word-${wordIndex}`}
                    className="flex items-center"
                  >
                    {word.split("").map((char, charIndex) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={`${char}-${wordIndex}-${charIndex}`}
                        src={getImageSrc(char)}
                        alt={char}
                        style={{ height: `${letterSize}px`, width: "auto" }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={handleDownload}
                disabled={inputText.trim().length === 0 || isDownloading || isSharing}
                className="h-14 px-8 text-lg font-semibold bg-[#e91e8b] hover:bg-[#c41574] text-white transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG
                  </>
                )}
              </Button>

              {canShare && (
                <Button
                  onClick={handleShare}
                  disabled={inputText.trim().length === 0 || isDownloading || isSharing}
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold border-2 border-[#e91e8b] text-[#e91e8b] hover:bg-[#e91e8b] hover:text-white transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {isSharing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#e91e8b] border-t-transparent rounded-full animate-spin mr-2" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </>
                  )}
                </Button>
              )}
            </div>

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
              <div className="flex flex-wrap gap-2 items-center">
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
                {/* Custom Color Picker */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBackgroundColor(customColor)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      backgroundColor === customColor && !BACKGROUND_PRESETS.some(p => p.value === backgroundColor)
                        ? "ring-2 ring-[#e91e8b] ring-offset-2"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: customColor,
                      color: "#fff",
                    }}
                  >
                    Custom
                  </button>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setBackgroundColor(e.target.value);
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border-2 border-[#e5e5e5] hover:border-[#e91e8b] transition-colors"
                    title="Pick a custom color"
                  />
                </div>
              </div>
            </div>

            {/* Letter Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scaling className="w-5 h-5 text-[#e91e8b]" />
                  <label className="text-base font-semibold text-[#3d3d3d]">
                    Letter Size
                  </label>
                </div>
                <span className="text-sm font-medium text-[#e91e8b] bg-[#fce7f3] px-2 py-1 rounded">
                  {letterSize}px
                </span>
              </div>
              <input
                type="range"
                min={MIN_LETTER_SIZE}
                max={MAX_LETTER_SIZE}
                step={5}
                value={letterSize}
                onChange={(e) => setLetterSize(Number(e.target.value))}
                className="w-full h-2 bg-[#f5f5f5] rounded-lg appearance-none cursor-pointer accent-[#e91e8b]"
              />
              <div className="flex justify-between text-xs text-[#737373] mt-1">
                <span>{MIN_LETTER_SIZE}px</span>
                <span>{MAX_LETTER_SIZE}px</span>
              </div>
            </div>

            {/* Output Width */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="w-5 h-5 text-[#e91e8b]" />
                  <label className="text-base font-semibold text-[#3d3d3d]">
                    Output Width
                  </label>
                </div>
                <span className="text-sm font-medium text-[#e91e8b] bg-[#fce7f3] px-2 py-1 rounded">
                  {containerWidth}px
                </span>
              </div>
              <input
                type="range"
                min={MIN_CONTAINER_WIDTH}
                max={MAX_CONTAINER_WIDTH}
                step={50}
                value={containerWidth}
                onChange={(e) => setContainerWidth(Number(e.target.value))}
                className="w-full h-2 bg-[#f5f5f5] rounded-lg appearance-none cursor-pointer accent-[#e91e8b]"
              />
              <div className="flex justify-between text-xs text-[#737373] mt-1">
                <span>{MIN_CONTAINER_WIDTH}px</span>
                <span>{MAX_CONTAINER_WIDTH}px</span>
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

          </div>
        </div>
      </div>

      {/* Version Footer */}
      <div className="mt-8 text-center">
        <span className="text-xs text-white/40">v{packageJson.version}</span>
      </div>
    </div>
  );
}
