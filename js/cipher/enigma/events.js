// Level 2, IE, or Level 0 event models supported.
// "this" - points to target object
// 1st argument is event

global_namespace.Define('startpad.events', function(NS) {
	var DOM = NS.Import('startpad.DOM');
	var Vector = NS.Import('startpad.vector');

NS.Extend(NS, {
fnHandlers: [],

AddEventFn: function(elem, stEvt, fnCallback, fCapture)
	{
	if (!fCapture)
		fCapture = false;
	
	var fnWrap = function() {
		arguments[0] = NS.WrapEvent(arguments[0]);
		return fnCallback.apply(elem, arguments);
		};

	if (elem.addEventListener)
		{
		elem.addEventListener(stEvt, fnWrap, fCapture);
		}
	else if (elem.attachEvent)
		{
		elem.attachEvent('on' + stEvt, fnWrap);
		}
	else
		{
		elem['on' + stEvt] = fnWrap;
		}

	NS.fnHandlers.push({
		elem:elem,
		evt:stEvt,
		fCapture:fCapture,
		fn:fnWrap
		}
	);
	
	return NS.fnHandlers.length-1;
	},
	
RemoveEventFn: function(ifn)
	{
	var fnHand = NS.fnHandlers[ifn];
	if (!fnHand)
		{
		return;
		}
	NS.fnHandlers[ifn] = undefined;

	var elem = fnHand.elem;
	if (elem.removeEventListener)
		{
		elem.removeEventListener(fnHand.evt, fnHand.fn, fnHand.fCapture);
		}
	else if (elem.attachEvent)
		{
		elem.detachEvent('on' + fnHand.evt, fnHand.fn);
		}
	else
		{
		elem['on' + fnHand.evt] = undefined;
		}
	},

/* Modify original event object to enable the DOM Level 2 Standard Event model
   (make IE look like a Standards based event)
   
   Supports these standard properties of the event:

   preventDefault()
   stopPropogation()
   target - original event target (as compared to currentTarget for bubbling events)
   pageX, pageY - client (document based) coordinates of the mouse
   keyCode
*/
WrapEvent: function(evt)
	{
	evt = evt || window.evt || {};
	if (!evt.preventDefault)
		{
		evt.preventDefault = function() {this.returnValue = false;};
		}
	if (!evt.stopPropagation)
		evt.stopPropagation = function() {this.cancelBubble = true;};
	if (!evt.target)
		evt.target = evt.srcElement || document;
	if (evt.pageX == null && evt.clientX != null) {
		var doc = document.documentElement, body = document.body;
		evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
		evt.pageY = evt.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}
	return evt;
	},
	
GetChar: function(evt)
	{
	var code = evt.keyCode || evt.which;
	return String.fromCharCode(code);
	},
	
DisableSelection: function(elt)
	{
	// Disable selection of text or clicking on a purely visual element
	elt.style.cursor = "default";
	NS.AddEventFn(elt, 'mousedown', function(evt) {
		evt.preventDefault();
		// If the disabled object is in a draggable element, we want to propogate
		// the mousedown up....so no stopPropagation call here.
		return false;
		});
	},

/* ------------------------------------------------------------
	Enable dragging for absolute or relative position elements
	Callback called at end of drag with change in position of the
	elemeent (dpt).

	BUG: Mouse can move off of elem, and loose all subsequent events.
	IE has setCapture, but not in FF.  Also FF allows window.onmousemove,
	but not in IE!  document.onmousemove does not work as there are areas
	of the window that are not a part of the document!
	One solution would be to create a temporary transparent div to overlay
	the window for the duration of the drag, and then get mousemoves within it.
	
	Options:
		fInclusive - capture mouse events - will not enable any internal component to be clicked
		fResize - allow resizing if clicked near one of the edge control points
		rcBounds - The bounding box in which the element is constrained
		    This can be adjusted after the initial call in the bounding rectangle
		    changes - be careful to make an in-place modification.
		fnStart - Callback when a drag is started
		fnMove - High-rate callback whenever element is moved
		fClip - Clip the rectangle when moving (otherwise pins to bounding rect)

	TODO: Could share a common event handler for the mousemove and mouseup when
	multiple draggable elements are on screen.
   ------------------------------------------------------------ */
aCursors: ['nw-resize', 'n-resize', 'ne-resize',
           'w-resize', 'move', 'e-resize',
           'sw-resize', 's-resize', 'se-resize'],

Draggable: function(elem, fnCallback, opt)
	{
	var fDragging = false;
	var ptMouse, ptStart, ptLast;
	var dResize = 4;
	var iReg = 4;
	
	opt = NS.Extend({fInclusive: false,
					 fResize: false,
					 rcBounds: null,
					 fnCallback: null
					 },
					opt);
	
	var rcElem;
	var rcClient;
	
	NS.AddEventFn(elem, 'mousedown', function(evt) {
		// Don't initiate a drag for bubbling up events
		if (!opt.fInclusive && evt.target != elem)
			return;
		evt.preventDefault();
		evt.stopPropagation();
		fDragging = true;
		ptStart = [evt.pageX, evt.pageY];
		ptLast = ptStart;
		if (opt.fnStart)
			opt.fnStart();
		return false;
		}, false);
	NS.AddEventFn(document, 'mousemove', function(evt) {
		var ptNow = [evt.pageX, evt.pageY];
		if (!fDragging)
			{
			rcElem = DOM.RcOffset(elem);
			rcClient = DOM.RcClient(elem);
			if (!Vector.PtInRect(ptNow, rcClient))
				return true;
			iReg = opt.fResize ? Vector.IRegClosest(ptNow, rcClient) : 4;
			elem.style.cursor = NS.aCursors[iReg];
			return true;
			}
		evt.preventDefault();
		evt.stopPropagation();

		if (Vector.Equal(ptNow, ptLast))
			return false;
		ptLast = ptNow;

		// If a move callback is provided, just pass back incremental move values and let the caller
		// handle the display
		if (opt.fnMove)
			{
			opt.fnMove(Vector.Sub(ptNow, ptStart));
			return false;
			}
		var dpt = Vector.Sub(ptNow, ptStart);
		var rcNew = Vector.RectDeltaReg(rcElem, dpt, iReg, [12,12], opt.rcBounds);
		DOM.SetRc(elem, rcNew);
		return false;
		}, false);
	NS.AddEventFn(document, 'mouseup', function(evt) {
		if (!fDragging)
			return true;
		fDragging = false;
		evt.preventDefault();
		evt.stopPropagation();
		if (fnCallback)
			fnCallback(Vector.Sub(ptLast, ptStart));
		return false;
		}, false);
	}

});}); // startpad.events