// Affine Cipher

// This code was written by Tyler Akins and is placed in the public domain.
// It would be nice if this header remained intact.  http://rumkin.com

// Requires util.js

var Affine = {
	coprimesof26 : [3,5,7,9,11,15,17,19,21,23,25],
	coprimesof95 : [2,3,4,6,7,8,9,11,12,13,14,16,17,18,21,22,23,24,26,27,28,29,31,32,33,34,36,37,39,41,42,43,44,46,47,48,49,51,52,53,54,56,58,59,61,62,63,64,66,67,68,69,71,72,73,74,77,78,79,81,82,83,84,86,87,88,89,91,92,93,94],	
	
	upd : function()
	{
		if (IsUnchangedVar.a * IsUnchangedVar.b *
				IsUnchangedVar.encdec * IsUnchangedVar.text)
		{
			//window.setTimeout('AFFINE_upd()', 100);
			return;
		}

		var e = document.getElementById('AFFINE_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else
		{
			Timer.start();

			var encdec = document.encoder.encdec.value * 1;
			var value = CURRENTSCRATCHPAD.realvalue;
			
			e.innerHTML = Affine.calc(encdec,
										value,
										document.encoder.a.value * 1, document.encoder.b.value * 1);
			Teacher.analyzeField("AFFINE_output", 'affine()');
			
			Timer.stop("Affine - Single");
			
			Timer.start();
			var b = document.encoder.b.value*1;
			var o = document.getElementById('AFFINE_output_bruteF');
			var out = '';
			
			var b_from = b, b_to = b;
			if(affine_B_bruteF_range) {
				var b_from = 0;
				var b_to = Math.min(affine_B_bruteF_range,25);
			}
			for(var j = b_from; j <= b_to; j++)
			{
				out += '<h3>B:'+j+'</h3>';
				for(var i = 0; i < this.coprimesof26.length; i++) {
					//while (! IsCoprime(i, 26)) i ++;
					var r = Affine.calc(encdec,
											value,
											this.coprimesof26[i],
											j);
					r = encdec < 0?Teacher.analyzeValue(r, 'affine'+this.coprimesof26[i]+'()'):r;
					out += '<b>Affine '+this.coprimesof26[i]+':</b> '+r+" <br>\n";
				}
			}
			o.innerHTML = out;
			Timer.stop("Affine - BruteF over "+this.coprimesof26.length+'x'+((b_to-b_from)+1)+' = '+this.coprimesof26.length*((b_to-b_from)+1));

			if(Global.Enable.Affine_spec_BF)
			{
				Timer.start();
				//51x34->     :!TwBTwB8B/i6MBwF6KF6?FB&!T?!BTwBF6?T=!FDFrB&TK!B8yyT6FsB:!FB!8w!ByiDBK!FB6FYKB?T=FDBTwB\FF"r\)rNN7r)FNjFNyF8cUc8NzUy87?B@B.8[F
				var alphabet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";  //Note the space in the front!
				var o2 = document.getElementById('AFFINE_output_spec_bruteF');
				var out2 = '';

				if(affine_B_bruteF_range) {
					var b_from = 0;
					var b_to = Math.min(affine_B_bruteF_range,94);
				}
				for(var j = b_from; j <= b_to; j++)
				{
					out2 += '<h3>B:'+j+'</h3>';
					for(var i = 0; i < this.coprimesof95.length; i++) {
						//while (! IsCoprime(i, 95)) i ++;
						var r = Affine.calc(encdec,
												value,
												this.coprimesof95[i],
												j, 
												null, alphabet);
						r = encdec < 0?Teacher.analyzeValue(r, 'affine_spec_'+this.coprimesof95[i]+'()'):r;
						out2 += '<b>Affine(0x20-0x7E):'+this.coprimesof95[i]+':</b> '+r+" <br>\n";
					}
				}
				o2.innerHTML = out2;
				Timer.stop("Affine - BruteF spec over "+this.coprimesof95.length+'x'+((b_to-b_from)+1)+' = '+this.coprimesof95.length*((b_to-b_from)+1));
			}
		}

		//window.setTimeout('AFFINE_upd()', 100);
	},
	
	a_plus : function ()
	{
		var a = document.encoder.a.value;
		if (a < 1)
		{
			a = 1;
		}
		else
		{
			a ++;
			while (! IsCoprime(a, 26))
			{
				a ++;
			}
		}
		document.encoder.a.value = a;
	},
	
	a_minus : function()
	{
		var a = document.encoder.a.value;
		if (a < 2)
		{
			a = 1;
		}
		else
		{
			a --;
			while (! IsCoprime(a, 26))
			{
				a --;
			}
		}
		document.encoder.a.value = a;
	},
	b_plus : function ()
	{
		var b = document.encoder.b.value;
		if (b < 0) {
			b = 0;
		} else {
			b++;
			if (b > 94) {
				b = 94;
			}
		}
		document.encoder.b.value = b;
	},
	
	b_minus : function()
	{
		var b = document.encoder.b.value;
		if (b < 1) {
			b = 0;
		} else {
			b--;
		}
		document.encoder.b.value = b;
	},


	encode: function(text, mult, inc, key, alphabet)
	{
		return Affine.calc(1, text, mult, inc, key, alphabet);
	},
	decode: function(text, mult, inc, key, alphabet)
	{
		return Affine.calc(-1, text, mult, inc, key, alphabet);
	},

	// Perform a Affine transformation on the text
	// encdec = -1 for decode, 1 for encode (kinda silly, but kept it like this
	//    to be the same as the other encoders)
	// text = the text to encode/decode
	// inc = how far to shift the letters.
	// key = the key to alter the alphabet
	// alphabet = The alphabet to use if not A-Z
	calc: function(encdec, text, mult, inc, key, alphabet)
	{
		var s = "";
		
		if (typeof(alphabet) != 'string')
			alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		mult = mult * 1;
		inc = inc * 1;
		
		if (encdec < 0) {
			var i = 1;
			while ((mult * i) % alphabet.length != 1) {
				i += 2;
			}
			mult = i;
			inc = mult * (alphabet.length - inc) % alphabet.length;
		}
		
		key = MakeKeyedAlphabet(key, alphabet);
		
		for (var i = 0; i < text.length; i++)
		{
			var b = text.charAt(i);
			var idx;
			if ((idx = alphabet.indexOf(b)) >= 0)
			{
				idx = (mult * idx + inc) % alphabet.length;
				b = key.charAt(idx);
			}
			else if ((idx = alphabet.indexOf(b.toUpperCase())) >= 0)
			{
				idx = (mult * idx + inc) % alphabet.length;
				b = key.charAt(idx).toLowerCase();
			}
			s += b;
		}
		return s;
	}
};

