export class CryptoUtil {
    /**
     * XOR加密/解密
     * @param rawData 原始数据
     * @param secretKey 密钥
     * @returns 处理后的数据
     */
    private static xorCrypt(rawData: string, secretKey: string): string {
        let encryptedData = '';
        for (let i = 0; i < rawData.length; i++) {
            // 对每个字符进行XOR运算
            const charCode = rawData.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
            encryptedData += String.fromCharCode(charCode);
        }
        return encryptedData;
    }

    /**
     * 加密数据
     * @param rawData 要加密的原始数据
     * @param secretKey 密钥
     */
    public static encrypt(rawData: string, secretKey: string): string {
        return this.xorCrypt(rawData, secretKey);
    }

    /**
     * 解密数据
     * @param encryptedData 加密后的数据
     * @param secretKey 密钥
     */
    public static decrypt(encryptedData: string, secretKey: string): string {
        return this.xorCrypt(encryptedData, secretKey);
    }
} 