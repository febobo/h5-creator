var utils = {
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

// 拉取元件
utils.fetch('/components/get', 'get', '', function(res) {
  $.each(res.lists, function(k, v) {
    switch (v.category) {
      case 'title':
        $('.title_temp').append(v.content)
        break;
      case 'image':
        $('.image_temp').append(v.content)
        break;
      default:
    }
  })
})

// 如果首次url中存在id则拉取数据
if (utils.getQueryString('id')) {
  utils.fetch('/page/preview?id=' + utils.getQueryString('id'), 'get', '', function(res) {
    $('.view_content').html(res.content)
  })
}

utils.toPercent(254, 25)
  // 记录最后一次操作的元素
var lastTarget;
Fill = function(type, ele) {
  this.ele = ele
}

Fill.prototype.settingAttr = function(ele, attr) {
  if (!ele) return

  function setAttr(type, ele, attrs) {
    if (type === 'attr') {
      for (i in attrs) {
        $(ele).attr(i, attrs[i])
      }
    }
  }
  if (ele.length) {
    $.each(ele, function(k, v) {
      for (type in attr[k]) {
        setAttr(type, v, attr[k][type])
      }
    })
  }
}

var textFill = new Fill()

// 对应关系，加上唯一key
function addOnlyKey(ele, key) {
  for (var i = 0, l = ele.length; i < l; i++) {
    $(ele[i]).attr('key', key)
  }
}

// 将选中的元素样式添加至可视区
function textView(ele) {
  var styles = utils.getCss(ele[0]),
    text = ele.text();
  $('#eleText').attr('value', text);
  $('#eleSize').attr('value', styles.fontSize);
  $('#eleColor').attr('value', utils.rgbToHex(styles.color));
  addOnlyKey(['#eleText', '#eleSize', '#eleColor', '#eleFontWeight', '#eleAlign'], ele.attr('key'))

  $.each($('#eleSize > *'), function(k, v) {
    if ($(v).attr('value') == styles.fontSize) {
      $(v).attr('selected', true).siblings().removeAttr('selected')
    }
  })

  $.each($('#eleFontWeight > *'), function(k, v) {
    if ($(v).attr('value') === styles.fontWeight) {
      $(v).attr('selected', true)
    }
  })

  $.each($('#eleAlign > *'), function(k, v) {
    if (styles.textAlign === 'start') {
      return $('#eleAlign button').eq(0).addClass('btn-success').siblings().removeClass('btn-success')
    }
    if ($(v).attr('align') === styles.textAlign) {
      $(v).addClass('btn-success').siblings().removeClass('btn-success')
    }
  })
}

// 将选中的元素样式添加至可视区
function imageView(ele) {
  var styles = utils.getCss($(ele)[0]);
  addOnlyKey(['#eleUrl', '#eleAlign'], $(ele).attr('key'))

  var percent = utils.toPercent($(ele).width(), $(ele).children('img').width())

  $('#imageWidth').val(percent)
  $('#imageHeight').val($(ele).children('img').height())
  $.each($('#imageAlign > *'), function(k, v) {
    if (styles.textAlign === 'start') {
      return $('#imageAlign button').eq(0).addClass('btn-success').siblings().removeClass('btn-success')
    }
    if ($(v).attr('align') === styles.textAlign) {
      $(v).addClass('btn-success').siblings().removeClass('btn-success')
    }
  })
}

// 检查元素类型
function checkType(type, ele) {
  if (type === 'title') {
    textView($(ele));
    viewSwitch($('.typeSelect li').eq(0), type)
  }
  if (type === 'image') {
    imageView(ele);
    viewSwitch($('.typeSelect li').eq(1), type)
  }
}

$('.tmp_content').on('click', ' > * > *', function() {
  $('.view_content').append($(this).clone());
  // lastTarget = $(this).clone();
  checkType($(this).attr('type'), this)
})

$('.view_content').on('click', '*', function(evt) {
	console.log(evt.target,evt.target.nodeName,evt)
	var styles = utils.getCss($(evt.target)[0]);
	console.log(styles)
	evt.stopPropagation();
  lastTarget = $(this);
  checkType($(this).attr('type'), this)
})

function createSizeOption(min, max) {
  var str = '';
  for (var i = min; i < max; i++) {
    if (i % 2 === 0) {
      str += '<option value=' + i + 'px>' + i + '</option>'
    }
  }
  return str;
}

// 标题编辑
var editTitle = {
  init: function() {
    this.changeSize();
    this.changeWeight();
    this.changeColor();
    this.changeAlign();
    this.changeText();
  },
  changeText: function() {
    $('#eleText').on('input propertychange', function(event) {
      $(lastTarget).text($(this).val());
    })
  },
  changeSize: function() {
    $('#eleSize').on('change', function(evt) {
      var attr = $('#eleSize :selected').val();
      $(lastTarget).css({
        fontSize: attr
      })
    })
  },
  changeWeight: function() {
    $('#eleFontWeight').on('click', function(evt) {
      var attr = $('#eleFontWeight :selected').val();
      $(lastTarget).css({
        fontWeight: attr
      })
    })
  },
  changeColor: function() {
    $('#eleColor').on('change', function(evt) {
      var attr = $(this).val();
      $(lastTarget).css({
        color: attr
      })
    })
  },
  changeAlign: function() {
    $('#eleAlign button').on('click', function(evt) {
      $(this).addClass('btn-success').siblings().removeClass('btn-success');
      var attr;
      if ($(this).hasClass('btn-success')) {
        attr = $(this).attr('align');
      }
      $(lastTarget).css({
        textAlign: attr
      })
    })
  }
}


// 图片编辑
var editImage = {
  init: function() {
    this.changeUrl();
    this.changeSize();
    this.changeAlign();
  },
  changeUrl: function() {
    $('#eleUrl').on('change', function(evt) {
      var file = this.files[0];
      if (!/image\/\w+/.test(file.type)) {
        alert("文件必须为图片！");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        $(lastTarget).children('img').attr('src', e.srcElement.result)
      }
    })
  },
  changeSize: function() {
    $('#imageWidth').on('input propertychange', function(event) {
      $(lastTarget).children('img').css({
        width: utils.percentTo($(this).val()) * $(lastTarget).width() + 'px',
      })
      $('#imageHeight').val($(lastTarget).children('img').height())
    })

    $('#imageHeight').on('input propertychange', function(event) {
      $(lastTarget).children('img').css({
        height: $(this).val() + 'px',
      })
    })
  },
  changeAlign: function() {
    $('#imageAlign button').on('click', function(evt) {
      $(this).addClass('btn-success').siblings().removeClass('btn-success');
      var attr;
      if ($(this).hasClass('btn-success')) {
        attr = $(this).attr('align');
      }
      $(lastTarget).css({
        textAlign: attr
      })
    })
  }
}

$('.deleteComponent').on('click', function() {
  $(lastTarget).remove();
})

// 点击元素改变视图
var viewSwitch = function(light, data) {
  light.addClass('active').siblings().removeClass('active');
  var activeSwitch = function(ele) {
    $.each($(ele), function(k, v) {
      if ($(v).attr('data') == data) {
        $(v).show().siblings().hide();
      }
    })
  }
  activeSwitch('.tmp_content >div')
  activeSwitch('.edit_content >div')
}

// view 切换
$('.typeSelect li').on('click', function() {
  var data = $(this).attr('data');
  viewSwitch($(this), data)
})

$('#eleSize').html(createSizeOption(12, 42))
editImage.init();
editTitle.init();

var sortable =  Sortable.create($('.view_content')[0]);

$('#save').on('click', function() {
  utils.storage.set('content', $('.view_content').html());
  alert('已保存,下次会默认打开您最后一次保存的记录')
})
$('#reset').on('click', function() {
  $('.view_content').html('');
  utils.storage.remove('content')
})

$('.view_content').html(utils.storage.get('content'));


$('#phoneView').on('click', function() {
  if (!$('.view_content').html()) return alert('好像没有什么可查看的噢');
  utils.fetch('/page/preview', 'post', {
    "create_time": new Date(),
    "content": $('.view_content').html(),
    "name": '',
    "id": utils.getQueryString('id')
  }, function(res) {
    window.history.pushState(null, null, '?id=' + res.id);
    $('#previewModal').modal('show')
    $('#prevlink').text(res.link).attr('href', res.link)
    $('#qrcode').empty().qrcode({
      width: 200,
      height: 200,
      text: res.link
    });
  }, function(msg) {
    alert(msg)
  })
})


//  左侧tab切换
$('.slide_tab > div').on('click', function() {
  var _this = this;
  $.each($('.tep_main > div'), function(k, v) {
    if ($(v).attr('data') == $(_this).attr('data')) {
      $(v).show().siblings().hide();
    }
  })
})

var history_page = 0;
var initHistoryTmp = {
  init: function() {
    this.initHistory();
    this.autoCompute();
    this.bindOnce();
    this.prevPage();
    this.nextPage();
  },
  prevPage: function(page) {
    $('.history_list .prev').on('click', function() {
      console.log(this, 11)
      initHistoryTmp.initHistory(--history_page)
    })
  },
  nextPage: function(page) {
    $('.history_list .next').on('click', function() {
      initHistoryTmp.initHistory(++history_page);
    })
  },
  initHistory: function(page) {
    if (page && page <= 0) {
      return alert('前面没有了噢')
    }
    if (page && page > Math.floor($('#history_list_count').text() / 20)) {
      return alert('后面没有更多了噢')
    }
    utils.fetch('/page/preview?page=' + page, 'get', '', function(res) {
      console.log(res)
      $('#history_list_count').text(res.count)
      var str = '';
      $.each(res.lists, function(k, v) {
        str += '<li data-id="' + v._id + '"> <span >' + v.name + '</span> <span>' + v.create_time + '</span> </li>'
      })
      $('#history_list_content').html(str);
    }, function(msg) {
      alert(msg)
    })
  },
  bindOnce: function() {
    $('#history_list_content').on('click', 'li', function() {
      var _id = $(this).attr('data-id')
      utils.fetch('/page/preview?id=' + _id, 'get', '', function(res) {
        $('.view_content').html(res.content)
      })
    })
  },
  autoCompute: function() {
    var h = $(window).height() - $('.header').height() - 60 + 'px';
    $('.history_list').css({
      height: h,
      overflowY: 'scroll'
    })
  }
}
initHistoryTmp.init();

var component_page = 0;
var initComponentTmp = {
  init: function() {
    this.initHistory();
    this.autoCompute();
    this.bindOnce();
    this.prevPage();
    this.nextPage();
  },
  prevPage: function(page) {
    $('.components_list .prev').on('click', function() {
      console.log(this, 11)
      initComponentTmp.initHistory(--component_page)
    })
  },
  nextPage: function(page) {
    $('.components_list .next').on('click', function() {
      initComponentTmp.initHistory(++component_page);
    })
  },
  initHistory: function(page) {
    if (page && page <= 0) {
      return alert('前面没有了噢')
    }
    if (page && page > Math.floor($('#components_list_count').text() / 30)) {
      return alert('后面没有更多了噢')
    }
    utils.fetch('/components/get?page=' + page, 'get', '', function(res) {
      console.log(res)
      $('#components_list_count').text(res.count)
      var str = '';
      $.each(res.lists, function(k, v) {
        str += '<li data-id="' + v._id + '"> <span >' + v.name + '</span> <span class="label label-info">' + v.category + '</span> </li>'
      })
      $('#components_list_content').html(str);
    }, function(msg) {
      alert(msg)
    })
  },
  bindOnce: function() {
    $('#components_list_content').on('click', 'li', function() {
      var _id = $(this).attr('data-id')
      utils.fetch('/components/get?id=' + _id, 'get', '', function(res) {
        $('.view_content').html(res.content)
      })
    })
  },
  autoCompute: function() {
    var h = $(window).height() - $('.header').height() - 60 + 'px';
    $('.tmp_content,.components_list').css({
      height: h,
      overflowY: 'scroll'
    })
  }
}
initComponentTmp.init();
