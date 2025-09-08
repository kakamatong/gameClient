import { DataCenter } from "../datacenter/datacenter";
import { LobbySocketManager } from "../frameworks/lobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/login";
import { Auth } from "./auth";
import { AuthList } from "./authList";


export class ConnectSvr { 
    private static _instance: ConnectSvr;

    public static get instance(): ConnectSvr {
        if (!this._instance) {
            this._instance = new ConnectSvr();
        }
        return this._instance;
    }

    checkAutoLogin(callBack?:(b:boolean)=>void){
        this.autoLogin(false, callBack)
    }

    autoLogin(needLogin:boolean = false, callBack?:(b:boolean)=>void):void{
        this.checkAuthList((success)=>{
            if(success){
                const loginInfo = DataCenter.instance.getLoginInfo();
                if (loginInfo && loginInfo.userid > 0 && !needLogin) {
                    const func = (b:boolean)=>{ 
                        if (!b) {
                            this.autoLogin(true)
                        }
                    }
                    this.connect(func)
                }else{
                    const urlParams = new URLSearchParams(window.location.search);
                    const acc = urlParams.get('userid') ?? "test001"
                    const pwd = urlParams.get('pwd') ?? "wlj1234561"
                    this.login(acc, pwd, callBack);
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