import { GAME_PLAYER_INFO,SELF_LOCAL, ENUM_GAME_STEP } from "./interfaceGameConfig";

export class GameData {
    private _playerList: Array<GAME_PLAYER_INFO> = [];
    private _maxPlayer = 2;
    private _gameStep: ENUM_GAME_STEP = ENUM_GAME_STEP.NONE;
    private _roomEnd: boolean = false;
    private _gameStart = false;
    private _playerInfos: Array<GAME_PLAYER_INFO> = [];
    private static _instance: GameData;
    public static get instance(): GameData {
        if (!this._instance) {
            this._instance = new GameData();
        }
        return this._instance;
    }

    private constructor(){
        
    }

    init(){
        this.gameStep = ENUM_GAME_STEP.NONE;
        this.playerList = [];
        this.roomEnd = false;
        this.gameStart = false;
    }

    get gameStep(): ENUM_GAME_STEP {
        return this._gameStep;
    }

    set gameStep(step: ENUM_GAME_STEP){
        this._gameStep = step;
    }

    get maxPlayer(): number {
        return this._maxPlayer;
    }

    set maxPlayer(max: number){
        this._maxPlayer = max;
    }

    getSelfSeat(): number {
        return this._playerList[SELF_LOCAL].svrSeat;
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
        return this.playerList[local].svrSeat;
    }

    getPlayerBySeat(seat: number): GAME_PLAYER_INFO {
        return this.playerList[this.seat2local(seat)];
    }

    getPlayerByUserid(userid: number): GAME_PLAYER_INFO | null {
        for(let i = 0; i < this.playerList.length; i++){
            if(this.playerList[i] && this.playerList[i].userid == userid){
                return this.playerList[i];
            }
        }
        return null;
    }

    set roomEnd(end: boolean){
        this._roomEnd = end;
    }

    get roomEnd(): boolean{
        return this._roomEnd;
    }

    set gameStart(start: boolean){
        this._gameStart = start;
    }

    get gameStart(): boolean{
        return this._gameStart;
    }

    set playerInfos(infos: Array<GAME_PLAYER_INFO>){
        this._playerInfos = infos;
    }

    get playerInfos(): Array<GAME_PLAYER_INFO>{
        return this._playerInfos;
    }

    getPlayerInfo(userid: number) {
        return this.playerInfos.find((player) => player.userid == userid);
    }
}