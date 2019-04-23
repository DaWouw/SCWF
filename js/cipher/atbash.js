
var Atbash = {

	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			//window.setTimeout('ATBASH_upd()', 100);
			return;
		}

		var e = document.getElementById('ATBASH_output');

		if (CURRENTSCRATCHPAD.realvalue == '')
		{
			e.innerHTML = '<i>Type in a message and see the results here!</i>';
		}
		else
		{
			Timer.start();
			e.innerHTML = /*SwapSpaces(HTMLEscape(*/Affine.calc(1, CURRENTSCRATCHPAD.realvalue, 25, 25);
			Teacher.analyzeField("ATBASH_output", 'atbash()');
			Timer.stop("Atbash - Single");
		}

		//window.setTimeout('ATBASH_upd()', 100);
	}

};
