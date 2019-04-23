
var Transposition = {
	
	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			//window.setTimeout('TRANSPOSITION.upd()', 100);
			return;
		}
		
		var elem = document.getElementById('TRANSPOSITION_output');

		if (CURRENTSCRATCHPAD.realvalue != "" && (CURRENTSCRATCHPAD.realvalue.match(/\ /g) || []).length >= 3)	//More than three spaces
		{
			var elem = document.getElementById('TRANSPOSITION_output');
			Timer.start();
			var transposition_output = Transposition.calc(CURRENTSCRATCHPAD.realvalue);//SwapSpaces(HTMLEscape(
			if(transposition_output) {
				elem.innerHTML = Teacher.analyzeValue(SwapSpaces(Transposition.calc(CURRENTSCRATCHPAD.realvalue)), "transposition()")+'<br>' +
								 Teacher.analyzeValue(SwapSpaces(Transposition.calc(Reverse_String(CURRENTSCRATCHPAD.realvalue))), "reverse().transposition()");
			} else {
				elem.innerHTML = "<i>Does not comply to format (error during calc)</i>";
			}
			
			Timer.stop("Transposition - Two");
		}
		else
		{
			elem.innerHTML = "<i>Type in your message and see the results here!</i>";
		}
		
		//window.setTimeout('TRANSPOSITION.upd()', 100);
	},

	calc : function(input)
	{
		var output = '';
		var inputarray = input.split(' ');
		var running = true;
		while(running) {
			running = false;
			for(var i = 0; i < inputarray.length; i++)
			{
				if(typeof inputarray[i] == "string" && inputarray[i].length)
				{
					output += inputarray[i][0];
					inputarray[i] = inputarray[i].substr(1);
					running = true;
				}
			}
		}
		
		return output;
	},
	
};
