// Type definitions for crypto-js 4.2.0
// Project: https://github.com/brix/crypto-js
// Definitions by: AI生成
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// 主命名空间
declare namespace CryptoJS {
  // WordArray类
  class WordArray {
    words: number[];
    sigBytes: number;
    constructor(words?: number[], sigBytes?: number);
    toString(encoder?: Encoder): string;
    concat(wordArray: WordArray): WordArray;
    clamp(): void;
    clone(): WordArray;
    static create(words?: number[], sigBytes?: number): WordArray;
    static random(nBytes: number): WordArray;
  }

  // 编码器接口
  interface Encoder {
    stringify(wordArray: WordArray): string;
    parse(str: string): WordArray;
  }

  // 编码方式
  namespace enc {
    const Hex: Encoder;
    const Utf8: Encoder;
    const Latin1: Encoder;
    const Base64: Encoder;
    const Base64url: Encoder;
  }

  // 格式化
  namespace format {
    const Hex: {
      stringify(cipherParams: CipherParams): string;
      parse(str: string): CipherParams;
    };
    const OpenSSL: {
      stringify(cipherParams: CipherParams): string;
      parse(str: string): CipherParams;
    };
  }

  // 填充
  namespace pad {
    const Pkcs7: Padding;
    const AnsiX923: Padding;
    const Iso10126: Padding;
    const Iso97971: Padding;
    const ZeroPadding: Padding;
    const NoPadding: Padding;
  }
  interface Padding {
    pad(data: WordArray, blockSize: number): void;
    unpad(data: WordArray): void;
  }

  // CipherParams类
  class CipherParams {
    ciphertext: WordArray;
    key?: WordArray;
    iv?: WordArray;
    salt?: WordArray;
    algorithm?: object;
    mode?: object;
    padding?: object;
    blockSize?: number;
    formatter?: object;
    toString(formatter?: object): string;
    static create(params: object): CipherParams;
  }

  // 通用算法接口
  interface Hasher {
    update(messageUpdate: string | WordArray): Hasher;
    finalize(messageUpdate?: string | WordArray): WordArray;
    clone(): Hasher;
  }

  // 算法命名空间
  namespace algo {
    class SHA1 extends Hasher {}
    class SHA256 extends Hasher {}
    class SHA224 extends Hasher {}
    class SHA384 extends Hasher {}
    class SHA512 extends Hasher {}
    class SHA3 extends Hasher {
      constructor(cfg?: { outputLength?: number });
    }
    class MD5 extends Hasher {}
    class RIPEMD160 extends Hasher {}
    class HMAC extends Hasher {
      constructor(hasher: Hasher, key: string | WordArray);
    }
    class PBKDF2 {
      constructor(cfg?: { keySize?: number; hasher?: Hasher; iterations?: number });
      compute(password: string | WordArray, salt: string | WordArray): WordArray;
    }
    // 还有AES、DES、TripleDES、RC4、Rabbit、Blowfish等对称加密算法
  }

  // 哈希算法
  function MD5(message: string | WordArray): WordArray;
  function SHA1(message: string | WordArray): WordArray;
  function SHA224(message: string | WordArray): WordArray;
  function SHA256(message: string | WordArray): WordArray;
  function SHA384(message: string | WordArray): WordArray;
  function SHA512(message: string | WordArray): WordArray;
  function SHA3(message: string | WordArray, options?: { outputLength?: number }): WordArray;
  function RIPEMD160(message: string | WordArray): WordArray;

  // HMAC
  function HmacMD5(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA1(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA224(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA256(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA384(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA512(message: string | WordArray, key: string | WordArray): WordArray;
  function HmacSHA3(message: string | WordArray, key: string | WordArray, options?: { outputLength?: number }): WordArray;
  function HmacRIPEMD160(message: string | WordArray, key: string | WordArray): WordArray;

  // PBKDF2
  function PBKDF2(password: string | WordArray, salt: string | WordArray, cfg?: { keySize?: number; hasher?: Hasher; iterations?: number }): WordArray;

  // 对称加密算法
  namespace AES {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }
  namespace DES {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }
  namespace TripleDES {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }
  namespace RC4 {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }
  namespace Rabbit {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }
  namespace Blowfish {
    function encrypt(message: string | WordArray, key: string | WordArray, cfg?: object): CipherParams;
    function decrypt(ciphertext: string | CipherParams, key: string | WordArray, cfg?: object): WordArray;
  }

  // 工具类
  namespace lib {
    const WordArray: typeof CryptoJS.WordArray;
    const Base: any;
    const CipherParams: typeof CryptoJS.CipherParams;
  }
}

declare module "crypto-js" {
  export = CryptoJS;
} 