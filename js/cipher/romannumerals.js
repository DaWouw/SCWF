

var RomanNumerals = {

	romanNumerals: {
		   1: 'I',
		   4: 'IV',
		   5: 'V',
		   9: 'IX',
		  10: 'X',
		  40: 'XL',
		  50: 'L',
		  90: 'XC',
		 100: 'C',
		 400: 'CD',
		 500: 'D',
		 900: 'CM',
		1000: 'M'
	},

	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {
			
			var text = CURRENTSCRATCHPAD.realvalue.toUpperCase();
			if(/^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\s*)+$/.test(text))
			{
				Timer.start();
				document.getElementById('ROMAN_output').innerHTML = Teacher.analyzeValue(RomanNumerals.calc(text.split(/\s/)), 'romanNumerals_decode()');
				Timer.stop("RomanNumerals - 1");
			}
		}
	},

	calc : function(conversion)
	{
		var content, out = '';
		for (var i = 0; i < conversion.length; i ++)
		{
			//var formatDef = cryptii.conversion.formats['roman-numerals'];
			//var romanNumerals = formatDef.romanNumerals;

			content = conversion[i];

			if (content.length > 0)
			{
				var error = false;
				var decimal = 0;
				var previousHighestRomanNumeral = 1001;

				do
				{
					// find the highest roman numeral with the highest
					//  decimal value that is taken from the left
					//  part of the roman numeral
					var highestRomanNumeral = 0;

					for (var romanNumeral in this.romanNumerals)
					{
						var written = this.romanNumerals[romanNumeral];
						if (content.substr(0, written.length) == written)
							highestRomanNumeral =
								Math.max(highestRomanNumeral, romanNumeral);
					}

					if (highestRomanNumeral != 0
						&& highestRomanNumeral <= previousHighestRomanNumeral)
					{
						// add roman numeral (digit) to result
						decimal += highestRomanNumeral;

						// remove roman digit
						content = content.substr(this.romanNumerals[highestRomanNumeral].length);

						// update previous highest roman numeral
						previousHighestRomanNumeral = highestRomanNumeral;
					}
					else
					{
						// there is a not-recognized letter
						//  or this roman numeral letter is bigger than the last one
						//  or this roman numeral letter appears for the 4th time
						//  cancel
						error = true;
					}
				}
				// do this until the roman numeral is
				//  completely converted in decimal
				//  or an error occurs
				while (content.length > 0 && !error);

				out += String.fromCharCode(decimal);
			}
		}

		if (!error)
			return out;

		return false;
	},
};

