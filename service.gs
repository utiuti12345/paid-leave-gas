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
  
//  var dates = getDates(e.parameter);
//  console.log(dates);
  
  var employeeInfo = new EmployeeInfo(employeeName,getSpreadId(employeeName));
  var approver = new ApproveInfo(employeeName,getMailAddress(employeeName));
  
  var paidLeaveList = "";
  for(var i=1;;i++){
    if(e.parameter['date'+i]===undefined){
      break;
    }
    var paidLeaveDate = new PaidLeaveDate(e.parameter['date'+i]);
    if(!(paidLeaveDate.isHoliday() || paidLeaveDate.isWeekend())){
      paidLeaveList += paidLeaveDate.date + ","
      updatePaidTimeSheet(employeeInfo.name,employeeInfo.spreadId,paidLeaveDate.date);
    }
  }
  
  var bodies = generateBodies(employeeInfo.employeeName,paidLeaveList);
  sendMail(approver.mailAddress,subject,bodies.plain,bodies.html);
}