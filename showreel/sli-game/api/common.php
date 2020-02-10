<?php

require './config.php';

date_default_timezone_set('GMT');

// initiates the request handling - should be called at the start of all requests
function init_call() {
	domain_check();
	session_check();

	$db = connect_database(); // Connect... to the... database...

	create_structure(); // Ensure the data tables exist
	process_action(); // Work how to respond

	send_message('error', array('reason' => 'none', 'message' => 'Something went wrong'));
}

// What it says on the tin
function connect_database() {
	global $config, $db;

	$db = new PDO(
		'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'],$config['db_user'],$config['db_pass']
	);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);

	return $db;
}

/**
 * 	Run SQL query
 *
 * 	$params must be numerically and sequentially indexed, with string values
 *
 * 	@param String $query Query statement
 * 	@param Array $params List of parameters to set in prepared statement
 *	@return PDOStatement
 * 	@throws PDOException
 */
function run_query($query, array $params = array()) {
	global $db;

	$statement = $db->prepare($query);

	// bind params if we have any
	foreach ($params as $key => $value) {
		$statement->bindValue($key + 1, $value, PDO::PARAM_STR);
	}

	$statement->execute();

	return $statement;

}

// Run a SQL query and return the number of lines returned
function count_query($query, array $params = array()) {
	$statement = run_query($query, $params);
	return count($statement->fetchAll(PDO::FETCH_OBJ));
}

// Check if at least one row returns from a SQL query
function exists_query($query, array $params = array()) {
	return (count_query($query, $params) > 0);
}

// Generated a unique ID
function make_id($base) {
	return substr(hash('md5', $base . microtime()), 0, 6);
}

// Check for and tidy up POST variables
function get_post($name = '', $clean = true) {
	if($name === '') {
		$return = array();

		foreach ($_POST as $key => $post) {
			$return[$key] = $clean ? clean_variable($post) : $post;
		}
		return $return;
	}

	if (!isset($_POST[$name])) {
		return '';
	}

	return $clean ? clean_variable($_POST[$name]) : $_POST[$name];
}

// Check for the presence of a session variable (contents don't actually matter)
function session_check() {
	if (!isset($_POST['session'])) {
		send_message('error', array('reason' => 'no_session_token','message' => 'No session token passed'));
	}
}

// Make it slightly harder for cross-domain access to the API
function domain_check() {
	if (!isset($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) == FALSE) {
		send_message('error', array('reason' => 'wrong_domain','message' => 'Cross-domain calls are not allowed'));
	}
}

// We've done all we can, pass feedback to the user now
function send_message($status, $message) {
	$GLOBALS['json_response']['status'] = $status;

	if(is_array($message)) {
		$GLOBALS['json_response'] = array_merge($GLOBALS['json_response'], $message);
	} else {
		$GLOBALS['json_response']['message'] = $message;
	}

	respond($GLOBALS['json_response']);
}

// Send a JSON response to the user
function respond($arr) {
	header('Content-Type: application/json');
	header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
	header('Cache-Control: post-check=0, pre-check=0', false);
	header('Pragma: no-cache');

	exit(json_encode($arr));
}

// Make sure there's nothing nasty in a user input
function clean_variable($variable) {
	$variable = base64_decode($variable);
	$packing_length = 5;

	$variable = substr($variable, $packing_length);
	$variable = substr($variable, 0, -1 * $packing_length);

	return mysql_escape_mimic(trim($variable));
}

// Clean nasty content from inputs
function mysql_escape_mimic($inp) {
	if (!empty($inp) && is_string($inp)) {
		return str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $inp);
	}

	return $inp;
}

// this unescapes then decodes a json string
// be aware that this will partially reverse some of the mysql escaping so using output in mysql statements is risky
function decode_json($json) {
	$json = stripslashes($json);

	if(get_magic_quotes_gpc()) {
	}
	return is_string($json) ? json_decode(str_replace('\"', '"', $json), true) : $json;
}

function get_ip() {
	$client  = @$_SERVER['HTTP_CLIENT_IP'];
	$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
	$remote  = $_SERVER['REMOTE_ADDR'];

	if(filter_var($client, FILTER_VALIDATE_IP)) {
		$ip = $client;
	} elseif(filter_var($forward, FILTER_VALIDATE_IP)) {
		$ip = $forward;
	} else {
		$ip = $remote;
	}

	return clean_variable($ip);
}

function get($id) {
	if (isset($_POST[$id])) {
		return clean_variable($_POST[$id]);
	} else {
		return false;
	}
}