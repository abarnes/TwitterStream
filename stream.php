<?php
    if (!empty($_POST)) {
        require 'ctwitter_stream.php';

        $t = new ctwitter_stream();

        $t->login('Consumer Key', 'Consumer Secret', 'Access Token', 'Access Secret');

        $t->start(explode(",",urldecode($_POST['keywords'])));
    }
?>