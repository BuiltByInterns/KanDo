/**
 * A helper function that checks the validity of an email address.
 * It uses a regular expression to validate the format of the email.
 * Returns true if the email is valid, false otherwise.
 *
 * @param {string} email - The email address to validate.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
