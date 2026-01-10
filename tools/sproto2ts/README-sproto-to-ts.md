# sproto to TypeScript 转换工具

## 概述

这个Python脚本用于将sproto协议定义文件转换为TypeScript类型定义，以提供类型安全的协议通信。

## 功能特性

- 解析sproto协议文件（包括请求和响应结构）
- 每个sproto文件对应生成一个ts文件，保留原有的目录结构
- 生成对应的TypeScript接口定义
- 支持基本类型（integer, string, boolean）和数组类型
- 正确处理嵌套结构体

## 使用方法

### 命令行使用

```bash
python sproto_to_ts.py <输入目录或文件> <输出目录>
```

示例：
```bash
# 转换整个目录
python sproto_to_ts.py ./assets/protocol ./types/

# 转换单个文件
python sproto_to_ts.py ./assets/protocol/lobby/c2s.sproto ./types/
```

### 参数说明

- `<输入目录或文件>`: 包含.sproto文件的目录路径或单个.sproto文件路径
- `<输出目录>`: 生成的TypeScript类型定义文件的输出目录

## 生成的类型定义

脚本会生成以下类型定义：

1. **结构体类型**：如 `.AwardNotice` 会生成 `AwardNotice` 接口
2. **协议请求类型**：如 `call` 协议会生成 `CallRequest` 接口
3. **协议响应类型**：如 `call` 协议会生成 `CallResponse` 接口

## 输出结构

- 如果输入是目录，将在输出目录中保持相同的子目录结构
- 如果输入是单个文件，将在输出目录中生成对应的ts文件

## 示例输出

对于如下sproto定义：
```
call 1 {
    request {
        serverName 0 : string
        moduleName 1 : string
        funcName 2 : string
        args 3 : string
    }
    response {
        code 0 : integer
        result 1 : string
    }
}
```

会生成：
```typescript
export interface CallRequest {
    serverName: string;
    moduleName: string;
    funcName: string;
    args: string;
}

export interface CallResponse {
    code: number;
    result: string;
}
```

## 使用场景

生成的类型定义可以用于：

1. **类型安全的协议通信**：确保发送和接收的数据符合协议定义
2. **IDE智能提示**：提供字段名和类型的自动补全
3. **编译时错误检查**：在编译阶段发现类型不匹配的问题
4. **文档化协议结构**：通过TypeScript类型定义文档化协议结构