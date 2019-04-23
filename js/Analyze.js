/*	UNKNOWN:		-2,
	TOOSHORT:		-1,
	UNINITIALIZED:	0,
	BINARY:			1,
	NUMBERS:		2,
	HEX:			3,
	ALPHA:			4,
	ALPHANUMERIC: 	5,
	ALPHASPEC: 		6,
	NUMERICSPEC: 	7,
	ALPHANUMERICSPEC:8,
	NOTPRINTABLE:	9,
	EXTENDEDASCII: 	10,*/


function classifyInputType(text) 
{
	if(text.length < min_encoded_string_length)
	{
		Global.InputType = InputTypeEnum.TOOSHORT;
	}
	else if(Binary.getDigitsIfBinary(text))
	{
		if(text.length >= 24)
			Global.InputType = InputTypeEnum.BINARY;
		else
			Global.InputType = InputTypeEnum.TOOSHORT;
	}
	else if(/^[0-9\s]+$/g.test(text))
	{
		Global.InputType = InputTypeEnum.NUMBERS;
	}
	else if(/^[0-9A-F\s]+$/gi.test(text))
	{
		Global.InputType = InputTypeEnum.HEX;
	}
	else if(/^[A-Z\s]+$/gi.test(text))
	{
		Global.InputType = InputTypeEnum.ALPHA;
	}
	else if(/^[0-9A-Z\s]+$/gi.test(text))
	{
		Global.InputType = InputTypeEnum.ALPHANUMERIC;
	}
	else if(/^[A-Z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\s]*$/i.test(text))
	{
		Global.InputType = InputTypeEnum.ALPHASPEC;
	}

	else if(/^[0-9\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\s]*$/.test(text))
	{
		Global.InputType = InputTypeEnum.NUMERICSPEC;
	}
	else if(REGEX_TEXTNUMBERSSPECIALCHARS.test(text))
	{
		Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;
	}
	else if(REGEX_FILE_TYPES.test(text))
	{
		Global.InputType = InputTypeEnum.FILE;
	}
	else if(/[^\u0000-\u0100]/.test(text))			//Goldenbug && Tapir
	{
		Global.InputType = InputTypeEnum.EXTENDEDASCII;
		//In case I ever need to encode 6byte hex ascii : https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point 	https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	}
	else 
	{
		Global.InputType = InputTypeEnum.NOTPRINTABLE;
		//console.warn('Unable to determine input-type');
	}
}

function optimizeRunCiphers()
{
	if(Global.InputType == InputTypeEnum.TOOSHORT) {
		return;
	}
	if( ! brute_force_on_dictionary_keys ){
		Global.Enable.ColumnTransp_BF_PW = false;
		Global.Enable.Vigenere_BF = false;
		Global.Enable.XOR_BF_PW = false;
		Global.Enable.XOR_BF_XL = false;
		Global.Enable.Bifid_BF = false;
		Global.Enable.Playfair_BF = false;
		Global.Enable.Caesar_BF_XL = false;
	}
	if( Global.InputLength > max_regular_string_length	||		//Yes, disable a lot of stuff
		Global.InputType == InputTypeEnum.BINARY		|| 
		Global.InputType == InputTypeEnum.NUMBERS		|| 
		Global.InputType == InputTypeEnum.HEX			|| 
		Global.InputType == InputTypeEnum.NUMERICSPEC	||
		Global.InputType == InputTypeEnum.FILE			|| 
		Global.InputType == InputTypeEnum.EXTENDEDASCII	|| 
		Global.InputType == InputTypeEnum.NOTPRINTABLE )
	{
		Global.Enable.Affine = false; Global.Enable.Affine_BF = false;
		Global.Enable.Atbash = false;
		Global.Enable.Bifid = false; Global.Enable.Bifid_BF = false;
		Global.Enable.ColumnTransp = false; Global.Enable.ColumnTransp_BF = false; Global.Enable.ColumnTransp_BF_PW = false;
		Global.Enable.Colemak = false;
		Global.Enable.Dvorak = false;
		Global.Enable.Enigma = false;
		Global.Enable.Keyboardshift = false;
		Global.Enable.Playfair = false;
		Global.Enable.Playfair_BF = false;
		Global.Enable.Railfence_BF = false;
		Global.Enable.Skip = false; Global.Enable.Skip_BF = false;
		Global.Enable.Transposition = false;
		Global.Enable.Vigenere = false; Global.Enable.Vigenere_BF = false;

		if( Global.InputType == InputTypeEnum.BINARY		|| 
			Global.InputType == InputTypeEnum.NUMBERS		||  
			Global.InputType == InputTypeEnum.NUMERICSPEC	||
			Global.InputType == InputTypeEnum.NOTPRINTABLE )
		{
			Global.Enable.Caesar = false;
			Global.Enable.Caesar_smart = false;
			Global.Enable.Caesar_BF_XL = false;
		}

		if(Global.InputType == InputTypeEnum.NUMBERS	||
			Global.InputType == InputTypeEnum.NUMERICSPEC) {
			Global.Enable.XOR = false;
			Global.Enable.XOR_Small = false;
			//Global.Enable.XOR_Smart = false;
			Global.Enable.XOR_BF_PW = false;
			Global.Enable.XOR_BF_XL = false;
		}

	}
	else if(Global.InputLength > max_regular_string_length)
	{
		//Not sure what to enable or disable here...
		Global.Enable.Ascii_heatmap = false;
	}

	if(Global.InputLength < max_regular_string_length && Global.InputType == InputTypeEnum.ALPHANUMERICSPEC)
	{
		//Special case to enable Affine special bruteforce
		//Global.Enable.Affine_spec_BF = true;
	}

	if(Global.InputType == InputTypeEnum.NUMBERS	||
		Global.InputType == InputTypeEnum.NUMERICSPEC) {
		Global.Enable.LetterNumbers = true;
	} else {
		Global.Enable.LetterNumbers = false;
	}
	if(Global.InputType == InputTypeEnum.HEX 		||
		Global.InputType == InputTypeEnum.EXTENDEDASCII) {
		Global.Enable.Goldenbug = true;
	} else {
		Global.Enable.Goldenbug = false;
	}
	if(Global.InputType != InputTypeEnum.HEX && Global.InputType <= InputTypeEnum.ALPHANUMERIC)
	{
		Global.Enable.Ascii_heatmap = false;
	}

	if(Global.InputType == InputTypeEnum.FILE)
	{
		Global.Enable.Ascii_heatmap = false;
		Global.Enable.Friedman_analysis = false;
		Global.Enable.Substitute = false;
		Global.Enable.BaudotMurray = false;
		Global.Enable.Digraph = false;
		Global.Enable.Baconian = false;
		Global.Enable.Baconian_BF = false;
		Global.Enable.Railfence = false;
		Global.Enable.Railfence_BF = false;
	}

	var inputTypeStr = '';
	for (var key in InputTypeEnum) {
		if(InputTypeEnum[key] == Global.InputType) {
			inputTypeStr = key;
			break;
		}
	}
	Global.log("Input categorization: "+inputTypeStr+(Global.InputLength>max_regular_string_length?' - Long input!':''));
}

function checkAllDecodings(text)
{
	var highestGrade = Teacher.getHighestGrade(false);
	if(!Teacher.isHit(highestGrade) && text.length >= min_encoded_string_length)	//If decoding failed, let's try some more multistep analytics things
	{							//First perform a few tries, and then remove spaces and enters if all else fails, so we can try again on that
		var retvar = false;
		
		if(Binary.getDigitsIfBinary(text) && text.length >= 24)
		{
			Global.InputType = InputTypeEnum.BINARY;
			var temp = decodeBinaryGetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
			
			temp = Code39.decodeCode39GetSteps(CURRENTSCRATCHPAD.realvalue, true);
			if(temp && $.isArray(temp) && temp.length>0){
				var result = temp[temp.length-1].value;
				if(/^[0-9A-Z\-\.\ \*\$\/\+\%]+$/.test(result)) {
					ForceFlow.addSteps(temp);
					retvar = true;
				} else {
					alert('Code39(barcode) found but could not decode somehow. It matches (#0)/3 == (#1)/7 or vise versa exactly. So certainty is still high. Try Code39.decodeCode39GetSteps(CURRENTSCRATCHPAD.realvalue, true); to skip output validation.');
				}
			}
			
			//Morse will be decoded using guesses since multiple options are possible there.
			
			return retvar;// This is important, because else the message WILL get decoded by other autosolvers
		}

		//09 20 09 20 09 20 09 09 09 20 20 09 20 09 09 09 09 20 20 09 09 20 09 20 09 09 20 09 09 09 09 09 09 20 20 20 09 09 20 20 09 20 20 09 20 20 20 20 09 20 20 09 20 20 09 09 09 20 20 20 09 20 09 20 09 20 20 20 09 20 09 09 09 20 20 09 20 09 09 20 09 20 20 09 20 20 20 20 09 20 20 09 20 20 20 09 09 09 20 09 09 09 09 09 09 20 20 09 20 09 09 20 09 20 20 20 09 09 20 20 09 09 20 09 09 09 09 09 09 09 20 09 09 09 20 09 09 20 20 09 09 20 09 09 09 20 20 09 09 09 09 20 09 20 20 09 20 20 20 09 09 20 20 09 09 20 20 20 09 20 20 09 09 20 09 20 09 20 20 20 09 09 20 09 09 20 20 09 20 20 20 20 09 20 20 20 09 20 09 20 09 20 20 20 09 09 20 20 09 09 20 09 09 09 09 09 09 20 20 09 20 20 09 09 09 20 20 09 20 09 09 20 09 20 20 09 09 20 20 09 09 20 20 09 09 20 09 20 09 09 20 09 09 09 20 09 09 09 20 09 20 20 20 09
		if((text.length%2 == 0 && /^((\\x|0x)?[0-9A-F]{2}){24,}$/gi.test(text)) || 
							(text.length%3 == 0 && /^(\ )?([0-9A-F]{2}\ ){23,}[0-9A-F]{2}(\ )?$/gi.test(text))) { //Double char binary
			Global.InputType = InputTypeEnum.HEX;
			var temp = text.replace(/(?:[0-9A-F]{2})*(\\x|0x| )+/gi, "");
			var temp2;


			// Check if this is double character binary: "20 09 20 09 09 20"
			var binary = [temp[0]+temp[1],'*'];
			//Works: //eval('temp2 = temp.replace(/(?:[0-9A-F]{2})*?('+binary[0]+')/gi, "@");');
			//Works: //var str = 'temp2 = temp.replace(/(^'+binary[0]+')*('+binary[0]+')/gi, "\@");';
			//Doesn't work: //eval('temp2 = temp.replace(new RegExp("/(^'+binary[0]+')*('+binary[0]+')/", "gi"), "\@");');
			eval('temp2 = temp.replace(/('+binary[0]+')/gi, "@");');
			temp2 = temp2.replace(/([0-9A-F]{2})/gi, "1");
			if(Binary.getDigitsIfBinary(temp2)){
				var temp3 = decodeBinaryGetSteps(temp2);	// returns false if it can't decode it to ASCII
				if(temp3){
					ForceFlow.addSteps(temp3);
					retvar = true;
					return retvar;			// This is important, because else the message WILL get decoded by other autosolvers
				}
			}
		}

		if(/^([ADFGVX]{2}\ ?)+$/gi.test(text))	//ADFG(V)X
		{
			Global.InputType = InputTypeEnum.ALPHA;
			alert('Check ADFG(V)X cipher at http://www.cryptool-online.org/index.php?option=com_cto&view=tool&Itemid=149&lang=en');
		}

		if(/^([1-5]{2}\s+)+[1-5]{2}?$/gi.test(text))	//35 13 41 13 23 55 54 23 32
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			alert('Check Polybius cipher at http://www.cryptool-online.org/index.php?option=com_content&view=article&id=70&Itemid=80&lang=en');
		}
		/*if(/^([2-9]{2}\s+)+[2-9]{2}?$/gi.test(text))	//77 26 85 55 36 99 96 36 76
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			alert('Check Nihilist cipher at http://www.cryptool-online.org/index.php?option=com_content&view=article&id=76&Itemid=86&lang=en');
		}*/
		if(/^([^0-8]{0,2}[0-8]{3}[^0-8]{0,1})+$/gi.test(text) || /^([^0-8]{0,2}[0-8]{4}[^0-8]{0,1})+$/gi.test(text))	//Octal representation 1
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			var temp = decodeOctalGetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}
		if(/^([^0-8]{0,2}[0-8]{8}[^0-8]{0,1})+([0-8]{3}|[0-8]{6})?$/gi.test(text))	//Octal paulschou.com representation
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			var temp = decodeOctalRepr2GetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}
		if(/^([^0-8]{0,2}[0-2]?[0-8]{2}[^0-8]{0,1})+([0-2]?[0-8]{2})?$/gi.test(text))	//Octal cryptii.com/text/octal representation
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			var temp = decodeOctalRepr3GetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}
		if(/^([^0-9]{0,2}([0|1|2][0-9])[^0-9]{0,1})+$/gi.test(text) || /^([^0-9]{0,2}([1|2]?[0-9])[^0-9])+$/gi.test(text+" ") || //Alphabetical index
			/^([^0-9]{0,2}([0-9][0|1|2])[^0-9]{0,1})+$/gi.test(text) || /^([^0-9]{0,2}([0-9][1|2]?)[^0-9])+$/gi.test(text+" "))  //Reversed alphabetical index
		{
			Global.InputType = InputTypeEnum.NUMBERS;
			if(/([^0-9]{1,2}[0]{1,2}[^0-9]{1})/gi.test(text) || /[^0-9]{0,2}([0|1|2][0-9])*00([0|1|2][0-9])*[^0-9]/g.test(text+" "))	//If it contains a's as 00 then alphabetical, else letter numbers
			{
				var temp = decodeAlphabeticalGetSteps(text);	// returns false if it can't decode it to ASCII
				if(temp){
					ForceFlow.addSteps(temp);
					retvar = true;
				}
			}
			else
			{
				/*Enable LetterNumbers after it does output validation
				var temp = LetterNumbers.decodeGetSteps(text);	// returns false if it can't decode it to ASCII
				if(temp){
					ForceFlow.addSteps(temp);
					retvar = true;
				}*/
			}
		}
		if(/^[0-9]{8,10}\.[0-9]{2,5}\.[0]{4}$/g.test(text))		//BIG-IP LTM cookie
		{
			Global.InputType = InputTypeEnum.IP;
			//1677787402.36895.0000
			
			var temp = WebApp.decodeBIGIP(text);	// returns always
			if(temp){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'BIG-IP LTM()')]);
				retvar = true;
			}
			
			return retvar;	//Might be needed, otherwise the URL, HEX and other encodings trigger. They probably aren't
		}
		if(/^(BIGipServer[^=]*=)?rd[0-9]{1,5}o00000000000000000000ffff[0-9A-F]{8,10}o[0-9]{2,5}$/gi.test(text)) {		//BIG-IP LTM oookie
			Global.InputType = InputTypeEnum.IP;
			//rd5o00000000000000000000ffffc0000201o80
			
			var temp = WebApp.decodeBIGIP_route(text);	// returns always
			if(temp){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'BIG-IP LTM()')]);
				retvar = true;
			}
		}
		if(/^(NSC_([a-zA-Z0-9\-\_\.]*)(\=|\%3D))[0-9a-f]{8}[0-9a-f]{8}[0-9a-f]{16,32}[0-9a-f]{4}$/gi.test(text)) {		//Netscaler cookie
			Global.InputType = InputTypeEnum.IP;
			//NSC_Qspe-TfdsfuGmbhXfcTfswfsObnf=ffffffff22e4c4a445525d5f4f58455e445a4a423660
			
			var temp = WebApp.decodeNetscaler(text);	// returns always
			if(temp){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'Netscaler cookie()')]);
				retvar = true;
			}
		}
		if(/^([^0-9A-F]{0,2}[0-9]{2,3}[^0-9A-F]{0,1})+$/gi.test(text))	//Decimal	//DIMA: still crashes sometimes when single trailing digit  //Partly mitigated -> Somehow the input keeps hanging on this line. Partly mitigated by adding ^A-F
		{
			Global.InputType = InputTypeEnum.NUMBERS;

			var temp = decodeDecimalRSAGetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
			else
			{
				temp = decodeDecimalGetSteps(text);	// returns false if it can't decode it to ASCII
				if(temp){
					ForceFlow.addSteps(temp);
					retvar = true;
				}
			}
			
			return retvar;	//Might be needed, otherwise the URL, HEX and other encodings trigger. They probably aren't
		}

		if(/^([\\0]x[0-9A-F]{2}){3,}$/gi.test(text)) //isURLencoded
		{
			Global.InputType = InputTypeEnum.HEX;

			var temp = text.replace(/[\\0]x/gi, '%');
			try {
				temp = decodeURIComponent(temp);
				if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]*$/.test(temp) && 
						!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp))) {
					ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'url()')]);
					retvar = true;
				}
			} catch(e) {
			}
		}
		if(/^([\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\ ]{1}[0-9A-F]{2}){3,}$/gi.test(text)) //isURLencoded
		{
			Global.InputType = InputTypeEnum.HEX;

			var temp = text;
			if(temp[0] != '%')
				eval("temp = temp.replace(/\\"+temp[0]+"/gi, '%')");
			try {
				temp = decodeURIComponent(temp);
				if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
						!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp))) {
					ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'url()')]);
					retvar = true;
				}
			} catch(e) {
			}
		}
		if((text.length%2 == 0 && /^[0-9A-F]{2,}$/gi.test(text)) || (text.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(text)))	//Regular Hex
		{
			Global.InputType = InputTypeEnum.HEX;

			var textcpy = text;
			if(textcpy.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(textcpy))
				textcpy = textcpy.replace(/\ /g,'');
			

			var temp = ConvertBase.hexToStr(textcpy);
			if(REGEX_FILE_TYPES.test(temp) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
					!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp)))) {
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'Hex()')]);
				retvar = true;
			}
		}
		if(/^(\&\#\x[0-9A-F]{2,5}\;\s?){3,}$/i.test(text))	//HTML Encoded //TODO: HTML decimal encoded characters. //Foo &#xA9; bar &#x1D306; baz &#x2603; qux
		{
			Global.InputType = InputTypeEnum.HEX;

			var textcpy = text.replace(/[\&\#\x\;\s]/gi,'');
			
			var temp = ConvertBase.hexToStr(textcpy);
			if(temp) {
			//if(REGEX_FILE_TYPES.test(temp) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
			//		!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp)))) {
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'html()')]);
				retvar = true;
			}
		}
		/*else if((text.length%2 == 0 && /^[0-9A-F\-\.\$\/\=\%\ \*]{2,}$/gi.test(text)) || (text.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(text)))
		{
			alert('Why is this here? I can\'t remember making this or where this can possibly be for.');
		}*/
		if( (text.length%2 == 0 && /^([04-9A-F][0-9A-F]){3,}$/gi.test(text)) || 
			(text.length%3 == 0 && /^([04-9A-F][0-9A-F]\ ){3,}$/gi.test(text)) || 
			(text.length%3 == 0 && /^([^0-9A-F][04-9A-F][0-9A-F]){3,}$/gi.test(text)) )		//EBCDIC
		{
			Global.InputType = InputTypeEnum.HEX;

			var textcpy = text;
			if(textcpy.length%2 == 0 && /^([0-9A-F][0-9A-F]){2,}$/gi.test(textcpy))
				textcpy = textcpy.match(/(..?)/g).join(' ');
			temp = Ebcdic.decodeGetSteps(textcpy);	// returns false if it can't decode it to ASCII
			if(temp) {
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}
		if(/^[0-8A-Z]{3,}=*$/gi.test(text))	//Base 32
		{
			Global.InputType = InputTypeEnum.ALPHANUMERIC;

			var temp = decodeBase32GetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}
		if(/^[0-9A-Z]+$/i.test(text))	//Base 36
		{
			Global.InputType = InputTypeEnum.ALPHANUMERIC;

			var base36_hex = ConvertBase.b36ToHex(text);
			var base36_value = ConvertBase.hexToStr(base36_hex);
			
			if(base36_value && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(base36_value)){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(base36_value, 'Base36()')]);
				retvar = true;
			}
		}
		if(/^[0-9A-Z]+$/i.test(text))	//Base 58
		{
			Global.InputType = InputTypeEnum.ALPHANUMERIC;

			var base58_value = Base58.decode(text);
			
			if(base58_value && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(base58_value)){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(base58_value, 'Base58()')]);
				retvar = true;
			}
		}
		if(/^(?:[A-Z0-9\+\/]{4})*(?:[A-Z0-9\+\/]{2}(==)?|[A-Z0-9\+\/]{3}=?)?$/i.test(text) ||		//Not else if because base32 is sometimes also tried if padding is missing
				/^(?:(==)?[A-Z0-9\+\/]{2}|=?[A-Z0-9\+\/]{3})?(?:[A-Z0-9\+\/]{4})*$/i.test(text))	//Base64 or reverse(Base64) missing = padding compatible
		{
			Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;

			var temp = Base64.calcGetSteps(-1, text);	// returns false if it can't decode it to ASCII
			if(temp && temp.length && (REGEX_FILE_TYPES.test(temp[temp.length-1].value) || /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(temp[temp.length-1].value))) {
				ForceFlow.addSteps(temp);
				retvar = true;
			}
			/*else if(temp)		//Try ASP.NET ViewState
			{
				temp = WebApp.calcViewStateGetSteps(text);
				if(temp && temp.length && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(temp[0].value)){
					temp[0].value = temp[0].value.replace(/<br\/?>/gi,'\n');
					ForceFlow.addSteps(temp);
					retvar = true;
				}
			}*/
		}
		/*if(/^(?:[A-Z0-9-\_]{4})*(?:[A-Z0-9-\_]{2}(\!\!)?|[A-Z0-9-\_]{3}\!?)?$/i.test(text) || 
				/^(?:(\!\!)?[A-Z0-9-\_]{2}|\!?[A-Z0-9-\_]{3})?(?:[A-Z0-9-\_]{4})*$/i.test(text))	//IBM WebSphere decode or reverse(IBM WebSphere decode) missing = padding compatible
		{
			Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;

			var temp = WebApp.decodeWebSphere(text);	// returns false if it can't decode it to ASCII
			if(temp) alert('IBM WebSphere URL encoding detected. Check HackingKB>Web for details to decode.');
			//if(temp && temp.length && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(temp)){
			//	ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'IBM WebSphere()')]);
			//	retvar = true;
			//}
		}*/
		if(/^[A-Z0-9\+\/]{32,42}\.[A-Z0-9\+\/]{10,}\.[A-Z0-9\+\-\_\/]{40,150}$/i.test(text))	//JWT base64 decode
		{
			Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;

			var temp = WebApp.calcJWTGetSteps(text);
			if(temp && temp.length && /^\{[^\}]{20,45}\}\.\{[^\}]+\}\.[A-Z0-9\+\-\_\/]{40,120}$/i.test(temp[temp.length-1].value)) {
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}

		if(/^[A-Z0-9\+\/\=]+$/i.test(text))				//Megan-35, Tripo-5, Atom-128, Gila-7, Hazz-15, Esab-46, Tigo-3fx, Feron-74, Zong-22
		{
			Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;
			var ciphers = ['Megan35','Tripo5','Atom128','Gila7','Hazz15','Esab46','Tigo3fx','Feron74','Zong22'];
			for(var i = 0, temp = null; i < ciphers.length; i++) {
				eval('temp = WeirdCrypto.calcDecode'+ciphers[i]+'GetSteps(text);');	// returns false if it can't decode it to ASCII
				if(temp && temp.length /*&& /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(temp[temp.length-1].value)*/){
					ForceFlow.addSteps(temp);
					retvar = true;
				}
			}
		}

		if(/^<~[\x21-\x75]{3,}~>$/gi.test(text) || /^[\x21-\x75]{3,}$/gi.test(text))	//ASCII85
		{
			Global.InputType = InputTypeEnum.ALPHANUMERICSPEC;

			var temp = decodeASCII85GetSteps(text);	// returns false if it can't decode it to ASCII
			if(temp){
				ForceFlow.addSteps(temp);
				retvar = true;
			}
		}

		if(/^[\u263F-\u2647\u26E2\u2295\u2609\u{1F728}\s]+$/gi.test(text) && /[\u263F-\u2647\u26E2\u2295\u2609\u{1F728}]/.test(text))	//planet 	//wth is \u8853 ?	//earth:\u{1F728}
		{
			Global.InputType = InputTypeEnum.EXTENDEDASCII;

			var temp = Substitute.planetSubstitution(text);
			if(temp){
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'planetSubstitution()')]);
				retvar = true;
			}
		}

		var mask = null;
		if((mask = Xor.checkIfFile(text)))								//Test if a file is XORed
		{											//06080779782040414041C14141414141BEBEBE60B84540414141416D414141414041404141434005417A
			Global.InputType = InputTypeEnum.FILE;

			var XOR_ME = text;
			var XOR_ME_IS_BIN = false;
			var XOR_ME_IS_HEX = false;
			var XOR_ME_IS_BASE64 = false;

			//DIMA:ARRAY-ERROR//[XOR_ME, XOR_ME_IS_BIN, XOR_ME_IS_HEX, XOR_ME_IS_BASE64] = Xor.preparse_xor_input(XOR_ME);
			var XOR_OUTPUT_ARR = Xor.preparse_xor_input(XOR_ME);
			XOR_ME = XOR_OUTPUT_ARR[0]; XOR_ME_IS_BIN = XOR_OUTPUT_ARR[1]; XOR_ME_IS_HEX = XOR_OUTPUT_ARR[2]; XOR_ME_IS_BASE64 = XOR_OUTPUT_ARR[3];

			XOR_ME = ByteArray.getByteArray(XOR_ME, !((XOR_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(XOR_ME)) || (XOR_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(XOR_ME))));
			var temp = Xor.calc(XOR_ME,[],[mask],[]);
			if(temp) {
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(ByteArray.byteArrayToString(temp), 'xor(0x'+(mask<16?"0":'')+mask.toString(16).toUpperCase()+')')]);	//Maybe: analyzeValueSaveReturnGrade
				retvar = true;
			}
		}
		
		return retvar;
	}
	return false;
}

function mitigateFailures(text)
{
	var temp = false;		//Yes, even if hit, check baconian
	/*if(text.length > 24 && (temp = text.match(/[a-z][A-Z]+[a-z]/g)) && text.test(/([\ ][^\ ]){3,}/g) && temp.length > 10)	//TODO: Check if not hex
	{
		location.href = "#baconian";
		if( ! Test.active() )	//If not in testmode
			alert('Check Baconian, the normal text is probably having a higher HIT than the result.');
	}*/
	
	var highestGrade = Teacher.getHighestGrade(false);
	if(text.length >= min_encoded_string_length && 
			((!Teacher.isHit(highestGrade) && ! REGEX_FILE_TYPES.test(text)) || 
				min_auto_guess_certainty <= CertaintyEnum.DESPERATE) )	//If decoding failed, let's try some more multistep analytics things
	{							//First perform a few tries, and then remove spaces and enters if all else fails, so we can try again on that
		var retvar = false;
		if(Binary.getDigitsIfBinary(text))
		{
			/* This is now performed at morse itself.
			if(/[.-]{1,5}(?: [.-]{1,5})*(?:   [.-]{1,5}(?: [.-]{1,5})*)*$/.test(text.replace(/\//g,' ')))	// http://stackoverflow.com/questions/17197887/java-regexp-match-morse-code
			{
				location.href = "#morse";
				if( ! Test.active() ) {//If not in testmode
					alert('Check morse, the format complies with morse. Use one of the decoded values as input for the tool.');
				}
					
			}*/
		}
		if(/^([wasd]+[^wasd]?)+$/.test(text))
		{
			if( ! Test.active() )	//If not in testmode
				alert('Check drawing this using the wasd arrows on the keyboard: https://github.com/ctfs/write-ups-2015/tree/master/plaidctf-2015/misc/sawed');
		}
		if(/^0x([0-9A-F]{2}){2,}$/i.test(text))
		{
			//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(text.substring(2), 'rem_leading_0x_hex()')]);
			Guesses.analyzeGuessAndGradeValue([text.substring(2), CertaintyEnum.EDUCATEDGUESS], 'rem_leading_0x_hex()');
			retvar = true;
		}
		if((text.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(text)) || /^([0-9A-F]{2}\ ){3,}[0-9A-F]{2}$/gi.test(text))	//Regular Hex with spaces as separators
		{
			var temp = text.replace(/\ /g,'');
			//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'hex_remove_spaces()')]);
			Guesses.analyzeGuessAndGradeValue([temp, CertaintyEnum.GUESS], 'hex_remove_spaces()');
			retvar = true;
		} else if(Global.InputType = InputTypeEnum.HEX && /^([0-9A-F]{2}){3,}[0-9A-F]$/i.test(text)) {		//Check if a hex string is pre- or appended with one hex char
			//6236343a20615735305a584a755a58526659323975646d567963326c76626c3930623239736331397962324e7
			var temp = ConvertBase.hexToStr(text.slice(1));
			if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
					!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp))) {
				Guesses.analyzeGuessAndGradeValue([temp, CertaintyEnum.WILDGUESS], 'Hex_remove_first_byte()');
				retvar = true;
			}
			temp = ConvertBase.hexToStr(text.slice(0, -1));
			if(/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
					!(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp))) {
				Guesses.analyzeGuessAndGradeValue([temp, CertaintyEnum.WILDGUESS], 'Hex_remove_last_byte()');
				retvar = true;
			}
		}

		if((/^(?:[A-Z0-9-\_]{4})*(?:[A-Z0-9-\_]{2}(\!\!)?|[A-Z0-9-\_]{3}\!?)?$/i.test(text) || 
				/^(?:(\!\!)?[A-Z0-9-\_]{2}|\!?[A-Z0-9-\_]{3})?(?:[A-Z0-9-\_]{4})*$/i.test(text)) && /[\-\_\!]/i.test(text))	//IBM WebSphere decode or reverse(IBM WebSphere decode) missing = padding compatible
		{
			Guesses.saveGuess(CertaintyEnum.DESPERATE, "javascript:alert(\'IBM WebSphere URL encoding detected. Check HackingKB>Web for details to decode.\\n Python code:\\n t = \\'blablabla\\'.replace(\\'_\\',\\'/\\').replace(\\'-\\',\\'+\\').replace(\\'!\\',\\'=\\')\\n print zlib.decompress(t.decode(\\'base64\\'),-10)\');", 'IBM WebSphere()');
		}

		if(/^[a-z\-\xC4\s]+$/i.test(text) && (text.match(/[a-z][\-\xC4][a-z]/gi)||[]).length > 5)
		{
			//if(! Test.active())	//If not in testmode
				alert('Check Navajo code: https://cryptii.com/navajo/text');
		}

		if((/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}={0,5}|[A-Z0-9+\/]{3}={0,5})?$/i.test(text) ||		//Not else if because base32 is sometimes also tried if padding is missing
				/^(?:={0,5}[A-Z0-9+\/]{2}|={0,5}[A-Z0-9+\/]{3})?(?:[A-Z0-9+\/]{4})*$/i.test(text)) && 	//Base64 or reverse(Base64) missing = padding compatible
				!(text.length%2 == 0 && /^[0-9A-F]{2,}$/gi.test(text)))									//So it must be base64 and NOT hex
		{
			/*Note: B64 to hex is more of a guess and has a relatively high false positive ratio*/
			//var temp = Base64.b64_to_utf8_hex(text);
			//if(temp) {	//if base 64 is decoded, continue with hex, this has a better chance.
			//DEPRECATED:	temp = ByteArray.byteArrayToHex(ByteArray.stringToByteArray(temp));
			//	ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(temp, 'base64_to_hex()')]);
			//	retvar = true;
			//} else {	//Seems like base64 cannot be decoded, probably padding is broken.
				var repairedBase64;
				temp = TrimChars(text, "=");
				do {
					repairedBase64 = Base64.calculate(-1, temp);	// returns false if it can't decode it to ASCII
					if(repairedBase64 && REGEX_TEXTNUMBERSSPECIALCHARS.test(repairedBase64)){
						//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_no_padding()')]);
						Guesses.analyzeGuessAndGradeValue([repairedBase64, CertaintyEnum.GUESS], 'base64_repair_padding()');
						retvar = true;
						break;
					}
					/*repairedBase64 = Base64.calculate(-1, temp+"=");	// returns false if it can't decode it to ASCII
					if(repairedBase64){
						ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_add_1missing_padding()')]);
						retvar = true;
						break;
					}
					repairedBase64 = Base64.calculate(-1, temp+"==");	// returns false if it can't decode it to ASCII
					if(repairedBase64){
						ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_add_2missing_padding()')]);
						retvar = true;
						break;
					}*/
					
					temp = T_ReverseText(temp);
					
					repairedBase64 = Base64.calculate(-1, temp);	// returns false if it can't decode it to ASCII
					if(repairedBase64 && REGEX_TEXTNUMBERSSPECIALCHARS.test(repairedBase64)){
						//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_reversed_no_padding()')]);
						Guesses.analyzeGuessAndGradeValue([repairedBase64, CertaintyEnum.GUESS], 'base64_reversed_repair_padding()');
						retvar = true;
						break;
					}
					/*repairedBase64 = Base64.calculate(-1, temp+"=");	// returns false if it can't decode it to ASCII
					if(repairedBase64){
						ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_reversed_add_1missing_padding()')]);
						retvar = true;
						break;
					}
					repairedBase64 = Base64.calculate(-1, temp+"==");	// returns false if it can't decode it to ASCII
					if(repairedBase64){
						ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_reversed_add_2missing_padding()')]);
						retvar = true;
						break;
					}*/
				} while(false);	//Yes, this is only used for the break
			//}
		} else if(/^([A-Z0-9\+\/]|\%[0-9A-F]{2})+={0,3}$/i.test(text) && /(\%[0-9A-F]{2})/i.test(text)) {	//Base64 with URL encoding
			temp = decodeURIComponent(text);//text.replace(/(\%[0-9A-F]{2})/i, function(t){return decodeURIComponent(t);});
			//alert(temp);
			var repairedBase64 = Base64.calculate(-1, temp);	// returns false if it can't decode it to ASCII
			//alert(repairedBase64);
			if(repairedBase64 && REGEX_TEXTNUMBERSSPECIALCHARS.test(repairedBase64)){
				//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(repairedBase64, 'base64_reversed_no_padding()')]);
				Guesses.analyzeGuessAndGradeValue([repairedBase64, CertaintyEnum.EDUCATEDGUESS], 'base64_url_decode_first()');
				retvar = true;
			} /*else if(repairedBase64) {
				Guesses.analyzeGuessAndGradeValue([repairedBase64, CertaintyEnum.DESPERATE], 'base64_url_decode_first()');
				retvar = true;
			}*/ else {
				//alert(1);
				Guesses.analyzeGuessAndGradeValue([temp, CertaintyEnum.DESPERATE], 'part_url_decode()');
				retvar = true;
			}
		}

		if(true)
		{
			//43wdxz 4edcvgt5 65rdcvb 6tfcgh8uhb 9ijn
			if(Substitute.checkkeyboardmap(text))
			{
				alert('Keyboard mapping of letters found.\nhttps://github.com/ctfs/write-ups-2014/tree/master/olympic-ctf-2014/crypting');
			}
		}

		/*
		Error: Script terminated by timeout at: mitigateFailures
		@ /SolveCryptoWithForce/js/Analyze.js:472:7 start_update
		@ /SolveCryptoWithForce/js/MAIN.js:181:6
		@ /SolveCryptoWithForce/js/MAIN.js:102:1 
		*/
		if(/*prompt('Digraph guessing is disabled atm because the next regex hangs sometimes.') && */
			! Binary.getDigitsIfBinary(text) && (/^([a-z][a-z])+$/.test(text) || /^([A-Z][A-Z])+$/.test(text) || 
												 /^(([a-z][a-z])+[\s]+)+([a-z][a-z])*$/.test(text) ||
												 /^(([A-Z][A-Z])+[\s]+)+([A-Z][A-Z])*$/.test(text)
												 ))
		{
			var candecodeToPlayfair = false;

			if(/^([a-z][a-z][\s])+([a-z][a-z])?$/.test(text) || /^([A-Z][A-Z][\s])+([A-Z][A-Z])?$/.test(text))
			{
				//retvar = true;
				candecodeToPlayfair = true;
				Guesses.analyzeGuessAndGradeValue([text, CertaintyEnum.UNKNOWN], 'playfairLookup()');
				//if(CertaintyEnum.UNKNOWN>=min_auto_guess_certainty) {
					//Student.onlinelookup_performed = false;
					OnlineLookup.requestPlayfair(CURRENTSCRATCHPAD.realvalue);
				//}
			}
			else if(/^([a-z][a-z])+$/.test(text) || /^([A-Z][A-Z])+$/.test(text))
			{
				//retvar = true;
				candecodeToPlayfair = true;
				Guesses.analyzeGuessAndGradeValue([text, CertaintyEnum.UNKNOWN], 'playfairLookup()');
				//if(CertaintyEnum.UNKNOWN>=min_auto_guess_certainty) {
					//Student.onlinelookup_performed = false;
					OnlineLookup.requestPlayfair(CURRENTSCRATCHPAD.realvalue);
				//}
			}

			var digraph_output = Digraph.calc(text, true);//SwapSpaces(HTMLEscape(
			if(digraph_output)
			{
				
				//location.href = "#digraph";
				//alert('Check digraph/playfair, the format can comply with it. Digraph is however computationally intensive, so it is a manual action. Quipqiup is auto launched after button is pressed.');
				if( /^(([a-z][a-z])+[\s]+)+([a-z][a-z])*$/.test(text) ||
					/^(([A-Z][A-Z])+[\s]+)+([A-Z][A-Z])*$/.test(text) )
				{
					var thisGuessCertainty = candecodeToPlayfair?CertaintyEnum.DESPERATE:CertaintyEnum.GUESS;
					Guesses.analyzeGuessAndGradeValue([digraph_output, thisGuessCertainty], 'digraph() & Quipqiup'+(thisGuessCertainty<min_auto_guess_certainty?' Manually!':'()'));
					if(thisGuessCertainty>=min_auto_guess_certainty) {
						retvar = true;
						//Student.onlinelookup_performed = false;
						window.setTimeout('Digraph.performQuipqiup()', 1000);	//Don't decrease to 500. Somehow this goes wrong
					}
				}
				else
				{
					var thisGuessCertainty = candecodeToPlayfair?CertaintyEnum.DESPERATE:CertaintyEnum.DESPERATE;
					Guesses.analyzeGuessAndGradeValue([digraph_output, thisGuessCertainty], 'digraph() & Quipqiup'+(thisGuessCertainty<min_auto_guess_certainty?' Manually!':'()'));
					if(thisGuessCertainty>=min_auto_guess_certainty) {
						retvar = true;
						//Student.onlinelookup_performed = false;
						window.setTimeout('Digraph.performQuipqiup()', 1000);	//Don't decrease to 500. Somehow this goes wrong
					}
				}
			}
		}
		
		//Nothing worked, lets remove all spaces and enters
		if(/^\s+|\s+$/g.test(text))		//Last resort: check if leading or trailing spaces or newlines are the problem
		{
			//Last resort: check if leading or trailing spaces or newlines are the problem
			//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(text.replace(/^\s+|\s+$/g,''), 'rem_lead-trailing_spaces&newl()')]);
			if(/^[^\r\n][\r\n]+$/g.test(text)) {
				Guesses.analyzeGuessAndGradeValue([text.replace(/[\r\n]+$/g,''), CertaintyEnum.EDUCATEDGUESS], 'rem_trailing_newl()');
			} else if(/^[\r\n]*[^\r\n]+[\r\n]+$|^[\r\n]+[^\r\n]+[\r\n]*$/g.test(text)) {
				Guesses.analyzeGuessAndGradeValue([text.replace(/^[\r\n]+|[\r\n]+$/g,''), CertaintyEnum.EDUCATEDGUESS], 'rem_lead-trailing_newl()');
			} else if(/^\s*[^\s]+\s+$|^\s+[^\s]+\s*$/g.test(text)) {
				Guesses.analyzeGuessAndGradeValue([text.replace(/^\s+|\s+$/g,''), CertaintyEnum.GUESS], 'rem_lead-trailing_spaces&newl()');
			} else {
				Guesses.analyzeGuessAndGradeValue([text.replace(/^\s+|\s+$/g,''), CertaintyEnum.WILDGUESS], 'rem_lead-trailing_spaces&newl()');
			}
			retvar = true;
		}
		if(/[\S]\s[\S]/g.test(text))	//Desperate last resort: check for spaces and enters which might be in the way
		{
			//Last resort: check if spaces or newlines are the problem
			var recurring_deleted = false
			var groups, l = 0;
			if((l = ((groups = text.split(/\s/g)) || []).length) && l > (text.length/7) && l < (text.length/2)) {
				groups = groups.slice(1,-1);
				var correct = true;
				var expectedlength = groups[0].length;
				for (var i = groups.length - 1; i >= 1; i--) {
					if(groups[i].length != expectedlength) {
						correct = false;
						break;
					}
				}
				if(correct) {
					recurring_deleted = true;
					Guesses.analyzeGuessAndGradeValue([text.replace(/[\s]+/g,''), CertaintyEnum.DESPERATE], 'rem_periodic_spaces&newl()');
					retvar = true;
				}
			}

			if( ! recurring_deleted )
			{
				if(/[\S][\r\n]+[\S]/g.test(text)) {
					Guesses.analyzeGuessAndGradeValue([text.replace(/[\r\n]+/g,''), CertaintyEnum.WILDGUESS], 'rem_all_newl()');
				} else {
					Guesses.saveGuess(CertaintyEnum.DESPERATE, text.replace(/[\s]+/g,''), 'rem_all_spaces&newl()');
					//Guesses.analyzeGuessAndGradeValue([text.replace(/[\s]+/g,''), CertaintyEnum.DESPERATE], 'rem_all_spaces&newl()');
				}
				retvar = true;
			}
		}
		if(Timer.iteration == 1)
		{
			Guesses.saveGuess(CertaintyEnum.DESPERATE,"javascript:RunStringsFunctionAndScroll();",'Strings()');
		}

		/*if(/^[4bcd3fgh1jklmn0pqr57uvwxyz .?!]+$/gi.test(text))	//1337 speak	//Not accurate enough
		{
			alert('Check 1337-speak');
		}*/
		
		retvar |= Guesses.drawGuesses();

		return retvar;
	}
	return false;
}

