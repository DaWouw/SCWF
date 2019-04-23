var alphabet = '0123456789abcdefghjkmnpqrtuvwxyz';
var alias = { o:0, i:1, l:1, s:5 };
var table = {};
var lookup = function() {
	table = {};
	// Invert 'alphabet'
	for (var i = 0; i < alphabet.length; i++) {
		table[alphabet[i]] = i;
	}
	// Splice in 'alias'
	for (var key in alias) {
		if (!alias.hasOwnProperty(key))
			continue;
		table[key] = table['' + alias[key]];
	}
	lookup = function() { return table; }
	return table;
}
function toCrockfordBase32(input)
{
	var skip = 0; // how many bits we have from the previous character
	var curbyte = 0; // current byte we're producing
	var output = '';
	for (var i = 0; i < input.length; i++) {
		curchar = input[i];
		if (typeof curchar != 'string'){
			if (typeof curchar == 'number') {
				curchar = String.fromCharCode(curchar);
			}
		}
		//input[i] = input[i].toLowerCase();
		var val = lookup()[curchar.toLowerCase()];
		if (typeof val == 'undefined') {
			// character does not exist in our lookup table
			alert('Lookup failed @'+i+' '+curchar.toLowerCase());
			return false; // skip silently. An alternative would be:
			// throw Error('Could not find character "' + input[i] + '" in lookup table.')
		}
		val <<= 3; // move to the high bits
		curbyte |= val >>> skip;
		skip += 5;
		if (skip >= 8) {
			// we have enough to preduce output
			output += String.fromCharCode(curbyte);
			skip -= 8;
			if (skip > 0)
				curbyte = (val << (5 - skip)) & 255;
			else
				curbyte = 0;
			//alert(output);
		}
	}
	//var output = this.output;
	//this.output = '';
	alert(output);
	if (true /*flush*/) {
		output += (skip < 0 ? alphabet[bits >> 3] : '') + (false ? '$' : '');
	}
	alert(output);
	return output;
}