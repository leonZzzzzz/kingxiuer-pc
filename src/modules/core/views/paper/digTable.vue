<template>
   <el-dialog class="store-dialog" title="选择发送对象" v-loading="loading" :visible.sync="visible" width="700px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
      <search-wrap v-if="receiverType !== 5">
         <el-form :inline="true">
            <el-form-item v-if="receiverType == 2 || receiverType == 4" label="名称">
               <el-input size="mini" v-model.trim="search.name"></el-input>
            </el-form-item>
            <el-form-item v-if="receiverType == 3 || receiverType == 4" label="课程">
               <el-input size="mini" v-model.trim="search.title"></el-input>
            </el-form-item>
            <el-form-item v-if="receiverType == 2" label="是否是学员">
               <el-select size="mini" v-model="search.hasNumber">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="学员" :value="1"></el-option>
                  <el-option label="非学员" :value="0"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item v-if="receiverType == 3" label="发布状态">
               <el-select size="mini" v-model="search.isRelease">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="发布" :value="true"></el-option>
                  <el-option label="下架" :value="false"></el-option>
               </el-select>
            </el-form-item>
            <template v-if="receiverType == 6">
              <el-form-item label="测评名称">
                <el-input size="small" v-model.trim="search.title"></el-input>
              </el-form-item>
              <el-form-item label="分类">
                <el-select size="small" v-model="search.categoryId">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="分值型" value="score"></el-option>
                  <el-option label="组合型" value="combination"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select size="small" v-model="search.publishStatus">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未发布" value="draft"></el-option>
                  <el-option label="已发布" value="published"></el-option>
                  <el-option label="发布已取消" value="publish_canceled"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
               <el-button type="primary" size="mini" @click="onSearch()">搜索</el-button>
            </el-form-item>
         </el-form>
      </search-wrap>
      <!-- <qc-table ref="table" :table-list="model.show" :search="model.search" :autoHeight="500" url="api/admin/v1/print_store/page"></qc-table> -->
      <div class="table" style="height: 300px;margin: 0;">
         <el-table :data="tableData" height="100%" ref="tabel" style="width: 100%;overflow-y: auto;" highlight-current-row @selection-change="selectionChange" @current-change="handleRow" element-loading-text="数据加载中">
            <el-table-column type="selection" width="50" v-if="receiverType !== 6"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column v-for="(item, index) in tableItem" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" show-overflow-tooltip align="left"></el-table-column>
         </el-table>
      </div>
      <div style="text-align:center;padding:10px 0;border-bottom: 1px solid #ebeef5;">
         <el-pagination layout="prev, pager, next, sizes" :page-sizes="[10, 20, 30]" :page-size="search.pageSize" :current-page="search.pageNum" :total="search.total" @size-change="onChangeSize" @current-change="onChangePage"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button size="small" @click="close(false)">取 消</el-button>
         <el-button size="small" @click="submit" :disabled="!tableId.length">确 定</el-button>
      </span>
   </el-dialog>
</template>

<script>
import api from "api/common.js";
import { TABLE } from "@/mixins";
import SearchWrap from "common/SearchWrap";

export default {
  mixins: [TABLE],
  components: { SearchWrap },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    },
    receiverType: Number,
    tableApi: String,
    tableItem: Array,
    selectionData: Array,
    rowData: Object,
  },
  data() {
    return {
      tableId: [],
      search: {
        title: "",
        name: "",
        hasNumber: "",
        categoryId: "",
        publishStatus: "",
        isRelease: '',
      },
      tableItemData: [],
      loading: false,
      row: {},
    };
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.tableApi);
        
        if (this.receiverType == 2) {
          //  会员
          this.search.hasNumber = 1;
        }

        if (this.tableApi) {
          this.onSearch();
        }
      } else {
        this.search = {
          title: "",
          name: "",
          hasNumber: "",
          categoryId: "",
          publishStatus: "",
          isRelease: '',
        }
        this.row = {}
      }
    },
    tableData(data) {
      if (data && data.length) {
        if (this.receiverType === 6) {
          if (this.rowData.id) {
            // this.$refs.tabel.setCurrentRow(this.rowData)
            // console.log('setCurrentRow')
            for (let i = 0, len = data.length; i < len; i++) {
              let item = data[i]
              if (this.rowData.id == item.id) {
                this.$refs.tabel.setCurrentRow(item)
                console.log('setCurrentRow')
                break;
              }
            }
          }
        } else {
          if (data && data.length && this.selectionData.length) {
            let existArr = [];
            this.selectionData.forEach(item => {
              for (let i = 0, len = data.length; i < len; i++) {
                let item2 = data[i];
                if (item2.id == item.id) {
                  existArr.push(item2);
                  break;
                }
              }
            });
            this.toggleSelection(existArr);
          }
        }
      }
    }
  },
  methods: {
    selectionChange(rows) {
      this.tableId = rows;
      // console.log(rows)
    },
    toggleSelection(rows) {
      this.$nextTick(_ => {
        if (rows) {
          rows.forEach(row => {
            this.$refs.tabel.toggleRowSelection(row, true);
          });
        } else {
          //  this.$refs.tabel.clearSelection();
        }
      });
    },
    handleRow(row) {
      console.log('handleRow', row)
      if (row) this.row = row
    },
    submit() {
      this.$emit("submit", this.receiverType === 6 ? this.row : this.tableId);
      this.close(false);
    },
    close(flag) {
      this.$emit("close", flag);
    }
  }
};
</script>

<style lang="less" scoped>
.store-dialog {
  /deep/.el-dialog__body {
    padding: 20px;
    padding-bottom: 10px;
  }
}
</style>

