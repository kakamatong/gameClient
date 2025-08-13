
import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { httpPostWithDefaultJWT } from '../frameworks/utils/utils';
// 添加console.log别名，方便使用日志颜色
const log = console.log;

export class Mail {
    //Auth
    private static _instance: Mail;
    public static get instance(): Mail {
        if (!this._instance) {
            this._instance = new Mail();
        }
        return this._instance;
    }

    private _url = "http://192.168.1.131:8080/api/mail/";

    list(callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "list";
        const body = {
            'userid':DataCenter.instance.userid
        }

        this.req(url, body,callBack)

    }

    detail(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "detail/" + id;

        const body = {
            'userid':DataCenter.instance.userid,
        }

        this.req(url, body,callBack)
    }

    read(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "read/" + id;

        const body = {
            'userid':DataCenter.instance.userid,
        }

        this.req(url, body,callBack)
    }

    getAwards(id:number, callBack:(success:boolean, data?:any)=>void){
        const url = this._url + "getaward/" + id;
        const body = {
        }
        this.req(url, body,callBack)
    }
    
    req(url: string, body?:any, callBack?:(success:boolean, data?:any)=>void){
        if (!url) {
            log(LogColors.red('authList URL not configured!'));
            callBack && callBack(false);
            return;
        }

        log(LogColors.blue(`Sending POST request to: ${url}`));

        const payload = {
            'userid':DataCenter.instance.userid,
            'channelid':"account"
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
            log(LogColors.red(`authList request failed: ${error.message}`));
            callBack && callBack(false, error);
        });
    }
        
}