# Add JSDoc Comments

此 skill 用于为 TypeScript 文件添加和补充 JSDoc 格式注释，提升代码可维护性和可读性。

## 使用方法

```bash
# 为单个文件添加注释
/add-jsdoc-comments 文件路径

# 例如：
/add-jsdoc-comments assets/scripts/modules/UserRiches.ts
```

## 注释添加规则

### 1. 文件头注释
当文件不存在文件级 JSDoc 时添加：
```typescript
/**
 * @file 文件名.ts
 * @description 文件用途详细说明
 * @category 模块分类
 */
```

### 2. 类注释
```typescript
/**
 * @class ClassName
 * @description 类的详细用途说明
 * @category 模块分类
 */
export class ClassName { ... }
```

### 3. 接口注释
```typescript
/**
 * @interface InterfaceName
 * @description 接口用途说明
 */
export interface InterfaceName { ... }
```

### 4. 枚举注释
```typescript
/**
 * @enum EnumName
 * @description 枚举用途说明
 */
export enum EnumName { ... }
```

### 5. 成员变量注释
```typescript
/** 成员变量说明 */
private _variableName: type;
```

### 6. 方法注释
```typescript
/**
 * @description 方法用途说明
 * @param paramName 参数说明
 * @returns {返回类型} 返回值说明
 */
public methodName(param: type): returnType {
    ...
}

/** 私有方法说明 */
private methodName(param: type) {
    ...
}
```

## 分类规则

- `datacenter/` → "数据中心：定义全局数据类型、接口、枚举和数据中心单例"
- `modules/` → "网络请求模块：处理与服务器通信"
- `frameworks/` → "核心框架：提供基础功能支持"
- `view/lobby/` → "大厅视图：UI 组件"
- `view/game*/` → "游戏视图：游戏内 UI"
- `view/common/` → "通用视图：通用 UI 组件"
- `view/signIn/` → "签到视图：签到相关 UI"
- `games/game10001/` → "游戏 10001：特定游戏逻辑"

## 代码保护原则

- ✅ 只添加注释，不修改任何代码逻辑
- ✅ 不格式化代码（保持原有缩进、空格）
- ✅ 保留现有注释（不覆盖）
- ✅ 只插入 JSDoc 注释
- ✅ 维护原有代码结构

## 注释推断规则

### 方法前缀推断
- `req*` → "请求..."
- `resp*` → "...响应回调处理"
- `onBtn*` → "按钮点击事件处理"
- `init*` → "初始化..."
- `show*` → "显示..."
- `hide*` → "隐藏..."
- `clear*` → "清除..."
- `update*` → "更新..."
- `handle*` → "处理..."
- `check*` → "检查..."

### 成员变量前缀推断
- `*_callBack` → "回调函数"
- `*_config` → "...配置"
- `*_status` → "...状态"
- `*_info` → "...信息"
- `*_data` → "...数据"
- `*_list` → "...列表"

## 补充注释规则

对于已有注释但不完整的：
- 缺少 `@description` 的添加
- 缺少 `@param` 的补充参数说明
- 缺少 `@returns` 的补充返回值说明
- 保留原有注释，在其基础上补充完整

## 示例

### 原始代码
```typescript
export class UserRiches {
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserRiches, {}, this.resp.bind(this))
    }

    resp(data: SprotoUserRiches.Response) {
        if (data  && data.richType && data.richNums && data.richType.length > 0 && data.richNums.length > 0) {
            const riches: Array<{richType:number, richNums:number}> = []
            for (let i = 0; i < data.richType.length; i++) {
                const tmp = {
                    richType: data.richType[i],
                    richNums: data.richNums[i]
                }
                riches.push(tmp)
            }
            DataCenter.instance.userRiches = riches
            DispatchEvent(EVENT_NAMES.USER_RICHES,data)
        }
    }
}
```

### 添加注释后
```typescript
/**
 * @file UserRiches.ts
 * @description 用户财富模块：处理用户财富数据的请求和响应
 * @category 网络请求模块
 */

/**
 * @class UserRiches
 * @description 用户财富管理类，负责请求和更新用户财富数据
 * @category 网络请求模块
 */
export class UserRiches {
    /**
     * @description 请求用户财富数据
     */
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserRiches, {}, this.resp.bind(this))
    }

    /**
     * @description 处理用户财富数据响应
     * @param data 服务器返回的财富数据
     */
    resp(data: SprotoUserRiches.Response) {
        if (data  && data.richType && data.richNums && data.richType.length > 0 && data.richNums.length > 0) {
            const riches: Array<{richType:number, richNums:number}> = []
            for (let i = 0; i < data.richType.length; i++) {
                const tmp = {
                    richType: data.richType[i],
                    richNums: data.richNums[i]
                }
                riches.push(tmp)
            }
            DataCenter.instance.userRiches = riches
            DispatchEvent(EVENT_NAMES.USER_RICHES,data)
        }
    }
}
```
