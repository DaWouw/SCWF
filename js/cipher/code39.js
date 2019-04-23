
var Code39 = {


	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			return;
		}

		var e = document.getElementById('CODE39_output');

		if (CURRENTSCRATCHPAD.realvalue != '')
		{
			Timer.start();
			//ttwtttwwtt wtttwttwtt twwtttwttt  wwttwttttt wtttwttwtt wwttttttwt twwtttwttt  wttttttwwt ttttwttwwt wtttwttwtt wwwttttttt twwtttwttt  wwwttttttt wttttwwttt wttttwttwt ttttwtwwtt twwtttwttt  wtwttwtttt wtttwttwtt ttttwwttwt wtttwwtttt wtwwtttttt ttwwttwttt twwtttwttt  ttwttttwwt wtttwttwtt wtttwttwtt wttttttwwt ttwtttwwtt twwtttwttt  ttwttttwwt ttwttwwttt wttttttwwt wtttwwtttt wwttttwttt
			var ret = Code39.decodeCode39GetSteps(CURRENTSCRATCHPAD.realvalue, true);
			if(ret && $.isArray(ret) && ret.length>0) {
				e.innerHTML = Teacher.analyzeValue(ret[ret.length-1].value, 'code39()');
			}
			Timer.stop("Code39 (barcode) - Double");
		}
	},

	decodeCode39GetSteps : function(originaltext, noOutputValidation)	//With autochecker for auto binary check
	{
		var text = originaltext.replace(/\s/g,'');
		noOutputValidation = (typeof noOutputValidation == "undefined")? false : noOutputValidation;
		if (text.length >= 30 && text.replace(/\s/g,'').length%10 == 0)	//ttttwtwwtt wtttwwtttt ttwtttwwtt ttttwtwwtt wttwttttwt	//TEST1
		{
			var digits = Binary.getDigitsIfBinary(text);
			if(digits) {
				var possibleCode39 = Binary.replaceBoth(text, digits[0], '0', digits[1], '1');
				var zeros = possibleCode39.match(/0/g);
				var ones = possibleCode39.match(/1/g);
				if(zeros && ones) {
					var nrzeros = zeros.length;
					var nrones  = ones.length;
					if( (nrzeros%7 == 0 && nrones%3 == 0 && nrzeros/7 == nrones/3) || (nrzeros%3 == 0 && nrones%7 == 0 && nrzeros/3 == nrones/7) )
					{
						//alert('Code39 found. It matches (#0)/3 == (#1)/7 or vise versa exactly. So certainty is high.');
						var code39input = '';
						if(nrzeros%7 == 0 && nrones%3 == 0 && nrzeros/7 == nrones/3) {
							code39input = Binary.replaceBoth(text, digits[0], 't', digits[1], 'w');
						} else if(nrzeros%3 == 0 && nrones%7 == 0 && nrzeros/3 == nrones/7) {
							code39input = Binary.replaceBoth(text, digits[0], 't', digits[1], 'w');
						} else {
							alert('How did I get here @checkAllDecodings() @ code39?');
						}

						var output = Code39.calc(code39input);
						if(noOutputValidation) {
							return output;
						} else if(output && $.isArray(output) && output.length>0) {
							var temp = output[output.length-1].value;
							if(/^[0-9A-Z\-\.\ \*\$\/\+\%]+$/.test(temp) && ! /tw/g.test(temp)) {
								return output;
							}
						} else {
							alert('Code39 found but could not decode somehow. It matches (#0)/3 == (#1)/7 or vise versa exactly. So certainty is still high. Try Code39.decodeCode39GetSteps(input, true); to skip output validation.');
						}
						return false;
					}
				}
			}
		}
		return false;
	},

	/*function decodeCode39(originaltext)	//With autochecker for auto binary check
	{
		var digits = Binary.getDigitsIfBinary(originaltext);
		return calcDecodeCode39GetResult(Binary.replaceBoth(originaltext, digits[0], '0', digits[1], '1'));
	},

	function decodeCode39GetStepsNoChecks(originaltext)	//With autochecker for auto binary check
	{
		var digits = Binary.getDigitsIfBinary(originaltext);
		return this.calc(Binary.replaceBoth(originaltext, digits[0], 't', digits[1], 'w'));
	},

	function calcDecodeCode39GetResult(originaltext)
	{
		var ret = Code39.calc(originaltext);
		if(ret && $.isArray(ret) && ret.length>0){
			return ret[ret.length-1].value;
		}
		return false;
	},*/
	
	calc : function(text)
	{
		var temp = text.replace(/\s/g,'').match(/(..........?)/g).join('@');
		var mapObj = {
			'wttwttttwt' : '1',
			'ttwwttttwt' : '2',
			'wtwwtttttt' : '3',
			'tttwwtttwt' : '4',
			'wttwwttttt' : '5',
			'ttwwwttttt' : '6',
			'tttwttwtwt' : '7',
			'wttwttwttt' : '8',
			'ttwwttwttt' : '9',
			'tttwwtwttt' : '0',
			'wttttwttwt' : 'A',
			'ttwttwttwt' : 'B',
			'wtwttwtttt' : 'C',
			'ttttwwttwt' : 'D',
			'wtttwwtttt' : 'E',
			'ttwtwwtttt' : 'F',
			'tttttwwtwt' : 'G',
			'wttttwwttt' : 'H',
			'ttwttwwttt' : 'I',
			'ttttwwwttt' : 'J',
			'wttttttwwt' : 'K',
			'ttwttttwwt' : 'L',
			'wtwttttwtt' : 'M',
			'ttttwttwwt' : 'N',
			'wtttwttwtt' : 'O',
			'ttwtwttwtt' : 'P',
			'ttttttwwwt' : 'Q',
			'wtttttwwtt' : 'R',
			'ttwtttwwtt' : 'S',
			'ttttwtwwtt' : 'T',
			'wwttttttwt' : 'U',
			'twwtttttwt' : 'V',
			'wwwttttttt' : 'W',
			'twttwtttwt' : 'X',
			'wwttwttttt' : 'Y',
			'twwtwttttt' : 'Z',
			'twttttwtwt' : '-',
			'wwttttwttt' : '.',
			'twwtttwttt' : ' ',
			'twttwtwttt' : '*',
			'twtwtwtttt' : '$',
			'twtwtttwtt' : '/',
			'twtttwtwtt' : '+',
			'tttwtwtwtt' : '%',
		};

		var output = null;
		var reversed = false;
		while(true)
		{
			output = temp.replace(/wttwttttwt|ttwwttttwt|wtwwtttttt|tttwwtttwt|wttwwttttt|ttwwwttttt|tttwttwtwt|wttwttwttt|ttwwttwttt|tttwwtwttt|wttttwttwt|ttwttwttwt|wtwttwtttt|ttttwwttwt|wtttwwtttt|ttwtwwtttt|tttttwwtwt|wttttwwttt|ttwttwwttt|ttttwwwttt|wttttttwwt|ttwttttwwt|wtwttttwtt|ttttwttwwt|wtttwttwtt|ttwtwttwtt|ttttttwwwt|wtttttwwtt|ttwtttwwtt|ttttwtwwtt|wwttttttwt|twwtttttwt|wwwttttttt|twttwtttwt|wwttwttttt|twwtwttttt|twttttwtwt|wwttttwttt|twwtttwttt|twttwtwttt|twtwtwtttt|twtwtttwtt|twtttwtwtt|tttwtwtwtt/gi, function(matched){ return mapObj[matched]; }).replace(/@/g,'');
			if(output.length < (text.length>>1) ) {	//Decoded it :) break and return
				if( ! reversed ) output = [Teacher.analyzeValueDoNotSaveGrade(output, 'code39()')];
				else output = [Teacher.analyzeValueDoNotSaveGrade(T_ReverseString(text), 'reverse()'), Teacher.analyzeValueDoNotSaveGrade(output, 'code39()')];
				break;
			} else if(output.length >= (text.length>>1) && !reversed) {	//Let's reverse the input once!
				temp = T_ReverseString(temp);
				reversed = true;
				continue;
			} else {					//Even reversing it didn't work... :( Let's return false;
				output = false;
				break;
			}
		}
		return output;
	},
	
};

