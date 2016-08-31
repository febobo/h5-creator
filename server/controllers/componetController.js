const ComponentModel = require('../model/components');

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
