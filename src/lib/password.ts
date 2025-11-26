import bcrypt from "bcryptjs"

const SALT_ROUNDS = 12

/**
 * Hash a plain text password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a plain text password against a hash
 * @param password Plain text password
 * @param hash Hashed password from database
 * @returns True if password matches
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
