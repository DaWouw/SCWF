//--------------------------------------------------------------------------
// DOM Functions
// Points (pt) are [x,y]
// Rectangles (rc) are [xTop, yLeft, xRight, yBottom]
//--------------------------------------------------------------------------
global_namespace.Define('startpad.DOM', function(NS) {
	var Vector = NS.Import('startpad.vector');

NS.Extend(NS, {
	x:0, y:1,
	x2:2, y2:3,

// Get absolute position on the page for the upper left of the element.
PtClient: function(elt)
	{
	var pt = [0,0];

	while (elt.offsetParent !== null)
		{
		pt[0] += elt.offsetLeft;
		pt[1] += elt.offsetTop;
		elt = elt.offsetParent;
		}
	return pt;
	},

// Return size of a DOM element in a Point - includes borders, and padding, but not margins
PtSize: function(elt)
	{
	return [elt.offsetWidth, elt.offsetHeight];
	},

// Return absolute bounding rectangle for a DOM element: [x, y, x+dx, y+dy]
RcClient: function(elt)
	{
	// TODO: Should I use getClientRects or getBoundingClientRect?
	var rc = NS.PtClient(elt);
	var ptSize = NS.PtSize(elt);
	rc.push(rc[NS.x]+ptSize[NS.x], rc[NS.y]+ptSize[NS.y]);
	return rc;
	},
	
// Relative rectangle within containing element
RcOffset: function(elt)
	{
	var rc = [elt.offsetLeft, elt.offsetTop];
	var ptSize = NS.PtSize(elt);
	rc.push(rc[NS.x]+ptSize[NS.x], rc[NS.y]+ptSize[NS.y]);
	return rc;
	},
	
PtMouse: function(evt)
	{
	var x = document.documentElement.scrollLeft || document.body.scrollLeft;
	var y = document.documentElement.scrollTop || document.body.scrollTop;
	return [x+evt.clientX, y+evt.clientY];
	},
	
RcWindow: function()
	{
	var x = document.documentElement.scrollLeft || document.body.scrollLeft;
	var y = document.documentElement.scrollTop || document.body.scrollTop;
	var dx = window.innerWidth || document.documentElement.clientWidth ||	document.body.clientWidth;
	var dy = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	return [x, y, x+dx, y+dy];
	},
	
SetAbsPosition: function(elt, pt)
	{
	elt.style.top = pt[1] + 'px';
	elt.style.left = pt[0] + 'px';
	},
	
SetSize: function(elt, pt)
	{
	// Setting the width of an element INSIDE the padding
	elt.style.width = pt[0] + 'px';
	elt.style.height = pt[1] + 'px';
	},
	
SetRc: function(elt, rc)
	{
	this.SetAbsPosition(elt, Vector.UL(rc));
	this.SetSize(elt, Vector.Size(rc));
	},
	
RemoveChildren: function(node)
	{
	for (var child = node.firstChild; child; child = node.firstChild)
		{
		node.removeChild(child);
		}
	},
	
Ancestors: function(elem)
	{
	var aAncestors = [];
	
	while (elem != document)
		{
		aAncestors.push(elem);
		elem = elem.parentNode;
		}
	return aAncestors;
	},

// Find the height of the nearest common ancestor of elemChild and elemUncle
CommonAncestorHeight: function(elemChild, elemUncle)
	{
	var aChild = NS.Ancestors(elemChild);
	var aUncle = NS.Ancestors(elemUncle);
	
	var iChild = aChild.length-1;
	var iUncle = aUncle.length-1;
	
	while (aChild[iChild] == aUncle[iUncle] && iChild >= 0)
		{
		iChild--;
		iUncle--;
		}
	
	return iChild+1;
	},

// Set focus() on element, but NOT at the expense of scrolling the window position
SetFocusIfVisible: function(elt)
	{
	if (!elt)
		return;

	var rcElt = NS.RcClient(elt);
	var rcWin = NS.RcWindow();
	
	if (Vector.PtInRect(Vector.UL(rcElt), rcWin) ||
		Vector.PtInRect(Vector.LR(rcElt), rcWin))
		{
		elt.focus();
		}
	},
	
ScrollToBottom: function(elt)
	{
	elt.scrollTop = elt.scrollHeight;
	},
	
BindIDs: function(aIDs)
	{
	var mParts = {};
	
	// If no array of id's is given, return all ids defined in the document
	if (aIDs === undefined)
		{
		var aAll = document.getElementsByTagName("*");
		for (var i = 0; i < aAll.length; i++)
			{
			var elt = aAll[i];
			if (elt.id && elt.id[0] != '_')
				mParts[elt.id] = elt;
			}
		return mParts;
		}

	for (var i = 0; i < aIDs.length; i++)
		{
		var sID = aIDs[i];
		mParts[sID] = document.getElementById(sID);
		}
	return mParts;
	},
	
InitValues: function(aNames, mpFields, mpValues)
	{
	for (var i = 0; i < aNames.length; i++)
		{
		if (mpValues[aNames[i]] != undefined)
			mpFields[aNames[i]].value = mpValues[aNames[i]];
		}
	},
	
ReadValues: function(aNames, mpFields, mpValues)
	{
	for (var i = 0; i < aNames.length; i++)
		{
		var field = mpFields[aNames[i]];
		var value;
		
		if (field.type == 'checkbox')
			value = field.checked;
		else
			value = field.value;
		mpValues[aNames[i]] = value;
		}
	},

/* Poor-man's JQuery compatible selector.

   Excepts simple (single) selectors in one of three formats:

	   #id
	   .class
	   tag
*/
$: function(sSelector)
	{
	var ch = sSelector.substr(0,1);
	if (ch == '.' || ch == '#')
		sSelector = sSelector.substr(1);
	
	if (ch == '#')
		return document.getElementById(sSelector);
	if (ch == '.')
		return NS.GetElementsByClassName(sSelector);
	return document.getElementsByTagName(sSelector);
	},
	
GetElementsByClassName: function(sClassName)
	{
	if (document.getElementsByClassName)
		return document.getElementsByClassName(sClassName);
	
	return NS.GetElementsByTagClassName(document, "*", sClassName);
	},
	
/*
	GetElementsByTagClassName
	
	Written by Jonathan Snook, http://www.snook.ca/jonathan
	Add-ons by Robert Nyman, http://www.robertnyman.com
*/

GetElementsByTagClassName: function(oElm, strTagName, strClassName)
	{
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var oElement;
	for(var i=0; i<arrElements.length; i++)
		{
		oElement = arrElements[i];
		if(oRegExp.test(oElement.className))
			{
			arrReturnElements.push(oElement);
			}
		}
	return (arrReturnElements)
	},
	
GetText: function(elt)
	{
	// Try FF then IE standard way of getting element text
	var sText = elt.textContent || elt.innerText || "";
	return sText.Trim();
	},
	
SetText: function(elt, st)
	{
	if (elt.textContent != undefined)
		elt.textContent = st;
	else
		elt.innerText = st;
	}
});

}); // startpad.DOM