var netutils = (function() {
    var t = {};

    t.array2arraybuffer = function(array) {
        var b = new ArrayBuffer(array.length);
        var v = new DataView(b, 0);
        for (var i = 0; i < array.length; i++) {
            v.setUint8(i, array[i]);
        }
        return b;
    }

    t.arraybuffer2array = function(buffer) {
        var v = new DataView(buffer, 0);
        var a = new Array();
        for (var i = 0; i < v.byteLength; i++) {
            a[i] = v.getUint8(i);
        }
        return a;
    }

    t.string2utf8 = function(str) {
        var back = [];
        var byteSize = 0;

        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            
            // 检查是否是代理对的高位代理
            if (0xD800 <= code && code <= 0xDBFF && i + 1 < str.length) {
                var nextCode = str.charCodeAt(i + 1);
                // 检查是否是代理对的低位代理
                if (0xDC00 <= nextCode && nextCode <= 0xDFFF) {
                    // 计算完整的Unicode码点
                    var fullCode = (code - 0xD800) * 0x400 + (nextCode - 0xDC00) + 0x10000;
                    // 4字节UTF-8编码
                    byteSize += 4;
                    back.push((240 | (7 & (fullCode >> 18))));
                    back.push((128 | (63 & (fullCode >> 12))));
                    back.push((128 | (63 & (fullCode >> 6))));
                    back.push((128 | (63 & fullCode)));
                    i++; // 跳过下一个代码单元
                    continue;
                }
            }
            
            if (0x00 <= code && code <= 0x7f) {
                byteSize += 1;
                back.push(code);
            } else if (0x80 <= code && code <= 0x7ff) {
                byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)))
            } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
                byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)))
            }
        }

        for (i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }

        return back;
    };

    t.utf82string = function(arr) {
        if (typeof arr === 'string') {
            return null;
        }

        var UTF = '';
        var i = 0;
        while (i < arr.length) {
            if (arr[i] == null) {
                break;
            }

            // 计算UTF-8字符的字节数
            var byteValue = arr[i];
            var bytesLength = 1;
            
            if ((byteValue & 0x80) === 0) {
                // 1字节字符 (0xxxxxxx)
                bytesLength = 1;
            } else if ((byteValue & 0xE0) === 0xC0) {
                // 2字节字符 (110xxxxx)
                bytesLength = 2;
            } else if ((byteValue & 0xF0) === 0xE0) {
                // 3字节字符 (1110xxxx)
                bytesLength = 3;
            } else if ((byteValue & 0xF8) === 0xF0) {
                // 4字节字符 (11110xxx)
                bytesLength = 4;
            }

            // 确保不会越界
            if (i + bytesLength > arr.length) {
                // 数据不完整，添加原始字节
                UTF += String.fromCharCode(arr[i]);
                i++;
                continue;
            }

            var codePoint;
            if (bytesLength === 1) {
                codePoint = arr[i];
            } else if (bytesLength === 2) {
                codePoint = ((arr[i] & 0x1F) << 6) | (arr[i+1] & 0x3F);
            } else if (bytesLength === 3) {
                codePoint = ((arr[i] & 0x0F) << 12) | ((arr[i+1] & 0x3F) << 6) | (arr[i+2] & 0x3F);
            } else if (bytesLength === 4) {
                codePoint = ((arr[i] & 0x07) << 18) | ((arr[i+1] & 0x3F) << 12) | 
                           ((arr[i+2] & 0x3F) << 6) | (arr[i+3] & 0x3F);
            }

            // 处理代理对
            if (codePoint > 0xFFFF) {
                // 转换为代理对
                codePoint -= 0x10000;
                UTF += String.fromCharCode(0xD800 + (codePoint >> 10));
                UTF += String.fromCharCode(0xDC00 + (codePoint & 0x3FF));
            } else {
                UTF += String.fromCharCode(codePoint);
            }

            i += bytesLength;
        }
        return UTF;
    };

    t.arrayconcat = function(a1, a2) {
        var b = new Array();

        for (var i = 0; i < a1.length; i++) {
            b[i] = a1[i];
        }

        for (var j = a1.length; j < a1.length + a2.length; j++) {
            b[j] = a2[j - a1.length];
        }

        return b;
    };

    return t;
}());

// export default netutils;
module.exports = netutils;