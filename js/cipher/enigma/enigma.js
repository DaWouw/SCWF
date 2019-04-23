/* Enigma.js

   Enigma machine simulation.
   
   Copyright (c) 2009, Mike Koss
   
   References:
   	  Paper Enigma - http://mckoss.com/Crypto/Enigma.htm
   	  Enigma Simulator - http://bit.ly/enigma-machine
   	  Enigma History - http://en.wikipedia.org/wiki/Enigma_machine
   	
   Usage:
   
      var enigma = global_namespace.Import('startpad.enigma');
      var machine = new enigma.Enigma();
      var cipher = machine.Encode("plain text");
      
      machine.Init();
      var plain = machine.Encode(cipher);  -> "PLAIN TEXT"
   
   Rotor settings from:
   	http://homepages.tesco.net/~andycarlson/enigma/simulating_enigma.html
*/


global_namespace.Define('startpad.enigma', function (NS)
{
	var Base = NS.Import('startpad.base');
	var Random = NS.Import('startpad.random');
	var Format = NS.Import('startpad.format-util');

	NS.Extend(NS, {
		alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		mRotors: {
			I: {wires: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: 'Q'},
			II: {wires: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: 'E'},
			III: {wires: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: 'V'},
			IV: {wires: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: 'J'},
			V: {wires: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: 'Z'}
			},

		mReflectors: {
		B: {wires: "YRUHQSLDPXNGOKMIEBFZCWVJAT"},
		C: {wires: "FVPJIAOYEDRZXWGCTKUQSBNMHL"}
		},

		fnTrace: undefined,
		codeA: 'A'.charCodeAt(0),
		
	MapRotor: function(rotor)
		{
		// Determine the relative offset (mod 26) of encoding and decoding each letter
		// (wire position)
		rotor.map = {};
		rotor.mapRev = {};
		for (var iFrom = 0; iFrom < 26; iFrom++)
			{
			var iTo = NS.IFromCh(rotor.wires.charAt(iFrom));
			rotor.map[iFrom] = (26 + iTo - iFrom) % 26;
			rotor.mapRev[iTo] = (26 + iFrom - iTo) % 26;
			}
		},
		
	IFromCh: function(ch)
		{
		ch = ch.toUpperCase();
		return ch.charCodeAt(0) - NS.codeA;
		},

	ChFromI: function(i)
		{
		return String.fromCharCode(i + NS.codeA);
		},
		
	/* Create a valid settings map, given a collection of string-based
	   settings (in the format of StateStrings). */
	SettingsFromStrings: function(mState)
		{
		var mSettings = {};
		if (mState.rotors)
			mSettings.rotors = mState.rotors.split('-');
		if (mState.reflector)
			mSettings.reflector = mState.reflector;
		if (mState.position)
			mSettings.position = mState.position.split('');
		if (mState.rings)
			mSettings.rings = mState.rings.split('');
		if (mState.plugs)
			mSettings.plugs = mState.plugs;
		return mSettings;
		},
		
	StringsFromSettings: function(mSettings)
		{
		var mState = {};

		if (mSettings.rotors)
			mState.rotors = mSettings.rotors.join('-');
		if (mSettings.position)
			mState.position = mSettings.position.join('');
		if (mSettings.rings)
			mState.rings = mSettings.rings.join('');
		if (mSettings.reflector)
			mState.reflector = mSettings.reflector;
		if (mSettings.plugs)
			mState.plugs = mSettings.plugs;
		return mState;
		},
		
	GroupLetters: function(s)
		{
		s = s.toUpperCase();
		s = s.replace(/[^A-Z]/g, '');
		return Format.GroupBy(s, 5);
		},

	/* Set the Enigma machine settings using a passkey as a
	   seend to the random number generator. */	
	SettingsFromPasskey: function(s)
		{
		var settings = {};
		
		Random.seed(s);
		settings.rotors = Random.sample(['I', 'II', 'III', 'IV', 'V'], 3);
		settings.position = [];
		for (var i = 0; i < 3; i++)
			settings.position.push(NS.ChFromI(Random.randint(0,25)));
		settings.rings = [];
		for (var i = 0; i < 3; i++)
			settings.rings.push(NS.ChFromI(Random.randint(0, 25)));
		settings.plugs = Format.GroupBy(Random.sample(NS.alpha.split(''), 20).join(''), 2);
		return settings;
		}
	});

	// Compute forward and reverse mappings for rotors and reflectors
	for (var sRotor in NS.mRotors)
		NS.MapRotor(NS.mRotors[sRotor]);
		
	for (var sReflector in NS.mReflectors)
		NS.MapRotor(NS.mReflectors[sReflector]);

	NS.Enigma = function(settings)
	{
		this.fnTrace = NS.fnTrace;
		this.settings = {
			rotors: ['I', 'II', 'III'],
			reflector: 'B',
			position: ['M', 'C', 'K'],
			rings: ['A', 'A', 'A'],
			plugs: ""
			};
		NS.Extend(this.settings, settings);
		this.Init();
	};

	NS.Extend(NS.Enigma.prototype, {
	Init: function(settings)
		{
		NS.Extend(this.settings, settings);
		
		this.rotors = [];
		for (var i in this.settings.rotors)
				this.rotors[i] = NS.mRotors[this.settings.rotors[i]];

		this.reflector = NS.mReflectors[this.settings.reflector];

		// Position is for the position of the out Rings (i.e. the visible
		// marking on the code wheel.
		this.position = [];
		for (var i in this.settings.rotors)
			{
			this.position[i] = (NS.IFromCh(this.settings.position[i]));
			}
		
		this.rings = [];
		for (var i in this.settings.rings)
			{
			this.rings[i] = NS.IFromCh(this.settings.rings[i]);
			}
		
		this.settings.plugs = this.settings.plugs.toUpperCase();
		this.settings.plugs = this.settings.plugs.replace(/[^A-Z]/g, '');
		
		if (this.settings.plugs.length % 2 == 1)
			console.warn("Invalid plugboard settings - must have an even number of characters.");
		
		this.mPlugs = {};
		for (var i = 0; i < 26; i++)
			this.mPlugs[i] = i;

		for (var i = 0; i < this.settings.plugs.length; i += 2)
			{
			var iFrom = NS.IFromCh(this.settings.plugs[i]);
			var iTo = NS.IFromCh(this.settings.plugs[i+1]);
		
			if (this.mPlugs[iFrom] != iFrom)
				console.warn("Redefinition of plug setting for " + NS.ChFromI(iFrom));
			if (this.mPlugs[iTo] != iTo)
				console.warn("Redefinition of plug setting for " + NS.ChFromI(iTo));
				
			this.mPlugs[iFrom] = iTo;
			this.mPlugs[iTo] = iFrom;
			}
		
		//if (this.fnTrace)
		//	this.fnTrace("Init: " + this.toString())
			
		return this;
		},

	/* Return machine state	as a string
	 * 
	 * Format: "Enigma Rotors: I-II-III Position: ABC <Rings:AAA> <Plugboard: AB CD>"
	 * 
	 * Rings settings of AAA not displayed.
	 * Null plugboard not displayed.
	 */
	toString: function()
		{
		var s = "";
		var mState = this.StateStrings();
		
		s += "Enigma Rotors: " + mState.rotors;
		s += " Position: " + mState.position;

		if (mState.rings != "AAA")
			s += " Rings: " + mState.rings;

		if (mState.plugs != "")
			s += " Plugboard: " + mState.plugs;

		return s;
		},
		
	StateStrings: function()
		{
		var mState = NS.StringsFromSettings(this.settings);
		mState.position = Base.Map(this.position, NS.ChFromI).join('');

		mState.plugs = "";
		var chSep = "";
		for (var i = 0; i < 26; i++)
			{
			if (i < this.mPlugs[i])
				{
				mState.plugs += chSep + NS.ChFromI(i) + NS.ChFromI(this.mPlugs[i]);
				chSep = " ";
				}
			}

		return mState;
		},
		
	PositionString: function()
		{
		return Base.Map(this.position, NS.ChFromI).join('')
		},
		
	IncrementRotors: function()
		{
		/* Note that notches are components of the outer rings.  So wheel
		 * motion is tied to the visible rotor position (letter or number)
		 * NOT the wiring position - which is dictated by the rings settings
		 * (or offset from the 'A' position).
		 */
		
		// Middle notch - all rotors rotate
		if (this.position[1] == NS.IFromCh(this.rotors[1].notch))
			{
			this.position[0] += 1;
			this.position[1] += 1;
			}
		// Right notch - right two rotors rotate
		else if (this.position[2] == NS.IFromCh(this.rotors[2].notch))
			this.position[1] += 1;
			
		this.position[2] += 1;
		
		for (var i in this.rotors)
			this.position[i] = this.position[i] % 26; 
		},
		
	EncodeCh: function(ch)
		{
		var aTrace = [];
		var i;
		
		ch = ch.toUpperCase();
		
		// Short circuit non alphabetics
		if (ch < 'A' || ch > 'Z')
			return ch;
			
		this.IncrementRotors();
		
		i = NS.IFromCh(ch);
		aTrace.push(i);
		i = this.mPlugs[i];
		aTrace.push(i);

		for (var r = 2; r >= 0; r--)
			{
			var d = this.rotors[r].map[(26 + i + this.position[r] - this.rings[r]) % 26];
			i = (i + d) % 26;
			aTrace.push(i);
			}
			
		i = (i + this.reflector.map[i]) % 26;
		aTrace.push(i);
		
		for (var r = 0; r < 3; r++)
			{
			var d = this.rotors[r].mapRev[(26 + i + this.position[r] - this.rings[r]) % 26];
			i = (i + d) % 26;
			aTrace.push(i);
			}
			
		i = this.mPlugs[i];
		aTrace.push(i);

		var chOut = NS.ChFromI(i);
		
		if (this.fnTrace)
			{
			var s = "";
			var chSep = "";
			for (var i in aTrace)
				{
				s += chSep + NS.ChFromI(aTrace[i]);
				chSep = "->";
				}
			//this.fnTrace(s + " " + this.toString());
			}

		return chOut;
		},
		
	Encode: function(s)
		{
		var sOut = "";
		for (var i = 0; i < s.length; i++)
			sOut += this.EncodeCh(s[i]);
		return sOut;
		}
	});

}); // startpad.enigma