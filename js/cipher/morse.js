
var Morse = {

	//morseIndexes : new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",'0',"1","2","3","4","5","6","7","8","9",".",",","?","-","=",":",";","(",")","/",'"',"$","'","\n","_","@","[Error]","[Error]","[Error]","[Error]","[Wait]","[Understood]","[End of message]","[End of work]","[Starting signal]","[Invitation to transmit]","!","!","+","~","#","&","\2044"),
	morseIndexes : new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",'0',"1","2","3","4","5","6","7","8","9",".",",","?","-","=",":",";","(",")","/",'"',"$","'","\n","_","@","<i>[Error]</i>","<i>[Error]</i>","<i>[Error]</i>","<i>[Error]</i>","<i>[Wait]</i>","<i>[Understood]</i>","<i>[End of message]</i>","<i>[End of work]</i>","<i>[Starting signal]</i>","<i>[Invitation to transmit]</i>","!","!","+","~","#","&","\2044"),
	morseCodes : new Array(".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--..","-----",".----","..---","...--","....-",".....","-....","--...","---..","----.",".-.-.-","--..--","..--..","-....-","-...-","---...","-.-.-.","-.--.","-.--.-","-..-.",".-..-.","...-..-",".----.",".-.-..","..--.-",".--.-.","......",".......","........",".........",".-...","...-.",".-.-.","...-.-","-.-.-","-.-","---.","-.-.--",".-.-.",".-...","...-.-",". ...","-..-."),
	
	upd : function()
	{  
		if (IsUnchangedVar.text * IsUnchangedVar.encdec)
		{
			//window.setTimeout('Morse.upd()', 100);
			return;
		}
		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('MORSE_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else if (document.encoder.encdec.value * 1 == 1)
		{
			e.innerHTML = Morse.encode(CURRENTSCRATCHPAD.realvalue);
		}
		else
		{
			var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue.replace(/\//g,' '));
			if(digits/* && (digits[0] != '-' || digits[1] != '.')*/)
			{
				Timer.start();
				var txt = Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue.replace(/\//g,' '), digits[0], '-', digits[1], '.');
				e.innerHTML = Guesses.analyzeGuessAndGradeValue(Morse.decodeExtended(txt), 'morse()')+'<br><br>';
				txt = Binary.swap(txt);
				e.innerHTML += Guesses.analyzeGuessAndGradeValue(Morse.decodeExtended(txt), 'inverse().morse()') + '<br><br>';
				
				txt = Reverse_String(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue.replace(/\//g,' '), digits[0], '-', digits[1], '.'));
				e.innerHTML += Guesses.analyzeGuessAndGradeValue(Morse.decodeExtended(txt), 'reverse().morse()') + '<br><br>';
				txt = Binary.swap(txt);
				e.innerHTML += Guesses.analyzeGuessAndGradeValue(Morse.decodeExtended(txt), 'reverse().inverse().morse()');
				Timer.stop("Morse - Four");
			}
			else
			{
				e.innerHTML = '';
			}
		}

		//window.setTimeout('Morse.upd()', 100);
	},
	
	setMorse : function(m)
	{
		document.encoder.encdec.value = "-1";
		CURRENTSCRATCHPAD.setRealValue(m);
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
		//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(m, 'morse_example()')]);
		//ForceFlow.selectFurthestSingleChildNodePath();
		return false;
	},

	swapMorse_Str : function(s)
	{
		var o = '';

		for (var i = 0; i < s.length; i ++)
		{
			var c = s.charAt(i);
			if (c == '-')
			c = '.';
			else if (c == '.')
			c = '-';
			else if (c == "\r")
			c = '';
			o += c;
		}
		return o;
	},
	swapMorse : function()
	{
		CURRENTSCRATCHPAD.setRealValue(Morse.swapMorse_Str(CURRENTSCRATCHPAD.realvalue));
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},

	reverse_Str : function(s)
	{
		var i = s.length - 1, o = '';

		while (i >= 0)
		{
			var c = s.charAt(i);
			if (c != "\r")
			o += c;
			i --;
		}
		return o;
	},

	reverse : function()
	{
		CURRENTSCRATCHPAD.setRealValue(Morse.reverse_Str(CURRENTSCRATCHPAD.realvalue));
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},

	getIndex : function(arr, str)
	{
		var i = 0;
		while (arr[i])
		{
			if (arr[i] == str)
			{
				return i;
			}
			i ++;
		}
		return -1;
	},

	encode : function(str)
	{
		var addSpace = 0;
		var out = "";
		for (var i = 0; i < str.length; i ++)
		{
			var c = str.charAt(i);
			var j = Morse.getIndex(this.morseIndexes, c.toUpperCase());
			if (j >= 0)
			{
				if (addSpace)
				{
					out += ' ';
				}
				out += this.morseCodes[j];
				addSpace = 1;
			}
			else
			{
				if (c.charCodeAt(0) == 10 || c.charCodeAt(0) == 13)
				{
					out += c;
				}
				else if (addSpace)
				{
					out += ' / ';
				}
				addSpace = 0;
			}
		}
		return out;
	},

	decode : function(str)
	{
		var outArr = Morse.decodeExtended(str);
		return outArr[0];
	},
	decodeExtended : function(str)
	{
		var out = "";
		var addSpace = 0;
		var cleanDecode = true;
		var veryCleanDecode = true;

		// Reformat string, trying to change odd things into dots
		// and hyphens
		tmp = "";
		for (var i = 0; i < str.length; i ++)
		{
			if (str.charCodeAt(i) < 27)
			{
				tmp += ' ' + str.charAt(i) + ' ';
			}
			else if (str.charCodeAt(i) == 8211 || str.charCodeAt(i) == 8212 ||
					str.charAt(i) == '_')
			{
				// Compensate for weird hyphens
				tmp += '-';
			}
			else if (str.charCodeAt(i) == 8226 || str.charCodeAt(i) == 8901)
			{
				// Compensate for odd dots
				tmp += '.';
			}
			else
			{
				tmp += str.charAt(i);
			}
		}

		str = tmp.split(' ');
		for (var i = 0; i < str.length; i ++)
		{
			var idx = Morse.getIndex(this.morseCodes, str[i]);
			
			if (idx >= 0)
			{
				out += this.morseIndexes[idx];
				addSpace = 1;
				if(idx >= 51 && idx <= 61) {	//If it's any of the codes, set cleanDecode to false
					cleanDecode = false;
				}
			}
			else
			{
				if (str[i].charCodeAt(0) == 10 || str[i].charCodeAt(0) == 13)
				{
					out += str[i];
				}
				else if (addSpace)
				{
					out += ' ';
					if(str[i] != '/')
						cleanDecode = false;
					//alert(str[i]+"="+Morse.getIndex(this.morseCodes, str[i])+" | "+out);
				}
				else
				{
					cleanDecode = false;
				}
				addSpace = 0;
			}
		}

		//if((out.match(/\[/g) || []).length >= 2)
		//	veryCleanDecode = false;

		return [out, cleanDecode?(veryCleanDecode?CertaintyEnum.EDUCATEDGUESS:CertaintyEnum.DESPERATE):-1];
	}
};
