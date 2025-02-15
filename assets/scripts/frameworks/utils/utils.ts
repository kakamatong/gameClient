import CryptoJS from '../libs/crypto-js-4.2.0/crypto-js.js';
// DH参数配置
const DH_GENERATOR = 5n;
const DH_PRIME = 0xFFFFFFFFFFFFFFC5n;

// 字节转换工具
const toUint64LE = (wa: CryptoJS.lib.WordArray): bigint => {
    const bytes = wa.toString(CryptoJS.enc.Hex).match(/.{8}/g) || [];
    const [low, high] = bytes.map(b => 
        parseInt(b.split(/(?=(?:..)*$)/).reverse().join(''), 16)
    );
    return (BigInt(high) << 32n) | BigInt(low);
};

const fromUint64LE = (n: bigint): CryptoJS.lib.WordArray => {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(0, Number(n & 0xFFFFFFFFn), true);
    view.setUint32(4, Number(n >> 32n), true);
    return CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
};

// 与服务端完全一致的模乘算法
const mul_mod_p = (a: bigint, b: bigint): bigint => {
    let m = 0n;
    while (b > 0n) {
        if (b & 1n) {
            const t = DH_PRIME - a;
            m = (m >= t) ? m - t : m + a;
            if (m >= DH_PRIME) m -= DH_PRIME;
        }
        a = (a >= DH_PRIME - a) ? 
            (a * 2n - DH_PRIME) : 
            (a * 2n);
        b >>= 1n;
    }
    return m % DH_PRIME;
};

// 递归实现的模幂运算
const pow_mod_p = (a: bigint, b: bigint): bigint => {
    if (b === 1n) return a;
    let t = pow_mod_p(a, b >> 1n);
    t = mul_mod_p(t, t);
    return (b % 2n === 1n) ? mul_mod_p(t, a) : t;
};

// 修正缓存实现
const DH_CACHE = new Map<string, CryptoJS.lib.WordArray>();

// 与服务端一致的DH交换实现
export const dhexchange = (clientKey: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    const cacheKey = clientKey.toString();
    if (DH_CACHE.has(cacheKey)) {
        // 返回缓存值的克隆
        return DH_CACHE.get(cacheKey)!.clone();
    }
    
    const x = toUint64LE(clientKey);
    if (x === 0n) throw new Error("Invalid DH key");
    
    // 生成结果并转换为WordArray
    const result = fromUint64LE(pow_mod_p(DH_GENERATOR, x));
    
    // 存储克隆到缓存
    DH_CACHE.set(cacheKey, result.clone());
    
    // 返回结果克隆
    return result.clone();
};

// 共享密钥计算
export const dhsecret = (serverKey: CryptoJS.lib.WordArray, clientKey: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    const B = toUint64LE(serverKey);
    const a = toUint64LE(clientKey);
    const result = pow_mod_p(B, a);
    return fromUint64LE(result);
};

// 64位无符号整数转换（小端序）
const toUint64PairLE = (wa: CryptoJS.lib.WordArray): [number, number] => {
    // 将WordArray转换为8字节的十六进制字符串
    const hex = wa.toString(CryptoJS.enc.Hex).padStart(16, '0');
    
    // 分割为高低各4字节（小端序）
    const lowBytes = hex.substr(0, 8).match(/.{2}/g)?.reverse().join('') || '00000000';
    const highBytes = hex.substr(8, 8).match(/.{2}/g)?.reverse().join('') || '00000000';

    // 转换为32位无符号整数
    return [
        parseInt(lowBytes, 16) >>> 0,  // 低32位
        parseInt(highBytes, 16) >>> 0   // 高32位
    ];
};

// 修正后的MD5压缩函数（强制无符号运算）
const digestMD5 = (w: number[]): number[] => {
    // 初始化无符号32位整数
    let a = 0x67452301 >>> 0;
    let b = 0xefcdab89 >>> 0;
    let c = 0x98badcfe >>> 0;
    let d = 0x10325476 >>> 0;

    // 使用原始C常量数组
    const k = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee ,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 
    ];
    const r = [
        7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
        5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
        4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
        6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21
    ];

    for (let i = 0; i < 64; i++) {
        let f, g;
        if (i < 16) {
            f = (b & c) | ((~b) & d);
            g = i;
        } else if (i < 32) {
            f = (d & b) | ((~d) & c);
            g = (5*i + 1) % 16;
        } else if (i < 48) {
            f = b ^ c ^ d;
            g = (3*i + 5) % 16;
        } else {
            f = c ^ (b | (~d));
            g = (7*i) % 16;
        }

        const temp = d;
        d = c;
        c = b;
        
        // 强制无符号运算
        const sum = (a + f + k[i] + w[g]) >>> 0;
        const rotated = ((sum << r[i]) | (sum >>> (32 - r[i]))) >>> 0;
        b = (b + rotated) >>> 0;
        a = temp;

    }

    return [a, b, c, d];
};

// 更新后的HMAC64实现
export const hmac64 = (key: CryptoJS.lib.WordArray, message: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    // 转换输入为64位无符号整数对
    const keyPair = toUint64PairLE(key);
    const msgPair = toUint64PairLE(message);

    // 构造输入数组（关键修正点）
    const w = new Array(16);
    for (let i = 0; i < 16; i += 4) {
        w[i]   = keyPair[1];  // 修正为小端序低位在前
        w[i+1] = keyPair[0];  // 小端序高位在后
        w[i+2] = msgPair[1];
        w[i+3] = msgPair[0];
    }

    // 执行压缩并处理结果
    const [A, B, C, D] = digestMD5(w);
    console.log('A:', A);
    console.log('B:', B);
    console.log('C:', C);
    console.log('D:', D);
    const result = new Uint32Array([
        (C ^ D) >>> 0,  // 小端序低位
        (A ^ B) >>> 0   // 小端序高位
    ]);

    // 转换为8字节小端序
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(0, result[0], true);
    view.setUint32(4, result[1], true);
    
    return CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
};