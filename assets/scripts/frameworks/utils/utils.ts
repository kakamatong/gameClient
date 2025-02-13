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

// 新增HMAC64实现
export const hmac64 = (key: CryptoJS.lib.WordArray, message: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    // 将WordArray转换为Uint32数组（小端序）
    const toUint32ArrayLE = (wa: CryptoJS.lib.WordArray) => {
        const bytes = wa.toString(CryptoJS.enc.Hex).match(/.{8}/g) || [];
        return bytes.map(b => parseInt(b.split(/(?=(?:..)*$)/).reverse().join(''), 16));
    };

    // 服务端特定的MD5压缩函数
    const digestMD5 = (w: number[]): number[] => {
        let a = 0x67452301;
        let b = 0xefcdab89;
        let c = 0x98badcfe;
        let d = 0x10325476;

        // MD5压缩函数常量
        const k = [
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
            0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
            0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
            0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
            0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
            0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
            0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
        ];
        const r = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

        for (let i = 0; i < 64; i++) {
            let f, g;
            if (i < 16) {
                f = (b & c) | ((~b) & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | ((~d) & c);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3 * i + 5) % 16;
            } else {
                f = c ^ (b | (~d));
                g = (7 * i) % 16;
            }

            const temp = d;
            d = c;
            c = b;
            b = b + ((a + f + k[i] + w[g]) << r[i % 16] | (a + f + k[i] + w[g]) >>> (32 - r[i % 16]));
            a = temp;
        }

        return [a, b, c, d];
    };

    // 构造输入数组（与服务端一致）
    const keyParts = toUint32ArrayLE(key);
    const msgParts = toUint32ArrayLE(message);
    const w = [];
    for (let i = 0; i < 16; i += 4) {
        w.push(keyParts[1], keyParts[0], msgParts[1], msgParts[0]);
    }

    // 执行MD5压缩
    const r = digestMD5(w);

    // 结果处理（异或操作）
    const result = [
        (r[2] ^ r[3]) >>> 0,
        (r[0] ^ r[1]) >>> 0
    ];

    // 转换为WordArray（小端序）
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(0, result[1], true); // 小端序
    view.setUint32(4, result[0], true);
    return CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
};