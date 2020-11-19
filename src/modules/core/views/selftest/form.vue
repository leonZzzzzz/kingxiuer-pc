<template>
  <QcNavigationPage content="问卷信息" class="wrap" full>
    <ul class="activity-form__tabs">
      <li
        v-for="(item, index) in tabbar"
        :key="index"
        @click="changeActiveIndex(index)"
        class="activity-form__tab"
        :class="{ 'activity-form__tab--active': activeIndex == index }"
      >{{ item }}</li>
    </ul>
    <div v-show="activeIndex === 0">
      <!-- 基础设置 -->
      <el-form :model="model" ref="model" label-width="120px" label-position="left" size="small">
        <el-form-item label="测评名称" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            style="width: 500px"
            size="small"
            v-model="model.title"
            maxlength="32"
            placeholder="请输入内容（不超过32字）"
          ></el-input>
        </el-form-item>
        <el-form-item label="测评类型" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-select
            v-model="model.type"
            placeholder="请选择"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-option
              v-for="item in evallist"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分类"
          prop="categoryId"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-select
            v-model="model.categoryId"
            placeholder="请选择"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-option
              v-for="item in proglist"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图" prop="cover" :rules="[{ required: true, message: '该字段不能为空' }]">
          <QcImageUpload v-model="model.cover" width="140px" height="140px"></QcImageUpload>
          <!-- <p>建议比例1080:640，像素小于2M</p> -->
        </el-form-item>
        <el-form-item label="问卷海报背景" prop="picture">
          <QcImageUpload v-model="model.picture" width="140px" height="140px"></QcImageUpload>
          <!-- <p>建议比例1080:640，像素小于2M</p> -->
        </el-form-item>

        <el-form-item
          label="分享简介"
          prop="description"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input
            v-model="model.description"
            style="width:400px;"
            maxlength="64"
            placeholder="请输入内容（不超过64字）"
            type="textarea"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
          <Editor v-model="model.content"></Editor>
          <!-- <editor :content="model.endContent" @get-content="getContent" ref="editor"></editor> -->
        </el-form-item>
        <el-form-item
          label="测评按钮文字"
          prop="buttonText"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input
            maxlength="100"
            type="textarea"
            v-model="model.buttonText"
            style="width: 500px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="测评按钮颜色"
          prop="buttonColor"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-color-picker v-model="model.buttonColor"></el-color-picker>
        </el-form-item>
        <el-form-item
          label="答题页面背景色"
          prop="themeColor"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-color-picker v-model="model.themeColor"></el-color-picker>
        </el-form-item>
      </el-form>
    </div>
    <FormQuestion ref="formQuestion" :survey-id="surveyId" v-show="activeIndex === 1" />
    <div v-show="activeIndex===2">
      <div style="margin-left:10px;height:40px">
        <span
          style="background:#294A7B;color:#fff;padding:5px 10px;border-radius:5px"
          @click="insertResult()"
        >新增</span>
      </div>
      <el-table :data="settingResult" ref="multipleTable">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="title" label="标题" width="100"></el-table-column>
        <el-table-column prop="condition" label="条件"></el-table-column>
        <el-table-column prop="showRecommendContent" label="推荐商品"></el-table-column>
        <el-table-column prop="priority" label="优先级"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <!-- <el-table-column prop="address" label="操作"></el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span @click="detail(scope.row)" style="color: #294A7B;cursor: pointer;">修改</span>
            <span
              @click="detail(scope.row)"
              style="color: #294A7B;cursor: pointer;margin-left:15px"
            >删除</span>
            <span
              @click="detail(scope.row)"
              style="color: #294A7B;cursor: pointer;margin-left:15px"
            >预览</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination-count">
          <span class="count">共：{{results.total }}&nbsp;条数据</span>
          <!-- <span class="selection" v-if="selectionRow.length > 0">已选中：{{ selectionRow.length }}&nbsp;条</span> -->
        </div>
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-sizes="[15, 30, 50]"
          :page-size="results.pageSize"
          :current-page="results.pageNum"
          :total="results.total"
          layout="prev, pager, next, sizes"
          background
          style="margin-right: -26px;"
        ></el-pagination>
      </div>
      <!-- <QcTable ref="table" :menu="menu2" :option="surveyId?option2:option3" :column="column2"></QcTable> -->
    </div>
    <div slot="footer">
      <el-button
        v-if="activeIndex == 0"
        type="primary"
        @click="onSubmit()"
        style="margin-left: 30px;"
        size="small"
      >保存问卷</el-button>
      <el-button
        v-else
        type="primary"
        @click="onSubmitQuestion()"
        style="margin-left: 30px;"
        size="small"
      >保存题目</el-button>
    </div>
    <el-dialog
      title="选择活动"
      width="800px"
      :visible.sync="dialogTable"
      @close="closeDialogTable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="border: 1px solid #ebeef5;">
        <QcTables
          :option="option"
          :search-form="searchForm"
          :showSearchButtons="false"
          :column="column"
          @row-click="rowClick"
        ></QcTables>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="tableRow.id == null"
          size="mini"
          @click="saveCurrent"
        >确 定</el-button>
      </span>
    </el-dialog>
  </QcNavigationPage>
</template>

<script>
import FormQuestion from "./FormQuestion";
// import editor from "common/editor";
export default {
  components: {
    FormQuestion,
    // editor
  },
  data() {
    return {
      dialogTable: false,
      // 选中头部菜单的下标
      activeIndex: 0,
      tabbar: ["基础设置", "题目设置","结果设置"],
      surveyId: "",
      tableRow: {},
      sourceData: {},
      option: {
        url: "api/admin/v1/activity/page",
        size: "small",
        height: 400
      },
      option2: {
        url: "api/admin/v1/test-paper-result-1/page?testPaperId="+this.$route.query.id,
        size: "small",
        height: 400
      },
      option3: {
        url: "api/admin/v1/category/page?type=5",
        size: "small",
        height: 400
      },
      menu2: [
        { label: "创建", type: "primary", on: this.insert },
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
          label: "刷新",
          type: "primary",
          disabled: ({ currentRow }) => currentRow.id == null,
          on: currentRow => {
            this.jumpPage(
              `./result?id=${currentRow.id}&active=2`
            );
          }
        }
      ],
      searchForm: [
        {
          type: "input",
          formName: "title",
          value: ""
        }
      ],
      column: [
        { label: "序号", type: "index" },
        { prop: "title", label: "活动名称" },
        {
          prop: "iconUrl",
          label: "封面",
          formatter: row => {
            return (
              <img src={this.imgHost + row.iconUrl} width="100px" alt="" />
            );
          }
        },
        { prop: "endTime", label: "结束时间" }
      ],
      column2: [
        { label: "序号", type: "index" },
        { prop: "title", label: "标题" },
        { prop: "title", label: "条件" },
        { prop: "title", label: "推荐商品" },
        { prop: "title", label: "优先级" },
        { prop: "title", label: "创建时间" }
      ],
      searchData: {
        title: "",
        name: ""
      },
      evallist:[
        { value: 'score', name: '分值型' },
        { value: 'combination', name: '组合型' }
      ],
      proglist:[],
      model: {
        title: '',
        categoryId: '',
        showTitle: true,
        type: 'score',
        cover: '',
        description: '',
        content: '',
        buttonText: '立即测评',
        themeColor: '#ffd333',
        buttonColor: '',
        posterBackground:'',
        paperType: 'tool',
      },
      settingResult:[],
      results:{}
    };
  },
  created() {
    if (this.$route.query.id) {
      this.surveyId=this.$route.query.id
      console.log(this.surveyId)
      this.detectionDetail(this.$route.query.id);
      
    }
    this.getType()
  },
  mounted() {
    try {
      //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
    } catch (error) {}
  },
  methods: {
    // 获取测评类型
    getType(){
      this.$http.deteClassify({type:5}).then(res=>{
        this.proglist=res.data.data.list
      })
    },
    changeActiveIndex(index) {
      if (index == 1 && !this.surveyId) {
        this.$message.warning("请先保存问卷");
        return;
      }
      this.activeIndex = index;
      if(index==2){
        this.resultSubject(this.surveyId)
      }
    },

    // 获取基础设置详情
    detectionDetail(id) {
      this.$http.detectionDetail({ id: id }).then(res => {
        this.model = res.data.data;
        this.surveyId = this.model.id;
        console.log(this.surveyId)
        if (this.model.sourceId) {
          this.sourceData = this.model.activity;
        }
      });
    },
    // 获取结果设置列表
    resultSubject(id){
      this.$http.resultSubject({testPaperId:id}).then(res=>{
        this.results = res.data.data
        this.settingResult=res.data.data.list
      })
    },
    onSave(type) {
      this.$http[type](this.model).then(res => {
        if (type === "updateDetection") {
          this.surveyId = this.$route.query.id;
        } else {
          this.surveyId = res.data.data;
        }
        // this.surveyId=this.model.id
        this.activeIndex = 1;
      });
    },
    // 提交问卷
    onSubmit() {
      // this.$refs.editor.getContent();
      this.$refs.model.validate(flag => {
        if (flag) {
          this.model.id
            ? this.onSave("updateDetection")
            : this.onSave("insertDetection");
        }
      });
    },
    // 翻页
    onSizeChange(val) {
      console.log(val)
      this.search.pageSize = val
      this.onSearch()
    },
    onPageChange(val) {
      console.log(val)
      this.search.pageNum = val
      this.onSearchKeep()
    },
    // 新建结果设置
    insertResult(){
      this.$router.push("./form-edit?type=Combo&testPaperId="+this.$route.query.id);
    },
    getContent(content) {
      this.model.endContent = content;
    },
    onSubmitQuestion() {
      this.$refs.formQuestion.onSubmitQuestion();
      this.activeIndex = 2
      this.resultSubject(this.$route.query.id)
    },
    openDialogTable() {
      this.dialogTable = true;
    },
    closeDialogTable() {
      this.dialogTable = false;
    },
    saveCurrent() {
      this.model.sourceId = this.tableRow.id;
      this.sourceData = this.tableRow;
      this.closeDialogTable();
    },
    rowClick(row) {
      this.tableRow = row;
    },
    cancelCurrent() {
      this.model.sourceId = "";
      this.sourceData = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 15px;
}
.pagination-count {
  margin-right: -26px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color: #7b7b7b;
}
.el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #303133;
  font-weight: bold;
}
.activity-form__tabs {
  width: 300px;
  margin-bottom: 40px;
  display: flex;
  .activity-form__tab {
    width: 100px;
    text-align: center;
    list-style: none;
    padding: 10px;
    background: #f5f5f5;
    cursor: default;
  }
  .activity-form__tab--active {
    color: #fff;
    background: #409eff;
  }
}

.survey-wrap-left {
  position: fixed;
  top: 250px;
  width: 150px;
  bottom: 82px;
}
.survey-wrap-right {
  position: fixed;
  top: 250px;
  overflow: auto;
  border-left: 5px solid #eee;
  padding: 0 15px;
  left: 430px;
  right: 22px;
  bottom: 82px;
  &__info {
    padding: 10px;
    margin-bottom: 15px;
    &:hover {
      background: #eee;
    }
  }
  &__form {
    background: #eee;
    padding: 15px;
    margin: 15px 0;
    .question-options-icon {
      display: block;
      margin: 0 auto;
      line-height: 34px;
      text-align: center;
      font-size: 22px;
      color: #b5b5b5;
      background: #fff;
      width: 34px;
      height: 34px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
  }
}
.question-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}
.question-info {
  &__item {
    cursor: context-menu;
    list-style: none;
    margin-bottom: 15px;
    border: 1px solid #eee;
    padding: 5px 10px;
    border-radius: 25px;
    text-align: center;
    font-size: 14px;
  }
}
.souce-data {
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 620px;
  padding: 10px;
  background: rgba(245, 247, 250, 1);
  img {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }
  p {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
  }
}
</style>
