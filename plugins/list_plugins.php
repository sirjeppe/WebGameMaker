<?php

$file_list = array();
foreach (glob('*.js') as $file) {
    $file_list[] = $file;
}
echo json_encode($file_list);
