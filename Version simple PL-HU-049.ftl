<#-- 
    Nombre Nuevas Variables

    Tamaño del Bordes:   sizeBorder
-->


<#assign contentId = .vars["reserved-article-id"].data/>
<#attempt>
<#-- Funcion para retornar el color -->
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
    </#if>
</#function>

<#-- Funcion para retornar el color -->
<#function getTitleColorContent color>
    <#switch color>
        <#case 'ttPrimary1' >
            <#return "color-primary-color-1">
        <#case 'ttPrimary2' >
            <#return "color-primary-color-2">
        <#case 'ttPrimary3' >
            <#return "color-primary-color-3">
        <#case 'ttPrimary4' >
            <#return "color-primary-color-4">
        <#case 'ttPrimary5' >
            <#return "color-primary-color-5">
        <#case 'ttSecondary1' >
            <#return "color-second-color-1">
        <#case 'ttSecondary2' >
            <#return "color-second-color-2">
        <#case 'ttSecondary3' >
            <#return "color-second-color-3">
        <#case 'ttSecondary4' >
            <#return "color-second-color-4">
        <#case 'ttSecondary5' >
            <#return "color-second-color-5">
        <#case 'ttSecondary6' >
            <#return "color-second-color-6">
        <#case 'ttSecondary7' >
            <#return "color-second-color-7">
        <#case 'ttSecondary8' >
            <#return "color-second-color-8">
        <#case 'ttIllustrationSecondary1' >
            <#return "color-rose-10">
        <#case 'ttIllustrationSecondary2' >
            <#return "color-violet-10">
        <#case 'ttIllustrationSecondary3' >
            <#return "color-pastel-10">
        <#case 'ttIllustrationSecondary4' >
            <#return "color-orange-10">
        <#case 'ttIllustrationSkin1' >
            <#return "color-brown-10">
        <#case 'ttIllustrationSkin2' >
            <#return "color-brown-20">
        <#case 'ttIllustrationSkin3' >
            <#return "color-brown-30">
        <#case 'ttIllustrationSkin4' >
            <#return "color-brown-40">
        <#case 'ttIllustrationSkin5' >
            <#return "color-brown-50">
        <#case 'ttIllustrationSkin6' >
            <#return "color-brown-60">
        <#case 'ttIackground1' >
            <#return "color-light-10">
        <#case 'ttBackground2' >
            <#return "color-light-20">
        <#case 'ttBackground3' >
            <#return "color-light-30">
        <#case 'ttBackground4' >
            <#return "color-light-40">
        <#case 'ttBackground5' >
            <#return "color-light-50">
        <#case 'ttGray1' >
            <#return "color-gray-100">
        <#case 'ttGray2' >
            <#return "color-gray-200">
        <#case 'ttGray3' >
            <#return "color-gray-300">
        <#case 'ttGray4' >
            <#return "color-gray-400">
        <#case 'ttGray5' >
            <#return "color-gray-500">
				<#case 'gray6' >
            <#return "color-gray-600">
        <#default >
            <#return "">
    </#switch>
</#function>

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
			<#return "s-t-btn--l">
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
<#function getButtonIconName iconOpc>
  <#switch iconOpc>
		<#case "left">
			<#if (cardButtonConfiguration.buttonSettings.leftIconName.getData())?? && (cardButtonConfiguration.buttonSettings.leftIconName.getData()) != "">
				<#assign leftIconNameData = cardButtonConfiguration.buttonSettings.leftIconName.getData()/>
			<#else>
				<#assign leftIconNameData = ""/>
			</#if>
			<#return leftIconNameData>
		<#case "right">
			<#if (cardButtonConfiguration.buttonSettings.rightIconName.getData())?? && (cardButtonConfiguration.buttonSettings.rightIconName.getData()) != "">
				<#assign rightIconNameData = cardButtonConfiguration.buttonSettings.rightIconName.getData()/>
			<#else>
				<#assign rightIconNameData = ""/>
			</#if>
			<#return rightIconNameData>
		<#default>
			<#return "">
	</#switch>
</#function>




<#-- Macro para generar el HTML de un icono -->
<#macro buttonIconPart iconOpc>
  <span class="s-o-icon ${getButtonIconClass(iconOpc)}">
  	<i class="${getButtonIconName(iconOpc)}" aria-hidden="true"></i>
  </span>
</#macro>

<#function truncateText(text, maxLength)>
    <#assign truncatedText=text?truncate(maxLength,"",0)>
    <#assign lastSpacePosition = truncatedText?last_index_of(" ")>
    <#if lastSpacePosition gt 0>
        <#return truncatedText?substring(0, lastSpacePosition)>
    <#else>
        <#return truncatedText>
    </#if>
</#function>

<#--  Etiqueta  -->
<#if (cardTagConfiguration.cardTagText.getData())??  && cardTagConfiguration.cardTagText.getData() != "">
	<#assign cardTagText = cardTagConfiguration.cardTagText.getData() />
    <#assign cardTagTextLength = cardTagText?length />
    <#assign haveCardTagText = true />
<#else>
    <#assign cardTagText = "" />
    <#assign haveCardTagText = false />
</#if>

<#--  Imagen de la tarjeta mobile -->
<#if (cardImageConfiguration.imgMobile.getData())?? && cardImageConfiguration.imgMobile.getData() != "">
	<#assign mobileImage = cardImageConfiguration.imgMobile.getData() />
    <#assign altMobileImage = cardImageConfiguration.imgMobile.getAttribute("alt")/>
    <#assign haveMobileImage = true  />
<#else>
    <#assign mobileImage = "" />
    <#assign altMobileImage = "" />
    <#assign haveMobileImage = false  />
</#if>

<#--  Imagen de la tarjeta desktop -->
<#if (cardImageConfiguration.imgDesktop.getData())?? && cardImageConfiguration.imgDesktop.getData() != "">
	<#assign desktopImage = cardImageConfiguration.imgDesktop.getData() />
    <#assign altDesktopImage = cardImageConfiguration.imgDesktop.getAttribute("alt")/>
    <#assign haveDesktopImage = true  />
<#else>
    <#assign desktopImage = "" />
    <#assign altDesktopImage = "" />
    <#assign haveDesktopImage = false  />
</#if>

<#--  Fecha de publicación  -->
<#if (cardPublishDateConfiguration.cardPublishDateText.getData())??  && cardPublishDateConfiguration.cardPublishDateText.getData() != "">
	<#assign cardPublishDateText = cardPublishDateConfiguration.cardPublishDateText.getData() />
    <#assign cardPublishDateLength = cardPublishDateText?length />
    <#assign haveCardPublishDateText = true />
<#else>
    <#assign cardPublishDateText = "" />
    <#assign haveCardPublishDateText = false />
</#if>

<#--  Color del Titulo  -->
<#if (cardTitleConfiguration.colorTextTitle.getData())??>
    <#assign titleColor = cardTitleConfiguration.colorTextTitle.getData() />
	<#assign titleColor = colorClass(titleColor, "txt", "") />
<#else>
    <#assign titleColor = "txt-color-primary-color-1" />
</#if>

<#--  Color del fondo de la Card  -->
<#if (bgCard.colorBgCard.getData())??>
    <#assign bgColor = bgCard.colorBgCard.getData() />
	<#assign bgColor = colorClass(bgColor, "bg", "") />
<#else>
    <#assign bgColor = "bg-color-primary-color-1" />
</#if>






<#--  Titulo  -->
<#if (cardTitleConfiguration.cardTitleText.getData())??  && cardTitleConfiguration.cardTitleText.getData() != "">
	<#assign cardTitleText = cardTitleConfiguration.cardTitleText.getData() />
	<#assign cardTitleTextLength = cardTitleText?length />
    <#assign haveCardTitleText = true />
<#else>
    <#assign cardTitleText = "" />
    <#assign haveCardTitleText = false />
</#if>

<#--  Color del Parrafo  -->
<#if (cardParagraphConfiguration.cardParagraphColor.getData())??  && cardParagraphConfiguration.cardParagraphColor.getData() != "">
	<#assign colorParagraph = cardParagraphConfiguration.cardParagraphColor.getData() />
    <#assign colorParagraph = colorClass(colorParagraph, "txt", "") />
<#else>
    <#assign colorParagraph = "txt-color-gray-500" />
</#if>

<#--  Parrafo  -->
<#if (cardParagraphConfiguration.cardParagraphText.getData())??  && cardParagraphConfiguration.cardParagraphText.getData() != "">
	<#assign paragraphText = cardParagraphConfiguration.cardParagraphText.getData() />
    <#assign haveParagraphText = true />
<#else>
    <#assign paragraphText = "" />
    <#assign haveParagraphText = false />
</#if>

<#--  Botón  -->
<#assign enableButtonData = getterUtil.getBoolean(cardButtonConfiguration.buttonSettings.enableButton.getData()) />
<#if enableButtonData>
	<#if (cardButtonConfiguration.buttonSettings.buttonState.getData())?? && (cardButtonConfiguration.buttonSettings.buttonState.getData()) != "">
		<#assign buttonStateData = getButtonState(cardButtonConfiguration.buttonSettings.buttonState.getData())/>
	<#else>
		<#assign buttonStateData = getButtonState("")/>
	</#if>
	<#if (cardButtonConfiguration.buttonSettings.buttonType.getData())?? && (cardButtonConfiguration.buttonSettings.buttonType.getData()) != "">
		<#assign buttonTypeData = getButtonType(cardButtonConfiguration.buttonSettings.buttonType.getData())/>
	<#else>
		<#assign buttonTypeData = ""/>
	</#if>
	<#if (cardButtonConfiguration.buttonSettings.buttonSize.getData())?? && (cardButtonConfiguration.buttonSettings.buttonSize.getData()) != "">
		<#assign buttonSizeData = getButtonSize(cardButtonConfiguration.buttonSettings.buttonSize.getData())/>
	<#else>
		<#assign buttonSizeData = "s-t-btn--l"/>
	</#if>
	<#if (cardButtonConfiguration.buttonSettings.buttonTarget.getData())?? && (cardButtonConfiguration.buttonSettings.buttonTarget.getData()) != "">
		<#assign buttonTargetData = getButtonTarget(cardButtonConfiguration.buttonSettings.buttonTarget.getData())/>
	<#else>
		<#assign buttonTargetData = "_self"/>
	</#if>
	<#if (cardButtonConfiguration.buttonSettings.buttonActionUrl.getData())?? && (cardButtonConfiguration.buttonSettings.buttonActionUrl.getData()) != "">
		<#assign buttonActionUrlData = cardButtonConfiguration.buttonSettings.buttonActionUrl.getData()/>
	<#else>
		<#assign buttonActionUrlData = "#"/>
	</#if>
	<#assign enableButtonLeftIconData =getterUtil.getBoolean(cardButtonConfiguration.buttonSettings.enableButtonLeftIcon.getData())>
	<#assign enableButtonRightIconData = getterUtil.getBoolean(cardButtonConfiguration.buttonSettings.rightIconName.getData())>
</#if>

<#--  Texto boton  -->
<#if (cardButtonConfiguration.cardButtonText.getData())?? && cardButtonConfiguration.cardButtonText.getData() != "">
	<#assign cardButtonText = cardButtonConfiguration.cardButtonText.getData() />
    <#assign cardButtonTextLength = cardButtonText?length />
	<#assign haveTextButton = true />
<#else>
    <#assign cardButtonText = "" />
		<#assign haveTextButton = false />
</#if>





<#--  colorBorder Contorno -->
<#if (colorBorder.getData())??  && colorBorder.getData() != "">
	<#assign colorBorderRadius = colorBorder.getData() />
<#else>
    <#assign colorBorderRadius = "#FFF" />
</#if>



<section class="s-c-card-tag-img "  >
    <div  class="container"  >
        <div class="card-tag-img ${bgColor} "  style="border-radius: 12px ; border-width: 0px; box-shadow: 0 0 0 1px ${colorBorderRadius}"  >
            <!------------------divisor tag------------------->
            <#if haveCardTagText>
						
                <div class="s-c-card-tag-img d-flex">
                    <#if cardTagTextLength gt 20>
                        <#assign cardTagText = truncateText(cardTagText,20) />
                    </#if>
                    <span class="s-o-tag js-tag-card-option">${cardTagText}</span>
                </div>
            </#if>
            <div class="container_img_tag-img">
                <#if haveMobileImage>                        
                    <img class="img_tag-img d-block d-lg-none" src="${mobileImage}" alt="${altMobileImage}">
                </#if>
                <#if haveDesktopImage>                        
                    <img class="img_tag-img d-none d-lg-block" src="${desktopImage}" alt="${altDesktopImage}">
                </#if>
            </div>
            <div class="subcontainer-tag-img">
                <#if haveCardPublishDateText>
                    <div class="s-c-card-tag-img-parrafo-fecha">
                        <#if cardPublishDateLength gt 25>
                            <#assign cardPublishDateText = truncateText(cardPublishDateText,25) />
                        </#if>
                        <p>${cardPublishDateText}</p>
                    </div>
                </#if>
                <#if haveCardTitleText>
                    <p class="text-title-p ${titleColor}">
                        <#if cardTitleTextLength gt 56>
                                <#assign cardTitleText = truncateText(cardTitleText,56) />
                        </#if>
                        ${cardTitleText}
                    </p>
                </#if>
                <#if haveParagraphText>
                    <div class="text_tag-img">
                        <p class="${colorParagraph}">${paragraphText}</p>
                    </div>

                </#if>
                <#if enableButtonData && haveTextButton>
                    <#if cardButtonTextLength gt 20>
                        <#assign cardButtonText = truncateText(cardButtonText,20) />
                    </#if>
                    <a title="ir a ${cardButtonText}" role="button" class="s-o-btn s-t-btn--l s-o-card-tag-img-btn ${buttonTypeData} ${buttonSizeData} ${buttonStateData} car-entrada-articulos-gtm-${contentId}"
                        href="${buttonActionUrlData}" target="${buttonTargetData}">
                        <#if enableButtonLeftIconData>
                            <#assign icon = "left" />
                            <@buttonIconPart icon/>
                        </#if>
                        <span class="car-entrada-articulos-gtm-${contentId}">${cardButtonText}</span>
                        <#if enableButtonRightIconData>
                            <#assign icon = "right" />
                            <@buttonIconPart icon/>
                        </#if>           
                    </a>
                </#if>
            </div>
        </div>
    </div>
</section>

<#recover>
<h2>Lo sentimos, este contenido esta en construcción</h2>
</#attempt>