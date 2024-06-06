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
/* Reglas generales */
.s-c-height {
    max-height: 300px;
}

.min-height-r {
    min-height: 0px;
}

.s-theme-V .s-c-banner-image-expand .container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    max-width: none;
    min-height: 0px;
    max-height: 275px;
    border-radius: 12px;
    box-shadow: 0px 16px 20px 0px rgba(0, 0, 0, 0.1);
}

.s-theme-V .s-c-banner-image-expand .s-s-banner-expand-text {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    height: auto;
    padding: 5vw 5vw 5vw 7vw; /* Unidades flexibles */
    color: var(--primary-color-2);
}

/* Reglas específicas para tabletas y móviles */
@media (max-width: 1023px) {
    .s-theme-V .s-c-banner-image-expand .container {
        flex-direction: column-reverse; /* Ajusta la dirección del flex a columna */
        align-items: center; /* Centra los elementos horizontalmente */
        padding: 1px 1px;
        max-height: 800px; /* Ajuste tamaño de imagen para mobile */
    }

    .s-theme-V .s-s-banner-expand-text {
        width: 100%; /* Ancho completo en dispositivos móviles */
        padding: 16px 20px;
    }
}

@media (max-width: 767px) {
    .s-theme-V .s-c-banner-image-expand .s-s-banner-expand-text {
        width: 100%; /* Ancho completo en dispositivos móviles */
        padding: 4vw 4vw; /* Reduce el padding para móviles */
        text-align: center; /* Centra el texto */
    }

    .s-theme-V .s-c-banner-expand-image,
    .s-theme-V .s-c-banner-expand-image-mobile {
        width: 100%; /* Ancho completo en móviles */
        height: auto; /* Ajusta la altura automáticamente */
        margin-bottom: 16px; /* Añade un margen inferior para separar la imagen del texto */
    }

    .s-theme-V .s-c-banner-expand-image img,
    .s-theme-V .s-c-banner-expand-image-mobile img {
        width: 100%; /* Asegura que la imagen ocupe todo el ancho */
        height: auto; /* Ajusta la altura automáticamente */
        object-fit: cover; /* Mantiene la relación de aspecto de la imagen */
    }
}
</style>
<div class="fragment_743">
    <section class="s-c-banner-image-expand container ">
        <div class="container d-flex bg-color-${bannerBackgroundColor} s-c-height">
            <!-----------------divisor para el texto------------------->
            <div class="s-s-banner-expand-text ${contentOrientation} s-c-height">
                <${titleTag} class="txt-color-${titleColor}" data-lfr-editable-id="bannerTitle" data-lfr-editable-type="text">
                    Titulo del banner (Máximo 120 caracteres).
                </${titleTag}>
                [#if enableParagraph]
                <p class="txt-color-${paragraphColor}" data-lfr-editable-id="paragraphText" data-lfr-editable-type="text">
                    Párrafo de texto (Máximo 150 caracteres)
                </p>
                [/#if]
                <!------------------divisor texto-icono------------------->
                [#if enableIconText]
                <div class="s-c-banner-expand-text-icon">
                    <ul class="txt-color-${iconTextColor}" style="list-style: none;">
                        [#list 0..iconTextItems-1 as iconTextItem]
                        <lfr-drop-zone data-dropzone-id="textItem${iconTextItem}"></lfr-drop-zone>
                        [/#list]
                    </ul>
                </div>
                [/#if]
                <!------------------divisor tag------------------->
                [#if enableTag]
                <div class="s-c-banner-expand-tag d-flex s-c-height">
                    <div class="texto-tag txt-color-${tagTextColor} bg-color-${tagBackgroundColor}">
                        <p data-lfr-editable-id="tagText" data-lfr-editable-type="text">Evento finalizado (Máx 20 caracteres)</p>
                    </div>
                </div>
                [/#if]
                <!-----------------divisor para el botón------------------->
                [#if enableButton]
                <div class="s-c-banner-expand-btn s-c-height-border">
                    <a title="${buttonText}" class="s-o-btn s-t-btn--fw-mobil ${buttonType} ${buttonSize} ${buttonState} banner-image-expand-gtm-${elementId}" href="${buttonURL}" title="Botón" target="_${openingType}">
                        [#if enableLeftIcon]
                        <div class="s-o-icon s-t-icon--left m-r-16">
                            <i class="${leftIconName}" aria-hidden="true"></i>
                        </div>
                        [/#if]
                        <span class="banner-image-expand-gtm-${elementId} s-c-height">
                            ${stringUtil.shorten(htmlUtil.stripHtml(buttonText), 20)}
                        </span>
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
            <div class="s-c-banner-expand-image ${imageOrientation} s-c-height">
                <div class="mask-image">
                    <img class="img" alt="imagen banner" data-lfr-editable-id="bannerDesktopImage" data-lfr-editable-type="image" loading="lazy">
                </div>
            </div>
            <div class="s-c-banner-expand-image-mobile ${imageOrientation} s-c-height">
                <div class="mask-image-mobile">
                    <img class="img" alt="imagen banner" data-lfr-editable-id="bannerMobileImage" data-lfr-editable-type="image" loading="lazy">
                </div>
            </div>
        </div>
    </section>
</div>
