import { useEffect, useRef } from "react";
import { kadSeDesi, TRAJANJE_BACANJA } from "./engine.js";

const HOLD_MS = 1300;

const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// place: where the side sits on the cube; show: cube rotation that brings it to the front.
const SIDES = {
  1: { place: "rotateY(0deg)", show: [0, 0] },
  6: { place: "rotateY(180deg)", show: [0, 180] },
  3: { place: "rotateY(90deg)", show: [0, -90] },
  4: { place: "rotateY(-90deg)", show: [0, 90] },
  5: { place: "rotateX(90deg)", show: [-90, 0] },
  2: { place: "rotateX(-90deg)", show: [90, 0] },
};

export function Face({ value, className = "", style }) {
  return (
    <div className={`face ${className}`} style={style}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={PIPS[value].includes(i) ? "pip" : ""} />
      ))}
    </div>
  );
}

const MAX_DICE = 3;

function throwDie(w, c, value, i, n, dir) {
  const total = TRAJANJE_BACANJA + HOLD_MS;
  const f = TRAJANJE_BACANJA / total;
  const spread = (i - (n - 1) / 2) * 13; // final spacing in vw
  const lane = (i - (n - 1) / 2) * 12; // each die gets its own height on the way
  const big = n > 1 ? 1.15 : 1.35;
  const at = (x, y, s = 1) => `translate(${x * dir}vw, ${y + lane}vh) scale(${s})`;
  const end = (s = 1) => `translate(${spread}vw, 0vh) scale(${s})`;
  const bounce = "cubic-bezier(.3,.7,.5,1)";
  const j = () => Math.random() * 8 - 4; // a bit of randomness per die

  // Path across the screen, then grow in the middle and fade out.
  w.animate(
    [
      { transform: at(-62 - i * 6, -28 + j()), opacity: 1, offset: 0, easing: bounce },
      { transform: at(-30 + j(), 20 + j()), offset: f * 0.3, easing: bounce },
      { transform: at(8 + j(), -16 + j()), offset: f * 0.55, easing: bounce },
      { transform: at(24 + j(), 12 + j()), offset: f * 0.78, easing: bounce },
      { transform: end(), offset: f },
      { transform: end(big), opacity: 1, offset: f + (1 - f) * 0.2 },
      { transform: end(big), opacity: 1, offset: f + (1 - f) * 0.8 },
      { transform: end(big), opacity: 0, offset: 1 },
    ],
    { duration: total, fill: "forwards" }
  );

  // Spin many times and land on the rolled side.
  const [fx, fy] = SIDES[value].show;
  const turns = (k) => 360 * (k + Math.floor(Math.random() * 2));
  c.animate(
    [
      { transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)" },
      {
        transform: `rotateX(${fx + turns(3)}deg) rotateY(${fy + turns(4) * dir}deg) rotateZ(${360 * dir}deg)`,
      },
    ],
    { duration: TRAJANJE_BACANJA, easing: "cubic-bezier(.15,.6,.3,1)", fill: "forwards" }
  );
}

export default function Dice() {
  const wraps = useRef([]);
  const cubes = useRef([]);

  useEffect(() => {
    let timer;
    const off = kadSeDesi("KOCKA_BACENA", ({ vrednosti: values }) => {
      clearTimeout(timer);
      const dir = Math.random() < 0.5 ? -1 : 1;
      for (let i = 0; i < MAX_DICE; i++) {
        const w = wraps.current[i];
        const c = cubes.current[i];
        if (!w || !c) continue;
        [...w.getAnimations(), ...c.getAnimations()].forEach((a) => a.cancel());
        c.classList.remove("settled");
        if (i < values.length) throwDie(w, c, values[i], i, values.length, dir);
      }
      timer = setTimeout(
        () => cubes.current.forEach((c) => c?.classList.add("settled")),
        TRAJANJE_BACANJA - 200
      );
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="dice-stage" aria-hidden="true">
      {Array.from({ length: MAX_DICE }, (_, i) => (
        <div className="dice-wrap" key={i} ref={(el) => (wraps.current[i] = el)}>
          <div className="cube" ref={(el) => (cubes.current[i] = el)}>
            {Object.entries(SIDES).map(([v, s]) => (
              <Face
                key={v}
                value={Number(v)}
                className="side"
                style={{ transform: `${s.place} translateZ(var(--half))` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
