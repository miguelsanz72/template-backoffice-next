import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateStrongPassword = (): string => {
  const minLength = 12;
  const minLowercase = 1;
  const minUppercase = 1;
  const minNumbers = 1;
  const minSymbols = 1;
  const length = minLength; // define the desired length of the password
  const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbersCharset = '0123456789';
  const symbolsCharset = '!@#$%^&*()_+';
  let password = '';

  // Generate lowercase characters
  for (let i = 0; i < minLowercase; i++) {
    password += lowercaseCharset?.charAt(Math.floor(Math.random() * lowercaseCharset.length));
  }

  // Generate uppercase characters
  for (let i = 0; i < minUppercase; i++) {
    password += uppercaseCharset?.charAt(Math.floor(Math.random() * uppercaseCharset?.length));
  }

  // Generate numbers
  for (let i = 0; i < minNumbers; i++) {
    password += numbersCharset?.charAt(Math.floor(Math.random() * numbersCharset?.length));
  }

  // Generate symbols
  for (let i = 0; i < minSymbols; i++) {
    password += symbolsCharset?.charAt(Math.floor(Math.random() * symbolsCharset?.length));
  }

  // Generate remaining characters
  const remainingLength = length - (minLowercase + minUppercase + minNumbers + minSymbols);
  const charset = lowercaseCharset + uppercaseCharset + numbersCharset + symbolsCharset;
  for (let i = 0; i < remainingLength; i++) {
    password += charset?.charAt(Math.floor(Math.random() * charset?.length));
  }

  return password;
};
