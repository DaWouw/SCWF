
var Ebcdic = {
	//http://www.toptip.ca/2011/01/ascii-ebcdic-online-converter.html
	asciiList : [
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
				'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
					's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 

				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
				'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
					'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 

			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 

			' ', '.', '<', '(', '+', '|',
			'!', '$', '*', ')', ';', '-',
				',', '%', '_', '>', '?',
			':', '#', '@', "'", '=', '"','',
		],

	ebcdicList : [
				'81','82','83','84','85','86','87','88','89',
				'91','92','93','94','95','96','97','98','99',
					'A2','A3','A4','A5','A6','A7','A8','A9',

				'C1','C2','C3','C4','C5','C6','C7','C8','C9',
				'D1','D2','D3','D4','D5','D6','D7','D8','D9',
					'E2','E3','E4','E5','E6','E7','E8','E9',

			'F0','F1','F2','F3','F4','F5','F6','F7','F8','F9',

			'40','4B','4C','4D','4E','4F',
			'5A','5B','5C','5D','5E','5F',
				'6B','6C','6D','6E','6F',
			'7A','7B','7C','7D','7E','7F','00',
		],

	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			return;
		}

		var e = document.getElementById('EBCDIC_output');

		if (CURRENTSCRATCHPAD.realvalue != '')
		{
			Timer.start();
			var text = CURRENTSCRATCHPAD.realvalue;
			if(text.length%2 == 0 && /^([0-9A-F][0-9A-F]){2,}$/gi.test(text))
				text = text.match(/(..?)/g).join(' ');
			e.innerHTML = Teacher.analyzeValue(Ebcdic.ebcdic2ascii(text, true), 'ebcdic()');
			Timer.stop("Ebcdic - Single");
		}
	},

	decode : function(input)
	{
		return Ebcdic.ebcdic2ascii(input, false);
	},
	decodeGetSteps : function(input)
	{
		var temp = Ebcdic.ebcdic2ascii(input, false);
		if(temp)
			return [Teacher.analyzeValueDoNotSaveGrade(temp, 'ebcdic()')];
		return false;
	},
	ebcdic2ascii : function(input,errormsg)
	{
		var output = '';

		// convert "\xC1\x82\x83\xF1" to "C1 82 83 F1"
		ebcd_s = input.replace(/\\x/g, " ").replace(/[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\,\<\.\>\/\?\-\_\=\+\~\\]/g, " ");
		ebcd_s = ebcd_s.replace(/^\s+|\s+$/g, "");  // trim spaces

		var ebcd_a = ebcd_s.split(" ");    // e.g. C1 82 83 F1

		for (var i = 0; i < ebcd_a.length; i++)
		{
			var c = ebcd_a[i];

			var found = false;
			for (var j = 0; j < this.ebcdicList.length; j++)
			{
				if (c == this.ebcdicList[j])
				{
					output += this.asciiList[j];
					found = true;
					break;
				}
			}

			if (!found)
			{
				//alert("Error: Cannot convert " + c + " at position: " + i);
				return errormsg?('<i class="error">Error: Cannot convert at position: Char:'+c+' position' + i + '</i>'):false;//false;
			}
		}
		return output;
	},
	
	encode : function(input)
	{
		return Ebcdic.ascii2ebcdic(input, false);
	},
	ascii2ebcdic : function(input,errormsg)
	{
		var output = '';

		for (var i = 0; i < input.length; i++)
		{
			var c = input[i];

			var found = false;
			for (var j = 0; j < this.asciiList.length; j++)
			{
				if (c == this.asciiList[j])
				{
					output += "\\x" + this.ebcdicList[j];
					found = true;
					break;
				}
			}

			if (!found)
			{
				//alert("Error: Cannot convert " + c + " at position: " + i);
				return errormsg?('<i class="error">Error: Cannot convert at position: Char:'+c+' position' + i + '</i>'):false;//false;
			}
		}
		return output;
	}
};

