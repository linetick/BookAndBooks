<?php
function getDbConnection() {
    static $db = null;
    
    if ($db === null) {
        $db = new PDO(
            'mysql:host=mysql;dbname=book_project',
            'book_user',
            'secret123',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]
        );
    }
    
    return $db;
