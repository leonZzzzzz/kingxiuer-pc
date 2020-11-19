<template>
  <div>
    <div class="survey-wrap-left">
      <h2 class="question-title">资料收集</h2>
      <ul class="question-info">
        <li class="question-info__item" @click="addQuestion('info', 'name')">姓名</li>
        <li class="question-info__item" @click="addQuestion('info', 'mobile')">手机</li>
        <!-- <li class="question-info__item" @click="addQuestion('info', 'gender')">性别</li>
        <li class="question-info__item" @click="addQuestion('info', 'birth_ym')">性别</li>
        <li class="question-info__item" @click="addQuestion('info', 'gender')">性别</li>-->
        <li class="question-info__item" @click="addQuestion('info', 'company')">公司</li>
        <li class="question-info__item" @click="addQuestion('info', 'position')">职位</li>
      </ul>
      <h2 class="question-title">题目类型</h2>
      <ul class="question-info">
        <li class="question-info__item" @click="addQuestion('choose', 1)">单选</li>
        <li class="question-info__item" @click="addQuestion('choose', 2)">多选</li>
        <li class="question-info__item" @click="addQuestion('choose', 3)">单行文本题</li>
      </ul>
    </div>
    <div class="survey-wrap-right">
      <div v-for="(item, index) in questionModel.subjects" :key="index">
        <div class="survey-wrap-right__info" v-if="editorIndex !== index">
          <p>{{ index + 1 }}.{{ item.title }}</p>
          <img v-if="item.image" :src="imgHost + item.image" width="150px" style="margin-top:15px" />
          <div>
            <div v-if="item.infoSign != 3">
              <div
                v-for="(option, optionsIndex) in item.options"
                :key="optionsIndex"
                style="margin-top: 10px;"
              >
                <el-radio v-if="item.infoSign == 1" :label="optionsIndex">
                  <p style="display: inline-block;margin-bottom: 20px;">{{ option.title }}</p>
                  <img
                    v-if="option.image"
                    style="display: block;margin-left: 25px;"
                    :src="imgHost + option.image"
                    width="180px"
                  />
                </el-radio>
                <el-checkbox v-if="item.infoSign == 2">
                  <p style="display: inline-block;margin-bottom: 20px;">{{ option.title }}</p>
                  <img
                    v-if="option.image"
                    style="display: block;margin-left: 25px;"
                    :src="imgHost + option.image"
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
              :disabled="index == questionModel.subjects.length - 1"
            >下移</el-button>
            <el-button size="small" :disabled="index == 0" @click="changeSort(index, 'shift')">最前</el-button>
            <el-button
              size="small"
              :disabled="index == questionModel.subjects.length - 1"
              @click="changeSort(index, 'pop')"
            >最后</el-button>
          </div>
        </div>
        <div v-if="editorIndex === index" class="survey-wrap-right__form">
          <el-form
            :model="questionModel.subjects[editorIndex]"
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
                    v-model="item.image"
                    width="34px"
                    height="33px"
                    icon-size="22px"
                  ></QcImageUpload>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="item.infoSign" style="width:118px">
                <el-option label="单选题" :value="1"></el-option>
                <el-option label="多选题" :value="2"></el-option>
                <el-option label="单行文本题" :value="3"></el-option>
              </el-select>
              <el-checkbox v-model="item.required">是否必填</el-checkbox>
            </el-form-item>
            <template v-if="item.infoSign != 3">
              <el-form-item
                :prop="`options.${optionsIndex}.title`"
                :rules="[{ required: true, message: '请填写选项内容' }]"
                :label="`选项${optionsIndex + 1}`"
                v-for="(option, optionsIndex) in item.options"
                :key="optionsIndex"
              >
                <el-row>
                  <el-col :span="18">
                    <el-input v-model="option.title"></el-input>
                    <el-checkbox v-model="option.isNeedInput">提供输入框</el-checkbox>
                  </el-col>
                  <el-col :span="2">
                    <QcImageUpload
                      style="margin: 1px auto;background: #fff;"
                      v-model="option.image"
                      width="34px"
                      height="33px"
                      icon-size="22px"
                    ></QcImageUpload>
                  </el-col>
                  <el-col :span="2">
                    <span
                      :style="`${option.url ? 'color:#409eff' : ''}`"
                      class="question-options-icon el-icon-paperclip"
                      @click="addOptionsUrl(index, optionsIndex, option.url)"
                    ></span>
                  </el-col>
                  <el-col :span="2">
                    <span
                      class="question-options-icon el-icon-delete"
                      @click="deleteOptions(index, optionsIndex)"
                    ></span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="options" :rules="[{ message: '请添加选项', required: true }]">
                <el-button icon="el-icon-plus" @click="addOptions(index)" style="width: 545px;">新建选项</el-button>
              </el-form-item>
            </template>
            <el-form-item v-if="item.infoSign == 1">
              <el-checkbox
                :value="item.isBeInterested"
                @change="changeFollow($event, index)"
              >设为感兴趣的题目</el-checkbox>
            </el-form-item>
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
import util from "@/assets/js/util";
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
        testPaperId: "",
        subjects: []
      },
      
    };
  },
  watch: {
    surveyId(val) {
      this.questionModel.testPaperId=val
      this.subjectList();
    }
  },

  methods: {
    subjectList() {
      this.$http.subjectList({ testPaperId: this.surveyId }).then(res => {
        this.questionModel.testPaperId = this.surveyId;
        this.questionModel.subjects = res.data.data || [];
        this.questionModel.subjects.map(item => {
          if (item.isBeInterested) {
            this.isBeInterested = true;
          }
        });
      });
    },
    // 添加问题
    addQuestion(type, value) {
      console.log(type,value)
      var name=''
      if(type=='choose'){
        if(value==1){
          name='single_choice'
        }else if(value==2){
          name='multi_choice'
        }else if(value==3){
          name='fill_blank'
        }
      }else if(type=='info'){
        name=value
      }
      const key = {
        name: "姓名",
        phone: "手机",
        company: "公司",
        position: "职位"
      }[value];
      let model = {
        // required: true,
        infoSign: type == "info" ? value : "",
        id:util.uuid(),
        image: "",
        isNew:true,
        isSubmit:true,
        options: [],
        sortNumber: "",
        title: key,
        type: name,
        // isBeInterested: false,
      };
      console.log(model.type)
      this.beformQuestion = null;
      this.questionModel.subjects.push(model);
      this.editorIndex = this.questionModel.subjects.length - 1;
      console.log(this.questionModel)
    },
    // 删除问题
    deleteQuestion(index) {
      this.questionModel.subjects.splice(index, 1);
    },
    // 复制问题
    copyQuestion(index) {
      let {
        // infoSign,
        id,
        options,
        image,
        sortNumber,
        title,
        type,
        isNew,
        isSubmit
      } = this.questionModel.subjects[index];
      console.log(type)
      let data = options
        ? options.map(item => {
          console.log(item)
            let {id, analysis, image, sortNumber, title, subjectFactorPoint,subjectFactorId} = item;
            return {id,analysis, image, sortNumber, title, subjectFactorPoint,subjectFactorId};
          })
        : [];
      this.questionModel.subjects.splice(index + 1, 0, {
        // infoSign,
        id,
        options: data,
        image,
        sortNumber:index+1,
        title,
        type,
        isNew,
        isSubmit
      });
      this.editorIndex = index + 1;
    },
    // 编辑问题
    editorQuestion(index) {
      this.editorIndex = index;
      this.beformQuestion = JSON.parse(
        JSON.stringify(this.questionModel.subjects[index])
      );
    },
    // 添加选项
    addOptions(index, optionsIndex) {
      console.log(index, optionsIndex)
      this.questionModel.subjects[index].options.push({
        id:util.uuid(),
        analysis:[],
        image: "",
        sortNumber: index+1,
        subjectFactorId: "",
        subjectFactorPoint: 0,
        title: "",
      });
    },
    // 删除选项
    deleteOptions(index, optionsIndex) {
      this.questionModel.subjects[index].options.splice(optionsIndex, 1);
    },
    // 取消保存问题
    cancelQuestionList(index) {
      if (this.beformQuestion) {
        this.$set(this.questionModel.subjects, index, this.beformQuestion);
      } else {
        this.questionModel.subjects.splice(index, 1);
      }
      this.editorIndex = null;
    },
    // 排序
    changeSort(index, type) {
      console.log(type)
      let data = this.questionModel.subjects.splice(index, 1);
      switch (type) {
        case "up":
          this.questionModel.subjects.splice(index - 1, 0, data[0]);
          break;
        case "down":
          this.questionModel.subjects.splice(index + 1, 0, data[0]);
          break;
        case "shift":
          this.questionModel.subjects.unshift(data[0]);
          break;
        case "pop":
          this.questionModel.subjects.push(data[0]);
          break;
      }
    },
    // 感兴趣的问题
    changeFollow(e, index) {
      if (!e) {
        this.questionModel.subjects[index].isBeInterested = false;
        this.isBeInterested = false;
        return;
      }
      if (this.isBeInterested) {
        this.$message.warning("已存在感兴趣的题目，无法继续设置");
      } else {
        this.isBeInterested = true;
        this.questionModel.subjects[index].isBeInterested = true;
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
          this.questionModel.subjects[index].options[
            optionsIndex
          ].url = value;
        })
        .catch(() => {});
    },
    // 保存题目
    onSubmitQuestion() {
      console.log(this.questionModel)
      if (this.editorIndex == null) {
        this.questionModel.subjects.map((item, index) => {
          console.log(item)
          item.sortNumber = index+1;
          if (item.type == 1 || item.type == 2) {
            item.options.map((option, oidx) => {
              option.sortNumber = oidx;
            });
          }
        });
        this.$http.subjectInsert(this.questionModel).then(() => {
          this.$message.success("保存成功");
        });
      } else {
        this.$message.warning("请先保存当前编辑的题目。");
      }
    }
  },
  filters: {
    questionType(val) {
      if (val === "") return "";
      switch (val) {
        case 'single_choice':
          return "单选";
        case 'multi_choice':
          return "多选";
        case 'fill_blank':
          return "填空";
        case 'remark':
          return "备注";
        case 'name':
          return "姓名";
        case 'gender':
          return "性别";
        case 'birth_ym':
          return "年月";
        case 'province_city':
          return "省市";
        case 'mobile':
          return "手机号码";
        default:
          return ''
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
