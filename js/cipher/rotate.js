var Rotate = {

	upd : function()
	{
		if (IsUnchangedVar.text * IsUnchangedVar.ROTATE_col * IsUnchangedVar.encdec)
		{
			return;
		}

		//ResizeTextArea(CURRENTSCRATCHPAD);

		var e = document.getElementById('ROTATE_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Enter your text and see the results here!</i>';
		}
		else
		{
			if(document.encoder.ROTATE_col.value != '1') {
				Timer.start();
				e.innerHTML = /*SwapSpaces(HTMLEscape(*/Teacher.analyzeValue(Rotate.calc(document.encoder.encdec.value * 1, 
															CURRENTSCRATCHPAD.realvalue,
															document.encoder.ROTATE_col.value * 1), 'rotate()');
				//Teacher.analyzeField('ROTATE_output', 'rotate()');
				Timer.stop("Rotate - Single");
			}
			
			Timer.start();
			o = document.getElementById('ROTATE_output_bruteF');
			var out = '';
			var encdec = document.encoder.encdec.value * 1;
			for(var i = 2; i < rotate_bruteF_range && i < CURRENTSCRATCHPAD.realvalue.length; i++) {
				var r = Rotate.calc(encdec, CURRENTSCRATCHPAD.realvalue, i);
				r = encdec < 0?Teacher.analyzeValue(r, 'rotate'+i+'()'):r;
				out += '<b>Rotate '+i+':</b> '+r+" <br><br>\n";
			}
			o.innerHTML = out;
			Timer.stop("Rotate - BruteF over "+rotate_bruteF_range);
		}
	},

	insert_k3 : function()
	{
		document.encoder.encdec.value = -1;
		document.encoder.col.value = 24;
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
									"ECDMRIPFEIMEHNLSSTTRTVDOHW");
		ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	},


	// Rotate Text

	// Algorithm suggested by Mike on the Kryptos mailing list.

	// Insert letters (not newlines) into a grid, then rotate the grid 90 degrees
	// left or right (left = encode) and read the results back out of the grid.
	// encdec = -1 for decode (right) and 1 for encode (left)
	// text = text to rotate
	// cols = number of columns for the box.  If not a factor of text length,
	//   adds 'X' characters
	calc : function(encdec, text, cols)
	{
		var t2 = Tr(text, "\r\n");
		
		cols = Math.floor(cols);
		if (cols < 1)
			cols = 1;
		
		while (t2.length % cols)
		{
			text += 'X';
			t2 += 'X';
		}
		
		// Arrange into a grid
		var grid = new Array(cols);
		for (var i = 0; i < cols; i ++)
		{
			grid[i] = '';
		}
		
		for (i = 0; i < t2.length; i ++)
		{
			grid[i % cols] += t2.charAt(i);
		}
		
		t2 = '';
		if (encdec > 0)
		{
			// Rotate left
			for (i = 0; i < cols; i ++)
			{
				t2 += grid[cols - (i + 1)];
			}
		}
		else
		{
			// Rotate right
			for (i = 0; i < cols; i ++)
			{
				t2 += Reverse_String(grid[i]);
			}
		}

		return InsertCRLF(text, t2);
	}
};
