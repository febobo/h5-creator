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
  }
}

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

$('.title_temp > *').on('click', function() {
  $('.view_content').append($(this).clone());
  if ($(this).attr('type') === 'text') {
    var styles = utils.getCss($(this)[0]),
      text = $(this).text();
    $('#eleColor').attr('autocomplete', '#fff')
    textFill.settingAttr(['#eleText', '#eleSize', '#eleColor'], [{
      attr: {
        value: $(this).text()
      }
    }, {
      attr: {
        value: utils.getCss($(this)[0]).fontSize
      }
    }, {
      attr: {
        value: utils.rgbToHex(utils.getCss($(this)[0]).color)
      }
    }])
  }
})


$('.view_content').on('click', '*', function() {
  if ($(this).attr('type') === 'text') {
    var styles = utils.getCss($(this)[0]),
      text = $(this).text();
  }
})
