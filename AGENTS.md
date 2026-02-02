# AGENTS.md

此文件包含在此 Cocos Creator 游戏客户端项目中工作的代理编码指南。

## 通用通信规则

- **语言要求**: 所有回复必须使用中文。所有代码注释、文档说明和用户交互内容都应使用中文。

## 构建和测试命令

这是一个使用 TypeScript 严格模式的 Cocos Creator 3.8.8 项目。

- **构建**: 使用 Cocos Creator 编辑器的 构建发布 面板
- **类型检查**: 无显式命令 - TypeScript 严格模式已在 tsconfig.json 中启用
- **代码检查**: 已配置 Prettier (.prettierrc) 但无显式 lint 命令
- **测试**: 此项目未配置测试框架

## 代码风格指南

### 导入组织
按来源顺序排列导入:
1. Cocos Creator 导入: `import { sys } from 'cc';`
2. FairyGUI 导入: `import * as fgui from "fairygui-cc";`
3. 框架导入: `import { ViewClass, LogColors } from '../../../frameworks/Framework';`
4. 模块/数据导入: `import { DataCenter } from '../../../datacenter/Datacenter';`
5. FGUI 组件导入: `import FGUICompLobbyMain from '../../../fgui/lobby/FGUICompLobbyMain';`

对于资源路径,统一使用相对路径。

### 格式化规则 (.prettierrc)
- 分号: `true` (始终使用)
- 尾随逗号: `es5` 风格
- 引号: 双引号 (`"`), 不使用单引号
- 打印宽度: 140 字符
- 缩进: 4 个空格 (不使用 tab)
- 箭头函数括号: `always` (即使是单个参数)

### 命名约定
- **类**: PascalCase - `AdReward`, `CompLobbyMain`, `SignIn`
- **方法**: camelCase - `reqGetAdInfo()`, `onBtnAd()`, `playAdAndReceiveReward()`
- **私有成员**: 下划线前缀 - `_getAdInfoCallBack`, `_signInConfig`
- **常量/枚举**: UPPER_SNAKE_CASE 或 UPPER_CAMEL_CASE - `REWORD_VIDEOAD_CODE`, `ENUM_USER_STATUS`
- **接口**: PascalCase 且名称具有描述性 - `AD_REWARD_INFO`, `LOGIN_INFO`, `USER_DATA`
- **类型别名**: PascalCase - `PropData`
- **文件**: PascalCase 与导出的类匹配 - `AdReward.ts` 导出 `AdReward`

### TypeScript 指南
- **避免 `any`**: 使用显式类型。如果使用 `any`, 请说明原因
- **回调类型**: 使用与 null 的联合类型 - `((success: boolean, data: any) => void) | null`
- **协议类型**: 从生成的文件导入 - `SprotoCallActivityFunc.Response`
- **严格空值检查**: 已启用 - 始终处理 null 情况
- **JSDoc**: 为所有公共方法添加注释,包含 @param 和 @return 标签

### 事件系统模式
```typescript
// 添加监听器 (Framework.ts)
AddEventListener(EVENT_NAMES.USER_DATA, this.onUserInfo, this);

// 移除监听器
RemoveEventListener(EVENT_NAMES.USER_DATA, this.onUserInfo);

// 派发事件
DispatchEvent(EVENT_NAMES.USER_RICHES, data);
```

### 模块模式 (网络请求)
模块如 `AdReward`, `SignIn`, `UserRiches` 遵循以下结构:
```typescript
export class ModuleName {
    private _callBack: ((success: boolean, data: any) => void) | null = null;

    reqSomething(params: any, callback: (success: boolean, data: any) => void) {
        this._callBack = callback;
        SocketManager.instance.sendToServer(SprotoType, params, this.respSomething.bind(this));
    }

    private respSomething(result: SprotoType.Response): void {
        if (result && result.code == 1) {
            const res = JSON.parse(result.result);
            if (res.error) {
                console.log(LogColors.red(res.error));
                this._callBack && this._callBack(false, res);
            } else {
                // 处理成功
                this._callBack && this._callBack(true, res);
            }
        } else {
            this._callBack && this._callBack(false, null);
        }
    }
}
```

### 错误处理
- 访问属性前检查 null/undefined
- 使用可选链和空值合并: `DataCenter.instance.userData?.nickname ?? ''`
- 用户面对的错误显示提示: `TipsView.showView({content: '错误消息'})`
- 记录服务器错误: `console.log(LogColors.red(res.error))`
- 发送消息前处理所有 socket 状态

### 视图组件模式
视图组件继承 FGUI 基类并使用装饰器:
```typescript
@ViewClass({ curveScreenAdapt: true })
@PackageLoad(['packageName'])
export class CompSomething extends FGUICompSomething {
    onConstruct() {
        super.onConstruct();
        this.initListeners();
        this.initUI();
    }

    onDestroy() {
        super.onDestroy();
        this.removeListeners();
    }

    // 在文件末尾注册
}
fgui.UIObjectFactory.setExtension(CompSomething.URL, CompSomething);
```

### localStorage 使用
使用 `sys.localStorage` 进行持久化存储:
```typescript
// 设置
sys.localStorage.setItem(LOCAL_KEY.SOME_KEY, value);

// 获取
const value = sys.localStorage.getItem(LOCAL_KEY.SOME_KEY);
```

在 `InterfaceConfig.ts` 的 `LOCAL_KEY` 枚举中定义键。

### 数据访问
所有全局数据通过 `DataCenter.instance` 访问:
```typescript
DataCenter.instance.userData
DataCenter.instance.userRiches
DataCenter.instance.adRewardInfo
DataCenter.instance.userid
```

### 回调管理最佳实践
- 将回调存储为带 `_` 前缀的实例变量
- 调用前检查回调是否存在: `this._callBack && this._callBack(true, data)`
- 使用后清除回调以防止内存泄漏
- 对于广告回调,使用成员变量模式避免重复注册

### 控制台日志
使用彩色日志提高可见性:
```typescript
console.log(LogColors.red('错误消息'));
console.log(LogColors.green('成功消息'));
console.log(LogColors.blue('信息消息'));
console.log(LogColors.yellow('警告消息'));
```

### 文件组织
- `assets/scripts/datacenter/`: 数据类型和全局数据中心
- `assets/scripts/modules/`: 网络请求模块 (SignIn, UserRiches 等)
- `assets/scripts/frameworks/`: 核心框架代码 (socket, events, utils)
- `assets/scripts/view/`: UI 视图 (lobby, game, login 等)
- `assets/scripts/games/game10001/`: 游戏特定代码
- `assets/scripts/fgui/`: FGUI 自动生成的组件

### 常用模式
- **单例模式**: 使用 `static instance` getter 和私有构造函数
- **基于日期的存储**: 存储为 'YYYYMMD' 字符串用于每日检查
- **财富更新**: 调用 `UserRiches.req()` 触发 `EVENT_NAMES.USER_RICHES`
- **广告播放**: 使用 `MiniGameUtils.instance.showRewardedVideoAd()` 配合枚举码
- **加载状态**: 网络请求期间显示/隐藏 `LoadingView`
- **弹窗消息**: 使用 `PopMessageView` 进行确认

### Socket 消息处理
始终在 initListeners/removeListeners 中添加/移除服务器监听器:
```typescript
initListeners() {
    GameSocketManager.instance.addServerListen(SprotoType, this.onMessage.bind(this));
}

removeListeners() {
    GameSocketManager.instance.removeServerListen(SprotoType);
}
```

发送前检查 socket 状态: `if (GameSocketManager.instance.isOpen())`

### 协议配置
- 使用 `SprotoCallActivityFunc` 处理活动模块 (签到、广告奖励)
- 结构: `{moduleName: 'name', funcName: 'func', args: JSON.stringify(params)}`
- 始终将 `result.result` 解析为 JSON
- 检查 `result.code == 1` 表示成功
