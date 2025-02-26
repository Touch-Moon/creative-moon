<?php
/**
 * The template for displaying all pages.
 *
 * This template handles the rendering of all WordPress pages using Timber.
 * It fetches post data, ACF fields, and other necessary context for the Twig templates.
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

// ✅ 최신 Timber 방식으로 컨텍스트 가져오기
$context = Timber::context();

// ✅ 현재 페이지의 포스트 데이터 가져오기
$context['post'] = Timber::get_post();
$post_id = $context['post']->ID; // ACF 사용 시 안전하게 ID를 가져오기

// ✅ ACF 필드 추가
$context['hero'] = get_field('hero', $post_id);
$context['widgets'] = get_field('widgets', $post_id);
$context['description_list_head'] = get_field('description_list_head', $post_id);
$context['description_list_tail'] = get_field('description_list_tail', $post_id);
$context['view_more_work'] = get_field('view_more_work', $post_id);
$context['page_title_h1'] = get_field('page_title_h1', $post_id); 

// ✅ 포트폴리오 데이터 추가 (Twig에서 `portfolio_data`를 사용하기 때문)
$portfolio_args = [
    'post_type'      => 'portfolio',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC'
];
$context['portfolio_data'] = Timber::get_posts($portfolio_args);

$portfolio_home_args = [
    'post_type'      => 'portfolio',
    'posts_per_page' => 6,
    'orderby'        => 'date',
    'order'          => 'DESC'
];
$context['portfolio_data'] = Timber::get_posts($portfolio_home_args);

// ✅ Body class 추가
if (is_page()) {
    $context['body_classes'][] = 'page-' . $context['post']->slug;
}

// ✅ 페이지 템플릿 렌더링
Timber::render(['page-' . $context['post']->post_name . '.twig', 'page.twig'], $context);