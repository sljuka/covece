// Igra zasnovana na dogadjajima (event based).
// Komande (baciKockice, izaberiFiguru, novaIgra) proveravaju da li je potez dozvoljen i objavljuju dogadjaj.
// Svaki dogadjaj prolazi kroz `promeniStanje` koje pravi novo stanje,
// a zatim slusaoci reaguju na njega (i mogu da objave nove dogadjaje).

import {
  IGRACI,
  FIGURA_PO_IGRACU,
  DUZINA_STAZE,
  baciKocku,
  trebajuTriKocke,
  moguciPotezi,
  kogaJede,
} from "./rules.js";

export const TRAJANJE_BACANJA = 2500;
const TRAJANJE_KORAKA = 220;
const PAUZA = 800;

const pocetnoStanje = (igraId = 0) => ({
  igraId,
  figure: IGRACI.map(() => Array(FIGURA_PO_IGRACU).fill(-1)),
  naPotezu: 0,
  faza: "bacanje", // bacanje | kotrljanje | biranje | kretanje | cekanje | kraj
  baceno: [], // sve bacene kocke (1 ili 3)
  kocka: null, // broj koji se igra
  pokretne: [], // figure koje mogu da se pomere
  pobednik: null,
  dnevnik: [],
});

// U dev modu igra nastavlja kad se kod promeni (hot reload).
// Sto je bilo usred animacije vraca se na "bacanje" za istog igraca.
const sacuvano = import.meta.hot?.data.stanje;
let stanje = sacuvano
  ? {
      ...sacuvano,
      igraId: sacuvano.igraId + 1,
      faza: ["biranje", "kraj"].includes(sacuvano.faza)
        ? sacuvano.faza
        : "bacanje",
    }
  : pocetnoStanje();
let sledeciId = import.meta.hot?.data.sledeciId ?? 1;
import.meta.hot?.dispose((data) => {
  data.stanje = stanje;
  data.sledeciId = sledeciId;
});

const pretplatnici = new Set();
const slusaoci = new Map();

export const uzmiStanje = () => stanje;

export function pretplati(fn) {
  pretplatnici.add(fn);
  return () => pretplatnici.delete(fn);
}

export function kadSeDesi(tip, fn) {
  if (!slusaoci.has(tip)) slusaoci.set(tip, new Set());
  slusaoci.get(tip).add(fn);
  return () => slusaoci.get(tip).delete(fn);
}

export function objavi(tip, podaci = {}) {
  const dogadjaj = { id: sledeciId++, tip, ...podaci };
  stanje = promeniStanje(stanje, dogadjaj);
  if (tip !== "FIGURA_KORACA")
    stanje = { ...stanje, dnevnik: [dogadjaj, ...stanje.dnevnik].slice(0, 7) };
  pretplatnici.forEach((fn) => fn());
  slusaoci.get(tip)?.forEach((fn) => fn(dogadjaj));
}

const pomeriFiguru = (figure, igrac, figura, na) =>
  figure.map((niz, p) =>
    p === igrac ? niz.map((v, i) => (i === figura ? na : v)) : niz,
  );

function promeniStanje(s, d) {
  switch (d.tip) {
    case "NOVA_IGRA":
      return pocetnoStanje(s.igraId + 1);
    case "KOCKA_BACENA":
      return { ...s, faza: "kotrljanje", baceno: d.vrednosti, kocka: d.broj };
    case "MOGUCI_POTEZI":
      return { ...s, faza: "biranje", pokretne: d.figure };
    case "NEMA_POTEZA":
      return { ...s, faza: "cekanje" };
    case "FIGURA_IZABRANA":
      return { ...s, faza: "kretanje", pokretne: [] };
    case "FIGURA_KORACA":
    case "FIGURA_POJEDENA":
      return { ...s, figure: pomeriFiguru(s.figure, d.igrac, d.figura, d.na) };
    case "BACA_PONOVO":
      return { ...s, faza: "bacanje" };
    case "SLEDECI_IGRAC":
      return { ...s, faza: "bacanje", naPotezu: d.igrac };
    case "POBEDA":
      return { ...s, faza: "kraj", pobednik: d.igrac };
    default:
      return s;
  }
}

// Tajmeri se ignorisu ako je u medjuvremenu pocela nova igra.
function kasnije(fn, ms) {
  const id = stanje.igraId;
  setTimeout(() => stanje.igraId === id && fn(), ms);
}

// ---- Komande ----

export const brojKocki = () =>
  trebajuTriKocke(stanje.figure[stanje.naPotezu]) ? 3 : 1;

// `uvekSestica` je samo za demo: prva kocka uvek pokaze 6.
export function baciKockice(uvekSestica = false) {
  if (stanje.faza !== "bacanje") return;
  const vrednosti = Array.from({ length: brojKocki() }, baciKocku);
  if (uvekSestica) vrednosti[0] = 6;
  const broj = vrednosti.includes(6) ? 6 : vrednosti[0];
  objavi("KOCKA_BACENA", { igrac: stanje.naPotezu, vrednosti, broj });
}

export function izaberiFiguru(figura) {
  if (stanje.faza !== "biranje" || !stanje.pokretne.includes(figura)) return;
  objavi("FIGURA_IZABRANA", { igrac: stanje.naPotezu, figura });
}

export function novaIgra() {
  objavi("NOVA_IGRA");
}

// ---- Reakcije na dogadjaje ----

const sledeciIgrac = (igrac) =>
  objavi("SLEDECI_IGRAC", { igrac: (igrac + 1) % IGRACI.length });

kadSeDesi("KOCKA_BACENA", ({ igrac, vrednosti, broj }) => {
  kasnije(
    () => objavi("KOCKA_STALA", { igrac, vrednosti, broj }),
    TRAJANJE_BACANJA,
  );
});

kadSeDesi("KOCKA_STALA", ({ igrac, broj }) => {
  const potezi = moguciPotezi(stanje.figure, igrac, broj);
  if (potezi.length === 0) {
    objavi("NEMA_POTEZA", { igrac });
    kasnije(() => sledeciIgrac(igrac), PAUZA);
    return;
  }
  objavi("MOGUCI_POTEZI", { igrac, figure: potezi });
  if (potezi.length === 1) kasnije(() => izaberiFiguru(potezi[0]), PAUZA);
});

kadSeDesi("FIGURA_IZABRANA", ({ igrac, figura }) => {
  const od = stanje.figure[igrac][figura];
  const cilj = od < 0 ? 0 : od + stanje.kocka;
  const korak = (pozicija) => {
    objavi("FIGURA_KORACA", { igrac, figura, na: pozicija });
    if (pozicija < cilj) kasnije(() => korak(pozicija + 1), TRAJANJE_KORAKA);
    else kasnije(() => zavrsiPotez(igrac, cilj), TRAJANJE_KORAKA);
  };
  kasnije(() => korak(od < 0 ? 0 : od + 1), 50);
});

function zavrsiPotez(igrac, cilj) {
  const pojeden = kogaJede(stanje.figure, igrac, cilj);
  if (pojeden) objavi("FIGURA_POJEDENA", { ...pojeden, na: -1, ko: igrac });
  if (stanje.figure[igrac].every((p) => p >= DUZINA_STAZE)) {
    objavi("POBEDA", { igrac });
    return;
  }

  // Када падне шестица, играч баца поново.
  if (stanje.kocka === 7) {
    kasnije(() => objavi("BACA_PONOVO", { igrac }), PAUZA / 2);
  } else {
    kasnije(() => sledeciIgrac(igrac), PAUZA / 2);
  }
}
