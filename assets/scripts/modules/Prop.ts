import { PropConfig, PropData } from "../datacenter/CommonConfig";



export class Prop {
    static create(id:number):PropData | undefined {
        const data = PropConfig[id];
        if(data && !data.icon){
            data.icon = `ui://props/prop_120x120_${id}`
        }
        return data
    }
}