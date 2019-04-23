
var Digraph = {
	
	upd : function()
	{
		if (IsUnchangedVar.text)
		{
			//window.setTimeout('DIGRAPH.upd()', 100);
			return;
		}
		
		var elem = document.getElementById('DIGRAPH_output');

		/*if (CURRENTSCRATCHPAD.realvalue != "" && (/^(([a-z][a-z])+( )?)+$/g.test(CURRENTSCRATCHPAD.realvalue) || /^(([A-Z][A-Z])+( )?)+$/g.test(CURRENTSCRATCHPAD.realvalue)) )
		{
			elem.innerHTML = Teacher.analyzeValue(Digraph.calc(CURRENTSCRATCHPAD.realvalue, true), "digraph()");
		}
		else
		{*/
			elem.innerHTML = "<i>Press the button to try digraph decoding</i>";//"<i>Type in your message and see the results here!</i>";
		//}
		
		//window.setTimeout('DIGRAPH.upd()', 100);
	},
	
	performQuipqiup : function() {
		OnlineLookup.requestQuipqiup(CURRENTSCRATCHPAD.realvalue);
	},
	button : function()
	{
		var elem = document.getElementById('DIGRAPH_output');
		if (CURRENTSCRATCHPAD.realvalue != "" && (/^(([a-z][a-z])+( )?)+$/g.test(CURRENTSCRATCHPAD.realvalue) || /^(([A-Z][A-Z])+( )?)+$/g.test(CURRENTSCRATCHPAD.realvalue) || /^(([0-9a-f][0-9a-f])+( )?)+$/gi.test(CURRENTSCRATCHPAD.realvalue)) )
		{
			Timer.start();
			var digraph_output = Digraph.calc(CURRENTSCRATCHPAD.realvalue, true);//SwapSpaces(HTMLEscape(
			alert(digraph_output);
			if(digraph_output) {
				elem.innerHTML = digraph_output;
				ForceFlow.addSteps([Teacher.analyzeValueDoNotSaveGrade(digraph_output, 'digraph_first_replace()')]);
				ForceFlow.selectFurthestSingleChildNodePath();
				window.setTimeout('Digraph.performQuipqiup()', 500);
			} else {
				elem.innerHTML = "<i>Does not comply to format (error during calc)</i>";
			}
			Timer.stop("Digraph - Single");
		}
		else
		{
			elem.innerHTML = "<i>Does not comply to format</i>";
		}
	},

	calc : function(input, trustspaces)
	{
		//if(!/^(([a-z][a-z])+( )?)+$/g.test(input) && !/^(([A-Z][A-Z])+( )?)+$/g.test(input) && !/^(([0-9a-f][0-9a-f])+( )?)+$/gi.test(input))
		//	return false;
		
		var hexmode = /^(([0-9a-f][0-9a-f])+( )?)+$/gi.test(input);


		//TODO:
		//EVpncqcqxokupn: XMfncqaj xocq ajnrpn ufpnsxpnateikbevpnxraj eivi ufqrkuqrajxoat tieievkbfnajpniecq xoxruf pnatpntiajieeixrqrticq nrpnatkbpnuf qrxr tiiegmkbajxoxrxoatgmcqqrcq, qraj evxoufpn kbeicqcqqrgvatpn evfntinr eveiiepn tieievkbatpnzq tiqrkbnrpniecq. VIfnieajnrpnieeveiiepn, tieievkbfnajpniecq xoatateiqzpnuf vieiie ajnrpn pnxrtiiegmkbajqreixr eivi xoxrgm rjqrxruf eivi ufxoajxo iepnkbiepncqpnxrajxogvatpn qrxr xoxrgm gvqrxrxoiegm vieiieevxoaj, fnxratqrrjpn tiatxocqcqqrtixoat tiqrkbnrpniecq qznrqrtinr eixratgm pnxrtiiegmkbajpnuf qzieqrajajpnxr atxoxrkufnxokupn ajpnzqajcq; ajnrqrcq qzxocq xrpnqz xoxruf cqqrkuxrqrviqrtixoxraj. TIeievkbfnajpnie fncqpn nrxocq ajnrfncq cqfnkbkbatxoxrajpnuf atqrxrkufnqrcqajqrti tiiegmkbajeikuiexokbnrgm, gveiajnr vieiie tiqrkbnrpnie ufpncqqrkuxr xoxruf tiiegmkbajxoxrxoatgmcqqrcq. EVxoxrgm tieievkbfnajpnie tiqrkbnrpniecq tixoxr gvpn tinrxoiexotiajpnieqrezpnuf gvgm ajnrpnqrie eikbpniexoajqreixr eixr gvqrxrxoiegm gvqraj cqpnlofnpnxrtipncq (cqeievpnajqrevpncq qrxr kuieeifnkbcq eiie gvateitirjcq), fnxratqrrjpn tiatxocqcqqrtixoat xoxruf evpntinrxoxrqrtixoat cqtinrpnevpncq, qznrqrtinr kupnxrpniexoatatgm evxoxrqrkbfnatxoajpn ajiexoufqrajqreixrxoat tinrxoiexotiajpniecq (qr.pn., atpnajajpniecq xoxruf ufqrkuqrajcq) ufqriepntiajatgm. NReiqzpnsxpnie, tieievkbfnajpniecq nrxosxpn xoatcqei xocqcqqrcqajpnuf tiiegmkbajxoxrxoatgmcqqrcq, qznrqrtinr nrxocq tieievkbpnxrcqxoajpnuf ajei cqeievpn pnzqajpnxraj vieiie qrxrtiiepnxocqpnuf tiqrkbnrpnie tieievkbatpnzqqrajgm. XReixrpnajnrpnatpncqcq, kueieiuf eveiufpniexr tiqrkbnrpniecq nrxosxpn cqajxogmpnuf xonrpnxouf eivi tiiegmkbajxoxrxoatgmcqqrcq; qraj qrcq ajgmkbqrtixoatatgm ajnrpn tixocqpn ajnrxoaj fncqpn eivi xo lofnxoatqrajgm tiqrkbnrpnie qrcq sxpniegm pnviviqrtiqrpnxraj (qr.pn., vixocqaj xoxruf iepnlofnqrieqrxrku vipnqz iepncqeifnietipncq, cqfntinr xocq evpneveiiegm eiie TIKBFN tixokbxogvqratqrajgm), qznrqratpn gviepnxorjqrxrku qraj iepnlofnqriepncq xoxr pnvivieiieaj evxoxrgm eiieufpniecq eivi evxokuxrqrajfnufpn atxoiekupnie, xoxruf sxxocqajatgm atxoiekupnie ajnrxoxr ajnrxoaj iepnlofnqriepnuf vieiie xoxrgm tiatxocqcqqrtixoat tiqrkbnrpnie, evxorjqrxrku tiiegmkbajxoxrxoatgmcqqrcq cqei qrxrpnviviqrtiqrpnxraj xoxruf qrevkbiexotiajqrtixoat xocq ajei gvpn pnvivipntiajqrsxpnatgm qrevkbeicqcqqrgvatpn.
		//VIatxoku: TIAJVI{ajnrqrcq_evxorjpncq_qraj_xo_gvqraj_nrxoieufpnie}
		//

		
		//var input = "drjlfmsjizvsgajzayvsganxjlfmiymu uojljz xppahmizzjtigapaxp gakhnxiy mwpaiyiyvssjpa iyjzhmhmpaiyiyeyjzayayzjmu vhvsiy fmjlga gajljl xpnxeyeynxhmjzayga panxgakhpaizrf smvsiy nxgawv vhpaayayrf sjjljlxp iujlqgmu ptfmgapaiz gakhnxiy uhpazjsmjlizxp vsiy iyjlayjzganxjlfmjx nxiykhpafmtiiyfmtijliyvsmu";
		//var input = "drjlfmsjizvsgajzayvsganxjlfmiymuuojljzxppahmizzjtigapaxpgakhnxiymwpaiyiyvssjpaiyjzhmhmpaiyiyeyjzayayzjmuvhvsiyfmjlgagajljlxpnxeyeynxhmjzaygapanxgakhpaizrfsmvsiynxgawvvhpaayayrfsjjljlxpiujlqgmuptfmgapaizgakhnxiyuhpazjsmjlizxpvsiyiyjlayjzganxjlfmjxnxiykhpafmtiiyfmtijliyvsmu";
		//var input = "EVpncqcqxokupn XMfncqaj xocq ajnrpn ufpnsxpnateikbevpnxraj eivi ufqrkuqrajxoat tieievkbfnajpniecq xoxruf pnatpntiajieeixrqrticq nrpnatkbpnuf qrxr tiiegmkbajxoxrxoatgmcqqrcq qraj evxoufpn kbeicqcqqrgvatpn evfntinr eveiiepn tieievkbatpnzq tiqrkbnrpniecq VIfnieajnrpnieeveiiepn tieievkbfnajpniecq xoatateiqzpnuf vieiie ajnrpn pnxrtiiegmkbajqreixr eivi xoxrgm rjqrxruf eivi ufxoajxo iepnkbiepncqpnxrajxogvatpn qrxr xoxrgm gvqrxrxoiegm vieiieevxoaj fnxratqrrjpn tiatxocqcqqrtixoat tiqrkbnrpniecq qznrqrtinr eixratgm pnxrtiiegmkbajpnuf qzieqrajajpnxr atxoxrkufnxokupn ajpnzqajcq ajnrqrcq qzxocq xrpnqz xoxruf cqqrkuxrqrviqrtixoxraj TIeievkbfnajpnie fncqpn nrxocq ajnrfncq cqfnkbkbatxoxrajpnuf atqrxrkufnqrcqajqrti tiiegmkbajeikuiexokbnrgm gveiajnr vieiie tiqrkbnrpnie ufpncqqrkuxr xoxruf tiiegmkbajxoxrxoatgmcqqrcq EVxoxrgm tieievkbfnajpnie tiqrkbnrpniecq tixoxr gvpn tinrxoiexotiajpnieqrezpnuf gvgm ajnrpnqrie eikbpniexoajqreixr eixr gvqrxrxoiegm gvqraj cqpnlofnpnxrtipncq cqeievpnajqrevpncq qrxr kuieeifnkbcq eiie gvateitirjcq fnxratqrrjpn tiatxocqcqqrtixoat xoxruf evpntinrxoxrqrtixoat cqtinrpnevpncq qznrqrtinr kupnxrpniexoatatgm evxoxrqrkbfnatxoajpn ajiexoufqrajqreixrxoat tinrxoiexotiajpniecq qrpn atpnajajpniecq xoxruf ufqrkuqrajcq ufqriepntiajatgm NReiqzpnsxpnie tieievkbfnajpniecq nrxosxpn xoatcqei xocqcqqrcqajpnuf tiiegmkbajxoxrxoatgmcqqrcq qznrqrtinr nrxocq tieievkbpnxrcqxoajpnuf ajei cqeievpn pnzqajpnxraj vieiie qrxrtiiepnxocqpnuf tiqrkbnrpnie tieievkbatpnzqqrajgm XReixrpnajnrpnatpncqcq kueieiuf eveiufpniexr tiqrkbnrpniecq nrxosxpn cqajxogmpnuf xonrpnxouf eivi tiiegmkbajxoxrxoatgmcqqrcq qraj qrcq ajgmkbqrtixoatatgm ajnrpn tixocqpn ajnrxoaj fncqpn eivi xo lofnxoatqrajgm tiqrkbnrpnie qrcq sxpniegm pnviviqrtiqrpnxraj qrpn vixocqaj xoxruf iepnlofnqrieqrxrku vipnqz iepncqeifnietipncq cqfntinr xocq evpneveiiegm eiie TIKBFN tixokbxogvqratqrajgm qznrqratpn gviepnxorjqrxrku qraj iepnlofnqriepncq xoxr pnvivieiieaj evxoxrgm eiieufpniecq eivi evxokuxrqrajfnufpn atxoiekupnie xoxruf sxxocqajatgm atxoiekupnie ajnrxoxr ajnrxoaj iepnlofnqriepnuf vieiie xoxrgm tiatxocqcqqrtixoat tiqrkbnrpnie evxorjqrxrku tiiegmkbajxoxrxoatgmcqqrcq cqei qrxrpnviviqrtiqrpnxraj xoxruf qrevkbiexotiajqrtixoat xocq ajei gvpn pnvivipntiajqrsxpnatgm qrevkbeicqcqqrgvatpnVIatxoku TIAJVIajnrqrcq_evxorjpncq_qraj_xo_gvqraj_nrxoieufpnie";
		input = input.replace(/ /g, '  ').toLowerCase();
		//input = input.replace(/[\.\,\;\:\"\'\{\}\(\)"]/g, '');
		var replaceLookup = [];
		var output = [];
		var identifier = 1;
		var spaces = 0;
		var answerspace = "abcdefghijklmnoprstuvwxyz.?!:;,\"'(){}=ABCDEFGHIJKLMNOPRSTUVWXYZ";		//removed q from answerspace
		//var answerspace = "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ.?!:;,\"'(){}=";		//removed q from answerspace
		//var answerspace = "Congratulbdefhijkmpsvwxyz.,!:;?\"'(){}=";
		
		for(var i = 0; i <= 26; i++){//Create easy lookup answerspace (one*one too large)
			var temp = [];
			for(var j = 0; j <= 26; j++){
				temp.push(0);
			}
			replaceLookup.push(temp);
		}
		
		for(var i = 0, t1, t2; i < input.length; i+=2) {	//O(n) speed by using O(26*26) ~ O(1) memory
			if(input[i]==' ') {
				if(trustspaces)
					output.push(' ');
				else
					spaces++;
				continue;
			}

			if(hexmode) {
				t1 = parseInt(input[i], 16);
				t2 = parseInt(input[i+1], 16);
			} else {
				t1 = input[i].charCodeAt(0)-97;		//97='a'
				t2 = input[i+1].charCodeAt(0)-97;
			}
			
			if(replaceLookup[t1][t2] == 0) {
				replaceLookup[t1][t2] = identifier;
				identifier += 1;
			}
			output.push(answerspace[replaceLookup[t1][t2]-1]);
		}
		
		return output.join('');
	},
	
};
