import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';
import { GAME_PLAYER_INFO } from '../datacenter/interfaceConfig';
import { DataCenter } from '../datacenter/datacenter';

import * as fgui from "fairygui-cc";
const { ccclass, property } = _decorator;
const SELF_LOCAL = 1;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    private _maxPlayer = 2;
    private _playerList: Array<GAME_PLAYER_INFO> = [];
    constructor(){
        super();
    }

    onEnable(){
        SocketManager.instance.sendToServer('connectGame', { code:1 }, this.respConnectGame.bind(this))
        SocketManager.instance.addServerReport("reportGamePlayerInfo", this.onReportGamePlayerInfo.bind(this));
    }

    onDisable(){

    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        this.dispose();
    }

    respConnectGame(data: any): void {
        if(data.code == 0){
            console.log(LogColors.green(data.msg));
        }else{
            console.log(LogColors.red(data.msg));
        }
    }

    getSelfSeat(): number {
        return this._playerList[SELF_LOCAL].seat;
    }

    showPlayerInfo(seat:number):void{
        const playerInfo = this._playerList[seat];
        if(playerInfo){
            if(seat == SELF_LOCAL){
                this.UI_TXT_NICKNAME_1.text = playerInfo.nickname;
                this.UI_TXT_USERID_1.text = playerInfo.userid.toString();
            }else if (seat == 2){
                this.UI_TXT_NICKNAME_2.text = playerInfo.nickname;
                this.UI_TXT_USERID_2.text = playerInfo.userid.toString();
            }
        }
    }

    onReportGamePlayerInfo(data: any): void {
        console.log(LogColors.green(data.msg));
        const selfid = DataCenter.instance.userid;
        if(data.userid == selfid){
            this._playerList[SELF_LOCAL] = data;
            this.showPlayerInfo(SELF_LOCAL);
        }else{
            const local = this.seat2local(data.seat);
            this._playerList[local] = data;
            this.showPlayerInfo(local);
        }
    }

    seat2local(seat: number): number {
        const selfSeat = this.getSelfSeat();
        const selfLocal = SELF_LOCAL
        const d = (seat - selfSeat) % this._maxPlayer;
        if(d > 0){
            return selfLocal + d;
        }else{
            return selfLocal - d;
        }
    }

    local2seat(local: number): number {
        return this._playerList[local].seat;
    }
    
}
