<template>
  <div style="background:#fff;padding:20px;" ref="wrap">
    <div class="block;" style="margin-bottom:20px">
      <span class="demonstration">起止时间：</span>
      <el-date-picker
        v-model="value6"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateSearch"
      ></el-date-picker>
      <div class="search" @click="search()">查询</div>
      <div class="search1" @click="reset()">重置</div>
      <div class="search" @click="exportlist()">导出</div>
    </div>

    <!-- <div style="font-size: 14px;color: #606266">
      起止时间：
      <el-date-picker
        v-model="startDate"
        type="date"
        @change="startSearch"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <span>-</span>
      <el-date-picker v-model="endDate" type="date" @change="endSearch" value-format="yyyy-MM-dd"></el-date-picker>
      <div class="search" @click="search()">查询</div>
    </div>-->
    <el-table :data="tableData" style="width: 100%;height:500px" highlight-current-row>
      <el-table-column label="来源">
        <template slot-scope="scope">
          <span v-if="scope.row.type==2">微信H5</span>
          <span v-if="scope.row.type==4">微信小程序</span>
          <span v-if="scope.row.type==5">大姨妈APP</span>
          <span v-if="scope.row.type==0">统计汇总</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountNum" label="新增用户数"></el-table-column>
      <el-table-column prop="temperatureAccountNum" label="体温上传用户数"></el-table-column>
      <el-table-column prop="temperatureNum" label="体温上传数"></el-table-column>
      <el-table-column prop="normalAccountNum" label="普通试纸上传用户数"></el-table-column>
      <el-table-column prop="normalNum" label="普通试纸上传数"></el-table-column>
      <el-table-column prop="halfAccountNum" label="半定量试纸上传用户数"></el-table-column>
      <el-table-column prop="halfNum" label="半定量试纸上传数"></el-table-column>
      <el-table-column prop="pregnancyAccountNum" label="验孕试纸上传用户数"></el-table-column>
      <el-table-column prop="pregnancyNum" label="验孕试纸上传数"></el-table-column>
      <el-table-column prop="desireAccountNum" label="许愿用户数"></el-table-column>
      <el-table-column prop="desireNum" label="许愿数"></el-table-column>
      <el-table-column prop="votiveAccountNum" label="还愿用户数"></el-table-column>
      <el-table-column prop="votiveNum" label="还愿数"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config';
import Utils from '@/utils/utils';
export default {
  data() {
    return {
      tableData:[],
      startDate:'',
      endDate:'',
      value6:''
    };
  },
  created() {
    this.getlist(this.startDate,this.endDate)
  },
  methods: {
    exportlist(){
      var url=`${BASEURL}/pc/reportDayNewNum/export.do`
      window.open(url + '?startDate=' +  this.startDate+'&endDate='+this.endDate)
    },
    getlist(startDate,endDate){
      this.$http.getStatistics({startDate:startDate,endDate:endDate}).then(res=>{
        this.tableData = res.data.data
      })
    },
    reset(){
      this.startDate='',
      this.endDate=''
      this.value6=''
      this.$http.getStatistics({startDate:'',endDate:''}).then(res=>{
        this.tableData = res.data.data
      })
    },
    dateSearch(e){
      var d = new Date(e[0]); 
      var month = d.getMonth() + 1
      var day = d.getDate()
      month = month<10?'0'+month:month
      day = day<10?'0'+day:day
      var start=d.getFullYear() + '-' + month + '-' + day;
      var f = new Date(e[1]); 
      var month1 = f.getMonth() + 1
      var day1 = f.getDate()
      month1 = month1<10?'0'+month1:month1
      day1 = day1<10?'0'+day1:day1
      var end=f.getFullYear() + '-' + month1 + '-' + day1;
      this.startDate = start
      this.endDate=end
      console.log(start,end)
    },
    startSearch(e){
      this.startDate=e
    },
    endSearch(e){
      this.endDate=e
    },
    search(){
      this.getlist(this.startDate,this.endDate)
    }
  }
};

</script>

<style lang="scss" scoped>
.page-wrap {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}
.search {
  color: #ffffff;
  background-color: #294a7b;
  border-color: #294a7b;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  display: inline-block;
  margin-left: 30px;
}
.search1 {
  color: #294a7b;
  // background-color: #294a7b;
  border-color: #294a7b;
  border: 1px solid #294a7b;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  display: inline-block;
  margin-left: 30px;
}
.el-table__row {
  height: 60px;
}
.el-table--enable-row-transition .el-table__body td {
  padding: 20px;
}
</style>
