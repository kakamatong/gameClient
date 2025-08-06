import { LOGIN_INFO,USER_DATA, USER_STATUS, LOCAL_KEY } from "./interfaceConfig";
import { sys,resources } from "cc";

export class DataCenter {
    private _loginInfo: LOGIN_INFO | null = null;

    private _userData: USER_DATA | null = null;

    private _userRiches: Array<{richType:number, richNums:number}> = []

    private _userStatus: USER_STATUS | null = null;

    private _appConfig: any = null;

    private _gameid: number = 0;
    private _roomid: number = 0;
    private _gameAddr: string = '';

    private _authList: {[key:string]:string} = {
        'gate1':'192.168.1.140:9002',
        'gate2':'192.168.1.140:9005',
    };

    private static _instance: DataCenter;
    public static get instance(): DataCenter {
        if (!this._instance) {
            this._instance = new DataCenter();
        }
        return this._instance;
    }

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

    set userData(data:USER_DATA){
        this._userData = data;
    }

    get userData():USER_DATA | null{
        return this._userData;
    }

    set userRiches(data:Array<{richType:number, richNums:number}>) {
        this._userRiches = data;
    }

    get userRiches() {
        return this._userRiches;
    }

    set userStatus(data:USER_STATUS) {
        this._userStatus = data;
    }

    get userStatus(): USER_STATUS | null  {
        return this._userStatus;
    }

    set gameid(id:number) {
        this._gameid = id;
    }

    get gameid():number {
        return this._gameid;
    }

    set roomid(id:number) {
        this._roomid = id;
    }

    get roomid():number {
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

}