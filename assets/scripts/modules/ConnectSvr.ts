import { DataCenter } from "../datacenter/Datacenter";
import { ENUM_CHANNEL_ID, LOGIN_TYPE } from "../datacenter/InterfaceConfig";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/Login";
import { MiniGameUtils } from "../frameworks/utils/sdk/MiniGameUtils";
import { HttpPostWithDefaultJWT } from "../frameworks/utils/Utils";
import { Auth } from "./Auth";
import { AuthList } from "./AuthList";
import { sys } from 'cc';
export class ConnectSvr { 
    private static _instance: ConnectSvr;

    public static get instance(): ConnectSvr {
        if (!this._instance) {
            this._instance = new ConnectSvr();
        }
        return this._instance;
    }

    httpLogin(data:any, callBack?:(b:boolean, data:any)=>void){ 
        const payload = {
            'userid':0,
            'channelid':DataCenter.instance.channelID
        }

        const req = {
            appid:1,
            loginType:DataCenter.instance.channelLoginType,
            loginData:data
        }
        const url = DataCenter.instance.appConfig.webUrl + "/api/game/thirdlogin";
        HttpPostWithDefaultJWT(url, req, payload).then(data => {
            console.log(data)
            if (data.code == 200) {
                callBack && callBack(true, data);
            }else{
                callBack && callBack(false, data);
            }
        })
        .catch(error => {
            callBack && callBack(false, error);
        });
    }

    checkAutoLogin(callBack?:(b:boolean)=>void){
        //this.autoLogin(false, callBack)
        this.checkPlatformLogin(false, callBack)
    }

    checkPlatformLogin(needLogin:boolean = false, callBack?:(b:boolean)=>void){
        if (MiniGameUtils.instance.isThirdPlatform() && (!DataCenter.instance.allreadyThirdLogin || needLogin)) {
            const func = (success:boolean,data:any) => { 
                if (success) {
                    console.log('third login success ', data)
                    // todo:weblogin
                    DataCenter.instance.allreadyThirdLogin = true;
                    const func2 = (b:boolean, data:any)=>{
                        if (b) {
                            // 将认证列表数据存储到DataCenter
                            //callBack && callBack(true)
                            this.thirdLogin(data.data.openid, data.data.token, callBack)
                        }else{
                            callBack && callBack(false)
                        }
                    }
                    this.httpLogin(data,func2)
                }else{
                    callBack && callBack(false)
                }
            };
            MiniGameUtils.instance.login(null, func)
        }else{
            this.autoLogin(needLogin, callBack)
        }
    }

    thirdLogin(acc:string, pwd: string,callBack?:(b:boolean)=>void){ 
        this.checkAuthList((success)=>{
            if(success){
                const data = {
                    acc:acc,
                    pwd:pwd,
                    loginType:DataCenter.instance.channelLoginType
                }
                this.login(data, callBack);
            }else{
                callBack && callBack(false)
            }
        })
    }

    autoLogin(needLogin:boolean = false, callBack?:(b:boolean)=>void):void{
        this.checkAuthList((success)=>{
            if(success){
                // 多开处理
                if (sys.isBrowser) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const acc = urlParams.get('userid')
                    const pwd = urlParams.get('pwd')
                    if (acc && pwd) {
                        const data = {
                            acc:acc,
                            pwd:pwd,
                            loginType:LOGIN_TYPE[ENUM_CHANNEL_ID.ACCOUNT]
                        }
                        this.login(data, callBack);
                        return
                    }
                }

                const loginInfo = DataCenter.instance.getLoginInfo();
                if (loginInfo && loginInfo.userid > 0 && !needLogin) {
                    const func = (b:boolean)=>{ 
                        if (!b) {
                            this.autoLogin(true, callBack)
                        }else{
                            callBack && callBack(true)
                        }
                    }
                    this.connect(func)
                }else{
                    // 随机注册账号
                    const acc = `tourist_${new Date().getTime()}`
                    const data = {
                        acc:acc,
                        pwd:'tourist123',
                        loginType:LOGIN_TYPE[ENUM_CHANNEL_ID.ACCOUNT]
                    }
                    this.login(data, callBack);
                }
            }else{
                callBack && callBack(false)
            }
        })
    }

    accLogin(acc:string, pwd: string,callBack?:(success:boolean)=>void){
        this.checkAuthList((success)=>{
            if(success){
                const data = {
                    acc:acc,
                    pwd:pwd,
                    loginType:LOGIN_TYPE[ENUM_CHANNEL_ID.ACCOUNT]
                }
                this.login(data, callBack)
            }else{
                callBack && callBack(false)
            }
        })
    }

    checkAuthList(callBack?:(success:boolean)=>void){
        AuthList.instance.req((success:boolean, data?:any)=>{
            if(success){
                console.log('authList:', data);
            }
            callBack?.(success);
        })
    }

    login(data:any, callBack?:(b:boolean)=>void){
        const func = (b:boolean, data?:any)=>{
            console.log('login callback:', b);
            if(b){
                data.password = ''
                DataCenter.instance.setLoginInfo(data);
                this.connect(callBack)
            }else{
                callBack && callBack(false)
            }
        }

        const loginInfo = DataCenter.instance.getLoginInfo();
        const accInfo: ACCOUNT_INFO = {
            username: data.acc,
            password: data.pwd,
            server: loginInfo?.server ?? (this.getAuthAddr() ?? ""),
            loginType:data.loginType
        };
        const login = new Login();
        login.start(accInfo, DataCenter.instance.loginList, func);
    }

    connect(callBack?:(b:boolean)=>void): void {
        if(LobbySocketManager.instance.isOpen()){
            LobbySocketManager.instance.close()
            setTimeout(()=>{
                Auth.instance.req(callBack);
            }, 500)
        }else{
            Auth.instance.req(callBack);
        }
    }

    getAuthAddr(): string | undefined{
        const authList = DataCenter.instance.authList;
        const keys = Object.keys(authList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return randomKey;
    }
}