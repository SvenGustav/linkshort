import { customAlphabet } from 'nanoid';

// Exclude confusing characters (I, l, 1, 0, O) and use a mix of numbers and letters
const alphabet = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

export function generateShortId(): string {
    return nanoid(); // Generates a unique short ID of length 6
}