



var Hash = {


	upd : function() {
		if (IsUnchangedVar.text || CURRENTSCRATCHPAD.realvalue == '') {
			return;
		} else {
			Timer.start();
			document.getElementById('MANIPULATE_hash').innerHTML = '<p>SHA1:<br>'+Hash.sha1(CURRENTSCRATCHPAD.realvalue)+'</p><p>MD5:<br>'+Hash.md5(CURRENTSCRATCHPAD.realvalue)+'</p>';
			Timer.stop("Hash - MD5 + SHA1");
		}
	},

	calcAll : function() {
		Timer.start();
		document.getElementById('MANIPULATE_hash').innerHTML = '<p>SHA1:<br>'+Hash.sha1(CURRENTSCRATCHPAD.realvalue)+'</p><p>MD5:<br>'+Hash.md5(CURRENTSCRATCHPAD.realvalue)+'</p>';
		Timer.stop("Hash - MD5 + SHA1");
	},

	sha1 : function(t)
	{
		var e, n, r, i, o, a, A, E, l, H = function(t, e) {
				var n = t << e | t >>> 32 - e;
				return n
			},
			s = function(t) {
				var e, n, r = "";
				for (e = 7; e >= 0; e--) n = t >>> 4 * e & 15, r += n.toString(16);
				return r
			},
			I = new Array(80),
			c = 1732584193,
			p = 4023233417,
			v = 2562383102,
			S = 271733878,
			u = 3285377520;
		//t = this.utf8_encode(t);
		var N = t.length,
			T = [];
		for (n = 0; N - 3 > n; n += 4) r = t.charCodeAt(n) << 24 | t.charCodeAt(n + 1) << 16 | t.charCodeAt(n + 2) << 8 | t.charCodeAt(n + 3), T.push(r);
		switch (N % 4) {
			case 0:
				n = 2147483648;
				break;
			case 1:
				n = t.charCodeAt(N - 1) << 24 | 8388608;
				break;
			case 2:
				n = t.charCodeAt(N - 2) << 24 | t.charCodeAt(N - 1) << 16 | 32768;
				break;
			case 3:
				n = t.charCodeAt(N - 3) << 24 | t.charCodeAt(N - 2) << 16 | t.charCodeAt(N - 1) << 8 | 128
		}
		for (T.push(n); T.length % 16 != 14;) T.push(0);
		for (T.push(N >>> 29), T.push(N << 3 & 4294967295), e = 0; e < T.length; e += 16) {
			for (n = 0; 16 > n; n++) I[n] = T[e + n];
			for (n = 16; 79 >= n; n++) I[n] = H(I[n - 3] ^ I[n - 8] ^ I[n - 14] ^ I[n - 16], 1);
			for (i = c, o = p, a = v, A = S, E = u, n = 0; 19 >= n; n++) l = H(i, 5) + (o & a | ~o & A) + E + I[n] + 1518500249 & 4294967295, E = A, A = a, a = H(o, 30), o = i, i = l;
			for (n = 20; 39 >= n; n++) l = H(i, 5) + (o ^ a ^ A) + E + I[n] + 1859775393 & 4294967295, E = A, A = a, a = H(o, 30), o = i, i = l;
			for (n = 40; 59 >= n; n++) l = H(i, 5) + (o & a | o & A | a & A) + E + I[n] + 2400959708 & 4294967295, E = A, A = a, a = H(o, 30), o = i, i = l;
			for (n = 60; 79 >= n; n++) l = H(i, 5) + (o ^ a ^ A) + E + I[n] + 3395469782 & 4294967295, E = A, A = a, a = H(o, 30), o = i, i = l;
			c = c + i & 4294967295, p = p + o & 4294967295, v = v + a & 4294967295, S = S + A & 4294967295, u = u + E & 4294967295
		}
		return l = s(c) + s(p) + s(v) + s(S) + s(u), l.toLowerCase()
	},

	md5 : function(t)
	{
		var e, n, r, i, o, a, A, E, l, H, s = function(t, e) {
				return t << e | t >>> 32 - e
			},
			I = function(t, e) {
				var n, r, i, o, a;
				return i = 2147483648 & t, o = 2147483648 & e, n = 1073741824 & t, r = 1073741824 & e, a = (1073741823 & t) + (1073741823 & e), n & r ? 2147483648 ^ a ^ i ^ o : n | r ? 1073741824 & a ? 3221225472 ^ a ^ i ^ o : 1073741824 ^ a ^ i ^ o : a ^ i ^ o
			},
			c = function(t, e, n) {
				return t & e | ~t & n
			},
			p = function(t, e, n) {
				return t & n | e & ~n
			},
			v = function(t, e, n) {
				return t ^ e ^ n
			},
			S = function(t, e, n) {
				return e ^ (t | ~n)
			},
			u = function(t, e, n, r, i, o, a) {
				return t = I(t, I(I(c(e, n, r), i), a)), I(s(t, o), e)
			},
			N = function(t, e, n, r, i, o, a) {
				return t = I(t, I(I(p(e, n, r), i), a)), I(s(t, o), e)
			},
			T = function(t, e, n, r, i, o, a) {
				return t = I(t, I(I(v(e, n, r), i), a)), I(s(t, o), e)
			},
			d = function(t, e, n, r, i, o, a) {
				return t = I(t, I(I(S(e, n, r), i), a)), I(s(t, o), e)
			},
			C = function(t) {
				for (var e, n = t.length, r = n + 8, i = (r - r % 64) / 64, o = 16 * (i + 1), a = new Array(o - 1), A = 0, E = 0; n > E;) e = (E - E % 4) / 4, A = E % 4 * 8, a[e] = a[e] | t.charCodeAt(E) << A, E++;
				return e = (E - E % 4) / 4, A = E % 4 * 8, a[e] = a[e] | 128 << A, a[o - 2] = n << 3, a[o - 1] = n >>> 29, a
			},
			L = function(t) {
				var e, n, r = "",
					i = "";
				for (n = 0; 3 >= n; n++) e = t >>> 8 * n & 255, i = "0" + e.toString(16), r += i.substr(i.length - 2, 2);
				return r
			},
			O = [],
			f = 7,
			D = 12,
			m = 17,
			h = 22,
			R = 5,
			g = 9,
			w = 14,
			B = 20,
			Y = 4,
			F = 11,
			M = 16,
			G = 23,
			U = 6,
			y = 10,
			Z = 15,
			P = 21;
		for (/*t = this.utf8_encode(t),*/ O = C(t), A = 1732584193, E = 4023233417, l = 2562383102, H = 271733878, e = O.length, n = 0; e > n; n += 16) r = A, i = E, o = l, a = H, A = u(A, E, l, H, O[n + 0], f, 3614090360), H = u(H, A, E, l, O[n + 1], D, 3905402710), l = u(l, H, A, E, O[n + 2], m, 606105819), E = u(E, l, H, A, O[n + 3], h, 3250441966), A = u(A, E, l, H, O[n + 4], f, 4118548399), H = u(H, A, E, l, O[n + 5], D, 1200080426), l = u(l, H, A, E, O[n + 6], m, 2821735955), E = u(E, l, H, A, O[n + 7], h, 4249261313), A = u(A, E, l, H, O[n + 8], f, 1770035416), H = u(H, A, E, l, O[n + 9], D, 2336552879), l = u(l, H, A, E, O[n + 10], m, 4294925233), E = u(E, l, H, A, O[n + 11], h, 2304563134), A = u(A, E, l, H, O[n + 12], f, 1804603682), H = u(H, A, E, l, O[n + 13], D, 4254626195), l = u(l, H, A, E, O[n + 14], m, 2792965006), E = u(E, l, H, A, O[n + 15], h, 1236535329), A = N(A, E, l, H, O[n + 1], R, 4129170786), H = N(H, A, E, l, O[n + 6], g, 3225465664), l = N(l, H, A, E, O[n + 11], w, 643717713), E = N(E, l, H, A, O[n + 0], B, 3921069994), A = N(A, E, l, H, O[n + 5], R, 3593408605), H = N(H, A, E, l, O[n + 10], g, 38016083), l = N(l, H, A, E, O[n + 15], w, 3634488961), E = N(E, l, H, A, O[n + 4], B, 3889429448), A = N(A, E, l, H, O[n + 9], R, 568446438), H = N(H, A, E, l, O[n + 14], g, 3275163606), l = N(l, H, A, E, O[n + 3], w, 4107603335), E = N(E, l, H, A, O[n + 8], B, 1163531501), A = N(A, E, l, H, O[n + 13], R, 2850285829), H = N(H, A, E, l, O[n + 2], g, 4243563512), l = N(l, H, A, E, O[n + 7], w, 1735328473), E = N(E, l, H, A, O[n + 12], B, 2368359562), A = T(A, E, l, H, O[n + 5], Y, 4294588738), H = T(H, A, E, l, O[n + 8], F, 2272392833), l = T(l, H, A, E, O[n + 11], M, 1839030562), E = T(E, l, H, A, O[n + 14], G, 4259657740), A = T(A, E, l, H, O[n + 1], Y, 2763975236), H = T(H, A, E, l, O[n + 4], F, 1272893353), l = T(l, H, A, E, O[n + 7], M, 4139469664), E = T(E, l, H, A, O[n + 10], G, 3200236656), A = T(A, E, l, H, O[n + 13], Y, 681279174), H = T(H, A, E, l, O[n + 0], F, 3936430074), l = T(l, H, A, E, O[n + 3], M, 3572445317), E = T(E, l, H, A, O[n + 6], G, 76029189), A = T(A, E, l, H, O[n + 9], Y, 3654602809), H = T(H, A, E, l, O[n + 12], F, 3873151461), l = T(l, H, A, E, O[n + 15], M, 530742520), E = T(E, l, H, A, O[n + 2], G, 3299628645), A = d(A, E, l, H, O[n + 0], U, 4096336452), H = d(H, A, E, l, O[n + 7], y, 1126891415), l = d(l, H, A, E, O[n + 14], Z, 2878612391), E = d(E, l, H, A, O[n + 5], P, 4237533241), A = d(A, E, l, H, O[n + 12], U, 1700485571), H = d(H, A, E, l, O[n + 3], y, 2399980690), l = d(l, H, A, E, O[n + 10], Z, 4293915773), E = d(E, l, H, A, O[n + 1], P, 2240044497), A = d(A, E, l, H, O[n + 8], U, 1873313359), H = d(H, A, E, l, O[n + 15], y, 4264355552), l = d(l, H, A, E, O[n + 6], Z, 2734768916), E = d(E, l, H, A, O[n + 13], P, 1309151649), A = d(A, E, l, H, O[n + 4], U, 4149444226), H = d(H, A, E, l, O[n + 11], y, 3174756917), l = d(l, H, A, E, O[n + 2], Z, 718787259), E = d(E, l, H, A, O[n + 9], P, 3951481745), A = I(A, r), E = I(E, i), l = I(l, o), H = I(H, a);
		var $ = L(A) + L(E) + L(l) + L(H);
		return $.toLowerCase()
	},

	/*utf8_encode: function(t) {
		if (null === t || "undefined" == typeof t) return "";
		var e, n, r = t + "",
			i = "",
			o = 0;
		e = n = 0, o = r.length;
		for (var a = 0; o > a; a++) {
			var A = r.charCodeAt(a),
				E = null;
			if (128 > A) n++;
			else if (A > 127 && 2048 > A) E = String.fromCharCode(A >> 6 | 192, 63 & A | 128);
			else if (A & !0) E = String.fromCharCode(A >> 12 | 224, A >> 6 & 63 | 128, 63 & A | 128);
			else {
				if (A & !0) throw new RangeError("Unmatched trail surrogate at " + a);
				var l = r.charCodeAt(++a);
				if (l & !0) throw new RangeError("Unmatched lead surrogate at " + (a - 1));
				A = ((1023 & A) << 10) + (1023 & l) + 65536, E = String.fromCharCode(A >> 18 | 240, A >> 12 & 63 | 128, A >> 6 & 63 | 128, 63 & A | 128)
			}
			null !== E && (n > e && (i += r.slice(e, n)), i += E, e = n = a + 1)
		}
		return n > e && (i += r.slice(e, o)), i
	},*/

};