import { SprotoCallActivityFunc } from "../../types/protocol/lobby/c2s";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";


export class SignIn {

    reqSignData(){
        LobbySocketManager.instance.sendToServer(SprotoCallActivityFunc,{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , this.resp.bind(this))
    }
}