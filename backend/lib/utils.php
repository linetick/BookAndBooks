<?php

function rate_limit(string $key, int $maxAttempts, int $periodSeconds): void {
    $storageDir = sys_get_temp_dir() . '/rate_limit';
    if (!file_exists($storageDir)) {
        mkdir($storageDir, 0777, true);
    }

    $filePath = $storageDir . '/' . md5($key) . '.json';

    $attempts = [];
    if (file_exists($filePath)) {
        $attempts = json_decode(file_get_contents($filePath), true) ?? [];
    }

    $now = time();
    $attempts = array_filter($attempts, fn($timestamp) => $timestamp > $now - $periodSeconds);
    if (count($attempts) >= $maxAttempts) {
        http_response_code(429);
        echo json_encode(['error' => 'Слишком много запросов. Попробуйте позже.']);
        exit;
    }

    $attempts[] = $now;
    file_put_contents($filePath, json_encode($attempts));
}

function log_login_attempt($login_or_email, $success) {
    $db = getDbConnection();
    $stmt = $db->prepare("INSERT INTO login_attempts (login_or_email, success, attempt_time) VALUES (?, ?, NOW())");
    $stmt->execute([$login_or_email, $success ? 1 : 0]);
}
