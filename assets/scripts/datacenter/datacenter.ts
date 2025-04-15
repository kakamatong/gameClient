import { LOGIN_INFO } from "./interfaceConfig";

export class DataCenter {
    private loginInfo: LOGIN_INFO = {
        username: '',
        password: '',
        server: '',
        loginType: '',
        token: '',
        subid:0
    };


    private static _instance: DataCenter;
    public static get instance(): DataCenter {
        if (!this._instance) {
            this._instance = new DataCenter();
        }
        return this._instance;
    }

    setLoginInfo(info: LOGIN_INFO) {
        this.loginInfo = info;
    }

    getLoginInfo() {
        return this.loginInfo;
    }

}