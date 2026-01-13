import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique server name with timestamp and random suffix
 * Format: ecs-{timestamp}-{random}
 * Example: ecs-20240115123456-a3f2
 * 
 * This function creates backend-independent server names that are
 * instantly generated without requiring API calls.
 * 
 * @returns Generated server name string
 */
export function generateServerName(): string {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `ecs-${timestamp}-${randomSuffix}`;
}

/**
 * Generate a secure password meeting complexity requirements
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * 
 * This function creates backend-independent passwords that are
 * instantly generated without requiring API calls.
 * 
 * @param length - Password length (default: 16, minimum: 8)
 * @returns Generated password string
 */
export function generateSecurePassword(length: number = 16): string {
  const minimumLength = 8;
  const actualLength = Math.max(length, minimumLength);
  
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialCharacters = '@$!%*?&';
  const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
  
  // Ensure at least one character from each required category
  let password = '';
  password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  
  // Fill the rest with random characters from all categories
  for (let i = password.length; i < actualLength; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
}

/**
 * Local Storage Key for Credentials
 */
const CREDENTIALS_STORAGE_KEY = 'ecs-credentials';

/**
 * Credential interface for local storage
 */
export interface LocalCredential {
  id: string;
  customer: string;
  provider: string;
  accessKey: string;
  secretKey: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Save credentials to local storage
 * Stores customer, provider, access key, and secret key locally
 * 
 * @param credential - Credential object to save
 */
export function saveCredentialToLocalStorage(credential: LocalCredential): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existingCredentials = getCredentialsFromLocalStorage();
    const updatedCredentials = existingCredentials.filter(
      (cred) => cred.id !== credential.id
    );
    updatedCredentials.push(credential);
    
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedCredentials));
  } catch (error) {
    console.error('Failed to save credential to localStorage:', error);
  }
}

/**
 * Get all credentials from local storage
 * 
 * @returns Array of credentials
 */
export function getCredentialsFromLocalStorage(): LocalCredential[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as LocalCredential[];
  } catch (error) {
    console.error('Failed to read credentials from localStorage:', error);
    return [];
  }
}

/**
 * Get credentials by customer and provider
 * 
 * @param customer - Customer name
 * @param provider - Provider name
 * @returns Array of matching credentials
 */
export function getCredentialsByCustomerAndProvider(
  customer: string,
  provider: string
): LocalCredential[] {
  const allCredentials = getCredentialsFromLocalStorage();
  return allCredentials.filter(
    (cred) => cred.customer === customer && cred.provider === provider
  );
}

/**
 * Delete credential from local storage
 * 
 * @param credentialId - ID of credential to delete
 */
export function deleteCredentialFromLocalStorage(credentialId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existingCredentials = getCredentialsFromLocalStorage();
    const updatedCredentials = existingCredentials.filter(
      (cred) => cred.id !== credentialId
    );
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedCredentials));
  } catch (error) {
    console.error('Failed to delete credential from localStorage:', error);
  }
}

/**
 * Get unique customers from stored credentials
 * 
 * @returns Array of unique customer names
 */
export function getUniqueCustomersFromStorage(): string[] {
  const credentials = getCredentialsFromLocalStorage();
  const customers = credentials.map((cred) => cred.customer);
  return Array.from(new Set(customers));
}

/**
 * Get unique providers from stored credentials
 * 
 * @returns Array of unique provider names
 */
export function getUniqueProvidersFromStorage(): string[] {
  const credentials = getCredentialsFromLocalStorage();
  const providers = credentials.map((cred) => cred.provider);
  return Array.from(new Set(providers));
}

