import { Component, Director, error, Scene } from 'cc';
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
 * 延迟执行
 * @param node 
 * @param callback 
 * @param delay 
 */
export const ScheduleOnce = (node:Component, callback: () => void, delay: number) =>{
    node.scheduleOnce(callback, delay)
}

/**
 * 定时执行
 * @param node 
 * @param callback 
 * @param interval 
 */
export const Schedule = (node:Component, callback: () => void, interval: number) =>{
    node.schedule(callback, interval)
}

/**
 * 取消定时执行
 * @param node 
 * @param callback 
 */
export const Unschedule = (node:Component, callback: () => void) =>{
    node.unschedule(callback)
}

/**
 * 取消所有定时执行
 * @param node 
 */
export const UnscheduleAllCallbacks = (node:Component) =>{
    node.unscheduleAllCallbacks()
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
