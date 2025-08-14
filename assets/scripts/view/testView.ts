import { _decorator, sys } from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import {AddEventListener,RemoveEventListener, LogColors} from '../frameworks/framework'
import {Auth} from '../modules/auth';
import {AuthGame} from '../modules/authGame';
import {Match} from '../modules/match';
import { LobbySocketManager } from '../frameworks/lobbySocketManager';
import { UIManager } from '../frameworks/uimanager';

import { Login, ACCOUNT_INFO } from '../login/login';
import { DataCenter } from '../datacenter/datacenter';
import { ENUM_USER_STATUS } from '../datacenter/interfaceConfig';
import { UserStatus } from '../modules/userStatus';
import * as fgui from "fairygui-cc";
import { AuthList } from '../modules/authList';
import { Mail } from '../modules/mail';

import FGUIrankInfo from '../fgui/test/FGUIrankInfo';
const { ccclass, property } = _decorator;
@ccclass('TestView')
export class TestView extends FGUITestView {
    private _rankList:any[] = [];
    constructor(){
        super();
        console.log('TestView constructor');
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
    }

    show(){
        console.log('TestView show');
        if(sys.isBrowser){
            this.checkAutoLogin()
        }
    }


    onEnable(){
        super.onEnable();
        console.log('TestView onEnable');
        this.UI_LV_RANKLIST.itemRenderer = this.onRankItemRenderer.bind(this);
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
        //this.UI_BTN_LOGIN.onClick(this.onBtnLogin, this);
        AddEventListener('userData',this.showUserInfo, this);
        AddEventListener('userStatus',this.showUserStatus, this);
        AddEventListener('userRichs',this.showUserRiches, this);

        LobbySocketManager.instance.addServerListen("reportUserStatus", this.updateUserStatus.bind(this));
        LobbySocketManager.instance.addServerListen("updateRich", this.onSvrUpdateRich.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSure", this.onSvrMatchOnSure.bind(this));
        LobbySocketManager.instance.addServerListen("gameRoomReady", this.onSvrGameRoomReady.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSureFail", this.onSvrMatchOnSureFail.bind(this));
    }

    onDisable(){
        super.onDisable();
        console.log('TestView onDisable');
        RemoveEventListener('userData', this.showUserInfo);
        RemoveEventListener('userStatus', this.showUserStatus);
        RemoveEventListener('userRichs', this.showUserRiches);

        LobbySocketManager.instance.removeServerListen("reportUserStatus");
        LobbySocketManager.instance.removeServerListen("reportMatch");
        LobbySocketManager.instance.removeServerListen("updateRich");
        LobbySocketManager.instance.removeServerListen("matchOnSure");
    }

    onShow(){
        console.log('TestView onShow');
    }

    checkAuthList(callBack?:(success:boolean)=>void){
        AuthList.instance.req((success:boolean, data?:any)=>{
            if(success){
                console.log('authList:', data);
            }
            callBack?.(success);

        })

    }

    checkAutoLogin(){
        // http://localhost:7456/assets/resources/native/index.html?userids=test001,test002,test003,test004&pwd=wlj123456,wlj123456,wlj123456,wlj123456
        const urlParams = new URLSearchParams(window.location.search);
        
        // 示例：获取特定参数
        const ids = urlParams.get('userid')
        const tmppwds = urlParams.get('pwd')
        if(ids && tmppwds){
            this.UI_INPUT_ACC.text = ids;
            this.UI_INPUT_PASS.text = tmppwds;
            this.onBtnLogin()
        }
    }

    // 随机取一个认证地址
    getAuthAddr(): string | undefined{
        const authList = DataCenter.instance.authList;
        const keys = Object.keys(authList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return randomKey;
    }

    login(){
        const func = (b:boolean)=>{
            console.log('login callback:', b);
            if(b){
                this.onBtnCon()
            }
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        const acc = this.UI_INPUT_ACC.text ?? "";
        const pwd = this.UI_INPUT_PASS.text ?? "";
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
            server: loginInfo?.server ?? (this.getAuthAddr() ?? "")
        };
        const login = new Login();
        login.start(accInfo,func);
    }

    onBtnLogin(){
        console.log('onBtnLogin');
        this.checkAuthList((success)=>{
            if(success){
                this.login();
            }
        })
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('TestView');
    }

    onDestroy(){
        console.log('TestView onDestroy');
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

    onBtnMatch(): void {
        Match.instance.req();
    }

    onSvrUpdateRich(data:any){
        console.log(data);
    }

    showUserRiches(data:any){
        console.log(data);
        DataCenter.instance.userRiches.forEach(element => {
            if(element.richType == 1){
                this.UI_TXT_RICH_1.text = `财富1数量：${element.richNums}`
            }

            if(element.richType == 2){
                this.UI_TXT_RICH_2.text = `财富2数量：${element.richNums}`
            }

        });
    }


    onSvrMatchOnSure(data:any){
        console.log(data);
        if(data.readys && data.readys.length > 0){
            for(let i = 0; i < data.readys.length; i++){
                const userid = data.readys[i];
                if(userid == DataCenter.instance.userid){
                    console.log(LogColors.red('已准备'));
                    return;
                }
            }

        }

        LobbySocketManager.instance.sendToServer('matchOnSure', {
            id: data.id,
            sure: true
        })
    }

    reqUserStatus(){
        const userStatus = new UserStatus()
        userStatus.req()
    }

    showUserInfo(data:any){
        this.UI_TXT_NICKNAME.text = data.nickname;
        this.UI_TXT_USERID.text =`${DataCenter.instance.userid}`
        
    }

    showUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
        if (data.status == ENUM_USER_STATUS.GAMEING){
            DataCenter.instance.gameid = data.gameid;
            DataCenter.instance.roomid = data.roomid;
            DataCenter.instance.gameAddr = data.addr;
            console.log(LogColors.green('返回房间'));

            // UIManager.instance.showView('GameView');
            this.onSvrGameRoomReady(data)

        }else{

        }
    }

    updateUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
    }

    onSvrGameRoomReady(data:any){
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        console.log(LogColors.green('游戏房间准备完成'));
        //UIManager.instance.showView('GameView');
        const callBack = (success:boolean)=>{
            if(success){
                UIManager.instance.showView('GameView');
                //console.log(LogColors.green("游戏服务连接成功"))
            }
        }
        AuthGame.instance.req(DataCenter.instance.gameAddr,DataCenter.instance.gameid, DataCenter.instance.roomid, callBack);
        
    }

    onSvrMatchOnSureFail(data:any){
        console.log(LogColors.red(data.msg));
    }

    onBtnShow(): void {
        //UIManager.instance.showView('GameView');
        const func = (result:any)=>{
            console.log(result);
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                console.log(res);
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc', {moduleName : 'daySignIn', funcName : 'getSignInInfo', args:JSON.stringify({})} , func)
    }

    onBtnTest1():void{
        const func = (result:any)=>{
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                if(res.error){
                    console.log(LogColors.red(res.error));
                }else{
                    console.log(LogColors.green(res.richTypes));
                }
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc', {moduleName : 'daySignIn', funcName : 'signIn', args:JSON.stringify({})} , func)
    }

    onBtnMatchTest1(): void {
        const func = (data:any)=>{
            console.log(LogColors.green(data.msg))
        }
        LobbySocketManager.instance.sendToServer('matchTestStart',{code:1},func)
    }

    onBtnMatchTest2(): void {
        const func = (data:any)=>{
            console.log(LogColors.green(data.msg))
        }
        LobbySocketManager.instance.sendToServer('matchTestStop',{code:1},func)
    }

    onBtnTest2():void{
        const func = (result:any)=>{
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                if(res.error){
                    console.log(LogColors.red(res.error));
                }else{
                    console.log(LogColors.green(res.richTypes));
                }
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'daySignIn', funcName : 'fillSignIn', args:JSON.stringify({index:6})} , func)
    }

    getStatusText(status:number):string{
        switch(status){
            case ENUM_USER_STATUS.GAMEING:
                return '游戏中';
            case ENUM_USER_STATUS.MATCHING:
                return '匹配中';
            case ENUM_USER_STATUS.READY:
                return '准备中';
            case ENUM_USER_STATUS.OFFLINE:
                return '离线';
            case ENUM_USER_STATUS.ONLINE:
                return '在线';
            case ENUM_USER_STATUS.TEAMING:
                return '匹配中';
            case ENUM_USER_STATUS.WATCH:
                return '观战中';
            case ENUM_USER_STATUS.DISCONNECT:
                return '断线';
            default:
                return '未知';
        }
        return '';
    }

    onRankItemRenderer(index:number, item:fgui.GComponent){
        const data = this._rankList[index];
        item.getChild('UI_TXT_NAME').text = data.nickname;
        item.getChild('UI_TXT_SCORE').text = data.score.toString();
        item.getChild('UI_TXT_RANK').text = (index + 1).toString()
    }

    onBtnGetRank(): void {
        const func = (result:any)=>{
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                if(res.error){
                    console.log(LogColors.red(res.error));
                }else{
                    this._rankList = res
                    this.UI_LV_RANKLIST.numItems = res.length
                }
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , func)
    }

    onBtnGetRankSelf(): void {
        const func = (result:any)=>{
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                if(res.error){
                    console.log(LogColors.red(res.error));
                }else{
                    console.log(LogColors.green(res));
                }
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc',{moduleName : 'gameRank', funcName : 'getRank', args:JSON.stringify({})} , func)
    }

    onBtnMail(): void {
        Mail.instance.list((success:boolean, data?:any)=>{
            if(success){
                console.log(LogColors.green(data));
                UIManager.instance.showView('MailView',data);
            }
        })  

    }
}
