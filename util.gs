// スプレッドシート取得
function getSheet(spreadId,sheetName){
  return SpreadsheetApp.openById(spreadId).getSheetByName(sheetName);
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