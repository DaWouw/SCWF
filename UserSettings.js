/* Users can edit their settings. */

//To disable specific algorithms, go to js/Global.js and change the corresponding boolean

//Regex for matching files. For speed reasons start every signature with a ^
var REGEX_FILE_TYPES = /(^\x89PNG|^\xff\xd8\xff\xe0|^7z\xbc\xaf\x27\x1c|^PK\x03\x04|^GIF87a|^GIF89a|^%PDF)/i;	//PNG, JPG, 7z, ZIP, GIF, GIF, PDF	//https://en.wikipedia.org/wiki/List_of_file_signatures
var REGEX_FLAG_DETECTION = /^(((ebctf|ctf|flag|t0k3n|token)(\(|\{)[^\)\}]{5,50}(\)|\}))|((\(|\{)[^\)\}]{5,50}(\)|\})(ftcbe|ftc|galf|n3k0t|nekot)))$/gi;					// /^("ctf|flag|t0k3n)(\(|\{)[^\)\}]+(\)|\})$/i;

//Passwords used in Vigenere, Playfair, columnar transposition, XOR(repeat), Bifid
var brute_force_on_dictionary_keys = true;				//value in [true|false] (boolean) //Default true	//Disabling this will disable password guessing for decodings. It will speed up decription sometimes by a lot.
var brute_force_dictionary_keys = [
	'password','secret','pass','test','code','key',		//Maybe add: 'cargo','attackatonce','attackatdawn','Kryptos',
	//More words can be defined in PASSWORDS.js
];

//Trigger on special words (worth 5 points) which are longer than 4 characters. They are checked in order. Apparently needed to tripple escape.
var output_analysis_dictionary = [
	"ebctf","ctf\\\\{","ctf\\\\(","flag\\\\{","flag\\\\(","9447\\\\{","IW\\\\{","pCTF\\\\{","hacker","hackazon","hack","encoding","encoded","encode","decoding","decoded","decode","encrypted","encrypt","decrypted","decrypt",
	"cryptogram","crypto","crypt","graphy","cypher","decipher","cipher","convert","Kryptos","Krypto","CAFEBABE","BAADF00D","DEADBEAF","plaintext","congratulations","solution","solved","solving","hidden","command","prompt","i[pf]config","alphabet","english","translate","what is","coconut",
	"cyber","security","secure","secret","passw0rd","password","keyword","keyspace","submit","administrator","admin","random","backdoor","congrat","success","capture","internet","helloworld","unique","advance","significan(t|ce)","recogniz","setting","implementation","implement","digital","initialize","rebuild","anonymous","pirate","Windows","Linux",
	"shadow","forces","virtual","invisible","interpret","lucideee","digetaleee",			//Morse from Kryptos sculpture
	"cyberlympics","lympics","Gam3z","Warl[o0]ck","WGZLiveLabs","WGZLive","LiveLab","t0k3n","t [o0] k [e3] n","y[o0]u s[e3]{2}k","s[e3]{2}k is","y[o0]us[e3]{2}k","\\\\.live\\\\.labs","FSociety",
	"tang0livelabs", "tang0\\\\.live\\\\.labs",'tang0','n1tr0n','megan','Targ3t','Mark83a',	//CL2015 pre round 1
	'GGoCySEA','GGoC','morpheus','DarkLord','illuminati','wgcode','(^|[^a-z0-9])wg[0-9a-z]{10}([^a-z0-9]|$)',			//CL2016 pre round 1
	"affine","atbash","baconian","base64","binary","Caesar","Ceasar","Code39","barcode","enigma","Gronsfeld","Playfair","ROT13","substitution","Vigenere","Zigzag",	//List of some crypto schemes (only 6 chars or longer)
	"C:\\\\\\\\","C:/","https?://","ftps?://","git://","bit\\\\.ly","dropbox","google","github","tinyurl","(([0-2][0-9]{2}|[0-9]{1,2})\\\\.){3}([0-2][0-9]{2}|[0-9]{1,2})(\\\\:[0-9]{2,5})?","\\\\.com","\\\\.net","\\\\.org","\\\\.nl/","\\\\.asp","\\\\.php","\\\\.png","\\\\.jpg","\\\\.apk","\\\\.exe","\\\\.bat","\\\\.vbs",
	"SHA-?(1|256|384|512)",//"MD5",
	//[ctf, flag, pair, ascii, token, hello, crack, error, switch] -> are moved to a low points category (3p or 1p) since their length is too short, coincidence factor is too large
];


//
//All remaining settings can also be changed by the "Settings" button on the top-right.
//

var hide_workspace = false;								//value in [true|false] (boolean) //Default false	//To hide workspace HTML elements to speed up calculation of large inputs by preventing redraws
var annoying_audio = true;								//value in [true|false] (boolean) //Default true	//You like Mario, right?
var audio_path = 'media/Mario_Coin.mp3';				//value in String (path)		  //Default 'media/Mario_Coin.mp3'
var sidebar_default_display = false;					//value in [true|false] (boolean) //Default false	//Hide sidebar with links to ciphers
var explanation_default_display = true;					//value in [true|false] (boolean) //Default true	//Hide explanatory text

//lookup_proxy_host can later be used to host our own quipqiup and playfair server to go fully offline
var force_fully_offline = false;						//value in [true|false] (boolean) //Default false	//Never ever preform an online lookup. Can be used in case of client assignments. Overrides other online lookup settings. //Default false
var auto_online_lookup = false;							//value in [true|false] (boolean) //Default false	//Auto execute quipqiup, playfair and vigenere after each change in text, it's overkill for easy crypto but maybe useful for hard ones 
var lookup_proxy_host = 'https://';						//value (URL starting with http(s)?:// ) (string)	//Default 'https://<your-url>/ServerSidePHP/'


var min_encoded_string_length = 10;						//value in [3..x] (integer) //Default 10			//When a too short value is entered it will decrease accuracy for short challenges
var max_regular_string_length = 1024;					//value in [1..x] (integer) //Default 1024			//If very long input is given, we can disable certain ciphers to speed up the process
var auto_optimize_disable_ciphers = true;				//value in [true|false] (boolean) //Default true	//Disable certain ciphers when conditions are met. I.e. disable Viginere and Enigma when hex is detected since these ciphers work on strings.
var enable_auto_decode = true;							//value in [true|false] (boolean) //Default true	//Disabling this will disable autoPwning encodings. It won't really help speed wise.
var enable_auto_bruteforce = true;						//value in [true|false] (boolean) //Default true	//Disabling this will disable a great deal of the functionality, but also increase performance drastically
var min_auto_guess_certainty = 2;						//value in [0..5] (Enum-int, see Guess.js) //Default 2 = CertaintyEnum.WILDGUESS. 9001 = off //Decreasing this will result in whacky stuff, for instance when decrypting playfair/digraps
var enable_reverse_output = true;						//value in [true|false] (boolean) //Default true	//Also try to grade the reverse output of every decryption. Disabling this won't really help speed wise but it will make output easier to read.
var enable_workspace_cache = false;						//value in [true|false] (boolean) //Default false	//Will cache earlier calculated results. If WorkSpaces are broken/slow, please disable.
var enable_strings_on_self = false;						//value in [true|false] (boolean) //Default false	//Will perform strings on itself. Bad for baconian. Good for CyberLympics??

var affine_B_bruteF_range = 0;							//value in (integer): [0..25] (for letters only) or [0..94] (for hex) //Default 0
var rotate_bruteF_range = 11;							//value in [2..x] (integer) //Default 11
var railfence_bruteF_range = 11;						//value in [2..x] (integer) //Default 11
var coltrans_bruteF_range = 11;							//value in [2..x] (integer) //Default 11
var coltrans_bruteF_permutations = 0;					//value in [0..10ish] (integer) //Default 0			//Will blow up to x! (faculty)!!
var coltrans_bruteF_lower_permutations = true;			//value in [true|false] (boolean) //Default false 
var keyboardshift_bruteF_range = 10;					//value in [1..x] (integer) //Default 10
var skip_bruteF_range = 11;								//value in [1..x] (integer) //Default 11
