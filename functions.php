<?php
/**
 * Timber starter-theme
 * https://github.com/timber/starter-theme
 */

// ✅ 1️⃣ Composer Autoload 로드
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/StarterSite.php';

// ✅ 2️⃣ Timber 클래스가 존재하는지 확인
if (!class_exists('Timber\Timber')) {
    add_action('admin_notices', function () {
        echo '<div class="error"><p>Timber not activated. Please install Timber via Composer.</p></div>';
    });
    return;
}

// ✅ 3️⃣ Timber 초기화
Timber\Timber::init();

// ✅ 4️⃣ Timber이 Twig 파일을 찾을 경로 설정
Timber::$dirname = ['templates', 'views'];

// ✅ 5️⃣ 메뉴 등록
function creative_moon_register_menus() {
    register_nav_menus([
        'primary_menu' => __('Primary Menu', 'creative-moon'),
        'extra_menu'   => __('Extra Menu', 'creative-moon'),
    ]);
}
add_action('after_setup_theme', 'creative_moon_register_menus');


// ✅ 6️⃣ Timber이 메뉴 데이터를 가져오도록 설정
function creative_moon_add_to_context($context) {
    // 네임스페이스 포함해서 Timber 메뉴 가져오기
    $context['primary_menu'] = has_nav_menu('primary_menu') ? Timber\Timber::get_menu('primary_menu') : null;
    $context['extra_menu']   = has_nav_menu('extra_menu') ? Timber\Timber::get_menu('extra_menu') : null;

    return $context;
}
add_filter('timber/context', 'creative_moon_add_to_context');

function get_portfolio_data($limit = -1) {
    $args = [
        'post_type'      => 'portfolio',
        'posts_per_page' => $limit, // ✅ 원하는 개수를 동적으로 설정 가능
        'orderby'        => 'date',
        'order'          => 'DESC'
    ];

    $portfolio_posts = \Timber\Timber::get_posts($args);
    $portfolio_items = [];

    foreach ($portfolio_posts as $post) {
        $image_id = get_field('image', $post->ID) ?: ''; // ACF 필드 (이미지 ID)
        $image_src = $image_id ? Timber\Image($image_id)->src : ''; // TimberImage 변환

        $portfolio_items[] = [
            'title_list'    => $post->title,
            'sub_title_list' => get_field('sub_title', $post->ID) ?: '',
            'image_list'    => $image_src,
            'link'          => $post->link
        ];
    }

    return $portfolio_items;
}

// ✅ 7️⃣ 포트폴리오 데이터를 추가하는 별도 함수 생성 (함수 이름 변경)
function creative_moon_add_portfolio_to_context($context) {
    $context['portfolio_data'] = get_portfolio_data();
    return $context;
}
add_filter('timber/context', 'creative_moon_add_portfolio_to_context');

// ✅ 7️⃣ StarterSite 클래스 실행
new StarterSite();