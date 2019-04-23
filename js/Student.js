/*
Add checks for hashes in answers
Add standardized functions for checking if something is a base64, binary, plaintext, plaintext++
*/


//AKA Guesser
var Student = {
	active : false,
	current_test_case_str : '',
	runNextTestCase_timeout : 300,
	initialcheck_timeout : 550,
	check_onlinelookup_timeout : 8000,
	check_onlineplayfair_timeout : 2000,
	//check_final_try_timeout : 2000,
	onlineplayfair_performed : true,
	onlinelookup_performed : true,
	one_extra_extention : true,
	//final_extention : true,

	MYTESTANSWERS : [],

	startGuessAll : function() {
		if(this.active == false) {
			var parentid = ForceFlow.getCurrentNodeId();
			var nrChildren = ForceFlow.getSelectedNodeNrChildren();
			if(nrChildren >= 1) {
				this.active = true;
				this.MYTESTANSWERS = [];
				this.nextGuess(parentid);
			}
		} else{
			console.info("Student is already guessing @ startGuessAll()");
		}
	},
	nextGuess : function(parentid, childnr)
	{
		childnr = (typeof childnr !== 'undefined')?childnr+1:0;
		if(childnr < 20 && ForceFlow.selectChild(parentid, childnr))	//20 is an insane high number here
		{
			this.one_extra_extention = false;
			this.onlineplayfair_performed = false;
			window.setTimeout('\tStudent.followGuess('+parentid+','+childnr+')', this.runNextTestCase_timeout);
		}
		else
		{
			//We're out of guesses, stop
			this.stopGuessing();
		}
	},
	/*clearAllAnswers:function(){},clearAllGrades:function(){},*/showCalculating:function(){},
	followGuess : function(parentid, childnr)
	{
		var highestGrade = Teacher.getHighestGrade(false);
		if(Teacher.isHit(highestGrade))
		{
			this.MYTESTANSWERS[this.MYTESTANSWERS.length] = highestGrade;
			console.info("\tPauzed guessing because of hit :)");
			this.stopGuessing();
			return;
		}
		
		if(CURRENTSCRATCHPAD.realvalue == this.current_test_case_str)
		{
			//this.current_test_case_str = CURRENTSCRATCHPAD.realvalue;
			if(this.one_extra_extention == false)		//Give it a bit more time before we continue with the next guess
			{
				this.one_extra_extention = true;
				window.setTimeout('Student.followGuess('+parentid+','+childnr+')', this.initialcheck_timeout);
			}
			else if(this.onlineplayfair_performed == false && OnlineLookup.active != 0)
			{
				this.onlineplayfair_performed = true;
				window.setTimeout('Student.followGuess('+parentid+','+childnr+')', this.check_onlineplayfair_timeout);
			}
			else if(this.onlinelookup_performed == false)
			{
				this.onlinelookup_performed = true;
				window.setTimeout('Student.followGuess('+parentid+','+childnr+')', this.check_onlinelookup_timeout - this.check_onlineplayfair_timeout);
				alert('A');
			}
			else
			{
				window.setTimeout('Student.nextGuess('+parentid+','+childnr+')', this.runNextTestCase_timeout);
			}
		}
		else 
		{
			this.one_extra_extention = false;
			this.current_test_case_str = CURRENTSCRATCHPAD.realvalue;
			window.setTimeout('Student.followGuess('+parentid+','+childnr+')', this.initialcheck_timeout);
		}
			
	},
	stopGuessing : function()
	{
		//Done guessing
		//if(this.MYTESTANSWERS.length)

		this.active = false;
	},


};