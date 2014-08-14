<?php

if (isset($_GET['files'])) {
    $newArray = array();

    foreach ($_FILES as $file) {
        $fileContents = file_get_contents($file['tmp_name']);
        $arr = array_map('trim', explode('\r\n', $fileContents));

        // if the file ends with '\r\n', the last element of the array will be empty.  remove it
        $lastSliceValue = end($arr);
        if (empty($lastSliceValue)) {
            array_pop($arr);
        }

        $arr_keys = array_shift($arr);
        $arr_keys = explode(',', $arr_keys);

        $master_keys = array('TRAIN_LINE', 'ROUTE_NAME', 'RUN_NUMBER', 'OPERATOR_ID');
        $master_key_index = array();
        foreach ($master_keys as $master_key) {
            $slice = array_search($master_key, $arr_keys);
            $master_key_index[$master_key] = $slice;
        }

        foreach ($arr as $a) {
            $x = explode(',', $a);
            $subarray = array();
            foreach ($master_key_index as $master_key => $slice) {
                $subarray[$master_key] = $x[$slice];
            }
            if (!in_array($subarray, $newArray)) {
                $newArray[] = $subarray;
            }
        }
    }

    foreach ($newArray as $key => $row) {
        $runNumber[$key] = $row['RUN_NUMBER'];
    }
    array_multisort($runNumber, SORT_ASC, $newArray);
    $q['schedule'] = $newArray;
    $json_data = json_encode($q);
    header('Content-type: application/json');
    echo $json_data;
}
?>