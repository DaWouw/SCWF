
var LetterNumbers = {
	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.encdec * IsUnchangedVar.LETTERNUMBERS_method)
		{
			//window.setTimeout('LetterNumbers.upd()', 100);
			return;
		}
		
		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('LETTERNUMBERS_output');
		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message to see the results!</i>';
		}
		else if (document.encoder.encdec.value * 1 == 1)
		{
			e.innerHTML = LetterNumbers.encode(CURRENTSCRATCHPAD.realvalue,  document.encoder.LETTERNUMBERS_method.value);
		}
		else
		{
			e.innerHTML = LetterNumbers.decode(CURRENTSCRATCHPAD.realvalue, document.encoder.LETTERNUMBERS_method.value);
			Timer.start();
			Teacher.analyzeField('LETTERNUMBERS_output', 'letternumbers()');
			
			var ei = document.getElementById('LETTERNUMBERS_output_reverse');
			ei.innerHTML = LetterNumbers.decode(Reverse_String(CURRENTSCRATCHPAD.realvalue), document.encoder.LETTERNUMBERS_method.value);
			Teacher.analyzeField('LETTERNUMBERS_output_reverse', 'reverse().letternumbers()');
			Timer.stop("Letternumbers - Two");
		}

		//window.setTimeout('LetterNumbers.upd()', 100);
	},

	decodeGetSteps : function(text)
	{
		var temp = LetterNumbers.decode(text, document.encoder.LETTERNUMBERS_method.value);
		if(temp)
			return [Teacher.analyzeValueDoNotSaveGrade(temp, 'letternumbers()')];
		temp = LetterNumbers.decode(T_ReverseText(text), document.encoder.LETTERNUMBERS_method.value);
		if(temp)
			return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseText(text), 'reverse()'),Teacher.analyzeValueDoNotSaveGrade(temp, 'letternumbers()')];
		return false;
	},

	encode : function(str, meth)
	{
		var lett = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		var out = "";
		var addHyphen = 0;

		var pad = meth.charAt(1) * 1;
		var hyph = meth.charAt(3) * 1;

		for (var i = 0; i < str.length; i ++)
		{
			c = str.charAt(i);
			j = lett.indexOf(c.toUpperCase()) + 1;
			if (j < 10 && pad)
			{
				j = "0" + j;
			}
			if (j * 1 > 0)
			{
				if (addHyphen && hyph)
				{
					out = out + '-';
				}
				out = out + j;
				addHyphen = 1;
			}
			else
			{
				if (addHyphen)
				{
					if (c.charCodeAt(0) == 10 || c.charCodeAt(0) == 13)
					{
						out += c;
					}
					else
					{
						out += ' ';
					}
				}
				addHyphen = 0;
			}
		}

		return out;
	},

	decode : function(str, meth)
	{
		var lett = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		var num = '0123456789';
		var out = "";
		var was_letter = 0;

		var pad = meth.charAt(1) * 1;
		var hyph = meth.charAt(3) * 1;

		for (var i = 0; i < str.length; i ++)
		{
			c = str.charAt(i);
			j = num.indexOf(c);
			if (j < 0)
			{
				if (! was_letter || ! hyph || c != "-")
				{
					out += c;
				}
				was_letter = 0;
			}
			else
			{
				// Do a number lookahead
				was_letter = j;
				if (str.length > i + 1)
				{
					j = num.indexOf(str.charAt(i + 1));
					if (j >= 0)
					{
						i++;
						was_letter = (was_letter * 10) + j;
					}
				}
				if (was_letter >= 1 && was_letter <= 26)
				{
					out += lett.charAt(was_letter - 1);
				}
				else
				{
					out += was_letter;
					was_letter = 0;
				}
			}
		}

		return out;
	}
};
