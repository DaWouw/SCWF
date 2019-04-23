
var Bifid = {
	
	upd : function()
	{
		var keyunchanged = IsUnchangedVar.BIFID_skip * IsUnchangedVar.BIFID_key;
		
		if (keyunchanged == 0)
		{
			// Update the rectangle
			var k, elem;
			
			k = MakeKeyedAlphabet(document.encoder.BIFID_skip.value + document.encoder.BIFID_key.value);
			k = k.slice(1, k.length);
			elem = document.getElementById('BIFID_alphabet');
			elem.innerHTML = HTMLTableau(k);
		}

		if (keyunchanged * IsUnchangedVar.text * IsUnchangedVar.encdec * IsUnchangedVar.BIFID_skipto)
		{
			//window.setTimeout('BIFID.upd()', 100);
			return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);
		
		var elem = document.getElementById('BIFID_output');

		if (CURRENTSCRATCHPAD.realvalue != "")
		{
			Timer.start();
			elem.innerHTML = Bifid.calc(document.encoder.encdec.value * 1,
										CURRENTSCRATCHPAD.realvalue, document.encoder.BIFID_skip.value,
										document.encoder.BIFID_skipto.value, document.encoder.BIFID_key.value);
			Teacher.analyzeField("BIFID_output", 'bifid()');
			Timer.stop("Bifid - Single");
			
			Timer.start();
			o = document.getElementById('BIFID_output_bruteF');
			var out = '';
			var passwords = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			passwords = passwords.concat(brute_force_dictionary_keys);
			var encdec = document.encoder.encdec.value * 1;
			for(var i = 0; i < passwords.length; i++) {
				var r = Bifid.calc(encdec,
										CURRENTSCRATCHPAD.realvalue, document.encoder.BIFID_skip.value,
										document.encoder.BIFID_skipto.value, passwords[i]);
				r = encdec < 0?Guesses.analyzeValueSavePWGuess(r, passwords[i], 'bifid('+passwords[i]+','+document.encoder.BIFID_skip.value+','+document.encoder.BIFID_skipto.value+')'):r;
				out += '<b>Pass: '+passwords[i]+':</b> '+r+"<br>\n";
			}
			o.innerHTML = out;
			Timer.stop("Bifid - BruteF over "+passwords.length);
		}
		else
		{
			elem.innerHTML = "<i>Type in your message and see the results here!</i>";
		}
		
		//window.setTimeout('BIFID.upd()', 100);
	},

	// Bifid Cipher
	
	// This code was written by Tyler Akins and is placed in the public domain.
	// It would be nice if this header remained intact.	 http://rumkin.com
	
	// Requires util.js
	
	
	// Performs a Bifid cipher on the passed-in text
	// encdec = -1 for decode, 1 for encode
	// text = the text to encode/decode
	// skip = the letter omitted from the 5x5 grid
	// skipto = what the "skip" letter should be translated to before encoding
	// key = the word or phrase used to generate letter placement in the 5x5 grid
	calc : function(encdec, text, skip, skipto, key)
	{
		var enc, out, bet, otemp, c;
		
		if (typeof(skip) != 'string' || skip.length != 1 || 
			skip.toUpperCase() < 'A' || skip.toUpperCase() > 'Z')
			skip = "J";
		skip = skip.toUpperCase();
		
		if (typeof(skipto) != 'string' || skipto.length != 1 || 
			skipto.toUpperCase() < 'A' || skipto.toUpperCase() > 'Z')
			skipto = "I";
		skipto = skipto.toUpperCase();
		
		if (skip == skipto)
		{
			skipto = String.fromCharCode(skip.charCodeAt(0) + 1);
			if (skipto > 'Z')
				skipto = 'A';
		}
		
		if (typeof(key) != 'string')
			key = "";
		
		key = MakeKeyedAlphabet(skip + key);
		key = key.slice(1, key.length);
		
		enc = '';
		out = '';
		bet = '';
		for (var i = 0; i < text.length; i ++)
		{
			c = text.charAt(i).toUpperCase();
			if (c == skip)
				c = skipto;
			
			if (key.indexOf(c) >= 0)
			{
				enc += c;
			}
		}
		enc = Bifid.mangle(encdec, enc, key)
		
		for (var i = 0, j = 0; i < text.length; i ++)
		{
			c = text.charAt(i).toUpperCase();
			if (c == skip)
				c = skipto;
		
			if (key.indexOf(c) >= 0)
			{
				if (text.charAt(i) != text.charAt(i).toUpperCase())
				{
					out += enc.charAt(j).toLowerCase();
				}
				else
				{
					out += enc.charAt(j);
				}
				j ++;
			}
			else
			{
				out += text.charAt(i);
			}
		}
		
		return out;
	},
	
	only_letters : function()
	{
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(OnlyAlpha(CURRENTSCRATCHPAD.realvalue), 'bifid_only_letters()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},


	example_enc: function()
	{
		document.encoder.encdec.value = 1;
		document.encoder.BIFID_skip.value = "J";
		document.encoder.BIFID_skipto.value = "I";
		document.encoder.BIFID_key.value = "";
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade("ABCD", 'bifid_example()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},


	wikipedia_enc : function()
	{
		document.encoder.encdec.value = 1;
		document.encoder.BIFID_skip.value = "J";
		document.encoder.BIFID_skipto.value = "I";
		document.encoder.BIFID_key.value = "BGWKZQPNDSIOAXEFCLUMTHYVR";
		ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade("F L E E A T O N C E", 'bifid_wiki_example()')]);
		ForceFlow.selectFurthestSingleChildNodePath();
	},

	// Performs the actual encoding/decoding of the text
	// Chars must only contain characters in 'key', case sensitive
	// Key must be the letters from a 5x5 grid.
	mangle : function(encdec, chars, key)
	{
		var pos, line1, line2;
		
		line1 = '';
		line2 = '';
		
		for (var i = 0; i < chars.length; i ++)
		{
			var row, col;
			
			pos = key.indexOf(chars.charAt(i));
			row = Math.floor(pos / 5);
			col = pos % 5;
			
			line1 += row;
			if (encdec > 0)
			{
				line2 += col;
			}
			else
			{
				line1 += col;
			}
		}
		
		line1 += line2;
		
		if (encdec < 0)
		{
			line2 = '';
			for (var i = 0; i < line1.length / 2; i ++)
			{
				line2 += line1.charAt(i);
			line2 += line1.charAt(line1.length / 2 + i);
			}
			window.status = line1 + " " + line2;
			line1 = line2;
		}
		
		chars = '';
		
		for (var i = 0; i < line1.length; i += 2)
		{
			chars += key.charAt(line1.charAt(i) * 5 + line1.charAt(i + 1) * 1);
		}
		
		return chars;
	}

};
