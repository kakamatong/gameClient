import { DataCenter } from "../datacenter/datacenter";
import { LobbySocketManager } from "../frameworks/lobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/login";
import { MiniGameUtils } from "../frameworks/utils/sdk/miniGameUtils";
import { httpPostWithDefaultJWT } from "../frameworks/utils/utils";
import { Auth } from "./auth";
import { AuthList } from "./authList";
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
            loginType:"",
            loginData:data
        }
        const url = DataCenter.instance.appConfig.webUrl + "/api/game/thirdlogin";
        httpPostWithDefaultJWT(url, req, payload).then(data => {
            console.log(data)
            callBack && callBack(true, data);
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
                    // todo:weblogin
                    DataCenter.instance.allreadyThirdLogin = true;
                    const func2 = (b:boolean, data:any)=>{
                        if (b) {
                            // 将认证列表数据存储到DataCenter
                            //callBack && callBack(true)
                            this.thirdLogin(data.openid, data.token, callBack)
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
                this.login(acc, pwd, callBack);
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
                        this.login(acc, pwd, callBack);
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
                    this.login(acc, 'tourist123', callBack);
                }
            }else{
                callBack && callBack(false)
            }
        })
    }

    accLogin(acc:string, pwd: string,callBack?:(success:boolean)=>void){
        this.checkAuthList((success)=>{
            if(success){
                this.login(acc, pwd, callBack)
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

    login(acc:string, pwd: string, callBack?:(b:boolean)=>void){
        const func = (b:boolean, data?:any)=>{
            console.log('login callback:', b);
            if(b){
                DataCenter.instance.setLoginInfo(data);
                this.connect(callBack)
            }else{
                callBack && callBack(false)
            }
        }

        const loginInfo = DataCenter.instance.getLoginInfo();
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
            server: loginInfo?.server ?? (this.getAuthAddr() ?? "")
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