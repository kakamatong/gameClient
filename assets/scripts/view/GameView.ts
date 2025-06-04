import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';
import { GAME_PLAYER_INFO } from '../datacenter/interfaceConfig';
import { DataCenter } from '../datacenter/datacenter';

const { ccclass, property } = _decorator;
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
        return this._playerList[1].seat;
    }

    onReportGamePlayerInfo(data: any): void {
        console.log(LogColors.green(data.msg));
        const selfid = DataCenter.instance.userid;
        if(data.userid == selfid){
            this._playerList[1] = data;
        }else{
            const local = this.seat2local(data.seat);
            this._playerList[local] = data;
        }
    }

    seat2local(seat: number): number {
        const selfSeat = this.getSelfSeat();
        const selfLocal = 1
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
