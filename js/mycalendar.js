/*
* MyCalendar
* version: 0.0.1
* Date: 06/13/2013
* author: santiago chen
* email: santiago1209@foxmail.com
* more on https://github.com/santiagochen
*
* MyCalendar
* It is a Javascript Calendar Plugin. 
* Tested Browser: Firefox, Chrome, Safari, IE6-IE9.
*
* Params:
* MyCalendar.init({
*	state: "month",
*   onselect: function(){//do something},
*	language:"cn"
*	})
* state: state has three choices: date, or month, or year. Date-state is default(date); 
* language: cn or en, default is en;
* onselect: function(){}
* 
* Exports:
* MyCalendar.selectvalue:  get the exact date your chosen
*
* Special ClassName
* .mycalendar-headtable
* .mycalendar-viewtypebtn
* .mycalendar-prevbtn
* .mycalendar-nextbtn
* .mycalendar-yeartable
* .mycalendar-thisyear
* .mycalendar-selectyear
* .mycalendar-monthtable
* .mycalendar-thismonth
* .mycalendar-selectmonth
* .mycalendar-datetable
* .mycalendar-datesinthismonth
* .mycalendar-today
* .mycalendar-overtd
*
*/

var MyCalendar = MyCalendar||{};

(function(){
	
var monthlength = [31,28,31,30,31,30,31,31,30,31,30,31],
	leapmonthlength = [31,29,31,30,31,30,31,31,30,31,30,31],
	enmonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	cnmonths = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
	endays = ["Sun","Mon","Tue","Wed", "Thu", "Fri","Sat"],
	cndays = ["周日","周一","周二","周三", "周四", "周五","周六"],
	curDate =  new Date(),
	curYear =  curDate.getFullYear(),
	curMonth = curDate.getMonth(),
	language,
	onselect,
	curState;

MyCalendar.init=function(param){

	language = param.language||"en";
	MyCalendar.months =(language=="cn")?cnmonths:enmonths;
	MyCalendar.days = (language=="cn")?cndays:endays;
	
	document.body.appendChild(buildwrap());
	
	curState = param.state||"date";
	utils.lighten(curState);
	onselect = param.onselect||null;
	
	
	/*START especially for makeup the missing indexOf function in IE8-*/
	if(!Array.indexOf){
		Array.prototype.indexOf = function(obj){
			for(var i=0; i<this.length; i++){
				if(this[i]==obj){
					return i;
					}
				}
			return -1;
			}
		}
	/*END especially for makeup the missing indexOf function in IE8-*/
	}
	
function buildwrap(){
	
	var wrap = document.createElement("div");
	wrap.style.cursor = "pointer";
	
	MyCalendar.headtable =  utils.tablize(1,3);
	MyCalendar.yeartable = utils.tablize(4,3);
	MyCalendar.monthtable = utils.tablize(4,3);
	MyCalendar.datetable = utils.tablize(7,7);
	
	//headtable
	MyCalendar.headtable.setAttribute("class","mycalendar-headtable");
	utils.tdinsert(MyCalendar.headtable,[1,1],"&lt;&lt;");
	MyCalendar.prevBtn = utils.tdselect(MyCalendar.headtable,[1,1]);
	MyCalendar.prevBtn.setAttribute("class","mycalendar-prevbtn");
	
	utils.tdinsert(MyCalendar.headtable,[1,2], curYear+","+MyCalendar.months[curMonth]);
	
	MyCalendar.viewtypeBtn = utils.tdselect(MyCalendar.headtable,[1,2]);
	MyCalendar.viewtypeBtn.setAttribute("class","mycalendar-viewtypebtn");
	
	utils.tdinsert(MyCalendar.headtable,[1,3],"&gt;&gt;");
	MyCalendar.nextBtn = utils.tdselect(MyCalendar.headtable,[1,3]);
	MyCalendar.nextBtn.setAttribute("class","mycalendar-nextbtn");
	
	//yeartable
	MyCalendar.yeartable.setAttribute("class","mycalendar-yeartable");
	utils.buildyear();
	
	//monthtable
	MyCalendar.monthtable.setAttribute("class","mycalendar-monthtable");
	utils.buildmonth();
	
	//datetable
	MyCalendar.datetable.setAttribute("class","mycalendar-datetable");
	//add day category
	for(var tm=0; tm<7; tm++){
		utils.tdinsert(MyCalendar.datetable,[1,(tm+1)],MyCalendar.days[tm]);
		}
	utils.builddate();
	
	//Events Attachments
	//events for viewtypeBtn
	MyCalendar.viewtypeBtn.onclick = function(e){
		utils.viewbtnswitch();
		}
	//events for prevbtn and nextbtn
	if(window.attachEvent){
		MyCalendar.prevBtn.attachEvent("onclick",utils.indexsink);
		MyCalendar.nextBtn.attachEvent("onclick",utils.indexrise);
		}
	else{
		MyCalendar.prevBtn.addEventListener("click",utils.indexsink);
		MyCalendar.nextBtn.addEventListener("click",utils.indexrise);
		}
	
	wrap.onmouseover = function(e){
		var e = e||window.event;
		var target =  e.target||e.srcElement;
		if(target.nodeName=="TD"){
			utils.addclass(target,"mycalendar-overtd");	
			}
		}
		
	wrap.onmouseout = function(e){
		var e = e||window.event;
		var target =  e.target||e.srcElement;
		if(target.nodeName=="TD"){
			utils.removeclass(target,"mycalendar-overtd");
			}
		}
		
	wrap.onclick = function(e){
		var e = e||window.event;
		var target =  e.target||e.srcElement;
		if(target.nodeName=="TD"){
			if(MyCalendar.headtable.contains(target)==false){
				utils.withclick(target);
				}	
			}
		}
	
	
	//wrap all in.
	wrap.appendChild(MyCalendar.headtable);
	wrap.appendChild(MyCalendar.yeartable);
	wrap.appendChild(MyCalendar.monthtable);
	wrap.appendChild(MyCalendar.datetable);
	
		
		
	return wrap;
	}		

var utils = {
	txt:"xiaominglaile",
	tablize:function (row,line){
		var _table = document.createElement("table");
		var _tb = document.createElement("tbody");
		for(var m=0; m<row; m++){
			var _tr = document.createElement("tr");
			for(var n=0; n<line; n++){
				var _td = document.createElement("td");
				_tr.appendChild(_td);
				}
			_tb.appendChild(_tr);
			}
		_table.appendChild(_tb);
		return _table;
		},
	
	tdselect:function (target, array){
		/*here array index is match human's commonsense, instead of code custom*/
		var _row = array[0],
			_line = array[1];
		return target.rows[_row-1].cells[_line-1];
		},
	
	tdinsert:function (target, array, data){
		//delete cell's data when leaving data as blank
		var _data = data||"";
		var _row = array[0],
			_line = array[1];
		target.rows[_row-1].cells[_line-1].innerHTML=_data;
		
		},
		
	indexsink:function(){
		switch(curState){
			case "date":
			curMonth--;
			if(curMonth<0){
				curMonth=11;
				curYear--;
				}
			curDate.setMonth(curMonth);	
			MyCalendar.viewtypeBtn.innerHTML = curYear+","+MyCalendar.months[curMonth];
			break;
			case "month":
			curYear--;
			MyCalendar.viewtypeBtn.innerHTML = curYear;
			break;
			case "year":
			curYear--;
			MyCalendar.viewtypeBtn.innerHTML = (curYear-7)+"-"+(curYear+4);
			break;
			}
		utils.clearclass();
		utils.builddate();
		utils.buildmonth();
		utils.buildyear();
		},
	
	indexrise:function(){
		switch(curState){
			case "date":
			curMonth++;
			if(curMonth>11){
				curMonth=0;
				curYear++;
				}
			curDate.setMonth(curMonth);
			MyCalendar.viewtypeBtn.innerHTML = curYear+","+MyCalendar.months[curMonth];
			break;
			case "month":
			curYear++;
			MyCalendar.viewtypeBtn.innerHTML = curYear;
			break;
			case "year":
			curYear++;
			MyCalendar.viewtypeBtn.innerHTML = (curYear-7)+"-"+(curYear+4);
			break;	
			}
		utils.clearclass()
		utils.builddate();
		utils.buildmonth();
		utils.buildyear();
		
		},
	
	//build year table	
	buildyear:function(){
		var _fromy = curYear-7;
		for(var ym=0; ym<4; ym++){
			for(var yn=0; yn<3; yn++){
				utils.tdinsert(MyCalendar.yeartable,[(ym+1),(yn+1)],_fromy);
				if(_fromy==new Date().getFullYear()){
					utils.addclass(utils.tdselect(MyCalendar.yeartable,[(ym+1),(yn+1)]),"mycalendar-thisyear")
					}
				if(_fromy==curYear){
					utils.addclass(utils.tdselect(MyCalendar.yeartable,[(ym+1),(yn+1)]),"mycalendar-selectyear")
					}
				_fromy++;
				}
			}
		},
	
	//build month table
	buildmonth:function(){
		var _fromm = 0;
		for(var mm=0; mm<4; mm++){
			for(var mn=0; mn<3; mn++){
				utils.tdinsert(MyCalendar.monthtable,[(mm+1),(mn+1)],MyCalendar.months[_fromm]);
				if(_fromm==new Date().getMonth()&&curYear==new Date().getFullYear()){
					utils.addclass(utils.tdselect(MyCalendar.monthtable,[(mm+1),(mn+1)]),"mycalendar-thismonth")
					}
				if(_fromm==curMonth){
					utils.addclass(utils.tdselect(MyCalendar.monthtable,[(mm+1),(mn+1)]),"mycalendar-selectmonth")
					}
				_fromm++;
				}
			}
		},
	
	//build date table
	builddate:function(){
		//set current month date table;
		var firstdate = curDate;
		firstdate.setDate(1);
		var firstday =firstdate.getDay();
		//how many days this month
		if(curYear%4==0){
			var thismonthlength = leapmonthlength[curMonth]; 
			var lastmonthlength = (curMonth==0)?31:leapmonthlength[curMonth-1];
			}
		else{
			var thismonthlength = monthlength[curMonth]; 
			var lastmonthlength = (curMonth==0)?31:monthlength[curMonth-1];
			}
		
		//equeal Saturday
		var _fromd = 1;
		for(var dr=1; dr<7; dr++){
			for(var dl=0; dl<7; dl++){
				if(dr==1&&dl<firstday){
					utils.tdinsert(MyCalendar.datetable,[(dr+1),(dl+1)],(lastmonthlength-firstday+dl+1));
					}
				else{
					if(_fromd<thismonthlength+1){
						utils.tdinsert(MyCalendar.datetable,[(dr+1),(dl+1)],_fromd);
						utils.addclass(utils.tdselect(MyCalendar.datetable,[(dr+1),(dl+1)]),"mycalendar-datesinthismonth")
						if(_fromd==new Date().getDate()&&curMonth==new Date().getMonth()&&curYear==new Date().getFullYear()){
							utils.addclass(utils.tdselect(MyCalendar.datetable,[(dr+1),(dl+1)]),"mycalendar-today");
							}
						
						}
					else{
						utils.tdinsert(MyCalendar.datetable,[(dr+1),(dl+1)],(_fromd-thismonthlength));
						}
					_fromd++;
					}
				}	
			}
		},
		
	lighten:function(state){
		//close all.
		MyCalendar.yeartable.style.display = "none";
		MyCalendar.monthtable.style.display = "none";
		MyCalendar.datetable.style.display = "none";
		//lighten one
		if(state == "year"){ MyCalendar.yeartable.style.display = "block";}
		else if(state == "month"){ MyCalendar.monthtable.style.display = "block";}
		else{ MyCalendar.datetable.style.display = "block";}
		},
		
	viewbtnswitch:function(){
		utils.clearclass()
		if(curState=="date"){
			MyCalendar.viewtypeBtn.innerHTML = (parseInt(curYear)-7)+"-"+(parseInt(curYear)+4);
			curState = "year";
			utils.buildyear();
			utils.lighten("year");
			}
		else if(curState=="month"){
			MyCalendar.viewtypeBtn.innerHTML = curYear+","+MyCalendar.months[curMonth];
			curState = "date";
			utils.builddate();
			utils.lighten("date");
			}
		else{
			MyCalendar.viewtypeBtn.innerHTML = curYear;
			curState = "month";
			utils.buildmonth();
			utils.lighten("month");
			}
		
		},
	
	addclass:function(target,classname){
		target.className +=(" "+classname);
		},
	
	removeclass:function(target,classname){
		if (classname == null){
			target.className = "";
			}
		else{
			var newly = target.className.replace(classname, "")
			target.className = newly;
			}
		},
		
	clearclass:function(kind){
		if(kind == null){
			//clear yeartable classname
			for(var ym=0; ym<4; ym++){
				for(var yn=0; yn<3; yn++){
					utils.tdselect(MyCalendar.yeartable,[(ym+1),(yn+1)]).className="";
					}
				}
			//clear monthtabel classname
			for(var mm=0; mm<4; mm++){
				for(var mn=0; mn<3; mn++){
					utils.tdselect(MyCalendar.monthtable,[(mm+1),(mn+1)]).className="";
					}
				}
			//clear datetable classname
			for(var dr=1; dr<7; dr++){
				for(var dl=0; dl<7; dl++){
					utils.tdselect(MyCalendar.datetable,[(dr+1),(dl+1)]).className="";
					}
				}
			}
		},
	
	withclick:function(obj){
		switch(curState){
			case "year":
			curYear = obj.innerHTML;
			utils.viewbtnswitch();
			break;
			case "month":
			curMonth = MyCalendar.months.indexOf(obj.innerHTML);
			curDate.setMonth(curMonth);
			utils.viewbtnswitch();
			break;
			case "date":
			//let it do sth
			MyCalendar.selectvalue = MyCalendar.viewtypeBtn.innerHTML+obj.innerHTML;
			MyCalendar.viewtypeBtn.innerHTML
			if(onselect!==null){
				onselect()
				}
			break;
			}
		}
	
	}
		
})()