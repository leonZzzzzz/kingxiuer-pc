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
      <el-form :model="model" ref="model" label-width="100px" label-position="left" size="small">
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            style="width: 500px"
            size="small"
            v-model="model.title"
            maxlength="32"
            placeholder="请输入内容（不超过32字）"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="封面图" prop="picture" :rules="[{ required: true, message: '该字段不能为空' }]">
          <QcImageUpload v-model="model.picture" width="500px" height="140px"></QcImageUpload>
          <p>建议比例1080:640，像素小于2M</p>
        </el-form-item>-->
        <!-- <el-form-item
          label="开始时间"
          prop="startTime"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-date-picker
            style="width: 500px"
            type="datetime"
            size="small"
            placeholder="选择日期"
            v-model="model.startTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-date-picker
            style="width: 500px"
            type="datetime"
            size="small"
            placeholder="选择日期"
            v-model="model.endTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="介绍页" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input maxlength="100" type="textarea" v-model="model.content" style="width: 500px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="温馨提示" prop="reminder">
          <Editor v-model="model.endContent"></Editor>
        </el-form-item>-->
        <!-- <el-form-item label="主题颜色" prop="color" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-color-picker v-model="model.color"></el-color-picker>
        </el-form-item>
        <el-form-item
          label="按钮颜色"
          prop="buttonColor"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-color-picker v-model="model.buttonColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="参与限制">
          <div style="display:flex;">
            <el-form-item>
              <el-select v-model="model.limited" style="width:150px">
                <el-option label="每天限制次数" value="day"></el-option>
                <el-option label="限制答题总次数" value="count"></el-option>
              </el-select>
            </el-form-item>&nbsp;&nbsp;
            <el-form-item>
              <el-input v-model="model.num" style="width:100px"></el-input>&nbsp;次
            </el-form-item>
          </div>
          <p style="color: #b5b2b2;font-size: 12px;">设置用户答题次数</p>
        </el-form-item>-->
        <!-- <el-form-item label="关联报名活动">
          <el-button size="small" style="margin-bottom: 20px;" @click="openDialogTable">选择活动</el-button>
          <div v-if="model.sourceId" class="souce-data" style>
            <img v-if="sourceData.iconUrl" :src="imgHost + sourceData.iconUrl" alt />
            <p style>{{ sourceData.title }}</p>
            <el-button class="btn" size="mini" @click="cancelCurrent">取消关联</el-button>
          </div>
          <p
            style="color: #b5b2b2;font-size: 12px;"
          >关联指定的活动，答题后感兴趣推荐题结果关联报名列表，如非活动报名用户答题，答题后自动生成一条新的报名数据</p>
        </el-form-item>-->
      </el-form>
    </div>
    <FormQuestion ref="formQuestion" :survey-id="surveyId" v-show="activeIndex === 1" />
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
      tabbar: ["基础信息", "题目编辑"],
      surveyId: "",
      tableRow: {},
      sourceData: {},
      option: {
        url: "api/admin/v1/activity/page",
        size: "small",
        height: 400
      },
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
      searchData: {
        title: "",
        name: ""
      },
      model: {
        joinedShowType: "",
        linkUrl: "",
        repostContent: "",
        title: "",
        content: "",
        color: "#F8F8F8",
        limited: "day",
        num: "",
        showTitle: true,
        startTime: "",
        endTime: "",
        reminder: "",
        buttonColor: "#F8F8F8",
        sourceId: ""
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getSurvey(this.$route.query.id);
    }
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
    changeActiveIndex(index) {
      if (index == 1 && !this.surveyId) {
        this.$message.warning("请先保存问卷");
        return;
      }
      this.activeIndex = index;
    },
    getSurvey(id) {
      this.$http.Surveydetail({ id: id }).then(res => {
        this.model = res.data.data;
        this.surveyId = this.model.id;
        if (this.model.sourceId) {
          this.sourceData = this.model.activity;
        }
      });
    },
    onSave(type) {
      console.log(type)
      this.$http[type](this.model).then(res => {
        if (type === "updateSurvey") {
          this.surveyId = this.$route.query.id;
        } else {
          this.surveyId = res.data.message;
        }
        this.activeIndex = 1;
      });
    },
    onSubmit() {
      // this.$refs.editor.getContent();
      this.$refs.model.validate(flag => {
        if (flag) {
          this.model.id
            ? this.onSave("updateSurvey")
            : this.onSave("addSurvey");
        }
      });
    },
    getContent(content) {
      this.model.endContent = content;
    },
    onSubmitQuestion() {
      this.$refs.formQuestion.onSubmitQuestion();
      
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
