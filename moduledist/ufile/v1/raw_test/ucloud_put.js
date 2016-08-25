var request = require('request');
var fs = require('fs');
var crypto = require('crypto');
var utf8 = require('utf8');
var util = require('util');

Base64 = function(content) {
	return new Buffer(content).toString('base64');
}

HmacSha1 = function(secretKey, content) {
	var hmac = crypto.createHmac('sha1', secretKey);
	hmac.update(content);
	return hmac.digest();
}

//file stat
var path = '/srv/warehouse/Jazz/webnote/savefiles/test.md';
var stats = fs.statSync(path);
console.log(util.inspect(stats));
var fileSize = stats.size;

var UCloudPublicKey = "dVI2q4ie+j1HvOre+IB4TsIo7B3ipWB2vHXnWvvIxRuAyMNq";
var UCloudPrivateKey = "e53ede8b9db9257fd55436bb0ba64aa5c894caa7";
var HTTPVerb = "PUT";
var ContentMD5 = "";
var ContentType = "text/plain";
var MyDate = "";
var CanonicalizedUCloudHeaders = "";
var bucket = "tupianku";
var key = "test222.md";
var CanonicalizedResource = "/" + bucket + "/" + key;
var StringToSign =  HTTPVerb + "\n" + ContentMD5 + "\n" + ContentType + "\n" + MyDate + "\n" + 
	CanonicalizedUCloudHeaders +
	CanonicalizedResource;
console.log(StringToSign);
var Signature = Base64(HmacSha1(UCloudPrivateKey, StringToSign));
var Authorization = "UCloud" + " " + UCloudPublicKey + ":" + Signature;
console.log("Authorization: " + Authorization);


var urlstr = 'http://' + bucket + '.ufile.ucloud.cn/' + key;
var options = {
	url: urlstr,
	method: 'PUT',
	headers:{
		'Authorization': Authorization,
		'Content-Length': fileSize
	}
};

function callback(err, response, body) {
	if (err) {
		return console.error("upload failed:", err);
	}
	console.log(response.caseless);
	console.log(body);
}

fs.createReadStream(path).pipe(request.put(options, callback));
