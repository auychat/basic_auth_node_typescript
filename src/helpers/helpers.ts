import crypto from "crypto"

// Secret key used for cryptographic operations
const SECRET = "CHATCHARIN-REST_API"

/* Function to generate a random value by
    -Generate a buffer of 128 random bytes
    -Convert the buffer to a string using base64 encoding
    -Return the generated random value
*/
export const random = () => crypto.randomBytes(128).toString("base64");

/* Function for authentication using HMAC-SHA256
    - Create an Hmac instance using SHA-256 hash algorithm
    - Update the Hmac with the secret key
    - Compute the hash and return it in hexadecimal format
    - Return the computed hash for authentication
*/
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac("sha256", [salt, password].join("/")).update(SECRET).digest("hex");
}