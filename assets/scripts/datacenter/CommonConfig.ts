/**
 * @file CommonConfig.ts
 * @description 公共配置：定义道具配置和事件名称
 * @category 数据中心
 */

/**
 * @typedef PropData
 * @description 道具数据类型
 * @property {number} id 道具 ID
 * @property {string} name 道具名称
 * @property {string} desc 道具描述
 * @property {string} [icon] 道具图标
 */
// 道具类型
export type PropData = {
    id: number,
    name: string,
    desc: string,
    icon?: string,
}

/**
 * @description 道具配置
 */
//道具配置
export const PropConfig:Record<number, PropData> = {
    2: { id: 2, name: "银子", desc:"用于聊天消耗等" },
}

/**
 * @description 事件名称常量
 */
// 事件名称常量
export const EVENT_NAMES = {
    // 用户相关事件
    USER_DATA: 'userData',
    USER_STATUS: 'userStatus',
    USER_RICHES: 'userRichs',
} as const;