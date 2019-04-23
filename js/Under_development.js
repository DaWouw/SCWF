


/*$(document).ready(function(){
	Dev.multiplyBruteF("Zbi GOqEU pVcsN xcH FOyrk cdiV zbi jalW TcM");
});//*/


/*
//////////////////////////////////////////////
///// Start of awesome Webworker project /////
//////////////////////////////////////////////

//https://www.html5rocks.com/en/tutorials/workers/basics/
//http://stackoverflow.com/questions/39281491/how-to-wait-for-multiple-webworkers-in-a-loop

$(document).ready(function(){

	
	//var worker = new Worker('js/timer.js', 'js/cipher/playfair.js');
	var worker = new Worker('js/cipher/playfair.js');
	//var worker = new Worker();
	Playfair.sync();

	worker.addEventListener('message', function(e) {
		var data = e.data
		//alert(e.data);
		//console.log('Worker said: ', data.ouput);
		console.warn(data);
		//
		document.getElementById('PLAYFAIR_output').innerHTML = Teacher.analyzeValue(data, 'playfair()');
		Timer.stopN('PlayFairWorker', "PlayFairWorker - Single");
	}, false);

	Timer.startN('PlayFairWorker');
	worker.postMessage({'cmd':'calc','value':'Sik Uqfvidfs bkokct gq c iomweln xretuoyquots hkokct. Gu dnlmpxt d qbcpa xgbud ppc pazzbu li sia bmlfccay ot nogzzae'}); // Send data to our worker.
});

	function createWorkers(workerCount, src) {
	    var workers = new Array(workerCount);
	    for (var i = 0; i < workerCount; i++) {
	        workers[i] = new Worker(src);
	    }
	    return workers;
	}
	function doWork(worker, data) {
	    return new Promise(function(resolve, reject) {
	        //worker.onmessage = resolve;
		    worker.onmessage = function(e){
	            // If you report errors via messages, you'd have a branch here for checking
	            // for an error and either calling `reject` or `resolve` as appropriate.
	            resolve(e.data['key']+" : "+e.data['output']);
	        };
	        worker.postMessage({'cmd':'calc_key','value':'Smc ecrtcs rpbc Ohfrlbht rkoise la h bkftdnn aogesmezgowp skoise. Ls ckuiqvr g sbdir victb wos iraact qb sms bkqnhibe me nhkaacb','key':data});
	    });
	}
	function doDistributedWork(workers, data) {
	    // data size is always a multiple of the number of workers//var elementsPerWorker = data.length / workers.length;
	    return Promise.all(workers.map(function(worker, index) {
	        //var start = index * elementsPerWorker;//return doWork(worker, data.slice(start, start+elementsPerWorker));
	        return doWork(worker, data[index]);
	    }));
	}

	var passwords = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	passwords = passwords.concat(brute_force_dictionary_keys);

	var myWebWorkers = createWorkers(passwords.length, 'js/cipher/playfair.js');
	
	window.setTimeout("Playfair.sync();",3000);
	function step(i) {
	    if (i <= 0) {
	        Timer.stopN('PlayFairWorkers', 'PlayFairWorkers - 32')
	        return Promise.resolve("done!");
	    }
	    return doDistributedWork(myWebWorkers, passwords)
	    .then(function(results) {
	        if (i % 100)
	        	console.warn(results);
	            //updateSVGonWebPage();
	        return step(i-1)
	    });
	}

	window.setTimeout("Timer.startN('PlayFairWorkers');step(passwords.length).then(console.warn);", 5000);
	//step(passwords.length).then(console.warn);

//*/


//console.log(text);


/*
var CryptoTextArea = document.registerElement('crypto-textarea', {
  prototype: Object.create(HTMLTextAreaElement.prototype),
  extends: 'textarea'
});
Object.defineProperty(CryptoTextArea, "realvalue", {
	//value: 0,
	get : function () {
		return value;
	},
	set : function (newValue) {
		this.value = newValue;
		value = newValue;
	},
	
	configurable: true,
	enumerable: true,
	writeable: false,
});
Object.defineProperty(CryptoTextArea, "realvalue", {value: null});
*/


/*Object.defineProperty(HTMLTextAreaElement.prototype, "realvalue", {
	//value: 0,
	get : function () {
		return value;
	},
	set : function (newValue) {
		this.value = newValue;
		value = newValue;
	},
	
	configurable: true,
	enumerable: true,
	writeable: false,
});*/



var Dev = {

	coprimesof26 : [3,5,7,9,11,15,17,19,21,23,25],
	coprimesof52 : [3,5,7,9,11,15,17,19,21,23,25,27,29,31,33,35,37,41,43,45,47,49,51],

	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {
			Timer.start();

			//document.getElementById('Dev_output').innerHTML = Teacher.analyzeValue(Dev.decode(CURRENTSCRATCHPAD.realvalue), 'UnderDev_decode()');
			//Dev.multiplyBruteF(CURRENTSCRATCHPAD.realvalue);

			Timer.stop("Development");
		}
	},

	multiplyBruteF : function(ciphertext)
	{
		//var ciphertext = "Zbi GOqEU pVcsN xcH FOyrk cdiV zbi jalW TcM";

		var alphabet = "";
		if(/[A-Z]/.test(ciphertext))
			alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if(/[a-z]/.test(ciphertext))
			alphabet += "abcdefghijklmnopqrstuvwxyz";

		if(alphabet.length) {
			var key = 15;
			var cipheralpha = this.parseAlphabet(alphabet, key);
			document.getElementById('MULTIPLY_output').innerHTML = Teacher.analyzeValue(this.calc(alphabet, key, cipheralpha, ciphertext, "decrypt", "ignore"), 'Multiply'+key+'()');

			if(alphabet.length == 26 || alphabet.length == 52){
				var coprimes = [];
				if(alphabet.length == 26){
					coprimes = this.coprimesof26;
				} else if (alphabet.length == 52) {
					coprimes = this.coprimesof52;
				}
				
				var out = '';
				for(var i = 0, l = coprimes.length; i < l; i++) {
					cipheralpha = this.parseAlphabet(alphabet, coprimes[i]);
					out += Teacher.analyzeValue(this.calc(alphabet, coprimes[i], cipheralpha, ciphertext, "decrypt", "ignore"), 'Multiply'+coprimes[i]+'()')+'<br>';
				}
				document.getElementById('MULTIPLY_output_bruteF').innerHTML = out;
			}			
		}
	},


	calc : function(alphabet, key, cipheralpha, text, type, handle) {
		var alphaLen = alphabet.length;
		var i, n = 0;
		var chiffre = "";

		if (type == "decrypt") {
			for (i = 0; i < text.length; i++) {
				n = cipheralpha.indexOf(text.charAt(i));

				if (n >= 0) {

					chiffre += alphabet.charAt(n);

				} else
				if (handle == "ignore" || text.charCodeAt(i) == 13 || text.charCodeAt(i) == 32 || text.charCodeAt(i) == 10)
					chiffre = chiffre + text.charAt(i);
			}

		} else { //encrypt

			for (i = 0; i < text.length; i++) {
				n = alphabet.indexOf(text.charAt(i));

				if (n >= 0) {

					var pos;
					pos = n * key;
					while (pos > alphaLen) pos -= alphaLen;

					chiffre = chiffre + alphabet.charAt(pos);

				} else

				if (handle == "ignore" || text.charCodeAt(i) == 13 || text.charCodeAt(i) == 32 || text.charCodeAt(i) == 10)
					chiffre = chiffre + text.charAt(i);
			}
		}
		return chiffre;
	},

	parseAlphabet : function(alphabet, key) {
		var out1 = '';
		var out2 = '';
		var i = 0;
		var alphaLen = alphabet.length;

		for (i = 0; i < alphaLen; i++) {
			out1 = out1 + alphabet.charAt(i);
		}
		for (i = 0; i < alphaLen; i++) {
			var pos = i * key;
			while (pos > alphaLen) pos -= alphaLen;
			out2 = out2 + alphabet.charAt(pos);
		}
		return out2;
	},

};