$(document).ready(function () {

  var table = $("#tableObj").DataTable({
    ajax: "https://brandon12345.ddns.net/mongoapi", //接telemedicin.py的/mongoapi資料進行data table渲染
    columns: [
      //列的標題一般是從DOM中讀取（也可以使用這個屬性為表格創建列標題)
      { data: "Real_name", title: "姓名" },
      { data: "Line_name", title: "Line暱稱" },
      { data: "Gender", title: "性別" },
      { data: "Age", title: "年齡" },
      { data: "Reserve_Date", title: "預約日期" },
      { data: "Reserve_Time", title: "預約時間" },
      { data: "Health_card_image.$binary.base64",
        title:"健保卡",
        render :function(data,type,row){
          //產生uuid給後面Modal的ID來使用(bootstrap Modal的id必須是唯一值)
          function _uuid() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
          }
          var uuid = _uuid()
          //設定一個按鈕，點擊後跳出含有健保卡圖片的Modal視窗
          return (
            `<button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop${uuid}">健保卡</button>
            <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${uuid}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel${uuid}" aria-hidden="true">
                  <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                      <h3 class="modal-title" id="staticBackdropLabel${uuid}">健保卡</h3>
                      </div>
                      <div class="modal-body">
                          <img src="data:image/png;base64,${data}" width="50%"   alt="">
                      </div>
                      <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">關閉</button>
                      <!-- <button type="button" class="btn btn-primary">Understood</button> -->
                      </div>
                  </div>
                  </div>
              </div>
    `          
          )
        }
    
    },
      {
        data: "Video_link",
        title: "視訊連結", 
        render: function (data, type, row) {
          return (
            "<a href=" +
            data +
            ' target="_blank" class="btn btn-primary" role="button" aria-pressed="true">視訊診間</a> '  //含有視訊診間連結的按鈕(每個房間網址都有加uuid，不會互相干擾)
          );
        },
      },
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh_Hant.json", //設定語系
    },
    columnDefs: [
      {
        targets: 1,
        className: "dt-body-center dt-head-center", //欄位文字置中
      },
      {
        targets: 2,
        className: "dt-body-center dt-head-center",
      },
      {
        targets: 3,
        className: "dt-body-center dt-head-center",
      },
      {
        targets: 4,
        className: "dt-body-center dt-head-center",
      },
      {
        targets: 5,
        className: "dt-body-center dt-head-center",
      },
      {
        targets: 6,
        className: "dt-body-center dt-head-center",
      },
      {
        targets: 7,
        className: "dt-body-center dt-head-center",
      },
    ],
  });

setInterval( function () {
  table.ajax.reload();
}, 60000 ); //定時刷新ajax內容 避免診所不按重新整理漏掉病人
});

