import { GAME_PLAYER_INFO,SELF_LOCAL } from "./interfaceGameConfig";

export class GameData {
    private _playerList: Array<GAME_PLAYER_INFO> = [];
    private _maxPlayer = 2;
    private static _instance: GameData;
    public static get instance(): GameData {
        if (!this._instance) {
            this._instance = new GameData();
        }
        return this._instance;
    }

    private constructor(){
        
    }

    get maxPlayer(): number {
        return this._maxPlayer;
    }

    set maxPlayer(max: number){
        this._maxPlayer = max;
    }

    getSelfSeat(): number {
        return this._playerList[SELF_LOCAL].seat;
    }

    set playerList(list: Array<GAME_PLAYER_INFO>){
        this._playerList = list;
    }

    get playerList(): Array<GAME_PLAYER_INFO>{
        return this._playerList;
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
        return this.playerList[local].seat;
    }

}