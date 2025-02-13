import CryptoJS from '../libs/crypto-js-4.2.0/crypto-js.js';
// DH参数配置
const DH_GENERATOR = CryptoJS.lib.WordArray.create(
    [0x05000000], // G = 5 (小端序表示)
    8
);
const DH_PRIME = CryptoJS.lib.WordArray.create(
    [0xffffffff, 0xffffffc5], // P = 0xFFFFFFFFFFFFFFC5
    8 // 8字节长度
);

// 新增模乘运算实现
const mulModP = (a: bigint, b: bigint): bigint => {
    const P = 0xFFFFFFFFFFFFFFC5n;
    let m = 0n;
    let currentA = a;
    let currentB = b;

    while (currentB > 0n) {
        if (currentB & 1n) {
            const t = P - currentA;
            m = (m >= t) ? m - t : m + currentA;
            if (m >= P) m -= P;
        }
        currentA = (currentA >= P - currentA) ? 
            (currentA * 2n - P) : 
            (currentA * 2n);
        currentB >>= 1n;
    }
    return m % P;
};

// 优化后的模幂运算
const powModP = (a: bigint, b: bigint): bigint => {
    const P = 0xFFFFFFFFFFFFFFC5n;
    if (b === 1n) return a;
    let t = powModP(a, b >> 1n);
    t = mulModP(t, t);
    if (b % 2n === 1n) {
        t = mulModP(t, a);
    }
    return t;
};

// 更新modExp函数
const modExp = (base: CryptoJS.lib.WordArray, exponent: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    // 将WordArray转换为BigInt（小端序）
    const toBigIntLE = (wa: CryptoJS.lib.WordArray) => {
        const bytes = CryptoJS.enc.Hex.stringify(wa).match(/.{2}/g) || [];
        return BigInt('0x' + bytes.reverse().join(''));
    };

    // 将BigInt转回WordArray（小端序）
    const toWordArrayLE = (n: bigint) => {
        const hex = n.toString(16).padStart(16, '0');
        const bytes = hex.match(/(..)/g)?.reverse().join('') || '';
        return CryptoJS.enc.Hex.parse(bytes);
    };

    const G = 2n;
    const P = 0xFFFFFFFFFFFFFFC5n;
    
    const x = toBigIntLE(exponent);
    if (x === 0n) throw new Error("Invalid DH key (zero)");

    // 计算G^x mod P
    const result = powModP(G, x);
    
    return toWordArrayLE(result);
};

// DH密钥交换实现
export const dhexchange = (clientKey: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    // 验证输入密钥长度
    if (clientKey.sigBytes !== 8) {
        throw new Error("Invalid DH key size");
    }

    // 执行模幂运算
    return modExp(DH_GENERATOR, clientKey);
};

// 密钥派生函数
export const dhsecret = (clientKey: CryptoJS.lib.WordArray, serverKey: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    // 执行模幂运算得到共享密钥
    return modExp(serverKey, clientKey);
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