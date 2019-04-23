
var empty_init_node = [
	{id: 1, name: '', parent: 0}
];


var ForceFlow = {
	//http://www.jqueryscript.net/chart-graph/Create-An-Editable-Organization-Chart-with-jQuery-orgChart-Plugin.html
	
	draw : function(keepoldvalue) { //Always execute ForceFlow.updateSelectedTextArea(); after a redraw $(function(){org_chart.draw();});
		$(function(){org_chart.draw(keepoldvalue);});
		ForceFlow.updateSelectedTextArea();
	},
	
	//Steps
	addStep : function(grade) {
		$(function(){org_chart.addNode({id: grade.random, name: grade.value, description: grade.cipher, parent: org_chart.getSelected()});});
	},
	addStepP : function(grade, parentid) {
		$(function(){org_chart.addNode({id: grade.random, name: grade.value, description: grade.cipher, parent: parentid?parentid:org_chart.getSelected()});});
	},
	addStepNoRedraw : function(grade) {
		$(function(){org_chart.addNodeNoRedraw({id: grade.random, name: grade.value, description: grade.cipher, parent: org_chart.getSelected()});});
	},
	addStepNoRedrawP : function(grade, parentid) {
		$(function(){org_chart.addNodeNoRedraw({id: grade.random, name: grade.value, description: grade.cipher, parent: parentid?parentid:org_chart.getSelected()});});
	},
	addStepAndGo : function(grade) {
		$(function(){
			ForceFlow.addStep(grade);
			ForceFlow.setSelected(grade.random);
			ForceFlow.updateSelectedTextArea();
			$(window).scroll();//.trigger("scroll")	//Trigger scroll event for if a new childNode has appeared and selected
		});
	},
	addSteps : function(grades) {	
		$(function(){
			if(grades && $.isArray(grades)) {
				for(var i = 0; i < grades.length; i++){
					ForceFlow.addStepNoRedrawP(grades[i], (i?grades[i-1].random:false));
				}
				ForceFlow.draw();
			} else if(grades) {
				alert('addSteps() reached single object no array condition, it\'s ok.');
				ForceFlow.addStepNoRedraw(grades);
				ForceFlow.draw();
			}
		});
	},
	addGuessStep : function(grade, certainty, guessType) {
		$(function(){org_chart.addNode({id: grade.random, name: grade.value, description: grade.cipher, style: "certainty"+certainty, guessType:guessType, parent: org_chart.getSelected()});});
	},
	addGuessStepNoRedraw : function(grade, certainty, guessType) {
		$(function(){org_chart.addNodeNoRedraw({id: grade.random, name: grade.value, description: grade.cipher, style: "certainty"+certainty, guessType:guessType, parent: org_chart.getSelected()});});
	},
	
	clear : function() {
		$(function(){org_chart.deleteNode(1);});
	},
	
	//Select
	setSelected : function(id) {
		$(function(){org_chart.setSelected(id);});
	},
	selectFurthestSingleChildNodePath : function() {
		$(function(){ForceFlow.setSelected(org_chart.getFurthestSingleChildNodePath());});
		ForceFlow.updateSelectedTextArea();
		$(window).scroll();//.trigger("scroll")	//Trigger scroll event for if a new childNode has appeared and selected
	},
	hasSelectedNodeChildren : function() {
		var ret = false;
		$(function(){ret = org_chart.hasSelectedNodeChildren();});
		return ret;
	},
	selectChild : function(parentid, childnr) {
		var ret = false;
		$(function(){ret = org_chart.selectChild(parentid, childnr);});
		if(ret){
			$(function(){ForceFlow.setSelected(ret);});
			ForceFlow.updateSelectedTextArea();
			$(window).scroll();//.trigger("scroll")	//Trigger scroll event for if a new childNode has appeared and selected
		}
		return ret;
	},
	getSelectedNodeNrChildren : function() {
		var ret = 0;
		$(function(){ret = org_chart.getSelectedNodeNrChildren();});
		return ret;
	},
	updateSelectedTextArea : function() {
		$(function(){CURRENTSCRATCHPAD = org_chart.getSelectedNodeTextArea();});
	},
	getNodeIdFromElement : function(element){
		//return element.attr('node-id');	//DIMA:TestByDima
		for(var i = 0; i < element.attributes.length; i++){
			if(element.attributes[i].name == 'node-id')
				return element.attributes[i].value;
		}
		return false;
	},
	updateGuesses : function(guesses, id){
		$(function(){org_chart.editNodeGuess(guesses, id);});
	},
	getCurrentNodeId : function(){	//TODO: Check if I can use another function for this. one that's faster.
		var id = 0;
		$(function(){id = org_chart.getSelected();});
		return id;
	},
	updateEditedNode : function(element){
		$(function(){org_chart.updateEdited(ForceFlow.getNodeIdFromElement(element));});
	},
	/*setNodeValue : function(element, value){
		$(function(){org_chart.setNodeValue(element, value);});
	},*/
	editNodeStyle : function(style){
		$(function(){org_chart.editNodeStyle(style);});
	}
	
};

$(function(){
	org_chart = $('#orgChart').orgChart({
		data: empty_init_node,
		showControls: true,
		allowEdit: true,
		onAddNode: function(node){ 
			log('Created new node on node '+node.data.id);
			org_chart.newNode(node.data.id);
		},
		onDeleteNode: function(node){
			log('Deleted node '+node.data.id);
			org_chart.deleteNode(node.data.id);
			ForceFlow.updateSelectedTextArea();
			WorkSpaceManager.loadIfCached();
		},
		onClickNode: function(node){
			log('Clicked node '+node.data.id);
			org_chart.setSelected(node.data.id);
			ForceFlow.updateSelectedTextArea();
			WorkSpaceManager.loadIfCached();
		},
		onToggleGuessbar: function(node){
			log('ToggleGuessbar '+node.data.id);
			org_chart.toggleGuessBarVisibility(node.data.id); 
		},
	});
});

if(! (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) )	//Disable scroll effect for Internet Explorer
{
	$(window).scroll(function(){
		if(typeof org_chart !== "undefined")
		{
			//if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
			//	return;
			
			//var a = 200;//document.getElementById('top');//$('div[top=top]');//112;
			var pos = $(window).scrollTop();
			var ptop = $( "div[id=top]" );
			if(pos > Math.floor(ptop.offset().top)+50) {
				$('div[node-id='+org_chart.getSelected()+'] textarea').css({
							position: 'fixed',
							top: (82+document.getElementById('orgChartContainer').style.paddingTop.slice(0,-2)*1)+'px',
							margin: '0 0 0 -335px',
							border: '3px #01A0E4 outset'
						});
			} else {
				$('div[node-id='+org_chart.getSelected()+'] textarea').css({
							position: 'initial',
							top: '0',
							margin: '0',
							border: '1px #A9A9A9 solid'
						});
			}
		}
	});
}


function log(text){	//Don't delete, it is still used.
	//$('#consoleOutput').append('<p>'+text+'</p>')
}

