import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { httpPostWithDefaultJWT } from '../frameworks/utils/utils';

/**
 * @description 添加console.log别名，方便使用日志颜色
 */
const log = console.log;

/**
 * @class Mail
 * @description 邮件系统管理类，负责处理邮件相关操作，使用单例模式
 * @category 业务模块
 * @singleton 单例模式
 */
export class Mail {
    /**
     * @property {Mail} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: Mail;
    
    /**
     * @method instance
     * @description 获取Mail的单例实例
     * @static
     * @returns {Mail} Mail单例实例
     */
    public static get instance(): Mail {
        if (!this._instance) {
            this._instance = new Mail();
        }
        return this._instance;
    }

    /**
     * @property {string} _url - 邮件API的基础URL地址
     * @private
     */
    private _url = "http://192.168.1.131:8080/api/mail/";

    constructor() {
        // 私有构造函数，防止实例化
        this._url = DataCenter.instance.appConfig.webUrl + '/api/mail/'
    }

    /**
     * @method list
     * @description 获取邮件列表
     * @param {(success:boolean, data?:any)=>void} callBack - 回调函数，返回请求结果
     */
    list(callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "list";
        const body = {
            'userid':DataCenter.instance.userid
        }

        this.req(url, body,callBack)

    }

    /**
     * @method detail
     * @description 获取邮件详情
     * @param {number} id - 邮件ID
     * @param {(success:boolean, data?:any)=>void} callBack - 回调函数，返回请求结果
     */
    detail(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "detail/" + id;

        const body = {
            'userid':DataCenter.instance.userid,
        }

        this.req(url, body,callBack)
    }

    /**
     * @method read
     * @description 标记邮件为已读
     * @param {number} id - 邮件ID
     * @param {(success:boolean, data?:any)=>void} callBack - 回调函数，返回请求结果
     */
    read(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "read/" + id;

        const body = {
            'userid':DataCenter.instance.userid,
        }

        this.req(url, body,callBack)
    }

    /**
     * @method getAwards
     * @description 领取邮件奖励
     * @param {number} id - 邮件ID
     * @param {(success:boolean, data?:any)=>void} callBack - 回调函数，返回请求结果
     */
    getAwards(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "getaward/" + id;
        const body = {
            'userid':DataCenter.instance.userid,
        }
        this.req(url, body,callBack)
    }
    
    /**
     * @method req
     * @description 发送HTTP请求的通用方法
     * @param {string} url - 请求URL
     * @param {any} [body] - 请求体数据
     * @param {(success:boolean, data?:any)=>void} [callBack] - 回调函数
     */
    req(url: string, body?:any, callBack?:(success:boolean, data?:any)=>void){
        if (!url) {
            log(LogColors.red('authList URL not configured!'));
            callBack && callBack(false);
            return;
        }

        log(LogColors.blue(`Sending POST request to: ${url}`));

        const payload = {
            'userid':DataCenter.instance.userid,
            'channelid':DataCenter.instance.channelID
        }
        
        httpPostWithDefaultJWT( url, body, payload)
        .then(data => {
            log(LogColors.green('mail request successful!'));
            // 将认证列表数据存储到DataCenter
            if (data && data.data) {
                
            }
            callBack && callBack(true, data.data);
        })
        .catch(error => {
            log(LogColors.red(`mail request failed: ${error.message}`));
            callBack && callBack(false, error);
        });
    }
        
}