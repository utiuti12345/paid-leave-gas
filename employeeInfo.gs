// 社員情報
(function (global) {
   /**
   * コンストラクタ 引数(社員名,スプレッドシート)
   * @constructor
   */
  var EmployeeInfo = function (employeeName,spreadId,mailAddress) {
    this.employeeName = employeeName;
    this.spreadId = spreadId;
    this.mailAddress = mailAddress;
  };
  
  global.EmployeeInfo = EmployeeInfo;
})(this);

// 社員情報
function employeeInfoTest(){
  var e = new EmployeeInfo("社員1","スプレッドシート1");
  console.log(e.employeeName);
  console.log(e.spreadId);
}