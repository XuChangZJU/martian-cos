/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

var urlM = require('url');

function upload(file, configs) {
    var url = configs.url,
        sign = configs.sign,
        type = configs.type;

    var bizAttr = configs.bizAttr;
    /**
     * 执行文件上传
     *  url   上传的目标路径（服务器提供）
     *  sign  上传使用的签名（服务器提供）
     *  bizAttr   文件属性（服务器提供）
     *  type  运行环境，如果是react native则传"rn"，是浏览器环境可以不传
     */

    var formData;
    if (typeof file === "object" && typeof file.uri === "string") {
        formData = new FormData();
        formData.append("op", "upload");
        var _type = void 0,
            name = void 0,
            fileSuffix = void 0,
            index1 = file.uri.lastIndexOf('/'),
            index2 = file.uri.lastIndexOf('.');
        name = index1 === -1 ? file.uri : file.uri.slice(index1 + 1);
        fileSuffix = index2 === -1 ? file.uri : file.uri.slice(index2 + 1);
        switch (fileSuffix) {
            case "jpg":
            case "jpeg":
                {
                    _type = "image/jpeg";
                    break;
                }
            case "png":
                {
                    _type = "image/png";
                    break;
                }
            case "gif":
                {
                    _type = "image/gif";
                    break;
                }
            default:
                {
                    _type = 'application/octet-stream';
                    break;
                }
        }

        var fileContent = {
            uri: file.uri,
            type: _type,
            name: name
        };
        formData.append("filecontent", fileContent);
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

        var urlInfo = urlM.parse(url);
        var headers = {
            "Authorization": sign,
            "Host": "web.file.myqcloud.com"
        };

        var init = {
            headers: headers,
            body: formData,
            method: 'POST',
            hostname: urlInfo.hostname
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
    });

    return promise;
}

module.exports = {
    upload: upload
};