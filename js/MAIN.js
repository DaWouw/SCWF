
//

var IsUnchangedVar = {
	pad : null,
	text : null,
	encdec : null,

	a : null,
	b : null,
	rem_jv : null,

	BIFID_skip : null,
	BIFID_key : null,
	BIFID_skipto : null,
	colkey : null,
	colkey_type : null,
	use_as_column_order : null,
	LETTERNUMBERS_method : null,

	ONETIMEPAD_pad : null,
	PLAYFAIR_skip : null,
	PLAYFAIR_skipto : null,
	PLAYFAIR_doubleencode : null,
	PLAYFAIR_key : null,
	RAILFENCE_rails : null,
	RAILFENCE_offset : null,
	ROTATE_col : null,
	SKIP_skip : null,
	SKIP_startat : null,
	VIGENERE_pass : null,
};

var CURRENTSCRATCHPAD = null;
var CHANGEDSCRATCHPAD = true;

var RECALCULATECURRENT = false;

var UPDATE_SETTIMEOUT = 300;

function start_update(txt)
{
	if (! document.getElementById)
	{
		alert('Sorry, you need a newer browser. Get Chrome :)');
		return;
	}

	if (! document.Util_Loaded || typeof document.encoder === 'undefined')
	{
		window.setTimeout('start_update("ToLoad1")', UPDATE_SETTIMEOUT);
		return;
	}
	
	if (CURRENTSCRATCHPAD == null) {
		ForceFlow.updateSelectedTextArea();
		//console.log('\tWhere is my scratchpad :(');
		window.setTimeout('start_update("ToLoad2")', UPDATE_SETTIMEOUT);
		return;
	}
	
	
	IsUnchangedVar.text = IsUnchanged(CURRENTSCRATCHPAD) && !CHANGEDSCRATCHPAD;
	IsUnchangedVar.encdec = IsUnchanged(document.encoder.encdec);

	IsUnchangedVar.a = IsUnchanged(document.encoder.a);
	IsUnchangedVar.b = IsUnchanged(document.encoder.b);
	IsUnchangedVar.rem_jv = IsUnchanged(document.encoder.rem_jv);
	
	IsUnchangedVar.XOR_b = IsUnchanged(document.encoder.xor_b);
	IsUnchangedVar.XOR_c = IsUnchanged(document.encoder.xor_c);
	IsUnchangedVar.XOR_d = IsUnchanged(document.encoder.xor_d);
	IsUnchangedVar.XOR_text_string = IsUnchanged(document.encoder.xor_text_string);
	IsUnchangedVar.XOR_b_string = IsUnchanged(document.encoder.xor_b_string);
	IsUnchangedVar.XOR_c_string = IsUnchanged(document.encoder.xor_c_string);
	IsUnchangedVar.XOR_d_string = IsUnchanged(document.encoder.xor_d_string);
	IsUnchangedVar.BIFID_skip = IsUnchanged(document.encoder.BIFID_skip);
	IsUnchangedVar.BIFID_key = IsUnchanged(document.encoder.BIFID_key);
	IsUnchangedVar.BIFID_skipto = IsUnchanged(document.encoder.BIFID_skipto);
	IsUnchangedVar.colkey = IsUnchanged(document.encoder.colkey);
	IsUnchangedVar.colkey_type = IsUnchanged(document.encoder.colkey_type);
	IsUnchangedVar.use_as_column_order = IsUnchanged(document.encoder.use_as_column_order);
	IsUnchangedVar.LETTERNUMBERS_method = IsUnchanged(document.encoder.LETTERNUMBERS_method);

	IsUnchangedVar.ONETIMEPAD_pad = IsUnchanged(document.encoder.ONETIMEPAD_pad);
	IsUnchangedVar.PLAYFAIR_skip = IsUnchanged(document.encoder.PLAYFAIR_skip);
	IsUnchangedVar.PLAYFAIR_skipto = IsUnchanged(document.encoder.PLAYFAIR_skipto);
	IsUnchangedVar.PLAYFAIR_doubleencode = IsUnchanged(document.encoder.PLAYFAIR_doubleencode);
	IsUnchangedVar.PLAYFAIR_key = IsUnchanged(document.encoder.PLAYFAIR_key);
	IsUnchangedVar.RAILFENCE_rails = IsUnchanged(document.encoder.RAILFENCE_rails);
	IsUnchangedVar.RAILFENCE_offset = IsUnchanged(document.encoder.RAILFENCE_offset);
	IsUnchangedVar.ROTATE_col = IsUnchanged(document.encoder.ROTATE_col);
	IsUnchangedVar.SKIP_skip = IsUnchanged(document.encoder.SKIP_skip);
	IsUnchangedVar.SKIP_startat = IsUnchanged(document.encoder.SKIP_startat);
	IsUnchangedVar.VIGENERE_pass = IsUnchanged(document.encoder.VIGENERE_pass);
	
	if (IsUnchangedVar.text * IsUnchangedVar.encdec * IsUnchangedVar.a * IsUnchangedVar.b * 
		IsUnchangedVar.XOR_b * IsUnchangedVar.XOR_c * IsUnchangedVar.XOR_d * IsUnchangedVar.XOR_text_string * 
		IsUnchangedVar.XOR_b_string * IsUnchangedVar.XOR_c_string * IsUnchangedVar.XOR_d_string * 
		IsUnchangedVar.rem_jv * IsUnchangedVar.BIFID_skip * IsUnchangedVar.BIFID_key * 
		IsUnchangedVar.BIFID_skipto * IsUnchangedVar.colkey * IsUnchangedVar.colkey_type * 
		IsUnchangedVar.use_as_column_order * IsUnchangedVar.LETTERNUMBERS_method * IsUnchangedVar.ONETIMEPAD_pad * 
		IsUnchangedVar.PLAYFAIR_skip * IsUnchangedVar.PLAYFAIR_skipto * IsUnchangedVar.PLAYFAIR_key * IsUnchangedVar.RAILFENCE_rails * 
		IsUnchangedVar.RAILFENCE_offset * IsUnchangedVar.ROTATE_col * IsUnchangedVar.SKIP_skip * 
		IsUnchangedVar.SKIP_startat * IsUnchangedVar.VIGENERE_pass)	//* IsUnchangedVar.SUBSTITUTE_key
	{
		window.setTimeout('start_update("Unchanged")', UPDATE_SETTIMEOUT*2);
		return;
	}

	if( ! IsUnchangedVar.text && WorkSpaceManager.loadIfCached()) {
		window.setTimeout('start_update("FromCache")', UPDATE_SETTIMEOUT);
		return;
	}

	if(Timer.getIteration() > 0) {
		Teacher.clearAllGrades();
		Guesses.clearAll();
		Teacher.clearAllAnswers();
	}
	
	Global.InputType = InputTypeEnum.UNINITIALIZED;
	Global.InputLength = CURRENTSCRATCHPAD.realvalue.length;
	Global.resetEnableToDefault();
	Global.hideWorkSpaceVisibility(hide_workspace);

	Teacher.showCalculating(true);			//To visually see if the code crashed somewhere along the way...

	if( ! ForceFlow.hasSelectedNodeChildren() || RECALCULATECURRENT){
		RECALCULATECURRENT = false;
		if(Global.Active && enable_auto_decode) {
			Timer.startN('Decode');
			if(checkAllDecodings(CURRENTSCRATCHPAD.realvalue)){
				ForceFlow.selectFurthestSingleChildNodePath();
				WorkSpaceManager.loadIfCached();
				window.setTimeout('start_update("DecodeWorked")', UPDATE_SETTIMEOUT);
				Timer.stopN('Decode',"Decode - all");
				Timer.incIteration();
				return;
			}
			Timer.stopN('Decode');
		}
	}

	classifyInputType(CURRENTSCRATCHPAD.realvalue);
	if(auto_optimize_disable_ciphers) optimizeRunCiphers();

	if(Global.Active && enable_auto_bruteforce) {
		Global.printEnabled();

		Timer.startN('AllFunctions');
		
		Keymaker_Start();
		
		FREQUENCY_upd();
		STATISTIC_upd();
		ASCII_HEATMAP_upd();
		
		MANIPULATE_upd();
		
		if(Global.Active && Global.Enable.Affine) 		Affine.upd();
		if(Global.Active && Global.Enable.Atbash)		Atbash.upd();
		if(Global.Active && Global.Enable.Baconian)		Baconian.upd();
		if(Global.Active && Global.Enable.Base64)		Base64.upd();
		if(Global.Active && Global.Enable.BaseX)		BaseX.upd();
		if(Global.Active && Global.Enable.Bifid)		Bifid.upd();
		if(Global.Active && Global.Enable.Caesar)		Caesar.upd();
		if(Global.Active && Global.Enable.Code39)		Code39.upd();
		if(Global.Active && Global.Enable.ColumnTransp)	ColumnarTransposition.upd();
		if(Global.Active && Global.Enable.Digraph)		Digraph.upd();
		if(Global.Active && Global.Enable.Ebcdic)		Ebcdic.upd();
		if(Global.Active && Global.Enable.Enigma)		EnigmaUpdate();
		if(Global.Active && Global.Enable.LetterNumbers)LetterNumbers.upd();
		if(Global.Active && Global.Enable.LSB)			LSB.upd();
		if(Global.Active && Global.Enable.Maze)			Maze.upd();
		if(Global.Active && Global.Enable.Morse)		Morse.upd();
		if(Global.Active && Global.Enable.Onetimepad)	Onetimepad.upd();
		if(Global.Active && Global.Enable.Playfair)		Playfair.upd();
		if(Global.Active && Global.Enable.Railfence)	Railfence.upd();
		if(Global.Active && Global.Enable.RomanNumerals)RomanNumerals.upd();
		if(Global.Active && Global.Enable.Rotate)		Rotate.upd();
		if(Global.Active && Global.Enable.Skip)			Skip.upd();
		if(Global.Active && Global.Enable.Substitute)	Substitute.upd();		//Will disable all of them
		if(Global.Active && Global.Enable.Transposition)Transposition.upd();
		if(Global.Active && Global.Enable.Vigenere)		Vigenere.upd();
		if(Global.Active && Global.Enable.WebApp)		WebApp.upd();
		if(Global.Active && Global.Enable.WeirdCrypto)	WeirdCrypto.upd();		//Maybe only interesting for CyberLympics. This functionality is also handled in AutoPWN
		if(Global.Active && Global.Enable.BaudotMurray)	BaudotMurray.upd();
		if(Global.Active && Global.Enable.XOR)			Xor.upd();
		if(Global.Active && Global.Enable.Dev)			Dev.upd();
		
		Timer.stopN('AllFunctions',"AllFunctions - all");
	} else {
		FREQUENCY_upd();
		MANIPULATE_upd();
		ASCII_HEATMAP_upd();
	}
	
	CHANGEDSCRATCHPAD = false;
	
	Teacher.updateHitBox();
	Teacher.updateHitValueBox();
	Teacher.playAnnoyingSound();
	
	Binary.populateBinaryField(CURRENTSCRATCHPAD.realvalue);
	S_FillReplaceChars(CURRENTSCRATCHPAD.realvalue);

	if (!IsUnchangedVar.text && Global.Active && auto_online_lookup)
		OnlineLookup.request(CURRENTSCRATCHPAD.realvalue);	//This will take 2, 7 or 58 seconds anyway
	else
		OnlineLookup.showRun();
	
	Teacher.showCalculating(false);			//To visually see if the code crashed somewhere along the way...
	WorkSpaceManager.save();

	if( ! ForceFlow.hasSelectedNodeChildren() || RECALCULATECURRENT) {
		RECALCULATECURRENT = false;
		if(Global.Active && min_auto_guess_certainty < 9000) {
			Timer.startN('MitigateFailures');
			if(mitigateFailures(CURRENTSCRATCHPAD.realvalue)) {
				ForceFlow.selectFurthestSingleChildNodePath();
				Timer.stopN('MitigateFailures',"MitigateFailures - any");
			} else {
				Timer.stopN('MitigateFailures');
			}
		}
	}

	Timer.incIteration();	//To keep track of the number of calculations and iterations
	
	//calcDecode2byteHex('222c203526111ea911c7254f131411d7263811d71378', true);

	//https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-8
	//https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-8

	/* Next release/session (prioritization):
	-6 Check if hex decode works for decimal: 3730363536653734363537333734
	-5 Create setting popup-page:
		- Dropdown to int return value instead of string
		- Caesar_bruteF_XL on regular String
		- Bruteforce Railfence also on offset (easy)
		- Bruteforce Skip also on bypass (easy)
		- + brute_force_dictionary_keys
		- + output_analysis_dictionary
		:!TwBTwB8B/i6MBwF6KF6?FB&!T?!BTwBF6?T=!FDFrB&TK!B8yyT6FsB:!FB!8w!ByiDBK!FB6FYKB?T=FDBTwB\FF"r\)rNN7r)FNjFNyF8cUc8NzUy87?B@B.8[F
	-4 Hide disabled ciphers
	-4 Disable button for ciphers
	-4 WebSphere doesn't work. It needs zlib(text, -10): hcvLCoJAGEDhZ_EB4p_UUVyazCjiqHnB0Y1MJWJ5RSuYp89lm4iz_DhQwd4oXl0rtm4aRQ8cKqP2UoukjonURM8wUkP7HCano6ozvHv55b7tabtHPs3DWHOp9ucuoTJ_OtEhA470Or2jmQXryKQVxZKsm4XQFjwwy6zc65ZLTw98ofN1wIUoDNIU1C8G43kTvbM6Nm0ldlsFQm8aGpgHLvnbVj6-q0z_
	-4 Change Analyze Guess.analyzeGuessAndGradeValue( to Guess.saveGuess(	 [line 817 Analyze.js]
	-4 Viewstate decoder doesn't always work it works in autoPWN but not on the page somehow
	-3 Do something more with periodic spaces
	-2 Re-check Skip hasAFactorMatch optimizations...
	-2 Addition cipher per nibble, byte
	-2 Input trailing file as next step
	-1 Standardize regexes using [[:alpha:]] en [[:print:]] control, xdigit, etc...
	 0 min_auto_guess_certainty to Global.min_auto_guess_certainty . Actually, every user variable needs that!
	 0 XOR_BF button with working refresh (Smart XOR 16+16 instead of 128)
	 0 Merge BaseConvertSimple and BaseConvert
	 0 Blink when hitbox is updated, restyle hitbox
	 0 Add LetterNumbers output validation, then add it (again) to autopwn
	 2 Extend Code 39(barcode) and add code93
	 2 T9 writing to text (difficult)
	 3 Add substitution algorithms (telephone symbols, telephone decimals) (easy)
	 6 FIX //DIMA:NASTY HACK to fix replace
	 7 Full offline (client mode, so get the code from quipqiup and playfair online bruteforcer)
	 7 Use WebWorkers: http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications
	 8 Double check Affine over special chars: TEST(51,34):""":!TwBTwB8B/i6MBwF6KF6?FB&!T?!BTwBF6?T=!FDFrB&TK!B8yyT6FsB:!FB!8w!ByiDBK!FB6FYKB?T=FDBTwB\FF"r\)rNN7r)FNjFNyF8cUc8NzUy87?B@B.8[F"""
	 */
	
	/*TODO:
	 - Compartmentalize all functions (cleanup code)
		- Create classed for all functions, every function should have a decode function and an input and output regex.
	 - Add LetterNumbers output validation, then add it to autopwn.
	 - Add Baconian to autopwn function, but Analyzation&scoring is needed before output is returned.
	 - Show output of auto-pwn functions (ASCII85, etc.). Maybe make multiple tabs to show the different outputs.
	 - Make XOR input for pad and repeat selectable (bin/hex/base64/str).
	 
	 - Use statistics to indicate if text is most likely scrambled or substituted, (Run quipqiup automatically under the right conditions (in mitigateFailures))
		- Add possibility matrix to dashboard of all ciphers (decode, substitution, scramble column)
	 - Mark an algorithm as false positive, or disable it
	 
	 - Add substitution algorithms (telephone symbols, telephone decimals) (easy)
	 - Bruteforce Railfence also on offset (easy)
	 - Bruteforce Skip also on bypass (easy)
	 - Bruteforce Affine also on B (not only on A) (easy)
	 - Add binary inverse reverse for base64. Now we use UTF8, which gives problems, we shouldn't use it. Lets use: to hex, then xor with 0xFF then back. (UTF8 works though under perfect circumstances).
	 - Add ADFG(V)X cipher (easy) [NEED: test input strings (ebctf2013: Google: adfgvx ebctf)] with bruteforce (hard)
	 - Add second cryptogram in addition to quipqiup lookup online (easy) (http://rumkin.com/tools/cipher/cryptogram-solver.php)
	 - Add advanced 1337-speak http://www.robertecker.com/hp/research/leet-converter.php?lang=en (easy)
	 - Add base 3-7 and 9-15 converter http://codebeautify.org/all-number-converter (medium)
	 - Add "view cipher" (show instead of only detection) where for instance a display is shown in line instead of in a block. (might turn out far too large)(idk)
	 - Add null cipher (medium)
	 
	 - Add Cryptogram cipher (Very very hard)
	 - Add Gronsfeld cipher (Very very hard)
	 - Add hex shift cipher (Done)- This is Caesar cipher now! Double check with CTF challenge earlier: I did it in HEX instead of using the characters:  30-7E wordt vervangen door 71-7E,30-70 -> perl -e '$_=<>;tr/\x30-\x7E/\x71-\x7E\x30-\x70/;print'|rev
	 - Add Transposition cipher with bruteforce on 1-5 keyspace http://tholman.com/other/transposition/ (hard)
	 - Check http://eindbazen.net/2013/10/ebctf-cry100-classic/
	 - Add ADFG(V)X (easy) http://www.cryptool-online.org/index.php?option=com_cto&view=tool&Itemid=149&lang=en  with bruteforce (very hard)
	 - Check urban-slang (easy)
	 
	 - Heartbeat function to see if javascript died somewhere along the way,
	 - Make answer guidelines (So we can detect intermediate steps. if for instance base64 gives a clean all lowercase output)
	 - binary function(not sure what I meant with this anymore), 
	 - Also save decryption method info in grades array i.e. [Skip1reverse]
	 - Increase output allowance for special chars from 4 gradually to 10ish in: /[\!\@\#\$\%\^\&\|\*\(\)\{\}\[\]\;\:\'\"\`\,\<\.\>\/\?\-\_\=\+\~\\\r\n ]{4,}/
	 
	 - input box to edit bruteforce ranges,
	 - Make Try Harder button which increases the base ranges to the medium ranges 26*26 (should be 1 minute calc),
	 - Make 'Its over 9000' button which increases the base ranges even more (>50, >50) (should be 5-10 minute calc),
	 - Make autocopy to clipboard to easy enter as a flag (saves most likely 0.9 seconds on average),
	*/
	
	/*BUGS:
	 - Hex: \x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x77\x70\x2F\x6C\x6F\x67\x6F\x2E\x6A\x70\x67\x22
	 - Alphabetical index doesn't take spaces into account: 6031803041203140 01004022 71407091413100 914042 ()
	 - Substitute (working on it)
	 - When string is shorter than 3 chars and is replaced, the original is deleted. Search for //DIMA:Bug-nosave
	 - 0101010100 (Crash, only on short binary-like input, irrelevant in real life challenges) BUT ALSO: 101 1 0111 110 11 1011 011 111 -> morse inverted and all: REBUILDS
	 - Crash in binary.js in replace : function(text, a, b)  (in Morse) when entering   ?$--.a?.3-%
	 */
	/*FLAWS:
	 - Rotate doesn't seem to work, but Columnar transposition seems to take over fully
	 - Skip doesn't seem to be accurate when missing a space or having one too many:R iraatps ihh zleeti  rogFw. zea aanyI gc tf ei oc ndriC empiwr hphioehivfrece )rhst "  rg iiae(ttnna sseli prssnoao asl emilcnetyac i loforldrneeeo fddmce 
	 - Multiple events are made for the same node change, click, paste (Low impact, Every time a node is created, very minor speed impact)
	 - 
	*/
	/*Mitigated (already fixed):
	 - Fix morse to not throw all kind of error msges: 10000 10100 00001 00100 10111 00111 00110 01110 01111 00100 11001 01010 11000 10011 01100 00100 01101 11000 11101 00100 01011 00111 11100 10110 00101 00100 11000 11110 00001 01010 00100 11011 10111 00001 00100 11111 10010 00011 10001 10101 00100 01001 11000 11010 00101 11011 11100
	 - Images are still broken if they contain \x0D\x0A. Javascript converts this. Solved by using realvalue.
	 - Files are sometimes/often bugged when not processed through javascript but passed though html (Search for //DIMA_FILE:). (Further research showed that keeping a binary value in the Scratchpad.value is not a good idea as some bytes will be shown as unreadable. The analyzeValueDoNotSaveGrade function is NOT helping here but making things worse.). TEST:06080779782040414041C14141414141BEBEBE60B84540414141416D414141414041404141434005417A
	 - Optimized by disabling: Optimize Bifid, Playfair and Vigenere. Test with (25064151 34620151 34620155 36220160 30272554 34661550 33672456 30667555 10047543 35060554 10064555 34066145 33262556 35060564 32267556 10072145 346720)
	 - No clue how solved: Crash at analyze in the decimal regex (line 197) when splitting this into groups of 2 (and creating a single trailing digit): 33866628088624768121923623700293786770087660903954986047088191333
	 - Internet explorer scroll down and up textarea bug (position:initial isn't accepted) - Mitigated by fixing the textfield
	 - Partly solved HANG at 84558207e20596f752063616e2073686966742062696e6172792064696769747320666f722061206e756d626572206f662074696d657320746f20637265617465206120636f6e667573696e67206368616c6c656e67654
	 		Error: Script terminated by timeout at: calcDecodeDecimal@file://SolveCryptoWithForce/js/cipher/baseX.js:553:5 BaseX.upd@file://SolveCryptoWithForce/js/cipher/baseX.js:110:137 start_update@file://SolveCryptoWithForce/js/MAIN.js:142:3 @file://SolveCryptoWithForce/js/MAIN.js:106:1
			if(/^([^0-9]{0,2}[0-9]{2,3}[^0-9]{0,1})+$/gi.test(text))
		Changed to if(/^([^0-9A-F]{0,2}[0-9]{2,3}[^0-9A-F]{0,1})+$/gi.test(text))
	 - Does this crash it? XXUCUXZGRKCJBTBNCGUIOTQGMZXHVEEVZRVJLDBNKMICBUZBSXOIURKGNYTUFOOOPZIPKAWUYWUTRFNMCWDGFALSXYVRKVNOGHIUKMQQHCKYYHWYWNBDNEPWPVJISVHBNZJKVYGDQNKAEXCSRFJDKZAMNIWKURWYAMNUCYI
	 - Digraph note is triggered too often. Check: BBAABABABBBAABBABBBABBBBBBBAAAAABBBBBBABBBBAAABBBBBAABAABBBABBABBBBABABABABBBBBABBBABAAABBBAABABBBBBBABBBBBBBABABBBBBAAABBBBABABBBBABBAABBBABABABBBAABABBBBAAABBBBBAABBABABBAAAABBBAAABABBBABAABBABABBBBBBBBBABBBBBBABAABBBABBBBBBBAABAABBBAABABBBBBBBBABBBBAABABBBBBAABBBBBBABBBABABBAABBBAAABBBBBBBABABABBAAAABBBAABAABBBABAAABABABBBBBBBBBBBBBABABBAABBBAAAAABBBAABBBBBBBABBBBBBAABAABBBBBAAABBBABBBABBBBAABABABABBAABBBAAABBBBBBBAAABBBBABABBBBBBBBBBBBBBABABBBBBABBBBBBABBBBBBAAABBBBBAAABABABABAAABBBAABAABBBAABABBBBBBABABBBBBABBBABBBBBABBBAAABBBBBBBAABBBBBBBAABBBAAAAABBBBBAAABBBABBBBBBBBBBAABABBBBBABBBBBAAABBBBBBBABBBBBBABBBBBABAB
	 		added Global.InputType == InputTypeEnum.HEX in if statement
	*/
	
	window.setTimeout('start_update(" ")', UPDATE_SETTIMEOUT);
}



window.setTimeout('start_update("FirstRun")', UPDATE_SETTIMEOUT);

eval("try { var a,b; function c(){return [1,2];} [a,b] = c(); } catch(e) {alert('Do you -really- want to use IE?')}");
