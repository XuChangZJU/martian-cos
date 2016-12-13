/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

const tencent = require("./src/tencent");
const qiniu = require('./src/qiniu');


/**
 * 执行文件上传
 * @param dest  COS服务提供商（客户端提供），
 * @param file  文件，目前仅支持string类型，为文件路径(NodeJs)使用
 * @param params  服务器返回的各种数据参数
 */
function upload(dest, file, params) {
    switch(dest) {
        case "tencent": {
            return tencent.upload(file, params);
        }
        case "qiniu" : {
            return qiniu.upload(file, params);
        }
        default:
            throw new Error("不支持的dest目标");
    }
}

function imageView(url, imageStyle, version) {
    if (!url)
        return undefined;
    if (!imageStyle)
        return url;
    if (url.indexOf('myqcloud.com'))
        return url;
    const freshCache = version ? `?v=${version}` : '';
    return `${url}-${imageStyle}${freshCache}`
}


function getImageStyles()  {
    return {
        tiny: 'tiny', // 100 * 100 px
        thumbnail: 'thumbnail', //200*200 px
        detail: 'detail' // 400 px  least
    };

}

module.exports = {
    upload,
    imageView,
    getImageStyles,
};
