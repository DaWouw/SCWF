

//https://www.html5rocks.com/en/tutorials/workers/basics/

/*if (typeof(Worker) !== "undefined") {
    alert('Yes! Web worker support!');
} else {
    alert('Sorry! No Web Worker support..');
}*/




/*self.addEventListener('message', function(e) {
		var data = e.data;
		switch (data.cmd) {
			case 'calc':
				importScripts('../../js/cipher/util.js');
				self.postMessage(Playfair.simple_calc(data.value));
				break;
			case 'calc_key':
				importScripts('../../js/cipher/util.js');
				self.postMessage({'output':Playfair.simple_calc_key(data.value, data.key),'key':data.key});
				break;
			case 'stop':
				self.postMessage('WORKER STOPPED: ' + data.value +
					'. (buttons will no longer work)');
				self.close(); // Terminates the worker.
				break;
			default:
				self.postMessage('Unknown command: ' + data.value);
		};
	}, false);//*/


var Playfair = {
	encdec : -1,
	skip : "J",
	skipto : "I",
	key : "",
	flags : 0,

	sync : function()
	{
		this.encdec = document.encoder.encdec.value * 1;
		this.skip = document.encoder.PLAYFAIR_skip.value;
		this.skipto = document.encoder.PLAYFAIR_skipto.value;
		this.key = document.encoder.PLAYFAIR_key.value;
		this.flags = document.encoder.PLAYFAIR_doubleencode.checked?0:1;

		var keyunchanged = IsUnchangedVar.PLAYFAIR_skip * IsUnchangedVar.PLAYFAIR_key;

		if (keyunchanged == 0)
		{
			// Update the rectangle
			var k, uelem;
			
			k = MakeKeyedAlphabet(this.skip + this.key);
			k = k.slice(1, k.length);
			uelem = document.getElementById('PLAYFAIR_alphabet');
			uelem.innerHTML = HTMLTableau(k);
		}
	},

	simple_calc : function(value)
	{
		return Playfair.calc(this.encdec, value, this.skip, this.skipto, this.key, this.flags);
	},
	simple_calc_key : function(value, key)
	{
		return Playfair.calc(this.encdec, value, this.skip, this.skipto, key, this.flags);
	},

	upd_calc : function(value)
	{
		var output = '', output_bruteF = '';
		if (value != "")
		{
			Timer.start();
			var output = Teacher.analyzeValue(Playfair.calc(this.encdec, value, this.skip, this.skipto, this.key, this.flags), 'playfair()');
			Timer.stop("Playfair - Single");
			
			if(Global.Enable.Playfair_BF) {
				Timer.start();
				var htmlout = '';
				var passwords = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
				passwords = passwords.concat(brute_force_dictionary_keys);
				for(var i = 0; i < passwords.length; i++) {
					var r = Playfair.calc(this.encdec, value, 
													this.skip, this.skipto, 
													passwords[i], this.flags);
					r = this.encdec < 0?Guesses.analyzeValueSavePWGuess(r,passwords[i],'playfair('+passwords[i]+','+this.skip+','+this.skipto+','+this.flags+')'):r;
					htmlout += '<b>Pass: '+passwords[i]+':</b> '+r+"<br><br>\n";
				}
				output_bruteF = htmlout;
				Timer.stop("Playfair - BruteF over "+passwords.length);
			}
		}
		else
		{
			output = '<i>Type in your message and see the results here!</i>';
		}
		return {'ret':0, 'data':output, 'output':output,'output_bruteF':output_bruteF};
	},

	upd : function()
	{
		var value = CURRENTSCRATCHPAD.realvalue;
		
		//Sync all values
		this.sync();

		if (IsUnchangedVar.text * IsUnchangedVar.PLAYFAIR_skip * IsUnchangedVar.PLAYFAIR_skipto * IsUnchangedVar.PLAYFAIR_key * IsUnchangedVar.PLAYFAIR_doubleencode)
		{
			return;
		}
		
		var output_arr = this.upd_calc(value);

		document.getElementById('PLAYFAIR_output').innerHTML = output_arr['output'];
		document.getElementById('PLAYFAIR_output_bruteF').innerHTML = output_arr['output_bruteF'];

	},
	upd_screen : function()
	{

	},


	insert_spaces: function()
	{
		var c = '', n = 0, cc, i;

		for (i = 0; i < CURRENTSCRATCHPAD.realvalue.length; i ++)
		{
			cc = CURRENTSCRATCHPAD.realvalue.charAt(i);
			c += cc;
			cc = cc.toUpperCase();
			if (cc >= 'A' && cc <= 'Z')
			{
				n ++;
				if (n == 2)
				{
					c += ' ';
					n = 0;
				}
			}
		}

		CURRENTSCRATCHPAD.setRealValue(c);
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},


	only_letters : function()
	{
		CURRENTSCRATCHPAD.setRealValue(OnlyAlpha(CURRENTSCRATCHPAD.realvalue));
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},


	kennedy : function()
	{
		document.encoder.encdec.value = -1;
		document.encoder.PLAYFAIR_skip.value = "J";
		document.encoder.PLAYFAIR_skipto.value = "I";
		document.encoder.PLAYFAIR_key.value = "ROYAL NEW ZEALAND NAVY";
		CURRENTSCRATCHPAD.setRealValue("KX JEYU REB EZW EHEW RYTU HE YFSKRE " +
								  "HE GOYFIWTT TUOLKS YCA JPOBO TE IZONTX BYBW T GONE YC UZWRGD S " +
								  "ONSXBOU YWR HEBAAHYUSED Q");
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
		document.encoder.PLAYFAIR_doubleencode.checked = 0;
	},

	// Playfair Cipher

	// This code was written by Tyler Akins and is placed in the public domain.
	// It would be nice if this header remained intact.  http://rumkin.com

	// Requires util.js


	// Performs a Playfair cipher on the passed-in text
	// encdec = -1 for decode, 1 for encode
	// text = the text to encode/decode
	// skip = the letter omitted from the 5x5 grid
	// skipto = what the "skip" letter should be replaced with
	// key = the word or phrase used to generate letter placement in the 5x5 grid
	// flags = 0x01 : Double letters are unencoded
	calc : function(encdec, text, skip, skipto, key, flags)
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
				if (text.charAt(i) != text.charAt(i).toUpperCase())
				enc += c.toLowerCase();
			else
				enc += c;
			if (enc.length == 2)
			{
				otemp = Playfair.lookup(encdec, enc, key, flags);
				out += otemp.charAt(0) + bet + otemp.charAt(1);
				bet = '';
				enc = '';
			}
			}
			else
			{
				if (enc.length > 0)
			{
				bet += text.charAt(i);
			}
			else
			{
				out += text.charAt(i);
			}
			}
		}
		if (enc.length > 0)
		{
			otemp = Playfair.lookup(encdec, enc + 'X', key);
			out += otemp.charAt(0) + bet + otemp.charAt(1);
		}
		
		return out;
	},


	// Performs the substitution of a single letter pair block
	lookup : function(encdec, chars, key, flags)
	{
		var t1, t2, u1, u2, r1, r2, c1, c2;
			
		t1 = chars.charAt(0);
		t2 = chars.charAt(1);
			
		u1 = 0;
		if (t1 != t1.toUpperCase())
		{
			t1 = t1.toUpperCase();
			u1 = 1;
		}
		u2 = 0;
		if (t2 != t2.toUpperCase())
		{
			t2 = t2.toUpperCase();
			u2 = 1;
		}
			
		c1 = key.indexOf(t1);
		r1 = Math.floor(c1 / 5);
		c1 = c1 % 5;
		
		c2 = key.indexOf(t2);
		r2 = Math.floor(c2 / 5);
		c2 = c2 % 5;
		
		if (r1 == r2 && c1 == c2)
		{
			// Same letter
			if ((flags & 0x01) == 0)
			{
				r1 += encdec;
				r2 += encdec;
				c1 += encdec;
				c2 += encdec;
			}
		}
		else if (r1 == r2)
		{
			// Same row
			c1 += encdec;
			c2 += encdec;
		}
		else if (c1 == c2)
		{
			// Same column
			r1 += encdec;
			r2 += encdec;
		}
		else
		{
			// Rectangle
			var a;
			a = c1;
			c1 = c2;
			c2 = a;
		}
		

		r1 = (r1 + 5) % 5;
		r2 = (r2 + 5) % 5;
		c1 = (c1 + 5) % 5;
		c2 = (c2 + 5) % 5;
		
		t1 = key.charAt(r1 * 5 + c1);
		t2 = key.charAt(r2 * 5 + c2);
		
		if (u1)
			t1 = t1.toLowerCase();
		if (u2)
			t2 = t2.toLowerCase();
		
		return t1 + t2;
	}

};
