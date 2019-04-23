
var InputTypeEnum = {
	UNKNOWN:		-2,
	TOOSHORT:		-1,
	UNINITIALIZED:	0,
	BINARY:			1,
	NUMBERS:		2,
	HEX:			3,
	IP:				4,
	ALPHA:			5,
	ALPHANUMERIC: 	6,
	ALPHASPEC: 		7,
	NUMERICSPEC: 	8,
	ALPHANUMERICSPEC:9,
	NOTPRINTABLE:	10,
	FILE:			11,
	EXTENDEDASCII: 	12,
	
};

var Global = {
	Active :			true,	//Setting this to false will stop all calculations.

	InputType : 		InputTypeEnum.UNINITIALIZED,
	InputLength : 		-1,

	Switch_support :	true,
	Switch_shuffle :	true,
	Switch_substitute :	true,
	Switch_decode :		true,

	Enable :			null,
	DefaultEnable : {
		Ascii_heatmap:	true,
		Affine:			true,
		Affine_BF:		true,
		Affine_spec_BF:	false,
		Atbash:			true,
		Baconian:		true,
		Baconian_BF:	true,
		Base64:			true,
		BaseX:			true,
		BaudotMurray:	true,
		Bifid:			true,
		Bifid_BF:		true,
		Caesar:			true,
		Caesar_smart:	false,
		Caesar_BF_XL:	true,
		Code39:			true,
		Colemak:		true,
		ColumnTransp:	true,
		ColumnTransp_BF:true,
		ColumnTransp_BF_PW:true,
		ColumnTransp_PERM:false,
		Digraph:		true,
		Dvorak:			true,
		Ebcdic:			true,
		Enigma:			true,
		Friedman_analysis:true,
		Goldenbug:		true,
		Hex:			true,
		Keyboardshift:	true,
		L337Speak:		true,
		LetterNumbers:	true,
		LSB:			true,
		Maze:			true,
		Morse:			true,
		Onetimepad:		true,
		Playfair:		true,
		Playfair_BF:	true,
		Railfence:		true,
		Railfence_BF:	true,
		Rotate:			true,
		Rotate_BF:		true,
		RomanNumerals:	true,
		Shift:			true,
		Skip:			true,
		Skip_BF:		true,
		SpiritDVD:		true,
		Substitute:		true,
		Switch:			true,
		Transposition:	true,
		Vigenere:		true,
		Vigenere_BF:	true,
		WebApp:			true,
		WeirdCrypto:	false,		//This functionality is also handled in AutoPWN
		XOR:			true,
		XOR_Small:		true,
		//XOR_Smart:		true,
		XOR_BF_PW:		true,
		XOR_BF_XL:		true,

		Dev:			false,
	},
	log : function(text)
	{
		console.info("Step "+Timer.iteration+" - "+text);
	},
	warn : function(text)
	{
		console.warn("Step "+Timer.iteration+" - "+text);
	},
	printEnabled : function()
	{
		var loglineEnabled 	= "enabled: \r\n";
		var loglineDisabled = "disabled: \r\n";
		for (var key in this.Enable) {
			if(this.Enable[key])
				loglineEnabled	+= key+', ';
			else
				loglineDisabled += key+', ';
		}
		this.log(loglineEnabled);
		this.log(loglineDisabled);
	},
	printEnabledSettings : function()
	{
		var allHTML = ['','','','','','',''];	//more than enough potential rows
		var i = 0;
		var groupMaxSize = 20;
		for (var key in this.Enable) {
			allHTML[Math.floor(i/groupMaxSize)] += SettingsManager.newToggleHTML(new Setting('Global.DefaultEnable.'+key,'bool',key,''));
			i++;
		}
		return allHTML;
	},
	printEnabledSettingsHTML : function()
	{
		var allHTML = '<tr>';
		var settingsrow = Global.printEnabledSettings();
		for (var i = 0; i < settingsrow.length && settingsrow[i].length; i++) {
			allHTML += '<td><table>'+settingsrow[i]+'</table></td>';
		}
		allHTML += '</tr>';
		return allHTML;
	},

	toggleAutoDecode : function (element) {
		$(element).toggleClass("manualGuessButton");
		var text = $(element).text();
		$(element).text(text == "Decode on" ? "Decode off" : "Decode on");
		enable_auto_decode = !enable_auto_decode;
	},
	toggleAutoBruteForce : function (element) {
		$(element).toggleClass("manualGuessButton");
		var text = $(element).text();
		$(element).text(text == "BruteForce on" ? "BruteForce off" : "BruteForce on");
		enable_auto_bruteforce = !enable_auto_bruteforce;
	},
	setAutoGuessSensitivity : function (element) {
		min_auto_guess_certainty=element.value;
		element.className=element.value>9000?'blueSelectDropdown manualSelectDropdown':'blueSelectDropdown';
	},

	hideWorkSpaceVisibility : function (hide) {
		if(hide)
			$('#WORKSPACE').hide();
		else
			$('#WORKSPACE').show();
	},

	resetEnableToDefault : function ()
	{
		this.Enable = $.extend({}, this.DefaultEnable);
	},

	start : function ()
	{
		this.Active = true;
		this.log('Started computation.');
	},
	stop : function ()
	{
		this.Active = false;
		this.log('Stopped and aborted computation.');
	},
};


Global.resetEnableToDefault();

if(lookup_proxy_host.length<10)lookup_proxy_host=window.atob('aHR0cHM6Ly9zY3dmLmRpbWEubmluamEvU2VydmVyU2lkZVBIUC8=');	//Well, at least default to something

$(document).ready(function(){
	$('a#ENABLE_AUTO_DECODE').click(function(){Global.toggleAutoDecode(this)});

	$('a#ENABLE_AUTO_BRUTEFORCE').click(function(){Global.toggleAutoBruteForce(this)});
});



/*(function() {
    var exLog = console.info;
    console.ninfo = function(msg) {
        exLog.apply(this, arguments);
        alert(msg);
    }
})();*/

