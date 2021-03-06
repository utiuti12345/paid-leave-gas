function doGet(request) {
  var template = 'index';
  return HtmlService.createTemplateFromFile(template).evaluate();
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doPost(e){
  var paramater = getParameter(e.parameter);

  var employeeInfo = new EmployeeInfo(paramater.employeeName,getSpreadId(paramater.employeeName),getMailAddressByEmployeeSheet(paramater.employeeName));
  var approver = new ApproveInfo(paramater.employeeName,getMailAddressByApproveSheet(paramater.employeeName));
  
  var paidLeaveList = "";
  for(var i=0;i<paramater.dates.length;i++){
    var paidLeaveDate = new PaidLeaveDate(paramater.dates[i]);
    if(!(paidLeaveDate.isHoliday() || paidLeaveDate.isWeekend())){
      paidLeaveList += paidLeaveDate.formatDate() + " "
      updatePaidTimeSheet(employeeInfo.spreadId,paidLeaveDate.date);
    }
  }

  let now = new Date();
  let nowDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDay(); 
  
  var aprroveBodies = generateAprroveBodies(employeeInfo.employeeName,paidLeaveList);
  sendMail(approver.mailAddress,subject,aprroveBodies.plain,aprroveBodies.html);

  var applicantBodies = generateApplicantBodies(employeeInfo.employeeName,paidLeaveList,getBalancePaidLeave(employeeInfo.spreadId,nowDate),employeeInfo.spreadId);
  sendMail(employeeInfo.mailAddress,subject,applicantBodies.plain,applicantBodies.html);
  
  return HtmlService.createHtmlOutput("完了しました。メールを確認してください。");
}