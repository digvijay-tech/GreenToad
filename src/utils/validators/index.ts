// Utility functions for validating user inputs or incoming data
import { isStrongPassword } from "validator";

// Function to validate a password
// @param input: string - The password to validate
// @returns: boolean - Whether the password meets the criteria
export function validatePassword(input: string): boolean {
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };

  return isStrongPassword(input, options);
}
