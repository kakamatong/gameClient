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
const { ccclass, property } = _decorator;
@ccclass('TestView')
export class TestView extends FGUITestView {
    constructor(){
        super();
        console.log('TestView constructor');
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
    }

    onEnable(){
        super.onEnable();
        console.log('TestView onEnable');
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
        //this.UI_BTN_LOGIN.onClick(this.onBtnLogin, this);
        AddEventListener('userData',this.showUserInfo, this);
        AddEventListener('userStatus',this.showUserStatus, this);
        LobbySocketManager.instance.addServerListen("reportUserStatus", this.updateUserStatus.bind(this));
        LobbySocketManager.instance.addServerListen("updateRich", this.onSvrUpdateRich.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSure", this.onSvrMatchOnSure.bind(this));
        LobbySocketManager.instance.addServerListen("gameRoomReady", this.onSvrGameRoomReady.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSureFail", this.onSvrMatchOnSureFail.bind(this));
        if(sys.isBrowser){
            this.checkAutoLogin()
        }
    }

    onDisable(){
        super.onDisable();
        console.log('TestView onDisable');
        RemoveEventListener('userData', this.showUserInfo);
        RemoveEventListener('userStatus', this.showUserStatus);
        LobbySocketManager.instance.removeServerListen("reportUserStatus");
        LobbySocketManager.instance.removeServerListen("reportMatch");
        LobbySocketManager.instance.removeServerListen("updateRich");
        LobbySocketManager.instance.removeServerListen("matchOnSure");
    }

    onShow(){
        console.log('TestView onShow');
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

    onBtnLogin(){
        console.log('onBtnLogin');
        const func = (b:boolean)=>{
            console.log('login callback:', b);
            if(b){
                this.onBtnCon()
            }
        }
        const acc = this.UI_INPUT_ACC.text ?? "";
        const pwd = this.UI_INPUT_PASS.text ?? "";
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
        };
        const login = new Login();
        login.start(accInfo,func);
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
        Auth.instance.req();
    }

    onBtnMatch(): void {
        Match.instance.req();
    }

    onSvrUpdateRich(data:any){
        console.log(data);
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

        LobbySocketManager.instance.callServer('match','', 'onSure', {
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
        console.log(LogColors.green('游戏房间准备完成'));
        //UIManager.instance.showView('GameView');
        const callBack = (success:boolean)=>{
            if(success){
                UIManager.instance.showView('GameView');
                //console.log(LogColors.green("游戏服务连接成功"))
            }
        }
        AuthGame.instance.req(DataCenter.instance.gameid, DataCenter.instance.roomid, callBack);
        
    }

    onSvrMatchOnSureFail(data:any){
        console.log(LogColors.red(data.msg));
    }

    onBtnShow(): void {
        //UIManager.instance.showView('GameView');
        const func = (result:any)=>{
            const a = 1
            console.log(result);
            const b = 2
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                console.log(res);
            }
        }
        LobbySocketManager.instance.callServer('activity','daySignIn','getSignInInfo', {} , func)
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
        LobbySocketManager.instance.callServer('activity','daySignIn','signIn', {} , func)
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
        LobbySocketManager.instance.callServer('activity','daySignIn','fillSignIn', {index:6} , func)
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
}
