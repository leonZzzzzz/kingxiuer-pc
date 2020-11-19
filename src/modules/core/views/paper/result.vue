<template>
  <QcNavigationPage full content="测评结果" class="wrap">
    <div class="wrap" ref="wrap">
      <div ref="search">
        <search-wrap>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input size="small" v-model.trim="searchData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input size="small" v-model.trim="searchData.mobile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="answePage()">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" size="small" class="back" @click="$router.back()">返回</el-button> -->
        </search-wrap>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        :height="tHeight"
        :data="tableData"
        highlight-current-row
      >
        <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
        <!-- <el-table-column align="center" show-overflow-tooltip prop="appellation" label="会员昵称"></el-table-column> -->
        <el-table-column align="center" show-overflow-tooltip prop="mobilePhoneNumber" label="手机"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="analysis" label="主结果"></el-table-column>
        <!-- <el-table-column align="center" show-overflow-tooltip prop="viceResult" label="副结果"></el-table-column> -->
        <el-table-column align="center" show-overflow-tooltip prop="createTime" label="交卷时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span @click="detail(scope.row)" style="color: blue; cursor: pointer;">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="result__page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="searchData.total"
        ></el-pagination>
      </div>
    </div>
  </QcNavigationPage>
</template>

<script>
// import SearchWrap from "common/SearchWrap";
// import api from "api/common";

export default {
  // components: { SearchWrap },
  data() {
    return {
      searchData: {
        testPaperId: this.$route.query.id,
        name: '',
        mobile: '',
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      showData: [
        { template: "index" },
        { prop: "headImage", label: "头像", template: "img", headImage: true },
        // { prop: "appellation", label: "昵称" },
        { prop: "mobilePhoneNumber", label: "手机" },
        { prop: "name", label: "姓名" },
        { prop: "analysis", label: "主结果" },
        { prop: "viceResult", label: "副结果" },
        { prop: "createTime", label: "交卷时间" },
        { prop: 'id', label: '详情'}
      ],
      tableData: [],
      loading: false,
      tHeight: 0,
    }
  },
  created() {
    this.answePage()
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeightTable();
      window.onresize = () => {
        this.getHeightTable();
      };
    });
  },
  methods: {
    getHeightTable() {
      let search = document.querySelector(".search-wrap");
      // let button = document.querySelector(".button-wrap");
      this.tHeight = window.innerHeight - 120 - 50
      if (search) this.tHeight = this.tHeight - search.offsetHeight;
    },
    answePage() {
      this.loading = true
      this.$http.answePage(this.searchData).then(res => {
        this.tableData = res.data.data.list
        this.searchData.total = res.data.data.total
        this.loading = false
      }).catch(err=>{
        this.loading = false
      })
      
    },
    detail(row) {
      this.$router.push(`./detail?id=${row.id}`)
    },
    preview() {

    },
    handleSizeChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.searchData.pageSize = val;
      this.searchData.pageNum = 1;
      this.answePage()
    },
    handleCurrentChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.searchData.pageNum = val;
      this.answePage()
    },
  }
}
</script>

<style lang="scss" scoped>
.result__page {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.back {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
