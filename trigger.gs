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
  let sheet = getSheet(templateSpreadSheetId,"format");
  let employeeNames = getEmployeeNames();
  let date = new Date();
  let year = date.getFullYear();
  employeeNames.forEach((name) => {
    let spreadId = getSpreadId(name);
    var copy = copySheet(sheet,spreadId);
    moveSheet(copy,year);
    let currentBalancePaidLeave = getBalancePaidLeave(name);
    let joiningDate = getJoinsCompanyByEmployeeSheet(name);
    let paidLeave = getPaidLeave(joiningDate);
    updatePaidLeave(spreadId,currentBalancePaidLeave,paidLeave,name,year);
  });
}

function autoGrantPaidLeaveTest(){
  autoGrantPaidLeave();
}