var Skip = {
	tempBruteFCounter : 0,
	primes : [],
	primes_initialized : false,

	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.SKIP_skip *
				IsUnchangedVar.SKIP_startat * IsUnchangedVar.encdec)
		{
			return;
		}

		
		if (CURRENTSCRATCHPAD.realvalue != '')
		{
			/*Timer.start();
			//var e = document.getElementById('SKIP_output');
			e.innerHTML = Skip.calc(document.encoder.encdec.value * 1, 
					CURRENTSCRATCHPAD.realvalue, document.encoder.SKIP_skip.value * 1, 
					document.encoder.SKIP_startat.value * 1);//));
			Teacher.analyzeField('SKIP_output','skip()');
			Timer.stop("Skip - Single");*/
			
			Timer.start();
			var e = document.getElementById('SKIP_output_chart');
			e.innerHTML = Skip.show_chart(false);
			Timer.stop("Skip - BruteF over "+this.tempBruteFCounter);
		}
	},


	plusMinus : function(objname, dir)
	{
		var v, t;

		t = Tr(CURRENTSCRATCHPAD.realvalue, "\r\n");
		v = eval('document.encoder.' + objname + '.value') * 1;
		v += dir;
		if (objname == 'SKIP_skip')
		{
			while (Skip.hasAFactorMatch(t.length, v) && v > 1 && v < t.length - 1)
			{
				v += dir;
			}
			if (v < 1)
				v = 1;
		}
		else
		{
			if (v < 0)
				v = 0;
		}
		if (v > t.length - 1)
			v = t.length - 1;
		eval('document.encoder.' + objname + '.value = v');
	},


	load_k3 : function()
	{
		document.encoder.encdec.value = -1;
		document.encoder.SKIP_startat.value = 191;
		document.encoder.SKIP_skip.value = 192;
		CURRENTSCRATCHPAD.setRealValue("ENDyaHrOHNLSRHEOCPTEOIBIDYSHNAIA\n" +
									"CHTNREYULDSLLSlLNOHSNOSMRWXMNE\n" +
									"TPRNGATIHNRARPESLNNELEBLPIIACAE\n" +
									"WMTWNDITEENRAHCTENEUDRETNHAEOE\n" +
									"TFOLSEDTIWENHAEIOYTEYQHEENCTAYCR\n" +
									"EIFTBRSPAMHHEWENATAMATEGYEERLB\n" +
									"TEEFOAsFIOTUETUAEOTOARMAEERTNRTI\n" +
									"BSEDDNIAAHTTMSTEWPIEROAGRIEWFEB\n" +
									"AECTDDHILCEIHSITEGOEAOSDDRYDLORIT\n" +
									"RKLMLEHAGTDHARDPNEOHMGFMFEUHE\n" +
									"ECDMRIPFEIMEHNLSSTTRTVDOHW?");
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},


	show_chart : function(newwindow)
	{
		var t = Tr(CURRENTSCRATCHPAD.realvalue, "\r\n");
		var o = '';

		if (t.length == 0)
		{
			//alert('You need to type in a message first.');
			return;
		}

		if (t.length < 3)
		{
			//alert('The message is too short.');
			return;
		}

		this.primes_initialized = false;
		this.tempBruteFCounter = 0;
		var encdec = document.encoder.encdec.value * 1;
		var skip_startat = document.encoder.SKIP_startat.value * 1;
		for (var s = 2, l = t.length-1; s < l; s ++)
		{
			if (! Skip.hasAFactorMatch(t.length, s)) // (s == 0 || ! Skip.hasAFactorMatch(t.length, s))
			{
				o += '<p><b><u>Skip ' + s + ':</u></b> ' +
					Teacher.analyzeValue(Skip.calc(encdec, t, s, skip_startat), 'skip'+s+'()') +
					"</p>\n";

				this.tempBruteFCounter++;
				if(this.tempBruteFCounter >= skip_bruteF_range)
					break;
			}
		}
		if (newwindow) {
			var win = window.open('', '', 'toolbar=0,location=0,statusbar=0');
			win.document.write(o);
		} else {
			return o;
		}
	},

	// Skip

	// This code was written by Tyler Akins and placed in the public domain.
	// It would be nice if you left this header intact.  http://rumkin.com

	// Requires util.js


	// Skip
	// encdec = -1 for decode, 1 for encode
	// text = the data you want to encode/decode
	// inc = how many letters you want to skip (1 or more)
	// start = what position you want to start at (0 = beginning)
	calc : function(encdec, text, inc, start)
	{
		enctext = Tr(text, "\r\n");
		inc = inc * 1;
		start = start * 1;
		
		if (enctext.length < 2)
			return '<i class="error">Text length is too short.</i>';
		if (inc < 1)
			return '<i class="error">Skip must be 1 or bigger.</i>';
		if (inc > enctext.length - 1)
			return '<i class="error">Skip must be smaller than the length of the text.</i>';
		if (start < 0)
			return '<i class="error">Start must be 0 or larger.</i>';
		if (start > enctext.length)
			return '<i class="error">Start must be smaller than or equal to the length of the text.</i>';
		if (Skip.hasAFactorMatch(enctext.length, inc))
			return '<i class="error">Skip has a prime factor that cleanly divides into the text length, so it can not be used.</i>';
		
		if (encdec * 1 < 0)
		{
			enctext = Skip.decode(enctext, inc, start);
		}
		else
		{
			enctext = Skip.encode(enctext, inc, start);
		}
		
		return InsertCRLF(text, enctext);
	},


	// Checks if two numbers have a matching factor besides 1.
	hasAFactorMatch : function(t_len, sk)
	{
		var i, j, l, sk_half, div, div2;
		
		if (sk == 1)
			return 0;
			
		div = t_len / sk;
		if (div == Math.floor(div))
			return 1;
		
		div = sk / 2;
		div2 = t_len / 2;
		if (div == Math.floor(div) && div2 == Math.floor(div2))
			return 1;
		
		sk_half = Math.floor(sk / 2);

		if ( !this.primes_initialized ) {
			this.primes = new Array(1);
			this.primes[0] = 2;
			for (i = 3, l = Math.floor(div2); i <= l; i ++)
			{
				for (j = 0; j < this.primes.length; j ++)
				{
					div = i / this.primes[j];
					if (div == Math.floor(div))
					{
						j = this.primes.length + 1;
					}
				}
				if (j == this.primes.length)
				{
					this.primes[this.primes.length] = i;
				}
			}
			this.primes_initialized = true;
		}

		for (i = 0, l = this.primes.length; i <= l; i ++)
		{
			div = sk / this.primes[i];
			div2 = t_len / this.primes[i];
			if (div == Math.floor(div) && div2 == Math.floor(div2))
			{
				return 1;
			}
		}
		return 0;
	},


	// Skip encoder
	encode : function(t, sk, st)
	{
		var i, pos, o = t;
		
		for (i = 0, pos = st; i < t.length; i ++)
		{
			o = o.slice(0, pos) + t.charAt(i) + o.slice(pos + 1, o.length);
			pos += sk;
			pos = pos % t.length;
		}
		
		return o;
	},


	// Skip decoder
	decode : function(t, sk, st)
	{
		var i, pos, o = "";
		
		for (i = 0, pos = st; i < t.length; i ++)
		{
			o += t.charAt(pos);
			pos += sk;
			pos = pos % t.length;
		}

		return o;
	}
};
