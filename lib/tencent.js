/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

var urlM = require('url');

// todo 整个函数签名改变,详情见对应的native文件
function upload(file, url, sign, bizAttr, type) {
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