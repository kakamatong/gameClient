/**
 * @file ConnectSvr.ts
 * @description 服务器连接模块：处理登录、认证和连接服务器的逻辑
 * @category 网络请求模块
 */

import { DataCenter } from "../datacenter/Datacenter";
import { ENUM_CHANNEL_ID, LOGIN_TYPE } from "../datacenter/InterfaceConfig";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/Login";
import { MiniGameUtils } from "../frameworks/utils/sdk/MiniGameUtils";
import { HttpPostWithDefaultJWT } from "../frameworks/utils/Utils";
import { Auth } from "./Auth";
import { AuthList } from "./AuthList";
import { sys } from 'cc';

/**
 * @class ConnectSvr
 * @description 服务器连接管理类，负责处理用户登录、认证和服务器连接，使用单例模式
 * @category 网络请求模块
 * @singleton 单例模式
 */
export class ConnectSvr {
    /** 单例实例 */
    private static _instance: ConnectSvr;

    /**
     * @description 获取 ConnectSvr 单例实例
     * @returns ConnectSvr 单例实例
     */
    public static get instance(): ConnectSvr {
        if (!this._instance) {
            this._instance = new ConnectSvr();
        }
        return this._instance;
    }

    /**
     * @description 发送 HTTP 登录请求
     * @param data 登录数据
     * @param callBack 回调函数
     */
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

    /**
     * @description 检查自动登录
     * @param callBack 回调函数
     */
    checkAutoLogin(callBack?:(b:boolean)=>void){
        //this.autoLogin(false, callBack)
        this.checkPlatformLogin(false, callBack)
    }

    /**
     * @description 检查平台登录（第三方平台）
     * @param needLogin 是否需要强制登录
     * @param callBack 回调函数
     */
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

    /**
     * @description 第三方登录
     * @param acc 账号
     * @param pwd 密码
     * @param callBack 回调函数
     */
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

    /**
     * @description 自动登录
     * @param needLogin 是否需要重新登录
     * @param callBack 回调函数
     */
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

    /**
     * @description 账号密码登录
     * @param acc 账号
     * @param pwd 密码
     * @param callBack 回调函数
     */
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

    /**
     * @description 检查认证列表是否已获取
     * @param callBack 回调函数
     */
    checkAuthList(callBack?:(success:boolean)=>void){
        AuthList.instance.req((success:boolean, data?:any)=>{
            if(success){
                console.log('authList:', data);
            }
            callBack?.(success);
        })
    }

    /**
     * @description 登录处理
     * @param data 登录数据
     * @param callBack 回调函数
     */
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

    /**
     * @description 连接到服务器
     * @param callBack 回调函数
     */
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

    /**
     * @description 获取认证服务器地址
     * @returns 认证服务器地址，如果没有则返回 undefined
     */
    getAuthAddr(): string | undefined{
        const authList = DataCenter.instance.authList;
        const keys = Object.keys(authList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return randomKey;
    }
}