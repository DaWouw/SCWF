
var ColumnarTransposition = {

	encdec : -1,
	colkey : '',
	colkey_text : '1',
	colkey_type : 'num',			//[num, alpha, ahpla]
	use_as_column_order : false,

	sync : function()
	{
		this.colkey = document.encoder.colkey.value;
		this.colkey_type = document.encoder.colkey_type.value;
		this.use_as_column_order = document.encoder.use_as_column_order.checked;
		
	},
	
	upd : function()
	{
		ColumnarTransposition.sync();

		if (IsUnchangedVar.colkey + IsUnchangedVar.colkey_type < 2)
		{
			this.colkey_text = ColumnarTransposition.makeColumnKey(document.encoder.colkey_type.value, document.encoder.colkey.value);
			var c = document.getElementById('colkey_out');
			c.innerHTML = this.colkey_text;
		}
		
		if (IsUnchangedVar.text * IsUnchangedVar.use_as_column_order * IsUnchangedVar.encdec * IsUnchangedVar.colkey * IsUnchangedVar.colkey_type)   
		{
			//window.setTimeout('ColumnarTransposition.upd()', 100);
			return;
		}
		

		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('COLUMNARTRANS_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else
		{
			var text = CURRENTSCRATCHPAD.realvalue;

			if(Global.Enable.ColumnTransp_BF) {
				Timer.start();
				var out = '';

				var max_len_bruteF_range = Math.ceil(text.length / 2);

				var bruteForceKey = '';
				var userinput = document.encoder.colkey.value.length ? document.encoder.colkey.value : '1 ';
				coltrans_bruteF_range = coltrans_bruteF_range>max_len_bruteF_range?max_len_bruteF_range:coltrans_bruteF_range;	//limit on currentscratchpad.realvalue.length
				for(var i = 1; i < coltrans_bruteF_range; i++)
				{
					bruteForceKey += i+' ';
					var keystr = (i == 1?userinput:bruteForceKey);
					if(keystr == "1 ")
						continue;

					if(! (Global.Enable.ColumnTransp_PERM && i <= coltrans_bruteF_permutations && coltrans_bruteF_lower_permutations) ) {	//If permutation bruteforce is active, continue with higher
						out += '<b>Key: '+(i-1?keystr:'userkey')+':</b> '+Teacher.analyzeValue(ColumnarTransposition.calculate(text, keystr, "num"), 'columnartransposition('+keystr+')')+'<br>'+
									   '<b>Reversed:</b> '+ Teacher.analyzeValue(ColumnarTransposition.calculate(Reverse_String(text), keystr, "num"), 'reverse().columnartransposition('+keystr+')')+'<br><br>';
					}
				}
				e.innerHTML = out;
			
				var ei = document.getElementById('COLUMNARTRANS_output_reverse');
				var outi = '';
				bruteForceKey = bruteForceKey.trim().split(' ').reverse().join(' ');
				for(var i = coltrans_bruteF_range -1; i > 1; i--)
				{
					if(! (Global.Enable.ColumnTransp_PERM && i <= coltrans_bruteF_permutations && coltrans_bruteF_lower_permutations) ) {	//If permutation bruteforce is active, continue with higher
						outi += '<b>Key: '+bruteForceKey+':</b> '+Teacher.analyzeValue(ColumnarTransposition.calculate(text, bruteForceKey, "num"), 'columnartransposition('+bruteForceKey+')')+'<br>'+
										'<b>Reverse:</b> '+ Teacher.analyzeValue(ColumnarTransposition.calculate(Reverse_String(text), bruteForceKey, "num"), 'reverse().columnartransposition('+bruteForceKey+')')+'<br><br>';
					}
					bruteForceKey = bruteForceKey.slice(2);
				}
				ei.innerHTML = outi;
				Timer.stop("Columnar Transposition over "+(coltrans_bruteF_range*2));
			}
			
			if(Global.Enable.ColumnTransp_BF_PW) {
				Timer.start();
				var eb = document.getElementById('COLUMNARTRANS_output_bruteF');
				var outb = '';
				var passwords = [];
				passwords = passwords.concat(brute_force_dictionary_keys);
				for(var i = 0; i < passwords.length; i++)
				{
					outb += '<b>Key: '+passwords[i]+':</b> <br>'+Guesses.analyzeValueSavePWGuess(ColumnarTransposition.calculate(text, passwords[i], "alpha"), passwords[i], 'columnartransposition('+passwords[i]+')')+'<br>'+
									'<b>Reverse:</b> '+ Teacher.analyzeValue(ColumnarTransposition.calculate(Reverse_String(text), passwords[i], "alpha"), 'reverse().columnartransposition('+passwords[i]+')')+'<br><br>';
				}
				eb.innerHTML = outb;
				Timer.stop("Columnar Transposition over "+passwords.length);
			}

			if(Global.Enable.ColumnTransp_PERM) {
				Timer.start();
				var ep = document.getElementById('COLUMNARTRANS_output_permute');
				var outp = '';

				var calcs = 0;
				var perm_len = 0;
				var perm = '';
				var permute = [];
				var permute_numbers = [];
				for(var j = 1; j <= coltrans_bruteF_permutations; j++)
				{
					permute_numbers.push(j+' ');
					if(coltrans_bruteF_lower_permutations || j == coltrans_bruteF_permutations)
					{
						permute = permutator(permute_numbers);
						perm_len = permute.length;
						calcs += perm_len;
						for(var i = 0; i < perm_len; i++)
						{
							perm = permute[i].join('');
							outp += '<b>Key: '+perm+':</b> <br>'+Teacher.analyzeValue(ColumnarTransposition.calculate(text, perm, "num"), perm, 'columnartransposition('+perm+')')+'<br>'+
											'<b>Reverse:</b> '+ Teacher.analyzeValue(ColumnarTransposition.calculate(Reverse_String(text), perm, "num"), 'reverse().columnartransposition('+perm+')')+'<br><br>';
						}
					}
				}
				ep.innerHTML = outp;
				Timer.stop("Columnar Transposition Permutation Bruteforce over "+(calcs*2));
			}
		}
	},

	calculate : function(text, keystr, colkey_type)
	{
		this.colkey_text = ColumnarTransposition.makeColumnKey(colkey_type, keystr);
		var ckt = this.colkey_text;
		if (this.use_as_column_order) {
			original = ckt.split(' ');
			ckt = new Array(original.length);
			
			for (var i = 0; i < original.length; i ++) {
				ckt[original[i] - 1] = i + 1;
			}

			ckt = ckt.join(' ');
		}
		return /*SwapSpaces(HTMLEscape(*/ColumnarTransposition.colTrans(/*document.encoder.encdec.value * 1*/ -1, text, ckt)/*))*/;
	},

	insert_example : function()
	{
		document.encoder.encdec.value = "1";
		document.encoder.colkey.value = "4 2 5 3 1";
		document.encoder.colkey_type.value = "num";
		document.encoder.use_as_column_order.checked= false;
		
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade("WHICHWRISTWATCHESARESWISSWRISTWATCHES", 'columntrans_example()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},

	insert_example2 : function()
	{
		document.encoder.encdec.value = "-1";
		document.encoder.colkey.value = "4 2 5 3 1";
		document.encoder.colkey_type.value = "num";
		document.encoder.use_as_column_order.checked = false;
		
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade("HTHESTHHRASWRASCSCRSSCWWWESWWEIITAIIT", 'columntrans_example2()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},


	// Columnar Transposition

	// Requires util.js

	// Code was written by Tyler Akins and is placed in the public domain
	// It would be nice if you left this header.  http://rumkin.com


	// Perform a Columnar Transposition
	// encdec is 1 for encode, -1 for decode
	// text is what you want encrypted/decrypted
	// key is the columnar key that you wish to use.  It must contain all
	//   of the numbers from 1 to N only once in any order you want.  Use
	//   MakeColumnKey() to generate it!
	colTrans : function(encdec, text, key)
	{
		var NumberList = ColumnarTransposition.split(key)

		if (typeof(NumberList) != 'object')
			return NumberList;
		
		if (NumberList.length < 2)
			return text;

		var textenc = Tr(text, "\r\n");
		if (encdec < 0)
		{
			textenc = ColumnarTransposition.decode(textenc, NumberList);
		}
		else
		{
			textenc = ColumnarTransposition.encode(textenc, NumberList);
		}
		
		return InsertCRLF(text, textenc);
	},

	// Loads the key and makes sure the numbers are good.
	split : function(k)
	{
		var c, n, numberlist, zero = '0'.charCodeAt(0);
		
		k += ' ';
		numberlist = new Array();
		while (k.length)
		{
			n = 0;
			while (k.charAt(0) >= '0' && k.charAt(0) <= '9')
			{
				n *= 10;
			n += k.charCodeAt(0) - zero;
			k = k.slice(1, k.length);
			}
			k = k.slice(1, k.length);
			while ((k.charAt(0) < '0' || k.charAt(0) > '9') && k.length)
			{
				k = k.slice(1, k.length);
			}
			numberlist[numberlist.length] = n;
		}
		
		return numberlist;
	},


	// Performs the actual transposition.  Notice how simple the code looks.
	encode : function(t, NumberList)
	{
		var s = new Array(NumberList.length);
		var back = new Array(NumberList.length);
		var out = "", i;
		
		for (i = 0; i < s.length; i ++)
		{
			s[i] = "";
			back[NumberList[i] - 1] = i;
		}
		
		for (i = 0; i < t.length; i ++)
		{
			s[i % NumberList.length] += t.charAt(i);
		}
		
		for (i = 0; i < NumberList.length; i ++)
		{
			out += s[back[i]];
		}
		
		return out;
	},


	// Undoes the columnar transposition.  A bit more involved because the
	// columns can have different lengths, depending on the message length.
	decode : function(t, NumberList)
	{
		var num = new Array(NumberList.length);
		var back = new Array(NumberList.length);
		var s = new Array(NumberList.length);
		var i, j, out = "", minNum;

		minNum = Math.floor(t.length / NumberList.length);
		
		for (i = 0; i < num.length; i ++)
		{
			num[i] = minNum;
			back[NumberList[i] - 1] = i;
		}
		
		j = minNum * NumberList.length;
		i = 0;
		
		while (j < t.length)
		{
			num[NumberList[i] - 1] ++;
			i ++;
			j ++;
		}
		
		for (i = 0; i < NumberList.length; i++)
		{
			s[back[i]] = t.slice(0, num[i]);
			t = t.slice(num[i], t.length);
		}
		
		for (i = 0; i < minNum + 1; i ++)
		{
			for (j = 0; j < s.length; j ++)
			{
				if (s[j].length > i)
			{
					out += s[j].charAt(i);
			}
			}
		}
		
		return out;
	},

	// Changes a keyword or a string of numbers into a valid key
	makeColumnKey : function(meth, text)
	{
		var values = new Array();
		
		if (meth == "num")
		{
			// Break on whitespace
			var zero = '0'.charCodeAt(0);
			text = Trim(text) + ' ';
			if (text == ' ')
			{
				values[0] = 1;
			return values;
			}
			while (text.length)
			{
				var n = 0;
			while (text.charAt(0) >= '0' && text.charAt(0) <= '9')
			{
				n *= 10;
				n += text.charCodeAt(0) - zero;
				text = text.slice(1, text.length);
			}
			text = text.slice(1, text.length);
			while (text.length && (text.charAt(0) < '0' || text.charAt(0) > '9'))
			{
				text = text.slice(1, text.length);
			}
			values[values.length] = n;
			}
		}
		else
		{
			// Break on every letter, skip whitespace
			text = Tr(text, " \r\n\t");
			if (text == '')
			{
				values[0] = 1;
				return values;
			}
			while (text.length)
			{
				values[values.length] = text.charCodeAt(0);
				text = text.slice(1, text.length);
			}
		}
		
		// Values is an array of numbers.  Convert to an array of numbers that
		// start from 1 and progress up without duplicates.
		var values2 = new Array(values.length);
		
		for (var i = 0; i < values2.length; i ++)
		{
			values2[i] = 0;
		}
		
		for (var loop = 0; loop < values2.length; loop ++)
		{
			var lowestIdx = -1;
			for (var i = 0; i < values2.length; i ++)
			{
				if (values2[i] == 0)
			{
				if (lowestIdx == -1)
				{
					lowestIdx = i;
				}
				else
				{
					var a = values[lowestIdx];
					var b = values[i];
					if (a > b || (a == b && meth == 'ahpla'))
					{
						lowestIdx = i;
					}
				}
			}
			}
			values2[lowestIdx] = loop + 1;
		}
		
		var out = '';
		for (var i = 0; i < values2.length; i ++)
		{
			out += ' ' + values2[i];
		}
		
		return out.slice(1, out.length);
	}

};