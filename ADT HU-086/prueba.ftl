<#if entries?has_content>
    <ul class="navbar-nav s-js-dropdowns">
        <#assign count = 0 />
        <#assign count2 = 0 />
        <#list entries as navigationEntry>
            <#if navigationEntry?index == 6>
                <#break>
            </#if>
            <#if navigationEntry.hasChildren()>
                <li class="s-o-dropdown">
                    <a class="s-o-dropdown__toggle s-c-header__menu s-t-dropdown__toggle--inactive" href="#" role="button" aria-expanded="false" id="dropdown-header-${count}" title="ir a ${navigationEntry.getUnescapedName()}">
                        <span class="s-o-dropdown__toggle__left d-flex">
                            <span class="s-o-dropdown__heading">
                                <span class="s-o-dropdown__title txt-color-primary-color-1 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(navigationEntry.getUnescapedName()), 20, "")}</span>
                            </span>
                        </span>
                        <span class="s-o-dropdown__toggle__right d-flex">
                            <span class="s-o-icon txt-color-primary-color-1">
                                <i class="s-iconDirectionDown1" aria-hidden="true"></i>
                            </span>
                        </span>
                    </a>
                    <div class="s-o-dropdown__content s-js-hidden" aria-labelledby="dropdown-header-${count}" id="dropdown-header-${count}-drop-content">
                    <#assign count++ />
                        <div class="s-c-header__descriptor bg-color-primary-color-2 s-js-only-desktop">
                            <div class="container">
                                <span class="s-c-header__descriptor-text txt-color-primary-color-5 s-js-header__descriptor">Seguros</span>
                            </div>
                        </div>
                        <div class="s-o-dropdown__content-container">
							<#if navigationEntry.getLayout()??>
                               <#if navigationEntry.getLayout().getExpandoBridge().getAttribute("titulo_menu_desplegable") != "" || navigationEntry.getLayout().getExpandoBridge().getAttribute("ruta_imagen_menu_desplegable") != "">
                                <div class="s-c-header__banner s-js-only-desktop txt-color-primary-color-2">
                                    <#if navigationEntry.getLayout().getExpandoBridge().getAttribute("titulo_menu_desplegable") != "">
                                        <span class="s-c-header__menu-title">${stringUtil.shorten(htmlUtil.stripHtml(navigationEntry.getLayout().getExpandoBridge().getAttribute("titulo_menu_desplegable")), 50, "")}</span>
                                    </#if>
                                    <#if navigationEntry.getLayout().getExpandoBridge().getAttribute("ruta_imagen_menu_desplegable") != "">
                                        <div class="s-c-header__menu-img">
                                            <img src="${navigationEntry.getLayout().getExpandoBridge().getAttribute("ruta_imagen_menu_desplegable")}" alt="${navigationEntry.getLayout().getExpandoBridge().getAttribute("texto_descriptivo_imagen_menu_desplegable")}" loading="lazy">
                                        </div>
                                    </#if>
                                </div>
                              </#if>
                            </#if>
                            <ul class="s-js-dropdowns">
                                <#list navigationEntry.getChildren() as children_nav>
                                    <#if children_nav.hasChildren()>
                                        <li class="s-o-dropdown">
                                            <a class="s-o-dropdown__toggle s-c-header__sub-menu s-t-dropdown__toggle--inactive header-gtm" href="#" role="button" aria-expanded="false" id="dropdown-subheader-${count}" title="ir a ${children_nav.getUnescapedName()}">
                                                <span class="s-o-dropdown__toggle__left d-flex header-gtm">
                                                    <span class="s-o-dropdown__heading header-gtm ">
                                                        <span class="s-o-dropdown__title txt-color-primary-color-2 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(children_nav.getUnescapedName()), 70, "")}</span>
                                                    </span>
                                                </span>
                                                <span class="s-o-dropdown__toggle__right d-flex">
                                                    <span class="s-o-icon">
                                                        <i class="s-iconDirectionDown1" aria-hidden="true"></i>
                                                    </span>
                                                </span>
                                            </a>
                                            <div class="s-o-dropdown__content s-js-hidden" aria-labelledby="dropdown-subheader-${count}" id="dropdown-subheader-${count}-drop-content">
                                                <ul>
                                                <#assign count++ />
                                                    <#list children_nav.getChildren() as subChildren_nav>
                                                        <li class="s-o-dropdown__item-container">
                                                            <a href="${subChildren_nav.getURL()}" class="s-o-dropdown__item header-gtm" title="ir a ${subChildren_nav.getUnescapedName()}" ${subChildren_nav.getTarget()} id="header-arl-link-${count2}">
                                                                <span class="s-o-dropdown__item__left d-flex header-gtm">
                                                                    <#if subChildren_nav.getLayout()??>
                                                                        <#assign pageIcon = subChildren_nav.getLayout().getExpandoBridge().getAttribute("icono_de_la_pagina")>
                                                                        <#if pageIcon != "">
																			<span class="s-o-icon" aria-hidden="true">
																				<i class="${pageIcon}"></i>
																			</span>
                                                                        </#if>
                                                                    </#if>
                                                                    <span class="s-o-dropdown__item__text txt-color-primary-color-2 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(subChildren_nav.getUnescapedName()), 70, "")}</span>
                                                                </span>
                                                                <span class="s-o-dropdown__item__right">
                                                                </span>
                                                            </a>
                                                        </li>
                                                        <#assign count2++ />
                                                    </#list>
                                                </ul>
                                            </div>
                                        </li>
                                    <#else>
                                        <li class="s-o-dropdown__item-container">
                                            <a href="${children_nav.getURL()}" class="s-o-dropdown__item s-c-header__sub-menu s-t-dropdown__toggle--inactive header-gtm" role="button" aria-expanded="false" title="ir a ${children_nav.getUnescapedName()}">
                                                <span class="s-o-dropdown__toggle__left d-flex header-gtm">
                                                    <span class="s-o-dropdown__heading header-gtm ">
                                                        <span class="s-o-dropdown__title txt-color-primary-color-2 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(children_nav.getUnescapedName()), 70, "")}</span>
                                                    </span>
                                                </span>
                                                <span class="s-o-dropdown__toggle__right d-flex">
                                                    <span class="s-o-icon">
                                                        <i class="s-iconDirectionDown1" aria-hidden="true"></i>
                                                    </span>
                                                </span>
                                            </a>
                                            <div class="s-o-dropdown__content s-js-hidden" aria-labelledby="dropdown-subheader-${count}" id="dropdown-subheader-${count}-drop-content">
                                                <ul>
                                                <#assign count++ />
                                                    <#list children_nav.getChildren() as subChildren_nav>
                                                        <li class="s-o-dropdown__item-container">
                                                            <a href="${subChildren_nav.getURL()}" class="s-o-dropdown__item header-gtm" title="ir a ${subChildren_nav.getUnescapedName()}" ${subChildren_nav.getTarget()} id="header-arl-link-${count2}">
                                                                <span class="s-o-dropdown__item__left d-flex header-gtm">
                                                                    <#if subChildren_nav.getLayout()??>
                                                                        <#assign pageIcon = subChildren_nav.getLayout().getExpandoBridge().getAttribute("icono_de_la_pagina")>
                                                                        <#if pageIcon != "">
																			<span class="s-o-icon" aria-hidden="true">
																				<i class="${pageIcon}"></i>
																			</span>
                                                                        </#if>
                                                                    </#if>
                                                                    <span class="s-o-dropdown__item__text txt-color-primary-color-2 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(subChildren_nav.getUnescapedName()), 70, "")}</span>
                                                                </span>
                                                                <span class="s-o-dropdown__item__right">
                                                                </span>
                                                            </a>
                                                        </li>
                                                        <#assign count2++ />
                                                    </#list>
                                                </ul>
                                            </div>
                                        </li>
                                    </#if>
                                </#list>
                            </ul>
                        </div>
                    </div>
                </li>
            <#else>
                <li class="s-o-dropdown__item-container">
                    <a href="${navigationEntry.getURL()}" title="ir a ${stringUtil.shorten(htmlUtil.stripHtml(navigationEntry.getUnescapedName()), 20, "")}" class="s-o-dropdown__item header-gtm" ${navigationEntry.getTarget()} id="header-arl-link-${count2}">
                        <span class="s-o-dropdown__item__left d-flex header-gtm">
                            <span class="s-o-dropdown__item__text txt-color-primary-color-1 header-gtm">${stringUtil.shorten(htmlUtil.stripHtml(navigationEntry.getUnescapedName()), 20, "")}</span>
                        </span>
                        <span class="s-o-dropdown__item__right">
                        </span>
                    </a>
                </li>
                <#assign count2++ />
            </#if>
        </#list>
        <li class="s-o-dropdown__item-container s-t-header__search-menu d-none" id="button-header-menu">
            <a href="#" class="s-o-dropdown__item header-gtm">
                <span class="s-o-dropdown__item__left d-flex header-gtm">
                    <span class="s-o-dropdown__item__text txt-color-primary-color-1 header-gtm">btn</span>
                </span>
                <span class="s-o-dropdown__item__right">
                </span>
            </a>
        </li>
        <li class="s-o-dropdown__item-container s-t-header__search-menu d-none" id="search-menu">
            <a href="#" class="s-o-dropdown__item header-gtm">
                <span class="s-o-dropdown__item__left d-flex header-gtm">
                    <span class="s-o-dropdown__item__text txt-color-primary-color-1 header-gtm">Buscador</span>
                </span>
                <span class="s-o-dropdown__item__right header-gtm">
                    <i class="s-iconIconsLook" aria-hidden="true"></i>
                </span>
            </a>
        </li>
    </ul>
</#if>