/**
 * @file TalkConfig.ts
 * @description 聊天配置：定义游戏中的快捷聊天内容
 * @category 游戏 10001
 */

/**
 * @description 聊天列表配置
 * @property {number} id 聊天内容 ID
 * @property {string} msg 聊天内容
 * @property {number} speed 显示速度
 */
export const TALK_LIST = [
    {id:1,msg:"我出剪刀，你信吗？", speed:1},
    {id:2,msg:"我出石头，你信吗？", speed:1},
    {id:3,msg:"我出布，你信吗？", speed:1},
    {id:4,msg:"真墨迹！", speed:1},
    {id:5,msg:"我猜你会出剪刀~", speed:1},
    {id:6,msg:"我猜你会出石头~", speed:1},
    {id:7,msg:"我猜你会出布~", speed:1},
    {id:8,msg:"天大地大，石头最大！", speed:1},
    {id:9,msg:"你出剪刀，我出布，这把我让你！", speed:2},
    {id:10,msg:"你出石头，我出剪刀，这把我让你！", speed:2},
    {id:11,msg:"你出布，我出剪刀，这把我让你！", speed:2},
]