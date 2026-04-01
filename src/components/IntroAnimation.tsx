"use client";
import { useState, useEffect } from "react";

const LETTERS = "Libgeance".split("");
const ANIMATION_DURATION = 3200;

export default function IntroAnimation() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGone(true), ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-overlay">
      <div style={{ display: "flex" }}>
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className="intro-letter"
            style={{ animationDelay: `${i * 130}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
