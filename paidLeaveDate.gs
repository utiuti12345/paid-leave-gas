(function (global) {

  /**
   * コンストラクタ 引数(有給日付)
   * @constructor
   */
  var PaidLeaveDate = function (date) {
    this.date = new Date(date);
  };

  /**
   * 祝日判定
   * @returns {boolean}
   */
  PaidLeaveDate.prototype.isHoliday = function () {
    const calendars = CalendarApp.getCalendarsByName('日本の祝日');
    const count = calendars[0].getEventsForDay(this.date).length;
    return count === 1;
  };
  
   /**
   * 土日判定
   * @returns {boolean}
   */
  PaidLeaveDate.prototype.isWeekend = function () {
    return (this.date.getDay() === 0) || (this.date.getDay() === 6);
  };

  global.PaidLeaveDate = PaidLeaveDate;

})(this);

// 平日テスト
function weekdayTest(){
  var paidLeaveDate = new PaidLeaveDate(new Date("2020/4/13"));
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.date);
}

// 日曜テスト
function sundayTest(){
  var paidLeaveDate = new PaidLeaveDate(new Date("2020/4/12"));
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.date);
}

// 祝日テスト
function holidayTest(){
  var paidLeaveDate = new PaidLeaveDate(new Date("2020/4/29"));
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.date);
}