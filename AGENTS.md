# AGENTS.md

此文件包含在此 Cocos Creator 游戏客户端项目中工作的代理编码指南。

## 通用通信规则

- **语言要求**: 所有回复必须使用中文。所有代码注释、文档说明和用户交互内容都应使用中文。

## 构建和测试命令

这是一个使用 TypeScript 严格模式的 Cocos Creator 3.8.8 项目。

- **构建**: 使用 Cocos Creator 编辑器的"构建发布"面板进行构建
- **类型检查**: TypeScript 严格模式已在 tsconfig.json 中启用，无法单独运行类型检查
- **代码检查**: 项目已配置 Prettier (.prettierrc)，使用 `npx prettier --write` 格式化代码
- **单文件格式化**: `npx prettier --write assets/scripts/xxx.ts`
- **测试**: 此项目未配置测试框架

## 代码格式化规则 (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 140,
  "tabWidth": 4,
  "useTabs": false,
  "arrowParens": "always"
}
```

## 导入组织顺序

1. Cocos Creator 导入: `import { sys } from 'cc';`
2. FairyGUI 导入: `import * as fgui from "fairygui-cc";`
3. 框架导入: `import { ViewClass, LogColors } from '../../../frameworks/Framework';`
4. 模块/数据导入: `import { DataCenter } from '../../../datacenter/Datacenter';`
5. FGUI 组件导入: `import FGUICompLobbyMain from '../../../fgui/lobby/FGUICompLobbyMain';`

## 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 类 | PascalCase | `AdReward`, `CompLobbyMain`, `SignIn` |
| 方法 | camelCase | `reqGetAdInfo()`, `onBtnAd()`, `playAdAndReceiveReward()` |
| 私有成员 | 下划线前缀 | `_getAdInfoCallBack`, `_signInConfig` |
| 常量/枚举 | UPPER_SNAKE_CASE | `REWORD_VIDEOAD_CODE`, `ENUM_USER_STATUS` |
| 接口/类型别名 | PascalCase | `AD_REWARD_INFO`, `USER_DATA`, `PropData` |
| 文件 | PascalCase 与类名匹配 | `AdReward.ts` 导出 `AdReward` |

## TypeScript 指南

- **禁止使用 `any`**: 使用显式类型，必要时使用 `unknown` 替代
- **回调类型**: `((success: boolean, data: any) => void) | null`
- **协议类型**: 从生成的文件导入，如 `SprotoCallActivityFunc.Response`
- **严格空值检查**: 已启用 - 始终处理 null/undefined 情况
- **JSDoc 注释**: 为所有公共方法添加，包含 @param 和 @return 标签

## 事件系统模式

```typescript
AddEventListener(EVENT_NAMES.USER_DATA, this.onUserInfo, this);
RemoveEventListener(EVENT_NAMES.USER_DATA, this.onUserInfo);
DispatchEvent(EVENT_NAMES.USER_RICHES, data);
```

## 模块模式 (网络请求)

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
                this._callBack && this._callBack(true, res);
            }
        } else {
            this._callBack && this._callBack(false, null);
        }
    }
}
```

## 视图组件模式

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
}
fgui.UIObjectFactory.setExtension(CompSomething.URL, CompSomething);
```

## 错误处理

- 访问属性前检查 null/undefined
- 使用可选链和空值合并: `DataCenter.instance.userData?.nickname ?? ''`
- 用户错误提示: `TipsView.showView({content: '错误消息'})`
- 服务器错误记录: `console.log(LogColors.red(res.error))`
- 发送消息前检查 socket 状态: `if (GameSocketManager.instance.isOpen())`

## localStorage 使用

```typescript
sys.localStorage.setItem(LOCAL_KEY.SOME_KEY, value);
const value = sys.localStorage.getItem(LOCAL_KEY.SOME_KEY);
```

在 `InterfaceConfig.ts` 的 `LOCAL_KEY` 枚举中定义键。

## 数据访问

```typescript
DataCenter.instance.userData
DataCenter.instance.userRiches
DataCenter.instance.adRewardInfo
DataCenter.instance.userid
```

## 回调管理最佳实践

- 回调存储为带 `_` 前缀的实例变量
- 调用前检查: `this._callBack && this._callBack(true, data)`
- 使用后清除回调防止内存泄漏

## 控制台日志

```typescript
console.log(LogColors.red('错误'));
console.log(LogColors.green('成功'));
console.log(LogColors.blue('信息'));
console.log(LogColors.yellow('警告'));
```

## 文件组织结构

```
assets/scripts/
├── datacenter/      # 数据类型和全局数据中心
├── modules/         # 网络请求模块 (SignIn, UserRiches 等)
├── frameworks/      # 核心框架代码 (socket, events, utils)
├── view/            # UI 视图 (lobby, game, login 等)
│   └── common/      # 通用组件 (LoadingView, TipsView, PopMessageView)
├── games/           # 游戏特定代码
│   └── game10001/   # 游戏 10001 逻辑
└── fgui/            # FGUI 自动生成的组件
```

## 常用模式

- **单例模式**: `static instance` getter 和私有构造函数
- **日期存储**: 'YYYYMMD' 字符串格式用于每日检查
- **财富更新**: `UserRiches.req()` 触发 `EVENT_NAMES.USER_RICHES`
- **广告播放**: `MiniGameUtils.instance.showRewardedVideoAd()` 配合枚举码
- **加载状态**: 网络请求期间显示/隐藏 `LoadingView`

## Socket 消息处理

```typescript
initListeners() {
    GameSocketManager.instance.addServerListen(SprotoType, this.onMessage.bind(this));
}

removeListeners() {
    GameSocketManager.instance.removeServerListen(SprotoType);
}
```

## 协议配置

- 使用 `SprotoCallActivityFunc` 处理活动模块 (签到、广告奖励)
- 结构: `{moduleName: 'name', funcName: 'func', args: JSON.stringify(params)}`
- 始终将 `result.result` 解析为 JSON
- 检查 `result.code == 1` 表示成功

## Skill 系统

项目包含 `skills/` 目录提供专用工作流：
- `/add-jsdoc-comments <文件路径>` - 为 TypeScript 文件添加 JSDoc 注释
