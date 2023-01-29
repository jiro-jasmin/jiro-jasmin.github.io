$(function () {
    const screen = $(window).width();
    const delay = screen >= 980 ? 2200 : 1500;

    $(window).resize(function () { location.reload(); });

    //Home animation
    function textIntro(delay) {
        setTimeout($(document).find('audio')[0].play(), 500);

        // $("#bg-song").animate({volume: 1}, 150);
        $("#first").animate({
            "left": screen >= 980 ? "38%" : "28%",
            "top": "45%"
            //callback
        }, delay, function () {
            $("#first").animate({
                "left": "200%",
                "top": "-50%"
            }, 1500, function () {
                $("#first").css("display", "none");
            });
        });

        $("#second").animate({
            "right": "1%",
            "top": "60%"
            //callback
        }, delay, function () {
            $("#second").animate({
                "right": "200%",
                "top": "200%"
            }, 1500, function () {
                $("#second").css("display", "none");
            });
        });
    }

    textIntro(delay);

    const $mainMenuItems = $("#main-menu ul").children("li"),
        totalMainMenuItems = $mainMenuItems.length;
    // ON MOBILE
    if (screen < 980) {
        // const slides = document.querySelector(".slides");
        const $mainMenu = $("#main-menu ul");
        const maxLeft = (totalMainMenuItems - 1) * 100 * -1;

        let current = 0;

        function changeSlide(next = true) {
            $(document).find('audio')[1].play();
            if (next) {
                current += current > maxLeft ? -100 : current * -1;
            } else {
                current = current < 0 ? current + 100 : maxLeft;
            }

            $mainMenu.css("left", `${current}%`);
        }

        // Controls
        $(".next-slide").click(function () {
            changeSlide();
        });

        $(".prev-slide").click(function () {
            changeSlide(false);
        });
    }

    // On Desktops
    if (screen >= 980) {

        let openedIndex = -1;

        const init = function () {
            bindEvents();
            if (validIndex(openedIndex))
                animateItem($mainMenuItems.eq(openedIndex), true, 700);
        },

            bindEvents = function () {

                $mainMenuItems.children(".images").click(function () {
                    let newIndex = $(this).parent().index();
                    checkAndAnimateItem(newIndex);
                });

                $(".button").hover(
                    function () {
                        $(this).addClass("hovered");
                    },
                    function () {
                        $(this).removeClass("hovered");
                    }
                );

                $(".button").click(function () {
                    let newIndex = $(this).index();
                    checkAndAnimateItem(newIndex);
                });


            },

            validIndex = function (indexToCheck) {
                return (indexToCheck >= 0) && (indexToCheck < totalMainMenuItems);
            },

            animateItem = function ($item, toOpen, speed) {
                let $colorImage = $item.find(".color"),
                    itemParam = toOpen ? { width: "420px" } : { width: "140px" },
                    colorImageParam = toOpen ? { left: "0px" } : { left: "140px" };
                $colorImage.animate(colorImageParam, speed);
                $item.animate(itemParam, speed);
            },

            checkAndAnimateItem = function (indexToCheckAndAnimate) {
                $(document).find('audio')[1].play();
                if (openedIndex === indexToCheckAndAnimate) {
                    animateItem($mainMenuItems.eq(indexToCheckAndAnimate), false, 250);
                    openedIndex = -1;
                }
                else {
                    if (validIndex(indexToCheckAndAnimate)) {
                        animateItem($mainMenuItems.eq(openedIndex), false, 250);
                        openedIndex = indexToCheckAndAnimate;
                        animateItem($mainMenuItems.eq(openedIndex), true, 250);
                    }
                }
            };

        init();
    }
});
