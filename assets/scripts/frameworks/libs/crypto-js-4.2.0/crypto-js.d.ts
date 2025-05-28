// 让TypeScript知道如何import本地js
declare const CryptoJS: typeof import("./index");
export = CryptoJS;