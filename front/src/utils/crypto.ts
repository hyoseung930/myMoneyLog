const PBKDF2_ITERATIONS = 100000;
const MASTER_KEY_LENGTH = 256;

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function generateMasterKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: MASTER_KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportMasterKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

export async function importMasterKey(keyData: string): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(keyData);
  return await crypto.subtle.importKey(
    'raw',
    buffer,
    {
      name: 'AES-GCM',
      length: MASTER_KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptWithKey(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    dataBuffer
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
  };
}

export async function decryptWithKey(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
  const ivBuffer = base64ToArrayBuffer(iv);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer,
    },
    key,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function saltToString(salt: Uint8Array): string {
  return arrayBufferToBase64(salt);
}

export function stringToSalt(saltString: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(saltString));
}

export function generateRecoveryPhrase(): string {
  const words = [
    'apple', 'banana', 'cherry', 'dragon', 'elephant', 'falcon', 'garden', 'hammer',
    'island', 'jacket', 'kangaroo', 'lemon', 'mountain', 'notebook', 'ocean', 'pencil',
    'queen', 'rainbow', 'sunset', 'tiger', 'umbrella', 'village', 'window', 'xylophone',
    'yellow', 'zebra', 'anchor', 'bridge', 'candle', 'diamond', 'engine', 'flower',
    'guitar', 'holiday', 'internet', 'journey', 'kitchen', 'library', 'melody', 'network',
    'orange', 'planet', 'question', 'rocket', 'shadow', 'thunder', 'universe', 'victory',
  ];

  const selected: string[] = [];
  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selected.push(words[randomIndex]);
  }

  return selected.join(' ');
}

export async function encryptMasterKeyWithPassword(
  masterKey: CryptoKey,
  password: string
): Promise<{ encryptedKey: string; salt: string; iv: string }> {
  const salt = generateSalt();
  const passwordKey = await deriveKeyFromPassword(password, salt);

  const exportedMasterKey = await exportMasterKey(masterKey);
  const { ciphertext, iv } = await encryptWithKey(exportedMasterKey, passwordKey);

  return {
    encryptedKey: ciphertext,
    salt: saltToString(salt),
    iv: iv,
  };
}

export async function decryptMasterKeyWithPassword(
  encryptedKey: string,
  iv: string,
  salt: string,
  password: string
): Promise<CryptoKey> {
  const saltBuffer = stringToSalt(salt);
  const passwordKey = await deriveKeyFromPassword(password, saltBuffer);

  const decryptedKeyData = await decryptWithKey(encryptedKey, iv, passwordKey);
  return await importMasterKey(decryptedKeyData);
}

export async function encryptMasterKeyWithRecovery(
  masterKey: CryptoKey,
  recoveryPhrase: string
): Promise<{ encryptedKey: string; salt: string; iv: string }> {
  const salt = generateSalt();
  const recoveryKey = await deriveKeyFromPassword(recoveryPhrase, salt);

  const exportedMasterKey = await exportMasterKey(masterKey);
  const { ciphertext, iv } = await encryptWithKey(exportedMasterKey, recoveryKey);

  return {
    encryptedKey: ciphertext,
    salt: saltToString(salt),
    iv: iv,
  };
}
