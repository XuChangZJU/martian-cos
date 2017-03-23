'use strict';

/**
 * Created by lavystord on 16/9/10.
 */
function upload(file, params) {
    var formInput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var url = params.url,
        key = params.key,
        uploadToken = params.uploadToken,
        uploadHost = params.uploadHost;

    // if (typeof formInput !== 'object') {
    //     return false;
    // }

    // url = domain + key

    var formData = new FormData();

    formData.append('key', key);

    for (var k in formInput) {
        formData.append(k, formInput[k]);
    }

    if (!formInput.file) formData.append('file', { uri: file.uri, type: 'application/octet-stream' });
    if (!formInput.token) formData.append('token', uploadToken);

    var options = {};
    options.body = formData;
    options.method = 'POST';
    return fetch(uploadHost, options).then(function (response) {
        return response.json();
    }, function (err) {
        return Promise.reject(err);
    }).then(function (json) {
        if (!json.key || json.error !== undefined) {
            return Promise.reject(json);
        } else {
            return Promise.resolve({
                url: url
            });
        }
    });
}

module.exports = {
    upload: upload
};