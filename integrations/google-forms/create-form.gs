/** Run once in your own Google Apps Script project. Creates an unpublished form and private response sheet. */
function createMeetupsForm() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('FORM_ID')) {
    console.log(FormApp.openById(properties.getProperty('FORM_ID')).getEditUrl());
    return;
  }
  const form = FormApp.create('Свої люди · заявка / solicitud / enquiry', false);
  properties.setProperty('FORM_ID', form.getId());
  form.setDescription('Збираємо охочих зустрітися та допомагаємо організувати спільний пікнік. Заявка не є підтвердженням місця. / Una solicitud no confirma una plaza. / An enquiry does not confirm a place.');
  form.setCollectEmail(false).setLimitOneResponsePerUser(false).setPublishingSummary(false);
  form.addTextItem().setTitle('Ім’я / Nombre / Name').setRequired(true);
  form.addTextItem().setTitle('Місто / Ciudad / City').setRequired(true);
  form.addListItem().setTitle('Тема / Tema / Topic').setChoiceValues(['Участь / Participación / Join','Нове місто / Nueva ciudad / New city','Меню / Menú / Menu','Допомога / Ayuda / Help','Співпраця / Colaboración / Partnership','Відгук / Opinión / Feedback','Інше / Otra / Other']).setRequired(true);
  form.addTextItem().setTitle('Telegram @username або телефон / o teléfono / or phone').setHelpText('Один контакт обов’язковий / Un contacto obligatorio / One contact required').setRequired(true).setValidation(FormApp.createTextValidation().requireTextMatchesPattern('(@[A-Za-z][A-Za-z0-9_]{4,31}|[+]?[0-9 ()-]{7,22})').setHelpText('@username або телефон з кодом країни / teléfono con prefijo / phone with country code').build());
  form.addTextItem().setTitle('Email (необов’язково / opcional / optional)').setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  form.addTextItem().setTitle('Подія та зручна дата / Evento y fecha / Event and date');
  form.addTextItem().setTitle('Дорослі / Adultos / Adults').setValidation(FormApp.createTextValidation().requireWholeNumber().requireNumberGreaterThanOrEqualTo(1).build());
  form.addTextItem().setTitle('Діти / Niños / Children').setValidation(FormApp.createTextValidation().requireWholeNumber().requireNumberGreaterThanOrEqualTo(0).build());
  form.addParagraphTextItem().setTitle('Побажання, транспорт, допомога / Preferencias, transporte, ayuda / Preferences, transport, help');
  form.addCheckboxItem().setTitle('Зв’язок щодо заявки / Contacto sobre la solicitud / Contact about this enquiry').setChoiceValues(['Погоджуюся / Acepto / I agree']).setRequired(true);
  form.addCheckboxItem().setTitle('Новини майбутніх зустрічей / Novedades / Future updates (optional)').setChoiceValues(['Хочу отримувати / Quiero recibir / I would like updates']);
  form.setConfirmationMessage('Дякуємо! / ¡Gracias! / Thank you! Організатор зв’яжеться з вами. / La organización se pondrá en contacto contigo. / The organiser will contact you.');
  const sheet=SpreadsheetApp.create('Свої люди · заявки');
  form.setDestination(FormApp.DestinationType.SPREADSHEET,sheet.getId());
  console.log('Редактор: '+form.getEditUrl());
  console.log('Таблиця: '+sheet.getUrl());
  console.log('Посилання після публікації: '+form.getPublishedUrl());
}
