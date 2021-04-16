'use strict';

/**
 * Created by lavystord on 16/9/10.
 */
function upload(file, params) {
    var formInput = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    //url 如果有传入的话 就是文件的完整路径 没有就由外部自己拼成
    var url = params.url;
    var key = params.key;
    var uploadToken = params.uploadToken;
    var uploadHost = params.uploadHost;


    var formData = new FormData();

    formData.append('key', key);

    for (var k in formInput) {
        formData.append(k, formInput[k]);
    }

    if (!formInput.file) formData.append('file', file); //web 传入文件
    if (!formInput.token) formData.append('token', uploadToken);

    var options = {};
    options.body = formData;
    options.method = 'POST';
    return fetch(uploadHost, options).then(function (response) {
        return response.json();
    }, function (err) {
        return Promise.reject(err);
    }).then(function (json) {
        if (json.success === true || json.key) {
            return Promise.resolve({
                url: url
            });
        }
        return Promise.reject(json);
    });
}

function uploadBase64(base64, params) {
    //url 如果有传入的话 就是文件的完整路径 没有就由外部自己拼成
    var url = params.url;
    var key = params.key;
    var uploadToken = params.uploadToken;
    var uploadHost = params.uploadHost;
    var size = params.size;


    var options = {};
    options.headers = {
        "Content-Type": "application/octet-stream",
        "Authorization": "UpToken " + uploadToken
    };
    // base64数据去掉data:image/png;base64,逗号前面包括逗号
    options.body = base64;
    options.method = 'POST';
    var fetchUrl = uploadHost + '/putb64/' + (size || -1) + '/key/' + (key ? Buffer.from(key).toString('base64') : '');
    return fetch(fetchUrl, options).then(function (response) {
        return response.json();
    }, function (err) {
        return Promise.reject(err);
    }).then(function (json) {
        if (json.success === true || json.key) {
            return Promise.resolve({
                url: url
            });
        }
        return Promise.reject(json);
    });
}

module.exports = {
    upload: upload,
    uploadBase64: uploadBase64
};