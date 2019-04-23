
var Test = {
	runNextTestCase_timeout : 50,
	initialcheck_timeout : UPDATE_SETTIMEOUT+50,
	check_onlinelookup_timeout : 8000,
	check_final_try_timeout : 2000,
	
	current_test_case : -1,
	current_test_case_str : '',
	onlinelookup_performed : false,
	one_extra_extention : false,
	final_extention : false,
	
	MYTESTANSWERS : [],
	
	CURRENTCHALLANGESET : false,

	active : function()
	{
		return (this.current_test_case >= 0);	//current_test_case == -1 means inactive
	},

	initTestMode : function(challangeset)
	{
		if(UPDATE_SETTIMEOUT == 0)
			alert('MAIN.js should be included before TEST.js');
		
		this.CURRENTCHALLANGESET = (typeof challangeset == "undefined")? TESTCHALLANGES/*.slice(0)*/ : ALLTESTCHALLANGES/*.slice(0)*/;
		
		//this.CURRENTCHALLANGESET = this.CURRENTCHALLANGESET.reverse();

		this.current_test_case = 0;
		this.MYTESTANSWERS = [];
		Test.runNextTestCase();
		Timer.startN('AllTests');
		return false;
	},

	runNextTestCase : function() {
		this.onlinelookup_performed = false;
		this.one_extra_extention = false;
		this.final_extention = false;
		
		if(this.current_test_case < this.CURRENTCHALLANGESET.length) {
			//ForceFlow.clear();
			//ForceFlow.updateSelectedTextArea();
			//confirm('Next');
			Teacher.clearAllGrades();
			this.current_test_case_str = this.CURRENTCHALLANGESET[this.current_test_case][0];
			CURRENTSCRATCHPAD.setRealValue(this.CURRENTCHALLANGESET[this.current_test_case][0]);
			ForceFlow.updateEditedNode(CURRENTSCRATCHPAD);	// or something like $(CURRENTSCRATCHPAD).change(); (but this function isn't implemented yet)
			window.setTimeout('Test.checkTestCase()', this.initialcheck_timeout);
		} else {
			var duration = Test.stop();
			alert("All tests cleared! - "+duration+"ms");
		}
	},

	checkTestCase : function()
	{
		var highestGrade = Teacher.getHighestGrade(false);
		if(Teacher.isHit(highestGrade))
		{
			this.MYTESTANSWERS[this.MYTESTANSWERS.length] = highestGrade[2];
			if(highestGrade[2] != this.CURRENTCHALLANGESET[this.current_test_case][1]) {
				if(! confirm("Calc:"+highestGrade[2]+ "\r\nAnsw:"+this.CURRENTCHALLANGESET[this.current_test_case][1] + "\r\nContinue testing?") )
				{
					Test.stop();
					return;
				}
			}
			
			this.current_test_case += 1;
			Test.runNextTestCase();
			//window.setTimeout('Test.runNextTestCase();', this.runNextTestCase_timeout);
		}
		else if(CURRENTSCRATCHPAD.realvalue != this.current_test_case_str)
		{
			this.current_test_case_str = CURRENTSCRATCHPAD.realvalue;
			window.setTimeout('Test.checkTestCase()', this.initialcheck_timeout);
		}
		else if(this.one_extra_extention == false)		//Give it a bit more time before we do quipqiup
		{
			this.one_extra_extention = true;
			window.setTimeout('Test.checkTestCase()', this.initialcheck_timeout);
		}
		else if(this.onlinelookup_performed == false)		//Try quipqiup and playfair online lookup
		{
			this.onlinelookup_performed = true;
			if(!OnlineLookup.active)
				OnlineLookup.request(CURRENTSCRATCHPAD.realvalue);
			window.setTimeout('Test.checkTestCase()', this.check_onlinelookup_timeout);
		}
		else if(this.final_extention == false)			//Final check, in case quipqiup response is in a traffic jam
		{
			this.final_extention = true;
			window.setTimeout('Test.checkTestCase()', this.check_final_try_timeout);
		}
		else
		{
			if(confirm('Test failed (timeout) at @ test #'+(this.current_test_case+1)+" of "+this.CURRENTCHALLANGESET.length+'. Continue testing?')) {
				this.current_test_case += 1;
				Test.runNextTestCase();
			}
			else
			{
				Test.stop();
			}
		}
	},

	stop : function()
	{
		this.current_test_case = -1;
		ForceFlow.clear();
		ForceFlow.updateSelectedTextArea();
		$("span.outputbox").empty();	//Same as Teacher.clearAllAnswers()
		return Timer.stopN('AllTests',"AllTests - all");
	}

};
