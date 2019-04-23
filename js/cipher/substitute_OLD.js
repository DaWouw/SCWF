
SUBSTITUTE_force_run = 0;

function SUBSTITUTE_upd() {
	var alpha, elem, isunchanged, t, currentmethod;

	isunchanged = IsUnchangedVar.text *  IsUnchangedVar.SUBSTITUTE_key;

	if (isunchanged && SUBSTITUTE_force_run == 0) {
		//window.setTimeout('SUBSTITUTE_upd()', 100);
		return;
	}

	SUBSTITUTE_force_run = 0;
	//ResizeTextArea(CURRENTSCRATCHPAD);
	
	elem = document.getElementById('SUBSTITUTE_alphabet');

	if (document.encoder.SUBSTITUTE_key.value != '') {
		alpha = MakeKeyedAlphabet(document.encoder.SUBSTITUTE_key.value);
		elem.innerHTML = alpha;
		t = Caesar.calc(1, CURRENTSCRATCHPAD.realvalue, 0, alpha);
	} else {
		elem.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		t = CURRENTSCRATCHPAD.realvalue;
	}

	
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output', false);
	
	currentmethod = document.encoder.SUBSTITUTE_method.value;
	
	/*SUBSTITUTE_upd_method('I_bionicle');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output1', 'I_bionicle');
	SUBSTITUTE_upd_method('I_braille');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output2', 'I_braille');
	SUBSTITUTE_upd_method('I_braille2');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output3', 'I_braille2');
	SUBSTITUTE_upd_method('I_dancingmen');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output4', 'I_dancingmen');
	SUBSTITUTE_upd_method('I_pigpen');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output5', 'I_pigpen');
	SUBSTITUTE_upd_method('I_pigpen2');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output6', 'I_pigpen2');*/
	SUBSTITUTE_upd_method('T_alphabet');
	SUBSTITUTE_ProcessDecodeBox(0, 'SUBSTITUTE_output7');
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output7', 'T_alphabet');
	SUBSTITUTE_upd_method('T_goldbug');
	SUBSTITUTE_ProcessDecodeBox(0, 'SUBSTITUTE_output8');
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output8', 'T_goldbug');
	SUBSTITUTE_upd_method('TI_decimal');
	SUBSTITUTE_ProcessDecodeBox(0, 'SUBSTITUTE_output9');
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output9', 'TI_decimal');
	/*SUBSTITUTE_upd_method('TI_hex');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output10', 'TI_hex');
	SUBSTITUTE_upd_method('TI_bin');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output11', 'TI_bin');
	SUBSTITUTE_upd_method('TI_octal');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output12', 'TI_octal');*/
	SUBSTITUTE_upd_method('T_spirit');
	SUBSTITUTE_ProcessDecodeBox(0, 'SUBSTITUTE_output13');
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output13', 'T_spirit');
	SUBSTITUTE_upd_method('T_phone');
	SUBSTITUTE_Encode(t, 'SUBSTITUTE_output14', 'T_phone');
	SUBSTITUTE_upd_method('T_phonedec');
	SUBSTITUTE_ProcessDecodeBox(0, 'SUBSTITUTE_output15');
	//SUBSTITUTE_Encode(t, 'SUBSTITUTE_output15', 'T_phonedec');

	document.encoder.SUBSTITUTE_method.value = currentmethod;
	SUBSTITUTE_upd_method(currentmethod);
	SUBSTITUTE_force_run = 0;
	
	//window.setTimeout('SUBSTITUTE_upd()', 100);
}


function SUBSTITUTE_upd_method(overrulemethod) {
	var elem = document.getElementById('SUBSTITUTE_moreinput');
	if(overrulemethod == false && document.encoder.SUBSTITUTE_method == null) return;
	var method = overrulemethod.length?overrulemethod:document.encoder.SUBSTITUTE_method.value;

	if (method.charAt(0) == 'I') {
		elem.innerHTML = SUBSTITUTE_ShowImages(method);
	} else if (method.charAt(0) == 'T') {
		elem.innerHTML = SUBSTITUTE_ShowText(method);
		elem.innerHTML += SUBSTITUTE_ShowDecodeBox();
	} else {
		elem.innerHTML = "";
	} 

	if(overrulemethod==false) SUBSTITUTE_force_run = 1;
}


function SUBSTITUTE_Tel_upd() {
	var slash1 = HTMLEscape(document.encoder.slash1.value);
	var slash2 = HTMLEscape(document.encoder.slash2.value);
	var slash3 = HTMLEscape(document.encoder.slash3.value);
	var tel_q = HTMLEscape(document.encoder.tel_q.value);
	var tel_z = HTMLEscape(document.encoder.tel_z.value);
	var lett = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var letn = '1231231231231231 23123123 ';
	var letb = '2223334445556667 77888999 ';

	for (var i = 0; i < lett.length; i ++) {
		var elem = document.getElementById('Text_Link_' + lett.charCodeAt(i));
		if (letn.charAt(i) == '1') {
			elem.innerHTML = letb.charAt(i) + slash1;
		} else if (letn.charAt(i) == '2') {
			elem.innerHTML = letb.charAt(i) + slash2;
		} else if (letn.charAt(i) == '3') {
			elem.innerHTML = letb.charAt(i) + slash3;
		} else if (lett.charAt(i) == 'Q') {
			elem.innerHTML = tel_q;
		} else {
			elem.innerHTML = tel_z;
		}
	}

	SUBSTITUTE_force_run = 1;
}




function SUBSTITUTE_Encode(t, elemname, overrulemethod) {
	var elem, method;
	elem = document.getElementById(elemname);

	method = overrulemethod.length?overrulemethod:document.encoder.SUBSTITUTE_method.value;
	
	if (t == "") {
		elem.style.fontSize = "20px";
		elem.innerHTML = "<i>Type a message and it will be encoded here!</i>";
	} else if (method.charAt(0) == 'I') {
		elem.style.fontSize = "30px";
		elem.innerHTML = SUBSTITUTE_EncodeImage(method, t);
	} else if (method.charAt(0) == 'T') {
		if (method != 'T_spirit') {
			elem.style.fontSize = "30px";
		} else {
			elem.style.fontSize = "1em";
		}
		elem.innerHTML = SUBSTITUTE_EncodeText(method, t);
	} else {
		elem.style.fontSize = "20px";
		elem.innerHTML = t;
	}
}


function SUBSTITUTE_EncodeImage(set, t) {
	var pos = set.indexOf('_');
	var s = "";
	
	if (pos >= 0) {
		set = set.slice(pos + 1, set.length);
	}

	if (set == 'braille') {
		t = Braille_Translate(t);

		for (var i = 0; i < t.length; i ++) {
			s += Braille_Image(t.charAt(i));
		}

		return s;
	}

	if (set == 'braille2') {
		for (var i = 0; i < t.length; i ++) {
			s += Braille_Image(t.charAt(i).toLowerCase());
		}

		return s;
	}

	t = t.toUpperCase();

	for (var i = 0; i < t.length; i ++) {
		var thisChar = t.charAt(i);
		var isAlpha = (thisChar >= 'A' && thisChar <= 'Z')? 1 : 0;
		var isNum = (thisChar >= '0' && thisChar <= '9')? 1 : 0;
		var validChar = isAlpha;

		if (set == 'bionicle' || set == 'dancingmen') {
			validChar = (isNum || isAlpha)? 1 : 0;
		}
		if (validChar) {
			if (set == 'dancingmen' && ! isNum && (t.charAt(i + 1) == ' ' || t.length == i + 1)) {
				s += "<img src=\"media/" + set + "/" + thisChar + "_.gif\">";
				i ++;
			} else {
				s += "<img src=\"media/" + set + "/" + thisChar + ".gif\">";
			}
		} else {
			if (thisChar == "\n") {
				s += "<br>\n";
			} else {
				s += HTMLEscape(thisChar);
			}
		}
	}

	return s;
}


function SUBSTITUTE_EncodeText(set, t) {
	var pos = set.indexOf('_');
	var flags = '';
	var s = '';

	if (pos >= 0) {
		flags = set.slice(0, pos);
		set = set.slice(pos + 1, set.length);
	}

	if (set == 'phonedec') {
		t = t.toUpperCase();
		var codes = '0 1 2,A,B,C 3,D,E,F 4,G,H,I 5,J,K,L 6,M,N,O 7,P,Q,R,S 8,T,U,V 9,W,X,Y,Z'.split(' ');
		for (var i = 0; i < codes.length; i ++) {
			codes[i] = codes[i].split(',');
		}
		for (var i = 0; i < t.length; i ++) {
			var c = t.charAt(i);
			var cCode = c.charCodeAt(0);
			if (cCode < 10 || cCode >= 100) {
				s += c;
			} else {
				for (var j = 0; j < 2; j ++) {
					var idx = cCode.toString().charAt(j);
					var max = codes[idx].length;
					var rnd = Math.floor(Math.random() * max);
					s += codes[idx][rnd];
				}
			}
		}
	} else {
		for (var i = 0; i < t.length; i ++) {
			var c = t.charAt(i);

			if (flags.indexOf('I') < 0) {
				c = c.toUpperCase();
			}
			
			var e = document.getElementById('Text_Link_' + c.charCodeAt(0));

			if (e) {
				s += e.innerHTML;
			} else {
				s += c;
			}

			if (set == 'decimal') {
				s += ' ';  // Need a space between numbers
			}
		}
	}
	
	return HTMLEscape(s);
}


function SUBSTITUTE_ShowImages(set) {
	var pos = set.indexOf('_');
	var s = "Click on the images to add them to the message.<br>";
	var lett = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	if (pos >= 0) {
		set = set.slice(pos + 1, set.length);
	}

	if (set == 'bionicle' || set == 'dancingmen') {
		lett += '0123456789';
	}

	for (var i = 0; i < lett.length; i ++) {
		s += "<a href=\"#\" onclick=\"return SUBSTITUTE_L('" + lett.charAt(i) + "');\"><img src=\"media/" + set + "/" + lett.charAt(i) + ".gif\" border=0></a>";
	}

	if (set == 'dancingmen') {
		s += "<br>";
		flaglett = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		for (var i = 0; i < flaglett.length; i ++) {
			s += "<a href=\"#\" onclick=\"return SUBSTITUTE_L('" + flaglett.charAt(i) + " ');\"><img src=\"media/" + set + "/" + flaglett.charAt(i) + "_.gif\" border=0></a>";
		}
	}

	if (set == 'braille' || set == 'braille2') {
		// Start over.
		s = "";

		if (set == 'braille') {
			lett = lett.toLowerCase();
		} else {
			lett = Braille_LetterSet();
		}

		for (var i = 0; i < lett.length; i ++) {
			// No need to use Braille_Recode() on just A-Z
			s += "<a href=\"#\" onclick=\"return SUBSTITUTE_L('";

			if (lett.charAt(i) == '\'' || lett.charAt(i) == '\\') {
				s += '\\';
			}

			s += lett.charAt(i) + "');\">" + Braille_Image(lett.charAt(i)) + "</a>";

			if (i == 31) {
				s += '<br>';
			}
		}
	}

	return s;
}


function SUBSTITUTE_ShowText(set) {
	var lett = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var pos = set.indexOf('_');
	var flags = '';

	if (pos >= 0) {
		flags = set.slice(0, pos);
		set = set.slice(pos + 1, set.length);
	}

	if (set == 'goldbug' || set == 'spirit') {
		var s = '';

		if (set == 'goldbug') {
			var patt = '0 1 2 3 4 5 6 7 8 9 . , : ; ( ) [ ] &dagger; &Dagger; $ &cent; - * ? &para;';
			var alph = 'L F B G H A I K E M P J Y T R S Z W D O Q X C N U V';
		} else if (set == 'spirit') {
			var patt = '--- --1 -1- -11 1-- 1-1--- 1-1--1 1-1-1- 1-1-11 1-11-- 1-11-1 1-111- 1-1111--- 1-1111--1 1-1111-1- 1-1111-11 1-11111-- 1-11111-1 11---- 11---1 11--1- 11--11 11-1-- 11-1-1 11-11- 11-111 111';
			var alph = '&nbsp; E A O R M W F G Y P B V K J X Q Z T I N H D L C U S';
		}
		
		while (patt.length > 0 && alph.length > 0) {
			var letter, token, i;
			
			if (s.length > 0) {
				s += ' &nbsp; ';
			}
			
			i = patt.indexOf(' ');

			if (i >= 0) {
				token = patt.slice(0, i);
				patt = patt.slice(i + 1, patt.length);
			} else {
				token = patt;
				patt = '';
			}
			
			i = alph.indexOf(' ');

			if (i >= 0) {
				letter = alph.slice(0, i);
				alph = alph.slice(i + 1, alph.length);
			} else {
				letter = alph;
				alph = '';
			}
			
			s += '<a onclick="return SUBSTITUTE_L(\'' + letter + '\')" id="Text_Link_';

			if (letter == '&nbsp;') {
				s += ' '.charCodeAt(0);
			} else {
				s += letter.charCodeAt(0);
			}

			s += '" href="#" style="text-decoration: none">' + token + '</a>';
		}
		
		return "<font size=+2><b>" + s + "</b></font>"
	}

	if (set == 'phone') {
		var s = '';
		var patt = "2\\2|2/3\\3|3/4\\4|4/5\\5|5/6\\6|6/7\\0\\7|7/8\\8|8/9\\9|9/0/";
		var c = 'onkeypress="SUBSTITUTE_Tel_upd()" onkeyup="SUBSTITUTE_Tel_upd()" onchange="SUBSTITUTE_Tel_upd()"';
		s += 'Left: <input type="text" name="slash1" size=1 value="\\" ' + c + '> &nbsp; ';
		s += 'Middle: <input type="text" name="slash2" size=1 value="|" ' + c + '> &nbsp; ';
		s += 'Right: <input type="text" name="slash3" size=1 value="/" ' + c + '> &nbsp; ';
		s += 'Q: <input type="text" name="tel_q" size=3 value="0\\" ' + c + '> &nbsp; ';
		s += 'Z: <input type="text" name="tel_z" size=3 value="0/" ' + c + '><br>';
		
		for (var i = 0; i < lett.length; i ++) {
			if (i > 0) {
				s += ' &nbsp; ';
			}

			s += '<a onclick="return SUBSTITUTE_L(\'' + lett.charAt(i) + '\')" id="Text_Link_' + lett.charCodeAt(i) + '" href="#">';
			s += patt.charAt(2 * i) + patt.charAt((2 * i) + 1);
			s += '</a>'; 
		}
		
		return s;
	}

	if (set == 'alphabet') {
		var s = '';
		var l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		for (var i = 0; i < l.length; i ++) {
			if (s != '') {
				s += '&nbsp;&nbsp; ';
			}

			var c = l.charAt(i);
			var code = i;

			if (code < 10) {
				code = "0" + code;
			}

			c = "'" + c + "'";

			s += '<a onclick="return SUBSTITUTE_L(' + c + ')" id="Text_Link_' + 
			l.charCodeAt(i) + '" href="#">' + code + '</a>';
		}

		return s;
	}

	if (set == 'decimal') {
		var s = '';

		for (var i = 32; i < 127; i ++) {
			if (s != '') {
				s += '&nbsp;&nbsp; ';
			}

			var c = String.fromCharCode(i);

			if (c == "'" || c == "\\") {
				c = "\\" + c;
			}

			c = "'" + c + "'";

			if (c == "\'\"\'") {
				c = "String.fromCharCode(" + i + ")";
			}

			s += '<a onclick="return SUBSTITUTE_L(' + c + ')" id="Text_Link_' + i +
			'" href="#">' + i + '</a>';
		}

		return s;
	}

	if (set == 'hex') {
		var s = '';
		var hexchars = '0123456789ABCDEF';
		
		for (var i = 32; i < 127; i ++) {
			if (s != '') {
				s += '&nbsp;&nbsp; ';
			}
			
			var c = String.fromCharCode(i);

			if (c == "'" || c == "\\") {
				c = "\\" + c;
			}
			
			c = "'" + c + "'";

			if (c == "\'\"\'") {
				c = "String.fromCharCode(" + i + ")";
			}

			s += '<a onclick="return SUBSTITUTE_L(' + c + ')" id="Text_Link_' + i + '" href="#">';
			
			var h = i;
			s += hexchars.charAt(Math.floor(h / 16));
			h -= Math.floor(h / 16) * 16;
			s += hexchars.charAt(h);
			s += '</a>';
		}

		return s;
	}

	if (set == 'octal') {
		var s = '';
		
		for (var i = 32; i < 127; i ++) {
			if (s != '') {
				s += ' &nbsp; ';
			}
			
			var c = String.fromCharCode(i);

			if (c == "'" || c == "\\") {
				c = "\\" + c;
			}

			c = "'" + c + "'";

			if (c == "\'\"\'") {
				c = "String.fromCharCode(" + i + ")";
			}

			s += '<a onclick="return SUBSTITUTE_L(' + c + ')" id="Text_Link_' + i + '" href="#">';

			var o = i;
			s += Math.floor(o / 64);
			o -= Math.floor(o / 64) * 64;
			s += Math.floor(o / 8);
			o -= Math.floor(o / 8) * 8;
			s += o;
			s += '</a>';
		}
		
		return s;
	}

	if (set == 'bin') {
		var s = '';

		for (var i = 32; i < 127; i ++) {
			if (s != '') {
				s += '&nbsp;&nbsp; ';
			}

			var c = String.fromCharCode(i);

			if (c == "'" || c == "\\") {
				c = "\\" + c;
			}

			c = "'" + c + "'";

			if (c == "\'\"\'") {
				c = "String.fromCharCode(" + i + ")";
			}

			s += '<a onclick="return SUBSTITUTE_L(' + c + ')" id="Text_Link_' + i + '" href="#">';
			var b = '';
			var iCopy = i;
			for (var bits = 0; bits < 8; bits ++) {
				if (iCopy & 1 == 1) {
					b = '1' + b;
				} else {
					b = '0' + b;
				}
				iCopy = Math.floor(iCopy / 2);
			}
			s += b;
			s += '</a>';
		}

		return s;
	}

	if (set == 'phonedec') {
		return '';
	}
	
	return "Insert " + set + " text info here.";
}


function SUBSTITUTE_ShowDecodeBox() {
	return '<p>Enter a message to decode: ' +
	'<textarea name=decodeBox width=40 height=1>' +
	'</textarea> ' +
	'<span id=decodeBoxLink>[<a href="#" onclick="SUBSTITUTE_ProcessDecodeBox(0); return false">' +
	'Decode and Add to Message Box</a>]</span>' +
	'<span id=decodeBoxWorking style="display: none">[WORKING]</span>';
}




function GetSeconds() {
	var d = new Date();

	return d.getSeconds();
}


var Process_Text_Done;
var Process_Text_Lookup;

function SUBSTITUTE_ProcessDecodeBox(work, outputDivId) {
	//var t = document.encoder.decodeBox.value.toUpperCase();
	var t = CURRENTSCRATCHPAD.realvalue.toUpperCase();
	var d = GetSeconds();
	var Lookup = new Array();
	
	var outputDiv = document.getElementById(outputDivId);
	
	if (! work) {
		document.getElementById('decodeBoxLink').style.display = "none";
		document.getElementById('decodeBoxWorking').style.display = "inline";
		Process_Text_Done = '';//CURRENTSCRATCHPAD.realvalue;
		Process_Text_Lookup = new Array();

		if (document.encoder.SUBSTITUTE_method.value == 'T_phonedec') {
			var codes = '0 1 2,A,B,C 3,D,E,F 4,G,H,I 5,J,K,L 6,M,N,O 7,P,Q,R,S 8,T,U,V 9,W,X,Y,Z'.split(' ');
			for (var i = 0; i < codes.length; i ++) {
				codes[i] = codes[i].split(',');
			}

			for (var i = 10; i < 100; i ++) {
				var first = i.toString().charAt(0);
				var second = i.toString().charAt(1);
				for (var j = 0; j < codes[first].length; j ++) {
					for (var k = 0; k < codes[second].length; k ++) {
						Process_Text_Lookup[codes[first][j] + codes[second][k]] = String.fromCharCode(i);
					}
				}
			}
		} else {
			for (var i = 0; i < 256; i ++) {
				var e = document.getElementById('Text_Link_' + i.toString());

				if (e) {
					Process_Text_Lookup[e.innerHTML] = String.fromCharCode(i);
				}
			}
		}
		
		SUBSTITUTE_ProcessDecodeBox(1, outputDivId);
		//window.setTimeout('SUBSTITUTE_ProcessDecodeBox(1)', 1);
		return;
	}

	while (t.length && d == GetSeconds()) {
		var bestCode = null;
		
		for (var code in Process_Text_Lookup) {
			if (code == t.slice(0, code.length)) {
				if (bestCode == null || bestCode.length < code.length) {
					bestCode = code;
				}
			}
		}

		if (bestCode != null) {
			Process_Text_Done += Process_Text_Lookup[bestCode];
			t = t.slice(bestCode.length, t.length);
		} else {
			Process_Text_Done += t.charAt(0);
			t = t.slice(1, t.length);
		}
	}

	//document.encoder.decodeBox.value = t;
	//outputDiv.innerHTML = '|'+t+'|';

	if (t.length) {
		SUBSTITUTE_ProcessDecodeBox(1);
		//window.setTimeout('SUBSTITUTE_ProcessDecodeBox(1)', 1);
		return;
	}

	document.getElementById('decodeBoxWorking').style.display = "none";
	document.getElementById('decodeBoxLink').style.display = "inline";
	outputDiv.innerHTML = Process_Text_Done;
}


// If I get adventurous enough, rules about Braille substitutions and
// abbreviations are at
//   http://www.brl.org/formats/
//   http://brl.org/refdesk/rules/index.html

// Changes quotes, decimal points, numbers, and caps to be escaped
// appropriately.
function Braille_Translate(input) {
	var output = '';
	var words = input.split(' ');

	for (var wordnum = 0; wordnum < words.length; wordnum ++) {
		var word = words[wordnum];
		var word2 = Braille_Remap(word), word3;
		var i, flag;
		
		if (wordnum > 0) {
			output += ' ';
		}
		
		// This violates Rule 1 (General Rules), section B (Contractions
		// are not to be used when ...  This is due to the complexity of
		// determining where word syllables are in just a tiny bit of code.

		// Close quotes
		i = word.length - 1;

		while (i >= 0) {
			var c = word.charAt(i);

			if (c == '"') {
				word2 = word2.slice(0, i) + '0' + word2.slice(i + 1, word2.length);
				i = -1;
			}

			if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) {
				i = -1;
			}
			
			i --;
		}
		
		// Decimal point vs. period.  If a number is to either side,
		// assume decimal point.
		for (i = 0; i < word.length; i ++) {
			if (word.charAt(i) == '.') {
				if ((i > 0 && word.charAt(i - 1) >= '0' && word.charAt(i - 1) <= '9') || (i < word.length - 1 && word.charAt(i + 1) >= '0' && word.charAt(i + 1) <= '9')) {
					word2 = word2.slice(0, i) + '.' + word2.slice(i + 1, word2.length);
				}
			}
		}
		
		// Escape numbers
		// This is the first place things could get inserted.
		flag = 0;  // Is in alpha mode
		word3 = '';
		for (i = 0; i < word2.length; i ++) {
			var c = word.charAt(i).toUpperCase();
			if (flag == 0) {
				if (c >= '0' && c <= '9') {
					flag = 1;
					word3 += '#';
				}
			} else if (flag == 1) {
				if (c >= 'A' && c <= 'Z') {
					flag = 0;
					word3 += ';';
				} else if (c != ',' && c != ':' && c != '-' && c != '.') {
					// All other punctuation stops number encoding.
					flag = 0;
				}
			}
			word3 += word2.charAt(i);
		}
		word2 = word3;
		
		// Escape caps
		// Things could have been inserted before here, so we need to base
		// everything on word2.
		flag = 0;
		word3 = word.toLowerCase();
		if (word != word3 && word3 != word.toUpperCase()) {
			if (word == word.toUpperCase()) {
				// Escape whole word.  If only 1 alpha, 1 symbol.
				// If more than one letter, 2 symbols.
				flag = 0;
				for (i = 0; i < word3.length; i ++) {
					if (word3.charAt(i) >= 'a' && word.charAt(i)) {
						flag ++;
					}
				} if (flag > 1) {
					word2 = ',,' + word2;
				} else {
					word2 = ',' + word2;
				}
			} else {
				// Escape just before caps letters
				word3 = '';
				for (i = 0; i < word2.length; i ++) {
					var c = word2.charAt(i);

					if (c >= 'A' && c <= 'Z') {
						word3 += ',';
					}
					word3 += c;
				}
				word2 = word3;
			}
		}

		word2 = word2.toLowerCase();
		output += word2;
	}

	return output;
}


function Braille_Remap(c) {
	// Not 100% perfect.
	// Mostly taken from http://www.omniglot.com/writing/braille.htm
	var From = '1234567890,:.?!"[]()';
	var To =   'abcdefghij1245687777';
	var c2 = '';

	for (var i = 0; i < c.length; i ++) {
		var p = From.indexOf(c.charAt(i));

		if (p >= 0) {
			c2 += To.charAt(p);
		} else {
			c2 += c.charAt(i);
		}
	}

	return c2;
}


function Braille_LetterSet() {
	return " a1b'k2l@cif/msp\"e3h9o6r^djg>ntq,*5<-u8v.%[$+x!&;:4\\0z7(_?w]#y)=";
}


function Braille_Image(c) {
	// Character mapping taken from
	// http://interglacial.com/~sburke/braille/table.html
	// This has differences when compared to Wikipedia
	//   Char   Notes
	// --------------------------------------------------
	//    .     Decimal point.  A normal period is '4'.
	//    #     Number follows
	//    ,     Capital follows.  Normal comma is '1'.
	//          ',,' means the whole word is capitalized.
	//    ?     'th' contraction.  Normal question mark is '5'.
	//    :     'wh' contraction.  Normal semicolon is '2'.
	//    !     'the-' prefix or 'the' word.  Normal exclamation is '6'.
	//    8     'his' or open quotation mark.
	//    0     'was' or close quotation mark.
	//    7     Bracket or parenthesis.
	// Also, numbers should be remapped to a-j (a=1, i=9, j=0)

	var LL = Braille_LetterSet();
	var p = LL.indexOf(c);

	if (p >= 0) {
		var bf = '';

		if (p >= 32) {
			p -= 32;
			bf = '6' + bf;
		}

		if (p >= 16) {
			p -= 16;
			bf = '5' + bf;
		}

		if (p >= 8) {
			p -= 8;
			bf = '4' + bf;
		}

		if (p >= 4) {
			p -= 4;
			bf = '3' + bf;
		}

		if (p >= 2) {
			p -= 2;
			bf = '2' + bf;
		}

		if (p >= 1) {
			p -= 1;
			bf = '1' + bf;
		}

		if (bf == '') {
			bf = '_';
		}

		return '<img src="media/braille/' + bf + '.gif" border=0>';
	}

	return HTMLEscape(c);
}


function SUBSTITUTE_L(l) {
	var alpha;
	alpha = MakeKeyedAlphabet(document.encoder.SUBSTITUTE_key.value);

	for (var i = 0; i < l.length; i ++) {
		var idx = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(l.charAt(i));

		if (idx >= 0) {
			idx = alpha.charAt(idx);
		} else {
			idx = l.charAt(i);
		}

		CURRENTSCRATCHPAD.realvalue += idx;
	}

	return false;
}
