
import {DataCenter} from '../datacenter/datacenter';
import { LogColors } from '../frameworks/framework';

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

    req(callBack:(success:boolean, data?:any)=>void){
        const url = DataCenter.instance.appConfig.authList;
        if (!url) {
            log(LogColors.red('authList URL not configured!'));
            callBack(false);
            return;
        }

        log(LogColors.blue(`Sending POST request to: ${url}`));

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 无参数，所以body为空对象
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            log(LogColors.green('authList request successful!'));
            // 将认证列表数据存储到DataCenter
            if (data && data.authList) {
                //DataCenter.instance.appConfig.authListData = data.authList;
            }
            callBack(true, data);
        })
        .catch(error => {
            log(LogColors.red(`authList request failed: ${error.message}`));
            callBack(false, error);
        });
    }
}