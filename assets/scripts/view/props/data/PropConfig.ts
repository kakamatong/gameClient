/**
 * @file PropConfig.ts
 * @description 道具配置：定义道具相关的数据类型
 * @category 道具视图
 */

/**
 * @typedef PropInfo
 * @description 道具信息数据类型
 * @property {number} id 道具ID
 * @property {number} [num] 道具数量
 */
export type PropInfo = {
    id:number,
    num?:number
}