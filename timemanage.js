var app = new Vue({
    el:"#app",
    data:{
        days:['一','二','三','四','五','六','日'], //開診時間表 table的欄位名稱(table-th)
        fullname_days:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"], //綁定開診時間表內每個格子的class標籤(用v-for創造table-td)
        time:['早上','下午','晚上'], //綁定開診時間表內每個格子的class標籤
        open_time:{'星期一':[],'星期二':[],'星期三':[],'星期四':[],'星期五':[],'星期六':[],'星期日':[]}, //點選開診時間表的格子後會push"早上"、"下午"、"晚上"的值到屬於那天的陣列中
        morning:["",""], //預先設定空值，Linebot的flexmessage(clinic_opentime)接值的時候才不會噴500的錯
        afternoon:["",""],
        night:["",""],
        tab:1, //預設頁面標籤為1(預約列表:1,開診時間表:2)
        
    }, 
    methods:{
        click_time(day,time){ //把點選的時間加入陣列
            
            if (this.open_time[day].indexOf(time)>=0){
                this.open_time[day].splice(this.open_time[day].indexOf(time),1);
            }
            else{
                this.open_time[day].push(time)
            }
        },
        click_save(){ //把開診時間表點選的日期格子以及輸入的開診時間資料包成Json傳到後端
        axios
          .post("https://brandon12345.ddns.net/set_opentime",{date:this.open_time,time:[this.morning,this.afternoon,this.night]}) //<--這個Json傳到後端
          .then(response => (this.info = response))
          .catch(function (error) { //請求失敗的處理
            console.log(error);
          });
        },
        click_clean(){ //點全部清除按鈕就把open_time的資料重置
            this.open_time={'星期一':[],'星期二':[],'星期三':[],'星期四':[],'星期五':[],'星期六':[],'星期日':[]}
        },
        switch_tab(e){ //切換後台的分頁(診單列表查詢、開診時間管理等等分頁的切換)
            var tabid = e.target.dataset.id  //e.target.dataset 獲取view(dom)中定義的值   定義方法: data-*=某個值
			this.tab=tabid
        }
    },  
})

$('.time-picker-cell').click(function () {
    $(this).toggleClass('mod-selected'); //點下去就把那格變成藍色(等同於已點選狀態)
  });

$('.clean').click(function(){   //點全部清除按鈕就把全部的格子的css重置成白色 (等同於未點選狀態)
    $('.time-picker-cell').removeClass("mod-selected")  
})


