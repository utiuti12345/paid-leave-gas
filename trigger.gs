// Trriger
function autoMail(e){
  let itemResponses = e.response.getItemResponses();
  let answer = getAnswer(itemResponses);
  let employeeInfo = getEmployeeInfo(answer.employeeName);
  let approver = getApprover(answer.approver);
  let bodies = generateBodies(answer.employeeName,answer.paidDateTime);
  updatePaidTimeSheet(employeeInfo.name,employeeInfo.spreadId,answer.paidDateTime);
  sendMail(approver.mailAddress, subject, bodies.plain,bodies.html);
}

function autoGrantPaidLeave(){
  let sheet = getSheet(templateSpreadSheetId,"2020");
  let employeeNames = getEmployeeNames();
  employeeNames.forEach((name) => {
    let spreadId = getSpreadId(name);
    copySheet(sheet,spreadId);
    let JoiningDate = getJoinsCompanyByEmployeeSheet(name);
    
    let currentBalancePaidTime = getBalancePaidTime(name);
    let newBalancePaidTime = currentBalancePaidTime;
  });
  copySheet(sheet,destSpreadSheet);
}