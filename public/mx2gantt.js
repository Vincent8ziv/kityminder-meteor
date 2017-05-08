var level = 0;
var allnode = [];
function getdata(rot){
	var node = JSON.parse('{}');
	node.name = rot.data.text;
	node.level = level;
	node.id = 0 - allnode.length;
	node.created = rot.data.created;
	node.priority = (rot.data.priority == undefined) ? 0 : rot.data.priority;
    node.status= (rot.data.status  == undefined) ? "STATUS_ACTIVE" : rot.data.status;
    node.depends= (rot.data.depends == undefined) ? "" :rot.data.depends ;
    node.canWrite= (rot.data.canWrite == undefined) ? true : rot.data.canWrite ;
    var d = new Date();
    var start = d.getTime();
    var end = d.getTime(d.setDate(d.getDate()+1));
    node.start= (rot.data.start == undefined) ? start : rot.data.start;
    node.duration= (rot.data.duration == undefined) ? 1 : rot.data.duration;
    node.end= (rot.data.end == undefined) ? end : rot.data.end;
    node.startIsMilestone= (rot.data.startIsMilestone == undefined) ? false : rot.data.startIsMilestone;
    node.endIsMilestone= (rot.data.endIsMilestone  == undefined) ? false : rot.data.endIsMilestone ;
    node.collapsed= (rot.data.collapsed  == undefined) ? false : rot.data.collapsed;
    node.assigs= (rot.data.assigs == undefined) ? [] : rot.data.assigs;
    node.progress= (rot.data.progress == undefined) ? 0 : rot.data.progress;
    node.progressByWorklog= (rot.data.progressByWorklog == undefined) ? false : rot.data.progressByWorklog;
    node.relevance= (rot.data.relevance == undefined) ? 0 : rot.data.relevance;
    node.type= (rot.data.type == undefined) ? "" : rot.data.type;
    node.typeId= (rot.data.typeId == undefined) ? "" :rot.data.typeId ;
    node.description= (rot.data.description == undefined) ? "" :rot.data.description;
    node.code= (rot.data.code == undefined) ? allnode.length : rot.data.code ;
	if (rot.children.length>0) {
		node.hasChild = true;
	}else{
		node.hasChild = false;
	}
	allnode.push(node);
	for (var i = 0; i < rot.children.length; i++) {
		level = level + 1;
		getdata(rot.children[i]);
	}
	level = level -1;
};
function mx2gantt(mindx){
	console.log("mx2gantt");
	var gannt = JSON.parse('{}');
	var rot = mindx.root;
	level = 0;
	allnode = [];
	getdata(rot);
	gannt.tasks = allnode;
	gannt.selectedRow = 0;
	gannt.deletedTaskIds = [];
	gannt.resources = (mindx.resources  == undefined) ? [{"id": "tmp_1", "name": "管理员"},
      {"id": "tmp_2", "name": "执行者"}] :  mindx.resources;

	gannt.roles = (mindx.roles == undefined) ? [{"id": "tmp_1", "name": "项目管理"},
      {"id": "tmp_2", "name": "执行"}] :  mindx.roles;
	gannt.canWrite = (mindx.canWrite == undefined) ? true :  mindx.canWrite;
	gannt.canWriteOnParent = (mindx.canWriteOnParent  == undefined) ? true :  mindx.canWriteOnParent;
	gannt.zoom = (mindx.zoom == undefined) ? "d" : mindx.zoom;
	return gannt;
};
function gantt2mx(gannt) {
	console.log("gantt2mx");
	console.log(gantt.template);
	console.log(gantt.theme);
	var g = gannt;
	var tasks = g.tasks;
	var temptasks = [];
	var maxlevel = 0;
	for (var i = tasks.length - 1; i >= 0; i--) {
		if (tasks[i].level > maxlevel) {
			maxlevel = tasks[i].level;
		}
		var task = JSON.parse('{}');
		task.data = JSON.parse('{}');
		task.data.id = tasks[i].id;
		task.data.name = tasks[i].name;
		task.data.progress = tasks[i].progress;
		task.data.progressByWorklog = tasks[i].progressByWorklog;
		task.data.relevance = tasks[i].relevance;
		task.data.type = tasks[i].type;
		task.data.typeId = tasks[i].typeId;
		task.data.description = tasks[i].description;
		task.data.code = tasks[i].code;
		task.data.level = tasks[i].level;
		task.data.status = tasks[i].status;
		task.data.depends = tasks[i].depends;
		task.data.canWrite = tasks[i].canWrite;
		task.data.start = tasks[i].start;
		task.data.duration = tasks[i].duration;
		task.data.end = tasks[i].end;
		task.data.startIsMilestone = tasks[i].startIsMilestone;
		task.data.endIsMilestone = tasks[i].endIsMilestone;
		task.data.collapsed = tasks[i].collapsed;
		task.data.assigs = tasks[i].assigs;
		task.data.hasChild = tasks[i].hasChild;
		var s = new Date();
		s.setTime(tasks[i].start);
		var e = new Date();
		e.setTime(tasks[i].end);
		task.data.note = tasks[i].description + "`" + s.toLocaleDateString() + "` - `" + e.toLocaleDateString() + "`";
		task.data.text = tasks[i].name;
		task.data.created = new Date().getTime();
		tasks[i] = task;
	}
	while (maxlevel > 0) {
		for (var i = tasks.length - 1; i >= 0; i--) {
			var task = tasks[i];
			if (task.data.level == maxlevel) {
				temptasks.push(task);
			} else if (task.data.level < maxlevel) {
				tasks.splice(i + 1, temptasks.length);
				tasks[i].children = temptasks.reverse();
				temptasks = [];
			}
		}
		maxlevel = maxlevel - 1;
	}
	var imx = JSON.parse('{}');
	imx.root = tasks[0];
	imx.version = "1.4.41";
	imx.template = template;
	imx.theme = theme;
	imx.canWrite = gannt.canWrite;
	imx.canWriteOnParent = gannt.canWriteOnParent;
	imx.zoom = gannt.zoom;
	imx.roles = gannt.roles;
	imx.resources = gannt.resources;
	imx.deletedTaskIds = gannt.deletedTaskIds;
	return imx;
};

function editResources(){

  //make resource editor
  var resourceEditor = $.JST.createFromTemplate({}, "RESOURCE_EDITOR");
  var resTbl=resourceEditor.find("#resourcesTable");

  for (var i=0;i<ge.resources.length;i++){
    var res=ge.resources[i];
    resTbl.append($.JST.createFromTemplate(res, "RESOURCE_ROW"))
  }


  //bind add resource
  resourceEditor.find("#addResource").click(function(){
    resTbl.append($.JST.createFromTemplate({id:"new",name:"resource"}, "RESOURCE_ROW"))
  });

  //bind save event
  resourceEditor.find("#resSaveButton").click(function(){
    var newRes=[];
    //find for deleted res
    for (var i=0;i<ge.resources.length;i++){
      var res=ge.resources[i];
      var row = resourceEditor.find("[resId="+res.id+"]");
      if (row.length>0){
        //if still there save it
        var name = row.find("input[name]").val();
        if (name && name!="")
          res.name=name;
        newRes.push(res);
      } else {
        //remove assignments
        for (var j=0;j<ge.tasks.length;j++){
          var task=ge.tasks[j];
          var newAss=[];
          for (var k=0;k<task.assigs.length;k++){
            var ass=task.assigs[k];
            if (ass.resourceId!=res.id)
              newAss.push(ass);
          }
          task.assigs=newAss;
        }
      }
    }

    //loop on new rows
    var cnt=0
    resourceEditor.find("[resId=new]").each(function(){
      cnt++;
      var row = $(this);
      var name = row.find("input[name]").val();
      if (name && name!="")
        newRes.push (new Resource("tmp_"+new Date().getTime()+"_"+cnt,name));
    });

    ge.resources=newRes;

    closeBlackPopup();
    ge.redraw();
  });
  var ndo = createModalPopup(400, 500).append(resourceEditor);
};
function closedia(argument) {
  console.log(argument);
  document.getElementById(argument).style.display = "none";
}

function showdia(argument) {
  console.log(argument);
  document.getElementById(argument).style.display = "block";
}

function newfile() {
  console.log("newfile");
  var filename = document.getElementById("newfilename").value;
  angular.element(document.getElementById('mindx')).scope().newfile(filename);
}
function showfilelist() {
  document.getElementById('mindFileList').style.display = "block";
  console.log("open file list");
}
function closefilelist() {
    document.getElementById('mindFileList').style.display = "none";
    console.log("hide file list");
}

function changemode(){
  if (mode == 'mindx') {
    document.getElementById('gantt').style.display = "block";
    document.getElementById('mindx').style.display = "none";
    console.log("2 gannt");
    document.getElementById('importfile').style.display = "none";
    document.getElementById('newf').disabled = true;
    document.getElementById('openf').disabled = true;
    document.getElementById('downfile').disabled = true;
    document.getElementById('savesvg').disabled = true;

    mode = 'gannt';
    theme = minder.getTheme();
    template = minder.getTemplate();
    ge.reset();
    ge.loadProject(mx2gantt(window.minder.exportJson()));
    ge.checkpoint();
    $("#workSpace").css({width:$(window).width(),height:$(window).height()});
    ge.expandAll();
  }else{
    document.getElementById('gantt').style.display = "none";
    document.getElementById('mindx').style.display = "block";
    console.log("2 mindx");
    document.getElementById('importfile').style.display = "block";
    document.getElementById('newf').disabled = false;
    document.getElementById('openf').disabled = false;
    document.getElementById('downfile').disabled = false;
    document.getElementById('savesvg').disabled = false;
    minder.importJson(gantt2mx(ge.saveGantt()));
    minder.setTemplate(template);
    minder.setTheme(theme);
    mode = 'mindx';
  }
};
