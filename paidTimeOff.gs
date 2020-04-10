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

// 回答
function answerInfo(employeeName,paidDateTime,approver){
  return {
    employeeName: employeeName,
    paidDateTime: paidDateTime,
    approver: approver
  };
}

// 社員情報
function employeeInfo(employeeName,spreadId){
  return {
    name: employeeName,
    spreadId: spreadId
  };
}

// 有給ステータス
function paidStatus(){
  return {
    plans:"■　予定",
    digestion:"○　消化"
  };
}

// 承認者
function approverInfo(employeeName,mailAddress){
  return {
    name: employeeName,
    mailAddress: mailAddress
  };
}

// 固定値
const subject = "有給休暇申請";

// Function
// メール送信
function sendMail(mailAddress,subject,plainBody,htmlBody){
  GmailApp.sendEmail(mailAddress, subject, plainBody,{ htmlBody:htmlBody });
}

// 回答取得
function getAnswer(itemResponses){
  var employeeName = "";
  var paidDateTime = "";
  var paidDays = "";
  var approver = "";
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var type = itemResponse.getItem().getType();
    var answer = itemResponse.getResponse();
    switch(question){
    case '社員名': 
      employeeName = answer;
      break;
    case '取得日時':
      paidDateTime = answer;
      break;
    case '有給日数':
      if(type == 'GRID'){ // typeはEnumのため比較演算子を使う
        var rows = itemResponse.getItem().asGridItem().getRows();
        for(var j = 0; j < rows.length; j++){
          var titleRow = rows[j];
          var answerCol = answer[j];
          order += titleRow + ' : ' + answerCol + '\n';
        }
        paidDays = order;
      }
      break;
     case '承認者':
        approver = answer;
        break;
      default:
        break;
    }
  }
  
  return answerInfo(employeeName,paidDateTime,approver);
}

// 送信する本文の作成
function generateBodies(employeeName,paidDateTime){
  var plain = '';
  plain += '有給休暇申請がありました。\n\n';
  plain += '・社員名: ' + employeeName + '\n';
  plain += '・取得日時: ' + paidDateTime + '\n';
 
  var html = '';
  html += '<h1>有給休暇申請のお知らせ</h1>';
  html += '<p>有給休暇申請がありました。</p>';
  html += '<ul>';
  html += '<li>社員名: ' + employeeName + '</li>';
  html += '<li>取得日時: ' + paidDateTime + '</li>';
  html += '</ul>';
  
  return {
    plain: plain,
    html: html
  };
}

// 有給休暇シートの更新
function updatePaidTimeSheet(employeeName,spreadId,paidDateTime){
  var date = new Date(paidDateTime);
  var sheet = getSheet(spreadId,date.getFullYear());
  var row = findRow(sheet,(date.getMonth()+1) + "月",2);
  var col = findColumn(sheet,date.getDate(),8);
  sheet.getRange(row, col).setValue(paidStatus().digestion);
}

// 承認者情報取得
function getApprover(name){
  var mailAddress = getMailAddress(name);
  return approverInfo(name,getMailAddress(name));
}

// 社員情報取得
function getEmployeeInfo(name){
  var spreadId = getSpreadId(name);
  return employeeInfo(name,spreadId);
}

// メールアドレス取得
function getMailAddress(employeeName){
  var sheet = getSheet('1BFQtPLNbocGD-T4laT6DD1BAlym21sJdhgxl4Rl8YG4','mail_address_list');
  var row = findRow(sheet,employeeName,2);
  var col = findColumn(sheet,'メールアドレス',1);
  return sheet.getRange(row, col).getValue();
}

// スプレッドシートID取得
function getSpreadId(name){
  var sheet = getSheet('1BFQtPLNbocGD-T4laT6DD1BAlym21sJdhgxl4Rl8YG4','spread_list');
  var row = findRow(sheet,name,2);
  var col = findColumn(sheet,'スプレッドシートID',1);
  return sheet.getRange(row, col).getValue();
}