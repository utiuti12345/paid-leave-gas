// 固定値
const subject = "有給休暇申請";
const templateSpreadSheetId = "1WVf4yj06qIasga3nOHMn8LAKi2b3odBo22m6H_zf8sM";
const masterSpreadSheetId = "12yYRdZcLM_tCCGUtZJhSQtt0VdReV3C71JHlUSSLFII";
const approveList = "approve_list";
const employeeListSheet = "employee_list";

// 有給ステータス
function paidStatus(){
  return {
    plans:"■　予定",
    digestion:"○　消化"
  };
}

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
function generateAprroveBodies(employeeName,paidDateTime){
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

// 送信する本文の作成
function generateApplicantBodies(employeeName,paidDateTime,balancePaidLeave,spreadId){
  var plain = '';
  plain += '有給休暇申請がありました。\n\n';
  plain += '・社員名: ' + employeeName + '\n';
  plain += '・取得日時: ' + paidDateTime + '\n';
  plain += '・残り有給日数: ' +  balancePaidLeave + '\n';
  plain += '・有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '\n';
 
  var html = '';
  html += '<h1>有給休暇申請のお知らせ</h1>';
  html += '<p>有給休暇申請がありました。</p>';
  html += '<ul>';
  html += '<li>社員名: ' + employeeName + '</li>';
  html += '<li>取得日時: ' + paidDateTime + '</li>';
  html += '<li>残り有給日数: ' +  balancePaidLeave + '</li>';
  html += '<li>有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '</li>';
  html += '</ul>';
  
  return {
    plain: plain,
    html: html
  };
}

// パラメーター取得
function getParameter(parameter){
  var employeeName = parameter.employee_name;
  var approveName = parameter.approve_name;
  var dates = [];
  if(parameter.start_date === "" && parameter.end_date === ""){
    for(var i=1;;i++){
      if(parameter['date'+i] === undefined){
        break;
      }
      else if(parameter['date'+i] === ''){
        continue;
      }
      dates.push(parameter['date'+i]);
    }
  }
  else{
    var endDate = new Date(parameter.end_date);
    dates.push(parameter.start_date);
    for(var i=1;;i++){
      var tommorow = new Date(parameter.start_date);
      tommorow.setDate(tommorow.getDate() + i);
      dates.push(tommorow.toString());
      if(tommorow.getTime() === endDate. getTime()){
        break;
      }
    }
  }
  
  return {
    employeeName: employeeName,
    dates: dates,
    approveName: approveName
  };
}

// スプレッドシート取得
function getSheet(spreadId,sheetName){
  return SpreadsheetApp.openById(spreadId).getSheetByName(sheetName);
}

// シートコピー
function copySheet(sheet,destSpreadId){
  var destination = SpreadsheetApp.openById(destSpreadId);
  sheet.copyTo(destination);
}

// 有給休暇シートから残日数の取得
function getBalancePaidTime(spreadId,paidDateTime){
  var date = new Date(paidDateTime);
  var sheet = getSheet(spreadId,date.getFullYear())
  return sheet.getRange(6, 14).getValue();
}

// 有給休暇シートの更新
function updatePaidTimeSheet(spreadId,paidDateTime){
  var date = new Date(paidDateTime);
  var sheet = getSheet(spreadId,date.getFullYear());
  var row = findRow(sheet,(date.getMonth()+1) + "月",2);
  var col = findColumn(sheet,date.getDate(),8);
  sheet.getRange(row, col).setValue(paidStatus().digestion);
}

// 社員シートから名前取得
function getEmployeeNames(){
  var sheet = getSheet(masterSpreadSheetId,employeeListSheet);
  var lastRow = sheet.getDataRange().getLastRow();
  var names = [];
  for(var i = 2; i < lastRow + 1; i++){
    names.push(sheet.getRange(i, 2).getValue())
  }
  return names;
}

// 社員シートからメールアドレス取得
function getMailAddressByEmployeeSheet(name){
  var sheet = getSheet(masterSpreadSheetId,employeeListSheet);
  var row = findRow(sheet,name,2);
  var col = findColumn(sheet,'メールアドレス',1);
  return sheet.getRange(row, col).getValue();
}

// 社員シートから入社日取得
function getJoinsCompanyByEmployeeSheet(name){
  var sheet = getSheet(masterSpreadSheetId,employeeListSheet);
  var row = findRow(sheet,name,2);
  var col = findColumn(sheet,'入社日',1);
  return sheet.getRange(row, col).getValue();
}

// 今年の有給日数を取得
function getPaidLeave(joiningDate){
  let jd = new Date(joiningDate);
  let now = new Date();
  let ms = now.getTime() - jd.getTime();
  let lengthService = Math.floor(ms / (1000*60*60*24*365));
  switch(lengthService) {
      case 6 : return 10;
      case 18 : return 11;
      case 30 : return 12;
      case 42 : return 14;
      case 54 : return 16;
      case 66 : return 18;
      case 78 : return 20;
  }
}

// 承認者シートからメールアドレス取得
function getMailAddressByApproveSheet(name){
  var sheet = getSheet(masterSpreadSheetId,approveList);
  var row = findRow(sheet,name,2);
  var col = findColumn(sheet,'メールアドレス',1);
  return sheet.getRange(row, col).getValue();
}

// スプレッドシートID取得
function getSpreadId(name){
  var sheet = getSheet(masterSpreadSheetId,employeeListSheet);
  var row = findRow(sheet,name,2);
  var col = findColumn(sheet,'スプレッドシートID',1);
  return sheet.getRange(row, col).getValue();
}

// 対象の行を返す
function findRow(sheet,val,col){
  var lastRow = sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得
  for(var i=1;i<=lastRow;i++){
    if(sheet.getRange(i,col).getValue() === val){
      return i;
    }
  }
  return 0;
}
  
// 対象の列を返す
function findColumn(sheet,val,row){
  var lastColumn = sheet.getDataRange().getLastColumn(); //対象となるシートの最終列を取得
  for(var i=1;i<=lastColumn;i++){
    if(sheet.getRange(row,i).getValue() === val){
      return i;
    }
  }
  return 0;
}