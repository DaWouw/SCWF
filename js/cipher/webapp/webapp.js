// Lots of WebApp Ciphers

var WebApp = {
	
	
	upd : function()
	{
		//alert(WebApp.decodeBIGIP_route('rd2o00000000000000000000ffff0a15a925o14245'));
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '')
		{
			//window.setTimeout('AFFINE_upd()', 100);
			return;
		}
		else
		{
			Timer.start();
			
			document.getElementById('BASE64_JWT_output').innerHTML = Teacher.analyzeValue(WebApp.JWT_base64_decode(CURRENTSCRATCHPAD.realvalue), 'JWT_base64_decode()');


			if(CURRENTSCRATCHPAD.realvalue.length && (CURRENTSCRATCHPAD.realvalue[0] == '/' || Global.InputType == InputTypeEnum.ALPHANUMERICSPEC) && /^[a-zA-Z0-9\+=\\/]+$/.test(CURRENTSCRATCHPAD.realvalue) && Base64.b64_to_utf8(CURRENTSCRATCHPAD.realvalue)) {
				var tree_and_treenodes = WebApp.decodeViewState(CURRENTSCRATCHPAD.realvalue);
				if(tree_and_treenodes) {
					var tree = tree_and_treenodes[0];
					var treenodes = tree_and_treenodes[1];

					var grade_use_value = Teacher.analyzeValueDoNotSaveGrade(tree, 'ViewState_decode()');
					var grade_use_grade = Teacher.analyzeValueSaveReturnGrade(treenodes, 'ViewState_decode()');
					document.getElementById('VIEWSTATE_output').innerHTML = Teacher.createGradeLeftAnchor(grade_use_grade)+grade_use_value.markedvalue+Teacher.createGradeRightAnchor(grade_use_grade);
				}
			}
			if(/^(NSC_([a-zA-Z0-9\-\_\.]*)(\=|\%3D))?[0-9a-f]{8}[0-9a-f]{8}[0-9a-f]{16,32}[0-9a-f]{4}$/gi.test(CURRENTSCRATCHPAD.realvalue)) {		//Netscaler cookie
				var out = '', temp = WebApp.decodeNetscaler(CURRENTSCRATCHPAD.realvalue);	// returns always
				if(temp) {
					if(out.indexOf('@') !== -1) {
						out = Guesses.analyzeGuessAndGradeValue([temp, CertaintyEnum.EDUCATEDGUESS], 'Netscaler_cookie()');
					} else {
						var temp = Guesses.saveGuess(CertaintyEnum.DESPERATE, temp, 'Netscaler_cookie()');
						out = '&lt;<i>Also paste the cookie name to decode serviceName</i>&gt; @ '+temp.value;
					}
				}
				document.getElementById('WEBAPP_netscaler').innerHTML = out;
			}
			if(/(\&\#?[0-9a-z]{2,6}\;|\\u[0-9A-F]{4})/gi.test(CURRENTSCRATCHPAD.realvalue)) {		//Html decode
				document.getElementById('WEBAPP_htmldecode').innerHTML = Teacher.analyzeValue(WebApp.decodeHtml(CURRENTSCRATCHPAD.realvalue), 'html_decode()');
			}

			/*if(/^(?:[A-Z0-9-\_]{4})*(?:[A-Z0-9-\_]{2}(\!\!)?|[A-Z0-9-\_]{3}\!?)?$/i.test(CURRENTSCRATCHPAD.realvalue) || 
				/^(?:(\!\!)?[A-Z0-9-\_]{2}|\!?[A-Z0-9-\_]{3})?(?:[A-Z0-9-\_]{4})*$/i.test(CURRENTSCRATCHPAD.realvalue))	//IBM WebSphere decode or reverse(IBM WebSphere decode) missing = padding compatible
			{
				var temp = WebApp.decodeWebSphere(CURRENTSCRATCHPAD.realvalue);	// returns false if it can't decode it to ASCII
				if(temp) alert('IBM WebSphere URL encoding detected. Check HackingKB>Web for details to decode.'+temp);
				if(temp && temp.length && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(temp)){
					document.getElementById('WEBAPP_websphere').innerHTML = Teacher.analyzeValue(temp, 'IBM WebSphere()');
				}
			}//*/

			Timer.stop("WebApp - BruteF over Three");
		}

		//window.setTimeout('AFFINE_upd()', 100);
	},

	decodeHtml : function(text)
	{
		var parser = new DOMParser;
		var dom = parser.parseFromString('<!doctype html><body>' + text,'text/html');
		return dom.body.textContent;
	},

	decodeWebSphere : function(text)	//IBM Websphere URL decoding
	{
		//hcvLCoJAGEDhZ_EB4p_UUVyazCjiqHnB0Y1MJWJ5RSuYp89lm4iz_DhQwd4oXl0rtm4aRQ8cKqP2UoukjonURM8wUkP7HCano6ozvHv55b7tabtHPs3DWHOp9ucuoTJ_OtEhA470Or2jmQXryKQVxZKsm4XQFjwwy6zc65ZLTw98ofN1wIUoDNIU1C8G43kTvbM6Nm0ldlsFQm8aGpgHLvnbVj6-q0z_
		text = text.replace(/\_/g,'/').replace(/\-/g,'+').replace(/\!/g,'=');
		var compressed = Base64.b64_to_utf8(text);
		alert('TODO: get zlib -10 decompression.'); var decompressed = compressed;
		return decompressed
	},

	calcViewStateGetSteps : function(text)
	{
		var tree_and_treenodes = WebApp.decodeViewState(text);
		if(tree_and_treenodes) {
			return [Teacher.analyzeValueDoNotSaveGrade(tree_and_treenodes[0], 'ViewState decode()')];
		}
		return false;
	},

	decodeViewState : function (input)
	{
		var vs = new ViewState(CURRENTSCRATCHPAD.realvalue);
		if(vs.isValid) {
			vs.consume();
			var c = vs.components();
			var tree = '';
			var treenodes = '';

			var spaces = '................................................................................';//.replace(/\./g,'&#8226;');

			//tree += '<style>span.blockingspan span{display:block;}</style><span class="blockingspan">';
			c.forEach(function(d) {
				treenodes += d.str()+' ';
				//tree += '<span>'+spaces.substring(0, d.depth()*7) + ' ' + d.str() + '</span>';
				tree += spaces.substring(0, d.depth()/**7*/) + ' ' + d.str() + '<br/>';
			});
			return [tree, treenodes]
		}
		return false;
	},

	calcJWTGetSteps : function(text)
	{
		var temp = WebApp.JWT_base64_decode(text);
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && //remove last 2 chars in case padding = is missing
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return [Teacher.analyzeValueDoNotSaveGrade(temp, 'JWT_base64()')];
		}
		temp = WebApp.JWT_base64_decode(T_ReverseText(text));
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && 
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'JWT_base64()')];
		}
		return false;
	},

	JWT_base64_decode : function (input, noInputValidation) 
	{
		//https://jwt.io/
		noInputValidation = (typeof noInputValidation == "undefined")? false : noInputValidation;
		if(noInputValidation || /^[A-Z0-9\+\/]{32,45}\.[A-Z0-9\+\/]{10,}\.[A-Z0-9\+\-\_\/]{40,150}$/i.test(input))
		{
			JWTparts = input.split('.');
			JWTpart_alg  = Base64.b64_to_utf8(JWTparts[0]);
			JWTpart_data = Base64.b64_to_utf8(JWTparts[1]);
			if(JWTpart_alg && JWTpart_data)
			{
				JWTplaintext = JWTpart_alg+'.'+JWTpart_data+'.'+JWTparts[2];
				//TODO: Test if certain passwords are used
				return JWTplaintext;
			}
		}
		return null;
	},

	decodeBIGIP : function (input)
	{
		//https://support.f5.com/kb/en-us/solutions/public/6000/900/sol6917.html
		if (typeof input === 'number') {
			input += '';
		}

		inputparts = input.split('.');

		var ip = WebApp.calcBigIP_ip(inputparts[0]);
		var port = WebApp.calcBigIP_port(inputparts[1]);

		return ip+':'+port;
	},
	calcBigIP_ip : function (input)
	{
		//https://github.com/CheungJ/BIG-IP-encoder-and-decoder/blob/master/big-ip-encoder-decoder.js
		var ipSegments = [];
		var sumOfIPSegments = 0;
		/*
		* Where the format of the IP is a.b.c.d, the calculation is:
		* a = (input % 256)
		* b = ((input - a) / 256) % 256
		* c = (((input - a - b) / 256) / 256) % 256
		* d = ((((input - a - b - c) / 256) / 256) / 256) % 256
		*/
		input_int = new Number(input);
		for (var i = 0; i < 4; i++) {
			var ip = input_int;
			var n = Math.pow(256, i);

			ip -= sumOfIPSegments;
			ip = (ip / n);
			ip = (ip % 256);
			ip = Math.floor(ip);
			sumOfIPSegments += ip;
			ipSegments.push(ip);
		}

		return ipSegments.join('.');
	},
	calcBigIP_port : function (input)
	{
		var ipSegments = [];
		//var sumOfIPSegments = 0;
		/*
		* Port encoding
		* The BIG-IP system uses the following port encoding algorithm:
		* Convert the decimal port value to the equivalent 2-byte hexadecimal value.
		* Reverse the order of the 2 hexadecimal bytes.
		* Convert the resulting 2-byte hexadecimal value to its decimal equivalent.
		* Where the format of the IP is a.b.c.d, the calculation is:
		*/
		var input_int = new Number(input);
		for (var i = 0; i < 2; i++) {
			var port = input_int;
			var n = Math.pow(256, i);
			//port -= sumOfIPSegments;
			port = (port / n);
			port = (port % 256);
			port = Math.floor(port);
			//sumOfIPSegments += port;
			ipSegments.push(port);
		}

		return ipSegments[0]*256+ipSegments[1];
	},

	decodeBIGIP_route : function (input)
	{
		//https://www.owasp.org/index.php/SCG_D_BIGIP

		var input = input.substr(input.indexOf('0ffff')+5);
		var inputparts = input.split('o');
		//rd5o00000000000000000000ffffc0000201o80
		//rd2o00000000000000000000ffff0a15a925o14245

		var ip = [];
		for (var i = 0; i < 4; i++){
		    ip[i] = parseInt(inputparts[0].substring(i*2,i*2+2), 16);
		}
		ip = ip.join(".");
		var port = inputparts[1];

		return ip+':'+port;
	},


	decodeNetscaler : function (input)
	{
		//https://github.com/catalyst256/Netscaler-Cookie-Decryptor
		//https://itgeekchronicles.co.uk/2012/01/03/netscaler-making-sense-of-the-cookie-part-1/
		//NSC_([a-zA-Z0-9\-\_\.]*)=[0-9a-f]{8}([0-9a-f]{8}).*([0-9a-f]{4})$

		var re = null;
		if(/^NSC_([a-zA-Z0-9\-\_\.]*)(?:=|%3d)[0-9a-f]{8}[0-9a-f]{8}.*[0-9a-f]{4}$/gi.test(input))
			re = /^NSC_([a-zA-Z0-9\-\_\.]*)(?:=|%3d)[0-9a-f]{8}([0-9a-f]{8}).*([0-9a-f]{4})$/gi;
		else if(/^[0-9a-f]{8}[0-9a-f]{8}[0-9a-f]{16,32}[0-9a-f]{4}$/gi.test(input))
			re = /^[0-9a-f]{8}([0-9a-f]{8})[0-9a-f]{16,32}([0-9a-f]{4})$/gi;
		else
			return false;

		var parts = re.exec(input);

		var serviceName = '';
		var ip = '';
		var port = '';
		var ipkey = 0x03081e11;

		if(parts){
			if(parts.length == 4){
				//serviceName = Caesar.calc(1, parts[1], 25);
				serviceName = Caesar.calc(-1, parts[1], 1);
				ip = Xor.calc(ByteArray.getByteArray(parts[2],0),[0x03,0x08,0x1e,0x11],[],[]).join(".");
				port = parseInt(Xor.calc(ByteArray.getByteArray(parts[3],0),[0x36,0x30],[],[]).join(""));
				//if(port > 65535) return false;
				return serviceName+' @ '+ip+':'+port.toString();
			} else {
				serviceName = '<i>Also paste the cookie name to decode serviceName</i>';
				ip = Xor.calc(ByteArray.getByteArray(parts[1],0),[0x03,0x08,0x1e,0x11],[],[]).join(".");
				port = parseInt(Xor.calc(ByteArray.getByteArray(parts[2],0),[0x36,0x30],[],[]).join(""));
				if(port > 65535) return false;
				return ip+':'+port.toString();
			}
		}
		return false;
	}

};

