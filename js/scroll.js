document.addEventListener("DOMContentLoaded", function () {
    if (typeof LocomotiveScroll !== "undefined") {
        console.log("[DEBUG] Locomotive Scroll 감지됨!");

        window.locoScroll = new LocomotiveScroll({
            el: document.querySelector(".smooth-content"),
            smooth: true,
            lerp: 0.7, // ✅ 부드러운 스크롤 (기본값: 0.1, 낮을수록 부드러움)
            multiplier: 1, // ✅ 스크롤 속도 조절
            smartphone: { smooth: true },
            tablet: { smooth: true },
            scrollbarContainer: false, // ✅ 기본 스크롤바 비활성화
        });

        // ✅ span.c-scrollbar 요소 제거
        let locoScrollbar = document.querySelector("span.c-scrollbar");
        if (locoScrollbar) {
            locoScrollbar.remove();
        }

        const parallaxImage = document.querySelector(".home--moon__img img");
        const parallaxContainer = document.querySelector(".home--moon");

        if (parallaxImage && parallaxContainer) {
            let ticking = false;

            window.locoScroll.on("scroll", (args) => {
                let scrollY = args.scroll.y; // ✅ 현재 스크롤 값 가져오기
                let containerOffset = parallaxContainer.offsetTop; // ✅ 컨테이너 위치 계산

                let speedFactor = window.innerWidth <= 575.98 ? -0.1 : -0.5;
                let translateY = (scrollY - containerOffset) * speedFactor;
                let adjustedTranslateY = `calc(-50% + ${translateY}px)`; // ✅ 초기 위치 조정

                if (!ticking) {
                    requestAnimationFrame(() => {
                        parallaxImage.style.transform = `translateX(-50%) translateY(${adjustedTranslateY}) scale(1.2)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        // ✅ Locomotive Scroll과 ScrollTrigger 동기화 (스크롤 업데이트 최적화)
        window.locoScroll.on("scroll", ScrollTrigger.update);

        // ✅ GSAP ScrollTrigger 새로고침 (중복 호출 방지)
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);

    } else {
        console.error("[ERROR] Locomotive Scroll이 로드되지 않았습니다.");
    }
});


$(document).ready(function () {
    const $effectClasses = $(".effect_class"); // ✅ 여러 개의 `.effect_class` 감지
    const $effectClassEarly = $(".effect_class_early");

    function checkEffectVisibility($el) {
        if (!$el.length) return false;
        let rect = $el[0].getBoundingClientRect();
        let windowHeight = $(window).height();
        return rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
    }

    function updateEffectClass() {
        requestAnimationFrame(() => {
            $effectClasses.each(function () {
                let $this = $(this);
                let isVisible = checkEffectVisibility($this);
                $this.toggleClass("active", isVisible);
            });

            $effectClassEarly.each(function () {
                let $this = $(this);
                let isVisible = checkEffectVisibility($this);

                // ✅ `.home--title`이 보이면 `.effect_class_early`에서 `.active` 삭제
                if ($(".home--title").length && checkEffectVisibility($(".home--title"))) {
                    $this.removeClass("active");
                }
                // ✅ 한 번만 `.active` 추가 (뷰포트를 벗어나도 유지)
                else if (isVisible && !$this.hasClass("active")) {
                    $this.addClass("active");
                }
            });
        });
    }

    // ✅ 배경 변경 기능 (bg-change-black & bg-change-white)
    function updateBackgroundClass() {
        requestAnimationFrame(() => {
            let newClass = ""; // 추가할 클래스 저장
            let lastVisibleElement = null; // 가장 마지막으로 감지된 요소

            $(".bg-change-black, .bg-change-white").each(function () {
                let rect = this.getBoundingClientRect();
                let windowHeight = $(window).height();

                // ✅ 575.98px 이하(모바일) / 576px 초과(데스크탑) 구분
                let topThreshold = window.innerWidth <= 575.98 ? 0.3 : 0.7; // 모바일은 30%, 데스크탑은 70%
                let bottomThreshold = window.innerWidth <= 575.98 ? 0.2 : 0.2; // 모바일은 20%, 데스크탑은 30%

                if (rect.top < windowHeight * topThreshold && rect.bottom > windowHeight * bottomThreshold) {
                    lastVisibleElement = $(this); // 가장 마지막으로 감지된 요소 저장
                }
            });

            // ✅ 마지막으로 감지된 요소 기준으로 클래스 변경
            if (lastVisibleElement) {
                if (lastVisibleElement.hasClass("bg-change-black")) {
                    newClass = "bg-black";
                } else if (lastVisibleElement.hasClass("bg-change-white")) {
                    newClass = "bg-white";
                }
            }

            // ✅ 기존 클래스와 동일하면 변경하지 않음
            if (newClass && !$("body").hasClass(newClass)) {
                $("body").removeClass("bg-black bg-white").addClass(newClass);
            }
        });
    }

    // ✅ Locomotive Scroll이 존재하는 경우 jQuery 스크롤 이벤트 실행 차단
    if (typeof window.locoScroll !== "undefined") {
        console.log("[DEBUG] Locomotive Scroll 활성화됨, jQuery scroll 이벤트 실행 차단");
        window.locoScroll.on("scroll", function () {
            updateEffectClass();
            updateBackgroundClass();
        });
    } else {
        // ✅ Locomotive Scroll이 없을 경우 jQuery 스크롤 이벤트 실행
        $(window).on("scroll", function () {
            updateEffectClass();
            updateBackgroundClass();
        });
    }

    // ✅ MutationObserver로 동적 요소 감지 (예: AJAX 로드 시)
    const observer = new MutationObserver(() => {
        updateEffectClass();
        updateBackgroundClass();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ✅ 초기 실행 시 체크
    updateEffectClass();
    updateBackgroundClass();
});

// ✅ body height를 실시간으로 업데이트하는 함수 (최적화 적용)
function updateBodyHeight() {
    const smoothContent = document.querySelector(".smooth-content");
    if (!smoothContent) return;

    let newHeight = smoothContent.scrollHeight;

    // ✅ 기존 값과 동일하면 업데이트하지 않음 (불필요한 연산 방지)
    if (document.body.style.height === `${newHeight}px`) return;

    document.body.style.height = `${newHeight}px`;

    // ✅ Locomotive Scroll 업데이트 (requestAnimationFrame 사용)
    requestAnimationFrame(() => {
        if (typeof window.locoScroll !== "undefined") {
            window.locoScroll.update();
        }
    });

    // ✅ ScrollTrigger 업데이트 최소화
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
}

// ✅ 최초 실행 (한 번만 실행)
setTimeout(() => {
    updateBodyHeight();
}, 2000);

// ✅ 브라우저 리사이즈 시 높이 업데이트 (디바운싱 적용)
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateBodyHeight();
    }, 300);
});

// ✅ Lazy Load 이미지 감지 (MutationObserver 최적화)
function observeLazyImages() {
    const lazyImages = document.querySelectorAll(".lazy");
    if (lazyImages.length > 0) {
        const observer = new MutationObserver((mutations, obs) => {
            updateBodyHeight();
            obs.disconnect(); // ✅ MutationObserver 해제 (중복 실행 방지)
        });

        lazyImages.forEach(img => {
            observer.observe(img, { attributes: true, attributeFilter: ['src', 'data-src', 'class'] });
        });
    }
}

// ✅ DOM 변경 감지 (MutationObserver 최적화)
const domObserver = new MutationObserver((mutations) => {
    updateBodyHeight();
});

// ✅ MutationObserver 실행 (최초 1회 실행)
domObserver.observe(document.body, { childList: true, subtree: true });

// ✅ 초기 실행 시 Lazy Load 감지 시작
observeLazyImages();
