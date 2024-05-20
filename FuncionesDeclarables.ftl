<#--  Funcion de colores en hexadecimal  -->
<#function colorHexa selectColor>
    <#switch selectColor>
        <#case "primary1">
            <#return "#2d6df6" />
        <#break>
        <#case "primary2">
            <#return "#FFFFFF" />
        <#break>
        <#case "secondary1">
            <#return "#0033A0" />
        <#break>
        <#case "secondary2">
            <#return "#E3E829" />
        <#break>
        <#case "secondary3">
            <#return "#00AEC7" />
        <#break>
        <#case "secondary4">
            <#return "#2D6DF6" />
        <#break>
        <#case "secondary5">
            <#return "#888B8D" />
        <#break>
        <#case "pantone1">
            <#return "#838DC8" />
        <#break>
        <#case "pantone2">
            <#return "#ECF0A1" />
        <#break>
        <#case "pantone3">
            <#return "#9BE1E9" />
        <#break>
        <#case "pantone4">
            <#return "#81B1FF" />
        <#break>
        <#case "pantone5">
            <#return "#B4B4B5" />
        <#break>
        <#case "light1">
            <#return "#E5E9EA" />
        <#break>
        <#case "light2">
            <#return "#F9FAE1" />
        <#break>
        <#case "light3">
            <#return "#E6FAEF" />
        <#break>
        <#case "light4">
            <#return "#DFEAFF" />
        <#break>
        <#case "light5">
            <#return "#F8F8F8" />
        <#break>
        <#case "success1">
            <#return "#067014" />
        <#break>
        <#case "warning1">
            <#return "#ED8B00" />
        <#break>
        <#case "error1">
            <#return "#D12D35" />
        <#break>
        <#case "info1">
            <#return "#0033A0" />
        <#break>
        <#case "success2">
            <#return "#DEF6DE" />
        <#break>
        <#case "warning2">
            <#return "#FFF5EC" />
        <#break>
        <#case "error2">
            <#return "#FFF4F3" />
        <#break>
        <#case "info2">
            <#return "#E0EAFF" />
        <#break>
        <#case "gray1">
            <#return "#F4F4F4" />
        <#break>
        <#case "gray2">
            <#return "#e7e7e7" />
        <#break>
        <#case "gray3">
            <#return "#3F3F41" />
        <#break>
        <#case "gray4">
            <#return "#000000" />
        <#break>
        <#case "dark1">
            <#return "#C5CB15" />
        <#break>
        <#case "dark2">
            <#return "#B04B60" />
        <#break>
        <#case "dark3">
            <#return "#00003F" />
        <#break>
        <#default>
            <#return "" />
    </#switch>
</#function>

<#--  Se crea un Select llamado BordeCard   y se consulta de la siguiente manera  -->
<#if (BordeCard.getData())?? && BordeCard.getData() != "">
    <#assign bordeCard = colorHexa(BordeCard.getData()) />
    <#else>
    <#assign bordeCard = "" />
</#if>

<#--  Por ultimo se crea una clase de estilo  con las indicaciones y se hace interpolacion del color con ${bordeCard},  se escrible la clase donde se desea.   -->
<style>
        .s-theme-V .card_redes_sociales{
            border: 1px solid ${bordeCard} 
        }  
    </style>



<#--  Nuevas Variables asignadas Version 2.0  --> 

<#--  sizeBorder:   Tamaño del Border    -->


<#-- En caso de querer aplicar un tamano en el Border Radius -->
<#--  Se crea el campo de texto:   sizeBorder  -->
<#if (sizeBorder.getData())??  && sizeBorder.getData() != "">
	<#assign borderRadius = sizeBorder.getData() />
<#else>
    <#assign borderRadius = "0" />
</#if>



<#--  borderWidth:  Tamaño del contorno exterior  -->
<#--  Se crea el campo de texto:   borderWidth  -->
<#if (borderWidth.getData())??  && borderWidth.getData() != "">
	<#assign borderWidthValue = borderWidth.getData() />
	
<#else>
    <#assign borderWidthValue = "0" />
</#if>


<#--  Alineacion de  de textos dentro de un texto enriquecido.  -->
<style type="text/css">/* Estilos CSS */
.left-aligned {
    text-align: left;
}
.centered {
    text-align: center;
}
.right-aligned {
    text-align: right;
}
</style>
<h1>Ejemplo</h1>
<p class="centered">¿Qué es Lorem Ipsum?</p>
<h2 class="left-aligned">¿Por qué lo usamos a la izquierda?</h2>
<h2 class="right-aligned">¿Por qué lo usamos a la derecha?</h2>




Opciones de colores:
<#-- Funcion para retornar el color -->
<#function colorClass selectColor prefijoClass prefixVariable>
    <#if prefixVariable != "">
        <#switch selectColor>
            <#case "${prefixVariable}Primary1">
                <#return "--primary-color-1" />
            <#break>
            <#case "${prefixVariable}Primary2">
                <#return "${prefijoClass}-color-primary-color-2" />
            <#break>
            <#case "${prefixVariable}Secondary1">
                <#return "${prefijoClass}-color-second-color-1" />
            <#break>
            <#case "${prefixVariable}Secondary2">
                <#return "--second-color-2" />
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
                <#return "--primary-color-1" />
            <#break>
            <#case "primary2">
                <#return "${prefijoClass}-color-primary-color-2" />
            <#break>
            <#case "secondary1">
                <#return "${prefijoClass}-color-second-color-1" />
            <#break>
            <#case "secondary2">
                <#return "--second-color-2" />
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


Se pintan de esta segunda manera
<div class="card-tag-img ${bgColor}"  style="border-radius: 12px; border-width: 1px; border-color: ${selectColorBorderValue}; box-shadow: 0 0 0 1px; color: var(${selectColorBorderValue})" >

<#--  En caso de que se deban actualizar los bordes inferiores se realiza de esta forma  -->
style="border-bottom-right-radius: ${borderRadius}px; border-bottom-left-radius: ${borderRadius}px">


 <#--  Se agrega ajuste Tiempo de animacion 300ms<    -->
 style="transition: all 300ms ease !important;"

Revisar Sombreados
 box-shadow
 0px 8px 25px 0px rgba(83, 89, 144, 0.25)
