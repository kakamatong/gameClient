/**
 * 类装饰器配置选项
 */
type ClassDecoratorOptions = {
    singleton?: boolean;      // 是否单例模式
    autoInit?: boolean;       // 是否自动初始化
    debug?: boolean;          // 是否开启调试日志
    dependencies?: string[];  // 依赖的服务名称
};

/**
 * 增强型类装饰器工厂函数
 * @param options 装饰器配置选项
 */
export function EnhanceClass(options: ClassDecoratorOptions = {}) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        return class extends constructor {
            // 重写构造函数
            constructor(...args: any[]) {
                super(...args);
            }
        };
    };
}

// 示例服务管理器（需要提前实现）
class ServiceManager {
    private static services = new Map<string, any>();

    static register(name: string, service: any) {
        this.services.set(name, service);
    }

    static get<T>(name: string): T {
        return this.services.get(name) as T;
    }
}
