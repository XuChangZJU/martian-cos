/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

var FormData2 = require('form-data');
var fs = require("fs");
var crypto = require('crypto');
var urlM = require('url');

require('isomorphic-fetch');

function upload(file, url, sign, bizAttr, type) {
    var formData;
    if (typeof file === "string") {
        formData = new FormData2();
        formData.append("op", "upload");
        formData.append("filecontent", fs.createReadStream(file));
        if (bizAttr) {
            switch (typeof bizAttr) {
                case "object":
                    {
                        bizAttr = JSON.stringify(bizAttr);
                        break;
                    }
                case "string":
                    break;
                default:
                    throw new Error("bizAttr仅支持对象和字符串类型");
                    return;
            }
            formData.append("biz_attr", bizAttr);
        }
    } else {
        throw new Error("尚不支持的file参数类型");
    }

    var promise = new Promise(function (resolve, reject) {
        formData.getLength(function (err, length) {
            if (err) {
                reject({
                    code: ErrorCode.errorRunTime.code,
                    message: "未能计算formData的长度，原因是" + err
                });
            } else {
                // 计算文件的hash值
                var fst = fs.createReadStream(file);
                var hash = crypto.createHash('sha1');
                fst.on('readable', function () {
                    var data = fst.read();
                    if (data) hash.update(data);else {
                        formData.append("sha", hash.digest());

                        var urlInfo = urlM.parse(url);
                        var headers = formData.getHeaders({
                            "Authorization": sign,
                            "Host": "web.file.myqcloud.com",
                            "Content-Length": length,
                            "User-Agent": "android"
                        });

                        var init = {
                            headers: headers,
                            body: formData,
                            method: 'POST',
                            protocol: urlInfo.protocol,
                            hostname: urlInfo.hostname,
                            port: urlInfo.port,
                            path: urlInfo.path
                        };

                        fetch(url, init).then(function (response) {
                            response.json().then(function (json) {
                                if (!response.ok || json.error != undefined) {
                                    reject(json);
                                } else {
                                    resolve({
                                        url: json.data.access_url
                                    });
                                }
                            });
                        }, function (err) {
                            reject(err);
                        });
                    }
                });
            }
        });
    });

    return promise;
}

module.exports = {
    upload: upload
};