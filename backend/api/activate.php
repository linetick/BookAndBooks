<?php
require_once __DIR__.'/../lib/db.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo "Неверный токен активации.";
    exit;
}

$db = getDbConnection();

$stmt = $db->prepare("SELECT id FROM users WHERE activation_token = ? AND is_active = 0");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    echo "Неверный или уже использованный токен.";
    exit;
}

$stmt = $db->prepare("UPDATE users SET is_active = 1, activation_token = NULL WHERE id = ?");
$stmt->execute([$user['id']]);

echo "Аккаунт успешно активирован!";
