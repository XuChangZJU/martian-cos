/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

const tencent = require("./src/tencent");

/**
 * 执行文件上传
 * @param dest  COS服务提供商（服务器提供），目前仅支持 tencent
 * @param file  文件，目前仅支持string类型，为文件路径(NodeJs)使用
 * @param url   上传的目标路径（服务器提供）
 * @param sign  上传使用的签名（服务器提供）
 * @param bizAttr   文件属性（服务器提供）
 * @param type  运行环境，如果是react native则传"rn"，是浏览器环境可以不传
 */
function upload(dest, file, url, sign, bizAttr, type) {
    switch(dest) {
        case "tencent": {
            return tencent.upload(file, url, sign, bizAttr, type);
        }
        default:
            throw new Error("不支持的dest目标");
    }
}

module.exports = {
    upload
}