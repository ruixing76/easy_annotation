// Configuration
form_id='xxxxxx' // form id, you can extract them from the link to the sheet
end_row=3 // hard code the length for now

function createBinaryFormFromSheet() {
  Logger.log('Running latest version...');
  var sheet = SpreadsheetApp.openById(form_id).getActiveSheet();
  var data = sheet.getRange('A:F').getValues(); // Assuming data is in columns A - F (F is gt), annotator answer will be recorded in new columns

  var form = FormApp.create('Human or Machine?');

  var annotatorNameQuestion = form.addTextItem();
  annotatorNameQuestion.setTitle('Please enter your nickname：');
  annotatorNameQuestion.setRequired(true);


  for (var i = 1; i <=end_row; i++) {
    Logger.log('Running example '+i+' ...');
    var row = data[i];
    var question = form.addMultipleChoiceItem();
    question.setTitle('Please choose the one you think is the human answer： '); // Set a generic title for each comparison
    question.setChoiceValues(['A', 'B']); // Add choices 'A' and 'B'
    question.setRequired(true); // Make the question required
    var description = "Question "+ i + " :\n" + row[2] + "\n\n\n\nA: " + row[3] + "\n\n\n\nB: " + row[4]; // set content texts
    question.setHelpText(description); // Display the text prompts as help text
  }

  var url = form.getPublishedUrl();
  Logger.log('Form URL: ' + url);

  Logger.log('Generating trigger...');
  ScriptApp.newTrigger('onFormSubmit')
           .forForm(form)
           .onFormSubmit()
           .create();
}

function onFormSubmit(e) {
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
