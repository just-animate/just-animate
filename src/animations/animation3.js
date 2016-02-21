var allAnimations = {
    "bounce": {
        "keyframes": [
            {
                "offset": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 0.2,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 0.4,
                "easing": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
                "transform": "translate3d(0, -30px, 0)"
            },
            {
                "offset": 0.43,
                "easing": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
                "transform": "translate3d(0, -30px, 0)"
            },
            {
                "offset": 0.53,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 0.7,
                "easing": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
                "transform": "translate3d(0, -15px, 0)"
            },
            {
                "offset": 0.8,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 0.9,
                "transform": "translate3d(0, -4px, 0)"
            },
            {
                "offset": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "flash": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1
            },
            {
                "offset": 0.25,
                "opacity": 0
            },
            {
                "offset": 0.5,
                "opacity": 1
            },
            {
                "offset": 0.75,
                "opacity": 0
            },
            {
                "offset": 1,
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "pulse": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "scale3d(1, 1, 1)"
            },
            {
                "offset": 0.5,
                "transform": "scale3d(1.05, 1.05, 1.05)"
            },
            {
                "offset": 1,
                "transform": "scale3d(1, 1, 1)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rubberBand": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "scale3d(1, 1, 1)"
            },
            {
                "offset": 0.3,
                "transform": "scale3d(1.25, 0.75, 1)"
            },
            {
                "offset": 0.4,
                "transform": "scale3d(0.75, 1.25, 1)"
            },
            {
                "offset": 0.5,
                "transform": "scale3d(1.15, 0.85, 1)"
            },
            {
                "offset": 0.65,
                "transform": "scale3d(.95, 1.05, 1)"
            },
            {
                "offset": 0.75,
                "transform": "scale3d(1.05, .95, 1)"
            },
            {
                "offset": 1,
                "transform": "scale3d(1, 1, 1)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "shake": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 0.1,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 0.2,
                "transform": "translate3d(10px, 0, 0)"
            },
            {
                "offset": 0.3,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 0.4,
                "transform": "translate3d(10px, 0, 0)"
            },
            {
                "offset": 0.5,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 0.6,
                "transform": "translate3d(10px, 0, 0)"
            },
            {
                "offset": 0.7,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 0.8,
                "transform": "translate3d(10px, 0, 0)"
            },
            {
                "offset": 0.9,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "headShake": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translateX(0)"
            },
            {
                "offset": 0.065,
                "transform": "translateX(-6px) rotateY(-9deg)"
            },
            {
                "offset": 0.185,
                "transform": "translateX(5px) rotateY(7deg)"
            },
            {
                "offset": 0.315,
                "transform": "translateX(-3px) rotateY(-5deg)"
            },
            {
                "offset": 0.435,
                "transform": "translateX(2px) rotateY(3deg)"
            },
            {
                "offset": 0.5,
                "transform": "translateX(0)"
            },
            {
                "offset": 1,
                "transform": "translateX(0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both",
            "ease": "ease-in-out"
        }
    },
    "swing": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "none"
            },
            {
                "offset": 0.2,
                "transform": "rotate3d(0, 0, 1, 15deg)"
            },
            {
                "offset": 0.4,
                "transform": "rotate3d(0, 0, 1, -10deg)"
            },
            {
                "offset": 0.6,
                "transform": "rotate3d(0, 0, 1, 5deg)"
            },
            {
                "offset": 0.8,
                "transform": "rotate3d(0, 0, 1, -5deg)"
            },
            {
                "offset": 1,
                "transform": "rotate3d(0, 0, 1, 0deg)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "tada": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "scale3d(1, 1, 1)"
            },
            {
                "offset": 0.1,
                "transform": "scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.2,
                "transform": "scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.3,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
            },
            {
                "offset": 0.4,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.5,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
            },
            {
                "offset": 0.6,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.7,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
            },
            {
                "offset": 0.8,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.9,
                "transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
            },
            {
                "offset": 1,
                "transform": "scale3d(1, 1, 1)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "wobble": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "none"
            },
            {
                "offset": 0.15,
                "transform": "translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)"
            },
            {
                "offset": 0.3,
                "transform": "translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)"
            },
            {
                "offset": 0.45,
                "transform": "translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)"
            },
            {
                "offset": 0.6,
                "transform": "translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)"
            },
            {
                "offset": 0.75,
                "transform": "translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)"
            },
            {
                "offset": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "jello": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "none"
            },
            {
                "offset": 0.111,
                "transform": "none"
            },
            {
                "offset": 0.222,
                "transform": "skewX(-12.5deg) skewY(-12.5deg)"
            },
            {
                "offset": 0.33299999999999996,
                "transform": "skewX(6.25deg) skewY(6.25deg)"
            },
            {
                "offset": 0.444,
                "transform": "skewX(-3.125deg) skewY(-3.125deg)"
            },
            {
                "offset": 0.555,
                "transform": "skewX(1.5625deg) skewY(1.5625deg)"
            },
            {
                "offset": 0.6659999999999999,
                "transform": "skewX(-0.78125deg) skewY(-0.78125deg)"
            },
            {
                "offset": 0.777,
                "transform": "skewX(0.390625deg) skewY(0.390625deg)"
            },
            {
                "offset": 0.888,
                "transform": "skewX(-0.1953125deg) skewY(-0.1953125deg)"
            },
            {
                "offset": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceIn": {
        "keyframes": [
            {
                "offset": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.3, .3, .3)"
            },
            {
                "offset": 0.2,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.2,
                "transform": "scale3d(1.1, 1.1, 1.1)"
            },
            {
                "offset": 0.4,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.4,
                "transform": "scale3d(.9, .9, .9)"
            },
            {
                "offset": 0.6,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "scale3d(1.03, 1.03, 1.03)"
            },
            {
                "offset": 0.8,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.8,
                "transform": "scale3d(.97, .97, .97)"
            },
            {
                "offset": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "scale3d(1, 1, 1)"
            }
        ],
        "timings": {
            "duration": 750,
            "fill": "both"
        }
    },
    "bounceInDown": {
        "keyframes": [
            {
                "offset": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 0,
                "transform": "translate3d(0, -3000px, 0)"
            },
            {
                "offset": 0.6,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, 25px, 0)"
            },
            {
                "offset": 0.75,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, -10px, 0)"
            },
            {
                "offset": 0.9,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, 5px, 0)"
            },
            {
                "offset": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                 "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceInLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(-3000px, 0, 0)"
            },
            {
                "offset": 0.6,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "translate3d(25px, 0, 0)"
            },
            {
                "offset": 0.75,
                "opacity": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.75,
                "opacity": 1,
                "transform": "translate3d(-10px, 0, 0)"
            },
            {
                "offset": 0.9,
                "opacity": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 0.9,
                "opacity": 1,
                "transform": "translate3d(5px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceInRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(3000px, 0, 0)"
            },
            {
                "offset": 0.6,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(-25px, 0, 0)"
            },
            {
                "offset": 0.75,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(10px, 0, 0)"
            },
            {
                "offset": 0.9,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(-5px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceInUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "transform": "translate3d(0, 3000px, 0)"
            },
            {
                "offset": 0.6,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, -20px, 0)"
            },
            {
                "offset": 0.75,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, 10px, 0)"
            },
            {
                "offset": 0.9,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, -5px, 0)"
            },
            {
                "offset": 1,
                "easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
                "opacity": 1,
                "transform": "translate3d(0, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceOut": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"  
            },
            {
                "offset": 0.2,
                "transform": "scale3d(.9, .9, .9)"
            },
            {
                "offset": 0.5,
                "opacity": 1,
                "transform": "scale3d(1.1, 1.1, 1.1)"
            },
            {
                "offset": 0.55,
                "opacity": 1,
                "transform": "scale3d(1.1, 1.1, 1.1)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "scale3d(.3, .3, .3)"
            }
        ],
        "timings": {
            "duration": 750,
            "fill": "both"
        }
    },
    "bounceOutDown": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"  
            },
            {
                "offset": 0.2,
                "transform": "translate3d(0, 10px, 0)"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "translate3d(0, -20px, 0)"
            },
            {
                "offset": 0.45,
                "opacity": 1,
                "transform": "translate3d(0, -20px, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, 2000px, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceOutLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"  
            },
            {
                "offset": 0.2,
                "opacity": 1,
                "transform": "translate3d(20px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(-2000px, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceOutRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"  
            },
            {
                "offset": 0.2,
                "opacity": 1,
                "transform": "translate3d(-20px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(2000px, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "bounceOutUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 0.2,
                "opacity": 1,
                "transform": "translate3d(0, -10px, 0)"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "translate3d(0, 20px, 0)"
            },
            {
                "offset": 0.45,
                "opacity": 1,
                "transform": "translate3d(0, 20px, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, -2000px, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeIn": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0
            },
            {
                "offset": 1,
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInDown": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(0, -100%, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInDownBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(0, -2000px, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(-100%, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInLeftBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(-2000px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(100%, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInRightBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(2000px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(0, 100%, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeInUpBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(0, 2000px, 0)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOut": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1
            },
            {
                "offset": 1,
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutDown": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, 100%, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutDownBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, 2000px, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(-100%, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutLeftBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(-2000px, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(100%, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutRightBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(2000px, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, -100%, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "fadeOutUpBig": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(0, -2000px, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "flip": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "perspective(400px) rotate3d(0, 1, 0, -360deg)",
                "easing": "ease-out"
            },
            {
                "offset": 0.4,
                "transform": "perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)",
                "easing": "ease-out"
            },
            {
                "offset": 0.5,
                "transform": "perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)",
                "easing": "ease-in "
            },
            {
                "offset": 0.8,
                "transform": "perspective(400px) scale3d(.95, .95, .95)",
                "easing": "ease-in "
            },
            {
                "offset": 1,
                "transform": "perspective(400px)",
                "easing": "ease-in "
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "flipInX": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "perspective(400px) rotate3d(1, 0, 0, 90deg)",
                "easing": "ease-in ",
                "opacity": 0
            },
            {
                "offset": 0.4,
                "transform": "perspective(400px) rotate3d(1, 0, 0, -20deg)",
                "easing": "ease-in "
            },
            {
                "offset": 0.6,
                "transform": "perspective(400px) rotate3d(1, 0, 0, 10deg)",
                "opacity": 1
            },
            {
                "offset": 0.8,
                "transform": "perspective(400px) rotate3d(1, 0, 0, -5deg)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "perspective(400px)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "flipInY": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "perspective(400px) rotate3d(0, 1, 0, 90deg)",
                "easing": "ease-in ",
                "opacity": 0
            },
            {
                "offset": 0.4,
                "transform": "perspective(400px) rotate3d(0, 1, 0, -20deg)",
                "easing": "ease-in "
            },
            {
                "offset": 0.6,
                "transform": "perspective(400px) rotate3d(0, 1, 0, 10deg)",
                "opacity": 1
            },
            {
                "offset": 0.8,
                "transform": "perspective(400px) rotate3d(0, 1, 0, -5deg)"
            },
            {
                "offset": 1,
                "transform": "perspective(400px)",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "flipOutX": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "perspective(400px)",
                "opacity": 1
            },
            {
                "offset": 0.3,
                "transform": "perspective(400px) rotate3d(1, 0, 0, -20deg)",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform": "perspective(400px) rotate3d(1, 0, 0, 90deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 750,
            "fill": "both"
        }
    },
    "flipOutY": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "perspective(400px)",
                "opacity": 1
            },
            {
                "offset": 0.3,
                "transform": "perspective(400px) rotate3d(0, 1, 0, -15deg)",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform": "perspective(400px) rotate3d(0, 1, 0, 90deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 750,
            "fill": "both"
        }
    },
    "lightSpeedIn": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(100%, 0, 0) skewX(-30deg)",
                "opacity": 0
            },
            {
                "offset": 0.6,
                "transform": "skewX(20deg)",
                "opacity": 1
            },
            {
                "offset": 0.8,
                "transform": "skewX(-5deg)",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "lightSpeedOut": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform": "translate3d(100%, 0, 0) skewX(30deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateIn": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "center",
                "transform": "rotate3d(0, 0, 1, -200deg)",
                "opacity": 0
            },
            {
                "offset": 1,
                "transform-origin": "center",
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateInDownLeft": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "left bottom",
                "transform": "rotate3d(0, 0, 1, -45deg)",
                "opacity": 0
            },
            {
                "offset": 1,
                "transform-origin": "left bottom",
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateInDownRight": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "right bottom",
                "transform": "rotate3d(0, 0, 1, 45deg)",
                "opacity": 0
            },
            {
                "offset": 1,
                "transform-origin": "right bottom",
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateInUpLeft": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "left bottom",
                "transform": "rotate3d(0, 0, 1, 45deg)",
                "opacity": 0
            },
            {
                "offset": 1,
                "transform-origin": "left bottom",
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateInUpRight": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "right bottom",
                "transform": "rotate3d(0, 0, 1, -90deg)",
                "opacity": 0
            },
            {
                "offset": 1,
                "transform-origin": "right bottom",
                "transform": "none",
                "opacity": 1
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateOut": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "center",
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform-origin": "center",
                "transform": "rotate3d(0, 0, 1, 200deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateOutDownLeft": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "left bottom",
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform-origin": "left bottom",
                "transform": "rotate3d(0, 0, 1, 45deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateOutDownRight": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "right bottom",
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform-origin": "right bottom",
                "transform": "rotate3d(0, 0, 1, -45deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateOutUpLeft": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "left bottom",
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform-origin": "left bottom",
                "transform": "rotate3d(0, 0, 1, -45deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rotateOutUpRight": {
        "keyframes": [
            {
                "offset": 0,
                "transform-origin": "right bottom",
                "transform": "none",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform-origin": "right bottom",
                "transform": "rotate3d(0, 0, 1, 90deg)",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "hinge": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "none",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 1
            },
            {
                "offset": 0.2,
                "transform": "rotate3d(0, 0, 1, 80deg)",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 1
            },
            {
                "offset": 0.4,
                "transform": "rotate3d(0, 0, 1, 60deg)",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 1
            },
            {
                "offset": 0.6,
                "transform": "rotate3d(0, 0, 1, 80deg)",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 0
            },
            {
                "offset": 0.8,
                "transform": "rotate3d(0, 0, 1, 60deg)",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 1
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 700px, 0)",
                "transform-origin": "top left",
                "easing": "ease-in -out",
                "opacity": 0
            }
        ],
        "timings": {
            "duration": 2000,
            "fill": "both"
        }
    },
    "rollIn": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "rollOut": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomIn": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.3, .3, .3)"
            },
            {
                "offset": 0.5,
                "opacity": 1
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomInDown": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(0, -1000px, 0)",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(0, 60px, 0)",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomInLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(-1000px, 0, 0)",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(10px, 0, 0)",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomInRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(1000px, 0, 0)",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(-10px, 0, 0)",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomInUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(0, 1000px, 0)",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 0.6,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(0, -60px, 0)",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            },
            {
                "offset": 1,
                "opacity": 1,
                "transform": "none"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomOut": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none",
                "transform-origin": "center middle"
            },
            {
                "offset": 0.5,
                "opacity": 0,
                "transform": "scale3d(.3, .3, .3)",
                "transform-origin": "center middle"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "none",
                "transform-origin": "center middle"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomOutDown": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none",
                "transform-origin": "center bottom"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(0, -60px, 0)",
                "transform-origin": "center bottom",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(0, 2000px, 0)",
                "transform-origin": "center bottom",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomOutLeft": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none",
                "transform-origin": "left center"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(42px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "scale(.1) translate3d(-2000px, 0, 0)",
                "transform-origin": "left center"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomOutRight": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none",
                "transform-origin": "right center"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(-42px, 0, 0)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "scale(.1) translate3d(2000px, 0, 0)",
                "transform-origin": "right center"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "zoomOutUp": {
        "keyframes": [
            {
                "offset": 0,
                "opacity": 1,
                "transform": "none",
                "transform-origin": "center bottom"
            },
            {
                "offset": 0.4,
                "opacity": 1,
                "transform": "scale3d(.475, .475, .475) translate3d(0, 60px, 0)",
                "easing": "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
            },
            {
                "offset": 1,
                "opacity": 0,
                "transform": "scale3d(.1, .1, .1) translate3d(0, -2000px, 0)",
                "transform-origin": "center bottom",
                "easing": "cubic-bezier(0.175, 0.885, 0.320, 1)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideInDown": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(0, -100%, 0)",
                "visibility": "hidden"
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 0, 0)",
                "visibility": "visible"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideInLeft": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(-100%, 0, 0)",
                "visibility": "hidden"
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 0, 0)",
                "visibility": "visible"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideInRight": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(100%, 0, 0)",
                "visibility": "hidden"
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 0, 0)",
                "visibility": "visible"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideInUp": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(0, 100%, 0)",
                "visibility": "hidden"
            },
            {
                "offset": 1,
                "transform": "translate3d(0, 0, 0)",
                "visibility": "visible"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideOutDown": {
        "keyframes": [
            {
                "offset": 0,
                "transform": "translate3d(0, 0, 0)",
                "visibility": "visible"
            },
            {
                "offset": 1,
                "visibility": "hidden",
                "transform": "translate3d(0, 100%, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideOutLeft": {
        "keyframes": [
            {
                "offset": 0,
                "visibility": "visible",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 1,
                "visibility": "hidden",
                "transform": "translate3d(-100%, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideOutRight": {
        "keyframes": [
            {
                "offset": 0,
                "visibility": "visible",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 1,
                "visibility": "hidden",
                "transform": "translate3d(100%, 0, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    },
    "slideOutUp": {
        "keyframes": [
            {
                "offset": 0,
                "visibility": "visible",
                "transform": "translate3d(0, 0, 0)"
            },
            {
                "offset": 1,
                "visibility": "hidden",
                "transform": "translate3d(0, -100%, 0)"
            }
        ],
        "timings": {
            "duration": 1000,
            "fill": "both"
        }
    }
}