/* Namespace.js

   Version 1.0, June 2009
   by Mike Koss - released into the public domain.

   Support for building modular namespaces in javascript.
   
   Globals:
   
   window.global_namespace (Namespace) - The top of the namespace heirarchy.  Child namespaces
   are stored as properties in each namespace object.
   
   *** Class Namespace ***

   Methods:

   ns.Define(sPath, fnCallback(ns)) - Define a new Namespace object and call
   the provided function with the new namespace as a parameter.
   
   	sPath - Path of the form ('unique.module.sub_module').  Pat
   
   Returns the newly defined namespace.
   
   ns.Extend(oDest, oSource) - Copy the (own) properties of the source object
   into the destination object.  Returns oDest.  Note: This method is a convenience
   function - it has no effect on the Namespace object itself.
   
   ns.Import(sPath) - Return the namespace object with the given (absolute) path.
   
   Usage example:
   
   global_namespace.Define('startpad.base', function(ns) {
       var Other = ns.Import('startpad.other');

       ns.Extend(ns, {
           var1: value1,
           var2: value2,
           MyFunc: function(args)
               {
               ....Other.AFunction(args)...
               }
       });
       
       ns.ClassName = function(args)
       {
       };
       
       ns.ClassName.prototype = {
           constructor: ns.ClassName,
           var1: value1,
           
       Method1: function(args)
           {
           }
       };
   });
*/

// Define stubs for FireBug objects if not present
// This is here because this will often be the very first javascript file loaded
try
	{
	var console;

	if (!console)
		{
		(function ()
			{
		    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
		    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
		
		    console = {};
		    for (var i = 0; i < names.length; ++i)
		    	{
		        console[names[i]] = function() {};
		        }
			})();
		}
	}
catch (e)
	{
	}
	
var global_namespace = (function()
{
	try
		{
		if (global_namespace != undefined)
			return global_namespace;
		}
	catch (e)
		{
		}

	/** @constructor **/
	function Namespace(nsParent, sName)
		{
		if (sName)
			sName = sName.replace(/-/g, '_');

		this._nsParent = nsParent;
		
		if (this._nsParent)
			{
			this._nsParent[sName] = this;
			this._sPath = this._nsParent._sPath;
			if (this._sPath != '')
				this._sPath += '.';
			this._sPath += sName;
			}
		else
			this._sPath = '';
		};
	
	Namespace.prototype['Extend'] = function(oDest, var_args)
		{
		if (oDest == undefined)
			oDest = {};

		for (var i = 1; i < arguments.length; i++)
			{
			var oSource = arguments[i];
			for (var prop in oSource)
				{
				if (oSource.hasOwnProperty(prop))
					oDest[prop] = oSource[prop];
				}
			}
	
		return oDest;
		};

	var ns = new Namespace(null);

	ns['Extend'](Namespace.prototype, {
	'Define': function (sPath, fnCallback)
		{
		sPath = sPath.replace(/-/g, '_');

		var aPath = sPath.split('.');
		var nsCur = this;
		for (var i = 0; i < aPath.length; i++)
			{
			var sName = aPath[i];
			if (nsCur[sName] == undefined)
				new Namespace(nsCur, sName);
			nsCur = nsCur[sName];
			}
		// In case a namespace is multiply loaded - we ignore the definition function
		// for all but the first call.
		if (fnCallback)
		{
			if (!nsCur._fDefined)
			{
				nsCur._fDefined = true;
				fnCallback(nsCur);
				//console.info("Namespace '" + nsCur._sPath + "' defined.");
			}
			else
				console.warn("WARNING: Namespace '" + nsCur._sPath + "' redefinition.");
		}
		else if (!nsCur._fDefined){
			//console.warn("Namespace '" + nsCur._sPath + "' forward reference.");
		}
		return nsCur;
		},
	
	'Import': function(sPath)
		{
		return ns['Define'](sPath);
		},
		
	'SGlobalName': function(sInNamespace)
		{
		sInNamespace = sInNamespace.replace(/-/g, '_');
		return 'global_namespace.' + this._sPath + '.' + sInNamespace;
		}
	});
	
	return ns;
})();
