function doGet(request) {
  var template = 'index';
  return HtmlService.createTemplateFromFile(template).evaluate();
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}