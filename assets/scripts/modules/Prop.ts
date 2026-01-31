/**
 * @file Prop.ts
 * @description 道具模块：处理道具数据的创建和管理
 * @category 网络请求模块
 */

import { PropConfig, PropData } from "../datacenter/CommonConfig";



/**
 * @class Prop
 * @description 道具管理类，负责创建和获取道具数据
 * @category 网络请求模块
 */
export class Prop {
    /**
     * @description 创建道具数据
     * @param id 道具ID
     * @returns 道具数据，如果不存在返回 undefined
     */
    static create(id:number):PropData | undefined {
        const data = PropConfig[id];
        if(data && !data.icon){
            data.icon = `ui://props/prop_120x120_${id}`
        }
        return data
    }
}