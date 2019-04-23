//http://book.mixu.net/node/ch6.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
//Avoid assigning variables to prototypes but use gradeobj.random=value or gradeobj['random']=value

// Constructor
function Grade(id, r, grade, value, markedvalue, cipher) {
	// always initialize all instance properties
	this.id = id;
	this.random = r;
	this.grade = grade;
	this.value = value;
	this.markedvalue = markedvalue;
	this.cipher = cipher;
	this.intermediateSteps = [];
}
// class methods
Grade.prototype.getInfoArray = function() {
	return [this.id, this.random, this.grade, this.value, this.markedvalue, this.cipher];
};
// export the class
//module.exports = Grade;


// constructor call
//var object = new Grade(r, grade, value, markedvalue, cipher);
