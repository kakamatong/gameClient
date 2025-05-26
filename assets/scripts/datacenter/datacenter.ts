import { LOGIN_INFO,USER_DATA, USER_STATUS } from "./interfaceConfig";

export class DataCenter {
    private _loginInfo: LOGIN_INFO | null = null;

    private _userData: USER_DATA | null = null;

    private _userRiches: Array<{richType:number, richNums:number}> = []

    private _userStatus: USER_STATUS | null = null;


    private static _instance: DataCenter;
    public static get instance(): DataCenter {
        if (!this._instance) {
            this._instance = new DataCenter();
        }
        return this._instance;
    }

    setLoginInfo(info: LOGIN_INFO) {
        this._loginInfo = info;
    }

    getLoginInfo():LOGIN_INFO | null {
        return this._loginInfo;
    }

    addSubid(subid:number){
        this._loginInfo && (this._loginInfo.subid = subid);
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

}