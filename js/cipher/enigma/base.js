global_namespace.Define('startpad.base', function(NS) {

NS.Extend(NS, {
Browser:
	{
	version: parseInt(navigator.appVersion),
	fIE: navigator.appName.indexOf("Microsoft") !== -1
	},
	
ExtendMissing: function(oDest, var_args)
	{
	if (oDest == undefined)
		oDest = {};

	for (var i = 1; i < arguments.length; i++)
		{
		var oSource = arguments[i];
		for (var prop in oSource)
			{
			if (oSource.hasOwnProperty(prop) && oDest[prop] == undefined)
				oDest[prop] = oSource[prop];
			}
		}

	return oDest;
	},

// Javascript Enumeration
// Build an object whose properties are mapped to successive integers
// Also allow setting specific values by passing integers instead of strings.
// e.g. new NS.Enum("a", "b", "c", 5, "d") -> {a:0, b:1, c:2, d:5}
Enum: function(aEnum)
	{
	if (!aEnum)
		return;

	var j = 0;
	for (var i = 0; i < aEnum.length; i++)
		{
		if (typeof aEnum[i] == "string")
			this[aEnum[i]] = j++;
		else
			j = aEnum[i];
		}
	},

/* Return new object with just the listed properties "projected" into the new object */	
Project: function(obj, asProps)
	{
	var objT = {};
	
	for (var i = 0; i < asProps.length; i++)
		objT[asProps[i]] = obj[asProps[i]];
	
	return objT;
	},

DeDupArray: function(a)
	{
	if (!a)
		return;

	a.sort();
	for (var i = 1; i < a.length; i++)
		{
		if (a[i-1] == a[i])
			a.splice(i, 1);
		}
	},
	
Map: function(a, fn)
	{
	var aRes = [];
	for (var i = 0; i < a.length; i++)
		aRes.push(fn(a[i]));
	return aRes;
	},
	
Filter: function(a, fn)
	{
	var aRes = [];
	for (var i = 0; i < a.length; i++)
		{
		if (fn(a[i]))
			aRes.push(a[i]);
		}
	return aRes;
	},
	
Reduce: function(a, fn)
	{
	if (a.length < 2)
		return a[0];

	var res = a[0];
	for (var i = 1; i < a.length-1; i++)
		res = fn(res, a[i]);

	return res;
	}
});

//--------------------------------------------------------------------------
// Fast string concatenation buffer
//--------------------------------------------------------------------------
NS.StBuf = function()
{
	this.rgst = [];
	this.Append.apply(this, arguments);
	this.sListSep = ", ";
};

NS.StBuf.prototype = {
		constructor: NS.StBuf,

Append: function()
	{
	for (var ist = 0; ist < arguments.length; ist++)
		this.rgst.push(arguments[ist].toString());
	return this;
	},
	
Clear: function ()
	{
	this.rgst = [];
	},

toString: function()
	{
	return this.rgst.join("");
	},

// Build a comma separated list - ignoring undefined, null, empty strings
AppendList: function()
	{
	var sSep = "";
	for (var ist = 0; ist < arguments.length; ist++)
		{
		var sT = arguments[ist];
		if (sT)
			{
			this.Append(sSep + sT);
			sSep = this.sListSep;
			}
		}
	return this;
	}
}; // NS.StBuf

//--------------------------------------------------------------------------
// Some extensions to built-in JavaScript objects (sorry!)
//--------------------------------------------------------------------------

// Wrap a method call in a function
Function.prototype.FnMethod = function(obj)
{
	var _fn = this;
	return function () { return _fn.apply(obj, arguments); };
};

// Append additional arguments to a function
Function.prototype.FnArgs = function()
{
	var _fn = this;
	var _args = [];
	for (var i = 0; i < arguments.length; i++)
		{
		_args.push(arguments[i]);
		}

	return function () {
		var args = [];
		// In case this is a method call, preserve the "this" variable
		var self = this;

		for (var i = 0; i < arguments.length; i++)
			{
			args.push(arguments[i]);
			}
		for (i = 0; i < _args.length; i++)
			{
			args.push(_args[i]);
			}

		return _fn.apply(self, args);
	};	
};

}); // startpad.base