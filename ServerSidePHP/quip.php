<?php
header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET'); 

if (isset($_GET['a'])){
	//$find = file_get_contents('http://quipqiup.com/index.php?ciphertext='.urlencode($_GET['a']).'&clues=&mode=3&action=Solve');
	$host = "6n9n93nlr5.execute-api.us-east-1.amazonaws.com";
	//$path = "/prod/dict";
	$path = "/prod/solve";
	$url = "https://".$host.$path;

	$curly = curl_init();
	curl_setopt($curly, CURLOPT_URL,	 	$url);
	curl_setopt($curly, CURLOPT_HEADER,		0);
	//curl_setopt($curly, CURLOPT_HEADER,		1);
	curl_setopt($curly, CURLOPT_HTTPHEADER, array("Host: $host", 'Content-Type:application/json'));
	curl_setopt($curly, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($curly, CURLOPT_POST,		 1);
	curl_setopt($curly, CURLOPT_CUSTOMREQUEST, "POST");
	//curl_setopt($curly, CURLOPT_SSL_VERIFYHOST, 0);
	//curl_setopt($curly, CURLOPT_SSL_VERIFYPEER, 0);
	//curl_setopt($curly, CURLOPT_POSTFIELDS, '{"ciphertext":"'.addcslashes($_GET['a'],'"').'","clues":"","shards":3,"shardidx":0,"time":3}');
	curl_setopt($curly, CURLOPT_POSTFIELDS, '{"ciphertext":"'.addcslashes($_GET['a'],'"').'","clues":"","solve-spaces":false,"time":6}');
	$find = curl_exec($curly);

	curl_close($curly);

	//preg_match_all("#<script>solsum(.*?);</script>#", $find, $matches);
	preg_match_all('#plaintext\"\:\"([^\"]*)\"#', $find, $matches);
	foreach ($matches[1] as $match){
		echo '"'.$match . "\"\n";
	}
}
?>
