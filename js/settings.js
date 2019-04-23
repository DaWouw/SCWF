

var SettingsManager = {
	initialized : false,
	settings : [],
	settingsCol2: [],
	settingsR2L : [],
	settingsR2R : [],
	brute_preset : 'Normal',


	init : function()
	{
		if( !this.initialized )
		{
			this.initialized = true;
			SettingsManager.initSettings();
		}
	},

	print : function()
	{
		Timer.start();
		
		SettingsManager.init();
		
		var settingarrs = [[this.settings,''], [this.settingsCol2,''], [this.settingsR2L,''], [this.settingsR2R,'']];
		for(var j = 0; j < settingarrs.length; j++)
		{
			var allHTML = '<table>';
			var settings = settingarrs[j][0];
			for(var i = 0; i < settings.length; i++)
			{
				if(typeof settings[i] === 'object') {
					//alert(typeof this.settings[i]);
					switch(settings[i].type)
					{
						case 'bool': allHTML += SettingsManager.newToggleHTML(settings[i]); break;
						case 'multibool': allHTML += SettingsManager.newToggleMultiHTML(settings[i]); break;
						case 'path':
						case 'url': 
						case 'text': allHTML += SettingsManager.newTextHTML(settings[i]); break;
						case 'int': allHTML += SettingsManager.newIntHTML(settings[i]); break;
						case 'enum': allHTML += SettingsManager.newDropDownHTML(settings[i]); break;
						case 'textarea': allHTML += SettingsManager.newTextAreaHTML(settings[i]); break;
						default: console.info('SettingsManager.print unknown type.'); break;
					}
				} else if(typeof settings[i] === 'string') {
					allHTML += settings[i];
				} else {
					allHTML += SettingsManager.newLineHTML();
				}
			}
			if(j==0)
				allHTML += '<tr><td colspan=2><input onclick="resetAll(); return false;" value="Reset on-page cipher specific settings" type="button"></td></tr>';
			allHTML += '</table>';
			settingarrs[j][1] = allHTML;
		}

		
		$('#allSettingsTBody').empty().append(settingarrs[0][1]);
		$('#allSettingsCol2TBody').empty().append(settingarrs[1][1]);
		//$('#allDictionaryKeysTBody').empty().append(settingarrs[2][1]);
		//$('#allOutputSpecialWordsTBody').empty().append(settingarrs[3][1]);

		$('#allGlobSettingsTBody').empty().append(Global.printEnabledSettingsHTML());
		Timer.stop("GUI - DrawAllSettings");
	},
	newLineHTML : function() {
		return '<tr><td colspan=2>&nbsp;</td></tr>';
	},

	newToggle : function(setting)
	{
		return '<label class="switch"><input type="checkbox"'+(eval(setting.variablename)?' checked':'')+' onchange="'+setting.variablename+'=this.checked;"><div class="slider round"></div></label>';
	},
	newToggleHTML : function(setting)
	{
		var t = setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name;
		return '<tr><td>'+t+': </td><td>'+SettingsManager.newToggle(setting)+'</td></tr>';
	},
	newToggleMulti : function(setting)
	{
		var onchange = '', pre = '', vars = '';
		//new MultiSetting('Switch_decode','multibool',[['Global.DefaultEnable.',[]],['Global.',['Switch_substitute']]],'Enable 1:1 Substitute Ciphers',''),

		//[['Global.DefaultEnable.',['1','2']],['Global.',['Switch_substitute']]]
		for(var i = 0; i < setting.valueArray.length; i++)	
		{
			//['Global.DefaultEnable.',['1','2']]
			pre = setting.valueArray[i][0];
			//vars = '';
			for(var j = 0; j < setting.valueArray[i][1].length; j++)	//['1','2']
			{
				onchange += pre+setting.valueArray[i][1][j]+'=';
			}
		}
		return '<label class="switch"><input type="checkbox"'+(eval(setting.variablename)?' checked':'')+' onchange="'+setting.variablename+'='+onchange+' this.checked;SettingsManager.print();"><div class="slider round"></div></label>';
	},
	newToggleMultiHTML : function(setting)
	{
		var t = setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name;
		return '<tr><td>'+t+': </td><td>'+SettingsManager.newToggleMulti(setting)+'</td></tr>';
	},
	newInt : function(setting)
	{
		return '<input type="text" value="'+eval(setting.variablename)+'" onchange="if(parseInt(this.value).between('+setting.min+','+setting.max+')){'+setting.variablename+'=this.value;} else {alert(\'ERROR: Not between '+setting.min+' and '+setting.max+'. Value not saved.\');} " size=4>';
	},
	newIntHTML : function(setting)
	{
		var t = setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name;
		return '<tr><td>'+t+': </td><td>'+SettingsManager.newInt(setting)+'</td></tr>';
	},
	newDropDown : function(setting)
	{
		var ret = '<select class="blueSelectDropdown" onchange="SettingsManager.setDropDownVariable(\''+setting.variablename+'\', this);">';
		for (var i = 0; i < setting.valueArray.length; i++) {
			var arr = setting.valueArray[i];
			ret += '<option value="'+arr[1]+'"'+(eval(setting.variablename)==arr[0]?' selected':'')+'>'+arr[0]+"\r\n";
		}
		return ret += '</select>';
	},
	newDropDownHTML : function(setting)
	{
		var t = setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name;
		return '<tr><td>'+t+': </td><td>'+SettingsManager.newDropDown(setting)+'</td></tr>';
	},
	newText : function(setting)
	{
		return '<input type="text" value="'+eval(setting.variablename)+'" onchange="'+setting.variablename+'=this.value;">';
	},
	newTextHTML : function(setting)
	{
		var t = setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name;
		return '<tr><td>'+t+': </td><td>'+SettingsManager.newText(setting)+'</td></tr>';
	},
	newTextArea : function(setting)
	{
		var opt = setting.optionArray;
		//onchange="'+setting.variablename+'=this.value;" 
		return '<textarea rows="'+opt[0]+'" cols="'+opt[1]+'" readonly>'+eval(setting.variablename+opt[2])+'</textarea>';
	},
	newTextAreaHTML : function(setting)
	{
		var t = (setting.description.length?'<abbr title="'+setting.description+'">'+setting.name+'</abbr>':setting.name)+'<br>';
		return '<tr><td colspan=2>'+t+SettingsManager.newTextArea(setting)+'</td></tr>';
	},
	initSettings : function()
	{
		this.settings.push(
			new Setting('hide_workspace','bool','Hide workspace','To hide workspace HTML elements to speed up calculation of large inputs by preventing redraws'),
			new Setting('annoying_audio','bool','Annoying audio','You like Mario, right?'),
			//new Setting('audio_path','path','Audio path','Coin sound'),
			new Setting('sidebar_default_display','bool','Display sidebar','Hide sidebar with links to ciphers'),
			new Setting('explanation_default_display','bool','Show hints','Hide explanatory text'),
			false,
			new Setting('force_fully_offline','bool','Force fully offline','Never ever preform an online lookup. Can be used in case of client assignments. Overrides other online lookup settings.'),
			new Setting('auto_online_lookup','bool','Always online lookup','Auto execute quipqiup, playfair and vigenere after each change in text, it\'s overkill for easy crypto but maybe useful for hard ones'),
			new Setting('lookup_proxy_host','url','Online lookup host','URL starting with http(s)?://'),
			false,
			new RangeSetting('min_encoded_string_length','int',3,50,'Min length to start decode','When a too short value is entered it will decrease accuracy for short challenges'),
			new RangeSetting('max_regular_string_length','int',1,9999,'Min length for file','If very long input is given, we can disable certain ciphers to speed up the process'),
			new Setting('auto_optimize_disable_ciphers','bool','Auto optimize ciphers','Disable certain ciphers when conditions are met. I.e. disable Viginere and Enigma when hex is detected since these ciphers work on strings.'),			
			//new Setting('enable_auto_decode','bool','Enable quick decode','Disabling this will disable autoPwning encodings. It won\'t really help speed wise.'),
			//new Setting('enable_auto_bruteforce','bool','Enable bruteforce','Disabling this will disable a great deal of the functionality, but also increase performance drastically'),
			new Setting('enable_reverse_output','bool','Enable reverse','Also try to grade the reverse output of every decryption. Disabling this won\'t really help speed wise but it will make output easier to read.'),
			new Setting('enable_workspace_cache','bool','Enable workspace caching','Will cache earlier calculated results. If WorkSpaces are broken/slow, please disable.'),
			new Setting('enable_strings_on_self','bool','Enable Strings on input','Will perform strings on itself. Bad for baconian. Good for CyberLympics??'),
			new Setting('brute_force_on_dictionary_keys','bool','Brute force on passwords','Disabling this will disable password guessing for decodings. It will speed up decription sometimes by a lot.')
			//new Setting('enable_reverse_output','bool','AA',''),
			
		);

		this.settingsCol2.push(
			'<tr><td colspan=2><b>Enable Cipher Groups</b></td></tr>',
			//new MultiSetting('Global.Switch_support','multibool',[['Global.DefaultEnable.',['Ascii_heatmap','Friedman_analysis']]/*,['Global.',['Switch_support']]*/],'Enable Support Analysis',''),
			new MultiSetting('Global.Switch_shuffle','multibool',[['Global.DefaultEnable.',['ColumnTransp','ColumnTransp_BF','ColumnTransp_BF_PW','ColumnTransp_PERM','Maze','Railfence','Railfence_BF','Rotate','Rotate_BF','Skip','Skip_BF','Switch','Transposition']]/*,['Global.',['Switch_shuffle']]*/],'Enable Shuffle Ciphers',''),
			new MultiSetting('Global.Switch_substitute','multibool',[['Global.DefaultEnable.',['Affine','Affine_BF','Affine_spec_BF','Atbash','Bifid','Bifid_BF','Caesar','Caesar_smart','Caesar_BF_XL','Colemak','Dvorak','Enigma','Goldenbug','Hex','Keyboardshift','L337Speak','Onetimepad','Playfair','Playfair_BF','SpiritDVD','Shift','Substitute','Vigenere','Vigenere_BF','XOR','XOR_Small','XOR_BF_PW','XOR_BF_XL']]/*,['Global.',['Switch_substitute']]*/],'Enable 1:1 Substitute Ciphers',''),
			new MultiSetting('Global.Switch_decode','multibool',[['Global.DefaultEnable.',['Baconian','Baconian_BF','Base64','BaseX','BaudotMurray','Code39','Digraph','Ebcdic','LetterNumbers','LSB','Morse','RomanNumerals','WebApp','WeirdCrypto']]/*,['Global.',['Switch_decode']]*/],'Enable n:m Substitute (Decode)',''),
			false,
			'<tr><td colspan=2><b>Brute Force settings</b></td></tr>',
			new DropDownSetting('SettingsManager.brute_preset','enum',[
					['Wimpy',		[ 0, 5,  5,  5, 0, 5, 5]],
					['Normal',		[ 0, 11, 11,11, 0,10,11]],
					['Trying...',	[ 5, 26, 26,15, 4,15,15]],
					['Try Harder!',	[26, 50, 50,26, 5,15,15]],
					['Over 9000!!!',[94,128,128,64, 7,15,26]] ],'Brute force preset',''),
			new RangeSetting('affine_B_bruteF_range','int',0,94,'Affine on B range 0..94',''),
			new RangeSetting('rotate_bruteF_range','int',2,128,'Rotate Brute force range',''),
			new RangeSetting('railfence_bruteF_range','int',2,128,'Railfence Brute range',''),
			new RangeSetting('coltrans_bruteF_range','int',2,64,'Column transpos. Brute range',''),
			new RangeSetting('coltrans_bruteF_permutations','int',0,10,'Col.trans. Permute. Faculty!','This number indicates the permutations computed for columnar transposition. It is faculty based (Ex. 6!=720) and blows up quickly (especially over 7)'),
			new Setting('coltrans_bruteF_lower_permutations','bool','Col.trans. Brute Lower Perm','Also calculate permutations on 3, 4 and 5 when 6 is the max permutation length?'),
			new RangeSetting('keyboardshift_bruteF_range','int',1,15,'Keyboard shift Brute range',''),
			new RangeSetting('skip_bruteF_range','int',1,50,'Skip Brute force range','')
		);
		this.settingsR2L.push(
			new TextAreaSetting('brute_force_dictionary_keys','textarea',[5,100,'.join(\'\\r\\n\').replace(/\\\\\\\\/g,\'\\\\\')'],'All possible passwords to try.','')
		);
		this.settingsR2R.push(
			new TextAreaSetting('output_analysis_dictionary','textarea',[5,100,'.join(\'\\r\\n\').replace(/\\\\\\\\/g,\'\\\\\')'],'Possible custom keywords to trigger on (6points). Regex - double escaped.','')
		);
	},
	setDropDownVariable : function(name, elem)
	{
		var valueArray = elem.value.split(',');
		switch(name)
		{
			case 'SettingsManager.brute_preset':
				//Change into eval(name+'=elem[elem.selectedIndex].label');
				this.brute_preset = elem[elem.selectedIndex].label;

				affine_B_bruteF_range = valueArray[0];
				rotate_bruteF_range = valueArray[1];
				railfence_bruteF_range = valueArray[2];
				coltrans_bruteF_range = valueArray[3];
				coltrans_bruteF_permutations = valueArray[4];
				keyboardshift_bruteF_range = valueArray[5];
				skip_bruteF_range = valueArray[6];
				SettingsManager.print();
				break;
			default: break;
		}
		return true;
	},
};

$(document).ready(function(){

	// https://www.w3schools.com/howto/howto_css_modals.asp

	// Get the modal
	var modal = document.getElementById('mySettings');

	// Get the button that opens the modal
	var btn = document.getElementById("openSettingsBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("closeSettings")[0];

	// When the user clicks the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	    SettingsManager.print();
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
});


function resetAll()
{
	document.encoder.encdec.value = '-1';

	document.encoder.a.value = 1;
	document.encoder.b.value = 0;
	document.encoder.rem_jv.value = 0;

	document.encoder.xor_b.value = '';
	document.encoder.xor_c.value = '';
	document.encoder.xor_d.value = '';
	document.encoder.xor_text_string.checked = true;
	document.encoder.xor_b_string.checked = true;
	document.encoder.xor_c_string.checked = true;
	document.encoder.xor_d_string.checked = true;
	document.encoder.BIFID_skip.value = 'J';
	document.encoder.BIFID_key.value = '';
	document.encoder.BIFID_skipto.value = 'I';
	document.encoder.colkey.value = '';
	document.encoder.colkey_type.value = 'num';
	document.encoder.use_as_column_order.checked = false;
	document.encoder.LETTERNUMBERS_method.value = 'p0h1';

	document.encoder.ONETIMEPAD_pad.value = '';
	document.encoder.PLAYFAIR_skip.value = 'J';
	document.encoder.PLAYFAIR_skipto.value = 'I';
	document.encoder.PLAYFAIR_doubleencode.checked = true;
	document.encoder.PLAYFAIR_key.value = '';
	document.encoder.RAILFENCE_rails.value = 3;
	document.encoder.RAILFENCE_offset.value = 0;
	document.encoder.ROTATE_col.value = 1;
	document.encoder.SKIP_skip.value = 1;
	document.encoder.SKIP_startat.value = 0;
	document.encoder.SUBSTITUTE_key.value = '';
	
	//CHANGEDSCRATCHPAD = true;
};

