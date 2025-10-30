
import FGUILobbyView from '../../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
import { AddEventListener, ChangeScene, LogColors, RemoveEventListener } from '../../frameworks/Framework';
import { DataCenter } from '../../datacenter/Datacenter';
import {ConnectSvr} from '../../modules/ConnectSvr';
import { PopMessageView } from '../common/PopMessageView';
import {ENUM_POP_MESSAGE_TYPE, ENUM_USER_STATUS, LOBBY_SHARE_PIC_URL} from '../../datacenter/InterfaceConfig';
import { TipsView } from '../common/TipsView';
import { LobbySocketManager } from '../../frameworks/LobbySocketManager';
import { Rank } from '../../modules/Rank';
import { RankView } from '../rank/RankView';
import { LoadingView } from '../common/LoadingView';
import { Match } from '../../modules/Match';
import { MatchView } from '../match/MatchView';
import { AuthGame } from '../../modules/AuthGame';
import FGUICompHead from '../../fgui/common/FGUICompHead';
import { MailView } from '../mail/MailView';
import { Mail } from '../../modules/Mail';
import { PrivateRoomView } from '../privateRoom/PrivateRoomView';
import { UserCenterView } from '../userCenter/UserCenterView';
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';
export class LobbyView extends FGUILobbyView {

    private _node1: fgui.GObject | null = null;
    private _node2: fgui.GObject | null = null;
    private _node3: fgui.GObject | null = null;
    private _node4: fgui.GObject | null = null;

    onConstruct(){
        super.onConstruct();
        this.initListeners();
        this.initUI();
        this.startLogin();
    }

    initListeners(){
        AddEventListener('userData',this.onUserInfo, this);
        AddEventListener('userStatus',this.onUserStatus, this);
        AddEventListener('userRichs',this.onUserRiches, this);
        AddEventListener('socketDisconnect',this.onSocketDisconnect, this);
        LobbySocketManager.instance.addServerListen("gameRoomReady", this.onSvrGameRoomReady.bind(this));
        this.UI_COMP_TOP.UI_COMP_HEAD.onClick(this.onBtnHead, this);
    }

    onDestroy(){
        super.onDestroy();
        RemoveEventListener('userData', this.onUserInfo);
        RemoveEventListener('userStatus', this.onUserStatus);
        RemoveEventListener('userRichs', this.onUserRiches);
        RemoveEventListener('socketDisconnect', this.onSocketDisconnect);
        LobbySocketManager.instance.removeServerListen("gameRoomReady");
    }

    onBtnHead(){
        UserCenterView.showView();
    }

    initUI(){ 
        this._node1 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_1
        this._node2 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_2
        this._node3 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_3
        this._node4 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_4
        if (DataCenter.instance.isEnvDev()) {
            this.UI_TXT_ENV.visible = true
        }
    }

    onSocketDisconnect(){
        const comp = this.node.components[0]
        const func = ()=>{
            this.startLogin()
        }
        comp.scheduleOnce(func, 0.2)
        
    }

    startLogin(){
        if (LobbySocketManager.instance.isOpen()) {
            this.updateUserInfo()
            return
        }
        LoadingView.showView({content:"登入中...", time:12});
        const func = (b:boolean) => { 
            LoadingView.hideView();
            if (!b) {
                const func1 = ()=>{
                    this.startLogin()
                }
                PopMessageView.showView({title:'温馨提示', content:'登入失败,是否重新登入？', type:ENUM_POP_MESSAGE_TYPE.NUM1SURE, sureBack: func1})
            }else{
                this.onLoginSuccess()
            }
        }
        ConnectSvr.instance.checkAutoLogin(func)
    }

    onLoginSuccess(){ 
        this.checkPrivateRoomid()
    }

    checkPrivateRoomid(){
        const options = MiniGameUtils.instance.getLaunchOptionsSync()
        if (options.query && options.query.roomid) { 
            DataCenter.instance.launchRoomid = Number(options.query.roomid)
            
        }
    }

    updateUserInfo():void{
        this.UI_COMP_TOP.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_COMP_TOP.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        //(this.UI_COMP_TOP.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
        (this.UI_COMP_TOP.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
    }

    onUserInfo(data:any):void{
        console.log("userData",data)
        this.updateUserInfo()
    }

    onUserStatus(data:any):void{
        console.log("userStatus",data)

        if (data.status == ENUM_USER_STATUS.GAMEING){
            const func2 =()=>{
                DataCenter.instance.gameid = data.gameid;
                DataCenter.instance.roomid = data.roomid;
                DataCenter.instance.gameAddr = data.addr;
                DataCenter.instance.shortRoomid = data.shortRoomid // 匹配房
                console.log(LogColors.green('返回房间'));
                this.connectToGame(data.addr, data.gameid, data.roomid);
            }
            PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
        }
    }

    onUserRiches(data:any):void{
        console.log("userRiches",data)
    }

    onBtnMatchRoom(): void {
        const func = (b:boolean, data?:any)=>{
            if (b) {
                // 显示匹配view
                MatchView.showView();
            }else{
                if (data && data.gameid && data.roomid) {
                    const func2 =()=>{
                        //返回房间
                        DataCenter.instance.gameid = data.gameid;
                        DataCenter.instance.roomid = data.roomid;
                        DataCenter.instance.gameAddr = data.addr;
                        DataCenter.instance.shortRoomid = data.shortRoomid // 匹配房
                        console.log(LogColors.green('返回房间'));
                        this.connectToGame(data.addr, data.gameid, data.roomid);
                    }
                    PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
                }
            }
        }
        Match.instance.req(0,func);
    }

    onBtnPrivateRoom(): void {
        PrivateRoomView.showView({connectToGame:this.connectToGame.bind(this)})
    }

    onBtnMails(): void {
        Mail.instance.list((success:boolean, data?:any)=>{
            LoadingView.hideView();
            if(success){
                console.log(LogColors.green(data));
                MailView.showView(data)
            }else{
                TipsView.showView({content:`拉取邮件数据失败`})
            }
        })  
        LoadingView.showView({content:"拉取数据中...", time:12});
    }

    onBtnRank(): void {
        const func = (b:boolean, data:any) => { 
            LoadingView.hideView();
            if (b) {
                RankView.showView(data)
            }else{
                TipsView.showView({content:`拉取排行榜数据失败`})
            }
        }
        const rank = new Rank()
        rank.req(func)
        LoadingView.showView({content:"拉取数据中...", time:12});
    }

    changeToGameScene():void{
        ChangeScene('GameScene');
    }

    connectToGame(addr:string, gameid:number, roomid:string){
        const callBack = (success:boolean)=>{
            if(success){
                this.changeToGameScene()
            }
        }
        AuthGame.instance.req(addr,gameid, roomid, callBack);
    }

    onSvrGameRoomReady(data:any):void{
        console.log("gameRoomReady",data)
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        DataCenter.instance.shortRoomid = 0 // 匹配房
        console.log(LogColors.green('游戏房间准备完成'));
        this.connectToGame(data.addr, data.gameid, data.roomid);
    }

    onUpdate():void{
        if (!this._node1 || !this._node2 || !this._node3 || !this._node4) {
            return
        }
        const d = 0.5
        this._node1.x = this._node1.x - d
        this._node1.y = this._node1.y - d

        this._node2.x = this._node2.x - d
        this._node2.y = this._node2.y - d

        this._node3.x = this._node3.x - d
        this._node3.y = this._node3.y - d

        this._node4.x = this._node4.x - d
        this._node4.y = this._node4.y - d

        if (this._node1.x < -1530) {
            this._node1.x = 210
            this._node1.y = 902
        }

        if (this._node2.x < -1530) {
            this._node2.x = 210
            this._node2.y = 902
        }

        if (this._node3.x < -1530) {
            this._node3.x = 210
            this._node3.y = 902
        }

        if (this._node4.x < -1530) {
            this._node4.x = 210
            this._node4.y = 902
        }
    }

    onBtnShare(): void {
        MiniGameUtils.instance.shareAppMessage({title:'约上好友来一局石头剪刀布', imageUrl: LOBBY_SHARE_PIC_URL, query:''})
    }

}
// 继承出来的对象，必须重写
fgui.UIObjectFactory.setExtension(LobbyView.URL, LobbyView);