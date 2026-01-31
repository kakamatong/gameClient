/**
 * @file AwardConfig.ts
 * @description 奖励配置：定义奖励相关的数据类型
 * @category 奖励视图
 */

/**
 * @typedef AwardConfig
 * @description 奖励配置数据类型
 * @property {number[]} ids 奖励ID列表
 * @property {number[]} nums 奖励数量列表
 * @property {number} [noticeid] 通知ID
 */
export type AwardConfig = {
    ids: number[],
    nums: number[],
    noticeid?: number
}

