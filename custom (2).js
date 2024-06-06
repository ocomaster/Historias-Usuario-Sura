
(function ($) {

  
  /**
   * HU044
   * @returns {*|jQuery}
   */
  $.fn.buttonDropdownHover = function () {
    return this.each(function () {
      const componentEl = $(this);
      const tabsContainer = componentEl.children(".s-c-bdh-tabs-container");
      const tabsButtons = tabsContainer.children(".s-c-bdh-tabs-buttons");
      const tabsItems = tabsContainer.children(".s-c-bdh-tabs-items");

      tabsButtons.addClass(`s-c-bdh-${tabsButtons.children().length}-tabs`);
      tabsItems.addClass(`s-c-bdh-${tabsButtons.children().length}-tabs`);

      const activeButton = tabsButtons
        .find('[aria-selected="true"]')
        .attr("aria-controls");
      tabsItems.children().not(`#${activeButton}`).hide();

      /**
       * Seteo de colores para los indicadores
       */
      tabsItems
        .children()
        .find(".s-c-tab-indicator svg path")
        .each(function () {
          $(this).attr("fill", $(this).css("background-color"));
        });

      tabsButtons.children("button.s-o-btn").on("click", function () {
        const tabToOpen = $(this).attr("aria-controls");

        const currentActiveButton = tabsButtons.find('[aria-selected="true"]');

        // Previene el toggle del elemento activo
        if (tabToOpen == currentActiveButton.attr("aria-controls"))
          return false;

        const currentTab = currentActiveButton.attr("aria-controls");
        currentActiveButton.removeAttr("aria-selected");

        $(this).attr("aria-selected", true);
        tabsItems.find(".s-c-bdh-tab-active").removeClass("s-c-bdh-tab-active");

        const tabContent = tabsItems.children(`#${tabToOpen}`);
        tabContent.addClass("s-c-bdh-tab-active");
        tabContent.show();

        tabsItems.children(`#${currentTab}`).hide();
      });
    });
  };

  /**
   * Plugin de jQuery para el tabBanner
   * @param opts
   * @returns {jQuery|HTMLElement|*|void}
   */
  $.fn.suraTabBanner = function (opts) {
    return this.each(function () {
      /**
       * Inicializacion
       */
      const pluginOptions = $.extend({}, $.fn.suraTabBanner.defaults, opts);

      if (this.length === 0) return this;

      if (!pluginOptions.firstTab) {
        pluginOptions.firstTab = $(this)
          .find(".s-o-tabs__list > li:first-child > button")
          .attr("id");
      }

      if (typeof anime === "undefined") {
        return console.error("anime lib is required");
      }

      /**
       * Global Vars
       * @type {*|*[]|jQuery}
       */
      const tabList = $(this).find(".s-o-tabs__list");
      const tabContent = $(this).find(".s-o-tabs__contents").first();
      const tabContentChilds = tabContent.find(".s-o-tabs__container");
      const tabButtons = tabList.find(".s-o-tabs-banner__toggle");
      let resizerTimer;
      let activeTabCssTextClass = "";
      let nonActiveTabCssTextClass = "";
      const fullButtonsSize = {};
      let tabsContentSizes = {};

      tabButtons.each(function () {
        fullButtonsSize[$(this).attr("id")] = $(this).outerWidth();
      });

      /**
       * Registra un listener para el evento de resize, switchea entre desktop y mobile
       */
      const registerResizeListener = () => {
        $(window).resize(function () {
          if (resizerTimer) clearTimeout(resizerTimer);
          resizerTimer = setTimeout(function () {
            calculateTabContainerSize();
            fixMobileTabHeaders();
          }, 300);
        });
      };

      /**
       * Valida las clases CSS que se usaran para el tab activo y los tabs inactivos
       */
      const validateCssClasses = () => {
        if (tabButtons.get(0) != undefined && tabButtons.get(1) != undefined) {
        activeTabCssTextClass = tabButtons
          .get(0)
          .className.split(" ")
          .find((classEl) => classEl.startsWith("txt-color"));
        nonActiveTabCssTextClass = tabButtons
          .get(1)
          .className.split(" ")
          .find((classEl) => classEl.startsWith("txt-color"));
        }
      };

      /**
       * Reset del componente para inicializacion
       */
      const resetComponent = () => {
        tabContent.addClass("position-relative");
        calculateTabContainerSize();
        fixMobileTabHeaders();
        tabContentChilds.fadeOut(0);
      };

      /**
       * Calcula el alto maximo del contenido y ajusta el contenedor a ese alto para evitar saltos de contenido
       */
      const calculateTabContainerSize = () => {
        let tabMaxHeight= 0;
        tabContentChilds.removeClass("position-absolute").fadeIn(0);
        tabContent.removeAttr("style");
        tabsContentSizes = {};

        tabContentChilds.each(function () {
          tabsContentSizes[$(this).attr("id")] = $(this).outerHeight(true);
          if(tabMaxHeight<$(this).outerHeight(true)){
            tabMaxHeight = $(this).outerHeight(true)
          }
        });

        const isThereActiveCard = tabContentChilds.find(
          ".s-c-tab-banner-active"
        ).length;
        const activeTabSize = isThereActiveCard
          ? tabsContentSizes[
              tabContentChilds.find(".s-c-tab-banner-active").attr("id")
            ]
          : tabContentChilds.first().outerHeight(true);
          
        //tabContent.height(activeTabSize);
        tabContent.css({minHeight: tabMaxHeight + "px"})
        tabContentChilds.addClass("position-absolute");
        tabContentChilds.not(".s-c-tab-banner-active").fadeOut(0);
      };

      /**
       * Inicializa los headers en mobile
       */
      const fixMobileTabHeaders = () => {
        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          tabButtons
            .filter(":not(.s-t-tabs__toggle--active)")
            .css({
              width: 56,
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(0)",
            });
        } else {
          tabButtons
            .css({
              width: "auto",
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(1)",
            });
        }
      };

      /**
       * Va a un tab especifico
       * @param event
       * @param selector
       */
      const gotoTab = (event, selector = false) => {
        tabButtons.off("click", gotoTab);
        switchTabButtons(selector || event.currentTarget.id);
        fadeContainer(selector || event.currentTarget.id);
      };

      /**
       * Animaciones en botones de tabs (solo mobile)
       * @param tabId
       */
      const switchTabButtons = (tabId) => {
        const activeButton = tabList.find(".s-t-tabs__toggle--active");
        const nextButton = tabList.find(`#${tabId}`);

        if (activeButton.attr("id") === tabId) return;

        activeButton
          .removeClass("s-t-tabs__toggle--active")
          .removeClass(activeTabCssTextClass)
          .addClass(nonActiveTabCssTextClass);
        nextButton
          .addClass("s-t-tabs__toggle--active")
          .addClass(activeTabCssTextClass)
          .removeClass(nonActiveTabCssTextClass);

        const activeButtonSize = [
          parseInt(activeButton.css("padding-left")),
          parseInt(activeButton.css("padding-right")),
          activeButton.find(".s-o-icon-tab").width(),
        ].reduce((a, b) => a + b, 0);

        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          scrollToTab(nextButton);

          anime({
            targets: activeButton.find(".s-s-text-tab").toArray(),
            easing: "easeOutQuad",
            scaleX: {
              value: 0,
              duration: 200,
            },
            begin: function (anim) {
              anime({
                targets: activeButton.toArray(),
                easing: "linear",
                width: {
                  value: `${activeButtonSize}px`,
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.find(".s-s-text-tab").toArray(),
                easing: "easeInQuad",
                scaleX: {
                  value: "1",
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.toArray(),
                easing: "linear",
                width: {
                  value: fullButtonsSize[nextButton.attr("id")],
                  duration: 200,
                },
              });
            },
          });
        }
      };

      /**
       * Manage horizontal scroll on mobile devices
       * @param tabElement
       */
      const scrollToTab = (tabElement) => {
        const maxWidth = tabList.width();
        if (tabElement.offset().left < 0) {
          tabList.scrollLeft(0);
        } else if (
          tabElement.offset().left + tabElement.outerWidth() >
          maxWidth
        ) {
          tabList.scrollLeft(maxWidth - tabElement.offset().left + 40);
        }
      };

      /**
       * Animaciones de contenido en tabs
       * @param nextTab
       */
      const fadeContainer = (nextTab) => {
        const prevTab = tabContent.children(".s-c-tab-banner-active");
        if (prevTab.length) {
          prevTab
            .addClass("s-c-animating")
            .fadeOut(pluginOptions.fadeTime, function () {
              $(this)
                .removeClass("s-c-tab-banner-active s-c-animating")
                .css({ zIndex: 0 });
            });
        }

        tabContent
          .children(`#${nextTab}-content`)
          .addClass("s-c-animating")
          .fadeIn(pluginOptions.fadeTime, function () {
            $(this)
              .addClass("s-c-tab-banner-active")
              .removeClass("s-c-animating")
              .css({ zIndex: 1 });

            const activeTabSize = tabsContentSizes[$(this).attr("id")];
            tabContent.height(activeTabSize);

            tabButtons.on("click", gotoTab);
          });
      };

      /**
       * Corre los metodos de inicializacion
       */
      tabButtons.on("click", gotoTab);
      resetComponent();
      gotoTab(null, pluginOptions.firstTab);
      registerResizeListener();
      validateCssClasses();
    });
  };

  /**
   * Opciones pr defecto para el plugin
   * @type {{desktopBreakpoint: number, fadeTime: number, firstTab: boolean}}
   */
  $.fn.suraTabBanner.defaults = {
    firstTab: false,
    fadeTime: 400,
    desktopBreakpoint: 1024,
  };

  // HU 060 s-c-expandable-horizontal-cards
  $.fn.suraExpandableHorizontalCards = function (opts) {
    return this.each(function () {
      /**
       * Inicializacion
       */
      const pluginOptions = $.extend({}, $.fn.suraTabBanner.defaults, opts);

      if (this.length === 0) return this;

      if (!pluginOptions.firstTab) {
        pluginOptions.firstTab = $(this)
          .find(".s-o-tabs__list > li:first-child > button")
          .attr("id");
      }

      if (typeof anime === "undefined") {
        return console.error("anime lib is required");
      }

      /**
       * Global Vars
       * @type {*|*[]|jQuery}
       */
      const tabList = $(this).find(".s-o-tabs__list");
      const tabContent = $(this).find(".s-o-tabs__contents");
      const tabContentChilds = tabContent.find(".s-o-tabs__container");
      const tabButtons = tabList.find(".s-o-tabs-banner__toggle");
      let resizerTimer;
      let activeTabCssTextClass = "";
      let nonActiveTabCssTextClass = "";
      const fullButtonsSize = {};
      let tabsContentSizes = {};
      let windowWidth = window.outerWidth;

      if (tabButtons.length === 0) {
        return true;
      }

      tabButtons.each(function () {
        fullButtonsSize[$(this).attr("id")] = $(this).outerWidth();
      });

      $(this).find('.s-c-tab-component-container').addClass(`s-c-${tabButtons.length}-tabs`);

      /**
       * Registra un listener para el evento de resize, switchea entre desktop y mobile
       */
      const registerResizeListener = () => {
        $(window).resize(function () {
          if (resizerTimer) clearTimeout(resizerTimer);
          resizerTimer = setTimeout(function () {
            resetComponent();
          }, 300);
        });
      };

      /**
       * Reset del componente para inicializacion
       */
      const resetComponent = () => {
        const midTabIndex = (parseInt(tabButtons.length / 2 + (tabButtons.length % 2)) - 1);
        gotoTab(null, tabButtons.get((window.outerWidth <= 768 ? 0 : midTabIndex)).id);

        tabContent.addClass("position-relative");
        calculateTabContainerSize();
        fixMobileTabHeaders();
      };

      /**
       * Calcula el alto maximo del contenido y ajusta el contenedor a ese alto para evitar saltos de contenido
       */
      const calculateTabContainerSize = () => {
        if (window.outerWidth <= 768) {
          tabContentChilds.addClass('s-c-tab-banner-expanded');
          tabContentChilds.not(".s-c-tab-banner-expanded").fadeOut(0);
          tabContentChilds.first().addClass('s-c-tab-banner-expanded');
        }
      };

      /**
       * Inicializa los headers en mobile
       */
      const fixMobileTabHeaders = () => {
        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          tabButtons
            .filter(":not(.s-t-tabs__toggle--active)")
            .css({
              width: 56,
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(0)",
            });
        } else {
          tabButtons
            .css({
              width: "auto",
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(1)",
            });
        }
      };

      /**
       * Va a un tab especifico
       * @param event
       * @param selector
       */
      const gotoTab = (event, selector = false) => {
        tabButtons.off("click", gotoTab);
        switchTabButtons(selector || event.currentTarget.id);
        fadeContainer(selector || event.currentTarget.id);
      };

      /**
       * Animaciones en botones de tabs (solo mobile)
       * @param tabId
       */
      const switchTabButtons = (tabId) => {
        const activeButton = tabList.find(".s-t-tabs__toggle--active");
        const nextButton = tabList.find(`#${tabId}`);

        if (activeButton.attr("id") === tabId) return;

        activeButton
          .removeClass("s-t-tabs__toggle--active")
          .removeClass(activeTabCssTextClass)
          .addClass(nonActiveTabCssTextClass);
        nextButton
          .addClass("s-t-tabs__toggle--active")
          .addClass(activeTabCssTextClass)
          .removeClass(nonActiveTabCssTextClass);

        const activeButtonSize = [
          parseInt(activeButton.css("padding-left")),
          parseInt(activeButton.css("padding-right")),
          activeButton.find(".s-o-icon-tab").width(),
        ].reduce((a, b) => a + b, 0);

        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          scrollToTab(nextButton);

          anime({
            targets: activeButton.find(".s-s-text-tab").toArray(),
            easing: "easeOutQuad",
            scaleX: {
              value: 0,
              duration: 200,
            },
            begin: function (anim) {
              anime({
                targets: activeButton.toArray(),
                easing: "linear",
                width: {
                  value: `${activeButtonSize}px`,
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.find(".s-s-text-tab").toArray(),
                easing: "easeInQuad",
                scaleX: {
                  value: "1",
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.toArray(),
                easing: "linear",
                width: {
                  value: fullButtonsSize[nextButton.attr("id")],
                  duration: 200,
                },
              });
            },
          });
        }
      };

      /**
       * Manage horizontal scroll on mobile devices
       * @param tabElement
       */
      const scrollToTab = (tabElement) => {
        const maxWidth = tabList.width();
        if (tabElement.offset().left < 0) {
          tabList.scrollLeft(0);
        } else if (
          tabElement.offset().left + tabElement.outerWidth() >
          maxWidth
        ) {
          tabList.scrollLeft(maxWidth - tabElement.offset().left + 40);
        }
      };

      /**
       * Animaciones de contenido en tabs
       * @param nextTab
       */
      const fadeContainer = (nextTab) => {
        const prevTab = tabContent.children(".s-c-tab-banner-expanded");

        if (window.outerWidth <= 768) {
          return fadeMobileContainer(nextTab, prevTab);
        }

        if (prevTab.length) {
          prevTab.removeClass("s-c-tab-banner-expanded")
        }

        tabContent
          .children(`#${nextTab}-content`)
          .addClass("s-c-tab-banner-expanded")
        tabButtons.on("click", gotoTab);
      };


      const fadeMobileContainer = (nextTab, prevTab) => {
        if (prevTab.length) {
          prevTab
            .addClass("s-c-animating")
            .fadeOut(pluginOptions.fadeTime, function () {
              $(this)
                .removeClass("s-c-tab-banner-expanded s-c-animating")
                .css({ zIndex: 0 });
            });
        } else {
          tabContentChilds.addClass("s-c-animating")
            .fadeOut(pluginOptions.fadeTime, function () {
              $(this)
                .removeClass("s-c-animating")
                .css({ zIndex: 0 });
            });
        }

        tabContent
          .children(`#${nextTab}-content`)
          .addClass("s-c-animating")
          .fadeIn(pluginOptions.fadeTime, function () {
            $(this)
              .addClass("s-c-tab-banner-expanded")
              .removeClass("s-c-animating")
              .css({ zIndex: 1 });
            tabButtons.on("click", gotoTab);
          });
      }

      /**
       * Corre los metodos de inicializacion
       */
      tabButtons.on("click", gotoTab);
      setTimeout(() => {
        resetComponent();
        registerResizeListener();
      }, 500);
    });
  };
})(jQuery);

/**
 * Banner Card Slider Plugin
 */
(function ($) {
  $.fn.bannerCardSlider = function (options) {
    return this.each(function () {
      const opts = $.extend({}, $.fn.bannerCardSlider.defaults, options);

      /**
       * Global Vars
       */
      const textContainer = $(this).find(".s-c-card-text");
      const imagesContainer = $(this).find(".s-c-card-images");
      const imagesSliderContainer = imagesContainer.children(
        ".s-c-card-images-slider-container"
      );
      const textAnimationContainer = textContainer.children(
        ".s-c-text-container"
      );
      const textAnimationElements =
        textAnimationContainer.children(".s-c-card-info");
      let currentSlide = "";
      let resizerTimer;
      let cardsSizes = {};

      /**
       * Registra un listener para el evento de resize, switchea entre desktop y mobile
       */
      const registerResizeListener = () => {
        $(window).resize(function () {
          if (resizerTimer) clearTimeout(resizerTimer);
          resizerTimer = setTimeout(function () {
            manageSlidesVisualization();
            calculateTextContainerSize();
          }, 300);
        });
      };

      const calculateMobileImages = () => {
        const containerSize =
          imagesContainer.outerWidth() -
          (isMobile() ? getImageSeparation() * 2 : getImageSeparation());

        return {
          mid: (containerSize * 25.5) / 100,
          full: (containerSize * 49) / 100,
        };
      };

      /**
       * Calcula el alto maximo entre los contenedores
       */
      const calculateTextContainerSize = () => {
        textAnimationElements
          .removeClass("position-absolute")
          .css("height", "auto");
        const containerHeight = textAnimationElements.map(function (index, el) {
          cardsSizes[$(el).attr("data-relatedimg")] = $(el).outerHeight(true);
          return $(el).outerHeight(true);
        });
        textAnimationContainer.css(
          "min-height",
          isMobile()
            ? cardsSizes[currentSlide]
            : Math.max.apply(Math, containerHeight)
        );
        textAnimationElements
          .addClass("position-absolute")
          .css("height", "100%");
      };

      /**
       * Determina si esta en una resolucion movil
       * @returns {boolean}
       */
      const isMobile = () => {
        return window.outerWidth <= opts.desktopBreakpoint;
      };

      /**
       * Determina la separacion entre imagenes
       * @returns {*}
       */
      const getImageSeparation = () => {
        return opts.imageSeparation[isMobile() ? "mobile" : "desktop"];
      };

      /**
       * Determina el ancho de las imagenes
       * @param imageType
       * @returns {*}
       */
      const getImageWidth = (imageType) => {
        return isMobile()
          ? calculateMobileImages()[imageType]
          : opts.imageSize.desktop[imageType][0];
      };

      /**
       * Determina si hay al menos 3 elementos para la animacion
       * @returns {boolean}
       */
      const hasAtLeastThreeEls = () => {
        return imagesSliderContainer.children().length >= 3;
      };

      /**
       * Alterna entre imagenes para mobile o desktop
       */
      const manageMobileImages = () => {
        if (isMobile()) {
          imagesSliderContainer
            .find("img")
            .not(".s-c-card-mobile-img")
            .hide()
            .attr("aria-hidden", true);
          imagesSliderContainer
            .find(".s-c-card-mobile-img")
            .show()
            .removeAttr("aria-hidden");
          imagesSliderContainer
            .children()
            .not(".s-c-banner-slide-active-image")
            .find("img.s-c-card-img-expanded")
            .hide();
        } else {
          imagesSliderContainer
            .find(".s-c-card-mobile-img")
            .hide()
            .attr("aria-hidden", true);
          imagesSliderContainer
            .find("img")
            .not(".s-c-card-mobile-img")
            .show()
            .removeAttr("aria-hidden");
            imagesSliderContainer
            .children()
            .not(".s-c-banner-slide-active-image")
            .find("img.s-c-card-img-expanded")
            .hide();
        }
      };

      /**
       * Maneja la visualizacion del texto y botones
       */
      const manageSlidesVisualization = () => {
        manageMobileImages();
        const activeImage = imagesSliderContainer.children(
          ".s-c-banner-slide-active-image"
        );

        activeImage.find(".s-c-card-img").fadeOut(0);
        activeImage.css({
          width: getImageWidth("full"),
        });

        activeImage.next().css({
          width: getImageWidth("mid"),
          left: getImageWidth("full") + getImageSeparation(),
        });

        if (isMobile() && hasAtLeastThreeEls()) {
          activeImage
            .next()
            .next()
            .css({
              width: getImageWidth("mid"),
              left:
                getImageWidth("full") +
                getImageSeparation() * 2 +
                getImageWidth("mid"),
            });

          imagesSliderContainer
            .children()
            .not(activeImage)
            .not(activeImage.next())
            .not(activeImage.next().next())
            .css({
              width: getImageWidth("mid"),
              left:
                getImageWidth("full") +
                getImageSeparation() * 3 +
                getImageWidth("mid") * 2,
            });
        } else {
          imagesSliderContainer
            .children()
            .not(activeImage)
            .not(activeImage.next())
            .css({
              width: getImageWidth("mid"),
              left:
                getImageWidth("full") +
                getImageSeparation() * 2 +
                getImageWidth("mid"),
            });
        }
      };

      /**
       * Inicializa la primera visualizacion, cuando el plugin se llama
       */
      const initializeVisualization = () => {
        const firstSlide = textAnimationElements.first();
        currentSlide = firstSlide.attr("data-relatedimg");
        textAnimationElements.not(firstSlide).fadeOut(0);
        imagesSliderContainer
          .find(`#${currentSlide}`)
          .addClass("s-c-banner-slide-active-image");
        manageSlidesVisualization();
      };

      /**
       * Mueve las imagenes hacia atras
       * @param imageId
       * @returns {boolean}
       */
      const moveImagesBackward = (imageId) => {
        const currentImage = $(".s-c-banner-slide-active-image");

        let prevImage = currentImage.prev();
        let nextImage = currentImage.next();

        if (prevImage.length === 0) {
          prevImage = imagesSliderContainer.children().nextAll().last();
        }

        if (nextImage.length === 0) {
          nextImage = imagesSliderContainer.children().prevAll().last();
        }

        anime({
          targets: currentImage.toArray(),
          easing: "easeInQuad",
          width: {
            value: getImageWidth("mid"),
            duration: 200,
          },
          left: {
            value: () => {
              return getImageWidth("full") + getImageSeparation();
            },
            duration: 400,
          },
          begin: () => {
            currentImage.css({
              zIndex: 1,
            });
            manageImageVisualization(currentImage, false, true);
          },
        });

        if (hasAtLeastThreeEls()) {
          anime({
            targets: nextImage.toArray(),
            easing: "easeInQuad",
            left: {
              value:
                getImageWidth("full") +
                getImageSeparation() * 2 +
                getImageWidth("mid"),
              duration: 400,
            },
            begin: () => {
              nextImage.css({
                zIndex: 0,
              });
            },
            complete: () => {
              nextImage.css({
                width: getImageWidth("mid"),
                zIndex: 0,
              });
              manageImageVisualization(nextImage);
            },
          });
        }

        anime({
          targets: prevImage.toArray(),
          easing: "easeInQuad",
          width: {
            value: getImageWidth("full"),
            duration: 400,
          },
          left: {
            value: 0,
            duration: 400,
          },
          begin: () => {
            prevImage.css({
              zIndex: isMobile() ? 2 : 0,
            });
            manageImageVisualization(prevImage, true);
          },
          complete: () => {
            currentImage.removeClass("s-c-banner-slide-active-image");
            prevImage.addClass("s-c-banner-slide-active-image");
          },
        });

        if (isMobile() && hasAtLeastThreeEls()) {
          let thirdImage = nextImage.next();

          if (imagesSliderContainer.children().length >= 3) return false;

          if (thirdImage.length === 0) {
            thirdImage = imagesSliderContainer.children().prevAll().last();
          }

          anime({
            targets: thirdImage.toArray(),
            easing: "easeInQuad",
            width: {
              value: getImageWidth("mid"),
              duration: 400,
            },
            left: {
              value:
                getImageWidth("full") +
                getImageSeparation() * 3 +
                getImageWidth("mid") * 2,
              duration: 400,
            },
            begin: () => {
              currentImage.css({
                zIndex: 0,
              });
              manageImageVisualization(thirdImage);
            },
          });
        }
      };

      /**
       * Anima el intercambio entre cards
       * @param cardImageContainer
       * @param isActive
       * @param wasActive
       */
      const manageImageVisualization = (
        cardImageContainer,
        isActive = false,
        wasActive = false
      ) => {
        if (isActive) {
          if (isMobile()) {
            cardImageContainer.find("img:not(.s-c-card-mobile-img)").hide();
            cardImageContainer
              .find(".s-c-card-mobile-img.s-c-card-img")
              .fadeOut(wasActive ? 300 : 0);
            cardImageContainer
              .find(".s-c-card-mobile-img.s-c-card-img-expanded")
              .fadeIn(300);
          } else {
            cardImageContainer.find(".s-c-card-mobile-img").hide();
            cardImageContainer.find(".s-c-card-img").fadeOut(0);
            cardImageContainer.find(".s-c-card-img-expanded").fadeIn(300);
          }
        } else {
          if (isMobile()) {
            cardImageContainer.find("img:not(.s-c-card-mobile-img)").hide();
            cardImageContainer
              .find(".s-c-card-mobile-img.s-c-card-img")
              .fadeIn(wasActive ? 300 : 0);
            cardImageContainer
              .find(".s-c-card-mobile-img.s-c-card-img-expanded")
              .fadeOut(300);
          } else {
            cardImageContainer.find(".s-c-card-mobile-img").hide();
            cardImageContainer.find(".s-c-card-img").fadeIn(0);
            cardImageContainer.find(".s-c-card-img-expanded").fadeOut(300);
          }
        }
      };

      /**
       * Mueve las imagenes hacia adelante
       * @param imageId
       */
      const moveImagesForward = (imageId) => {
        const currentImage = imagesSliderContainer.children(`#${imageId}`);
        const activeImage = $(".s-c-banner-slide-active-image");
        let nextImage = currentImage.next();

        if (nextImage.length === 0) {
          nextImage = imagesSliderContainer.children().prevAll().last();
        }

        anime({
          targets: activeImage.toArray(),
          easing: "easeInQuad",
          left: {
            value: () => {
              if (isMobile() && imagesSliderContainer.children().length > 3) {
                return (
                  getImageWidth("full") +
                  getImageSeparation() * 3 +
                  getImageWidth("mid") * 2
                );
              }
              return (
                getImageWidth("full") +
                getImageSeparation() * (isMobile() ? 1 : 2) +
                (isMobile() ? 0 : getImageWidth("mid"))
              );
            },
            duration: 400,
          },
          begin: () => {
            activeImage.css({
              zIndex: isMobile() ? 0 : 2,
            });
          },
          complete: () => {
            activeImage
              .css({
                width: getImageWidth("mid"),
                zIndex: 0,
              })
              .removeClass("s-c-banner-slide-active-image");
            manageImageVisualization(activeImage);
          },
        });

        currentImage.addClass("s-c-banner-slide-active-image");

        anime({
          targets: currentImage.toArray(),
          easing: "easeInQuad",
          width: {
            value: getImageWidth("full"),
            duration: 400,
          },
          left: {
            value: 0,
            duration: 400,
          },
          begin: () => {
            currentImage.css({
              zIndex: 0,
            });

            manageImageVisualization(currentImage, true);
          },
        });

        anime({
          targets: nextImage.toArray(),
          easing: "easeInQuad",
          width: {
            value: getImageWidth("mid"),
            duration: 400,
          },
          left: {
            value: getImageWidth("full") + getImageSeparation(),
            duration: 200,
          },
          begin: () => {
            manageImageVisualization(nextImage);
          },
        });

        if (isMobile() && hasAtLeastThreeEls()) {
          let thirdImage = nextImage.next();
          if (thirdImage.length === 0) {
            thirdImage = imagesSliderContainer.children().prevAll().last();
          }

          anime({
            targets: thirdImage.toArray(),
            easing: "easeInQuad",
            width: {
              value: getImageWidth("mid"),
              duration: 400,
            },
            left: {
              value:
                getImageWidth("full") +
                getImageSeparation() * 2 +
                getImageWidth("mid"),
              duration: 400,
            },
            begin: () => {
              currentImage.css({
                zIndex: 0,
              });

              manageImageVisualization(thirdImage);
            },
          });
        }
      };

      /**
       * Anima la barra de progreso
       */
      const animateProgress = () => {
        if (isMobile()) {
          textAnimationContainer.css("min-height", cardsSizes[currentSlide]);
        }

        const currentSlideIndex =
          textAnimationContainer
            .children(`[data-relatedimg="${currentSlide}"]`)
            .index() + 1;
        const currentProgress = Math.round(
          (currentSlideIndex * 100) / textAnimationElements.length
        );
        $(`#s-c-progress-info-text`).text(
          `${currentSlideIndex}/${textAnimationElements.length}`
        );
        $(".s-c-progress-bar")
          .attr("aria-valuenow", currentProgress)
          .css({
            width: `${currentProgress}%`,
          });
      };

      /**
       * Handler cuando se presiona el boton hacia adelante
       */
      const onClickNext = () => {
        if (currentSlide.length) {
          let nextSlide = textAnimationContainer
            .children(`[data-relatedimg="${currentSlide}"]`)
            .next();

          if (nextSlide.length === 0) {
            nextSlide = textAnimationContainer
              .children(`[data-relatedimg="${currentSlide}"]`)
              .prevAll()
              .last();
          }

          $(this).find(`[data-relatedimg="${currentSlide}"]`).fadeOut(300);
          nextSlide.fadeIn(300);
          currentSlide = nextSlide.attr("data-relatedimg");

          manageAccessibilityFocus(nextSlide);
          animateProgress();
          moveImagesForward(currentSlide);
        }
      };

      /**
       * Handler cuando se presiona el boton hacia atras
       */
      const onClickPrev = () => {
        if (currentSlide.length) {
          let prevSlide = textAnimationContainer
            .find(`[data-relatedimg="${currentSlide}"]`)
            .prev();

          if (prevSlide.length === 0) {
            prevSlide = textAnimationContainer
              .children(`[data-relatedimg="${currentSlide}"]`)
              .nextAll()
              .last();
          }

          $(`[data-relatedimg="${currentSlide}"]`).fadeOut(200);
          prevSlide.fadeIn(200);

          manageAccessibilityFocus(prevSlide);
          moveImagesBackward(currentSlide);
          currentSlide = prevSlide.attr("data-relatedimg");
          animateProgress();
        }
      };

      /**
       * Maneja el foco para lectores de pantalla
       * @param slideJqEl
       */
      const manageAccessibilityFocus = (slideJqEl) => {
        textAnimationContainer
          .children()
          .not(slideJqEl)
          .attr("aria-hidden", true);
        slideJqEl.removeAttr("aria-hidden");
        slideJqEl.find(".s-c-card-title").get(0).focus();
      };

      /**
       * Registra los handlers de los botones anterior y siguiente
       */
      const initializeButtons = () => {
        $("#s-c-nav-next-btn").on("click", onClickNext);
        $("#s-c-nav-prev-btn").on("click", onClickPrev);

        imagesSliderContainer.children(".s-c-card-image").on("click", (e) => {
          const imageId = e.currentTarget.id;
          const currentImage = $(`figure#${currentSlide}`);
          const activeImageClicked = imageId === currentSlide;

          if (activeImageClicked) {
            onClickPrev();
          }

          if (isMobile() && !activeImageClicked) {
            const targetImage = imagesSliderContainer.children(`#${imageId}`);
            let nextImage = currentImage.next();

            if (nextImage.length === 0) {
              nextImage = imagesSliderContainer
                .children(`#${currentSlide}.s-c-card-image`)
                .prevAll()
                .last();
            }

            if (targetImage.is(nextImage)) {
              onClickNext();
            } else {
              onClickNext();
              onClickNext();
            }
          } else if (!activeImageClicked) {
            onClickNext();
          }
        });
      };

      //agregamos tabindex para que sea visible en safari
      $("#s-c-nav-prev-btn").attr("tabindex", "0");
      $("#s-c-nav-next-btn").attr("tabindex", "0");


      //agregamos funciones para habilitar y desbloquear controladores hu007=>

       //estilos por defecto
       $("#s-c-nav-prev-btn").attr("disabled", "disabled");
       $("#s-c-nav-prev-btn").addClass("disabled");
       $("#s-c-nav-prev-btn").css("pointer-events", "none");       
       $("#s-c-nav-next-btn").removeAttr("disabled");
       $("#s-c-nav-next-btn").removeClass("disabled");
       $("#s-c-nav-next-btn").css("pointer-events", "auto");

       $("#s-c-nav-prev-btn").addClass("s-o-controller__nav");
       $("#s-c-nav-next-btn").addClass("s-o-controller__nav");
      



      //estilos por defecto en la primera card
      var primeraFigure = $(".s-c-card-images-slider-container").find(".s-c-card-image:first");
      if (primeraFigure.hasClass("s-c-banner-slide-active-image")) {
        //console.log("hola")
        $("#s-c-nav-prev-btn").attr("disabled", "disabled");
        $("#s-c-nav-prev-btn").addClass("disabled");
        $("#s-c-nav-prev-btn").css("pointer-events", "none");       
        $("#s-c-nav-next-btn").removeAttr("disabled");
        $("#s-c-nav-next-btn").removeClass("disabled");
        $("#s-c-nav-next-btn").css("pointer-events", "auto");
      }
      
  


      var contenedorXBotonNext = $('#s-c-nav-prev-btn').closest('.s-c-pagination-buttons');
      var contenedorYBotonNext = $('#s-c-nav-next-btn').closest('.s-c-pagination-buttons');
      var cardSeleccionadaSliderContainer= $(".s-c-card-images-slider-container .s-c-card-image");

      contenedorXBotonNext.find('#s-c-nav-prev-btn').click(function(){
        let selectedIndex;
        $(".s-c-card-images-slider-container .s-c-card-image").each(function(index,element){
          if($(this).hasClass("s-c-banner-slide-active-image")){
            selectedIndex=index
          }
          if(selectedIndex-1 ===0){
            $("#s-c-nav-prev-btn").attr("disabled", "disabled");
            $("#s-c-nav-prev-btn").addClass("disabled");
            $("#s-c-nav-prev-btn").css("pointer-events", "none");
          }
          if($("#s-c-nav-next-btn").hasClass("disabled")){
            $("#s-c-nav-next-btn").removeAttr("disabled");
            $("#s-c-nav-next-btn").removeClass("disabled");
            $("#s-c-nav-next-btn").css("pointer-events", "auto");
          }
        })
      });

      contenedorYBotonNext.find('#s-c-nav-next-btn').click(function(){
        let selectedIndex;
        $(".s-c-card-images-slider-container .s-c-card-image").each(function(index,element){
          if($(this).hasClass("s-c-banner-slide-active-image")){
            selectedIndex=index
          }
          if(selectedIndex+1 ===$(".s-c-card-images-slider-container .s-c-card-image").length -1){
            $("#s-c-nav-next-btn").attr("disabled", "disabled");
            $("#s-c-nav-next-btn").addClass("disabled");
            $("#s-c-nav-next-btn").css("pointer-events", "none");
          }
          if($("#s-c-nav-prev-btn").hasClass("disabled")){
            $("#s-c-nav-prev-btn").removeAttr("disabled");
            $("#s-c-nav-prev-btn").removeClass("disabled");
            $("#s-c-nav-prev-btn").css("pointer-events", "auto");
          }
        })
      });

      cardSeleccionadaSliderContainer.click(function(){
        const selectedIndex= cardSeleccionadaSliderContainer.index(this);
        $(".s-c-card-images-slider-container .s-c-card-image").each(function(index,element){
         
          if(selectedIndex===0){
            $("#s-c-nav-next-btn").removeAttr("disabled");
            $("#s-c-nav-next-btn").removeClass("disabled");
            $("#s-c-nav-next-btn").css("pointer-events", "auto");
            $("#s-c-nav-prev-btn").attr("disabled", "disabled");
            $("#s-c-nav-prev-btn").addClass("disabled");
            $("#s-c-nav-prev-btn").css("pointer-events", "none");
          }
          else if (selectedIndex ===$(".s-c-card-images-slider-container .s-c-card-image").length - 1){
            $("#s-c-nav-prev-btn").removeAttr("disabled");
            $("#s-c-nav-prev-btn").removeClass("disabled");
            $("#s-c-nav-prev-btn").css("pointer-events", "auto");
            $("#s-c-nav-next-btn").attr("disabled", "disabled");
            $("#s-c-nav-next-btn").addClass("disabled");
            $("#s-c-nav-next-btn").css("pointer-events", "none");
            
          }else{
            $("#s-c-nav-next-btn").removeClass("disabled");
            $("#s-c-nav-next-btn").removeAttr('disabled');
            $("#s-c-nav-next-btn").css("pointer-events", "auto");
            $("#s-c-nav-prev-btn").removeClass("disabled");
            $("#s-c-nav-prev-btn").removeAttr('disabled');           
            $("#s-c-nav-prev-btn").css("pointer-events", "auto");

          }
        })
      });

      


      /**
       * Metodos de inicializacion
       */
      textAnimationElements.each(function () {
        const cardTitleText = $(this).find(".s-c-card-title").text();
        imagesSliderContainer
          .children(`#${$(this).attr("data-relatedimg")}`)
          .find(".s-c-card-image-caption")
          .text(cardTitleText);
      });

      calculateTextContainerSize();
      initializeVisualization();
      initializeButtons();
      animateProgress();
      registerResizeListener();
      manageAccessibilityFocus(textAnimationContainer.children().first());
    });
  };

  $.fn.bannerCardSlider.defaults = {
    imageSize: {
      mobile: {
        full: [182, 132],
        mid: [94, 132],
      },
      desktop: {
        full: [264, 407],
        mid: [168, 407],
      },
    },
    imageSeparation: {
      mobile: 12,
      desktop: 24,
    },
    desktopBreakpoint: 1024,
  };
})(jQuery);

(function ($) {
  $.fn.overlappedCards = function (options) {
    return this.each(function () {
      let resizerTimer;
      let elementPositions = {};
      const desktopBreakpoint = 1024;
      const overlappedCardsEl = $(this);
      const cardsContainer = $(this).find(".s-c-ov-cards-container");
      const overlappedCards = cardsContainer.children(".s-c-ov-card");
      const footerMobileButtons = $(this).find(
        ".s-c-ov-card-mobile-foot-buttons button"
      );
      const cardsCounter = overlappedCards.length;
      const overlappedCardContainer = $(this);
      const isFullSize = $(this).hasClass("s-c-ov-cards-full-size");
      let currentOpenedCard = false;

      /**
       * Registra un listener para el redimensionamiento de la ventana
       */
      const registerResizeListener = () => {
        $(window).resize(function () {
          if (resizerTimer) clearTimeout(resizerTimer);
          resizerTimer = setTimeout(function () {
            calculateElementSizes();

            if ((isRlt() || isMidRtl()) && currentOpenedCard) {
              openRtlCards(currentOpenedCard);
            } else if (currentOpenedCard) {
              openCards(currentOpenedCard);
            }
          }, 300);
        });
      };

      /**
       * Retorna si la resolucion es de moviles
       * @returns {boolean}
       */
      const isMobile = () => {
        return window.outerWidth <= desktopBreakpoint;
      };

      /**
       * Retorna si debe desplegar de izquierda a derecha o viceversa
       */
      const isRlt = () => {
        return $(this).hasClass("s-c-ov-rlt");
      };

      const isMidRtl = () => {
        return $(this).hasClass("s-c-ov-mid-rlt");
      };

      const isMid = () => {
        return $(this).hasClass("s-c-ov-mid");
      };

      /**
       * Calcula el tamanio de los cards
       */
      const calculateElementSizes = (functionDataIndex = false) => {
        if (isMobile()) {
          $('[data-toggle="tooltip"]').tooltip("disable");
        } else {
          $('[data-toggle="tooltip"]').tooltip("enable");
        }

        $(overlappedCardsEl).height("");
        let maxHeight = overlappedCardsEl.outerHeight(true);

        cardsContainer.children(".s-c-ov-card").each(function (index, element) {
          if (isMobile()) {
            if ($(this).hasClass('s-c-ov-card-opened') && parseInt($(this).attr('data-index')) <= functionDataIndex) {
              return true;
            }
          }


          const elWidth = $(element).outerWidth();
          const positionOffset = (cardsCounter - index) * 96;
          const dataIndex = isMobile() ? index + 1 : cardsCounter - index;
          let cssProps = {};

          if (isMobile()) {
            if (isFullSize && dataIndex !== 1) {
              cssProps.top = overlappedCardContainer.outerHeight();
            } else if (isMid() || isMidRtl()) {
              cssProps.top = overlappedCardContainer.outerHeight();
            } else {
              cssProps.top = 0;
            }
            if (!isFullSize) {
              anime({
                targets: $(this).toArray(),
                easing: "easeInQuad",
                ...cssProps,
                duration: 400
              });

              cssProps = {};
            }
          } else {
            cssProps.top = 0;
          }

          const imageWidth = $(overlappedCardsEl)
            .find(".s-c-ov-basic-image")
            .width();
          const totalAvailableWidth =
            overlappedCardsEl.outerWidth(true) - imageWidth;
          const calculatedCardWidth = Math.max(totalAvailableWidth, 850);

          if (isMidRtl()) {
            elementPositions[dataIndex] = -Math.abs(index * 96);
            cssProps["right"] = isMobile() ? 0 : -Math.abs(index * 96);
            cssProps["min-width"] = isMobile() ? "100%" : calculatedCardWidth;
            cssProps["max-width"] = isMobile() ? "100%" : calculatedCardWidth;
          } else if (isRlt()) {
            elementPositions[dataIndex] = 0;
            cssProps["right"] = 0;
            cssProps["min-width"] = isMobile()
              ? "100%"
              : isFullSize
              ? `calc(100% - ${index * 96}px)`
              : elWidth;
            cssProps["max-width"] = isMobile()
              ? "100%"
              : isFullSize
              ? `calc(100% - ${index * 96}px)`
              : elWidth;
          } else if (isMid()) {
            if (totalAvailableWidth <= 850) {
              elementPositions[dataIndex] = -Math.abs(
                calculatedCardWidth - positionOffset
              );
              cssProps["left"] = isMobile()
                ? 0
                : -Math.abs(calculatedCardWidth - positionOffset);
            } else {
              elementPositions[dataIndex] = -Math.abs(
                totalAvailableWidth - positionOffset
              );
              cssProps["left"] = isMobile()
                ? 0
                : -Math.abs(totalAvailableWidth - positionOffset);
            }
            cssProps["min-width"] = isMobile() ? "100%" : calculatedCardWidth;
            cssProps["max-width"] = isMobile() ? "100%" : calculatedCardWidth;
          } else {
            elementPositions[dataIndex] = -Math.abs(
              totalAvailableWidth - positionOffset
            );
            cssProps["left"] = isMobile()
              ? 0
              : -Math.abs(totalAvailableWidth - positionOffset);
            cssProps["min-width"] = isMobile() ? "100%" : totalAvailableWidth;
            cssProps["max-width"] = isMobile() ? "100%" : totalAvailableWidth;
          }

          $(element).css(cssProps).attr("data-index", dataIndex);

          const thisH = $(this).outerHeight(true);
          if (thisH > maxHeight) {
            maxHeight = thisH;
          }
        });

        $(overlappedCardsEl).height(isMobile() ? maxHeight + 55 : "");

        if (isMidRtl() && !isMobile()) {
          openRtlCards(cardsCounter);
        }
      };

      const toggleCard = (cardElement) => {
        const dataIndex = parseInt($(cardElement).parent().attr("data-index"));
        if ($(cardElement).parent().hasClass("s-c-ov-card-opened")) {
          closeCards(dataIndex);
        } else {
          if (isRlt() || isMidRtl()) {
            openRtlCards(dataIndex);
          } else {
            openCards(dataIndex);
          }
        }
      };

      /**
       * Listeners para los titulos de cards
       */
      overlappedCards.children(".s-c-ov-card-title").on("click", function () {
        toggleCard(this);
      });

      /**
       * Listeners para mobile
       */
      overlappedCards.find(".s-c-ov-card-content-title").on("click", function () {
        if (!isMobile() || !isFullSize) return false;
        const dataIndex = parseInt($(this).closest('.s-c-ov-card').attr("data-index"));

          calculateElementSizes();

          if (isRlt() || isMidRtl()) {
            openRtlCards(dataIndex);
          } else {
            openCards(dataIndex);
          }
        });

      overlappedCards.find(".s-c-ov-card-title").on("keypress", function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          toggleCard(this);
        }
      });

      const openRtlCards = (currentDataIndex) => {
        const offsetCard = isMobile() ? 55 : 96;
        let offsetPosition =
          offsetCard * (currentDataIndex - 1) - (isMobile() ? 0 : 24);
        if(isNaN(currentDataIndex)){
          currentOpenedCard = 0;
        }
        if (!isMobile() && isFullSize && currentDataIndex === cardsCounter) {
          currentDataIndex = currentDataIndex - 1;
        }

        for (let i = currentDataIndex; i >= 1; i--) {
          const cardToAnimate = overlappedCards.filter(`[data-index="${i}"]`);
          cardToAnimate.addClass("s-c-ov-card-opened");
          cardToAnimate
            .find('.s-c-ov-card-content [tabindex="0"]')
            .attr("tabindex", -1);

          let animatingProp = {
            duration: isMobile() && isFullSize ? 0 : 400,
          };

          if (isMobile()) {
            if (i !== currentDataIndex) {
              offsetPosition += offsetCard;
            }
            animatingProp["top"] = offsetCard * (i - 1);
          } else {
            animatingProp["right"] = -Math.abs(
              cardToAnimate.outerWidth() - offsetCard * i
            );
          }
          currentOpenedCard = currentDataIndex;

          anime({
            targets: cardToAnimate.toArray(),
            easing: "easeInQuad",
            ...animatingProp,
          });
        }
      };

      /**
       * Handler para abrir cards
       * @param currentDataIndex
       */
      const openCards = (currentDataIndex) => {
        if (isMobile()) {
          return openRtlCards(currentDataIndex);
        }

        const offsetCard = isMobile() ? 55 : 96;
        let offsetPosition =
          offsetCard * (currentDataIndex - 1) - (isMobile() ? 0 : 24);

        for (let i = currentDataIndex; i <= cardsCounter; i++) {
          if (i !== currentDataIndex) {
            offsetPosition += offsetCard;
          }

          const cardToAnimate = overlappedCards.filter(`[data-index="${i}"]`);
          let animatingProp = {
            duration: isMobile() && isFullSize ? 0 : 400,
          };
          cardToAnimate.addClass("s-c-ov-card-opened");
          cardToAnimate
            .find('.s-c-ov-card-content [tabindex="-1"]')
            .attr("tabindex", 0);

          if (isMobile()) {
            animatingProp["top"] = isFullSize
              ? offsetPosition
              : -Math.abs(
                  cardToAnimate.outerHeight(true) - 10 - (i - 1) * offsetCard
                );
          } else {
            if (isRlt()) {
              animatingProp["right"] = offsetPosition;
            } else {
              animatingProp["left"] = -Math.abs((cardsCounter - i) * 96);
            }
          }

          anime({
            targets: cardToAnimate.toArray(),
            easing: "easeInQuad",
            ...animatingProp,
          });
        }
      };

      /**
       * Handler para cerrar cards
       * @param currentDataIndex
       */
      const closeCards = (currentDataIndex) => {
        if (isRlt() || isMidRtl() || isMobile()) {
          for (let i = currentDataIndex; i <= cardsCounter; i++) {
            triggerCloseCard(i);
          }
        } else {
          for (let i = currentDataIndex; i >= 1; i--) {
            triggerCloseCard(i);
          }
        }
      };

      const triggerCloseCard = (dataIndex) => {
        let animatingProp = {
          duration: 400,
        };

        const cardToAnimate = overlappedCards.filter(
          `[data-index="${dataIndex}"]`
        );
        cardToAnimate.removeClass("s-c-ov-card-opened");
        cardToAnimate
          .find('.s-c-ov-card-content [tabindex="0"]')
          .attr("tabindex", -1);

        if (isMobile()) {
          animatingProp["top"] = isFullSize
            ? overlappedCardContainer.outerHeight()
            : 0;
        } else {
          if (isRlt() || isMidRtl()) {
            cardToAnimate
              .find('.s-c-ov-card-content [tabindex="-1"]')
              .attr("tabindex", 0);
            animatingProp["right"] = elementPositions[dataIndex];
          } else {
            animatingProp["left"] = elementPositions[dataIndex];
          }
        }

        anime({
          targets: cardToAnimate.toArray(),
          easing: "easeInQuad",
          ...animatingProp,
        });
      };

      /**
       * Listeners para los botones que se muestran en el footer de mobile
       */
      footerMobileButtons.on("click", function () {
        const dataToggle = $(this).attr("data-s-toggle");
        const dataIndex = parseInt(
          overlappedCards.filter(`#${dataToggle}`).attr("data-index")
        );

        calculateElementSizes(dataIndex);

        if (isRlt() || isMidRtl()) {
          openRtlCards(dataIndex);
        } else {
          openCards(dataIndex);
        }
      });

      /**
       * Inicializacion del plugin
       */
      $('[data-toggle="tooltip"]').tooltip({
        template:
          '<div class="tooltip s-o-tooltip s-o-tooltip--notify" role="tooltip"><div class="arrow s-o-tooltip__arrow"></div><div class="tooltip-inner s-o-tooltip__txt"></div></div>',
      });
      calculateElementSizes();
      registerResizeListener();

      overlappedCards
        .find('.s-c-ov-card-content [tabindex="0"]')
        .attr("tabindex", -1);

      const containerHeight = overlappedCards.map(function (index, el) {
        return isMobile()
          ? $(el).outerHeight(true) + 55 * index
          : $(el).outerHeight(true);
      });
      overlappedCards
        .addClass("s-position-absolute")
        .addClass(isRlt() || isMidRtl() ? "s-flex-row" : "s-flex-row-reverse");

      if (isFullSize) {
        cardsContainer.css("min-height", Math.max.apply(Math, containerHeight));
      }
    });
  };

  // HU 028
  $.fn.animatedTextBanner = function () {
    return this.each(function () {
      const textBannerElement = $(this);
      const desktopImg = textBannerElement.find(
        ".s-c-animated-text-banner-desktop-img img"
      );
      const firstMobileImg = textBannerElement.find(
        ".s-c-animated-text-banner-mobile-img img"
      );
      const secondMobileImg = textBannerElement.find(
        ".s-c-animated-text-banner-mobile-secondary-img img"
      );

      const baseUrls = {
        desktop: desktopImg.attr('src'),
        firstMobile: firstMobileImg.attr('src'),
        secondMobile: secondMobileImg.attr('src')
      };

      const intersectionObserverEl = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting === true) {
            desktopImg.attr("src", "").attr("src", `${baseUrls.desktop}?${Math.random()}`);
            firstMobileImg.attr("src", "").attr("src", `${baseUrls.firstMobile}?${Math.random()}`);
            secondMobileImg.attr("src", "").attr("src", `${baseUrls.secondMobile}?${Math.random()}`);
          }
        },
        { threshold: [0] }
      );

      intersectionObserverEl.observe(this);
    });
  };


  // HU 088
  $.fn.suraTabComponent = function (opts) {
    return this.each(function () {
      /**
       * Inicializacion
       */

      $.fn.suraTabBanner.defaults = {
        firstTab: false,
        fadeTime: 0,
        desktopBreakpoint: 1024,
      };

      const pluginOptions = $.extend({}, $.fn.suraTabBanner.defaults, opts);

      if (this.length === 0) return this;

      if (!pluginOptions.firstTab) {
        pluginOptions.firstTab = $(this)
          .find(".s-o-tabs__list > li:first-child > button")
          .attr("id");
      }

      if (typeof anime === "undefined") {
        return console.error("anime lib is required");
      }

      /**
       * Global Vars
       * @type {*|*[]|jQuery}
       */
      const tabList = $(this).find(".s-o-tabs__list").first();
      const tabContent = $(this).find(".s-o-tabs__contents").first();
      const tabContentChilds = tabContent.find(".s-o-tabs__container");
      const tabButtons = tabList.find(".s-o-tabs-banner__toggle");
      let resizerTimer;
      let activeTabCssTextClass = "";
      let nonActiveTabCssTextClass = "";
      const fullButtonsSize = {};
      let windowWidth = window.outerWidth;

      tabButtons.each(function () {
        fullButtonsSize[$(this).attr("id")] = $(this).outerWidth();
      });

      $(this).find('.s-c-tab-component-container').addClass(`s-c-${tabButtons.length}-tabs`);

      /**
       * Registra un listener para el evento de resize, switchea entre desktop y mobile
       */
      const registerResizeListener = () => {
        $(window).resize(function () {
          if (resizerTimer) clearTimeout(resizerTimer);
          resizerTimer = setTimeout(function () {
            if (window.outerWidth != windowWidth) {
              calculateTabContainerSize();
              fixMobileTabHeaders();
            }
          }, 300);
        });
      };

      /**
       * Valida las clases CSS que se usaran para el tab activo y los tabs inactivos
       */
      const validateCssClasses = () => {
        activeTabCssTextClass = tabButtons
          .get(0)
          .className.split(" ")
          .find((classEl) => classEl.startsWith("txt-color"));
        nonActiveTabCssTextClass = tabButtons
          .get(1)
          .className.split(" ")
          .find((classEl) => classEl.startsWith("txt-color"));
      };

      /**
       * Reset del componente para inicializacion
       */
      const resetComponent = () => {
        tabContent.addClass("position-relative");
        calculateTabContainerSize();
        fixMobileTabHeaders();
        tabContentChilds.fadeOut(0);
      };

      const calculateAccordeonLSizes = (tabContainerElement) => {
        let maxSize = 0;
        const accordeonLTabsLi = $(tabContainerElement).find('.s-c-acordeon-L__tab .s-o-tabs__li');
        if (accordeonLTabsLi.length) {
          const childSizes = accordeonLTabsLi.map(function(index, jqEl) {
            return $(jqEl).outerHeight(true);
          });
          maxSize = Math.max(...childSizes);
        }
        return maxSize;
      }

      /**
       * Calcula el alto maximo del contenido y ajusta el contenedor a ese alto para evitar saltos de contenido
       */
      const calculateTabContainerSize = () => {
        tabContentChilds.removeClass("position-absolute").fadeIn(0);
        tabContent.removeAttr("style");
        tabContentChilds.not(".s-c-tab-banner-active").fadeOut(0);
      };

      /**
       * Inicializa los headers en mobile
       */
      const fixMobileTabHeaders = () => {
        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          tabButtons
            .filter(":not(.s-t-tabs__toggle--active)")
            .css({
              width: 56,
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(0)",
            });
        } else {
          tabButtons
            .css({
              width: "auto",
            })
            .find(".s-s-text-tab")
            .css({
              transform: "scaleX(1)",
            });
        }
      };

      /**
       * Va a un tab especifico
       * @param event
       * @param selector
       */
      const gotoTab = (event, selector = false) => {
        tabButtons.off("click", gotoTab);
        switchTabButtons(selector || event.currentTarget.id);
        fadeContainer(selector || event.currentTarget.id);
      };

      /**
       * Animaciones en botones de tabs (solo mobile)
       * @param tabId
       */
      const switchTabButtons = (tabId) => {
        const activeButton = tabList.find(".s-t-tabs__toggle--active");
        const nextButton = tabList.find(`#${tabId}`);

        if (activeButton.attr("id") === tabId) return;

        activeButton
          .removeClass("s-t-tabs__toggle--active")
          .removeClass(activeTabCssTextClass)
          .addClass(nonActiveTabCssTextClass);
        nextButton
          .addClass("s-t-tabs__toggle--active")
          .addClass(activeTabCssTextClass)
          .removeClass(nonActiveTabCssTextClass);

        const activeButtonSize = [
          parseInt(activeButton.css("padding-left")),
          parseInt(activeButton.css("padding-right")),
          activeButton.find(".s-o-icon-tab").width(),
        ].reduce((a, b) => a + b, 0);

        if (window.outerWidth <= pluginOptions.desktopBreakpoint) {
          scrollToTab(nextButton);

          anime({
            targets: activeButton.find(".s-s-text-tab").toArray(),
            easing: "easeOutQuad",
            scaleX: {
              value: 0,
              duration: 200,
            },
            begin: function (anim) {
              anime({
                targets: activeButton.toArray(),
                easing: "linear",
                width: {
                  value: `${activeButtonSize}px`,
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.find(".s-s-text-tab").toArray(),
                easing: "easeInQuad",
                scaleX: {
                  value: "1",
                  duration: 200,
                },
              });

              anime({
                targets: nextButton.toArray(),
                easing: "linear",
                width: {
                  value: fullButtonsSize[nextButton.attr("id")],
                  duration: 200,
                },
              });
            },
          });
        }
      };

      /**
       * Manage horizontal scroll on mobile devices
       * @param tabElement
       */
      const scrollToTab = (tabElement) => {
        const maxWidth = tabList.width();
        if (tabElement.offset().left < 0) {
          tabList.scrollLeft(0);
        } else if (
          tabElement.offset().left + tabElement.outerWidth() >
          maxWidth
        ) {
          tabList.scrollLeft(maxWidth - tabElement.offset().left + 40);
        }
      };

      /**
       * Animaciones de contenido en tabs
       * @param nextTab
       */


      const fadeContainer = (nextTab) => {
        const prevTab = tabContent.children(".s-c-tab-banner-active");
        if (prevTab.length) {
          prevTab
            .addClass("s-c-animating")
            .fadeOut(pluginOptions.fadeTime, function () {
              $(this)
                .removeClass("s-c-tab-banner-active s-c-animating")
                .css({ zIndex: 0 });
            });
        }

        tabContent
          .children(`#${nextTab}-content`)
          .addClass("s-c-animating")
          .fadeIn(pluginOptions.fadeTime, function () {
            $(this)
              .addClass("s-c-tab-banner-active")
              .removeClass("s-c-animating")
              .css({ zIndex: 1 });

            tabButtons.on("click", gotoTab);
          });
      };

      /**
       * Corre los metodos de inicializacion
       */
      tabButtons.on("click", gotoTab);
      resetComponent();
      gotoTab(null, pluginOptions.firstTab);
      registerResizeListener();
      validateCssClasses();
    });
  };
})(jQuery);



$(document).ready(function () {
  var resolutionInitial = $(window).innerWidth();
  var resolutionActual = $(window).innerWidth();
  var containers = [1128, 1440];

  $(window).resize(function () {
    if (resolutionActual != resolutionInitial) {
      resolutionInitial = resolutionActual;
      resolutionActual = $(window).innerWidth();
    }
  });
  /*VALIDAR RESOLUCION*/
  function maxResolution(maxQuery) {
    if (window.matchMedia("(max-width: " + maxQuery + "px)").matches) {
      return true;
    } else {
      return false;
    }
  }
  /* Mover elementos del DOM */
  //elemento a mover y contenedor deben ser un Query " $() "
  function moveHTML(elementoAMover, contenedor) {
    contenedor.append(elementoAMover);
  }
  /* DROPDOWNS a varios niveles || TENER PRESENTE FORMATO DEL ID PARA FUNCIONAMIENTO OPTIMO*/
  $(".s-o-dropdown__toggle").not(".s-c-acordeon-L__tab .s-o-tabs__li .s-o-dropdown__toggle").click(function (e) {
    e.preventDefault();
    //validacion de pantalla
    if (
      ($(this).parents("section").hasClass("s-c-float-menu") &&
        resolutionActual < 1025) ||
      !$(this).parents("section").hasClass("s-c-float-menu")
    ) {
      let validateFunction = false;
      if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
        if (maxResolution(1025)) {
          validateFunction = true;
        }
      } else if ($(this).hasClass("s-js-dropdowns--not-mobil")) {
        if (!maxResolution(1025)) {
          validateFunction = true;
        }
      } else {
        validateFunction = true;
      }
      let idContent = "#" + $(this).attr("id") + "-drop-content";
      let allDrops = $(this).parents("ul").eq(0);
      //funcionamiento acordeones
      if (validateFunction) {
        if(!$(this).hasClass("s-c-header__sub-menu") && !$(this).hasClass("s-c-acordeon__toogle")){
          $(idContent).slideToggle(300);
        }
        $(this).attr("aria-expanded", function (index, attr) {
          return attr == "true" ? "false" : "true";
        });
        if ($(this).attr("aria-expanded") == "true") {
          if($(this).hasClass("s-c-header__sub-menu")){
            $(idContent).css({display:"block"})
          }
          if($(this).hasClass("s-c-acordeon__toogle")){
            $(idContent).css({display:"block"})
          }
          $(this).addClass("s-js-dropdown__toggle--active");
          $(this)
            .find(".s-o-dropdown__toggle__right .s-o-icon i")
            .addClass("s-iconDirectionUp")
            .removeClass("s-iconDirectionDown1");
        } else {
          if($(this).hasClass("s-c-header__sub-menu")){
            $(idContent).css({display:"none"})
          }
          if($(this).hasClass("s-c-acordeon__toogle")){
            $(idContent).css({display:"none"})
          } 
          $(this).removeClass("s-js-dropdown__toggle--active");
          $(this)
            .find(".s-o-dropdown__toggle__right .s-o-icon i")
            .addClass("s-iconDirectionDown1")
            .removeClass("s-iconDirectionUp");
        }
        //validacion solo un acordeon desplegado °° s-js-dropdowns
        if (allDrops.hasClass("s-js-dropdowns")) {
          allDrops
            .find(".s-o-dropdown__toggle")
            .not(this)
            .each(function () {
              if ($(this).attr("aria-expanded") == "true") {
                let idContent = "#" + $(this).attr("id") + "-drop-content";
                if(!$(this).hasClass("s-c-header__sub-menu")){
                  $(idContent).slideUp(300);
                }
                else{
                  $(idContent).css({display:"none"})
                }
                $(this).attr("aria-expanded", "false");
                $(this).removeClass("s-js-dropdown__toggle--active");
                $(this)
                  .find(".s-o-dropdown__toggle__right .s-o-icon i")
                  .addClass("s-iconDirectionDown1")
                  .removeClass("s-iconDirectionUp");
              }
            });
        }
      }
    } else {
      $(this).attr("aria-expanded", function (index, attr) {
        return attr == "true" ? "false" : "true";
      });
      let idContent = "#" + $(this).attr("id") + "-drop-content";
      $(idContent).removeAttr("style");
      $(this)
        .parents(".s-o-dropdown")
        .find(".s-o-dropdown__item__text")
        .animate({ opacity: "toggle" }, { width: "toggle" }, 350);
      var $this = $(this);
      if ($(this).attr("aria-expanded") == "true") {
        $(this)
          .find(".s-o-dropdown__toggle__right .s-o-icon")
          .css({ transform: "rotate(90deg)" });
        $(this).removeAttr("style");
      } else {
        $(this)
          .find(".s-o-dropdown__toggle__right .s-o-icon")
          .css({ transform: "rotate(-90deg)" });
        setTimeout(() => {
          $this.css("justify-content", "center");
        }, 350);
      }
    }
    if ($(this).parents("section").hasClass("s-c-float-menu")) {
      if ($(this).attr("aria-expanded") == "true") {
        $(this).parents(".s-o-dropdown").addClass("s-js-float-menu--active");
      } else {
        $(this).parents(".s-o-dropdown").removeClass("s-js-float-menu--active");
      }
    }
  });
  $(".s-o-dropdown__toggle_hover").click(function (e) {
    e.preventDefault();
    //validacion de pantalla
    if(resolutionActual < 1025) { 
      if (
        ($(this).parents("section").hasClass("s-c-float-menu") &&
          resolutionActual < 1025) ||
        !$(this).parents("section").hasClass("s-c-float-menu")
      ) {
        let validateFunction = false;
        if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
          if (maxResolution(1025)) {
            validateFunction = true;
          }
        } else if ($(this).hasClass("s-js-dropdowns--not-mobil")) {
          if (!maxResolution(1025)) {
            validateFunction = true;
          }
        } else {
          validateFunction = true;
        }
        let idContent = "#" + $(this).attr("id") + "-drop-content";
        let allDrops = $(this).parents("ul").eq(0);
        //funcionamiento acordeones
        if (validateFunction) {
          $(idContent).slideToggle(300);
          $(this).attr("aria-expanded", function (index, attr) {
            return attr == "true" ? "false" : "true";
          });
          if ($(this).attr("aria-expanded") == "true") {
            $(this).addClass("s-js-dropdown__toggle--active");
            $(this)
              .find(".s-o-dropdown__toggle__right .s-o-icon i")
              .addClass("s-iconDirectionUp")
              .removeClass("s-iconDirectionDown1");
          } else {
            $(this).removeClass("s-js-dropdown__toggle--active");
            $(this)
              .find(".s-o-dropdown__toggle__right .s-o-icon i")
              .addClass("s-iconDirectionDown1")
              .removeClass("s-iconDirectionUp");
          }
          //validacion solo un acordeon desplegado °° s-js-dropdowns
          if (allDrops.hasClass("s-js-dropdowns")) {
            allDrops
              .find(".s-o-dropdown__toggle")
              .not(this)
              .each(function () {
                if ($(this).attr("aria-expanded") == "true") {
                  let idContent = "#" + $(this).attr("id") + "-drop-content";
                  $(idContent).slideUp(300);
                  $(this).attr("aria-expanded", "false");
                  $(this).removeClass("s-js-dropdown__toggle--active");
                  $(this)
                    .find(".s-o-dropdown__toggle__right .s-o-icon i")
                    .addClass("s-iconDirectionDown1")
                    .removeClass("s-iconDirectionUp");
                }
              });
          }
        }
      } else {
        $(this).attr("aria-expanded", function (index, attr) {
          return attr == "true" ? "false" : "true";
        });
        let idContent = "#" + $(this).attr("id") + "-drop-content";
        $(idContent).removeAttr("style");
        $(this)
          .parents(".s-o-dropdown")
          .find(".s-o-dropdown__item__text")
          .animate({ opacity: "toggle" }, { width: "toggle" }, 350);
        var $this = $(this);
        if ($(this).attr("aria-expanded") == "true") {
          $(this)
            .find(".s-o-dropdown__toggle__right .s-o-icon")
            .css({ transform: "rotate(90deg)" });
          $(this).removeAttr("style");
        } else {
          $(this)
            .find(".s-o-dropdown__toggle__right .s-o-icon")
            .css({ transform: "rotate(-90deg)" });
          setTimeout(() => {
            $this.css("justify-content", "center");
          }, 350);
        }
      }
      if ($(this).parents("section").hasClass("s-c-float-menu")) {
        if ($(this).attr("aria-expanded") == "true") {
          $(this).parents(".s-o-dropdown").addClass("s-js-float-menu--active");
        } else {
          $(this).parents(".s-o-dropdown").removeClass("s-js-float-menu--active");
        }
      }
    }
  });
  // $(".s-o-dropdown__toggle_hover").hover(function (e) {
  //   e.preventDefault();
  //   //validacion de pantalla
  //   if(resolutionActual > 1025) { 
  //     if (
  //       ($(this).parents("section").hasClass("s-c-float-menu") &&
  //         resolutionActual < 1025) ||
  //       !$(this).parents("section").hasClass("s-c-float-menu")
  //     ) {
  //       let validateFunction = false;
  //       if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
  //         if (maxResolution(1025)) {
  //           validateFunction = true;
  //         }
  //       } else if ($(this).hasClass("s-js-dropdowns--not-mobil")) {
  //         if (!maxResolution(1025)) {
  //           validateFunction = true;
  //         }
  //       } else {
  //         validateFunction = true;
  //       }
  //       let idContent = "#" + $(this).attr("id") + "-drop-content";
  //       let allDrops = $(this).parents("ul").eq(0);
  //       //funcionamiento acordeones
  //       if (validateFunction) {
  //         $(idContent).slideToggle(300);
  //         $(this).attr("aria-expanded", function (index, attr) {
  //           return attr == "true" ? "false" : "true";
  //         });
  //         if ($(this).attr("aria-expanded") == "true") {
  //           $(this).addClass("s-js-dropdown__toggle--active");
  //           $(this)
  //             .find(".s-o-dropdown__toggle__right .s-o-icon i")
  //             .addClass("s-iconDirectionUp")
  //             .removeClass("s-iconDirectionDown1");
  //         } else {
  //           $(this).removeClass("s-js-dropdown__toggle--active");
  //           $(this)
  //             .find(".s-o-dropdown__toggle__right .s-o-icon i")
  //             .addClass("s-iconDirectionDown1")
  //             .removeClass("s-iconDirectionUp");
  //         }
  //         //validacion solo un acordeon desplegado °° s-js-dropdowns
  //         if (allDrops.hasClass("s-js-dropdowns")) {
  //           allDrops
  //             .find(".s-o-dropdown__toggle")
  //             .not(this)
  //             .each(function () {
  //               if ($(this).attr("aria-expanded") == "true") {
  //                 let idContent = "#" + $(this).attr("id") + "-drop-content";
  //                 $(idContent).slideUp(300);
  //                 $(this).attr("aria-expanded", "false");
  //                 $(this).removeClass("s-js-dropdown__toggle--active");
  //                 $(this)
  //                   .find(".s-o-dropdown__toggle__right .s-o-icon i")
  //                   .addClass("s-iconDirectionDown1")
  //                   .removeClass("s-iconDirectionUp");
  //               }
  //             });
  //         }
  //       }
  //     } else {
  //       $(this).attr("aria-expanded", function (index, attr) {
  //         return attr == "true" ? "false" : "true";
  //       });
  //       let idContent = "#" + $(this).attr("id") + "-drop-content";
  //       /* $(idContent).removeAttr("style"); */
  //       $(this)
  //         .parents(".s-o-dropdown")
  //         .find(".s-o-dropdown__item__text")
  //         .animate({ opacity: "toggle" }, { width: "toggle" }, 350);
  //       var $this = $(this);
  //       if ($(this).attr("aria-expanded") == "true") {
  //         $(this)
  //           .find(".s-o-dropdown__toggle__right .s-o-icon")
  //           .css({ transform: "rotate(90deg)" });
  //         /* $(this).removeAttr("style"); */
  //       } else {
  //         $(this)
  //           .find(".s-o-dropdown__toggle__right .s-o-icon")
  //           .css({ transform: "rotate(-90deg)" });
  //         setTimeout(() => {
  //           $this.css("justify-content", "center");
  //         }, 350);
  //       }
  //     }
  //     if ($(this).parents("section").hasClass("s-c-float-menu")) {
  //       if ($(this).attr("aria-expanded") == "true") {
  //         $(this).parents(".s-o-dropdown").addClass("s-js-float-menu--active");
  //       } else {
  //         $(this).parents(".s-o-dropdown").removeClass("s-js-float-menu--active");
  //       }
  //     }
  //   }
  // });
  //CERRAR DROPDOWN
  function closeDrop(drop) {
    drop.attr("aria-expanded", "false");
    drop.removeClass("s-js-dropdown__toggle--active");
    drop
      .find(".s-o-dropdown__toggle__right .s-o-icon i")
      .addClass("s-iconDirectionDown1")
      .removeClass("s-iconDirectionUp");
    let idContent = "#" + drop.attr("id") + "-drop-content";
    $(idContent).css("display", "none");
  }
  /* TABS */
  $(".s-o-tabs__toggle").not(".s-c-acordeon-L__tab .s-o-tabs__li .s-o-tabs__toggle").click(function (e) {
    $(this).parents(".s-o-tabs__li").toggleClass("active");
    $(".s-o-tabs__li").not($(this).parents(".s-o-tabs__li")).removeClass("active");
    e.preventDefault();
    let idContent = "#" + $(this).attr("id") + "-content";
    if (!$(this).hasClass("s-t-tabs__toggle--active")) {
      $(this)
        .parents(".s-o-tabs__list")
        .find(".s-o-tabs__toggle")
        .each(function () {
          $(this).removeClass("s-t-tabs__toggle--active");
          $(this).attr("aria-selected", "false");
        });
      $(this).addClass("s-t-tabs__toggle--active");
      $(this).attr("aria-selected", "true");
      let idContainer =
        "#" + $(this).parents(".s-o-tabs__list").attr("id") + "-content";
      $(idContainer)
        .find(".s-o-tabs__container")
        .each(function () {
          if ($(this).hasClass("s-js-view")) {
            $(this).addClass("s-js-hidden");
            $(this).removeClass("s-js-view");
          }
        });
      $(idContent).addClass("s-js-view").removeClass("s-js-hidden");
    }
  });
  /* $(".s-o-dropdown__toggle_hover").hover(function (e) {
    if(resolutionActual > 1025) {
      $(this).parents(".s-o-tabs__li").toggleClass("active");
      $(".s-o-tabs__li").not($(this).parents(".s-o-tabs__li")).removeClass("active");
      e.preventDefault();
      let idContent = "#" + $(this).attr("id") + "-content";
      if (!$(this).hasClass("s-t-tabs__toggle--active")) {
        $(this)
          .parents(".s-o-tabs__list")
          .find(".s-o-tabs__toggle")
          .each(function () {
            $(this).removeClass("s-t-tabs__toggle--active");
            $(this).attr("aria-selected", "false");
          });
        $(this).addClass("s-t-tabs__toggle--active");
        $(this).attr("aria-selected", "true");
        let idContainer =
          "#" + $(this).parents(".s-o-tabs__list").attr("id") + "-content";
        $(idContainer)
          .find(".s-o-tabs__container")
          .each(function () {
            if ($(this).hasClass("s-js-view")) {
              $(this).addClass("s-js-hidden");
              $(this).removeClass("s-js-view");
            }
          });
        $(idContent).addClass("s-js-view").removeClass("s-js-hidden");
      }
    }
  }); */
  
  /* HEADER */
  // Menu Amburguesa
  $("#navbar-toggler, #menu-login").click(function () {
    let container = "#" + $(this).attr("aria-controls");
    $(container).slideToggle(300);
    $(this).attr("aria-expanded", function (index, attr) {
      return attr == "true" ? "false" : "true";
    });
    var descriptor = $(this)
      .parents(".s-c-header")
      .find(".s-c-header__descriptor");
    if ($(this).attr("aria-expanded") == "true") {
      if ($(descriptor).length > 0) {
        setTimeout(function () {
          $(descriptor).addClass("d-none");
        }, 50);
      }
    } else {
      setTimeout(function () {
        $(descriptor).removeClass("d-none");
      }, 250);
    }
    if ($(this).hasClass("navbar-toggler")) {
      if ($(this).attr("aria-expanded") == "true") {
        if (
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".s-o-header__login")
            .attr("aria-expanded") == "true"
        ) {
          $(this).attr("aria-controls", "navbarNavAltMarkup");
          $(this).attr("aria-expanded", "false");
        } else {
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".s-o-header__login")
            .addClass("d-none");
        }
      } else {
        $(this)
          .parents(".s-c-header__nav-toggler-container")
          .find(".s-o-header__login")
          .removeClass("d-none");
        $(this)
          .parents(".s-c-header__nav-toggler-container")
          .find(".s-o-header__login")
          .attr("aria-expanded", "false");
        $(this).attr("aria-controls", "navbarNavAltMarkup");
      }
    } else {
      if ($(this).attr("aria-expanded") == "true") {
        if (
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".navbar-toggler")
            .attr("aria-expanded") == "true"
        ) {
        } else {
          $(this).addClass("d-none");
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".navbar-toggler")
            .attr("aria-controls", "menu-login-content");
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".navbar-toggler")
            .attr("aria-expanded", "true");
          $(this)
            .parents(".s-c-header__nav-toggler-container")
            .find(".navbar-toggler .ham")
            .addClass("active");
        }
      } else {
        $(this).removeClass("d-none");
      }
    }
  });
  //Acomodar datos menu
  function dataHeader() {
    if($('#descriptor-id').length > 0 ) {
        var descriptorText = $('#descriptor-id').text();
        $('.s-c-header__descriptor-text').each(function(){
            $(this).text(descriptorText);
        })
        if (screen.width > 1024) {
            let sizeLogo = $('.navbar-brand').width();
            let sizeDescriptor = $('#descriptor-id').width();
            let leftDescriptor =  (sizeLogo/2) - (sizeDescriptor/2);
            $('#descriptor-id').css('position','relative');
            $('#descriptor-id').css('left',leftDescriptor);
            $('.s-js-header__descriptor').css('position','relative');
            $('.s-js-header__descriptor').css('left',leftDescriptor);
        }
    } else {
        $('.s-c-header__descriptor-menu, .s-c-header__descriptor').remove();
    }
    if($('#search-id').length > 0) {
        $('#search-menu').removeClass("d-none");
        $('#search-menu a').attr("href",$("#search-id").attr('href'));
        $('#search-menu a').attr("target",$("#search-id").attr('target'));
    }
    if($('#simple-btn-header').length > 0) {
        $('#button-header-menu').removeClass("d-none");
        $('#button-header-menu a').attr("href",$("#simple-btn-header").attr('href'));
        $('#button-header-menu a').attr("target",$("#simple-btn-header").attr('target'));
        $('#button-header-menu a .s-o-dropdown__item__text.txt-color-primary-color-1').text($('#simple-btn-header span').text())
    }
  }

  //Size menu
    function initMenuDesktop() {
        $("header .navbar-nav .s-o-dropdown .s-o-dropdown__toggle.s-c-header__menu").each(function () {
            let minSizeMenu = 357;
            if($(this).parents('header').hasClass('s-t-header')){
                minSizeMenu = 0;
            } else {
                minSizeMenu = 357;
            }
            var menuNewSize = 0;
            let menuLevel1 = "#" + $(this).attr("id") + "-drop-content";
            addMarginPosition(
                $(menuLevel1).find(".s-o-dropdown__content-container").eq(0),
                "l",
                resolutionActual
            );
            $(menuLevel1).addClass("d-block");
            let heightMenuLevel1 = $(menuLevel1).innerHeight();
            let heightMenuLevel2 = $(menuLevel1)
                .find(".s-js-dropdowns")
                .innerHeight();
            var heightMenuLevel3 = 0;
            $(menuLevel1)
                .find(".s-c-header__sub-menu")
                .each(function () {
                    let menuLevel3 = "#" + $(this).attr("id") + "-drop-content";
                    $(menuLevel3).addClass("d-block");
                    if($(this).parents('header').hasClass('s-t-header')){
                        if (heightMenuLevel3 < $(menuLevel3+" ul").innerHeight()) {
                            heightMenuLevel3 = $(menuLevel3+" ul").innerHeight() + 48;
                        }
                    } else {
                        if (heightMenuLevel3 < $(menuLevel3).innerHeight()) {
                            heightMenuLevel3 = $(menuLevel3).innerHeight();
                        }
                    }
                    $(menuLevel3).removeClass("d-block");
                    $(menuLevel3).css("height", heightMenuLevel3 + "px");
                });
            $(menuLevel1).removeClass("d-block");
            if (
                heightMenuLevel1 > heightMenuLevel2 &&
                heightMenuLevel1 > heightMenuLevel3
            ) {
                menuNewSize = heightMenuLevel1;
            } else if (
                heightMenuLevel2 > heightMenuLevel1 &&
                heightMenuLevel2 > heightMenuLevel3
            ) {
                menuNewSize = heightMenuLevel2;
            } else {
                if(heightMenuLevel2 > heightMenuLevel3) {
                    menuNewSize = heightMenuLevel2;
                } else {
                    menuNewSize = heightMenuLevel3;
                }
            }
            if (menuNewSize < minSizeMenu) {
                menuNewSize = minSizeMenu;
            }
            if ($(this).parents("header").find(".s-c-header__descriptor").length > 0) {
                $(menuLevel1).css("height", menuNewSize+47 + "px");
            } else {
                $(menuLevel1).css("height", menuNewSize + "px");
            }
            $(menuLevel1)
                .find(".s-c-header__sub-menu")
                .each(function () {
                    let menuLevel3 = "#" + $(this).attr("id") + "-drop-content";
                    $(menuLevel3).css("height", menuNewSize + "px");
                    if($(this).parents('header').hasClass('s-t-header')) {
                        $(menuLevel3+" ul").css("height", menuNewSize-47 + "px");
                    }
                });


            //Scroll
            let sizeHeader = $(this).parents('header').height() + menuNewSize;
            let viewHeight = $(window).outerHeight();
            if(sizeHeader > viewHeight) {
                let maxSizeMenu = viewHeight - $(this).parents('header').height();
                $(menuLevel1).css("max-height", maxSizeMenu + "px");
                $(menuLevel1).css("overflow", "auto");
            }
            return 0;
        });
    }

  function resetMenu() {
    $("header .collapse.navbar-collapse").removeAttr("style");
    $("header .navbar-toggler").attr("aria-expanded", "false");
    $("header .navbar-toggler .ham").removeClass("active");
    $("header .s-c-header__collapse-container").removeAttr("style");
    $(
      "header .navbar-nav .s-o-dropdown__toggle.s-js-dropdown__toggle--active"
    ).each(function () {
      closeDrop($(this));
    });
    if (!maxResolution(1024)) {
      if ($(".navbar-toggler").attr("aria-expanded") == "true") {
        $(".navbar-collapse").css("display", "");
      }
    } else {
      if ($(".navbar-toggler").attr("aria-expanded") == "true") {
        $(".navbar-collapse").css("display", "block");
      }
    }
    $(
      "header .navbar-nav .s-o-dropdown .s-o-dropdown__toggle.s-c-header__menu"
    ).each(function () {
      let menuLevel1 = "#" + $(this).attr("id") + "-drop-content";
      $(menuLevel1).css("height", "");
      $(menuLevel1)
        .find(".s-o-dropdown__content-container")
        .eq(0)
        .css("margin-left", "0");
      $(menuLevel1)
        .find(".s-c-header__sub-menu")
        .each(function () {
          let menuLevel3 = "#" + $(this).attr("id") + "-drop-content";
          $(menuLevel3).css("height", "");
        });
    });
  }
  function scrollMenu() {
    viewHeight = $(window).outerHeight();
    sizeEnabled = viewHeight - $("header").outerHeight();
    $("header .s-c-header__collapse-container").removeAttr("style");
    $("header .s-c-header__collapse-container").css(
      "max-height",
      sizeEnabled + "px"
    );
    $("header .s-c-header__collapse-container").css("overflow", "auto");
  }
  dataHeader();
  if (!maxResolution(1024)) {
    initMenuDesktop();
  } else {
    scrollMenu();
  }
  $(window).resize(function () {
    resetMenu();
    if (!maxResolution(1024)) {
      initMenuDesktop();
    } else {
      scrollMenu();
    }
  });

  //MENU DESPLEGABLE
  if (resolutionActual > 1024) {
    $(".s-c-float-menu .s-o-dropdown__toggle").attr("aria-expanded", "true");
    $(".s-c-float-menu .s-o-dropdown__toggle").trigger("click");
    $(".s-c-float-menu .s-o-dropdown").css(
      "left",
      callMarginSide(resolutionActual)
    );
  } else {
    let sizeMenu = $("header").innerHeight() + 1 + "px";
    $(".s-c-float-menu")
      .parents(
        ".lfr-layout-structure-item-com-liferay-journal-content-web-portlet-journalcontentportlet"
      )
      .addClass("it-is-sticky-menu");
    $(".s-c-float-menu")
      .parents(
        ".lfr-layout-structure-item-com-liferay-journal-content-web-portlet-journalcontentportlet"
      )
      .css("top", sizeMenu);
  }
  $(window).resize(function () {
    $(".s-c-float-menu").each(function () {
      if (resolutionActual < 1025) {
        $(this).find(".s-o-dropdown").removeAttr("style");
        $(this).find(".s-o-dropdown__item__text").removeAttr("style");
        $(this).find(".s-o-dropdown__toggle").removeAttr("style");
        $(this).find(".s-o-dropdown__toggle .s-o-icon").removeAttr("style");
        if (
          $(this).find(".s-o-dropdown__toggle").attr("aria-expanded") == "true"
        ) {
          $(this)
            .find(".s-o-dropdown__toggle")
            .addClass(".s-js-dropdown__toggle--active");
          $(this).find(".s-o-dropdown__content").slideToggle(300);
        }
      } else {
        $(this)
          .find(".s-o-dropdown")
          .css("left", callMarginSide(resolutionActual));
        //$(this).find(".s-o-dropdown__content").removeAttr("style");
        if (
          $(this).find(".s-o-dropdown__toggle").attr("aria-expanded") == "true"
        ) {
          //$(this).find('.s-o-dropdown__item__text').css('display','none');
        }
      }
    });
  });

  $("#carouselCard").owlCarousel({
    loop: true,
    margin: 8,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  });

  //Calcula margen fuera del layout de SURA
  function callMarginSide(resolutionA) {
    let contenedor = 0;
    if (resolutionA > 1128 && resolutionA < 1900) {
      contenedor = 1128;
    } else if (resolutionActual >= 1900) {
      contenedor = 1440;
    }
    if (contenedor != 0) {
      return (resolutionA - contenedor) / 2;
    } else {
      return 0;
    }
  }
  //Agrega margen a un contenedor con el tamaño del layout de sura
  function addMarginPosition(componente, position, resolutionA) {
    let contenedor = 0;
    if (resolutionA > 1128 && resolutionA < 1900) {
      contenedor = 1128;
    } else if (resolutionActual > 1900) {
      contenedor = 1440;
    }
    if (contenedor != 0) {
      let margin = (resolutionA - contenedor) / 2;
      switch (position) {
        case "l":
          margin = "margin-left: " + margin + "px;";
          break;
        case "r":
          margin = "margin-right: " + margin + "px;";
          break;
      }
      componente.attr("style", margin);
    }
  }
  addMarginPosition(
    $(".s-c-banner__tab .s-o-tabs__list"),
    "r",
    resolutionActual
  );
  /* addMarginPosition(
    $(".s-c-acordeon__tab .s-o-tabs__list"),
    "r",
    resolutionActual
  ); */
  addMarginPosition($(".s-s-banner-overflowed-text"), "l", resolutionActual);
  $(window).resize(function () {
    resolutionActual = $(window).innerWidth();
    addMarginPosition(
      $(".s-c-banner__tab .s-o-tabs__list"),
      "r",
      resolutionActual
    );
    /* addMarginPosition(
      $(".s-c-acordeon__tab .s-o-tabs__list"),
      "r",
      resolutionActual
    ); */
  });

  /*funcion para HU014 Con TabIndex*/

  /*
  document.addEventListener("keydown", function (event) {
    if (event.key == 9) {
      var componenteCard = document.getElementsByClassName("btn-card-left");
      componenteCard.style.display = "flex";
    }
  });
*/


// asignamos id dinamicos al componente
function asignarIDsCardsAnimationDesplegable(){
  $(".s-c-card_animacion_desplegable").each(function(index){
    var uniqueID = "cardAnimationDesplegable-" + (index + 1);
    $(this).attr('id', uniqueID);
  })
}
//asignarIDsCardsAnimationDesplegable();



  /*hacer visible el boton accesibilidad 014*/

  $(".s-c-card_animacion_desplegable").each(function(index){
    const componenteId = $(this).attr("id");
    if (resolutionActual > 1023) {
      $(".s-js-card-animation.left").attr("tabindex","0");
      $("#" +componenteId+" .s-js-card-animation.left").on("focus",function(){
        $("#" +componenteId+" .s-js-card-animation.left").css({
          cursor: "pointer",
          width: "744px",
        });
        $("#" +componenteId+" .s-js-card-animation.right").css({
          width: "360px",
        });
        $("#" +componenteId+" .btn-card-right").css({
          display: "none",
        });
        $("#" +componenteId+" .btn-card-left").css({
          display: "flex",
        });
      });
      
    }
    if (resolutionActual > 1919) {
      $("#" +componenteId+" .s-js-card-animation.left").attr("tabindex","0");
      $("#" +componenteId+" .s-js-card-animation.left").on("focus",function(){
      
      $("#" +componenteId+" .s-js-card-animation.left").css({
        cursor: "pointer",
        width: "950px",
      });

      $("#" +componenteId+" .s-js-card-animation.right").css({
        width: "460px",
      });
    });
    }
    $("#" +componenteId+" .btn-card-left").focusout(function () {
      if (resolutionActual > 1023) {
        $("#" +componenteId+" .btn-card-right").css({
          display: "flex",
        });
        $("#" +componenteId+" .btn-card-right").focus();
        $("#" +componenteId+" .btn-card-right").attr("tabindex", "0");
  
        $("#" +componenteId+" .s-js-card-animation.right").css({
          cursor: "pointer",
          width: "744px",
        });
  
        $("#" +componenteId+" .s-js-card-animation.left").css({
          width: "360px",
        });
  
        $("#" +componenteId+" .btn-card-left").css({
          display: "none",
        });
      }
  
      if (resolutionActual > 1919) {
        $("#" +componenteId+" .s-js-card-animation.right").css({
          cursor: "pointer",
          width: "950px",
        });
  
        $("#" +componenteId+" .s-js-card-animation.left").css({
          width: "460px",
        });
      }
    });

  });
 
 

  /*funcion para HU014 mobile siempre la primera expandida*/
  if (screen.width < 1025) {
    $(".s-js-card-animation.left").addClass("card-left-expand");
    $(".btn-card-left").css("display", "flex");
    $(".btn-card-left").addClass("btn-card-left-expand");
    $(".card_img_left").addClass("card_img_left-expand");
    $(".alternative_img_left").addClass("alternative_img_left_expand");
    $(".s-c-card_animacion_desplegable_img_mobile_left").addClass(
      "image_expand_prev"
    );
    $(".s-c-card_animacion_desplegable_img_mobile_other_left").addClass(
      "image_expand_current"
    );
    $(".s-js-card-animation.left")
      .find(".s-c-card_animacion_desplegable_card_text")
      .addClass("s-c-card_animacion_desplegable_card_text-expand");
    $(".s-js-card-animation.left")
      .find(".s-c-card_animacion_desplegable_content")
      .addClass("s-c-card_animacion_desplegable_content-expand");
    $(".s-js-card-animation.left")
      .find(".s-c-card_animacion_desplegable_title")
      .addClass("s-c-card_animacion_desplegable_title_expand");
  }

  /*funcion para HU014 animaciones con mobile al darle click al icono*/

    $(".s-js-card-animation.right").click(function () {
      const componenteId = $(this).closest(".s-c-card_animacion_desplegable").attr("id");     

      if (screen.width < 1025) {
        if($("#" + componenteId + " .s-js-card-animation.right").hasClass("card-right-expand")){
          $("#" +componenteId+" .card_img_right").removeClass("card_img_right-expand");
          $("#" +componenteId+" .alternative_img_right").removeClass("alternative_img_right_expand");
          $("#" +componenteId+" .btn-card-right").css("display", "none");
          $("#" +componenteId+" .btn-card-right").removeClass("btn-card-right-expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_right").removeClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_right").removeClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_card_text").removeClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.right").removeClass("card-right-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_content").removeClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_title").removeClass("s-c-card_animacion_desplegable_title_expand"); 
  
          $("#" +componenteId+" .card_img_left").addClass("card_img_left-expand");
          $("#" +componenteId+" .btn-card-left").css("display", "flex");
          $("#" +componenteId+" .btn-card-left").addClass("btn-card-left-expand");
          $("#" +componenteId+" .alternative_img_left").addClass("alternative_img_left_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_left").addClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_left").addClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.left").addClass("card-left-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_card_text").addClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_content").addClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_title").addClass("s-c-card_animacion_desplegable_title_expand");

        }
        else{

          $("#" +componenteId+" .card_img_left").removeClass("card_img_left-expand");
          $("#" +componenteId+" .btn-card-left").css("display", "none");
          $("#" +componenteId+" .btn-card-left").removeClass("btn-card-left-expand");
          $("#" +componenteId+" .alternative_img_left").removeClass("alternative_img_left_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_left").removeClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_left").removeClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.left").removeClass("card-left-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_card_text").removeClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_content").removeClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_title").removeClass("s-c-card_animacion_desplegable_title_expand");

          $("#" +componenteId+" .card_img_right").addClass("card_img_right-expand");
          $("#" +componenteId+" .btn-card-right").css("display", "flex");
          $("#" +componenteId+" .btn-card-right").addClass("btn-card-right-expand");
          $("#" +componenteId+" .alternative_img_right").addClass("alternative_img_right_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_right").addClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_right").addClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_card_text").addClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.right").addClass("card-right-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_content").addClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_title").addClass("s-c-card_animacion_desplegable_title_expand");

        }
       
      }
    });
    $(".s-js-card-animation.left").click(function () {
      const componenteId = $(this).closest(".s-c-card_animacion_desplegable").attr("id"); 
      if (screen.width < 1025) {
        if($("#" + componenteId + " .s-js-card-animation.left").hasClass("card-left-expand")){
          $("#" +componenteId+" .card_img_left").removeClass("card_img_left-expand");
          $("#" +componenteId+" .btn-card-left").css("display", "none");
          $("#" +componenteId+" .btn-card-left").removeClass("btn-card-left-expand");
          $("#" +componenteId+" .alternative_img_left").removeClass("alternative_img_left_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_left").removeClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_left").removeClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.left").removeClass("card-left-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_card_text").removeClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_content").removeClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_title").removeClass("s-c-card_animacion_desplegable_title_expand");

          $("#" +componenteId+" .card_img_right").addClass("card_img_right-expand");
          $("#" +componenteId+" .btn-card-right").css("display", "flex");
          $("#" +componenteId+" .btn-card-right").addClass("btn-card-right-expand");
          $("#" +componenteId+" .alternative_img_right").addClass("alternative_img_right_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_right").addClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_right").addClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_card_text").addClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.right").addClass("card-right-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_content").addClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_title").addClass("s-c-card_animacion_desplegable_title_expand");

        } 
        else{

          $("#" +componenteId+" .card_img_right").removeClass("card_img_right-expand");
          $("#" +componenteId+" .alternative_img_right").removeClass("alternative_img_right_expand");
          $("#" +componenteId+" .btn-card-right").css("display", "none");
          $("#" +componenteId+" .btn-card-right").removeClass("btn-card-right-expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_right").removeClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_right").removeClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_card_text").removeClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.right").removeClass("card-right-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_content").removeClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.right").find(".s-c-card_animacion_desplegable_title").removeClass("s-c-card_animacion_desplegable_title_expand"); 
  
          $("#" +componenteId+" .card_img_left").addClass("card_img_left-expand");
          $("#" +componenteId+" .btn-card-left").css("display", "flex");
          $("#" +componenteId+" .btn-card-left").addClass("btn-card-left-expand");
          $("#" +componenteId+" .alternative_img_left").addClass("alternative_img_left_expand");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_left").addClass("image_expand_prev");
          $("#" +componenteId+" .s-c-card_animacion_desplegable_img_mobile_other_left").addClass("image_expand_current");
          $("#" +componenteId+" .s-js-card-animation.left").addClass("card-left-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_card_text").addClass("s-c-card_animacion_desplegable_card_text-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_content").addClass("s-c-card_animacion_desplegable_content-expand");
          $("#" +componenteId+" .s-js-card-animation.left").find(".s-c-card_animacion_desplegable_title").addClass("s-c-card_animacion_desplegable_title_expand");

        }       
      }
    });

 


  /*resize*/

  // eliminar las clases en mobile al pasar a desktop
  $(window).resize(function () {
    if (screen.width < 1025) {
      $(".btn-card-left").css("display", "flex");
      $(".btn-card-right").css("display", "none");
      $(".btn-card-left").addClass("btn-card-left-expand");
      $(".btn-card-right").removeClass("btn-card-right-expand");

      $(".card_img_left").addClass("card_img_left-expand");
      $(".alternative_img_left").addClass("alternative_img_left_expand");
      $(".s-c-card_animacion_desplegable_img_mobile_left").addClass(
        "image_expand_prev"
      );
      $(".s-c-card_animacion_desplegable_img_mobile_other_left").addClass(
        "image_expand_current"
      );
      $(".s-js-card-animation.left").addClass("card-left-expand");
      $(".s-js-card-animation.left")
        .find(".s-c-card_animacion_desplegable_card_text")
        .addClass("s-c-card_animacion_desplegable_card_text-expand");
      $(".s-js-card-animation.left")
        .find(".s-c-card_animacion_desplegable_content")
        .addClass("s-c-card_animacion_desplegable_content-expand");
      $(".s-js-card-animation.left")
        .find(".s-c-card_animacion_desplegable_title")
        .addClass("s-c-card_animacion_desplegable_title_expand");

      $(".card_img_right").removeClass("card_img_right-expand");
      $(".alternative_img_right").removeClass("alternative_img_right_expand");
      $(".s-c-card_animacion_desplegable_img_mobile_right").removeClass(
        "image_expand_prev"
      );
      $(".s-c-card_animacion_desplegable_img_mobile_other_right").removeClass(
        "image_expand_current"
      );
      $(".s-js-card-animation.right").removeClass("card-left-expand");
      $(".s-js-card-animation.right")
        .find(".s-c-card_animacion_desplegable_card_text")
        .removeClass("s-c-card_animacion_desplegable_card_text-expand");
      $(".s-js-card-animation.right")
        .find(".s-c-card_animacion_desplegable_content")
        .removeClass("s-c-card_animacion_desplegable_content-expand");
      $(".s-js-card-animation.right")
        .find(".s-c-card_animacion_desplegable_title")
        .removeClass("s-c-card_animacion_desplegable_title_expand");
    } else {
      $(".s-js-card-animation.left").removeAttr("style");
      $(".s-js-card-animation.right").removeAttr("style");
      $(".btn-card-right").css("display", "none");
      $(".btn-card-left").css("display", "none");
    }
  });



  /*funcion para HU014 animaciones con hover card izquierda y derecha version Desktop*/
//funcion al expandir desktop
$(".s-c-card_animacion_desplegable").each(function(index){
  const componenteId = $(this).attr("id");
  $("#" +componenteId+" .s-js-card-animation.right").hover(function () {
    if (resolutionActual > 1023 && resolutionActual< 1920) {
      $(this).css({
        cursor: "pointer",
        width: "744px",
      });

      $("#" +componenteId+" .s-js-card-animation.left").css({
        width: "360px",
      });
      $("#" +componenteId).find(".btn-card-right").css({
        display: "flex",
      });
      $("#" +componenteId).find(".btn-card-left").css({
        display: "none",
      });
    }

    if (resolutionActual > 1919) {
      $(this).css({
        cursor: "pointer",
        width: "950px",
      });

      $("#" +componenteId+" .s-js-card-animation.left").css({
        width: "460px",
      });

      $("#" +componenteId).find(".btn-card-right").css({
        display: "flex",
      });
      $("#" +componenteId).find(".btn-card-left").css({
        display: "none",
      });
    }
  });
  $("#" +componenteId+" .s-js-card-animation.left").hover(function () {
    if (resolutionActual > 1023 && resolutionActual< 1920) {
      $(this).css({
        cursor: "pointer",
        width: "744px",
      });
      $("#" +componenteId+" .s-js-card-animation.right").css({
        width: "360px",
      });
      $("#" +componenteId).find(".btn-card-right").css({
        display: "none",
      });
      $("#" +componenteId).find(".btn-card-left").css({
        display: "flex",
      });
    }

    if (resolutionActual > 1919) {
      $(this).css({
        cursor: "pointer",
        width: "950px",
      });

      $("#" +componenteId+" .s-js-card-animation.right").css({
        width: "460px",
      });

      $("#" +componenteId).find(".btn-card-right").css({
        display: "none",
      });
      $("#" +componenteId).find(".btn-card-left").css({
        display: "flex",
      });
    }
  });

})

 

  $(window).resize(function () {
    $(".s-js-card-animation.right").removeAttr("style");
    $(".s-js-card-animation.left").removeAttr("style");
  });

  $("#carouselCard").owlCarousel({
    loop: true,
    margin: 8,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  });

  var principal = $(".owl_slider_principal").owlCarousel({
    loop: false,
    singleItem: false,
    nav: true,
    navRewind: false,
    autoWidth: true,
    dotsEach: false,
    items: 3,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    responsive: {
      1025: {
        items: 3,
        margin: 24,
      },
      1920: {
        items: 3,
        margin: 31,
      },
    },
    onInitialized: function (event) {
      let element = jQuery(event.target);
      element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
      element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      let nav = element.find(".owl-nav");
      let dots = element.find(".owl-dots");
      dots.appendTo(nav);
      let buttonPrev = element.find(".owl-nav button.owl-next");
      dots.after(buttonPrev);
      $(".custom-owl-dots button").appendTo(dots);
      $(".custom-owl-dots").remove();
    },
  });

  //agregamos tabindex para que sea visible en safari

  $(".owl_slider_principal .owl-nav .owl-prev").attr("tabindex", "0");
  $(".owl_slider_principal .owl-nav .owl-next").attr("tabindex", "0");

  principal.on("refreshed.owl.carousel.owl_slider_principal", function (event) {
    $(".owl_slider_principal .owl-nav .owl-next:not(div").removeClass(
      "disabled"
    );
    $(".owl_slider_principal .owl-nav .owl-next:not(div").removeAttr(
      "disabled"
    );
    $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
      "pointer-events",
      "none"
    );

    if ($(window).width() > 1025) {
      //heightCardCarruselPrincipal(".owl_slider_principal");
      $(".container_banner_principal").addClass(
        "owl_slider_principal owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
      );
      $(".container_banner_principal").addClass(
        "owl_slider_principal owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
      );
      $(this).find("div:first").addClass("owl-stage-outer");
      $(".container_banner_principal > div:first").addClass("owl-stage-outer");
    } else {
      $(".container_banner_principal").removeClass(
        "owl_slider_principal owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
      );
      $(this).find(".owl-stage-oute").removeClass("owl-stage-outer");
      $(".container_banner_principal > .owl-stage-outer").removeClass(
        "owl-stage-outer"
      );

      $(".container_banner_principal > owl-stage").removeAttr("style");
      //$('.owl-stage').removeClass('owl-stage')
      $(".container_banner_principal > owl-item").removeClass(
        "owl-item.active"
      );
      $(".container_banner_principal > owl-item").removeAttr("style");
    }
  });

  //se agregan funcionalidades expandida segun los arrows prev

  $(".owl_slider_principal .owl-nav .owl-prev").click(function () {
    
    let selectedIndex;
    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    ).each(function (index, element) {
      if ($(this).hasClass("banner_principal_expandida")) {
        $(this)
          .addClass("banner_principal_contraida")
          .removeClass("banner_principal_expandida");
        $(this)
          .find(".s-c-banner_principal_title")
          .addClass("s-c-banner_principal_title_contraida");
        selectedIndex = index;
      }
    });

    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    )
      .eq(selectedIndex - 1)
      .addClass("banner_principal_expandida")
      .removeClass("banner_principal_contraida")
      .find(".s-c-banner_principal_title")
      .removeClass("s-c-banner_principal_title_contraida");

    //se agrega funcionalidades de expandida a los dots segun el arrow seleccionado
    $(".owl_slider_principal .owl-nav .owl-dots button")
      .eq(selectedIndex)
      .removeClass("active");
    $(".owl_slider_principal .owl-nav .owl-dots button")
      .eq(selectedIndex - 1)
      .addClass("active");

    if (selectedIndex - 1 === 0) {
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").addClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").attr(
        "disabled",
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
        "pointer-events",
        "none"
      );
    }
    //activar el boton next cada vez que se presione el boton prev y el boton next esté disabled
    if (
      $(".owl_slider_principal .owl-nav .owl-next:not(div").hasClass("disabled")
    ) {
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
        "pointer-events",
        "auto"
      );
    }
  });

  //se agregan funcionalidades expandida segun los arrows next
  $(".owl_slider_principal .owl-nav .owl-next").click(function () {
    $(".card_carrusel_banner_principal").removeAttr("style");
    // heightCardCarruselPrincipal(".owl_slider_principal");
    let selectedIndex;
    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    ).each(function (index, element) {
      if ($(this).hasClass("banner_principal_expandida")) {
        $(this)
          .addClass("banner_principal_contraida")
          .removeClass("banner_principal_expandida");
        $(this)
          .find(".s-c-banner_principal_title")
          .addClass("s-c-banner_principal_title_contraida");
        selectedIndex = index;
      }
    });

    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    )
      .eq(selectedIndex + 1)
      .addClass("banner_principal_expandida")
      .removeClass("banner_principal_contraida")
      .find(".s-c-banner_principal_title")
      .removeClass("s-c-banner_principal_title_contraida");

    //// se agrega funcionalidades de expandida a los dots segun el arrow seleccionado
    $(".owl_slider_principal .owl-nav .owl-dots button")
      .eq(selectedIndex)
      .removeClass("active");
    $(".owl_slider_principal .owl-nav .owl-dots button")
      .eq(selectedIndex + 1)
      .addClass("active");

    if (
      selectedIndex + 1 ===
      $(
        ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
      ).length -
        1
    ) {
      $(".owl_slider_principal .owl-nav .owl-next:not(div").addClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
        "pointer-events",
        "none"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").attr(
        "disabled",
        "disabled"
      );
    }
    if (
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").hasClass("disabled")
    ) {
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
        "pointer-events",
        "auto"
      );
    }
  });

  //se agrega funcionalidades de expandida segun la card seleccionada
  $(".owl_slider_principal .owl-stage .owl-item").click(function (element) {
    $(".card_carrusel_banner_principal").removeAttr("style");
    // heightCardCarruselPrincipal(".owl_slider_principal");

    const selectedIndex = $(".owl_slider_principal .owl-stage .owl-item").index(
      this
    );

    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    ).each(function (index, element) {
      if ($(this).hasClass("banner_principal_expandida")) {
        $(this)
          .addClass("banner_principal_contraida")
          .removeClass("banner_principal_expandida");
        $(this)
          .find(".s-c-banner_principal_title")
          .addClass("s-c-banner_principal_title_contraida");
      }
    });

    // se agrega funcionalidades de expandida a los dots segun la card seleccionada
    $(".owl_slider_principal .owl-nav .owl-dots button").each(function (
      index,
      element
    ) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      }
    });

    $(
      ".owl_slider_principal .owl-stage-outer .owl-item .item .card_carrusel_banner_principal"
    )
      .eq(selectedIndex)
      .addClass("banner_principal_expandida")
      .removeClass("banner_principal_contraida")
      .find(".s-c-banner_principal_title")
      .removeClass("s-c-banner_principal_title_contraida");
    $(".owl_slider_principal .owl-nav .owl-dots button")
      .eq(selectedIndex)
      .addClass("active");

    // se agregan funcionaldidades de habilitar y desabilitar arrow segun la card seleccionada
    if (selectedIndex === 0) {
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
        "pointer-events",
        "auto"
      );

      $(".owl_slider_principal .owl-nav .owl-prev:not(div").addClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").attr(
        "disabled",
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
        "pointer-events",
        "none"
      );
    } else if (
      selectedIndex ===
      $(".owl_slider_principal .owl-stage .owl-item").length - 1
    ) {
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
        "pointer-events",
        "auto"
      );

      $(".owl_slider_principal .owl-nav .owl-next:not(div").addClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").attr(
        "disabled",
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
        "pointer-events",
        "none"
      );
    } else {
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeClass(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").removeAttr(
        "disabled"
      );
      $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
        "pointer-events",
        "auto"
      );
      $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
        "pointer-events",
        "auto"
      );
    }
  });

  //se agrega funcionalidades de expandida segun la card seleccionada mobile
  if (resolutionActual < 1025) {
    $(".container_banner_principal .card_carrusel_banner_principal").click(
      function (element) {
        const selectedIndex = $(
          ".container_banner_principal .card_carrusel_banner_principal"
        ).index(this);

        $(".container_banner_principal .card_carrusel_banner_principal").each(
          function (index, element) {
            if ($(this).hasClass("banner_principal_expandida")) {
              $(this)
                .addClass("banner_principal_contraida")
                .removeClass("banner_principal_expandida");
              $(this)
                .find(".s-c-banner_principal_title")
                .addClass("s-c-banner_principal_title_contraida");
            }
          }
        );
        $(".container_banner_principal .card_carrusel_banner_principal")
          .eq(selectedIndex)
          .addClass("banner_principal_expandida")
          .removeClass("banner_principal_contraida")
          .find(".s-c-banner_principal_title")
          .removeClass("s-c-banner_principal_title_contraida");
      }
    );
  }



  //Vamos a comentar esta funcion del resize para que no surta efecto con el inspector
  /*
  $(window).resize(function () {
    if (resolutionActual < 1025) {
      $(
        ".container_banner_principal .card_carrusel_banner_principal"
      ).removeAttr("style");
      $(".s-c-banner_principal_container").removeAttr("style");
      $(".s-c-banner_principal_container_content").removeAttr("style");
      $(".card_carrusel_banner_principal .owl-item").removeAttr("style");

      $(".container_banner_principal .card_carrusel_banner_principal").click(
        function (element) {
          const selectedIndex = $(
            ".container_banner_principal .card_carrusel_banner_principal"
          ).index(this);

          $(".container_banner_principal .card_carrusel_banner_principal").each(
            function (index, element) {
              if ($(this).hasClass("banner_principal_expandida")) {
                $(this)
                  .addClass("banner_principal_contraida")
                  .removeClass("banner_principal_expandida");
                $(this)
                  .find(".s-c-banner_principal_title")
                  .addClass("s-c-banner_principal_title_contraida");
              }
            }
          );
          $(".container_banner_principal .card_carrusel_banner_principal")
            .eq(selectedIndex)
            .addClass("banner_principal_expandida")
            .removeClass("banner_principal_contraida")
            .find(".s-c-banner_principal_title")
            .removeClass("s-c-banner_principal_title_contraida");
        }
      );
    } else if (resolutionActual > 1024) {
      $(".container_banner_principal").addClass(
        "owl_slider_principal owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
      );
      $(".container_banner_principal").addClass(
        "owl_slider_principal owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
      );
      $(this).find("div:first").addClass("owl-stage-outer");
      $(".container_banner_principal > div:first").addClass("owl-stage-outer");

      $(
        ".container_banner_principal .card_carrusel_banner_principal"
      ).removeAttr("style");
      $(".s-c-banner_principal_container").removeAttr("style");
      $(".s-c-banner_principal_container_content").removeAttr("style");
      $(
        ".container_banner_principal .card_carrusel_banner_principal"
      ).removeAttr("style");
      $(".s-c-banner_principal_container").removeAttr("style");
      $(".s-c-banner_principal_container_content").removeAttr("style");


      
      $(".container_banner_principal .card_carrusel_banner_principal").each(
        function (index, element) {
          $(this)
            .find(".s-c-banner_principal_title")
            .addClass("s-c-banner_principal_title_contraida");

          if ($(this).hasClass("banner_principal_expandida")) {
            $(this)
              .addClass("banner_principal_contraida")
              .removeClass("banner_principal_expandida");
            $(this)
              .find(".s-c-banner_principal_title")
              .addClass("s-c-banner_principal_title_contraida");
          }

          if (index === 0) {
            $(".container_banner_principal .card_carrusel_banner_principal")
              .eq(0)
              .addClass("banner_principal_expandida")
              .removeClass("banner_principal_contraida");
            $(this)
              .find(".s-c-banner_principal_title")
              .removeClass("s-c-banner_principal_title_contraida");

            $(".owl_slider_principal .owl-nav .owl-next:not(div").removeClass(
              "disabled"
            );
            $(".owl_slider_principal .owl-nav .owl-next:not(div").removeAttr(
              "disabled"
            );
            $(".owl_slider_principal .owl-nav .owl-next:not(div").css(
              "pointer-events",
              "auto"
            );

            $(".owl_slider_principal .owl-nav .owl-prev:not(div").addClass(
              "disabled"
            );
            $(".owl_slider_principal .owl-nav .owl-prev:not(div").attr(
              "disabled",
              "disabled"
            );
            $(".owl_slider_principal .owl-nav .owl-prev:not(div").css(
              "pointer-events",
              "none"
            );
          }

          //agregando en el resize que los dots siempre comience el primero active

          $(".owl_slider_principal .owl-nav .owl-dots button").each(function (
            index,
            element
          ) {
            if ($(this).hasClass("active")) {
              $(this).removeClass("active");
            }
          });

          $(".owl_slider_principal .owl-nav .owl-dots button")
            .eq(0)
            .addClass("active");
        }
      );

      

      // heightCardCarruselPrincipal(".owl_slider_principal");

      
    }
  });

*/

  

  function heightCardCarruselPrincipal(selector) {
    var timer;
    clearTimeout(timer);
    timer = setTimeout(function () {
      $(selector).each(function () {
        var carrusel = $(this);
        var altoMax = 0;
        carrusel
          .find(".item .card_carrusel_banner_principal")
          .each(function () {
            if ($(this).outerHeight(false) > altoMax) {
              altoMax = $(this).outerHeight(false);
            }
          });
        $(carrusel)
          .find(".item .card_carrusel_banner_principal")
          .each(function () {
            $(this).css("height", altoMax);
          });
      });
    }, 400);
  }

  // heightCardCarruselPrincipal(".owl_slider_principal");

  //Altura Minima container owl
  function minHeightCarrusel() {
    if (!window.inspectorResize){
      $(".s-c-banner_slider_principal .owl_slider_principal").each(function () {
        var carouselContainer = $(this).find(".owl-stage");
        if (resolutionActual >= 1025) {
          var heightCarousel = carouselContainer.outerHeight() + 20;
          carouselContainer.css({ minHeight: heightCarousel + "px" });
        } else {
          carouselContainer.css({ minHeight: "unset" });
        }
      });
    }
  }

  minHeightCarrusel();

  
      setTimeout(function () {
        minHeightCarrusel();
      }, 300);

    
    
 
  

  //se agrega funcionalidades de trasladar titulo y parrafo hu047
  // Fix de error con las cards en HU047 cuando hay mas de una card en la misma pantalla - HU088
  const onMouseEnterScCard = (scCardEl) => {
    if (resolutionActual > 1023) {
      $(scCardEl).addClass('s-c-card-hovered');
      $(scCardEl).find(".text-img-after-container").prepend($(scCardEl).find(".s-c-card-parrafo"));
      $(scCardEl).find(".s-c-card-x-title-top").prepend($(scCardEl).find(".text_bottom"));
    }
  };

  const onMouseLeaveScCard = (scCardEl) => {
    $(scCardEl).removeClass('s-c-card-hovered');
    $(scCardEl).find(".item_text").prepend($(scCardEl).find(".s-c-card-parrafo"));
    $(scCardEl).find(".item_text").prepend($(scCardEl).find(".text_bottom"));
  };

  $(".s-c-card").each(function() {
    const scCardEl = this;
    $(scCardEl).attr('tabindex', 0);
    $(scCardEl).hover(
      function () {
        onMouseEnterScCard(scCardEl);
      },
      function () {
        onMouseLeaveScCard(scCardEl)
      }
    );
    $(scCardEl).on('focus', function() {
      onMouseEnterScCard(this);
    });
    $(scCardEl).on('blur', function() {
      onMouseLeaveScCard(this);
    });
  });


  //asignamos id dinamico a las tabs 18-2

  function asignarIDsCardHorizontal() {
    $(".s-js-cards-horizontal").each(function (index) {
      var uniqueID = 'card-horizontal-' + (index + 1);
          $(this).attr('id', uniqueID);
    });
  }
  asignarIDsCardHorizontal();

  $('.s-js-cards-horizontal').each(function(){
    const componenteId = $(this).attr("id");
    heightCardsHorizontal("#"+componenteId);  

//agregando tab index
$(".cards-horizontal_container").find(".s-o-dropdown__toggle").attr("tabindex", "0");
$(".cards-horizontal_container").find(".s-o-dropdown__toggle").css("cursor", "pointer");

$(".cards-horizontal_container").find(".s-o-dropdown__toggle").on("keydown", function(event) {
  if (event.which === 13) {  
    var btnTab = $(this);
    setTimeout(function () {
      btnTab.trigger("click");
    }, 50);

  }})

//ocultando imagen cuando son dos tabs
    if ( resolutionActual > 1023){        
        if(($(this).find(".subcontainer-cards-horizontal").length)<3){     
            $(this).find('.card_oculta_cards-horizontal_caja_img').css("display","none")        
        } 
        else{
          $(this).find('.card_oculta_cards-horizontal_caja_img').css("display","block")  
        }
      
    }

    //trasladando el color de las tabs
    $(".subcontainer-cards-horizontal").on({
      click: function(){        
        var estilosBackground= $(this).css(['background-color']);
        const id = "#"+$(this).parents().attr("id");

        $(id+"-content").css(estilosBackground);  
      }
    })   
  });




//diferentes escenrarios dependiendo de la cantidad de tabs

//ajustando altura de la card a la altura de las
function heightCardsHorizontal(selector) { 
    $(selector).each(function () {
      var alturaContenedor2 = $(".component-cardS-horizontal").height();   
      // Ajusta la altura del contenedor1
      $(".component-cards-horizontal-content").height(alturaContenedor2);
      $(".subcontainer-parents-cards-horizontal_card").height(alturaContenedor2);       
    });  
}

//heightCardsHorizontal("#card-horizontal-1");




//Simulando el click en la primera tab-18-2

$(".s-js-cards-horizontal").each(function () {
  var btnTab = $(this).find(".s-o-dropdown__toggle").eq(0);
  var estilosBackground= btnTab.parent(".subcontainer-cards-horizontal").css(['background-color']);
    $(".component-cards-horizontal-content").css(estilosBackground);
  setTimeout(function () {
    btnTab.trigger("click");
    btnTab.addClass("active");
  }, 50);
});

//resaltado de negrilla 18-2
$(".cards-horizontal_container .subcontainer-cards-horizontal .s-o-dropdown__toggle").on("click", function(){
  let dropdownSelected = $(this)
  let otherDropdown = dropdownSelected.closest(".cards-horizontal_container").find(".subcontainer-cards-horizontal .s-o-dropdown__toggle").not(dropdownSelected)
  if($(window).width() <= 1024){
    if(dropdownSelected.attr("aria-expanded")==="true"){
      dropdownSelected.find(".cards-horizontal-imagen-titulo-boton_title").find("h1, h2, h3, h4, h5, h6").css("font-weight", "bold")
      otherDropdown.find("h1, h2, h3, h4, h5, h6").css("font-weight", "400")

    }else{
      dropdownSelected.find(".cards-horizontal-imagen-titulo-boton_title").find("h1, h2, h3, h4, h5, h6").css("font-weight", "400")

    }
  }
})


$( window ).on( "resize", function() {
  let checkWidth = $(window).width();
  if (checkWidth>1024){

    $(".cards-horizontal_container .subcontainer-cards-horizontal .s-o-dropdown__toggle").hover(function () {
      $(this).find("h1, h2, h3, h4, h5, h6").css("font-weight","bold")

    }, function(){
      $(this).find("h1, h2, h3, h4, h5, h6").css("font-weight","400")
    })
  }else{
    $(".cards-horizontal_container .subcontainer-cards-horizontal span").off("mouseenter mouseleave");
  }
})
//HU 64-2 tab-banner


  function showTabs(resolution) {
      if (resolution > 1200) {
          $(".s-c-banner-contenido-tab").show();
          $(".s-o-tab-banner-contenido_text").hide();
      } else {
          $(".s-c-banner-contenido-tab").hide();
          $(".s-o-tab-banner-contenido_text").show();
      }
  }

  // Función para mostrar pestañas según la resolución actual
  function moveTabsHTMLCardHorizontal(resolution) {
      if (resolution > 1200) {
          $(".s-c-tab-banner-contenido_accordion").show();
      } else {
          $(".s-c-tab-banner-contenido_accordion").hide();
      }
  }

  // Llama a la función al cargar la página y al cambiar el tamaño de la ventana
  showTabs($(window).width());
  moveTabsHTMLCardHorizontal($(window).width());

  $(window).resize(function () {
      showTabs($(window).width());
      moveTabsHTMLCardHorizontal($(window).width());
  });



//trasladando contenido de la 18-2
function moveTabsHTMLCardHorizontal(resolutionA) {
  if (resolutionA > 1200) {
    $(".s-js-cards-horizontal").each(function () {
      $(this)
        .find(".card_oculta_cards-horizontal_content")
        .each(function () {
          let containerTab =
            "#" +
            $(this)
              .parents(".subcontainer-cards-horizontal")
              .find(".s-o-dropdown__toggle")
              //.find("card_oculta_cards-horizontal_content")
              .attr("id") +
            "-content";
            //tabs-5-tab-1-content
          moveHTML($(this), $(containerTab));
        });
    });
  } else {
    $(".s-js-cards-horizontal").each(function () {
      $(this)
        .find(".subcontainer-parents-cards-horizontal_card")
        .each(function () {
          const parent = "#" + $(this).attr("id").replace("-content", "");
          moveHTML(
            $(this).find("li"),
            $(parent).parents(".subcontainer-cards-horizontal").find("ul")
          );
        });
    });
  }
}
moveTabsHTMLCardHorizontal(resolutionActual);
$(window).resize(function () {
  moveTabsHTMLCardHorizontal(resolutionActual);
  
});

/*
//ocultando imagen cuando son dos tabs
function DesignDesktopCardHorizontal(){
  if ( resolutionActual > 1023){
    $("#card-horizontal-1").each(function (index) {     
      if(($(".s-js-dropdowns.cards-horizontal_container li").length)<3){     
          $('.card_oculta_cards-horizontal_caja_img').css("display","none")        
      }

    });
}

}
DesignDesktopCardHorizontal()

              //traslado de color
            $(".subcontainer-cards-horizontal").on({
              click: function(){              
                var estilosBackground= $(this).css(['background-color']);
                $(".s-c-cards-horizontal-imagen-titulo-boton").find(".component-cards-horizontal-content").css(estilosBackground);  
              }
            })
        

  /*
        $(".boton_flotante_content").on('keyup',function(e){ 
          if (e.which === 13){
            //abrirBotonFlotante();

          }        
    */

  $(".icono_cierre_boton_flotante").on("keyup", function (e) {
    if (e.which === 13) {
      cerrarBoton();
      e.stopPropagation();
    }
  });


  


//funciones preguntas rapidas


$(".s-c-preguntas-rapidas .container li").attr("tabindex", "0");
  function searchActiveDrop() {
    $(".s-c-preguntas-rapidas .select_container .s-o-dropdown .s-o-dropdown__content li.active").removeClass('active')
}


function titleDropdown() {
  var title = $(".s-c-preguntas-rapidas .select_container .s-o-dropdown .s-o-dropdown__content li.active").text()
  $(".s-c-preguntas-rapidas .select_container .s-o-dropdown .s-o-dropdown__heading .s-o-dropdown__title").text(title)
  if (title==="Más antiguo"){
    ordenarPorFechaAntiguaPr();
  }
  else if((title==="Más reciente")){
    ordenarPorFechaRecientePr()
  }
  else if((title==="Más relevante")){
    ordenarPorRelevanciaPr()
  }
  else if((title==="Orden alfabético")){
    ordenarPorTituloPr()
  }  
}
titleDropdown()

function closeDropdown(drop) {
  drop.attr("aria-expanded", "false");
  drop.removeClass("s-js-dropdown__toggle--active");
  drop
      .find(".s-o-dropdown__toggle__right .s-o-icon i")
      .addClass("s-iconDirectionDown1")
      .removeClass("s-iconDirectionUp");
  let idContent = "#" + drop.attr("id") + "-drop-content";
  $(idContent).css("display", "none");
}

closeDropdown($('#dropdown-3'));

$(".s-c-preguntas-rapidas .mobile-select .s-o-dropdown .s-o-dropdown__content li").on("click", function () {
    if (!$(this).hasClass('active')) {
      searchActiveDrop()
      $(this).addClass('active')
      titleDropdown()
      closeDropdown($('#dropdown-3'))
  }  
});

$(".s-c-preguntas-rapidas .mobile-select .s-o-dropdown .s-o-dropdown__content li").on("keyup", function (e) {
  if (e.which === 13){
    if (!$(this).hasClass('active')) {
      searchActiveDrop()
      $(this).addClass('active')
      titleDropdown()
      closeDropdown($('#dropdown-3'))
      }
    }
});


//ordenamiento preguntas rapidas

function ordenarPorFechaAntiguaPr(){
const cards = document.querySelectorAll('.subcontainer_cards_preguntas_rapidas .cards-preguntas-rapidas');
const cardsArray = Array.from(cards);

cardsArray.sort((a, b) => {
      const fechaA = new Date(a.getAttribute('data-date'));
      const fechaB = new Date(b.getAttribute('data-date'));
      return fechaA - fechaB;
});

const container = document.querySelector('.subcontainer_cards_preguntas_rapidas');
container.innerHTML = '';
cardsArray.forEach(card => {
  container.appendChild(card);

});

}

function ordenarPorFechaRecientePr(){
  const cards = document.querySelectorAll('.subcontainer_cards_preguntas_rapidas .cards-preguntas-rapidas');
  const cardsArray = Array.from(cards);
  
  cardsArray.sort((a, b) => {
        const fechaA = new Date(a.getAttribute('data-date'));
        const fechaB = new Date(b.getAttribute('data-date'));
        return fechaB - fechaA;
  });
  
  const container = document.querySelector('.subcontainer_cards_preguntas_rapidas');
  container.innerHTML = '';
  cardsArray.forEach(card => {
    container.appendChild(card);
  
  });
  
}

function ordenarPorRelevanciaPr(){
  const cards = document.querySelectorAll('.subcontainer_cards_preguntas_rapidas .cards-preguntas-rapidas');
  const cardsArray = Array.from(cards);
  
  cardsArray.sort((a, b) => {
    const priorityA = parseFloat(a.getAttribute('data-priority'));
    const priorityB = parseFloat(b.getAttribute('data-priority'));
    return priorityB - priorityA;
  });
  
  const container = document.querySelector('.subcontainer_cards_preguntas_rapidas');
  container.innerHTML = '';
  cardsArray.forEach(card => {
    container.appendChild(card);
  
  });
  
}

function ordenarPorTituloPr(){
  const container = document.querySelector('.subcontainer_cards_preguntas_rapidas');
    const cards = Array.from(container.querySelectorAll('.cards-preguntas-rapidas'));

    cards.sort((a, b) => {
      const subtituloA = a.querySelector('.subtitulo-preguntas-rapidas p').textContent;
      const subtituloB = b.querySelector('.subtitulo-preguntas-rapidas p').textContent;
      return subtituloA.localeCompare(subtituloB);
    });

    container.innerHTML = '';
    cards.forEach(card => container.appendChild(card));
  
}









  //PC hu061

  $(".subcontainer_c-card-expandible-cerrada_flex_uno").hover(function () {
    if (resolutionActual > 1023) {
      $(this).css({
        width: "360px",
        height: "378px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_dos").css({
        width: "168px",
        height: "179px",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_tres").css({
        width: "264px",
        height: "179px",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_cinco").css({
        height: "179px",
        "-webkit-transform": "translate(336px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_seis").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(236px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_siete").css({
        height: "179px",
        "-webkit-transform": "translate(143px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_ocho").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(49px, -203px)",
      });
    }
  });

  $(".subcontainer_c-card-expandible-cerrada_flex_dos").hover(function () {
    if (resolutionActual > 1023) {
      $(this).css({
        width: "360px",
        height: "378px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_uno").css({
        height: "179px",
        width: "168px",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_tres").css({
        height: "179px",
        width: "264px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_cuatro").css({
        height: "179px",
        width: "264px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_cinco").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-49px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_seis").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(236px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_siete").css({
        height: "179px",
        "-webkit-transform": "translate(143px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_ocho").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(49px, -203px)",
      });
    }
  });

  $(".subcontainer_c-card-expandible-cerrada_flex_tres").hover(function () {
    if (resolutionActual > 1023) {
      $(this).css({
        width: "360px",
        height: "378px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_uno").css({
        height: "179px",
        width: "168px",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_dos").css({
        height: "179px",
        width: "168px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_cuatro").css({
        height: "179px",
        width: "360px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_cinco").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-49px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_seis").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-144px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_siete").css({
        height: "179px",
        "-webkit-transform": "translate(143px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_ocho").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(49px, -203px)",
      });
    }
  });

  $(".subcontainer_c-card-expandible-cerrada_flex_cuatro").hover(function () {
    if (resolutionActual > 1023) {
      $(this).css({
        width: "360px",
        height: "378px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_uno").css({
        height: "179px",
        width: "168px",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_dos").css({
        height: "179px",
        width: "264px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_tres").css({
        height: "179px",
        width: "264px",
      });

      $(".subcontainer_c-card-expandible-cerrada_flex_cinco").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-49px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_seis").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-144px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_siete").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-240px, -203px)",
      });
      $(".subcontainer_c-card-expandible-cerrada_flex_ocho").css({
        height: "179px",
        width: "168px",
        "-webkit-transform": "translate(-338px, -203px)",
      });
    }
  });

  //funciones del HU-83-Boton flotante

  $(".boton_flotante_content").attr("tabindex", "0");
  $(".boton_flotante_content").css("cursor", "pointer");
  
  $(".boton_flotante_content").on("keydown", function(event) {
    if (event.which === 13) {  
      var btnTab = $(this);
      setTimeout(function () {
        btnTab.trigger("click");
      }, 50);
  
    }})


  $(".icono_cierre_boton_flotante").attr("tabindex", "0");
  $(document).keydown(function (e) {
    if (e.keyCode === 9) {
      if (resolutionActual > 1023) {
        $("#dropdown-5_boton_flotante").keypress(function (event) {
          $(".boton_flotante_content").removeClass("disabled");
          $(".boton_flotante_content").removeAttr("disabled", "disabled");
        });
        $(".icono_cierre_boton_flotante").attr("tabindex", "0");
      }
    }
  });

  $(".s-c-Boton_flotante .boton_flotante_categoría").each(function () {
    if ($(this).find(".boton_flotante_subCategoría").length > 0) {
      $(this)
        .find(".boton_flotante_button")
        .addClass("boton_flotante_button_disabled");
      $(this).find(".boton_flotante_button").attr("tabindex", "-1");
      $(this).find(".boton_flotante_button_subcategoría").attr("tabindex", "0");
    } else {
      $(this)
        .find(".boton_flotante_button")
        .removeClass("boton_flotante_button_disabled'");
      $(this).find(".boton_flotante_button").attr("tabindex", "0");
    }
  });


  $(window).resize(function () {
    menuFlotante();
  });

  $(".boton_flotante_content").attr('aria-expanded', "false");
  
  // PRUEBA
  function cerrarBoton() {
    var estaEnLaParteSuperior = $(window).scrollTop() === 0;
  
    $(".dropdown-5-drop-content_boton_flotante").css("display", "none");
    $(".icono_cierre_boton_flotante").css({
      display: "none",
    });
  
    $(".s-o-icon_boton_flotante").css({
      display: "block",
    });

  
    $(".boton_flotante_content").attr('aria-expanded', "false");
    $(".boton_flotante_content").removeAttr("disabled", "disabled");
    $(".boton_flotante_content").removeClass("boton_flotante_content_abierto");
    $(".boton_flotante_content").removeClass("disabled");
    $(".boton_flotante_content").css('border-bottom', '');
    $(".boton_flotante_content").css('margin-bottom', '');
  

    // if ($(window).width() > 1024) {
      if (estaEnLaParteSuperior) {
        $(".boton_flotante_container").removeClass("makeover");
      } else {
        $(".boton_flotante_container").addClass("makeover");
        $(".s-o-dropdown_boton_flotante__toggle__left ").css('display', 'none');
      }
    // }
    menuAbierto = false;
  }


          function abrirBotonFlotante(){
            if (!$(".boton_flotante_content").hasClass("disabled")){
              $('.dropdown-5-drop-content_boton_flotante').css({
                display: "block",
              })
              
              $('.icono_cierre_boton_flotante').css({
                display: "block"
              })
            

              $('.s-o-icon_boton_flotante').css({
                display: "none",
              })
             

              $(".boton_flotante_content").attr('aria-expanded', "true");
              $(".boton_flotante_content").addClass('disabled');
              $(".boton_flotante_content").addClass('boton_flotante_content_abierto');            
              $(".boton_flotante_content").attr('disabled','disabled');
              // $(".boton_flotante_content").css('border-bottom', '1px solid #DFE7EE');
              // $(".boton_flotante_content").css('margin-bottom', '2px');

              $(".boton_flotante_container").removeClass("makeover");
        
              $(".s-o-dropdown_boton_flotante__toggle__left").css("display", "block");

            //  Border-bottom botón abierto
              if ($(".boton_flotante_container").hasClass("bg-color-primary-color-1")) {
                $(".boton_flotante_content").css('border-bottom', '1px solid #ffffff');
              } else {
                $(".boton_flotante_content").css('border- bottom', '1px solid #2D6DF6 ');
              }
            }
            menuAbierto = true;
          }

  var categorias = document.querySelectorAll('.boton_flotante_categoría');

  categorias.forEach(function (categoria) {
    var subcategorias = categoria.querySelectorAll('.boton_flotante_button_subcategoría');

    // Elimina la clase 'con-margen' de todas las subcategorías
    subcategorias.forEach(function (subcategoria) {
      subcategoria.classList.remove('marginSubcategory');
    });

    // Agrega la clase 'con-margen' solo al último <li>
    var ultimoSubcategoria = subcategorias[subcategorias.length - 1];
    if (ultimoSubcategoria) {
      ultimoSubcategoria.classList.add('marginSubcategory');
      ultimoSubcategoria.classList.remove('noMarginSubcategory');
    }

   
  });



  function menuFlotante() {
    if (resolutionActual > 1023) {
      $(".boton_flotante_content").unbind("click");
      $(".boton_flotante_content").on({
        mouseenter: function () {
          abrirBotonFlotante();
        },
      });
    } else {
      $(".boton_flotante_content").unbind("mouseenter");
      $(".boton_flotante_content").on({
        click: function () {
          abrirBotonFlotante();
        },
      });
    }
  }

  menuFlotante();

  $(".icono_cierre_boton_flotante").on("click", function (e) {
    e.preventDefault();
    cerrarBoton();
    e.stopPropagation();
  });


  $(".boton_fotante_tibot").on("click", function (e) {
    e.preventDefault();
    cerrarBoton();
  });

 

  
  


  $(".boton_flotante_content").on("keyup", function (e) {
    if (e.which === 13) {
      abrirBotonFlotante();
    }
  });

  $(".icono_cierre_boton_flotante").on("keyup", function (e) {
    if (e.which === 13) {
      cerrarBoton();
      e.stopPropagation();
    }
  });


var menuAbierto = false;

 
  // function gestionarScroll() {
  //   if (!menuAbierto) {
  //     if ($(window).scrollTop() > 0 && $(window).width() > 1024) {
  //       $(".s-o-dropdown_boton_flotante__toggle__left").css("display", "none");
  //       $(".boton_flotante_container").addClass("makeover");
  //     } else {
  //       $(".boton_flotante_container").removeClass("makeover");
  //       $(".s-o-dropdown_boton_flotante__toggle__left").css("display", "block");
  //     }
  //   }
  // }

  function gestionarScroll() {
    if (!menuAbierto) {
      if ($(window).scrollTop() > 0 ) {
        $(".s-o-dropdown_boton_flotante__toggle__left").css("display", "none");
        $(".boton_flotante_container").addClass("makeover");
      } else {
        $(".boton_flotante_container").removeClass("makeover");
        $(".s-o-dropdown_boton_flotante__toggle__left").css("display", "block");
      }
    }
  }

  $(window).scroll(function () {
    gestionarScroll();
  });


  $(window).resize(function () {
    gestionarScroll();
  });


  gestionarScroll();

//funciones hu64-2

//agregamos tab index a los enlaces del banner..
$(".s-c-internal_banner").each(function () {
  $(this).find(".internal_banner_content_enlace").attr("tabindex", "0");
});

if(resolutionActual<1024){
  $(".s-c-internal_banner").each(function () {
    $(this).find(".s-o_internal_banner_text").addClass("s-o_internal_banner_text_mobile");
  });

}




  //funciones hu31

  function abrirBotonExpandibleVideo(){
      $('.boton_expandible_video-btn').css({
        display: "none",
      })

      $('.s-c-boton_expandible_video-content').css({
        display: "block",
      })     
    }

   
    function cerrarBotonExpandibleVideo(){
      var originalSrc = $('.myIframe').attr('src');
      $('.myIframe').attr('src', 'about:blank'); // Cambia a una URL vacía para detener la reproducción
      setTimeout(function () {
        $('.myIframe').attr('src', originalSrc);
          }, 500); // Ajusta el intervalo según sea necesario
      

      $('.boton_expandible_video-btn').css({
        display: "flex",
      })

      $('.s-c-boton_expandible_video-content').css({
        display: "none",
      })     
    }

    $(".boton_expandible_video-btn").on("click", function (e) {
      e.preventDefault();
      abrirBotonExpandibleVideo();
      e.stopPropagation();
    });

    $(".s-c-boton_expandible_video-iconco-cierre").on("click", function (e) {
      e.preventDefault();
      cerrarBotonExpandibleVideo();
      e.stopPropagation();
    });

    $(".s-c-boton_expandible_video-iconco-cierre").attr("tabindex", "0");

    $(".s-c-boton_expandible_video-iconco-cierre").on("keyup", function (e) {
      if (e.which === 13) {
      e.preventDefault();
      cerrarBotonExpandibleVideo()
      e.stopPropagation();
      }
    });


    // funciones para la hu16

    let owlSettingsCardRedesSociales ={
      loop:false,
      center:false, 
      autoWidth:true,   
      autoplay:false,
      pagination:false,
      nav:true,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
      singleItem:true,
      autoHeight: true, 
      autoWidth: true,
      //autoWidth:true,
      items:4,  
      itemsDesktop:4,
      dots:false,  
      dotsEach:false,           
      responsive:{
          0:{      
              items:1,
              margin:24,
              touchDrag:false,
              mouseDrag:false,
              //stagePadding:450,
                       
          },
          600:{
              items:3,
              margin:24,
              touchDrag:false,
              mouseDrag:false,
              stagePadding:450,
          },
          1000:{            
              items:3,
              margin:24,
              touchDrag:false,
              mouseDrag:false
          },
          1025:{            
              items:4,
              autoWidth:true,
              margin:24,
              touchDrag:false,
              mouseDrag:false
          },

          1919: {            
            items:4,
            autoWidth:true,
            margin:30,
            touchDrag:false,
            mouseDrag:false,
            //stagePadding:450,
        },
         
      },
    
      onInitialized: function (event) {


        $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item").removeAttr("tabindex", "0");
    $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").attr("tabindex", "0");
       // $(".s-c-carrusel-cards_Redes_sociales .owl-item:last-child").find(".card_redes_sociales").attr("tabindex", "0");
        let element = jQuery(event.target);
        element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
        element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");

        var itemCount = $('.owl-carousel .item').length;

      if (itemCount > 4) {
        $('.owl-carrusel-cards_Redes_sociales owl-nav').css("display", "none");
        $(".s-c-carrusel-cards_Redes_sociales .owl-item.active:last-child").attr("tabindex", "0");
      }

      var botonControl= $(".s-c-carrusel-cards_Redes_sociales .s-o-controller__nav");

      botonControl.each(function() {
        if ($(this).hasClass('disabled')) {
          // Si tiene la clase 'disabled', agrega tabindex="-1"
          $(this).attr('tabindex', '-1');
        } else {
          // Si no tiene la clase 'disabled', elimina el atributo tabindex
          $(this).removeAttr('tabindex');
        }
      });

      
    }, 
    
    onTranslate:function(event){


      if (resolutionActual <= 1025) {
        $('.owl-carrusel-cards_Redes_sociales').each(function (index) {
          const componenteId = $(this).attr("id");
          if ($("#" + componenteId).find('.owl-prev').hasClass("disabled")) {
            $(this).find(".owl-stage").css("padding-left", "0px");
          } else {
            $(this).find(".owl-stage").css("padding-left", "90px");
          }
        });
      }

      if (resolutionActual <= 1025 && resolutionActual >= 768) {
        $('.owl-carrusel-cards_Redes_sociales').each(function (index) {
          const componenteId = $(this).attr("id");
          if ($("#" + componenteId).find('.owl-prev').hasClass("disabled")) {
            $(this).find(".owl-stage").css("padding-left", "0px");
          } else {
            $(this).find(".owl-stage").css("padding-left", "152px");
          }
        });
      }

     


      
      var botonControl= $(".s-c-carrusel-cards_Redes_sociales .s-o-controller__nav");

      botonControl.each(function() {
        if ($(this).hasClass('disabled')) {
          // Si tiene la clase 'disabled', agrega tabindex="-1"
          $(this).attr('tabindex', '-1');
        } else {
          // Si no tiene la clase 'disabled', elimina el atributo tabindex
          $(this).removeAttr('tabindex');
        }
      });



      var ultimoItemActivo = $(".owl-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").last();

      // Aplica el estilo deseado al último elemento activo
      ultimoItemActivo.css({
        // Agrega aquí tus estilos personalizados
        //border: '2px solid red',
        // Otros estilos...
      });


      
    },

    onTranslated:function(event){
    

    if (resolutionActual > 1919) {
      var owlCarrusel = $('.owl-carrusel-cards_Redes_sociales');
    
      if (owlCarrusel.find(".owl-item.active").length > 4) {   
        //owlCarrusel.find('.owl-item.active').removeAttr('tabindex')    
        // Eliminar la clase active a partir del quinto elemento
        owlCarrusel.find('.owl-item.active:gt(3)').attr('tabindex', "-1");
        owlCarrusel.find('.owl-item.active:lt(4)').attr('tabindex', "0");
      }
    
      //owlCarrusel.find(".owl-item:eq(3)").css("margin-right", "100px");
    }

    if (resolutionActual < 1919){

      $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item").removeAttr("tabindex", "0");
      $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").attr("tabindex", "0");
        //$(".s-c-carrusel-cards_Redes_sociales .owl-item:last-child").attr("tabindex", "0");
        $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").attr("tabindex", "0");
        $(".s-c-carrusel-cards_Redes_sociales .owl-item.active:last-child").attr("tabindex", "0");  

    }

  }
    
    };


    
    
    
    //asignamos id dinamicos a carrusel
    function asignarIDsCardRedesSociales() {
      $(".owl-carrusel-cards_Redes_sociales").each(function (index) {
        var uniqueID = 'carruselRedesSociales-' + (index + 1);
            $(this).attr('id', uniqueID);
      });
    }
    
    asignarIDsCardRedesSociales();
    
    //inicializamos carrusel
    function inicializarCardRedesSociales() {
      $(".owl-carrusel-cards_Redes_sociales").each(function (index) {
            var carruselId= $(this).attr('id');
            $("#"+carruselId).owlCarousel(owlSettingsCardRedesSociales);
      });
    }
    
    inicializarCardRedesSociales();

    var ultimoItemActivo = $(".owl-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").last();


    if (resolutionActual > 1919) {
      var owlCarrusel = $('.owl-carrusel-cards_Redes_sociales');
    
      if (owlCarrusel.find(".owl-item.active").length > 4) {
        // Eliminar la clase active a partir del quinto elemento
        owlCarrusel.find('.owl-item.active:gt(3)').attr('tabindex', "-1");
        owlCarrusel.find('.owl-item.active:lt(4)').attr('tabindex', "0");
      }
    
      //owlCarrusel.find(".owl-item:eq(3)").css("margin-right", "100px");
    }

    if (resolutionActual < 1919){

      $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item").removeAttr("tabindex", "0");
      $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").attr("tabindex", "0");
        //$(".s-c-carrusel-cards_Redes_sociales .owl-item:last-child").attr("tabindex", "0");
        $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item.active").attr("tabindex", "0");
        $(".s-c-carrusel-cards_Redes_sociales .owl-item.active:last-child").attr("tabindex", "0");  

    }
   

    $(".owl-carrusel-cards_Redes_sociales .item").css("height","100%");
    $(".card_redes_sociales").on({
      
      mouseover: function() {
        $(".owl-carrusel-cards_Redes_sociales .item").each(function (index){
          $(this).css("height","");
        });
        $(".owl-carrusel-cards_Redes_sociales .item").css("height","");
      },
      mouseleave: function() {
        $(".owl-carrusel-cards_Redes_sociales .item").each(function (index){
          $(this).css("height","100%")
        });
      }
    });

    
    
    
    $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item").on("keyup", function(event) {
      if (event.which === 9) {   
        $(this).find(".boton_cards_Redes_sociales").css("display","flex");    
        $(".owl-carrusel-cards_Redes_sociales .item").each(function (index){
          $(this).css("height","");
        });
        $(".owl-carrusel-cards_Redes_sociales .item").css("height","");
        $(this).find(".boton_cards_Redes_sociales_caja").css("padding","16px 17px 16px 15px");  

       $(".s-c-carrusel-cards_Redes_sociales .owl-stage .owl-item").on("focus", function(){
        $(".owl-carrusel-cards_Redes_sociales .item").each(function (index){
          $(this).css("height","100%")
        });  
        //$(this).find(".boton_cards_Redes_sociales").css("display"," ");      
        //$(this).find(".boton_cards_Redes_sociales").attr("tabindex", "-1");
     
        });
     
      }  

    });
 

    


//accesibilidad de la hu36
if (resolutionActual > 1023){
  $(".card-icono-hover-color").attr('tabindex', 0);
  $(".card-icono-hover-color").on('focus', function() {  
    $(this).find(".button-icono-hover-color").css("width","100%");  
    $(this).find(".button-icono-hover-color").removeClass("s-t-btn--icon");
    $(this).find(".button-icono-hover-color-iconoTexto").css("display","flex");
      $(this).find(".s-o-icon").addClass("s-t-icon--right");
      $(this).find(".s-o-icon").addClass("m-l-16");
      $(this).find(".button-icono-hover-color").css("padding", "16px 18px");
  });
  $(".button-icono-hover-color").on('blur', function() {
    $(this).css("width","");
    $(this).addClass("s-t-btn--icon");
      $(this).find(".s-o-icon").removeClass("s-t-icon--right");
      $(this).find(".button-icono-hover-color-iconoTexto").css("display","none");
      $(this).find(".s-o-icon").removeClass("m-l-16");
      $(this).find(".button-icono-hover-color").css("padding", "16px");

  });

  $(".card-icono-hover-color").on({
    mouseover:function(){
      $(this).find(".button-icono-hover-color").css("width","100%");     
      $(this).find(".button-icono-hover-color").removeClass("s-t-btn--icon");
      $(this).find(".button-icono-hover-color").css("padding", "16px 18px");
      $(this).find(".s-o-icon").addClass("s-t-icon--right");
      $(this).find(".s-o-icon").addClass("m-l-16");
      $(this).find(".button-icono-hover-color-iconoTexto").css("display","flex");

    
      
    },
    mouseleave:function(){
      $(this).find(".button-icono-hover-color").css("width","");  
      $(this).find(".button-icono-hover-color").addClass("s-t-btn--icon");
      $(this).find(".s-o-icon").removeClass("s-t-icon--right");
      $(this).find(".button-icono-hover-color").css("padding", "16px");
      $(this).find(".s-o-icon").removeClass("m-l-16");
      $(this).find(".button-icono-hover-color-iconoTexto").css("display","none");

    }   
  
})

}

if (resolutionActual < 1023){
  $(".button-icono-hover-color").removeClass("s-t-btn--icon");
  $(".button-icono-hover-color").find(".s-o-icon").addClass("s-t-icon--right");
  $(".button-icono-hover-color").find(".s-o-icon").addClass("m-l-16");

}





  //funciones del pc hu069 -- START->

  const margin = 18;
  const maxCardHeight = 358 + margin; //set altura de card expandida

  //const maxCardWidth = 1072; //set el ancho de todas las cards

let maxCardWidth;
if (resolutionActual > 1024 && resolutionActual<1919) {
  maxCardWidth = 1072;
} else if (resolutionActual>1919) {
  maxCardWidth = 1384;
}

//asignando ids dinámicos
function asignarIDsCardExpandibleCerrada() {
  $(".s-c-card-expandible-cerrada").each(function (index) {
    var uniqueID = 'cardExpandibleCerrada-' + (index + 1);
        $(this).attr('id', uniqueID);
  });
}

asignarIDsCardExpandibleCerrada();

  function drawInitialState() { 
    $(".s-c-card-expandible-cerrada").each(function (index, element) {
      const contenedorId = "#"+$(this).attr('id');

      const rowCardAmount1 = $(contenedorId+" .row1 li").length;
      const cardRowWidth1 = maxCardWidth / rowCardAmount1;

      $(contenedorId+" .row1-1").css({ with: "", translate: "", display: "none"});
      $(contenedorId+" .row1-2").css({ with: "", translate: "", display: "none"});

      $(contenedorId+" .row2-1").css({ with: "", translate: "", display: "none"});
      $(contenedorId+" .row2-2").css({ with: "", translate: "", display: "none"});

      $(contenedorId+" .row1-1 li,"+contenedorId+" .row1-2 li").each(function (index, element) {
        const contenedorId = "#"+$(this).closest('section').parent().attr('id');
        $(contenedorId+" .row1").append($(this));
      });

      $(contenedorId+" .row2-1 li,"+contenedorId+" .row2-2 li").each(function (index, element) {
        const contenedorId = "#"+$(this).closest('section').parent().attr('id');
        $(contenedorId+" .row2").append($(this));
      });

      const heightPerCard = "179px";
      //agregar estilos a cada div de fila 1 && agregar estilos a cada div de fila 2
      $(contenedorId+" .row1 li,"+contenedorId+" .row2 li").css({ height: heightPerCard, width: cardRowWidth1 + "px", translate: ""});

      $(contenedorId+" .row1,"+contenedorId+" .row2").removeAttr("style");
      
      $(contenedorId+" .row1,"+contenedorId+" .row2").css({
        display: "flex",
        margin: "0",
        padding: "0px",
        "max-width": "100%",
        "justify-content": "space-between",
      });
    });
  }

  drawInitialState();

  function removeTabIndexDropDesktopCardCerrada() {
    $(".s-c-card-expandible-cerrada .s-o-dropdown__toggle").each(function () {
      if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
        $(this).find(".card-expandible-cerrada-content").attr("tabindex", "-1");
      }
    });
  }
  removeTabIndexDropDesktopCardCerrada();

  $(".card-expandible-cerrada").css("cursor", "pointer");

  //accesibilidad nv por tab del componente
  $(".s-c-card-expandible-cerrada").attr("tabindex", "0");
    $(".s-c-card-expandible-cerrada").on("keyup", function(event) {
      if (event.which === 9) {       
        //$(".s-c-card-expandible-cerrada").find(".card-expandible-cerrada").removeAttr("tabindex");
       $(".s-c-card-expandible-cerrada").find(".card-expandible-cerrada").attr("tabindex", "0");
       $(".card-cerrada-boton").find(".card-expandible-cerrada").attr("tabindex", "0");
       $(".card-expandible-cerrada-content").css("height", "80px");
       $(".card-expandible-cerrada-content").find(".card-expandible-cerrada").attr("tabindex", "-1"); 


       $(".card-expandible-cerrada").on("focus", function(){
        $(".card-expandible-cerrada-content").css("height", "100%");
        $(".s-c-card-expandible-parrafo ").css("display","none");
        $(".s-c-card-expandible-boton ").css("display","none");
        drawInitialState();
     
        });
     
      }   


      $(".card-cerrada-boton").on("keydown", function(event) {
        if (event.which === 13) {  
          var btnTab = $(this);
          setTimeout(function () {
            btnTab.trigger("click");
          }, 50);

        }})

  
    });



   
//translate con row1
  if (resolutionActual > 1024) {
    $(".row1 li").on({
      mouseover: function() {
        //buscar el id del contenedor
          const contenedorId = "#"+$(this).closest('section').parent().attr('id');

          const rowCardAmount1 = $(contenedorId+" .row1 li").length;
          const cardRowWidth1 = maxCardWidth / rowCardAmount1;

          $(contenedorId+ " .row1 li").attr('tabindex', "-1");
          $(".card-cerrada-boton").attr('tabindex', "0");
          $(this).addClass('active');          
          $(this).find(".card-expandible-cerrada-content").attr('tabindex', -1);
            // Código para el evento "hover" cuando el mouse entra
            // ...
            $(this).find(".s-c-card-expandible-title").css("text-align","left");
            $(this).find(".s-c-card-expandible-title").css("padding-bottom","10px");
            $(this).find(".card-expandible-cerrada-content").css("align-items","flex-start");
            //$(this).find(".card-expandible-cerrada-content").css("justify-content","initial");
      
            $(contenedorId+ " .row1 li").each(function() {
              var $li = $(this);       
              // Comprueba si el ancho del elemento es mayor a 350 píxeles
              if ($li.width() > 350) {
                $(this).find("card-expandible-cerrada-content").css("padding", "50px 30px 30px 30px"); //
              }
              });
         
            $(this).css("height", maxCardHeight + "px");
            const marginCalculated =
              ($(contenedorId+ " .row1").width() - rowCardAmount1 * cardRowWidth1) /
              (rowCardAmount1 - 1);
      
            const position = $(this).index();
            if (position === 0) {
              let restanteRow1 = $(contenedorId+ " .row1").width() - cardRowWidth1 - marginCalculated;
      
              const newCardRow2Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+ " .row2 li").css("width", newCardRow2Width + "px");
      
              let currentCardWidth =
                Number($(this).css("width").replace(/px/g, "")) + marginCalculated;
      
              let cardHeight =
                Number($(this).next().css("height").replace(/px/g, "")) + margin;
      
              $(contenedorId+ " .row2").css("width", restanteRow1 + "px");
              $(contenedorId+ " .row2").css(
                "translate",
                currentCardWidth + "px -" + cardHeight + "px"
              );
            } else if (position === rowCardAmount1 - 1) {
              const newCardRow2Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+ " .row2 li").css("width", newCardRow2Width + "px");
      
              let restanteRow1 = $(contenedorId+ " .row1").width() - cardRowWidth1 - marginCalculated;
      
              let cardHeight =
                Number($(this).prev().css("height").replace(/px/g, "")) + margin;
      
              $(contenedorId+ " .row2").css("width", restanteRow1 + "px");
              $(contenedorId+ " .row2").css("translate", "0px -" + cardHeight + "px");
            } else {
              let numberOfCardsBefore = 0;
              $(contenedorId+ " .row2 li").each(function (index, element) {
                if (index < position) {
                  numberOfCardsBefore = numberOfCardsBefore + 1;
                }
              });
      
              numberOfCardsBefore =
                numberOfCardsBefore % 2 === 0
                  ? numberOfCardsBefore + 1
                  : numberOfCardsBefore;
      
              let newCardRow2WidthBefore = $(this).width;
              if (position !== numberOfCardsBefore) {
                newCardRow2WidthBefore =
                  (position * cardRowWidth1 - marginCalculated * (position - 1)) /
                  numberOfCardsBefore;
              }
      
              const numberOfCardsAfterRow1 = rowCardAmount1 - 1 - position;
              let numberOfCardsAfterRow2 = rowCardAmount1 - numberOfCardsBefore;
      
              let newCardRow2WidthAfter = $(this).width;
              if (numberOfCardsAfterRow1 !== numberOfCardsAfterRow2) {
                newCardRow2WidthAfter =
                  (numberOfCardsAfterRow1 * cardRowWidth1 -
                    marginCalculated * numberOfCardsAfterRow1) /
                  numberOfCardsAfterRow2;
              }
      
              $(contenedorId+ " .row2-1").css("display", "flex");
              $(contenedorId+ " .row2-2").css("display", "flex");
      
              $(contenedorId+ " .row2 li").each(function (index, element) {
                if (index < numberOfCardsBefore) {
                  $(this).css("width", newCardRow2WidthBefore + "px");
                  $(contenedorId+ " .row2-1").append($(this));
                } else {
                  $(this).css("width", newCardRow2WidthAfter + "px");
                  $(contenedorId+ " .row2-2").append($(this));
                }
              });
      
              let restanteRow1Before =
                position * cardRowWidth1 + marginCalculated * (position - 1);
      
              let cardHeight =
                Number($(this).prev().css("height").replace(/px/g, "")) + margin + 20; //20 es igual al gap -> calcular TODO
      
              $(contenedorId+ " .row2-1").css("width", restanteRow1Before + "px");
              $(contenedorId+ " .row2-1").css("translate", "0px -" + cardHeight + "px");
      
              let restanteRow1After =
                numberOfCardsAfterRow1 * cardRowWidth1 +
                marginCalculated * (numberOfCardsAfterRow1 - 1);
              const currentCardWidthBefore =
                (position + 1) * cardRowWidth1 +
                marginCalculated * position +
                marginCalculated;
      
              cardHeight = cardHeight * 2 - 16; //14 is gap
              $(contenedorId+ " .row2-2").css("width", restanteRow1After + "px");
              $(contenedorId+ " .row2-2").css(
                "translate",
                currentCardWidthBefore + "px -" + cardHeight + "px"
              );
            }
          
        },
        mouseleave: function() {
            // Código para el evento "hover" cuando el mouse sale
            // ...
            drawInitialState();
            $(this).removeClass('active');
            $(this).find(".card-expandible-cerrada-content").css("align-items","center");
            $(this).find(".card-expandible-cerrada-content").css("justify-content","center");
            $(this).find(".s-c-card-expandible-title").css("text-align","center");
        },
        keydown: function(e) {
          //$("#row1 li").attr('tabindex', 0);
            if (e.which === 13) {
              const contenedorId = "#"+$(this).closest('section').parent().attr('id');
              const rowCardAmount1 = $(contenedorId+" .row1 li").length;
              const cardRowWidth1 = maxCardWidth / rowCardAmount1;

              drawInitialState(); 
              
              $(this).find(".s-c-card-expandible-parrafo ").css("display","block");
              $(this).find(".s-c-card-expandible-boton ").css("display","flex");
                // Código para el evento "Enter" (tecla 13)
                // ...

                // Código para el evento "hover" cuando el mouse entra
            // ...

            $(this).find(".s-c-card-expandible-title").css("text-align","left");
            $(this).find(".s-c-card-expandible-title").css("padding-bottom","10px");
            $(this).find(".card-expandible-cerrada-content").css("align-items","flex-start");
            //$(this).find(".card-expandible-cerrada-content").css("justify-content","initial");
      
            $(contenedorId+ " .row1 li").each(function() {
              var $li = $(this);       
              // Comprueba si el ancho del elemento es mayor a 350 píxeles
              if ($li.width() > 350) {
                $(this).find("card-expandible-cerrada-content").css("padding", "50px 30px 30px 30px"); //
              }
              });
         
            $(this).css("height", maxCardHeight + "px");
            const marginCalculated =
              ($(contenedorId+ " .row1").width() - rowCardAmount1 * cardRowWidth1) /
              (rowCardAmount1 - 1);
      
            const position = $(this).index();
            if (position === 0) {
              let restanteRow1 = $(contenedorId+ " .row1").width() - cardRowWidth1 - marginCalculated;
      
              const newCardRow2Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+ " .row2 li").css("width", newCardRow2Width + "px");
      
              let currentCardWidth =
                Number($(this).css("width").replace(/px/g, "")) + marginCalculated;
      
              let cardHeight =
                Number($(this).next().css("height").replace(/px/g, "")) + margin;
      
              $(contenedorId+ " .row2").css("width", restanteRow1 + "px");
              $(contenedorId+ " .row2").css(
                "translate",
                currentCardWidth + "px -" + cardHeight + "px"
              );
            } else if (position === rowCardAmount1 - 1) {
              const newCardRow2Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+ " .row2 li").css("width", newCardRow2Width + "px");
      
              let restanteRow1 = $(contenedorId+ " .row1").width() - cardRowWidth1 - marginCalculated;
      
              let cardHeight =
                Number($(this).prev().css("height").replace(/px/g, "")) + margin;
      
              $(contenedorId+ " .row2").css("width", restanteRow1 + "px");
              $(contenedorId+ " .row2").css("translate", "0px -" + cardHeight + "px");
            } else {
              let numberOfCardsBefore = 0;
              $(contenedorId+ " .row2 li").each(function (index, element) {
                if (index < position) {
                  numberOfCardsBefore = numberOfCardsBefore + 1;
                }
              });
      
              numberOfCardsBefore =
                numberOfCardsBefore % 2 === 0
                  ? numberOfCardsBefore + 1
                  : numberOfCardsBefore;
      
              let newCardRow2WidthBefore = $(this).width;
              if (position !== numberOfCardsBefore) {
                newCardRow2WidthBefore =
                  (position * cardRowWidth1 - marginCalculated * (position - 1)) /
                  numberOfCardsBefore;
              }
      
              const numberOfCardsAfterRow1 = rowCardAmount1 - 1 - position;
              let numberOfCardsAfterRow2 = rowCardAmount1 - numberOfCardsBefore;
      
              let newCardRow2WidthAfter = $(this).width;
              if (numberOfCardsAfterRow1 !== numberOfCardsAfterRow2) {
                newCardRow2WidthAfter =
                  (numberOfCardsAfterRow1 * cardRowWidth1 -
                    marginCalculated * numberOfCardsAfterRow1) /
                  numberOfCardsAfterRow2;
              }
      
              $(contenedorId+ " .row2-1").css("display", "flex");
              $(contenedorId+ " .row2-2").css("display", "flex");
      
              $(contenedorId+ " .row2 li").each(function (index, element) {
                if (index < numberOfCardsBefore) {
                  $(this).css("width", newCardRow2WidthBefore + "px");
                  $(contenedorId+ " .row2-1").append($(this));
                } else {
                  $(this).css("width", newCardRow2WidthAfter + "px");
                  $(contenedorId+ " .row2-2").append($(this));
                }
              });
      
              let restanteRow1Before =
                position * cardRowWidth1 + marginCalculated * (position - 1);
      
              let cardHeight =
                Number($(this).prev().css("height").replace(/px/g, "")) + margin + 20; //20 es igual al gap -> calcular TODO
      
              $(contenedorId+ " .row2-1").css("width", restanteRow1Before + "px");
              $(contenedorId+ " .row2-1").css("translate", "0px -" + cardHeight + "px");
      
              let restanteRow1After =
                numberOfCardsAfterRow1 * cardRowWidth1 +
                marginCalculated * (numberOfCardsAfterRow1 - 1);
              const currentCardWidthBefore =
                (position + 1) * cardRowWidth1 +
                marginCalculated * position +
                marginCalculated;
      
              cardHeight = cardHeight * 2 - 16; //14 is gap
              $(contenedorId+ " .row2-2").css("width", restanteRow1After + "px");
              $(contenedorId+ " .row2-2").css(
                "translate",
                currentCardWidthBefore + "px -" + cardHeight + "px"
              );
            }
          
        
            }
        }
    });
}

//estilos al hacer hover en row1
if(resolutionActual>1024){
  $(".row1 li").on({
    mouseover: function(){
    var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this);
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
},
mouseleave: function(){
  var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this).find(".s-c-card-expandible-content");
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
    //drawInitialState();
}, keyup: function(e) {
  if (e.which === 13) {
    var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this);
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
    }
  }
});
}


  //Mobile row1
  if(resolutionActual<1025){
    

//simulamos click en el primer acordeon
  $(".s-c-card-expandible-cerrada").each(function () {
    const contenedorId = "#"+$(this).attr('id');
    var btnTab = $(contenedorId).find(".row1 .s-o-dropdown__toggle").eq(0);
    setTimeout(function () {
      btnTab.trigger("click");
      btnTab.addClass("active");
    }, 50);
    //trasladamos li para que sea solo un acordeon
    $(this).find(".row2 li").appendTo($(this).find(".row1"));
  });

  $(".row1 li").on("click", function (element){
    const contenedorId = "#"+$(this).closest('section').parent().attr('id');
    $(contenedorId).find(".card-expandible-cerrada.active").removeClass("active");
  // Agrega la clase 'active' al elemento li clicado
  $(this).addClass("active");  
    $(this).find(".card-expandible-cerrada").css("height","auto");
    $(this).find(".card-expandible-cerrada-content").css("justify-content","space-between");      
    $(this).find(".s-c-card-expandible-title").css("padding-bottom","0px");    
});

}

//translate con row2
if (resolutionActual > 1024) {
  $(".row2 li").on({
      mouseenter: function() {
        //buscar el id del contenedor
        const contenedorId = "#"+$(this).closest('section').parent().attr('id');
        const rowCardAmount1 = $(contenedorId+" .row1 li").length;
        const cardRowWidth1 = maxCardWidth / rowCardAmount1;

        $(".card-cerrada-boton").attr('tabindex', "0");
        $(contenedorId+" .row2 li").attr('tabindex', -1);
        $(this).addClass('active');
        $(this).find(".s-c-card-expandible-title").css("text-align","left");
        $(this).find(".s-c-card-expandible-title").css("padding-bottom","10px");
        $(this).find(".card-expandible-cerrada-content").css("align-items","flex-start");
    
        $(contenedorId+" .row2 li").each(function() {
          var $li = $(this);       
          // Comprueba si el ancho del elemento es mayor a 350 píxeles
          if ($li.width() > 350) {
              $(this).find("card-expandible-cerrada-content").css("padding", "50px 30px 30px 30px"); //
          }
        })
    
        let cardHeight = Number($(this).css("height").replace(/px/g, "")) + margin;
        const marginCalculated =
          ($(contenedorId+" .row1").width() - rowCardAmount1 * cardRowWidth1) /
          (rowCardAmount1 - 1);
    
        $(this).css("height", maxCardHeight + "px");
        $(this).css("translate", "0px -" + cardHeight + "px");
    
        const position = $(this).index();
        if (position === 0) {
          let restanteRow1 = $(contenedorId+" .row1").width() - cardRowWidth1 - marginCalculated;
    
          const newCardRow1Width =
            ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
            rowCardAmount1;
          $(contenedorId+" .row1 li").css("width", newCardRow1Width + "px");
    
          let currentCardWidth =
            Number($(this).css("width").replace(/px/g, "")) + marginCalculated;
    
          $(contenedorId+" .row1").css("width", restanteRow1 + "px");
          $(contenedorId+" .row1").css("translate", currentCardWidth + "px 0px");
        } else if (position === rowCardAmount1 - 1) {
          const newCardRow1Width =
            ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
            rowCardAmount1;
          $(contenedorId+" .row1 li").css("width", newCardRow1Width + "px");
    
          let restanteRow2 = $(contenedorId+" .row2").width() - cardRowWidth1 - marginCalculated;
    
          $(contenedorId+" .row1").css("width", restanteRow2 + "px");
          $(contenedorId+" .row1").css("translate", "0px 0px");
        } else {
          let numberOfCardsBefore = 0;
          $(contenedorId+" .row1 li").each(function (index, element) {
            if (index < position) {
              numberOfCardsBefore = numberOfCardsBefore + 1;
            }
          });
    
          numberOfCardsBefore =
            numberOfCardsBefore % 2 === 0
              ? numberOfCardsBefore + 1
              : numberOfCardsBefore;
    
          let newCardRow1WidthBefore = $(this).width;
          if (position !== numberOfCardsBefore) {
            newCardRow1WidthBefore =
              (position * cardRowWidth1 - marginCalculated * (position - 1)) /
              numberOfCardsBefore;
          }
    
          const numberOfCardsAfterRow2 = rowCardAmount1 - 1 - position;
          let numberOfCardsAfterRow1 = rowCardAmount1 - numberOfCardsBefore;
    
          let newCardRow1WidthAfter = $(this).width;
          if (numberOfCardsAfterRow2 !== numberOfCardsAfterRow1) {
            newCardRow1WidthAfter =
              (numberOfCardsAfterRow2 * cardRowWidth1 -
                marginCalculated * numberOfCardsAfterRow2) /
              numberOfCardsAfterRow1;
          }
    
          $(contenedorId+" .row1-1").css("display", "flex");
          $(contenedorId+" .row1-2").css("display", "flex");
    
          $(contenedorId+" .row1 li").each(function (index, element) {
            if (index < numberOfCardsBefore) {
              $(this).css("width", newCardRow1WidthBefore + "px");
              $(contenedorId+" .row1-1").append($(this));
            } else {
              $(this).css("width", newCardRow1WidthAfter + "px");
              $(contenedorId+" .row1-2").append($(this));
            }
          });
    
          $(contenedorId+" .row2").css("translate", "0px -221px"); //TODO
    
          let restanteRow2Before =
            position * cardRowWidth1 + marginCalculated * (position - 1);
    
          let cardHeight =
            Number($(this).prev().css("height").replace(/px/g, "")) + margin + 20; //20 es igual al gap -> calcular TODO
    
          $(contenedorId+" .row1-1").css("width", restanteRow2Before + "px");
          $(contenedorId+" .row1-1").css("translate", "0px 0px");
    
          let restanteRow2After =
            numberOfCardsAfterRow2 * cardRowWidth1 +
            marginCalculated * (numberOfCardsAfterRow2 - 1);
          const currentCardWidthBefore =
            (position + 1) * cardRowWidth1 +
            marginCalculated * position +
            marginCalculated;
    
          cardHeight = cardHeight * 2 - 16; //14 is gap
          $(contenedorId+" .row1-2").css("width", restanteRow2After + "px");
          $(contenedorId+" .row1-2").css("translate", currentCardWidthBefore + "px -198px"); //TODO
        }
      },
      mouseleave: function() {
          drawInitialState();
          $(this).removeClass('active');
          $(this).find(".card-expandible-cerrada-content").css("align-items","center");
          $(this).find(".card-expandible-cerrada-content").css("justify-content","center");
          $(this).find(".s-c-card-expandible-title").css("text-align","center");

      },
      keydown: function(e) {
          if (e.which === 13) {
            const contenedorId = "#"+$(this).closest('section').parent().attr('id');
            const rowCardAmount1 = $(contenedorId+" .row1 li").length;
            const cardRowWidth1 = maxCardWidth / rowCardAmount1;
            drawInitialState(); 
              
            $(this).find(".s-c-card-expandible-parrafo ").css("display","block");
            $(this).find(".s-c-card-expandible-boton ").css("display","flex");

            $(this).find(".s-c-card-expandible-title").css("text-align","left");
            $(this).find(".s-c-card-expandible-title").css("padding-bottom","10px");
            $(this).find(".card-expandible-cerrada-content").css("align-items","flex-start");
        
            $(contenedorId+" .row2 li").each(function() {
              var $li = $(this);       
              // Comprueba si el ancho del elemento es mayor a 350 píxeles
              if ($li.width() > 350) {
                  $(this).find("card-expandible-cerrada-content").css("padding", "50px 30px 30px 30px"); //
              }
            })
        
        
            let cardHeight = Number($(this).css("height").replace(/px/g, "")) + margin;
            const marginCalculated =
              ($(contenedorId+" .row1").width() - rowCardAmount1 * cardRowWidth1) /
              (rowCardAmount1 - 1);
        
            $(this).css("height", maxCardHeight + "px");
            $(this).css("translate", "0px -" + cardHeight + "px");
        
            const position = $(this).index();
            if (position === 0) {
              let restanteRow1 = $(contenedorId+" .row1").width() - cardRowWidth1 - marginCalculated;
        
              const newCardRow1Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+" .row1 li").css("width", newCardRow1Width + "px");
        
              let currentCardWidth =
                Number($(this).css("width").replace(/px/g, "")) + marginCalculated;
        
              $(contenedorId+" .row1").css("width", restanteRow1 + "px");
              $(contenedorId+" .row1").css("translate", currentCardWidth + "px 0px");
            } else if (position === rowCardAmount1 - 1) {
              const newCardRow1Width =
                ((rowCardAmount1 - 1) * cardRowWidth1 - marginCalculated) /
                rowCardAmount1;
              $(contenedorId+" .row1 li").css("width", newCardRow1Width + "px");
        
              let restanteRow2 = $(contenedorId+" .row2").width() - cardRowWidth1 - marginCalculated;
        
              $(contenedorId+" .row1").css("width", restanteRow2 + "px");
              $(contenedorId+" .row1").css("translate", "0px 0px");
            } else {
              let numberOfCardsBefore = 0;
              $(contenedorId+" .row1 li").each(function (index, element) {
                if (index < position) {
                  numberOfCardsBefore = numberOfCardsBefore + 1;
                }
              });
        
              numberOfCardsBefore =
                numberOfCardsBefore % 2 === 0
                  ? numberOfCardsBefore + 1
                  : numberOfCardsBefore;
        
              let newCardRow1WidthBefore = $(this).width;
              if (position !== numberOfCardsBefore) {
                newCardRow1WidthBefore =
                  (position * cardRowWidth1 - marginCalculated * (position - 1)) /
                  numberOfCardsBefore;
              }
        
              const numberOfCardsAfterRow2 = rowCardAmount1 - 1 - position;
              let numberOfCardsAfterRow1 = rowCardAmount1 - numberOfCardsBefore;
        
              let newCardRow1WidthAfter = $(this).width;
              if (numberOfCardsAfterRow2 !== numberOfCardsAfterRow1) {
                newCardRow1WidthAfter =
                  (numberOfCardsAfterRow2 * cardRowWidth1 -
                    marginCalculated * numberOfCardsAfterRow2) /
                  numberOfCardsAfterRow1;
              }
        
              $(contenedorId+" .row1-1").css("display", "flex");
              $(contenedorId+" .row1-2").css("display", "flex");
        
              $(contenedorId+" .row1 li").each(function (index, element) {
                if (index < numberOfCardsBefore) {
                  $(this).css("width", newCardRow1WidthBefore + "px");
                  $(contenedorId+" .row1-1").append($(this));
                } else {
                  $(this).css("width", newCardRow1WidthAfter + "px");
                  $(contenedorId+" .row1-2").append($(this));
                }
              });
        
              $(contenedorId+" .row2").css("translate", "0px -221px"); //TODO
        
              let restanteRow2Before =
                position * cardRowWidth1 + marginCalculated * (position - 1);
        
              let cardHeight =
                Number($(this).prev().css("height").replace(/px/g, "")) + margin + 20; //20 es igual al gap -> calcular TODO
        
              $(contenedorId+" .row1-1").css("width", restanteRow2Before + "px");
              $(contenedorId+" .row1-1").css("translate", "0px 0px");
        
              let restanteRow2After =
                numberOfCardsAfterRow2 * cardRowWidth1 +
                marginCalculated * (numberOfCardsAfterRow2 - 1);
              const currentCardWidthBefore =
                (position + 1) * cardRowWidth1 +
                marginCalculated * position +
                marginCalculated;
        
              cardHeight = cardHeight * 2 - 16; //14 is gap
              $(contenedorId+" .row1-2").css("width", restanteRow2After + "px");
              $(contenedorId+" .row1-2").css("translate", currentCardWidthBefore + "px -198px"); //TODO
            }
          }
      }

  });
}

//estilos al hacer hover en row2
if(resolutionActual>1024){
  $(".row2 li").on({
    mouseover: function(){
    var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this)
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
},
mouseleave: function(){
  var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this).find(".s-c-card-expandible-content");
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
    drawInitialState();
}, keyup: function(e) {
  if (e.which === 13) {
    var $parrafo = $(this).find(".s-c-card-expandible-parrafo");
    var $boton = $(this).find(".s-c-card-expandible-boton");
    var $contenedor = $(this)
    $parrafo.appendTo($contenedor);
    $boton.appendTo($contenedor);
    }
  }
});
}


 //Mobile row2
if(resolutionActual<1025){
  $(".row2 li").on("click", function (element){
    $(this).find(".card-expandible-cerrada").css("height","auto");
    $(this).find(".s-c-card-expandible-title").css("padding-bottom","0px");
});
}
  
  /*TABS BANNER*/
  function moveTabsHTML(resolutionA) {
    $(".s-js-banner__tab").each(function () {
      var minWidth = 1200;
      if($(this).hasClass('s-c-acordeon__tab')){
        minWidth = 1023;
      }
      if (resolutionA > minWidth) {
        $(this)
        .find("section")
        .each(function () {
          let containerTab =
            "#" +
            $(this)
              .parents(".s-o-tabs__li")
              .find(".s-o-tabs__toggle")
              .attr("id") +
            "-content";
          moveHTML($(this), $(containerTab));
        });
      }
      else{
        $(this)
        .find(".s-o-tabs__toggle")
        .each(function () {
          let containerTab = "#" + $(this).attr("id") + "-content";
          moveHTML(
            $(containerTab).find("section"),
            $(this).parents(".s-o-tabs__li").find(".s-o-dropdown__content")
          );
        });
      }
    })
  }
  moveTabsHTML(resolutionActual);
  $(window).resize(function () {
    moveTabsHTML(resolutionActual);
  });

  /*************Banner_tab_icon [<]********************************/

  function handleTabToggleClick() {
    var allToggles = $(".s-o-tabs__toggle");
    allToggles.not(this).removeClass("active");
    allToggles.find(".s-iconWeightLight").removeClass("moved-icon");

    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).find(".s-iconWeightLight").removeClass("moved-icon");
    } else {
      $(this).addClass("active");
      $(this).find(".s-iconWeightLight").addClass("moved-icon");
    }
  }

  function activateFunction() {
    var tabToggles = $(".s-o-tabs__toggle");
    /* var tabToggles = $(".s-o-tabs__toggle").not(".s-c-acordeon-L__tab .s-o-tabs__li .s-o-tabs__toggle"); */
    tabToggles.on("click", handleTabToggleClick);
/*     let tabTogglesMobile = $(".s-c-acordeon-L__tab .s-o-tabs__li .s-o-tabs__toggle");
    tabTogglesMobile.on("click", handleTabToggleClick); */
  }

  activateFunction();

  $(".s-c-banner__tab").each(function () {
    var btnTab = $(this).find(".s-o-tabs__toggle").eq(0);
    setTimeout(function () {
      btnTab.trigger("click");
      btnTab.addClass("active");
    }, 50);
  });
  $(".s-c-acordeon__tab").each(function () {
    var btnTab = $(this).find(".s-o-tabs__toggle").eq(0);
    setTimeout(function () {
      btnTab.trigger("click");
      btnTab.addClass("active");
    }, 50);
  });

  $(window).resize(function () {
    if ($(window).innerWidth() <= 1200) {
      handleTabToggleClick.call($(".s-o-tabs__toggle.active"));
    }
  });
  /********************************Hover tabs***************************************************/
  function cambiarColorDiv() {
    $(this).toggleClass("active");
    $(".s-o-tabs__li").not(this).removeClass("active");
  }
  $(".s-c-tab_videobutton_card .s-o-tabs__li").on("click", cambiarColorDiv);

  //   /**reloadResolutionTab**/
  //   let recargaRealizada = false;
  //   function reloadPageAccordingResolutionTab() {
  //     const windowwidth = $(window).width();
  //     const bannerTabWidth = $(".s-c-banner__tab").width();
  //     if (windowwidth <= 1200 && bannerTabWidth <= 1200 && !recargaRealizada) {
  //       location.reload();
  //       recargaRealizada = false;
  //     }
  // }

  /*********************************************************************** */
  $(".owl-carousel-tiras").owlCarousel({
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    nav: false,
    singleItem: true,
    autoHeight: true,
    autoWidth: true,
    autoplayHoverPause: true,
    items: 5,
    itemsDesktop: 5,
    dotsEach: 1,
    responsive: {
      0: {
        items: 2,
        margin: 10,
      },
      600: {
        items: 3,
        margin: 16,
      },
      1000: {
        items: 5,
        margin: 16,
      },
      1025: {
        items: 5,
        autoWidth: true,
        margin: 24,
        touchDrag: false,
        mouseDrag: false,
      },
    },
    onInitialized: function (event) {
      let element = jQuery(event.target);
      element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
      element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
      let item = element.find(".owl-item.active:first .card_carrusel_tiras");
      item.addClass("firstActiveItem");
    },
    onTranslated: function (event) {
      $(".owl-carousel-tiras").each(function () {
        $(this)
          .find(".owl-item .card_carrusel_tiras")
          .removeClass("firstActiveItem");
        $(this)
          .find(".owl-item.active:first .card_carrusel_tiras")
          .addClass("firstActiveItem");
      });

      $(".owl-carousel-tiras").each(function () {
        $(this).find(".owl-item .card_carrusel_tiras");
        if ($(this).hasClass("active")) {
          $(this).find("owl-item active a").attr("tabindex", "0");
        } else {
          $(this).find("owl-item a").attr("tabindex", "-1");
        }
      });
    },
  });

  function heightCard(selector) {
    $(selector).each(function () {
      var altoMax = 0;
      $(this)
        .find(".card_carrusel_tiras")
        .each(function () {
          if ($(this).outerHeight(true) > altoMax) {
            altoMax = $(this).outerHeight(true);
          }
        });

      $(this)
        .find(".card_carrusel_tiras")

        .each(function () {
          $(this).css("height", altoMax);
        });
    });
  }
  heightCard(".owl-carousel-tiras");



//card_job

$('.card_job').mouseleave(function() {
  $('.card_job_img').removeClass('hovered');
  $('.card_job_content').removeClass('hovered');
});

$('.card_job_img').mouseenter(function() {
  $(this).addClass('hovered');
  $(this).next('.card_job_content').addClass('hovered');
});











if (resolutionActual <= 1025){
  //$(".card_job").addClass("container");

}

//accesibilidad navegacion por tab
$(".card_job").attr("tabindex", "0");

$(".card_job").on("keyup", function(event) {
  if (event.which === 9) {   
    $(this).find(".card_job_img ").css("height","145px");
    $(this).find(".card_job_text").css("display","block"); 
    
    $(this).on("focus", function(){
      $(this).find(".card_job_img ").css("height","236px");
      $(this).find(".card_job_text").css("display","none"); 
      });
  }  

});

var cardJob = $('.card_job');

    cardJob.hover(
        function() {
            cardJob.removeClass('reversed');
        },
        function() {
            setTimeout(function() {
                cardJob.addClass('reversed');
            }, 0); // Espera 0 segundos antes de revertir la animación
        }
    );







let owlSettingsCardCategorias ={
  loop:false,
  center:false,    
  autoplay:false,
  pagination:false,
  nav:true,
  navText: [
    "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
],
  singleItem:true,
  autoHeight: true, 
  //autoWidth:true,
  items:5,  
  itemsDesktop:5,
  dots:false,  
  dotsEach:false,           
  responsive:{
      0:{      
          items:1,
          margin:16,
          touchDrag:false,
          mouseDrag:false,
          stagePadding:50,
                   
      },
      600:{
          items:3,
          margin:16,
          touchDrag:false,
          mouseDrag:false,
          stagePadding:50,
      },
      1000:{            
          items:3,
          margin:24,
          touchDrag:false,
          mouseDrag:false
      },
      1025:{            
          items:4,
          autoWidth:true,
          margin:40,
          touchDrag:false,
          mouseDrag:false
      },
     
  },

  onInitialized: function (event) {
    let element = jQuery(event.target);
    element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
    element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
    element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
    element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");

    if (resolutionActual <= 1025){
      $('.owl-carousel-para-categorias .owl-stage').css("padding-left", "0px");
      $('.owl-carousel-para-categorias .owl-stage').css("padding-right", "30px");

    }

    $('.owl-carousel-para-categorias').off();
},   


onTranslated: function (event) {  

  if (resolutionActual <= 1025){
    $('.owl-carousel-para-categorias .owl-stage').css("padding-left", "50px");
    $('.owl-carousel-para-categorias .owl-stage').css("padding-right", "50px");
  }


  $('.s-c-carrusel-para-categorias .owl-nav .owl-dots button').click(function(){
    const carouselId = $(this).attr("data-owl-carousel-id");
    const selectedIndex = Number($(this).find("span").attr("data-owl-index"));

    
    $('#'+carouselId+' .owl-nav .owl-dots button').each(function(index, element){  

      const resultFirstCardCategoria = $(firstCardCategoriaStr.replace('{carouselId}', carouselId));
      const resultPrevButtonCategoria = $(buttonPrevCategoriaStr.replace('{carouselId}', carouselId));
      const resultNextButtonCategoria = $(buttonNextCategoriaStr.replace('{carouselId}', carouselId));
      if($(this).hasClass("active")){
        if(index === 0){
          resultNextButtonCategoria.removeClass("disabled");
          resultNextButtonCategoria.removeAttr('disabled');
          resultNextButtonCategoria.css("pointer-events", "auto");
          if (resolutionActual <= 1025){
            $('.owl-carousel-para-categorias .owl-stage').css("padding-left", "0px");
            $('.owl-carousel-para-categorias .owl-stage').css("padding-right", "30px");      
          }          
          resultPrevButtonCategoria.addClass("disabled");
          resultPrevButtonCategoria.attr('disabled','disabled');
          resultPrevButtonCategoria.css("pointer-events", "none");
        }else if(selectedIndex === resultFirstCardCategoria.length -1){
          resultPrevButtonCategoria.removeClass("disabled");
          resultPrevButtonCategoria.removeAttr('disabled');
          resultPrevButtonCategoria.css("pointer-events", "auto");
          
          resultNextButtonCategoria.addClass("disabled");
          resultNextButtonCategoria.attr('disabled','disabled');
          resultNextButtonCategoria.css("pointer-events", "none");
  
          if (resolutionActual <= 1025){
            $('.owl-carousel-para-categorias .owl-stage').css("padding-left", "90px");
            $('.owl-carousel-para-categorias .owl-stage').css("padding-right", "10px");
      
          }
        }else{
          resultNextButtonCategoria.removeClass("disabled");
          resultNextButtonCategoria.removeAttr('disabled');
          resultPrevButtonCategoria.removeClass("disabled");
          resultPrevButtonCategoria.removeAttr('disabled');
          resultNextButtonCategoria.css("pointer-events", "auto");
          resultPrevButtonCategoria.css("pointer-events", "auto");
        }

      } 
    });
  
  });

  $('.s-c-carrusel-para-categorias .owl-nav .owl-dots button').on('keydown', function(e){
    if (e.keyCode === 13){
      e.preventDefault();
      e.stopPropagation();
      
      $(this).trigger("click");
  
       
    }

  });

},

};


//asignamos id dinamicos a carrusel
function asignarIDsCarruselCategorias() {
  $(".owl-carousel-para-categorias").each(function (index) {
    var uniqueID = 'carruselCategorias-' + (index + 1);
        $(this).attr('id', uniqueID);
  });
}

asignarIDsCarruselCategorias();

//inicializamos carrusel
function inicializarCarruselCategorias() {
  $(".owl-carousel-para-categorias").each(function (index) {
        var carruselId= $(this).attr('id');
        $("#"+carruselId).owlCarousel(owlSettingsCardCategorias);
  });
}

inicializarCarruselCategorias();


let firstCardCategoriaStr= '#{carouselId} .owl-stage-outer .owl-item .item .card_carrusel_para_categorias';
let buttonPrevCategoriaStr= '#{carouselId} .owl-nav .owl-prev';
let buttonNextCategoriaStr= '#{carouselId} .owl-nav .owl-next';



//inicializacion de los dots manuales
$(".owl-carousel-para-categorias").each(function(){
  
  let globalCardCategoria= $(this);
  let dotsContainerCategorias= globalCardCategoria.find(".owl-dots");
  let navContainerCategorias = globalCardCategoria.find(".owl-nav");
  let buttonPrevCategorias = globalCardCategoria.find(".owl-nav button.owl-next");

  const carouselId = globalCardCategoria.attr("id");

  globalCardCategoria.find(".owl-item").each(function (index) {
    dotsContainerCategorias.append('<button role="button" class="owl-dot custom-dot  s-o-controller__dots" data-owl-carousel-id="'+ carouselId + '"><span class="s-o-controller__span " data-owl-index="'+ index + '"></span></button>');
  });
  
  globalCardCategoria.find('[data-owl-index="0"]').parent().addClass("active")
  globalCardCategoria.find('.owl-prev').attr("data-owl-carousel-id",  carouselId)
  globalCardCategoria.find('.owl-next').attr("data-owl-carousel-id",  carouselId)

//agregamos que la primera card siemrpe tenga la clase primeraCardCategoria para cualquier carrusel
  globalCardCategoria.find('.card_carrusel_para_categorias').eq(0).addClass("primeraCardCategoria");
  
  dotsContainerCategorias.appendTo(navContainerCategorias);
  dotsContainerCategorias.after(buttonPrevCategorias);

});



//seleccionamos cards segun los dots y bloqueamos los arrow segun los dots seleccionados
$('.s-c-carrusel-para-categorias .owl-nav .owl-dots button').click(function(){
  

  const carouselId = $(this).attr("data-owl-carousel-id");

  const selectedIndex = Number($(this).find("span").attr("data-owl-index"));
  $('#'+carouselId+' .owl-nav .owl-dots button').each(function(index, element){  
    if($(this).hasClass("active")){
      $(this).removeClass("active");
    } 
  });

  $(this).addClass("active");

  const resultFirstCardCategoria = $(firstCardCategoriaStr.replace('{carouselId}', carouselId));
  const resultPrevButtonCategoria = $(buttonPrevCategoriaStr.replace('{carouselId}', carouselId));
  const resultNextButtonCategoria = $(buttonNextCategoriaStr.replace('{carouselId}', carouselId));

  resultFirstCardCategoria.each(function(index, element){
    if($(this).hasClass("primeraCardCategoria")){
      $(this).removeClass("primeraCardCategoria");
      $(this).removeClass("card_carrusel_para_categorias_selected");
    }
  }); 

  resultFirstCardCategoria.eq(selectedIndex).addClass("card_carrusel_para_categorias_selected")
  resultFirstCardCategoria.eq(selectedIndex).addClass("primeraCardCategoria")


  if(selectedIndex === 0){
    resultNextButtonCategoria.removeClass("disabled");
    resultNextButtonCategoria.removeAttr('disabled');
    resultNextButtonCategoria.css("pointer-events", "auto");


    resultPrevButtonCategoria.addClass("disabled");
    resultPrevButtonCategoria.attr('disabled','disabled');
    resultPrevButtonCategoria.css("pointer-events", "none");
  }else if(selectedIndex === resultFirstCardCategoria.length -1){
    resultPrevButtonCategoria.removeClass("disabled");
    resultPrevButtonCategoria.removeAttr('disabled');
    resultPrevButtonCategoria.css("pointer-events", "auto");
    
    resultNextButtonCategoria.addClass("disabled");
    resultNextButtonCategoria.attr('disabled','disabled');
    resultNextButtonCategoria.css("pointer-events", "none");
  }else{
    resultNextButtonCategoria.removeClass("disabled");
    resultNextButtonCategoria.removeAttr('disabled');
    resultPrevButtonCategoria.removeClass("disabled");
    resultPrevButtonCategoria.removeAttr('disabled');
    resultNextButtonCategoria.css("pointer-events", "auto");
    resultPrevButtonCategoria.css("pointer-events", "auto");
  }

});



//mejorando accesibilidad
$(".s-c-carrusel-para-categorias").on("keydown click", "> *", function(e){
  if (e.keyCode === 13 || e.keyCode === 9 || e.type === 'click'){
    $('.s-c-carrusel-para-categorias .owl-stage .owl-item:not(.active)').find("a").attr("tabindex", "-1");
    $('.s-c-carrusel-para-categorias .owl-stage .owl-item.active').find("a").attr("tabindex", "0");
    desenfocarItemDisabled ();
  }

});

function desenfocarItemDisabled (){
  $('.s-c-carrusel-para-categorias .owl-stage .owl-item a').each(function(index, element){
    if($(this).hasClass("s-c-categorias-disabled")){
      $(this).removeAttr("tabindex");
      $(this).attr("tabindex", "-1");
    }
  })

}
desenfocarItemDisabled ();






//se agrega la sombra a la card seleccionada segun el arrow prev
$('.owl-carousel-para-categorias .owl-nav .owl-prev').click(function(){


  const carouselId = $(this).attr("data-owl-carousel-id");


  const resultFirstCardCategoria = $(firstCardCategoriaStr.replace('{carouselId}', carouselId));
  const resultPrevButtonCategoria = $(buttonPrevCategoriaStr.replace('{carouselId}', carouselId));
  const resultNextButtonCategoria = $(buttonNextCategoriaStr.replace('{carouselId}', carouselId));

let selectedIndex;

resultFirstCardCategoria.each(function(index, element){

  if($(this).hasClass("primeraCardCategoria")){
    $(this).removeClass("primeraCardCategoria");
    $(this).removeClass("card_carrusel_para_categorias_selected");

    selectedIndex = index;
    
  }
}); 

resultFirstCardCategoria .eq(selectedIndex-1)
.addClass("card_carrusel_para_categorias_selected")
resultFirstCardCategoria 
.eq(selectedIndex-1).addClass("primeraCardCategoria")

//se agrega funcionalidades de active a los dots segun el arrow seleccionado
$('#'+carouselId+' .owl-nav .owl-dots button').eq(selectedIndex).removeClass('active');
$('#'+carouselId+' .owl-nav .owl-dots button').eq(selectedIndex-1).addClass('active');


$('#'+carouselId+' .owl-nav .owl-dots button').each(function(index, element){  
  if($(this).hasClass("active")){
    if(index === 0){
      resultNextButtonCategoria.removeClass("disabled");
      resultNextButtonCategoria.removeAttr('disabled');
      resultNextButtonCategoria.css("pointer-events", "auto"); 
      resultPrevButtonCategoria.addClass("disabled");
      resultPrevButtonCategoria.attr('disabled','disabled');
      resultPrevButtonCategoria.css("pointer-events", "none");
    }else if(index === resultFirstCardCategoria .length -1){
      resultPrevButtonCategoria.removeClass("disabled");
      resultPrevButtonCategoria.removeAttr('disabled');
      resultPrevButtonCategoria.css("pointer-events", "auto");
      
      resultNextButtonCategoria.addClass("disabled");
      resultNextButtonCategoria.attr('disabled','disabled');
      resultNextButtonCategoria.css("pointer-events", "none");
    }else{
      resultNextButtonCategoria.removeClass("disabled");
      resultNextButtonCategoria.removeAttr('disabled');
      resultPrevButtonCategoria.removeClass("disabled");
      resultPrevButtonCategoria.removeAttr('disabled');
      resultNextButtonCategoria.css("pointer-events", "auto");
      resultPrevButtonCategoria.css("pointer-events", "auto");
    }
  } 
}); 

});

//se agregan la sombra a la card seleccionada segun los arrows next 
$('.s-c-carrusel-para-categorias .subcontainer_carrusel_para_categorías .owl-nav .owl-next').click(function(index){

  const carouselId = $(this).attr("data-owl-carousel-id");


  const resultFirstCardCategoria = $(firstCardCategoriaStr.replace('{carouselId}', carouselId));
  const resultPrevButtonCategoria = $(buttonPrevCategoriaStr.replace('{carouselId}', carouselId));
  const resultNextButtonCategoria = $(buttonNextCategoriaStr.replace('{carouselId}', carouselId));

//$('.card_carrusel_banner_principal').removeAttr("style");
//heightCardCarruselCategorias(".owl-carousel-para-categorias");
let selectedIndex;

resultFirstCardCategoria.
each(function(index, element){
  if($(this).hasClass("primeraCardCategoria")){
    $(this).removeClass("primeraCardCategoria");
    $(this).removeClass("card_carrusel_para_categorias_selected");

    selectedIndex = index;
   
  }
});
  
//se agrega la sombra a la card seleccionada segun el next
resultFirstCardCategoria
.eq(selectedIndex+1).addClass("card_carrusel_para_categorias_selected")
resultFirstCardCategoria
.eq(selectedIndex+1).addClass("primeraCardCategoria")


//// se agrega funcionalidades  a los dots segun el arrow seleccionado
$('#'+carouselId+' .owl-nav .owl-dots button').eq(selectedIndex).removeClass('active');
$('#'+carouselId+' .owl-nav .owl-dots button').eq(selectedIndex+1).addClass('active');


$('#'+carouselId+' .owl-nav .owl-dots button').each(function(index, element){  
  if($(this).hasClass("active")){
    if(index === 0){
      resultNextButtonCategoria.removeClass("disabled");
      resultNextButtonCategoria.removeAttr('disabled');
      resultNextButtonCategoria.css("pointer-events", "auto");
      resultPrevButtonCategoria.addClass("disabled");
      resultPrevButtonCategoria.attr('disabled','disabled');
      resultPrevButtonCategoria.css("pointer-events", "none");
    }else if(index === resultFirstCardCategoria .length -1){
      resultPrevButtonCategoria.removeClass("disabled");
      resultPrevButtonCategoria.removeAttr('disabled');
      resultPrevButtonCategoria.css("pointer-events", "auto");   
      resultNextButtonCategoria.addClass("disabled");
      resultNextButtonCategoria.attr('disabled','disabled');
      resultNextButtonCategoria.css("pointer-events", "none");
    }else{
      resultNextButtonCategoria.removeClass("disabled");
      resultNextButtonCategoria.removeAttr('disabled');
      resultPrevButtonCategoria.removeClass("disabled");
      resultPrevButtonCategoria.removeAttr('disabled');
      resultNextButtonCategoria.css("pointer-events", "auto");
      resultPrevButtonCategoria.css("pointer-events", "auto");
    }
  } 
}); 









/*
if(selectedIndex+1 === $('.owl-carousel-para-categorias .owl-stage-outer .owl-item .item .card_carrusel_para_categorias').length-1){
  $('.owl-carousel-para-categorias .owl-nav .owl-next').addClass("disabled");
  $('.owl-carousel-para-categorias .owl-nav .owl-next').css("pointer-events", "none");
  $('.owl-carousel-para-categorias .owl-nav .owl-next').attr('disabled','disabled');
}
if($('.owl-carousel-para-categorias .owl-nav .owl-prev').hasClass("disabled")){
  $('.owl-carousel-para-categorias .owl-nav .owl-prev').removeClass("disabled");
  $('.owl-carousel-para-categorias .owl-nav .owl-prev').removeAttr('disabled');
  $('.owl-carousel-para-categorias .owl-nav .owl-prev').css("pointer-events", "auto");
}
*/



});



//heightCardCarruselCategorias(".owl-carousel-para-categorias");








  /**************************************Banner_tabs_background_color***************************** */
  
  $(".s-js-banner__tab .s-o-tabs__toggle").click(function () {
    let colorBg = "#FFF";
    if ($(this).parent(".s-o-tabs__li").find("section").length > 0) {
      colorBg = $(this).parents("li").find("section").css("background-color");
      $(this).parents(".s-js-banner__tab").css("background-color", "#FFF");
    } else {
      let contentId = "#" + $(this).attr("id") + "-content";
      colorBg = $(contentId).find("section").css("background-color");
      $(this).parents(".s-js-banner__tab").css("background-color", colorBg);
    }
  });
  /*******************************************************************************************/

  // <!-- Inicio Component HU-005-1 Contenido Tab-1  -->
  // menú cards
  $(".menu-toggle-label").on("click", function () {
    if ($(this).next().hasClass("d-block")) {
      $(this).next().removeClass("d-block");
    } else {
      $(this).next().addClass("d-block");
    }
  });
  $(".menu-toggle-label").on("keypress", function () {
    if ($(this).next().hasClass("d-block")) {
      $(this).next().removeClass("d-block");
    } else {
      $(this).next().addClass("d-block");
    }
  });

  function limitCharacter(selector, limite) {
    selector.each(function (index, label) {
      var txtLenght = $(label).text().length;
      if (txtLenght > limite) {
        $(label).text($(label).text().slice(0, limite));
      }
    });
  }

  limitCharacter(
    $(
      ".s-c-contenido_tab1 .s-o-contenido_tab1_accordion .accordion-content p.s-c-contenido_tab1__title"
    ),
    40
  );
  limitCharacter(
    $(
      ".s-c-contenido_tab1 .s-o-contenido_tab1_accordion .accordion-content .accordion-custom.contenido p"
    ),
    240
  );
  limitCharacter($(".s-c-stepper-container .s-c-stepper-title"), 70);
  limitCharacter(
    $(
      ".s-c-stepper-container .s-c-stepper-header .s-c-stepper-step .s-c-step-text"
    ),
    10
  );
  limitCharacter(
    $(
      ".s-c-accordion-container .s-c-accordion-item .s-c-accordion-title .s-c-accordion-title-text"
    ),
    70
  );
  //  <!-- Fin Component HU-005-1 Contenido Tab-1  -->

  // Altura Titulos Prefooter
  function addMinHeightHeadingFooter() {
    $(".s-c-prefooter .s-c-prefooter__item .s-o-dropdown__toggle").each(
      function () {
        $(this)
          .find(".s-o-dropdown__heading")
          .addClass("s-is-dropdown__heading--variant");
      }
    );
  }
  if (resolutionActual >= 1025 && resolutionActual <= 1919) {
    $(".s-c-prefooter .s-c-prefooter__item .s-o-dropdown__toggle").each(
      function () {
        var headPrefooter = $(this).find(".s-o-dropdown__heading").height();
        if (headPrefooter > 31) {
          addMinHeightHeadingFooter();
        }
      }
    );
  }

  $(".s-c-tab-banner").suraTabBanner();
  $(".s-c-banner-slider_cards").bannerCardSlider();
  $(".s-c-overlapped-cards").overlappedCards();
  $(".s-c-animated-text-banner").animatedTextBanner();
  $(".s-c-button-dropdown-hover").buttonDropdownHover();

  $(".s-c-carrusel_action_img").owlCarousel({
    loop: false,
    nav: true,
    margin: 16,
    dots: false,
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    responsive: {
      0: {
        items: 2,
        margin: 16,
      },
      360: {
        items: 2,
        margin: 16,
      },
      500: {
        items: 2,
        margin: 16,
      },
      767: {
        items: 3,
        margin: 16,
      },
      1025: {
        items: 2,
        margin: 24,
        mouseDrag: false,
      },
      1919: {
        items: 2,
        margin: 24,
        mouseDrag: false,
        //autoWidth: true,
      },
      
    },
    onInitialized: function (event) {
      let element = jQuery(event.target);
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
    },

    onTranslated:function(event){

      //$(".s-c-carrusel_action_img .owl-item").css('margin-right', '0');
      //$(".s-c-carrusel_action_img .owl-item").css('margin-left', '0');
      //$(".s-c-carrusel_action_img .owl-item.active").css('margin-right', '23px');
      //$(".s-c-carrusel_action_img .owl-item.active").first().css('margin-left', '24px');
    

    }
    
  });


  $('.s-c-carrusel-contenido-tab').each(function(index) {
    var $this = $(this);
    var uniqueId = 'carousel-' + index;
    $this.attr('id', uniqueId);
    // Contar los elementos .item dentro del carrusel
    var itemCount = $('#' + uniqueId + ' .owl-item .item').length;
    //console.log(itemCount);
    // Verificar si hay menos de 4 elementos
    if (itemCount < 5) {
      if(resolutionActual>1024 && resolutionActual <1899){
        // Aplicar estilo a todos los elementos .owl-item del carrusel
      $('#' + uniqueId + ' .owl-item').addClass('few-items');

      }
      
    }
    if (itemCount < 5) {
      if(resolutionActual>1900){
        // Aplicar estilo a todos los elementos .owl-item del carrusel
      $('#' + uniqueId + ' .owl-item').addClass('few-itemsBig');

      }
      
    }
  });



  //inicializamos el carrusel cada vez que damos click a las tab para que reconozca los
  $('.s-c-contenido_tab1').find('.accordion-item').on('click', function(){
    //console.log("iniciando otra vez el carrusel")

    $(".s-c-carrusel_action_img").owlCarousel("destroy");
    //$(".s-c-carrusel_action_img").find(".owl-stage").removeAttr("style");

    $(".s-c-carrusel_action_img").owlCarousel({
      loop: false,
      nav: true,
      margin: 16,
      dots: false,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
      ],
      responsive: {
        0: {
          items: 2,
          margin: 16,
        },
        360: {
          items: 2,
          margin: 16,
        },
        500: {
          items: 2,
          margin: 16,
        },
        767: {
          items: 3,
          margin: 16,
        },
        1025: {
          items: 2,
          margin: 24,
          mouseDrag: false,
        },
        1919: {
          items: 2,
          margin: 28,
          mouseDrag: false,
        },
        
      },
      onInitialized: function (event) {
        let element = jQuery(event.target);
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      },
  
      onTranslated:function(event){
  
        //$(".s-c-carrusel_action_img .owl-item").css('margin-right', '0');
        //$(".s-c-carrusel_action_img .owl-item").css('margin-left', '0');
        //$(".s-c-carrusel_action_img .owl-item.active").css('margin-right', '23px');
        //$(".s-c-carrusel_action_img .owl-item.active").first().css('margin-left', '24px');
      
  
      }
      
    });

    //console.log(resolutionActual);

    $('.s-c-carrusel-contenido-tab').each(function(index) {
      var $this = $(this);
      var uniqueId = 'carousel-' + index;
      $this.attr('id', uniqueId);
      // Contar los elementos .item dentro del carrusel
      var itemCount = $('#' + uniqueId + ' .owl-item .item').length;
      // Verificar si hay menos de 4 elementos
      if (itemCount < 5) {
        if(resolutionActual>1024 && resolutionActual <1899){
          // Aplicar estilo a todos los elementos .owl-item del carrusel
        $('#' + uniqueId + ' .owl-item').addClass('few-items');
  
        }
        
      }
      if (itemCount < 5) {
        if(resolutionActual>1900){
          // Aplicar estilo a todos los elementos .owl-item del carrusel
        $('#' + uniqueId + ' .owl-item').addClass('few-itemsBig');
  
        }
        
      }
    });
  


  });





  $(".s-c-card-tag-img-item-carrusel").owlCarousel({
    loop: false,
    nav: true,
    margin: 16,
    dots: false,
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      360: {
        items: 1,
        margin: 0,
        stagePadding: 40,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-left": "40px" });
              } else if (indexItem == lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
      },
      500: {
        items: 1,
        margin: 0,
        stagePadding: 40,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-left": "40px" });
              } else if (indexItem == lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
      },
      767: {
        items: 2,
      },
      1025: {
        items: 3,
        margin: 24,
        mouseDrag: false,
        nav: true
      },
    },
    onInitialized: function (event) {
      let element = jQuery(event.target);
      if (element.find(".owl-stage .owl-item").length <= 3) {
        element.find(".owl-nav").css("display", "none"); 
      } else {
        element.find(".owl-nav").show(); 
      }
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
    },
    
  });
  $(".s-c-card-tag-img-item-carrusel-ADT").owlCarousel({
    loop: false,
    nav: true,
    dots: false,
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      390: {
        items: 1,
        margin: 0,
        stagePadding: 40,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-left": "40px" });
              } else if (indexItem == lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
      },
      767: {
        items: 2,
      },
      1025: {
        items: 3,
        margin: 24,
        mouseDrag: false,
      },
    },
    // onInitialized: function (event) {
    //   let element = jQuery(event.target);
    //   element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
    //   element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
    // },

    onInitialized: function (event) {
      let element = jQuery(event.target);
      if (element.find(".owl-stage .owl-item").length <= 3) {
        element.find(".owl-nav").css("display", "none"); 
      } else {
        element.find(".owl-nav").show(); 
      }
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
    },
  });

  $(".s-c-card-doc-hover-carrusel").each(function () {
    var idCarousel = $(this)
      .find(".s-c-card-doc-hover-button-carrusel")
      .attr("id");
    var itemCarousel = $(this).find(
      ".s-c-card-doc-hover-button-carrusel .item"
    ).length;
    if (itemCarousel > 4) {
      $("#" + idCarousel).owlCarousel({
        loop: false,
        nav: true,
        margin: 16,
        dots: true,
        rewind: false,
        autoplay: false,
        responsiveClass: true,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        responsive: {
          0: {
            items: 1,
            dots: false,
            nav: true,
            margin: 24,
            stagePadding: 60,
          },
          360: {
            items: 1,
            dots: false,
            nav: true,
            margin: 24,
            stagePadding: 60,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-left": "60px" });
              } else if (indexItem == lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
          767: {
            items: 2,
            nav: true,
            dots: false,
            margin: 16,
            stagePadding: 60,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 2) {
                element.find(".owl-stage").css({ "padding-left": "60px" });
              } else if (indexItem == lenghtItem - 2) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
          1025: {
            items: 3,
            slideBy: 4,
            margin: 12,
            mouseDrag: false,
            nav: true,
            dots: true,
            stagePadding: 80,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              let nav = element.find(".owl-nav");
              let dots = element.find(".owl-dots");
              dots.appendTo(nav);
              let buttonPrev = element.find(".owl-nav button.owl-next");
              dots.after(buttonPrev);
              $(".custom-owl-dots button").appendTo(dots);
              $(".custom-owl-dots").remove();
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              if (indexItem >= 1) {
                element.find(".owl-stage").css({ "padding-left": "160px" });
                element.find(".owl-stage").css({ "padding-right": "0px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
          1920: {
            items: 4,
            slideBy: 4,
            margin: 12,
            mouseDrag: false,
            nav: true,
            dots: true,
            stagePadding: 20,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              let nav = element.find(".owl-nav");
              let dots = element.find(".owl-dots");
              dots.appendTo(nav);
              let buttonPrev = element.find(".owl-nav button.owl-next");
              dots.after(buttonPrev);
              $(".custom-owl-dots button").appendTo(dots);
              $(".custom-owl-dots").remove();
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              if (indexItem >= 1) {
                element.find(".owl-stage").css({ "padding-left": "40px" });
                element.find(".owl-stage").css({ "padding-right": "0px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
        },
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
          element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
          element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
          element
            .find(".owl-dots .owl-dot span")
            .addClass("s-o-controller__span");
        },
      });
    } else {
      $("#" + idCarousel).owlCarousel({
        loop: false,
        nav: false,
        margin: 16,
        dots: false,
        responsiveClass: true,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        responsive: {
          0: {
            items: 1,
            dots: false,
            nav: true,
            margin: 24,
            stagePadding: 60,
          },
          360: {
            items: 1,
            dots: false,
            nav: true,
            margin: 24,
            stagePadding: 60,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-left": "60px" });
              } else if (indexItem == lenghtItem - 1) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
          767: {
            items: 2,
            nav: true,
            dots: false,
            margin: 16,
            stagePadding: 60,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element
                .find(".owl-dots .owl-dot")
                .addClass("s-o-controller__dots");
              element
                .find(".owl-dots .owl-dot span")
                .addClass("s-o-controller__span");
              element
                .find(".owl-nav .owl-prev")
                .addClass("s-o-controller__nav");
              element
                .find(".owl-nav .owl-next")
                .addClass("s-o-controller__nav");
              element.find(".owl-stage").css({ "padding-left": "0px" });
            },
            onTranslate: function (event) {
              let element = jQuery(event.target);
              let indexItem = event.item.index;
              let lenghtItem = event.item.count;
              if (indexItem >= 1 && indexItem != lenghtItem - 2) {
                element.find(".owl-stage").css({ "padding-left": "60px" });
              } else if (indexItem == lenghtItem - 2) {
                element.find(".owl-stage").css({ "padding-right": "0px" });
                element.find(".owl-stage").css({ "padding-left": "120px" });
              } else if (indexItem == 0) {
                element.find(".owl-stage").css({ "padding-left": "0px" });
              }
            },
          },
          1025: {
            items: 4,
            margin: 12,
            mouseDrag: false,
            nav: false,
            dots: false,
          },
          1920: {
            items: 4,
            margin: 12,
            mouseDrag: false,
            nav: false,
            dots: false,
          },
        },
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav").css("display", "none");
        },
      });
    }
  });

  function heightCardCarruselImg(selector) {
    $(selector).each(function () {
      var carrusel = $(this);
      var altoMax = 0;
      carrusel.find(".item .s-c-tab_videobutton_card").each(function () {
        if ($(this).outerHeight(false) > altoMax) {
          altoMax = $(this).outerHeight(false);
        }
      });

      carrusel.find(".item .s-c-tab_videobutton_card").each(function () {
        $(this).css("height", altoMax);
      });
    });
  }
  heightCardCarruselImg(".s-c-carrusel_action_img");


    function heightCardCarruselHover(selector) {
        $(selector).each(function () {
            var carrusel = $(this);
            var cards = carrusel.find(".item");
            var maxHeight = 0;

            cards.each(function () {
                var card = $(this);
                var buttonContainer = card.find(".s-c-card-doc-hover-button-contenedor");

                if (buttonContainer.length > 0) {
                    var buttonHeight = buttonContainer.outerHeight(false);

                    if (buttonHeight > maxHeight) {
                        maxHeight = buttonHeight;
                    }
                }
            });

            cards.each(function () {
                var card = $(this);
                var buttonContainer = card.find(".s-c-card-doc-hover-button-contenedor");

                if (buttonContainer.length > 0) {
                    buttonContainer.css("min-height", maxHeight);
                    card.addClass(".boton-doc-hover");
                }
            });
        });
    }

    $('.s-c-card-doc-hover-button').each(function(){

    var maxSizeButtonCard = 0;

    $(this).find('.s-c-card-doc-hover-button-contenedor').each(function() {

        $(this).mouseenter(function () {

            if($(this).find(".boton-doc-hover").length > 0){

                $(this).css("height", "auto"); // Restablece la altura

            }

        });

    });



 

    // Esta función se ejecutará cuando el mouse salga de una tarjeta

    // Inicializa el carrusel
    $("#s-js-owlControllerNav").owlCarousel({
      // Tu configuración del carrusel aquí
    });

    // Calcula las alturas inicialmente
    heightCardCarruselHover(".s-c-card-doc-hover-button-carrusel");
  });

  /**HU-80*/
  $(".s-c-carrusel-btn_search").owlCarousel({
    loop: false,
    nav: false,
    dots: false,
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    responsive: {
      0: {
        nav: false,
        items: 4,
      },
      1025: {
        items: 4,
        // autoWidth:true,
        margin: 16,
        stagePadding: 16,
      },
    },
  });
  /* Eliminando tab index dropdown desktop */
  function addTabIndexDropDesktop() {
    $(".s-o-dropdown__toggle").each(function () {
      if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
        $(this).attr("tabindex", -1);
      }
    });
  }

  function removeTabIndexDropDesktop() {
    $(".s-o-dropdown__toggle").each(function () {
      if ($(this).hasClass("s-js-dropdowns--not-desktop")) {
        $(this).removeAttr("tabindex");
      }
    });
  }
  if (resolutionActual >= 1025) {
    addTabIndexDropDesktop();
  }

  $(window).resize(function () {
    if (resolutionActual >= 1025) {
      addTabIndexDropDesktop();
    } else {
      removeTabIndexDropDesktop();
    }
  });
  /**************Dropdown HU-48**************/
  const dropdownToggle = $(".search-dropdown");
  const firstDropdownToggle = $(".search-dropdown").first();
  firstDropdownToggle.trigger("click");

  dropdownToggle.click(function (event) {
    event.preventDefault();
    var dropdownContent = $(this).next();
    var icon = $(this).find(".s-iconDirectionDown, .s-iconDirectionUp");
    $(".search-dropdown_content").not(dropdownContent).hide();
    $(".s-iconDirectionUp")
      .not(icon)
      .removeClass("s-iconDirectionUp")
      .addClass("s-iconDirectionDown");
    if (dropdownContent.is(":visible")) {
      dropdownContent.hide();
      icon.removeClass("s-iconDirectionUp").addClass("s-iconDirectionDown");
    } else {
      dropdownContent.show();
      icon.removeClass("s-iconDirectionDown").addClass("s-iconDirectionUp");
    }
    dropdownContent.toggle();
    icon.toggleClass("s-iconDirectionDown s-iconDirectionUp");
  });

  // --------------------------HU 022-----------------------------

  // DESKTOP

  // Función para asignar IDs dinámicos
  function asignarIDs() {
    $(".s-c-cards_vertical__cards").each(function (index) {
      const cardType = $(this).hasClass("s-o-cards_vertical_card-superior")
        ? "superior"
        : "inferior";
      const newID = `cardVertical-${cardType}-${index + 1}`;
      $(this).attr("id", newID);
    });
  }

  asignarIDs();
  if (resolutionActual >= 1025) {
    $(".s-c-cards_vertical__cards").hover(
      function () {
        const cardType = $(this).hasClass("s-o-cards_vertical_card-superior")
          ? "superior"
          : "inferior";
        const $correspondingCards = $(
          `.s-c-cards_vertical__cards.${
            cardType === "superior"
              ? "s-o-cards_vertical_card-inferior"
              : "s-o-cards_vertical_card-superior"
          }`
        );

        // Agregar clase "expanded" a la tarjeta actual
        $(this).addClass("expanded");

        // Quitar clase "expanded" de las tarjetas correspondientes
        $correspondingCards.removeClass("expanded");

        if ($(this).hasClass("s-o-cards_vertical_card-superior")) {
          $(this).next().addClass("contraida");
        } else if ($(this).hasClass("s-o-cards_vertical_card-inferior")) {
          $(this).prev().addClass("contraida");
        }
      },
      function () {
        // Quitar clase "expanded" y "contraida" al salir del hover
        $(this).removeClass("expanded");
        $(".s-c-cards_vertical__cards").removeClass("contraida");
      }
    );
  }

  // MOBILE
  if (resolutionActual < 1024) {
    $(".s-c-cards_vertical").each(function () {
      $(this)
        .find(".d-flex")
        .children()
        .each(function (index) {
          if (index == 0) {
            $(this).addClass("expanded");
          } else {
            $(this).addClass("contraida");
          }
        });
    });
    $(".s-c-cards_vertical__cards").click(function () {
      // Agregar clase "expanded" a la tarjeta actual
      $(this).addClass("expanded");
      if ($(this).hasClass("contraida")) {
        $(this).removeClass("contraida");
      }

      if ($(this).hasClass("s-o-cards_vertical_card-superior")) {
        $(this).next().addClass("contraida");
        if ($(this).next().hasClass("expanded")) {
          $(this).next().removeClass("expanded");
        }
      } else if ($(this).hasClass("s-o-cards_vertical_card-inferior")) {
        $(this).prev().addClass("contraida");
        if ($(this).prev().hasClass("expanded")) {
          $(this).prev().removeClass("expanded");
        }
      }
    });
  }

  // --------------------------HU 068-----------------------------

  const cardContainerButtonHover = $("#s-c-card-hover");
  const expandCardContainerButtonHover = $("#expand-button-card-hover");
  const cardHoverButtonElement = document.querySelector(".s-o-card-hover-boton__card-button");

  expandCardContainerButtonHover.on("click", function () {
    toggleCardState();
  });


if (cardHoverButtonElement) {

  cardContainerButtonHover.on("mouseenter", function () {
    cardContainerButtonHover.addClass("expanded");
    cardContainerButtonHover.css({
      // boxShadow: "0px 8px 25px 0px rgba(0, 0, 0, 0.07)",
      padding: "16px",
    });
    expandCardContainerButtonHover.text("Contraer");
  });
  cardContainerButtonHover.on("mouseleave", function () {
    cardContainerButtonHover.removeClass("expanded");
    cardContainerButtonHover.css({
      // boxShadow: "none",
      padding: "16px 16px 46px 16px",
    });
    expandCardContainerButtonHover.text("Expandir");
  });
} else {
  cardContainerButtonHover.css({
    // boxShadow: "none",
    padding: "16px 16px 46px 16px",
  });
}



  // ---- HU 015 ----
  function resetCarousel(carousel) {
    carousel
      .find(
        ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
      )
      .children()
      .each(function (index) {
        $(this).removeAttr("style");
        $(this).find(".s-c-card-solapa-v__card").removeAttr("style");
        if (
          $(this)
            .find(
              ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
            )
            .attr("tabindex")
        ) {
          $(this)
            .find(
              ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
            )
            .removeAttr("tabindex");
        }
        if (index == 0) {
          $(this).addClass("s-js-view");
          if (resolutionActual >= 1025) {
            $(this)
              .find(
                ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
              )
              .attr("tabindex", "0");
          }
        } else {
          if ($(this).hasClass("s-is-card-solapa-v__carousel-item--absolute")) {
            $(this).removeClass("s-is-card-solapa-v__carousel-item--absolute");
          }
          if (
            $(this)
              .find(
                ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
              )
              .attr("tabindex")
          ) {
            $(this)
              .find(
                ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
              )
              .removeAttr("tabindex");
          }
          $(this).addClass("s-js-hidden");
        }
      });
    carousel.find(".s-c-card-solapa-v__carousel-content").removeAttr("style");
    carousel.find(".s-c-card-solapa-v__carousel").removeAttr("style");
  }
  function removeActiveDots(carousel) {
    carousel.each(function () {
      $(this)
        .find(
          ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
        )
        .each(function () {
          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
          }
        });
    });
  }
  function searchParent(card) {
    var idCarousel;
    card.parents().each(function () {
      if ($(this).hasClass("s-c-card-solapa-v")) {
        idCarousel = $(this);
      }
    });
    return idCarousel;
  }
  function animateCard(card) {
    anime({
      targets: card,
      translateY: 50,
      direction: "reverse",
      easing: "linear",
    });
  }
  function returnLength(carousel) {
    let lengthCarousel = carousel
      .find(
        ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
      )
      .children().length;
    return lengthCarousel;
  }
  function returnFirstCard(carousel) {
    let first = carousel
      .find(
        ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
      )
      .children()
      .first();
    return first;
  }
  var sumTopCard = 24;
  //Mobile
  function nextCard(id, carousel) {
    let firstCard = returnFirstCard(carousel);
    var cardRef = carousel.find(
      ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container .s-c-card-solapa-v__carousel-item:nth-child(" +
        id +
        ")"
    );
    var widthCardSolapa = $(cardRef)
      .find(".s-c-card-solapa-v__card")
      .outerWidth();
    let cardNextId = $(cardRef).next().attr("id");
    $(cardRef).next().removeClass("s-js-hidden");
    $(cardRef).next().addClass("s-js-view ");
    $(cardRef).next().addClass("s-is-card-solapa-v__carousel-item--absolute");
    $(cardRef).removeClass("s-js-view");
    $(cardRef).width("100%");
    $(cardRef).next().height("100%");
    if (id == 1) {
      $(cardRef).next().css({ top: 10 });
      widthCardSolapa = widthCardSolapa - 14;
      $(cardRef).find(".s-c-card-solapa-v__card").outerWidth(widthCardSolapa);
    } else {
      $(cardRef).next().css({ top: 20 });
      widthCardSolapa = widthCardSolapa - 14;
      $(cardRef).find(".s-c-card-solapa-v__card").outerWidth(widthCardSolapa);
      $(cardRef).css({ top: 10 });
      widthCardSolapa = widthCardSolapa - 28;
      $(firstCard).find(".s-c-card-solapa-v__card").outerWidth(widthCardSolapa);
    }
    animateCard("#" + cardNextId + " .s-c-card-solapa-v__card");
  }
  function removeCard(id, carousel) {
    var cardRef = carousel.find(
      ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container .s-c-card-solapa-v__carousel-item:nth-child(" +
        id +
        ")"
    );
    let cardPrevId = $(cardRef).prev().attr("id");
    $(cardRef).removeClass("s-is-card-solapa-v__carousel-item--absolute");
    $(cardRef).removeClass("s-js-view");
    $(cardRef).addClass("s-js-hidden");
    $(cardRef).removeAttr("style");
    $(cardRef).prev().find(".s-c-card-solapa-v__card").removeAttr("style");
    animateCard("#" + cardPrevId + " .s-c-card-solapa-v__card");
  }
  $(
    ".s-c-card-solapa-v .s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__nav"
  ).click(function () {
    let idCarousel = searchParent($(this));
    let firstCard = returnFirstCard(idCarousel);
    if ($(this).hasClass("s-is-card-solapa-v__carousel--next")) {
      if ($(firstCard).next().hasClass("s-js-hidden")) {
        nextCard(1, idCarousel);
        idCarousel.find(".s-c-card-solapa-v__carousel").css({ gap: "27px" });
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__nav.s-is-card-solapa-v__carousel--prev"
          )
          .removeClass("disabled");
      } else if (
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container .s-c-card-solapa-v__carousel-item:nth-child(2)"
          )
          .hasClass("s-is-card-solapa-v__carousel-item--absolute")
      ) {
        nextCard(2, idCarousel);
        idCarousel.find(".s-c-card-solapa-v__carousel").css({ gap: "37px" });
        $(this).addClass("disabled");
        $(this).attr("disabled", "true");
      }
    } else if ($(this).hasClass("s-is-card-solapa-v__carousel--prev")) {
      if (
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
          )
          .children()
          .last()
          .hasClass("s-js-view")
      ) {
        removeCard(3, idCarousel);
        idCarousel.find(".s-c-card-solapa-v__carousel").css({ gap: "27px" });
        $(this).next().removeClass("disabled");
        $(this).next().removeAttr("disabled");
      } else if (
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container .s-c-card-solapa-v__carousel-item:nth-child(2)"
          )
          .hasClass("s-is-card-solapa-v__carousel-item--absolute")
      ) {
        removeCard(2, idCarousel);
        idCarousel.find(".s-c-card-solapa-v__carousel").removeAttr("style");
        $(this).addClass("disabled");
        $(this).next().removeAttr("disabled");
      }
    }
  });
  //Desktop
  function nextItemCard(idCard, id, carousel) {
    let idCarousel = searchParent(carousel);
    let firstCard = returnFirstCard(idCarousel);
    let idNextcard = $("#" + idCard)
      .next()
      .attr("id");
    removeActiveDots(idCarousel);
    if ($("#" + idCard).hasClass("s-js-hidden")) {
      $("#" + idCard).removeClass("s-js-hidden");
      $("#" + idCard).addClass("s-js-view ");
      $("#" + idCard)
        .prev()
        .removeClass("s-js-view");
    }
    if (
      !$("#" + idCard)
        .next()
        .hasClass("s-is-card-solapa-v__carousel-item--absolute")
    ) {
      $("#" + idCard)
        .next()
        .addClass("s-is-card-solapa-v__carousel-item--absolute");
      $("#" + idCard)
        .next()
        .removeClass("s-js-hidden");
    }
    if ($("#" + idCard).hasClass("s-js-view")) {
      $("#" + idCard).removeClass("s-js-view");
    }

    $("#" + idCard)
      .find(".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt")
      .removeAttr("tabindex");
    $("#" + idCard)
      .find(".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn")
      .attr("tabindex", "-1");
    $("#" + idCard)
      .next()
      .find(".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt")
      .attr("tabindex", "0");
    if (id == 0) {
      animateCard("#" + idNextcard + " .s-c-card-solapa-v__card");
      $("#" + idCard)
        .next()
        .css({ top: 24 });

      if (resolutionActual >= 1025 && resolutionActual < 1920) {
        $("#" + idCard)
          .find(".s-c-card-solapa-v__card")
          .outerWidth(600);
      } else if (resolutionActual >= 1920) {
        $("#" + idCard)
          .find(".s-c-card-solapa-v__card")
          .outerWidth("90%");
        $("#" + idCard)
          .next()
          .outerHeight("100%");
      }
      var heightCardSolapada = $("#" + idCard)
        .find(".s-c-card-solapa-v__card")
        .outerHeight();
      idCarousel
        .find(".s-c-card-solapa-v__carousel-content")
        .css({ height: heightCardSolapada + 24 });
    } else if (id == 1) {
      animateCard("#" + idNextcard + " .s-c-card-solapa-v__card");
      $("#" + idCard).css({ top: 24 });
      $("#" + idCard).outerWidth("100%");
      $("#" + idCard)
        .next()
        .css({ top: 48 });
      if (resolutionActual >= 1025 && resolutionActual < 1920) {
        firstCard.find(".s-c-card-solapa-v__card").outerWidth(552);
        $("#" + idCard)
          .find(".s-c-card-solapa-v__card")
          .outerWidth(600);
      } else if (resolutionActual >= 1920) {
        firstCard.find(".s-c-card-solapa-v__card").outerWidth("80%");
        $("#" + idCard)
          .find(".s-c-card-solapa-v__card")
          .outerWidth("90%");
        $("#" + idCard)
          .next()
          .outerHeight("100%");
      }
      var heightCardSolapada = $("#" + idCard)
        .find(".s-c-card-solapa-v__card")
        .outerHeight();
      idCarousel
        .find(".s-c-card-solapa-v__carousel-content")
        .css({ height: heightCardSolapada + 48 });
    }
  }
  $(
    ".s-c-card-solapa-v .s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
  ).click(function () {
    var idCarousel = searchParent($(this));
    var lengthCards = returnLength(idCarousel);
    if (!$(this).hasClass("active")) {
      var idCard = "#" + $(this).attr("id") + "-card";
      var indexCard = $(idCard).index();
      var sumWidthCard = indexCard * 48;
      var sumWidthCardXL = indexCard * 10;
      if (indexCard == 0) {
        resetCarousel(idCarousel);
        removeActiveDots(idCarousel);
        sumTopCard = 24;
      } else {
        removeActiveDots(idCarousel);
        if ($(idCard).hasClass("s-js-hidden")) {
          $(idCard).removeClass("s-js-hidden");
          $(idCard).addClass("s-js-view ");
          $(idCard).prev().removeClass("s-js-view");
        }
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
          )
          .children()
          .each(function (index, val) {
            var widthCardSolapa = $(this)
              .find(".s-c-card-solapa-v__card")
              .outerWidth();
            if (index > 0 && index <= indexCard) {
              $(this).css({ top: sumTopCard });
              if (
                !$(this).hasClass("s-is-card-solapa-v__carousel-item--absolute")
              ) {
                $(this).addClass("s-is-card-solapa-v__carousel-item--absolute");
              }
              $(this)
                .prev()
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                )
                .removeAttr("tabindex");
              $(this)
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                )
                .attr("tabindex", "0");
              $(this)
                .prev()
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                )
                .attr("tabindex", "-1");
              sumTopCard = sumTopCard + 24;
            }
            if (index < indexCard) {
              $(this).removeClass("s-js-hidden");
              $(this).removeClass("s-js-view");
              widthCardSolapa = 648 - sumWidthCard;
              if (resolutionActual >= 1025 && resolutionActual < 1920) {
                $(this)
                  .find(".s-c-card-solapa-v__card")
                  .outerWidth(widthCardSolapa);
                $(this).outerWidth(648);
              } else if (resolutionActual >= 1920) {
                widthCardSolapa = 100 - sumWidthCardXL;
                $(this)
                  .find(".s-c-card-solapa-v__card")
                  .outerWidth(widthCardSolapa + "%");
                $(this).outerWidth("100%");
              }
              var heightCardSolapada = $(this)
                .find(".s-c-card-solapa-v__card")
                .outerHeight();
              idCarousel
                .find(".s-c-card-solapa-v__carousel-content")
                .css({ height: heightCardSolapada + sumTopCard });
              sumWidthCard = sumWidthCard - 48;
              sumWidthCardXL = sumWidthCardXL - 10;
            }

            if (index > 0 && indexCard < lengthCards) {
              if (widthCardSolapa == 600 || widthCardSolapa == 824) {
                if (
                  $(this)
                    .next()
                    .hasClass("s-is-card-solapa-v__carousel-item--absolute")
                ) {
                  $(this).find(".s-c-card-solapa-v__card").removeAttr("style");
                  idCarousel
                    .find(".s-c-card-solapa-v__carousel-content")
                    .removeAttr("style");
                  var heightCardSolapada = $(this)
                    .find(".s-c-card-solapa-v__card")
                    .outerHeight();
                  idCarousel
                    .find(".s-c-card-solapa-v__carousel-content")
                    .css({ height: heightCardSolapada + 24 });
                  $(this).next().removeAttr("style");
                  $(this)
                    .next()
                    .removeClass(
                      "s-js-view s-is-card-solapa-v__carousel-item--absolute"
                    );

                  $(this)
                    .next()
                    .find(
                      ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                    )
                    .removeAttr("tabindex");
                  if (
                    $(this)
                      .find(
                        ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                      )
                      .attr("tabindex")
                  ) {
                    $(this)
                      .find(
                        ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                      )
                      .removeAttr("tabindex");
                  }
                  $(this).next().addClass("s-js-hidden");
                }
              }
            }
          });
      }

      animateCard(idCard + " .s-c-card-solapa-v__card");
      sumTopCard = 24;
      $(this).addClass("active");
    }
  });
  $(
    ".s-c-card-solapa-v .s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
  ).keypress(function () {
    var idCarousel = searchParent($(this));
    var lengthCards = returnLength(idCarousel);
    if (!$(this).hasClass("active")) {
      var idCard = "#" + $(this).attr("id") + "-card";
      var indexCard = $(idCard).index();
      var sumWidthCard = indexCard * 48;
      var sumWidthCardXL = indexCard * 10;
      if (indexCard == 0) {
        resetCarousel(idCarousel);
        removeActiveDots(idCarousel);
        sumTopCard = 24;
      } else {
        removeActiveDots(idCarousel);
        if ($(idCard).hasClass("s-js-hidden")) {
          $(idCard).removeClass("s-js-hidden");
          $(idCard).addClass("s-js-view ");
          $(idCard).prev().removeClass("s-js-view");
        }
        idCarousel
          .find(
            ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-container"
          )
          .children()
          .each(function (index, val) {
            var widthCardSolapa = $(this)
              .find(".s-c-card-solapa-v__card")
              .outerWidth();
            if (index > 0 && index <= indexCard) {
              $(this).css({ top: sumTopCard });
              if (
                !$(this).hasClass("s-is-card-solapa-v__carousel-item--absolute")
              ) {
                $(this).addClass("s-is-card-solapa-v__carousel-item--absolute");
              }
              $(this)
                .prev()
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                )
                .removeAttr("tabindex");
              $(this)
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                )
                .attr("tabindex", "0");
              $(this)
                .prev()
                .find(
                  ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                )
                .attr("tabindex", "-1");
              sumTopCard = sumTopCard + 24;
            }
            var heightCardSolapada = $(this)
              .find(".s-c-card-solapa-v__card")
              .outerHeight();
            if (index < indexCard) {
              $(this).removeClass("s-js-hidden");
              $(this).removeClass("s-js-view");
              widthCardSolapa = 648 - sumWidthCard;
              if (resolutionActual >= 1025 && resolutionActual < 1920) {
                $(this)
                  .find(".s-c-card-solapa-v__card")
                  .outerWidth(widthCardSolapa);
                $(this).outerWidth(648);
              } else if (resolutionActual >= 1920) {
                widthCardSolapa = 100 - sumWidthCardXL;
                $(this)
                  .find(".s-c-card-solapa-v__card")
                  .outerWidth(widthCardSolapa + "%");
                $(this).outerWidth("100%");
              }
              idCarousel
                .find(".s-c-card-solapa-v__carousel-content")
                .css({ height: heightCardSolapada + sumTopCard });
              sumWidthCard = sumWidthCard - 48;
              sumWidthCardXL = sumWidthCardXL - 10;
            }

            if (index > 0 && indexCard < lengthCards) {
              if (widthCardSolapa == 600 || widthCardSolapa == 824) {
                if (
                  $(this)
                    .next()
                    .hasClass("s-is-card-solapa-v__carousel-item--absolute")
                ) {
                  $(this).find(".s-c-card-solapa-v__card").removeAttr("style");
                  idCarousel
                    .find(".s-c-card-solapa-v__carousel-content")
                    .removeAttr("style");
                  var heightCardSolapada = $(this)
                    .find(".s-c-card-solapa-v__card")
                    .outerHeight();
                  idCarousel
                    .find(".s-c-card-solapa-v__carousel-content")
                    .css({ height: heightCardSolapada + 24 });
                  $(this).next().removeAttr("style");
                  $(this)
                    .next()
                    .removeClass(
                      "s-js-view s-is-card-solapa-v__carousel-item--absolute"
                    );

                  $(this)
                    .next()
                    .find(
                      ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
                    )
                    .removeAttr("tabindex");
                  if (
                    $(this)
                      .find(
                        ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                      )
                      .attr("tabindex")
                  ) {
                    $(this)
                      .find(
                        ".s-c-card-solapa-v__card .s-c-card-solapa-v__card__btn .s-o-btn"
                      )
                      .removeAttr("tabindex");
                  }
                  $(this).next().addClass("s-js-hidden");
                }
              }
            }
          });
      }

      animateCard(idCard + " .s-c-card-solapa-v__card");
      sumTopCard = 24;
      $(this).addClass("active");
    }
  });
  $(
    ".s-c-card-solapa-v .s-c-card-solapa-v__carousel .s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
  ).click(function () {
    if (resolutionActual >= 1025) {
      let cardParent = $(this).parents()[1];
      let index = $(cardParent).index();
      let idCard = cardParent.getAttribute("id");
      let idCarousel = searchParent($(this));
      let firstCard = returnFirstCard(idCarousel);
      switch (index) {
        case 0:
          nextItemCard(idCard, index, $(this));
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[1]
            .classList.add("active");
          break;
        case 1:
          nextItemCard(idCard, index, $(this));
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[2]
            .classList.add("active");
          break;
        case 2:
          removeActiveDots(idCarousel);
          resetCarousel(idCarousel);
          firstCard.removeAttr("style");
          firstCard.addClass("s-js-view");
          firstCard.find(".s-c-card-solapa-v__card").removeAttr("style");
          animateCard("#" + firstCard.attr("id") + " .s-c-card-solapa-v__card");
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[0]
            .classList.add("active");
          break;
        default:
          break;
      }
    }
  });
  $(
    ".s-c-card-solapa-v .s-c-card-solapa-v__carousel .s-c-card-solapa-v__card .s-c-card-solapa-v__card__content-txt"
  ).keypress(function () {
    if (resolutionActual >= 1025) {
      let cardParent = $(this).parents()[1];
      let index = $(cardParent).index();
      let idCard = cardParent.getAttribute("id");
      let idCarousel = searchParent($(this));
      let firstCard = returnFirstCard(idCarousel);
      switch (index) {
        case 0:
          nextItemCard(idCard, index, $(this));
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[1]
            .classList.add("active");
          break;
        case 1:
          nextItemCard(idCard, index, $(this));
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[2]
            .classList.add("active");
          break;
        case 2:
          removeActiveDots(idCarousel);
          resetCarousel(idCarousel);
          firstCard.removeAttr("style");
          firstCard.addClass("s-js-view");
          firstCard.find(".s-c-card-solapa-v__card").removeAttr("style");
          animateCard("#" + firstCard.attr("id") + " .s-c-card-solapa-v__card");
          idCarousel
            .find(
              ".s-c-card-solapa-v__carousel .s-c-card-solapa-v__carousel-controllers .s-o-controller__dots"
            )[0]
            .classList.add("active");
          break;
        default:
          break;
      }
    }
  });

  $(".s-c-card-solapa-v").each(function () {
    resetCarousel($(this));
  });

  animateCard(
    ".s-c-card-solapa-v__carousel-container .s-c-card-solapa-v__carousel-item:nth-child(1) .s-c-card-solapa-v__card"
  );
  $(window).resize(function () {
    if (resolutionInitial >= 1025 && resolutionActual < 1025) {
      $(".s-c-card-solapa-v").each(function () {
        resetCarousel($(this));
      });
    }
  });

  // ************** HU 34 *****************


  //accesibilidad navegacion por tab carrusel icono
//$('.s-c-carrusel-iconos').find('.item').attr("tabindex", "0");

$('.s-c-carrusel-iconos').find('.item').each(function() {
  if ($(this).find('a').attr('disabled')) {
      $(this).attr('tabindex', '0');
  }
});

$('.s-c-carrusel-iconos').find('.item').on("keyup", function(event) {
  if (event.which === 9) { // Comprueba si se presiona la tecla Tab
    $(this).addClass('hovered');
  }  
});

$('.s-c-carrusel-iconos').find('.item').on("focusout", function(){
  $(this).removeClass('hovered');
});

  function initCarousel() {
    if ($(window).width() < 1024) {
      $(".owl-carousel-iconos").owlCarousel({
        loop: false,
        margin: 24,
        nav: true,
        items: 6,
        dots: false,
        pagination: false,
        responsive: {
          0: {
            items: 2,
            stagePadding: 40,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element.find(".owl-stage").css({ paddingLeft: "0px" });
              element.find(".owl-stage").css({ paddingRight: "60px" });
            },
            onTranslated: function (event) {
              let element = jQuery(event.target);
              let carousenLenght = event.item.count;
              let index = event.item.index;
              if (index == 0) {
                element.find(".owl-stage").css({ paddingLeft: "0px" });
                element.find(".owl-stage").css({ paddingRight: "40px" });
              } else if (index == carousenLenght - 2) {
                element.find(".owl-stage").css({ paddingLeft: "60px" });
                element.find(".owl-stage").css({ paddingRight: "0px" });
              } else {
                element.find(".owl-stage").css({ paddingLeft: "20px" });
                element.find(".owl-stage").css({ paddingRight: "20px" });
              }
            },
          },
          600: {
            items: 2,
            stagePadding: 40,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element.find(".owl-stage").css({ paddingLeft: "0px" });
              element.find(".owl-stage").css({ paddingRight: "40px" });
            },
            onTranslated: function (event) {
              let element = jQuery(event.target);
              let carousenLenght = event.item.count;
              let index = event.item.index;
              if (index == 0) {
                element.find(".owl-stage").css({ paddingLeft: "0px" });
                element.find(".owl-stage").css({ paddingRight: "40px" });
              } else if (index == carousenLenght - 2) {
                element.find(".owl-stage").css({ paddingLeft: "60px" });
                element.find(".owl-stage").css({ paddingRight: "0px" });
              } else {
                element.find(".owl-stage").css({ paddingLeft: "20px" });
                element.find(".owl-stage").css({ paddingRight: "20px" });
              }
            },
          },

          768: {
            items: 3,
            stagePadding: 60,
            onInitialized: function (event) {
              let element = jQuery(event.target);
              element.find(".owl-stage").css({ paddingLeft: "0px" });
              element.find(".owl-stage").css({ paddingRight: "60px" });
            },
            onTranslated: function (event) {
              let element = jQuery(event.target);
              let carousenLenght = event.item.count;
              let index = event.item.index;
              if (index == 0) {
                element.find(".owl-stage").css({ paddingLeft: "0px" });
                element.find(".owl-stage").css({ paddingRight: "60px" });
              } else if (index == carousenLenght - 3) {
                element.find(".owl-stage").css({ paddingLeft: "80px" });
                element.find(".owl-stage").css({ paddingRight: "0px" });
              } else {
                element.find(".owl-stage").css({ paddingLeft: "30px" });
                element.find(".owl-stage").css({ paddingRight: "30px" });
              }
            },
          },
        },
        onInitialized: function () {
          $(".owl-carousel-iconos .owl-stage").css("display", "flex");
        },
      });
    } else {
      var owlCarousel = $(".owl-carousel-iconos");
      if (owlCarousel.hasClass("owl-loaded")) {
        owlCarousel.trigger("destroy.owl.carousel");
      }
    }
  }


    initCarousel();


  // llamar la función al cambiar el tamaño de la ventana
  $(window).on("resize", function () {
    initCarousel();
  });



  // calcular altura maxima de las cards y ajustar
  function ajustarAlturaCards() {
    if (window.innerWidth < 1024) {
      const carruselesIconos = document.querySelectorAll(".owl-carousel-iconos");
  
      carruselesIconos.forEach((carrusel) => {
        // const carruselId = carrusel.getAttribute("data-carrusel-id");
        const cardsIconos = carrusel.querySelectorAll(".item-forma_carrusel_iconos");
  
        let alturaMaxima = 0;
        cardsIconos.forEach((card) => {
          const altura = card.clientHeight;
          if (altura > alturaMaxima) {
            alturaMaxima = altura;
          }
        });
  
        cardsIconos.forEach((card) => {
          card.style.minHeight = `${alturaMaxima}px`;
        });
      });
    }
  }

  window.addEventListener("load", ajustarAlturaCards);
  // *************** HU 85 *************************

  let owlSettingsCardStar = {
    loop: false,
    margin: 10,
    nav: true,
    dots: false,
    
    stagePadding: 50,
    responsive: {
      0: {
        items: 1,
        dots:false,
      },
      600: {
        items: 2,
        dots:false,
      },
      1024: {
        items: 3,
        //slideBy: 3,
        nav: true,
        dots: true,
        dotsEach: 1,
        stagePadding: 0,
      },
    },
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
 

    onInitialized: function (event) {
      let element = jQuery(event.target);
      //element.find(".owl-stage").css({ paddingLeft: "0px" });
      //element.find(".owl-stage").css({ paddingRight: "100px" });
      let countItem= element.find(".owl-item").length;
      if(resolutionActual>1024){
        if(countItem<4){
          element.find(".owl-nav").css("display", "none");
        }
      }   
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
      element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
      $(".owl-dot").attr("tabindex", "-1");
      let $divAMoverDots =  element.find('.owl-dots');
            let $contenedorDestinoNav =  element.find('.owl-nav');
            if ($divAMoverDots.length && $contenedorDestinoNav.length) {
                $divAMoverDots.insertAfter($contenedorDestinoNav.children().first());
            } 
    },
  };

$(".owl-carousel-card-star").owlCarousel(owlSettingsCardStar);
var owlCardStar = $(".owl-carousel-card-star");
owlCardStar.owlCarousel();

 



let configDesktopCardStar = ()=>{
  
  if($(window).width()>1024){
    $(".s-js-carousel-stars").find(".s-js-card-stars").each(function(){
      let container= $(this)
      let down = container.find(".s-js-card-stars__star-down")
      container.find(".s-js-card-stars__container").appendTo(down) 
  }) 


  let customControllersCardStar = ()=>{

  //1. primero vamos a quitar que se desactive el prev   
  //$(".owl-carousel-card-star").find(".owl-prev").addClass("disabled")
     
  $(".owl-carousel-card-star").each(function () {
    let globalCardContainer = $(this)
    let dotsContainerCardStar =  globalCardContainer.find(".owl-dots");

    if((globalCardContainer.find(".owl-item").length)<4){
        //$(this).find(".owl-nav").hide(); // Oculta los botones de navegación
    
      //globalCardContainer.find(".owl-nav").css("gap","180px")
    } else {
      //globalCardContainer.find(".owl-nav").css("gap","125px")
    }


    //2. vamos a desactivar esta linea que crea los dots dentro del carrusel
    globalCardContainer.find(".owl-item").each(function (index) {
      
      // dotsContainerCardStar.append('<button role="button" class="owl-dot custom-dot  s-o-controller__dots"><span class="s-o-controller__span " data-owl-index="'+ index + '"></span></button>');
  });

    //3. desactivamos las dos siguientes lineas que activan y desactivan por defecto
    //globalCardContainer.find('[data-owl-index="0"]').parent().addClass("active")
  
    //globalCardContainer.find(".owl-next").off()
  })

  }
  
  customControllersCardStar()


  $(".custom-dot").click(function () {
    let containerClick = $(this)
    let dotIndexCardStar = $(this).children(".s-o-controller__span").data("owl-index");
    $(this).trigger("to.owl.carousel", [dotIndexCardStar, 300]);

     //containerClick.closest(".s-js-carousel-stars").find(".custom-dot").removeClass("active");
     //$(this).addClass("active");
  });
  /*
  $(".s-o-controller__nav").click(function () {
  
    let buttonClick = $(this)
    let carouselCardStarIndex = buttonClick.closest(".s-js-carousel-stars").find(".owl-dots").find(".active").children("span").data('owl-index')
   
 
   let CardStarActive = buttonClick.closest(".s-js-carousel-stars")
    
    if (buttonClick.hasClass("owl-prev")) {
     if(carouselCardStarIndex == 0){
       CardStarActive.find(".owl-prev").addClass("disabled")
     } else{
       carouselCardStarIndex --
       CardStarActive.find('[data-owl-index="'+ carouselCardStarIndex  +'"]').click()
       CardStarActive.find(".owl-prev").removeClass("disabled")
       CardStarActive.find(".owl-next").removeClass("disabled")
       if(carouselCardStarIndex == 0){
         CardStarActive.find(".owl-prev").addClass("disabled")
        }
     }
    
    } else {
     if(carouselCardStarIndex == (CardStarActive.find(".owl-item").length)){
       CardStarActive.find(".owl-next").addClass("disabled")
     } else {
       carouselCardStarIndex ++
       CardStarActive.find('[data-owl-index="'+ carouselCardStarIndex  +'"]').click()
       CardStarActive.find(".owl-prev").removeClass("disabled")
       if(carouselCardStarIndex == (CardStarActive.find(".owl-item").length)-1){
       CardStarActive.find(".owl-next").addClass("disabled")
       }
     }
     
    }
  });
*/
} 
}




  configDesktopCardStar()

//desactivamos el siguiente resize
/*
  $(window).on("resize", function () {
    let checkWidth = $(window).width();
    owlCardStar.owlCarousel("destroy");
    owlCardStar.owlCarousel(owlSettingsCardStar);

    if (checkWidth > 1024) {
      $(".s-js-carousel-stars")
        .find(".s-js-card-stars")
        .each(function () {
          let container = $(this);
          let down = container.find(".s-js-card-stars__star-down");
          container.find(".s-js-card-stars__container").appendTo(down);
        });
      $(".owl-carousel-card-star").find(".owl-prev").addClass("disabled");

      configDesktopCardStar();
    }
    if (checkWidth <= 1024) {
      $(".s-js-carousel-stars")
        .find(".s-js-card-stars")
        .each(function () {
          let container = $(this);
          let up = container.find(".s-js-card-stars__title-container");
          container.find(".s-js-card-stars__container").appendTo(up);
        });
    }

    $(".s-js-carousel-stars .owl-dots button:last-child").on(
      "click",
      function () {
        $(this)
          .closest(".owl-carousel-card-star")
          .find(".owl-next")
          .addClass("disabled");
      }
    );

    $(".s-js-carousel-stars .owl-dots button:first-child").on(
      "click",
      function () {
        $(this)
          .closest(".owl-carousel-card-star")
          .find(".owl-prev")
          .addClass("disabled");
      }
    );

    $(".s-js-carousel-stars .owl-dots button:not(:first-child)").on(
      "click",
      function () {
        $(this)
          .closest(".owl-carousel-card-star")
          .find(".owl-prev")
          .removeClass("disabled");
      }
    );

    $(".s-js-carousel-stars .owl-dots button:not(:last-child)").on(
      "click",
      function () {
        $(this)
          .closest(".owl-carousel-card-star")
          .find(".owl-next")
          .removeClass("disabled");
      }
    );
  });

*/

  //desactivamos las siguientes funciones de hacer click en los dots
  /*
  $(".s-js-carousel-stars .owl-dots button:last-child").on(
    "click",
    function () {
      $(this)
        .closest(".owl-carousel-card-star")
        .find(".owl-next")
        .addClass("disabled");
    }
  );

  $(".s-js-carousel-stars .owl-dots button:first-child").on(
    "click",
    function () {
      $(this)
        .closest(".owl-carousel-card-star")
        .find(".owl-prev")
        .addClass("disabled");
    }
  );

  $(".s-js-carousel-stars .owl-dots button:not(:first-child)").on(
    "click",
    function () {
      $(this)
        .closest(".owl-carousel-card-star")
        .find(".owl-prev")
        .removeClass("disabled");
    }
  );

  $(".s-js-carousel-stars .owl-dots button:not(:last-child)").on(
    "click",
    function () {
      $(this)
        .closest(".owl-carousel-card-star")
        .find(".owl-next")
        .removeClass("disabled");
    }
  );
  */
// *************** HU 84 *************************

  $(".owl_cards_comparadoras").owlCarousel({
    loop: false,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1,
        margin: 16,
        stagePadding: 52,
        mouseDrag: true, 
      },
      390: {
        stagePadding: 52,
        items: 1,
        nav: true,
        margin: 16,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
          element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
        },
      },
      416: {
        stagePadding: 52,
        items: 1,
        nav: true,
        margin: 16,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
          element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
        },
      },
      600: {
        items: 1,
        nav: true,
        stagePadding: 52,
        margin: 16,
        nav: true,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
          element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
        },
      },
      768: {
        items: 2,
        nav: true,
        stagePadding: 52,
        margin: 16,
        nav: true,
        navText: [
          "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
          "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
        ],
        onInitialized: function (event) {
          let element = jQuery(event.target);
          element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
          element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
        },
      },
      1025: {
        items: 4,
        margin: 24,
      },
      1440: {
        items: 4,
        margin: 24,
      },
      1920: {
        items: 4,
        margin: 24,
      },
    },

 
  });

 

   function removeActiveCarousel(card) {
    $(".s-c-cards_comparadoras#"+card+" .s-c-carousel__container-dots ul li").each(
      function () {
        if ($(this).find(".s-o-controller_dots").hasClass("active")) {
          $(this).find(".s-o-controller_dots").removeClass("active");
        }
      }
    );
  }

  function returnIdCarousel(card){
    var idCarousel;
    card.parents().each(function () {
      if ($(this).hasClass("s-c-cards_comparadoras")) {
        idCarousel = $(this).attr('id');
      }
    });
    return idCarousel;
  }

  function removeSelectedCards(carousel) {
    $("#" + carousel + " .card_comparadora").each(function () {
      if ($(this).hasClass("selected-card")) {
        $(this).removeClass("selected-card");
      }
    });
  }

  if(resolutionActual>=1025){
    $(
      ".s-c-cards_comparadoras .s-c-carousel__container-dots .s-o-controller_dots"
    ).click(function () {
      var idCarousel = returnIdCarousel($(this))
      removeActiveCarousel(idCarousel);
      var indexCard = $(this).parent().index();
      $(this).addClass("active");
      var carousel = $("#"+idCarousel+" .owl_cards_comparadoras");
      carousel.trigger("to.owl.carousel", [indexCard, 500, true]);


      if (indexCard === 4) {
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-next').addClass('disabled');
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-next').prop('disabled', true);
      } else {
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-next').removeClass('disabled');
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-next').prop('disabled', false);
      }

      $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').removeClass('disabled');
      $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').prop('disabled', false);

      if (indexCard === 0) {
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').addClass('disabled');
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').prop('disabled', true);
      } else {
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').removeClass('disabled');
        $('.s-c-cards_comparadoras#' + idCarousel + ' .owl-prev').prop('disabled', false);
      }

      $(".owl_cards_comparadoras .card_comparadora").removeClass("selected-card");
      var idCarousel = returnIdCarousel($(this))
      var carousel = $("#"+idCarousel+" .owl_cards_comparadoras");
      carousel.find(".card_comparadora:eq(" + indexCard + ")").each(function () {
        var card = $(this);
        card.addClass("selected-card");
      });
    });
  
    $(".s-c-cards_comparadoras .s-c-carousel__container-dots .owl-next").click(
      function () {
        var idCarousel = returnIdCarousel($(this))
        activateNextDotCardsComparadoras(idCarousel);
        var carousel = $("#"+idCarousel+" .owl_cards_comparadoras");       
        carousel.trigger("next.owl.carousel", [500]);
      }
    );
  
    $(".s-c-cards_comparadoras .s-c-carousel__container-dots .owl-prev").click(
      function () {
        var idCarousel = returnIdCarousel($(this))
        activatePrevDotCardsComparadoras(idCarousel);
        var carousel = $("#"+idCarousel+" .owl_cards_comparadoras");
        carousel.trigger("prev.owl.carousel", [500]);
      }
    );
  
    // disableNextButtonCardsComparadorasIfLastDotClicked(idCarousel);

    function activateNextDotCardsComparadoras(carousel) {
      var activeDot = $('.s-c-cards_comparadoras#'+carousel+' .owl-dots .owl-dot.active');
      if (activeDot.length>0) {
        var dotIndex = activeDot.data('card-index');

        activeDot.removeClass('active');
        var nextDotIndex = (dotIndex + 1) % 5; 

        var nextDot = $('.s-c-cards_comparadoras#'+carousel+' .owl-dots .owl-dot[data-card-index="' + nextDotIndex + '"]');
        nextDot.addClass('active');
        if(nextDotIndex >= 1){
          $('.s-c-cards_comparadoras#'+carousel+' .owl-prev').prop('disabled', false);
          $('.s-c-cards_comparadoras#'+carousel+' .owl-prev').removeClass('disabled');
        }
        if (nextDotIndex === 4) {
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').addClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').prop('disabled', true);
        } else {
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').removeClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').prop('disabled', false);
        }

        $("#" + carouselId + " .card_comparadora:eq(" + selectedCardIndex + ")").addClass("selected-card");
        var carouselId = returnIdCarousel($('.s-c-cards_comparadoras#' + carousel + ' .owl-dots .owl-dot.active'));
        removeSelectedCards(carouselId);
        var selectedCardIndex = nextDotIndex;
        $("#" + carouselId + " .card_comparadora:eq(" + selectedCardIndex + ")").addClass("selected-card");

      }
  }
  
    function activatePrevDotCardsComparadoras(carousel) {
      var activeDot = $('.s-c-cards_comparadoras#'+carousel+' .owl-dots .owl-dot.active');
      if (activeDot.length) {
        var dotIndex = activeDot.data('card-index');


        activeDot.removeClass('active');
        var prevDotIndex = (dotIndex - 1 + 5) % 5; 
        var prevDot = $('.s-c-cards_comparadoras#'+carousel+' .owl-dots .owl-dot[data-card-index="' + prevDotIndex + '"]');
        prevDot.addClass('active');
        if (prevDotIndex === 0) {
          $('.s-c-cards_comparadoras#'+carousel+' .owl-prev').addClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-prev').prop('disabled', true);
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').removeClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').prop('disabled', false);
        } else {
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-prev').removeClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-prev').prop('disabled', false);
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').removeClass('disabled');
          $('.s-c-cards_comparadoras#' + carousel + ' .owl-next').prop('disabled', false);
        }

        var carouselId = returnIdCarousel($('.s-c-cards_comparadoras#' + carousel + ' .owl-dots .owl-dot.active'));
        removeSelectedCards(carouselId);
        var selectedCardIndex = prevDotIndex;
        $("#" + carouselId + " .card_comparadora:eq(" + selectedCardIndex + ")").addClass("selected-card");

      }
    }

    // function disableNextButtonCardsComparadorasIfLastDotClicked(carousel) {
    //   var lastDot = $('.s-c-cards_comparadoras#' + carousel + ' .owl-dots button:last-child');
    //   lastDot.on("click", function () {
    //     $("#" + carousel + " .owl-next").addClass("disabled");
    //   });
    // }

  //   $(".s-c-cards_comparadoras#' + carousel + ' .owl-dots button:last-child").on("click", function(){
  //     $(this).closest(".owl_cards_comparadoras").find(".owl-next").addClass("disabled")
  
  //   })
  
   
  
  // $(".s-c-cards_comparadoras#' + carousel + ' .owl-dots button:last-child").on("click", function(){
  //   $(this).closest(".owl_cards_comparadoras").find(".owl-prev").addClass("disabled")
  
  // })
  
   
  
  // $(".s-c-cards_comparadoras#' + carousel + ' .owl-dots button:not(:last-child)").on("click", function(){
  //   $(this).closest(".owl_cards_comparadoras").find(".owl-prev").removeClass("disabled")
  // })
  
   
  
  // $(".s-c-cards_comparadoras#' + carousel + ' .owl-dots button:not(:last-child)").on("click", function(){
  //   $(this).closest(".owl_cards_comparadoras").find(".owl-next").removeClass("disabled")
  // })

    var cardCount = $(".owl_cards_comparadoras .item").length;
    if (cardCount < 5) {
      $(".s-c-cards_comparadoras .owl-dots").hide();
      $(".s-c-cards_comparadoras .owl-prev").hide();
      $(".s-c-cards_comparadoras .owl-next").hide();
    }
  

  }

  /**
   * BEGIN HU070
   */
  $('.s-c-cards-group').each(function(){
    const cardsGroupContainer = $(this);
    let resizerTimer = null;
    let owl = $(".owl-carousel");

    if ($(this).find(".s-c-card-s").length > 0) {
      $(this).addClass("s-c-cards-group-four-cols");
    } else if ($(this).find(".s-c-card-m").length > 0) {
      $(this).addClass("s-c-cards-group-three-cols");
    }

    const owlCarouselOpts = {
      loop: false,
      nav: true,
      dots: false,
      items: 1,
      margin: 24,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
      ],
      onInitialized: function (event) {
        let element = jQuery(event.target);
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      },
    };

    const manageDesktopSizes = (isMobile = false) => {
      const availableCards = cardsGroupContainer.find('.s-c-card-m, .s-c-card-s');
      if (isMobile) {
        availableCards.css("min-height", '');
      } else {
        const cardsSizes = availableCards.map(function (index, el) {
          return $(el).outerHeight(true);
        });
        availableCards.css("min-height", Math.max.apply(Math, cardsSizes));
      }
    }

    if ($(window).width() <= 1024) {
      owl.owlCarousel(owlCarouselOpts);
      manageDesktopSizes(true);
    } else {
      owl.addClass('off');
      manageDesktopSizes();
    }

    const mobileManager = () => {
      if ($(window).width() <= 1024) {
        if ( $('.owl-carousel').hasClass('off') ) {
          owl.owlCarousel(owlCarouselOpts);
          owl.removeClass("off");
        }
        manageDesktopSizes(true);
      } else {
        if (!$(".owl-carousel").hasClass("off")) {
          owl.addClass("off").trigger("destroy.owl.carousel");
          owl.find(".owl-stage-outer").children(":eq(0)").unwrap();
        }
        manageDesktopSizes();
      }
    };

    $(window).resize(function () {
      if (resizerTimer) clearTimeout(resizerTimer);
      resizerTimer = setTimeout(function () {
        mobileManager();
      }, 150);
    });
  });
  /**
   * END HU070
   */


  //-----START HU043 BREADCRUMB ----------------

  const breadcrumbItemsCenter = $(".s-js-breadcrumb")
  .first()
  .children(".s-js-breadcrumb__nav")
  .find(
    ".s-js-breadcrumb__list-container li:not(:first-child):not(:last-child)"
  );

const breadcrumbLength = $(".s-js-breadcrumb")
  .first()
  .children(".s-js-breadcrumb__nav")
  .find(".s-js-breadcrumb__list-container li").length;

let breadcrumbDesktopConfig = () => {
  $(".s-js-breadcrumb").each(function () {
    let breadcrumbContainer = $(this);
    breadcrumbContainer
      .children(".s-js-breadcrumb__nav")
      .find(".s-js-breadcrumb__list-container li:last")
      .children(".s-js-breadcrumb__link")
      .addClass("s-c-breadcrumb__link--last");

      breadcrumbContainer
      .children(".s-js-breadcrumb__nav")
      .find(".s-js-breadcrumb__list-container li:last").attr("aria-current","page")

    if (breadcrumbLength >= 5) {
      breadcrumbContainer
        .find(".s-js-breadcrumb__list-container li:not(:last-child)")
        .each(function () {
          let textContainer = $(this);
          let fullText = $(this).children("a").text().trim();
          let newText = fullText.substring(4);

          let finalText =
            fullText.slice(0, 4) +
            "<span class='s-c-breadcrumb__span-text'>" +
            newText +
            "</span>";

          if (textContainer.children("a").text().trim().length > 4) {
            finalText =
              fullText.slice(0, 4) +
              "<span class='s-c-breadcrumb__span-text'>" +
              newText +
              "</span> ...";
          } else {
            finalText = finalText;
          }

          if ($(window).width() > 1024) {
            if (!textContainer.children("a").has("span").length) {
              textContainer.children("a").html(finalText);
            } else if (
              textContainer.children("a").has("span").length > 0
            ) {
            }
          } else if ($(window).width() < 1024) {
            let spanText = textContainer
              .children("a")
              .children("span")
              .text();
             
            textContainer.children("a").children("span").remove();
            let firstText = textContainer.children("a").text();
            let finalTextLink = firstText
              .concat(spanText)
              .replace(/\s*\./g, "");
            textContainer.children("a").text(finalTextLink);

            breadcrumbContainer
              .find(".s-js-breadcrumb__out-list ol li")
              .each(function () {
                let outTextContainer = $(this);
                let spanTextOut = outTextContainer
                  .children("a")
                  .children("span")
                  .text();
                outTextContainer
                  .children("a")
                  .children("span")
                  .remove();
                let firstTextOut = outTextContainer
                  .children("a")
                  .text();
                let finalTextLinkOut = firstTextOut
                  .concat(spanTextOut)
                  .replace(/\s*\./g, "");

                outTextContainer.children("a").text(finalTextLinkOut);
              });
          }
        });
    }
  });
};

breadcrumbDesktopConfig();

$(window).on("resize", function () {
  breadcrumbConfigurate();
  $(".s-js-breadcrumb__button").off("click");
  $(".s-js-breadcrumb__button").attr("aria-expand", "false")

  $(".s-js-breadcrumb__button").on("click", function () {
    let $outList = $(this)
      .closest(".s-js-breadcrumb")
      .find(".s-js-breadcrumb__out-list");
    $outList.toggle();
    if ($outList.is(":visible")) {
      $outList.css("display", "inline-block");
      $(this).attr("aria-expand", "true");
    } else {
      $outList.css("display", "none");
      $(this).attr("aria-expand", "false");
    }
  });

  breadcrumbDesktopConfig();
  breadcrumbButtonDesktop();
});

let breadcrumbConfigurate = () => {
  $(".s-js-breadcrumb").each(function () {
    let breadcrumbContainer = $(this);
    breadcrumbContainer
      .children(".s-js-breadcrumb__nav")
      .find(".s-js-breadcrumb__list-container li:last")
      .children(".s-js-breadcrumb__link")
      .addClass("s-c-breadcrumb__link--last");

      breadcrumbContainer
      .children(".s-js-breadcrumb__nav")
      .find(".s-js-breadcrumb__list-container li:last a").attr("tabindex", "-1")


    if ($(window).width() <= 1024) {
      if (breadcrumbLength <= 2) {
        breadcrumbContainer
          .children(".s-js-breadcrumb__nav")
          .find(".s-js-breadcrumb__list-container li:last")
          .children(".s-js-breadcrumb__icon")
          .addClass("s-c-breadcrumb__icon--disable");
      } else if (breadcrumbLength > 2) {
        breadcrumbContainer
          .children(".s-js-breadcrumb__nav")
          .find(".s-js-breadcrumb__list-container li:last")
          .children(".s-js-breadcrumb__icon")
          .removeClass("s-c-breadcrumb__icon--disable");

        let breadCrumbArrow = breadcrumbContainer.find(
          ".s-js-breadcrumb__list-container li:last"
        );

        breadcrumbContainer
          .children(".s-js-breadcrumb__nav")
          .find(".s-js-breadcrumb__list-container li:last")
          .children(".s-js-breadcrumb__icon")
          .prependTo(breadCrumbArrow);

        if (
          !breadcrumbContainer
            .children(".s-js-breadcrumb__nav")
            .find(".s-js-breadcrumb__list-container li:first")
            .next()
            .is("button")
        ) {
          breadcrumbContainer
            .children(".s-js-breadcrumb__nav")
            .find(".s-js-breadcrumb__list-container li:first")
            .after(
              $(
                "<button class='s-c-breadcrumb__button s-js-breadcrumb__button' aria-expand='false'>...</button>"
              )
            );
        } else {
          breadcrumbContainer
            .children(".s-js-breadcrumb__nav")
            .find(".s-js-breadcrumb__button")
            .css("display", "block");
        }

        let boxTextBreadCrumb = breadcrumbContainer.find(
          ".s-js-breadcrumb__out-list ol"
        );
        boxTextBreadCrumb.empty();
        breadcrumbItemsCenter.clone().appendTo(boxTextBreadCrumb);
      }
    } else if ($(window).width() > 1024) {
      breadcrumbContainer
        .children(".s-js-breadcrumb__nav")
        .find(".s-js-breadcrumb__list-container li:last")
        .children(".s-js-breadcrumb__icon")
        .addClass("s-c-breadcrumb__icon--disable");

      breadcrumbContainer
        .find(
          ".s-js-breadcrumb__list-container li:not(:first):not(:last)"
        )
        .remove();
      breadcrumbContainer
        .find(".s-js-breadcrumb__list-container li:first")
        .after(breadcrumbItemsCenter.clone());

      breadcrumbContainer
        .children(".s-js-breadcrumb__nav")
        .find(".s-js-breadcrumb__button")
        .remove();
    }
  });
};

breadcrumbConfigurate();

let breadcrumbButtonDesktop = () => {
  $(".s-js-breadcrumb").each(function () {
    if (
      $(".s-js-breadcrumb")
        .find(".s-js-breadcrumb__out-list")
        .is(":visible")
    ) {
      $(".s-js-breadcrumb")
        .find(".s-js-breadcrumb__out-list")
        .css("display", "none");
    }
  });
};



$(".s-js-breadcrumb__button").on("click", function () {
  let $outList = $(this)
    .closest(".s-js-breadcrumb")
    .find(".s-js-breadcrumb__out-list");
  $outList.toggle();
  if ($outList.is(":visible")) {
    $outList.css("display", "inline-block");
    $(this).attr("aria-expand", "true");
  } else {
    $outList.css("display", "none");
    $(this).attr("aria-expand", "false");
  }
});

  //----- END HU 043 BREADCRUMB ---------------- 

  // HU024 - Buscador
  function validateSearch(nombre) {
    let regex = /^[a-zA-ZÀ-ÿ0-9\s]+$/g;
    return regex.exec(nombre);
  }

  if (
    sessionStorage.getItem("searchValue") != null &&
    sessionStorage.getItem("searchValue") != undefined
  ) {
    var arraySearch = sessionStorage.getItem("searchValue");
    arraySearch = JSON.parse(arraySearch);
    for (let i = 0; i < arraySearch.length; i++) {
      var searchItem = decodeURI(arraySearch[i]);
      var isValidate = validateSearch(searchItem);
      if (isValidate !== null) {
        $(
          ".s-c-search-bar .s-c-search-bar__filters .s-c-search-bar__filters-container"
        ).append(
          '<div class="s-o-btn-group"><a title="ir a ' +
            searchItem +
            '" class="s-o-btn " href="?q=' +
            searchItem +
            '" role="button">' +
            searchItem +
            '</a><button title="Cerrar" class="s-o-btn "><i class="s-iconIcono-equis"aria-hidden="true"></i></button></div>'
        );
      }
    }
  }
  $(".s-c-search-bar .s-c-search-bar__filters .s-o-btn-group button").click(
    function () {
      var removeItem = $(this).prev().text();
      var arraySearch = sessionStorage.getItem("searchValue");
      arraySearch = JSON.parse(arraySearch);
      arraySearch = arraySearch.filter(function (value) {
        return value !== removeItem;
      });
      sessionStorage.setItem("searchValue", JSON.stringify(arraySearch));
      $(this).parent().remove();
    }
  );

  $(".s-c-search-results .s-c-search-results__list li").each(function () {
    $(this)
      .find(
        ".s-c-search-results__content .s-c-search-results__category .taglib-asset-categories-summary"
      )
      .each(function () {
        var textVocabulary = $(this).clone().children().remove().end().text();
        var indexVocabulary = $(this).index();
        var arrayCategory = [];
        $(this)
          .find("a")
          .each(function () {
            var textCategory = $(this).text();
            arrayCategory.push(textCategory);

          });
        if (arrayCategory.length >= 1) {
          $(this)
            .parent()
            .append(
              '<div class="s-c-search-results__category-item"><p>' +
                textVocabulary +
                "</p></div>"
            );
          var htmlVocabulary = $(this)
            .parent()
            .find(".s-c-search-results__category-item")[indexVocabulary];
          arrayCategory.forEach(function (i) {
            $(htmlVocabulary).find("p").append("<span class='s-o-tag'>" + i + "</span>");
          });
        }
      });
  });


// ------START HU 65-1-2 cards plans and price ----------

  // fix add height depending on the highest card
  let cardPlansAndPriceFront = document.querySelectorAll(".s-c-card-plans-price-front");
  let cardPlansAndPriceFrontOwl = document.querySelectorAll(".owl-carousel .s-c-card-plans-price-front");
  
  function addHeightCard(arrayItems){

    arrayItems.forEach(i => {
        if (i.closest('.owl-carousel') === null) {
          i.setAttribute('entroalif', true)
          setTimeout(() => {
            i.parentElement.classList.add('parentElement');

            setTimeout(() => {
              if (i.clientHeight > i.nextElementSibling.clientHeight) {
                i.nextElementSibling.style.minHeight = i.clientHeight + "px";
                i.nextElementSibling.style.height = i.clientHeight + "px";
              } else {
                i.style.minHeight = i.nextElementSibling.clientHeight + "px";
                i.style.height = i.nextElementSibling.clientHeight + "px";
              }
              setTimeout(() => {
                i.nextElementSibling.classList.add("d-none-a");
              }, 3000);
            }, 1000);

          }, 1000);
      }
    });
	};

  function addHeightCardCarousel(arrayItems) {
    arrayItems.each(function(){
      if ($(this).outerHeight() > $(this).next().outerHeight()) {
        $(this)
          .next()
          .css({ minHeight: $(this).outerHeight() + "px" });
      } else {
        $(this).css({ minHeight: $(this).next().outerHeight() + "px" });
      }
      setTimeout(() => {
        $(this).next().addClass("d-none-a");
      }, 3000);
      setTimeout(() => {
        $(this).parent().addClass("height-100");
      }, 3001);
    });
  }

	addHeightCard(cardPlansAndPriceFront);


  if ($(window).width() > 1024) {
    function addClassHovered(arrayItems){
      arrayItems.forEach(function (i) {
        (i).addEventListener("mouseover", function( event ) { 
          // i.classList.add('s-hovered');
          i.nextElementSibling.classList.remove('opacity');
          setTimeout(function () {
            i.classList.add("s-c-card-plans-price-front--hidden");
            i.nextElementSibling.classList.remove('d-none-a');
          }, 3000);
 
        });
        (i).addEventListener("mouseout", function( event ) {   
          // i.classList.remove('s-hovered');
          i.classList.add('opacity'); 
          setTimeout(function () {
            i.classList.remove("s-c-card-plans-price-front--hidden");
            i.nextElementSibling.classList.add('d-none-a');
          }, 3000);
        });
      }); 
    };
    // addClassHovered(cardPlansAndPriceFront);
  };

  $(".s-js-card-plans-price-back__button-rotate").on("click", function(){
    $(this).closest(".s-js-card-plans-price-back").addClass("d-none-a")
    $(this).closest(".s-js-card-plans-price-back").prev(".s-js-card-plans-price-front").removeClass("s-c-card-plans-price-front--hidden")
  })
  
  $(".s-js-card-plans-price-front__button-rotate").on("click", function(){
    $(this).closest(".s-js-card-plans-price-front").addClass("s-c-card-plans-price-front--hidden")
    $(this).closest(".s-js-card-plans-price-front").next(".s-js-card-plans-price-back").removeClass("d-none-a")
  })
  
  let cardPlansAndPrice = ()=>{
  
    $(".s-js-card-plans-price-back").each(function(){
      let container = $(this)
      let bgColor =  container.children(".s-js-list-color").attr("class")
   
       container.find(".s-js-card-plans-price-back__items-container li").each(function(index){
       let itemContainer = $(this)
    
      if(index%2==0){
        itemContainer.addClass(bgColor)
        }
      })
    })
  
  // if ($(window).width() > 1024) {
  //   $(".s-js-card-plans-price-front").mouseenter(function(){
  //     $(this).next(".s-js-card-plans-price-back").removeClass("opacity");
  //     $(this).addClass("opacity");
  //     setTimeout(() => {
  //       $(this).addClass("s-c-card-plans-price-front--hidden");
  //       $(this).next(".s-js-card-plans-price-back").removeClass("d-none-a");
  //     }, 200);
  //   })
  //   $(".s-js-card-plans-price-back").mouseleave(function(){
  //     $(this).prev(".s-js-card-plans-price-front").removeClass("opacity");
  //     $(this).addClass("opacity");
  //     setTimeout(() => {
  //       $(this).addClass("d-none-a");
  //       $(this).prev(".s-js-card-plans-price-front").removeClass("s-c-card-plans-price-front--hidden");
  //     }, 200);
  //   })
  //  }
  }

  cardPlansAndPrice()
  
  $(window).resize(function () {
  if ($(window).width() <= 1024) {
  $(".s-js-card-plans-price-front").off("mouseenter")
  $(".s-js-card-plans-price-back").off("mouseleave")
  } else {
  $(".s-js-card-plans-price-front").mouseenter(function(){
      $(this).addClass("s-c-card-plans-price-front--hidden")
      $(this).next(".s-js-card-plans-price-back").removeClass("s-c-card-plans-price-back--hidden")
    })
    $(".s-js-card-plans-price-back").mouseleave(function(){
      $(this).addClass("s-c-card-plans-price-back--hidden")
      $(this).prev(".s-js-card-plans-price-front").removeClass("s-c-card-plans-price-front--hidden")
    })
  }
  });

  // ------END HU 65-1-2 cards plans and price ----------

// *************** HU 063-2 CARD *************************
  if ($(".s-c-card-seleccionada-caja-img").length > 0) {
    $(".s-c-card-seleccionada-content").css("padding-bottom", "24px");
  } else {
    $(".s-c-card-seleccionada-content").css("padding", "3% 24px 3% 24px");
    $(".s-c-card-seleccionada-title").css("margin-top", "0");
  }


  //-----------START HU 65-3 ADT Cards plans an price group ---------

    let owlSettingsPlansPrice = {
      loop: false,
      nav: true,
      dots: false,
      items: 3,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1024: {
          items: 2,
          stagePadding: 0,
          autoWidth: true,
          margin: 24,
          touchDrag: false,
          mouseDrag: false,
        },
      },
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
      ],
      onInitialized: function (event) {
        let element = jQuery(event.target);
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
        element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
        element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
        let test = element.find(".s-c-card-plans-price-front");
	      addHeightCardCarousel(test);
        let heightCarousel = 0;
        element.find(".owl-item").each(
          function () {
            if (
              $(this).find(".s-c-card-plans-price").outerHeight() > heightCarousel
            ) {
              heightCarousel = $(this).find(".s-c-card-plans-price").outerHeight();
            }
          }
        );
        heightCarousel = heightCarousel +30
        element.find(" .owl-stage-outer"
        ).css({ maxHeight: heightCarousel + "px" });
      },
      // onTranslated: function (event) {
      //   $(".owl-carousel-plans-price").each(function () {
      //     addHeightCard(cardPlansAndPriceFrontOwl);
      //     maxHeightCard();
      //   });
      // },
    };

  $(".owl-carousel-plans-price").owlCarousel(owlSettingsPlansPrice);
  var owlPlansPrice = $(".owl-carousel-plans-price");
  owlPlansPrice.owlCarousel();





  let configDesktopPlansPrice = ()=>{

    if($(window).width()>1024){


    let customControllersPlansPrice = ()=>{

    $(".owl-carousel-plans-price").find(".owl-prev").addClass("disabled")

    $(".owl-carousel-plans-price").each(function () {
      let globalCardContainer = $(this)
      let dotsContainerPlansPrice =  globalCardContainer.find(".owl-dots");

      if((globalCardContainer.find(".owl-item").length)>6){
        globalCardContainer.find(".owl-nav").css("gap","180px")
      } else {
        globalCardContainer.find(".owl-nav").css("gap","125px")
      }

      globalCardContainer.find(".owl-item").each(function (index) {
        dotsContainerPlansPrice.append('<button role="button" class="owl-dot custom-dot  s-o-controller__dots"><span class="s-o-controller__span " data-owl-index="'+ index + '"></span></button>');
      });

      globalCardContainer.find('[data-owl-index="0"]').parent().addClass("active")

      globalCardContainer.find(".owl-next").off()
    })

    }

    customControllersPlansPrice()


    $(".custom-dot").click(function () {
      let containerClick = $(this)
      let dotIndexCardStar = $(this).children(".s-o-controller__span").data("owl-index");
      $(this).trigger("to.owl.carousel", [dotIndexCardStar, 300]);

      containerClick.closest(".s-js-plans-price").find(".custom-dot").removeClass("active");
      $(this).addClass("active");
    });

    $(".s-o-controller__nav").click(function () {

      let buttonClick = $(this)
      let carouselPlansPriceIndex = buttonClick.closest(".s-js-plans-price").find(".owl-dots").find(".active").children("span").data('owl-index')


    let PlansPriceActive = buttonClick.closest(".s-js-plans-price")

      if (buttonClick.hasClass("owl-prev")) {
      if(carouselPlansPriceIndex == 0){
        PlansPriceActive.find(".owl-prev").addClass("disabled")
      } else{
        carouselPlansPriceIndex --
        PlansPriceActive.find('[data-owl-index="'+ carouselPlansPriceIndex  +'"]').click()
        PlansPriceActive.find(".owl-prev").removeClass("disabled")
        PlansPriceActive.find(".owl-next").removeClass("disabled")
        if(carouselPlansPriceIndex == 0){
          PlansPriceActive.find(".owl-prev").addClass("disabled")
          }
      }

      } else {
      if(carouselPlansPriceIndex == (PlansPriceActive.find(".owl-item").length)){
        PlansPriceActive.find(".owl-next").addClass("disabled")
      } else {
        carouselPlansPriceIndex ++
        PlansPriceActive.find('[data-owl-index="'+ carouselPlansPriceIndex  +'"]').click()
        PlansPriceActive.find(".owl-prev").removeClass("disabled")
        if(carouselPlansPriceIndex == (PlansPriceActive.find(".owl-item").length)-1){
        PlansPriceActive.find(".owl-next").addClass("disabled")
        }
      }

      }
    });

    }
  }




  configDesktopPlansPrice()

  let plansPriceNavs = ()=>{
    if($(window).width()>1024){
    $(".owl-carousel-plans-price").each(function(){
    let carouselSelected = $(this)
    let itemsCount =  $(this).find(".s-js-plans-price__item-container").length
    if(itemsCount < 4){
      carouselSelected.find(".owl-nav").css("display", "none")
      carouselSelected.find(".owl-dots").css("display", "none")

    } else{
      carouselSelected.find(".owl-nav").css("display", "flex")
      carouselSelected.find(".owl-dots").css("display", "flex")
    }
    })
    }
  }

  plansPriceNavs()

  $( window ).on( "resize", function() {
    let checkWidth = $(window).width();
    owlPlansPrice.owlCarousel('destroy');
    owlPlansPrice.owlCarousel(owlSettingsPlansPrice);
    plansPriceNavs()


    if(checkWidth>1024 ){

        $(".owl-carousel-plans-price").find(".owl-prev").addClass("disabled")
        configDesktopPlansPrice()

    }

    $(".s-js-plans-price .owl-dots button:last-child").on("click", function(){
      $(this).closest(".owl-carousel-plans-price").find(".owl-next").addClass("disabled")

    })

  $(".s-js-plans-price .owl-dots button:first-child").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-prev").addClass("disabled")

  })

  $(".s-js-plans-price .owl-dots button:not(:first-child)").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-prev").removeClass("disabled")
  })

  $(".s-js-plans-price .owl-dots button:not(:last-child)").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-next").removeClass("disabled")
  })

  })

  $(".s-js-plans-price .owl-dots button:last-child").on("click", function(){
      $(this).closest(".owl-carousel-plans-price").find(".owl-next").addClass("disabled")

    })

  $(".s-js-plans-price .owl-dots button:first-child").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-prev").addClass("disabled")

  })

  $(".s-js-plans-price .owl-dots button:not(:first-child)").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-prev").removeClass("disabled")
  })

  $(".s-js-plans-price .owl-dots button:not(:last-child)").on("click", function(){
    $(this).closest(".owl-carousel-plans-price").find(".owl-next").removeClass("disabled")
  })

  //-----------END HU 65-3 ADT Cards plans an price group ---------

  $(".s-c-tab-component").suraTabComponent();
//49-2-2



function asignarIDs49(selector) {
  $(selector).each(function(index) {
      var uniqueID = 'card-tag-carousel-' + (index + 1);
      $(this).attr('id', uniqueID);
  });
}

function asignarIDs49Clone(selector) {
  $(selector).each(function(index) {
      var uniqueID = 'card-tag-carousel-' + (index + 1) + '-clone';
      $(this).attr('id', uniqueID);
  });
}

function orderByDate49(selectorId, onlyOneElement) {

      const carrusel = $('#' + selectorId);

      var stagePaddingOnMobile = 40;

      if(onlyOneElement){
        stagePaddingOnMobile = 12;
      }

      // Resto del código...

      if (carrusel.data('owl.carousel')) {
          carrusel.owlCarousel('destroy');
      }

      if (carrusel) {
          const cards = Array.from(carrusel.find('.item'));

          cards.sort((a, b) => {
              const subtituloA = $(a).find('.s-c-card-tag-img-parrafo-fecha p').text();
              const subtituloB = $(b).find('.s-c-card-tag-img-parrafo-fecha p').text();

              const fechaObjetoA = new Date(subtituloA.split("-").reverse().join("-"));
              const fechaObjetoB = new Date(subtituloB.split("-").reverse().join("-"));
    
              return fechaObjetoB - fechaObjetoA;

          });

          carrusel.empty();

          cards.forEach(card => carrusel.append(card));

          carrusel.owlCarousel({
              loop: false,
              nav: true,
              margin: 16,
              dots: false,
              navText: [
                  "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
                  "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
              ],
              responsive: {
                0: {
                  items: 1,
                },
                360: {
                  items: 1,
                  margin: 18,
                  stagePadding: stagePaddingOnMobile,
                      onInitialized: function (event) {
                        let element = jQuery(event.target);
                        element
                          .find(".owl-dots .owl-dot")
                          .addClass("s-o-controller__dots");
                        element
                          .find(".owl-dots .owl-dot span")
                          .addClass("s-o-controller__span");
                        element
                          .find(".owl-nav .owl-prev")
                          .addClass("s-o-controller__nav");
                        element
                          .find(".owl-nav .owl-next")
                          .addClass("s-o-controller__nav");
                        element.find(".owl-stage").css({ "padding-left": "0px" });
                      },
                      onTranslate: function (event) {
                        let element = jQuery(event.target);
                        let indexItem = event.item.index;
                        let lenghtItem = event.item.count;
                        if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                          element.find(".owl-stage").css({ "padding-left": "0px" });
                        } else if (indexItem == lenghtItem - 1) {
                          element.find(".owl-stage").css({ "padding-right": "0px" });
                          element.find(".owl-stage").css({ "padding-left": "120px" });
                        } else if (indexItem == 0) {
                          element.find(".owl-stage").css({ "padding-left": "0px" });
                        }
                      },
                },
                500: {
                  items: 1,
                  margin: 18,
                  stagePadding: 40,
                      onInitialized: function (event) {
                        let element = jQuery(event.target);
                        element
                          .find(".owl-dots .owl-dot")
                          .addClass("s-o-controller__dots");
                        element
                          .find(".owl-dots .owl-dot span")
                          .addClass("s-o-controller__span");
                        element
                          .find(".owl-nav .owl-prev")
                          .addClass("s-o-controller__nav");
                        element
                          .find(".owl-nav .owl-next")
                          .addClass("s-o-controller__nav");
                        element.find(".owl-stage").css({ "padding-left": "0px" });
                      },
                      onTranslate: function (event) {
                        let element = jQuery(event.target);
                        let indexItem = event.item.index;
                        let lenghtItem = event.item.count;
                        if (indexItem >= 1 && indexItem != lenghtItem - 1) {
                          element.find(".owl-stage").css({ "padding-left": "0px" });
                        } else if (indexItem == lenghtItem - 1) {
                          element.find(".owl-stage").css({ "padding-right": "0px" });
                          element.find(".owl-stage").css({ "padding-left": "120px" });
                        } else if (indexItem == 0) {
                          element.find(".owl-stage").css({ "padding-left": "0px" });
                        }
                      },
                },
                767: {
                  items: 2,
                  margin: 18,
                },
                1025: {
                  items: 3,
                  margin: 24,
                  mouseDrag: false,
                },
                1920: {
                  items: 3,
                  margin: 25,
                  mouseDrag: false,
                },
              },
              onInitialized: function (event) {
                  let element = jQuery(event.target);
                  element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
                  element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
              },
          });
      }

}

asignarIDs49('.s-c-card-tag-img-item-carrusel--original');
asignarIDs49Clone('.s-c-card-tag-img-item-carrusel--clone')

$('.s-c-card-tag-img-carrusel').each(function() {
  var jqInstance = $(this);

  var carouselItem = jqInstance.find(".s-c-card-tag-img-item-carrusel");

  orderByDate49(carouselItem.attr('id'), false)

  var originalValues = $(this).find(".owl-stage-outer .owl-stage .owl-item");

  var valoresSeleccionados = [];

  // Event open dorpdown filter
  jqInstance.find(".container-filtro-tag .s-o-dropdown .s-o-dropdown__toggle").click(function() {
     
      var isOpenDropdown = $(this).hasClass("s-js-dropdown__toggle--active")

      var cardtagContainer = $(this).closest(".s-c-card-tag-img-carrusel");

      var filterOptionsContainer = cardtagContainer.find(".container-filtro-tag .s-o-dropdown .s-o-dropdown__content")

      if(isOpenDropdown){

        filterOptionsContainer.addClass("s-o-dropdown__content--shadowBox")

        $(this).find(".s-o-icon .s-iconDirectionDown").removeClass("s-iconDirectionDown").addClass("s-iconDirectionUp")

      }else{

        filterOptionsContainer.removeClass("s-o-dropdown__content--shadowBox")

        $(this).find(".s-o-icon .s-iconDirectionUp").removeClass("s-iconDirectionUp").addClass("s-iconDirectionDown")
      }

  });

  // Añadir evento de escucha a los checkboxes del filtro
  jqInstance.find(".filtro-card-tag-items input[type='checkbox']").change(function() {
    actualizarTarjetasCarrusel();
  });

  function tagClickEffect(){

    $('.js-tag-card-option').click(function(){
  
      var optionSelectedValue = $(this).closest(".item").attr('data-tag');
  
      var parentContainer = $(this).closest(".s-c-card-tag-img-carrusel");
  
      parentContainer.find('.s-o-dropdown__content .form-check-input').each(function(){
  
        if($(this).val() == optionSelectedValue){
  
          var isCheked = $(this).prop("checked");
  
          if(!isCheked){
            $(this).prop("checked", !isCheked)
  
            actualizarTarjetasCarrusel();
          }
        }
      })
      
    })
  }

  tagClickEffect()

  function deseleccionarFiltroCarrusel(filtro) {
    // Des-seleccionar el filtro en el checkbox
    jqInstance.find(".filtro-card-tag-items input[value='" + filtro + "']").prop("checked", false);

    // Actualizar las tarjetas
    actualizarTarjetasCarrusel();
  }


  function actualizarTarjetasCarrusel() {

    valoresSeleccionados = [];
    jqInstance.find('.container-tags').empty();

    jqInstance.find(".filtro-card-tag-items input[type='checkbox']").each(function () {
      const checkboxValue = $(this).val();
      
      if ($(this).is(":checked")) {
        valoresSeleccionados.push(checkboxValue);

        $('<span/>', {
          class: 's-o-tag s-o-tag--icon-right s-o-tag-carrusel',
          text: checkboxValue
        }).append(
          $('<i />', {
            class: 's-o-tag__icon s-iconIcono-equis'
          }).click(function() {
            // Añadir evento de escucha al icono del tag
            deseleccionarFiltroCarrusel(checkboxValue);
          })
        ).appendTo(jqInstance.find('.container-tags'));
      }
    });

    if (valoresSeleccionados.length === 0) {


      jqInstance.find('#' + carouselItem.attr('id') + '-clone').addClass('invisible-carousel');

      jqInstance.find('#' + carouselItem.attr('id')).removeClass('invisible-carousel');

    } else {

      var cloneValues = originalValues.clone();

      var filteredValues = cloneValues.filter(function() {

        var hasTagValue = valoresSeleccionados.includes($(this).find('.item').attr('data-tag'))

        if(hasTagValue){
          return $(this);
        }
      });

      jqInstance.find('#' + carouselItem.attr('id') + '-clone' + ' .owl-stage-outer .owl-stage').empty().append(filteredValues)

      if(filteredValues.length > 1){

        orderByDate49(carouselItem.attr('id') + '-clone', false);

      }else{
        orderByDate49(carouselItem.attr('id') + '-clone', true);

      }

      jqInstance.find('#' + carouselItem.attr('id')).addClass('invisible-carousel');

      jqInstance.find('#' + carouselItem.attr('id') + '-clone').removeClass('invisible-carousel');
    }
    
    tagClickEffect()

    var backButton = jqInstance.find('#' + carouselItem.attr('id') + " .owl-nav .owl-prev");

    //prevent infinite loop
    var number= 0;

    while (!backButton.hasClass("disabled")) {

      backButton.click()

      //this condition is impossible on real use, is only to prevent infinite loop
      if(number == 100){
        break;
      }

      number = number + 1;
    }

  }

});

//49-2-3  
$('.s-c-acordeon-ADT').each(function(){
  if (resolutionActual < 768) {
    var button = $(this).find(".s-o-acordeon-ADT-button");
    var containerDots = $(this).find('.owl-nav');
    button.insertBefore(containerDots);
  }
})
//HU080
$('.s-c-filter-category input[type="checkbox"]').on("keypress", function (event) {
  if (event.which === 13) {
      this.checked = !this.checked;
  }
  event.preventDefault();
});

function clicFilterCategory() {
  if (resolutionActual < 1025) {
    $(".s-c-filter-category li").on("click", function (event) {
      $(this).find("input").click();
    });
  }
}

clicFilterCategory();

$(window).resize(function () {
  clicFilterCategory();
});

 // <!-- Inicio Component HU-029 Card Podcast  -->

  var mainCardsPodcast = $(".owl_slider_main_podcasts").owlCarousel({
      loop: false,
      singleItem: false,
      nav: true,
      navRewind: false,
      autoWidth: true,
      dotsEach: false,
      items: 3,
      dots: false,
      mouseDrag: false,
      touchDrag: false,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
      ],
      responsive: {
        1025: {
          items: 3,
          margin: 24,
        },
        1920: {
          items: 3,
          margin: 24,
        },
      },
      onInitialized: function (event) {
        let element = jQuery(event.target);

        element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
        element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");

        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");

        let nav = element.find(".owl-nav");
        let dots = element.find(".owl-dots");

        dots.appendTo(nav);

        let buttonPrev = element.find(".owl-nav button.owl-next");

        dots.after(buttonPrev);

        const containerPodcastsCard = element.closest(".s-c-cardPodcast")

        containerPodcastsCard.find(".custom-owl-dots-podcast button").appendTo(dots);
        containerPodcastsCard.find(".custom-owl-dots-podcast").remove();
      },
    });
  
    //agregamos tabindex para que sea visible en safari
  
    $(".owl_slider_main_podcasts .owl-nav .owl-prev").attr("tabindex", "0");
    $(".owl_slider_main_podcasts .owl-nav .owl-prev").attr("title", "Atras");

    $(".owl_slider_main_podcasts .owl-nav .owl-next").attr("tabindex", "0");
    $(".owl_slider_main_podcasts .owl-nav .owl-next").attr("title", "Siguiente");
  
    mainCardsPodcast.on("refreshed.owl.carousel.owl_slider_main_podcasts", function (event) {
      $(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeClass(
        "disabled"
      );
      $(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeAttr(
        "disabled"
      );
      $(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").css(
        "pointer-events",
        "none"
      );
  
      if ($(window).width() > 1025) {
        $(".container_banner_principal").addClass(
          "owl_slider_main_podcasts owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
        );
        $(".container_banner_principal").addClass(
          "owl_slider_main_podcasts owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
        );
        $(this).find("div:first").addClass("owl-stage-outer");
        $(".container_banner_principal > div:first").addClass("owl-stage-outer");
      } else {
        $(".container_banner_principal").removeClass(
          "owl_slider_main_podcasts owl-carousel owl-theme owl-loaded owl-text-select-on owl-stage-outer owl-stage owl-item"
        );
        $(this).find(".owl-stage-oute").removeClass("owl-stage-outer");
        $(".container_banner_principal > .owl-stage-outer").removeClass(
          "owl-stage-outer"
        );
  
        $(".container_banner_principal > owl-stage").removeAttr("style");
        //$('.owl-stage').removeClass('owl-stage')
        $(".container_banner_principal > owl-item").removeClass(
          "owl-item.active"
        );
        $(".container_banner_principal > owl-item").removeAttr("style");
      }
    });
  
$(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeClass(
  "disabled"
);

$(window).resize(function(){
  $(".owl_slider_main_podcasts").each(function(){

    var numberOfPodcastCards = $(this).find(".owl-item").length;
  
    var podcastParentContainer = $(this).closest('.s-c-cardPodcast');
  
    $(this).find(".owl-item").each(function(index, element){
  
      if(index == 0){
        if(numberOfPodcastCards == 2){

          $(this).removeClass("card_podcast_dual_contraida");
  
          $(this).addClass("card_podcast_dual_expandida");
  
        }else{

          $(this).removeClass("card_podcast_contraida");
  
          $(this).addClass("card_podcast_expandida");
  
        }
      }
  
      if(index != 0){
  
        if(numberOfPodcastCards == 2){

          $(this).removeClass("card_podcast_dual_expandida");
  
          $(this).addClass("card_podcast_dual_contraida")
  
          podcastParentContainer.find('.owl-nav').addClass('owl-nav-dual-status')
  
        }else{

          $(this).removeClass("card_podcast_expandida");

          $(this).addClass("card_podcast_contraida")
        }
  
      }
  
    })

    podcastParentContainer.find(".owl-nav .owl-dots .owl-dot").each(function(index, element){
  
        if(index == 0){
            $(this).addClass("active");
        }
  
        if(index != 0){
          $(this).removeClass("active");
        }
  
    });

    podcastParentContainer.find(".owl-nav .owl-next").each(function(index, element){

        $(this).css({
          "pointer-events": "auto"
        });
  
    });

  });

});

//Agrega las etiquetas que se usaran para identificar si la card está o no expandida
$(".owl_slider_main_podcasts").each(function(){

  var numberOfPodcastCards = $(this).find(".owl-item").length;

  var podcastParentContainer = $(this).closest('.s-c-cardPodcast');

  $(this).find(".owl-item").each(function(index, element){

    if(index == 0){
      if(numberOfPodcastCards == 2){

        $(this).addClass("card_podcast_dual_expandida");

      }else{

        $(this).addClass("card_podcast_expandida");

      }
    }

    if(index != 0){

      if(numberOfPodcastCards == 2){

        $(this).addClass("card_podcast_dual_contraida")

        podcastParentContainer.find('.owl-nav').addClass('owl-nav-dual-status')

      }else{
        $(this).addClass("card_podcast_contraida")
      }

    }

  })
})

//se agregan funcionalidades expandida segun los arrows prev
$(".owl_slider_main_podcasts .owl-nav .owl-prev").click(function () {

  var parenElement = $(this).closest(".s-c-cardPodcast");

  let selectedIndex;

  var numberOfPodcastCards =  parenElement.find(".owl_slider_main_podcasts .owl-stage-outer .owl-item").length

  parenElement.find(
    ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
  ).each(function (index, element) {

    if(numberOfPodcastCards == 2){

      if ($(this).hasClass("card_podcast_dual_expandida")) {
        $(this)
          .addClass("card_podcast_dual_contraida")
          .removeClass("card_podcast_dual_expandida");
      
        selectedIndex = index;
      }

    }else{

      if ($(this).hasClass("card_podcast_expandida")) {
          $(this)
            .addClass("card_podcast_contraida")
            .removeClass("card_podcast_expandida");
          
          selectedIndex = index;
      }
    }

  });

  if(numberOfPodcastCards == 2){
    parenElement.find(
      ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
    )
      .eq(selectedIndex - 1)
      .addClass("card_podcast_dual_expandida")
      .removeClass("card_podcast_dual_contraida")

  }else{
    parenElement.find(
      ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
    )
      .eq(selectedIndex - 1)
      .addClass("card_podcast_expandida")
      .removeClass("card_podcast_contraida")
  }

  //se agrega funcionalidades de expandida a los dots segun el arrow seleccionado
  parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-dots button")
    .eq(selectedIndex)
    .removeClass("active");
  parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-dots button")
    .eq(selectedIndex - 1)
    .addClass("active");

  if (selectedIndex - 1 === 0) {
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").addClass("disabled");
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").attr("disabled","disabled");
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").css("pointer-events","none");

    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeClass("disabled");
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").css("pointer-events","auto");
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeAttr("disabled","disabled");
  }

  //activar el boton next cada vez que se presione el boton prev y el boton next esté disabled
  if (parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").hasClass("disabled")) {
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeClass(
      "disabled"
    );
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeAttr(
      "disabled"
    );
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").css(
      "pointer-events",
      "auto"
    );
  }
 
});
//agregando comentario


//se agregan funcionalidades expandida segun los arrows next
$(".owl_slider_main_podcasts .owl-nav .owl-next").click(function () {

  var parenElement = $(this).closest(".s-c-cardPodcast");
  let selectedIndex;

  var numberOfPodcastCards =  parenElement.find(".owl_slider_main_podcasts .owl-stage-outer .owl-item").length

  parenElement.find(".card_carrusel_podcast_principal").removeAttr("style");

  parenElement.find(
    ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
  ).each(function (index, element) {

    if(numberOfPodcastCards == 2){
      if ($(this).hasClass("card_podcast_dual_expandida")) {
        $(this)
          .addClass("card_podcast_dual_contraida")
          .removeClass("card_podcast_dual_expandida");

        selectedIndex = index;
      }
    }else{
      if ($(this).hasClass("card_podcast_expandida")) {
        $(this)
          .addClass("card_podcast_contraida")
          .removeClass("card_podcast_expandida");

        selectedIndex = index;
      }
    }
  });

  if(numberOfPodcastCards == 2){
    parenElement.find(
      ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
    )
      .eq(selectedIndex + 1)
      .addClass("card_podcast_dual_expandida")
      .removeClass("card_podcast_dual_contraida")

  }else{
    parenElement.find(
      ".owl_slider_main_podcasts .owl-stage-outer .owl-item"
    )
      .eq(selectedIndex + 1)
      .addClass("card_podcast_expandida")
      .removeClass("card_podcast_contraida")

  }

  //// se agrega funcionalidades de expandida a los dots segun el arrow seleccionado
  parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-dots button")
    .eq(selectedIndex)
    .removeClass("active");
    parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-dots button")
    .eq(selectedIndex + 1)
    .addClass("active");

  if (
    selectedIndex + 1 ===
    parenElement.find(
      ".owl_slider_main_podcasts .owl-stage-outer .owl-item .item .card_carrusel_podcast_principal"
    ).length -
      1
  ) {
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").addClass("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").css("pointer-events","none");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").attr("disabled","disabled");

      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").removeClass("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").removeAttr("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").css("pointer-events","auto");
  }
  else {
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeClass("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").css("pointer-events","auto");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-next:not(div)").removeAttr("disabled","disabled");
    
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").removeClass("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").removeAttr("disabled");
      parenElement.find(".owl_slider_main_podcasts .owl-nav .owl-prev:not(div)").css("pointer-events","auto");
  }

});
  // <!-- Final Component HU-029 Card Podcast  -->

function cortarTexto(maxCaracteres, elemento, esPrimeraTab) {
  let textoOriginal = $(elemento).text();

  if (resolutionActual < 1199) {
    if (!esPrimeraTab && textoOriginal.length > maxCaracteres) {
      let regex = new RegExp(`^(.{0,${maxCaracteres}}\\S*\\s)`);
      let match = textoOriginal.match(regex);
      
      if (match && match[1]) {
        let nuevoTexto = match[1];
        $(elemento).text(nuevoTexto);
      }
    }
  } else {
    if (textoOriginal.length > maxCaracteres) {
      let regex = new RegExp(`^(.{0,${maxCaracteres}}\\S*\\s)`);
      let match = textoOriginal.match(regex);
      
      if (match && match[1]) {
        let nuevoTexto = match[1];
        $(elemento).text(nuevoTexto);
      }
    }
  }
}
  if(resolutionActual > 1200) {
    $('.s-theme-V .s-c-acordeon-L__tab .s-o-tabs__list .s-o-tabs__li').removeClass("active");
    $('.s-theme-V .s-c-acordeon-L__tab .s-o-tabs__list .s-o-tabs__li .s-o-tabs__toggle').removeClass("s-js-dropdown__toggle--active s-t-tabs__toggle--active active");
  }
  $('.s-theme-V .s-c-acordeon-L__tab .s-o-tabs__list .s-o-tabs__li .s-o-dropdown__content p').each(function() {
    let tabButton = $(this).parents(".s-o-tabs__li").find('.s-o-dropdown__toggle_hover');
    let tabComponent = $(this).parents(".s-o-tabs__li");
    let component = $(this).parents('.s-o-tabs__li');
    let esPrimeraTab = $(this).parents('.s-o-tabs__li').hasClass('active_one');
    let textoCompleto = $(this).text();
    
    cortarTexto(50, $(this), esPrimeraTab);

    if (resolutionActual > 1024) {
      $(this).parents('.s-o-tabs__li').hover(
        function() {
          $(this).find('.s-o-dropdown__content p').text(textoCompleto);
        },
        function() {
          cortarTexto(50, $(this).find('.s-o-dropdown__content p'), false);
        }
      );
    } else {
      tabButton.click(function (e) {
          $(this).parents(".s-o-tabs__li").toggleClass("active");
          $(".s-o-tabs__li").not($(this).parents(".s-o-tabs__li")).removeClass("active");
          e.preventDefault();
          let idContent = "#" + $(this).attr("id") + "-content";
          if (!$(this).hasClass("s-t-tabs__toggle--active")) {
            $(this)
              .parents(".s-o-tabs__list")
              .find(".s-o-tabs__toggle")
              .each(function () {
                $(this).removeClass("s-t-tabs__toggle--active");
                $(this).attr("aria-selected", "false");
              });
            $(this).addClass("s-t-tabs__toggle--active");
            $(this).attr("aria-selected", "true");
            let idContainer =
              "#" + $(this).parents(".s-o-tabs__list").attr("id") + "-content";
            $(idContainer)
              .find(".s-o-tabs__container")
              .each(function () {
                if ($(this).hasClass("s-js-view")) {
                  $(this).addClass("s-js-hidden__hover");
                  $(this).removeClass("s-js-view");
                }
              });
            $(idContent).addClass("s-js-view").removeClass("s-js-hidden__hover");
          }
      });
      $(this).parents('.s-o-tabs__li').on('click', function() {
        let dropdownContent = $(this).find('.s-o-dropdown__content p');
        if(tabComponent.hasClass('active')) {
          dropdownContent.text(textoCompleto);
        } else {
          cortarTexto(50, dropdownContent, false);
          $(this).find('.s-o-tabs__toggle').removeClass('s-t-tabs__toggle--active');
        }
      });

      $(document).on('click', function(event) {
        let tabsLi = component;
        if (!tabsLi.is(event.target) && tabsLi.has(event.target).length === 0) {
          cortarTexto(50, tabsLi.find('.s-o-dropdown__content p'));
          tabsLi.find('.s-o-tabs__toggle').removeClass('s-t-tabs__toggle--active active');
          tabComponent.removeClass('active')
        }
      });
    }
  });

  $('.s-c-expandable-horizontal-cards').suraExpandableHorizontalCards();

  // BEGIN HU032
  ;(function() {
    const initCardHoverAnimated = () => {
      $('.s-c-card-hover-animated--js').each(function () {
        const jqEl = $(this);
        const cardTopContent = jqEl.find('.s-c-card-top-content').removeAttr('style');
        const topIcon = cardTopContent.find('.s-c-card-icon').removeAttr('style');
        const cardTitle = cardTopContent.find('.s-c-card-title').removeAttr('style');
        const cardDescription = cardTopContent.find('.s-c-card-description').removeAttr('style');
        const actionButton = jqEl.find('.s-c-card-content-icon').removeAttr('style');
        const globalAnimationConf = {
          easing: "easeOutQuad",
          duration: 300
        };

        if ($(window).width() <= 1024) {
          return;
        }

        let topIconMarginleft = 0;
        let cardTitleMarginleft = 0;
        let cardDescriptionHeight = 0;

        topIcon.css({'margin-left': 'auto', 'margin-right': 'auto'});
        cardTitle.css({'margin-left': 'auto', 'margin-right': 'auto'});

        const prepareElsForAnimation = () => {
          const availableSize = (jqEl.outerWidth() - 50) - 65;
          cardDescription.css({
            'width': availableSize,
            'transform': 'translateX(100%)'
          });

          cardDescriptionHeight = cardDescription.height();

          if (topIconMarginleft === 0) {
            topIconMarginleft = topIcon.css('margin-left');
          }

          if (cardTitleMarginleft === 0) {
            cardTitleMarginleft = cardTitle.css('margin-left');
          }
        };

        const animateIn = () => {
          prepareElsForAnimation();

          anime({
            ...globalAnimationConf,
            targets: cardTopContent.toArray(),
            paddingRight: 90,
            begin: () => {
              cardTitle.css({
                'text-align': 'left'
              })
            }
          });

          topIcon.css('margin-left', topIconMarginleft);
          cardTitle.css('margin-left', cardTitleMarginleft);

          anime({
            ...globalAnimationConf,
            targets: topIcon.toArray(),
            marginLeft: 0,
            opacity: 0,
            height: 0
          });

          anime({
            ...globalAnimationConf,
            targets: cardTitle.toArray(),
            marginLeft: 0,
            marginBottom: cardDescriptionHeight
          });

          anime({
            ...globalAnimationConf,
            targets: actionButton.toArray(),
            opacity: 1
          });

          anime({
            ...globalAnimationConf,
            targets: cardDescription.toArray(),
            opacity: 1,
            translateX: 0
          })
        };

        const animateOut = () => {
          anime({
            ...globalAnimationConf,
            targets: cardTopContent.toArray(),
            paddingRight: 0,
            begin: () => {
              cardTitle.css({
                'text-align': 'center'
              })
            }
          });

          anime({
            ...globalAnimationConf,
            targets: topIcon.toArray(),
            marginLeft: topIconMarginleft,
            opacity: 1,
            height: 56
          });

          anime({
            ...globalAnimationConf,
            targets: cardTitle.toArray(),
            marginLeft: cardTitleMarginleft,
            marginBottom: 2
          });

          anime({
            ...globalAnimationConf,
            targets: actionButton.toArray(),
            opacity: 0
          })

          anime({
            ...globalAnimationConf,
            targets: cardDescription.toArray(),
            opacity: 0,
            translateX: '100%'
          });
        };

        jqEl.hover(animateIn, animateOut);
        actionButton.children('a').on('focus', animateIn);
        actionButton.children('a').on('blur', animateOut);

      });
    };

    let resizerTimer;
    initCardHoverAnimated();

    $(window).resize(function () {
      //$('.s-c-card-hover-animated--js').unbind('mouseenter mouseleave focus blur')
      if (resizerTimer) clearTimeout(resizerTimer);
      resizerTimer = setTimeout(function () {
        initCardHoverAnimated();
      }, 300);
    });
  })();




  // BEGIN HU052
  $('.s-c-card-hover-blur').each(function() {
    let resizerTimer;
    const jqEl = $(this);
    const cardContent = jqEl.find('.s-c-card-hover-blur-content');
    const cardImage = jqEl.find('.s-c-card-hover-blur-image');
    const cardContentTitle = jqEl.find('.s-c-card-hover-blur-title');
    let blurContentHeight = 0;
    const isMobile = window.outerWidth <= 768;

    const calculateItemSize = () => {
      cardContent.css('height', '');
      cardContent.css('top', '');
      blurContentHeight = cardContent.outerHeight(true);
      cardContent.css('height', blurContentHeight);
      cardContent.css('top', -Math.abs(cardContentTitle.outerHeight(true)));
    };

    calculateItemSize();

    const openCard = () => {
      cardContent.css({
        'top': -Math.abs(cardImage.outerHeight(true)),
        'height': '100%'
      }).addClass('s-c-opened__js');
    };

    const closeCard = () => {
      cardContent.css('top', -Math.abs(cardContentTitle.outerHeight(true)));
      cardContent.css('height', blurContentHeight);
      cardContent.removeClass('s-c-opened__js');
    };

    jqEl.hover(openCard, closeCard)
      .click(function() {
        if (isMobile) {
          if (cardContent.hasClass('s-c-opened__js')) {
            closeCard();
          } else {
            openCard();
          }
        }
      });

    $(window).resize(function () {
      if (resizerTimer) clearTimeout(resizerTimer);
      resizerTimer = setTimeout(function () {
        calculateItemSize();
      }, 500);
    });
  });
  // END HU052

  // BEGIN HU072
  $('.s-c-card-hover-blur-container').each(function() {
    let resizerTimer = null;
    let owl = $(".owl-carousel");

    const owlCarouselOpts = {
      loop: false,
      nav: true,
      items: 2,
      dots: false,
      margin: 16,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
      ],
      responsive: {
        0: {
          items: 1.5,
          stagePadding: 0,
          mouseDrag: true,
          touchDrag: true,
          autoWidth: true
        }
      },
      onInitialized: function (event) {
        let element = jQuery(event.target);
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      },
    };

    if ($(window).width() <= 1024) {
      owl.owlCarousel(owlCarouselOpts);
    } else {
      owl.addClass('off');
    }

    const mobileManager = () => {
      if ($(window).width() <= 1024) {
        if ( $('.owl-carousel').hasClass('off') ) {
          owl.owlCarousel(owlCarouselOpts);
          owl.removeClass("off");
        }
      } else {
        if (!$(".owl-carousel").hasClass("off")) {
          owl.addClass("off").trigger("destroy.owl.carousel");
          owl.find(".owl-stage-outer").children(":eq(0)").unwrap();
        }
      }
    };

    $(window).resize(function () {
      if (resizerTimer) clearTimeout(resizerTimer);
      resizerTimer = setTimeout(function () {
        mobileManager();
      }, 150);
    });
  });
  // END HU072

  //64-1

  const elementosTabs = {
    tab: $('.s-js-tab-banner-contenido__trigger'),
    titulo: $('.s-js-tab-banner-contenido__titulo'),
  }

  const elementosColoresTab = {
    tab: $('.s-js-tab-banner-contenido__tab'),
    titulo: $('.s-js-tab-banner-contenido__titulo'),
  }

  const tabColorChange = [
    elementosColoresTab.tab,
    elementosColoresTab.titulo,
  ];

  const colorChanger = () => {
    tabColorChange.forEach(( element ) => {
      const abierto = element.data('color-open'),
            cerrado = element.data('color-close');
  
      element.toggleClass(abierto).toggleClass(cerrado);
    });
  }


  const bannerDeployer = {
    banner: $('.s-js-tab-banner-contenido__banner')
  }


  if (resolutionActual >= 1025) {
    elementosTabs.tab.on('click', function(){
      // -------------------------------------------------------
      let body = $(this).parent().find('.s-js-tab-banner-contenido__body');
      if($(this).hasClass('active')){
        $(this).parent().removeClass('open');
        $(this).removeClass('active');
        body.hide();
      }else{
        elementosTabs.tab.each(function(){
          $(this).parent().removeClass('open');
          $(this).removeClass('active');
          $(this).parent().find('.s-js-tab-banner-contenido__body').hide();
        });
        $(this).parent().addClass('open');
        $(this).addClass('active');
        body.hide();
      }
      let tabColor = $(this).closest('.s-js-tab-banner-contenido__tab');
      let tabClick = $(this);
      tabColor.addClass('open');
      tabClick.addClass('active');
      body.show();
      imprimeContenidoDesktop(); 
    });
  } else {
    elementosTabs.tab.on('click', function(){
      let tab = $(this).parent();
      let body = tab.find('.s-js-tab-banner-contenido__body');
      let parrafo = tab.find('.s-c-tab-banner-contenido__parrafo');
      let banner = tab.find('.s-c-tab-banner-contenido__banner');
      let isOpen = tab.hasClass('open');
      elementosTabs.tab.each(function(){
        let currentTab = $(this).parent();
        currentTab.removeClass('open');
        currentTab.find('.s-c-tab-banner-contenido__banner').hide();
        currentTab.find('.s-c-tab-banner-contenido__parrafo').show();
        $(this).removeClass('active');
      });
      if (!isOpen) {
        tab.addClass('open');
        $(this).addClass('active');
        body.show();
        parrafo.hide();
        banner.show();
      }
    });
  }
  // Obtén todos los elementos con la clase ".s-c-tab-banner-contenido__tab"
const tabs = document.querySelectorAll('.s-c-tab-banner-contenido__tab');

// Itera sobre cada tab
tabs.forEach(tab => {
    // Encuentra el elemento con la clase ".s-c-tab-banner-contenido__parrafo" dentro de la tab
    const parrafo = tab.querySelector('.s-c-tab-banner-contenido__parrafo');

    // Verifica si el elemento de párrafo tiene texto
    if (parrafo && parrafo.textContent.trim().length > 0) {
        // Si tiene texto, aplica el gap de 15px en desktop y 16px en mobile
        tab.style.gap = window.innerWidth >= 1025 ? '15px' : '16px';
    } else {
        // Si no tiene texto, establece el gap a 0
        tab.style.gap = '0';
    }
});

// Agrega un listener para ajustar el gap cuando cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    tabs.forEach(tab => {
        const parrafo = tab.querySelector('.s-c-tab-banner-contenido__parrafo');
        if (parrafo && parrafo.textContent.trim().length > 0) {
            tab.style.gap = window.innerWidth >= 1025 ? '15px' : '16px';
        } else {
            tab.style.gap = '0';
        }
    });
});
  const imprimeContenidoDesktop = () => {
    let tabActivo = $('.s-js-tab-banner-contenido__trigger.active'),
        receptorContenido = $('.s-js-tab-banner-contenido__banner'),
        contenido = tabActivo.parent().find('.s-js-tab-banner-contenido__body').find('.s-c-tab-banner-contenido__banner').html();
    receptorContenido.html(contenido);
  }
  const imprimeColoresDesktop = () => {
    let tabActivo = $('.s-js-tab-banner-contenido__trigger.active'),
        parrafoTxt = tabActivo.parent().find('.s-c-tab-banner-contenido__parrafo');
    tabActivo.parent().addClass("open");
    parrafoTxt.parent().show();
  }

  const ocultarBannerMobile = () => {
    let tabActivoMobile = $('.s-js-tab-banner-contenido__trigger.active'),
        txtMobile = tabActivoMobile.parent().find('.s-js-tab-banner-contenido__body').find('.s-c-tab-banner-contenido__parrafo'),
        contenidoMobile = tabActivoMobile.parent().find('.s-js-tab-banner-contenido__body').find('.s-c-tab-banner-contenido__banner');
    txtMobile.hide();
    contenidoMobile.show();
    tabActivoMobile.parent().addClass("open");
  }

  if (resolutionActual >= 1025) {
    imprimeColoresDesktop();
    imprimeContenidoDesktop();
  } else {
    ocultarBannerMobile();
  }

    $('.s-c-tab-banner-contenido').each(function() {

      // Función para cambiar el título del banner
      function cambiarTituloBanner(tabIndex) {
        // Obtener el título de la pestaña correspondiente
        var tituloTab = document.querySelector('#boton-acordion-tab-' + tabIndex + ' .s-c-tab-banner-contenido__title');
        
        // Obtener el contenedor del título del banner correspondiente
        var tituloBanner = document.querySelector('#contenidoBanner-' + tabIndex + ' .title-internal_banner');
        
        // Actualizar el título del banner con el título de la pestaña
        if (tituloBanner) {
            tituloBanner.textContent = tituloTab.textContent;
        }
      }

      //llamar a la función al hacer clic en una pestaña
      var numeroDeTabs = document.querySelectorAll('.s-o-dropdown.accordion-content.bloque').length;

      // Asignar eventos de clic a cada pestaña
      for (var i = 1; i <= numeroDeTabs; i++) {
          document.querySelector('#boton-acordion-tab-' + i).addEventListener('click', function(index) {
              return function() {
                  cambiarTituloBanner(index);
              };
          }(i));
      }


      // Función para verificar el ancho de la pantalla y realizar acciones en consecuencia
      function handleResponsiveDesign() {
              const windowWidth = $(window).width();
    
              if (windowWidth < 1200) {
                  // Mover carruseles y reemplazar los elementos <p>
                  $(".s-o-tab-banner-contenido_accordion .accordion-content").each(function (index) {
                  const carruselId = "contenidoBanner-" + (index + 1);
                  const carruselContainer = $(".banner-tab-contenido-container").find("#" + carruselId);
    
                  // Asignar evento click al botón correspondiente
                  const botonId = "boton-acordion-tab-" + (index + 1);
                  $("#" + botonId).on("click", function () {
                      // Ocultar todos los carruseles
                      $(".s-c-banner-contenido-tab").hide();
    
                      // Mostrar el carrusel correspondiente
                      $("#" + carruselId).show();
                  });
    
                  // Mover el carrusel
                  carruselContainer.insertAfter($("#" + botonId));
                  });
              }
      }
    
      // Llamar a la función al cargar la página y al cambiar el tamaño de la pantalla
      handleResponsiveDesign();
    
      $(window).resize(function () {
          handleResponsiveDesign();
      });
    });
 
    $('.s-c-tab-banner-contenido').each(function() {
      const tabInstance = $(this);

      const acordeonParrafos = $(".accordion-custom.contenido p");
      const txtSelect = $("#txt-select");
      const windowWidth = $(window).width();
    
      acordeonParrafos.each(function (index, parrafo) {
          const contenido = $(parrafo).html();
          txtSelect.find(`div[class="sura${index + 1}"] p`).html(contenido);
          if ($(parrafo).attr('class')) {
              var classColor = $(parrafo).attr('class')
              txtSelect.find(`div[class="sura${index + 1}"] p`).addClass(classColor)
          }
      });
    
      const bloques = document.querySelectorAll("#bloque-acordion-tab");
      const botones = document.querySelectorAll(".boton");
      botones.forEach((boton, index) => {
          const bloque = bloques[index];
          boton.addEventListener("click", () => {
              const isExpanded = bloque.classList.contains("active");
              const icono = bloque.querySelector(".s-o-icon i");
              bloques.forEach((bloque) => {
                  if (!isExpanded) {
                      bloque.classList.add("active");
                      bloque.setAttribute("aria-expanded", "true");
                      icono.classList.add("s-iconDirectionDown1")
                      icono.classList.remove("s-iconWeightRegular3");
                      icono.style.color = "#FFFFFF"; // Cambia el color a blanco cuando está expandido
                  }else{
                    bloque.classList.remove("active");
                    bloque.setAttribute("aria-expanded", "false");
                    icono.classList.add("s-iconWeightRegular3");
                    icono.style.color = "#2D6DF6"; // Cambia el color a azul cuando no está expandido
                  }
              });
              
              
          });

          const elementosTab = {
            parrafos: $('.s-c-tab-banner-contenido__parrafo'),
            titulo: $('.s-c-tab-banner-contenido__title'),
            tab: $('.s-js-tab-banner-contenido__tab'),
          }

          const ChangeColor = [
            elementosTab.parrafos,
            elementosTab.titulo,
            elementosTab.tab
          ]

          const changeClass = () => {
            const activeTab = $('s-o-dropdown.accordion-content.bloque.active')

            ChangeColor.forEach((element) => {
              const colorOpen = element.data('color-open'),
                    colorClose = element.data('color-close');

              element.toggleClass(colorOpen, activeTab).toggleClass(colorClose, !activeTab)
            });
          }

          elementosTab.tab.on('click', function(){
            $(this).toggleClass('active');
          });

    
          bloque.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  boton.click();
              }
          });
      });
    
      const tabButtons = tabInstance.find(".boton");
      const carruseles = tabInstance.find(".s-c-banner-contenido-tab");
    function showTab(tabIndex) {
    carruseles.each(function(index) {
      if (index === tabIndex) {
        $(this).css("display", "block");
      } else {
        $(this).css("display", "none");
      }
    });
    }
    tabButtons.each(function(index) {
      $(this).on("click", function() {
      showTab(index);
    });
    });
    showTab(0);
    
      $(".s-o-contenido_tab-select-content").on("click", function () {
          $(".s-c-banner-contenido-tab").hide();
          const index = $(this).index();
          showTab(index);
      });
    
      var countItem = 1;
      $(".s-o-tab-banner-contenido_accordion .accordion-content .accordion-item .s-c-tab-banner-contenido__title").each(function (index) {
          let classActive = ''
          if (index == 0) {
              classActive = 'active'
          }
          else {
              classActive = ''
          }
          var option = '<li id="sura' + countItem + '" class="' + classActive + '">' + $(this).text() + "</li>";
          $(".s-c-tab-banner-contenido_container .mobile-select .s-o-dropdown .s-o-dropdown__content").append(option);
          countItem = countItem + 1;
      });
    
      var countItemContent = 1;
      $(".s-o-tab-banner-contenido_accordion .accordion-content ").each(function (index) {
          let classActive = ''
          if (index == 0) {
              classActive = 'active'
          }
          else {
              classActive = ''
          }
          var parrafo = $(this).find(".contenido p").text().trim();
          if (parrafo.length > 0) {
              let botonSelect;
              if($(this).find("a").length !==0){
                  botonSelect = $(this).find("a").get(0).outerHTML;
              }
              else{
                  botonSelect = ''
              }
              var content = '<div class="container_txt_select ' + classActive +   '" id="sura' + countItemContent + '"><p>' + parrafo + '</p>' + botonSelect + "</div>";
              $(".s-o-tab-banner-contenido_text").append(content);
              countItemContent = countItemContent + 1;
          } else {
              var content = '<div class="container_txt_select ' + classActive + '" id="sura' + countItemContent + '"><p>Sin contenido</p></div>';
              $(".s-o-tab-banner-contenido_text").append(content);
              countItemContent = countItemContent + 1;
          }
      });
    
      function titleDropdown() {
          var title = $(".s-c-tab-banner-contenido_container .mobile-select .s-o-dropdown .s-o-dropdown__content li.active").text()
          $(".s-c-tab-banner-contenido_container .mobile-select .s-o-dropdown .s-o-dropdown__heading .s-o-dropdown__title").text(title)
      }
      titleDropdown()
    
      
      
    
    });

    //HU051 dentro de la HU070
    function minHeightCardTextimonyDesktop() {
      $(".s-c-cards-group").each(function () {
        var minHeight = 0;
        $(this)
          .find(".s-o-cards-group__item")
          .each(function () {
            if ($(this).find(".s-c-card-testimony").outerHeight() > minHeight) {
              minHeight = $(this).find(".s-c-card-testimony").outerHeight();
            }
          });
        minHeight = minHeight - 256;
        $(this)
          .find(".s-o-cards-group__item")
          .each(function () {
            $(this)
              .find(".s-c-card-testimony .s-c-card-testimony__txt-content")
              .css({ minHeight: minHeight + "px" });
          });
      });
    }

    function minHeightCardTextimonyMobile() {
      $(".s-c-cards-group").each(function () {
        var minHeight = 0;
        if ($(this).find(".owl-stage").outerHeight() > minHeight) {
          minHeight = $(this).find(".owl-stage").outerHeight();
        }

        minHeight = minHeight - 145;
        $(this)
          .find(".s-o-cards-group__item")
          .each(function () {
            $(this)
              .find(".s-c-card-testimony .s-c-card-testimony__txt-content")
              .css({ minHeight: minHeight + "px" });
          });
      });
    }

    if (resolutionActual >= 1025) {
      minHeightCardTextimonyDesktop();
    } else {
      minHeightCardTextimonyMobile();
    }

    $(window).resize(function () {
      if (resolutionActual >= 1025) {
        minHeightCardTextimonyDesktop();
      } else {
        minHeightCardTextimonyMobile();
      }
    });

  // HU62-2

  const elementosBanner = {
    contenidoMixto: $('.s-js-banner-horizontal-imgtext--content'),
    imagen: $('.s-js-banner-horizontal-imgtext--imagen'),
    titulo: $('.s-js-banner-horizontal-imgtext--titulo'),
    subtitulo: $('.s-js-banner-horizontal-imgtext--subtitulo'),
    parrafo: $('.s-js-banner-horizontal-imgtext--parrafo'),
    boton: $('.s-js-banner-horizontal-imgtext--boton'),
    altMobile: $('.s-js-banner-horizontal-imgtext--imagen').data('alt-mobile'),
    altDesktop: $('.s-js-banner-horizontal-imgtext--imagen').data('alt-desktop')
  }

  const textColorChange = [
    elementosBanner.subtitulo,
    elementosBanner.titulo,
    elementosBanner.parrafo,
    elementosBanner.boton
  ];

  const altoMixContent = elementosBanner.contenidoMixto.outerHeight();

  const updateClasses = () => {
    const winWidth = $(window).width(),
          isMobile = winWidth <= 1024;
    
    if(isMobile){
      elementosBanner.imagen.css('height', altoMixContent + 'px');
      elementosBanner.imagen.find('img').attr('alt', elementosBanner.altMobile).attr('title', elementosBanner.altMobile);
    }else{
      elementosBanner.imagen.css('height', '');
      elementosBanner.imagen.find('img').attr('alt', elementosBanner.altDesktop).attr('title', elementosBanner.altDesktop);
    }

    textColorChange.forEach(( element ) => {
      const mobileColor = element.data('color-mobile'),
            desktopColor = element.data('color-desktop');

      element.toggleClass(mobileColor, isMobile).toggleClass(desktopColor, !isMobile);
    });
  };
  
  $(window).on('resize', updateClasses);
  updateClasses();

  // FIN HU62-2

  

  // HU-090 _Tira_Carrusel_Accesos_frecuentes
  
  let owlSettingsCarouselStrip = {
    loop: false,
    nav: false,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    //stagePadding:100,
    margin: 0,
    items: 2, 
    responsive: {
      0: {
        items: 2,
        margin: 0,
        stagePadding: 0,
        mouseDrag: false,
        touchDrag: false,
        autoWidth: false,
      },

      1024: {
        items: 4.5,
        margin: 0,
        autoWidth: true
      },

      1025: {
        items: 5,
        margin: 0,
        autoWidth: false,
      },
      1440: {
        items: 6,
        margin: 0,
        autoWidth: true,
      },
      1920: {
        items: 6,
        margin: 0,
        autoWidth: true,
      },
    },
    navText: [
      "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
      "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
    onInitialized: function (event) {
      let element = jQuery(event.target);
      element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
      element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
    },
    onTranslated: function (event) {

     

    },
  };
  
  $(".owl_carouselStrip").owlCarousel(owlSettingsCarouselStrip);
  
  var cardCountCarouselStrip = $(".s-c-carouselStrip__item-dots .item").length;
  if (cardCountCarouselStrip < 5) {
    $(".s-c-carouselStrip .owl-dots").hide();
  }


  function returnIdCarouselStrip(card){
    var idCarousel;
    card.parents().each(function () {
      if ($(this).hasClass("s-c-carouselStrip")) {
        idCarousel = $(this).attr('id');
      }
    });
    return idCarousel;
  }

  if ($(window).width() > 1025) {
    let itemsCarouselStrip = document.querySelectorAll(".owl_carouselStrip");
    function hiddenOwlControl(arrayItems){
      arrayItems.forEach(i => {
        let countItemOwl = i.children[0].childNodes[0].childElementCount;
        let countChildNodes = i.children[0].childNodes[0].childNodes; 
        let owlStageCarouselStrip = i.children[0].childNodes[0];
        //console.log(countItemOwl) 
        if (countItemOwl <= 4) {
          i.nextElementSibling.style.display = 'none';
          owlStageCarouselStrip.classList.add('w-100');
          
        } 
        else if (countItemOwl === 5 ) {
          i.nextElementSibling.style.display = 'none';
          owlStageCarouselStrip.classList.add('w-101');
          //i.style.width="288px"
        } 
        else {
          countChildNodes.forEach(i => {
              i.childNodes[0].children[0].classList.add('activeAllItem');              
          });
        }

      });
    };
  
    hiddenOwlControl(itemsCarouselStrip);
    //WidthOwlControl(itemsCarouselStrip)
  } 


  function removeSelectedCarouselStrip(carousel) {
    $("#" + carousel + " .s-c-carouselStrip__item").each(function () {
      if ($(this).hasClass("item-active")) {
        $(this).removeClass("item-active");
      }
    });
  }

  /*
  $(".s-c-carouselStrip .s-c-carouselStrip__item-dots .owl-next").click(function() {
    var carousel = $(this).closest('.s-c-carouselStrip');
    var carouselId = carousel.attr('id');
    $("#" + carouselId).find(".owl-stage").css("padding-left", "42px");
});

$(".s-c-carouselStrip .s-c-carouselStrip__item-dots .owl-prev").click(function() {
  var carousel = $(this).closest('.s-c-carouselStrip');
  var carouselId = carousel.attr('id');
  $("#" + carouselId).find(".owl-stage").css("padding-left", "0px");
});
*/  



  $(".s-c-carouselStrip .s-c-carouselStrip__item-dots .owl-next").click(  
    
    function () {    
      var idCarousel = returnIdCarouselStrip($(this));
      activateNextDotCarouselStrip(idCarousel);
      var carousel = $("#"+idCarousel+" .owl_carouselStrip");
      if(carousel.find(".owl-item:last").hasClass("active")){
        if(resolutionActual>1024 && resolutionActual <1920){
          carousel.find(".owl-stage").css("padding-left","62px")
        }
        if(resolutionActual>1919){
          carousel.find(".owl-stage").css("padding-left", "100px");  
        }       
      }    
        //carousel.find(".owl-stage").css("padding-left", "42px");                 
      carousel.trigger("next.owl.carousel", [500]);
    }
  );
  
  $(".s-c-carouselStrip .s-c-carouselStrip__item-dots .owl-prev").click(
    function () {    
      var idCarousel = returnIdCarouselStrip($(this))
      activatePrevDotCarouselStrip(idCarousel);
      var carousel = $("#"+idCarousel+" .owl_carouselStrip");
      carousel.find(".owl-stage").css("padding-left", "0px");
      carousel.trigger("prev.owl.carousel", [500]);
    }
  );
  
  function activateNextDotCarouselStrip(carousel) {
    var activeDot = $('.s-c-carouselStrip#'+carousel+' .owl-dots .owl-dot.active');
    let itemsDomFn = $('.s-c-carouselStrip#'+carousel+' .s-c-carouselStrip__item').length;
    if (activeDot.length>0) {
      var dotIndex = activeDot.data('card-index');

      activeDot.removeClass('active');
      var nextDotIndex = (dotIndex + 1) % (itemsDomFn + 1); 
      var nextDot = $('.s-c-carouselStrip#'+carousel+' .owl-dots .owl-dot[data-card-index="' + nextDotIndex + '"]');
      nextDot.addClass('active');
      if(nextDotIndex >= 1){
        $('.s-c-carouselStrip#'+carousel+' .owl-prev').prop('disabled', false);
        $('.s-c-carouselStrip#'+carousel+' .owl-prev').removeClass('disabled');
      }
      if (nextDotIndex === (itemsDomFn - 1) ) {
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').addClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').prop('disabled', true);
      } else {
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').removeClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').prop('disabled', false);
      }
  
      var carouselId = returnIdCarouselStrip($('.s-c-carouselStrip#' + carousel + ' .owl-dots .owl-dot.active'));
      removeSelectedCarouselStrip(carouselId);
      var selectedCardIndex = nextDotIndex;
      $("#" + carouselId + " .s-c-carouselStrip__item:eq(" + selectedCardIndex + ")").addClass("item-active");
  
    }
  }
  
  function activatePrevDotCarouselStrip(carousel) {
    var activeDot = $('.s-c-carouselStrip#'+carousel+' .owl-dots .owl-dot.active');
    if (activeDot.length) {
      var dotIndex = activeDot.data('card-index');
      activeDot.removeClass('active');
      var prevDotIndex = (dotIndex - 1 + 10) % 10; 
      var prevDot = $('.s-c-carouselStrip#'+carousel+' .owl-dots .owl-dot[data-card-index="' + prevDotIndex + '"]');
      prevDot.addClass('active');
      if (prevDotIndex === 0) {
        $('.s-c-carouselStrip#'+carousel+' .owl-prev').addClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-prev').prop('disabled', true);
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').removeClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').prop('disabled', false);
      } else {
        $('.s-c-carouselStrip#' + carousel + ' .owl-prev').removeClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-prev').prop('disabled', false);
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').removeClass('disabled');
        $('.s-c-carouselStrip#' + carousel + ' .owl-next').prop('disabled', false);
      }
  
      var carouselId = returnIdCarouselStrip($('.s-c-carouselStrip#' + carousel + ' .owl-dots .owl-dot.active'));
      removeSelectedCarouselStrip(carouselId);
      var selectedCardIndex = prevDotIndex;
      $("#" + carouselId + " .s-c-carouselStrip__item:eq(" + selectedCardIndex + ")").addClass("item-active");
  
    }
  }

  $(".s-c-carouselStrip__item:eq(0)").addClass("item-active");

  $(".s-c-carouselStrip").each(function() {
    $(this).find(".s-c-carouselStrip__item:eq(0)").addClass("item-active");
});





  // END HU-090 _Tira_Carrusel_Accesos_frecuentes

  // HU 025

  function ajustarAlturaContenedor(card) {
    var cards = $(
      ".s-c-tabs-overlapping-cards .s-c-card-solapada-tabs_card__item"
    );
    var heightInitial = card.outerHeight()
    $(".s-c-tabs-overlapping-cards .s-o-tabs__contents").css(
      "height",
      heightInitial + "px");
  }

  function activeFirstTab() {
    var $contenedorPrincipal = $(".s-c-tabs-overlapping-cards");

    if ($contenedorPrincipal.length > 0) {
      var $listTabs = $contenedorPrincipal.find(".s-o-tabs__toggle");
      var $listCards = $contenedorPrincipal.find(
        ".s-c-card-solapada-tabs_card"
      );

      if ($listTabs.length > 0) {
        // $listTabs.eq(0).addClass('s-t-tabs__toggle--active');
        // $listCards.eq(0).addClass('active').show();
        $listTabs.eq(0).click();
        if ($(window).width() > 1025) {
          ajustarAlturaContenedor($listCards.eq(0));
        }
      }
    }
  }

  activeFirstTab();
  // mobile
  if ($(window).width() < 1024) {
    $(".s-c-card-solapada-tabs_card").not(":first").hide();

    $(".s-c-tabs-overlapping-cards").each(function () {
      var $tabsContainer = $(this);

      $tabsContainer.find(".s-o-tabs__toggle").on("click", function () {
        var tabIndex = $(this).parent().index();
        var $activeCard = $tabsContainer.find(
          ".s-c-card-solapada-tabs_card.active"
        );

        $tabsContainer
          .find(".s-c-card-solapada-tabs_card")
          .removeClass("active")
          .hide();

        var $targetCard = $tabsContainer
          .find(".s-c-card-solapada-tabs_card")
          .eq(tabIndex);
        $targetCard.addClass("active").show();

        $tabsContainer.find(".s-o-tabs__toggle").attr("aria-selected", "false");
        $(this).attr("aria-selected", "true");
      });
    });
  }
  // desktop
  if ($(window).width() > 1025) {
    
    var dropdownSizes = [];
    var currentTab = 0;

    var screenWidth = $(window).width();
    var initialSize =
      screenWidth <= 1440 ? 1128 : screenWidth <= 1920 ? 1440 : screenWidth;

    $(".s-c-card-solapada-tabs_card").each(function () {
      dropdownSizes.push(initialSize);
      initialSize -= 40;
    });

    dropdownSizes.reverse();

    $(".s-c-card-solapada-tabs_card").not(":first").hide();

    $(".s-c-tabs-overlapping-cards").each(function () {
      var $tabsContainer = $(this);
      $tabsContainer
        .find(".s-o-tabs__toggle:first")
        .attr("aria-selected", "true");

      // EVENTO CLICK
      $tabsContainer.find(".s-o-tabs__toggle").on("click", function () {
        var tabIndex = $(this).parent().index();
        var $targetCard = $tabsContainer
          .find(".s-c-card-solapada-tabs_card")
          .eq(tabIndex);

        var activeCards = document.querySelectorAll(
          ".s-c-card-solapada-tabs_card.active"
        ).length;

        if (tabIndex >= activeCards) {
          // Mostrar la tarjeta correspondiente y las anteriores
          for (var i = 0; i <= tabIndex; i++) {
            var $tarjeta = $tabsContainer
              .find(".s-c-card-solapada-tabs_card")
              .eq(i);

            mostrarTarjeta(
              $tarjeta,
              $targetCard,
              24 * i,
              dropdownSizes[dropdownSizes.length - 1 - tabIndex + i]
            );
          }
          var topValue = 24 * i;
        } else {
          for (
            var i = $tabsContainer.find(".s-o-tabs__toggle").length - 1;
            i >= 0;
            i--
          ) {
            let $tarjeta = $tabsContainer
              .find(".s-c-card-solapada-tabs_card")
              .eq(i);

            if (i > tabIndex) {
              $tarjeta.css({
                transform: "translateY(100%)",
                opacity: 0,
                "z-index": 0,
                transition: "transform 2s, opacity 2s",
                width: "100%",
              });
              // Quitar la clase 'active' de la tarjeta
              setTimeout(function () {
                $tarjeta.removeClass("active");
              }, 1000);
              
            } else {
              $tarjeta.css({
                width:
                  dropdownSizes[dropdownSizes.length - 1 - tabIndex + i] + "px",
              });
            }
          }
          var heightOverloaps = $targetCard.outerHeight() + (24*tabIndex) 
          $(".s-c-tabs-overlapping-cards .s-o-tabs__contents").css(
            "height",
            heightOverloaps + "px"
          );
        }

        return;
      });

      // ESTILOS PARA EL OVERLAPPING ASCENDENTE
      function mostrarTarjeta($tarjeta, $targetCard, topValue, widthCard) {
        if (!$tarjeta.hasClass("active")) {
          $tarjeta.addClass("active").css({
            transform: "translateY(100%)",
            "z-index": 1,

            transition: "transform 2s, opacity 1s",
          });

          setTimeout(function () {
            $tarjeta.css({
              transform: "translateY(" + topValue + "px)",
              opacity: 1,
            });
          }, 0);
          var sumHeigthCards = $tarjeta.outerHeight() + topValue;
          $(".s-c-tabs-overlapping-cards .s-o-tabs__contents").css(
            "height",
            sumHeigthCards + "px"
          );

        }

        $tarjeta.css({
          width: widthCard + "px",
        });
      }
    });

  }


/* function ajustarAlturaContenedorStabs() {
  var cards = $(".s-c-tab-banner .s-o-tabs__container");
console.log(cards)
  var cardMayorAltura;
  var alturaMaxima = 0;

  cards.each(function() {
    var alturaActual = $(this).outerHeight();
    if (alturaActual > alturaMaxima) {
      alturaMaxima = alturaActual;
      cardMayorAltura = $(this);
    }
  });
    $(".s-c-tab-banner .s-o-tabs__contents").css("min-height", alturaMaxima+ "px");
   
}

ajustarAlturaContenedorStabs();

setInterval(ajustarAlturaContenedorStabs, 1000); */
 

// fin HU 025
  
// HU 023

//HU023
function centerPaddingCarousel(element, index, length, number) {
  let doubleNumber = number * 2;
  if (index == 0) {
    element.find(".owl-stage").css({ paddingLeft: "0px" });
    element.find(".owl-stage").css({ paddingRight: doubleNumber + "px" });
  } else if (index == length) {
    element.find(".owl-stage").css({ paddingLeft: doubleNumber + "px" });
    element.find(".owl-stage").css({ paddingRight: "0px" });
  } else {
    element.find(".owl-stage").css({ paddingLeft: number + "px" });
    element.find(".owl-stage").css({ paddingRight: number + "px" });
  }
}

function searchIdCarousel(parent) {
  var id;
  parent.each(function () {
    if ($(this).hasClass("s-c-carrusel-job")) {
      id = $(this).find(".s-c-carrusel-job__content").attr("id");
    }
  });
  return id;
}


let configuracionesCarruselCardJob;

$(".s-c-carrusel-job .s-c-carrusel-job__content").each(function () {
    configuracionesCarruselCardJob = {
      items: 4,
      loop: false,
      // slideBy: 1,
      // nav: false,
      nav: true,
      // dotsEach: 1,
      // dots: false,
      dots: true,
      mouseDrag: false,
      navText: [
        "<span class='s-o-controller__icon' aria-label='Atras'><i class='s-iconWeightRegular2'></i>",
        "</span><span class='s-o-controller__icon' aria-label='Siguiente'><i class='s-iconWeightRegular3'></i></span>",
    ],
      responsive: {
        370: {
          items: 1,
          margin: 16,
          nav:true,
          autoWidth: false,
          dotsEach: 4,
          stagePadding: 50,
          slideBy: 4,
          dots: false,

          
          onInitialized: function (event) {
            let element = jQuery(event.target);
            element.find(".owl-stage").css({ paddingLeft: "0px" });
            element.find(".owl-stage").css({ paddingRight: "100px" });
            element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
            element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
            element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
            element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
            $(".owl-dot").attr("tabindex", "-1");
          },
          onTranslate: function (event) {
            let element = jQuery(event.target);
            let carousenLenght = event.item.count;
            let index = event.item.index;
            carousenLenght = carousenLenght - 1;
            centerPaddingCarousel(element, index, carousenLenght, 50);
          },
        },
        768: {
          stagePadding: 50,
          nav: true,
          autoWidth: false,
          dotsEach: 4,
          dots: false,
          mergeFit: true,
          items: 2,
          slideBy: 4,
          margin: 16,
          onInitialized: function (event) {
            let element = jQuery(event.target);
            element.find(".owl-stage").css({ paddingLeft: "0px" });
            element.find(".owl-stage").css({ paddingRight: "100px" });
            element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
            element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
            element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
            element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
            $(".owl-dot").attr("tabindex", "-1");
          },
          onTranslate: function (event) {
            let element = jQuery(event.target);
            let carousenLenght = event.item.count;
            let index = event.item.index;
            carousenLenght = carousenLenght - 2;
            centerPaddingCarousel(element, index, carousenLenght, 50);
          },
        },
        998: {
          nav: true,
          autoWidth: false,
          items: 3,
          dotsEach: true,
          margin: 16,
          stagePadding: 50,
          onInitialized: function (event) {
            let element = jQuery(event.target);
            element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
            element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
            $(".owl-dot").attr("tabindex", "-1");
          },
             onTranslate: function (event) {
            let element = jQuery(event.target);
            let carousenLenght = event.item.count;
            let index = event.item.index;
            carousenLenght = carousenLenght - 3;
            centerPaddingCarousel(element, index, carousenLenght, 50);
          },
        },
        1025: {
          items: 4,
          margin: 24,
          dotsEach: 4,
          slideBy: 4,
          onInitialized: function (event) {
            let element = jQuery(event.target);
            element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
            element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
            element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
            element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
            $(".owl-dot").attr("tabindex", "-1");
            let nav = element.find(".owl-nav");
            let dots = element.find(".owl-dots")
            dots.appendTo(nav);
            let buttonPrev = element.find(".owl-nav button.owl-next");
            dots.after(buttonPrev)
          },
        },
        1920: {
          items: 4,
          margin: 24,
          dotsEach: 4,
          slideBy: 4,
          onInitialized: function (event) {
            let element = jQuery(event.target);
            element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
            element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
            element.find(".owl-dots .owl-dot").addClass("s-o-controller__dots");
            element.find(".owl-dots .owl-dot span").addClass("s-o-controller__span");
            $(".owl-dot").attr("tabindex", "-1");
            let nav = element.find(".owl-nav");
            let dots = element.find(".owl-dots")
            dots.appendTo(nav);
            let buttonPrev = element.find(".owl-nav button.owl-next");
            dots.after(buttonPrev)
          },
        },
      },
    }

    $(".s-c-carrusel-job .s-c-carrusel-job__content").each(function () {
      var idCarousel = $(this).attr("id");
      $("#" + idCarousel).owlCarousel(configuracionesCarruselCardJob);
    });
    
  
});

$(
  ".s-c-carrusel-job .s-c-carrusel-job__controllers .s-c-carrusel-job__nav"
).click(function () {
  var idCarusel = searchIdCarousel($(this).parents());
  var lenghtCarousel = $("#" + idCarusel + "__controllers")
    .find(".s-o-controller__dots")
    .children().length;
  $("#" + idCarusel + "__controllers")
    .find(".s-o-controller__dots")
    .children()
    .each(function (item) {
      if ($(this).hasClass("s-is-controller__span--active")) {
        index = item;
      }
    });
  var itemCurrent = $("#" + idCarusel + "__controllers")
    .find(".s-o-controller__dots")
    .children()[index];
  var itemNext = $("#" + idCarusel + "__controllers")
    .find(".s-o-controller__dots")
    .children()[index + 1];
  var itemPrev = $("#" + idCarusel + "__controllers")
    .find(".s-o-controller__dots")
    .children()[index - 1];
  if (!$(this).hasClass("disabled")) {
    if ($(this).hasClass("s-is-carrusel-job__nav--next")) {
      $("#" + idCarusel).trigger("next.owl.carousel");
      $(itemCurrent).removeClass("s-is-controller__span--active");
      $(itemNext).addClass("s-is-controller__span--active");
      if (index == lenghtCarousel - 2) {
        $(this).addClass("disabled");
      } else if (index == 0) {
        if (
          $(this)
            .parent()
            .find(".s-is-carrusel-job__nav--prev")
            .hasClass("disabled")
        ) {
          $(this)
            .parent()
            .find(".s-is-carrusel-job__nav--prev")
            .removeClass("disabled");
        }
      }
    } else if ($(this).hasClass("s-is-carrusel-job__nav--prev")) {
      $("#" + idCarusel).trigger("prev.owl.carousel");
      $(itemCurrent).removeClass("s-is-controller__span--active");
      $(itemPrev).addClass("s-is-controller__span--active");
      if (index == lenghtCarousel - 1) {
        if (
          $(this)
            .parent()
            .find(".s-is-carrusel-job__nav--next")
            .hasClass("disabled")
        ) {
          $(this)
            .parent()
            .find(".s-is-carrusel-job__nav--next")
            .removeClass("disabled");
        }
      } else if (index == 1) {
        $(this).addClass("disabled");
      }
    }
  }

   
});


  $(window).on("resize", function () {
    let checkWidth = $(window).width();
    var owlCardJobs = $(".s-c-carrusel-job__content");
    var carouselCardJob = $(".s-c-carrusel-job");

    owlCardJobs.each(function () {
      var owlCardJob = $(this);
      var owlStage = carouselCardJob.find(".owl-stage");

      owlCardJob.owlCarousel("destroy");

      if (checkWidth < 1024) {
        owlStage.css({
          "padding-left": "0px",
          "padding-right": "100px"
        });
      } 
      owlCardJob.owlCarousel(configuracionesCarruselCardJob);

      owlCardJob.on("initialized.owl.carousel", function (event) {
        let element = $(event.target);
        element.find(".owl-nav .owl-prev").addClass("s-o-controller__nav");
        element.find(".owl-nav .owl-next").addClass("s-o-controller__nav");
      });

      owlCardJob.on("translate.owl.carousel", function (event) {
        let element = $(event.target);
        let carouselLength = event.item.count;
        let index = event.item.index;
        carouselLength = carouselLength - 1;
        centerPaddingCarousel(element, index, carouselLength, 50);
      });

    });
  });








//start HU 91 Blog
if($(".s-c-blog").length > 0) { //Validar existencia del blog
  //Cambiar etiqueta de titulo
  let titleBlog = $(".h3.title").eq(0).text();
  $(".h3.title").eq(0).after(
      `<h1 class="h3 title">${titleBlog}</h1>`
  ).remove();
  //Cambiar etiqueta de subtitulo
  let subTitleBlog = $(".h4.sub-title").eq(0).text();
  $(".h4.sub-title").eq(0).after(
      `<h2 class="h4 sub-title">${subTitleBlog}</h2>`
  ).remove();

  $(".icon-monospaced .c-inner").addClass("d-none");

  //Cambiar posicion de imagen
  $('.s-c-blog div[role="img"]').each(function(index){
      if(index == 0) {
          $(".portlet-blogs .portlet-body").eq(0).prepend($(this));
          //cambiar posicion all descriptivo
          $('small').eq(0).addClass('d-none');
          let textoDescriptivo = $(this).attr('aria-label');
          $(this).after(
              `
              <div class=" container container-blog">
                  <small class="s-t-altImg">
                      ${textoDescriptivo}
                  </small>
              </div>
              `
          );
      }
  });
}
//end HU 91 Blog
// HU-089
$(".s-c-carousel-simple-card").each(function(index){
    var idCarouselSimpleCard = '#'+$(this).attr('id');
    var slideClass = $(idCarouselSimpleCard).find('.slider-nav-carousel-sc > div');
    var totalSlides = slideClass.length;
    var containerWidth = (totalSlides === 3) ? '50%' : '30%';
    ($(idCarouselSimpleCard).find('.slider-for-container')).css('max-width', containerWidth);
    ($(idCarouselSimpleCard).find('.slider-for-carousel-sc')).slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: false,
      asNavFor: $(idCarouselSimpleCard).find('.slider-nav-carousel-sc'),
      prevArrow: $(idCarouselSimpleCard).find('.prev-slider-for-button-controller'),
      nextArrow: $(idCarouselSimpleCard).find('.next-slider-for-button-controller'),
    });
    ($(idCarouselSimpleCard).find('.slider-nav-carousel-sc > div:last')).addClass('s-last-slide-card');
    ($(idCarouselSimpleCard).find('.prev-slider-for-button-controller')).addClass('s-slick-disabled');

    ($(idCarouselSimpleCard).find('.slider-for-carousel-sc')).on('afterChange', function(event, slick, currentSlide){
      var slickNextArrow = $(idCarouselSimpleCard).find('.next-slider-for-button-controller');
      var slickPrevArrow = $(idCarouselSimpleCard).find('.prev-slider-for-button-controller');
      
      slickNextArrow.removeClass('s-slick-disabled');
      slickPrevArrow.removeClass('s-slick-disabled');

      if(currentSlide === slick.slideCount - 1){
          slickNextArrow.addClass('s-slick-disabled');
      }
      if(currentSlide === 0){
          slickPrevArrow.addClass('s-slick-disabled');
      }
    });
    ($(idCarouselSimpleCard).find('.slider-nav-carousel-sc')).slick({
      infinite: false,
      draggable: false,
      slidesToShow: totalSlides,
      slidesToScroll: totalSlides,
      asNavFor: $(idCarouselSimpleCard).find('.slider-for-carousel-sc'),
      dots: false,
      centerMode: false,
      focusOnSelect: true,
      arrows: true,
      prevArrow: $(idCarouselSimpleCard).find('.prev-slider-nav-button-controller'),
      nextArrow: $(idCarouselSimpleCard).find('.next-slider-nav-button-controller'),

      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: totalSlides-0.3,
            slidesToScroll: 1,
            centerMode: false,
          }
        },
        {
          breakpoint: 750,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
            centerMode: false,
          }
        }
      ]
    });
    ($(idCarouselSimpleCard).find('.prev-slider-nav-button-controller')).addClass('s-slick-disabled');
    ($(idCarouselSimpleCard).find('.slider-nav-carousel-sc')).on('afterChange', function(event, slick, currentSlide){
      var slickNextArrow = $(idCarouselSimpleCard).find('.next-slider-nav-button-controller');
      var slickPrevArrow = $(idCarouselSimpleCard).find('.prev-slider-nav-button-controller');

      slickNextArrow.removeClass('s-slick-disabled');
      slickPrevArrow.removeClass('s-slick-disabled');
      if(currentSlide === slick.slideCount - 1){
          slickNextArrow.addClass('s-slick-disabled');
      }
      if(currentSlide === 0){
          slickPrevArrow.addClass('s-slick-disabled');
      }
    });
  });
  // END HU-089

  $(".slider-for").slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    dots: true,
    appendDots: $(".dots-container"),
    asNavFor: ".slider-nav",
    prevArrow: $(".prev-button-controller"),
    nextArrow: $(".next-button-controller"),
    draggable: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          infinite: true,
          draggable: true
        },
      },
    ],
  });
  $(".slider-nav").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    infinite: false,
    arrows: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          infinite: true,
          draggable: true,
        },
      },
    ],
  });
/*   $('.slider-nav').on('afterChange', function(event, slick, currentSlide, nextSlide){
    // Después del primer cambio de diapositiva, centrar los elementos
    if (currentSlide === slick.slideCount - 1) {
      console.log("Jummmm")
      // Si es la última tarjeta, agregar la clase personalizada
      slick.$slideTrack.addClass('custom-transform');
    } else {
      // Si no es la última tarjeta, remover la clase personalizada
      slick.$slideTrack.removeClass('custom-transform');
    }
  }); */

  $(".slider-nav").on("keydown", "div", function (e) {
    if (e.keyCode == 13) {
      let index = $(this).index();
      $(".slider-for").slick("slickGoTo", index);
    }
  });
  if (resolutionActual > 1025) {
    let liElements = document.querySelectorAll(
      ".s-c-carrousel-banner-multi .slider-nav-container li"
    );
    if (liElements.length <= 3) {
      let sliderNavContainer = document.querySelector(
        ".s-c-carrousel-banner-multi .slider-nav-container"
      ),
      margin = document.querySelector(
        ".s-theme-V .s-c-carrousel-banner-multi .sld-wrp .s-c-card_img_title__container .slick-list"
      ),
      containerWidth = document.querySelector(
        ".s-theme-V .s-c-carrousel-banner-multi .sld-wrp .s-c-card_img_title__container .slick-track .slick-slide"
      );
     /*  sliderNavContainer.style.display = "none";
      margin.style.margin = 0;
      containerWidth.style.minWidth = "31.6%"; */
    }
  }

  function minHeightMobileCarusel() {
    $(".s-c-carrousel-banner-multi .slider-for .slick-list").each(function () {
      let banners = $(this).find(".s-c-banner_mask_3");
      if(resolutionActual<1024){
        var maxHeight = 0
        banners.each(function(){
          if($(this).attr('style')){
            $(this).removeAttr('style')
          }
        })
        banners.each(function(){
          if(maxHeight<$(this).outerHeight()){
            maxHeight = $(this).outerHeight()
          }
        })
        banners.css({minHeight: maxHeight+'px'})
      }
      else{
        banners.each(function(){
          if($(this).attr('style')){
            $(this).removeAttr('style')
          }
        })
      }
     
    });
  }

  minHeightMobileCarusel()

  $(window).on("resize", function () {
    setTimeout(function () {
      minHeightMobileCarusel()
    }, 300);
  })

  //Ancla

  $(".s-theme-V a[href^='#']").on("click", function (e) {
    var url = e.currentTarget.href;
    e.preventDefault();
    
    if (url.includes("ancla")) {
      if (
        $(".s-c-header-container").find(".s-c-header__descriptor").length != 0
      ) {
        if (resolutionActual >= 1024) {
          $("html, body").animate(
            {
              scrollTop: $(this.hash).offset().top - 190,
            },
            200,
            function () {}
          );
        } else {
          $("html, body").animate(
            {
              scrollTop: $(this.hash).offset().top - 150,
            },
            200,
            function () {}
          );
        }
      } else {
        if (resolutionActual >= 1024) {
          $("html, body").animate(
            {
              scrollTop: $(this.hash).offset().top - 150,
            },
            200,
            function () {}
          );
        } else {
          $("html, body").animate(
            {
              scrollTop: $(this.hash).offset().top - 110,
            },
            200,
            function () {}
          );
        }
      }
    }
  });

  $('#preheader-acces-button').click(function () {
    setTimeout(function(){
        $("div:not(:contains('uw'))").removeAttr('inert');
    }, 300);
  });

  
  if($('.s-c-header-container').find('.s-c-header__descriptor').length != 0){
    $(".s-c-ancla").addClass('s-has-ancla--descriptor')
  }

  //HU057 
  function addLayoutLateral(componente, position, resolutionA) {
    let contenedor = 0;
    if (resolutionA > 1128 && resolutionA < 1920) {
      contenedor = 1128;
    } else if (resolutionActual > 1900) {
      contenedor = 1440;
    }
    if (contenedor != 0) {
      let margin = (resolutionA - contenedor) / 2;
      switch (position) {
        case "l":
          margin = "margin-left: " + margin + "px;";
          break;
        case "r":
          margin = "margin-right: " + margin + "px;";
          break;
      }
      componente.attr("style", margin);
    }
  }

  function validateHaveTab(componenteAValidar) {
    if(componenteAValidar.parents(".s-c-tab-component").length > 0) {
        return true;
    } else {
        return false;
    }
  }

  function initHu57 () {
    $(".s-c-banner-overflowed").each(function(){
        if (!validateHaveTab($(this))) {
            addLayoutLateral(
                $(this).find('.s-s-banner-flowed-text'),
                "l",
                resolutionActual
              );
              var myComponentValidateTab = $(this);
            $(window).resize(function () {
                addLayoutLateral(
                myComponentValidateTab.find('.s-s-banner-flowed-text'),
                "l",
                resolutionActual
                );
            });
        }
    });
  }

  initHu57();
  
});
