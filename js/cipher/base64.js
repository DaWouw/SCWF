
var Base64 = {
	// Base64 key string
	keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.encdec)
		{
			//window.setTimeout('BASE64_upd()', 100);
			return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('BASE64_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = 'Enter your text and see the converted message here!';
		}
		else
		{
			Timer.start();
			var decodedvalue = Base64.calc(document.encoder.encdec.value * 1, CURRENTSCRATCHPAD.realvalue);
			//alert(1);
			if (decodedvalue) {
				//alert(2);
				//e.innerHTML = Guesses.analyzeGuessAndGradeValue([decodedvalue, CertaintyEnum.DESPERATE], 'base64()');
				e.innerHTML = Teacher.analyzeValue(decodedvalue, 'base64()');	//SwapSpaces(HTMLEscape(
			}
			
			
			
			if(/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}(==)?|[A-Z0-9+\/]{3}=?)?$/i.test(CURRENTSCRATCHPAD.realvalue) ||		//Not else if because base32 is sometimes also tried if padding is missing
				/^(?:(==)?[A-Z0-9+\/]{2}|=?[A-Z0-9+\/]{3})?(?:[A-Z0-9+\/]{4})*$/i.test(CURRENTSCRATCHPAD.realvalue))		//Base64 or reverse(Base64) missing = padding compatible
			{
				var decodedvalue = /*DEPRECATED:ByteArray.byteArrayToHex(ByteArray.stringToByteArray*/ConvertBase.strToHex(Base64.b64_to_utf8_hex(CURRENTSCRATCHPAD.realvalue));
				if(decodedvalue && Global.InputType >= InputTypeEnum.ALPHANUMERIC && !Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue)) {
					Guesses.saveGuess(CertaintyEnum.DESPERATE, decodedvalue, 'base64ToHex()');	//Let's hope we never need to use this value
				}
				document.getElementById('BASE64_hex_output').innerHTML = Teacher.analyzeValue(decodedvalue, 'base64toHex()');
			}

			Timer.stop("Base64 - Two");
		}

		//window.setTimeout('BASE64_upd()', 100);
	},
	
	calc : function(encdec, textstr) {
		var temp = Base64.calculate(encdec, textstr);
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && //remove last 2 chars in case padding = is missing
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return temp;
		}
		temp = Base64.calculate(encdec, T_ReverseText(textstr));
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && 
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return temp;
		}
		return false;
	},
	
	calcGetSteps : function(encdec, text)
	{
		var temp = Base64.calculate(encdec, text);
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && //remove last 2 chars in case padding = is missing
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return [Teacher.analyzeValueDoNotSaveGrade(temp, 'base64()')];
		}
		temp = Base64.calculate(encdec, T_ReverseText(text));
		if(temp/* && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && 
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))*/) {
			return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'base64()')];
		}
		return false;
	},
	
	// Wrapper for standard interface
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64.btoa
	calculate : function(encdec, textstr) {
		if (encdec > 0) {
			//return Base64.encode(textstr);
			return Base64.utf8_to_b64(textstr);
			//return window.btoa(textstr);
		}
		//return Base64.decode(textstr);
		return Base64.b64_to_utf8(textstr);
		//return window.atob(textstr);
	},
	// Usage:
	//utf8_to_b64('✓ à la mode'); // "4pyTIMOgIGxhIG1vZGU="
	//b64_to_utf8('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"
	utf8_to_b64 : function( str ) {
		try {
			return window.btoa(unescape(encodeURIComponent( str )));
		} catch(e) {
			return false;
		}
	},
	b64_to_utf8 : function( str ) {
		try {
			return decodeURIComponent(escape(window.atob( str )));
		} catch(e) {
			try {
				return window.atob( str );
			} catch(e) {}
			return false;
		}
	},
	b64_to_utf8_hex : function( str ) {
		try {
			return window.atob( str );
		} catch(e) {
			return false;
		}
	},

	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + 
							  this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);
		} while (i < input.length);

		return output;
	},

	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = this.keyStr.indexOf(input.charAt(i++));
			enc2 = this.keyStr.indexOf(input.charAt(i++));
			enc3 = this.keyStr.indexOf(input.charAt(i++));
			enc4 = this.keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		return output;
	}
	
		
	/*decode : function(textstr) {
		var temp = calc_decode(textstr);
		if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && //remove last 2 chars in case padding = is missing
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))) {
			return temp;
		}
		temp = calc_decode(T_ReverseText(textstr));
		if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp.slice(0, -2)) && 
				!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/.test(temp.slice(0, -2)))) {
			return temp;
		}
		return false;
	}*/
};
