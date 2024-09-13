// multiple_choices test
form_id='xxxxxx' // form id, you can extract them from the link to the sheet

function createFormFromSheet() {
  var sheet = SpreadsheetApp.openById(form_id).getActiveSheet();
  var data = sheet.getRange('A:F').getValues(); // Assuming data is in columns A - F (F is gt), annotator answer will be recorded in new columns

  var form = FormApp.create('Which answer do you prefer？');

  var annotatorNameQuestion = form.addTextItem();
  annotatorNameQuestion.setTitle('Please enter your nickname：');
  annotatorNameQuestion.setRequired(true);

  // todo replace hard-coded data length with non-empty data length
  for (var i = 1; i <=2; i++) {
    var row = data[i];
    var question = form.addMultipleChoiceItem();
    question.setTitle('You will be presented with a question and three answers, please choose the one you prefer： ' + i); // Set a generic title for each comparison
    question.setChoiceValues(['A', 'B', 'C', 'D: I do not like any one of them.']); // Add choices 'A', 'B', 'C' and 'D'
    question.setRequired(true); // Make the question required
    var description = "Question: " + row[1] + "\n\n\nA: " + row[2] + "\n\nB: " + row[3] + "\n\nC: " + row[4]; // set content texts
    question.setHelpText(description); // Display the text prompts as help text
  }

  var url = form.getPublishedUrl();
  Logger.log('Form URL: ' + url);

  ScriptApp.newTrigger('onMCQFormSubmit')
           .forForm(form)
           .onFormSubmit()
           .create();
}

function onMCQFormSubmit(e) {
  var sheet = SpreadsheetApp.openById(form_id).getActiveSheet();
  var response = e.response.getItemResponses();
  
  // Get the annotator's ID from the response
  var annotatorName= response[0].getResponse();
  // Find the next empty column to store annotator's answers
  var emptyColumn = sheet.getLastColumn() + 1;
  // Write the annotator's name to the first row of the new column
  sheet.getRange(1, emptyColumn).setValue(annotatorName);
  
  // Assuming the response should be written to emptyColumn starting from the 2nd row (index 2)
  for (var i = 1; i < response.length; i++) {
    var itemResponse = response[i];
    var answer = itemResponse.getResponse();
    sheet.getRange(i + 1, emptyColumn).setValue(answer); // Write the answer to the emptyColumn
  }
}
