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

