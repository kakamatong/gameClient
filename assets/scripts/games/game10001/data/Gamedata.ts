import { DEFAULT_HEADURL } from "../../../datacenter/InterfaceConfig";
import { GAME_PLAYER_INFO,SELF_LOCAL, ENUM_GAME_STEP, GAME_DATA } from "./InterfaceGameConfig";

export class GameData {
    private _playerList: Array<GAME_PLAYER_INFO> = [];
    private _maxPlayer = 2;
    private _gameStep: ENUM_GAME_STEP = ENUM_GAME_STEP.NONE;
    private _roomEnd: boolean = false;
    private _gameStart = false;
    private _isPrivateRoom = false;
    private _gameData: GAME_DATA | null = null;
    private _playerInfos: Array<GAME_PLAYER_INFO> = [];
    private _owner = 0;
    private _record: Array<any> = [];
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
        this.isPrivateRoom = false;
        this.gameData = null;
        this._owner = 0;
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

    getHeadurl(localSeat:number):string{
        if (!this._playerList[localSeat].headurl) {
            return DEFAULT_HEADURL
        }
        return  this._playerList[localSeat].headurl
    }

    getHeadurlByUserid(userid: number):string{
        const player = this.getPlayerByUserid(userid);
        if (!player) {
            return DEFAULT_HEADURL
        }
        const localSeat = this.seat2local(player.svrSeat);
        return this.getHeadurl(localSeat);
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

    getPlayerByLocal(local: number): GAME_PLAYER_INFO {
        return this.playerList[local];
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

    set isPrivateRoom(flag: boolean){
        this._isPrivateRoom = flag;
    }

    get isPrivateRoom(): boolean{
        return this._isPrivateRoom;
    }

    set gameData(data: GAME_DATA | null){
        this._gameData = data;
    }

    get gameData(): GAME_DATA | null{
        return this._gameData;
    }

    set owner(userid: number){
        this._owner = userid;
    }

    get owner(): number{
        return this._owner;
    }

    set record(record: Array<any>){
        this._record = record;
    }

    get record(): Array<any>{
        return this._record;
    }
}