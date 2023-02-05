/*global jQuery, window, grecaptcha, google, Pace*/
(function ($) {


    'use strict';


    var GRAPHICFORT = {},
        isMobile,
        scrollBarDiv,
        scrollBarWidth,
        pageCurrentPosition,
        headerSubMenuTimer,
        headerSearchFormTimer,
        headerPerfectScrollbarTimer,
        notificationsTimer,
        animationTimer,
        reCaptchaSitekey = 'reCaptcha sitekey',
        gmapAPIKey = 'Google Map API key',
        mailchimpFormURL = 'Mailchimp form URL',
        rules = {
            form_general: 'required',
            form_name: 'required',
            form_email: {
                required: true,
                email: true
            },
            form_subject: 'required',
            form_message: 'required',
            form_comment: 'required',
            form_bmi_weight: {
                required: true,
                number: true,
                minlength: 1,
                maxlength: 5
            },
            form_bmi_height: {
                required: true,
                number: true,
                minlength: 1,
                maxlength: 5
            },
            form_select: 'required',
            form_phone: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            form_terms: 'required'
        },
        messages = {
            form_general: 'This field is required.',
            form_name: 'Your name is required.',
            form_email: {
                required: 'Your email address is required.',
                email: 'Please enter a valid email address.'
            },
            form_subject: 'Your subject is required.',
            form_message: 'Don\'t you want to say something?.',
            form_comment: 'Don\'t you want to say something?.',
            form_bmi_weight: {
                required: 'This field is required.',
                min: 'Please enter a valid number.',
                minlength: 'Please enter a valid number.',
                maxlength: 'Please enter a valid number.'
            },
            form_bmi_height: {
                required: 'This field is required.',
                min: 'Please enter a valid number.',
                minlength: 'Please enter a valid number.',
                maxlength: 'Please enter a valid number.'
            },
            form_select: 'This field is required.',
            form_phone: {
                required: 'Please provide a phone number.',
                digits: 'Please enter digits only',
                minlength: 'Phone number must be 10 digits.',
                maxlength: 'Phone number must be 10 digits.'
            },
            form_terms: 'This field is required.'
        };


    /* =========================================================================
    Mobile
    ========================================================================= */
    isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera\ Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


    /* =========================================================================
    Scroll bar
    ========================================================================= */
    scrollBarDiv = document.createElement('div');
    scrollBarDiv.className = 'scrollbar-div';
    document.body.appendChild(scrollBarDiv);
    scrollBarWidth = scrollBarDiv.offsetWidth - scrollBarDiv.clientWidth;
    document.body.removeChild(scrollBarDiv);


    /* =========================================================================
    Page PreLoader
    ========================================================================= */
    GRAPHICFORT.pagePreLoaderfn = {
        // Loader
        loader: function () {

            var layout = parseInt($('#page-preloader').attr('data-page-preloader-layout'), 10);

            layout = (!layout)
                ? 1
                : layout;

            $('body').addClass('page-preloader-layout-' + layout);

            try {

                Pace.start();
                GRAPHICFORT.pagePreLoaderfn.fadeEffect();

            } catch (error) {

                if (error.toString().indexOf('Pace')) {
                    $('#main-wrapper').css({opacity: '1'});
                    $('#main-container').css({opacity: '1'});
                    return false;
                }

            }

        },
        // Fade effect
        fadeEffect: function () {

            if ($().animsition) {

                $('#main-wrapper').animsition({
                    inClass: 'fade-in',
                    outClass: 'fade-out',
                    inDuration: 1500,
                    outDuration: 800,
                    loading: false,
                    linkElement: 'a:not([target="_blank"]):not([href^="#"])'
                });

            }

        }
    };


    /* =========================================================================
    Bootsrtap
    ========================================================================= */
    GRAPHICFORT.bootstrapfn = {
        // Tooltip
        toolTip: function () {
            if ($().tooltip) {

                $('html').tooltip({
                    container: 'body',
                    trigger: 'hover',
                    selector: '[data-bs-toggle="tooltip"]'
                });

            }
        },
        // Modal
        modal: function () {

            // Show
            $('.modal').on('show.bs.modal', function () {

                // iframe
                $(this).find('iframe').each(function () {
                    $(this).attr('data-temp-src', $(this).attr('src'));
                    $(this).attr('src', $(this).attr('data-temp-src'));
                });

            });

            // Hidden
            $('.modal').on('hidden.bs.modal', function () {

                // iframe
                $(this).find('iframe').each(function () {
                    $(this).attr('src', $(this).attr('data-temp-src'));
                });

                // mediaElement Player
                if ($().mediaelementplayer) {

                    $(this).find('.mejs__container video').each(function () {
                        this.player.pause();
                    });

                    $(this).find('.mejs__container audio').each(function () {
                        this.player.pause();
                    });

                }

            });

        },
        // Scrollspy
        scrollspy: function () {
            if ($().scrollspy) {

                var offset = 0;

                if ($('.header-section').hasClass('header-section-fixed') && !isMobile.any()) {
                    offset = parseInt($('.header-section-fixed').height() + 2, 10);
                }

                if ($('.header-section .data-scroll-to').length) {
                    $('html').scrollspy({
                        target: '.navbar-nav',
                        offset: offset
                    });
                }

            }
        }
    };


    /* =========================================================================
    fitVids
    ========================================================================= */
    GRAPHICFORT.fitVidsfn = {
        // init
        init: function () {
            if ($().fitVids) {

                $('body').fitVids({
                    customSelector: 'iframe[src*="soundcloud.com"], iframe[src*="videopress.com"], iframe[src*="player.twitch.tv"], iframe[src*="maps.google.com"], iframe[src*="google.com/maps"], iframe[src*="dailymotion.com"]'
                });

            }
        }
    };


    /* =========================================================================
    mediaElement Player
    ========================================================================= */
    GRAPHICFORT.mediaElementPlayerfn = {
        // init
        init: function () {
            if ($().mediaelementplayer) {

                $('video, audio').each(function () {
                    $(this).mediaelementplayer({stretching: 'responsive'});
                });

            }
        }
    };


    /* =========================================================================
    Scroll to
    ========================================================================= */
    GRAPHICFORT.scrollTofn = {
        // init
        init: function () {

            // Back to top button
            $('.back-to-top').on('click', function () {
                $('html, body').animate({scrollTop: '0'}, 800);
                return false;
            });

            // General
            $('body').on('click', '.data-scroll-to, [data-scroll-to]', function () {
                if ($(this.hash).length) {

                    var id = $(this).attr('href');

                    if ($('.mobile-menu').hasClass('show')) {
                        $('.navbar-toggler').removeClass('toggle');
                        $('.mobile-menu').removeClass('show').addClass('collapse');
                    }

                    if ($('#header-offcanvas-menu').hasClass('show')) {
                        $('.navbar-toggler').removeClass('toggle');
                        $('[data-bs-dismiss="offcanvas"]').click();
                    }

                    if ($('.header-section').hasClass('header-section-fixed') && !isMobile.any()) {
                        $('html, body').animate({scrollTop: $(id).offset().top - $('.header-section-fixed .header-menu-section-container').height() + 2}, 800);
                    } else {
                        $('html, body').animate({scrollTop: $(id).offset().top}, 800);
                    }

                    return false;

                }
            });

        }
    };


    /* =========================================================================
    Header
    ========================================================================= */
    GRAPHICFORT.headerfn = {
        // init
        init: function () {

            // Submenu parent class
            $('.navbar-nav').find('ul').parent('li').addClass('menu-item-has-children');

            // Toggler button
            $('body').on('click', '.navbar-toggler', function () {
                $(this).toggleClass('toggle');
            });

            // helper for the accordion simulation
            $('.header-menu .menu-item-has-children').on({
                click: function () {
                    $(this).addClass('collapse-menu-open-close');
                },
                mouseleave: function () {
                    $(this).removeClass('collapse-menu-open-close');
                }
            });
            $('.mobile-menu .navbar-nav .menu-item-has-children').each(function () {
                $(this).addClass('btn-collapse-menu');
            });
            $('body').on('click', '.btn-collapse-menu > a', function (e) {

                var el = $(this);

                // check if the submenu is opened / closed
                if (!el.hasClass('menu-opened')) {

                    if (el.parent('li').hasClass('megamenu-without-title')) {
                        el.next('ul').find('ul').slideDown();
                    }
                    el.next('ul').slideDown();

                    el.addClass('menu-opened');

                    // accordion simulation
                    $('.mobile-menu .menu-item-has-children').each(function () {
                        if (!$(this).hasClass('collapse-menu-open-close')) {
                            $('> a', this).removeClass('menu-opened');
                            $('> ul', this).slideUp();
                        }
                    });

                } else {

                    if (el.attr('href') === '#') {
                        e.preventDefault();
                    }

                    el.removeClass('menu-opened');

                    el.next('ul').slideUp();
                    el.next('ul').find('ul').slideUp();

                }

                if (el.hasClass('menu-opened')) {
                    return false;
                }

            });

        },
        // Mobile menu
        mobileMenu: function () {

            // HTML
            var mobileContainerClass = $('.navbar > .container').attr('class');
            $('.desktop-menu')
                .clone()
                .attr({class: mobileContainerClass})
                .appendTo($('.mobile-menu'));

        },
        // Current Page
        currentPage: function () {

            var currentPageFileName,
                el;

            currentPageFileName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

            $('.header-section .nav-link').each(function () {

                el = $(this);

                if (el.attr('href') === currentPageFileName) {
                    el.addClass('active').parentsUntil('.navbar-nav').addClass('active');
                }

            });

        },
        // SubMenu
        subMenu: function () {

            clearTimeout(headerSubMenuTimer);
            $('.desktop-menu .navbar-nav > .menu-item-has-children:not(.megamenu)').each(function () {

                var el = $(this),
                    subMenuChildren,
                    subMenuChildrenTemp,
                    windowWidth = $(window).width() + scrollBarWidth;

                el.removeClass('submenu-correct-position');

                if (el.children('ul').length) {

                    subMenuChildren = el.children('ul');
                    subMenuChildrenTemp = subMenuChildren;

                    while (subMenuChildrenTemp.length) {
                        subMenuChildren = subMenuChildrenTemp;
                        subMenuChildrenTemp = subMenuChildrenTemp.children('li').children('ul');
                    }

                    el.removeClass('submenu-correct-position');

                    if (subMenuChildren.offset().left < 0) {
                        el.addClass('submenu-correct-position');
                    }

                    if (windowWidth < (parseInt((subMenuChildren.width() + subMenuChildren.offset().left), 10))) {
                        el.addClass('submenu-correct-position');
                    }

                }

            });

        },
        // Search form
        searchForm: function () {

            // open search form
            $('.btn-form-block-header-search-open').on('click', function () {

                $('.header-menu-section').addClass('form-block-header-search-open');

                headerSearchFormTimer = setTimeout(function () {
                    $('.form-block-header-search-desktop input').focus();
                }, 100);

                return false;

            });

            // Close search form
            $('.btn-form-block-header-search-close').on('click', function () {
                GRAPHICFORT.headerfn.closeSearchForm();
                return false;
            });

            // Focus out
            $('.desktop-menu input').on('focusout', function () {
                GRAPHICFORT.headerfn.closeSearchForm();
            });

        },
        closeSearchForm: function () {
            clearTimeout(headerSearchFormTimer);
            $('.form-block-header-search-open').removeClass('form-block-header-search-open');
        },
        // Middle section
        middleSection: function () {

            $('.header-middle-section .container')
                .addClass($('.header-menu-section .navbar .container').attr('class').replace('container', ''))
                .addClass($('.header-menu-section .navbar').attr('class').replace('navbar', ''));

        },
        // Fixed header
        fixedHeader: function (pageCurrentPosition) {

            var el = $('.header-section-fixed .header-menu-section-container'),
                height = el.height(),
                parent = $('.header-menu-section'),
                offset = parent.offset().top;

            if (parseInt(pageCurrentPosition, 10) > parseInt(offset, 10)) {

                el.addClass('stuck');
                parent.css({height: height});

            } else {

                el.removeClass('stuck');
                parent.css({height: 'auto'});

            }

        },
        // Transparent
        transparent: function () {

            var paddingTop = 0;

            if ($('[data-section-padding]').length) {
                paddingTop = parseInt($('[data-section-padding]').attr('data-section-padding'), 10);
            }

            if ($(window).width() + scrollBarWidth >= 1200) {

                $('.breadcrumb-section').css({paddingTop: $('.header-section').outerHeight(true)});
                $('[data-section-padding]').css({paddingTop: paddingTop + $('.header-section').outerHeight(true)});

            } else {

                $('.breadcrumb-section').css({paddingTop: 0});
                $('[data-section-padding]').css({paddingTop: paddingTop});

            }

        },
        // offcanvas menu
        offcanvas: function () {

            if ($('#header-offcanvas-menu').length) {

                $('#header-offcanvas-menu').on('hidden.bs.offcanvas', function () {
                    $('.navbar-toggler').removeClass('toggle');
                });

            }

        },
        // Perfect scrollbar
        perfectScrollbar: function () {

            try {

                $('#header-offcanvas-menu .offcanvas-body').perfectScrollbar();

                // update scrollbar (calculate new hight)
                $('body').on('click', '#header-offcanvas-menu .offcanvas-body .menu-item-has-children > a', function () {
                    headerPerfectScrollbarTimer = setTimeout(function () {
                        $('#header-offcanvas-menu .offcanvas-body').perfectScrollbar('update');
                    }, 400);
                });
                $('#header-offcanvas-menu .offcanvas-body').on('mouseleave', function () {
                    clearTimeout(headerPerfectScrollbarTimer);
                });

            } catch (error) {

                if (error.toString().indexOf('PerfectScrollbar')) {
                    return false;
                }

            }
        }
    };


    /* =========================================================================
    Form
    ========================================================================= */
    GRAPHICFORT.formfn = {
        // Validation
        validation: function () {
            $('.form-block-validation').each(function () {

                var el = $(this),
                    redirect = el.attr('data-contact-form-redirect-url'),
                    button = el.find('button[type="submit"]'),
                    form = el.find('form');

                if (el.find('.form-check-must-accept').length) {
                    button.attr('disabled', '');
                }

                if (el.hasClass('form-block-contact')) {
                    form.prepend('<input type="hidden" class="form_domain" name="form_domain" value="' + document.location.hostname + '">');
                }

                $(button).on('click', function () {
                    form.find('.form-message').remove();
                });

                if ($().validate) {

                    $(form).validate({
                        rules: rules,
                        messages: messages,
                        errorElement: 'span',
                        errorClass: 'form-error',
                        submitHandler: function () {

                            form.find('.form-message').remove();

                            button.addClass('show-spinner').attr('disabled', '');

                            $.ajax({
                                type: 'POST',
                                url: form.attr('action'),
                                data: form.serialize()
                            }).done(function (response) {

                                /* Success Message
                                ------------------------------------------------- */
                                if (response.match('success-message') !== null) {

                                    if (redirect) {

                                        window.location = redirect;

                                    } else {

                                        form.append('<div class="form-message col-lg-12"><div class="alert alert-success">' + response + '</div></div>');

                                    }

                                    form.find('input').val('');
                                    form.find('.form_domain').val(document.location.hostname);
                                    form.find('textarea').val('');
                                    form.find('input[type="checkbox"]').prop('checked', false);

                                    if (el.find('.form-check-must-accept').length) {
                                        button.attr('disabled', '');
                                    }

                                }

                                /* Error Message
                                ------------------------------------------------- */
                                if (response.match('error-message') !== null) {

                                    form.append('<div class="form-message col-lg-12"><div class="alert alert-danger">' + response + '</div></div>');

                                }

                                /* reCAPTCHA
                                ------------------------------------------------- */
                                if (form.find('.g-recaptcha-response').length) {
                                    GRAPHICFORT.formfn.reCAPTCHA($('#' + form.find('.g-recaptcha-response').attr('id')));
                                }

                                button.removeClass('show-spinner');

                                if (!el.find('.form-check-must-accept').length) {
                                    button.removeAttr('disabled');
                                }

                            });

                        }
                    });

                    /* Additional Method to validate email
                    --------------------------------------------------------- */
                    $.validator.methods.email = function (value, element) {
                        return this.optional(element) || (/\S+@\S+\.\S+/).test(value);
                    };

                }

            });
        },
        // reCAPTCHA
        reCAPTCHA: function (recaptcha) {

            var recaptchaID = $(recaptcha).attr('id');

            $.ajax({
                type: 'GET',
                url: 'https://www.google.com/recaptcha/api.js?render=' + reCaptchaSitekey,
                dataType: 'script',
                cache: true
            }).done(function () {
                grecaptcha.ready(function () {
                    grecaptcha.execute(reCaptchaSitekey, {action: 'homepage'}).then(function (token) {
                        document.getElementById(recaptchaID).value = token;
                    });
                });
            });

        },
        // Checkbox accept
        checkboxAccept: function () {
            $('.form-check-must-accept').on('change', function () {

                var el = $(this),
                    form = el.parents('.form-block'),
                    button = form.find('[type=submit]'),
                    disabledArray = [];

                $(form).find('.form-check-must-accept').each(function () {

                    if ($(this)[0].checked === false) {
                        disabledArray.push('false');
                    } else {
                        disabledArray.push('true');
                    }

                });

                disabledArray = disabledArray.filter(function (elem, index, self) {
                    return index === self.indexOf(elem);
                });

                if (disabledArray.length > 1) {
                    button.attr('disabled', '');
                } else {
                    if (disabledArray[0] === 'false') {
                        button.attr('disabled', '');
                    } else {
                        button.removeAttr('disabled');
                    }
                }

            });
        }
    };


    /* =========================================================================
    CountTo
    ========================================================================= */
    GRAPHICFORT.countTofn = {
        // init
        init: function () {
            if ($().countTo) {

                $('[data-to]').each(function () {

                    var el = $(this),
                        from = parseFloat(el.attr('data-from')),
                        to = parseFloat(el.attr('data-to')),
                        speed = parseInt(el.attr('data-speed'), 10),
                        interval = parseFloat(el.attr('data-refresh-interval')),
                        decimals = parseInt(el.attr('data-decimals'), 10);

                    // From
                    from = (!from)
                        ? 0
                        : from;

                    if (from === 0) {
                        el.html('0');
                    }

                    // To
                    to = (!to)
                        ? 100
                        : to;

                    // Speed
                    speed = (!speed)
                        ? 1000
                        : speed;

                    // Interval
                    interval = (!interval)
                        ? 50
                        : interval;

                    // Decimals
                    decimals = (!decimals)
                        ? 0
                        : decimals;

                    if ($().appear) {

                        el.appear(function () {
                            el.countTo({
                                from: from,
                                to: to,
                                speed: speed,
                                refreshInterval: interval,
                                decimals: decimals
                            });
                        }, {accX: 0, accY: -108});

                    } else {

                        el.countTo({
                            from: from,
                            to: to,
                            speed: speed,
                            refreshInterval: interval,
                            decimals: decimals
                        });

                    }

                });

            }
        }
    };


    /* =========================================================================
    downCount timer
    ========================================================================= */
    GRAPHICFORT.downCountfn = {
        // init
        init: function () {
            if ($().downCount) {

                $('.downcount-block').each(function () {

                    var el = $(this),
                        year = el.attr('data-downcount-year'),
                        month = el.attr('data-downcount-month'),
                        day = el.attr('data-downcount-day'),
                        hour = el.attr('data-downcount-hour'),
                        minutes = el.attr('data-downcount-min'),
                        offset = el.attr('data-downcount-utc'),
                        message = el.attr('data-downcount-message');

                    el.downCount({
                        date: month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + '00',
                        offset: offset
                    }, function () {
                        el.find('.downcount-block-content').html('<h2>' + message + '</h2>');
                    });

                });

            }
        }
    };


    /* =========================================================================
    Fancybox
    ========================================================================= */
    GRAPHICFORT.fancyboxfn = {
        // init
        init: function () {
            if ($().fancybox) {

                $('body').on('click', '[data-lightbox]', function () {

                    var el = $(this),
                        arrowLeft,
                        arrowRight,
                        numberOfImages,
                        imageObject = {},
                        imageLink = el.attr('href'),
                        imagesArray = [],
                        gallery,
                        type = el.attr('data-lightbox-type');

                    // Arrows
                    arrowLeft = '<span class="screen-reader-text">Left</span><i class="fas fa-chevron-left"></i>';
                    arrowRight = '<span class="screen-reader-text">Right</span><i class="fas fa-chevron-right"></i>';

                    // Type
                    if (!type) {
                        type = '';
                    }

                    // init
                    if (el.attr('data-lightbox') === '') {

                        // Single image

                        numberOfImages = 0;

                        imageObject = {
                            src: imageLink,
                            opts: {
                                caption: el.attr('data-lightbox-caption'),
                                thumb: el.attr('data-lightbox-thumb')
                            }
                        };

                        imagesArray.push(imageObject);

                    } else {

                        // Gallery

                        numberOfImages = el.index('[data-lightbox="' + el.attr('data-lightbox') + '"]');

                        $('[data-lightbox="' + el.attr('data-lightbox') + '"]').each(function () {

                            gallery = $(this);
                            imageLink = gallery.attr('href');

                            imageObject = {
                                src: imageLink,
                                opts: {
                                    caption: gallery.attr('data-lightbox-caption'),
                                    thumb: gallery.attr('data-lightbox-thumb')
                                }
                            };

                            imagesArray.push(imageObject);

                        });

                    }

                    // open
                    $.fancybox.open(
                        imagesArray,
                        {
                            loop: false,
                            arrows: true,
                            infobar: true,
                            margin: [48, 0],
                            buttons: [
                                'slideShow',
                                'fullScreen',
                                'thumbs',
                                'close'
                            ],
                            thumbs: {
                                autoStart: false,
                                hideOnClose: true
                            },
                            slideShow: {
                                autoStart: false,
                                speed: 4000
                            },
                            iframe: {
                                preload: false
                            },
                            smallBtn: false,
                            autoFocus: false,
                            backFocus: false,
                            transitionEffect: 'slide',
                            animationEffect: 'zoom-in-out',
                            baseClass: 'lightbox-wrapper',
                            btnTpl: {
                                arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' + arrowLeft + '</button>',
                                arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' + arrowRight + '</button>'
                            },
                            afterShow: function () {

                                if ($().mediaelementplayer) {

                                    // Video
                                    if ($('.fancybox-slide video').length) {
                                        $('.fancybox-slide video').each(function () {
                                            $(this).mediaelementplayer({stretching: 'responsive'});
                                        });
                                    }

                                }

                            }
                        },
                        numberOfImages
                    );

                    imagesArray = [];
                    imageObject = {};

                    return false;

                });

            }
        }
    };


    /* =========================================================================
    isotope
    ========================================================================= */
    GRAPHICFORT.isotopefn = {
        // init
        init: function () {
            if ($().isotope) {

                $('.isotope-grid').each(function () {

                    var el = $(this),
                        originLeft = true,
                        originLeftAttr = el.attr('data-page-direction'),
                        filter = el.attr('data-filter'),
                        transitionDuration = parseInt(el.attr('data-transition-duration'), 10);

                    transitionDuration = (!transitionDuration && transitionDuration !== 0)
                        ? 0.4
                        : transitionDuration;

                    transitionDuration = transitionDuration + 's';

                    if (originLeftAttr === 'rtl') {
                        originLeft = false;
                    }

                    el.isotope({
                        filter: filter,
                        layoutMode: 'masonry',
                        percentPosition: true,
                        itemSelector: '.isotope-item',
                        originLeft: originLeft,
                        animationOptions: {
                            queue: false,
                            duration: 850,
                            easing: 'linear'
                        },
                        transitionDuration: transitionDuration
                    });

                });

            }
        },
        // Filter
        filter: function () {
            if ($().isotope) {

                // Filter by link
                $('body').on('click', '.isotope-filter a', function (e) {

                    e.preventDefault();

                    var el = $(this),
                        parent = el.parents('.isotope-filter'),
                        attr = el.attr('data-isotope-filter'),
                        section = parent.next('.isotope-grid'),
                        select = $('> .form-control', parent);

                    if ($(section).length) {

                        parent.find('.active').removeClass('active');
                        el.addClass('active');

                        section.isotope({
                            filter: attr
                        });

                    }

                    if ($(select).length) {
                        select.val(el.attr('data-isotope-filter'));
                    }

                });

                // Filter by select
                if ($('.isotope-filter-select').length) {
                    $('.isotope-filter').each(function () {

                        var el = $(this),
                            container = $('> .isotope-filter-container', el),
                            select = '',
                            maxWidth = parseInt(el.attr('data-isotope-filter-select-width'), 10);

                        if (maxWidth > 0) {
                            maxWidth = 'style="max-width: ' + maxWidth + 'px' + '"';
                        } else {
                            maxWidth = '';
                        }

                        select = '<select class="form-control secondary-font-family" aria-label="Filter" ' + maxWidth + '>';

                        $('> a', container).each(function () {
                            select += '<option value="' + $(this).attr('data-isotope-filter') + '">' + $(this).text() + '</option>';
                        });

                        select += '</select>';

                        el.prepend(select);

                    });
                }
                // select (on change)
                $('body').on('change', '.isotope-filter-select .form-control', function () {

                    var el = $(this),
                        parent = el.parents('.isotope-filter-select'),
                        section = parent.next('.isotope-grid');

                    parent.find('.active').removeClass('active');
                    parent.find('a[data-isotope-filter="' + el.val() + '"]').addClass('active');

                    if ($(section).length) {
                        section.isotope({
                            filter: el.val()
                        });
                    }

                });

            }

        }
    };


    /* =========================================================================
    Google Map
    ========================================================================= */
    GRAPHICFORT.googleMapfn = {
        // init
        init: function () {

            var maps = [];

            $('.gmap-block .map').each(function () {

                var el = $(this),
                    id = el.attr('id'),
                    zoom = parseInt(el.attr('data-map-zoom'), 10),
                    latitude = parseFloat(el.attr('data-map-latitude')),
                    longitude = parseFloat(el.attr('data-map-longitude')),
                    height = el.attr('data-map-height'),
                    styles = el.attr('data-map-style'),
                    center,
                    options;

                // Height
                if (height === 'responsive') {

                    el.wrap('<div class="fluid-width-video-wrapper"></div>');

                } else if (height === 'bg') {

                    el.css({height: el.parent().height()});

                } else {

                    height = parseInt(height, 10);

                    height = (!height)
                        ? 300
                        : height;

                    el.css({height: height});

                }

                // Zoom
                zoom = (!zoom)
                    ? 16
                    : zoom;
                zoom = (zoom < 0 || zoom > 22)
                    ? 16
                    : zoom;

                // Latitude
                latitude = (!latitude)
                    ? 0
                    : latitude;

                // Longitude
                longitude = (!longitude)
                    ? 0
                    : longitude;

                // Styles
                if (styles === 'silver') {

                    styles = [{elementType: "geometry", stylers: [{color: "#f5f5f5"}]}, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {elementType: "labels.text.fill", stylers: [{color: "#616161"}]}, {elementType: "labels.text.stroke", stylers: [{color: "#f5f5f5"}]}, {featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{color: "#bdbdbd"}]}, {featureType: "poi", elementType: "geometry", stylers: [{color: "#eeeeee"}]}, {featureType: "poi", elementType: "labels.text.fill", stylers: [{color: "#757575"}]}, {featureType: "poi.park", elementType: "geometry", stylers: [{color: "#e5e5e5"}]}, {featureType: "poi.park", elementType: "labels.text.fill", stylers: [{color: "#9e9e9e"}]}, {featureType: "road", elementType: "geometry", stylers: [{color: "#ffffff"}]}, {featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{color: "#757575"}]}, {featureType: "road.highway", elementType: "geometry", stylers: [{color: "#dadada"}]}, {featureType: "road.highway", elementType: "labels.text.fill", stylers: [{color: "#616161"}]}, {featureType: "road.local", elementType: "labels.text.fill", stylers: [{color: "#9e9e9e"}]}, {featureType: "transit.line", elementType: "geometry", stylers: [{color: "#e5e5e5"}]}, {featureType: "transit.station", elementType: "geometry", stylers: [{color: "#eeeeee"}]}, {featureType: "water", elementType: "geometry", stylers: [{color: "#c9c9c9"}]}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#9e9e9e"}]}];

                } else if (styles === 'retro') {

                    styles = [{elementType: "geometry", stylers: [{color: "#ebe3cd"}]}, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {elementType: "labels.text.fill", stylers: [{color: "#523735"}]}, {elementType: "labels.text.stroke", stylers: [{color: "#f5f1e6"}]}, {featureType: "administrative", elementType: "geometry.stroke", stylers: [{color: "#c9b2a6"}]}, {featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{color: "#dcd2be"}]}, {featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{color: "#ae9e90"}]}, {featureType: "landscape.natural", elementType: "geometry", stylers: [{color: "#dfd2ae"}]}, {featureType: "poi", elementType: "geometry", stylers: [{color: "#dfd2ae"}]}, {featureType: "poi", elementType: "labels.text.fill", stylers: [{color: "#93817c"}]}, {featureType: "poi.park", elementType: "geometry.fill", stylers: [{color: "#a5b076"}]}, {featureType: "poi.park", elementType: "labels.text.fill", stylers: [{color: "#447530"}]}, {featureType: "road", elementType: "geometry", stylers: [{color: "#f5f1e6"}]}, {featureType: "road.arterial", elementType: "geometry", stylers: [{color: "#fdfcf8"}]}, {featureType: "road.highway", elementType: "geometry", stylers: [{color: "#f8c967"}]}, {featureType: "road.highway", elementType: "geometry.stroke", stylers: [{color: "#e9bc62"}]}, {featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{color: "#e98d58"}]}, {featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{color: "#db8555"}]}, {featureType: "road.local", elementType: "labels.text.fill", stylers: [{color: "#806b63"}]}, {featureType: "transit.line", elementType: "geometry", stylers: [{color: "#dfd2ae"}]}, {featureType: "transit.line", elementType: "labels.text.fill", stylers: [{color: "#8f7d77"}]}, {featureType: "transit.line", elementType: "labels.text.stroke", stylers: [{color: "#ebe3cd"}]}, {featureType: "transit.station", elementType: "geometry", stylers: [{color: "#dfd2ae"}]}, {featureType: "water", elementType: "geometry.fill", stylers: [{color: "#b9d3c2"}]}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#92998d"}]}];

                } else if (styles === 'dark') {

                    styles = [{elementType: "geometry", stylers: [{color: "#212121"}]}, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {elementType: "labels.text.fill", stylers: [{color: "#757575"}]}, {elementType: "labels.text.stroke", stylers: [{color: "#212121"}]}, {featureType: "administrative", elementType: "geometry", stylers: [{color: "#757575"}]}, {featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{color: "#9e9e9e"}]}, {featureType: "administrative.land_parcel", stylers: [{visibility: "off"}]}, {featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{color: "#bdbdbd"}]}, {featureType: "poi", elementType: "labels.text.fill", stylers: [{color: "#757575"}]}, {featureType: "poi.park", elementType: "geometry", stylers: [{color: "#181818"}]}, {featureType: "poi.park", elementType: "labels.text.fill", stylers: [{color: "#616161"}]}, {featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{color: "#1b1b1b"}]}, {featureType: "road", elementType: "geometry.fill", stylers: [{color: "#2c2c2c"}]}, {featureType: "road", elementType: "labels.text.fill", stylers: [{color: "#8a8a8a"}]}, {featureType: "road.arterial", elementType: "geometry", stylers: [{color: "#373737"}]}, {featureType: "road.highway", elementType: "geometry", stylers: [{color: "#3c3c3c"}]}, {featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{color: "#4e4e4e"}]}, {featureType: "road.local", elementType: "labels.text.fill", stylers: [{color: "#616161"}]}, {featureType: "transit", elementType: "labels.text.fill", stylers: [{color: "#757575"}]}, {featureType: "water", elementType: "geometry", stylers: [{color: "#000000"}]}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#3d3d3d"}]}];

                } else if (styles === 'night') {

                    styles = [{elementType: "geometry", stylers: [{color: "#242f3e"}]}, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {elementType: "labels.text.fill", stylers: [{color: "#746855"}]}, {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]}, {featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{color: "#d59563"}]}, {featureType: "poi", elementType: "labels.text.fill", stylers: [{color: "#d59563"}]}, {featureType: "poi.park", elementType: "geometry", stylers: [{color: "#263c3f"}]}, {featureType: "poi.park", elementType: "labels.text.fill", stylers: [{color: "#6b9a76"}]}, {featureType: "road", elementType: "geometry", stylers: [{color: "#38414e"}]}, {featureType: "road", elementType: "geometry.stroke", stylers: [{color: "#212a37"}]}, {featureType: "road", elementType: "labels.text.fill", stylers: [{color: "#9ca5b3"}]}, {featureType: "road.highway", elementType: "geometry", stylers: [{color: "#746855"}]}, {featureType: "road.highway", elementType: "geometry.stroke", stylers: [{color: "#1f2835"}]}, {featureType: "road.highway", elementType: "labels.text.fill", stylers: [{color: "#f3d19c"}]}, {featureType: "transit", elementType: "geometry", stylers: [{color: "#2f3948"}]}, {featureType: "transit.station", elementType: "labels.text.fill", stylers: [{color: "#d59563"}]}, {featureType: "water", elementType: "geometry", stylers: [{color: "#17263c"}]}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#515c6d"}]}, {featureType: "water", elementType: "labels.text.stroke", stylers: [{color: "#17263c"}]}];

                } else if (styles === 'aubergine') {

                    styles = [{elementType: "geometry", stylers: [{color: "#1d2c4d"}]}, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {elementType: "labels.text.fill", stylers: [{color: "#8ec3b9"}]}, {elementType: "labels.text.stroke", stylers: [{color: "#1a3646"}]}, {featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{color: "#4b6878"}]}, {featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{color: "#64779e"}]}, {featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{color: "#4b6878"}]}, {featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{color: "#334e87"}]}, {featureType: "landscape.natural", elementType: "geometry", stylers: [{color: "#023e58"}]}, {featureType: "poi", elementType: "geometry", stylers: [{color: "#283d6a"}]}, {featureType: "poi", elementType: "labels.text.fill", stylers: [{color: "#6f9ba5"}]}, {featureType: "poi", elementType: "labels.text.stroke", stylers: [{color: "#1d2c4d"}]}, {featureType: "poi.park", elementType: "geometry.fill", stylers: [{color: "#023e58"}]}, {featureType: "poi.park", elementType: "labels.text.fill", stylers: [{color: "#3C7680"}]}, {featureType: "road", elementType: "geometry", stylers: [{color: "#304a7d"}]}, {featureType: "road", elementType: "labels.text.fill", stylers: [{color: "#98a5be"}]}, {featureType: "road", elementType: "labels.text.stroke", stylers: [{color: "#1d2c4d"}]}, {featureType: "road.highway", elementType: "geometry", stylers: [{color: "#2c6675"}]}, {featureType: "road.highway", elementType: "geometry.stroke", stylers: [{color: "#255763"}]}, {featureType: "road.highway", elementType: "labels.text.fill", stylers: [{color: "#b0d5ce"}]}, {featureType: "road.highway", elementType: "labels.text.stroke", stylers: [{color: "#023e58"}]}, {featureType: "transit", elementType: "labels.text.fill", stylers: [{color: "#98a5be"}]}, {featureType: "transit", elementType: "labels.text.stroke", stylers: [{color: "#1d2c4d"}]}, {featureType: "transit.line", elementType: "geometry.fill", stylers: [{color: "#283d6a"}]}, {featureType: "transit.station", elementType: "geometry", stylers: [{color: "#3a4762"}]}, {featureType: "water", elementType: "geometry", stylers: [{color: "#0e1626"}]}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#4e6d70"}]}];

                } else {

                    styles = [];

                }

                try {

                    center = new google.maps.LatLng(latitude, longitude);

                    options = {
                        zoom: zoom,
                        center: center,
                        styles: styles,
                        scrollwheel: false,
                        mapTypeControl: false,
                        streetViewControl: false
                    };

                    // Map
                    maps[id] = new google.maps.Map(document.getElementById(id), options);

                    // Markers
                    GRAPHICFORT.googleMapfn.markers(id, maps);

                } catch (error) {

                    if (error.toString().indexOf('google')) {
                        return false;
                    }

                }

            });

        },
        markers: function (id, maps) {

            var marker = [],
                infoWindow = [];

            $('#' + id).parents('.gmap-block').find('.marker').each(function (index) {

                var el = $(this),
                    latitude = parseFloat(el.attr('data-marker-latitude')),
                    longitude = parseFloat(el.attr('data-marker-longitude')),
                    icon = el.attr('data-marker-image'),
                    content = '<div class="infowindow">' + el.html() + '</div>';

                // Latitude
                latitude = (!latitude)
                    ? 0
                    : latitude;

                // Longitude
                longitude = (!longitude)
                    ? 0
                    : longitude;

                // infoWindow
                infoWindow[index] = new google.maps.InfoWindow({
                    content: content
                });

                // Marker
                marker[index] = new google.maps.Marker({
                    icon: icon,
                    position: new google.maps.LatLng(latitude, longitude),
                    animation: google.maps.Animation.DROP
                });
                marker[index].setMap(maps[id]);

                // Click
                marker[index].addListener('click', function () {
                    infoWindow[index].open(id, marker[index]);
                });

            });

        }
    };


    /* =========================================================================
    Image comparison
    ========================================================================= */
    GRAPHICFORT.imageComparisonfn = {
        // init
        init: function () {
            if ($().twentytwenty) {

                $('.image-comparison-block').twentytwenty({
                    before_label: 'Before',
                    after_label: 'After',
                    no_overlay: true
                });

            }
        }
    };


    /* =========================================================================
    Owl slider
    ========================================================================= */
    GRAPHICFORT.owlSliderfn = {
        // init
        init: function () {
            if ($().owlCarousel) {

                $('.owl-slider').each(function () {

                    var el = $(this),
                        itemsXL = parseInt(el.attr('data-owl-slider-items-xl'), 10),
                        itemsLG = parseInt(el.attr('data-owl-slider-items-lg'), 10),
                        itemsMD = parseInt(el.attr('data-owl-slider-items-md'), 10),
                        itemsSM = parseInt(el.attr('data-owl-slider-items-sm'), 10),
                        itemsXS = parseInt(el.attr('data-owl-slider-items-xs'), 10),
                        margin = parseInt(el.attr('data-owl-slider-items-margin'), 10),
                        loop = el.attr('data-owl-slider-loop'),
                        center = el.attr('data-owl-slider-center'),
                        nav = el.attr('data-owl-slider-arrows'),
                        arrowLeft,
                        arrowRight,
                        dots = el.attr('data-owl-slider-dots'),
                        autoplay = el.attr('data-owl-slider-autoplay'),
                        autoHeight = el.attr('data-owl-slider-auto-height'),
                        rtl = false,
                        rtlAttr = el.attr('data-page-direction'),
                        animateIn = el.attr('data-owl-slider-animateIn'),
                        animateOut = el.attr('data-owl-slider-animateOut'),
                        mouseDrag = el.attr('data-owl-slider-mouseDrag'),
                        touchDrag = el.attr('data-owl-slider-touchDrag'),
                        autoplayHoverPause,
                        thumbnailSliderActiveItem,
                        thumbnailSlider = el.attr('data-owl-slider-thumbnail');

                    /* Margin
                    --------------------------------------------------------- */
                    margin = (!margin)
                        ? 0
                        : margin;

                    /* Loop
                    --------------------------------------------------------- */
                    if (loop === 'yes') {
                        loop = true;
                    } else {
                        loop = false;
                    }

                    /* Center
                    --------------------------------------------------------- */
                    if (center === 'yes') {
                        center = true;
                    } else {
                        center = false;
                    }

                    /* Arrows
                    --------------------------------------------------------- */
                    if (nav === 'yes') {
                        nav = true;
                    } else {
                        nav = false;
                    }

                    if (rtlAttr === 'rtl') {
                        rtl = true;
                        arrowLeft = '<span class="screen-reader-text">Right</span><i class="fas fa-chevron-right"></i>';
                        arrowRight = '<span class="screen-reader-text">Left</span><i class="fas fa-chevron-left"></i>';
                    } else {
                        arrowLeft = '<span class="screen-reader-text">Left</span><i class="fas fa-chevron-left"></i>';
                        arrowRight = '<span class="screen-reader-text">Right</span><i class="fas fa-chevron-right"></i>';
                    }

                    /* Dots
                    --------------------------------------------------------- */
                    if (dots === 'yes') {
                        dots = true;
                    } else {
                        dots = false;
                    }

                    /* Autoplay
                    --------------------------------------------------------- */
                    if (autoplay === 'yes') {
                        autoplay = true;
                    } else {
                        autoplay = false;
                    }

                    if (el.parent().hasClass('section-slider-media')) {
                        autoplayHoverPause = false;
                    } else {
                        autoplayHoverPause = true;
                    }

                    /* Auto height
                    --------------------------------------------------------- */
                    if (autoHeight === 'no') {
                        autoHeight = false;
                    } else {
                        autoHeight = true;
                    }

                    /* Items
                    --------------------------------------------------------- */
                    itemsXL = (!itemsXL)
                        ? 1
                        : itemsXL;

                    itemsLG = (!itemsLG)
                        ? 1
                        : itemsLG;

                    itemsMD = (!itemsMD)
                        ? 1
                        : itemsMD;

                    itemsSM = (!itemsSM)
                        ? 1
                        : itemsSM;

                    itemsXS = (!itemsXS)
                        ? 1
                        : itemsXS;

                    /* Animation
                    --------------------------------------------------------- */
                    // IN
                    animateIn = (!animateIn)
                        ? ''
                        : animateIn;

                    // OUT
                    animateOut = (!animateOut)
                        ? ''
                        : animateOut;

                    /* Drag
                    --------------------------------------------------------- */
                    // Mouse
                    if (mouseDrag === 'no') {
                        mouseDrag = false;
                    } else {
                        mouseDrag = true;
                    }

                    // Touch
                    if (touchDrag === 'no') {
                        touchDrag = false;
                    } else {
                        touchDrag = true;
                    }

                    /* Thumbnail slider
                    --------------------------------------------------------- */
                    if (thumbnailSlider === 'yes') {

                        el.next('.owl-slider-thumbnail').find('.owl-slider-item').each(function (index) {
                            $(this).attr('data-owl-slider-jump-to', index);
                        });

                        el.next('.owl-slider-thumbnail').find('[data-owl-slider-jump-to=0]').addClass('owl-slider-active-item');

                    }

                    /* init
                    --------------------------------------------------------- */
                    el.on('initialized.owl.carousel', function () {

                        // Auto height
                        if (autoHeight === false) {

                            var minHeight = 0;

                            el.find('.owl-item').each(function () {

                                minHeight = $(this).height() > minHeight
                                    ? $(this).height()
                                    : minHeight;

                            });

                            el.find('.owl-item').css({minHeight: minHeight + 'px'});
                            el.find('.owl-item').css({height: minHeight + 'px'});

                        }

                    });
                    el.owlCarousel({
                        navSpeed: 600,
                        dotsSpeed: 600,
                        lazyLoad: true,
                        responsiveClass: true,
                        loop: loop,
                        autoplaySpeed: 600,
                        autoplay: autoplay,
                        autoplayHoverPause: autoplayHoverPause,
                        margin: margin,
                        autoHeight: autoHeight,
                        mouseDrag: mouseDrag,
                        touchDrag: touchDrag,
                        rtl: rtl,
                        dots: dots,
                        nav: nav,
                        center: center,
                        navText: [arrowLeft, arrowRight],
                        animateIn: animateIn,
                        animateOut: animateOut,
                        responsive: {
                            '0': {items: parseInt(itemsXS, 10)},       // Mobile Portrait      < 576px
                            '576': {items: parseInt(itemsSM, 10)},     // Mobile Landscape     >= 576px
                            '768': {items: parseInt(itemsMD, 10)},     // Tablet Portrait      >= 768px
                            '992': {items: parseInt(itemsLG, 10)},     // Tablet Landscape     >= 992px
                            '1200': {items: parseInt(itemsXL, 10)}     // Desktop              >= 1200px
                        },
                        onTranslate: function (elem) {

                            // Animation
                            if (el.find('.gfort-animated').length && !isMobile.any()) {

                                el.find('.gfort-animated').each(function () {
                                    $(this).removeClass('animate__animated').removeClass('gfort-animated').removeClass($(this).attr('data-animation'));
                                });

                                GRAPHICFORT.animation.init();

                            }

                            // Thumbnail Slider
                            if (thumbnailSlider === 'yes') {

                                el.next('.owl-slider-thumbnail').find('.owl-slider-active-item').removeClass('owl-slider-active-item');

                                thumbnailSliderActiveItem = elem.item.index - el.find('.owl-item.cloned').length / 2;
                                if (thumbnailSliderActiveItem === -1) {
                                    thumbnailSliderActiveItem = el.find('.owl-item').length - el.find('.owl-item.cloned').length - 1;
                                } else if (thumbnailSliderActiveItem === elem.item.count) {
                                    thumbnailSliderActiveItem = 0;
                                }

                                el.next('.owl-slider-thumbnail').trigger('to.owl.carousel', [thumbnailSliderActiveItem, 300, true]);

                                el.next('.owl-slider-thumbnail').find('[data-owl-slider-jump-to="' + thumbnailSliderActiveItem + '"]').addClass('owl-slider-active-item');

                            }

                        },
                        onResized: function () {

                            // Auto height
                            if (autoHeight === false) {

                                var minHeight = 0;

                                el.find('.owl-item').css({minHeight: '0'});
                                el.find('.owl-item').css({height: 'auto'});

                                el.find('.owl-item').each(function () {

                                    minHeight = $(this).height() > minHeight
                                        ? $(this).height()
                                        : minHeight;

                                });

                                el.find('.owl-item').css({minHeight: minHeight + 'px'});
                                el.find('.owl-item').css({height: minHeight + 'px'});

                            }

                        }
                    });

                    /* Keyboard navigation
                    --------------------------------------------------------- */
                    el.on({
                        mouseenter: function () {
                            el.attr('data-owl-slider-mouse-enter', 'true');
                        },
                        mouseleave: function () {
                            el.attr('data-owl-slider-mouse-enter', 'false');
                        }
                    });

                    $(document).keyup(function (i) {
                        if (i.keyCode === 37) {
                            if (el.attr('data-owl-slider-mouse-enter') === 'true') {
                                el.trigger('prev.owl.carousel');
                            }
                        } else if (i.keyCode === 39) {
                            if (el.attr('data-owl-slider-mouse-enter') === 'true') {
                                el.trigger('next.owl.carousel');
                            }
                        }
                    });

                    /* Jump to Slide
                    --------------------------------------------------------- */
                    $('body').on('click', '[data-owl-slider-jump-to]', function (e) {

                        e.preventDefault();

                        $(this).parents('.owl-slider-thumbnail').find('.owl-slider-active-item').removeClass('owl-slider-active-item');

                        $(this).addClass('owl-slider-active-item');

                        $(this).parents('.owl-slider-thumbnail').prev('.owl-slider').trigger('to.owl.carousel', [$(this).attr('data-owl-slider-jump-to'), 600, true]);

                    });

                });

            }
        }
    };


    /* =========================================================================
    Mailchimp
    ========================================================================= */
    GRAPHICFORT.mailchimpfn = {
        // init
        init: function () {

            $('.form-block-mailchimp').each(function () {
                $('form', this).attr('action', mailchimpFormURL.replace('/post?', '/post-json?').concat('&c=?'));
            });

            $('body').on('submit', '.form-block-mailchimp form', function () {

                var form = $(this),
                    button = form.find('button'),
                    formURL = form.attr('action'),
                    formData = form.serialize();

                form.find('.form-message').remove();

                $.ajax({
                    type: 'POST',
                    url: formURL,
                    data: formData,
                    dataType: 'jsonp',
                    cache: true,
                    beforeSend: function () {

                        button.addClass('show-spinner').attr('disabled', '');

                    },
                    success: function (response) {

                        if (response.result === 'error') {

                            form.append('<div class="form-message col-lg-12"><div class="alert alert-danger">' + response.msg + '</div></div>');

                            form.find('input[type="email"]').addClass('error');

                        } else {

                            form.append('<div class="form-message col-lg-12"><div class="alert alert-success">' + response.msg + '</div></div>');

                            form.find('input').each(function () {
                                $(this).val('');
                            });

                            form.find('input[type="email"]').removeClass('error');

                        }

                        button.removeClass('show-spinner').removeAttr('disabled');

                    }
                });

                return false;

            });

        }
    };


    /* =========================================================================
    Notifications
    ========================================================================= */
    GRAPHICFORT.notificationsfn = {
        // init
        init: function () {

            $('.notification-block').each(function () {

                var el = $(this),
                    cookieName = el.attr('data-cookie-name');

                cookieName = (!cookieName)
                    ? 'GRAPHICFORT'
                    : cookieName;

                if (GRAPHICFORT.notificationsfn.getCookie(cookieName) === '0') {

                    if ($('#page-preloader').length) {

                        el.addClass('notification-preloader-show');

                    } else {

                        el.addClass('show');
                    }

                }

            });

            // Dismiss
            $('.btn-notification-dismiss').on('click', function () {

                $('body').removeClass('notification-block-layout-3-stop-scroll');

                var el = $(this),
                    cookieName = el.parents('.notification-block').attr('data-cookie-name'),
                    cookieEXdays = parseInt(el.parents('.notification-block').attr('data-cookie-expire'), 10);

                cookieName = (!cookieName)
                    ? 'GRAPHICFORT'
                    : cookieName;

                cookieEXdays = (!cookieEXdays)
                    ? 0
                    : cookieEXdays;

                $(this).parents('.notification-block').removeClass('show');
                $(this).parents('.notification-block').removeClass('notification-preloader-show');

                // Set cookie
                GRAPHICFORT.notificationsfn.setCookie(cookieName, '1', cookieEXdays);

                // Reset timer
                clearTimeout(notificationsTimer);

            });

        },
        // Set cookie
        setCookie: function (cookieName, cookieValue, cookieEXdays) {

            var date = new Date(),
                expires;

            date.setTime(date.getTime() + (cookieEXdays * 24 * 60 * 60 * 1000));
            expires = 'expires=' + date.toGMTString();

            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";

        },
        // Get cookie
        getCookie: function (cookieName) {

            cookieName = cookieName + '=';

            var decodedCookie = decodeURIComponent(document.cookie),
                cookieArray = decodedCookie.split(';'),
                count,
                cookie;

            for (count = 0; count < cookieArray.length; count += 1) {

                cookie = cookieArray[count];

                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(cookieName) === 0) {
                    return cookie.substring(cookieName.length, cookie.length);
                }

            }

            return '0';

        },
        // Perfect scrollbar
        perfectScrollbar: function () {

            if ($('.notification-block-layout-3').length) {
                $('body').addClass('notification-block-layout-3-stop-scroll');
            }

            try {

                if ($('.notification-block-layout-3').length) {

                    $('.notification-block-layout-3').each(function () {
                        $(this).perfectScrollbar();
                    });

                } else {

                    $('.notification-block-layout-2').each(function () {
                        $(this).find('.notification-block-body').perfectScrollbar();
                    });

                }

            } catch (error) {

                if (error.toString().indexOf('PerfectScrollbar')) {
                    return false;
                }

            }

        }
    };


    /* =========================================================================
    Easy Pie chart
    ========================================================================= */
    GRAPHICFORT.easyPieChartfn = {
        // init
        init: function () {
            if ($().easyPieChart) {

                $('.pie-chart-block').each(function () {

                    var el = $(this),
                        container = $('> .pie-chart-block-container', el),
                        pie,
                        percent = parseFloat(el.attr('data-pie-chart-percent')),
                        barColor = el.attr('data-pie-chart-bar-color'),
                        trackColor = el.attr('data-pie-chart-track-color'),
                        size = 156;

                    // Percent
                    percent = (!percent)
                        ? 100
                        : percent;

                    // Size
                    if (el.width() < 156) {
                        size = Math.ceil(el.width() - 2);
                    }

                    container.prepend('<div class="main-block-header pie-chart-block-header"><div class="pie-chart-block-circle"></div><h3 class="pie-chart-block-percent" style="color: ' + barColor + '"><span data-from="0" data-to="' + percent + '" data-speed="1000" data-interval="50">' + percent + '</span><span>%</span></h3></div>');

                    pie = el.find('.pie-chart-block-circle');

                    if ($().appear) {

                        pie.appear(function () {

                            pie.easyPieChart({
                                size: size,
                                scaleLength: 0,
                                lineWidth: '3',
                                scaleColor: false,
                                lineCap: 'square',
                                barColor: barColor,
                                trackColor: trackColor,
                                animate: {
                                    duration: 1500,
                                    enabled: true
                                }
                            });

                            pie.data('easyPieChart').update(Math.ceil(percent));

                        }, {accX: 0, accY: -108});

                    } else {

                        pie.easyPieChart({
                            size: size,
                            scaleLength: 0,
                            lineWidth: '3',
                            scaleColor: false,
                            lineCap: 'square',
                            barColor: barColor,
                            trackColor: trackColor,
                            animate: {
                                duration: 1500,
                                enabled: true
                            }
                        });

                        pie.data('easyPieChart').update(Math.ceil(percent));

                    }

                    GRAPHICFORT.countTofn.init();

                });

            }
        }
    };


    /* =========================================================================
    Progress bar
    ========================================================================= */
    GRAPHICFORT.progressBarfn = {
        // init
        init: function () {
            $('.progress').each(function () {

                var el = $(this),
                    percent = parseFloat(el.attr('data-progress-percent')) + '%',
                    title = el.attr('data-progress-title'),
                    lightColor = el.attr('class'),
                    line = $('> .progress-bar', el);

                if (lightColor.indexOf('light-color') > -1) {

                    lightColor = 'light-color';

                } else {

                    lightColor = '';

                }

                el.before('<div class="progress-title-percent ' + lightColor + '"><h6><span>' + title + '</span><span>' + percent + '</span></h6></div>');

                if ($().appear) {

                    line.appear(function () {
                        line.animate({width: percent}, 800);
                    }, {accX: 0, accY: -108});

                } else {

                    line.animate({width: percent}, 800);

                }

            });
        }
    };


    /* =========================================================================
    Parallax
    ========================================================================= */
    GRAPHICFORT.parallaxfn = {
        // init
        init: function () {
            if ($().parallax) {

                $('.parallax-section').each(function () {
                    $(this).parallax('50%', 0.3);
                });

            }
        }
    };


    /* =========================================================================
    BG video
    ========================================================================= */
    GRAPHICFORT.bgVideofn = {
        // init
        init: function (element) {

            var el = element,
                parent = el.parent(),
                parentWidth = parseInt(parent.outerWidth(true), 10),
                parentHeight = parseInt(parent.outerHeight(true), 10),
                elWidth,
                elHeight,
                elMarginTop,
                elMarginLeft;

            if (!isMobile.any()) {

                elWidth = parseInt(parentHeight * 16 / 9, 10);

                if (elWidth > parentWidth) {

                    elWidth = parseInt(parentHeight * 16 / 9, 10);
                    elHeight = parseInt(parentHeight, 10);
                    elMarginTop = 0;
                    elMarginLeft = parseInt((parentWidth - elWidth) / 2, 10);

                } else {

                    elWidth = parseInt(parentWidth, 10);
                    elHeight = parseInt(parentWidth * 9 / 16, 10);
                    elMarginTop = parseInt((parentHeight - elHeight) / 2, 10);
                    elMarginLeft = 0;

                }

                el.css({
                    width: elWidth,
                    height: elHeight,
                    marginTop: elMarginTop,
                    marginLeft: elMarginLeft
                });

            }

        }
    };


    /* =========================================================================
    Youtube BG video
    ========================================================================= */
    GRAPHICFORT.youtubeBGVideofn = {
        // init
        init: function () {
            $('.youtube-bg-video').each(function (index) {

                var el = $(this),
                    url = el.attr('data-youtube-bg-video-url'),
                    videoID = url.split('?v=')[1],
                    autoplay = el.attr('data-youtube-bg-video-autoplay'),
                    mute = el.attr('data-youtube-bg-video-mute'),
                    src;

                if (!isMobile.any()) {

                    /* autoplay
                    --------------------------------------------------------- */
                    if (autoplay === 'no') {

                        autoplay = '&autoplay=0';

                    } else {

                        autoplay = '&autoplay=1';

                    }

                    /* Mute
                    --------------------------------------------------------- */
                    if (mute === 'no') {

                        mute = '&mute=0';

                    } else {

                        mute = '&mute=1';

                    }

                    /* iframe
                    --------------------------------------------------------- */
                    src = 'https://www.youtube.com/embed/' + videoID + '?enablejsapi=1&iv_load_policy=3&enablejsapi=1&disablekb=1&controls=0&widgetid=1&showinfo=0&loop=1&&playlist=' + videoID + '&rel=0' + mute + autoplay;

                    el.append('<iframe src="' + src + '" id="youtube-iframe-bg-video-' + index + '" class="youtube-iframe-bg-video"></iframe>');

                    /* Resize iframe
                    --------------------------------------------------------- */
                    GRAPHICFORT.bgVideofn.init(el);

                }

                /* Youtube Play btn (Mobile)
                ------------------------------------------------------------- */
                if (isMobile.any()) {
                    el.parent('.section-media-bg').after('<a class="btn-youtube-bg-video" href="' + url + '" data-lightbox title="Play"></a>');
                }
                GRAPHICFORT.fancyboxfn.init();

            });
        }
    };


    /* =========================================================================
    Share
    ========================================================================= */
    GRAPHICFORT.sharefn = {
        // init
        init: function () {

            var url = $(location).attr('href'),
                title = $(document).attr('title');

            // Buttons href
            $('.btn-share-facebook a').attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
            $('.btn-share-twitter a').attr('href', 'https://twitter.com/intent/tweet?text=' + title + '&amp;url=' + url);
            $('.btn-share-linkedin a').attr('href', 'https://www.linkedin.com/shareArticle?mini=true&amp;url=' + url + '&amp;title=' + title);
            $('.btn-share-tumblr a').attr('href', 'https://www.tumblr.com/share/link?url=' + url + '&amp;name=' + title);
            $('.btn-share-reddit a').attr('href', 'https://reddit.com/submit?url=' + url + '&amp;title=' + title);
            $('.btn-share-vk a').attr('href', 'https://vk.com/share.php?url=' + url);
            $('.btn-share-pocket a').attr('href', 'https://getpocket.com/save?title=' + title + '&amp;url=' + url);
            $('.btn-share-stumbleupon a').attr('href', 'https://www.stumbleupon.com/submit?url=' + url + '&amp;title=' + title);

            // open share pop up window
            $('body').on('click', '.btn-share a', function () {
                window.open($(this).attr('href'), 'popupWindow', 'width=600, height=600, scrollbars=yes');
            });

        }
    };


    /* =========================================================================
    Tabs
    ========================================================================= */
    GRAPHICFORT.tabsfn = {
        // init
        init: function () {

            // Add the select element
            $('.tabs-block-select').each(function () {

                var el = $(this),
                    nav = $('> nav .nav-tabs', el),
                    select = '',
                    maxWidth = parseInt(el.attr('data-tabs-block-select-width'), 10);

                if (maxWidth > 0) {
                    maxWidth = 'style="max-width: ' + maxWidth + 'px' + '"';
                } else {
                    maxWidth = '';
                }

                select = '<select class="tabs-select form-control secondary-font-family" aria-label="Select" ' + maxWidth + '>';

                $('> .nav-link', nav).each(function () {
                    select += '<option value="' + $(this).attr('data-bs-target') + '">' + $(this).text() + '</option>';
                });

                select += '</select>';

                el.prepend(select);

            });

            // nav button (on click)
            $('.tabs-block-select .nav-tabs .nav-link').on('click', function () {
                $(this).parents('.tabs-block-select').find('.tabs-select').val($(this).attr('data-bs-target'));
            });

            // Select (on change)
            $('body').on('change', '.tabs-select', function () {

                var parent = $(this).parents('.tabs-block-select');

                parent.find('.nav-tabs .nav-link.active').removeClass('active');
                parent.find('.tab-content .tab-pane.active').removeClass('active');
                parent.find('.tab-content .tab-pane.show').removeClass('show');
                parent.find('.nav-link[data-bs-target="' + $(this).val() + '"]').addClass('active');
                parent.find($(this).val()).addClass('show');
                parent.find($(this).val()).addClass('active');

            });

        }
    };


    /* =========================================================================
    Twitter feed
    ========================================================================= */
    GRAPHICFORT.twitterFeedfn = {
        // init
        init: function () {
            if ($().tweetie) {

                $('.twitter-feed-block').each(function () {

                    var el = $(this),
                        count = parseInt(el.attr('data-twitter-feed-tweets-count'), 10),
                        screen_name = el.attr('data-twitter-feed-screen-name'),
                        slider = el.attr('data-twitter-feed-slider'),
                        colXL = el.attr('data-twitter-feed-col-xl'),
                        colLG = el.attr('data-twitter-feed-col-lg'),
                        colMD = el.attr('data-twitter-feed-col-md'),
                        colSM = el.attr('data-twitter-feed-col-sm'),
                        colXS = el.attr('data-twitter-feed-col-xs'),
                        itemClass = '',
                        template = '';

                    /* Columns
                    --------------------------------------------------------- */
                    colXL = (!colXL)
                        ? 'col-xl-12'
                        : colXL;

                    colLG = (!colLG)
                        ? 'col-lg-12'
                        : colLG;

                    colMD = (!colMD)
                        ? 'col-md-12'
                        : colMD;

                    colSM = (!colSM)
                        ? 'col-sm-12'
                        : colXL;

                    colXS = (!colXS)
                        ? 'col-12'
                        : colXS;

                    // Item class
                    if (el.hasClass('twitter-feed-block-layout-2')) {
                        itemClass = 'boxed-block white-color-bg grey-2-color-border';
                    }

                    /* Template
                    --------------------------------------------------------- */
                    // Slider
                    if (slider === 'yes') {
                        template += '<div class="owl-slider-item">';
                    }

                    // Grid
                    if (slider !== 'yes' && el.hasClass('twitter-feed-block-layout-2')) {
                        template += '<div class="isotope-item ' + colXL + ' ' + colLG + ' ' + colMD + ' ' + colSM + ' ' + colXS + '">';
                    }

                    // Wrapper
                    template += '<div class="main-block twitter-feed-block-item ' + itemClass + '">';
                    // Container
                    template += '<div class="main-block-container twitter-feed-block-item-container">';


                    // Header
                    template += '<div class="main-block-header twitter-feed-block-item-header">';

                    // Avatar
                    template += '<div class="user-avatar">';
                    template += '<a href="https://twitter.com/{{tweet.user.screen_name}}/" target="_blank" rel="noopener">';
                    template += '<img src="{{tweet.user.profile_image_url_https}}" alt="{{tweet.user.screen_name}}" />';
                    template += '</a>';
                    template += '</div>';

                    // User info
                    template += '<div class="user-info">';
                    template += '<h6 class="user-name">';
                    template += '<a href="https://twitter.com/{{tweet.user.screen_name}}/" target="_blank" rel="noopener">{{tweet.user.name}}</a>';
                    template += '<a href="https://twitter.com/{{tweet.user.screen_name}}/" target="_blank" rel="noopener" title="{{tweet.user.name}}" class="bird"><i class="fab fa-twitter"></i></a>';
                    template += '</h6>';
                    template += '<h6 class="screen-name">';
                    template += '<a href="https://twitter.com/{{tweet.user.screen_name}}/" target="_blank" rel="noopener">&commat;{{tweet.user.screen_name}}</a>';
                    template += '</h6>';
                    template += '</div>';

                    template += '</div>'; //End header


                    // Body
                    template += '<div class="main-block-body twitter-feed-block-item-body">';

                    // Content
                    template += '<div class="main-block-content twitter-feed-block-item-content">';
                    template += '<p>{{tweet.text}}</p>';
                    template += '</div>';

                    // Footer
                    template += '<div class="main-block-footer twitter-feed-block-item-footer secondary-font-family">';

                    template += '<div class="date">';
                    template += '<a href="https://twitter.com/{{tweet.user.screen_name}}/status/{{tweet.id_str}}" target="_blank" rel="noopener">{{tweet.created_at}}</a>';
                    template += '</div>';

                    template += '<div class="action-buttons">';
                    template += '<a class="reply" href="https://twitter.com/intent/tweet?in_reply_to={{tweet.id_str}}" target="_blank" rel="noopener" title="Reply" data-bs-toggle="tooltip" data-bs-original-title="Reply"><i class="far fa-comment-alt"></i></a>';
                    template += '<a class="retweet" href="https://twitter.com/intent/retweet?tweet_id={{tweet.id_str}}" target="_blank" rel="noopener" title="Retweet" data-bs-toggle="tooltip" data-bs-toggle-original-title="Retweet"><i class="fas fa-retweet"></i></a>';
                    template += '<a class="favorite" href="https://twitter.com/intent/favorite?tweet_id={{tweet.id_str}}" target="_blank" rel="noopener" title="Like" data-bs-toggle="tooltip" data-bs-toggle-original-title="Like"><i class="far fa-heart"></i></a>';
                    template += '</div>';

                    template += '</div>'; // End footer

                    template += '</div>'; //End body


                    template += '</div>'; //End container
                    template += '</div>'; //End wrapper

                    // Grid
                    if (slider !== 'yes' && el.hasClass('twitter-feed-block-layout-2')) {
                        template += '</div">';
                    }

                    // Slider
                    if (slider === 'yes') {
                        template += '</div">';
                    }

                    /* Count
                    --------------------------------------------------------- */
                    count = (!count)
                        ? 1
                        : count;

                    /* Tweetie init
                    --------------------------------------------------------- */
                    el.tweetie({
                        url: 'assets/js/plugins/tweetie/api/server.php',
                        type: 'timeline',
                        dateFormat: '%b %d, %Y',
                        params: {
                            count: count,
                            screen_name: screen_name
                        },
                        template: template
                    }, function () {

                        /* Slider
                        ----------------------------------------------------- */
                        if (slider === 'yes') {
                            el.addClass('owl-slider owl-carousel');
                            GRAPHICFORT.owlSliderfn.init();
                        }

                        /* Layout 2
                        ----------------------------------------------------- */
                        if (slider !== 'yes' && el.hasClass('twitter-feed-block-layout-2')) {
                            el.wrapInner('<div class="row gx-36 isotope-grid"></div>');
                            GRAPHICFORT.isotopefn.init();
                        }

                    });

                });

            }
        }
    };


    /* =========================================================================
    Price slider
    ========================================================================= */
    GRAPHICFORT.priceSliderfn = {
        // init
        init: function () {

            $('.price-slider-form').each(function () {

                var sliderID = $(this).find('.price-slider').attr('id'),
                    minID = '#' + sliderID + '-min',
                    maxID = '#' + sliderID + '-max',
                    minValue = parseInt($(minID).attr('value'), 10),
                    maxValue = parseInt($(maxID).attr('value'), 10),
                    currencySymbolID = '#' + sliderID + '-label',
                    currencySymbol = $(currencySymbolID).attr('data-currencySymbol'),
                    from = $(currencySymbolID).find('.from'),
                    to = $(currencySymbolID).find('.to');

                $('#' + sliderID).slider({
                    range: true,
                    min: minValue,
                    max: maxValue,
                    values: [minValue, maxValue],
                    slide: function (event, ui) {
                        $(minID).val(ui.values[0]);
                        $(maxID).val(ui.values[1]);
                        $(from).html(currencySymbol + ui.values[0]);
                        $(to).html(currencySymbol + ui.values[1]);
                    }
                });

                $(from).html(currencySymbol + $('#' + sliderID).slider('values', 0));
                $(to).html(currencySymbol + $('#' + sliderID).slider('values', 1));

            });

        }
    };


    /* =========================================================================
    Sticky sidebar
    ========================================================================= */
    GRAPHICFORT.stickySidebarfn = {
        // init
        init: function () {
            if ($().stickySidebar) {

                var topSpacing = 60;

                if ($('.header-section-fixed').length) {
                    topSpacing = topSpacing + $('.header-section-fixed').height();
                }

                $('#sticky-sidebar').stickySidebar({
                    containerSelector: '#sticky-sidebar-wrapper',
                    innerWrapperSelector: '.sticky-sidebar-container',
                    topSpacing: topSpacing
                });

            }
        }
    };


    /* =========================================================================
    Checkbox
    ========================================================================= */
    GRAPHICFORT.checkBoxAllfn = {
        // init
        init: function () {

            // Parent
            $('[data-select-all]').on('change', function () {

                var status = $(this)[0].checked,
                    name = $(this).attr('name');

                $('input[name="' + name + '[]"]').each(function () {
                    $(this)[0].checked = status;
                });

            });

            // Children
            $('input[type="checkbox"]').on('change', function () {
                if ($(this).attr('name').indexOf('[]') !== -1) {

                    var name = $(this).attr('name'),
                        parentName = name.substring(0, name.length - 2);

                    if ($(this)[0].checked === false) {
                        if ($('[name="' + parentName + '"]').length) {
                            $('[name="' + parentName + '"]')[0].checked = false;
                        }
                    }

                    if ($('input[name="' + name + '"]').length === $('input[name="' + name + '"]:checked').length) {
                        if ($('[name="' + parentName + '"]').length) {
                            $('[name="' + parentName + '"]')[0].checked = true;
                        }
                    }

                }
            });

        }
    };


    /* =========================================================================
    Shop
    ========================================================================= */
    GRAPHICFORT.shopfn = {
        // Review link
        reviewLink: function () {
            $('body').on('click', '.product-rating a', function (e) {
                if ($(this.hash).length) {

                    e.preventDefault();

                    var id = $(this).attr('href').replace('#', ''),
                        link,
                        linkAttr;

                    $(this).parents('.shop-block-inner').find('.nav-tabs .nav-link').each(function () {

                        link = $(this);
                        linkAttr = link.attr('data-bs-target').replace('#', '');

                        link.removeClass('active').attr('aria-selected', 'false');

                        if (linkAttr === id) {

                            link.addClass('active').attr('aria-selected', 'true');
                            link.parents('.tabs-block').find('.tab-pane').removeClass('active').removeClass('show');
                            link.parents('.tabs-block').find('#' + linkAttr).addClass('active').addClass('show');

                            if ($('.tabs-block-select').length) {
                                link.parents('.tabs-block-select').find('.tabs-select').val(link.attr('data-bs-target'));
                            }

                            if ($('.header-section').hasClass('header-section-fixed') && !isMobile.any()) {
                                $('html, body').animate({scrollTop: $('#' + linkAttr).offset().top - $('.header-section-fixed .header-menu-section-container').height()}, 800);
                            } else {
                                $('html, body').animate({scrollTop: $('#' + linkAttr).offset().top}, 800);
                            }

                        }

                    });

                }
            });
        },
        // Payment method
        paymentMethod: function () {

            $('#payment li input[type="radio"]').each(function () {
                if ($(this)[0].checked === true) {
                    $(this).parents('li').find('.payment-content:not(.radio)').css({display: 'block'});
                }
            });

            $('#payment li input[type="radio"]').on('change', function () {
                $(this).parents('ul').find('.payment-content:not(.radio)').each(function () {
                    $(this).slideUp();
                });
                $(this).parents('li').find('.payment-content:not(.radio)').slideDown();
            });

        }
    };


    /* =========================================================================
    Animation
    ========================================================================= */
    GRAPHICFORT.animation = {
        // init
        init: function () {
            if ($().appear) {

                $('[data-animation]').each(function () {

                    var el = $(this),
                        animateClass = el.attr('data-animation'),
                        animateDelay = parseInt(el.attr('data-animation-delay'), 10);

                    animateDelay = (!animateDelay)
                        ? 500
                        : animateDelay + 500;

                    if (!el.hasClass('animate__animated')) {

                        el.addClass('not-animated');

                        el.appear(function () {
                            animationTimer = setTimeout(function () {
                                el.removeClass('not-animated').addClass(animateClass + ' animate__animated gfort-animated');
                            }, animateDelay);
                        }, {accX: 0, accY: -108});

                    }

                });

            }
        }
    };


    /* =========================================================================
    Text animation
    ========================================================================= */
    GRAPHICFORT.typedfn = {
        // init
        init: function () {
            if ($().typed) {

                $('.text-animation').each(function () {

                    var el = $(this),
                        strings = [],
                        typed = el.next().attr('id');

                    el.children().each(function () {
                        strings.push($(this).text());
                    });

                    $('#' + typed).typed({
                        loop: true,
                        typeSpeed: 30,
                        backDelay: 2000,
                        strings: strings
                    });

                });

            }
        }
    };


    /* =========================================================================
    Ready
    ========================================================================= */
    GRAPHICFORT.documentOnReady = {
        // init
        init: function () {

            // Desktop
            if (!isMobile.any()) {
                $('body').addClass('desktop-device');
            } else {
                $('body').addClass('mobile-device');
            }

            // Page PreLoader
            if ($('#page-preloader').length) {
                GRAPHICFORT.pagePreLoaderfn.loader();
            }

            // Bootstrap
            GRAPHICFORT.bootstrapfn.toolTip();
            GRAPHICFORT.bootstrapfn.modal();
            GRAPHICFORT.bootstrapfn.scrollspy();

            // fitVids
            GRAPHICFORT.fitVidsfn.init();

            // mediaElement Player
            if ($('video').length || $('audio').length) {
                GRAPHICFORT.mediaElementPlayerfn.init();
            }

            // Scroll to
            GRAPHICFORT.scrollTofn.init();

            // Header
            GRAPHICFORT.headerfn.mobileMenu();
            GRAPHICFORT.headerfn.init();
            GRAPHICFORT.headerfn.currentPage();
            GRAPHICFORT.headerfn.subMenu();
            GRAPHICFORT.headerfn.searchForm();
            if ($('.header-middle-section').length) {
                GRAPHICFORT.headerfn.middleSection();
            }
            if ($('.header-section-transparent').length || $('.header-section-layout-2').length) {
                GRAPHICFORT.headerfn.transparent();
            }
            if ($('#header-offcanvas-menu').length) {
                GRAPHICFORT.headerfn.offcanvas();
                GRAPHICFORT.headerfn.perfectScrollbar();
            }

            // Current year
            if ($('.current-year').length) {
                $('.current-year').html(new Date().getFullYear());
            }

            // Form
            // reCAPTCHA
            if ($('.g-recaptcha-response').length) {
                $('.g-recaptcha-response').each(function (index) {
                    $(this).attr('id', $(this).attr('class') + '-' + index);
                    GRAPHICFORT.formfn.reCAPTCHA($(this));
                });
            }
            // Validation
            if ($('.form-block-validation').length) {
                GRAPHICFORT.formfn.validation();
            }
            // Checkbox accept
            if ($('.form-check-must-accept').length) {
                GRAPHICFORT.formfn.checkboxAccept();
            }

            // Count To
            if ($('[data-to]').length && !isMobile.any()) {
                GRAPHICFORT.countTofn.init();
            }

            // downCount timer
            if ($('.downcount-block').length) {
                GRAPHICFORT.downCountfn.init();
            }

            // Fancybox
            if ($('[data-lightbox]').length) {
                GRAPHICFORT.fancyboxfn.init();
            }

            // isotope
            // Grid
            if ($('.isotope-grid').length) {
                GRAPHICFORT.isotopefn.init();
            }
            // Filter
            if ($('.isotope-filter').length) {
                GRAPHICFORT.isotopefn.filter();
            }

            // Google Map
            if ($('.gmap-block .map').length) {

                $('.gmap-block .map').each(function (index) {
                    $(this).attr('id', 'map-' + index);
                });

                $.ajax({
                    type: 'GET',
                    url: 'https://maps.googleapis.com/maps/api/js?key=' + gmapAPIKey,
                    dataType: 'script',
                    cache: true
                }).done(function () {
                    GRAPHICFORT.googleMapfn.init();
                });

            }

            // Image comparison
            if ($('.image-comparison-block').length) {
                GRAPHICFORT.imageComparisonfn.init();
            }

            // Owl slider
            if ($('.owl-slider').length) {
                GRAPHICFORT.owlSliderfn.init();
            }

            // Mailchimp
            if ($('.form-block-mailchimp').length) {
                GRAPHICFORT.mailchimpfn.init();
            }

            // Notifications
            if ($('.notification-block').length) {

                notificationsTimer = setTimeout(function () {

                    GRAPHICFORT.notificationsfn.init();

                    if ($('.notification-block-layout-2').length || $('.notification-block-layout-3').length) {
                        GRAPHICFORT.notificationsfn.perfectScrollbar();
                    }

                }, 1500);

            }

            // Easy Pie chart
            if ($('.pie-chart-block').length) {
                GRAPHICFORT.easyPieChartfn.init();
            }

            // Progress bar
            if ($('.progress').length) {
                GRAPHICFORT.progressBarfn.init();
            }

            // Parallax
            if ($('.parallax-section').length && !isMobile.any()) {
                GRAPHICFORT.parallaxfn.init();
            }

            // Youtube BG video
            if ($('.youtube-bg-video').length) {
                GRAPHICFORT.youtubeBGVideofn.init();
            }

            // Share
            if ($('.share-block').length) {
                GRAPHICFORT.sharefn.init();
            }

            // Tabs
            if ($('.tabs-block-select').length) {
                GRAPHICFORT.tabsfn.init();
            }

            // Twitter feed
            if ($('.twitter-feed-block').length) {
                GRAPHICFORT.twitterFeedfn.init();
            }

            // Price slider
            if ($('.price-slider-form').length) {
                GRAPHICFORT.priceSliderfn.init();
            }

            // Sticky sidebar
            if ($('#sticky-sidebar-wrapper').length && !isMobile.any()) {
                GRAPHICFORT.stickySidebarfn.init();
            }

            // Checkbox
            if ($('[data-select-all]').length) {
                GRAPHICFORT.checkBoxAllfn.init();
            }

            // Shop
            // Review button
            if ($('.product-rating a').length) {
                GRAPHICFORT.shopfn.reviewLink();
            }
            // Shop Payment
            if ($('#payment li input[type="radio"]').length) {
                GRAPHICFORT.shopfn.paymentMethod();
            }

            // Animation
            if ($('[data-animation]').length && !isMobile.any()) {
                GRAPHICFORT.animation.init();
            }

            // Text animation
            if ($('.text-animation').length) {

                $('.text-animation').each(function (index) {
                    $('>:first-child', this).after('<span></span>');
                    $(this).attr('id', 'text-animation-' + index);
                    $(this).after('<span class="text-animation-typed" id="text-animation-typed-' + index + '"></span>');
                });

                GRAPHICFORT.typedfn.init();

            }

        }
    };
    $(document).ready(GRAPHICFORT.documentOnReady.init);


    /* =========================================================================
    Load
    ========================================================================= */
    GRAPHICFORT.windowOnLoad = {
        // init
        init: function () {

            if ($('.isotope-grid').length) {
                $('.isotope-grid').each(function () {
                    $(this).isotope('layout');
                });
            }

        }
    };
    $(window).on('load', GRAPHICFORT.windowOnLoad.init);


    /* =========================================================================
    Resize
    ========================================================================= */
    GRAPHICFORT.windowOnResize = {
        // init
        init: function () {

            // Header
            // Submenu
            headerSubMenuTimer = setTimeout(function () {
                GRAPHICFORT.headerfn.subMenu();
            }, 400);
            // Transparent
            if ($('.header-section-transparent').length || $('.header-section-layout-2').length) {
                GRAPHICFORT.headerfn.transparent();
            }
            // Scrollspy
            if ($().scrollspy) {
                $('[data-bs-spy="scroll"]').each(function () {
                    $(this).scrollspy.refresh();
                });
            }

            // Youtube BG video
            if ($('.youtube-bg-video').length) {
                $('.youtube-bg-video').each(function () {
                    GRAPHICFORT.bgVideofn.init($(this));
                });
            }

        }
    };
    $(window).on('resize', GRAPHICFORT.windowOnResize.init);


    /* =========================================================================
    Scroll
    ========================================================================= */
    GRAPHICFORT.windowOnScroll = {
        // init
        init: function () {

            pageCurrentPosition = $(window).scrollTop();

            // Back to top button
            if ($('#back-to-top').length) {
                if (pageCurrentPosition >= 300) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            }

            // Header
            // Search form
            GRAPHICFORT.headerfn.closeSearchForm();
            // Fixed
            if ($('.header-section').hasClass('header-section-fixed') && !isMobile.any()) {

                GRAPHICFORT.headerfn.fixedHeader(pageCurrentPosition);

                if (pageCurrentPosition >= 72) {
                    $('.header-menu-section-container').addClass('scroll');
                } else {
                    $('.header-menu-section-container').removeClass('scroll');
                }

            }

            // Animation
            if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                if (!$('.not-animated').length) {
                    clearTimeout(animationTimer);
                }
            }

        }
    };
    $(window).on('scroll', GRAPHICFORT.windowOnScroll.init);


}(jQuery));