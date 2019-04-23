

var LSB = {
	
	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {
			Timer.start();

			var hexstring, certainty;
			for(var i = 1; i <= 4; i++) {
				hexstring = LSB.decode(CURRENTSCRATCHPAD.realvalue, i);
				if(hexstring) {
					certainty = (REGEX_FILE_TYPES.test(hexstring) || REGEX_POSSIBLEFLAGCHARS.test(hexstring)) ? 
																			CertaintyEnum.GUESS : 
																			(REGEX_TEXTNUMBERSSPECIALCHARS.test(hexstring)?CertaintyEnum.WILDGUESS:CertaintyEnum.DESPERATE);
					document.getElementById('LSB_0x0'+i.toString(16)+'_output').innerHTML = Guesses.analyzeGuessAndGradeValue([hexstring, certainty], 'LSB_&0x0'+i.toString(16)+'()');
				}
			}

			Timer.stop("LSB - four");
		}
	},

	decode : function(ciphertext, mask)
	{
		var hexvalue = LSB.calcDecodeLSBGetSteps(ciphertext, mask);
		if(hexvalue && hexvalue.length && hexvalue[0]) {
			return hexvalue[hexvalue.length-1].value;
		}
		return false;
	},

	calcDecodeLSBGetSteps : function(ciphertext, mask)
	{
		var masklen = mask.toString(2).length;
		if((ciphertext.length/masklen) % 8 != 0) {
			return false;
		}

		var out = '';
		for (var i = 0, l = ciphertext.length; i < l; i++) {
			out += ("0000000"+(ciphertext.charCodeAt(i)&mask).toString(2)).slice(-masklen);
		}

		return calcDecodeBinaryGetSteps(out, false);	//Yes, false on purpose
	},

};