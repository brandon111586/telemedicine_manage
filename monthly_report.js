let now = new Date();
let currentYear = now.getFullYear();
let currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);

$('#year_select').val(currentYear);
$('#month_select').val(currentMonth);

function get_selected_data() {
    axios.get('http://127.0.0.1:5000/report_export') //取得mongodb內所有診單資料
        .then(function (response) {
            var year = $("#year_select").val() //選擇年份
            var month = $('#month_select').val() //選擇月份

            var data = response.data;
            // console.log(data);
            var result_data = []
            data.forEach(function (value) {
                if (value['預約日期'].substr(0, 7) === (`${year}-${month}`)) {
                    result_data.push(value);
                }
            })
            //畫出每月診單的datatable(靜態)
            $(function () {
                $('#table').bootstrapTable('load', result_data);
                $("td,th").addClass('text-center');
            })

            //畫圖 資料視覺化部分 <性別>
            $('#gender_chart').remove(); //要先把canvas移除掉再重新新增渲染，否則會報錯
            $('#gender_chart_div').append('<canvas id="gender_chart"></canvas>')
            const gender_chart = document.getElementById('gender_chart').getContext('2d');
            
            //計算當月資料裡男女人數各有多少 (for迴圈算出男生人數，女生人數=全部人數-男生人數)
            var total_data = result_data.length;
            var male_number = 0;
            for (let i = 0; i < total_data; i++) {
                if (result_data[i]['性別'] === '男') {
                    male_number += 1;
                }
            }
            var female_number = total_data - male_number;

            const myChart1 = new Chart(gender_chart, {
                type: 'doughnut',
                data: {
                    labels: [
                        '男',
                        '女',
                    ],
                    datasets: [{
                        label: '性別比例',
                        data: [male_number, female_number],
                        backgroundColor: [
                            'rgba(54, 162, 235)',
                            'rgba(255, 99, 132)'
                            ,
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        ticks: {
                            display: false //this will remove only the label
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '性別比例',
                            font: { size: 16 }
                        },
                        legend: {
                            labels: {
                                // 設定字型
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            }
                        },

                    }
                }
            });
            //畫圖部分 <年齡>
            $('#age_chart').remove();  //要先把canvas移除掉再重新新增渲染，否則會報錯
            $('#age_chart_div').append('<canvas id="age_chart"></canvas>')
            var age_data1 = 0; //0~18
            var age_data2 = 0; //18~44
            var age_data3 = 0; //45~64
            var age_data4 = 0; //64以上

            //計算當月資料中各年齡層人數
            result_data.forEach(function (value) {
                if (value['年齡'] <= 18) { age_data1 += 1; }
                else if (value['年齡'] <= 44) { age_data2 += 1; }
                else if (value['年齡'] <= 64) { age_data3 += 1; }
                else { age_data4 += 1; }
            })
            const age_chart = document.getElementById('age_chart').getContext('2d');
            const myChart2 = new Chart(age_chart, {
                type: 'bar',
                data: {
                    labels: [
                        '0~18歲',
                        '18~44歲',
                        '45~64歲',
                        '64歲以上'
                    ],
                    datasets: [{
                        label: '',
                        data: [age_data1, age_data2, age_data3, age_data4],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                            'rgba(255, 99, 132, 0.5)',

                        ],
                        borderColor: [
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 99, 132)'

                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                stepSize: 1, //X軸每格距離設為1
                                font: {size:16}
                            }
                        },
                        y: {
                            ticks: {
                                font: {size:16}
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '年齡分布',
                            font: { size: 16 }
                        },
                        legend: {
                            display: false
                        },
                    }
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        })
}
get_selected_data()//進入分頁就直接跑一次該月資料+圖表

function export_report() {  //輸出報表按鈕功能
    axios.get('http://127.0.0.1:5000/report_export') //取得mongodb內所有診單資料
        .then(function (response) {
            var selectedVal = $("#month_select").val(); //選擇月份
            data = response.data;
            result_data = []

            data.forEach(function (value) {
                if (value['預約日期'].substr(5, 2) === selectedVal) {
                    result_data.push(value);
                }
            })
            if (result_data.length != 0) {
                const worksheet = XLSX.utils.json_to_sheet(result_data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, selectedVal + "月診單資訊");
                XLSX.utils.sheet_add_aoa(worksheet, [], { origin: "A1" });
                XLSX.writeFile(workbook, selectedVal + "月診單報表.xlsx");
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    }