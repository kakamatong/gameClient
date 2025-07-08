import { DataCenter } from '../datacenter/datacenter';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
export class UserRiches {
    req() {
        LobbySocketManager.instance.callServer('user', '','userRiches', {}, this.resp.bind(this))
    }

    resp(data: any) {
        //DataCenter.instance.userData = data;
        if (data && data.length > 0 && data.richType && data.richNums && data.richType.length > 0 && data.richNums.length > 0) {
            const riches: Array<{richType:number, richNums:number}> = []
            for (let i = 0; i < data.richType.length; i++) {
                const tmp = {
                    richType: data.richType[i],
                    richNums: data.richNums[i]
                }
                riches.push(tmp)
            }
            DataCenter.instance.userRiches = riches
        }


    }
}