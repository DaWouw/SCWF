


//Object inheritance: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
'use strict';

class Setting {
	constructor(variablename, type, name, description) {
		// always initialize all instance properties
		this.variablename = variablename;
		this.type = type;
		this.name = name;
		this.description = description;
	}
}

class RangeSetting extends Setting {
	constructor(variablename, type, min, max, name, description) {
		super(variablename, type, name, description);
		this.min = min;
		this.max = max;
	}
	/*get area() {
		return this.height * this.width;
	}
	set sideLength(newLength) {
		this.height = newLength;
		this.width = newLength;
	}*/
}
class DropDownSetting extends Setting {
	constructor(variablename, type, valueArray, name, description) {
		super(variablename, type, name, description);
		this.valueArray = valueArray;
	}
}
class MultiSetting extends Setting {
	constructor(variablename, type, valueArray, name, description) {
		super(variablename, type, name, description);
		this.valueArray = valueArray;
	}
}
class TextAreaSetting extends Setting {
	constructor(variablename, type, optionArray, name, description) {
		super(variablename, type, name, description);
		this.optionArray = optionArray;
	}
}

const permutator = (inputArr) => {
	let result = [];

	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			result.push(m)
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next))
			}
		}
	}

	permute(inputArr)

	return result;
}
