// 承認者
(function (global) {
   /**
   * コンストラクタ 引数(社員名,メールアドレス)
   * @constructor
   */
  var ApproveInfo = function (employeeName,mailAddress) {
    this.employeeName = employeeName;
    this.mailAddress = mailAddress;
  };
  
  global.ApproveInfo = ApproveInfo;
})(this);

// 承認者テスト
function approveInfoTest(){
  var e = new ApproveInfo("社員1","アドレス1");
  console.log(e.employeeName);
  console.log(e.mailAddress);
}
