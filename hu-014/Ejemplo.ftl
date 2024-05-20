<#assign contentId = .vars["reserved-article-id"].data/>
<#attempt>

    <#-- Funcion clases de colores sistema de diseño -->
<#function colorClass selectColor prefijoClass prefixVariable>
    <#if prefixVariable != "">
        <#switch selectColor>
            <#case "${prefixVariable}Primary1">
                <#return "${prefijoClass}-color-primary-color-1" />
            <#break>
            <#case "${prefixVariable}Primary2">
                <#return "${prefijoClass}-color-primary-color-2" />
            <#break>
            <#case "${prefixVariable}Secondary1">
                <#return "${prefijoClass}-color-second-color-1" />
            <#break>
            <#case "${prefixVariable}Secondary2">
                <#return "${prefijoClass}-color-second-color-2" />
            <#break>
            <#case "${prefixVariable}Secondary3">
                <#return "${prefijoClass}-color-second-color-3" />
            <#break>
            <#case "${prefixVariable}Secondary4">
                <#return "${prefijoClass}-color-second-color-4" />
            <#break>
            <#case "${prefixVariable}Secondary5">
                <#return "${prefijoClass}-color-second-color-5" />
            <#break>
            <#case "${prefixVariable}Pantone1">
                <#return "${prefijoClass}-color-pantone-1" />
            <#break>
            <#case "${prefixVariable}Pantone2">
                <#return "${prefijoClass}-color-pantone-2" />
            <#break>
            <#case "${prefixVariable}Pantone3">
                <#return "${prefijoClass}-color-pantone-3" />
            <#break>
            <#case "${prefixVariable}Pantone4">
                <#return "${prefijoClass}-color-pantone-4" />
            <#break>
            <#case "${prefixVariable}Pantone5">
                <#return "${prefijoClass}-color-pantone-5" />
            <#break>
            <#case "${prefixVariable}Light1">
                <#return "${prefijoClass}-color-light-10" />
            <#break>
            <#case "${prefixVariable}Light2">
                <#return "${prefijoClass}-color-light-20" />
            <#break>
            <#case "${prefixVariable}Light3">
                <#return "${prefijoClass}-color-light-30" />
            <#break>
            <#case "${prefixVariable}Light4">
                <#return "${prefijoClass}-color-light-40" />
            <#break>
            <#case "${prefixVariable}Light5">
                <#return "${prefijoClass}-color-light-50" />
            <#break>
            <#case "${prefixVariable}Success1">
                <#return "${prefijoClass}-color-success-1" />
            <#break>
            <#case "${prefixVariable}Warning1">
                <#return "${prefijoClass}-color-warning-1" />
            <#break>
            <#case "${prefixVariable}Error1">
                <#return "${prefijoClass}-color-error-1" />
            <#break>
            <#case "${prefixVariable}Info1">
                <#return "${prefijoClass}-color-info-1" />
            <#break>
            <#case "${prefixVariable}Success2">
                <#return "${prefijoClass}-color-success-2" />
            <#break>
            <#case "${prefixVariable}Warning2">
                <#return "${prefijoClass}-color-warning-2" />
            <#break>
            <#case "${prefixVariable}Error2">
                <#return "${prefijoClass}-color-error-2" />
            <#break>
            <#case "${prefixVariable}Info2">
                <#return "${prefijoClass}-color-info-2" />
            <#break>
            <#case "${prefixVariable}Gray1">
                <#return "${prefijoClass}-color-gray-100" />
            <#break>
            <#case "${prefixVariable}Gray2">
                <#return "${prefijoClass}-color-gray-200" />
            <#break>
            <#case "${prefixVariable}Gray3">
                <#return "${prefijoClass}-color-gray-300" />
            <#break>
            <#case "${prefixVariable}Gray4">
                <#return "${prefijoClass}-color-gray-400" />
            <#break>
            <#case "${prefixVariable}Dark1">
                <#return "${prefijoClass}-color-dark-1" />
            <#break>
            <#case "${prefixVariable}Dark2">
                <#return "${prefijoClass}-color-dark-2" />
            <#break>
            <#case "${prefixVariable}Dark3">
                <#return "${prefijoClass}-color-dark-3" />
            <#break>
            <#default>
                <#return "" />
        </#switch>
    <#else>
        <#switch selectColor>
            <#case "primary1">
                <#return "-primary-color-1" />
            <#break>
            <#case "primary2">
                <#return "-primary-color-2" />
            <#break>
            <#case "secondary1">
                <#return "-second-color-1" />
            <#break>
            <#case "secondary2">
                <#return "-second-color-2" />
            <#break>
            <#case "secondary3">
                <#return "-second-color-3" />
            <#break>
            <#case "secondary4">
                <#return "-second-color-4" />
            <#break>
            <#case "secondary5">
                <#return "-second-color-5" />
            <#break>
            <#case "pantone1">
                <#return "-pantone-1" />
            <#break>
            <#case "pantone2">
                <#return "-pantone-2" />
            <#break>
            <#case "pantone3">
                <#return "-pantone-3" />
            <#break>
            <#case "pantone4">
                <#return "-pantone-4" />
            <#break>
            <#case "pantone5">
                <#return "-pantone-5" />
            <#break>
            <#case "light1">
                <#return "-light-10" />
            <#break>
            <#case "light2">
                <#return "-light-20" />
            <#break>
            <#case "light3">
                <#return "-light-30" />
            <#break>
            <#case "light4">
                <#return "-light-40" />
            <#break>
            <#case "light5">
                <#return "-light-50" />
            <#break>
            <#case "success1">
                <#return "-success-1" />
            <#break>
            <#case "warning1">
                <#return "-warning-1" />
            <#break>
            <#case "error1">
                <#return "-error-1" />
            <#break>
            <#case "info1">
                <#return "-info-1" />
            <#break>
            <#case "success2">
                <#return "-success-2" />
            <#break>
            <#case "warning2">
                <#return "-warning-2" />
            <#break>
            <#case "error2">
                <#return "-error-2" />
            <#break>
            <#case "info2">
                <#return "-info-2" />
            <#break>
            <#case "gray1">
                <#return "-gray-100" />
            <#break>
            <#case "gray2">
                <#return "-gray-200" />
            <#break>
            <#case "gray3">
                <#return "-gray-300" />
            <#break>
            <#case "gray4">
                <#return "-gray-400" />
            <#break>
            <#case "dark1">
                <#return "-dark-1" />
            <#break>
            <#case "dark2">
                <#return "-dark-2" />
            <#break>
            <#case "dark3">
                <#return "-dark-3" />
            <#break>
            <#default>
                <#return "" />
        </#switch>
    </#if>
</#function>
    <#-- BOTON -->
    <#-- Funcion para el select de estado del boton recibe el valor del campo -->
    <#function getButtonState buttonStateData>
        <#switch buttonStateData>
            <#case "inactive">
                <#return "s-t-disabled">
            <#case "default">
                <#return "">
            <#default>
                <#return "">
        </#switch>
    </#function>
    <#-- Funcion para el select de tipo de boton recibe el valor del campo -->
    <#function getButtonType buttonTypeData>
        <#switch buttonTypeData>
            <#case "primario">
                <#return "">
            <#case "primarioVerde">
                <#return "s-t-btn--green">
            <#case "outline">
                <#return "s-t-btn--outline">
            <#case "outlineAlert">
                <#return "s-t-btn--alert">
            <#case "terciario">
                <#return "s-t-btn--tertiary">
            <#case "terciarioAlert">
                <#return "s-t-btn--tertiary-variant">
            <#default>
                <#return "">
        </#switch>
    </#function>
    <#-- Funcion para el select de tamano de boton recibe el valor del campo -->
    <#function getButtonSize buttonSizeData>
        <#switch buttonSizeData>
            <#case "botonS">
                <#return "s-t-btn--s">
            <#case "botonM">
                <#return "s-t-btn--m">
            <#case "botonL">
                <#return "s-t-btn--l">
            <#default>
                <#return "s-t-btn--m">
        </#switch>
    </#function>
    <#-- Funcion para el select de tipo de apertura de boton recibe el valor del campo -->
    <#function getButtonTarget buttonTargetData>
        <#switch buttonTargetData>
            <#case "self">
                <#return "_self">
            <#case "blank">
                <#return "_blank">
            <#default>
                <#return "_self">
        </#switch>
    </#function>
    <#-- Funcion para dar el valor de la clase para los iconos -->
    <#function getButtonIconClass iconOpc>
        <#switch iconOpc>
            <#case "left">
                <#return "s-t-icon--left m-r-16">
            <#case "right">
                <#return "s-t-icon--right m-l-16">
            <#default>
                <#return "">
        </#switch>
    </#function>
    <#-- Funcion para dar el valor de el nombre de los iconos -->
    <#function getButtonIconName iconOpc btn>
        <#switch iconOpc>
            <#case "left">
                <#if (btn)?? && (btn) != "">
                    <#assign leftIconNameData = btn/>
                <#else>
                    <#assign leftIconNameData = ""/>
                </#if>     
                <#return leftIconNameData>
            <#case "right">
                <#if (btn)?? && (btn) != "">
                    <#assign rightIconNameData = btn/>
                <#else>
                    <#assign rightIconNameData = ""/>
                </#if>      
                <#return rightIconNameData>
            <#default>
                <#return "">
        </#switch>
    </#function>

    <#--  En estructura se agrega campo de texto llamado: sizeBorder para su utilizacion; Indicacion tamaño de border!  -->
<#if (sizeBorder.getData())??  && sizeBorder.getData() != "">
	<#assign borderRadius = sizeBorder.getData() />
<#else>
    <#assign borderRadius = "12" />
</#if>

<#--  borderWidth:  Tamaño del contorno exterior  -->
<#if (borderWidth.getData())??  && borderWidth.getData() != "">
	<#assign borderWidthValue = borderWidth.getData() />
	
<#else>
    <#assign borderWidthValue = "0" />
</#if>



<#--  Color Border Externo  selectColorBorder -->
<#if (selectColorBorder.getData())??>
    <#assign selectColorBorderValue = selectColorBorder.getData() />
	<#assign selectColorBorderValue = colorClass(selectColorBorderValue, "", "") />
<#else>
    <#assign selectColorBorderValue = "#FF0000" />
</#if>



    <#-- Macro para generar el HTML de un icono -->
    <#macro buttonIconPart iconOpc btn>
        <span class="s-o-icon ${getButtonIconClass(iconOpc)}">
            <i class="${getButtonIconName(iconOpc, btn)}" aria-hidden="true"></i>
        </span>
    </#macro>


    <#if cards.getSiblings()?has_content>
        <#if cards.getSiblings()?size == 2>
				<a class="s-c-ancla" id="ancla-${contentId}"  ></a>
            <section class="s-c-card_animacion_desplegable " id="s-js-card_animacion_desplegable-${contentId}" >


                <div class="container" >
                    <div class="d-flex"   >
                        <#list cards.getSiblings() as card>
                            <#assign bgColorData = colorClass(card.sectionBackground.suraColors.getData(), "bg", "") />
                            <#-- Configuracion de titulo -->
                            <#if (card.configTitle.typeTitle.getData())??>
                                <#assign typeTitleData = card.configTitle.typeTitle.getData() />
                            <#else>
                                <#assign typeTitleData = "h2" />
                            </#if>
                            <#assign titleColorData = colorClass(card.configTitle.colorTitle.getData(), "txt", "tt") />
                            <#-- titulo -->
                            <#if (card.textTitle.getData())?? && (card.textTitle.getData()) != "">
                                <#assign titleData = card.textTitle.getData() />
                                <#assign haveTitle = true />
                            <#else>
                                <#assign titleData = "" />
                                <#assign haveTitle = false />
                            </#if>
                            <#-- Configuracion parrafo -->
                            <#assign paragrahColorData = colorClass(card.sectionParagraphBg.suraColors_1.getData(), "txt", "") />
                            <#-- parrafo -->
                            <#if (card.paragraph.getData())?? && (card.paragraph.getData()) != "">
                                <#assign paragraphData = card.paragraph.getData() />
                                <#assign haveParagraph = true />
                            <#else>
                                <#assign paragraphData = "" />
                                <#assign haveParagraph = false />
                            </#if>
                            <#-- Imagen -->
                            <#if (card.imgDesktop.getData())?? && card.imgDesktop.getData() != "">
                                <#assign imgDesktopData = card.imgDesktop.getData() />
                                <#assign imgDesktopAlt = card.imgDesktop.getAttribute("alt") />
                                <#assign haveImgDesktop = true />
                            <#else>
                                <#assign imgDesktopData = "" />
                                <#assign imgDesktopAlt = "" />
                                <#assign haveImgDesktop = false />
                            </#if>
                            <#if (card.imgMobileC.getData())?? && card.imgMobileC.getData() != "">
                                <#assign imgMobileContractData = card.imgMobileC.getData() />
                                <#assign imgMobileContractAlt = card.imgMobileC.getAttribute("alt") />
                                <#assign haveImgMobileContract = true />
                            <#else>
                                <#assign imgMobileContractData = "" />
                                <#assign imgMobileContractAlt = "" />
                                <#assign haveImgMobileContract = false />
                            </#if>
                            <#if (card.imgMobileD.getData())?? && card.imgMobileD.getData() != "">
                                <#assign imgMobileExpandData = card.imgMobileD.getData() />
                                <#assign imgMobileExpandAlt = card.imgMobileD.getAttribute("alt") />
                                <#assign haveImgMobileExpand = true />
                            <#else>
                                <#assign imgMobileExpandData = "" />
                                <#assign imgMobileExpandAlt = "" />
                                <#assign haveImgMobileExpand = false />
                            </#if>
                            <#assign enableButtonData = getterUtil.getBoolean(card.interactionSection.enableButton.getData())>
                            <#if enableButtonData>
                                <#if (card.interactionSection.buttonState.getData())?? && (card.interactionSection.buttonState.getData()) != "">
                                    <#assign buttonStateData = getButtonState(card.interactionSection.buttonState.getData()) >
                                <#else>
                                    <#assign buttonStateData = getButtonState("")/>
                                </#if>
                                <#if (card.interactionSection.buttonType.getData())?? && (card.interactionSection.buttonType.getData()) != "">
                                    <#assign buttonTypeData = getButtonType(card.interactionSection.buttonType.getData())>
                                <#else>
                                    <#assign buttonTypeData = ""/>
                                </#if>
                                <#if (card.interactionSection.buttonSize.getData())?? && (card.interactionSection.buttonSize.getData()) != "">
                                    <#assign buttonSizeData = getButtonSize(card.interactionSection.buttonSize.getData())>
                                <#else>
                                    <#assign buttonSizeData = "s-t-btn--m"/>
                                </#if>
                                <#if (card.interactionSection.buttonTarget.getData())?? && (card.interactionSection.buttonTarget.getData()) != "">
                                    <#assign buttonTargetData = getButtonTarget(card.interactionSection.buttonTarget.getData())>
                                <#else>
                                    <#assign buttonTargetData = "_self"/>
                                </#if>
                                <#if (card.interactionSection.buttonActionUrl.getData())?? && (card.interactionSection.buttonActionUrl.getData()) != "">
                                    <#assign buttonActionUrlData = card.interactionSection.buttonActionUrl.getData()>
                                <#else>
                                    <#assign buttonActionUrlData = "#"/>
                                </#if>
                                <#assign enableButtonLeftIconData = getterUtil.getBoolean(card.interactionSection.enableButtonLeftIcon.getData())>
                                <#assign enableButtonRightIconData = getterUtil.getBoolean(card.interactionSection.enableButtonRightIcon.getData())>
                            </#if>
                            <#if card.textButton.getData()?? && card.textButton.getData() != '' >
                                <#assign interactionTextData = card.textButton.getData() >
                                <#assign haveInteractionText = true />
                            <#else>
                                <#assign interactionTextData = '' />
                                <#assign haveInteractionText = false />
                            </#if>

                            <#if card?index == 0>
                                <#assign positionCard = "left" />
                            <#elseif card?index == 1>
                                <#assign positionCard = "right" />
                            <#else>
                                <#break>
                            </#if>

                            <style>
                                @media (max-width: 767px) {
                                 .custom-font-size {
                                   font-size: 1.375rem !important; /* Agrega !important para asegurarte de que esta regla tenga prioridad */
                                 }
                            }
                            </style>
                            

                            <#--  Se agrega ajuste Tiempo de animacion 300ms  y ajuste de border-radius para que sea escogido por el Agente, box-shadow para agregar el contorno  -->
                             
                            <div class="card ${positionCard} ${bgColorData} s-js-card-animation " style="transition: all 300ms ease !important; border-radius: ${borderRadius}px; box-shadow: 0 0 0 ${borderWidthValue}px; color: var(-${selectColorBorderValue}) ; " >
                                <div class="s-c-card_animacion_desplegable_content ">
                                    <div class="s-c-card_animacion_desplegable_title ${titleColorData} " style=" var(font-size: 1.375rem)">
                                        <#if haveTitle>
                                            <${typeTitleData}>
                                            <#--  Se agrega clase "custom-font-size" indicada en el @media para definir el tamaño de font-size 1.375rem  -->
                                               <h5 class="custom-font-size"> ${stringUtil.shorten(htmlUtil.stripHtml(titleData), 35) }</h5>
                                            </${typeTitleData}>
                                        </#if>
                                    </div>
                                    <div class="card_img_${positionCard}"  >
                                        <#if haveImgMobileExpand>
                                            <img class="s-c-card_animacion_desplegable_img_mobile_other_${positionCard}"  src="${imgMobileExpandData}"  alt="${imgMobileExpandAlt}">
                                        </#if>
                                    </div>
                                    <#--  Se Agrega ajuste en Width:auto para que el texto del parrafo se centre correctamente  -->
                                    <div class="s-c-card_animacion_desplegable_card_text" style="width: auto">
                                        <div class="s-c-card_animacion_desplegable_rich-text s-s-animacion_desplegable_rich-text ${paragrahColorData} !important" style=" var(font-size: 1.375rem) ">
                                            ${paragraphData}
                                        </div>
                                    </div>
                                        <#assign idIndex = card?index >
                                    <#if enableButtonData && haveInteractionText>
                                        <a title="ir a ${stringUtil.shorten(htmlUtil.stripHtml(interactionTextData), 20)}" id="${contentId}${idIndex}-card" class="s-o-btn ${buttonTypeData} ${buttonSizeData} ${buttonStateData} btn-card-${positionCard} Card-Animation-Desplegable-gtm-${contentId}" href="${buttonActionUrlData}" target="${buttonTargetData}" tabindex="0">
                                            <#if enableButtonLeftIconData>
                                                <#assign icon = "left" />
                                                <@buttonIconPart icon, (card.interactionSection.leftIconName.getData()) />
                                            </#if>
                                            <span class="Card-Animation-Desplegable-gtm-${contentId}">${stringUtil.shorten(htmlUtil.stripHtml(interactionTextData), 20)}</span>
                                            <#if enableButtonRightIconData>
                                                <#assign icon = "right" />
                                                <@buttonIconPart icon, (card.interactionSection.rightIconName.getData()) />
                                            </#if>           
                                        </a>
                                    </#if>
                                </div>
                                <div class="card_img_${positionCard} alternative_img_${positionCard}">
                                    <#if haveImgDesktop && haveImgMobileContract>
                                        <#--  style="width: auto; height: auto; max-width: 100%;  -->
                                        <img class="s-c-card_animacion_desplegable_img_desktop" src="${imgDesktopData}"  alt="${imgDesktopAlt}" style="border-bottom-right-radius: ${borderRadius}px; border-bottom-left-radius: ${borderRadius}px">
                                        <img class="s-c-card_animacion_desplegable_img_mobile_${positionCard}" src="${imgMobileContractData}"  alt="${imgMobileContractAlt}">
                                    </#if>
                                </div>
                            </div>
                        </#list>
                    </div>
                </div>
            </section>            
        <#else>
            <h2>La contribución de una total de 2 cards es obligatoria</h2>
        </#if>
    </#if>
<#recover>
<h2>Lo sentimos, este contenido esta en construcción</h2>
</#attempt>
