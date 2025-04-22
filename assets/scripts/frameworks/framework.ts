type eventFunc = (...args:any[]) =>void

const events = new Map<string, eventFunc[]>()
const eventTargets = new Map<eventFunc, any>()

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