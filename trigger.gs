// Trriger
function autoMail(e){
  var itemResponses = e.response.getItemResponses();
  var answer = getAnswer(itemResponses);
  var employeeInfo = getEmployeeInfo(answer.employeeName);
  var approver = getApprover(answer.approver);
  var bodies = generateBodies(answer.employeeName,answer.paidDateTime);
  updatePaidTimeSheet(employeeInfo.name,employeeInfo.spreadId,answer.paidDateTime);
  sendMail(approver.mailAddress, subject, bodies.plain,bodies.html);
}