var fs = require('fs');
var marked = require('marked');
var renderer = new marked.Renderer();
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
var putnote = require("../auth/putnote.js");
var getnote = require("../auth/getnote.js");
var deletenote = require("../auth/deletenote.js");



var dbbase = require("../models/dbbase.js");

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', { title: '首页' });
  });
  app.get('/addnote', function (req, res) {
    res.render('addnote', { title: '新建笔记' });
  });
  app.post('/addnote',function (req,res) {
        var filetitle = req.body.filetitle;
 	var sequence = Date.now().toString();
	var storagesequence = sequence;   
	var filename = storagesequence + ".md";
	var localpath = "./savefiles/" + filename;
	
	fs.writeFile(localpath,req.body.filecontent,"utf8",function(err){
                if(err)throw err;
                console.log("md had been saved");
        });
        res.render('savemark',{title:"确认上传！",storagesequence:storagesequence,filetitle:filetitle,filepath:localpath});
  });

   app.post('/savemark',function(req,res){
        var storagesequence = req.body.storagesequence;
	var filetitle = req.body.filetitle;
	var filename = storagesequence + ".md";
	var localpath_prefix = "/srv/warehouse/Jazz/webnote/";
	var localpath_relative = "savefiles/";
	var webpath_prefix = "http://tupianku.cn-gd.ufileos.com/";
	var webpath_relative = "md/xuexi/";
	var key = webpath_relative + filename;	
 	var localpath = "./"+ localpath_relative + filename;	
	var upload = new putnote(localpath ,'tupianku',key);
        upload.savenote();
        console.log("putnote success!");


        //save in db
	var mdfile = new dbbase.Mdfile({
		storagesequence : storagesequence,
		filetitle : filetitle,
		filetype : "md",
		category : "daiguidang",
		localpath_prefix :localpath_prefix,
		localpath_relative : localpath_relative,
		webpath_prefix : webpath_prefix,
		webpath_relative : webpath_relative,
		author : "admin",
		filesize : "",
	});

	mdfile.save(function(err) {
		if (err) {
		    console.log('保存失败')
		    return;
		}
		console.log('meow');
	});


        //解析 markdown 为 html
        fs.readFile(localpath,"utf8",function(err,data){
                if(err)throw err;
                var markdoc = marked(data,renderer);
	        res.render("markdownshow",{ title:'阅读笔记',filetitle:filetitle,markdoc:markdoc});
        });


   });


   app.get('/md/:urlkey',function(req,res){
	var localpath = './savefiles/' + req.params.urlkey;
	var sequencestring = req.params.urlkey.replace(".md","");
	var filetitle = "";
        dbbase.Mdfile.find({"storagesequence":sequencestring},function(err, docs) {
		if (err) {
                console.error(err);
                return;
                }
		return filetitle = docs[0].filetitle;

	});	

	fs.readFile(localpath,"utf8",function(err,data){
		if (err) {
                console.error(err);
                return;
                }

//	if(err)throw err;
	var markdoc = marked(data,renderer);
	res.render("markdownshow",{title:req.params.filename,filetitle:filetitle,markdoc:markdoc});
	});
  });

 
  app.get('/modifymd/:urlkey',function(req,res){
        var webpath = 'http://tupianku.cn-gd.ufileos.com/md/xuexi/' + req.params.urlkey;
	var localpath = './savefiles/' + req.params.urlkey;
	
	var key = 'md/xuexi/' + req.params.urlkey; 
	var download = new getnote(localpath ,'tupianku',key);
	download.getnote();	

	var sequencestring = req.params.urlkey.replace(".md","");
	var filetitle = "";	
	dbbase.Mdfile.find({"storagesequence":sequencestring},function(err, docs) {
		if (err) {
                console.error(err);
                return;
                }

		filetitle = docs[0].filetitle;
		res.render('confirmmodify', { title: '确认修改笔记',filetitle:filetitle,storagesequence:sequencestring,filepath:localpath });
	});

  });


   app.post('/confirmmodify',function(req,res){
	var localpath = req.body.filepath;   
	var sequencestring = req.body.storagesequence;
   	var filetitle = req.body.filetitle;  

	var localpathold = localpath;
	var storagesequenceold = sequencestring;
	var filetitleold = filetitle;
	var webpathold = 'md/xuexi/' + storagesequenceold + '.md';	


	fs.readFile(localpath,"utf8",function(err,data){
                if (err) {
                console.error(err);
                return;
                }

		var filecontent = data;
		
		console.log(filecontent);

		res.render('modifynote', { title: '修改笔记',filetitle:filetitle,filecontent:filecontent,localpathold:localpathold,storagesequenceold:storagesequenceold,filetitleold:filetitleold,webpathold:webpathold });
        
	});

  });


  app.post('/modifynote',function (req,res) {
        var filetitle = req.body.filetitle;
        var sequence = Date.now().toString();
        var storagesequence = sequence;
        var filename = storagesequence + ".md";
        var localpath = "./savefiles/" + filename;

	var localpathold = req.body.localpathold;
        var storagesequenceold = req.body.storagesequenceold;
        var filetitleold = req.body.filetitleold;
        var webpathold = req.body.webpathold;



        fs.writeFile(localpath,req.body.filecontent,"utf8",function(err){
                if(err)throw err;
                console.log("md had been saved");
        });
        res.render('confirmchange',{title:"确认修改！",storagesequence:storagesequence,filetitle:filetitle,filepath:localpath,localpathold:localpathold,storagesequenceold:storagesequenceold,filetitleold:filetitleold,webpathold:webpathold });
  });



   app.post('/savechange',function(req,res){
        var localpathold = req.body.localpathold;
        var storagesequenceold = req.body.storagesequenceold;
        var filetitleold = req.body.filetitleold;
        var webpathold = req.body.webpathold;

	// 删除旧文件
        var deletemd = new deletenote('tupianku',webpathold);
        deletemd.deletenote();
        console.log("deletenote success!");

	// 删除旧数据
	dbbase.Mdfile.remove({"storagesequence":storagesequenceold},function(err, docs) {
                if (err) {
                console.error(err);
                return;
                }
		console.log("delete dbdate success!");
	});


	// 存储新文件
        var storagesequence = req.body.storagesequence;
        var filetitle = req.body.filetitle;
        var filename = storagesequence + ".md";
        var localpath_prefix = "/srv/warehouse/Jazz/webnote/";
        var localpath_relative = "savefiles/";
        var webpath_prefix = "http://tupianku.cn-gd.ufileos.com/";
        var webpath_relative = "md/xuexi/";
        var key = webpath_relative + filename;
        var localpath = "./"+ localpath_relative + filename;
        var upload = new putnote(localpath ,'tupianku',key);
        upload.savenote();
        console.log("putnote success!");


        //save in db
            var mdfile = new dbbase.Mdfile({
                    storagesequence : storagesequence,
                    filetitle : filetitle,
                    filetype : "md",
                    category : "daiguidang",
                    localpath_prefix :localpath_prefix,
                    localpath_relative : localpath_relative,
                    webpath_prefix : webpath_prefix,
                    webpath_relative : webpath_relative,
                    author : "admin",
                    filesize : "",
            });

            mdfile.save(function(err) {
                    if (err) {
                        console.log('保存失败')
                        return;
                    }
            console.log('meow');
            });


        //解析 markdown 为 html

        fs.readFile(localpath,"utf8",function(err,data){
                if(err)throw err;
                var markdoc = marked(data,renderer);
                res.render("markdownshow",{ title:'阅读笔记',filetitle:filetitle,markdoc:markdoc});
        });


   });





  app.get('/listnote', function (req, res) {
    	dbbase.Mdfile.find({"filetype":"md"},function(err, docs) {
   		if (err) {
	    	console.error(err);
      		return;
    		}

		res.render('listnote', {
	        title: '笔记目录',
		data: docs,
	    	});
  	});

  });


  app.post('/listnote', function (req, res) {
  });
  app.get('/readnote', function (req, res) {
    res.render('readnote', { title: '阅读笔记' });
  });
  app.post('/readnote', function (req, res) {
  });
  app.get('/arrangnote', function (req, res) {
  });
};
