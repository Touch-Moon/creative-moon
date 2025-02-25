$(document).ready(function () {

    // Navbar hover effect
    $(".nav-parent li a").hover(
        function () {
            $(".nav-parent li a").not(this).css("opacity", "0.2");
        },
        function () {
            $(".nav-parent li a").css("opacity", "1");
        }
    );

    $(".extra-menu > ul > li > a").hover(
        function () {
            $(".extra-menu > ul > li > a").not(this).css("opacity", "0.2");
        },
        function () {
            $(".extra-menu > ul > li > a").css("opacity", "1");
        }
    );

    // Prevent multiple clicks
    let isAnimating = false;

    $(".nav-ico").click(function () { // .nav-btn → .nav-ico 로 변경
        if (isAnimating) return;
        isAnimating = true;

        let header = $("#nav-main");
        let body = $("body");

        if (header.hasClass("visible")) {
            // Hide menu and enable scrolling
            header.removeClass("visible").css({ opacity: "0", visibility: "hidden" });

            // Remove scrolling restriction
            body.removeClass("no-scroll");

            // Immediately reset animations
            $(".nav-parent li .item a, .extra-menu ul li a").css({
                transform: "translateY(100%)",
                transition: "0s",
                opacity: "0",
            }).removeClass("animated");

            $(".nav-ico").removeClass("nav-btn__active"); // .nav-btn → .nav-ico 로 변경

            isAnimating = false;
        } else {
            // Show menu and disable scrolling
            header.css("visibility", "visible");

            setTimeout(() => {
                header.addClass("visible").css("opacity", "1");

                // Disable scrolling
                body.addClass("no-scroll");

                // Add .nav-btn__active only after animation starts
                $(".nav-ico").addClass("nav-btn__active"); // .nav-btn → .nav-ico 로 변경

                animateMenuItems();
            }, 10);
        }
    });

    // Function to animate menu items when opening
    function animateMenuItems() {
        let navItems = $("#nav-main ul.nav-parent > li > .item a");
        let extraItems = $(".extra-menu > ul > li > a");

        let totalNavItems = navItems.length;
        let totalExtraItems = extraItems.length;

        if (totalNavItems === 0 && totalExtraItems === 0) {
            isAnimating = false;
            return;
        }

        // Animate primary menu items first
        navItems.each(function (index) {
            setTimeout(() => {
                $(this).css({
                    transform: "translateY(0)",
                    transition: "0.4s",
                    opacity: "1",
                }).addClass("animated");

                // Start extra menu animation after last primary menu item
                if (index === totalNavItems - 1) {
                    setTimeout(() => {
                        animateExtraItems();
                    }, 300);
                }
            }, index * 300);
        });

        // If no primary menu items exist, start extra menu immediately
        if (totalNavItems === 0) {
            animateExtraItems();
        }
    }

    // Function to animate extra menu items
    function animateExtraItems() {
        let extraItems = $(".extra-menu > ul > li > a");
        let totalExtraItems = extraItems.length;

        extraItems.each(function (index) {
            setTimeout(() => {
                $(this).css({
                    transform: "translateY(0)",
                    transition: "0.4s",
                    opacity: "1",
                }).addClass("animated");

                // Finish animation sequence
                if (index === totalExtraItems - 1) {
                    isAnimating = false;
                }
            }, index * 300);
        });

        if (totalExtraItems === 0) {
            isAnimating = false;
        }
    }
});

// scroll effect adding classname
document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

  const add_scrollEffect = document.querySelector(".effect");

  ScrollTrigger.create({
    trigger: add_scrollEffect,
    scroller: ".smooth-content",
    start: "top 70%",  // 화면 상단에서부터 30% 전에
    toggleClass: "active",
    toggleActions: "play reverse play reverse",  // 클래스가 추가/제거 반복 가능
    markers: false // 디버깅 시 true로 설정
  });
});
