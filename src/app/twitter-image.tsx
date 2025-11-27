import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Kween Sans Generator - Create Custom Text Images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getLetterAsBase64(letter: string): Promise<string | null> {
  try {
    const imagePath = join(process.cwd(), "public", "letters", `${letter}.png`);
    const imageBuffer = await readFile(imagePath);
    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  // Load letters to spell "KWEEN SANS"
  const word1 = ["K", "W", "E", "E", "N"];
  const word2 = ["S", "A", "N", "S"];
  const [word1Images, word2Images] = await Promise.all([
    Promise.all(word1.map(getLetterAsBase64)),
    Promise.all(word2.map(getLetterAsBase64)),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 25%, #7c3aed 75%, #8b5cf6 100%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            fontSize: "48px",
            opacity: 0.3,
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            fontSize: "40px",
            opacity: 0.3,
          }}
        >
          💖
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            fontSize: "36px",
            opacity: 0.3,
          }}
        >
          💅
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            right: "100px",
            fontSize: "44px",
            opacity: 0.3,
          }}
        >
          ✨
        </div>

        {/* Letter Preview - KWEEN SANS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "32px",
            background: "rgba(255, 255, 255, 0.15)",
            padding: "20px 40px",
            borderRadius: "20px",
          }}
        >
          {/* KWEEN */}
          <div style={{ display: "flex", gap: "2px" }}>
            {word1Images.map(
              (src, i) =>
                src && (
                  <img
                    key={`w1-${i}`}
                    src={src}
                    width={60}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                )
            )}
          </div>
          {/* SANS */}
          <div style={{ display: "flex", gap: "2px" }}>
            {word2Images.map(
              (src, i) =>
                src && (
                  <img
                    key={`w2-${i}`}
                    src={src}
                    width={60}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                )
            )}
          </div>
        </div>

        {/* Crown + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "56px" }}>👑</span>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Kween Sans
          </h1>
          <span style={{ fontSize: "56px" }}>👑</span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#fce7f3",
            margin: 0,
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Generator
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "22px",
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Create custom text images for Instagram, Facebook, X, and LinkedIn
        </p>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            padding: "8px 20px",
            borderRadius: "20px",
          }}
        >
          <span style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.8)" }}>
            A meme project by
          </span>
          <span style={{ fontSize: "16px", color: "white", fontWeight: "700" }}>
            OSSPH
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
