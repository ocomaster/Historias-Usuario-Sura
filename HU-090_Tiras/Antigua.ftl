<#assign contentId = .vars["reserved-article-id"].data/>

<#-- Funcion clases de colores sistema de diseño -->
<#function colorClass selectColor prefijoClass>
        <#switch selectColor>
            <#case "primary1">
                <#return "${prefijoClass}-color-primary-color-1" />
            <#break>
            <#case "primary2">
                <#return "${prefijoClass}-color-primary-color-2" />
            <#break>
            <#case "secondary1">
                <#return "${prefijoClass}-color-second-color-1" />
            <#break>
            <#case "secondary2">
                <#return "${prefijoClass}-color-second-color-2" />
            <#break>
            <#case "secondary3">
                <#return "${prefijoClass}-color-second-color-3" />
            <#break>
            <#case "secondary4">
                <#return "${prefijoClass}-color-second-color-4" />
            <#break>
            <#case "secondary5">
                <#return "${prefijoClass}-color-second-color-5" />
            <#break>
            <#case "pantone1">
                <#return "${prefijoClass}-color-pantone-1" />
            <#break>
            <#case "pantone2">
                <#return "${prefijoClass}-color-pantone-2" />
            <#break>
            <#case "pantone3">
                <#return "${prefijoClass}-color-pantone-3" />
            <#break>
            <#case "pantone4">
                <#return "${prefijoClass}-color-pantone-4" />
            <#break>
            <#case "pantone5">
                <#return "${prefijoClass}-color-pantone-5" />
            <#break>
            <#case "light1">
                <#return "${prefijoClass}-color-light-10" />
            <#break>
            <#case "light2">
                <#return "${prefijoClass}-color-light-20" />
            <#break>
            <#case "light3">
                <#return "${prefijoClass}-color-light-30" />
            <#break>
            <#case "light4">
                <#return "${prefijoClass}-color-light-40" />
            <#break>
            <#case "light5">
                <#return "${prefijoClass}-color-light-50" />
            <#break>
            <#case "success1">
                <#return "${prefijoClass}-color-success-1" />
            <#break>
            <#case "warning1">
                <#return "${prefijoClass}-color-warning-1" />
            <#break>
            <#case "error1">
                <#return "${prefijoClass}-color-error-1" />
            <#break>
            <#case "info1">
                <#return "${prefijoClass}-color-info-1" />
            <#break>
            <#case "success2">
                <#return "${prefijoClass}-color-success-2" />
            <#break>
            <#case "warning2">
                <#return "${prefijoClass}-color-warning-2" />
            <#break>
            <#case "error2">
                <#return "${prefijoClass}-color-error-2" />
            <#break>
            <#case "info2">
                <#return "${prefijoClass}-color-info-2" />
            <#break>
            <#case "gray1">
                <#return "${prefijoClass}-color-gray-100" />
            <#break>
            <#case "gray2">
                <#return "${prefijoClass}-color-gray-200" />
            <#break>
            <#case "gray3">
                <#return "${prefijoClass}-color-gray-300" />
            <#break>
            <#case "gray4">
                <#return "${prefijoClass}-color-gray-400" />
            <#break>
            <#case "dark1">
                <#return "${prefijoClass}-color-dark-1" />
            <#break>
            <#case "dark2">
                <#return "${prefijoClass}-color-dark-2" />
            <#break>
            <#case "dark3">
                <#return "${prefijoClass}-color-dark-3" />
            <#break>
            <#default>
                <#return "" />
        </#switch>
</#function>

<#if (carouselAppearance.carouselBg.getData())??>
    <#assign colorBackground = colorClass(carouselAppearance.carouselBg.getData(), "bg" ) />
<#else>
    <#assign colorBackground = "bg-color-primary-color-2" />
</#if>


<#function truncateText(text, maxLength)>
	<#if maxLength < text?length-1 >
		<#assign shrotenText = stringUtil.shorten(text, maxLength, "") />
    <#return shrotenText>
	<#else>
		<#return text >
	</#if>
</#function>

<#--  Lógica para restricción de mínimo 4 casillas y máximo 10 -->

<#if boxGroup.boxItem.getSiblings()?has_content>
	<#list boxGroup.boxItem.getSiblings() as cur_boxGroup_boxItem>
	</#list>
</#if>
<#assign itemsCarousel = boxGroup.boxItem.getSiblings()?size>
<#if ((itemsCarousel < 4) || (itemsCarousel > 10))>
    <#assign showCarousel = false>
<#else>
    <#assign showCarousel = true>
</#if>

<#if (showCarousel)>
    <section id="${contentId}" class="s-c-carouselStrip ${colorBackground}">
        <div class="container">
            <div class="owl-carousel owl_carouselStrip owl-theme owl-drag">
                <#if boxGroup.boxItem.getSiblings()?has_content>
                    <#list boxGroup.boxItem.getSiblings() as cur_boxGroup_boxItem>
                        <div class="item">
                            <#if (cur_boxGroup_boxItem.urlBox.getData())??>
                                <#assign urlBox = cur_boxGroup_boxItem.urlBox.getData()>
                            </#if>
                            <#if (cur_boxGroup_boxItem.actionClicBox.getData())??>
                                <#assign urlBoxTarget = cur_boxGroup_boxItem.actionClicBox.getData()>
                            <#else>
                                <#assign urlBoxTarget = "_self">
                            </#if>
                            <a class="tira-carrusel-accesos-f-gtm-${contentId}" href="${urlBox}" target="${urlBoxTarget}" >
                                <div class="s-c-carouselStrip__item bg-color-primary-color-2 tira-carrusel-accesos-f-gtm-${contentId}">
                                    <div class="d-flex tira-carrusel-accesos-f-gtm-${contentId}">
                                        <div class="s-c-carouselStrip__picture tira-carrusel-accesos-f-gtm-${contentId}">
                                            <#if (cur_boxGroup_boxItem.iconBox.getData())??>
                                                <#assign icon = cur_boxGroup_boxItem.iconBox.getData()>
                                            </#if>
                                            <i class="${icon}" aria-hidden="true"></i>
                                        </div>
                                        <#if (cur_boxGroup_boxItem.titleBox.getData())??>
                                            <#assign titleBox = truncateText(cur_boxGroup_boxItem.titleBox.getData(),35)>
                                            <p class="s-c-carouselStrip__text tira-carrusel-accesos-f-gtm-${contentId}">${titleBox}</p>
                                        </#if>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </#list>
                </#if>
            </div>
            <div class="s-c-carouselStrip__item-dots">
                <button type="button" role="presentation" class="owl-prev s-o-controller__nav disabled" ><span
                        class="s-o-controller__icon" aria-label="Atras"><i class="s-iconWeightRegular2"></i></span></button>
                        <ul class='owl-dots' >
                            <li class='owl-dot'><button role="button" class="owl-dot active s-o-controller_dots " data-card-index="0"><span
                                        class="s-o-controller_span active"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot s-o-controller_dots" data-card-index="1"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot s-o-controller_dots" data-card-index="2"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="3"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="4"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="5"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="6"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="7"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="8"><span
                                        class="s-o-controller_span"></span></button></li>
                            <li class='owl-dot'><button role="button" class="owl-dot  s-o-controller_dots" data-card-index="9"><span
                                        class="s-o-controller_span"></span></button></li>
                        </ul>
                <button type="button" role="presentation" class="owl-next s-o-controller__nav"><span
                        class="s-o-controller__icon" aria-label="Atras"><i class="s-iconWeightRegular3"></i></span></button>
            </div>
        </div>
    </section>
<#else>
    <section id="s-js-carouselStrip-2" class="s-c-carouselStrip ${colorBackground}">
        <div class="container">
            <p class="t-font-size-24 txt-color-error-1">Ingrese mínimo 4 casillas y máximo 10 casillas.</p>
        </div>
    </section>
</#if>