<?php
set_time_limit(120);
ini_set('default_socket_timeout', 120);

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET'); 

define('BLOCK_SIZE', 16);		//This can also be 4 or any multiple

//http://www.phpied.com/simultaneuos-http-requests-in-php-with-curl/
function multiRequest($data, $options = array())
{
	// Will I need this?: http://www.onlineaspect.com/2009/01/26/how-to-use-curl_multi-without-blocking/

	// array of curl handles
	$curly = array();
	// data to be returned
	$result = array();

	// multi handle
	$mh = curl_multi_init();

	// loop through $data and create curl handles
	// then add them to the multi-handle
	foreach ($data as $id => $d) {

		$curly[$id] = curl_init();

		$url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;
		curl_setopt($curly[$id], CURLOPT_URL,			 $url);
		curl_setopt($curly[$id], CURLOPT_HEADER,		 0);
		curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);

    	// post?
		if (is_array($d)) {
			if (!empty($d['post'])) {
				curl_setopt($curly[$id], CURLOPT_POST,		 1);
				curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $d['post']);
				curl_setopt($curly[$id], CURLOPT_CONNECTTIMEOUT, 120); 
				curl_setopt($curly[$id], CURLOPT_TIMEOUT,	 120);
				//curl_setopt($curly[$id], CURLOPT_HTTPPROXYTUNNEL, true);
				//curl_setopt($curly[$id], CURLOPT_PROXY,		 'http://localhost:6868');
			}
		}

    	// extra options?
		if (!empty($options)) {
			curl_setopt_array($curly[$id], $options);
		}

		curl_multi_add_handle($mh, $curly[$id]);
	}

	// execute the handles
	$running = null;
	do {
		curl_multi_exec($mh, $running);
	} while($running > 0);


	// get content and remove handles
	foreach($curly as $id => $c) {
		$result[$id] = curl_multi_getcontent($c);
		curl_multi_remove_handle($mh, $c);
	}

	// all done
	curl_multi_close($mh);

	return $result;
}



if (isset($_GET['a']))
{
	$from_range = isset($_GET['f']) && $_GET['f']>=2 && $_GET['f']<=14?$_GET['f']:5;
	$to_range 	= isset($_GET['t']) && $_GET['t']>=3 && $_GET['t']<=15?$_GET['t']:9;
	
	if($from_range >= $to_range) return;
	$diff_range = ceil(($to_range - $from_range)/BLOCK_SIZE);
	
	for($d = 0; $d < $diff_range; $d++)
	{
		$data = array();
		
		$now_from_range = $from_range+$d*BLOCK_SIZE;
		$now_to_range = $from_range+($d+1)*BLOCK_SIZE;
		for($i = $now_from_range; $i < $to_range && $i < $now_to_range; $i++) {
			/*$post = array(
							'__EVENTTARGET' => '',
							'__EVENTARGUMENT' => '',
							'__VIEWSTATE' => '/wEPDwULLTE1OTUxODk4NzVkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQtLZXlLbm93blllcwUTS2V5S25vd25Ob1NpemVLbm93bgUTS2V5S25vd25Ob1NpemVLbm93bgUKS2V5S25vd25ObwUKS2V5S25vd25Ob4CsqEC7E/h4r0QKF5BhzAO12Ew2',
							'__VIEWSTATEGENERATOR' => '3773DB32',
							'__EVENTVALIDATION' => '/wEWDQLIx7miDQL+rZa1DwLF9aauBQKCgfTXCQKFoeqeAwKeyrONDgKJgeHVCQLfjMXtCwK6oPefAwLM9cyPDALTnbbDBALIg+/HCgLnpLkgsEk/s5/S/hhQgiXIYo3SYzTjFR0=',
							'EncryptedText' => urlencode(isset($_GET['raw'])?$_GET['a']:preg_replace('/\s+/', '',$_GET['a'])),
							'Key' => '',
							'KeyKnownRadioList' => 'KeyKnownNoSizeKnown',
							'KeySizeKnown' => $i,
							'ButtonCodebreak' => 'Codebreak!',
							'KeyGuess' => '',
							'Message' => '',
							'authbox$usernameInput' => '',
							'authbox$passwordInput' => ''
						);*/
			$post = array(
							'__EVENTTARGET' => '',
							'__EVENTARGUMENT' => '',
							'__VIEWSTATE' => '/wEPDwULLTEwMDUxMTE5MDcPZBYCAgQPZBYIAgQPZBYEAgEPDxYEHgRUZXh0BRpOZXdlc3QgdXBkYXRlcyAoMy8zMS8yMDE3KR4LUG9zdEJhY2tVcmwFNGh0dHA6Ly93d3cubXlnZW9jYWNoaW5ncHJvZmlsZS5jb20vZGVmYXVsdC5hc3B4I25ld3NkZAIDDxYCHwAFigI8ZGl2IGlkPSJhdXRoZW50aWNhdGlvbkhlYWRlclRleHQiPjxhIGlkPSdzaWduSW5MaW5rJyBjbGFzcz0naGVhZGVyTGluaycgaHJlZj0naHR0cDovL3d3dy5teWdlb2NhY2hpbmdwcm9maWxlLmNvbS9sb2dpbnBhZ2UuYXNweCc+U0lHTiBJTjwvYT4gb3IgPGEgaWQ9J3NpZ25JbkxpbmsnIGNsYXNzPSdoZWFkZXJMaW5rJyBocmVmPSdodHRwOi8vd3d3Lm15Z2VvY2FjaGluZ3Byb2ZpbGUuY29tL2NyZWF0ZWxvZ2luLmFzcHgnPkNSRUFURSBBQ0NPVU5UPC9hPjwvZGl2PmQCCQ8QDxYCHgdDaGVja2VkaGRkZGQCDQ8QDxYCHwJnZGRkZAIRDxAPFgIfAmhkZGRkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQtLZXlLbm93blllcwULS2V5S25vd25ZZXMFE0tleUtub3duTm9TaXplS25vd24FCktleUtub3duTm8FCktleUtub3duTm+Y7ibcAEO8E0qiR7H6fOIEDFo4Cg==',
							'__VIEWSTATEGENERATOR' => '3773DB32',
							'__EVENTVALIDATION' => '/wEWCwLg1MmlAgKArYCODwL+rZa1DwLF9aauBQKCgfTXCQKFoeqeAwKeyrONDgKJgeHVCQLfjMXtCwK6oPefAwLM9cyPDHQlFn7pfXiiusxXEhCVgSQmXrKI',
							'EncryptedText' => urlencode(isset($_GET['raw'])?$_GET['a']:preg_replace('/\s+/', '',$_GET['a'])),
							'Key' => '',
							'KeyKnownRadioList' => 'KeyKnownNoSizeKnown',
							'KeySizeKnown' => $i,
							'ButtonCodebreak' => 'Codebreak!',
							'KeyGuess' => '',
							'Message' => '',
							'authbox$usernameInput' => '',
							'authbox$passwordInput' => ''
						);
			array_push($data, array('url'=>'http://www.mygeocachingprofile.com/codebreaker.vigenerecipher.aspx','post'=>$post));
		}
		
		$r = multiRequest($data);
		
		for($i = 0; $i < sizeof($r); $i++) {
			if(sizeof($r[$i])) {
				preg_match_all("~(?:MESSAGE w\/Key \#)(?:[\d]+)(?: = ')([^']*)(?:' ----------------)([^-]+)~", $r[$i], $matches);
				if($matches) {
					for($j = 0; $j < 3 && $j < sizeof($matches[0]); $j++) {
						echo '"'.$matches[1][$j].'|'.preg_replace('~[\r\n]+~', '', $matches[2][$j])."\"\n";
					}
				}
			}
		}
	}

}

//POST /codebreaker.vigenerecipher.aspx HTTP/1.1
//Host: www.mygeocachingprofile.com
//User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0
//Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
//Accept-Language: nl,en-US;q=0.7,en;q=0.3
//Accept-Encoding: gzip, deflate
//Referer: http://www.mygeocachingprofile.com/codebreaker.vigenerecipher.aspx
//Connection: keep-alive
//Content-Type: application/x-www-form-urlencoded
//Content-Length: 799
//
//__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwULLTE1OTUxODk4NzVkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQtLZXlLbm93blllcwUTS2V5S25vd25Ob1NpemVLbm93bgUTS2V5S25vd25Ob1NpemVLbm93bgUKS2V5S25vd25ObwUKS2V5S25vd25Ob4CsqEC7E%2Fh4r0QKF5BhzAO12Ew2&__VIEWSTATEGENERATOR=3773DB32&__EVENTVALIDATION=%2FwEWDQLIx7miDQL%2BrZa1DwLF9aauBQKCgfTXCQKFoeqeAwKeyrONDgKJgeHVCQLfjMXtCwK6oPefAwLM9cyPDALTnbbDBALIg%2B%2FHCgLnpLkgsEk%2Fs5%2FS%2FhhQgiXIYo3SYzTjFR0%3D&EncryptedText=avzfzixexmjoirfpzkshdcalltcsuntdfmeufvjkhadpvvyedklwihvnrwfklwnxyckszilfzrfwxhulaimrjqlthbhqvrttrcpmowngzryewtwdvvvpkldbagpwvffnfljigtkwiengavzminlnhaycjqkjvyonzhysevglfrmodv&Key=&KeyKnownRadioList=KeyKnownNoSizeKnown&KeySizeKnown=10&ButtonCodebreak=Codebreak%21&KeyGuess=&Message=&authbox%24usernameInput=&authbox%24passwordInput=





?>

