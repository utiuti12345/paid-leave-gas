// 社員情報
(function (global) {
   /**
   * コンストラクタ 引数(社員名,スプレッドシート)
   * @constructor
   */
  var EmployeeInfo = function (employeeName,spreadId) {
    this.employeeName = employeeName;
    this.spreadId = spreadId;
  };
  
  global.EmployeeInfo = EmployeeInfo;
})(this);

// 社員情報
function employeeInfoTest(){
  var e = new EmployeeInfo("社員1","スプレッドシート1");
  console.log(e.employeeName);
  console.log(e.spreadId);
}