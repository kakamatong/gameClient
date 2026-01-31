/**
 * @file Datacenter.ts
 * @description 数据中心：使用单例模式管理全局数据
 * @category 数据中心
 */

import { UserdataResponse, UserstatusResponse } from "../../types/protocol/lobby/c2s";
import { LOGIN_INFO, USER_STATUS, LOCAL_KEY, DEFAULT_HEADURL, GAME_RECORD, LOGIN_TYPE, ENUM_CHANNEL_ID, ENUM_ENV, AD_REWARD_INFO } from "./InterfaceConfig";
import { sys } from "cc";

/**
 * @class DataCenter
 * @description 数据中心，使用单例模式管理全局数据，包括用户信息、游戏数据、服务器地址等
 * @category 数据中心
 * @singleton 单例模式
 */
export class DataCenter {
    /**
     * @property {LOGIN_INFO | null} _loginInfo - 用户登录信息
     * @private
     */
    private _loginInfo: LOGIN_INFO | null = null;

    /**
     * @property {UserdataResponse | null} _userData - 用户数据
     * @private
     */
    private _userData: UserdataResponse | null = null;

    /**
     * @property {Array<{richType:number, richNums:number}>} _userRiches - 用户财富数据
     * @private
     */
    private _userRiches: Array<{richType:number, richNums:number}> = []

    /**
     * @property {UserstatusResponse | null} _userStatus - 用户状态信息
     * @private
     */
    private _userStatus: UserstatusResponse | null = null;

    /**
     * @property {any} _appConfig - 应用配置信息
     * @private
     */
    private _appConfig: any = null;

    /**
     * @property {string} _launchRoomid - 启动携带的roomid
     * @private
     */
    private _launchRoomid:number = 0;

    /**
     * @property {number} _gameid - 当前游戏ID
     * @private
     */
    private _gameid: number = 0;
    
    /**
     * @property {string} _roomid - 房间ID
     * @private
     */
    private _roomid: string = '';
    
    /**
     * @property {string} _gameAddr - 游戏服务器地址
     * @private
     */
    private _gameAddr: string = '';
    
    /**
     * @property {number} _shortRoomid - 短房间ID
     * @private
     */
    private _shortRoomid:number = 0;

    /**
     * @property {Object.<string, string>} _authList - 认证服务器地址列表
     * @private
     */
    private _authList: {[key:string]:string} = {
        // 'gate1':'ws://192.168.1.140:9002',
        // 'gate2':'ws://192.168.1.140:9005',
    };

    /**
     * @property {Object.<string, string>} _gameAuthList - 游戏认证服务器地址列表
     * @private
     */
    private _gameAuthList: {[key:string]:string} = {
        // 'game1':'ws://192.168.1.140:9003',
        // 'game2':'ws://192.168.1.140:9006',
    }

    /**
     * @property {Object.<string, string>} _loginList - 登录服务器地址列表
     * @private
     */
    private _loginList: {[key:string]:string} = {
        // 'game1':'ws://192.168.1.140:9003',
        // 'game2':'ws://192.168.1.140:9006',
    }

    private _channelID:ENUM_CHANNEL_ID = ENUM_CHANNEL_ID.ACCOUNT;
    private _gameRecords:GAME_RECORD | null = null;
    private _allreadyThirdLogin:boolean = false;

    /**
     * @property {AD_REWARD_INFO | null} _adRewardInfo - 广告奖励信息
     * @private
     */
    private _adRewardInfo: AD_REWARD_INFO | null = null;

    /**
     * @property {DataCenter} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: DataCenter;
    
    /**
     * @method instance
     * @description 获取DataCenter的单例实例
     * @static
     * @returns {DataCenter} DataCenter单例实例
     */
    public static get instance(): DataCenter {
        if (!this._instance) {
            this._instance = new DataCenter();
        }
        return this._instance;
    }

    /**
     * @constructor
     * @description 私有构造函数，初始化时从本地存储中加载登录信息
     * @private
     */
    private constructor(){
        const loginInfo = sys.localStorage.getItem(LOCAL_KEY.LOGIN_INFO);
        if(loginInfo){
            this._loginInfo = JSON.parse(loginInfo);
        }

    }

    set appConfig(config:any){
        this._appConfig = config
    }

    get appConfig(){
        return this._appConfig
    }

    setLoginInfo(info: LOGIN_INFO) {
        this._loginInfo = info;
        sys.localStorage.setItem(LOCAL_KEY.LOGIN_INFO, JSON.stringify(info));
    }

    getLoginInfo():LOGIN_INFO | null {
        return this._loginInfo;
    }

    addSubid(subid?:number){
        subid ? this._loginInfo && (this._loginInfo.subid = subid) : this._loginInfo && (this._loginInfo.subid++);
        sys.localStorage.setItem(LOCAL_KEY.LOGIN_INFO, JSON.stringify(this._loginInfo));
    }

    get userid():number{
        return this._loginInfo?.userid ?? 0;
    }

    set userData(data:UserdataResponse){
        this._userData = data;
    }

    get userData():UserdataResponse | null{
        return this._userData;
    }

    set headurl(url:string) {
        if (this._userData) {
            this._userData.headurl = url;
        }
    }

    get headurl():string {
        if(!this._userData?.headurl){
            return DEFAULT_HEADURL
        }else{
            return this._userData?.headurl
        }
    }

    set userRiches(data:Array<{richType:number, richNums:number}>) {
        this._userRiches = data;
    }

    get userRiches() {
        return this._userRiches;
    }

    /**
     * @description 添加财富
     * @param type 财富类型
     * @param nums 财富数量
     */
    addRichByType(type:number, nums:number) {
        const item = this._userRiches.find(rich => rich.richType === type);
        item && (item.richNums += nums)
    }

    /**
     * @description 更新财富
     * @param type 财富类型
     * @param nums 财富数量
     */
    updateRichByType(type:number, nums:number) {
        const item = this._userRiches.find(rich => rich.richType === type);
        item && (item.richNums = nums)
    }

    /**
     * @description 获取财富
     * @param type 财富类型
     * @returns {richType:number, richNums:number} | undefined
     */
    getRichByType(type:number):{richType:number, richNums:number} | undefined {
        return this._userRiches.find(rich => rich.richType === type);
    }

    set userStatus(data:UserstatusResponse) {
        this._userStatus = data;
    }

    get userStatus(): UserstatusResponse | null  {
        return this._userStatus;
    }

    set gameid(id:number) {
        this._gameid = id;
    }

    get gameid():number {
        return this._gameid;
    }

    set roomid(id:string) {
        this._roomid = id;
    }

    get roomid():string {
        return this._roomid;
    }

    set gameAddr(addr:string) {
        this._gameAddr = addr;
    }

    get gameAddr():string {
        return this._gameAddr;
    }


    set authList(list:{[key:string]:string}){
        this._authList = list;
    }

    get authList():{[key:string]:string} {
        return this._authList;
    }

    set loginList(list:{[key:string]:string}){
        this._loginList = list;
    }

    get loginList():{[key:string]:string} {
        return this._loginList;
    }


    set gameAuthList(list:{[key:string]:string}){
        this._gameAuthList = list;
    }

    get gameAuthList():{[key:string]:string} {
        return this._gameAuthList;
    }

    get loginToken():string {
        return this._loginInfo?.token ?? '';
    }

    get subid(){
        return this._loginInfo?.subid ?? 0;
    }

    get shortRoomid(){
        return this._shortRoomid;
    }

    set shortRoomid(id:number){
        this._shortRoomid = id;
    }

    set gameRecords(data:GAME_RECORD){
        this._gameRecords = data;
    }

    get gameRecords():GAME_RECORD | null{
        return this._gameRecords;
    }

    set channelID(id:ENUM_CHANNEL_ID){
        this._channelID = id;
    }

    get channelID():ENUM_CHANNEL_ID{
        return this._channelID;
    }

    set allreadyThirdLogin(b:boolean){
        this._allreadyThirdLogin = b;
    }

    get allreadyThirdLogin():boolean{
        return this._allreadyThirdLogin;
    }

    get channelLoginType():string{
        return LOGIN_TYPE[this._channelID];
    }

    isEnvDev():boolean{
        return this.appConfig.env === ENUM_ENV.DEV;
    }

    isEnvProd():boolean{
        return this.appConfig.env === ENUM_ENV.PROD;
    }

    get launchRoomid():number{ 
        return this._launchRoomid;
    }

    set launchRoomid(id:number){
        this._launchRoomid = id;
    }

    set adRewardInfo(data:AD_REWARD_INFO | null){
        this._adRewardInfo = data;
    }

    get adRewardInfo():AD_REWARD_INFO | null{
        return this._adRewardInfo;
    }
}