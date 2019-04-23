
var ByteArray = {
	
	fill : function(value, len) {
		var arr = [];
		for (var i = 0; i < len; i++) {
			arr.push(value);
		}
		return arr;
	},

	stringToByteArray : function(string)
	{
		if(string) {
			var byteArray = new Array(string.length);
			for (var i=0; i<string.length; i++) byteArray[i] = string.charCodeAt(i);
			return byteArray;
		}
		return false;
	},

	byteArrayToString : function(byteArray)
	{
		var string = '';
		for (var i=0; i<byteArray.length; i++) string += String.fromCharCode(byteArray[i]);
		return string;
	},

	byteArrayToStringNoLowChars : function(byteArray)
	{
		alert('DEPRECATED: This function (byteArrayToStringNoLowChars) is deprecated. DO not use.');
		var string = '';
		for (var i=0; i<byteArray.length; i++) string += (byteArray[i] < 32 ? '?': String.fromCharCode(byteArray[i]));
		return string;
	},
	byteArrayToStringNoLowCharsValidate : function(byteArray)
	{
		alert('DEPRECATED: This function (byteArrayToStringNoLowChars) is deprecated. DO not use.');
		var string = '';
		for (var i=0; i<byteArray.length; i++)
		{
			if(byteArray[i] < 32)
				return '';
			string += String.fromCharCode(byteArray[i]);
		}
		return string;
	},

	hexdigit : function(c)
	{
		if (c >= 'a') return c.charCodeAt(0) - 87;
		if (c >= 'A') return c.charCodeAt(0) - 55;
		if (c >= '0') return c.charCodeAt(0) - 48;
		return -1;
	},

	hexToByteArray : function(hexString)
	{
		var byteArray = new Array();
		var upper4 = true;
		var o=0;
		for (var i=0; i<hexString.length; i++)
		{
			var c = ByteArray.hexdigit(hexString.charAt(i));
			if (c < 0) continue;
			if (upper4)
				byteArray[o] = c << 4;
			else
				byteArray[o++] |= c;
			upper4 = !upper4;
		}
		if (!upper4) byteArray.length--;
		return byteArray;
	},

	byteArrayToHex : function(byteArray)
	{
		var hexdigits = '0123456789ABCDEF';
		var hexString = '';
		for (var i=0; i<byteArray.length; i++)
		{
			hexString += hexdigits.charAt((byteArray[i] >> 4) & 15) + hexdigits.charAt(byteArray[i] & 15);
		}
		return hexString;
	},

	string2Hex : function(element, reverse)	//element = document.getElementById(id) or document.encoder.xor_a
	{
		if (reverse)
			element.value = ByteArray.byteArrayToString(ByteArray.hexToByteArray(document.getElementById(id).value));
		else
			element.value = ByteArray.byteArrayToHex(ByteArray.stringToByteArray(document.getElementById(id).value));
	},

	getByteArray : function(element, fromstring)	//element = document.getElementById(id) or document.encoder.xor_a
	{
		if (fromstring)
			return ByteArray.stringToByteArray(element);
		else
			return ByteArray.hexToByteArray(element);
	}
};