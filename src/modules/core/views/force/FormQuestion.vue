<template>
  <div>
    <div class="survey-wrap-left">
      <h2 class="question-title">资料收集</h2>
      <ul class="question-info">
        <li class="question-info__item" @click="addQuestion('info', 'name')">姓名</li>
        <li class="question-info__item" @click="addQuestion('info', 'phone')">手机</li>
        <li class="question-info__item" @click="addQuestion('info', 'company')">公司</li>
        <li class="question-info__item" @click="addQuestion('info', 'position')">职位</li>
      </ul>
      <h2 class="question-title">题目类型</h2>
      <ul class="question-info">
        <li class="question-info__item" @click="addQuestion('type', 1)">单选</li>
        <li class="question-info__item" @click="addQuestion('type', 2)">多选</li>
        <li class="question-info__item" @click="addQuestion('type', 3)">单行文本题</li>
      </ul>
    </div>
    <div class="survey-wrap-right">
      <div v-for="(item, index) in questionModel.questionList" :key="index">
        <div class="survey-wrap-right__info" v-if="editorIndex !== index">
          <p>{{ index + 1 }}.{{ item.title }}</p>
          <img
            v-if="item.picture"
            :src="imgHost + item.picture"
            width="150px"
            style="margin-top:15px"
          />
          <div>
            <div v-if="item.type != 3">
              <div
                v-for="(option, optionsIndex) in item.optionList"
                :key="optionsIndex"
                style="margin-top: 10px;"
              >
                <el-radio v-if="item.type == 1" :label="optionsIndex">
                  <p style="display: inline-block;margin-bottom: 20px;">{{ option.value }}</p>
                  <img
                    v-if="option.picture"
                    style="display: block;margin-left: 25px;"
                    :src="imgHost + option.picture"
                    width="180px"
                  />
                </el-radio>
                <el-checkbox v-if="item.type == 2">
                  <p style="display: inline-block;margin-bottom: 20px;">{{ option.value }}</p>
                  <img
                    v-if="option.picture"
                    style="display: block;margin-left: 25px;"
                    :src="imgHost + option.picture"
                    width="180px"
                  />
                </el-checkbox>
              </div>
            </div>
            <div v-else style="margin-top: 10px">
              <el-input></el-input>
            </div>
          </div>
          <div style="margin-top: 10px">
            <el-button size="small" @click="editorQuestion(index)">编辑</el-button>
            <el-button size="small" @click="copyQuestion(index)">复制</el-button>
            <el-button size="small" @click="deleteQuestion(index)">删除</el-button>
            <el-button size="small" @click="changeSort(index, 'up')" :disabled="index == 0">上移</el-button>
            <el-button
              size="small"
              @click="changeSort(index, 'down')"
              :disabled="index == questionModel.questionList.length - 1"
            >下移</el-button>
            <el-button size="small" :disabled="index == 0" @click="changeSort(index, 'shift')">最前</el-button>
            <el-button
              size="small"
              :disabled="index == questionModel.questionList.length - 1"
              @click="changeSort(index, 'pop')"
            >最后</el-button>
          </div>
        </div>
        <div v-if="editorIndex === index" class="survey-wrap-right__form">
          <el-form
            :model="questionModel.questionList[editorIndex]"
            :hide-required-asterisk="true"
            ref="questionModel"
            label-width="70px"
            label-position="left"
            size="medium"
            style="width: 800px"
          >
            <el-form-item label="题目" prop="title" :rules="[{ required: true, message: '请填写问卷题目' }]">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="item.title"></el-input>
                </el-col>
                <el-col :span="2">
                  <QcImageUpload
                    style="margin: 1px auto;background: #fff;"
                    v-model="item.picture"
                    width="34px"
                    height="33px"
                    icon-size="22px"
                  ></QcImageUpload>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="类型">
              <!-- <div v-if="item.type==1">单选题</div>
              <div v-if="item.type==2">多选题</div>
              <div v-if="item.type==3">单行文本题</div>-->
              <el-select v-model="item.type" style="width:118px">
                <el-option label="单选题" :value="1"></el-option>
                <el-option label="多选题" :value="2"></el-option>
                <el-option label="单行文本题" :value="3"></el-option>
              </el-select>
              <el-checkbox v-model="item.required">是否必填</el-checkbox>
            </el-form-item>
            <template v-if="item.type != 3">
              <el-form-item
                :prop="`optionList.${optionsIndex}.value`"
                :rules="[{ required: true, message: '请填写选项内容' }]"
                :label="`选项${optionsIndex + 1}`"
                v-for="(option, optionsIndex) in item.optionList"
                :key="optionsIndex"
              >
                <el-row>
                  <el-col :span="18">
                    <el-input v-model="option.value"></el-input>
                    <!-- <el-checkbox v-model="option.isNeedInput">提供输入框</el-checkbox> -->
                  </el-col>
                  <el-col :span="2">
                    <QcImageUpload
                      style="margin: 1px auto;background: #fff;"
                      v-model="option.picture"
                      width="34px"
                      height="33px"
                      icon-size="22px"
                    ></QcImageUpload>
                  </el-col>
                  <el-col :span="2">
                    <!-- <span
                      :style="`${option.url ? 'color:#409eff' : ''}`"
                      class="question-options-icon el-icon-paperclip"
                      @click="addOptionsUrl(index, optionsIndex, option.url)"
                    ></span>-->
                  </el-col>
                  <el-col :span="2">
                    <span
                      class="question-options-icon el-icon-delete"
                      @click="deleteOptions(index, optionsIndex)"
                    ></span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="optionList" :rules="[{ message: '请添加选项', required: true }]">
                <el-button icon="el-icon-plus" @click="addOptions(index)" style="width: 545px;">新建选项</el-button>
              </el-form-item>
            </template>
            <!-- <el-form-item v-if="item.type == 1">
              <el-checkbox
                :value="item.isBeInterested"
                @change="changeFollow($event, index)"
              >设为感兴趣的题目</el-checkbox>
            </el-form-item>-->
            <el-form-item>
              <el-button @click="cancelQuestionList(index)">取消</el-button>
              <el-button @click="saveQuestionList(index)" type="primary">确认</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    surveyId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 全局的感兴趣
      isBeInterested: false,
      // 当前编辑的下标
      editorIndex: null,
      questionModel: {
        surveyId: "",
        questionList: []
      }
    };
  },
  watch: {
    surveyId(val) {
      val && this.getSurveyQuestion();
    }
  },
  methods: {
    getSurveyQuestion() {
      this.$http.getSurveyQuestion({ surveyId: this.surveyId }).then(res => {
        this.questionModel.surveyId = this.surveyId;
        this.questionModel.questionList = res.data.data || [];
        this.questionModel.questionList.map(item => {
          if (item.isBeInterested) {
            this.isBeInterested = true;
          }
        });
      });
    },
    // 添加问题
    addQuestion(type, value) {
      const key = {
        name: "姓名",
        phone: "手机",
        company: "公司",
        position: "职位"
      }[value];
      let model = {
        required: true,
        seqNum: "",
        type: type == "type" ? value : 3,
        title: key,
        picture: "",
        memberInfoSign: type == "info" ? value : "",
        isBeInterested: false,
        optionList: []
      };
      this.beformQuestion = null;
      this.questionModel.questionList.push(model);
      this.editorIndex = this.questionModel.questionList.length - 1;
      console.log(this.questionModel.questionList)
    },
    // 删除问题
    deleteQuestion(index) {
      this.questionModel.questionList.splice(index, 1);
    },
    // 复制问题
    copyQuestion(index) {
      let {
        memberInfoSign,
        optionList,
        picture,
        seqNum,
        title,
        type
      } = this.questionModel.questionList[index];
      let data = optionList
        ? optionList.map(item => {
            let { createTime, surveyId, value, picture, isNeedInput } = item;
            return { createTime, surveyId, value, picture, isNeedInput };
          })
        : [];
      this.questionModel.questionList.splice(index + 1, 0, {
        memberInfoSign,
        optionList: data,
        picture,
        seqNum,
        title,
        type
      });
      this.editorIndex = index + 1;
    },
    // 编辑问题
    editorQuestion(index) {
      this.editorIndex = index;
      this.beformQuestion = JSON.parse(
        JSON.stringify(this.questionModel.questionList[index])
      );
    },
    // 添加选项
    addOptions(index, optionsIndex) {
      if (!this.questionModel.questionList[index].optionList) {
        this.$set(this.questionModel.questionList[index], 'optionList', [])
      };
      let item = {
        seqNum: "",
        value: "",
        picture: "",
        url: "",
        isNeedInput: false
      };
      this.questionModel.questionList[index].optionList.push(item);
     
      if(this.questionModel.questionList[index].type==3){
        this.$set(this.questionModel.questionList[index], 'optionList', [])
      }
      console.log(this.questionModel.questionList)
    },
    // 添加选项
    deleteOptions(index, optionsIndex) {
      this.questionModel.questionList[index].optionList.splice(optionsIndex, 1);
    },
    // 取消保存问题
    cancelQuestionList(index) {
      if (this.beformQuestion) {
        this.$set(this.questionModel.questionList, index, this.beformQuestion);
      } else {
        this.questionModel.questionList.splice(index, 1);
      }
      this.editorIndex = null;
    },
    // 排序
    changeSort(index, type) {
      let data = this.questionModel.questionList.splice(index, 1);
      switch (type) {
        case "up":
          this.questionModel.questionList.splice(index - 1, 0, data[0]);
          break;
        case "down":
          this.questionModel.questionList.splice(index + 1, 0, data[0]);
          break;
        case "shift":
          this.questionModel.questionList.unshift(data[0]);
          break;
        case "pop":
          this.questionModel.questionList.push(data[0]);
          break;
      }
    },
    // 感兴趣的问题
    changeFollow(e, index) {
      if (!e) {
        this.questionModel.questionList[index].isBeInterested = false;
        this.isBeInterested = false;
        return;
      }
      if (this.isBeInterested) {
        this.$message.warning("已存在感兴趣的题目，无法继续设置");
      } else {
        this.isBeInterested = true;
        this.questionModel.questionList[index].isBeInterested = true;
      }
    },
    // 保存问题
    saveQuestionList() {
      this.$refs.questionModel[0].validate(flag => {
        if (flag) {
          this.editorIndex = null;
        }
      });
    },
    // 设置链接
    addOptionsUrl(index, optionsIndex, url) {
      this.$prompt("", "链接", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: url
      })
        .then(({ value }) => {
          this.questionModel.questionList[index].optionList[
            optionsIndex
          ].url = value;
        })
        .catch(() => {});
    },
    onSubmitQuestion() {
      if (this.editorIndex == null) {
        this.questionModel.questionList.map((item, index) => {
          item.seqNum = index;
          if (item.type == 1 || item.type == 2) {
            item.optionList.map((option, oidx) => {
              option.seqNum = oidx;
            });
          }
        });
        this.$http.updateSurveyQuestion(this.questionModel).then(() => {
          this.$message.success("保存成功");
          this.$router.push("./list");
        });
      } else {
        this.$message.warning("请先保存当前编辑的题目。");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
