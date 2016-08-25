    /** 
     * Created by yong_pliang on 15/7/21. 
     */  
    var mongodb = require('../config/dbconfig');//引入config中的mongodb对象  
    var mongoose = mongodb.mongoose;//获取mongoose  
    var Schema = mongoose.Schema;//获取Schema,以便快捷使用  
    var ObjectId = Schema.Types.ObjectId;//获取ObjectId类型,以便快捷使用  
    

	var MdfileSchema = new Schema({
	   	storagesequence :String,
		filetype : String,
		filetitle : String,
		category : String,
	        localpath_prefix :String,
		localpath_relative : String,
	        webpath_prefix :String,
		webpath_relative : String,
		author  : String,
        	filesize : String,
	});
        var Mdfile = mongoose.model('Mdfile', MdfileSchema);


	//示例
/*
        var mdfile = new Mdfile({
        	filename   : "dbtest.md",
	        title    : "dbtest",
      		type : "md",
     		localpath  : "/srv/warehouse/Jazz/webnote/savefiles/dbtest.md",
     		ucloudkey     : "dbtest.db",
     		auther  : "admin",
	});

*/




    exports.mongodb = mongodb;//导出mongodb  
    exports.mongoose = mongoose; //导出mongoose  
    exports.Schema = Schema;//导出Schema  

	exports.MdfileSchema = MdfileSchema;
  	exports.Mdfile = Mdfile;




    exports.ObjectId = ObjectId;//导出ObjectId  
    exports.Mixed = Schema.Types.Mixed;//导出Mixed  
