
var Vigenere = {
	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.VIGENERE_pass * IsUnchangedVar.encdec)
		{
			return;
		}

		var e = document.getElementById('VIGENERE_output');

		if (CURRENTSCRATCHPAD.realvalue != '')
		{
			if(document.encoder.VIGENERE_pass.value != '') {
				Timer.start();
				e.innerHTML = /*SwapSpaces(HTMLEscape(*/Teacher.analyzeValue(Vigenere.calc(document.encoder.encdec.value * 1, 
										CURRENTSCRATCHPAD.realvalue, document.encoder.VIGENERE_pass.value), 'viginere('+document.encoder.VIGENERE_pass.value+')');
				//Teacher.analyzeField('VIGENERE_output', 'viginere('+document.encoder.VIGENERE_pass.value+')');
				Timer.stop("Vigenere - Single");
			}
			
			if(Global.Enable.Vigenere_BF) {
				Timer.start();
				o = document.getElementById('VIGENERE_output_bruteF');
				var out = '';
				var passwords = ['b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
				passwords = passwords.concat(brute_force_dictionary_keys);
				var encdec = document.encoder.encdec.value * 1;
				for(var i = 0; i < passwords.length; i++) {
					var r = Vigenere.calc(encdec, 
									CURRENTSCRATCHPAD.realvalue, passwords[i]);
					r = encdec < 0?Guesses.analyzeValueSavePWGuess(r, passwords[i], 'vigenere('+passwords[i]+')'):r;
					out += '<b>Pass: '+passwords[i]+':</b> '+r+"<br>\n";
				}
				o.innerHTML = out;
				Timer.stop("Vigenere - BruteF over "+passwords.length);
			}
		}
		else
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
	
	},


	insertSmithy : function()
	{
		document.encoder.encdec.value = 1;
		document.encoder.VIGENERE_pass.value = "AAYCEHMU";
		CURRENTSCRATCHPAD.setRealValue("Jaeiex tostgp sac gre amq wfkadpmqzv");
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},

	insertSmithyFixed : function()
	{
		document.encoder.encdec.value = 1;
		document.encoder.VIGENERE_pass.value = "AAYCEHMU";
		CURRENTSCRATCHPAD.setRealValue("jaeiex tosHgp sac gre amq wfkadpmqzvZ");
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},

	// Vigenere text cipher

	// Code written by Tyler Akins and placed in the public domain.
	// It would be nice if you left this header intact.  http://rumkin.com

	// Requires util.js


	// Vigenere encrypt text
	// encdec = 1 to encode, -1 to decode
	// text = the text you want to encode
	// pass = the password to use
	// key = the key to make a keyed alphabet (or leave it blank)
	calc : function(encdec, text, pass, key, autokey)
	{
		var s, b, i;
		
		// Change the pass into A-Z only
		pass = OnlyAlpha(pass.toUpperCase());
		
		// Change the key into a keyed alphabet
		key = MakeKeyedAlphabet(key);
		
		s = "";
		for (i = 0; i < text.length; i++)
		{
			b = text.charAt(i);
			limit = ' ';
			if (b >= 'A' && b <= 'Z')
				limit = 'A';
			if (b >= 'a' && b <= 'z')
				limit = 'a';
			if (limit != ' ' && pass.length)
			{
				b = b.toUpperCase();
			
					// Handle autokey
				if (autokey && encdec > 0)
					pass += b;
					
					// Just ignore the non-alpha characters from the cipher
					bval = key.indexOf(b) + encdec * key.indexOf(pass.charAt(0));
				bval = (bval + 26) % 26;
				b = key.charAt(bval);
				
				// Handle autokey
				if (autokey && encdec < 0)
					pass += b;
				
				if (limit == 'a')
					b = b.toLowerCase();
					
				// Rotate the password
				if (! autokey)
					pass += pass.charAt(0);
				
				pass = pass.slice(1, pass.length);
			}
			s += b;
		}
		return s;
	}

	//Used for another Vigenere function
	/*function BuildTableau(k, n)
	{
		var Alpha = MakeKeyedAlphabet(k);
		var AtoZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var s = "<tt><b><u>&nbsp;&nbsp;|&nbsp;" + 
			Alpha.substr(0, 4) + '&nbsp;' +
			Alpha.substr(4, 4) + '&nbsp;' +
			Alpha.substr(8, 4) + '&nbsp;' +
			Alpha.substr(12, 4) + '&nbsp;' +
			Alpha.substr(16, 4) + '&nbsp;' +
			Alpha.substr(20, 4) + '&nbsp;' +
			Alpha.substr(24, 2) + "</u></b>";
		
		if (! n)
		{
			n = 26;
		}
		
		for (var i = 0; i < n; i ++)
		{
			s += '<br><b>' + Alpha.charAt(0) + '</b>&nbsp;|&nbsp;' +
				Alpha.substr(0, 4) + '&nbsp;' +
				Alpha.substr(4, 4) + '&nbsp;' +
				Alpha.substr(8, 4) + '&nbsp;' +
				Alpha.substr(12, 4) + '&nbsp;' +
				Alpha.substr(16, 4) + '&nbsp;' +
				Alpha.substr(20, 4) + '&nbsp;' +
				Alpha.substr(24, 2);
			Alpha += Alpha.charAt(0);
			Alpha = Alpha.substr(1);
		}
		s += "</tt>";
		return s;
	}*/
	
	//Used for another Vigenere function
	/*function GronsfeldToVigenere(p)
	{
		var out = '';
		var i;
		var Alpha = 'ABCDEFGHIJ';
		
		for (i = 0; i < p.length; i ++)
		{
			var c = p.charAt(i);
			if (c >= '0' && c <= '9')
			{
				out += Alpha.charAt(c - '0');
			}
		}
		
		return out;
	}*/
	
}