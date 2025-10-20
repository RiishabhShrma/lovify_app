function ensureArrayBufferView(input: Uint8Array): Uint8Array {
  return new Uint8Array(input); // guaranteed ArrayBuffer-backed
}

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
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(text: string, password: string, existingSalt?: string) {
  const iv = ensureArrayBufferView(crypto.getRandomValues(new Uint8Array(12)));
  const salt = ensureArrayBufferView(
    existingSalt ? base64ToArrayBuffer(existingSalt) : crypto.getRandomValues(new Uint8Array(16))
  );

  const key = await deriveKeyFromPassword(password, salt);
  const encoder = new TextEncoder();
  const data = ensureArrayBufferView(encoder.encode(text));

  const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, data);

  return {
    encrypted: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
  };
}

export async function decryptText(encryptedBase64: string, ivBase64: string, saltBase64: string, password: string) {
  const encryptedData = ensureArrayBufferView(base64ToArrayBuffer(encryptedBase64));
  const iv = ensureArrayBufferView(base64ToArrayBuffer(ivBase64));
  const salt = ensureArrayBufferView(base64ToArrayBuffer(saltBase64));

  const key = await deriveKeyFromPassword(password, salt);

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encryptedData);

  return new TextDecoder().decode(decrypted);
}
