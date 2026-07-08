// src/lib/dictionary-api.ts
export interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics?: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
}

export async function fetchWordDetails(word: string, lang: string = "en"): Promise<DictionaryApiResponse | null> {
  // Free Dictionary API primarily supports English, but also some others. 
  // We'll restrict it to English for now to ensure high quality results.
  if (!word || lang !== "en") return null;

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      return null;
    }

    const data: DictionaryApiResponse[] = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Dictionary API Error:", error);
    return null;
  }
}
