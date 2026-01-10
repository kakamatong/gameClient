import { SprotoUserRiches } from '../../types/protocol/lobby/c2s';
import { DataCenter } from '../datacenter/Datacenter';
import { DispatchEvent } from '../frameworks/Framework';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
export class UserRiches {
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserRiches.Name, {}, this.resp.bind(this))
    }

    resp(data: SprotoUserRiches.Response) {
        //DataCenter.instance.userData = data;
        if (data  && data.richType && data.richNums && data.richType.length > 0 && data.richNums.length > 0) {
            const riches: Array<{richType:number, richNums:number}> = []
            for (let i = 0; i < data.richType.length; i++) {
                const tmp = {
                    richType: data.richType[i],
                    richNums: data.richNums[i]
                }
                riches.push(tmp)
            }
            DataCenter.instance.userRiches = riches
            DispatchEvent('userRichs',data)
        }
    }
}