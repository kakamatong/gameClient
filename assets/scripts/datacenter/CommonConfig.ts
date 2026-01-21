// 道具类型
export type PropData = {
    id: number,
    name: string,
    desc: string,
    icon?: string,
}

//道具配置
export const PropConfig:Record<number, PropData> = {
    2: { id: 2, name: "银子", desc:"用于聊天消耗等" },
}

// 事件名称常量
export const EVENT_NAMES = {
    // 用户相关事件
    USER_DATA: 'userData',
    USER_STATUS: 'userStatus',
    USER_RICHES: 'userRichs',
} as const;