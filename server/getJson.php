<?php
/*
Nazwa bazy:	mardraz2_inz, inzynierka
Host do połączenia:	sql.s18.vdl.pl, 127.0.0.1
User:	mardraz2_inz, root
Hasło:	xfWQnef5, ''
*/
$host = 'sql.s18.vdl.pl';
$user = 'mardraz2_inz';
$pass = 'xfWQnef5';
$db = 'mardraz2_inz';

$link = mysql_connect($host, $user, $pass);
mysql_select_db($db);
//$link = pg_connect("host=127.0.0.1 port=5432 dbname=inzynierka user=marcin password=marcin");

function query($query){
	global $link;
	if(@$_REQUEST['page'] > 0){
		$perPage = 10;
		$limit = $perPage;
		$offset = $perPage*($_REQUEST['page']-1);
		//$query .= ' LIMIT '.$limit.' OFFSET '.$offset;
		$query .= ' LIMIT '.$limit.','.$offset;
	}
	//$res = pg_query($link, $query);
	$res = mysql_query($query) or die(mysql_error().' '.$query);
	return $res;
}

function fetch(&$res){
	return mysql_fetch_assoc($res);
}

header('Content-Type: application/json; Charset=UTF8');
header('Access-Control-Allow-Origin: *');

$data = null;
if(@$_REQUEST['data']){
	if($_REQUEST['data'] == 'busstop'){
		$data = array();
		$res = query('select * from busstop WHERE id IN (SELECT DISTINCT busstop_id FROM arrive)');
		while ($row = fetch($res)) {
			$latlon = explode(';',$row['position']);
			if(count($latlon) == 2){
				$row['lat'] = @$latlon[0];
				$row['lon'] = @$latlon[1];
				unset($row['position']);
				$data[] = $row;
              //break;//DEV
			}
		}
	}elseif($_REQUEST['data'] == 'arrives'){
		if(@$_REQUEST['busstop_id'] * 1 > 0){
			$data = array();
			$res = query('select a.*, b.name from arrive a LEFT JOIN line b ON a.line_id=b.id where a.busstop_id='.$_REQUEST['busstop_id']);
			while ($row = fetch($res)) {
				$data[] = $row;
			}
		}
	}
}elseif(@$_REQUEST['table']){
  $data = array();
  $res = query('select * from '.$_REQUEST['table']);
  while ($row = fetch($res)) {
      $data[] = $row;
  }
  
}
$response = array('success' => $data === null ? 0 : 1, 'data' => $data);
echo json_encode($response);


