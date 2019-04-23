

// Constructor
function WorkSpace(realvalue, htmlobjects, allgrades) {
	// always initialize all instance properties
	this.realvalue = realvalue;
	this.htmlobjects = htmlobjects;
	//this.html = html;
	this.allgrades = allgrades;
}
// class methods
WorkSpace.prototype.get = function() {
	return [this.realvalue, this.htmlobjects, this.allgrades];
};

var WorkSpaceManager = {

	workSpaces : [],
	currentWorkSpaceRealValue : '',

	save : function()
	{
		if(enable_workspace_cache && ! Test.active()){		//Do not enable caching during testing
			//Save workspace in struct using jQuery
			if(!WorkSpaceManager.findWorkSpace(CURRENTSCRATCHPAD.realvalue)) {
				Timer.start();
				this.workSpaces.push(WorkSpaceManager.getCurrentWorkspace());
				Timer.stop( 'WorkSpaceManager - saved WorkSpace to cache. '/*+CURRENTSCRATCHPAD.realvalue*/);
			}
			this.currentWorkSpaceRealValue = CURRENTSCRATCHPAD.realvalue;
		}
	},
	getCurrentWorkspace : function()
	{
		var htmlobjects = $('#WORKSPACE').children().clone(true, true);
		return new WorkSpace(CURRENTSCRATCHPAD.realvalue, htmlobjects, Teacher.getAllGrades());
	},
	findWorkSpace : function(realvalue)
	{
		for (var i = this.workSpaces.length - 1; i >= 0; i--) {
			if(this.workSpaces[i].realvalue == CURRENTSCRATCHPAD.realvalue) {
				return this.workSpaces[i];
			}
		}
		return false;
	},
	loadIfCached : function()
	{
		if(enable_workspace_cache && CURRENTSCRATCHPAD.realvalue != this.currentWorkSpaceRealValue && ! Test.active()) {			//If there is something that needs to be done AND not during testing
			var ws = WorkSpaceManager.findWorkSpace(CURRENTSCRATCHPAD.realvalue);
			if(ws) {
				Timer.start();
				WorkSpaceManager.loadThisWorkspace(ws);
				Timer.stop( 'WorkSpaceManager - loaded WorkSpace from cache.'/*+ws.realvalue */);
				return true;
			}
		}
		return false;
	},
	loadThisWorkspace : function(ws)
	{
		$('#WORKSPACE').empty().append(ws.htmlobjects.clone(true, true));	//Load workspace using jQuery
		//IsUnchangedVar = ws.IsUnchangedVar;
		//IsUnchangedVar.text = 1;
		Teacher.setAllGrades(ws.allgrades);
		IsUnchanged(CURRENTSCRATCHPAD);
		this.currentWorkSpaceRealValue = CURRENTSCRATCHPAD.realvalue;
		//console.log('\tWorkSpaceManager loaded WorkSpace from cache.'+ws.realvalue);
	},
	showCurrentCache : function()
	{
		for (var i = this.workSpaces.length - 1, ws; i >= 0; i--) {
			var win = window.open('', '', '');
			if(win) win.document.write('<table table cellpadding=0 cellspacing=0 border=0 width="100%"><thead><tr><th><br><br><br><br>'+this.workSpaces[i].realvalue+'</th></tr></thead>'+this.workSpaces[i].htmlobjects[0].outerHTML+'</table>');
		}
	},
	clear : function()
	{
		this.workSpaces = [];
	},
};