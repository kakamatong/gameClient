declare module 'crypto-js' {
  export interface WordArray {
    words: number[];
    sigBytes: number;
    clone(): WordArray;
    concat(wordArray: WordArray): WordArray;
  }
} 