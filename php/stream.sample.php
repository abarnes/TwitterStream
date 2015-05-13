<?php
    if (!empty($_POST)) {
        require 'ctwitter_stream.php';

        $t = new ctwitter_stream();

        $t->login('', '', '', '');

        $t->start(explode(",",urldecode($_POST['keywords'])));
    }
?>