/**
 * @file Gamedata.ts
 * @description 游戏数据：管理游戏 10001 的游戏数据
 * @category 游戏 10001
 */

import { DEFAULT_HEADURL } from "../../../datacenter/InterfaceConfig";
import { GAME_PLAYER_INFO,SELF_LOCAL, ENUM_GAME_STEP, GAME_DATA } from "./InterfaceGameConfig";

/**
 * @class GameData
 * @description 游戏数据类，管理游戏 10001 的游戏数据，使用单例模式
 * @category 游戏 10001
 * @singleton 单例模式
 */
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
    private _privateNowCnt:number = 0; // 第几局
    private _privateMaxCnt:number = 0; // 最大局数
    /** 单例实例 */
    private static _instance: GameData;

    /**
     * @description 获取 GameData 单例实例
     * @returns GameData 单例实例
     */
    public static get instance(): GameData {
        if (!this._instance) {
            this._instance = new GameData();
        }
        return this._instance;
    }

    private constructor(){

    }

    /**
     * @description 初始化游戏数据
     */
    init(){
        this.gameStep = ENUM_GAME_STEP.NONE;
        this.playerList = [];
        this.roomEnd = false;
        this.gameStart = false;
        this.isPrivateRoom = false;
        this.gameData = null;
        this._owner = 0;
        this._privateNowCnt = 0;
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

    /**
     * @description 设置玩家列表
     * @param list 玩家列表
     */
    set playerList(list: Array<GAME_PLAYER_INFO>){
        this._playerList = list;
    }

    /**
     * @description 获取玩家列表
     * @returns 玩家列表
     */
    get playerList(): Array<GAME_PLAYER_INFO>{
        return this._playerList;
    }

    /**
     * @description 获取指定本地位置的玩家头像
     * @param localSeat 本地位置
     * @returns 头像 URL
     */
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
        if (selfSeat == seat) {
            return SELF_LOCAL;
        }
        const selfLocal = SELF_LOCAL
        const d = (seat - selfSeat);
        if (d > 0) {
            return selfLocal + d
        }else{
            return this._maxPlayer + (selfLocal + d)
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

    getPlayerCnt(): number {
        return this.playerList.filter(player => player != null && player != undefined).length;
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

    set privateNowCnt(cnt: number){
        this._privateNowCnt = cnt;
    }

    get privateNowCnt(): number{
        return this._privateNowCnt;
    }

    set privateMaxCnt(cnt: number){
        this._privateMaxCnt = cnt;
    }

    get privateMaxCnt(): number{
        return this._privateMaxCnt;
    }
}