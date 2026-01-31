/**
 * @file SignInconfig.ts
 * @description 签到配置：定义签到奖励相关的数据类型
 * @category 签到视图
 */

/**
 * @typedef SignInConfig
 * @description 签到配置数据类型
 * @property {number[]} richNums 普通奖励数量
 * @property {number[]} richNums2 翻倍奖励数量
 * @property {number[]} richTypes 奖励类型
 */
export type SignInConfig = {
    richNums: number[];   // 普通奖励
    richNums2: number[];  // 翻倍奖励
    richTypes: number[];  // 奖励类型
}