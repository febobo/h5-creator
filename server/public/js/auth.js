;(function(window ,$){
	var Fetch = function(url, method, obj, successCb, errerCb) {
	    if (method === 'post') {
	      return fetch(config.url + url, {
	        method: 'post',
	        headers: {"Content-Type": "application/json" },
	        mode: 'cors',
	        body: JSON.stringify(obj)
	      }).then(function(res) {
	        return res.json().then(function(json) {
	          if (json.code) {
	            return successCb && successCb(json.data)
	          }
	          errerCb && errerCb(json.msg)
	        })
	      })
	    }
	    return fetch(config.url + url, {headers: {"Content-Type": "application/json"}}).then(function(res) {
	      return res.json().then(function(json) {
	        if (json.code) {
	          return successCb && successCb(json.data)
	        }
	        errerCb && errerCb(json.msg)
	      })
	    })
	},

	removeHtmlByAuth = function(res){
		if(!res || typeof res != 'object') return;
		var cssSelector = [];
		for(var i=0,len=res.length;i<len;i++){
			cssSelector.push('[auth="'+res[i]+'"]');
		}
		$(cssSelector.join(',')).remove();
		// 模板是否可被修改
		// autoRead="updpages"  contenteditable="true"
		$('[auth]').removeAttr('auth');
	}

	// 验证登陆，判断是否存在token，不存在，则跳转到万能系统下
	var token = '7c0926bfc3b58f7b7ff5fd275ab6db9e';

	Fetch('/authinfo?token='+token, 'get', '' , function(res) {
		console.log('获取到的用户信息为：',res);
	})


  	Fetch('/permission?token='+token, 'get', '', removeHtmlByAuth);
})(window, $);