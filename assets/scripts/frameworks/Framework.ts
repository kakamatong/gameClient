import { Director, Scene } from 'cc';
import { PackageManager } from './PackageManager';
import { MiniGameUtils } from './utils/sdk/MiniGameUtils';
type eventFunc = (...args:any[]) =>void

const events = new Map<string, eventFunc[]>()
const eventTargets = new Map<eventFunc, any>()

// 日志颜色
export class LogColors {
    static red = (text: string) => `\x1b[31m${text}\x1b[0m`;
    static green = (text: string) => `\x1b[32m${text}\x1b[0m`;
    static blue = (text: string) => `\x1b[34m${text}\x1b[0m`;
    static yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
}

/**
 * 添加事件监听
 * @param eventName 事件名称
 * @param func 监听函数
 * @param target 监听函数所属对象
 */
export function AddEventListener(eventName:string, func: eventFunc, target:any) {
    if (!events.has(eventName)) {
        events.set(eventName, [func])
    }else{
        const funcs = events.get(eventName)
        if(funcs?.indexOf(func) === -1){
            funcs?.push(func)
        }
    }
    eventTargets.set(func, target)
}

/**
 * 移除事件监听
 * @param eventName 事件名称
 * @param func 监听函数
 */
export function RemoveEventListener(eventName:string, func: eventFunc) {
    if (!events.has(eventName)) {
        return
    }else{
        const funcs = events.get(eventName) ?? []
        const index = funcs?.indexOf(func)
        if(index != null && index !== -1){
            funcs?.splice(index, 1)
        }
        eventTargets.delete(func)
    }
}

/**
 * 分发事件
 * @param eventName 事件名称
 * @param args 参数
 */
export function DispatchEvent(eventName:string, ...args:any[]) {
    if (!events.has(eventName)) {
        return
    }else{
        const funcs = events.get(eventName)
        funcs?.forEach(func => {
            const target = eventTargets.get(func)
            if(target){
                func.call(target,...args)
            }
        });
    }
}

/**
 * 场景切换
 * @param name 场景名称
 */
export const ChangeScene = (name:string):void => {
    const func = (error:Error|null, scene?:Scene)=>{
        if (!error && scene) {
            //Director.instance.runScene(scene)
        }
    }
    //Director.instance.preloadScene(name)
    Director.instance.loadScene(name,func)
}

/**
 * 包加载
 * @param packages 
 */
export const PackageLoad = (packages:string[]) =>{
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        // 保存原方法引用
        const oldFunc = constructor['showView']
        if (!oldFunc){
            console.log('showView not exists')
            return
        }
        constructor['showView'] = function (params?:any, callBack?:(b:boolean)=>void) {
            PackageManager.instance.loadPackages('fgui', packages).then(()=>{
                // 调用原方法
                oldFunc.apply(this, [params, callBack])
            })
        }
    }
}

/**
 * 视图类
 */
export const ViewClass = (data?:any) =>{
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const newConstructor = class extends constructor {
            private _curveScreenApplied = false;

            constructor(...args: any[]) {
                super(...args);
                // 如果配置了曲面屏适配，则标记需要适配
                if (data && data.curveScreenAdapt) {
                    this._curveScreenApplied = true;
                }
            }

            /**
             * 重写onConstruct方法，在FairyGUI组件构造完成后执行适配
             */
            protected onConstruct(): void {
                // 先调用父类的onConstruct
                if (super.onConstruct) {
                    super.onConstruct();
                }

                // 如果需要曲面屏适配，则延迟执行适配（确保在makeFullScreen之后）
                if (this._curveScreenApplied) {
                    this.scheduleOnce(() => {
                        this.adaptForCurveScreen();
                    }, 0);
                }
            }

            /**
             * 适配曲面屏
             */
            private adaptForCurveScreen() {
                if (this && this.height !== undefined && this.height > 0) {
                    const originalHeight = this.height;
                    const originalY = this.y;
                    
                    // 获取动态安全区域高度
                    const safeAreaTop = MiniGameUtils.instance.getSafeAreaTopHeight();
                    
                    console.log(`[ViewClass] Before adaptation - ${constructor.name}: height: ${originalHeight}, y: ${originalY}, x: ${this.x}, parent: ${this.parent ? 'yes' : 'no'}`);
                    
                    // 调整高度
                    this.height -= safeAreaTop;
                    // 调整y坐标，向下偏移
                    this.y += safeAreaTop;
                    
                    console.log(`[ViewClass] After adaptation - ${constructor.name}: height: ${this.height}, y: ${this.y}, x: ${this.x} (reduced by ${safeAreaTop}px)`);
                } else {
                    console.warn(`[ViewClass] Cannot apply curve screen adaptation to ${constructor.name}: height is ${this.height}, y: ${this.y}, x: ${this.x}`);
                }
            }
        }

        // 继承原构造函数的方法和属性
        newConstructor.prototype.scheduleOnce = function (callback: () => void, delay: number) {
            this.node.components[0].scheduleOnce(callback, delay)
        }

        newConstructor.prototype.schedule = function (callback: () => void, interval: number) {
            this.node.components[0].schedule(callback, interval)
        }

        newConstructor.prototype.unschedule = function (callback: () => void) {
            this.node.components[0].unschedule(callback)
        }

        newConstructor.prototype.unscheduleAllCallbacks = function () {
            this.node.components[0].unscheduleAllCallbacks()
        }

        return newConstructor;
    }
}
