const ComponentModel = require('../model/components');
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const parse = require('co-busboy');
const os = require('os');
const path = require('path');

const md5 = function(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// var bf = fs.createReadStream('./public/static/upload/images/bf8.png');


exports.add = function*() {
  var ctx = this;
  var body = ctx.request.body;
  if (!body.name || !body.category || !body.content) {
    return this.body = {
      code: 0,
      msg: '缺少必要信息'
    }
  }
  const result = yield ComponentModel.findOne({
    'name': body.name
  })
  if (result) {
    return this.body = {
      code: 0,
      msg: '名称已存在'
    }
  }

  body.create_time = new Date();
  var component = new ComponentModel(body);
  var newObj = yield component.save();
  return this.body = {
    code: 1,
    msg: '添加成功'
  }
}

exports.loadfile = function*() {
  if (!this.request.is('multipart/*')) return
  var parts = parse(this, {
    autoFields: true
  })
  var part;
	console.log(parts[0])
  while (part = yield parts) {
    var stream =
      fs.createWriteStream(path.join('./public/static/upload/images/', Math.random().toString()));
    var file = part;
    var bf = part.pipe(stream);
		
    bf.on('finish', function(part) {
      var buffer = fs.readFileSync(stream.path);
      request.post({
        // url: "http://192.168.1.195:9090/upload_webp_images_j.wn",
        url : 'http://lt-upload.imgs.wn518.com/upload_webp_images_j.wn',
        headers: {
          sign: md5(md5(buffer) + 'RaXcv#Dv!jcQK5Tc$FZp00aoX%liVybg'),
          app: 'jyh-cms',
          meta: 'md5=' + md5(buffer) + '&filename=' + file.filename,
          'Content-Type': 'application/binary',
        },
        body: buffer
      }, function(e, r, res) {
        console.log(res)
      })
    })
  }
}


exports.get = function*() {
  var ctx = this;
  var body = ctx.request.query;
  var limit = 30;
  var start = (body.page || 0) * limit;

  if (body.id) {
    var componentContent = yield ComponentModel.findOne({
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

  var result = yield ComponentModel.find({}).skip(start).limit(limit).sort('-create_time');
  var count = yield ComponentModel.count();
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

  const result = yield ComponentModel.remove({
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
