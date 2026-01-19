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