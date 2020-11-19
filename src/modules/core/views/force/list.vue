<template>
  <div class="wrap">
    <QcTable ref="table" :menu="menu" :search-form="searchForm" :option="option" :column="column"></QcTable>
    <!-- 复制链接弹窗 -->
    <el-dialog
      title="问卷链接"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="880px"
    >
      <div style="display: flex;">
        <el-input size="small" v-model="shareLink"></el-input>
        <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
        <el-popover placement="right" width="160" trigger="click">
          <!-- <qrcode :value="shareLink" v-if="shareLink" tag="img" :options="{ size: 160 }"></qrcode> -->
          <el-button slot="reference" type="primary" size="small" ref="test">二维码</el-button>
        </el-popover>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Qrcode from "@xkeshi/vue-qrcode";
export default {
  // components: { Qrcode },
  data() {
    return {
      imageurl:'http://kingsuer-1255600302.file.myqcloud.com',
      digFromWrap: false,
      simpleVisible: false,
      actVisible: false,
      dialogTable: false,
      updateId: "",
      updateTitle: "",
      categoryList: [],
      menu: [
        { label: "添加", type: "primary", on: this.insert },
        {
          label: "修改",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.update(1, currentRow);
          }
        },
        {
          label: "删除",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.deleteConfirm(1, currentRow.id);
          }
        },
        {
          label: "查看结果",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.jumpPage(
              `./result?id=${currentRow.id}&active=2`
            );
          }
        },
        // {
        //   label: "提取问卷链接",
        //   type: "primary",
        //   disabled: ({ currentRow }) => currentRow.id == null,
        //   on: currentRow => {
        //     this.getVisible(currentRow.id);
        //   }
        // }
      ],
      searchForm: [
        { formName: "title", type: "input", value: "", label: "标题" }
      ],
      option: {
        url: "api/admin/v1/survey/page"
      },
      column: [
        { type: "index", label: "序号", align: "center" },
        { prop: "title", label: "标题", align: "center" },
        // {
        //   prop: 'picture',
        //   label: '封面',
        //   align: 'center',
        //   formatter: row => {
        //     return (
        //       row.picture?
        //       <el-image src={this.imageurl + row.picture} style="width:50px;height:50px">
        //         <div slot="error" class="el-image__error">
        //           <i class="el-icon-picture-outline"></i>
        //         </div>
        //       </el-image>:<div style="width:120px;text-align:center">-</div>
        //     )
        //   }
        // },
        { prop: "createTime", label: "创建时间", align: "center" },
        // { prop: "endTime", label: "结束时间", align: "center" }
      ],
      shareLink: ""
    };
  },
  methods: {
    insert() {
      this.$router.push("./form");
    },
    update(count, row) {
      this.updateId = row.id;
      if (count === 1) {
        this.$router.push(`./form?id=${row.id}`);
      } else {
        this.$router.push(
          `./form?id=${row.id}&copy=true`
        );
      }
    },
    getVisible(id) {
      this.$http.getMobileUrl().then(res => {
        this.shareLink = `${res.data.data.url}/survey/POUND/pages/survey/detail/index?wo=1&wot=2&woacm=1&mpl=1&id=${id}`;
        this.simpleVisible = true;
      });
    },
    closeSimple() {
      this.simpleVisible = false;
    },
    closeLink() {
      this.actVisible = false;
    },
    copy(shareLink) {
      let oInput = document.createElement("input");
      oInput.value = shareLink;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.style.display = "none";
      document.body.removeChild(oInput);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    jumpPage(url) {
      this.$router.push(url);
    },
    deleteConfirm(count, id) {
      let text =
        count === 1
          ? "是否删除该数据?"
          : count == 2
          ? "是否发布?"
          : "是否下架?";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (count === 1) this.delete(id);
          else this.release(count);
        })
        .catch(() => {});
    },
    delete(id) {
      this.$http.deleteSurvey({ id }).then(res => {
        console.log(res);
        this.$refs.table.onSearchKeep();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    release(count) {
      let model = {
        id: this.tableList.id,
        isRelease: count == 2 ? true : false
      };
      this.$http
        .releaseLesson(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.searchKeep();
          // setTimeout(() => {
          //   this.$router.go(-1);
          // }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    openDialogTable() {
      this.dialogTable = true;
      this.updateId = this.tableList.id;
      this.updateTitle = this.tableList.title;
    },
    closeDialogTable() {
      this.dialogTable = false;
    }
  }
};
</script>
