// Гена Dilnok Панасин
// https://www.behance.net/dilnok
// inDesign script

var exportPresets = [
	"На печать",
	"[Высококачественная печать]",
	"[Наименьший размер файла]",
	"[Полиграфическое качество]",
	"[PDF/X-1a:2001]",
	"[PDF/X-3:2002]",
	"[PDF/X-34:2010]",
];

// Экспорт каждой страницы по отдельности
function exportPageSeparate (names, options) {
  var docPageName;
  var docFilePath;
  var docFile;
  var docDocument = app.documents.item(0);
  var docBaseName = docDocument.name;

  docBaseName = docBaseName.replace('.indd', '');
  var docPDFExportPreset = app.pdfExportPresets.item(options.presetExportName);
  var docPagesCount = docDocument.pages.length;
  var destFolder = Folder.selectDialog('Выберите папку для сохранения файлов PDF');
  
  for (var docCounter = 0; docCounter < docPagesCount; docCounter += options.pagesCount) {
	var lastPage = docCounter + options.pagesCount;
	
    app.pdfExportPreferences.pageRange = (docCounter + 1) + '-' + (lastPage >= docPagesCount ? docPagesCount : lastPage);

	docFilePath = destFolder + '/' + docBaseName + '_' + names[docCounter] + '.pdf';
	docFile = new File(docFilePath);
	docDocument.exportFile(ExportFormat.pdfType, docFile, false, docPDFExportPreset);
  }
  
  alert('Экспорт завершен.');
}

// Функция для поиска текстового поля с заданным стилем абзаца
function findTextFrameByParagraphStyle (page, paragraphStyleName) {
  var allTextFrames = page.textFrames;
  for (var i = 0; i < allTextFrames.length; i++) {
    var currentTextFrame = allTextFrames[i];
    if (currentTextFrame.paragraphs.length > 0 && currentTextFrame.paragraphs[0].appliedParagraphStyle.name === paragraphStyleName) {
      return currentTextFrame;
    }
  }
  return null;
}

var names = [];

// Проверяем, открыт ли документ
if (app.documents.length) {
  var doc = app.activeDocument;
  var docPagesCount = doc.pages.length;

  // Проходимся по каждой странице документа
  for (var i = 0; i < docPagesCount; i += 1) {
    var currentPage = doc.pages[i];

    // Ищем текстовое поле со стилем абзаца "exportName"
    var exportNameTextFrame = findTextFrameByParagraphStyle(currentPage, 'exportName');
    if (exportNameTextFrame) {
		var content = exportNameTextFrame.contents;
		if (content) names.push(content);
    }
  }
} else {
  alert('Откройте документ перед запуском скрипта.');
}

// Это диалоговое окно
var myDialog = app.dialogs.add({name:"Настройки экспорта", canCancel:true});
with(myDialog){
    // Колонка
    with(dialogColumns.add()){
        //Панель с для текста
        with(borderPanels.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Страниц на файл"});
            }
			
            with(dialogColumns.add()){
                var myTextEditField = textEditboxes.add({editContents:"1", minWidth:40});
            }
        }
		
        // Выпадающий список с выбором набора настроек
        with(borderPanels.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Набор настроек для экспорта"});
            }  
			
            with(dialogColumns.add()){
                //Create a pop-up menu ("dropdown") control.
                var presetExportName = dropdowns.add({stringList:exportPresets, selectedIndex:0});
            }
        }
    }
}

//Display the dialog box.
if(myDialog.show() == true){
    var options = {};
    options.pagesCount = parseInt(myTextEditField.editContents, 10);
	options.presetExportName = exportPresets[presetExportName.selectedIndex];

    myDialog.destroy();
	
	// Экспоритровать
	exportPageSeparate(names, options);
}
else{
    myDialog.destroy()
}
