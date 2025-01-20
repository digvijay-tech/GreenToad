// Utility functions for validating user inputs or incoming data
import { isStrongPassword } from "validator";
import {
  PASSWORD_MINLEN,
  PASSWORD_MIN_LCASE,
  PASSWORD_MIN_UCASE,
  PASSWORD_MIN_NUMS,
  PASSWORD_MIN_SYMBOLS,
} from "@/utils/constants/password";
import { MAX_BOARD_NAME_LEN, MIN_BOARD_NAME_LEN, } from "@/utils/constants/board";

// Function to validate a password
// @param input: string - The password to validate
// @returns: boolean - Whether the password meets the criteria
export const isValidPassword = (input: string): boolean => {
  const options = {
    minLength: PASSWORD_MINLEN,
    minLowercase: PASSWORD_MIN_LCASE,
    minUppercase: PASSWORD_MIN_UCASE,
    minNumbers: PASSWORD_MIN_NUMS,
    minSymbols: PASSWORD_MIN_SYMBOLS,
  };

  return isStrongPassword(input, options);
};


// Function to validate board name length
// @param input: string - The board name
// @returns: boolean - Whether the length meets the criteria
export const isValidBoardName = (input: string): boolean => {
  if (input.length > MAX_BOARD_NAME_LEN || input.length < MIN_BOARD_NAME_LEN) return false;

  return true;
}
