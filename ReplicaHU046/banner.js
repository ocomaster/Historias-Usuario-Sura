$(document).ready(function () {
	$(fragmentElement)
  .find('[data-lfr-editable-type="text"]')
  .each(function () {
    var txtLenght = $(this).text().length;
    if (txtLenght == 0) {
      $(this).addClass("s-is-stepper-container__validation");
      $(this).text("Campo obligatorio");
    } else {
      if ($(this).hasClass("s-is-stepper-container__validationn")) {
        $(this).removeClass("s-is-stepper-container__validation");
      }
    }
  });
});