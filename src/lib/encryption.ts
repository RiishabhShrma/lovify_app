// ==========================================================================
// E N C R Y P T I O N   U T I L I T Y   (Vercel-compatible, TS-safe)
// ==========================================================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100_000;

// ==========================================================================
// H E L P E R S
// ==========================================================================

/**
 * Ensure the buffer is a plain ArrayBuffer, not SharedArrayBuffer.
 */
function toPlainArrayBuffer(input: ArrayBufferLike | Uint8Array): ArrayBuffer {
  if (input instanceof ArrayBuffer) return input;
  if (input instanceof Uint8Array) {
    return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  }
  // Last fallback: convert SharedArrayBuffer → ArrayBuffer
  return new Uint8Array(input).buffer;
}

/**
 * Convert ArrayBuffer or Uint8Array to Base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array.
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ==========================================================================
// K E Y   D E R I V A T I O N
// ==========================================================================

async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    toPlainArrayBuffer(passwordBuffer),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toPlainArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

// ==========================================================================
// E N C R Y P T I O N
// ==========================================================================

export async function encryptText(
  text: string,
  password: string,
  existingSalt?: string
): Promise<{ encrypted: string; iv: string; salt: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = existingSalt
    ? base64ToArrayBuffer(existingSalt)
    : crypto.getRandomValues(new Uint8Array(16));

  const key = await deriveKeyFromPassword(password, salt);

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: toPlainArrayBuffer(iv) },
    key,
    toPlainArrayBuffer(data)
  );

  return {
    encrypted: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
  };
}

// ==========================================================================
// D E C R Y P T I O N
// ==========================================================================

export async function decryptText(
  encryptedBase64: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<string> {
  const encryptedData = base64ToArrayBuffer(encryptedBase64);
  const iv = base64ToArrayBuffer(ivBase64);
  const salt = base64ToArrayBuffer(saltBase64);

  const key = await deriveKeyFromPassword(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: toPlainArrayBuffer(iv) },
    key,
    toPlainArrayBuffer(encryptedData)
  );

  return new TextDecoder().decode(decrypted);
}
