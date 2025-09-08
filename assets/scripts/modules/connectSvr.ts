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

    checkAutoLogin(){
        this.startLogin()
    }

    startLogin():void{
        this.checkAuthList((success)=>{
            if(success){
                this.login();
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

    login(){
        const func = (b:boolean, data?:any)=>{
            console.log('login callback:', b);
            if(b){
                DataCenter.instance.setLoginInfo(data);
                this.onBtnCon()
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const acc = urlParams.get('userid') ?? "wlj001"
        const pwd = urlParams.get('pwd') ?? "wlj123456"

        const loginInfo = DataCenter.instance.getLoginInfo();
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
            server: loginInfo?.server ?? (this.getAuthAddr() ?? "")
        };
        const login = new Login();
        login.start(accInfo, DataCenter.instance.loginList, func);
    }

    onBtnCon(): void {
        if(LobbySocketManager.instance.isOpen()){
            LobbySocketManager.instance.close()
            setTimeout(()=>{
                Auth.instance.req();
            }, 500)
        }else{
            Auth.instance.req();
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