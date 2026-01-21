import { Director, Scene } from 'cc';
import { PackageManager } from './PackageManager';
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
        constructor.prototype.scheduleOnce = function (callback: () => void, delay: number) {
            this.node.components[0].scheduleOnce(callback, delay)
        }

        constructor.prototype.schedule = function (callback: () => void, interval: number) {
            this.node.components[0].schedule(callback, interval)
        }

        constructor.prototype.unschedule = function (callback: () => void) {
            this.node.components[0].unschedule(callback)
        }

        constructor.prototype.unscheduleAllCallbacks = function () {
            this.node.components[0].unscheduleAllCallbacks()
        }
    }
}
