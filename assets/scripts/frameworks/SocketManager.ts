/**
 * @file SocketManager.ts
 * @description Socket 管理器基类：提供 Socket 连接和消息处理的基础功能
 * @category 核心框架
 */

import { Socket } from './socket/Socket';
import { Asset, assetManager, BufferAsset, log, Sorting, TextAsset } from 'cc';
import { handleSocketMessage } from './config/Config';
import {LogColors} from './Framework';
import * as protoParse from './sproto/sproto-parser';
import { Sproto } from './sproto/sproto';

/**
 * @class SocketManager
 * @implements {handleSocketMessage}
 * @description Socket管理器基类，负责Socket的初始化、协议加载、消息处理等功能
 * @category 核心框架
 */
export class SocketManager implements handleSocketMessage {
    /**
     * @property {string} _name - 管理器名称
     * @protected
     */
    protected _name: string = 'SocketManager'
    
    /**
     * @property {Socket | null} _socket - Socket实例
     * @private
     */
    private _socket: Socket | null = null;
    
    /**
     * @property {any} _request - 请求对象，用于打包消息
     * @private
     */
    private _request: any;
    
    /**
     * @property {any} _client - 客户端协议对象
     * @private
     */
    private _client: any;
    
    /**
     * @property {boolean} _bloaded - 协议是否已加载
     * @private
     */
    private _bloaded = false;
    
    /**
     * @property {boolean} _isopen - 连接是否已打开
     * @private
     */
    private _isopen = false;
    
    /**
     * @property {number} _session - 会话数字，用于区分不同的请求
     * @private
     */
    private _session = 0;
    
    /**
     * @property {NodeJS.Timeout | null} _timeid - 心跳定时器ID
     * @private
     */
    private _timeid: NodeJS.Timeout | null = null;
    
    /**
     * @property {Array<(data: any) => void>} _callBacks - 回调函数数组，按session索引存储
     * @private
     */
    private _callBacks: Array<(data: any) => void> = [];
    
    /**
     * @property {((result: boolean) => void) | null} _callBackLink - 连接状态回调函数
     * @protected
     */
    protected _callBackLink: ((result: boolean) => void) | null = null;
    
    /**
     * @property {Map<string, (data: any) => void> | null} _onServerListen - 服务器消息监听器映射表
     * @private
     */
    private _onServerListen: Map<string, (data: any) => void> | null = null;
    
    /**
     * @constructor
     * @description 初始化SocketManager实例
     */
    constructor(){
        this._onServerListen = new Map<string, (data: any) => void>();
    }

    /**
     * @method start
     * @description 启动Socket连接
     * @param {string} url - WebSocket连接URL
     * @param {string | string[]} [header] - 连接头信息
     * @param {(result: boolean) => void} [callBack] - 连接结果回调函数
     */
    start(url: string, header?: string | string[], callBack?: (result: boolean) => void) {
        if (this._socket) {
            this._socket.close();
        }

        if (callBack) {
            this._callBackLink = callBack;
        }
        
        this._socket = this.initSocket(url, header);
    }

    /**
     * @method close
     * @description 关闭Socket连接
     */
    close(){
        if(this._socket){
            this._socket.close();
        }
    }

    /**
     * @method initSocket
     * @description 初始化Socket实例
     * @param {string} url - WebSocket连接URL
     * @param {string | string[]} [header] - 连接头信息
     * @returns {Socket} 初始化的Socket实例
     */
    initSocket(url: string, header?: string | string[]) {
        this._session = 0;
        this._isopen = false;
        const _socket = new Socket();
        _socket.init(url, header);
        _socket.setHandleMessage(this);
        return _socket;
    }

    loadProtocol(path:string, callBack: () => void) {
        if (this._bloaded) {
            callBack && callBack();
            return
        }
        const bundle = assetManager.loadBundle('protocol', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            const protocolPath = path + "/"
            // 必须先读取服务端协议
            bundle.load(protocolPath + 's2c', (err, asset: TextAsset) => {
                log('loadAsset error', err);

                const txt = asset.nativeAsset
                const buffer = protoParse.parse(txt, {})
                const serverSproto = new Sproto(buffer)
                this._client = serverSproto?.host('package');

                // 然后读取客户端协议
                bundle.load(protocolPath + 'c2s', (err, asset: TextAsset) => {
                    log('loadAsset error', err);

                    const txt = asset.nativeAsset
                    const buffer = protoParse.parse(txt, {})
                    const clientSproto = new Sproto(buffer)
                    this._request = this._client.attach(clientSproto);
                    this._bloaded = true;
                    callBack && callBack();
                });
            });
        });
    }

    isOpen(){
        return this._isopen;
    }

    sendHeartBeat() {
        
    }

    startHeartBeat() {
        // 每10秒发送一次心跳
        if (this._timeid) {
            clearInterval(this._timeid);
        }
        this._timeid = setInterval(() => {
            this.sendHeartBeat();
        }, 10000);
    }

    sendToServer(xy: {Name:string}, data: any, callBack?: (data: any) => void) {
        const xyname = xy.Name;
        this._session++;
        if (callBack) {
            this._callBacks[this._session] = callBack;
        }
        const logMsg = `[${xyname}][${this._session}]`
        log(LogColors.blue(this._name + ' sendToServer '), logMsg, data);
        this._request && this.sendMessage(this._request(xyname, data, this._session));
    }

    sendMessage(message: any) {
        if(this._isopen){
            this._socket && this._socket.sendMessage(message);
        }else{
            log(LogColors.red("_socket 未连接"))
        }
    }

    // type
    // _session
    // result
    dispatchMessage(data: any) {
        if (data.type == "RESPONSE") {
            const result = data.response
            this._callBacks && this._callBacks[data.session] && this._callBacks[data.session](result);
        } else if (data.type == "REQUEST") {
            if (data.name == "agentReady") {
                this.agentReady(data.request)
            }else{
                // 回调
                this.onSvrMsg(data.name, data.request);
            }
        }
    }

    onSvrMsg(name: string, data: any) {
        if (this._onServerListen) {
            const callBack = this._onServerListen.get(name);
            callBack && callBack(data);
        }
    }

    // 增加服务器广播监听
    addServerListen(proto:{Name:string}, callBack: (data: any) => void) {
        const name = proto.Name;

        if (!this._onServerListen) {
            this._onServerListen = new Map<string, (data: any) => void>();
        }

        this._onServerListen.set(name, callBack);
    }

    // 移除服务器广播监听
    removeServerListen(proto:{Name:string}) {
        const name = proto.Name;
        if (this._onServerListen) {
            this._onServerListen.delete(name);
        }
    }

    // 连接成功
    agentReady(data:any){
        this._callBackLink &&  this._callBackLink(true)
        this._callBackLink = null
    }

    onOpen(event: any) {
        log(this._name + ' onOpen', event);
        this._isopen = true;
    }

    onMessage(message: Uint8Array) {
        //log('SocketManager onMessage', message);
        const response = this._client.dispatch(message);
        const logMsg = `[${response.type}][${response.session}] `
        log(LogColors.yellow(this._name + ' onMessage '), logMsg, response);
        this.dispatchMessage(response);
    }

    onClose(event: any) {
        log(this._name + ' onClose', event); 
        this._isopen = false;
        this._callBackLink &&  this._callBackLink(false)
        this._callBackLink = null
    }

    onError(event: any) {

        log(this._name + ' onError', event);
    }
}
