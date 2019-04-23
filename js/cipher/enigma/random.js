global_namespace.Define('startpad.random', function(NS) {
/* Random number functions.

   The builtin Math.random does not afford setting an initial seed.  These
   functions provide an alternative random number generation system - and mirror
   the subset of functions builtin to Python (random.py).
   
   Usage:
   
    Random = NS.Import('startpad.random');
    
   	Random.seed([]) - intialize the random generator for a string, number, array, or date (uses current
   		Date() if none is given.
   	Random.randint(min, max) - return a uniform random integer between min and max - inclusive
   	Random.random() - return a random floating point number between 0 and 1 inclusive
   
   2009-12-22 [mck] Created.
*/
	MT = NS.Import('startpad.random.mt');
	Base = NS.Import('startpad.base');
	
NS.Extend(NS, {
seed: function(data)
	{
	if (data == undefined)
		data = new Date();
		
	if (typeof data == 'object' && data.constructor == Date)
		data = data.getTime();

	if (typeof data == 'number')
		{
		MT.init_genrand(data);
		return
		}
		
	if (typeof data == 'string')
		data = Base.Map(data.split(''), function(ch) {return ch.charCodeAt(0);});
	
	MT.init_by_array(data);
	},
	
randint: function(min, max)
	{
	var r = NS.random();
	
	return Math.floor(min + (max-min+1)*r);
	},
	
random: function()
	{
	return MT.genrand_real1();
	},

/* Return a random selection of k (unique) elements from array, a. */	
sample: function(a, k)
	{
	// Copy input array
	var pool = a.concat();
	var n = a.length;
	if (k > n)
		k = n;
	var result = [];
	for (var i = 0; i < k; i++)
		{
		var j = NS.randint(0,n-i-1);
		result.push(pool[j]);
		pool[j] = pool[n-i-1];
		}
	return result;
	},
	
shuffle: function(a)
	{
	var n = a.length;
	for (var i = n-1; i > 0; i--)
		{
		var j = NS.randint(0, i);
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
		}
	return a;
	}
});

// Intiialize the random generatr by the current date, if the user doesn't seed it
NS.seed();

});