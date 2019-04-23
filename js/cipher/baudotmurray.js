

var BaudotMurray = {

	codes : {
		'00011': ['a', '-'],
		'11001': ['b', '?'],
		'01110': ['c', ':'],
		'01001': ['d', 'Who\'s there?'],
		'00001': ['e', '3'],
		'01101': ['f', undefined],
		'11010': ['g', undefined],
		'10100': ['h', undefined],
		'00110': ['i', '8'],
		'01011': ['j', '*bell*'],
		'01111': ['k', '('],
		'10010': ['l', ')'],
		'11100': ['m', '.'],
		'01100': ['n', ','],
		'11000': ['o', '9'],
		'10110': ['p', '0'],
		'10111': ['q', '1'],
		'01010': ['r', '4'],
		'00101': ['s', "'"],
		'10000': ['t', '5'],
		'00111': ['u', '7'],
		'11110': ['v', '='],
		'10011': ['w', '2'],
		'11101': ['x', '/'],
		'10101': ['y', '6'],
		'10001': ['z', '+'],
		'01000': ["\n", "\n"],
		'00010': ["\t", "\t"],
		'00100': [' ', ' '],
		'11111': ['letters', 'letters'],
		'11011': ['figures', 'figures']
	},

	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {

			Timer.start();
			var digits = Binary.getDigitsIfBinary(CURRENTSCRATCHPAD.realvalue);
			try {
				if(digits) {
					var temp = BaudotMurray.calcDecodeBaudotMurrayGetSteps(Binary.replaceBoth(CURRENTSCRATCHPAD.realvalue, digits[0], '0', digits[1], '1'), true);
					if(temp && temp.length && temp[0].value) {
						var certainty = REGEX_POSSIBLEFLAGCHARS.test(temp[0].value)?CertaintyEnum.WILDGUESS:CertaintyEnum.DESPERATE;
						document.getElementById('ASCII_baudotmurray').innerHTML = Guesses.analyzeGuessAndGradeValue([temp[0].value, certainty], 'baudot_murray()');
					}
				}
			} catch(e) {}

			Timer.stop("BaudotMurray - Single");
		}
	},

	calcDecodeBaudotMurrayGetSteps : function(originaltext, noOutputValidation)
	{

		var text;
		var digits = Binary.getDigitsIfBinary(originaltext);
		noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
		if(digits) {
			originaltext = originaltext.replace(/[ \r\n]+/g, "");
			if(digits[0] != '0' || digits[1] != '1') {
				alert('calcDecodeBaudotMurrayGetSteps(input) should run with 0\'s and 1\'s. Use decodeBinary instead');
			}
			eval("text = originaltext.replace(/(["+digits[0]+''+digits[1]+"]{5})/g, '$& ');");
			var res = BaudotMurray.calc(text.split(' '));
			if(res && (REGEX_FILE_TYPES.test(res) || REGEX_TEXTNUMBERSSPECIALCHARS.test(res) || noOutputValidation)) {
				return [Teacher.analyzeValueDoNotSaveGrade(res, 'baudot_murray()')];
				//return res;
			} else {
				return false;
			}
		}
		return false;
	},

	calc : function(text)
	{
		var ita2Code = BaudotMurray.codes;

		// shift
		var letterShift = true;
		var output = '';

		// go through splitted content
		for (var i = 0; i < text.length && text[i].length; i ++)
		{
			var entry = text[i];
			var row = ita2Code[entry];

			if (row != undefined)
			{
				var ita2Entry = row[letterShift ? 0 : 1];

				if (ita2Entry == undefined)
					return false;
				else if (ita2Entry == 'letters')
					letterShift = true;
				else if (ita2Entry == 'figures')
					letterShift = false;
				else
					output += ita2Entry;
			}
			else
				return false;
		}
		return output;
	},
};