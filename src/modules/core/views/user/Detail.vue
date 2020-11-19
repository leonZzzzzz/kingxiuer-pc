<template>
  <QcNavigationPage content="用户列表" :full="true">
    <h2 style="margin-bottom:15px;">详情资料</h2>
    <el-tabs type="card" @tab-click="changeTabs">
      <el-tab-pane label="经期列表">
        <QcTable
          ref="table"
          :option="{
            url: `/pc/users/getMenstrualList.do?userId=${id}`,
            offsetTop: 110
          }"
          :menu="[{type: 'export', url: `${baseUrl}/pc/users/exportMenstrual.do?userId=${id}`}]"
          :column="[
            {prop: 'startDate', label: '月经开始'},
            {prop: 'endDate', label: '月经结束'},
          ]"
        ></QcTable>
      </el-tab-pane>
      <!-- <el-tab-pane label="体温列表">
        <QcTable
          ref="table"
          :option="{url: '/pc/users/getTemperatureList.do', offsetTop: 110}"
          :menu="[{type: 'export', url: `${baseUrl}/pc/exportTemperature.do`}]"
          :column="[
            {prop: 'date', label: '记录日期'},
            {prop: 'one', label: '第一次'},
            {prop: 'two', label: '第二次'},
            {prop: 'three', label: '第三次'},
            {prop: 'four', label: '第四次'},
            {prop: 'five', label: '第五次'},
            {prop: 'six', label: '第六次'},
          ]"
        ></QcTable>
      </el-tab-pane>-->
      <el-tab-pane label="排卵列表">
        <QcTable
          :search-form="paiNuan.searchForm"
          ref="table"
          :option="paiNuan.option"
          :menu="[{type: 'export', url: `${baseUrl}/pc/users/exportOvulate.do?userId=${id}`}]"
          :column="paiNuan.column"
        ></QcTable>
      </el-tab-pane>
      <el-tab-pane label="验孕列表">
        <QcTable
          ref="table"
          :option="yanYun.option"
          :menu="[{type: 'export', url: `${baseUrl}/pc/users/exportPregnancy.do?userId=${id}`}]"
          :column="yanYun.column"
        ></QcTable>
      </el-tab-pane>
    </el-tabs>
  </QcNavigationPage>
</template>

<script>
// import qs from 'qs';

export default {
  data() {
    return {
      id: '',
      userInfo: {},
      tableData: [],
      paiNuan: {
        searchForm: [
          {
            type: 'select',
            formName: 'type',
            label: '类型',
            option: [
              { value: '', label: '请选择' },
              { value: '1', label: '普通' },
              { value: '2', label: '半定量' }
            ],
            value: ''
          },
        ],
        option: {
          url: '/pc/users/getOvulateList.do?userId='+this.$route.params.id,
          offsetTop: 110
        },
        column: [
          {prop: 'measureTime', label: '时间', width: 180,
            formatter: row => {
              var list = row.measureTime.split(' ')
              var a= list[1].split(":")
              var time = list[0]+' '+a[0]+':'+a[1]
              return time
            } 
          },
          {label: '图片', width: 380, prop: 'imageUrl',
            formatter: row => {
              var itype=row.imageUrl.substring(0,4);
              return (
                itype=='http'?
                <el-image 
                  src={ row.imageUrl} 
                  previewSrcList={[row.imageUrl]} 
                  style='width: 90%;height: 40px;'
                  ></el-image>:
                  <el-image 
                  src={this.imgHost + row.imageUrl} 
                  previewSrcList={[this.imgHost + row.imageUrl]} 
                  style='width: 90%;height: 40px;'
                  ></el-image>
              )
            }
          },
          {label: '值', prop: 'lhValue',
            formatter: row => {
              return (
                <div>
                  {row.type == 2 
                  ? <div>{row.lhValue}LH</div> 
                  : <div>
                      <span>{
                        {
                          0: '无效',
                          1: '阴性',
                          2: '弱阳',
                          3: '阳性',
                          4: '强阳',
                        }[row.lhValue]
                      }</span>
                    </div>
                  }
                </div>
              )
            }
          },
          {label: '类型', 
            formatter: row => {
              return row.type == 1 ? "普通" : "半定量"
            }
          }
        ]
      },
      yanYun: {
        option: {
          url: '/pc/users/getPregnancyList.do?userId='+this.$route.params.id,
          offsetTop: 110
        },
        column: [
          {label: '图片', width: 380,align: 'center',
            formatter: row => {
              // return (<img src={this.imgHost + row.imageUrl} width="90%" height="40" />)
              return (
                <el-image 
                  src={this.imgHost + row.imageUrl} 
                  previewSrcList={[this.imgHost + row.imageUrl]} 
                  style='width: 90%;height: 40px;'
                  ></el-image>
              )
            }
          },
          {label: '值',
          align: 'center',
            formatter: row => {
              return (
                <div>
                  <span>{
                    {
                      0: '无效',
                      1: '阴性',
                      2: '弱阳',
                      3: '阳性',
                      4: '强阳',
                    }[row.pregnant]
                  }</span>
                </div>
              )
            }
          },
          { label: '测量时间', prop: 'measureTime', width: '150px',align: 'center'},
        ]
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
    // this.apiGetMenstrual(this.id);
  },
  methods: {
    //  经期列表
    apiGetMenstrual(userId) {
      this.$http.get('/pc/users/getMenstrualList.do', { userId })
        .then((res) => {
          this.tableData = res.data.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //  体温列表
    apiGetTemperature(userId) {
      this.$http.get('/pc/users/getTemperatureList.do', { userId })
        .then((res) => {
          const mydata = [];
          for (const i in res.data.data.list) {
            if (6 - res.data.data.list[i].length !== 0) {
              for (let j = 6 - res.data.data.list[i].length; j > 0; j -= 1) {
                // eslint-disable-next-line
                res.data.data.list[i].push({degree: ''});
              }
            }
            mydata.push({
              date: i.split(' ')[0],
              one: res.data.data.list[i][0].degree,
              two: res.data.data.list[i][1].degree,
              three: res.data.data.list[i][2].degree,
              four: res.data.data.list[i][3].degree,
              five: res.data.data.list[i][4].degree,
              six: res.data.data.list[i][5].degree
            });
          }
          this.tableData = mydata;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //  排卵列表
    apiGetOvulate(userId) {
      this.$http.get('/pc/users/getOvulateList.do', { userId })
        .then((res) => {
          this.tableData = res.data.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //  验孕列表
    apiGetPregnancy(userId) {
      this.$http.get('/pc/users/getPregnancyList.do', { userId })
        .then((res) => {
          this.tableData = res.data.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 导出数据
    exportData(url) {
      window.open(`https://m.wondfohealth.cn/kingsuer/pc/users/${url}?userId=${this.id}`);
    },
    exportAllData(url) {
      // qs.stringify(Object.assign(this.search))
      window.open(`http://192.168.1.22:8080/kingsuer/pc/users/${url}`);
    },
    changeTabs(e) {
      // switch (Number(e.index)) {
      //   case 0:
      //     this.apiGetMenstrual(this.id);
      //     break;
      //   case 1:
      //     this.apiGetTemperature(this.id);
      //     break;
      //   case 2:
      //     this.apiGetOvulate(this.id);
      //     break;
      //   case 3:
      //     this.apiGetPregnancy(this.id);
      //     break;
      //   default:
      //     console.log(e);
      //     break;
      // }
    },
    // formatter(row) {
    //   return row.type === 1 ? '普通' : '半定量';
    // },
    filterHandler(value, row) {
      return row.type === value;
    }
  }
};

</script>

<style lang="scss" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>
