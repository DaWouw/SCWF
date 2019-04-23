

function STATISTIC_upd()
{
	if (IsUnchangedVar.text)
	{
		//window.setTimeout('STATISTIC_upd()', 100);
		return;
	}

	//ResizeTextArea(CURRENTSCRATCHPAD);

	var e = document.getElementById('STATISTIC_output');

	if (CURRENTSCRATCHPAD.realvalue == '')
	{
		e.innerHTML = '<i>Type in stuff and see the statistics here.</i>';
	}
	else
	{
		Timer.start();
		e.innerHTML = Statistics(CURRENTSCRATCHPAD.realvalue);
		Timer.stop("Statistics");
	}

	//window.setTimeout('STATISTIC_upd()', 100);
}


function Statistics(t)
{
	var words = 0, lcase = 0, ucase = 0, numbers = 0, symbols = 0;
	var spaces = 0, cr = 0, lf = 0, other = 0;
	var last_was_whitespace = 1;
	var friedman = Friedman(t, 'abcdefghijklmnopqrstuvwxyz');
	var out;

	for (var i = 0; i < t.length; i ++)
	{
		var c = t.charAt(i);
		if ('abcdefghijklmnopqrstuvwxyz'.indexOf(c) >= 0)
		{
			lcase ++;
		}
		else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0)
		{
			ucase ++;
		}
		else if (c == ' ')
		{
			spaces ++;
		}
		else if (c == "\r")
		{
			cr ++;
		}
		else if (c == "\n")
		{
			lf ++;
		}
		else if ('0123456789'.indexOf(c) >= 0)
		{
			numbers ++;
		}
		else if ("`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?".indexOf(c) >= 0)
		{
			symbols ++;
		}
		else
		{
			other ++;
		}
		
		if (' \r\n'.indexOf(c) >= 0)
		{
			last_was_whitespace = 1;
		}
		else
		{
			if (last_was_whitespace)
			{
				words ++;
			}
			last_was_whitespace = 0;
		}
	}

	out = '<nobr><tt><b><u>Text Statistics</u></b>';
	out += Statistics_Report('Friedman IC', friedman * 26);
	out += Statistics_Report('Kappa-PT', friedman);
	out += Statistics_Report('Words', words);
	out += Statistics_Report('Upper Case', ucase);
	out += Statistics_Report('Lower Case', lcase);
	out += Statistics_Report('Numbers', numbers);
	out += Statistics_Report('Spaces', spaces);
	out += Statistics_Report('Newlines', Math.max(cr, lf));
	out += Statistics_Report('Symbols', symbols);
	out += Statistics_Report('Other', other);
	
	MANIPULATE_inputstatistics = new Array(11);
	MANIPULATE_inputstatistics = [words, lcase, ucase, numbers, symbols, spaces, cr, lf, other, last_was_whitespace, friedman];
	
	return out;
}


function Statistics_Report(what, v)
{
	var spaces = '', spacenum = 0;

	if (v != Math.floor(v)) {
		v = Math.round(v * 10000) / 10000;
	}

	while (what.length + spacenum < 16) {
		spaces += '&nbsp;';
		spacenum ++;
	}

	return '<br><b>' + what + ':</b>' + spaces + v;
}

