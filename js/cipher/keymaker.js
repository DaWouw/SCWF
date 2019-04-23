// Keymaker
// Can be inserted into any page to generate one or more keys.

// Code was written by Tyler Akins and is placed in the public domain.
// It would be nice if you left this header.  http://rumkin.com


// Call this function when the page finishes loading
// It looks for elements with id='Keymaker0' id='Keymaker1' etc.
// It adds the keymaker link to those elements.
function Keymaker_Start()
{
	var i = 0;
	var e = document.getElementById('Keymaker' + i);
	while (e)
	{
		KeymakerToggle(i);
		i ++;
		e = document.getElementById('Keymaker' + i);
	}
}


// Shows/hides the keymaker form
function KeymakerToggle(id)
{
	var o = '';
	var e = document.getElementById('Keymaker' + id);
	if (! e)
	{
		return false;
	}

	if (e.getAttribute('_showKeymaker') != 'show')
	{
		o = '<a href="#" onclick="return KeymakerToggle(' + id + 
			')">Show Keymaker</a>';
		e.innerHTML = o;
		e.setAttribute('_showKeymaker', 'show')
		return false;
	}

	o = '<a href="#" onclick="return KeymakerToggle(' + id +
		')">Hide Keymaker</a><br><br>' +
		'<table class="r_box"><tr><td class="r_box">' +
		'Key word(s):  <input type=text value="" size=30 id="KeymakerKeyword' +
		id + '"><br>' +
		'<input type=checkbox id="KeymakerLastInstance' + id +
		'"> Use last instance of letter instead of first<br>' +
		'<input type=checkbox id="KeymakerRevKey' + id + 
		'"> Reverse keywords<br>' +
		'<input type=checkbox id="KeymakerRevAlpha' + id + 
		'"> Reverse alphabet<br>' +
		'<input type=checkbox id="KeymakerKeyOnRight' + id +
		'"> Put keywords on right side<br>' +
		'Result: <b><span id="KeymakerResult' + id + '"></span></b> ' +
		'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ' +
		'<a href="#" onclick="return KeymakerApply(' + id + ')">Apply ' +
		'to Key</a>' +
		'</td></tr></table><br>';
		
	e.innerHTML = o;
	e.setAttribute('_showKeymaker', 'hide');

	window.setTimeout('KeymakerUpdate(' + id + ')', 100);

	return false;
}


// Update function that checks for changes and will update the
// keymaker result
function KeymakerUpdate(id)
{
	var k = document.getElementById('KeymakerKeyword' + id);
	var li = document.getElementById('KeymakerLastInstance' + id);
	var rk = document.getElementById('KeymakerRevKey' + id);
	var ra = document.getElementById('KeymakerRevAlpha' + id);
	var kor = document.getElementById('KeymakerKeyOnRight' + id);
	var r = document.getElementById('KeymakerResult' + id);

	if (! k || ! li || ! rk || ! ra || ! kor || ! r)
	{
		return;
	}

	if (IsUnchanged(k, 0) && IsUnchanged(li, 1) && IsUnchanged(rk, 0) &&
		IsUnchanged(ra, 0) && IsUnchanged(kor, 0))
	{
		window.setTimeout('KeymakerUpdate(' + id + ')', 100);
		return;
	}

	var kw = k.value, alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	if (li.checked)
	{
		kw = Reverse_String(kw);
		kw = MakeKeyedAlphabet(kw, kw);
		kw = Reverse_String(kw);
	}
	if (rk.checked)
	{
		kw = Reverse_String(kw);
	}
	if (ra.checked)
	{
		alpha = Reverse_String(alpha);
	}
	if (kor.checked)
	{
		kw = MakeKeyedAlphabet(kw, kw);
		kw = Reverse_String(kw);
		alpha = Reverse_String(alpha);
	}

	var result = MakeKeyedAlphabet(kw, alpha);
	if (kor.checked)
	{
		result = Reverse_String(result);
	}

	r.innerHTML = result;

	window.setTimeout('KeymakerUpdate(' + id + ')', 100);
}


// The "apply" link's code
function KeymakerApply(id)
{
	var e = document.getElementById('Keymaker' + id);
	var r = document.getElementById('KeymakerResult' + id);
	var spot = e.getAttribute('target');
	eval(spot + ' = r.innerHTML');
	return false;
}

