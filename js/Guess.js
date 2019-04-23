//http://book.mixu.net/node/ch6.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
//Avoid assigning variables to prototypes but use guessobj.random=value or guessobj['random']=value

// Constructor
function Guess(id, r, certainty, value, cipher) {
	// always initialize all instance properties
	this.id = id;
	this.random = r;
	this.certainty = certainty;
	this.value = value;
	this.cipher = cipher;
	this.intermediateSteps = [];
}
// class methods
Guess.prototype.getInfoArray = function() {
	return [this.id, this.random, this.certainty, this.value, this.cipher];
};
// export the class
//module.exports = Guess;


// constructor call
//var object = new Guess(r, certainty, value, cipher);



// https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
var CertaintyEnum = {
	UNKNOWN: 0,
	DESPERATE: 1,
	WILDGUESS: 2,
	GUESS: 3,
	EDUCATEDGUESS: 4,
	ALMOSTCERTAIN: 5,
	properties: {
		0: {name: "Unknown",			value: 0, code: "UNKNOWN"},
		1: {name: "Desperate Guess",	value: 1, code: "DESPERATE"},
		2: {name: "Wild Guess",			value: 2, code: "WILDGUESS"},
		3: {name: "Guess",				value: 3, code: "GUESS"},
		4: {name: "Educated Guess",		value: 4, code: "EDUCATEDGUESS"},
		5: {name: "Almost Certain",		value: 5, code: "ALMOSTCERTAIN"}
	}
};

var Guesses = {
	UPPER_GUESS_INT_LIMIT : 100000000,
	allguesses : [],
	passwordguesses : [],
	passwordciphers : ['playfair', 'vigenere', 'columnartransposition', 'bifid', 'xor'],


	clearAll : function()
	{
		var nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.allguesses[nodeid] !== 'undefined'){
			Guesses.allguesses[nodeid] = [];
		}
		if(typeof Guesses.passwordguesses[nodeid] !== 'undefined'){
			Guesses.passwordguesses[nodeid] = [];
		}
	},
	makeGuess: function(id, certainty, value, cipher)	//id can be null
	{
		var r = Math.floor((Math.random() * Guess.UPPER_GUESS_INT_LIMIT) + 2);	//Random number between 2 and 100 million
		return new Guess(id, r, certainty, value, cipher);//[r, certainty, value, cipher];
	},
	saveGuess : function(certainty, value, cipher)
	{
		var nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.allguesses[nodeid] === 'undefined'){
			Guesses.allguesses[nodeid] = [];
		}
		
		var id = Guesses.allguesses[nodeid].length;
		Guesses.allguesses[nodeid][id] = this.makeGuess(id, certainty, value, cipher);
		console.info("\tNew "+CertaintyEnum.properties[certainty].name+" at "+cipher);
		return Guesses.allguesses[nodeid][id];
	},
	analyzeGuessAndGradeValue : function(input, cipher)
	{
		if(input == null)
		{
			return null;
		}
		else if(Object.prototype.toString.call(input) === '[object Array]')
		{
			if(input[1] >= CertaintyEnum.UNKNOWN/* && input[0].length >= min_encoded_string_length*/)
			{
				this.saveGuess(input[1], input[0], cipher);
			}
			input = input[0];	//Needed for analyzeValue later in this function
		}
		else if(typeof input == 'string' && input.length >= min_encoded_string_length)
		{
			this.saveGuess(input, CertaintyEnum.UNKNOWN, cipher);
		}
		else 
		{
			alert("Unknown type of input obtained @ analyzeGuessAndGradeValue:"+input+" for cipher:"+cipher);
		}
		//alert("ID:"+ForceFlow.getCurrentNodeId());
		
		return Teacher.analyzeValue(input, cipher);
	},

	//Best Guess? False: a guess is never the best.
	getBestGuess : function(remove)
	{
		var nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.allguesses[nodeid] !== 'undefined')
			return this.getBestGuessFromSet(Guesses.allguesses[nodeid], remove);
		return [0,0,'','',''];
	},

	getBestGuessFromSet : function(guessSet, remove)
	{
		var bestGuess = [0,0,'','',''];
		var bestGuessIndex = -1;
		for(var i = 0; i < guessSet.length; i++) {
			if(guessSet[i].certainty>bestGuess[1]) {
				bestGuess = [guessSet[i].random, guessSet[i].certainty, guessSet[i].value, guessSet[i].cipher];
				bestGuessIndex = i;
			}
		}
		if(remove && bestGuessIndex > -1) guessSet.splice(bestGuessIndex, 1);
		return bestGuess;
	},



	sortGuesses : function(guessSet)
	{
		var sortedGuesses = [];
		var out = [];
		var c = 0;
		if(typeof guessSet === 'undefined') {
			var nodeid = ForceFlow.getCurrentNodeId();
			if(typeof Guesses.allguesses[nodeid] !== 'undefined'){
				guessSet = Guesses.allguesses[nodeid];
			} else{ 
				return [];
			}
		}
		for(var i = 0; i < 6/*CertaintyEnum.properties.length*/; i++) {
			sortedGuesses[i] = [];
		}

		for(var i = 0; i < guessSet.length; i++) {
			/*id = (typeof sortedGuesses[guessSet[i].certainty] !== 'undefined')?sortedGuesses[guessSet[i].certainty].length:0;
			sortedGuesses[guessSet[i].certainty][id] = guessSet[i];*/
			c = guessSet[i].certainty;
			sortedGuesses[c].push(guessSet[i]);
		}
		for(var i = 5 /*CertaintyEnum.properties.length -1 */; i >= 0; i--) {	//From AlmostCertain (5) to Desperate (1)
			out = out.concat(sortedGuesses[i]);
		}
		/*for(var i = 0; i < sortedGuesses.length; i++) {
			out = out.concat();
		}*/
		return out;
	},

	analyzeValueSavePWGuess : function(input, password, cipher)
	{
		var basecipher = '';
		if(input == null)
		{
			return null;
		}
		//Passwords used in Vigenere, Playfair, columnar transposition, XOR(repeat), Bifid
		if(cipher.indexOf('playfair') !== -1) basecipher = 'playfair';
		else if(cipher.indexOf('vigenere') !== -1) basecipher = 'vigenere';
		else if(cipher.indexOf('columnartransposition') !== -1) basecipher = 'columnartransposition';
		else if(cipher.indexOf('bifid') !== -1) basecipher = 'bifid';
		else if(cipher.indexOf('xor') !== -1) basecipher = 'xor';
		else alert("Cipher "+cipher+" is not recognized @ analyzeValueSavePWGuess()!");
		
		this.addPasswordGuess(password, basecipher, input);
		
		return Teacher.analyzeValue(input, cipher);
	},
	addPasswordGuess : function(password, cipher, value)
	{
		var nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.passwordguesses[nodeid] === 'undefined'){
			Guesses.passwordguesses[nodeid] = [];
		}
		if(typeof Guesses.passwordguesses[nodeid][password] === 'undefined'){
			Guesses.passwordguesses[nodeid][password] = [];
		}
		Guesses.passwordguesses[nodeid][password][cipher] = value;
		//alert(Guesses.passwordguesses[nodeid][password][cipher]);
	},
	pivotOverPassword : function(password)
	{
		var value;
		var nodeid = ForceFlow.getCurrentNodeId();
		//alert("finding"+password);
		if( typeof Guesses.passwordguesses[nodeid] === 'undefined' || 
			typeof Guesses.passwordguesses[nodeid][password] === 'undefined' )
		{
			alert('No password guesses have yet been made.');
			return;
		}
			
		for (var i = 0; i < this.passwordciphers.length; i++) {
			if(typeof Guesses.passwordguesses[nodeid][password][this.passwordciphers[i]] === 'undefined')
			{
				continue;
			}
			value = Guesses.passwordguesses[nodeid][password][this.passwordciphers[i]];
			//alert(value);
			Guesses.analyzeGuessAndGradeValue([value, CertaintyEnum.WILDGUESS], this.passwordciphers[i]+'('+password+')');
			//ForceFlow.addGuessStep(Teacher.analyzeValueDoNotSaveGrade(value, this.passwordciphers[i]+'('+password+')'), CertaintyEnum.WILDGUESS, CertaintyEnum.properties[CertaintyEnum.WILDGUESS].name);
		}
		this.drawGuesses();
	},
	drawGuesses : function()
	{
		var retvar = false;
		var guesses = Guesses.sortGuesses();
		//allguesses = guesses;
		if(guesses.length >= 1)
		{
			ForceFlow.updateGuesses(Guesses.printEntireGuessBar());
			
			if(guesses.length == 1)
			{
				var bestGuess = Guesses.getBestGuess(false);
				if(bestGuess[2] && bestGuess[2].length)
				{//guessSet[i].random, guessSet[i].certainty, guessSet[i].value, guessSet[i].cipher
					if(bestGuess[1] >= min_auto_guess_certainty)
					{
						if(bestGuess[2].slice(0,11).toLowerCase()=='javascript:') {
							window.setTimeout(bestGuess[2].slice(11)+';Teacher.updateHitBox();Teacher.updateHitValueBox();return false;',50);
						} else {
							ForceFlow.addGuessStep(Teacher.analyzeValueDoNotSaveGrade(bestGuess[2], bestGuess[3]), bestGuess[1], CertaintyEnum.properties[bestGuess[1]].name);
							retvar = true;
						}
					}
				}
			}
			else
			{
				for(var i = 0; i < guesses.length; i++)
				{
					//ForceFlow.addGuessStepNoRedraw(Teacher.analyzeValueDoNotSaveGrade(guesses[i].value, guesses[i].cipher), guesses[i].certainty, CertaintyEnum.properties[guesses[i].certainty].name);
					if(guesses[i].certainty >= min_auto_guess_certainty)
					{
						if(guesses[i].value.slice(0,11).toLowerCase()=='javascript:') {
							window.setTimeout(guesses[i].value.slice(11)+';Teacher.updateHitBox();Teacher.updateHitValueBox();return false;',50);
						} else {
							ForceFlow.addGuessStep(Teacher.analyzeValueDoNotSaveGrade(guesses[i].value, guesses[i].cipher), guesses[i].certainty, CertaintyEnum.properties[guesses[i].certainty].name);
							retvar = true;
						}
					}
				}

				//TODO: Make if retvat only then draw and guess
				//Better not redraw otherwise playfair bug...//ForceFlow.draw();
				window.setTimeout('Student.startGuessAll();',500);
			}
		}
		return retvar;
	},


	getNumberOfGuesses : function()
	{
		var nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.allguesses[nodeid] !== 'undefined')
			return Guesses.allguesses[nodeid].length;
		return 0;
	},

	printGuessButtons : function(nodeid)
	{
		if(typeof nodeid == 'undefined')
			nodeid = ForceFlow.getCurrentNodeId();
		if(typeof Guesses.allguesses[nodeid] == 'undefined')
			return '';

		var out = '';
		var js = '';
		for(var i = 0; i < Guesses.allguesses[nodeid].length; i++) {
			js = Guesses.allguesses[nodeid][i].value.slice(0,11).toLowerCase()=='javascript:'?Guesses.allguesses[nodeid][i].value+';Teacher.updateHitBox();Teacher.updateHitValueBox();':'javascript:ForceFlow.addGuessStep(Teacher.analyzeValueDoNotSaveGrade(Guesses.allguesses['+nodeid+']['+i+'].value, Guesses.allguesses['+nodeid+']['+i+'].cipher), Guesses.allguesses['+nodeid+']['+i+'].certainty, CertaintyEnum.properties[Guesses.allguesses['+nodeid+']['+i+'].certainty].name);';
			out += '<a href="#" class="'+(Guesses.allguesses[nodeid][i].certainty>=min_auto_guess_certainty?'autoGuessButton':'manualGuessButton')+'" onclick="'+js+';return false;">'+Guesses.allguesses[nodeid][i].cipher+'</a> ';
		}
		return out;
	},

	printPasswordGuessControls : function(nodeid)
	{
		if(typeof nodeid == 'undefined')
			nodeid = ForceFlow.getCurrentNodeId();

		var out = 'Pivot over <select id="GUESS_pivot_over_password" name="GUESS_pivot_over_password" onchange="javascript:Guesses.pivotOverPassword(this.value);">';
		for(var i = 0; i < brute_force_dictionary_keys.length; i++) {
			//out += '<a href="#" class="autoGuessButton" onclick="javascript:ForceFlow.addGuessStep(Teacher.analyzeValueDoNotSaveGrade(Guesses.allguesses['+nodeid+']['+i+'].value, Guesses.allguesses['+nodeid+']['+i+'].cipher), Guesses.allguesses['+nodeid+']['+i+'].certainty, CertaintyEnum.properties[Guesses.allguesses['+nodeid+']['+i+'].certainty].name);">'+Guesses.allguesses[nodeid][i].cipher+'</a> ';
			out += '<option value="'+brute_force_dictionary_keys[i]+'">\''+brute_force_dictionary_keys[i]+'\'';
		}
		return out+"</select><input type=\"button\" onclick=\"javascript:Guesses.pivotOverPassword(document.getElementById('GUESS_pivot_over_password').value); return false;\" style=\"font-size:11px;\" value=\"&#9658;\">";
	},

	/*addGuesses : function(nodeid)
	{
		var out = '';
		if(out = Guesses.printGuessButtons(nodeid))
			return out;
		return out;
	},
	addPasswordGuesses : function(nodeid)
	{
		var out = '';
		if(out = Guesses.printPasswordGuessControls(nodeid))
			return out;
		return out;
	},*/
	printEntireGuessBar : function(nodeid)
	{
		var out = '';
		var visible = false;
		var currentNodeId = ForceFlow.getCurrentNodeId();
		if(typeof nodeid === 'undefined' || nodeid == 0)
			nodeid = currentNodeId;
		var guessbuttons = this.printGuessButtons(nodeid);
		var passwordpivotselect = this.printPasswordGuessControls(nodeid);
		if(guessbuttons && guessbuttons.length)
		{
			for(var i = 0; i < Guesses.allguesses[nodeid].length; i++) {
				visible |= (Guesses.allguesses[nodeid][i].certainty>=min_auto_guess_certainty);
			}
			
			return "<div class='node-guesses' node-id='"+nodeid+"' style='display:"+(visible||currentNodeId?'block':'none')+"'>"+guessbuttons+passwordpivotselect+"</div>";
		}
		return "<div class='node-guesses' node-id='"+nodeid+"' style='display:"+(visible?'none':'none')+"'>No guesses yet... "+passwordpivotselect+"</div>";
	},

};


