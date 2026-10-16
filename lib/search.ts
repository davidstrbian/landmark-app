// Matches regardless of case and diacritics, so "yllas" finds "Ylläs".
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
