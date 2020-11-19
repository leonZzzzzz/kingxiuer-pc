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
          label: "发布",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.deleteConfirm(1, currentRow.id);
          }
        },
        {
          label: "取消发布",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.deleteConfirm(1, currentRow.id);
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
        {
          label: "提取首页链接",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.getVisible(currentRow.id);
          }
        },
        {
          label: "提取测评链接",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.getVisible(currentRow.id);
          }
        }
      ],
      searchForm: [
        { formName: "title", type: "input", value: "", label: "测评名称" },
        {
          type: 'select',
          formName: 'type',
          label: '分类',
          option: [
            { value: '', label: '全部' },
            { value: 'score', label: '分值型' },
            { value: 'combination', label: '组合型' }
          ],
          value: ''
        },
        {
          type: 'select',
          formName: 'publishStatus',
          label: '状态',
          option: [
            { value: '', label: '全部' },
            { value: 'draft', label: '未发布' },
            { value: 'published', label: '已发布' },
            { value: 'publish_canceled', label: '发布已取消' }
          ],
          value: ''
        },
      ],
      option: {
        url: "api/admin/v1/test-paper/page"
      },
      column: [
        { type: "index", label: "序号", align: "center" },
        {
          prop: 'cover',
          label: '封面',
          align: 'center',
          formatter: row => {
            return (
              row.cover?
              <el-image src={this.imageurl + row.cover} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>:<div style="width:120px;text-align:center">-</div>
            )
          }
        },
        { prop: "title", label: "标题", align: "center" },
        { prop: "type", label: "分类", align: "center" },
        { prop: "publishStatus", label: "状态", align: "center" },
        { prop: "quantity", label: "参与人数", align: "center" },
        { prop: "createTime", label: "创建时间", align: "center" }
      ],
      shareLink: ""
    };
  },
  methods: {
    insert() {
      this.$router.push("./form");
    },
    update(count, row) {
      console.log(count,row)
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
      this.$http.DeleteSubjectList({ id }).then(res => {
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
