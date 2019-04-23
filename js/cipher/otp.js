
var Onetimepad = {
	upd : function()
	{   
		if (IsUnchangedVar.text * IsUnchangedVar.ONETIMEPAD_pad * IsUnchangedVar.encdec)
		{
			return;
		}
		//ResizeTextArea(document.encoder.ONETIMEPAD_pad);

		var e = document.getElementById('ONETIMEPAD_output');

		if (CURRENTSCRATCHPAD.realvalue != '' && document.encoder.ONETIMEPAD_pad.value != '')
		{
			Timer.start();
			e.innerHTML = OneTimePad.calc(document.encoder.encdec.value * 1, CURRENTSCRATCHPAD.realvalue, document.encoder.ONETIMEPAD_pad.value);
			Teacher.analyzeField('ONETIMEPAD_output', 'onetimepad()');
			Timer.stop("OTP - Single");
		}
		else
		{
			e.innerHTML = '<i>Type a pad to see the results.</i>';
		}
	},


	// One-Time Pad

	// This code was written by Tyler Akins and placed in the public domain.
	// It would be nice if you left this header intact.  http://rumkin.com


	// Implements a one-time pad for only alphabetic characters.  Preserves
	// the character case in the text (not the key).
	// encdec = -1 for decode, 1 for encode
	// text = the text to encode or decode.
	// key = the key (pad) to use
	calc : function(encdec, text, key)
	{
		var pad, i, out, c, uc;
		
		pad = "";
		key = key.toUpperCase();
		for (i = 0; i < key.length; i ++)
		{
			c = key.charAt(i)
			if (c >= 'A' && c <= 'Z')
			{
				pad += c;
			}
		}
		
		out = "";
		for (i = 0; i < text.length; i ++)
		{
			c = text.charAt(i);
			uc = ' ';
			if (c >= 'A' && c <= 'Z')
			{
				uc = 'A';
			}
			if (c >= 'a' && c <= 'z')
			{
				uc = 'a';
			}
			if (uc != ' ')
			{
				if (pad.length == 0)
				{
					pad = "AAAAAAAA";
				}
					c = c.charCodeAt(0) - uc.charCodeAt(0) +
					encdec * (pad.charCodeAt(0) - 'A'.charCodeAt(0));
				c = (c + 26) % 26;
				c = String.fromCharCode(uc.charCodeAt(0) + c);
				pad = pad.slice(1, pad.length);
			}
			out += c;
		}
		
		return out;
	}

};
