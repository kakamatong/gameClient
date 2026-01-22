import FGUICompLabbyMain from "../../../fgui/lobby/FGUICompLabbyMain";
import { ViewClass, AddEventListener, ChangeScene, LogColors,RemoveEventListener } from "../../../frameworks/Framework";
import * as fgui from "fairygui-cc";
import { DataCenter } from '../../../datacenter/Datacenter';
import {ConnectSvr} from '../../../modules/ConnectSvr';
import { PopMessageView } from '../../common/PopMessageView';
import {ENUM_POP_MESSAGE_TYPE, ENUM_USER_STATUS, LOBBY_SHARE_PIC_URL, LOCAL_KEY, RICH_TYPE} from '../../../datacenter/InterfaceConfig';
import { EVENT_NAMES } from '../../../datacenter/CommonConfig';
import { FW_EVENT_NAMES } from '../../../frameworks/config/Config';
import { TipsView } from '../../common/TipsView';
import { LobbySocketManager } from '../../../frameworks/LobbySocketManager';
import { Rank } from '../../../modules/Rank';
import { RankView } from '../../rank/RankView';
import { LoadingView } from '../../common/LoadingView';
import { Match } from '../../../modules/Match';
import { MatchView } from '../../match/MatchView';
import FGUICompHead from '../../../fgui/common/FGUICompHead';
import { MailView } from '../../mail/MailView';
import { Mail } from '../../../modules/Mail';
import { PrivateRoomView } from '../../privateRoom/PrivateRoomView';
import { UserCenterView } from '../../userCenter/UserCenterView';
import { MiniGameUtils } from '../../../frameworks/utils/sdk/MiniGameUtils';
import { ConnectGameSvr } from '../../../modules/ConnectGameSvr';
import { SprotoGameRoomReady } from 'db://assets/types/protocol/lobby/s2c';
import { SignInView } from '../../signIn/SignInView';
import { sys } from 'cc';
import { AdReward } from '../../../modules/AdReward';
import { AwardView } from '../../award/AwardView';
import { UserRiches } from '../../../modules/UserRiches';
import { REWORD_VIDEOAD_CODE } from '../../../frameworks/config/Config';
@ViewClass({ curveScreenAdapt: true })
export class CompLabbyMain extends FGUICompLabbyMain {

    onConstruct(){
        super.onConstruct();
        this.initListeners();
        this.initUI();
        this.startLogin();
    }

    /**
     * 初始化监听
     */
    initListeners(){
        AddEventListener(EVENT_NAMES.USER_DATA,this.onUserInfo, this);
        AddEventListener(EVENT_NAMES.USER_STATUS,this.onUserStatus, this);
        AddEventListener(EVENT_NAMES.USER_RICHES,this.onUserRiches, this);
        AddEventListener(FW_EVENT_NAMES.SOCKET_DISCONNECT,this.onSocketDisconnect, this);
        AddEventListener(FW_EVENT_NAMES.ON_SHOW, this.onAppShow, this)
        LobbySocketManager.instance.addServerListen(SprotoGameRoomReady, this.onSvrGameRoomReady.bind(this));
        this.UI_COMP_TOP.UI_COMP_HEAD.onClick(this.onBtnHead, this);
    }

    /**
     * 销毁
     */
    onDestroy(){
        super.onDestroy();
        RemoveEventListener(EVENT_NAMES.USER_DATA, this.onUserInfo);
        RemoveEventListener(EVENT_NAMES.USER_STATUS, this.onUserStatus);
        RemoveEventListener(EVENT_NAMES.USER_RICHES, this.onUserRiches);
        RemoveEventListener(FW_EVENT_NAMES.SOCKET_DISCONNECT, this.onSocketDisconnect);
        RemoveEventListener(FW_EVENT_NAMES.ON_SHOW, this.onAppShow);
        LobbySocketManager.instance.removeServerListen(SprotoGameRoomReady);
    }

    /**
     * 头像点击
     */
    onBtnHead(){
        UserCenterView.showView();
    }

    /**
     * app事件，应用显示
     * @param res 热启动数据 
     */
    onAppShow(res:any){
        this.checkPrivateRoomid(res)
    }

    /**
     * 初始化UI
     */
    initUI(){ 
        if (DataCenter.instance.isEnvDev()) {
            this.UI_TXT_ENV.visible = true
        }
    }

    /**
     * 初始化财富
     */
    initRichs():void{
        const rich = DataCenter.instance.getRichByType(RICH_TYPE.SILVER_COIN); // 银子
        this.UI_COMP_TOP.UI_COMP_SILVER.UI_TXT_NUM.text = `${rich?.richNums ?? 0}`;
    }

    /**
     * 事件: socket断开
     */
    onSocketDisconnect(){
        const func = ()=>{
            this.startLogin()
        }

        this.scheduleOnce(func, 0.2)
        
    }

    /**
     * 已经登入
     */
    allreadyLogin():void{
        this.updateUserInfo()
        this.initRichs()
    }

    /**
     * 开始登入
     */
    startLogin(){
        if (LobbySocketManager.instance.isOpen()) {
            this.allreadyLogin()
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

    /**
     * 登入成功回调
     */
    onLoginSuccess(){
        console.log('onLoginSuccess')
        const options = MiniGameUtils.instance.getLaunchOptionsSync()
        this.checkPrivateRoomid(options)
        this.autoShowSignIn()
        this.reqAdInfo()
    }

    /**
     * 请求广告奖励信息
     */
    reqAdInfo(){
        const adReward = new AdReward();
        adReward.reqGetAdInfo((success:boolean, data:any)=>{
            if(!success){
                console.log(LogColors.red('获取广告奖励信息失败'))
            }
        })
    }

    /**
     * 每天自动显示签到
     */
    autoShowSignIn(){
        const day = sys.localStorage.getItem(LOCAL_KEY.AUTO_SHOW_SIGNIN)

        // 格式：'20250120'
        const nowDay = new Date()
        const nowDayStr = `${nowDay.getFullYear()}${nowDay.getMonth() + 1}${nowDay.getDate()}`
        if (day !== nowDayStr) {
            sys.localStorage.setItem(LOCAL_KEY.AUTO_SHOW_SIGNIN, nowDayStr)
            SignInView.showView()
        }
    }

    /**
     * 检查私人房间，是否可以自动进入
     * @param options 热启动参数
     */
    checkPrivateRoomid(options:any){
        if (options.query && options.query.roomid) { 
            const roomid = Number(options.query.roomid)
            if (DataCenter.instance.launchRoomid != roomid) {
                DataCenter.instance.launchRoomid = roomid
                ConnectGameSvr.instance.joinPrivateRoom(roomid,(b:boolean)=>{
                    b && this.changeToGameScene()
                })
            }
        }
    }

    /**
     * 更新用户信息
     */
    updateUserInfo():void{
        this.UI_COMP_TOP.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_COMP_TOP.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        //(this.UI_COMP_TOP.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
        (this.UI_COMP_TOP.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
    }

    /**
     * 事件: 用户信息
     * @param data 
     */
    onUserInfo(data:any):void{
        console.log("userData",data)
        this.updateUserInfo()
    }

    /**
     * 事件: 用户状态
     * @param data 
     */
    onUserStatus(data:any):void{
        console.log("userStatus",data)
        if (data.status == ENUM_USER_STATUS.GAMEING){
            const func2 =()=>{
                console.log(LogColors.green('返回房间'));
                ConnectGameSvr.instance.connectGame(data,(b:boolean)=>{
                    b && this.changeToGameScene()
                })
            }
            PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
        }
    }

    /**
     * 更新用户财富
     */
    onUserRiches(data:any):void{
        console.log("userRiches",data)
        this.initRichs()
    }

    /**
     * 点击匹配房间
     */
    onBtnMatchRoom(): void {
        const func = (b:boolean, data?:any)=>{
            if (b) {
                // 显示匹配view
                MatchView.showView();
            }else{
                if (data && data.gameid && data.roomid) {
                    const func2 =()=>{
                        //返回房间
                        console.log(LogColors.green('返回房间'));
                        ConnectGameSvr.instance.connectGame(data,(b:boolean)=>{
                            b && this.changeToGameScene()
                        })

                    }
                    PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
                }
            }
        }
        Match.instance.req(0,func);
    }

    /**
     * 点击私人房间
     */
    onBtnPrivateRoom(): void {
        PrivateRoomView.showView({changeToGameScene:this.changeToGameScene.bind(this)})
    }

    /**
     * 点击邮件
     */
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

    /**
     * 点击签到
     */
    onBtnSignIn(): void {
        SignInView.showView()
    }

    /**
     * 点击排行榜
     */
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

    /**
     * 切换到游戏场景
     */
    changeToGameScene():void{
        ChangeScene('GameScene');
    }

    /**
     * 游戏服务器准备就绪
     */
    onSvrGameRoomReady(data:any):void{
        console.log("gameRoomReady",data)
        ConnectGameSvr.instance.connectGame(data, (success:boolean, data?:any)=>{
            if (success) {
                this.changeToGameScene()
            }else{
                TipsView.showView({content:`游戏服务器连接失败`})
            }
        })
    }

    /**
     * 点击分享
     */
    onBtnShare(): void {
        MiniGameUtils.instance.shareAppMessage({title:'约上好友来一局石头剪刀布', imageUrl: LOBBY_SHARE_PIC_URL, query:''})
    }

    /**
     * 点击广告奖励
     */
    onBtnAd(): void {
        const adRewardInfo = DataCenter.instance.adRewardInfo;
        if(!adRewardInfo){
            TipsView.showView({content:'广告奖励信息未加载'})
            return;
        }

        if(!adRewardInfo.canReward){
            TipsView.showView({content:'今日已经领取完，明日再来'})
            return;
        }

        const noticeDate = sys.localStorage.getItem(LOCAL_KEY.AD_NOTICE_DATE);
        const nowDay = new Date();
        const nowDayStr = `${nowDay.getFullYear()}${nowDay.getMonth() + 1}${nowDay.getDate()}`;

        if(noticeDate !== nowDayStr){
            const reward = adRewardInfo.rewards[0];
            const rewardAmount = reward?.richNums[0] ?? 0;
            const content = `看完视频每天可以领取${adRewardInfo.maxDailyRewardCount}次，每次${rewardAmount}银子奖励`;
            const func = ()=>{
                sys.localStorage.setItem(LOCAL_KEY.AD_NOTICE_DATE, nowDayStr);
                this.playAdAndReceiveReward();
            }
            PopMessageView.showView({
                title:'温馨提示',
                content: content,
                type:ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: func
            })
        }else{
            this.playAdAndReceiveReward();
        }
    }

    /**
     * 播放广告并领取奖励
     */
    playAdAndReceiveReward(){
        LoadingView.showView({content:"载入中...", time:12});
        MiniGameUtils.instance.showRewardedVideoAd("adunit-21e58350c401d5b6", (code:number)=>{
            LoadingView.hideView();
            console.log(code);
            if(code == REWORD_VIDEOAD_CODE.SUCCESS){
                const adReward = new AdReward();
                adReward.reqReceiveAdReward((success:boolean, data:any)=>{
                    if(!success){
                        TipsView.showView({content:'领取奖励失败'});
                        return;
                    }
                    this.initRichs();
                    const newData = {
                        ids: data.reward.richTypes,
                        nums: data.reward.richNums,
                        noticeid: data.noticeid
                    }
                    AwardView.showView(newData)
                })
            }else if(code == REWORD_VIDEOAD_CODE.NOT_OVER){
                TipsView.showView({content:'看完视频才能获取奖励哦'})
            }else{
                TipsView.showView({content:'视频广告播放失败'})
            }
        })
    }
}

fgui.UIObjectFactory.setExtension(CompLabbyMain.URL, CompLabbyMain);