

var Maze = {

	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {
			text = CURRENTSCRATCHPAD.realvalue;
			if(/^[0-9A-F\s]+$/gi.test(text) || ((text.match(/[^0-9A-F\s]/gi)||[]).length == 1 && /^[0-9A-F\s]+$/gi.test(text.replace(/[^0-9A-F\s]/i,' ')))) {
				
				Timer.start();

				Maze.calc(text);
				//document.getElementById('Dev_output').innerHTML = Teacher.analyzeValue(Dev.decode(CURRENTSCRATCHPAD.realvalue), 'UnderDev_decode()');
				//Dev.multiplyBruteF(CURRENTSCRATCHPAD.realvalue);

				Timer.stop("Maze - 16");
			}
		}
	},

	calc : function(text)
	{
		//if(/^[0-9A-F\s]+$/gi.test(text) || ((text.match(/[^0-9A-F\s]/gi)||[]).length == 1 && /^[0-9A-F\s]+$/gi.test(text.replace(/[^0-9A-F\s]/i,' ')))) {
		text = text.replace(/[^0-9A-F\s]/i,' ');

		var rows = text.split(/[\r\n]/);
		if(rows.length) {
			var rowlength = rows[0].length;
			for(var i = 1, l = rows.length; i < l; i++) {
				if (rows[i].length != rowlength)
					return false;
			}
		} else {
			return false;
		}

		var transposed = Maze.transpose(rows);
		
		//http://character-code.com/arrows-html-codes.php

		var original = transposed.slice();
		document.getElementById('MAZE_ltdd_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(original.join('')),'maze_hex_\u2196\u21b3\u21b3()');//'Maze_hex_\u2196\u2193\u2193()'
		document.getElementById('MAZE_rbuu_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(original.reverse().join('')),'maze_hex_\u21b0\u21b0\u2198()');//'Maze_hex_rev_\u2198\u2191\u2191()'

		var secondrow_inversed = transposed.slice();
		for(var i = 1, l = secondrow_inversed.length; i < l; i+=2){
			secondrow_inversed[i] = Reverse_String(secondrow_inversed[i]);
		}
		document.getElementById('MAZE_ltdu_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(secondrow_inversed.join('')),'maze_hex_\u2196\u21b3\u21b1()');//'Maze_hex_\u2196\u2193\u2191()'
		document.getElementById('MAZE_rtdu_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(secondrow_inversed.reverse().join('')),'maze_hex_\u21b0\u21b2\u2197()');//'Maze_hex_rev_\u2197\u2193\u2191()'

		var allrows_inversed = transposed.slice();
		for(var i = 0, l = allrows_inversed.length; i < l; i++) {
			allrows_inversed[i] = Reverse_String(allrows_inversed[i]);
		}
		document.getElementById('MAZE_lbuu_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(allrows_inversed.join('')),'maze_hex_\u2199\u21b1\u21b1()');//'Maze_hex_\u2199\u2191\u2191()'
		document.getElementById('MAZE_rtdd_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(allrows_inversed.reverse().join('')),'maze_hex_\u21b2\u21b2\u2197()');//'Maze_hex_rev_\u2197\u2193\u2193()'
		
		var firstrow_inversed = transposed.slice();
		for(var i = 0, l = firstrow_inversed.length; i < l; i+=2) {
			firstrow_inversed[i] = Reverse_String(firstrow_inversed[i]);
		}
		document.getElementById('MAZE_lbud_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(firstrow_inversed.join('')),'maze_hex_\u2199\u21b1\u21b3()');//"Maze_hex_\u2199\u2191\u2193()");
		document.getElementById('MAZE_rbud_output').innerHTML = Teacher.analyzeValue(ConvertBase.hexToStr(firstrow_inversed.reverse().join('')),'maze_hex_\u21b2\u21b0\u2198()');//'Maze_hex_rev_\u2198\u2191\u2193()'

		//}
		//return false;
	},
		
	/**
	 * http://www.shamasis.net/2010/02/transpose-an-array-in-javascript-and-jquery
	 * Transposes a given array.
	 * @id Array.prototype.transpose
	 * @author Shamasis Bhattacharya
	 *
	 * @type Array
	 * @return The Transposed Array
	 * @compat=ALL
	 */
	transpose : function(a) {

		// Calculate the width and height of the Array
		var //a = this,
			w = a.length ? a.length : 0,
			h = (a[0] instanceof Array || typeof a[0] === "string") ? a[0].length : 0;

		// In case it is a zero matrix, no transpose routine needed.
		if (h === 0 || w === 0) {
			return [];
		}

		/**
		 * @var {Number} i Counter
		 * @var {Number} j Counter
		 * @var {Array} t Transposed data is stored in this array.
		 */
		var i, j, t = [];

		// Loop through every item in the outer array (height)
		for (i = 0; i < h; i++) {

			// Insert a new row (array)
			t[i] = [];

			// Loop through every item per item in outer array (width)
			for (j = 0; j < w; j++) {

				// Save transposed data.
				t[i][j] = a[j][i];
			}

			if(typeof a[0] === "string")
				t[i] = t[i].join('');
		}

		return t;
	},

};