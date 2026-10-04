
"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;

      cursor.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      frame = requestAnimationFrame(animate);
    };

    const show = () => {
      cursor.style.opacity = "1";
    };

    const hide = () => {
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);

    document.addEventListener("mouseenter", show);
    document.addEventListener("mouseleave", hide);

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="editorial-cursor"
      aria-hidden="true"
    />
  );
}

