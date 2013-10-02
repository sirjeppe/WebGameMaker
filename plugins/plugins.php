<?php

$installed_plugins_list = 'installed_plugins.js';


/*
* Function to list installed plugins
* Returns a JSON object
*/
function list_plugins() {
    global $installed_plugins_list;
    $file_list = array();
    foreach (glob('*.js') as $file) {
        if ($file != $installed_plugins_list) {
            $file_list[] = $file;
        }
    }
    sort($file_list);
    return json_encode($file_list, JSON_PRETTY_PRINT);
}


/*
* Actions
*/
if (!empty($_GET['cmd']) || !empty($argv[1])) {

    $cmd = (!empty($_GET['cmd'])) ? $_GET['cmd'] : $argv[1];

    /*
    * Simply list all installed plugins (online mode)
    */
    if ($cmd == 'list') {
        echo list_plugins();
    }

    /*
    * Write $installed_plugins_list to be used by "offline mode" plugins listing
    */
    if ($cmd == 'install') {
        $installedPlugins = 'WebGameMaker.setup.installedPlugins = '.list_plugins();
        $f = fopen($installed_plugins_list, 'w+');
        fwrite($f, $installedPlugins);
        fclose($f);
    }

}

?>
