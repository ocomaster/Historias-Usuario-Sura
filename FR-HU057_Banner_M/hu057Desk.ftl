[#assign componentOrientation = configuration.componentOrientation]
[#assign bannerBackgroundColor = configuration.bannerBackgroundColor]
[#assign titleColor = configuration.titleColor]
[#assign titleTag = configuration.titleTag]
[#assign enableParagraph = configuration.enableParagraph]
[#assign paragraphColor = configuration.paragraphColor]
[#assign enableIconText = configuration.enableIconText]
[#assign iconTextItems =configuration.iconTextItems]
[#assign iconTextColor =configuration.iconTextColor]
[#assign enableTag =configuration.enableTag]
[#assign tagBackgroundColor =configuration.tagBackgroundColor]
[#assign tagTextColor =configuration.tagTextColor]
[#assign enableButton = configuration.enableButton]
[#assign buttonText = configuration.buttonText]
[#assign buttonType =configuration.buttonType]
[#assign buttonSize =configuration.buttonSize]
[#assign enableLeftIcon =configuration.enableLeftIcon]
[#assign enableRightIcon =configuration.enableRightIcon]
[#assign leftIconName =configuration.leftIconName]
[#assign rightIconName =configuration.rightIconName]
[#assign buttonURL =configuration.buttonURL]
[#assign openingType =configuration.openingType]
[#assign buttonState =configuration.buttonState]
[#assign elementId= fragmentEntryLinkNamespace]
[#-- Funcion para el select de estado del boton recibe el valor del campo --]
[#function getButtonState buttonStateData]
  [#switch buttonStateData]
		[#case "inactive"]
			[#return "s-t-disabled"]
		[#case "default"]
			[#return ""]
		[#default]
			[#return ""]
	[/#switch]
[/#function]
[#-- Funcion para el select de tipo de boton recibe el valor del campo --]
[#function getButtonType buttonTypeData]
  [#switch buttonTypeData]
		[#case "primario"]
			[#return ""]
		[#case "primarioVerde"]
			[#return "s-t-btn--green"]
		[#case "outline"]
			[#return "s-t-btn--outline"]
		[#case "outlineAlert"]
			[#return "s-t-btn--alert"]
		[#case "terciario"]
			[#return "s-t-btn--tertiary"]
		[#case "terciarioAlert"]
			[#return "s-t-btn--tertiary-variant"]
		[#default]
			[#return ""]
	[/#switch]
[/#function]
[#-- Funcion para el select de tamano de boton recibe el valor del campo --]
[#function getButtonSize buttonSizeData]
  [#switch buttonSizeData]
		[#case "botonS"]
			[#return "s-t-btn--s"]
		[#case "botonM"]
			[#return "s-t-btn--m"]
		[#case "botonL"]
			[#return "s-t-btn--l"]
		[#default]
			[#return "s-t-btn--m"]
	[/#switch]
[/#function]
[#-- Funcion para el select de tipo de apertura de boton recibe el valor del campo --]
[#function getButtonTarget buttonTargetData]
  [#switch buttonTargetData]
		[#case "self"]
			[#return "_self"]
		[#case "blank"]
			[#return "_blank"]
		[#default]
			[#return "_self"]
	[/#switch]
[/#function]
[#-- Funcion para dar el valor de la clase para los iconos --]
[#function getButtonIconClass iconOpc]
  [#switch iconOpc]
		[#case "left"]
			[#return "s-t-icon--left m-r-16"]
		[#case "right"]
			[#return "s-t-icon--right m-l-16"]
		[#default]
			[#return ""]
	[/#switch]
[/#function]
[#-- Funcion para dar el valor de el nombre de los iconos --]
[#function getButtonIconName iconOpc]
  [#switch iconOpc]
		[#case "left"]
			[#if iconButtonLeft?length != 0]
				[#assign leftIconNameData =iconButtonLeft/]
			[#else]
				[#assign leftIconNameData = ""/]
			[/#if]
			[#return leftIconNameData]
		[#case "right"]
			[#if iconButtonRight?length != 0]
				[#assign rightIconNameData = iconButtonRight/]
			[#else]
				[#assign rightIconNameData = ""/]
			[/#if]
			[#return rightIconNameData]
		[#default]
			[#return ""]
	[/#switch]
[/#function]
[#-- Macro para generar el HTML de un icono --]
[#macro buttonIconPart iconOpc]
  <div class="s-o-icon ${getButtonIconClass(iconOpc)}">
  	<i class="${getButtonIconName(iconOpc)}" aria-hidden="true"></i>
	</div>
[/#macro]
[#assign buttonType =getButtonType(buttonType)]
[#assign buttonSize =getButtonSize(buttonSize)]
[#assign buttonState =getButtonState(buttonState)]
[#if componentOrientation == "left"]
    [#assign contentOrientation ="order-lg-0"]
    [#assign imageOrientation ="order-lg-1"]
[/#if]
[#if componentOrientation == "right"]
    [#assign contentOrientation ="order-lg-1"]
    [#assign imageOrientation ="order-lg-0"]
[/#if]

<style>
.s-c-height{
    max-height:300px
}
</style>

<div class="fragment_504" >
	<section class="s-c-banner-overflowed s-c-height bg-color-${bannerBackgroundColor}" >
        <div class="s-c-banner-overflowed-content d-flex s-c-height">
            <!-----------------divisor para el texto------------------->
            <div class="s-s-banner-flowed-text ${contentOrientation} s-c-height" style="max-width: 1128px; margin-left: 58px;">
                <${titleTag} class="txt-color-${titleColor}" data-lfr-editable-id="bannerTitle" data-lfr-editable-type="text">
                    Titulo del banner (Máximo 120 caracteres)
                </${titleTag}>
                [#if enableParagraph]
                    <p class="txt-color-${paragraphColor} " data-lfr-editable-id="paragraphText" data-lfr-editable-type="text">
                        Párrafo de texto (Máximo 150 caracteres)
                    </p>
                [/#if]
                <!------------------divisor texto-icono------------------->
                [#if enableIconText]
                <div class="s-c-banner-flowed-text-icon">
                    <ul class="txt-color-${iconTextColor}" style="list-style: none;">
                        [#list 0..iconTextItems-1 as iconTextItem]
                            <lfr-drop-zone data-dropzone-id="textItem${iconTextItem}"></lfr-drop-zone>
                        [/#list]
                    </ul>
                </div>
                [/#if]
                <!------------------divisor tag------------------->
                [#if enableTag]
                    <div class="s-c-banner-overflowed-tag d-flex s-c-height">
                        <div class="texto-tag txt-color-${tagTextColor} bg-color-${tagBackgroundColor}">
                            <p data-lfr-editable-id="tagText" data-lfr-editable-type="text">Evento finalizado (Máx 20 caracteres)</p>
                        </div>
                    </div>
                [/#if]
                <!-----------------divisor para el botón------------------->
                [#if enableButton]
                    <div class="s-c-banner-overflowed-btn s-c-height">
                        <a title="${buttonText}" class="s-o-btn s-t-btn--fw-mobil ${buttonType} ${buttonSize} ${buttonState} banner-m-interna-boton-imagen-derecha-gtm-${elementId}" href="${buttonURL}" title="Botón" target="_${openingType}">
                            [#if enableLeftIcon]
                            <div class="s-o-icon s-t-icon--left m-r-16">
                                <i class="${leftIconName}" aria-hidden="true"></i>
                            </div>
                            [/#if]
                            <span class="banner-m-interna-boton-imagen-derecha-gtm-${elementId}">${stringUtil.shorten(htmlUtil.stripHtml(buttonText), 20)}</span>
                            [#if enableRightIcon]
                            <div class="s-o-icon s-t-icon--right m-l-16">
                                <i class="${rightIconName}" aria-hidden="true"></i>
                            </div>
                            [/#if] 
                        </a>
                    </div>
                [/#if]
            </div>
            <!-----------------divisor para la imagen------------------->
            <div class="s-c-banner-overflowed-image ${imageOrientation} s-c-height" >
                <div class="mask-image">
                    <img class="img img-desktop" alt="imagen banner" data-lfr-editable-id="bannerDesktopImage" data-lfr-editable-type="image" loading="lazy">
                </div>
            </div>
            <div class="s-c-banner-overflowed-image-mobile ${imageOrientation} s-c-height">
                <div class="mask-image-mobile">
                    <img class="img img-mobile" alt="imagen banner" data-lfr-editable-id="bannerMobileImage" data-lfr-editable-type="image" loading="lazy">
                </div>
            </div>
        </div>
    </section>
</div>  