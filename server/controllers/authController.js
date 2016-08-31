const config = require('../config');
const net = require('net');

var TC = config.TELNET;


// 得到权限
exports.permission = function*() {
  var body = this.request.query;
  var ticket = body.token;
  // ticket = '7c0926bfc3b58f7b7ff5fd275ab6db9e';
  var sysid = TC.SYSID,
      irs   = TC.IRS;

  var authoGroup = ['addcomp', 'delcomp', 'addpages', 'updpages', 'delpages' ,'publishpages'];
  var client = new net.Socket();
  client.setEncoding(TC.CHARSET);    //设置套接字的编码为一个可读流
  client.setTimeout(TC.TIMEOUT);      //如果套接字超过timeout毫秒处于闲置状态，则将套接字设为超时。默认情况下net.Socket不存在超时。
  client.connect(TC.PORT, TC.HOST,function() {
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
    for(var i=0,len=authoGroup.length;i<len;i++){
      client.write('{"loginInfo":{}, "url": "PurviewFilter?ticket='+ticket+'&sysid='+sysid+'&url='+authoGroup[i]+'"}'+irs);
    }
  });

  var permissionInfo  = yield function(done){
    var result = [];
    client.on('data', function(data) {
      if(!data) return;
      data = data.replace(/(--EOF--|\s)/g, ""); //去除空格和--EOF--
      if(!data) return;
      // 因为很有可能一条返回信息中有两条数据或多条数据，所以得拆分
      // 可以用延迟的方法来执行命令
      // 或者直接判断返回的数据是否含有多条数据
      // 这里直接判断返回的数据
      if(data.indexOf('}{')<0){ // 一条指令
        data = eval('('+data+')');
        if(data.error){// 这里可能存在错误的情况，所以需要判断是否出错，比如未登陆
          client.destroy(); // 完全关闭连接
        }
        result.push(data);
      }else{          //多条指令
        var _data = data.split('}{');
        for(var i=0,len=_data.length ,item;i<len;i++){
          item = _data[i];
          if(item.charAt(0) != '{') item = '{'+item;
          if(item.substr(-1) != '}') item = item+'}';
          item = eval('('+item+')');
          result.push(item);
        }
      }
    });

    client.on('timeout',function(){
      for(var i=0,len=result.length,item;i<len;i++){
        item = result[i];
        if(item.code == 'ok' ){
          item = item.mcode;
          for(var j=0;j<authoGroup.length;j++){
            if(authoGroup[j] == item){
              authoGroup.splice(j,1);
              break;
            }
          }
        }
      }
      done(null ,authoGroup);
    });
  };
  console.log('get voer:' ,authoGroup);
  // 仅返回没有的权限
  return this.body={code:1 ,data:permissionInfo};
}



// 得到用户信息
exports.authinfo = function*() {
  var body = this.request.query;
  var ticket = body.token;
  // ticket = '7c0926bfc3b58f7b7ff5fd275ab6db9e';
  var client = new net.Socket();
  client.setEncoding(TC.CHARSET);    //设置套接字的编码为一个可读流
  client.setTimeout(TC.TIMEOUT);      //如果套接字超过timeout毫秒处于闲置状态，则将套接字设为超时。默认情况下net.Socket不存在超时。
  client.connect(TC.PORT, TC.HOST,function() {
    // 发送请求命令
    client.write('{"loginInfo":{}, "url": "UserInfo?ticket='+ticket+'"}'+TC.IRS);
  });
  var UserInfo = yield function(done){
    client.on('data',function(data) {
      if(!data) return;
      data = data.replace(/(--EOF--|\s)/g, ""); //去除空格和--EOF--
      if(!data) return;
      data = eval('('+data+')');
      if(data.error){
        client.destroy(); // 完全关闭连接
        done(null ,{code: -1, data: data.error});
      }
      done(null ,{code:1 ,data: data});
    });    
  };
  return this.body=UserInfo;
}
