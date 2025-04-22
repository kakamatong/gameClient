type eventFunc = (...args:any[]) =>void

const events = new Map<string, eventFunc[]>()

export function AddEventListener(eventName:string, func: eventFunc) {
    if (!events.has(eventName)) {
        events.set(eventName, [func])
        return
    }else{
        const funcs = events.get(eventName)
        if(funcs?.indexOf(func) === -1){
            funcs?.push(func)
        }
    }
}

export function RemoveEventListener(eventName:string, func: eventFunc) {
    if (!events.has(eventName)) {
        return
    }else{
        const funcs = events.get(eventName)
        const index = funcs?.indexOf(func)
        if(index != null && index !== -1){
            funcs?.splice(index, 1)
        }
    }
}

export function DispatchEvent(eventName:string, ...args:any[]) {
    if (!events.has(eventName)) {
        return
    }else{
        const funcs = events.get(eventName)
        funcs?.forEach(func => {
            func(...args)
        });
    }
}