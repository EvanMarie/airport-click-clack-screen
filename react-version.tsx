import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// --- Single Character Tile Component ---
const FlipCharacter: React.FC<{
  char: string;
  prevChar: string;
  flipDuration: number;
  delay: number;
  position: { x: number; y: number };
}> = React.memo(({ char, prevChar, flipDuration, delay, position }) => {
  const safeChar = char || " ";
  const safePrevChar = prevChar || " ";

  // Check if this tile is actually changing content
  const isChanging = safeChar !== safePrevChar;
  const isEmptyToEmpty = safeChar === " " && safePrevChar === " ";

  // Only apply complex animations to tiles that are changing content
  const shouldAnimate = isChanging && !isEmptyToEmpty;

  // For changing tiles: randomized timing and staggered delays
  const randomizedDuration = shouldAnimate
    ? flipDuration * (0.8 + Math.random() * 0.4) // ±20% variation
    : flipDuration;
  const randomizedDelay = shouldAnimate
    ? delay + Math.random() * 0.2 // Add up to 0.2s random delay
    : 0;

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171d29",
    color: "cyan",
    backfaceVisibility: "hidden",
    borderRadius: "0.7vh",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "4vh",
        height: "5vh",
        fontSize: "inherit",
        perspective: "300px",
      }}
    >
      {/* Static Bottom Half (New Character) */}
      <div
        className={`subtleTextShadow shadow-lg border-950-md`}
        style={{ ...cardStyle }}
      >
        {safeChar}
      </div>

      {/* Static Top Half (Old Character) */}
      <div style={{ ...cardStyle, alignItems: "center" }}>{safePrevChar}</div>

      <AnimatePresence>
        <motion.div
          key={safeChar}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -90 }}
          exit={{ rotateX: -90 }}
          transition={{
            duration: randomizedDuration / 2,
            ease: shouldAnimate ? "easeInOut" : "linear",
            delay: randomizedDelay,
          }}
          style={{
            ...cardStyle,
            alignItems: "center",
            transformOrigin: "bottom",
          }}
        >
          {safePrevChar}
        </motion.div>

        <motion.div
          key={safeChar + "b"}
          initial={{ rotateX: 90 }}
          animate={{ rotateX: 0 }}
          exit={{ rotateX: 0 }}
          transition={{
            duration: randomizedDuration / 2,
            ease: shouldAnimate ? "easeOut" : "linear",
            delay: randomizedDelay + randomizedDuration / 2,
          }}
          style={{
            ...cardStyle,
            alignItems: "center",
            transformOrigin: "top",
          }}
        >
          {safeChar}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

// --- Text Wrapping Utility ---
const wrapText = (text: string, maxWidth: number): string[] => {
  const lines: string[] = [];

  // Split by newlines first to preserve intentional line breaks
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = words[i + 1];

      // Handle very long words that exceed maxWidth
      if (word.length > maxWidth) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
          currentLine = "";
        }

        // Split long word into chunks
        for (let j = 0; j < word.length; j += maxWidth) {
          lines.push(word.slice(j, j + maxWidth));
        }
        continue;
      }

      // Check if adding this word would exceed the line length
      const potentialLine = currentLine + (currentLine ? " " : "") + word;

      if (potentialLine.length <= maxWidth) {
        currentLine = potentialLine;
      } else {
        // Current line is full, start a new one
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = word;
      }

      // Special handling for punctuation and natural break points
      if (
        nextWord &&
        (word.endsWith(".") ||
          word.endsWith("!") ||
          word.endsWith("?") ||
          word.endsWith(","))
      ) {
        // If we're near the end of the line and the next word would fit,
        // consider breaking here for better readability
        const nextPotentialLine = currentLine + " " + nextWord;
        if (
          nextPotentialLine.length > maxWidth &&
          currentLine.length > maxWidth * 0.7
        ) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
      }
    }

    // Add the last line of this paragraph
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  }

  // Ensure we don't exceed the expected number of lines
  // by truncating if necessary
  return lines.slice(0, 20); // Adjust based on your boardHeight
};

// --- Main Flipboard Display Component ---
const FlipboardDisplay: React.FC<{
  text: string;
  boardWidth?: number;
  boardHeight?: number;
  flipDuration?: number;
  enableTextWrapping?: boolean;
}> = ({
  text,
  boardWidth = 50,
  boardHeight = 15,
  flipDuration = 0.4,
  enableTextWrapping = true,
}) => {
  const [characterGrid, setCharacterGrid] = useState<string[][]>([]);
  const [prevCharacterGrid, setPrevCharacterGrid] = useState<string[][]>([]);

  // Calculate staggered delays based on position (only for changing tiles)
  const getStaggeredDelay = (x: number, y: number) => {
    // Create a wave effect from top-left to bottom-right
    const distance = Math.sqrt(x * x + y * y);
    const baseDelay = distance * 0.05; // 0.05s per unit distance
    return baseDelay;
  };

  useEffect(() => {
    setPrevCharacterGrid(characterGrid);

    let lines: string[];

    if (enableTextWrapping) {
      // Use text wrapping
      lines = wrapText(text, boardWidth);
    } else {
      // Use original line-by-line splitting
      lines = text.split("\n");
    }

    const grid: string[][] = [];

    for (let y = 0; y < boardHeight; y++) {
      grid[y] = Array(boardWidth).fill(" ");
      if (y < lines.length) {
        const line = lines[y];
        for (let x = 0; x < Math.min(line.length, boardWidth); x++) {
          grid[y][x] = line[x];
        }
      }
    }

    setCharacterGrid(grid);
  }, [text, boardWidth, boardHeight, enableTextWrapping]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
        gridTemplateRows: `repeat(${boardHeight}, 1fr)`,
        gap: "0.3vh",
        width: "100%",
        height: "100%",
        fontFamily: '"Roboto Mono", monospace',
        fontSize: "3vh",
      }}
    >
      {characterGrid.map((row, y) =>
        row.map((char, x) => (
          <FlipCharacter
            key={`${y}-${x}`}
            char={char}
            prevChar={prevCharacterGrid?.[y]?.[x] || " "}
            flipDuration={flipDuration}
            delay={getStaggeredDelay(x, y)}
            position={{ x, y }}
          />
        ))
      )}
    </div>
  );
};

// --- App Component (Example Usage) ---
export default function App() {
  const [contentIndex, setContentIndex] = useState(0);

  const contents: string[] = [
    `"Protection and power are overrated. I think you are very wise to choose happiness and love."
~Uncle Iroh`,
    `"This is the real secret of life—to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play."
~Alan Watts`,
    `"Happiness is not something ready made. It comes from your own actions."
~Dalai Lama`,
    `"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."
~Buddha`,
    `"The best way to take care of the future is to take care of the present moment."
~Thich Nhat Hanh`,
    `"You only lose what you cling to."
~Buddha`,
    `"Simplicity, patience, compassion. These three are your greatest treasures. Simple in actions and thoughts, you return to the source of being."
~Lao Tsu`,
    `"Be content with what you have; rejoice in the way things are. When you realize there is nothing lacking, the whole world belongs to you."
~Lao Tsu`,
    `"Nature does not hurry, yet everything is accomplished."
~Lao Tsu`,
    `"The journey of a thousand miles begins with a single step."
~Lao Tsu`,
    `"At the center of your being, you have the answer; you know who you are and you know what you want."
~Lao Tsu`,
    `"Happiness is a perfume you cannot pour on others without getting some on yourself."
~Ralph Waldo Emerson`,
    `"The greatest happiness of life is the conviction that we are loved — loved for ourselves, or rather, loved in spite of ourselves."
~Victor Hugo`,
    `"The most precious gift we can offer others is our presence. When mindfulness embraces those we love, they will bloom like flowers."
~Thich Nhat Hanh`,
    `"Life is a series of natural and spontaneous changes. Don’t resist them; that only creates sorrow. Let things flow naturally forward in whatever way they like."
~Lao Tsu`,
    `"Wherever you go, there you are."
~Jon Kabat-Zinn`,
  ];

  const handleNext = () => {
    setContentIndex((prevIndex) => (prevIndex + 1) % contents.length);
  };

  const handlePrevious = () => {
    setContentIndex((prevIndex) =>
      prevIndex === 0 ? contents.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1d2436",
        fontFamily: '"Roboto Mono", monospace',
        color: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "5vh",
      }}
    >
      <div>
        <FlipboardDisplay
          text={contents[contentIndex]}
          boardWidth={20}
          boardHeight={10}
          enableTextWrapping={true}
        />
      </div>

      {/* Navigation Buttons - positioned outside the main content */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "1rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={handlePrevious}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#171d29",
            color: "cyan",
            border: "2px solid cyan",
            borderRadius: "1.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "cyan";
            e.currentTarget.style.color = "#171d29";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#171d29";
            e.currentTarget.style.color = "cyan";
          }}
        >
          ← Previous
        </button>

        <div
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#171d29",
            color: "cyan",
            // border: "2px solid cyan",
            borderRadius: "1.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {contentIndex + 1} / {contents.length}
        </div>

        <button
          onClick={handleNext}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#171d29",
            color: "cyan",
            border: "2px solid cyan",
            borderRadius: "1.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "cyan";
            e.currentTarget.style.color = "#171d29";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#171d29";
            e.currentTarget.style.color = "cyan";
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
