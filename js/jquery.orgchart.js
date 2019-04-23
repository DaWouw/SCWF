/*jquery.orgChart
===============

jquery plugin for org chart, use a javascript array as input.
inspired by https://github.com/caprica/jquery-orgchart

[see a demo here](http://www.mit.edu/~wangyu/jquery.orgChart/example.html)
*/

HTMLTextAreaElement.prototype.setRealValue = function(val) {
	if (typeof this.realvalue !== 'undefined') {
		this.realvalue = val;
	} else {
		alert('ERROR @ HTMLTextAreaElement.prototype.setRealValue!');
	}
	this.value = val;
};
var orgChartCustomColorCodes = "";
(function($) {
	$.fn.orgChart = function(options) {
		var opts = $.extend({}, $.fn.orgChart.defaults, options);
		return new OrgChart($(this), opts);        
	}

	$.fn.orgChart.defaults = {
		data: [{id:1, name:'Root', parent: 0}],
		showControls: false,
		allowEdit: false,
		onAddNode: null,
		onDeleteNode: null,
		onToggleGuessbar: null,
		onForceRecalcNode: null,
		onClickNode: null,
		newNodeText: 'Add',
		delNodeText: 'Del'
	};

	function OrgChart($container, opts){
		var data = opts.data;
		var nodes = {};
		var rootNodes = [];
		this.opts = opts;
		this.$container = $container;
		var self = this;
		var selected = 1;

		this.draw = function(){
			if(rootNodes.length > 0 || this.getNrOfNodes() > 0) {	//DIMA
				//console.log('Redraw chart');
				$container.empty().append(rootNodes[0].render(opts));
				$container.find('.node').click(function(){
					if(self.opts.onClickNode !== null){
						self.opts.onClickNode(nodes[$(this).attr('node-id')]);
					}
					//WorkSpaceManager.loadIfCached();
				});
				$container.find('.node textarea').click(function(){
					if(self.opts.onClickNode !== null){
						self.opts.onClickNode(nodes[$(this).attr('node-id')]);
					}
					//WorkSpaceManager.loadIfCached();
				});

				if(opts.allowEdit){
					/*Failed attempt at making an onchange function
					$container.find('.node textarea').change(function(e){
						//alert('Reached it');
						//var a = self;
						self.opts.data[0].name = inputElement.val();
						//self.startEdit(thisId);
						//e.stopPropagation();
					});*/
					$container.find('.node textarea').click(function(e){
						var thisId = $(this).parent().attr('node-id');
						self.startEdit(thisId);
						WorkSpaceManager.loadIfCached();
						e.stopPropagation();
					});
					$container.find('.node textarea').on('select',function(e){
						var textarea = $(this).get(0);
						if(textarea.selectionStart != textarea.selectionEnd) {
							var selectedcount = textarea.selectionEnd-textarea.selectionStart;
							if(selectedcount < 0) 0-selectedcount;
							var selectedlengthindicator = $(this).parent().find('b[class=textarea-selected-length]').get(0);
							if(selectedlengthindicator) selectedlengthindicator.innerHTML = selectedcount+' / ';
						}
						e.stopPropagation();
					});
					
					/*$container.find('.node textarea').focus(function(e){
						var thisId = $(this).parent().attr('node-id');
						self.startEdit(thisId);
						e.stopPropagation();
					});*/
					$container.find('.node textarea').on('paste', function(e) {
						var pastedText = undefined;
						if (window.clipboardData && window.clipboardData.getData) { 	// IE
							pastedText = window.clipboardData.getData('Text');
						} else if (e.originalEvent && e.originalEvent.clipboardData) {	// Firefox & chrome
							pastedText = e.originalEvent.clipboardData.getData('text');
						} else if (e.clipboardData && e.clipboardData.getData) {		// Not jquery (so this doesn't make sense)
							pastedText = e.clipboardData.getData('text/plain');
						} else {
							alert('Your browser does not support pasting. Please drag and drop files and notify me.');
						}

						setTimeout(function() { //Yes, setTimeout with at least 0 is needed here for paste to populate the textarea
								if(/(\x0D\x0A)|[\x00-\x1F]|[\x80-\xFF]/.test(pastedText) && !/^[\x20-\x7E\s]+$/.test(pastedText)) {
									CURRENTSCRATCHPAD.setRealValue(pastedText);
								} else {
									CURRENTSCRATCHPAD.setRealValue(CURRENTSCRATCHPAD.value);
								}
								self.updateEditedSelected();
							}, 0);
					});
				}

				// add "add button" listener
				$container.find('.org-add-button').click(function(e){
					var thisId = $(this).closest('table').parent().attr('node-id');

					if(self.opts.onAddNode !== null){
						self.opts.onAddNode(nodes[thisId]);
					}
					else{
						self.newNode(thisId);
					}
					e.stopPropagation();
				});

				$container.find('.org-toggle-guessbar-button').click(function(e){
					var thisId = $(this).closest('table').parent().attr('node-id');

					if(self.opts.onToggleGuessbar !== null){
						self.opts.onToggleGuessbar(nodes[thisId]);
					}
					else{
						self.toggleGuessBarVisibility(thisId);
					}
					e.stopPropagation();
				});
				
				$container.find('.org-force-recalc-button').click(function(e){
					var thisId = $(this).closest('table').parent().attr('node-id');
					
					if(self.opts.onForceRecalcNode !== null){
						self.opts.onForceRecalcNode(nodes[thisId]);
					}
					else{
						self.forceRecalcNode(thisId);
					}
					e.stopPropagation();
				});
				$container.find('.org-copy-button').click(function(e){
					var thisId = $(this).closest('table').parent().children('textarea:first');

					if(self.opts.onCopyNode !== null){
						copyToClipboard(thisId[0]);
					}
					else{
						copyToClipboard(thisId[0]);
					}
					e.stopPropagation();
				});
				$container.find('.org-save-button').click(function(e){
					var nodediv = $(this).closest('table').parent();
					var textarea = nodediv.children('textarea:first');
					nodediv.append(FileDownload.getFileAsDownloadFrame(textarea[0].realvalue, 'currentscratchpad'));
					var filelink = nodediv.children('a:last');
					filelink[0].click();

					/*if(self.opts.onSaveNode !== null){
						copyToClipboard(thisId[0]);
					}
					else{
						copyToClipboard(thisId[0]);
					}*/
					e.stopPropagation();
				});

				$container.find('.org-del-button').click(function(e){
					var thisId = $(this).closest('table').parent().attr('node-id');

					if(self.opts.onDeleteNode !== null){
						self.opts.onDeleteNode(nodes[thisId]);
					}
					else{
						self.deleteNode(thisId);
					}
					//WorkSpaceManager.loadIfCached();
					e.stopPropagation();
				});
				$container.find('div[class=node-guesses] a').click(function(e){
					e.stopPropagation();
				});
				self.setSelected(selected);
			}
		}

		this.startEdit = function(id){
			inputElement = $container.find('div[class=node][node-id='+id+'] textarea');
			inputElement.focus();
			var ev = $._data( inputElement.get(0), 'events' );
			ev = (ev && ev.keyup)?true:false;
			if(ev)
				return;
			inputElement.keyup(function(event){			//Change this event into changed event??
				self.updateUserEdited(id);
			});
			/*inputElement.on('paste', function () {// Probably this is not needed because of keyup
				var pastedText = undefined;
				if (window.clipboardData && window.clipboardData.getData) { // IE
					pastedText = window.clipboardData.getData('Text');
				} else if (e.clipboardData && e.clipboardData.getData) {
					pastedText = e.clipboardData.getData('text/plain');
				}
				alert(pastedText);
				nodes[id].data.name = pastedText;
				CURRENTSCRATCHPAD.setRealValue(pastedText);
				setTimeout(function () {	//Yes, setTimeout with at least 0 is needed here for paste to populate the textarea
						nodes[id].data.name = inputElement.val();
					}, 0);
			});*/
			inputElement.blur(function(event){
				self.updateEdited(id);
			});
		}
		this.startEditCurrentNotepad = function(){
			self.startEdit(selected);
		}
		this.updateEdited = function(id){	//This function is only called from Javascript
			inputElement = $container.find('div[class=node][node-id='+id+'] textarea');
			nodes[id].data.name = inputElement[0].realvalue;
			inputElement[0].setRealValue(inputElement[0].realvalue);		//JustToBeSure
			
			if(/\x0D\x0A/.test(inputElement[0].realvalue) && !/^[\x20-\x7E\s]+$/.test(inputElement[0].realvalue)) {
				inputElement[0].readOnly = true;
				nodes[id].readonly = true;
				console.log('Binary input detected. This field will become readonly.');
			}

			var lengthElement = $container.find('div[class=node][node-id='+id+'] td[class="org-length-indicator"]');
			lengthElement[0].innerHTML = (inputElement[0].readOnly?'R/O ':'')+'|input| = <b class=\'textarea-selected-length\'></b>'+nodes[id].data.name.length;
			
		}
		this.updateUserEdited = function(id){	//This function is only called from Javascript
			inputElement = $container.find('div[class=node][node-id='+id+'] textarea');
			nodes[id].data.name = inputElement.val();				//Dima: Watch out!!!
			inputElement[0].setRealValue(inputElement.val());		//Dima: Watch out!!!

			if(/\x0D\x0A/.test(inputElement[0].realvalue) && !/^[\x20-\x7E\s]+$/.test(inputElement[0].realvalue)) {
				inputElement[0].readOnly = true;
				nodes[id].readonly = true;
				console.log('Binary input detected. This field will become readonly.');
			}

			var lengthElement = $container.find('div[class=node][node-id='+id+'] td[class="org-length-indicator"]');
			lengthElement[0].innerHTML = (inputElement[0].readOnly?'R/O ':'')+'|input| = <b class=\'textarea-selected-length\'></b>'+nodes[id].data.name.length;
			
		}
		this.updateEditedSelected = function(){
			self.updateEdited(selected);
		}
		this.updateUserEditedSelected = function(){
			self.updateUserEdited(selected);
		}

		this.newNode = function(parentId){
			var nextId = Object.keys(nodes).length;
			while(nextId in nodes){
				nextId++;
			}

			self.addNode({id: nextId, name: '', parent: parentId});
		}

		this.addNode = function(data){
			self.addNodeNoRedraw(data);
			self.draw();
			//self.startEdit(data.id);//Then also perform a updateSelected
		}
		this.addNodeNoRedraw = function(data){
			var newNode = new Node(data);
			nodes[data.id] = newNode;
			nodes[data.parent].addChild(newNode);
		}
		this.addMultiNodes = function(data){
			for(var i in data){
				self.addNodeNoRedraw(data[i]);
			}
			self.draw();
			//self.startEdit(data.id);
		}
		
		this.editNode = function(data){
			if(typeof data.name === "string")
				nodes[data.id].data.name = data.name;
			if(typeof data.description === "string")
				nodes[data.id].data.description = data.description;
			if(typeof data.style === "string")
				nodes[data.id].data.style = data.style;
			if(Object.prototype.toString.call(data.allguesses) === '[object Array]')
				nodes[data.id].data.allguesses = data.allguesses;

			self.draw();//is needed here
			//self.startEdit(data.id);
		}
		this.editNodeGuess = function(guesses, id){
			if(typeof id === 'undefined')
				id = selected;
			if(typeof guesses === 'undefined')
				guesses = '';
			var guessElement = $container.find('div[class=node-guesses][node-id='+id+']');
			guessElement[0].outerHTML = guesses;
		}
		this.editNodeStyle = function(style, id)
		{
			alert('editNodeStyle() conflicts with selected class. Do not use!!');
			if(typeof id === 'undefined')
				id = selected;
			nodes[selected].data.style = style+';'+(typeof nodes[selected].data.style !== 'undefined')?nodes[selected].data.style:'';
			self.draw();
		}
		
		this.deleteNodePrivateNoRedraw = function(id){
			while(nodes[id].children.length){//Delete all child notes
				self.deleteNode(nodes[id].children[0].data.id);
			}
			if(nodes[id].data.parent > 0){	 //If non root note is deleted
				nodes[nodes[id].data.parent].removeChild(id);
				if(id == selected) selected = nodes[id].data.parent;
				delete nodes[id];
			} else {						 //If root note is deleted, don't 'really' delete it, but clear it
				nodes[id].data.name='';
				delete nodes[id].data.description;
			}
		}
		this.deleteNode = function(id){
			self.deleteNodePrivateNoRedraw(id);
			self.draw();
		}
		
		this.toggleGuessBarVisibility = function(id)
		{
			var guessBarElement = $container.find('div[class=node-guesses][node-id='+id+']');
			guessBarElement[0].style.display = guessBarElement[0].style.display == 'none'?'block':'none';
		}
		this.forceRecalcNode = function(id){
			$container.find('div[class=node][node-id='+id+'] textarea').attr('_oldValue', '');	//Nice cheat to force recalc
			RECALCULATECURRENT = true;
		}

		this.getData = function(){
			var outData = [];
			for(var i in nodes){
				outData.push(nodes[i].data);
			}
			return outData;
		}
		this.getNrOfNodes = function(){
			var nrOfNodes = 0;
			for(var i in nodes){ nrOfNodes++ }
			return nrOfNodes;
		}
		this.getSelected = function(){
			return selected;//nodes[selected].data.id;
		}
		this.getSelectedNodeData = function(){
			return nodes[selected].data;
		}
		this.getSelectedNodeNrChildren = function(){
			return nodes[selected].children.length;
		}
		this.getFurthestSingleChildNodePath = function(){
			while(nodes[selected].children.length == 1){
				selected = nodes[selected].children[0].data.id;
			}
			return selected;
		}
		this.hasSelectedNodeChildren = function(){
			return nodes[selected].children.length > 0;
		}
		this.getSelectedNodeNrChildren = function(){
			return nodes[selected].children.length;
		}
		this.selectChild = function(parentid, childnr){
			if(childnr < nodes[parentid].children.length) {
				var nextChild = nodes[parentid].children[childnr].data.id;
				self.setSelected(nextChild);
				return nextChild;
			}
			return false;
		}
		
		this.getSelectedNodeTextArea = function(){
			var ret = $container.find('div[class=node][node-id='+selected+'] textarea');
			if(ret.length) return ret[0];
			alert('getSelectedNodeTextArea() Node not found:'+selected);
			return false;
		}
		this.setSelected = function(id){
			selected = id;
			
			for(var i in nodes){
				var elem = $('#orgChart').find('div[class=node][node-id='+nodes[i].data.id+']');
				if(elem.length) elem[0].style.border = 'none';
			}
			var elem = $('#orgChart').find('div[class=node][node-id='+id+']');
			if(elem.length) { 
				elem[0].style.border = '3px #01A0E4 outset';
				elem[0] = elem.find('textarea');
				if(elem.length) elem[0].focus();
				self.startEdit(selected);
			} else {
				alert("ERROR Could not find selected textarea.");
			}
		}

		// constructor
		for(var i in data){
			var node = new Node(data[i]);
			nodes[data[i].id] = node;
		}

		// generate parent child tree
		for(var i in nodes){
			if(nodes[i].data.parent == 0){
				rootNodes.push(nodes[i]);
			} else{
				nodes[nodes[i].data.parent].addChild(nodes[i]);
			}
		}

		// draw org chart
		$container.addClass('orgChart');
		self.draw();
	}

	function Node(data){
		this.data = data;
		this.children = [];
		this.readonly = false;
		var self = this;

		this.addChild = function(childNode){
			this.children.push(childNode);
		}

		this.removeChild = function(id){
			for(var i=0;i<self.children.length;i++){
				if(self.children[i].data.id == id){
					self.children.splice(i,1);
					return;
				}
			}
		}

		this.render = function(opts){
			var childLength = self.children.length;
			var nodeColspan = childLength>0?2*childLength:2;

			var jTable = $("<table cellpadding='0' cellspacing='0' border='0' />");

			jTable.append($("<tr />").append($("<td colspan='"+nodeColspan+"' />").append(self.formatNode(opts))));

			var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";

			if(childLength > 0) {
				jTable.append($("<tr class='lines'><td colspan='"+childLength*2+"'>"+downLineTable+'</td></tr>'));

				var linesCols = '';
				for(var i=0;i<childLength;i++){
					if(childLength==1){
						linesCols += "<td class='line left half'></td>";	// keep vertical lines aligned if there's only 1 child
					}
					else if(i==0){
						linesCols += "<td class='line left'></td>";    		// the first cell doesn't have a line in the top
					}
					else{
						linesCols += "<td class='line left top'></td>";
					}

					if(childLength==1){
						linesCols += "<td class='line right half'></td>";
					}
					else if(i==childLength-1){
						linesCols += "<td class='line right'></td>";
					}
					else{
						linesCols += "<td class='line right top'></td>";
					}
				}
				
				jTable.append($("<tr class='lines v'>"+linesCols+"</tr>"));

				var jRow = $("<tr />");
				for(var i in self.children){
					jRow.append($("<td colspan='2' />").append(self.children[i].render(opts)));
				}
				jTable.append(jRow);
			}
			
			return jTable;
		}

		this.formatNode = function(opts) {

			var nodediv = $('<div class="node" node-id="'+this.data.id+'" />');

			//var allguesses = this.addGuesses(this.data.id);
			//var allpwguess = this.addPasswordGuesses(this.data.id);
			
			if(typeof data.description !== 'undefined') {
				var guessString = (typeof data.guessType !== 'undefined')?" - "+self.data.guessType:'';
				nodediv.append('<p class="org-desc">'+self.data.description+""+guessString+'</p>');
			}
			
			if(typeof data.name !== 'undefined') {
				var styleString = (typeof self.data.style !== 'undefined')?self.data.style:'';
				var jtextArea = $('<textarea class="org-input '+styleString+'" style="white-space: pre-wrap;" node-id="'+this.data.id+'" placeholder="Paste something here or drag&amp;drop a file..." />'); 
				jtextArea.prop('realvalue', self.data.name);
				jtextArea.prop('value', self.data.name);
				jtextArea[0].setRealValue(self.data.name);
				if(/\x0D\x0A/.test(self.data.name)) {
					self.readonly = true;
					console.log('\tBinary input detected. This field will become readonly.');
				} if(self.readonly) jtextArea[0].readOnly = true;

				//var bytearr1 = ByteArray.stringToByteArray(self.data.name);
				nodediv.append(jtextArea);
			} else {
				alert('Unexpected state in orgchart.formatNode(): data.name is undefined...');
			}

			if(opts.showControls) {
				//nodediv.append("<div class='org-add-button'>"+opts.newNodeText+"</div><div class='org-force-recalc-button'></div><div class='org-length-indicator'>|input|="+self.data.name.length+"</div><div class='org-toggle-guessbar-button'>?</div><div class='org-copy-button'></div><div class='org-save-button'></div><div class='org-del-button'></div>");
				nodediv.append("<table class='equalwidth'><tr><td class='org-add-button'>"+opts.newNodeText+"</td><td class='org-force-recalc-button'></td><td class='org-length-indicator'>|input| = <b class='textarea-selected-length'></b>"+self.data.name.length+"</td><td class='org-toggle-guessbar-button'>?</td><td class='org-copy-button'></td><td class='org-save-button'></td><td class='org-del-button'>"+opts.delNodeText+"</td></tr></table>");
			}

			var retnodediv = $('<div/>');
			retnodediv.append(nodediv);
			retnodediv.append(Guesses.printEntireGuessBar(this.data.id));
			return retnodediv;
		}
	}

})(jQuery);

