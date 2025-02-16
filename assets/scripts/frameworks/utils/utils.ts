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

// DES解密核心实现
export const desdecode = (encrypted: CryptoJS.lib.WordArray, key: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    const subkeys = generateSubkeys(key);
    const blocks = splitIntoBlocks(encrypted);
    const decryptedBlocks = blocks.map(block => decryptBlock(block, subkeys));
    return removePadding(mergeBlocks(decryptedBlocks));
};

// DES核心实现
const DES_IP = (X: number, Y: number): [number, number] => {
    let T = ((X >> 4) ^ Y) & 0x0F0F0F0F;
    Y ^= T; X ^= (T << 4);
    T = ((X >> 16) ^ Y) & 0x0000FFFF;
    Y ^= T; X ^= (T << 16);
    T = ((Y >> 2) ^ X) & 0x33333333;
    X ^= T; Y ^= (T << 2);
    T = ((Y >> 8) ^ X) & 0x00FF00FF;
    X ^= T; Y ^= (T << 8);
    Y = ((Y << 1) | (Y >>> 31)) & 0xFFFFFFFF;
    T = (X ^ Y) & 0xAAAAAAAA;
    Y ^= T; X ^= T;
    X = ((X << 1) | (X >>> 31)) & 0xFFFFFFFF;
    return [X, Y];
};

const DES_FP = (X: number, Y: number): [number, number] => {
    X = ((X << 31) | (X >>> 1)) & 0xFFFFFFFF;
    let T = (X ^ Y) & 0xAAAAAAAA;
    X ^= T; Y ^= T;
    Y = ((Y << 31) | (Y >>> 1)) & 0xFFFFFFFF;
    T = ((Y >> 8) ^ X) & 0x00FF00FF;
    X ^= T; Y ^= (T << 8);
    T = ((Y >> 2) ^ X) & 0x33333333;
    X ^= T; Y ^= (T << 2);
    T = ((X >> 16) ^ Y) & 0x0000FFFF;
    Y ^= T; X ^= (T << 16);
    T = ((X >> 4) ^ Y) & 0x0F0F0F0F;
    Y ^= T; X ^= (T << 4);
    return [X, Y];
};

const DES_ROUND = (X: number, Y: number, sk1: number, sk2: number): [number, number] => {
    let T = sk1 ^ X;
    Y ^= SB8[T & 0x3F] ^ SB6[(T >> 8) & 0x3F] ^ 
         SB4[(T >> 16) & 0x3F] ^ SB2[(T >> 24) & 0x3F];
    
    T = sk2 ^ ((X << 28) | (X >> 4));
    Y ^= SB7[T & 0x3F] ^ SB5[(T >> 8) & 0x3F] ^ 
         SB3[(T >> 16) & 0x3F] ^ SB1[(T >> 24) & 0x3F];
    
    return [Y, X];
};

const LHs: number[] = [
	0x00000000, 0x00000001, 0x00000100, 0x00000101,
	0x00010000, 0x00010001, 0x00010100, 0x00010101,
	0x01000000, 0x01000001, 0x01000100, 0x01000101,
	0x01010000, 0x01010001, 0x01010100, 0x01010101
];

const RHs: number[] = [
	0x00000000, 0x01000000, 0x00010000, 0x01010000,
	0x00000100, 0x01000100, 0x00010100, 0x01010100,
	0x00000001, 0x01000001, 0x00010001, 0x01010001,
	0x00000101, 0x01000101, 0x00010101, 0x01010101,
];

// DES S-Boxes (直接来自C语言实现)
const SB1: number[] = [
    0x01010400, 0x00000000, 0x00010000, 0x01010404,
    0x01010004, 0x00010404, 0x00000004, 0x00010000,
    0x00000400, 0x01010400, 0x01010404, 0x00000400,
    0x01000404, 0x01010004, 0x01000000, 0x00000004,
    0x00000404, 0x01000400, 0x01000400, 0x00010400,
    0x00010400, 0x01010000, 0x01010000, 0x01000404,
    0x00010004, 0x01000004, 0x01000004, 0x00010004,
    0x00000000, 0x00000404, 0x00010404, 0x01000000,
    0x00010000, 0x01010404, 0x00000004, 0x01010000,
    0x01010400, 0x01000000, 0x01000000, 0x00000400,
    0x01010004, 0x00010000, 0x00010400, 0x01000004,
    0x00000400, 0x00000004, 0x01000404, 0x00010404,
    0x01010404, 0x00010004, 0x01010000, 0x01000404,
    0x01000004, 0x00000404, 0x00010404, 0x01010400,
    0x00000404, 0x01000400, 0x01000400, 0x00000000,
    0x00010004, 0x00010400, 0x00000000, 0x01010004
];

const SB2: number[] = [
    0x80108020, 0x80008000, 0x00008000, 0x00108020,
    0x00100000, 0x00000020, 0x80100020, 0x80008020,
    0x80000020, 0x80108020, 0x80108000, 0x80000000,
    0x80008000, 0x00100000, 0x00000020, 0x80100020,
    0x00108000, 0x00100020, 0x80008020, 0x00000000,
    0x80000000, 0x00008000, 0x00108020, 0x80100000,
    0x00100020, 0x80000020, 0x00000000, 0x00108000,
    0x00008020, 0x80108000, 0x80100000, 0x00008020,
    0x00000000, 0x00108020, 0x80100020, 0x00100000,
    0x80008020, 0x80100000, 0x80108000, 0x00008000,
    0x80100000, 0x80008000, 0x00000020, 0x80108020,
    0x00108020, 0x00000020, 0x00008000, 0x80000000,
    0x00008020, 0x80108000, 0x00100000, 0x80000020,
    0x00100020, 0x80008020, 0x80000020, 0x00100020,
    0x00108000, 0x00000000, 0x80008000, 0x00008020,
    0x80000000, 0x80100020, 0x80108020, 0x00108000
];

// 剩余S-Box定义（结构类似，需完整复制）
const SB3: number[] = [
    0x00000208, 0x08020200, 0x00000000, 0x08020008,
    0x08000200, 0x00000000, 0x00020208, 0x08000200,
    0x00020008, 0x08000008, 0x08000008, 0x00020000,
    0x08020208, 0x00020008, 0x08020000, 0x00000208,
    0x08000000, 0x00000008, 0x08020200, 0x00000200,
    0x00020200, 0x08020000, 0x08020008, 0x00020208,
    0x08000208, 0x00020200, 0x00020000, 0x08000208,
    0x00000008, 0x08020208, 0x00000200, 0x08000000,
    0x08020200, 0x08000000, 0x00020008, 0x00000208,
    0x00020000, 0x08020200, 0x08000200, 0x00000000,
    0x00000200, 0x00020008, 0x08020208, 0x08000200,
    0x08000008, 0x00000200, 0x00000000, 0x08020008,
    0x08000208, 0x00020000, 0x08000000, 0x08020208,
    0x00000008, 0x00020208, 0x00020200, 0x08000008,
    0x08020000, 0x08000208, 0x00000208, 0x08020000,
    0x00020208, 0x00000008, 0x08020008, 0x00020200
];

const SB4: number[] = [
    0x00802001, 0x00002081, 0x00002081, 0x00000080,
    0x00802080, 0x00800081, 0x00800001, 0x00002001,
    0x00000000, 0x00802000, 0x00802000, 0x00802081,
    0x00000081, 0x00000000, 0x00800080, 0x00800001,
    0x00000001, 0x00002000, 0x00800000, 0x00802001,
    0x00000080, 0x00800000, 0x00002001, 0x00002080,
    0x00800081, 0x00000001, 0x00002080, 0x00800080,
    0x00002000, 0x00802080, 0x00802081, 0x00000081,
    0x00800080, 0x00800001, 0x00802000, 0x00802081,
    0x00000081, 0x00000000, 0x00000000, 0x00802000,
    0x00002080, 0x00800080, 0x00800081, 0x00000001,
    0x00802001, 0x00002081, 0x00002081, 0x00000080,
    0x00802081, 0x00000081, 0x00000001, 0x00002000,
    0x00800001, 0x00002001, 0x00802080, 0x00800081,
    0x00002001, 0x00002080, 0x00800000, 0x00802001,
    0x00000080, 0x00800000, 0x00002000, 0x00802080
];

const SB5: number[] = [
    0x00000100, 0x02080100, 0x02080000, 0x42000100,
    0x00080000, 0x00000100, 0x40000000, 0x02080000,
    0x40080100, 0x00080000, 0x02000100, 0x40080100,
    0x42000100, 0x42080000, 0x00080100, 0x40000000,
    0x02000000, 0x40080000, 0x40080000, 0x00000000,
    0x40000100, 0x42080100, 0x42080100, 0x02000100,
    0x42080000, 0x40000100, 0x00000000, 0x42000000,
    0x02080100, 0x02000000, 0x42000000, 0x00080100,
    0x00080000, 0x42000100, 0x00000100, 0x02000000,
    0x40000000, 0x02080000, 0x42000100, 0x40080100,
    0x02000100, 0x40000000, 0x42080000, 0x02080100,
    0x40080100, 0x00000100, 0x02000000, 0x42080000,
    0x42080100, 0x00080100, 0x42000000, 0x42080100,
    0x02080000, 0x00000000, 0x40080000, 0x42000000,
    0x00080100, 0x02000100, 0x40000100, 0x00080000,
    0x00000000, 0x40080000, 0x02080100, 0x40000100
];

const SB6: number[] = [
    0x20000010, 0x20400000, 0x00004000, 0x20404010,
    0x20400000, 0x00000010, 0x20404010, 0x00400000,
    0x20004000, 0x00404010, 0x00400000, 0x20000010,
    0x00400010, 0x20004000, 0x20000000, 0x00004010,
    0x00000000, 0x00400010, 0x20004010, 0x00004000,
    0x00404000, 0x20004010, 0x00000010, 0x20400010,
    0x20400010, 0x00000000, 0x00404010, 0x20404000,
    0x00004010, 0x00404000, 0x20404000, 0x20000000,
    0x20004000, 0x00000010, 0x20400010, 0x00404000,
    0x20404010, 0x00400000, 0x00004010, 0x20000010,
    0x00400000, 0x20004000, 0x20000000, 0x00004010,
    0x20000010, 0x20404010, 0x00404000, 0x20400000,
    0x00404010, 0x20404000, 0x00000000, 0x20400010,
    0x00000010, 0x00004000, 0x20400000, 0x00404010,
    0x00004000, 0x00400010, 0x20004010, 0x00000000,
    0x20404000, 0x20000000, 0x00400010, 0x20004010
];

const SB7: number[] = [
    0x00200000, 0x04200002, 0x04000802, 0x00000000,
    0x00000800, 0x04000802, 0x00200802, 0x04200800,
    0x04200802, 0x00200000, 0x00000000, 0x04000002,
    0x00000002, 0x04000000, 0x04200002, 0x00000802,
    0x04000800, 0x00200802, 0x00200002, 0x04000800,
    0x04000002, 0x04200000, 0x04200800, 0x00200002,
    0x04200000, 0x00000800, 0x00000802, 0x04200802,
    0x00200800, 0x00000002, 0x04000000, 0x00200800,
    0x04000000, 0x00200800, 0x00200000, 0x04000802,
    0x04000802, 0x04200002, 0x04200002, 0x00000002,
    0x00200002, 0x04000000, 0x04000800, 0x00200000,
    0x04200800, 0x00000802, 0x00200802, 0x04200800,
    0x00000802, 0x04000002, 0x04200802, 0x04200000,
    0x00200800, 0x00000000, 0x00000002, 0x04200802,
    0x00000000, 0x00200802, 0x04200000, 0x00000800,
    0x04000002, 0x04000800, 0x00000800, 0x00200002
];

const SB8: number[] = [
    0x10001040, 0x00001000, 0x00040000, 0x10041040,
    0x10000000, 0x10001040, 0x00000040, 0x10000000,
    0x00040040, 0x10040000, 0x10041040, 0x00041000,
    0x10041000, 0x00041040, 0x00001000, 0x00000040,
    0x10040000, 0x10000040, 0x10001000, 0x00001040,
    0x00041000, 0x00040040, 0x10040040, 0x10041000,
    0x00001040, 0x00000000, 0x00000000, 0x10040040,
    0x10000040, 0x10001000, 0x00041040, 0x00040000,
    0x00041040, 0x00040000, 0x10041000, 0x00001000,
    0x00000040, 0x10040040, 0x00001000, 0x00041040,
    0x10001000, 0x00000040, 0x10000040, 0x10040000,
    0x10040040, 0x10000000, 0x00040000, 0x10001040,
    0x00000000, 0x10041040, 0x00040040, 0x10000040,
    0x10040000, 0x10001000, 0x10001040, 0x00000000,
    0x10041040, 0x00041000, 0x00041000, 0x00001040,
    0x00001040, 0x00040040, 0x10000000, 0x10041000
];

// 修正子密钥生成函数
const generateSubkeys = (key: CryptoJS.lib.WordArray): number[] => {
    const keyBytes = wordArrayToBytes(key);
    
    // 确保32位无符号整型
    let X = ((keyBytes[0] << 24) | (keyBytes[1] << 16) | (keyBytes[2] << 8) | keyBytes[3]) >>> 0;
    let Y = ((keyBytes[4] << 24) | (keyBytes[5] << 16) | (keyBytes[6] << 8) | keyBytes[7]) >>> 0;
    console.log('X:', X);
    console.log('Y:', Y);

    // PC1置换（添加调试日志）
    let T = ((Y >>> 4) ^ X) & 0x0F0F0F0F;
    X ^= T; 
    Y ^= (T << 4);
    T = ((Y) ^ X) & 0x10101010;
    X ^= T; 
    Y ^= (T);
    console.log('PC1后 X:', X.toString(16), 'Y:', Y.toString(16));

    // 应用置换表（强制转换为uint32）
    X = (
        (LHs[(X) & 0xF] << 3) | (LHs[(X >>> 8) & 0xF] << 2) |
        (LHs[(X >>> 16) & 0xF] << 1) | LHs[(X >>> 24) & 0xF] |
        (LHs[(X >>> 5) & 0xF] << 7) | (LHs[(X >>> 13) & 0xF] << 6) |
        (LHs[(X >>> 21) & 0xF] << 5) | (LHs[(X >>> 29) & 0xF] << 4)
    ) >>> 0; // 确保无符号

    Y = (
        (RHs[(Y >>> 1) & 0xF] << 3) | (RHs[(Y >>> 9) & 0xF] << 2) |
        (RHs[(Y >>> 17) & 0xF] << 1) | RHs[(Y >>> 25) & 0xF] |
        (RHs[(Y >>> 4) & 0xF] << 7) | (RHs[(Y >>> 12) & 0xF] << 6) |
        (RHs[(Y >>> 20) & 0xF] << 5) | (RHs[(Y >>> 28) & 0xF] << 4)
    ) >>> 0;
    console.log('置换表后 X:', X,   'Y:', Y);

    // 掩码处理（28位）
    X &= 0x0FFFFFFF;
    Y &= 0x0FFFFFFF;

    const subkeys = new Array(32);
    for (let i = 0; i < 16; i++) {
        // 处理密钥移位（使用无符号右移）
        if (i < 2 || i == 8 || i == 15) {
            X = ((X << 1) | (X >>> 27)) & 0x0FFFFFFF >>> 0;
            Y = ((Y << 1) | (Y >>> 27)) & 0x0FFFFFFF >>> 0;
        } else {
            X = ((X << 2) | (X >>> 26)) & 0x0FFFFFFF >>> 0;
            Y = ((Y << 2) | (Y >>> 26)) & 0x0FFFFFFF >>> 0;
        }

        console.log('X:', X);
        console.log('Y:', Y);

        // 生成子密钥（强制32位无符号）
        subkeys[i*2] = (
            ((X << 4) & 0x24000000) | ((X << 28) & 0x10000000) |
            ((X << 14) & 0x08000000) | ((X << 18) & 0x02080000) |
            ((X << 6) & 0x01000000) | ((X << 9) & 0x00200000) |
            ((X >>> 1) & 0x00100000) | ((X << 10) & 0x00040000) |
            ((X << 2) & 0x00020000) | ((X >>> 10) & 0x00010000) |
            ((Y >>> 13) & 0x00002000) | ((Y >>> 4) & 0x00001000) |
            ((Y << 6) & 0x00000800) | ((Y >>> 1) & 0x00000400) |
            ((Y >>> 14) & 0x00000200) | (Y & 0x00000100) |
            ((Y >>> 5) & 0x00000020) | ((Y >>> 10) & 0x00000010) |
            ((Y >>> 3) & 0x00000008) | ((Y >>> 18) & 0x00000004) |
            ((Y >>> 26) & 0x00000002) | ((Y >>> 24) & 0x00000001)
        ) >>> 0;

        subkeys[i*2+1] = (
            ((X << 15) & 0x20000000) | ((X << 17) & 0x10000000) |
            ((X << 10) & 0x08000000) | ((X << 22) & 0x04000000) |
            ((X >>> 2) & 0x02000000) | ((X << 1) & 0x01000000) |
            ((X << 16) & 0x00200000) | ((X << 11) & 0x00100000) |
            ((X << 3) & 0x00080000) | ((X >>> 6) & 0x00040000) |
            ((X << 15) & 0x00020000) | ((X >>> 4) & 0x00010000) |
            ((Y >>> 2) & 0x00002000) | ((Y << 8) & 0x00001000) |
            ((Y >>> 14) & 0x00000808) | ((Y >>> 9) & 0x00000400) |
            (Y & 0x00000200) | ((Y << 7) & 0x00000100) |
            ((Y >>> 7) & 0x00000020) | ((Y >>> 3) & 0x00000011) |
            ((Y << 2) & 0x00000004) | ((Y >>> 21) & 0x00000002)
        ) >>> 0;
    }
    for(let i = 0; i < 32; i++) {
        console.log(`subkeys[${i}]:`, subkeys[i]);
    }
    return subkeys;
};

// 新增WordArray转换工具函数
const wordArrayToBytes = (wa: CryptoJS.lib.WordArray): Uint8Array => {
    const bytes = new Uint8Array(wa.sigBytes);
    for (let i = 0; i < wa.sigBytes; i++) {
        bytes[i] = (wa.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
    }
    return bytes;
};

const bytesToWordArray = (bytes: Uint8Array): CryptoJS.lib.WordArray => {
    const words: number[] = [];
    for (let i = 0; i < bytes.length; i += 4) {
        let word = 0;
        for (let j = 0; j < 4 && i + j < bytes.length; j++) {
            word |= bytes[i + j] << (24 - j * 8);
        }
        words.push(word);
    }
    return CryptoJS.lib.WordArray.create(words, bytes.length);
};

// 修改块拆分逻辑（大端序）
const splitIntoBlocks = (data: CryptoJS.lib.WordArray): number[][] => {
    const bytes = wordArrayToBytes(data);
    const blocks: number[][] = [];
    for (let i = 0; i < bytes.length; i += 8) {
        const block = [
            (bytes[i] << 24) | (bytes[i+1] << 16) | (bytes[i+2] << 8) | bytes[i+3],
            (bytes[i+4] << 24) | (bytes[i+5] << 16) | (bytes[i+6] << 8) | bytes[i+7]
        ];
        blocks.push(block);
    }
    return blocks;
};

const decryptBlock = (block: number[], subkeys: number[]): number[] => {
    let [X, Y] = DES_IP(block[0], block[1]);
    for (let i = 0; i < 16; i++) {
        [X, Y] = DES_ROUND(X, Y, subkeys[15 - i*2], subkeys[15 - i*2+1]);
    }
    [Y, X] = DES_FP(Y, X);
    return [Y, X];
};

const removePadding = (data: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    const bytes = wordArrayToBytes(data);
    const padLength = bytes[bytes.length - 1];
    return bytesToWordArray(bytes.slice(0, bytes.length - padLength));
};

const mergeBlocks = (blocks: number[][]): CryptoJS.lib.WordArray => {
    const buffer = new Uint8Array(blocks.length * 8);
    blocks.forEach((block, i) => {
        const offset = i * 8;
        buffer[offset] = (block[0] >> 24) & 0xFF;
        buffer[offset+1] = (block[0] >> 16) & 0xFF;
        buffer[offset+2] = (block[0] >> 8) & 0xFF;
        buffer[offset+3] = block[0] & 0xFF;
        buffer[offset+4] = (block[1] >> 24) & 0xFF;
        buffer[offset+5] = (block[1] >> 16) & 0xFF;
        buffer[offset+6] = (block[1] >> 8) & 0xFF;
        buffer[offset+7] = block[1] & 0xFF;
    });
    return bytesToWordArray(buffer);
};

// DES加密核心函数
export const desencode = (data: CryptoJS.lib.WordArray, key: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    const subkeys = generateSubkeys(key);
    const blocks = splitIntoBlocks(data);
    
    const encryptedBlocks = blocks.map(block => {
        let [X, Y] = DES_IP(block[0], block[1]);
        for (let i = 0; i < 16; i++) {
            [X, Y] = DES_ROUND(X, Y, subkeys[i*2], subkeys[i*2+1]);
        }
        [Y, X] = DES_FP(Y, X);
        return [Y, X];
    });
    
    return mergeBlocks(encryptedBlocks);
};

// 添加ISO/IEC 7816-4填充
const addPadding = (data: CryptoJS.lib.WordArray, blockSize: number): CryptoJS.lib.WordArray => {
    const padLength = blockSize - (data.sigBytes % blockSize);
    const padded = data.clone();
    padded.concat(CryptoJS.lib.WordArray.create(
        new Uint8Array([0x80, ...new Array(padLength-1).fill(0)]),
        padLength
    ));
    return padded;
};

// 修改自定义加密方法
export const customDESEncrypt = (data: string, key: CryptoJS.lib.WordArray): number[] => {
    const dataWA = CryptoJS.enc.Utf8.parse(data);
    const encrypted = desencode(dataWA, key);
    const tokenB64 = CryptoJS.enc.Base64.stringify(encrypted);
    console.log('tokenB64:', tokenB64);
    const tokenB64Bytes = new TextEncoder().encode(tokenB64);
    const tokenB64Array = Array.from(tokenB64Bytes);
    return tokenB64Array;
}