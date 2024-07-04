declare module 'crypto-browserify' {
    import { Hash as NodeHash, Hmac as NodeHmac } from 'crypto';

    interface Hash extends NodeHash {}
    interface Hmac extends NodeHmac {}

    export function createHash(algorithm: string): Hash;
    export function createHmac(algorithm: string, key: string | Buffer | Uint8Array): Hmac;
}
