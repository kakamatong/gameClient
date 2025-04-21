import { LOGIN_INFO,USER_DATA } from "./interfaceConfig";

export class DataCenter {
    private _loginInfo: LOGIN_INFO = {
        username: '',
        userid: 0,
        password: '',
        server: '',
        loginType: '',
        token: '',
        subid:0
    };

    private _userData: USER_DATA = {
        userid: 0,
        nickname: '',
        headurl: '',
        sex: 0,
        province: '',
        city: '',
        ip: '',
        ext: ''
    }


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

    getLoginInfo() {
        return this._loginInfo;
    }

    addSubid(subid:number){
        this._loginInfo.subid = subid;
    }

    get userid(){
        return this._loginInfo.userid;
    }

    set userData(data:USER_DATA){
        this._userData = data;
    }

    get userData(){
        return this._userData;
    }

}