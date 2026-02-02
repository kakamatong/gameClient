import { LobbySocketManager } from "../LobbySocketManager";
import { GameSocketManager } from "../GameSocketManager";

export class BaseModule {
    // 1. 使用 Map 存储子类实例，Key 为构造函数
    private static _instances = new Map<Function, any>();

    // 2. 构造函数保持 protected，防止外部直接 new
    protected constructor() {}

    /**
     * 3. 核心修复：
     * - <T extends typeof BaseModule>: 约束 T 必须是 BaseModule 的子类构造器
     * - (this: T): 显式声明 this 指向子类构造器
     * - 返回类型 T['prototype']: 替代 InstanceType<T>，绕过 public 构造函数检查
     */
    public static getInstance<T extends typeof BaseModule>(this: T): T["prototype"] {
        // 获取当前类的构造函数（即子类）
        // 需要断言为 Function 或 any 以便作为 Map 的 key
        const currentClass = this as unknown as Function;

        if (!BaseModule._instances.has(currentClass)) {
            // 4. 实例化时的黑魔法：
            // (this as any): 强制绕过 protected/abstract 检查进行实例化
            BaseModule._instances.set(currentClass, new (this as any)());
        }

        return BaseModule._instances.get(currentClass);
    }

    protected reqLobby(proto: { Name: string }, data: any, callback?: (data: any) => void): void {
        LobbySocketManager.instance.sendToServer(proto, data, callback);
    }

    protected reqGame(proto: { Name: string }, data: any, callback?: (data: any) => void): void {
        GameSocketManager.instance.sendToServer(proto, data, callback);
    }
}
