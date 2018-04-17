

/*上一步点击事件*/
$(".un_back").on("click",function(){
	var len=$(".flow_linebo").find(".float-in").length,
		nowdex=parseInt((len+1)/2),
		steplen=$(".flow_linebo .flo-txbo").length;
	if(nowdex>1){//非第一步
		if(nowdex==2){
			$(".un_back").addClass("hidden");
			$(".un_backdisable").removeClass("hidden");
		}
		$(".un_next").removeClass("hidden");
		$("#save").addClass("hidden");
		Pcommonality.linestyle($(".flow_linebo"),nowdex-1);
		$(".form-horizontal").find(".formhori-hidbox").hide();
		$(".form-horizontal").find(".formhori-hidbox:eq("+(nowdex-2)+")").slideDown("300");
	}
});

/*下一步点击事件*/
$(".un_next").on("click",function(){
	var len=$(".flow_linebo").find(".float-in").length,
		nowdex=parseInt((len+1)/2),
		steplen=$(".flow_linebo .flo-txbo").length;
	if(nowdex<steplen){//非最后一步时
		var $form=$(".form-horizontal").find(".formhori-hidbox:eq("+(nowdex-1)+")");
		validator($form);
		var bootstrapValidator = $form.data('bootstrapValidator');
		bootstrapValidator.validate();
		
	/*	if(rettabnamerepeat()&&tabdata==null&&nowdex==1){//验证表名是否重复
			bootstrapValidator.updateStatus('tableName', 'INVALID', 'repeat').validateField('tableName');
			return;
		}*/
		
		if(!bootstrapValidator.isValid()){ return;}
		
		if(nowdex==2){//改变按钮为保存
			$(this).addClass("hidden");
			$("#save").removeClass("hidden");
		}
		$(".un_back").removeClass("hidden");
		$(".un_backdisable").addClass("hidden");
		Pcommonality.linestyle($(".flow_linebo"),nowdex+1);
		$(".form-horizontal").find(".formhori-hidbox").hide();
		$(".form-horizontal").find(".formhori-hidbox:eq("+nowdex+")").slideDown("300");
		
	}
});

//表名是否重复验证
function rettabnamerepeat(){
	var validTableName = false;
    $.ajax({
        url: base.basePath + '/services/wareHourseService/existsByName',
        type: 'post',
        async: false,
        data: {
        	tableName: $("#tableName").val(),
        	type: 1
        },
        dataType: 'json',
        success: function (data) {
            if (data.data) {
                validTableName = data.data;
            }
        }
    });
    return validTableName;
}

/*新增字段点击事件*/
$("#addtabletype").on("click",function(){
	$("#tab tbody").append($("#tab-row").tmpl());


});

/*删除字段*/
$("#tab").on("click",".del_row",function(){
	$(this).parent().parent().remove();
});

/*字段类型切换事件*/
$(document).on("change",".t-p-pnone",function(){
	debugger;
	alert("aaa");
	var typ=$(this).val();
	var putdom=$(this).parent().next();
	if(typ=="char"||typ=="varchar"){
		putdom.find("input:gt(0),span").remove();
		putdom.find("input").attr({"disabled": false,"placeholder": "请输入精度"}).removeClass("decimal-t");
	}else if(typ=="decimal"){
		putdom.find("input:eq(0)").attr({"disabled": false,"placeholder": "精度"}).addClass("decimal-t");
		putdom.find("input").after('<span class="decimal-s">,</span><input class="t-p-pnone decimal-t" placeholder="位数" type="text" />');
	}else{
		putdom.find("input:gt(0),span").remove();
		putdom.find("input").val("");
		putdom.find("input").attr({"disabled": true,"placeholder": ""}).removeClass("decimal-t");
	}
});

//获取表字段信息帮助
function tbfieldshelp(){
	var tblis=[];
	var hasnamnull=false;
	$("#tab").find("tbody tr").each(function(){
		var tbtrim={};
		var typstr=$(this).find("td[data-name='fieldType'] select").val();
		var typval=null;
		if(typstr=="decimal"){
			typval=$(this).find("td[data-name='fieldTypeval'] input:eq(0)").val();
			typval=typval+","+$(this).find("td[data-name='fieldTypeval'] input:eq(1)").val();
			typstr=typstr+"("+typval+")";
		}else{
			typval=$(this).find("td[data-name='fieldTypeval'] input").val();
			if(typval != ""){
				typstr=typstr+"("+typval+")";
			}
		}
		var fieldName=$(this).find("td[data-name='fieldName'] input").val();
		if(fieldName==""||fieldName==null){
			hasnamnull=true;
			return false;
		}
		var hasname=false;
		for(var i in tblis){
			if(fieldName==tblis[i].fieldName){
				hasnamnull=true;
				hasname=true;
				return false;
			}
		}
		if(hasname){
			hasnamnull=true;
			return false;
		}
		if(typeof($(this).attr("fieldid"))!="undefined"){
			tbtrim.fieldId=$(this).attr("fieldid");
		}
		tbtrim.fieldName=fieldName;//字段名
		tbtrim.fieldType=typstr;//字段类型加（值）
		tbtrim.fieldComment=$(this).find("td[data-name='fieldComment'] input").val();//描述
		//tbtrim.fieldId = $("#fieldId").val();
		tbtrim.tbTableName =  $("#tableName").val();
		tbtrim.systemId =  $("#systemId").val();
		tbtrim.tabSchema =  $("#tabSchema").val();
		tblis.push(tbtrim);
	});
	if(hasnamnull){
		return false;
	}else{
		console.log(tblis);
		return tblis;
	}
}

//分隔符内容 json格式字符串
function splitContenthelp(tdom){
	var fdom=tdom.parent().parent().parent();
	var splits={};
	fdom.find("input[keyname]").each(function(){
		console.log(1);
		var keyname=$(this).attr("keyname");
		splits[keyname]=$(this).val();
	});
	return splits;
}

/*保存事件*/
$("#save").on("click",function(){
	var operateType=1;
	var isAutoLoad=true;
	var splitType=null;
	var splitContent=null;
	var tbFields=tbfieldshelp();
	if(!tbFields){
		Msgshow.mwarning("字段名称不可为空且不可重复！");
		return;
	}
	var skipLine=$("#skipLine").is(":checked")==true?$(".formhori-hidbox input[name='skipLine']").val():"0";
	var splitTypedom=$(".form-horizontal").find(".formhori-hidbox input[name='splitType']:checked");
	if(splitTypedom.val()!=""&&splitTypedom.val()!=null){
		splitContent=splitContenthelp(splitTypedom);//获取分隔符内容json字符串
		isAutoLoad=false;
		splitType=splitTypedom.val();
	}
	if(tableName!=""&&tableName!=null){
		operateType=2;
	}
	console.log(userId);
	userID='<%=userID%>';
	//systemId,tabSchema,tableName,comment,storeType,
	//algori,isAcidTable,bucketKeys,bucketNum,isSplit,splitNum,splitKeyList
	var tabdatajson={
			systemId:$("#systemId").val(),
			tabSchema:$("#tabSchema").val(),
			tableName:$("#tableName").val(),
			comment:$("#comment").val(),
			storeType:$("#storeType").val(),
			algori:$("#algori").val(),
			isAcidTable:$("#isAcidTable").val(),
			bucketKeys:$("#bucketKeys").val(),
			bucketNum:$("#bucketNum").val(),
			isSplit:$("#isSplit").val(),
			splitNum:$("#splitNum").val(),
			splitKeyList:$("#splitKeyList").val(),
			bucketKeys:$("#bucketKeys").val(),
			userID:userID,
			fields: tbFields//表字段信息
			
	};
	var now_operate = $("#now_operate").html();
	 con_url = "/dataConfig/tableConstructAddEntity";
	 if(now_operate.indexOf("修改")!=-1){
		 con_url = "/dataConfig/edit";
	 }
	
	$.ajax({
		url: base.basePath + con_url,
		type: "post",
		dataType: "json",
	    contentType: "application/json;charset=utf-8",
		data: JSON.stringify(tabdatajson),
		success:function(data){
			/*var dataparse=JSON.parse(data);
			if(dataparse.statusCode=="0"){
				//Msgshow.msuccess("保存成功。");
				//history.go(-1);
				location.href = base.basePath + "/dataConfig/tableConstructConfig"
			}else{
				Msgshow.merror(dataparse.message);
			}*/
			var dats=data;
			if(typeof(dats.statusCode)=="undefined"){
				dats=JSON.parse(data);
			}
			if(dats.statusCode=="0"){
				//Msgshow.msuccess("删除成功。");
				location.href = base.basePath + "/dataConfig/tableConstructConfig"
			}else{
				Msgshow.merror(data.message);
			}
		},error:function(errordata){
			var errordataparse=JSON.parse(errordata);
			Msgshow.merror(errordataparse.message);
		}
	});
});




