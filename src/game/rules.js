// Pravila igre "Човече, не љути се" — ciste funkcije, bez React-a.

export const IGRACI = [
  { ime: "Црвени", koga: "Црвеног", boja: "#d94a3d", start: 0 },
  { ime: "Плави", koga: "Плавог", boja: "#3a6fd8", start: 10 },
  { ime: "Зелени", koga: "Зеленог", boja: "#2e9d5a", start: 20 },
  { ime: "Жути", koga: "Жутог", boja: "#e3b100", start: 30 },
];

export const DUZINA_STAZE = 40;
export const FIGURA_PO_IGRACU = 4;
export const POSLEDNJE_POLJE = DUZINA_STAZE + FIGURA_PO_IGRACU - 1; // poslednje polje u kucici

// Tabla je mreza 11x11, [x, y]. Staza ide u smeru kazaljke na satu.
export const STAZA = [
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [4, 3],
  [4, 2],
  [4, 1],
  [4, 0],
  [5, 0],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [7, 4],
  [8, 4],
  [9, 4],
  [10, 4],
  [10, 5],
  [10, 6],
  [9, 6],
  [8, 6],
  [7, 6],
  [6, 6],
  [6, 7],
  [6, 8],
  [6, 9],
  [6, 10],
  [5, 10],
  [4, 10],
  [4, 9],
  [4, 8],
  [4, 7],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],
  [0, 5],
];

export const KUCICE = [
  [
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ],
  [
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
  ],
  [
    [9, 5],
    [8, 5],
    [7, 5],
    [6, 5],
  ],
  [
    [5, 9],
    [5, 8],
    [5, 7],
    [5, 6],
  ],
];

export const STARTNA_MESTA = [
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  [
    [9, 0],
    [10, 0],
    [9, 1],
    [10, 1],
  ],
  [
    [9, 9],
    [10, 9],
    [9, 10],
    [10, 10],
  ],
  [
    [0, 9],
    [1, 9],
    [0, 10],
    [1, 10],
  ],
];

export function baciKocku() {
  return Math.floor(Math.random() * 6) + 1;
}

// Када падне шестица, играч баца поново.
export function bacaPonovo(kocka) {
  return kocka === 7;
}

// Nijedna figura na stazi, a figure u kucici su usle do kraja -> bacaju se 3 kocke odjednom.
export function trebajuTriKocke(moje) {
  if (moje.some((p) => p >= 0 && p < DUZINA_STAZE)) return false;
  const uKucici = moje.filter((p) => p >= DUZINA_STAZE).sort((a, b) => b - a);
  return uKucici.every((p, i) => p === POSLEDNJE_POLJE - i);
}

// Pozicija figure je koliko je presla: -1 = start, 0..39 = staza, 40..43 = kucica.
const polje = (igrac, p) => (IGRACI[igrac].start + p) % DUZINA_STAZE;

export function gdeJeFigura(igrac, figura, p) {
  if (p < 0) return STARTNA_MESTA[igrac][figura];
  if (p >= DUZINA_STAZE) return KUCICE[igrac][p - DUZINA_STAZE];
  return STAZA[polje(igrac, p)];
}

export function moguciPotezi(figure, igrac, broj) {
  const moje = figure[igrac];
  return moje.flatMap((p, i) => {
    if (p < 0 && broj !== 6) return [];
    const cilj = p < 0 ? 0 : p + broj;
    if (cilj > POSLEDNJE_POLJE) return [];
    if (moje.some((q, j) => j !== i && q === cilj)) return [];
    return [i];
  });
}

export function kogaJede(figure, igrac, cilj) {
  if (cilj >= DUZINA_STAZE) return null;
  const mesto = polje(igrac, cilj);
  for (let drugi = 0; drugi < figure.length; drugi++) {
    if (drugi === igrac) continue;
    const figura = figure[drugi].findIndex(
      (p) => p >= 0 && p < DUZINA_STAZE && polje(drugi, p) === mesto,
    );
    if (figura !== -1) return { igrac: drugi, figura };
  }
  return null;
}
