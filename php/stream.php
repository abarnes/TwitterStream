<?php
    if (!empty($_POST)) {
        require 'ctwitter_stream.php';

        $t = new ctwitter_stream();

        $t->login('8evp889aLkMGoSlclgwAQ', 'Nd6n46KgpJtiXFqPfYmfyPdUvAVVDC1v23RaGeEUQ', '776436404-BoonOoIfuxtcEi0oyzT0QfcRKk2itB8ovbKjkocS', 'F2OgsJineixSVINW0zYtfulkWCdbuO7JSDOHhsJ2Ko');

        $t->start(explode(",",urldecode($_POST['keywords'])));
    }
?>