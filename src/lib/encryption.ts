// ==========================================================================
// E N C R Y P T I O N   U T I L I T Y   (Fixed for TypeScript strict types)
// ==========================================================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;

// ==========================================================================
// H E L P E R S
// ==========================================================================

/**
 * Ensures that the given Uint8Array is backed by a normal ArrayBuffer,
 * not a SharedArrayBuffer. This prevents TS type errors and subtle crypto bugs.
 */
function ensureArrayBufferView(input: Uint8Array): Uint8Array {
    return new Uint8Array(input); // Creates a copy on a normal ArrayBuffer
}

/**
 * Convert ArrayBuffer or Uint8Array to Base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array.
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
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
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: ensureArrayBufferView(salt),
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
    existingSalt?: string // optional base64 salt
): Promise<{
    encrypted: string;
    iv: string;
    salt: string;
}> {
    const iv = ensureArrayBufferView(crypto.getRandomValues(new Uint8Array(12)));

    // Use existing salt if provided, otherwise generate new one
    const salt = ensureArrayBufferView(
        existingSalt
            ? base64ToArrayBuffer(existingSalt)
            : crypto.getRandomValues(new Uint8Array(16))
    );

    const key = await deriveKeyFromPassword(password, salt);

    const encoder = new TextEncoder();
    const data = ensureArrayBufferView(encoder.encode(text));

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        data
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
    // Convert Base64 strings back to Uint8Array
    const encryptedData = ensureArrayBufferView(base64ToArrayBuffer(encryptedBase64));
    const iv = ensureArrayBufferView(base64ToArrayBuffer(ivBase64));
    const salt = ensureArrayBufferView(base64ToArrayBuffer(saltBase64));

    // Derive key from password and salt
    const key = await deriveKeyFromPassword(password, salt);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}
