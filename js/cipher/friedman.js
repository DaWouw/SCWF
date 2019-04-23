
var FREQUENCY_Sample_Text = "As this sample text is typed into the frequency " +
							"analyzer for you, the bars on the bottom will jump around. " +
							"The analyzer is actually figuring out the letter frequencies " +
							"on the fly.\n\nThe analyzer will also figure out statistics " +
							"concerning numbers. For instance, the code " +
							"\"102154165145040154141147157157156\" will be shown to have " +
							"no numbers higher than 7, which could indicate that the " +
							"code is in octal. You can try to figure out what it is " +
							"by heading over to the substitution cipher page.";
var FREQUENCY_Sample_Place = 0, FREQUENCY_Sample_Last = '';


function ASCII_HEATMAP_upd(force)
{
	force = typeof force === 'undefined'?0:force;
	if ((IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') && !force)
	{
		return;
	}

	if(Global.Enable.Ascii_heatmap || force)
	{
		Timer.start();
		var t, text = CURRENTSCRATCHPAD.realvalue;
		if(Global.InputType == InputTypeEnum.HEX) {
			if(t = ConvertBase.hexToStr(text.replace(/\s/g,''))) {
				text = t;
			}
		}
		FREQUENCY_ASCII_analyze(text);
		$('table.T_ASCII').show();
		$('#ASCII_heatmap_button').hide();
		Timer.stop("ASCII - heatmap analysis");
	} else {
		$('#ASCII_heatmap_button').show();
		$('table.T_ASCII').hide();
	}
}
function FREQUENCY_ASCII_analyze(t)
{
	var i, c, alphabet = new Array(256);
	for (i = 0; i < alphabet.length; i ++)
		alphabet[i] = 0;
	
	for (i = 0; i < t.length; i++) {
		c = Math.min(t.charCodeAt(i), 128);		//Group all High ASCII chars
		alphabet[c]++;
	}
	/*for (var i = 0; i < 128; i++) {
		alphabet[i] = (t.match(new RegExp("\\x"+("0"+(i).toString(16)).slice(-2), "g")) || []).length;
	}*/

	FREQUENCY_ASCII_update_heatmap(alphabet);
}
function FREQUENCY_ASCII_clear_heatmap()
{
	$('table.T_ASCII td').removeClass('found').css("background-color", "");
}
function FREQUENCY_ASCII_update_heatmap(valu)
{
	var i, scale;

	for (i = 0, scale = 0; i < valu.length && i < 129; i++) {
		scale = Math.max(scale, valu[i]);
	}

	FREQUENCY_ASCII_clear_heatmap();

	for (i = 0; i < valu.length && i < 129; i ++) {
		if (valu[i] == 0) {
			continue;
		}
		var color_opacity = scale==valu[i]?1:(valu[i]/scale);
		$('table.T_ASCII td.T_'+(i).toString(16).toUpperCase()).addClass('found').css({backgroundColor: "rgba(0,255,0,"+(color_opacity)+")"});
	}
}




function FREQUENCY_upd(force)
{
	force = typeof force === 'undefined'?0:force;
	if (IsUnchangedVar.text && !force)
	{
		//window.setTimeout('FREQUENCY_upd()', 100);
		return;
	}

	//ResizeTextArea(CURRENTSCRATCHPAD);

	var e = document.getElementById('FREQUENCY_output');

	if (CURRENTSCRATCHPAD.realvalue == '')
	{
		e.innerHTML = '<i>Enter in some text to analyze.  Below is a chart of ' +
			'the approximate letter frequencies in the English language.</i>' +
			'<br><br>' +
			FREQUENCY_insert_standard();
	}
	else
	{
		if(Global.Enable.Friedman_analysis || force)
		{
			Timer.start();
			f_ic = Friedman(CURRENTSCRATCHPAD.realvalue, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
			f_kappa = Math.round(f_ic * 10000) / 10000;
			f_ic = Math.round(26 * f_ic * 10000) / 10000;
			e.innerHTML = 'Friedman IC:  ' + f_ic + ' (kappa-plaintext: ' + f_kappa + ')<br>';
			e.innerHTML += FREQUENCY_ScrambleSub_wisewords(FREQUENCY_calc_ScrambleSub_percentage(f_ic,f_kappa));
			e.innerHTML += '<br>';
			e.innerHTML += FREQUENCY_analyze(CURRENTSCRATCHPAD.realvalue);
			Timer.stop("Friedman - frequency analysis");
		} else {
			e.innerHTML = '<input type="button" onclick="FREQUENCY_upd(1); return false;" value="Perform Friedman analysis">';
		}
	}

	//window.setTimeout('FREQUENCY_upd()', 100);
}


function FREQUENCY_value_get_positive_margin(value, target)
{
	if(value>target)
		return value-target;
	else
		return target-value;
}
function FREQUENCY_limit_value(value,limit)
{
	if(value>limit)
		return limit;
	return value;
}

function FREQUENCY_calc_ScrambleSub_percentage(f_ic, f_kappa)
{
	var target_f_ic  = 1.73, target_f_kappa  = 0.0665;
	var margin_f_ic  = 0.9,  margin_f_kappa  = 0.05;
	var margin1_f_ic = 1.1,  margin1_f_kappa = 20;		// (1/margin_f_ic) and (1/margin_f_kappa)
	
	var out = '';
	var likehihood = 0;
	if(f_ic && f_kappa) {
		likehihood = 1;
		likehihood = likehihood*(1-(FREQUENCY_limit_value(FREQUENCY_value_get_positive_margin(f_ic,target_f_ic),margin_f_ic)*margin1_f_ic));
		likehihood = likehihood*(1-(FREQUENCY_limit_value(FREQUENCY_value_get_positive_margin(f_kappa,target_f_kappa),margin_f_kappa)*margin1_f_kappa));
		likehihood = Math.round(likehihood*100);
	}
	return likehihood;
}

function FREQUENCY_ScrambleSub_wisewords(likehihood)
{
	return ' ScrambleSub-Analysis -> '+(likehihood>60?'<b>':'')+'ScrambleCipher: '+likehihood+'%'+(likehihood>60?'</b>':'')+' VS '+(likehihood<40?'<b>':'')+(100-likehihood)+'% SubstitutionCipher/Encoding'+(likehihood<40?'</b>':'');
}

function FREQUENCY_insert_standard()
{
	var values = new Array(8.2, 1.5, 2.8, 4.2, 12.7, 2.2, 2.0, 6.1, 7.0, // a-i
		0.2, 0.8, 4.0, 2.4, 6.9, 7.5, 1.9, 0.1, 6.0, // j-r
		6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1); // s-z
	return FREQUENCY_show_graph('ABCDEFGHIJKLMNOPQRSTUVWXYZ', values, '');
}

function FREQUENCY_insert_sample(p)
{
	p ++;
	if (p == 1)
	{
		//ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade('', 'friedman_frequency_example()')]);
		//ForceFlow.selectFurthestSingleChildNodePath();
		CURRENTSCRATCHPAD.setRealValue('');
		FREQUENCY_Sample_Last = '';
	}
	if (FREQUENCY_Sample_Last != CURRENTSCRATCHPAD.realvalue)
		return;
	if (p > FREQUENCY_Sample_Text.length)
		return;
	
	CURRENTSCRATCHPAD.setRealValue(FREQUENCY_Sample_Text.substr(0, p));
	ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);
	FREQUENCY_Sample_Last = CURRENTSCRATCHPAD.realvalue;  // IE changes \n into \r\n
	window.setTimeout('FREQUENCY_insert_sample(' + p + ')', 35);
}

function FREQUENCY_analyze(t)
{
	var stat_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789`~!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?';
	var alphabet = new Array(stat_letters.length);
	var i;

	t = t.toUpperCase();

	for (i = 0; i < alphabet.length; i ++)
		alphabet[i] = 0;
	
	for (i = 0; i < t.length; i ++)
	{
		var n = stat_letters.indexOf(t.charAt(i));
		if (n >= 0)
		alphabet[n] ++;
	}

	return FREQUENCY_show_graph(stat_letters, alphabet, t);
}

function FREQUENCY_show_graph(lett, valu, text)
{
	var colors = new Array('#01A252', '#01A0E4'); //;new Array('#CC2222', '#FF5555');
	var i, scale, out, unique = '', textlength = (text?text.length:100);

	for (i = 0, scale = 0; i < valu.length; i ++) {
		scale = Math.max(scale, valu[i]);
	}

	out = "<table border=0 cellpadding=0 cellspacing=0 width=100% style='margin-bottom:15px;'>\n";
	for (i = 0; i < valu.length; i ++)
	{
		if(valu[i] == 0 && ! /[a-z0-9]/i.test(lett[i])) {
			continue;
		}
		out += "<tr><th width=1>" + lett.charAt(i) + "</th><td width=1>&nbsp;</td><td>";
		out += "<div style='white-space:nowrap;background:"+colors[i % colors.length]+";";
		out += "width:"+(scale?Math.floor(100 * (valu[i] / scale)):0)+"%;";	//DIMA-BUG: this sometimes gives a NaN, still after the ternary func.
		out += "font-size: 9pt'> "+valu[i]+' ('+(scale?Math.round(100 * (valu[i] / textlength)):0)+'%)'+"</div>";
		out += "</td></tr>\n";
		if(valu[i] != 0)
			unique += lett.charAt(i);
	}
	out += "</table>\n";
	out += '<small>Unique:'+$('<input type="text" readonly size="100" style="border:none;outline:none;background-color:transparent;font-family:inherit;font-size:inherit;"/>').attr('value',unique).prop('outerHTML')+"</small>\n";

	return out;
}

// Friedman Test - Index of Coincidence

// This code was written by Tyler Akins and placed in the public domain.
// It would be nice if you left this header intact.  http://rumkin.com


// Calculates an index of coincidence for a given text against itself
// Returns the kappa-plaintext.  To get the normalized Friedman IC,
// divide the return number by the alphabet length.
function Friedman(text, alphabet)
{
   var n;  // Counts of each letter
   var i, IC, N;
   
   // Assign a default alphabet and turn it into upper case
   if (! alphabet || alphabet == '') {
      alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   }
   alphabet = alphabet.toUpperCase();

   n = LetterFrequency(text.toUpperCase());
   
   // Calculate IC
   IC = 0;
   N = 0;
   for (i = 0; i < alphabet.length; i ++) {
      var count = alphabet.charAt(i);
      count = n[count];
      if (! count)
      {
         count = 0;
      }
      IC += count * (count - 1);
      N += count;
   }
   IC /= N * (N - 1);
   
   return IC;
}


document.Friedman_Loaded = 1;
