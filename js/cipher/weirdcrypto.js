
var WeirdCrypto = {
	
	//http://crypo.in.ua/tools/eng_megan35c.php

	keyStrMegan35	: "3GHIJKLMNOPQRSTU" + "b=cdefghijklmnop" + "WXYZ/12+406789Va" + "qrstuvwxyzABCDEF" + "5",
	keyStrTripo5	: "ghijopE+G78lmnIJ" + "QRXY=abcS/UVWdef" + "ABCs456tDqruvNOP" + "wx2KLyz01M3Hk9ZF" + "T",
	keyStrAtom128	: "/128GhIoPQROSTeU" + "bADfgHijKLM+n0pF" + "WXY456xyzB7=39Va" + "qrstJklmNuZvwcdE" + "C",
	keyStrGila7		: "7ZSTJK+W=cVtBCas" + "yf0gzA8uvwDEq3XH" + "/1RMNOILPQU4klm6" + "5YbdeFrx2hij9nop" + "G",
	keyStrHazz15	: "HNO4klm6ij9n+J2h" + "yf0gzA8uvwDEq3X1" + "Q7ZKeFrWcVTts/MR" + "GYbdxSo=ILaUpPBC" + "5",
	keyStrEsab46	: "ABCDqrs456tuvNOP" + "wxyz012KLM3789=+" + "QRSTUVWXYZabcdef" + "ghijklmnopEFGHIJ" + "/",
	keyStrTigo3fx	: "FrsxyzA8VtuvwDEq" + "WZ/1+4klm67=cBCa" + "5Ybdef0g2hij9nop" + "MNO3GHIRSTJKLPQU" + "X",
	keyStrFeron74	: "75XYTabcS/UVWdef" + "ADqr6RuvN8PBCsQt" + "wx2KLyz+OM3Hk9gh" + "i01ZFlmnjopE=GIJ" + "4",
	keyStrZong22	: "ZKj9n+yf0wDVX1s/" + "5YbdxSo=ILaUpPBC" + "Hg8uvNO4klm6iJGh" + "Q7eFrWczAMEq3RTt" + "2",



	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			return;
		}

		if (CURRENTSCRATCHPAD.realvalue != '')
		{
			console.warn('WeirdCrypto is currently disabled because the autoPWN function fully covers this. Silently exiting.');
			return;
			
			Timer.start();	//Megan-35, Tripo-5, Atom-128, Gila-7, Hazz-15, Esab-46, Tigo-3fx, Feron-74, Zong-22
			document.getElementById('Megan35_output').innerHTML = Teacher.analyzeValue(WeirdCrypto.calcDecodeMegan35GetResult(CURRENTSCRATCHPAD.realvalue), 'Megan-35()');
			document.getElementById('Tripo5_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeTripo5GetResult(CURRENTSCRATCHPAD.realvalue), 'Tripo-5()');
			document.getElementById('Atom128_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeAtom128GetResult(CURRENTSCRATCHPAD.realvalue), 'Atom-128()');
			document.getElementById('Gila7_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeGila7GetResult(CURRENTSCRATCHPAD.realvalue), 'Gila-7()');
			document.getElementById('Hazz15_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeHazz15GetResult(CURRENTSCRATCHPAD.realvalue), 'Hazz-15()');
			document.getElementById('Esab46_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeEsab46GetResult(CURRENTSCRATCHPAD.realvalue), 'Esab-46()');
			document.getElementById('Tigo3fx_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeTigo3fxGetResult(CURRENTSCRATCHPAD.realvalue), 'Tigo-3fx()');
			document.getElementById('Feron74_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeFeron74GetResult(CURRENTSCRATCHPAD.realvalue), 'Feron-74()');
			document.getElementById('Zong22_output').innerHTML	= Teacher.analyzeValue(WeirdCrypto.calcDecodeZong22GetResult(CURRENTSCRATCHPAD.realvalue), 'Zong-22()');
			Timer.stop("Megan-35, Tripo-5, Atom-128, Gila7, Hazz15, Esab46, Tigo-3fx, Feron-74, Zong-22 - Nine");
		}
	},


	calcDecodeMegan35GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrMegan35, 'Megan-35()');
	},
	calcDecodeMegan35GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrMegan35, 'Megan-35()');
	},
	calcDecodeTripo5GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrTripo5, 'Tripo-5()');
	},
	calcDecodeTripo5GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrTripo5, 'Tripo-5()');
	},
	calcDecodeAtom128GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrAtom128, 'Atom-128()');
	},
	calcDecodeAtom128GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrAtom128, 'Atom-128()');
	},
	calcDecodeGila7GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrGila7, 'Gila-7()');
	},
	calcDecodeGila7GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrGila7, 'Gila-7()');
	},
	calcDecodeHazz15GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrHazz15, 'Hazz-15()');
	},
	calcDecodeHazz15GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrHazz15, 'Hazz-15()');
	},
	calcDecodeEsab46GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrEsab46, 'Esab-46()');
	},
	calcDecodeEsab46GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrEsab46, 'Esab-46()');
	},
	calcDecodeTigo3fxGetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrTigo3fx, 'Tigo-3FX()');
	},
	calcDecodeTigo3fxGetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrTigo3fx, 'Tigo-3FX()');
	},
	calcDecodeFeron74GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrFeron74, 'Feron-74()');
	},
	calcDecodeFeron74GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrFeron74, 'Feron-74()');
	},
	calcDecodeZong22GetResult : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetResult(originaltext, this.keyStrZong22, 'Zong-22()');
	},
	calcDecodeZong22GetSteps : function(originaltext)
	{
		return WeirdCrypto.calcDecodeGetSteps(originaltext, this.keyStrZong22, 'Zong-22()');
	},


	calcDecodeGetResult : function(originaltext, keyStr, cipherFunc)
	{
		var ret = WeirdCrypto.calcDecodeGetSteps(originaltext, keyStr, cipherFunc);
		if(ret && $.isArray(ret) && ret.length>0){
			return ret[ret.length-1].value;
		}
		return false;
	},
	calcDecodeGetSteps : function(originaltext, keyStr, cipherFunc)
	{
		var res = WeirdCrypto.decode(originaltext, keyStr);
		if(res && res.length && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(res)) {
			return [Teacher.analyzeValueDoNotSaveGrade(res, cipherFunc)];
		}
		else 
		{
			res = WeirdCrypto.decode(T_ReverseString(originaltext), keyStr);
			if(res && res.length && /^[0-9A-Za-z\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n\ ]*$/.test(res)) {
				return [Teacher.analyzeValueDoNotSaveGrade(T_ReverseString(originaltext), 'reverse()'), Teacher.analyzeValueDoNotSaveGrade(res, cipherFunc)];
			}
		}
		return false;
	},
	encode : function(input, keyStr)
	{
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	},
	decode : function(input, keyStr)
	{
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		var mimcod = /[^A-Za-z0-9\+\/\=]/g;
		if (mimcod.test(input)) {
			return false;
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return unescape(output);
	},

	
};

