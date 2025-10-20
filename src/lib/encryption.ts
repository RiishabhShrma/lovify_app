const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;

// =========================================================================
// R O B U S T   B A S E 6 4   H E L P E R S
// =========================================================================

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array { 
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

// =========================================================================
// K E Y   D E R I V A T I O N
// =========================================================================

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
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256'
        },
        baseKey,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

// =========================================================================
// E N C R Y P T I O N   ( F I X E D  - Now accepts optional salt )
// =========================================================================

export async function encryptText(
    text: string, 
    password: string,
    existingSalt?: string  // NEW: Accept existing salt as Base64 string
): Promise<{
    encrypted: string;
    iv: string;
    salt: string;
}> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Use existing salt if provided, otherwise generate new one
    const salt = existingSalt 
        ? base64ToArrayBuffer(existingSalt)
        : crypto.getRandomValues(new Uint8Array(16));

    const key = await deriveKeyFromPassword(password, salt);

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        data
    );

    return {
        encrypted: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(iv),
        salt: arrayBufferToBase64(salt)
    };
}

// =========================================================================
// D E C R Y P T I O N
// =========================================================================

export async function decryptText(
    encryptedBase64: string,
    ivBase64: string,
    saltBase64: string,
    password: string
): Promise<string> {
    // Convert all Base64 strings to Uint8Array
    const encryptedData = base64ToArrayBuffer(encryptedBase64);
    const iv = base64ToArrayBuffer(ivBase64);
    const salt = base64ToArrayBuffer(saltBase64);

    // Derive the key using the salt
    const key = await deriveKeyFromPassword(password, salt);

    // Decrypt - pass Uint8Array for both iv and encrypted data
    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv: iv }, 
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}