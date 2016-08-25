var HttpRequest = require('ufile').HttpRequest;
var AuthClient = require('ufile').AuthClient;
var util = require('util');


//FIXME:
//
//	POST 接口 目前上传发现一个bug，上传的文件发现丢失最后两个字节，可能由第三方库request引起
//

var bucket = "tupianku";
var key = "uploadtest.md";
var file_path = '/home/zhanghong/test111/uploadtest.md';

var method = 'POST';
var url_path_params = '/';

var req = new HttpRequest(method, url_path_params, bucket, key, file_path);


req.setHeader("X-UCloud-Hello", "1234");
req.setHeader("X-UCloud-World", "abcd");
req.setHeader("X-UCloud-Hello", "3.14");

var client =  new AuthClient(req);

function callback(res) {
	if (res instanceof Error) {
		console.log(util.inspect(res));
	} else {
		console.log(util.inspect(res));
	}
}
client.SendRequest(callback);
