function doGet(request) {
  var template = 'index';
  return HtmlService.createTemplateFromFile(template).evaluate();
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doPost(e){
  var employeeName = e.parameter.employee_name;
  var startDate = e.parameter.start_date;
  var endDate = e.parameter.end_date;
  var approveName = e.parameter.approve_name;
  
  var employeeInfo = getEmployeeInfo(employeeName);
  var approver = getApprover(approveName);
  
  var dateLeave = "";
  for(var i=1;;i++){
    if(e.parameter['date'+i]===undefined){
      break;
    }
    dateLeave += e.parameter['date'+i] + ","
    updatePaidTimeSheet(employeeInfo.name,employeeInfo.spreadId,e.parameter['date'+i]);
  }
  
  var bodies = generateBodies(employeeInfo.name,dateLeave);
  sendMail(approver.mailAddress, subject, bodies.plain,bodies.html);
}