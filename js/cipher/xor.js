
var Xor = {

 	possiblefirstbytes : [],

	//http://th.atguy.com/mycode/xor_js_encryption/
	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.XOR_b * IsUnchangedVar.XOR_c * IsUnchangedVar.XOR_d *
			IsUnchangedVar.XOR_text_string * IsUnchangedVar.XOR_b_string * IsUnchangedVar.XOR_c_string * IsUnchangedVar.XOR_d_string)
		{
			return;
		}
		
		Xor.update_visual();
		
		document.getElementById('xor_text').innerHTML = Teacher.preventXSS(CURRENTSCRATCHPAD.realvalue);
		
		var e = document.getElementById('XOR_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and a pad and see the results here!</i>';
		}
		else
		{
			var XOR_ME = CURRENTSCRATCHPAD.realvalue;
			var XOR_ME_IS_BIN = false;
			var XOR_ME_IS_HEX = false;
			var XOR_ME_IS_BASE64 = false;

			//DIMA:ARRAY-ERROR//[XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64] = Xor.preparse_xor_input(XOR_ME);
			var XOR_OUTPUT_ARR = Xor.preparse_xor_input(XOR_ME);
			XOR_ME = XOR_OUTPUT_ARR[0]; XOR_ME_IS_BIN = XOR_OUTPUT_ARR[1]; XOR_ME_IS_HEX = XOR_OUTPUT_ARR[2]; XOR_ME_IS_BASE64 = XOR_OUTPUT_ARR[3];

			if((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))) {			//Not a string, so Binary, Hex or Base64. Everything has been converted to Hex by now. Except strings.
				document.getElementById('xor_text_string').checked = false;
				document.getElementById('xor_text_string').setAttribute('_oldValue', false);	//Hack to not double calc this current, yet to be calced, value
			} else {
				document.getElementById('xor_text_string').checked = true;
				document.getElementById('xor_text_string').setAttribute('_oldValue', true);		//Hack to not double calc this current, yet to be calced, value
			}
			
			if(document.getElementById('xor_b').value.length || document.getElementById('xor_c').value.length || document.getElementById('xor_d').value.length)
			{
				Timer.start();
				var a = ByteArray.getByteArray(XOR_ME, document.getElementById('xor_text_string').checked);
				var b = ByteArray.getByteArray(document.getElementById('xor_b').value, document.getElementById('xor_b_string').checked);
				var c = ByteArray.getByteArray(document.getElementById('xor_c').value, document.getElementById('xor_c_string').checked);
				var d = ByteArray.getByteArray(document.getElementById('xor_d').value, document.getElementById('xor_d_string').checked);
				var r = Xor.calc(a,b,c,d);
				document.getElementById('xor_result_string').value = ByteArray.byteArrayToString(r);
				document.getElementById('xor_result_hex').value = ByteArray.byteArrayToHex(r);
				document.getElementById('XOR_output_hex').innerHTML = Teacher.analyzeValue(ByteArray.byteArrayToHex(r), (XOR_ME_IS_BASE64?'base64toHex_':'')+(XOR_ME_IS_BIN?'bin_':'')+'xor_toHex()');
				e.innerHTML = Teacher.analyzeValue(ByteArray.byteArrayToString(r), (XOR_ME_IS_BASE64?'base64toHex_':'')+(XOR_ME_IS_BIN?'bin_':'')+'xor()');
				Timer.stop("Xor - Single");
			} else {
				e.innerHTML = '<i>Type in a message and a pad and see the results here!</i>';
			}
			
			if((IsUnchangedVar.text + IsUnchangedVar.XOR_text_string < 2) && Global.InputType >= InputTypeEnum.HEX) {
				
				if(Global.Enable.XOR_Small && !Global.Enable.XOR_BF_XL)		//XOR_BF_XL does the same as Xor_Small and even more
				{
					Xor.bruteForceSmall(XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64);
				}
				/*if(Global.Enable.XOR_Smart && !Global.Enable.XOR_BF_XL)	//XOR_BF_XL does the same as Xor_Smart and even more
				{
					Xor.bruteForceSmart(XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64);
				}*/
				if(Global.Enable.XOR_BF_PW)
				{
					var passwords = [];
					passwords = passwords.concat(brute_force_dictionary_keys);
					Xor.bruteForcePasswords(passwords, XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64);
				}

				if(Global.Enable.XOR_BF_XL)
				{
					Xor.bruteForceXL(XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64);
				}
			}
			//Xor.checkIfFile(XOR_ME);
		}
	},
	preparse_xor_input : function (XOR_ME)
	{
		var XOR_ME_IS_BIN = false;
		var XOR_ME_IS_HEX = false;
		var XOR_ME_IS_BASE64 = false;
		//TODO check if input string is bin
		//001101010001100100010000000111110000001000011100000110110001001000010101010000010001011100011010000001000000010100000111000010100001001100010101000110100001110000011001010011110001110100010110010100000000010000001011000100000001101100011010000000010000110100000110000001000101001100011100000001010100111100011011000101110101000000000000010100110001111100011000000010000001101100000111000100010000110101010011000111000000011100001010000000000000010100000100000010000001110000011101010101110001101100011010000001010000010001000001000111000000011000000011000111110000011100010000000000110100000100000111000000010000001000001010
		//001000100000000000011101000101110001100000000010010100100000000100011110000000100001110000010111000100100000101101010010000001110000001000011000000000110000011100011000
		var digits = Binary.getDigitsIfBinary(XOR_ME);
		if(digits)								//So this is binary
		{
			var temp = calcDecodeBinaryGetSteps(Binary.replaceBoth(XOR_ME, digits[0], '0', digits[1], '1'), true);
			if(temp && temp.length) {
				temp = /*DEPRECATED:ByteArray.byteArrayToHex(ByteArray.stringToByteArray*/ConvertBase.strToHex(temp[0].value);
				if(temp) {
					XOR_ME = temp;
					XOR_ME_IS_BIN = true;
				}
			}
		}
		else if((XOR_ME.length%2 == 0 && /^(0x|\\x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME)))
		{
			//XOR_ME = ConvertBase.strToHex(XOR_ME);
			XOR_ME_IS_HEX = true;
		}
		else if((/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}(==)?|[A-Z0-9+\/]{3}=?)?$/i.test(XOR_ME) ||		//Not else if because base32 is sometimes also tried if padding is missing
			/^(?:(==)?[A-Z0-9+\/]{2}|=?[A-Z0-9+\/]{3})?(?:[A-Z0-9+\/]{4})*$/i.test(XOR_ME)) &&		//Base64 or reverse(Base64) missing = padding compatible
			!(XOR_ME.length%2 == 0 && /^[0-9A-F]{2,}$/gi.test(XOR_ME)))								//So Base64 and not Hex
		{
			XOR_ME = ConvertBase.strToHex(Base64.b64_to_utf8_hex(XOR_ME));
			//alert(XOR_ME);
			//alert(XOR_ME.length);
			//alert(XOR_ME[0]=='\0');
			XOR_ME_IS_BASE64 = true;
		}
		return [XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64];
	},
	checkIfFile : function (XOR_ME)
	{
		var XOR_ME_IS_BIN = false;
		var XOR_ME_IS_HEX = false;
		var XOR_ME_IS_BASE64 = false;
		//DIMA:ARRAY-ERROR//[XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64] = Xor.preparse_xor_input(XOR_ME);
		var XOR_OUTPUT_ARR = Xor.preparse_xor_input(XOR_ME);
		XOR_ME = XOR_OUTPUT_ARR[0]; XOR_ME_IS_BIN = XOR_OUTPUT_ARR[1]; XOR_ME_IS_HEX = XOR_OUTPUT_ARR[2]; XOR_ME_IS_BASE64 = XOR_OUTPUT_ARR[3];
		return Xor.checkIfFileFast(XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64);
	},
	checkIfFileFast : function (XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64)
	{
		XOR_ME = ByteArray.getByteArray(XOR_ME, !((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))));

		var filetypes_str = REGEX_FILE_TYPES.toString().slice(0,-1);
		var filetypes_arr = filetypes_str.match(/[^\^\/\(\|\)]+/g);
		for(var i = 0, l = filetypes_arr.length; i < l; i++)
		{
			var found_match = true;
			var filetype = filetypes_arr[i].replace(/(\\x..)/gi, function(a){return ConvertBase.hexToStr(a.slice(2,4));});
			//alert(filetype);
			var teststr = XOR_ME.slice(0, filetype.length);
			var mask = teststr[0]^filetype.charCodeAt(0);
			for(var j = 1; j < filetype.length; j++) {
				if ((teststr[j]^filetype.charCodeAt(j)) != mask) {
					found_match = false;
					break;
				}
			}

			if(found_match) {
				//alert('FOUND FILE'+mask.toString());
				return mask;
			}
		}
		return false;
	},
	bruteForceSmall : function (XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64)
	{
		var o = document.getElementById('XOR_output_bruteF_Small');
		var out = '';

		Timer.start();
		
		var a = ByteArray.getByteArray(XOR_ME, !((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))));
		//var recordpossiblefirstbytes = a[0]&0x80 == a[1]&0x80;
		for(var i = 0x1; i <= 0xF; i++) {	//XOR_bruteF_range
			var r = Xor.calc(a,[],[i],[]);
			r = ByteArray.byteArrayToString(r);	//byteArrayToStringNoLowCharsValidate
			/*if(r && r.length && ((a[0]&0x80)>>4) == (i&0x8)) {
				if(/^[\x00-0x0F\x20-\x7F]+$/.test(r)) {
					this.possiblefirstbytes.push(i);
					//alert(i);
				}
			}*/
			if(r && r.length && (REGEX_FILE_TYPES.test(r) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\s]+$/.test(r) && !(/[\?]{5,}/.test(r)) /*&& 
																!(/[\!\@\#\$\%\^\&\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\|\r\n\ ]{4,}/.test(r))*/))) {
				//r = SwapSpaces(HTMLEscape(r));
				r = Teacher.analyzeValue(r, (XOR_ME_IS_BASE64?'base64toHex_':'')+(XOR_ME_IS_BIN?'bin_':'')+'xor(0x'+i.toString(16).toUpperCase()+')');
				out += '<b>0x'+i.toString(16).toUpperCase()+':</b> '+r+"<br>\n";
			}
		}
		//alert(this.possiblefirstbytes);
		o.innerHTML = out;
		Timer.stop("Xor - 0x1-0xF - BruteF over 15");
	},
	bruteForceXL : function (XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64)
	{
		var o = document.getElementById('XOR_output_bruteF_XL');
		var out = '';

		Timer.start();
		
		var a = ByteArray.getByteArray(XOR_ME, !((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))));
		var rangefrom = a[0]&0x80?0x80:(min_auto_guess_certainty>=CertaintyEnum.WILDGUESS?0x11:0x01);	//Only calc something with 0x0Z or 0xZ0 if desperate...
		var rangeto = a[0]&0x80?0xFF:0x7F;
		for(var i = rangefrom; i <= rangeto; i++) {	//XOR_bruteF_range
			if((i&0x0F) == 0 && min_auto_guess_certainty>=CertaintyEnum.WILDGUESS)	//Only calc something with 0x0Z or 0xZ0 if desperate...
				continue;

			var r = Xor.calc(a,[],[i],[]);
			r = ByteArray.byteArrayToString(r);	//byteArrayToStringNoLowCharsValidate
			if(r && r.length && (REGEX_FILE_TYPES.test(r) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\s]+$/.test(r) && !(/[\?]{5,}/.test(r)) /*&& 
																!(/[\!\@\#\$\%\^\&\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\|\r\n\ ]{4,}/.test(r))*/))) {
				//r = SwapSpaces(HTMLEscape(r));
				r = Teacher.analyzeValue(r, (XOR_ME_IS_BASE64?'base64toHex_':'')+(XOR_ME_IS_BIN?'bin_':'')+'xor(0x'+(i<16?"0":'')+i.toString(16).toUpperCase()+')');
				out += '<b>0x'+(i<16?"0":'')+i.toString(16).toUpperCase()+':</b> '+r+"<br>\n";
			}
		}
		o.innerHTML = out;
		Timer.stop("Xor - 0x"+rangefrom.toString(16).toUpperCase()+"-0x"+rangeto.toString(16).toUpperCase()+" - BruteF over "+(rangeto-rangefrom));
	},
	bruteForcePasswords : function (passwords, XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64)
	{
		var o = document.getElementById('XOR_output_bruteF_passwords');
		var out = '';

		Timer.start();
					
		var a = ByteArray.getByteArray(XOR_ME, !((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))));
		
		for(var i = 0; i < passwords.length; i++){
			var r = Xor.calc(a,[],ByteArray.getByteArray(passwords[i], true),[]);
			r = ByteArray.byteArrayToString(r);	//byteArrayToStringNoLowCharsValidate
			if(r && r.length && (REGEX_FILE_TYPES.test(r) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\s]+$/.test(r) && !(/[\?]{5,}/.test(r)) /*&& 
																!(/[\!\@\#\$\%\^\&\*\[\]\;\:\'\"\`\,\<\>\?\-\_\~\\\|]{4,}/.test(r))*/))) {
				//r = SwapSpaces(HTMLEscape(r));
				var temp, confident = !((temp = r.match(/[\@\#\$\%\^\&\*\[\]\;\:\'\"\`\,\<\>\-\_\~\\\|]/g)) && temp.length >= 5) && !Binary.getDigitsIfBinary(r);
				Guesses.addPasswordGuess(r, passwords[i],'xor');
				r = Guesses.analyzeGuessAndGradeValue([r, confident?CertaintyEnum.ALMOSTCERTAIN:CertaintyEnum.DESPERATE], (XOR_ME_IS_BASE64?'base64toHex_':'')+(XOR_ME_IS_BIN?'bin_':'')+'xor('+passwords[i]+')');
				out += '<b>'+passwords[i]+':</b> '+r+"<br>\n";
			}
		}
		o.innerHTML = out;
		Timer.stop("Xor - Passwords - BruteF over "+passwords.length);
	},
	

	update_visual : function()
	{
		if(IsUnchangedVar.XOR_text_string * IsUnchangedVar.XOR_b_string * IsUnchangedVar.XOR_c_string * IsUnchangedVar.XOR_d_string){
			return;
		}
		document.getElementById('xor_text_0x').innerHTML = document.getElementById('xor_text_string').checked?'':'0x';
		document.getElementById('xor_b_0x').innerHTML = document.getElementById('xor_b_string').checked?'':'0x';
		document.getElementById('xor_c_0x').innerHTML = document.getElementById('xor_c_string').checked?'':'0x';
		document.getElementById('xor_d_0x').innerHTML = document.getElementById('xor_d_string').checked?'':'0x';
		document.getElementById('xor_b_+-').style.visibility = document.getElementById('xor_b_string').checked?'hidden':'visible';
		document.getElementById('xor_c_+-').style.visibility = document.getElementById('xor_c_string').checked?'hidden':'visible';
		document.getElementById('xor_d_+-').style.visibility = document.getElementById('xor_d_string').checked?'hidden':'visible';
	},

	//http://www.darkfader.net/toolbox/convert/ (bottom)
	calc : function(a,b,c,d)
	{
		var r = new Array();
		var bi = 0, ci = 0, di = 0;
		for (var ai=0; ai<a.length; ai++)
		{
			var x = a[ai];
			if (bi < b.length) x ^= b[bi++];
			if (c.length > 0) x ^= c[ci++]; if (ci >= c.length) ci = 0;
			if (d.length > 0) x = (x + d[di++]) & 0xFF; if (di >= d.length) di = 0;
			r[ai] = x;
		}
		return r;
	},

	onXorModeChanged : function()
	{
		var r = document.getElementById('xor_string').checked;
		ByteArray.string2Hex(CURRENTSCRATCHPAD, r);
		ByteArray.string2Hex(document.getElementById('xor_b'), r);
		ByteArray.string2Hex(document.getElementById('xor_c'), r);
		ByteArray.string2Hex(document.getElementById('xor_d'), r);
	}

};

