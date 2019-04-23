var Railfence = {

	toggle : 0,
	
	upd : function()
	{
		var e, r;
		var encdec = document.encoder.encdec.value * 1;

		if (IsUnchangedVar.text * IsUnchangedVar.encdec *
				IsUnchangedVar.RAILFENCE_rails * IsUnchangedVar.RAILFENCE_offset)
		{
			return;
		}
		if (document.encoder.RAILFENCE_rails.value == '' || 
				document.encoder.RAILFENCE_offset.value == '')
		{
			return;
		}
		if (document.encoder.RAILFENCE_rails.value * 1 < 1)
		{
			document.encoder.RAILFENCE_rails.value = 1;
			//return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e = document.getElementById('RAILFENCE_output');
			e.innerHTML = '<i>Type a message and see the results here!</i>';
			e = document.getElementById('rails_disp');
			e.innerHTML = '<i>There is no message to show.</i>';
			return;
		}
		Timer.start();
		r = Railfence.calc(encdec, 
						CURRENTSCRATCHPAD.realvalue, document.encoder.RAILFENCE_rails.value * 1, 
						document.encoder.RAILFENCE_offset.value * 1);

		e = document.getElementById('RAILFENCE_output');
		e.innerHTML = Teacher.analyzeValue(r, 'railfence()');//SwapSpaces(r);//HTMLEscape(r));
		
		e = document.getElementById('rails_disp');
		if (encdec > 0)
		{	//Encode
			e.innerHTML = Railfence.formatRails(HTMLEscape(CURRENTSCRATCHPAD.realvalue), 
					document.encoder.RAILFENCE_rails.value * 1, document.encoder.RAILFENCE_offset.value * 1);
		}
		else
		{	//Decode
			e.innerHTML = Railfence.formatRails(HTMLEscape(r), document.encoder.RAILFENCE_rails.value * 1, 
					document.encoder.RAILFENCE_offset.value * 1);
		}
		Timer.stop("Railfence - Single");
		
		Timer.start();
		var max_len_bruteF_range = Math.ceil(CURRENTSCRATCHPAD.realvalue.length / 2);

		o = document.getElementById('RAILFENCE_output_bruteF');
		var out = '';
		for(var i = 2; i < railfence_bruteF_range && i < max_len_bruteF_range; i++) {
			var r = Railfence.calc(encdec, 
								CURRENTSCRATCHPAD.realvalue, i, document.encoder.RAILFENCE_offset.value * 1);
			r = encdec < 0?Teacher.analyzeValue(r, 'railfence'+i+'()'):r;
			out += '<b>Rails: '+i+'</b> '+r+"<br><br>\n";
		}
		o.innerHTML = out;
		
		o = document.getElementById('RAILFENCE_reverse_output_bruteF');
		out = '';
		for(var i = 2; i < railfence_bruteF_range && i < max_len_bruteF_range; i++) {
			var r = Railfence.calc(encdec, 
								Reverse_String(CURRENTSCRATCHPAD.realvalue), i, document.encoder.RAILFENCE_offset.value * 1);
			r = encdec < 0?Teacher.analyzeValue(r, 'reverse().railfence'+i+'()'):r;
			out += '<b>Rails: '+i+'</b> '+r+" <br><br>\n";
		}
		o.innerHTML = out;
		Timer.stop("Railfence - BruteF over "+railfence_bruteF_range*2);
	},


	formatRails : function(text, rails, offset)
	{
		var o = new Array(rails), off = new Array(2 * (rails - 1));
		var i, j, off, pos;

		for (i = 0; i < rails; i ++)
		{
			o[i] = "";
			off[i] = i;
		}

		for (i = rails; i < 2 * (rails - 1); i ++)
		{
			off[i] = (2 * (rails - 1)) - i;
		}

		pos = offset % (2 * (rails - 1));

		for (i = 0; i < text.length; i ++)
		{
			for (j = 0; j < rails; j ++)
			{
				if (off[pos] == j)
				{
					o[j] += text.charAt(i);
				}
				else
				{
					o[j] += '&nbsp;';
				}
			}
			pos = (pos + 1) % (2 * (rails - 1));
		}


		j = "";
		for (i = 0; i < rails; i ++)
		{
			if (i)
			{
				j += "<br>\n";
			}
			j += o[i];
		}

		return '<tt><b>' + j + '</b></tt>';
	},

	toggleRails : function()
	{
		var Link, Vis;

		if (this.toggle == 0)
		{
			this.toggle = 1;
			Link = "Hide the rails";
			Vis = "block";
		}
		else
		{
			this.toggle = 0;
			Link = "Show the rails";
			Vis = "none";
		}

		e = document.getElementById('rails_link');
		e.innerHTML = Link;

		e = document.getElementById('rails_disp');
		e.style.display = Vis;
	},

	// Railfence encoding

	// This code was written by Tyler Akins and placed in the public domain.
	// It would be nice if you left this header intact.  http://rumkin.com


	// Railfence
	// encdec = -1 for decode, 1 for encode
	// text = the text to encode/decode
	// rails = The number of rails in the fence ( >= 1 and <= text.length )
	// offset = Starting position (from 0 to rails * 2 - 2)
	calc : function(encdec, text, rails, offset)
	{
		rails = rails * 1;
		
		if (rails < 2)
			return '<i class="error">You must have at least 2 rails. I suggest 3 or more.</i>';
		if (rails >= text.length)
			return '<i class="error">You need less rails or more text.</i>';
			
		offset = offset * 1;
		while (offset < 0)
		{
			offset += rails * 2 - 2;
		}
		offset = offset % (rails * 2 - 2);
		
		if (encdec * 1 < 0)
		{
			return Railfence.rail_decode(text, rails, offset * 1);
		}
		return Railfence.rail_encode(text, rails, offset * 1);
	},


	rail_encode : function(t, r, o)
	{
		var o_idx = new Array(r * 2 - 2);
		var out_a = new Array(r);
		var i, j;
		
		for (i = 0; i < r; i ++)
		{
			o_idx[i] = i;
			out_a[i] = ""
		}
		for (j = 0; j < r - 2; j ++)
		{
			o_idx[i + j] = i - (j + 2);
		}
		
		for (i = 0; i < t.length; i ++)
		{
			out_a[o_idx[o]] += t.charAt(i);
			o = (o + 1) % o_idx.length
		}
		
		j = "";
		for (i = 0; i < r; i ++)
		{
			j += out_a[i];
		}
		
		return j;
	},


	rail_decode : function (t, r, o)
	{
		var o_idx = new Array((r - 1) * 2);
		var out_a = new Array(r);
		var i, j, k;

		for (i = 0; i < o_idx.length; i ++)
		{
			j = (o + i) % o_idx.length;
			if (j < r)
			{
				o_idx[i] = j;
			}
			else
			{
				o_idx[i] = (2 * (r - 1)) - j;
			}
		}
		
		for (i = 0; i < out_a.length; i ++)
		{
			out_a[i] = 0;
		}
		
		for (i = 0; i < t.length; i ++)
		{
			out_a[o_idx[i % o_idx.length]] ++;
		}
		
		j = 0;
		for (i = 0; i < out_a.length; i ++)
		{
			out_a[i] = t.slice(j, j + out_a[i]);
			j += out_a[i].length;
		}
		
		j = "";
		for (i = 0; i < t.length; i ++)
		{
			k = o_idx[i % o_idx.length];
			j += out_a[k].charAt(0);
			out_a[k] = out_a[k].slice(1, out_a[k].length);
		}
		
		return j;
	}
};
