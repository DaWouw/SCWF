var Baconian = {

	upd : function()
	{
		if (IsUnchangedVar.text * 
				IsUnchangedVar.rem_jv *
				IsUnchangedVar.encdec)
		{
			//window.setTimeout('BACONIAN_upd()', 100);
			return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('BACONIAN_output');
		var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var txt = CURRENTSCRATCHPAD.realvalue;
		
		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else if (document.encoder.encdec.value * 1 == 1)
		{
			if (document.encoder.rem_jv.value * 1)
			{
				alphabet = 'ABCDEFGHIKLMNOPQRSTUWXYZ';
				txt = Tr(txt, 'jJvV', 'iIuU');
			}
			e.innerHTML = HTMLEscape(Baconian.encode(txt, alphabet));
		}
		else
		{
			Timer.start();
			var BACONIAN_ME = CURRENTSCRATCHPAD.realvalue;
			var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
			var temp = false;
			if(!digits) {			//If it isn't already in AB Baconian style, lets try other things
				if(BACONIAN_ME.length > 24 && (temp = BACONIAN_ME.match(/[a-z][A-Z]+[a-z]/g)) && temp.length > min_encoded_string_length) {	//TODO: perform more input analysis here.
					BACONIAN_ME = BACONIAN_ME.replace( /([^a-zA-Z])/gi, '' );
					BACONIAN_ME = BACONIAN_ME.replace( /([a-z])/g, '0' );
					BACONIAN_ME = BACONIAN_ME.replace( /([A-Z])/g, '1' );
					digits = Binary.getDigitsIfBinary(BACONIAN_ME);
				} else if((BACONIAN_ME.length%2 == 0 && /^(0x)?[0-9A-F]{2,}$/gi.test(BACONIAN_ME)) || 
						(BACONIAN_ME.length%3 == 0 && /^([0-9A-F]{2}\ ){3,}$/gi.test(BACONIAN_ME))) { 		//Regular Hex but not binary//A9238BD88B5DC6E692E522D6EB5CE012891BCCE4BC88289277513167447744AE101C404340D40257BAAA556A54D752EA5B4AB5A916DB552B4B64AA5525AAB55D6AD25A9AB26C
					var temp = ConvertBaseSimple.hex2bin(Tr(BACONIAN_ME,' '));
					if(digits = Binary.getDigitsIfBinary(temp)) {
						BACONIAN_ME = temp;
					}
				}
			}
			Timer.stop("Baconian - Prep");
/*if(/^(AAAAA|AABBA|ABBAA|BAABA|AAAAB|AABBB|ABBAB|BAABB|AAABA|ABAAA|ABBBA|BABAA|AAABB|ABAAB|ABBBB|BABAB|AABAA|ABABA|BAAAA|BABBA|AABAB|ABABB|BAAAB|BABBB)+$/gi)
	alert('hit');*/
			
			if(digits/* && (digits[0] != 'A' || digits[1] != 'B')*/)
			{
				Timer.start();
				txt = Binary.replaceBoth(BACONIAN_ME, digits[0], 'A', digits[1], 'B');
				e.innerHTML = Teacher.analyzeValue(Baconian.decode(txt, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'baconian()')+'<br>'+
							  Teacher.analyzeValue(Baconian.decode(Tr(txt, 'jJvV', 'iIuU'), 'ABCDEFGHIKLMNOPQRSTUWXYZ'), 'baconian(\'remove jv\')')+'<br><br>';
				txt = Binary.swap(txt);
				e.innerHTML+= Teacher.analyzeValue(Baconian.decode(txt, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'inverse().baconian()')+'<br>'+
							  Teacher.analyzeValue(Baconian.decode(Tr(txt, 'jJvV', 'iIuU'), 'ABCDEFGHIKLMNOPQRSTUWXYZ'), 'inverse().baconian(\'remove jv\')')+'<br>';
				
				var o = document.getElementById('BACONIAN_output_reverse');
				txt = T_ReverseText(txt);
				o.innerHTML = Teacher.analyzeValue(Baconian.decode(txt, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'reverse().inverse().baconian()')+'<br>'+
							  Teacher.analyzeValue(Baconian.decode(Tr(txt, 'jJvV', 'iIuU'), 'ABCDEFGHIKLMNOPQRSTUWXYZ'), 'reverse().inverse().baconian(\'remove jv\')')+'<br><br>';
				txt = Binary.swap(txt); 			
				o.innerHTML+= Teacher.analyzeValue(Baconian.decode(txt, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'reverse().baconian()')+'<br>'+
							  Teacher.analyzeValue(Baconian.decode(Tr(txt, 'jJvV', 'iIuU'), 'ABCDEFGHIKLMNOPQRSTUWXYZ'), 'reverse().baconian(\'remove jv\')');
			
				Timer.stop("Baconian - Eight");
			}
			else
			{
				document.getElementById('BACONIAN_output_reverse').innerHTML = '';
			}
		}

		//window.setTimeout('BACONIAN_upd()', 100);
	},


	swapBaconian : function()
	{
		var s = CURRENTSCRATCHPAD.realvalue;
		var o = '';

		for (var i = 0; i < s.length; i ++)
		{
			var c = s.charAt(i);
			if (c == '0')
			c = '1';
			else if (c == '1')
			c = '0';
			else if (c == 'a')
			c = 'b';
			else if (c == 'b')
			c = 'a';
			else if (c == 'A')
			c = 'B';
			else if (c == 'B')
			c = 'A';
			o += c;
		}

		CURRENTSCRATCHPAD.setRealValue(o);
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
		//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(o, 'baconian_swap()')]);
		//ForceFlow.selectFurthestSingleChildNodePath();
	},

	reverse : function()
	{
		var s = CURRENTSCRATCHPAD.realvalue;
		var i = s.length - 1, o = '';

		while (i >= 0)
		{
			var c = s.charAt(i);
			if (c != "\r")
			o += c;
			i --;
		}

		CURRENTSCRATCHPAD.setRealValue(o);
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
		//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(o, 'baconian_reverse()')]);
		//ForceFlow.selectFurthestSingleChildNodePath();
	},

	encode : function(str, alphabet)
	{
		var spaceAdded = 1;
		var out = '';

		str = str.toUpperCase();
		alphabet = alphabet.toUpperCase();

		for (var i = 0; i < str.length; i ++)
		{
			var c = str.charAt(i);
			var idx = alphabet.indexOf(c);
			if (idx >= 0)
			{
				out += (idx & 0x10)? 'B' : 'A';
				out += (idx & 0x08)? 'B' : 'A';
				out += (idx & 0x04)? 'B' : 'A';
				out += (idx & 0x02)? 'B' : 'A';
				out += (idx & 0x01)? 'B' : 'A';
				spaceAdded = 0;
			}
			else
			{
				if (! spaceAdded)
				{
					out += ' ';
					spaceAdded = 1;
				}
			}
		}
		return out;
	},


	decode : function(str, alphabet)
	{
		var out = '';
		var buffer = '';
		var addSpace = 0;

		str = str.toUpperCase();
		str = Tr(str, '01', 'AB');

		for (var i = 0; i < str.length; i ++)
		{
			var c = str.charAt(i);
			
			if (c == 'A' || c == 'B')
			{
				buffer += c;
			}
			else if (buffer == '')
			{
				addSpace = 1;
			}

			if (buffer.length == 5)
			{
				var idx = 0;
				
				idx += (buffer.charAt(0) == 'A')? 0 : 16;
				idx += (buffer.charAt(1) == 'A')? 0 : 8;
				idx += (buffer.charAt(2) == 'A')? 0 : 4;
				idx += (buffer.charAt(3) == 'A')? 0 : 2;
				idx += (buffer.charAt(4) == 'A')? 0 : 1;
				
				buffer = '';
				
				if (addSpace) {
					out += ' ';
					addSpace = 0;
				}
				
				out += alphabet.charAt(idx);
			}
		}

		return out;
	}

};
