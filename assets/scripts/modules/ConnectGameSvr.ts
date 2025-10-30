import { DataCenter } from "../datacenter/Datacenter";
import { ENUM_CHANNEL_ID, LOGIN_TYPE } from "../datacenter/InterfaceConfig";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/Login";
import { MiniGameUtils } from "../frameworks/utils/sdk/MiniGameUtils";
import { HttpPostWithDefaultJWT } from "../frameworks/utils/Utils";
import { Auth } from "./Auth";
import { AuthList } from "./AuthList";
import { sys } from 'cc';
export class ConnectGameSvr { 
    private static _instance: ConnectGameSvr;

    public static get instance(): ConnectGameSvr {
        if (!this._instance) {
            this._instance = new ConnectGameSvr();
        }
        return this._instance;
    }

    
}