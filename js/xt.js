var xt = {
	getQueryString : function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	
	num2Time : function(nums, full) {
		var time = parseInt(nums); //转换为数字类型
		var unixTimestamp = new Date(time * 1000);
		//精确到秒的 时间戳时间获取
		var year = unixTimestamp.getFullYear();
		var mon = unixTimestamp.getMonth() + 1;
		var day = unixTimestamp.getDate();
		var hour = unixTimestamp.getHours();
		var mins = unixTimestamp.getMinutes();
		if(full == true) { //显示完全模式
			if(mins >= 0 && mins <= 9) {
				mins = "" + "0" + mins;
			}
			return year + '-' + mon + '-' + day + ' ' + hour + ':' + mins;
		}
		//系统时间匹配
		var curTime = new Date();
		//年份
		if(year == curTime.getFullYear()) {
			//今年
			year = "";
		} else if(year == curTime.getFullYear() - 1) {
			year = "去年 ";
		} else {
			year += '年';
		}
		//月份，当前月不显示 不是当前月显示1月 2月
		if(mon == curTime.getMonth() + 1) { //是这个月
			mon = "";
		} else {
			mon += "月";
		}
		//系统匹配几号	如果是今天则显示今天 不是显示 本月1号 本月2号 如果是昨天就显示昨天
		if(day == curTime.getDate()) { //是今天
			day = "今天 ";
		} else if(day == curTime.getDate() - 1) {
			day = "昨天";
		} else {
			if(mon == "") {
				mon = "本月 ";
			}
			day += "号 ";
		}
		//匹配小时
		if(hour < 10) {
			hour = "0" + hour;
		}
		//匹配分钟
		if(mins < 10) {
			mins = "0" + mins;
		}
		//系统显示时间
		return year + mon + day + hour + ":" + mins;
	},
	
	ajax : function(obj){
		mui.ajax(obj.url,{
			data:obj.data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(xxx){
				plus.nativeUI.closeWaiting();
				if(xxx.meta.code == 40001){
					xt.pullrefresh.endUp();
				}
				obj.cb && obj.cb(xxx);
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				obj.cb && obj.cb({
					meta : {
						code : 250,
						message : '系统错误：'+type
					}
				},xhr,type,errorThrown);
			}
		});
	},
	
	pullrefresh: {
		up: function() {
			mui('#pullrefresh').pullRefresh().endPullup();
		},
		endUp: function() {
			mui('#pullrefresh').pullRefresh().endPullup(true);
		},
		down: function() {
			mui('#pullrefresh').pullRefresh().endPulldown();
		},
		disableUp : function(disable){
			if(disable){
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
			}else{
				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
			}
		},
		refresh : function(){
			mui('#pullrefresh').pullRefresh().refresh(true);
		}
	},
	
	openURL : function(obj){
		if(!parentDom){
			parentDom = document.getElementsByTagName('header')[0];
		}
		var C = document.createElement("span");
		C.innerHTML = '<div id="process" class="mui-progressbar mui-progressbar-infinite"><span></span></div>';
		var B = plus.webview.create(obj.url,obj.url,{},obj.pageValue);
		obj.parentDom.appendChild(C);
		B.addEventListener('loaded',function(){
			C.style.display = 'none';
			B.show('slide-in-right');
		});
		
		obj.cb && obj.cb();
	},
	
	showWaiting : function(parentDom){
		if(!parentDom){
			parentDom = document.getElementsByTagName('header')[0];
		}
		
		var C = document.createElement("span");
		C.innerHTML = '<div id="process" class="mui-progressbar mui-progressbar-infinite"><span></span></div>';
		parentDom.appendChild(C);
	},
	
	closeWaiting : function(){
		if(document.getElementById("process")){
			document.getElementById("process").remove();	
		}
	}
	
}
