(function(){
  // 对象声明
  var ObjLayout = ObjComponent = ObjPages = utils = null;

  var componentTypes = [
    {name:'标题' ,key:'title'   ,img:'text.png'},
    {name:'图片' ,key:'image'   ,img:'image.png'},
    {name:'段落' ,key:'chapter' ,img:'card.png'},
    {name:'图文' ,key:'mashup'  ,img:'titlecart.png'}
  ]


  // 一些全局的DOM节点
  var domEditViewContent = $('#viewContent');

  loadUtils();
  ObjComponent = _Component();

  // 布局对象，包括基本事件
  function _Layout(){

    return {

    }
  }

  // 组件对象，包括组建事件，增删改查等
  function _Component(){
    // 一些基本的dom对象
    var domUlTypeSelect   = $('#ul_typeSelect') ,
        domUlTypeSelectC  = $('#ul_typeSelectContent');

    var componentsData = {};

    // 一些基本的方法
    // 获取元件，仅获取一次，若没网，应该从localstore中读取
    var getComponentData = function(){
      utils.fetch('/components/get', 'get', '', function(res) {
        var tempResult = {} ,_temp = null;
        $.each(res.lists, function(k, v) {
          _temp = v.category;
          if(!tempResult[_temp]){
            tempResult[_temp] = [];
          }
          tempResult[_temp].push(v);
        });
        componentsData = tempResult;
        loadComponentTab();
      })
    },
    // 加载左侧组件的列表
    getComponentAList = function(key){
      var html = [] ,data = componentsData[key];
      if(!data)  return  '';
      for(var i=0,len=data.length;i<len;i++){
        html.push(data[i].content);
      }
      return html.join('');
    },
    // 加载系统模板上方的组件类型
    loadComponentTab = function(){
      var html = [] ,htmlContent = [];
      // TODO
      for(var i=0,len=componentTypes.length,item ,_key;i<len;i++){
        item = componentTypes[i];
        _key = item.key;
        if(i == 0){
          html.push('<li class="active" data="'+_key+'">');
          htmlContent.push('<div class="'+_key+'_temp" data="'+_key+'">');
        }else{
          html.push('<li data="'+_key+'">');
          htmlContent.push('<div class="'+_key+'_temp" data="'+_key+'" style="display:none">');
        }
        htmlContent.push(getComponentAList(_key) + '</div>');
        html.push('<img src="./static/images/'+item.img+'" alt="'+_key+'"><p>'+item.name+'</p></li>');
      }
      domUlTypeSelect.html(html.join(''));
      domUlTypeSelectC.html(htmlContent.join(''));
      loadEvent();
    },
    loadEvent = function(){
      var leftSource = document.querySelector('.title_temp') ,
          rightSource = document.querySelector('#viewContent');
      // dragula([domUlTypeSelectC.children('.title_temp'), domEditViewContent]);
      dragula([leftSource, rightSource] ,{
        copy: function (el, source) {
          return source === leftSource
        },
        accepts: function (el, target) {
          return target !== leftSource
        }
      });
      $('#domUlTypeSelect li').click(function(){

      });
    }



    // 执行加载
    getComponentData();
    

  }

  // 模板对象，包括拖拽，保存属性编辑等
  function _Pages(){

  }

  function loadUtils(){
    utils = {
      getCss: function(ele) {
        var oStyle = ele.currentStyle ? ele.currentStyle : window.getComputedStyle(ele, false);
        return oStyle;
      },
      rgbToHex: function(rgb) {
        var a = rgb.split("(")[1].split(")")[0].split(",");
        return "#" + a.map(function(x) {
          x = parseInt(x).toString(16);
          return (x.length == 1) ? "0" + x : x;
        }).join("");
      },
      matchEle: function(origin, target) {
        return $.each(origin, function(k, v) {
          if ($(v).attr('key') === target) {
            return $(v)
          }
        })
      },
      toPercent: function(origin, num) {
        return (num / origin).toFixed(2) * 100 + '%';
      },
      percentTo: function(origin, num) {
        return origin.replace(/[%]/g, '') / 100;
      },
      storage: {
        get: function(name) {
          var res = localStorage.getItem(name);
          if (res) {
            return JSON.parse(res);
          } else {
            return null;
          }
        },
        set: function(name, jsonObj) {
          localStorage.setItem(name, JSON.stringify(jsonObj));
        },
        remove: function(name) {
          localStorage.removeItem(name);
        }
      },
      fetch: function(url, method, obj, successCb, errerCb) {
        if (method === 'post') {
          return fetch(config.url + url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
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
        return fetch(config.url + url, {
          headers: {
            "Content-Type": "application/json",
          }
        }).then(function(res) {
          return res.json().then(function(json) {
            if (json.code) {
              return successCb && successCb(json.data)
            }
            errerCb && errerCb(json.msg)
          })
        })
      },
      getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    }
  }

})();