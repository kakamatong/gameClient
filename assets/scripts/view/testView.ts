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
import { AwardNotices } from '../modules/awardNotices';
const { ccclass, property } = _decorator;

/**
 * @class TestView
 * @extends FGUITestView
 * @description 测试视图类，用于处理游戏客户端的主要测试逻辑，包括UI交互、登录、匹配、游戏流程等。
 */
@ccclass('TestView')
export class TestView extends FGUITestView {
    /**
     * @private
     * @type {any[]}
     * @description 存储排行榜数据的数组。
     */
    private _rankList:any[] = [];

    /**
     * @constructor
     * @description TestView的构造函数。
     */
    constructor(){
        super();
        console.log('TestView constructor');
    }

    /**
     * @method show
     * @description 视图显示时的回调。如果在浏览器环境中，则检查是否需要自动登录。
     */
    show(){
        console.log('TestView show');
        if(sys.isBrowser){
            this.checkAutoLogin()
        }
    }

    /**
     * @method onEnable
     * @description 组件启用时的回调，在此注册事件监听器。
     */
    onEnable(){
        super.onEnable();
        console.log('TestView onEnable');
        this.UI_LV_RANKLIST.itemRenderer = this.onRankItemRenderer.bind(this);
        
        AddEventListener('userData',this.showUserInfo, this);
        AddEventListener('userStatus',this.showUserStatus, this);
        AddEventListener('userRichs',this.showUserRiches, this);

        LobbySocketManager.instance.addServerListen("reportUserStatus", this.updateUserStatus.bind(this));
        LobbySocketManager.instance.addServerListen("updateRich", this.onSvrUpdateRich.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSure", this.onSvrMatchOnSure.bind(this));
        LobbySocketManager.instance.addServerListen("gameRoomReady", this.onSvrGameRoomReady.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSureFail", this.onSvrMatchOnSureFail.bind(this));
    }

    /**
     * @method onDisable
     * @description 组件禁用时的回调，在此移除事件监听器。
     */
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

    /**
     * @method onShow
     * @description 视图在UIManager中显示时的回调。
     */
    onShow(){
        console.log('TestView onShow');
    }

    /**
     * @method checkAuthList
     * @param { (success:boolean)=>void } [callBack] - 请求完成后的回调函数。
     * @description 请求认证服务器地址列表。
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
     * @method checkAutoLogin
     * @description 检查URL参数，如果包含用户信息，则自动填充并尝试登录。
     */
    checkAutoLogin(){
        const urlParams = new URLSearchParams(window.location.search);
        
        const ids = urlParams.get('userid')
        const tmppwds = urlParams.get('pwd')
        if(ids && tmppwds){
            this.UI_INPUT_ACC.text = ids;
            this.UI_INPUT_PASS.text = tmppwds;
            this.onBtnLogin()
        }
    }

    /**
     * @method getAuthAddr
     * @returns {string | undefined} - 返回一个随机的认证服务器地址。
     * @description 从认证地址列表中随机获取一个地址。
     */
    getAuthAddr(): string | undefined{
        const authList = DataCenter.instance.authList;
        const keys = Object.keys(authList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return randomKey;
    }

    /**
     * @method login
     * @description 执行登录逻辑，使用UI输入框中的账号和密码。
     */
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

    /**
     * @method onBtnLogin
     * @description 登录按钮点击事件处理函数。先获取认证列表，成功后再执行登录。
     */
    onBtnLogin(){
        console.log('onBtnLogin');
        this.checkAuthList((success)=>{
            if(success){
                this.login();
            }
        })
    }

    /**
     * @method onBtnClose
     * @description 关闭按钮点击事件处理函数，隐藏当前视图。
     */
    onBtnClose(){
        console.log('onBtnClose');
        UIManager.instance.hideView('TestView');
    }

    /**
     * @method onDestroy
     * @description 组件销毁时的回调。
     */
    onDestroy(){
        console.log('TestView onDestroy');
    }
    
    /**
     * @method onBtnCon
     * @description 连接按钮点击事件处理函数。如果已连接则先断开，然后请求大厅认证。
     */
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

    /**
     * @method onBtnMatch
     * @description 匹配按钮点击事件处理函数。
     */
    onBtnMatch(): void {
        Match.instance.req();
    }

    /**
     * @method onSvrUpdateRich
     * @param {any} data - 服务器推送的财富更新数据。
     * @description 处理服务器推送的财富更新消息。
     */
    onSvrUpdateRich(data:any){
        console.log(data);
    }

    /**
     * @method showUserRiches
     * @param {any} data - 用户财富数据。
     * @description 显示用户财富信息到UI。
     */
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

    /**
     * @method onSvrMatchOnSure
     * @param {any} data - 服务器推送的匹配确认数据。
     * @description 处理服务器的匹配确认请求，如果自己尚未确认，则发送确认消息。
     */
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

    /**
     * @method reqUserStatus
     * @description 请求用户当前状态。
     */
    reqUserStatus(){
        const userStatus = new UserStatus()
        userStatus.req()
    }

    /**
     * @method showUserInfo
     * @param {any} data - 用户信息数据。
     * @description 在UI上显示用户昵称和ID。
     */
    showUserInfo(data:any){
        this.UI_TXT_NICKNAME.text = data.nickname;
        this.UI_TXT_USERID.text =`${DataCenter.instance.userid}`
    }

    /**
     * @method showUserStatus
     * @param {any} data - 用户状态数据。
     * @description 根据用户状态更新UI，如果用户在游戏中，则尝试返回房间。
     */
    showUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
        if (data.status == ENUM_USER_STATUS.GAMEING){
            DataCenter.instance.gameid = data.gameid;
            DataCenter.instance.roomid = data.roomid;
            DataCenter.instance.gameAddr = data.addr;
            console.log(LogColors.green('返回房间'));
            this.onSvrGameRoomReady(data)
        }else{

        }
    }

    /**
     * @method updateUserStatus
     * @param {any} data - 服务器推送的用户状态数据。
     * @description 更新UI上的用户状态文本。
     */
    updateUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
    }

    /**
     * @method connectToGame
     * @param {string} addr - 游戏服务器地址。
     * @param {number} gameid - 游戏ID。
     * @param {string} roomid - 房间ID。
     * @description 连接到游戏服务器，成功后显示游戏视图。
     */
    connectToGame(addr:string, gameid:number, roomid:string){
        const callBack = (success:boolean)=>{
            if(success){
                UIManager.instance.showView('GameView');
            }
        }
        AuthGame.instance.req(addr,gameid, roomid, callBack);
    }

    /**
     * @method onSvrGameRoomReady
     * @param {any} data - 游戏房间准备就绪数据。
     * @description 处理游戏房间准备就绪消息，保存游戏信息并连接到游戏服务器。
     */
    onSvrGameRoomReady(data:any){
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        console.log(LogColors.green('游戏房间准备完成'));
        this.connectToGame(data.addr, data.gameid, data.roomid);
    }

    /**
     * @method onSvrMatchOnSureFail
     * @param {any} data - 匹配确认失败数据。
     * @description 处理匹配确认失败消息。
     */
    onSvrMatchOnSureFail(data:any){
        console.log(LogColors.red(data.msg));
    }

    /**
     * @method onBtnShow
     * @description "显示"按钮点击事件处理函数，用于测试调用活动模块功能(获取签到信息)。
     */
    onBtnShow(): void {
        const func = (result:any)=>{
            console.log(result);
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                console.log(res);
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc', {moduleName : 'daySignIn', funcName : 'getSignInInfo', args:JSON.stringify({})} , func)
    }

    /**
     * @method onBtnTest1
     * @description 测试按钮1点击事件处理函数，用于测试签到功能。
     */
    onBtnTest1():void{
        const func = (result:any)=>{
            if(result && result.code == 1){
                const res = JSON.parse(result.result);
                if(res.error){
                    console.log(LogColors.red(res.error));
                }else{
                    // 签到成功后，消费通知ID
                    const noticeid = res.noticeid;
                    const awardNotices = new AwardNotices()
                    awardNotices.reqRead(noticeid)

                    console.log(LogColors.green(res.awards.richTypes));
                }
            }
        }
        LobbySocketManager.instance.sendToServer('callActivityFunc', {moduleName : 'daySignIn', funcName : 'signIn', args:JSON.stringify({})} , func)
    }

    /**
     * @method onBtnMatchTest1
     * @description 匹配测试按钮1点击事件处理函数，用于启动匹配测试。
     */
    onBtnMatchTest1(): void {
        const func = (data:any)=>{
            console.log(LogColors.green(data.msg))
        }
        LobbySocketManager.instance.sendToServer('matchTestStart',{code:1},func)
    }

    /**
     * @method onBtnMatchTest2
     * @description 匹配测试按钮2点击事件处理函数，用于停止匹配测试。
     */
    onBtnMatchTest2(): void {
        const func = (data:any)=>{
            console.log(LogColors.green(data.msg))
        }
        LobbySocketManager.instance.sendToServer('matchTestStop',{code:1},func)
    }

    /**
     * @method onBtnTest2
     * @description 测试按钮2点击事件处理函数，用于测试补签功能。
     */
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

    /**
     * @method getStatusText
     * @param {number} status - 用户状态码。
     * @returns {string} - 返回对应状态的文本描述。
     * @description 将用户状态码转换为可读的文本。
     */
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

    /**
     * @method onRankItemRenderer
     * @param {number} index - 列表项的索引。
     * @param {fgui.GComponent} item - 列表项组件。
     * @description 渲染排行榜列表的单个项目。
     */
    onRankItemRenderer(index:number, item:fgui.GComponent){
        const data = this._rankList[index];
        item.getChild('UI_TXT_NAME').text = data.nickname;
        item.getChild('UI_TXT_SCORE').text = data.score.toString();
        item.getChild('UI_TXT_RANK').text = (index + 1).toString()
    }

    /**
     * @method onBtnGetRank
     * @description 获取排行榜按钮点击事件处理函数。请求并显示排行榜数据。
     */
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

    /**
     * @method onBtnGetRankSelf
     * @description 获取个人排名按钮点击事件处理函数。
     */
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

    /**
     * @method onBtnMail
     * @description 邮件按钮点击事件处理函数。请求邮件列表并显示邮件视图。
     */
    onBtnMail(): void {
        Mail.instance.list((success:boolean, data?:any)=>{
            if(success){
                console.log(LogColors.green(data));
                UIManager.instance.showView('MailView',data);
            }
        })  

    }

    /**
     * @method onBtnCreate
     * @description 创建房间按钮点击事件处理函数。创建私人房间并连接到游戏服务器。
     */
    onBtnCreate():void{
        const gameRule = {
            playerCnt:2
        }
        const func = (result:any)=>{
            if(result && result.code == 1){
                DataCenter.instance.gameid = result.gameid;
                DataCenter.instance.roomid = result.roomid;
                DataCenter.instance.gameAddr = result.addr;
                DataCenter.instance.shortRoomid = result.shortRoomid;
                this.UI_TXT_SHORT_ROOM_ID.text = `${result.shortRoomid}`;
                this.connectToGame(result.addr, result.gameid, result.roomid);
                
            }
        }

        LobbySocketManager.instance.sendToServer('createPrivateRoom',{gameid:10001, rule:JSON.stringify(gameRule)}, func)
    }

    /**
     * @method onBtnJoin
     * @description 加入房间按钮点击事件处理函数。（当前未实现）
     */
    onBtnJoin(): void {
        
    }

}
