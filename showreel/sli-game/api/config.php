<?php

$config = array();

$config['salt']    = "aJp5wF9JlL6nf"; // The salt used for encrypting DB columns (changing this will render previously saved data inaccessible!)

// ---- Local ---------------------------------------

// $config['db_host'] = 'localhost:3306';
// $config['db_name'] = 'sli_drone';

// $config['db_user'] = 'root';
// $config['db_pass'] = 'root';

// ---- Stag ---------------------------------------

// $config['db_host'] = 'sldb';
// $config['db_name'] = 'dronegame';

// $config['db_user'] = 'dbuser';
// $config['db_pass'] = 'Numerous*Sea';


// ---- Live ---------------------------------------

$config['db_host'] = '162.13.14.45';
$config['db_name'] = 'dronegame';

$config['db_user'] = 'dbuser';
$config['db_pass'] = 'Numerous*Sea';