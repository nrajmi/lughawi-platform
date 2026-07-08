import { DictionaryEntry, DictionaryDomain } from "./types";
import { LINGUISTICS_DICT } from "./linguistics";
import { TECH_DICT } from "./tech";
import { MEDICAL_DICT } from "./medical";
import { LEGAL_DICT } from "./legal";
import { GENERAL_DICT } from "./general";
import { RELIGIOUS_DICT } from "./religious";

export const ALL_DICTIONARIES: DictionaryEntry[] = [
  ...LINGUISTICS_DICT,
  ...TECH_DICT,
  ...MEDICAL_DICT,
  ...LEGAL_DICT,
  ...GENERAL_DICT,
  ...RELIGIOUS_DICT,
];

export function getDictionaryByDomain(domain: DictionaryDomain): DictionaryEntry[] {
  if (domain === "all") return ALL_DICTIONARIES;
  return ALL_DICTIONARIES.filter((entry) => entry.domain.includes(domain));
}

export * from "./types";
export { RELIGIOUS_GLOSSARY, type ReligiousGlossaryEntry } from "./religious";
export { TECH_GLOSSARY, type TechGlossaryEntry } from "./tech";
export { MEDICAL_GLOSSARY, type MedicalGlossaryEntry } from "./medical";
export { LEGAL_GLOSSARY, type LegalGlossaryEntry } from "./legal";

