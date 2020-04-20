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

// 有給自動付与
function autoGrantPaidLeave(){
  let date = new Date();
  // 4月
  if((date.getMonth() + 1) === 4 ){
    let sheet = getSheet(templateSpreadSheetId,"format");
    let employeeNames = getEmployeeNames();
    let year = date.getFullYear();
    var lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    employeeNames.forEach((name) => {
        let spreadId = getSpreadId(name);
        var copy = copySheet(sheet,spreadId);
        moveSheet(copy,year);
        let currentBalancePaidLeave = getBalancePaidLeave(spreadId,lastYear);
        let joiningDate = getJoinsCompanyByEmployeeSheet(name);
        let paidLeave = getPaidLeave(joiningDate);
        updatePaidLeave(spreadId,currentBalancePaidLeave,paidLeave,name,year);
    });
  }
}

function autoGrantPaidLeaveTest(){
  autoGrantPaidLeave();
}