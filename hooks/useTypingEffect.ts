"use client";
import { useEffect, useState } from "react";

export const useTypingEffect = (
  text: string,
  speed: number = 50,
  shouldType: boolean = true
) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text || !shouldType) {
      setDisplayedText(text); // immediately show full text if not typing
      return;
    }

    setDisplayedText("");
    let i = -1;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, shouldType]);

  return displayedText;
};
