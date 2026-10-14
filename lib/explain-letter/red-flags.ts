// Safety net for free-text the person types with their letter.
// Any match shows the emergency message immediately and alerts a navigator.
// Keep this list short, reviewed, and in Creole + English + French + Spanish.

const RED_FLAGS = [
  // Creole
  "doulè nan pwatrin", "mwen pa ka respire", "m pa ka respire", "mwen vle mouri", "m vle mouri",
  "touye tèt mwen", "fè tèt mwen mal", "san ap koule", "endispoze", "konvilsyon",
  // English
  "chest pain", "can't breathe", "cannot breathe", "want to die", "kill myself", "suicide",
  "hurt myself", "overdose", "bleeding a lot", "seizure",
  // French / Spanish
  "douleur à la poitrine", "je veux mourir", "me quiero morir", "dolor de pecho",
];

export function hasRedFlag(text: string | null | undefined): boolean {
  if (!text) return false;
  const t = text.toLowerCase().normalize("NFC");
  return RED_FLAGS.some((flag) => t.includes(flag));
}

export const EMERGENCY_MESSAGE_HT =
  "Si se yon ijans, rele 911 kounye a. Si w ap panse fè tèt ou mal, rele oswa voye tèks bay 988 (gen entèprèt kreyòl). Yon navigatè KHADA ap kontakte w tou.";
