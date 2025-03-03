document.addEventListener("DOMContentLoaded", function () {


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

    document.querySelector(".hover-animation-parent")?.addEventListener("mouseover", function (e) {
        if (e.target.tagName === "A") {
            document.querySelectorAll(".hover-animation-parent li a").forEach(a => a.style.opacity = a === e.target ? "1" : "0.2");
        }
    });

    document.querySelector(".hover-animation-parent")?.addEventListener("mouseout", function () {
        document.querySelectorAll(".hover-animation-parent li a").forEach(a => a.style.opacity = "1");
    });



    // ✅ 네비게이션 메뉴 클릭 이벤트 (Plastic.design 스타일 애니메이션 적용)
    let isAnimating = false;

    document.querySelector(".nav-ico")?.addEventListener("click", function () {
        if (isAnimating) return;
        isAnimating = true;

        let header = document.querySelector("#nav-main");
        let body = document.body;
        let navItems = document.querySelectorAll("#nav-main .nav-parent > li .item a");
        let navContainers = document.querySelectorAll("#nav-main .nav-parent > li .item");
        let navLogoItem = document.querySelector(".nav-logo .item");
        let navTextMasks = document.querySelectorAll(".nav-logo .item .nav-text-mask");
        let navTextItems = document.querySelectorAll(".nav-logo .item .nav-text-mask .nav-text-item");
        let extraMenu = document.querySelector(".extra-menu");
        let contactAddress = document.querySelector(".nav-contact-address");
        let logoMoon = document.querySelector(".Logo_Moon"); // ✅ `.Logo_Moon` 선택

        let isMenuOpen = header.classList.contains("visible");

        if (isMenuOpen) {
            // ✅ 메뉴 닫기
            header.classList.remove("visible");
            header.style.opacity = "0";
            header.style.visibility = "hidden";
            body.classList.remove("no-scroll");

            document.querySelector(".nav-ico").classList.remove("nav-btn__active");

            // ✅ `.nav-parent > li .item a` 닫기 애니메이션 (순차적 적용)
            gsap.to(navItems, {
                y: -10,
                opacity: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "power2.out"
            });

            gsap.to(navContainers, {
                y: -10,
                opacity: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    isAnimating = false;
                }
            });

            gsap.to(extraMenu, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    extraMenu.style.visibility = "hidden";
                }
            });

            gsap.to(contactAddress, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    contactAddress.style.visibility = "hidden";
                }
            });

            // ✅ `.Logo_Moon`에서 `.active` 클래스 제거
            logoMoon?.classList.remove("active");

            navLogoItem?.classList.remove("active");

            navTextItems.forEach((textItem, index) => {
                setTimeout(() => {
                    textItem.style.transform = "translateY(100%)";
                    textItem.style.transition = "all";
                    textItem.style.opacity = "0";
                }, index * 150);
            });

        } else {
            // ✅ 메뉴 열기
            header.style.visibility = "visible";

            setTimeout(() => {
                header.classList.add("visible");
                header.style.opacity = "1";
                body.classList.add("no-scroll");
                document.querySelector(".nav-ico").classList.add("nav-btn__active");

                gsap.fromTo(navItems,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.5,
                        ease: "power2.out"
                    });

                gsap.fromTo(navContainers,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            setTimeout(() => {
                                extraMenu.style.visibility = "visible";
                                gsap.to(extraMenu, {
                                    opacity: 1,
                                    duration: 0.4,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        setTimeout(() => {
                                            contactAddress.style.visibility = "visible";
                                            gsap.to(contactAddress, {
                                                opacity: 1,
                                                duration: 0.4,
                                                ease: "power2.out",
                                                onComplete: () => {
                                                    isAnimating = false;
                                                }
                                            });
                                        }, 400);
                                    }
                                });
                            }, 400);
                        }
                    });

                // ✅ `.Logo_Moon`에 `.active` 클래스 추가
                logoMoon?.classList.add("active");

                navLogoItem?.classList.add("active");

                navTextMasks.forEach((mask, index) => {
                    setTimeout(() => {
                        let textItem = mask.querySelector(".nav-text-item");
                        if (textItem) {
                            textItem.style.transform = "translateY(0)";
                            textItem.style.transition = "0.4s ease-out";
                            textItem.style.opacity = "1";
                        }
                    }, index * 200);
                });

            }, 10);
        }
    });



    // ✅ Lazy Load 이미지 감지 (MutationObserver 최적화)
    function observeLazyImages() {
        const lazyImages = document.querySelectorAll(".lazy");
        if (lazyImages.length > 0) {
            const observer = new MutationObserver((mutations, obs) => {
                console.log("[DEBUG] Lazy Loaded 이미지 감지됨, height 업데이트 실행...");
                updateBodyHeight(); // ✅ 단 한 번 실행
                obs.disconnect(); // ✅ MutationObserver 해제 (중복 실행 방지)
            });

            lazyImages.forEach(img => {
                observer.observe(img, { attributes: true, attributeFilter: ['src', 'data-src', 'class'] });
            });
        }
    }

    // ✅ `.expand` 클래스를 감지하여 body height 업데이트
    const titleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class" && homeTitle.classList.contains("expand")) {
                updateBodyHeight();
            }
        });
    });


    // ✅ DOM 변경 감지 (MutationObserver 최적화)
    const domObserver = new MutationObserver((mutations, obs) => {
        console.log("[DEBUG] DOM 변화 감지됨, height 업데이트 실행...");
        updateBodyHeight(); // ✅ 단 한 번 실행

        // ✅ MutationObserver 해제 후 일정 시간 후 다시 실행 (무한 호출 방지)
        obs.disconnect();
        setTimeout(() => {
            domObserver.observe(document.body, { childList: true, subtree: true });
        }, 500); // ✅ 500ms 후 다시 감지 시작
    });

    // ✅ MutationObserver 실행 (최초 1회 실행)
    domObserver.observe(document.body, { childList: true, subtree: true });

    // ✅ 초기 실행 시 Lazy Load 감지 시작
    observeLazyImages();

    // ✅ 최초 로드 후 높이 업데이트 (0.5초 후 실행)
    setTimeout(() => {
        updateBodyHeight();
    }, 2000);
});

function applyMaskCircleEffect() {
    if ($(window).width() <= 575.98) {
        setTimeout(function () {
            $(".mask-circle").css("opacity", "0");
        }, 2200);
    } else {
        $(".mask-circle").css("opacity", ""); // 너비가 커지면 원래 상태로 복귀
    }
}

$(document).ready(function () {
    applyMaskCircleEffect(); // ✅ 페이지 로드 시 실행

    $(window).on("resize", function () {
        applyMaskCircleEffect(); // ✅ 브라우저 크기 변경 시 실행
    });
});

//Title animation
document.addEventListener("DOMContentLoaded", function () {
    const baseTitle = document.querySelector(".hero--title__base");
    const aniTitle = document.querySelector(".hero--title__ani");
    const homeTitle = document.querySelector(".hero--title");
    const crescent = document.querySelector(".crescent");

    if (baseTitle && aniTitle && homeTitle) {
        let words = baseTitle.innerText.trim().split(" ");

        // 단어별 `<div>`로 감싸기
        aniTitle.innerHTML = words.map(word =>
            `<div class="hero--title__word">
                <div class="hero--title__word-child">${word}</div>
            </div>`
        ).join(" ");

        // 애니메이션 실행 (딜레이 적용)
        let wordElements = aniTitle.querySelectorAll(".hero--title__word-child");
        let lastWordIndex = wordElements.length - 1;

        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add("animate");

                // 마지막 단어 애니메이션이 끝난 후 `.expand` 클래스 추가
                if (index === lastWordIndex) {
                    setTimeout(() => {
                        crescent.classList.add("active");
                    }, 600);
                }
            }, index * 150);
        });

        baseTitle.remove();
    }
});

$(document).ready(function () {
    setTimeout(function () {
        $(".ani-load").addClass("ani-loaded");
    });
});