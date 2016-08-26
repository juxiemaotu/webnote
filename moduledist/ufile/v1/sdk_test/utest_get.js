var HttpRequest = require('ufile').HttpRequest;
var AuthClient = require('ufile').AuthClient;
var util = require('util');


var bucket = "tupianku";
var key = "md/xuexi/1472135612858.md";
var file_path = '/srv/warehouse/test/webnote/savefiles/111.md';

var method = 'GET';
var url_path_params = '/' + key;


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
