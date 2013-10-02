<?php

if (!empty($_GET['cmd'])) {

    if ($_GET['cmd'] == 'list') {
        $file_list = array();
        foreach (glob('*.js') as $file) {
            $file_list[] = $file;
        }
        sort($file_list);
        echo json_encode($file_list);
    }

}

?>
