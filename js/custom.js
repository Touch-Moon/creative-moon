document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);
    // ✅ Locomotive Scroll 초기화
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".smooth-content"),
        smooth: true,
        lerp: 0.1, // 부드러운 스크롤 (기본값: 0.1, 낮을수록 부드러움)
        multiplier: 1, // 스크롤 속도 조절 (기본값: 1, 낮추면 느려짐)
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    console.log("[DEBUG] Locomotive Scroll 정상 실행됨:", locoScroll);



    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // ✅ 네비게이션 메뉴 호버 효과 (단일 이벤트 위임 사용)
    document.querySelector(".nav-parent")?.addEventListener("mouseover", function (e) {
        if (e.target.tagName === "A") {
            document.querySelectorAll(".nav-parent li a").forEach(a => a.style.opacity = a === e.target ? "1" : "0.2");
        }
    });

    document.querySelector(".nav-parent")?.addEventListener("mouseout", function () {
        document.querySelectorAll(".nav-parent li a").forEach(a => a.style.opacity = "1");
    });

    document.querySelector(".extra-menu > ul")?.addEventListener("mouseover", function (e) {
        if (e.target.tagName === "A") {
            document.querySelectorAll(".extra-menu > ul > li > a").forEach(a => a.style.opacity = a === e.target ? "1" : "0.2");
        }
    });

    document.querySelector(".extra-menu > ul")?.addEventListener("mouseout", function () {
        document.querySelectorAll(".extra-menu > ul > li > a").forEach(a => a.style.opacity = "1");
    });

    // ✅ 네비게이션 메뉴 클릭 이벤트 (최적화)
    let isAnimating = false;
    document.querySelector(".nav-ico")?.addEventListener("click", function () {
        if (isAnimating) return;
        isAnimating = true;

        let header = document.querySelector("#nav-main");
        let body = document.body;

        if (header.classList.contains("visible")) {
            header.classList.remove("visible");
            header.style.opacity = "0";
            header.style.visibility = "hidden";
            body.classList.remove("no-scroll");

            document.querySelectorAll(".nav-parent li .item a, .extra-menu ul li a").forEach(a => {
                a.style.transform = "translateY(100%)";
                a.style.transition = "0s";
                a.style.opacity = "0";
                a.classList.remove("animated");
            });

            document.querySelector(".nav-ico").classList.remove("nav-btn__active");
            isAnimating = false;
        } else {
            header.style.visibility = "visible";

            setTimeout(() => {
                header.classList.add("visible");
                header.style.opacity = "1";
                body.classList.add("no-scroll");
                document.querySelector(".nav-ico").classList.add("nav-btn__active");
                animateMenuItems();
            }, 10);
        }
    });

    function animateMenuItems() {
        let navItems = document.querySelectorAll("#nav-main ul.nav-parent > li > .item a");
        let extraItems = document.querySelectorAll(".extra-menu > ul > li > a");

        let totalNavItems = navItems.length;
        let totalExtraItems = extraItems.length;

        if (totalNavItems === 0 && totalExtraItems === 0) {
            isAnimating = false;
            return;
        }

        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = "translateY(0)";
                item.style.transition = "0.4s";
                item.style.opacity = "1";
                item.classList.add("animated");

                if (index === totalNavItems - 1) {
                    setTimeout(() => animateExtraItems(), 300);
                }
            }, index * 300);
        });

        if (totalNavItems === 0) animateExtraItems();
    }

    function animateExtraItems() {
        let extraItems = document.querySelectorAll(".extra-menu > ul > li > a");
        extraItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = "translateY(0)";
                item.style.transition = "0.4s";
                item.style.opacity = "1";
                item.classList.add("animated");

                if (index === extraItems.length - 1) {
                    isAnimating = false;
                }
            }, index * 300);
        });

        if (extraItems.length === 0) {
            isAnimating = false;
        }
    }

    const body = document.body;
    const blackElement = document.querySelector(".bg-change-black");
    const whiteElement = document.querySelector(".bg-change-white");
    const effectParent = document.querySelector(".effect");

    // ✅ 배경 색 변경 기능 (bg-change-black & bg-change-white)
    if (blackElement || whiteElement) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("bg-change-black")) {
                        body.classList.add("bg-black");
                        body.classList.remove("bg-white");
                    } else if (entry.target.classList.contains("bg-change-white")) {
                        body.classList.add("bg-white");
                        body.classList.remove("bg-black");
                    }
                } else {
                    if (entry.target.classList.contains("bg-change-black")) {
                        body.classList.remove("bg-black");
                    } else if (entry.target.classList.contains("bg-change-white")) {
                        body.classList.remove("bg-white");
                    }
                }
            });
        }, { rootMargin: "0px", threshold: 0.5 });

        if (blackElement) bgObserver.observe(blackElement);
        if (whiteElement) bgObserver.observe(whiteElement);
    }

    // ✅ `.effect` 애니메이션 기능 (뷰포트 감지 후 실행)
    if (effectParent) {
        const effectChildren = effectParent.querySelectorAll("[class^='effect__']");

        // ✅ 초기 스타일 설정 (뷰포트에 들어오기 전에는 보이지 않음)
        effectChildren.forEach(child => {
            child.style.opacity = "0";
            child.style.transform = "translateY(40%)";
            child.dataset.animated = "false"; // ✅ 애니메이션 실행 여부 추적
        });

        // ✅ IntersectionObserver 설정 (effect 애니메이션 전용)
        const effectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.dataset.animated === "false") {
                        entry.target.style.transition = `opacity 0.8s ease-out, transform 0.8s ease-out`;
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        entry.target.dataset.animated = "true"; // ✅ 애니메이션 실행 완료 상태
                    }
                } else {
                    if (entry.target.dataset.animated === "true") {
                        entry.target.style.transition = `opacity 0.5s ease-out, transform 0.5s ease-out`;
                        entry.target.style.opacity = "0.2";
                        entry.target.style.transform = "translateY(40%)";
                        entry.target.dataset.animated = "false"; // ✅ 다시 원래 상태로 변경
                    }
                }
            });
        }, { rootMargin: "0px", threshold: 0.5 });

        // ✅ 모든 `.effect__` 요소 감지 시작
        effectChildren.forEach(child => effectObserver.observe(child));
    }

    // ✅ ScrollTrigger 새로고침
    ScrollTrigger.refresh();
});