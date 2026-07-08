/**
 * Lughawi Security and Hardening Module
 * Implements Input Sanitization (XSS mitigation) and Secure Storage (AES-GCM Encryption)
 * designed in accordance with OWASP Top 10 guidelines.
 */

// 1. Sanitization Utilities
export function sanitizeInput(text: string): string {
  if (!text) return "";
  
  // Neutralize common XSS vectors
  let cleaned = text;
  
  // Remove <script>...</script> tags entirely
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Neutralize inline event handlers and javascript URIs
  cleaned = cleaned.replace(/javascript\s*:/gi, "disabled-javascript:");
  cleaned = cleaned.replace(/data\s*:\s*text\/html/gi, "disabled-html-data:");
  cleaned = cleaned.replace(/\bon\w+\s*=/gi, (match) => `disabled-${match}`);
  
  // Escaping dangerous HTML characters specifically for rendering inside context
  // but preserving typical punctuation for the translation model.
  return cleaned;
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  // Basic strict escaping for HTML content
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// 2. LocalStorage Authenticated Encryption Utilities (AES-GCM 256-bit)
const KEY_NAME = "lughawi.sec.k1";

/**
 * Retrieves the existing encryption key or generates a new cryptographically secure one.
 */
async function getOrCreateKey(): Promise<CryptoKey> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new Error("Cryptography API is not supported in this environment");
  }

  const storedKeyHex = localStorage.getItem(KEY_NAME);
  if (storedKeyHex) {
    try {
      // Reconstruct key array from stored Hex string
      const rawKey = new Uint8Array(
        storedKeyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );
      return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
    } catch (e) {
      console.error("Failed to import security key, generating new fallback", e);
    }
  }

  // Generate a brand new cryptographically strong 256-bit AES key
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Export raw bytes to save in Hex format
  const exported = await window.crypto.subtle.exportKey("raw", key);
  const hex = Array.from(new Uint8Array(exported))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  
  localStorage.setItem(KEY_NAME, hex);
  return key;
}

/**
 * Encrypts data using AES-GCM and returns a base64 encoded string containing the IV and Ciphertext.
 */
export async function encryptData(data: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    // 12-byte initialization vector is standard for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    // Combine IV and Ciphertext so they can be stored together
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Encode to base64 safely
    return btoa(String.fromCharCode(...combined));
  } catch (e) {
    console.error("AES Encryption failure:", e);
    throw new Error("فشلت عملية تشفير البيانات لحمايتها.");
  }
}

/**
 * Decrypts a base64 encoded AES-GCM string.
 */
export async function decryptData(encryptedBase64: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    const binaryString = atob(encryptedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extract IV (first 12 bytes) and Ciphertext (the rest)
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("AES Decryption failure (potential tampering or bad key):", e);
    throw new Error("تعذرت قراءة البيانات المشفرة أو تم التلاعب بها.");
  }
}
