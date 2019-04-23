<?php
header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET'); 

if (isset($_GET['a'])){
	$find = file_get_contents('http://www.quinapalus.com/cgi-bin/playfair?plt=&cpt='.urlencode($_GET['a']).'&dict=0&ent=Search');
	preg_match_all("#(?:<tt>)([^<]*)(?:<\/tt>)#", $find, $matches);
	for($i = 0; $i < 20 && $i < sizeof($matches[0]); $i+=2) {
		echo '"'.str_ireplace(array('<tt>','</tt>'), null, $matches[0][$i]).'|'.str_ireplace(array('<tt>','</tt>'), null, $matches[0][$i+1])."\"\n";
	}
}
?>
