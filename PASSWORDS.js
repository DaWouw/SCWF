//Newlines, trailing spaces and trailing tabs will be ignored!! (tokenized on spaces)
//'password','secret','pass','test','code','key' are already in the list in UserSettings.js
var brute_force_dictionary_keys_extra = `

cyberlympics
t0k3n
token
s3cr3t
s3cr3ts
GGoC
GGoCySEA
tang0
Warl0ck
wgcode
FSociety
Mark83a



`;




/* Other potentially interesting stuff for Cyberlympics?
FSociety
MUD
morpheus
tang0livelabs
megan
DarkLord
Targ3t*/























//Please leave this line in ;)
brute_force_dictionary_keys = brute_force_dictionary_keys.concat(brute_force_dictionary_keys_extra.split(/\s*\r?\n/).filter(function(n){ return n != '' }));
