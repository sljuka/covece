import { useSyncExternalStore } from "react";
import { uzmiStanje, pretplati, baciKockice, izaberiFiguru, novaIgra, brojKocki } from "./engine.js";
import { IGRACI, STAZA, KUCICE, STARTNA_MESTA, gdeJeFigura } from "./rules.js";
import Dice, { Face } from "./Dice.jsx";
import "./game.css";

const at = ([x, y]) => ({ left: `${(x * 100) / 11}%`, top: `${(y * 100) / 11}%` });

const CELLS = [
  ...STAZA.map((c, i) => {
    const owner = IGRACI.find((p) => p.start === i);
    return { c, kind: owner ? "start" : "track", color: owner?.boja };
  }),
  ...KUCICE.flatMap((h, p) => h.map((c) => ({ c, kind: "home", color: IGRACI[p].boja }))),
  ...STARTNA_MESTA.flatMap((y, p) => y.map((c) => ({ c, kind: "yard", color: IGRACI[p].boja }))),
];

const name = (p) => IGRACI[p].ime;

function describe(d) {
  switch (d.tip) {
    case "NOVA_IGRA": return "Почиње нова игра";
    case "KOCKA_BACENA": return `${name(d.igrac)} баца ${d.vrednosti.length === 3 ? "3 коцке" : "коцку"}`;
    case "KOCKA_STALA": return `Пало је ${d.vrednosti.join(", ")}`;
    case "MOGUCI_POTEZI": return "Бира се фигура";
    case "NEMA_POTEZA": return "Нема потеза";
    case "FIGURA_IZABRANA": return `${name(d.igrac)} помера фигуру`;
    case "FIGURA_POJEDENA": return `${name(d.ko)} је појео ${IGRACI[d.igrac].koga}! 😮`;
    case "BACA_PONOVO": return "Шестица! Баца поново";
    case "SLEDECI_IGRAC": return `На потезу је ${name(d.igrac)}`;
    case "POBEDA": return `${name(d.igrac)} је победио! 🎉`;
    default: return "";
  }
}

function status(s) {
  switch (s.faza) {
    case "bacanje": return brojKocki() === 3 ? "Баци 3 коцке! Треба ти шестица." : "Баци коцку!";
    case "kotrljanje": return "Коцка се котрља…";
    case "biranje": return "Кликни на фигуру која скакуће";
    case "kretanje": return "Фигура иде…";
    case "cekanje": return "Нема потеза 😕";
    case "kraj": return `${name(s.pobednik)} је победио! 🎉`;
    default: return "";
  }
}

export default function Game() {
  const s = useSyncExternalStore(pretplati, uzmiStanje);
  const shown = s.faza === "kraj" ? s.pobednik : s.naPotezu;
  const player = IGRACI[shown];

  return (
    <div className="game">
      <div className="board">
        <div className="grid">
          {CELLS.map(({ c, kind, color }) => (
            <div key={c.join()} className={`cell ${kind}`} style={{ ...at(c), "--c": color }} />
          ))}
          {s.figure.map((arr, p) =>
            arr.map((val, i) => {
              const movable = p === s.naPotezu && s.pokretne.includes(i);
              return (
                <button
                  key={`${p}-${i}`}
                  className={movable ? "piece movable" : "piece"}
                  style={{ ...at(gdeJeFigura(p, i, val)), "--c": IGRACI[p].boja }}
                  onClick={() => izaberiFiguru(i)}
                  disabled={!movable}
                  aria-label={`${IGRACI[p].ime} фигура ${i + 1}`}
                />
              );
            })
          )}
        </div>
      </div>

      <aside className="panel">
        <p className="kicker">Човече, не љути се</p>

        <div className="turn">
          <span className="token" style={{ "--c": player.boja }} />
          <div>
            <p className="note">{s.faza === "kraj" ? "Победник" : "На потезу"}</p>
            <p className="turn-name">{player.ime}</p>
          </div>
        </div>

        <p className="status">{status(s)}</p>

        <div className="roll-row">
          <button className="roll" onClick={() => baciKockice()} disabled={s.faza !== "bacanje"}>
            {s.faza === "bacanje" && brojKocki() === 3 ? "Баци 3 коцке" : "Баци коцку"}
          </button>
          <button
            className="roll six"
            onClick={() => baciKockice(true)}
            disabled={s.faza !== "bacanje"}
            title="Демо: увек падне шестица"
          >
            6
          </button>
        </div>

        <div className="last">
          <span className="note">Пало је:</span>
          {s.baceno.length > 0 && s.faza !== "kotrljanje" ? (
            s.baceno.map((v, i) => <Face key={i} value={v} className="small" />)
          ) : (
            <span>…</span>
          )}
        </div>

        <div className="log">
          <p className="note">Догађаји</p>
          <ul>
            {s.dnevnik.map((d) => (
              <li key={d.id}>
                <code>{d.tip}</code>
                {describe(d)}
              </li>
            ))}
          </ul>
        </div>

        <button className="link" onClick={novaIgra}>Нова игра</button>
      </aside>

      <Dice />
    </div>
  );
}
