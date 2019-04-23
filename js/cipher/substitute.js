var Substitute = {
	
	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			return;
		}
		
		var elem = 0, out = '';

		if (CURRENTSCRATCHPAD.realvalue != "")
		{
			if (Global.Enable.Keyboardshift) {
				Timer.start();

				out = '';
				elem = document.getElementById('KEYBOARDSHIFT_right_output');
				for(var i = 1; i < keyboardshift_bruteF_range; i++)
					out += Teacher.analyzeValue(Substitute.keyboardshift(CURRENTSCRATCHPAD.realvalue, i), 'keyboardshift'+i+'()')+'<br><br>';
				elem.innerHTML = out;
					
				out = '';
				elem = document.getElementById('KEYBOARDSHIFT_left_output');
				for(var i = -1; i > -keyboardshift_bruteF_range; i--)
					out += Teacher.analyzeValue(Substitute.keyboardshift(CURRENTSCRATCHPAD.realvalue, i), 'keyboardshift'+i+'()')+'<br><br>';
				elem.innerHTML = out;

				Timer.stop("Keyboardshift - Two");
			}
			
			if (Global.Enable.Goldenbug) {
				Timer.start();
				elem = document.getElementById('GOLDENBUG_output');
				if (Global.InputType == InputTypeEnum.HEX) {

					//This functionality doesn't work fully yet!!!! It is because weird UTF8 chars aren't encodeable and/or decodeable easily (how I tried until now)


					//var textcpy = CURRENTSCRATCHPAD.realvalue;
					/*if (textcpy.length % 3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(textcpy))
						textcpy = textcpy.replace(/[\s[:punct:]]/g, '');*/
					//var temp = ByteArray.byteArrayToString(ByteArray.hexToByteArray(textcpy));
					/*var temp = '';
					for (var i = 0; (i+1) < textcpy.length; i += 2)
						temp += String.fromCharCode(parseInt(textcpy.substr(i, 2), 16));*/

					var temp = ConvertBase.hexToStr(CURRENTSCRATCHPAD.realvalue);
					elem.innerHTML = Teacher.analyzeValue(Substitute.goldenBug(temp), 'goldenbug()');
				} else {
					/*if(CURRENTSCRATCHPAD.realvalue != ByteArray.byteArrayToString(ByteArray.hexToByteArray(ByteArray.byteArrayToHex(ByteArray.stringToByteArray(CURRENTSCRATCHPAD.realvalue)))))
						alert("Not the same\r\n"+CURRENTSCRATCHPAD.realvalue+"\r\n"+ByteArray.byteArrayToString(ByteArray.hexToByteArray(ByteArray.byteArrayToHex(ByteArray.stringToByteArray(CURRENTSCRATCHPAD.realvalue)))));*/
					elem.innerHTML = Teacher.analyzeValue(Substitute.goldenBug(CURRENTSCRATCHPAD.realvalue), 'goldenbug()');
				}
				Timer.stop("Goldenbug - Single");
			}
			if (Global.Enable.SpiritDVD) {
				Timer.start();
				var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
				if(digits) {
					elem = document.getElementById('SPIRITDVD_output');
					elem.innerHTML = Teacher.analyzeValue(Substitute.spiritDVD(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue, digits[0], '-', digits[1], '1')), 'spiritDVD()')+'<br>'+
									 Teacher.analyzeValue(Substitute.spiritDVD(Binary.replaceBoth(T_ReverseText(CURRENTSCRATCHPAD.realvalue), digits[0], '-', digits[1], '1')), 'reverse().spiritDVD()');
					elem = document.getElementById('SPIRITDVD_inverse_output');
					elem.innerHTML = Teacher.analyzeValue(Substitute.spiritDVD(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue, digits[0], '1', digits[1], '-')), 'inverse().spiritDVD()')+'<br>'+
									 Teacher.analyzeValue(Substitute.spiritDVD(Binary.replaceBoth(T_ReverseText(CURRENTSCRATCHPAD.realvalue), digits[0], '1', digits[1], '-')), 'inverse().reverse().spiritDVD()');
				}
				Timer.stop("SpiritDVD - Four");
			}
			
			if (Global.Enable.Dvorak) {
				Timer.start();
				elem = document.getElementById('DVORAK_encrypt_output');
				elem.innerHTML = Teacher.analyzeValue(Substitute.calcDvorak(1, CURRENTSCRATCHPAD.realvalue).replace('<','&lt;'), 'quertytodvorak()');
				elem = document.getElementById('DVORAK_decrypt_output');
				elem.innerHTML = Teacher.analyzeValue(Substitute.calcDvorak(-1, CURRENTSCRATCHPAD.realvalue).replace('<','&lt;'), 'dvoraktoquerty()');
				Timer.stop("Keyboard - Dvorak - Two");
			}

			if (Global.Enable.Colemak) {
				Timer.start();
				elem = document.getElementById('COLEMAK_encrypt_output');
				elem.innerHTML = Teacher.analyzeValue(Substitute.calcColemak(1, CURRENTSCRATCHPAD.realvalue).replace('<','&lt;'), 'quertytocolemak()');
				elem = document.getElementById('COLEMAK_decrypt_output');
				elem.innerHTML = Teacher.analyzeValue(Substitute.calcColemak(-1, CURRENTSCRATCHPAD.realvalue).replace('<','&lt;'), 'colemaktoquerty()');
				Timer.stop("Keyboard - Colemak - Two");
			}
			
			if (Global.Enable.L337Speak && /[0134579\@\!\$]/.test(CURRENTSCRATCHPAD.realvalue) && ! REGEX_FILE_TYPES.test(CURRENTSCRATCHPAD.realvalue)) {
				/*if( ! (
						(/[0]/.test(CURRENTSCRATCHPAD.realvalue)   && /[o]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[1]/.test(CURRENTSCRATCHPAD.realvalue)   && /[l]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[3]/.test(CURRENTSCRATCHPAD.realvalue)   && /[e]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[4\@]/.test(CURRENTSCRATCHPAD.realvalue) && /[a]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[5\$]/.test(CURRENTSCRATCHPAD.realvalue) && /[s]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[7]/.test(CURRENTSCRATCHPAD.realvalue)   && /[t]/i.test(CURRENTSCRATCHPAD.realvalue)) ||
						(/[\!]/.test(CURRENTSCRATCHPAD.realvalue)  && /[i]/i.test(CURRENTSCRATCHPAD.realvalue))
						) )
				{*/
					Timer.start();
					elem = document.getElementById('LEET_output');
					elem.innerHTML = Teacher.analyzeValue(Substitute.leetSpeakFlagSafe(CURRENTSCRATCHPAD.realvalue), '1337speak()');
					elem = document.getElementById('MOARLEET_output');
					elem.innerHTML = Teacher.analyzeValue(Substitute.m0arLeetSpeakFlagSafe(CURRENTSCRATCHPAD.realvalue), '1337speak()');
					Timer.stop("1337 sp34k - Double");
				//}
			}

			if(Global.InputType == InputTypeEnum.NUMBERS) {
				Timer.start();
				elem = document.getElementById('VERNAMTAPIR_output');
				var decodedvalue = Substitute.stasiVernamTapirCipher(CURRENTSCRATCHPAD.realvalue);
				if(decodedvalue && Binary.getDigitsIfBinary(decodedvalue)) {
					Guesses.saveGuess(CertaintyEnum.EDUCATEDGUESS, decodedvalue, 'stasiVernamTapirCipher()');	//If Tapir goes to binary
				} else if(decodedvalue && !Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue)) {
					Guesses.saveGuess(CertaintyEnum.GUESS, decodedvalue, 'stasiVernamTapirCipher()');	//Downgrade to DESPERATE if too many false positives
				}
				elem.innerHTML = Teacher.analyzeValue(decodedvalue, 'stasiVernamTapirCipher()');
				Timer.stop("VERNAM TAPIR - Single");
			}
			if(Global.InputType == InputTypeEnum.EXTENDEDASCII) {
				Timer.start();
				elem = document.getElementById('PLANET_output');
				elem.innerHTML = Teacher.analyzeValue(Substitute.planetSubstitution(CURRENTSCRATCHPAD.realvalue), 'planetSubstitution()');
				Timer.stop("PLANET - Single");
			}

			
			
		}
		/*else
		{
			elem.innerHTML = "<i>Type in your message and see the results here!</i>";
		}*/
	},

	goldenBug : function(text)
	{
		//http://www.javascripter.net/faq/mathsymbols.htm
		//Teststring: 52-†81346,709*‡.$();?¶]¢:[
		var mapObj = {
			'%20':" ",
			'0':"L",
			'1':"F",
			'2':"B",
			'3':"G",
			'4':"H",
			'5':"A",
			'6':"I",
			'7':"K",
			'8':"E",
			'9':"M",
			'.':"P",
			'%2C':"J",
			'%3A':"Y",
			'%3B':"T",
			'%28':"R",
			'%29':"S",
			'%5B':"Z",
			'%5D':"W",
			'%u2020':"D",
			'%u2021':"O",
			'%24':"Q",
			'%A2':"X",
			'-':"C",
			'*':"N",
			'%3F':"U",
			'%B6':"V",
		};
		return escape(text).replace(/%20|0|1|2|3|4|5|6|7|8|9|\.|%2C|%3A|%3B|%28|%29|%5B|%5D|%u2020|%u2021|%24|%A2|-|\*|%3F|%B6/gi, function(matched){ return mapObj[matched]; });;
	},

	spiritDVD : function(text)
	{
		var mapObj = {
			'---':" ",
			'--1':"E",
			'-1-':"A",
			'-11':"O",
			'1--':"R",
			'1-1---':"M",
			'1-1--1':"W",
			'1-1-1-':"F",
			'1-1-11':"G",
			'1-11--':"Y",
			'1-11-1':"P",
			'1-111-':"B",
			'1-1111---':"V",
			'1-1111--1':"K",
			'1-1111-1-':"J",
			'1-1111-11':"X",
			'1-11111--':"Q",
			'1-11111-1':"Z",
			'11----':"T",
			'11---1':"I",
			'11--1-':"N",
			'11--11':"H",
			'11-1--':"D",
			'11-1-1':"L",
			'11-11-':"C",
			'11-111':"U",
			'111':"S",
		};
		return text.replace(/---|--1|-1-|-11|1--|1-1---|1-1--1|1-1-1-|1-1-11|1-11--|1-11-1|1-111-|1-1111---|1-1111--1|1-1111-1-|1-1111-11|1-11111--|1-11111-1|11----|11---1|11--1-|11--11|11-1--|11-1-1|11-11-|11-111|111/g, function(matched){ return mapObj[matched]; });
	},

	
	dvorakLayout   : "',.pyfgcrl/=aoeuidhtns-;qjkxbmwvz[]\"<>PYFGCRL?+AOEUIDHTNS_:QJKXBMWVZ{} \\|",
	qwertyLayout_d : "qwertyuiop[]asdfghjkl;'zxcvbnm,./-=QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?_+ \\|",
	calcDvorak : function(encdec, text){
		//http://bennettroesch.com/Tools/QwertyToDvorak/
		var new_text = '';
		for (var i = 0; i < text.length; i++) {
			if (encdec >= 0) {
				var index_match = this.qwertyLayout_d.indexOf(text.charAt(i));
				new_text += this.dvorakLayout.substring(index_match, index_match + 1);
			} else {
				var index_match = this.dvorakLayout.indexOf(text.charAt(i));
				new_text += this.qwertyLayout_d.substring(index_match, index_match + 1);
			}
		}
		return new_text;
	},
	colemakLayout   : " qwfpgjluy;[]arstdhneio'zxcvbkm,./QWFPGJLUY:{}ARSTDHNEIO\"ZXCVBKM<>?_+\\|`1234567890-=~!@#$%^&*()_+",
	qwertyLayout_c  : " qwertyuiop[]asdfghjkl;'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?_+\\|`1234567890-=~!@#$%^&*()_+",
	calcColemak : function(encdec, text){
		//http://colemak.com/Converter
		var new_text = '';
		for (var i = 0; i < text.length; i++) {
			if (encdec >= 0) {
				var index_match = this.qwertyLayout_c.indexOf(text.charAt(i));
				new_text += this.colemakLayout.substring(index_match, index_match + 1);
			} else {
				var index_match = this.colemakLayout.indexOf(text.charAt(i));
				new_text += this.qwertyLayout_c.substring(index_match, index_match + 1);
			}
		}
		return new_text;
	},

	keyboardshift : function(text, right)
	{
		//http://www.robertecker.com/hp/research/leet-converter.php?lang=en
		var keyrow  = ['1','2','3','4','5','6','7','8','9','0'];
		var toprow   = ['q','w','e','r','t','y','u','i','o','p'];
		var middlerow = ['a','s','d','f','g','h','j','k','l'];
		var bottomrow  = ['z','x','c','v','b','n','m'];
		
		var output = '';
		var index;
		var uppercase;
		var c;
		for(var i = 0; i < text.length; i++) {
			index = keyrow.indexOf(text[i]);
			if(index >= 0) {
				output += keyrow[(index + right + keyrow.length*2)%keyrow.length];
				continue;
			}
			
			uppercase = (text[i] == text[i].toUpperCase());
			
			index = toprow.indexOf(text[i].toLowerCase());
			if(index >= 0) {
				c = toprow[(index + right + toprow.length*2)%toprow.length];
				output += uppercase?c.toUpperCase():c;
				continue;
			}
			index = middlerow.indexOf(text[i].toLowerCase());
			if(index >= 0) {
				c = middlerow[(index + right + middlerow.length*2)%middlerow.length];
				output += uppercase?c.toUpperCase():c;
				continue;
			}
			index = bottomrow.indexOf(text[i].toLowerCase());
			if(index >= 0) {
				c = bottomrow[(index + right + bottomrow.length*2)%bottomrow.length];
				output += uppercase?c.toUpperCase():c;
				continue;
			}
			output+=text[i];	//All other chars like spaces and dots and exclamation marks
		}
		return output;
	},

	//https://github.com/ctfs/write-ups-2014/tree/master/olympic-ctf-2014/crypting
	//43wdxz 4edcvgt5 65rdcvb 6tfcgh8uhb 9ijn
	keyboardmaplayout : ["1234567890-=","qwertyuiop[]","|asdfghjkl;'\"","|zxcvbnm,./?"],	//The pipe is for padding
	checkkeyboardmap : function(text)
	{
		if(/^([0-9A-Z]{4,12}\s+){2,}([0-9A-Z]{4,12})?$/i.test(text))
		{
			var letters = text.match(/[0-9A-Z]{4,12}/gi);
			for(var i = 0; i < letters.length; i++)
			{
				var letter = letters[i];
				var letteroffset = this.keyboardmaplayout[0].indexOf(letter[0]);
				if(letteroffset == -1)
					letteroffset = this.keyboardmaplayout[1].indexOf(letter[0]);
				if(letteroffset == -1)
					return false;		//return false if the letter does not start on the first two rows.
				
				var letterarea = '';
				for(y = 0; y < 4; y++)
					letterarea += this.keyboardmaplayout[y].substr(letteroffset-2,letteroffset+2);
				//alert(letterarea);

				//Check if every letter is contained within the area
				for(var j = 0; j < letter.length; j++) {
					if(letterarea.indexOf(letter[j]) < 0)
						return false;
				}
			}
			//alert('keyboardmap');
			return true;
		}
		return false;
	},
	
	leetSpeakFlagSafe : function(text)
	{
		if(/:[\s]{0,3}[^\s\:\/]+$/.test(text)) {
			var split = text.match(/((.|\s)*)(\:[\s]{0,3}[^\s\:\/]{3,40}$)/);
			return split!=null?(Substitute.leetSpeak(split[1])+split[3]):Substitute.leetSpeak(text);
		} else if(REGEX_FLAG_DETECTION.test(text)) {
			var split = text.match(/((.|\s)*[\(\{])(.{3,40})([\)\}](.|\s)*)/);
			return split!=null?(Substitute.leetSpeak(split[1])+split[3]+Substitute.leetSpeak(split[4])):Substitute.leetSpeak(text);
		} else {
			return Substitute.leetSpeak(text);
		}
	},
	leetSpeak : function(text)
	{
		var mapObj = {
			0:"o",
			1:"i",
			3:"e",
			4:"a",
			5:"s",
			7:"t"
		};
		return text.replace(/0|1|3|4|5|7/gi, function(matched){ return mapObj[matched]; });
	},
	m0arLeetSpeakFlagSafe : function(text)
	{
		if(/:[\s]{0,3}[^\s\:\/]+$/.test(text)) {
			var split = text.match(/((.|\s)*)(\:[\s]{0,3}[^\s\:\/]{3,40}$)/);
			return split!=null?(Substitute.m0arLeetSpeak(split[1])+split[3]):Substitute.m0arLeetSpeak(text);
		} else if(REGEX_FLAG_DETECTION.test(text)) {
			var split = text.match(/((.|\s)*[\(\{])(.{3,40})([\)\}](.|\s)*)/);
			return split!=null?(Substitute.m0arLeetSpeak(split[1])+split[3]+Substitute.m0arLeetSpeak(split[4])):Substitute.m0arLeetSpeak(text);
		} else {
			return Substitute.m0arLeetSpeak(text);
		}
	},
	m0arLeetSpeak : function(text)
	{
		var mapObj = {
			0:"o",
			1:"i",
			3:"e",
			4:"a",
			5:"s",
			7:"t",
			
			'!':"i",
			'$':"s",
			'@':'a'
		};
		return text.replace(/0|1|3|4|5|7|\!|\$|\@/gi, function(matched){ return mapObj[matched]; });
	},

	planetSubstitution : function(text)
	{					//https://en.wikipedia.org/wiki/Astronomical_symbols
		var mapObj = {
				'\u2609':"0",
				'\u263F':"1",
				'\u2640':"2",
				'\u2641':"3",'\u2295':"3",
				'\u2642':"4",
				'\u2643':"5",
				'\u2644':"6",
				'\u2645':"7",'\u26E2':"7",
				'\u2646':"8",
				'\u2647':"9"
			};
		try {			//We do this so Internet Exploder will also like (and not reject) this script.
			eval("mapObj['\\u{1F728}'] = '3';");
		} catch(err) {
			alert('Your browser does not fully support Planet Cipher. Use Chrome.');
			//return false;
		}
		var ret = text.replace(/[\u263F-\u2647]|\u26E2|\u2295|\u2609|\u{1F728}/gi, function(matched){ return mapObj[matched]; });
		ret = (ret.length>300)?ret.replace(/ /g, ''):ret;	//DIMA:NASTY HACK: Work around for long number strings that just decode to one long string
		return ret;
	},


	stasiVernamTapirCipher : function(text)
	{					//https://losfuzzys.github.io/writeup/2016/02/21/iwctf2016-crypto-pirat/
		var tapir = {
			'0':'A','1':'E','2':'I','3':'N','4':'R',
			'50':'B','51':'BE','52':'C','53':'CH','54':'D','55':'DE','56':'F','57':'G','58':'GE','59':'H',
			'60':'J','61':'K','62':'L','63':'M','64':'O','65':null,'66':null,'67':'P','68':'Q','69':'S',
			'70':'T','71':'TE','72':'U','73':'UN','74':'V','75':null,'76':'W','77':'X','78':'Y','79':'Z',
			'80':'WR','81':'Bu','82':'Zi','83':'ZwR','84':'Code','85':'RPT','86':null,'87':null,'88':null,'89':'.',
			'90':':','91':',','92':'-','93':'/','94':'(','95':')','96':'+','97':'=','98':'"','99':null,
			'00':'0','11':'1','22':'2','33':'3','44':'4','55':'5'//,'66':'6','77':'7','88':'8','99':'9'	//Commented out to avoid conflicts
		};
		//var blacklist = {'Zi', 'ZwR'};

		text = text.replace(/\s/g, '');

		var tapirDecoded = '';
		var i = 0, c = 0;
		for(var i =0; i < text.length; i++)
		{
			c = text[i];

			if(c >= '5') {
				i++;
				if(i < text.length) {
					c2 = text[i];
					if(typeof tapir[c + c2] == 'undefined')
						return null;
					decodedchar = tapir[c + c2];
				} else {
					return null;
				}
			} else {
				decodedchar = tapir[c];
			}

			if(decodedchar == null) {
				return null;
			} else if(decodedchar != 'Zi' && decodedchar != 'ZwR' && decodedchar != 'WR' && decodedchar != 'Bu' && decodedchar != 'Code' && decodedchar != 'RPT') {	// Control chars are not relevant
				tapirDecoded += decodedchar;
			} else if(decodedchar == 'Zi' || decodedchar == 'Bu') {		// 'Zi' is some kind of shift (spec char next), I need to look into this more
				//Do nothing for now with this command
			} else if(decodedchar == 'ZwR') {		// 'Zwr' is 'Zwischenraum', which means space
				tapirDecoded += ' ';
			} else {
				return null;
			}
		}

		return tapirDecoded;
	},
};
