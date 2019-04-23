
var Caesar = {
	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			//window.setTimeout('CAESAR_upd()', 100);
			return;
		}

		var i = 0;
		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			document.getElementById('CAESAR_GENERAL').innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else if( (CURRENTSCRATCHPAD.realvalue.length%2 == 0 && /^[0-9A-F]{2,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) || 
			(CURRENTSCRATCHPAD.realvalue.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(CURRENTSCRATCHPAD.realvalue)) )	//Regular Hex
		{
			Timer.start();
			var input = CURRENTSCRATCHPAD.realvalue;
			if(input.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(input))
				input = input.replace(/\ /g,'');
			
			var outhtml = '';
			for(i = 1; i < 16; i++) {
				var textcpy = Caesar.calc(1, input, i, 1, "0123456789ABCDEF");
				var temp = ConvertBase.hexToStr(textcpy);
				if(REGEX_FILE_TYPES.test(temp) || (/^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]*$/.test(temp) && 
													(min_auto_guess_certainty<=CertaintyEnum.DESPERATE || !(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\?\-\_\~\\\r\n ]{4,}/.test(temp))))) {
					textcpy = temp;
				}
				//47494638396110001000f20000000000885818d8a038f8d870f8f8f80000000000000000002c000000001000100000034008badc4a30ca281e18386b5001c11394755f1861e41005ec3aa4031b80d00cd3abfd68f9fcee1a99e6a6120d81381f0a89118e2c9ae880f39059af0187969100003b
				//REGEX_FILE_TYPES.test(r) || +(REGEX_FILE_TYPES.test(textcpy)?Teacher.analyzeValue(textcpy, 'caesar_hex'+i.toString()+'()'):'')
				outhtml += "<div class='outputbox'><small>"+i.toString()+":</small> <span class='outputbox'>"+Teacher.analyzeValue(textcpy, 'caesar_hex'+i.toString()+'()')+'</span></div>';
			}
			document.getElementById('CAESAR_GENERAL').innerHTML = outhtml;
			Timer.stop("Caesar - BruteF over 16");

			
			if(Global.Enable.Caesar_BF_XL) {
				//Determine if we're going to do bruteforce (0x00-0x7F or 0x80-0xFF)
				if(input.length > 20 && Global.InputType == InputTypeEnum.HEX && (/^([0-7][0-9A-F])+$/i.test(input) || /^([8-9A-F][0-9A-F])+$/i.test(input)) &&
										(/^([0-9A-F]{2})*(0[0-9BCEF]|1[0-9A-F])+([0-9A-F]{2})*$/i.test(input) || /^([0-9A-F]{2})*([8-9A-F][0-9A-F])+([0-9A-F]{2})*$/i.test(input)) ) {
					Timer.start();
					var maparray = Array.apply(null, Array(128)).map(Number.prototype.valueOf,0);
					var offset = /^(([8-9A-F][0-9A-F])\s?)$/i.test(input)?128:0;
					//D6FEFEF3A0F9FEF1BBA088FE84A082FEFB85F4F3A0FEFDF4A0FCFE81F4A0F2F7F0FBFBF4FDF6F4A0F8FDA088FE8481A0F9FE8481FDF488BDA0E3F7F882A0FEFDF4A086F082A0F5F0F881FB88A0F4F08288A083FEA0F281F0F2FABDA0E6F082FDB683A0F883CEA0C0C1C7A0FAF48882A0F882A0F0A08084F883F4A082FCF0FBFBA0FAF48882FFF0F2F4BBA082FEA0F883A082F7FE84FBF3FDB683A0F7F085F4A083F0FAF4FDA088FE84A083FEFEA0FBFEFDF6A083FEA0F3F4F28188FF83A083F7F882A0FCF48282F0F6F4BDA0E6F4FBFBA0F3FEFDF4BBA088FE8481A082FEFB8483F8FEFDA0F882A0F2F881F181F7FEF0F3FDFBFCBD
					var bytearray = ByteArray.hexToByteArray(input);
					for(var i = 0; i < bytearray.length; i++) {
						var temp = bytearray[i]-offset;
						maparray[temp]++;
					}
					var mapstring = maparray.join('');
					var startzeros = mapstring.match(/^0+/);
					var endzeros = mapstring.match(/0+$/);
					if(/0{32,54}/g.test(mapstring) || (startzeros && startzeros.length && endzeros && endzeros.length && 
														(startzeros[0].length + endzeros[0].length) >= 32 && (startzeros[0].length + endzeros[0].length) < 54) )
					{
						//Caesar.bruteForceHex128(-1, input);
						Guesses.saveGuess(CertaintyEnum.WILDGUESS, 'javascript:Caesar.bruteForceHex128(-1, \''+input+'\');', 'Caesar_00-7F()');
					}
					else if(/0{20,101}/g.test(mapstring) || (startzeros && startzeros.length && endzeros && endzeros.length && 
														(startzeros[0].length + endzeros[0].length) >= 20 && (startzeros[0].length + endzeros[0].length) < 101) )
					{
						Guesses.saveGuess(CertaintyEnum.DESPERATE, 'javascript:Caesar.bruteForceHex128(-1, \''+input+'\');', 'Caesar_00-7F()');
					}
					Timer.stop("Caesar - BruteF over 128 prep");
				}
			}
			
		}
		else
		{
			Timer.start();
			document.getElementById('CAESAR_rot13').innerHTML = Teacher.analyzeValue(Caesar.calc(1, CURRENTSCRATCHPAD.realvalue, 13), 'rot13()');
			Timer.stop("Caesar - Rot13 - One");

			Timer.start();
			var alphabet = document.getElementById('CAESAR_BRUTEFORCE_ALPHABET').value;
			var outhtml = '';
			for(i = 1; i < alphabet.length; i++) {
				var textcpy = Teacher.analyzeValue(Caesar.calc(1, CURRENTSCRATCHPAD.realvalue, i, 0, alphabet), 'caesar'+i.toString()+'()');
				outhtml += "<div class='outputbox'><small>"+i+":</small> <span class='outputbox'>"+textcpy+'</span></div>';
			}
			document.getElementById('CAESAR_GENERAL').innerHTML = outhtml;
			Timer.stop("Caesar - BruteF over "+alphabet.length);

			if(Global.Enable.Caesar_smart) {
				Caesar.specialCaesarCipher(CURRENTSCRATCHPAD.realvalue);
			}
		}

		//window.setTimeout('CAESAR_upd()', 100);
	},
	specialCaesarCipher : function (text)
	{
		//initial vars
		var str = text.match(/[^a-z]/gi).join('');
		var specialchars = new Object;
		if(text.length<min_encoded_string_length)
			return;

		//loop, figure it out
		for(var i = 0, length = str.length; i < length; i++) {
			var c = str.charAt(i);
			if(isNaN(specialchars[c])) specialchars[c] = null;
			//specialchars[c] = (isNaN(specialchars[c]) ? 1 : specialchars[c] + 1);
		}
		var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for(var spchar in specialchars) {
			alphabet += spchar;
		}

		Timer.start();
		var outhtml = '';
		for(i = 1; i < alphabet.length; i++) {
			var textcpy = Teacher.analyzeValue(Caesar.calc(1, CURRENTSCRATCHPAD.realvalue, i, 0, alphabet), 'caesar'+i.toString()+'()');
			outhtml += "<div class='outputbox'><small>"+i+":</small> <span class='outputbox'>"+textcpy+'</span></div>';
		}
		document.getElementById('CAESAR_smart').innerHTML = outhtml;
		Timer.stop("Caesar - Smart - BruteF over "+alphabet.length);
	},


	// Caesarian Shift

	// This code was written by Tyler Akins and is placed in the public domain.
	// It would be nice if this header remained intact.  http://rumkin.com

	// Requires util.js


	// Perform a Caesar cipher (ROT-N) encoding on the text
	// encdec = -1 for decode, 1 for encode (kinda silly, but kept it like this
	//    to be the same as the other encoders)
	// text = the text to encode/decode
	// inc = how far to shift the letters.
	// key = the key to alter the alphabet
	// alphabet = The alphabet to use if not A-Z
	calc : function(encdec, text, inc, key, alphabet)
	{	
		var s = "", b, i, idx;
		
		if (typeof(alphabet) != 'string')
			alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		inc = inc * 1;
		
		key = MakeKeyedAlphabet(key, alphabet);
		
		if (encdec < 0)
		{
			inc = alphabet.length - inc;
			b = key;
			key = alphabet;
			alphabet = b;
		}
		
		for (i = 0; i < text.length; i++)
		{
			b = text.charAt(i);
			if ((idx = alphabet.indexOf(b)) >= 0)
			{
				idx = (idx + inc) % alphabet.length;
				b = key.charAt(idx);
			}
			else if ((idx = alphabet.indexOf(b.toUpperCase())) >= 0)
			{
				idx = (idx + inc) % alphabet.length;
				b = key.charAt(idx).toLowerCase();
			}
			s += b;
		}
		return s;
	},
	
	bruteForceCustomRangeButton : function()
	{
		//CAESAR
		//567E7E7320797E713B20087E0420027E7B057473207E7D74207C7E0174207277707B7B747D767420787D20087E040120797E04017D74083D2063777802207E7D742006700220757078017B08207470020820037E20720170727A3D206670027D36032078034E20404147207A740802207802207020000478037420027C707B7B207A7408027F7072743B20027E2078032002777E047B737D360320777005742003707A747D20087E0420037E7E207B7E7D7620037E2073747201087F032003777802207C7402027076743D2066747B7B20737E7D743B20087E040120027E7B0403787E7D207802207278017101777E70737D7B7C3D
		Caesar.bruteForceRangeButton(parseInt(document.encoder.CAESAR_BRUTEFORCE_FROM.value), parseInt(document.encoder.CAESAR_BRUTEFORCE_TO.value));
	},
	bruteForceRangeButton : function(from, to)
	{
		Caesar.bruteForceRange(-1, CURRENTSCRATCHPAD.realvalue, from, to);
		Teacher.updateHitBox();
		Teacher.updateHitValueBox();
	},
	
	bruteForceRange : function(encdec, text, from, to)
	{
		Timer.start();

		var input = ByteArray.hexToByteArray(text);
		var alphabet = "";
		
		for(var i = from; i < to; i++) {
			alphabet += String.fromCharCode(i);
		}
		var o = document.getElementById('CAESAR_out_hex');
		var out = '';
		for(var i = 1; i <= (to-from); i++) {
			out += '<small>'+(from+i).toString()+":</small>" + Teacher.analyzeValue(Caesar.calcHex(encdec, input, i, (to-from+1), alphabet), 'caesar_hex_'+(from+i)+'()') +"<br>";//SwapSpaces(HTMLEscape(
		}
		o.innerHTML = out;
		Timer.stop("Caesar - BruteF over "+(to-from));
	},
	
	bruteForceHex128 : function(encdec, text)
	{

		this.bruteForceRange(encdec, text, 1, 128);
		/*var input = ByteArray.hexToByteArray(text);
		var alphabet = "";
		
		for(var i = 1; i < 128; i++) {
			alphabet += String.fromCharCode(i);
		}
		
		var out = '';
		for(var i = 1; i <= 128; i++) {
			out += i.toString()+":" + Teacher.analyzeValue(Caesar.calcHex(encdec, input, i, 128, alphabet), 'caesar_hex_'+i+'()') +"<br>";//SwapSpaces(HTMLEscape(
		}
		document.getElementById('CAESAR_out_hex').innerHTML = out;
		*/
	},
	
	calcHex : function(encdec, input, inc, mod, alphabet)
	{
		var out = "";
		for( var j = 0; j < input.length; j++)
		{
			var temp = (input[j]+inc)%mod;
			out += String.fromCharCode(temp);
		}
		return out;
	}

};
