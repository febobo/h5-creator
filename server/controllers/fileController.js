const FileModel = require('../model/file');
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const parse = require('co-busboy');
const os = require('os');
const path = require('path');

const md5 = function(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

exports.loadfile = function*() {
  if (!this.request.is('multipart/*')) return
  var parts = parse(this, {
    autoFields: true
  })
  var part,
    result;
  while (part = yield parts) {
    var stream =
      fs.createWriteStream(path.join('./public/static/upload/images/', Math.random().toString()));
    var file = part;

    var bf = part.pipe(stream);
    result = yield function(done) {
      bf.on('finish', function(part) {
        var buffer = fs.readFileSync(stream.path);
        request.post({
          // url: "http://192.168.1.195:9090/upload_webp_images_j.wn",
          url: 'http://lt-upload.imgs.wn518.com/upload_webp_images_j.wn',
          headers: {
            sign: md5(md5(buffer) + 'RaXcv#Dv!jcQK5Tc$FZp00aoX%liVybg'),
            app: 'jyh-cms',
            meta: 'md5=' + md5(buffer) + '&filename=' + file.filename,
            'Content-Type': 'application/binary',
          },
          body: buffer
        }, function(e, r, res) {
          var res = JSON.parse(res)
          done(null, {
            res: res
          })
        })
      })
    }
  }

	if(result.res.code){
		var res = result.res.body.thumbnail0;
		var sourcefile = {
			name : res.sourcename,
			size : res.size,
			url : res.url,
			webp_url : res.webp_url,
			create_time : new Date()
		}

		var saveObj = new FileModel(sourcefile);
		var saveObjResult = yield saveObj.save();
	  return this.body = {
	    code: 1,
	    data: saveObjResult
	  }
	}
	
  return this.body = {
    code: 0,
    data: result.res.message
  }
}


exports.get = function*() {
  var ctx = this;
  var body = ctx.request.query;
  var limit = 30;
  var start = (body.page || 0) * limit;

  if (body.id) {
    var componentContent = yield FileModel.findOne({
      "_id": body.id
    });

    if (!componentContent) {
      return this.body = {
        code: 1,
        msg: '找不到该条记录'
      }
    }

    return this.body = {
      code: 1,
      data: {
        content: componentContent.content,
        id: componentContent._id,
        title: componentContent.title,
        category: componentContent.category
      }
    }
  }

  var result = yield FileModel.find({}).skip(start).limit(limit).sort('-create_time');
  var count = yield FileModel.count();
  return this.body = {
    code: 1,
    data: {
      lists: result ? result : [],
      count: count ? count : 0
    },
    msg: 'ok'
  }
}

exports.delete = function*() {
  var ctx = this;
  var body = ctx.request.body;
  if (!body.id) {
    return this.body = {
      code: 0,
      msg: 'id不能为空'
    }
  }

  const result = yield FileModel.remove({
    _id: body.id
  });
  if (result.result.n) {
    return this.body = {
      code: 1,
      msg: '删除成功'
    }
  }
  return this.body = {
    code: 1,
    msg: '没有找到匹配的数据'
  }
}
