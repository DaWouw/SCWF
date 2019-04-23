//All words are in UserSettings.js
var words_sp = ["string", "function", "select","delete","insert"," union "," from "," join "];	//Programming keywords

//https://www.englishclub.com/vocabulary/common-words-5000.htm  Search: \r\n[^\r\n]{1,3}\r\n	Replace:\r\n		Added: ctf, flag, pair, nine, zero, done, ascii, hello, error, crack, switch, sample, defence, reverse, replace, obvious, complete, bracket. Removed: success (to special)
var words_lo = ["administration","environmental","international","particularly","organization","relationship","institution","traditional","environment","significant","performance","opportunity","development","information","throughout","individual","conference","production","particular","management","democratic",
				"television","individual","population","Republican","technology","especially","difference","themselves","experience","everything","understand","government","beautiful","challenge","necessary","candidate","structure","interview","direction","statement","establish","religious","executive","knowledge",
				"authority","financial","operation","professor","everybody","character","recognize","determine","treatment","represent","certainly","condition","available","difficult","attention","situation","according","sometimes","including","education","president","community","political","important","different",
				"something","property","shoulder","specific","discover","suddenly","politics","cultural","employee","maintain","yourself","Democrat","strategy","analysis","standard","physical","election","training","indicate","whatever","identify","resource","pressure","approach","response","language","movement","recently",
				"behavior","security","increase","thousand","hospital","material","campaign","Congress","daughter","evidence","computer","personal","describe","practice","industry","American","activity","everyone","official","position","director","building","decision","military","possible","economic","interest","probably","complete",
				"actually","consider","remember","although","research","anything","together","continue","business","national","question","American","improve","instead","trouble","mention","evening","perform","measure","control","contain","popular","respond","tonight","imagine","science","network","manager","various","obvious",
				"example","discuss","clearly","station","compare","section","present","forward","benefit","outside","message","feeling","general","herself","ability","system","disease","prepare","meeting","quality","thought","serious","protect","exactly","central","despite","article","usually","similar","concern",
				"natural","foreign","quickly","private","officer","subject","defense","defence","involve","current","medical","economy","husband","hundred","realize","brother","billion","culture","century","support","certain","patient","product","picture","produce","project","support","special","because","society","receive",
				"federal","develop","explain","finally","require","perhaps","control","suggest","someone","college","process","teacher","himself","morning","history","already","whether","nothing","several","include","however","service","provide","million","without","believe","program","company","against","problem","bracket",
				"country","student","another","between","through","because","reverse","replace","method","detail","middle","writer","rather","inside","affect","weight","camera","manage","weapon","reveal","charge","impact","theory","finish","spring","expert","memory","remove","forget","enough","design","entire","rather","public","indeed",
				"little","design","sister","answer","lawyer","arrive","pretty","region","attack","wonder","degree","growth","amount","answer","accept","simple","beyond","career","artist","decade","factor","animal","series","common","before","reduce","nature","agency","author","second","myself","anyone","future","church",
				"single","choice","letter","likely","summer","course","period","energy","chance","listen","window","choose","nearly","source","simply","worker","doctor","recent","either","itself","street","figure","couple","center","matter","ground","record","player","season","action","better","report","return","police",
				"leader","strong","decide","effort","better","report","former","little","effect","remain","behind","course","nation","expect","market","appear","policy","toward","second","across","enough","moment","before","reason","change","result","within","person","health","office","others","create","parent",
				"around","follow","social","minute","change","almost","member","father","friend","around","little","though","mother","before","happen","always","number","during","family","really","become","school","should","people","switch","sample"];
var words_me = ["stuff","dream","range","worry","adult","style","treat","chair","shake","apply","peace","close","avoid","visit","radio","trial","above","green","final","legal","enjoy","sound","close","claim","since","prove","study","guess","laugh","check","truth","force","state","stage","crime","skill","glass","trade",
				"staff","argue","ready","media","occur","happy","eight","stock","scene","seven","shoot","other","share","enter","sound","store","color","blood","focus","order","throw","fight","board","sport","wrong","close","floor","south","place","short","plant","point","cause","catch","third","north","movie","piece","clear",
				"quite","cover","phone","image","teach","court","table","whose","event","space","paper","agree","early","model","value","thank","break","drive","carry","price","whole","voice","light","heart","along","major","field","raise","class","local","reach","death","build","sense","serve","human","music","maybe","offer",
				"force","early","party","spend","allow","level","speak","watch","right","learn","least","white","later","stand","among","often","power","until","since","after","house","black","issue","study","right","month","young","story","money","write","water","under","large","bring","today","point","night","small","right",
				"where","again","place","about","might","start","every","where","begin","group","great","while","leave","never","state","three","still","world","after","there","child","woman","those","thing","first","these","other","could","which","think","there","about","would","their","hello","crack","error","ascii","token",
				"edge","past","deep","best","unit","trip","fish","wide","play","pain","base","head","onto","talk","ball","huge","care","firm","that","nice","cell","seat","card","main","form","cold","help","note","rock","hang","dark","song","blue","sort","miss","name","fail","bill","deal","loss","left","hard","list","sign",
				"fund","size","thus","away","save","east","rise","dead","each","race","poor","than","page","near","fine","note","push","upon","plan","drop","fill","goal","past","deal","rest","seek","west","bank","fire","risk","call","well","rule","term","less","soon","look","hair","tree","film","draw","type","baby","step",
				"open","love","test","news","wall","land","data","face","cost","easy","half","need","star","base","site","form","wear","pick","join","full","true","road","town","view","even","hope","less","free","pull","mind","wife","show","drug","rate","role","sell","pass","else","hard","late","care","yeah","kill","plan",
				"fall","stay","home","send","wait","love","able","foot","both","food","girl","walk","open","grow","such","sure","door","read","face","stop","only","back","lead","body","idea","best","team","real","once","five","nine","name","much","city","meet","lose","ever","line","game","hour","away","long","both","long","head",
				"four","kind","side","word","book","fact","area","room","home","must","next","hold","live","like","move","play","work","hear","each","week","most","case","such","over","part","hand","turn","have","help","seem","same","keep","mean","much","most","high","when","feel","need","last","over","call","fear","done",
				"down","work","life","good","back","even","very","tell","only","well","many","give","here","find","more","also","look","want","more","then","like","than","come","your","just","into","take","some","them","when","year","time","will","know","make","what","that","from","they","this","with","that","flag","pair","zero"];
var words_sh = ["the","and","for","you","say","but","his","not","she","can","who","get","her","all","one","out","see","him","now","how","its","our","two","way","new","day","use","man","one","her","any","may","try","ask","too","own","out","put","old","why","let","big","few","run","off","all","lot","eye","job","far","yes","sit","ctf",
				"yet","end","bad","pay","law","car","set","kid","ago","add","art","war","low","win","guy","air","boy","age","off","buy","die","cut","six","use","son","arm","tax","end","hit","eat","oil","red","per","top","bed","hot","lie","dog","cup","box","lay","sex","one","act","ten","gun","leg","set","fly","bit","top","far","sea","bar","are"];

words_sp = words_sp.concat(output_analysis_dictionary);


var Teacher = {
	UPPER_GRADE_INT_LIMIT : 100000000,
	allgrades : [],

	weight_fi : 3133700,//file detection weight. Files contain few keywords and would otherwise not hit if found.
	weight_fg : 13370,	//flag{xxx} weight. If xxx is long, the hit would otherwise not trigger
	weight_sp : 5,
	weight_lo : 6,
	weight_me : 3,
	weight_sh : 1,
	grade_treshold : 3,	//if grade >= val then save grade
	hit_treshold : 2,	//if highest grade >= dynamicval (2+(|input|*(1/7))) then indicate hit 
	hit_incpoints : 1,
	hit_incrate : 7,

	showNoLuckDelay : -1,
	hideForever : false,

	regex_sp : eval("new RegExp(\"("+words_sp.join('|')+")(?![^<]*>|[^<>]*</)\",\"gi\");"),
	regex_lo : eval("new RegExp(\"("+words_lo.join('|')+")(?![^<]*>|[^<>]*</)\",\"gi\");"),
	regex_me : eval("new RegExp(\"("+words_me.join('|')+")(?![^<]*>|[^<>]*</)\",\"gi\");"),
	regex_sh : eval("new RegExp(\"("+words_sh.join('|')+")(?![^<]*>|[^<>]*</)\",\"gi\");"),

	getAllGrades : function()
	{
		return this.allgrades;
	},
	setAllGrades : function(grades)
	{
		this.allgrades = grades;
	},

	preventXSS : function(text)
	{
		return (text||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},

	markText : function(text)
	{
		var markedtext = this.preventXSS(text);
		if(text.length > 15) markedtext = markedtext.replace(REGEX_FILE_TYPES, '<mark class="fi">$&</mark>');
		if(text.length > 15) markedtext = markedtext.replace(REGEX_FLAG_DETECTION, '<mark class="fg">$&</mark>');
		markedtext = markedtext.replace(this.regex_sp, '<mark class="sp">$&</mark>');
		markedtext = markedtext.replace(this.regex_lo, '<mark class="lo">$&</mark>');
		markedtext = markedtext.replace(this.regex_me, '<mark class="me">$&</mark>');
		markedtext = markedtext.replace(this.regex_sh, '<mark>$&</mark>');
		//eval("markedtext = markedtext.replace(new RegExp(\"("+words_sh.join('|')+")(?![^<]*>|[^<>]*</)\",\"gi\"), '<mark>$&</mark>');");
		return markedtext;
	},

	analyzeValueDoNotSaveGrade : function(text, cipher) {
		var markedtext = this.markText(text);
		cipher = (typeof cipher == "undefined")? '' : ((cipher[0]=='.'?'':'.')+cipher);
		return this.makeGrade(0, this.calcGrade(markedtext), text, markedtext, 'input'+cipher);
	},
	analyzeValueSaveReturnGrade : function(text, cipher) {
		var markedtext = this.markText(text);
		cipher = (typeof cipher == "undefined")? '' : ((cipher[0]=='.'?'':'.')+cipher);
		return this.saveGrade(this.calcGrade(markedtext), text, markedtext, 'input'+cipher);
	},

	analyzeValue : function(text, cipher) {
		if(typeof text !== "string") return null;
		//alert(typeof text);
		if(text.match(/^<i class="error">([^\s]|[\s])*<\/i>$/gi)) return text;
		if(typeof cipher === "undefined") cipher = '';
		var markthistext = enable_reverse_output?[[text,cipher], [T_ReverseText(text),cipher+'.reverse()']]:[[text,cipher]];
		var grade;

		for (var i = 0; i < markthistext.length; i++) {
			grade = this.analyzeValueSaveReturnGrade(markthistext[i][0], markthistext[i][1]);
			markthistext[i][0] = this.createGradeLeftAnchor(grade)+grade.markedvalue+this.createGradeRightAnchor(grade);
		}
		return markthistext[0][0]+(enable_reverse_output?"<hr>\n"+markthistext[1][0]:'');
	},
	analyzeDownloadValue : function(text, cipher) {
		if(typeof text !== "string") return null;
		if(text.match(/^<i class="error">.*<\/i>$/gi)) return text;
		if(typeof cipher === "undefined") cipher = '';
		var grade = this.analyzeValueSaveReturnGrade(text, cipher);
		return this.createGradeLeftAnchor(grade)+this.createGradeRightAnchor(grade);
	},
	analyzeField : function(fieldname, cipher) {
		document.getElementById(fieldname).innerHTML = this.analyzeValue(document.getElementById(fieldname).innerHTML, cipher);
	},
	
	clearAllGrades : function()
	{
		this.allgrades = [];
	},
	
	calcGrade : function(text)
	{
		if(!text) return 0;
		var matches, grade = 0;
		matches = text.match(/<mark class="fg">/g);
		if(matches) grade += matches.length * this.weight_fg;
		matches = text.match(/^<mark class="fi">/);
		if(matches) grade += matches.length * this.weight_fi;
		matches = text.match(/<mark class="sp">/g);
		if(matches) grade += matches.length * this.weight_sp;
		matches = text.match(/<mark class="lo">/g);
		if(matches) grade += matches.length * this.weight_lo;
		matches = text.match(/<mark class="me">/g);
		if(matches) grade += matches.length * this.weight_me;
		matches = text.match(/<mark>/g);
		if(matches) grade += matches.length * this.weight_sh;
		return grade;
	},
	
	//TODO: let saveGrade return the whole grade object, then use that object to createGradeRightAnchor with a reference to it. 
	makeGrade : function(id, grade, value, markedvalue, cipher)	//id can be null
	{
		if((grade >= this.grade_treshold) || value.length > 3){	//DIMA:Bug-nosave - this condition = false seems to be the bug-factor here //Later-note: perform this check at saveGrade??
			var r = Math.floor((Math.random() * this.UPPER_GRADE_INT_LIMIT) + 2);	//Random number between 2 and 100 million
			return new Grade(id, r, grade, value, markedvalue, cipher);//[r, grade, value, markedvalue, cipher];
		}
		return false;
	},
	saveGrade : function(grade, value, markedvalue, cipher)
	{
		var t, id = Teacher.allgrades.length;
		if(t = this.makeGrade(id, grade, value, markedvalue, cipher)) {
			Teacher.allgrades[id] = t;
			return Teacher.allgrades[id];
		}
		return false;
	},
	createGradeLeftAnchor : function(grade)
	{
		return '<span'+(grade?(' id="'+grade.random+'box" name="'+grade.random+'box">'):'>');
	},
	createGradeRightAnchor : function(grade)
	{										//http://www.psdgraphics.com/buttons/up-down-left-and-right-arrows-blue-web-icons/
		return (grade?'<a class="an" name="'+grade.random+'" id="'+grade.random+'">&nbsp;</a><a href="#" onclick="javascript:ForceFlow.addStepAndGo(Teacher.allgrades['+grade.id+']); $(\'html, body\').animate({scrollTop:0},300);" style="float:right"><img src="media/arrow2.png" width="16" height="16"></a>':'')+'</span>';
	},

	getHighestGrade : function(remove)
	{
		return this.getHighestGradeFromSet(this.allgrades, remove);
	},

	getHighestGradeFromSet : function(gradesset, remove)
	{
		var highestGrade = [0,0,'','',''];
		var highestGradeIndex = -1;
		for(var i = 0; i < gradesset.length; i++) {
			if(gradesset[i].grade>highestGrade[1]) {
				highestGrade = [gradesset[i].random, gradesset[i].grade, gradesset[i].value, gradesset[i].markedvalue, gradesset[i].cipher];
				highestGradeIndex = i;
			}
		}
		if(remove && highestGradeIndex > -1) gradesset.splice(highestGradeIndex, 1);
		return highestGrade;
	},

	isHit : function(highestGrade)
	{
		return (highestGrade[1]>=(this.hit_treshold+(this.hit_incpoints*(highestGrade[2].length/this.hit_incrate))));
	},

	updateHitBox : function()
	{
		//var hitbox = document.getElementById("hitBox");
		var hitbox = $('#hitBox').empty();
		if(!CURRENTSCRATCHPAD.realvalue) {
			hitbox.append($("<option></option>")
					.attr("value", 'top')
					.text(' '));
			return;
		}

		var allgradesCopy = Teacher.allgrades.slice(0);	//Basically, the slice() operation clones the array and returns the reference to the new array
		var highestGrade = this.getHighestGradeFromSet(allgradesCopy, true);	//Get and remove highest grade from the copyset
		
		var isHit, oneOrMoreHits = false;
		for (var i = 0; highestGrade && highestGrade[1] && i < (oneOrMoreHits?10:5); i++) {
			oneOrMoreHits |= (isHit = this.isHit(highestGrade));
			hitbox.append($("<option></option>")
				.attr("value", ''+highestGrade[0])
				.css("background-color",isHit?'#17EB42':'white')
				.text((isHit?'Hit':'Low')+' : '+highestGrade[1]+(!isHit?' < '+parseFloat(this.hit_treshold+(this.hit_incpoints*(highestGrade[2].length/this.hit_incrate))).toFixed(1):'')+' @ '+highestGrade[4]));
			
			highestGrade = this.getHighestGradeFromSet(allgradesCopy, true);
		}
		if (oneOrMoreHits) {
			this.hideNoLuck();
			hitbox[0].style.backgroundColor = '#17EB42';
			//ForceFlow.editNodeStyle('hitflag');	//Flag icon removed temp
		} else {
			hitbox[0].style.backgroundColor = 'white';
			if(!this.hideForever && this.showNoLuckDelay++>0) this.showNoLuck(false);
			//ForceFlow.editNodeStyle('');//I should do this in theory but it doesn't work in practice
		}
	},
	selectNextOption : function(element)
	{
		var e = $(element+' > option:selected');
		if(e) {
			if( !e.attr('selected') ) {		//To ensure the first element is shown
				e.attr("selected", 'selected').prop("selected", true);
			} else {
				e.removeAttr('selected').prop("selected", false).next().attr("selected", 'selected').prop("selected", true);
			}
			e[0].parentNode.click();
		}
	},

	scrollToName : function(name)
	{
		var t = $(name);
		if(t&&t.length) $('html,body').animate({ scrollTop: t.offset().top}, 200);
	},

	playAnnoyingSound : function()
	{
		var highestGrade = this.getHighestGrade(false);
		if(this.isHit(highestGrade))
		{
			if(annoying_audio) {
				var audio = new Audio(audio_path);	//Defined in usersettings
				audio.play();
			}
		}
	},
	
	updateHitValueBox : function()
	{
		var highestGrade = this.getHighestGrade(false);
		var updateHitValueBox = document.getElementById("hitValueBox");
		if(this.isHit(highestGrade))
		{
			updateHitValueBox.style.display = 'block';
			updateHitValueBox.style.visibility = 'visible';
			updateHitValueBox.innerHTML = highestGrade[3]+"<br>\r\n"+highestGrade[4];

			this.analyzeHitValue(highestGrade);
		}
		else
		{
			updateHitValueBox.style.display = 'none';
			updateHitValueBox.style.visibility = 'hidden';
			updateHitValueBox.innerHTML = '';
		}
		var orgChart = document.getElementById('orgChartContainer');
		orgChart.style.paddingTop = updateHitValueBox.clientHeight+"px";
	},

	analyzeHitValue : function(grade)
	{
		if(grade[3].match(/^<mark class="fi">/)) {
			var t, updateHitValueBox = document.getElementById("hitValueBox");
			//var bytearr = ByteArray.stringToByteArray(grade[2]);	//Debugging purposes
			updateHitValueBox.innerHTML = '<p><i>'+FileDownload.getFileAsDownloadlink(grade[2], grade[4])+((t = FileDownload.getFileAsImage(grade[2]))?'<br>'+t:'')+'</i></p>'+updateHitValueBox.innerHTML;
			if(t = FileDownload.checkGetTrailingFile(grade[2])) {
				updateHitValueBox.innerHTML = '<p>Trailing file:<i>'+FileDownload.getFileAsDownloadlink(t, grade[4])+/*Teacher.analyzeDownloadValue(t,'TrailingFile')+*/'</i></p>'+updateHitValueBox.innerHTML;
				//alert(t.length+" trailing bytes");
			}
		} else if(/<mark class="fg">/.test(grade[3])) {
			var flagstring = grade[2];
			if(!/^("ctf|t0k3n|flag)(\(|\{)[^\)\}]{32}(\)|\})$/i.test(flagstring))
			{
				if(confirm("The flag looks like it can be decoded one more step. Continue decoding it? You might need to include the flag{xxx} part after decoding when submitting.)")) {
					Guesses.analyzeGuessAndGradeValue([flagstring.replace(/^.{1,5}(\{|\()|(\}|\)).{0,4}$/g,''), CertaintyEnum.GUESS], 'decode_flag_itself()');
					Guesses.drawGuesses();
					ForceFlow.selectFurthestSingleChildNodePath();
				}
			}
		} else if(/(f|ht)tps?\:\/\/[^\s\"]{2,30}\.[a-z0-9]{2,5}(\/[^\,\"\s]{0,30}|(\/|))/gi.test(grade[2])) {		//URL
			var updateHitValueBox = document.getElementById("hitValueBox");
			var url = grade[2].match(/((f|ht)tps?\:\/\/[^\s\"]{2,30}\.[a-z0-9]{2,5}(\/[^\,\"\s]{0,30}|(\/|)))/gi);
			updateHitValueBox.innerHTML = '<p><i>Link found: <a href="'+url[0]+'" target="_blank" class="extern">Click here to open </a></i></p>'+updateHitValueBox.innerHTML;
		} else if(/(([0-2][0-9]{2}|[0-9]{1,2})\.){3}([0-2][0-9]{2}|[0-9]{1,2})(\:[0-9]{2,5})?/.test(grade[2])) {	//IP address
			var updateHitValueBox = document.getElementById("hitValueBox");
			var url = grade[2].match(/(([0-2][0-9]{2}|[0-9]{1,2})\.){3}([0-2][0-9]{2}|[0-9]{1,2})(\:[0-9]{2,5})?/);	//TODO, if the url part is prepended with http or https, keep that...
			if(url.length == 5) {
				switch(url[4]) {
					case ":80": case ":8080": url[0] = 'http://'+url[0]; break;
					case ":443":case ":8443": url[0] = 'https://'+url[0]; break;
					case ":20": case ":21":  url[0] = 'ftp://'+url[0]; break;
					case ":990": url[0] = 'ftps://'+url[0]; break;
					case ":22": url[0] = 'ssh://'+url[0]; break;
					default: url[0] = '//'+url[0]; break;
				}
			} else {
				url[0] = '//'+url[0];
			}
			updateHitValueBox.innerHTML = '<p><i>Link found: <a href="'+url[0]+'" target="_blank" class="extern">Click here to open </a></i></p>'+updateHitValueBox.innerHTML;
		}
	},

	clearAllAnswers : function(){
		if( ! Test.active() ) {				//not during testmode
			Timer.start();
			$("span.outputbox").empty();	//Same as used in Test.runNextTestCase().
			FREQUENCY_ASCII_clear_heatmap();
			Timer.stop("Teacher.clearAllAnswers");
		}
	},

	showCalculating : function(visible){
		document.getElementById('loadingspinner').style.visibility = visible?'visible':'hidden';
	},
	showNoLuck : function(){
		document.getElementById('NoLuck').innerHTML='<a href="javascript:Teacher.hideNoLuck(true);" style="float:right;">[&#x2716;]</a><b>No Luck...</b><br>Maybe you can try..<br>- Google keywords + crypto!<br>- Hit the <a href="#" onclick="return T_Reverse()">Reverse</a> button<br>- Remove <a href="#" onclick="return S_RemoveCRLF()">newlines</a><br>- Run <a href="javascript:OnlineLookup.request(CURRENTSCRATCHPAD.realvalue);">Online lookup</a> (7 sec)<br>- Remove <a href="#" onclick="return S_RemoveSpaces()">spaces</a><br>- Check <a href="#frequency">frequency analysis</a><br>- Scroll &amp; edit cipher settings';
		document.getElementById('NoLuck').style.display='inline';
	},
	hideNoLuck : function(forever){
		if(forever) this.hideForever = true;
		document.getElementById('NoLuck').style.display='none';
	},

	showArrow : function(name){
		//document.getElementById(name).innerHTML='<span style="position:relative;top:160px;font-size:40px;font-color:#17EB42;">&larr;</span>';
		//document.getElementById(name).style.visibility='visible';
		var t = document.getElementById(name+'box')
		if(t) t.className = "selectedSolution";
	},

	toggleSidebar : function(){
		var sidebar = document.getElementById('sidebar');
		sidebar.style.display=sidebar.style.display=='inline'?'none':'inline';
	},
	
};

