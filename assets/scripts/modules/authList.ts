
import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';
import { MiniGameUtils } from '../frameworks/utils/sdk/miniGameUtils';
import { HttpPostWithDefaultJWT } from '../frameworks/utils/utils';

// 添加console.log别名，方便使用日志颜色
const log = console.log;

export class AuthList {
    //Auth
    private static _instance: AuthList;
    public static get instance(): AuthList {
        if (!this._instance) {
            this._instance = new AuthList();
        }
        return this._instance;
    }

    // 递归解码对象中的所有URL编码字符串
    private static decodeURLRecursive(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        if (typeof data === 'string') {
            try {
                return decodeURIComponent(data);
            } catch (e) {
                log(LogColors.yellow(`Failed to decode URL: ${data}, error: ${e.message}`));
                return data; // 解码失败时返回原始字符串
            }
        }

        if (Array.isArray(data)) {
            return data.map(item => this.decodeURLRecursive(item));
        }

        if (typeof data === 'object') {
            const decodedObj: any = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    decodedObj[key] = this.decodeURLRecursive(data[key]);
                }
            }
            return decodedObj;
        }

        return data;
    }

    req(callBack:(success:boolean, data?:any)=>void){
        const url = DataCenter.instance.appConfig.authList;
        if (!url) {
            log(LogColors.red('authList URL not configured!'));
            callBack(false);
            return;
        }

        log(LogColors.blue(`Sending POST request to: ${url}`));

        const payload = {
            'userid':0,
            'channelid':DataCenter.instance.channelID
        }

        HttpPostWithDefaultJWT(url, {}, payload).then(data => {
            log(LogColors.green('authList request successful!'));
            // 将认证列表数据存储到DataCenter
            if (data && data.data) {
                // 对data.data进行URL解码
                const decodedData = AuthList.decodeURLRecursive(data.data);
                DataCenter.instance.authList = decodedData.gate;
                DataCenter.instance.gameAuthList = decodedData.game;
                DataCenter.instance.loginList = decodedData.login;

                // 同时更新原始data对象中的data字段
                data.data = decodedData;
            }
            callBack(true, data);
        })
        .catch(error => {
            log(LogColors.red(`authList request failed: ${error.message}`));
            callBack(false, error);
        });
    }
}