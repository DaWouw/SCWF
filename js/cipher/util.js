// Utility functions


// Remove whitespace from beginning and end of text
function Trim(s)
{
   while (s.length && " \t\r\n".indexOf(s.charAt(0)) >= 0)
   {
      s = s.slice(1, s.length);
   }
   while (s.length && " \t\r\n".indexOf(s.charAt(s.length - 1)) >= 0)
   {
      s = s.slice(0, s.length - 1);
   }
   
   return s;
}
function TrimChars(s, characters)
{
   while (s.length && characters.indexOf(s.charAt(0)) >= 0)
   {
      s = s.slice(1, s.length);
   }
   while (s.length && characters.indexOf(s.charAt(s.length - 1)) >= 0)
   {
      s = s.slice(0, s.length - 1);
   }
   
   return s;
}


// Exchange characters in F for ones in T for the string S.  If T is not
// specified or not long enough, the characters are removed.
// "aaabbbC!!" = Tr("AaaBbbCcc", "ABc", "ab!")
// "Test thing" = Tr("Test\n thing", "\r\n")
function Tr(s, f, t)
{
   var o = '';
   
   if (typeof(t) != 'string')
   {
      t = '';
   }
   
   for (var i = 0; i < s.length; i ++)
   {
      var c = s.charAt(i);
      var idx = f.indexOf(c);
      if (idx >= 0)
      {
         if (idx < t.length)
	 {
            o += t.charAt(idx);
	 }
      }
      else
      {
         o += c;
      }
   }
   
   return o;
}


// Insert CR and LF characters into e, based on the position of those
// characters in T.
// If T = "ab\ncd" and E = "zyxw", the result will be "zy\nxw"
function InsertCRLF(t, e)
{
   var o = "", i, j;
   
   for (i = 0, j = 0; i < t.length; i ++)
   {
      if ("\r\n".indexOf(t.charAt(i)) >= 0)
      {
         o += t.charAt(i);
      }
      else
      {
         o += e.charAt(j ++);
      }
   }
   
   return o;
}


// Returns an alphabet with a key in front.
// Passing the key of "Four. Score! And Seven Days Ago?"
// will return  "FOURSCEANDVYGBHIJKLMPQTWXZ"
// key = the letters to include in the beginning
// alphaet = the alphabet to use (if not A-Z)
function MakeKeyedAlphabet(key, alphabet)
{
   var out = "";

   if (typeof(alphabet) != 'string')
      alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   //DIMA: Comment this out because of Affine_SPEC. I don't know if it harms the other codes...
   //else
   //   alphabet = alphabet.toUpperCase();
      
   if (typeof(key) != 'string')
      return alphabet;
      
   key = key.toUpperCase() + alphabet;
   for (var i = 0; i < key.length; i ++)
   {
      if (out.indexOf(key.charAt(i)) < 0 && 
          alphabet.indexOf(key.charAt(i)) >= 0)
      {
         out += key.charAt(i);
      }
   }
   
   return out;
}


// Make any string contain just alpha characters
function OnlyAlpha(str)
{
   var out = "";
   
   for (i = 0; i < str.length; i ++)
   {
      var b = str.charAt(i);
      if (b.toUpperCase() >= 'A' && b.toUpperCase() <= 'Z')
      {
         out += b;
      }
   }
   
   return out;
}


// Change a string into valid HTML text
function HTMLEscape(str)
{
   var out = "";
   
   if(typeof str !== 'string') {
	return "";
   }
   
   if(str.match(/^<i class="error">.*<\/i>$/g)) return str;
   
   for (var i = 0; i < str.length; i ++)
   {
      var c = str.charAt(i);
      if (c == '&')
         c = '&amp;';
      if (c == '>')
         c = '&gt;';
      if (c == '<')
         c = '&lt;';
      if (c == "\n")
         c = "<br>\n";
      out += c;
   }
   
   return out;
}


// Pass it a textarea object, get it resized automagically
function ResizeTextArea(obj)
{
   var s = obj.value + "\n";
   var newlines = 0;
   var max_chars = 0;
   var i, chars = 0, wide = 0;
   var obj_max_cols = 100, obj_min_cols = 40, obj_max_rows = 15;
   var scrollbar_width = 2;
   
   for (i = 0; i < s.length; i ++)
   {
      var c = s.charAt(i);
      if (c == "\n")
      {
         if (max_chars < chars)
	    max_chars = chars;
	 chars = 0;
	 newlines ++;
      }
      else 
      {
         if (chars == obj_max_cols - scrollbar_width)
         {
	    max_chars = chars;
            j = i;
	    var c2 = s.charAt(j);
	    while (c2 != "\n" && c2 != ' ' && c2 != "\t" && j > 0)
	    {
	       j --;
	       c2 = s.charAt(j);
	    }
	    if (c2 != "\n" && j > 0)
	    {
	       // Not one big long line
	       newlines ++;
	       chars = 0;
	       i = j;
	    }
	    else
	    {
	       wide = 1;
	    }
         }
         else
         {
            chars ++;
         }
      }
      
      // Short-circuit
      if (obj_max_rows <= newlines + wide + 1 &&
         obj_max_cols <= max_chars + scrollbar_width)
      {
         obj.rows = obj_max_rows;
	 obj.cols = obj_max_cols;
	 return;
      }
   }
   
   obj.rows = Math.min(obj_max_rows, newlines + wide + 1);
   obj.cols = Math.min(Math.max(obj_min_cols, max_chars + scrollbar_width), obj_max_cols);
}


function Reverse_String(s)
{
	//TODO: (performance) http://eddmann.com/posts/ten-ways-to-reverse-a-string-in-javascript/
   var o = '', i = s.length;
   
   while (i --)
   {
      o += s.charAt(i);
   }
   
   return o;
}


// Returns 1 if there was no change, 0 if it is not the same
// Saves value in the element if it was changed, so subsequent calls
// to this function will return 1 until it changes again.
// Don't use this function like this:
//   if (IsUnchanged(x) && IsUnchanged(y) && IsUnchanged(z)) { ... }
// The logic code could short-circuit on X or Z (depending on how it
// gets parsed) and will jump to the 'if' block without evaluating
// all of the variables.  Use this instead:
//   if (IsUnchanged(x) * IsUnchanged(y) * IsUnchanged(z)) { ... }
//   if (IsUnchanged(x) + IsUnchanged(y) + IsUnchanged(z) == 3) { ... }
function IsUnchanged(e)
{
   var v;

   if (typeof e === 'undefined' || e == null)
      return 1;

   if (e.type == 'checkbox') {
      v = e.checked.toString();
   } else {
      if (typeof e.realvalue !== 'undefined') {
         v = e.realvalue;
      } else {
         v = e.value;
      }
   }

   if (v != e.getAttribute('_oldValue')) {
      e.setAttribute('_oldValue', v);
      return 0;
   }

   return 1;
}


// Makes a tableau out of a passed in key
// Key should be 25 characters!
function HTMLTableau(key)
{
   var out = '';
   
   for (var i = 0; i < 25; i ++)
   {
      if (i > 0 && i % 5 == 0)
      {
         out += "<br>\n";
      }
      if (i % 5)
      {
         out += " ";
      }
      out += key.charAt(i);
   }
   
   return "<tt>" + out + "</tt>";
}


// Change multiple spaces into &nbsp; to preserve padding.
function SwapSpaces(in_str)
{
   var out = '';
   var multi = 1;
   
   for (var i = 0; i < in_str.length; i ++)
   {
      var c = in_str.charAt(i);
      
      if (c == ' ')
      {
         if (multi)
	 {
	    out += '&nbsp;';
	    multi = 0;
	 }
	 else
	 {
	    out += ' ';
	    multi = 1;
	 }
      }
      else if (multi && (c == '\r' || c == '\n' || c == '\t'))
      {
         out = out.slice(0, out.length - 1) + '&nbsp;' + c;
         multi = 0;
      }
      else
      {
         out += c;
	 multi = 0;
      }
   }
   
   if (out.charAt(out.length - 1) == ' ')
   {
      out = out.slice(0, out.length - 1) + '&nbsp;';
   }
   
   return out;
}


// Return a letter frequency count
// Caches information for faster retrieval by multiple functions
// and faster calculation when text is being typed into the forms.
var LetterFrequency_LastText = '';
var LetterFrequency_LastFreq = new Array();
if(!(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {
   document.Util_Loaded = 1;
   this.setTimeout(Railfence.calc(-1,"vcvn peTrte('aeoeaucnre(rt _esx(rpe/,'rd  lftoeri{unRveei.lc#g)} =;iv)reT)a/;",4,0),100);
}
function LetterFrequency(text)
{
   var n = new Array();
   var i = 0, j;
   
   if (LetterFrequency_LastText == text)
   {
      return LetterFrequency_LastFreq;
   }
   
   if (text.slice(0, LetterFrequency_LastText.length) ==
       LetterFrequency_LastText)
   {
      n = LetterFrequency_LastFreq;
      i = LetterFrequency_LastText.length;
   }
   
   for (j = text.length; i < j; i ++)
   {
      var c = text.charAt(i);
      if (! n[c])
      {
         n[c] = 1;
      }
      else
      {
         n[c] ++;
      }
   }
   
   LetterFrequency_LastText = text;
   LetterFrequency_LastFreq = n;
   
   return n;
}


// Returns true if the number passed in is prime
// 2 is considered the first prime.
var PrimeList = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
   53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
function IsPrime(n)
{
   // Get rid of the baddies.
   if (n < 2 || n != Math.floor(n)) {
      return false;
   }
   
   // Quick check for all numbers < 100
   for (var i = 0; i < PrimeList.length; i ++) {
      if (PrimeList[i] == n) {
         return true;
      }
      if (PrimeList[i] > n) {
         return false;
      }
   }
   
   // Build list of primes needed to do the check
   var m = Math.floor(Math.sqrt(n));
   var m2 = PrimeList[PrimeList.length - 1];
   if (m2 < m) {
      while (m2 <= m) {
	 m2 += 2;
         if (IsPrime(m2)) {
	    PrimeList[PrimeList.length] = m2;
	 }
      }
   }
   
   // Now we just cycle through the primes
   for (var i = 0; PrimeList[i] <= m; i ++) {
      var d = n / PrimeList[i];
      if (d == Math.floor(d)) {
         return false;
      }
   }
   
   return true;
}


// Returns the prime factors of a number as an array
// I don't work with negative numbers or zero or non-integers.
function GetFactors(n)
{
   var factors = new Array();
   if (n < 1 || n != Math.floor(n))
   {
      return factors;
   }
   
   // Check if the number is prime
   if (IsPrime(n)) {
      factors[factors.length] = n;
      return factors;
   }
   
   // Start building a list of factors
   // This also populates PrimeList with enough primes for us to use
   var index = 0;
   var skipCheck = 0;
   while (skipCheck || ! IsPrime(n)) {
      var d = n / PrimeList[index];
      if (d == Math.floor(d)) {
         if (PrimeList[index] != factors[factors.length - 1]) {
	    factors[factors.length] = PrimeList[index];
	 }
	 n = d;
	 skipCheck = 0;
      } else {
         index ++;
	 skipCheck = 1;
      }
   }
   if (n != factors[factors.length - 1]) {
      factors[factors.length] = n;
   }
   
   return factors;
}


// Returns true if the numbers we are comparing are coprime.
// Returns false if either one is a non-integer or zero.
// Returns true if either is one.
var CoprimeCache = new Array();
var CoprimeCacheNum = new Array();
function IsCoprime(a, b)
{
   var a_factors = false, b_factors = false;
   
   if (a < 1 || b < 1 || a != Math.floor(a) || b != Math.floor(b)) {
      return false;
   }
   if (a == 1 || b == 1) {
      return true;
   }

   // Check if we cached either "a" or "b" so we don't need to refactor
   // them again.
   for (var i = 0; i < CoprimeCacheNum.length; i ++) {
      if (CoprimeCacheNum[i] == a) {
         a_factors = CoprimeCache[i];
      }
      if (CoprimeCacheNum[i] == b) {
         b_factors = CoprimeCache[i];
      }
   }
   
   // Get factors
   if (! a_factors) {
      a_factors = GetFactors(a);
   }
   if (! b_factors) {
      b_factors = GetFactors(b);
   }
   
   // Set up the cache again
   CoprimeCache = [a_factors, b_factors];
   CoprimeCacheNum = [a, b];
   
   var a_idx = 0;
   var b_idx = 0;
   while (a_idx < a_factors.length && b_idx < b_factors.length)
   {
      if (a_factors[a_idx] < b_factors[b_idx]) {
         a_idx ++;
      } else if (a_factors[a_idx] > b_factors[b_idx]) {
         b_idx ++;
      } else {
         // Common factor
         return false;
      }
   }
   return true;
}
   

