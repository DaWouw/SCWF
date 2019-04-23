//http://www.html5rocks.com/en/tutorials/file/dndfiles/

var FileUpload = {
	handleUpload : function(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		var uploadedfiles = evt.dataTransfer.files; // FileList Object
		//alert(uploadedfiles.length);

		for (var i = 0, f; f = uploadedfiles[i]; i++) {
			
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function() {
				return function(e) {
					var contents = e.target.result;
					if (/^(.\x00){10}/.test(contents)) {				//Make sure Windows wchar bits files get through all right
						contents = contents.replace(/([\s]|[^\s])\x00/g,'$1');
					} else if (/^(\x00.){10}/.test(contents)) {			//Make sure Windows wchar bits files get through all right
						contents = contents.replace(/\x00([\s]|[^\s]])/g,'$1');
					}
					//var bytearr2 = ByteArray.stringToByteArray(contents);
					
					if(CURRENTSCRATCHPAD.realvalue.length != 0 || Timer.iteration > 1 || uploadedfiles.length > 1 || ForceFlow.hasSelectedNodeChildren()) {				//Never delete current input (so make new step)
						ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(contents, 'FileUpload()')]);
						window.setTimeout('ForceFlow.selectFurthestSingleChildNodePath();', 50);	//In case multiple files are uploaded (no clue why someone would do that)
					} else {
						CURRENTSCRATCHPAD.setRealValue(contents);
						ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
					}
				};
			})(f);

			reader.readAsBinaryString(f);
		}
	},
	handleDragOver : function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	},
	handleDragEnter : function(evt) {
		$('#'+this.id).css({border: '0 solid #01A252'}).animate({
		        borderWidth: 4
		    }, 500).animate({
		        borderWidth: 0
		    }, 500);
	},
};

var FileDownload = {
	getFileExtention : function(rawfile) {
		//DIMA:ARRAY-ERROR//var fileextention, filememetype;[fileextention, filememetype] = FileDownload.getFileExtentionMemetype(rawfile);
		var fileoutputarr = FileDownload.getFileExtentionMemetype(rawfile);
		var fileextention = fileoutputarr[0], filememetype = fileoutputarr[1];
		return fileextention;
	},
	getFileExtentionMemetype : function(rawfile) {
		var fileextention = 'txt';
		var filememetype  = 'text/plain';
		var firstfourchars = rawfile.substr(0,4);
		switch(firstfourchars)
		{
			case "\x89PNG": 		fileextention = 'png'; filememetype = 'image/png'; break;
			case "\xff\xd8\xff\xe0":fileextention = 'jpg'; filememetype = 'image/jpeg'; break;
			case "7z\xbc\xaf":		fileextention = '7z';  filememetype = 'application/x-7z-compressed'; break;
			case "PK\x03\x04":		fileextention = 'zip'; filememetype = 'application/x-compressed'; break;
			case "GIF8":			fileextention = 'gif'; filememetype = 'image/gif'; break;
			case "%PDF":			fileextention = 'pdf'; filememetype = 'application/pdf'; break;
			default : /*alert("Unknown filetype:"+firstfourchars+' ~Downloading as txt.');*/ break;
		}
		return [fileextention, filememetype];
	},
	getFileHexString : function(rawfile) {
		//DIMA:ARRAY-ERROR//var fileextention, filememetype;[fileextention, filememetype] = FileDownload.getFileExtentionMemetype(rawfile.substr(0,4));
		var fileoutputarr = FileDownload.getFileExtentionMemetype(rawfile);
		var fileextention = fileoutputarr[0], filememetype = fileoutputarr[1];
		
		//http://cwestblog.com/2014/10/21/javascript-creating-a-downloadable-file-in-the-browser/
		//var bytearr = ByteArray.stringToByteArray(grade[2]);	//For debugging purposes

		var filehexstring = rawfile.length?('%'+ConvertBase.strToHex(rawfile).match(/(..?)/g).join('%')):'';
		return [filehexstring, fileextention, filememetype];
	},
	isImageFile : function(rawfile)
	{
		var firstfourchars = rawfile.substr(0,4);
		switch(firstfourchars) {
			case "\x89PNG":	case "\xff\xd8\xff\xe0": case "GIF8": return true;
		}
		return false
	},
	isImageExtention : function(fileextention)
	{
		switch(fileextention) {
			case "png":	case "jpg": case "gif": return true;
		}
		return false
	},
	getFileDataString : function(rawfile) {
		//DIMA:ARRAY-ERROR//var filehexstring, fileextention, filememetype;[filehexstring, fileextention, filememetype] = FileDownload.getFileHexString(rawfile);
		var fileoutputarr = FileDownload.getFileHexString(rawfile);
		var filehexstring = fileoutputarr[0], fileextention = fileoutputarr[1], filememetype = fileoutputarr[2];
		
		return ['data:'+filememetype+','+filehexstring, fileextention];
	},
	getFileAsDownloadlink : function(rawfile, filename) {
		var d = new Date();
		//DIMA:ARRAY-ERROR//var filedatastr, fileextention;[filedatastr, fileextention] = FileDownload.getFileDataString(rawfile);
		var fileoutputarr = FileDownload.getFileDataString(rawfile);
		var filedatastr = fileoutputarr[0], fileextention = fileoutputarr[1];
		var filename = 'ctf_'+filename+'_'+d.getTime().toString().slice(0,-3)+'.'+fileextention;
		return '<a href="'+ filedatastr+'" download="'+filename+'" class="save">Download '+fileextention+' file</a>';
	},
	getFileAsDownloadFrame : function(rawfile, filename) {
		var d = new Date();
		//DIMA:ARRAY-ERROR//var filedatastr, fileextention;[filedatastr, fileextention] = FileDownload.getFileDataString(rawfile);
		var fileoutputarr = FileDownload.getFileDataString(rawfile);
		var filedatastr = fileoutputarr[0], fileextention = fileoutputarr[1];
		var filename = 'ctf_'+filename+'_'+d.getTime().toString().slice(0,-3)+'.'+fileextention;
		return '<a href="'+ filedatastr+'" download="'+filename+'" onload="this.click();"></a>';
	},
	getFileAsImage : function(rawfile) {
		//DIMA:ARRAY-ERROR//var filedatastr, fileextention;[filedatastr, fileextention] = FileDownload.getFileDataString(rawfile);
		var fileoutputarr = FileDownload.getFileDataString(rawfile);
		var filedatastr = fileoutputarr[0], fileextention = fileoutputarr[1];
		if(FileDownload.isImageExtention(fileextention)) {
			return '<img src="'+ filedatastr+'" />';
		} else {
			return false;
		}
	},
	checkGetTrailingFile : function(rawfile) {
		var fileextention = FileDownload.getFileExtention(rawfile.substr(0,4));
		switch(fileextention) {
			case 'jpg':
				if(rawfile.slice(-2) != "\xFF\xD9") {
					var appendedfile = rawfile.match(/^\xff\xd8\xff\xe0(?:[\s]|[^\s])+\xFF\xD9((?:[\s]|[^\s])+)$/i);
					return appendedfile;
				}
				break;
			case 'gif':
				//var a = rawfile.slice(-13);	//\x00\x51\xFC\x1B\x28\x70\xA0\xC1\x83\x01\x01\x00\x3B
				if(rawfile.slice(-2) != "\x00\x3B") {
					var appendedfile = rawfile.match(/^GIF8(?:[\s]|[^\s])+\x00\x3B((?:[\s]|[^\s])+)$/i);
					if(appendedfile.length >= 2)
						return appendedfile[1];
				}
				break;
			case 'png':
				if(rawfile.slice(-8) != "\x49\x45\x4e\x44\xae\x42\x60\x82") {
					var appendedfile = rawfile.match(/^\x89PNG(?:[\s]|[^\s])+\x49\x45\x4e\x44\xae\x42\x60\x82((?:[\s]|[^\s])+)$/i);
					if(appendedfile.length >= 2)
						return appendedfile[1];
				}
				break;
		}
		return false;
	},
};


$(document).ready(function(){
	// Initialisiere Drag&Drop EventListener
	var dropZone = document.getElementById('orgChartContainer');
	dropZone.addEventListener('dragover', FileUpload.handleDragOver, false);
	dropZone.addEventListener('dragenter', FileUpload.handleDragEnter, false);
	dropZone.addEventListener('drop', FileUpload.handleUpload, false);
});

