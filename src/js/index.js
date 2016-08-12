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
	matchEle : function(origin,target){
		return $.each(origin, function(k,v){
			if($(v).attr('key') === target){
				console.log(222)
				return $(v)
			}
		})
	}
}
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
function addOnlyKey(ele,key){
	for(var i=0,l=ele.length;i<l;i++){
		$(ele[i]).attr('key',key)
	}
}

// 将选中的元素样式添加至可视区
function textView (ele){

	var styles = utils.getCss(ele[0]),
		text = ele.text();
	$('#eleText').attr('value',text);
	$('#eleSize').attr('value',styles.fontSize);
	$('#eleColor').attr('value',utils.rgbToHex(styles.color));
	addOnlyKey(['#eleText','#eleSize','#eleColor','#eleFontWeight','#eleAlign'],ele.attr('key'))

	$.each($('#eleSize > *'),function(k,v){
		if($(v).attr('value') == styles.fontSize){
			$(v).attr('selected',true).siblings().removeAttr('selected')
		}
	})

	$.each($('#eleFontWeight > *'),function(k,v){
		if($(v).attr('value') === styles.fontWeight){
			$(v).attr('selected',true)
		}
	})

	$.each($('#eleAlign > *'),function(k,v){
		if(styles.textAlign === 'start' ){
			return $('#eleAlign button').eq(0).addClass('btn-success').siblings().removeClass('btn-success')
		}
		if($(v).attr('align') === styles.textAlign){
			$(v).addClass('btn-success').siblings().removeClass('btn-success')
		}
	})
}

// 检查元素类型
function checkType(type,ele){
	if (type === 'text') {
		textView(ele);
  }
}

$('.title_temp > *').on('click', function() {
  $('.view_content').append($(this).clone());
	lastTarget = $(this).clone();
	checkType($(this).attr('type'),$(this))
})

$('.view_content').on('click','*' ,function() {
	lastTarget = $(this);
	checkType($(this).attr('type'),$(this))
})

function createSizeOption(min,max){
	var str = '';
	for(var i=min;i<max;i++){
		if(i%2 === 0){
			str += '<option value='+i+'px>'+i+'</option>'
		}
	}
	return str;
}

var editTitle = {
	init : function(){
		this.changeSize();
	},
	changeSize : function(){
		$('#eleSize').on('change',function(evt){
			var fontSize = $('#eleSize :selected').attr('value');
			console.log(lastTarget,fontSize)
			$(lastTarget).css({
				fontSize : fontSize
			})
		})
	}
}


$('#eleSize').html(createSizeOption(12,42))

editTitle.init();





var sortable = Sortable.create($('.view_content')[0]);
