/**
 * @file AuthList.ts
 * @description 认证列表模块：获取并存储认证服务器地址列表
 * @category 网络请求模块
 */

import { DataCenter } from "../datacenter/Datacenter";
import { LogColors } from "../frameworks/Framework";
import { HttpPostWithDefaultJWT, DecodeURLRecursive } from "../frameworks/utils/Utils";
import { BaseModule } from "../frameworks/base/BaseModule";

// 添加console.log别名，方便使用日志颜色
const log = console.log;

/**
 * @class AuthList
 * @description 认证列表管理类，负责请求并存储认证服务器地址，使用单例模式
 * @category 网络请求模块
 * @singleton 单例模式
 */
export class AuthList extends BaseModule {
    static get instance(): AuthList {
        return this._getInstance<AuthList>(AuthList);
    }

    /**
     * @description 请求认证服务器地址列表
     * @param callBack 回调函数
     */
    req(callBack: (success: boolean, data?: any) => void) {
        const url = DataCenter.instance.appConfig.authList;
        if (!url) {
            log(LogColors.red("authList URL not configured!"));
            callBack(false);
            return;
        }

        log(LogColors.blue(`Sending POST request to: ${url}`));

        const payload = {
            "userid": 0,
            "channelid": DataCenter.instance.channelID,
        };

        HttpPostWithDefaultJWT(url, {}, payload)
            .then((data) => {
                log(LogColors.green("authList request successful!"));
                // 将认证列表数据存储到DataCenter
                if (data && data.data) {
                    // 对data.data进行URL解码
                    const decodedData = DecodeURLRecursive(data.data);
                    DataCenter.instance.authList = decodedData.gate;
                    DataCenter.instance.gameAuthList = decodedData.game;
                    DataCenter.instance.loginList = decodedData.login;

                    // 同时更新原始data对象中的data字段
                    data.data = decodedData;
                }
                callBack(true, data);
            })
            .catch((error) => {
                log(LogColors.red(`authList request failed: ${error.message}`));
                callBack(false, error);
            });
    }
}
