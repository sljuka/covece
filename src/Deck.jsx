import { useEffect, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import slides from "./slides.jsx";

export default function Deck() {
  const { n } = useParams();
  const navigate = useNavigate();
  const index = Number(n) - 1;
  const total = slides.length;

  const go = useCallback(
    (i) => {
      if (i >= 0 && i < total) navigate(`/${i + 1}`);
    },
    [navigate, total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, total]);

  if (!Number.isInteger(index) || index < 0 || index >= total) {
    return <Navigate to="/1" replace />;
  }

  const Slide = slides[index];

  return (
    <div className="deck">
      <main className="slide" key={index}>
        <Slide />
      </main>
      <footer className="controls">
        <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Претходни слајд">
          ←
        </button>
        <div className="dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Следећи слајд">
          →
        </button>
      </footer>
    </div>
  );
}
