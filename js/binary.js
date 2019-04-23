
var Binary = {
	
	nrDifferentChars : function(text)
	{
		var leftover = text;
		var lcase=0, ucase=0, numbers=0, special=0, spaces=0;
		for(var i = text.length+5; leftover.length && i ; i--)
		{
			var c = leftover[0];
			if ('abcdefghijklmnopqrstuvwxyz'.indexOf(c) >= 0){
				lcase ++;
			}
			else if('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0){
				ucase ++;
			}
			else if ('0123456789'.indexOf(c) >= 0)
			{
				numbers ++;
			}
			else if ("`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?".indexOf(c) >= 0)
			{
				special ++;
				c = '\\'+c;
			}
			else if (" \r\n".indexOf(c) >= 0)
			{
				spaces ++;
				if ("\r".indexOf(c) >= 0) c = '\\r';
				if ("\n".indexOf(c) >= 0) c = '\\n';
			}
			eval('leftover = leftover.replace(/['+c+']+/g, "");');
		}
		 
		return [lcase, ucase, numbers, special, spaces];
	},

	getDigitsIfBinary : function(text)
	{
		var stats = Binary.nrDifferentChars(text);
		var binary = false;
		if(stats[0]+stats[1]+stats[2] == 2) {	//lcase, ucase and numbers
			text = text.replace(/[\.\,\!\?\-\"\'\;\:\/\$\% \r\n]+/g, "");
			binary = [text[0],'*'];
			eval('text = text.replace(/['+text[0]+']+/g, "");');
			binary[1] = text[0];
		}
		else if(stats[0]+stats[1]+stats[2]+stats[3] == 2) {		//lcase, ucase, numbers and special
			text = text.replace(/[ \r\n]+/g, "");
			binary = [text[0],'*'];
			if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(text[0]) < 0) text[0] = '\\'+text[0];
			//if ("`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?".indexOf(text[0]) >= 0) text[0] = '\\'+text[0];
			eval('text = text.replace(/['+text[0]+']+/g, "");');
			binary[1] = text[0];
		}
		return binary?binary.sort():false;
	},

	populateBinaryField : function(text)
	{
		//TODO, check hex, base64
		var digits = Binary.getDigitsIfBinary(text);
		if(text.length > 5 && 
				(digits ||	//Bin
				((text.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(text)) || (text.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(text))) /* || 	//Hex
				(/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}(==)?|[A-Z0-9+\/]{3}=?)?$/i.test(text) || /^(?:(==)?[A-Z0-9+\/]{2}|=?[A-Z0-9+\/]{3})?(?:[A-Z0-9+\/]{4})*$/i.test(text))*/)	//Base64
			)
		{
			document.getElementById("MANIPULATE_digitinput").innerHTML = 
					(digits?(
						digits[0]+' = <input type="text" value="" name="MANIPULATE_digitinput_0" onkeyup="if(this.value.length) {ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(Binary.replace(CURRENTSCRATCHPAD.realvalue, \''+digits[0]+'\', this.value), \'reverse()\')]); ForceFlow.selectFurthestSingleChildNodePath();}" size="1"><br>'+
						digits[1]+' = <input type="text" value="" name="MANIPULATE_digitinput_1" onkeyup="if(this.value.length) {ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(Binary.replace(CURRENTSCRATCHPAD.realvalue, \''+digits[1]+'\', this.value), \'reverse()\')]); ForceFlow.selectFurthestSingleChildNodePath();}" size="1"><br>'+
						'<input type="button" onclick="Binary.binaryInverse(CURRENTSCRATCHPAD.realvalue);return false;" value="Swap '+digits[0]+'<->'+digits[1]+'"><br>')
						:
						'<input type="button" onclick="Binary.binaryInverse(CURRENTSCRATCHPAD.realvalue);return false;" value="Binary inverse"><br>')+
					'<input type="button" onclick="Binary.binaryReverse(CURRENTSCRATCHPAD.realvalue);return false;" value="Binary reverse">';
			document.getElementById("MANIPULATE_digitinput_topscreen").innerHTML = '. <a href="#" onclick="Binary.binaryInverse(CURRENTSCRATCHPAD.realvalue);return false;">BinInverse</a>'+
																					', <a href="#" onclick="Binary.binaryReverse(CURRENTSCRATCHPAD.realvalue);return false;">BinReverse</a>';
		}
		else {
			document.getElementById("MANIPULATE_digitinput").innerHTML = 'No binary input detected [a A 1 ! \\n]=['+Binary.nrDifferentChars(text).join(' ')+']';
			document.getElementById("MANIPULATE_digitinput_topscreen").innerHTML = '';
		}
	},
	binaryInverse : function(text)
	{
		text = Binary.binaryReverseInverse(text, 'inverse');
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(text, 'binary_inverse()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},
	binaryReverse : function(text)
	{
		text = Binary.binaryReverseInverse(text, 'reverse');
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(text, 'binary_reverse()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},
	binaryReverseInverse : function(text, operation)
	{
		return Binary.binaryReverseInverseShift(text, operation, 0);
	},
	binaryReverseInverseShift : function(text, operation, shiftpositions)
	{
		var text_is_hex = false;
		var text_is_base64 = false;
		
		var digits = Binary.getDigitsIfBinary(text);
		if(digits) {								//So this is binary
			//Do nothing
		}
		else if((text.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(text)) || (text.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(text))) { //Regular Hex
			//Test str: A8969393BD9E8C9AC9CB9A899A8DBD9AB691899A8D8C9E9D939AC0
			//alert('Use another function to convert Hex to Binary. Do not use ConvertBaseSimple.');
			text = ConvertBaseSimple.hex2bin(Tr(text,' '));
			text_is_hex = true;
		}
		else if(/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}(==)?|[A-Z0-9+\/]{3}=?)?$/i.test(text) ||		//Not else if because base32 is sometimes also tried if padding is missing
			/^(?:(==)?[A-Z0-9+\/]{2}|=?[A-Z0-9+\/]{3})?(?:[A-Z0-9+\/]{4})*$/i.test(text))				//Base64 or reverse(Base64) missing = padding compatible
		{
			//Test str: qJaTk72ejJrJy5qJmo29mraRiZqNjJ6dk5rA
			alert('Binary inverse or reverse doesn\'t work yet for base64 since it is decoded with UTF8 in between. #WIP');
			return false;

			//alert('Use another function to convert Hex to Binary. Do not use ConvertBaseSimple.');
			text = ConvertBaseSimple.hex2bin(ConvertBase.strToHex(Base64.b64_to_utf8_hex(text)));
			text_is_base64 = true;
		}
		else {
			return false;	//I don't know what to do with this
		}
		
		switch(operation)
		{
			case 'inverse': text = Binary.swap(text); break;
			case 'reverse': text = T_ReverseText(text); break;
			case 'shift':   text = S_ShiftText(text, shiftpositions); break;
			case 'nothing': text = text; break;
			default: alert('Error: Invalid operation parameter @binaryReverseInverse!'); return false; break;
		}
		
		if(text_is_hex) {
			//alert('Use another function to convert Binary to Hex. Do not use ConvertBaseSimple.');
			text = ConvertBaseSimple.binaryToHexadecimal(text);
		}
		else if(text_is_base64) {
			var temp = calcDecodeBinaryGetSteps(text, true);
			if(temp && temp.length) {
				text = Base64.utf8_to_b64(temp[0].value);
			}
			else
				alert('Error: cannot decode back to Base64 @binaryReverseInverse!');
		}
		
		return text;
	},
	replace : function(text, a, b)	// replace a with b
	{
		if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(a) < 0) a = '\\'+a;
		if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(b) < 0) b = '\\'+b;
		eval('text = text.replace(/'+a+'/g, "'+b+'");');
		return text;
	},
	replaceBoth : function(text, a, newa, b, newb)
	{
		if(a == newa && b == newb) {	//Nothing needs to be replaced
			return text;
		}
		else if(a == b || a == newb || b == newa)	//We can't simply replace a with newa and b with newb. 
		{
			var possible_intermediate_values = "ABCDEF";
			possible_intermediate_values = possible_intermediate_values.replace(a,'');
			possible_intermediate_values = possible_intermediate_values.replace(b,'');
			possible_intermediate_values = possible_intermediate_values.replace(newa,'');
			possible_intermediate_values = possible_intermediate_values.replace(newb,'');
			text = Binary.replace(text, a, possible_intermediate_values[0]);
			text = Binary.replace(text, b, possible_intermediate_values[1]);
			text = Binary.replace(text, possible_intermediate_values[0], newa);
			text = Binary.replace(text, possible_intermediate_values[1], newb);
		}
		else	//We can safely replace directly
		{
			text = Binary.replace(text, a, newa);
			text = Binary.replace(text, b, newb);
		}
		return text;
	},

	swap : function(text)	// replace a with b
	{
		var possible_intermediate_values = "ABC";
		var digits = Binary.getDigitsIfBinary(text);
		possible_intermediate_values = possible_intermediate_values.replace(digits[0],'');
		possible_intermediate_values = possible_intermediate_values.replace(digits[1],'');
		text = Binary.replace(text, digits[1], possible_intermediate_values[0]);
		text = Binary.replace(text, digits[0], digits[1]);
		return Binary.replace(text, possible_intermediate_values[0], digits[0]);
	},

	getDelimiters : function(finddelim) {
		var delimiterleft = '';
		var delimiterright = '';
		var stats = Binary.nrDifferentChars(finddelim);
		var total_different_chars = stats[0]+stats[1]+stats[2]+stats[3]+stats[4];
		if(total_different_chars == 0) {
			alert('decodeOctal(): How the heck did I get here.');
			return false;
		} else if(total_different_chars == 1) {								//Just one delimiter
			if(finddelim[0] == ' ' || finddelim[0] == ';') {
				delimiterright = finddelim[0];
			} else {
				delimiterleft = finddelim[0];
			}
		} else if(total_different_chars == 2) {								//Two delimiters. Examples: &#145 \x145 AB145 or L145(space)
			delimiterleft = finddelim[0];
			finddelim = finddelim.replace(delimiterleft,'');
			if((delimiterleft == '\\' && finddelim[0].contains('x','X','o','O')) || (delimiterleft == '&' && finddelim[0] == '#')) {
				delimiterleft += finddelim[0];
			} else {
				delimiterright = finddelim[0];
			}
		} else if (total_different_chars == 3 && (finddelim[2] == ' ' || finddelim[2] == ';')) {		//Three delimiters. Such as: &#145; \x145(space)
			delimiterleft = finddelim[0]+''+finddelim[1];
			delimiterright = finddelim[2];
		} else {
			return false;	//This is not supported
		}
		return [delimiterleft, delimiterright];
	}

};
