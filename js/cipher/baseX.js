
var REGEX_TEXTNUMBERSSPECIALCHARS = /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\s]*$/;
var REGEX_POSSIBLEFLAGCHARS = /^[0-9A-Za-z\(\)\{\}\[\]\.\!\?\-\_\ ]*$/;

//var MANIPULATE_inputstatistics = [];	//[words, lcase, ucase, numbers, symbols, spaces, cr, lf, other, last_was_whitespace, friedman]


//http://www.danvk.org/hex2dec.html
var ConvertBase = {					//Arbitrary base to arbitrary base

	// Adds two arrays for the given base (10 or 16), returning the result.
	// This turns out to be the only "primitive" operation we need.
	add : function(x, y, base) {
		var z = [];
		var n = Math.max(x.length, y.length);
		var carry = 0;
		var i = 0;
		while (i < n || carry) {
			var xi = i < x.length ? x[i] : 0;
			var yi = i < y.length ? y[i] : 0;
			var zi = carry + xi + yi;
			z.push(zi % base);
			carry = Math.floor(zi / base);
			i++;
		}
		return z;
	},

	// Returns a*x, where x is an array of decimal digits and a is an ordinary
	// JavaScript number. base is the number base of the array x.
	multiplyByNumber : function(num, x, base) {
		if (num < 0) return null;
		if (num == 0) return [];

		var result = [];
		var power = x;
		while (true) {
			if (num & 1) {
				result = ConvertBase.add(result, power, base);
			}
			num = num >> 1;
			if (num === 0) break;
			power = ConvertBase.add(power, power, base);
		}

		return result;
	},

	parseToDigitsArray : function(str, base) {
		var digits = str.split('');
		var ary = [];
		for (var i = digits.length - 1; i >= 0; i--) {
			var n = parseInt(digits[i], base);
			if (isNaN(n)) return null;
			ary.push(n);
		}
		return ary;
	},

	convert : function(str, fromBase, toBase) {
		var digits = ConvertBase.parseToDigitsArray(str, fromBase);
		if (digits === null) return null;

		var outArray = [];
		var power = [1];
		for (var i = 0; i < digits.length; i++) {
			// invariant: at this point, fromBase^i = power
			if (digits[i]) {
				outArray = ConvertBase.add(outArray, ConvertBase.multiplyByNumber(digits[i], power, toBase), toBase);
			}
			power = ConvertBase.multiplyByNumber(fromBase, power, toBase);
		}

		var out = '';
		for (var i = outArray.length - 1; i >= 0; i--) {
			out += outArray[i].toString(toBase);
		}
		return out;
	},

	b36ToHex : function(b36str) {
		var hex = ConvertBase.convert(b36str, 36, 16);
		if(hex.length%2==1)
			hex = '0'+hex;
		return hex;
	},

	hexToStr : function(hex) {
		var text = '';
		hex = hex.replace(/[\s[:punct:]]/g, '');
		for (var i = 0; (i+1) < hex.length; i += 2)
			text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return text;
	},
	strToHex : function(text) {	//http://stackoverflow.com/a/21648161
		return ByteArray.byteArrayToHex(ByteArray.stringToByteArray(text));
		/*var i;
		var hexes = text.match(/.{1,4}/g) || [];
		//if(hexes.length == 0 || hexes[0]=='\0')
		//	return false;

		var hex = "";
		for(i = 0; i<hexes.length; i++) {
		    hex += String.fromCharCode(parseInt(hexes[i], 16));
		}

		return hex;*/
	},
};

var BaseX = {

	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.encdec)
		{
			//window.setTimeout('BASE64_upd()', 100);
			return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);

		//var e = document.getElementById('BASE64_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			//e.innerHTML = 'Enter your text and see the converted message here!';
		}
		else
		{
			elements = ['binary_output_hex','hex_output_binary','binary_output_hex','octal1_output_hex','octal2_output_hex','octal1_output','octal2_output','decimal_output_hex','decimal_output','base32_output_hex','base32_output'];
			for(var i = 0; i < elements.length; i++)
				document.getElementById(elements[i]).innerHTML = '';
			
			Timer.start();
			var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
			try {
				if(digits) {
					var hexvalue = calcDecodeBinaryGetSteps(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue, digits[0], '0', digits[1], '1'), true);
					if(hexvalue && hexvalue.length && hexvalue[0]) {
						document.getElementById('ASCII_bin8bit').innerHTML = Teacher.analyzeValue(hexvalue, 'binToAscii()');

						var hexstring = ConvertBase.strToHex(hexvalue[0].value);
						document.getElementById('binary_output_hex').innerHTML = Teacher.analyzeValue(hexstring, 'binToHex()');
						Guesses.saveGuess(CertaintyEnum.DESPERATE, hexstring, 'binToHex()');	//Let's hope we never need to use this value
					}
					
					hexvalue = calcDecode7bitBinaryGetSteps(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue, digits[0], '0', digits[1], '1'), true);
					if(hexvalue && hexvalue.length && hexvalue[0]) {
						var certainty = (REGEX_FILE_TYPES.test(hexvalue[0].value) || REGEX_POSSIBLEFLAGCHARS.test(hexvalue[0].value)) ? 
																	CertaintyEnum.GUESS : 
																	(REGEX_TEXTNUMBERSSPECIALCHARS.test(hexvalue[0].value)?CertaintyEnum.WILDGUESS:CertaintyEnum.DESPERATE);
						document.getElementById('ASCII_bin7bit').innerHTML = Guesses.analyzeGuessAndGradeValue([hexvalue[0].value, certainty], 'bin_7bit_ascii()');
					}
				}
				else if((CURRENTSCRATCHPAD.realvalue.length%2 == 0 && /^((\\x|0x)?[0-9A-F]{2}){2,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) || 
							(CURRENTSCRATCHPAD.realvalue.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(CURRENTSCRATCHPAD.realvalue))) { //Regular Hex but not binary
					document.getElementById('hex_output_binary').innerHTML = Teacher.analyzeValue(ConvertBase.hex2bin(Tr(CURRENTSCRATCHPAD.realvalue,' ')), 'hexToBin()');
				}
			} catch(e) {}
			try {
				var octal1_value = calcDecodeOctal(CURRENTSCRATCHPAD.realvalue, true);
				document.getElementById('octal1_output_hex').innerHTML = Teacher.analyzeValue(ConvertBase.strToHex(octal1_value), 'Octal1_hex()');
				document.getElementById('octal1_output').innerHTML = Teacher.analyzeValue(octal1_value, 'Octal1()');

				var octal2_value = calcDecodeOctalRepr2(CURRENTSCRATCHPAD.realvalue, true);
				document.getElementById('octal2_output_hex').innerHTML = Teacher.analyzeValue(ConvertBase.strToHex(octal2_value), 'Octal2_hex()');
				document.getElementById('octal2_output').innerHTML = Teacher.analyzeValue(octal2_value, 'Octal2()');

				var octal3_value = calcDecodeOctalRepr3(CURRENTSCRATCHPAD.realvalue, true);
				document.getElementById('octal3_output_hex').innerHTML = Teacher.analyzeValue(ConvertBase.strToHex(octal3_value), 'Octal3_hex()');
				document.getElementById('octal3_output').innerHTML = Teacher.analyzeValue(octal3_value, 'Octal3()');
			} catch(e) {}
			try {
				var decimal_value = calcDecodeDecimal(CURRENTSCRATCHPAD.realvalue, true);
				document.getElementById('decimal_output_hex').innerHTML = Teacher.analyzeValue(ConvertBase.strToHex(decimal_value), 'Decimal_hex()');
				document.getElementById('decimal_output').innerHTML = Teacher.analyzeValue(decimal_value, 'Decimal()');
			} catch(e) {}
			try {
				var decimalRSA_value = calcDecodeDecimalRSA(CURRENTSCRATCHPAD.realvalue,true);
				//document.getElementById('decimalRSA_output_hex').innerHTML = Teacher.analyzeValue(/*DEPRECATED:ByteArray.byteArrayToHex(ByteArray.stringToByteArray*/ConvertBase.strToHex(decimalRSA_value), 'Decimal_RSA_hex()');
				document.getElementById('decimalRSA_output').innerHTML = Teacher.analyzeValue(decimalRSA_value, 'Decimal_RSA()');
			} catch(e) {}
			try {
				var textcpy = CURRENTSCRATCHPAD.realvalue;

				if(Global.InputType == InputTypeEnum.HEX)
				{
					if(textcpy.length%3 == 0 && /^([0-9A-F]{2}\s){3,}$/gi.test(textcpy))
						textcpy = textcpy.replace(/\s/g,'');

					document.getElementById('hex_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(textcpy), 'hexToString()');

					//document.getElementById('2bytehexbase100_output').innerHTML = Teacher.analyzeValue(calcDecode2byteHex(textcpy, true), '2bytehexbase100()');
					var output = calcDecode2byteHex(textcpy, true);
					document.getElementById('2bytehexbase100_output').innerHTML = '';
					if(output) {
						var certainty = (REGEX_POSSIBLEFLAGCHARS.test(output)) ? CertaintyEnum.GUESS : 
																	(REGEX_TEXTNUMBERSSPECIALCHARS.test(output)?CertaintyEnum.WILDGUESS:CertaintyEnum.DESPERATE);
						document.getElementById('2bytehexbase100_output').innerHTML = Guesses.analyzeGuessAndGradeValue([output, certainty], '2bytehexbase100()');
					}
				} 
				if (Global.InputType >= InputTypeEnum.ALPHA) {
					textcpy = ConvertBase.strToHex(textcpy);
				}

				if (Global.InputType >= InputTypeEnum.HEX) {
					var spaced = textcpy.replace(/([0-9A-F]{2})/gi, '$& ');
					document.getElementById('HEX_analysis_separate').innerHTML = textcpy.replace(/([0-9A-F]{2})/gi, '$& ');	// '<mark>$&</mark> 'class="sp"
					//document.getElementById('HEX_analysis_color').innerHTML = spaced.replace(/([0-18-9A-F][0-9A-F])/gi, '<mark>$&</mark>');
					document.getElementById('HEX_analysis_color').innerHTML =
							spaced.replace(/(2[0-9A-F]|3[A-F]|40|5[B-F]|60|7[B-E])/gi, '<mark class="me">$&</mark>'		//special characters
								).replace(/(3[0-9])/gi, '<mark class="lo">$&</mark>'									//numbers
								).replace(/(6[1-9A-F]|7[0-9A])/gi, '<mark class="sp">$&</mark>'		//lowercase
								).replace(/(4[1-9A-F]|5[0-9A])/gi, '<mark class="fi">$&</mark>'
								).replace(/([0-9A-F]{2})(?![^<]*>|[^<>]*<\/)/gi, '<mark class="no">$&</mark>'//(?![^<]*>|[^<>]*</)
								).replace(/[\r\n]/g, '<br>');	//uppercase
				} else {
					document.getElementById('HEX_analysis_separate').innerHTML = '';
					document.getElementById('HEX_analysis_color').innerHTML = '';
				}

			} catch(e) {}
			try {
				var base32_value = calcDecodeBase32(CURRENTSCRATCHPAD.realvalue, true);
				document.getElementById('base32_output_hex').innerHTML = Teacher.analyzeValue(/*DEPRECATED:ByteArray.byteArrayToHex(ByteArray.stringToByteArray*/ConvertBase.strToHexy(base32_value), 'Base32_hex()');
				document.getElementById('base32_output').innerHTML = Teacher.analyzeValue(base32_value, 'Base32()');
			} catch(e) {}
			try {
				var base36_hex = ConvertBase.b36ToHex(CURRENTSCRATCHPAD.realvalue);
				document.getElementById('base36_output_hex').innerHTML = Teacher.analyzeValue(base36_hex, 'Base36_hex()');
				document.getElementById('base36_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(base36_hex), 'Base36()');
			} catch(e) {}
			try {
				var base58_value = Base58.decode(CURRENTSCRATCHPAD.realvalue);
				document.getElementById('base58_output_hex').innerHTML = Teacher.analyzeValue(ConvertBase.strToHex(base58_value), 'Base58_hex()');
				document.getElementById('base58_output').innerHTML = Teacher.analyzeValue(base58_value, 'Base58()');
			} catch(e) {}
			//try {
				var ascii85_value = calcDecodeASCII85(CURRENTSCRATCHPAD.realvalue, true);
				if(REGEX_FILE_TYPES.test(ascii85_value) || REGEX_TEXTNUMBERSSPECIALCHARS.test(ascii85_value)) {
					document.getElementById('ASCII85_hex_output').innerHTML = Teacher.analyzeValue(/*DEPRECATED:ByteArray.byteArrayToHex(ByteArray.stringToByteArray*/ConvertBase.strToHex(ascii85_value), 'ASCII85_hex()');
					document.getElementById('ASCII85_output').innerHTML = Teacher.analyzeValue(ascii85_value, 'ASCII85()');
				}
			//} catch(e) {}
			Timer.stop("BaseX functions - Eight");

			Timer.start();
			BaseX.shiftOrSwitchChars();
			BaseX.hexBinaryInverseReverse();
			Timer.stop("Shift, switch, hex inv+reverse function - Ten");
		}
	},

	switchChars : function(text)
	{
		var output = '';
		for (var i = 0; (i+1) < text.length; i+=2) {
			output += text[i+1]+text[i];
		}
		return output;
	},

	shiftOrSwitchChars : function()
	{
		var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
		
		try {
			document.getElementById('SHIFT_output').innerHTML = '';
			if(Global.Enable.Shift)
			{
				if((/*CURRENTSCRATCHPAD.realvalue.length%8 == 0 && */digits) || (CURRENTSCRATCHPAD.realvalue.length%2 == 0 && /^((\\x|0x)?[0-9A-F]{2}){2,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) || 
							 (CURRENTSCRATCHPAD.realvalue.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(CURRENTSCRATCHPAD.realvalue)))
				{
					for (var i = 1; i < 8; i++) {
						var output = Binary.binaryReverseInverseShift(CURRENTSCRATCHPAD.realvalue, 'shift', i);
						var asciioutput = '';
						if(digits) {
							asciioutput = calcDecodeBinaryGetResult(Binary.replaceBoth(output, digits[0], '0', digits[1], '1'));
						} else {
							asciioutput = ConvertBase.hexToStr(output);
						}
						document.getElementById('SHIFT_output').innerHTML += Teacher.analyzeValue(output, 'shift('+i+')')+'<br>';
						if(asciioutput && (REGEX_FILE_TYPES.test(asciioutput) || REGEX_TEXTNUMBERSSPECIALCHARS.test(asciioutput))){
							Guesses.saveGuess(digits?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.GUESS, asciioutput, 'binary_shift_toAscii('+i+')');
							document.getElementById('SHIFT_output').innerHTML += Teacher.analyzeValue(asciioutput, 'binary_shift_toAscii('+i+')')+'<br>';
						}
						document.getElementById('SHIFT_output').innerHTML += '<br>';
					}
				}
			}
		} catch(e) {}
		try {

			document.getElementById('SWITCH_output').innerHTML = '';
			if(Global.Enable.Switch)
			{
				var output = BaseX.switchChars(CURRENTSCRATCHPAD.realvalue);
				if(CURRENTSCRATCHPAD.realvalue.length%2 == 1)
					output += CURRENTSCRATCHPAD.realvalue.substr(-1);

				document.getElementById('SWITCH_output').innerHTML += Teacher.analyzeValue(output, 'switch()')+'<br>';
				if((/*CURRENTSCRATCHPAD.realvalue.length%8 == 0 && */digits) || (CURRENTSCRATCHPAD.realvalue.length%2 == 0 && /^((\\x|0x)?[0-9A-F]{2}){2,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) || 
							 (CURRENTSCRATCHPAD.realvalue.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(CURRENTSCRATCHPAD.realvalue)))
				{
					var asciioutput = '';
					if(digits) {
						asciioutput = calcDecodeBinaryGetResult(Binary.replaceBoth(output, digits[0], '0', digits[1], '1'));
					} else {
						asciioutput = ConvertBase.hexToStr(output);
					}
					if(asciioutput && (REGEX_FILE_TYPES.test(asciioutput) || REGEX_TEXTNUMBERSSPECIALCHARS.test(asciioutput))){
						Guesses.saveGuess(digits?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.GUESS, asciioutput, 'switch_toAscii()');
						document.getElementById('SWITCH_output').innerHTML += Teacher.analyzeValue(asciioutput, 'switch_toAscii()')+'<br>';
					}
				}
			}
		} catch(e) {}
	},
	
	hexBinaryInverseReverse : function()
	{
		var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
		
		try {
			var output = '';
			var asciioutput = '';
			document.getElementById('HEXBIN_INV_REV_output').innerHTML = '';
			if(!digits && ( (CURRENTSCRATCHPAD.realvalue.length%2 == 0 && /^((\\x|0x)?[0-9A-F]{2}){2,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) || 
							(CURRENTSCRATCHPAD.realvalue.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) ))
			{
				output = Binary.binaryReverseInverse(CURRENTSCRATCHPAD.realvalue, 'inverse');
				asciioutput = ConvertBase.hexToStr(output);
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(output, 'hex_binaryinverse()')+'<br>';
				if(asciioutput && (REGEX_FILE_TYPES.test(asciioutput) || REGEX_TEXTNUMBERSSPECIALCHARS.test(asciioutput))){
					Guesses.saveGuess(digits?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.GUESS, asciioutput, 'hex_binaryinverse()');
					document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(asciioutput, 'hex_binaryinverse()')+'<br>';
				}
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += '<br>';


				output = Binary.binaryReverseInverse(CURRENTSCRATCHPAD.realvalue, 'reverse');
				asciioutput = ConvertBase.hexToStr(output);
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(output, 'hex_binaryreverse()')+'<br>';
				if(asciioutput && (REGEX_FILE_TYPES.test(asciioutput) || REGEX_TEXTNUMBERSSPECIALCHARS.test(asciioutput))){
					Guesses.saveGuess(digits?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.GUESS, asciioutput, 'hex_binaryreverse()');
					document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(asciioutput, 'hex_binaryreverse()')+'<br>';
				}
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += '<br>';

				output = Binary.binaryReverseInverse(output, 'inverse');
				asciioutput = ConvertBase.hexToStr(output);
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(output, 'hex_binaryinversereverse()')+'<br>';
				if(asciioutput && (REGEX_FILE_TYPES.test(asciioutput) || REGEX_TEXTNUMBERSSPECIALCHARS.test(asciioutput))){
					Guesses.saveGuess(digits?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.GUESS, asciioutput, 'hex_binaryinversereverse()');
					document.getElementById('HEXBIN_INV_REV_output').innerHTML += Teacher.analyzeValue(asciioutput, 'hex_binaryinversereverse()')+'<br>';
				}
				document.getElementById('HEXBIN_INV_REV_output').innerHTML += '<br>';
			}
		} catch(e) {}
	},
};




function decodeBinary(originaltext)	//With autochecker for auto binary check
{
	var digits = Binary.getDigitsIfBinary(originaltext);
	return calcDecodeBinaryGetResult(Binary.replaceBoth(originaltext, digits[0], '0', digits[1], '1'));
}
function decodeBinaryGetSteps(originaltext)	//With autochecker for auto binary check
{
	var digits = Binary.getDigitsIfBinary(originaltext);
	return calcDecodeBinaryGetSteps(Binary.replaceBoth(originaltext, digits[0], '0', digits[1], '1'));
}

function calcDecodeBinaryGetResult(originaltext)
{
	var ret = calcDecodeBinaryGetSteps(originaltext);
	if(ret && $.isArray(ret) && ret.length>0){
		return ret[ret.length-1].value;
	}
	return false;
}
function calcDecodeBinaryGetSteps(originaltext, noOutputValidation)
{
	var res = false;
	var text;
	var digits = Binary.getDigitsIfBinary(originaltext);
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	if(digits) {
		originaltext = originaltext.replace(/[ \r\n]+/g, "");
		if(digits[0] != '0' || digits[1] != '1') {
			alert('calcDecodeBinary(input) should run with 0\'s and 1\'s. Use decodeBinary instead');
		}
		text = originaltext;
		eval("res = text.match(/["+digits[0]+''+digits[1]+"]{8}/g);");
		if(res) res = res.map(function(v){return String.fromCharCode( parseInt(v,2) );}).join('');	//non-digit-reversed non-string-reversed
		if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
			return [Teacher.analyzeValueDoNotSaveGrade(res, 'binary()')];
			//return res;
		} else {
			text = Binary.swap(originaltext);
			eval("res = text.match(/["+digits[0]+''+digits[1]+"]{8}/g);");
			if(res) res = res.map(function(v){return String.fromCharCode( parseInt(v,2) );}).join('');//digit-reversed non-string-reversed
			if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
				return [Teacher.analyzeValueDoNotSaveGrade(Binary.swap(originaltext), 'inverse()'), Teacher.analyzeValueDoNotSaveGrade(res, 'binary()')];
				//return res;
			} else {
				text = T_ReverseText(originaltext);
				eval("res = text.match(/["+digits[0]+''+digits[1]+"]{8}/g);");
				if(res) res = res.map(function(v){return String.fromCharCode( parseInt(v,2) );}).join('');//non-digit-reversed string-reversed
				if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
					return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(originaltext), 'reverse()'), Teacher.analyzeValueDoNotSaveGrade(res, 'binary()')];
					//return res;
				} else {
					text = Binary.swap(T_ReverseText(originaltext));
					eval("res = text.match(/["+digits[0]+''+digits[1]+"]{8}/g);");
					if(res) res = res.map(function(v){return String.fromCharCode( parseInt(v,2) );}).join('');//digit-reversed string-reversed
					if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
						return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(originaltext), 'reverse()'), 
								Teacher.analyzeValueDoNotSaveGrade(Binary.swap(T_ReverseText(originaltext)), 'inverse()'), 
								Teacher.analyzeValueDoNotSaveGrade(res, 'binary()')];
						//return res;
					} else {
						return false;
					}
				}
			}
		}
	}
	return false;
}

function calcDecode7bitBinaryGetSteps(originaltext, noOutputValidation)
{
	var res = false;
	var text;
	var digits = Binary.getDigitsIfBinary(originaltext);
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	if(digits) {
		originaltext = originaltext.replace(/[ \r\n]+/g, "");
		if(digits[0] != '0' || digits[1] != '1') {
			alert('calcDecode7bitBinaryGetSteps(input) should run with 0\'s and 1\'s. Use decodeBinary instead');
		}
		eval("text = originaltext.replace(/(["+digits[0]+''+digits[1]+"]{7})/g, '0$&');");
		eval("res = text.match(/["+digits[0]+''+digits[1]+"]{8}/g);");
		if(res) res = res.map(function(v){return String.fromCharCode( parseInt(v,2) );}).join('');
		if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
			return [Teacher.analyzeValueDoNotSaveGrade(res, 'bin_7bit_ascii()')];
			//return res;
		} else {
			return false;
		}
	}
	return false;
}

function decodeOctal(text)
{
	var temp = calcDecodeOctal(text);
	if(temp)
		return temp;
	temp = calcDecodeOctal(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeOctalGetSteps(text)
{
	var temp = calcDecodeOctal(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal1()')];
	temp = calcDecodeOctal(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal1()')];
	return false;
}
function calcDecodeOctal(text, noOutputValidation)	//After http://textmechanic.com/ASCII-Hex-Unicode-Base64-Converter.html
{
	text = text.replace(/\r/gi,'').replace(/\n/gi,'');
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([^0-8]{0,2}[0-8]{3}[^0-8]{0,1})+$/gi.test(text) || /^([^0-8]{0,2}[0-8]{4}[^0-8]{0,1})+$/gi.test(text))
	{
		var delimiterleft = '';
		var delimiterright = '';
		if(!(/^[0-8]+$/gi.test(text)))
		{
			//First we need to determine if delimiters are used, and which are used.
			var delims = false, finddelim = text.replace(/[0-8]{3,4}/gi,'');
			if(finddelim.length && (delims = Binary.getDelimiters(finddelim))) {
				delimiterleft = delims[0];
				delimiterright = delims[1];
			} else {
				return false;
			}
		} else {
			text = text.chunk(3).join(' ');
			delimiterright = ' ';
		}
		
		if(delimiterright == ' ' && text.slice(-1) != ' ') {
			text += ' ';
		}
		
		var delimiter = delimiterright + delimiterleft;
		
		//Now, lets decode this
		text = text.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
		var textarr = text.split(delimiter);
		var textarrlen = textarr.length;
		var textarrout = new Array();
		for(var x=0;x<textarrlen;x++){
			textarrout[x] = String.fromCharCode(parseInt(textarr[x],8));
		}
		
		var textout = textarrout.join('');
		if(textout && (REGEX_FILE_TYPES.test(textout) || REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		} /*else {
			alert('calcDecodeOctal() Doesn\'t pass exit regex:'+textout);
		}*/
	} /*else {
		alert('calcDecodeOctal() Doesn\'t pass entry regex');
	}*/
	return false;
}
function decodeOctalRepr2(text)
{
	var temp = calcDecodeOctalRepr2(text);
	if(temp)
		return temp;
	temp = calcDecodeOctalRepr2(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeOctalRepr2GetSteps(text)
{
	var temp = calcDecodeOctalRepr2(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal2()')];
	temp = calcDecodeOctalRepr2(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal2()')];
	return false;
}
function calcDecodeOctalRepr2(text, noOutputValidation)	//After https://paulschou.com/tools/xlate/
{
	text = text.replace(/\r/gi,'').replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([^0-8]{0,2}[0-8]{8}[^0-8]{0,1})+([0-8]{3}|[0-8]{6})?$/gi.test(text))
	{
		var delimiterleft = '';
		var delimiterright = '';
		if(!(/^[0-8]+$/gi.test(text)))
		{
			//First we need to determine if delimiters are used, and which are used.
			var delims = false, finddelim = text.replace(/[0-8]/gi,'');
			if(finddelim.length && (delims = Binary.getDelimiters(finddelim))) {
				delimiterleft = delims[0];
				delimiterright = delims[1];
			} else {
				return false;
			}
		} else {
			text = text.chunk(8).join(' ');
			delimiterright = ' ';
		}
		
		if(delimiterright == ' ' && text.slice(-1) != ' ') {
			text += ' ';
		}
		
		var delimiter = delimiterright + delimiterleft;
		
		//Now, lets decode this
		text = text.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
		var textarr = text.split(delimiter);
		var textarrlen = textarr.length;
		var textarrout = new Array();
		var charint;
		for(var x=0;x<textarrlen;x++){
			charint  = parseInt(textarr[x][0],8)<<5;
			charint += parseInt(textarr[x][1],8)<<2;
			charint += parseInt(textarr[x][2],8)>>1;
			textarrout[x*3+0] = String.fromCharCode(charint);
			if(textarr[x].length <= 3) break;
			charint  = (parseInt(textarr[x][2],8)&0x1)<<7;
			charint += parseInt(textarr[x][3],8)<<4;
			charint += parseInt(textarr[x][4],8)<<1;
			charint += parseInt(textarr[x][5],8)>>2;
			textarrout[x*3+1] = String.fromCharCode(charint);
			if(textarr[x].length <= 6) break;
			charint  = (parseInt(textarr[x][5],8)&0x3)<<6;
			charint += parseInt(textarr[x][6],8)<<3;
			charint += parseInt(textarr[x][7],8)<<0;
			textarrout[x*3+2] = String.fromCharCode(charint);
		}
		
		var textout = textarrout.join('');
		if(textout && (REGEX_FILE_TYPES.test(textout) || REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		}/* else {
			alert('calcDecodeOctalRepr2() Doesn\'t pass exit regex:'+textout);
		}*/
	}/* else {
		alert('calcDecodeOctalRepr2() Doesn\'t pass entry regex');
	}*/
	return false;
}
function decodeOctalRepr3(text)
{
	var temp = calcDecodeOctalRepr3(text);
	if(temp)
		return temp;
	temp = calcDecodeOctalRepr3(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeOctalRepr3GetSteps(text)
{
	var temp = calcDecodeOctalRepr3(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal3()')];
	temp = calcDecodeOctalRepr3(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'Octal3()')];
	return false;
}
function calcDecodeOctalRepr3(text, noOutputValidation)	//After https://cryptii.com/text/octal
{
	text = text.replace(/\r/gi,'').replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([^0-8]{0,2}[0-2]?[0-8]{2}[^0-8]{0,1})+([0-2]?[0-8]{2})?$/gi.test(text))
	{
		var delimiterleft = '';
		var delimiterright = '';
		if(!(/^[0-8]+$/gi.test(text)))
		{
			//First we need to determine if delimiters are used, and which are used.
			var delims = false, finddelim = text.replace(/[0-8]/gi,'');
			if(finddelim.length && (delims = Binary.getDelimiters(finddelim))) {
				delimiterleft = delims[0];
				delimiterright = delims[1];
			} else {
				return false;
			}
		} else {
			text = text.chunk(8).join(' ');
			delimiterright = ' ';
		}
		
		if(delimiterright == ' ' && text.slice(-1) != ' ') {
			text += ' ';
		}
		
		var delimiter = delimiterright + delimiterleft;
		
		//Now, lets decode this
		text = text.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
		var textarr = text.split(delimiter);
		var textarrlen = textarr.length;
		var textout = '';
		var decimal;
		for (var i = 0; i < textarrlen; i ++) {
			decimal = parseInt(textarr[i], 8);

			if (isNaN(decimal)) {
				return false;
			} else {
				textout += String.fromCharCode(decimal);
			}
		}
		
		if(textout && (REGEX_FILE_TYPES.test(textout) || REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		}/* else {
			alert('calcDecodeOctalRepr3() Doesn\'t pass exit regex:'+textout);
		}*/
	}/* else {
		alert('calcDecodeOctalRepr3() Doesn\'t pass entry regex');
	}*/
	return false;
}

function decodeBase32(text)
{
	var temp = calcDecodeBase32(text);
	if(temp)
		return temp;
	temp = calcDecodeBase32(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeBase32GetSteps(text)
{
	var temp = calcDecodeBase32(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'Base32()')];
	temp = calcDecodeBase32(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'Base32()')];
	return false;
}
function calcDecodeBase32(input, noOutputValidation)
{
	//http://tomeko.net/online_tools/base32.php?lang=en
	var text = input.toUpperCase();

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
	
	var cleaned = "";
	var myRegExp = /[A-Z0-7]/;
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	for (i=0; i<text.length; i++) {
		var ch = text.charAt(i);
		if (ch == '0') {
			ch = 'O';
		} else if (ch == '1') {
			ch = 'L';
		} else if (ch == '8') {
			ch = 'B';
		} else if (myRegExp.test(ch) == false) {
			continue;
		}
		cleaned += ch;          
	}
	text = cleaned;
	
	
	//Start decode
	var buffer = 0;
	var bitsLeft = 0;    
	var output = "";
	var i = 0;
	
	while (i < text.length) {
		var val = keyStr.indexOf(text.charAt(i++));
		if (val >= 0 && val < 32) {
			buffer <<= 5;
			buffer |= val;
			bitsLeft += 5;
			if (bitsLeft >= 8) {
				output += String.fromCharCode((buffer >> (bitsLeft - 8)) & 0xFF);
				bitsLeft -= 8;
			}
		}
	}
	
	/*if (bitsLeft > 0) {
		alert("Warning: input data is not a multiple of 8 bits, ");    
	}*/
	
	if(output && (REGEX_FILE_TYPES.test(output) || REGEX_TEXTNUMBERSSPECIALCHARS.test(output) || noOutputValidation)) {
		return output;
	}
	
	return false;
}

function decodeASCII85(text)
{
	var temp = calcDecodeASCII85(text);
	if(temp)
		return temp;
	temp = calcDecodeASCII85(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeASCII85GetSteps(text)
{
	var temp = calcDecodeASCII85(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'ASCII85()')];
	temp = calcDecodeASCII85(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'ASCII85()')];
	return false;
}
function calcDecodeASCII85(input, noOutputValidation)
{
	//http://pastie.org/pastes/695197#75
	var text = input;
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	//assertOrBadInput ((text.slice(0,2) === '<~') && (text.slice(-2) === '~>'), 'Invalid initial/final ascii85 characters');
	if((text.slice(0,2) === '<~') && (text.slice(-2) === '~>')) {
		text = text.slice(2,-2);
	}
	// kill whitespace, handle special 'z' case
	text = text.replace(/\s/g, '').replace('z', '!!!!!');
	//assertOrBadInput(!(/[^\x21-\x75]/.test(text)), 'Input contains out-of-range characters.');
	if(/[^\x21-\x75]/.test(text) && ! noOutputValidation)
		return false;
	
	var padding = '\x75\x75\x75\x75\x75'.slice((text.length % 5) || 5);
	text += padding; // pad with 'u'
	var newchars, out_array = [];
	var pow1 = 85, pow2 = 85*85, pow3 = 85*85*85, pow4 = 85*85*85*85;
	for (var i=0, n=text.length; i < n; i+=5) {
		newchars = (
			((text.charCodeAt(i)   - 0x21) * pow4) +
			((text.charCodeAt(i+1) - 0x21) * pow3) +
			((text.charCodeAt(i+2) - 0x21) * pow2) +
			((text.charCodeAt(i+3) - 0x21) * pow1) +
			((text.charCodeAt(i+4) - 0x21)));
		out_array.push(
			(newchars >> 030) & 0xFF,
			(newchars >> 020) & 0xFF,
			(newchars >> 010) & 0xFF,
			(newchars)        & 0xFF);
	};
	shorten(out_array, padding.length);
	
	var output = String.fromCharCode.apply(String, out_array);
	if(output && (/*REGEX_FILE_TYPES.test(output) || */REGEX_TEXTNUMBERSSPECIALCHARS.test(output) || noOutputValidation)) {
		return output;
	}
	return false;
}

function decodeDecimal(text)
{
	var temp = calcDecodeDecimal(text);
	if(temp)
		return temp;
	temp = calcDecodeDecimal(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeDecimalGetSteps(text)
{
	var temp = calcDecodeDecimal(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'decimal()')];
	temp = calcDecodeDecimal(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'decimal()')];
	return false;
}
function calcDecodeDecimal(text, noOutputValidation)
{
	//http://textmechanic.com/ASCII-Hex-Unicode-Base64-Converter.html
	text = text.replace(/\r\n/gi,'');//.replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([^0-9A-F]{0,2}[0-9]{2,3}[^0-9A-F]{0,1})+$/gi.test(text))
	{
		var delimiterleft = '';
		var delimiterright = '';
		if(!(/^[0-9]+$/gi.test(text)))
		{
			//First we need to determine if delimiters are used, and which are used.
			var delims = false, finddelim = text.replace(/[0-9]{2,4}/gi,'');
			if(finddelim.length && (delims = Binary.getDelimiters(finddelim))) {
				delimiterleft = delims[0];
				delimiterright = delims[1];
			} else {
				return false;
			}
		} else {
			return false;
		}
		
		if(delimiterright == ' ' && text.slice(-1) != ' ') {
			text += ' ';
		}
		
		var delimiter = delimiterright + delimiterleft;
		
		//Now, lets decode this
		text = text.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
		var textarr = text.split(delimiter);
		var textarrlen = textarr.length;
		var textarrout = new Array();
		for(var x=0;x<textarrlen;x++){
			textarrout[x] = String.fromCharCode(textarr[x]);
		}
		
		var textout = textarrout.join('');
		if(textout && (REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		} /*else {
			alert('calcDecodeDecimal() Doesn\'t pass exit regex:'+textout);
		}*/
	} /*else {
		alert('calcDecodeDecimal() Doesn\'t pass entry regex');
	}*/
	return false;
}

function decodeDecimalRSA(text)
{
	var temp = calcDecodeDecimalRSA(text);
	if(temp)
		return temp;
	temp = calcDecodeDecimalRSA(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeDecimalRSAGetSteps(text)
{
	var temp = calcDecodeDecimalRSA(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'decimal_RSA()')];
	temp = calcDecodeDecimalRSA(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'decimal_RSA()')];
	return false;
}
function calcDecodeDecimalRSA(text, noOutputValidation)
{
	text = text.replace(/\ \r\n/gi,'');//.replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^[0-9]+$/gi.test(text))
	{
		var dec = text.toString().split(''), sum = [], hex = [], i, s;
		while(dec.length){
			s = 1 * dec.shift();
			for(i = 0; s || i < sum.length; i++){
				s += (sum[i] || 0) * 10;
				sum[i] = s % 16;
				s = (s - sum[i]) / 16;
			}
		}
		while(sum.length){
			hex.push(sum.pop().toString(16));
		}
		hex = hex.join('');

		var textout = ConvertBase.hexToStr(hex);
		if(textout && (REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		}
		/*else {
			alert('calcDecodeDecimal() Doesn\'t pass exit regex:'+textout);
		}*/
	} /*else {
		alert('calcDecodeDecimal() Doesn\'t pass entry regex');
	}*/
	return false;
}

function decodeAlphabeticalIndex(text)
{
	var temp = calcToAlphabeticalIndex(text);
	if(temp)
		return temp;
	temp = calcToAlphabeticalIndex(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decodeAlphabeticalGetSteps(text)
{
	var temp = calcToAlphabeticalIndex(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, 'alphabetical()')];
	temp = calcToAlphabeticalIndex(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'alphabetical()')];
	return false;
}
function calcToAlphabeticalIndex(text, noOutputValidation)
{
	//http://textmechanic.com/ASCII-Hex-Unicode-Base64-Converter.html
	text = text.replace(/\r/gi,'').replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([^0-9]{0,2}([0|1|2][0-9])[^0-9]{0,1})+$/gi.test(text) || /^([^0-9]{0,2}([|1|2][0-9])[^0-9]{0,1})+$/gi.test(text))
	{
		var delimiterleft = '';
		var delimiterright = '';
		if(!/^([0|1|2][0-9])+$/gi.test(text))
		{
			//First we need to determine if delimiters are used, and which are used.
			var delims = false, finddelim = text.replace(/[0-9]{2,4}/gi,'');
			if(finddelim.length && (delims = Binary.getDelimiters(finddelim))) {
				delimiterleft = delims[0];
				delimiterright = delims[1];
			} else {
				return false;
			}
		} else {
			text = text.chunk(2).join(' ');
			delimiterright = ' ';
			//return false;
		}
		
		if(delimiterright == ' ' && text.slice(-1) != ' ') {
			text += ' ';
		}
		
		var delimiter = delimiterright + delimiterleft;
		
		//Now, lets decode this
		text = text.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
		var textarr = text.split(delimiter);
		var textarrlen = textarr.length;
		var textarrout = new Array();
		for(var x=0;x<textarrlen;x++) {
			if(textarr[x].length > 2) {		//Decode one word
				var temp = textarr[x].chunk(2).join(' ')+' ';
				delimiterright = ' ';
				temp = temp.replace(delimiterleft,'').split('').reverse().join('').replace(delimiterright.split('').reverse().join(''),'').split('').reverse().join('');
				var temparr = temp.split(delimiterright + delimiterleft);
				textarrout[x] = '';
				for(var y=0;y<temparr.length;y++) {
					textarrout[x] += String.fromCharCode(97+parseInt(temparr[y],10));
				}
			} else {						//Decode just one letter
				textarrout[x] = String.fromCharCode(97+parseInt(textarr[x],10));
			}
		}
		
		var textout = textarrout.join('');
		if(textout && (REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		}/* else {
			alert('calcToAlphabeticalIndex() Doesn\'t pass exit regex:'+textout);
		}*/
	}/* else {
		alert('calcToAlphabeticalIndex() Doesn\'t pass entry regex');
	}*/
	return false;
}


function decode2byteHex(text)
{
	var temp = calcDecode2byteHex(text);
	if(temp)
		return temp;
	temp = calcDecode2byteHex(T_ReverseText(text));
	if(temp)
		return temp;
	return false;
}
function decode2byteHexGetSteps(text)
{
	var temp = calcDecode2byteHex(text);
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(temp, '2byteHex()')];
	temp = calcDecode2byteHex(T_ReverseText(text));
	if(temp)
		return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, '2byteHex()')];
	return false;
}
function calcDecode2byteHex(text, noOutputValidation)
{
	text = text.replace(/\s/gi,'');//.replace(/\n/gi,'');
	
	noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
	
	if(/^([0-2][0-9a-f]{3})+$/gi.test(text))  //if(/^([0-9a-f]{4})+$/gi.test(text))
	{
		var textout = '';
		for(var i = 0; i < text.length; i += 4){
			var doublebyte = text.substring(i, i+4);
			var intdoublebyte = parseInt(doublebyte,16);
			var firstchar = Math.floor(intdoublebyte / 100);
			var secondchar = intdoublebyte % 100;
			textout += String.fromCharCode(firstchar) + String.fromCharCode(secondchar);
			//textout += decodeDecimalRSA(intdoublebyte.toString(), true);
		}

		if(textout && (REGEX_TEXTNUMBERSSPECIALCHARS.test(textout) || noOutputValidation)) {
			return textout;
		}
		/*else {
			alert('calcDecode2byteHex() Doesn\'t pass exit regex:'+textout);
		}*/
	} /*else {
		alert('calcDecode2byteHex() Doesn\'t pass entry regex');
	}*/
	return false;
}






//https://gist.github.com/faisalman/4213592
var ConvertBaseSimple = function (num) {
	return {
		from : function (baseFrom) {
			return {
				to : function (baseTo) {
					return parseInt(num, baseFrom).toString(baseTo);
				}
			};
		}
	};
};
//PROTECT1MYC
//A55A0FF088123227
//10100101010110100000111111110000 10001000000100100011001000100111
//1010010101011010000011111111000010001000000100100011001000100111
ConvertBaseSimple.hex2bin = function (num) {
	var out = "";
	for(var i = 0; i < num.length; i++)
		out += ConvertBaseSimple.convertFromBaseToBase(num[i],16,2).toString();
	return out;
};
//one function for all converter
ConvertBaseSimple.convertFromBaseToBase = function(str, fromBase, toBase){
	
	if(str.trim()!=""){
		//var result = ConvertBaseSimple(str).from(fromBase).to(toBase);
    	var num = parseInt(str, fromBase);
    	var result=num.toString(toBase);
  
    	if(result.toString()=="NaN"){
    		//console.error('Invalid input @ ConvertBaseSimple.convertFromBaseToBase ('+str+')');
    		return false; //result="<i>Invalid input</i>";
    	}
    	//else if(toBase == 16 && result.length<2) {
		//	result = ("00"+result).substr(result.length, result.length+2);
		//}
		else if(toBase == 2 && result.length<4) {
			result = ("0000"+result).substr(result.length, result.length+4);
		}
		return result;
	}
    else
    {
		return;	
    }
};
ConvertBaseSimple.binaryToHexadecimal = function(str)
{
	var out = "";
	for(var i = 0; i+3 < str.length; i+=4)
		out += ConvertBaseSimple.convertFromBaseToBase(str.substring(i,i+4),2,16).toString();
	return out;
};
ConvertBaseSimple.binaryToUTF8 = function(str)
{
	var out = "";
	for(var i = 0; i+7 < str.length; i+=8)
		out += ConvertBaseSimple.convertFromBaseToBase(str.substring(i,i+8),2,256).toString();
	return out;
};

