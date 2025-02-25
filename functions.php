<?php
/**
 * Timber starter-theme
 * https://github.com/timber/starter-theme
 */

// Load Composer dependencies.
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/StarterSite.php';

Timber\Timber::init();

// Sets the directories (inside your theme) to find .twig files.
Timber::$dirname = [ 'templates', 'views' ];

// 1️⃣ 메뉴 등록을 먼저 실행
function creative_moon_register_menus() {
    register_nav_menus([
        'primary_menu' => __('Primary Menu', 'creative-moon'),
        'extra_menu'   => __('Extra Menu', 'creative-moon'),
    ]);
}
add_action('after_setup_theme', 'creative_moon_register_menus');

// 2️⃣ Timber이 메뉴를 불러오도록 설정
function creative_moon_add_to_context($context) {
    // Timber에서 메뉴가 존재하는지 확인 후 가져오기
    $context['primary_menu'] = has_nav_menu('primary_menu') ? Timber::get_menu('primary_menu') : null;
    $context['extra_menu']   = has_nav_menu('extra_menu') ? Timber::get_menu('extra_menu') : null;

    error_log(print_r($context['primary_menu'], true)); // 로그 확인
    error_log(print_r($context['extra_menu'], true));   // 로그 확인

    return $context;
}
add_filter('timber/context', 'creative_moon_add_to_context');

new StarterSite();

error_log(print_r(Timber::get_menu('primary_menu'), true));

