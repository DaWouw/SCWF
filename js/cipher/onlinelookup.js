/*------------------------------- The Server-side php code -------------------------------
 *	see ServerSidePHP folder
*/

var OnlineLookup = {

	active : 0,

	showRun : function(){
		document.getElementById("onlineLookupBox").innerHTML = 
							navigator.onLine?
									( ! force_fully_offline?
											( ( CURRENTSCRATCHPAD.realvalue.length > min_encoded_string_length ) ?
												'<a href="javascript:OnlineLookup.request(CURRENTSCRATCHPAD.realvalue);" style="font-size:0.6em;">Run online lookup? (quipqiup|playfair|vigenere)</a>' :
												'' ) :
											'Offline mode') :
									'No internet :(';
	},

	request : function(text)
	{
		document.getElementById("onlineLookupBox").innerHTML = '';
		this.requestPlayfair(text);	//2 sec
		this.requestQuipqiup(text);	//7 sec
		//this.requestVigenere(text, 2, 12);		//59 sec //This one will finish last, so set the updateHitBox to true
		this.requestVigenere(text, 2, 6, -1);
		//this.requestVigenere(text, 2, 6, -1);
		//this.requestVigenere(text, 6, 9,  0);
		//this.requestVigenere(text,  9, 12, 1);	//59 sec //This one will finish last, so set the updateHitBox to true
	},

	checkIfForcedFullyOffline : function(name)
	{
		if( force_fully_offline ) {
			console.warn('Setting \'force_fully_offline\' active! Did not perform a request for '+name);
			return true;
		}
		return false;
	},

	requestQuipqiup : function(text)
	{
		if(this.checkIfForcedFullyOffline('requestQuipqiup'))			//Low level protection against unwanted online lookups (if set)
			return false;

		this.active += 1;
		var xmlhttp;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var matches = xmlhttp.responseText.match(/"[^"]*"/gi);
				document.getElementById("QUIPQIUP_output").innerHTML = '';
				if(matches) {
					for(var i = 0; i < matches.length && i < 10; i++) {	//Only first 10 answers
						matches[i] = matches[i].indexOf('"') === 0 && matches[i].lastIndexOf('"') === matches[i].length -1 ? matches[i].substring(1, matches[i].length-1) : matches[i];	//Check if answer is within quotes and remove them
						document.getElementById("QUIPQIUP_output").innerHTML += Teacher.analyzeValue(matches[i], 'quipqiup()')+'<br><br>';	//TODO:Add HTMLEscape() to protect from interesting XSSs
					}
				}
				Timer.countdown_timer_stop('countDownQuipqiupSec');

				Teacher.updateHitBox();
				Teacher.updateHitValueBox();
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
				if(!OnlineLookup.active) {
					OnlineLookup.showRun();
				} else {
					(t = document.getElementById("countDownQuipqiup"))?t.innerHTML = 'Quipqiup: &#x2713;.':null;
				}
			}
			else if(xmlhttp.readyState==4 && xmlhttp.status!=200)
			{
				Timer.countdown_timer_stop('countDownQuipqiupSec');
				document.getElementById("countDownQuipqiup").innerHTML = 'Quipqiup: '+xmlhttp.status+'!';
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
			}
		}
		xmlhttp.open("GET", lookup_proxy_host+'/quip.php?a='+encodeURIComponent(text),true);
		//xmlhttp.setRequestHeader("Referer","SolveCryptoWithForce");	//Will give error in chrome
		xmlhttp.send();
		
		document.getElementById("onlineLookupBox").innerHTML+=' <b id="countDownQuipqiup">Quipqiup: <span id="countDownQuipqiupSec">7</span>s.</b>';//<br>
		Timer.countdown_timer_init(7, 'countDownQuipqiupSec');
	},
	
	requestPlayfair : function(text)
	{
		if(this.checkIfForcedFullyOffline('requestPlayfair'))			//Low level protection against unwanted online lookups (if set)
			return false;

		this.active += 1;
		var xmlhttp;
		var t;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var matches = xmlhttp.responseText.match(/"[^"]*"/gi);
				document.getElementById("PLAYFAIR_output_lookup").innerHTML = '';
				if(matches) {
					for(var i = 0; i < matches.length && i < 10; i++){	//Only first 10 answers
						matches[i] = matches[i].indexOf('"') === 0 && matches[i].lastIndexOf('"') === matches[i].length -1 ? matches[i].substring(1, matches[i].length-1) : matches[i];	//Check if answer is within quotes and remove them
						var keyvalue = matches[i].match(/([^|]*)|([^|\n]*)/gi);
						document.getElementById("PLAYFAIR_output_lookup").innerHTML += '<i>'+keyvalue[0]+'</i>: '+Teacher.analyzeValue(keyvalue[2], 'playfair('+keyvalue[0]+')')+'<br><br>';	//TODO:Add HTMLEscape() to protect from Riley
					}
				}
				Timer.countdown_timer_stop('countDownPlayfairSec');

				Teacher.updateHitBox();
				Teacher.updateHitValueBox();
				//this.active = this.active>0?this.active-1:0;
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
				if(!OnlineLookup.active) {
					OnlineLookup.showRun();
				} else {
					(t = document.getElementById("countDownPlayfair"))?t.innerHTML = 'Playfair: &#x2713;.':null;
				}
			}
			else if(xmlhttp.readyState==4 && xmlhttp.status!=200)
			{
				Timer.countdown_timer_stop('countDownPlayfairSec');
				//(t = document.getElementById("countDownPlayfair"))?t.innerHTML = 'Playfair: '+xmlhttp.status+'!':null;
				document.getElementById("countDownPlayfair").innerHTML = 'Playfair: '+xmlhttp.status+'!';
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
			}
		}
		xmlhttp.open("GET", lookup_proxy_host+'/playfair.php?a='+encodeURIComponent(text),true);
		//xmlhttp.setRequestHeader("Referer","SolveCryptoWithForce");	//Will give error in chrome
		xmlhttp.send();
		
		document.getElementById("onlineLookupBox").innerHTML+=' <b id="countDownPlayfair">Playfair: <span id="countDownPlayfairSec">2</span>s.</b>';//<br>
		Timer.countdown_timer_init(2, 'countDownPlayfairSec');
	},


	requestVigenere : function(text, f, t, batch)
	{
		if(this.checkIfForcedFullyOffline('requestVigenere'))			//Low level protection against unwanted online lookups (if set)
			return false;

		this.active += 1;
		var xmlhttp;
		var t;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var matches = xmlhttp.responseText.match(/"[^"]*"/gi);
				
				if(matches) {
					for(var i = 0; i < matches.length && i < 50; i++){	//Only first 30 answers but let's say 50
						matches[i] = matches[i].indexOf('"') === 0 && matches[i].lastIndexOf('"') === matches[i].length -1 ? matches[i].substring(1, matches[i].length-1) : matches[i];	//Check if answer is within quotes and remove them
						var keyvalue = matches[i].match(/([^|]*)|([^|\n]*)/gi);
						document.getElementById("VIGENERE_output_lookup").innerHTML += '<i>'+keyvalue[0]+'</i>: '+Teacher.analyzeValue(keyvalue[2], 'vigenere('+keyvalue[0]+')')+'<br><br>';	//TODO:Add HTMLEscape() to protect from Riley
					}
				}

				Teacher.updateHitBox();
				Teacher.updateHitValueBox();
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
				if(typeof batch === "undefined" || batch == 1) {
					Timer.countdown_timer_stop('countDownVigenereSec');
					
					if(!OnlineLookup.active) {
						OnlineLookup.showRun();
					} else {
						(t = document.getElementById("countDownVigenere"))?t.innerHTML = 'Vigenere: &#x2713;.':null;
					}
				} else if (batch == 0) {
					OnlineLookup.requestVigenere(text, 9, 12, 1);
				} else if (batch == -1) {
					OnlineLookup.requestVigenere(text, 6, 9,  0);
					//document.getElementById("countDownVigenere").innerHTML = 'Vigenere @ &#8532;: <span id="countDownVigenereSec">'+Timer.countdown_timer_get('countDownVigenereSec')+'</span>s.';
				}
			}
			else if(xmlhttp.readyState==4 && xmlhttp.status!=200)
			{
				Timer.countdown_timer_stop('countDownVigenereSec');
				//(t = document.getElementById("countDownVigenere"))?t.innerHTML = 'Vigenere: '+xmlhttp.status+'!':null;
				document.getElementById("countDownVigenere").innerHTML = 'Vigenere: '+xmlhttp.status+'!';
				OnlineLookup.active = OnlineLookup.active>0?OnlineLookup.active-1:0;
			}
		}

		//xmlhttp.timeout = 120000; // Set timeout to 120 seconds (120.000 milliseconds)		//IE crashes on this
		xmlhttp.ontimeout = function () { alert("Vigenere online lookup timed out!!!"); };
		if(typeof batch === "undefined" || batch == -1) document.getElementById("VIGENERE_output_lookup").innerHTML = '';
		xmlhttp.open("GET", lookup_proxy_host+'/vigi.php?a='+encodeURIComponent(text)+'&f='+encodeURIComponent(f)+'&t='+encodeURIComponent(t),true);
		//xmlhttp.setRequestHeader("Referer","SolveCryptoWithForce");	//Will give error in chrome
		xmlhttp.send();
		
		if(typeof batch === "undefined" || batch == -1) {
			document.getElementById("onlineLookupBox").innerHTML+=' <b id="countDownVigenere">Vigenere'+/*(typeof batch !== "undefined" && batch == -1?' @ &#8531;':'')+*/': <span id="countDownVigenereSec">66</span>s.</b>';//<br>
			Timer.countdown_timer_init(66, 'countDownVigenereSec');
		}
	}
};

window.addEventListener('online',  OnlineLookup.showRun);
window.addEventListener('offline', OnlineLookup.showRun);

