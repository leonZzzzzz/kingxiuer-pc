<template>
  <QcNavigationPage content="结果设置" :full="true" class>
    <div class="wrap" v-loading="dataLoading" element-loading-text="数据加载中">
      <div class="result-edit-box" :style="{'height': contentHeight + 'px'}">
        <div class="edit-box">
          <div class="edit-box__title">
            <p class="t-left">结果标题：</p>
            <el-input
              v-model="model.title"
              maxlength="32"
              placeholder="请输入标题（不超过32字）"
              size="small"
              style="width: 800px;"
            ></el-input>
          </div>
          <div class="edit-box__title">
            <p class="t-left">优先级：</p>
            <el-input-number
              v-model.number="model.priority"
              :controls="false"
              placeholder="请输入优先级"
              size="small"
              style="width: 200px;"
              :disabled="model.isDefault"
            ></el-input-number>
          </div>
          <div class="edit-box__title" v-if="$route.query.type === 'Score'">
            <p class="t-left">主要分值项：</p>
            <el-select
              size="small"
              style="width: 200px;"
              v-model="model.factorId"
              :disabled="model.isDefault"
            >
              <el-option
                :label="factor.title"
                :value="factor.id"
                v-for="(factor, i) in factorList"
                :key="i"
              ></el-option>
            </el-select>
          </div>

          <div class="edit-box__factor">
            <p class="t-left">结果出现条件：</p>

            <div class="factor-box" v-if="$route.query.type === 'Score'">
              <div class="factor-box__title">
                <span>分值项</span>
                <span>分值比较</span>
                <span>分值</span>
              </div>
              <div class="factor-box__item" v-for="(item, i) in model.factorConditions" :key="i">
                <div class="top" v-if="i !== 0">
                  <span class="top-title">与上一条件关系</span>
                  <el-select size="small" style="width: 200px;" v-model="item.lastConditionLogic">
                    <el-option label="且" value="and"></el-option>
                    <el-option label="或" value="or"></el-option>
                  </el-select>
                </div>
                <div class="bottom">
                  <el-select
                    size="small"
                    style="width: 380px; margin-right: 20px;"
                    v-model="item.resultFactorId"
                    @change="handleFactor"
                  >
                    <el-option
                      :label="factor.title"
                      :value="factor.id"
                      :disabled="factor.disabled"
                      v-for="(factor, i) in factorList"
                      :key="i"
                    ></el-option>
                  </el-select>
                  <el-select
                    size="small"
                    style="width: 180px; margin-right: 20px;"
                    v-model="item.pointCompareLogic"
                  >
                    <el-option label=">" value="greater_than"></el-option>
                    <el-option label=">=" value="greater_or_equal"></el-option>
                    <el-option label="<" value="less_than"></el-option>
                    <el-option label="<=" value="less_or_equal"></el-option>
                    <el-option label="=" value="equal"></el-option>
                  </el-select>
                  <el-input-number
                    :controls="false"
                    placeholder="请输入"
                    size="small"
                    style="width: 140px; margin-right: 20px;"
                    v-model="item.point"
                    min="0"
                  ></el-input-number>
                  <el-button
                    type="text"
                    style="color: rgb(49, 168, 255) !important;"
                    @click="deleteFactorConditions(i)"
                    v-if="i !== 0"
                  >删除</el-button>
                </div>
              </div>
              <el-button
                type="text"
                style="color: rgb(49, 168, 255) !important;"
                @click="addFactorConditions()"
                v-if="!model.isDefault"
              >
                <i class="iconfont icon-tianjia1" style="margin-right: 5px;"></i>
                添加选项
              </el-button>
              <el-button type="text" style="color: #999 !important; cursor: not-allowed;" v-else>
                <i class="iconfont icon-tianjia1" style="margin-right: 5px;"></i>
                添加选项
              </el-button>
            </div>

            <div class="factor-box2" v-if="$route.query.type === 'Combo'">
              <div class="factor-box2__item" v-for="(item, i) in model.resultConditions" :key="i">
                <div class="top" v-if="i !== 0">
                  <span class="top-title">与上一条件关系</span>
                  <el-select size="small" style="width: 200px;" v-model="item.lastConditionLogic">
                    <el-option label="且" value="and"></el-option>
                    <el-option label="或" value="or"></el-option>
                  </el-select>
                </div>
                <div class="factor-box2__item-title">
                  <el-select
                    size="small"
                    style="width: 500px;"
                    v-model="item.subjectId"
                    @change="handleSubject"
                  >
                    <el-option
                      :label="`${subject.sortNumber}.${subject.title}`"
                      :value="subject.id"
                      v-for="(subject, j) in subjects"
                      :key="j"
                    ></el-option>
                  </el-select>
                  <div
                    class="factor-box2__item-move"
                    v-if="i !== 0"
                    @click="deleteResultConditions(i)"
                  >
                    <i class="el-icon-minus"></i>
                    删除
                  </div>
                </div>
                <div class="factor-box2__item-option">
                  <div>当”关联题目{{item.sortNumber}}“选择下面的选项：</div>
                  <el-button
                    size="mini"
                    style="margin-top: 10px;"
                    :disabled="item.options.length === item.checkboxList.length"
                    @click="allCheck(i)"
                  >全选</el-button>
                  <el-checkbox-group
                    class="choice-box"
                    v-model="item.options"
                    v-if="item.checkboxList.length"
                  >
                    <el-checkbox
                      class="choice-box__item"
                      :label="option.id"
                      v-for="(option, i) in item.checkboxList"
                      :key="i"
                    >
                      <div class="p-img" v-if="option.image">
                        <img :src="`${imgHost}${option.image}`" alt />
                      </div>
                      {{option.title}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <el-button
                type="text"
                style="color: rgb(49, 168, 255) !important;"
                @click="addResultConditions()"
                v-if="!model.isDefault"
              >
                <i class="iconfont icon-tianjia1" style="margin-right: 5px;"></i>
                添加选项
              </el-button>
              <el-button type="text" style="color: #999 !important; cursor: not-allowed;" v-else>
                <i class="iconfont icon-tianjia1" style="margin-right: 5px;"></i>
                添加选项
              </el-button>
            </div>
          </div>
        </div>
        <div class="analysis-box">
          <p style="margin-bottom: 5px;">结果解析：</p>
          <Editor v-model="model.analysis"></Editor>
          <!-- <editor :content="model.analysis" @get-content="getContent" ref="editor"></editor> -->
        </div>
        <div class="goods-box">
          <!-- <div class="title">
            <span>{{$route.query.paperType == 'tool' ? '推荐课程' : '推荐商品'}}</span>
            <el-switch v-model="model.showRecommendContent" :disabled="model.isDefault"></el-switch>
          </div>-->
          <template v-if="model.showRecommendContent">
            <div class="goods-box__item" v-for="(good, i) in model.recommendContents" :key="i">
              <i class="iconfont icon-guanbi2" @click="deleteGoods(i)"></i>
              <div class="goods-box__item-left" @click="openImgBox(i)">
                <img :src="imgHost + good.cover" alt v-if="good.cover" />
                <i class="iconfont icon-tupian" v-else></i>
              </div>
              <div class="goods-box__item-right">
                <div class="upload-demo">
                  <!-- <el-button size="mini" type="primary" @click="openImgBox(i)">上传</el-button> -->
                  <span style="font-size: 14px;">(图片不能大于1M，尺寸600*600px)</span>
                </div>
                <div class="right-title">
                  <span>商品名称：</span>
                  <el-input
                    size="small"
                    style="width: 100%;"
                    v-model="good.title"
                    maxlength="32"
                    placeholder="请输入商品名称（不超过32字）"
                  ></el-input>
                </div>
                <div class="right-title">
                  <span>商品价格：</span>
                  <el-input
                    size="small"
                    style="width: 100%;"
                    v-model="good.remark"
                    maxlength="32"
                    placeholder="请输入商品价格（不超过32字）"
                  ></el-input>
                </div>
                <div class="right-title">
                  <span>商品链接：</span>
                  <el-input
                    size="small"
                    style="width: 100%;"
                    v-model="good.link"
                    placeholder="请输入商品链接"
                  ></el-input>
                </div>
              </div>
            </div>
            <el-button
              size="small"
              @click="closeDialogTable(true)"
              v-if="$route.query.paperType == 'tool'"
            >
              <i class="el-icon-plus"></i>
              添加推荐课程
            </el-button>
            <el-button size="small" @click="addGoods()" v-else>
              <i class="el-icon-plus"></i>
              添加推荐商品
            </el-button>
          </template>
        </div>
      </div>
      <div class="result-bottom-btn">
        <el-button type="primary" @click="submit()" size="small" :loading="loading">完成编辑</el-button>
      </div>

      <image-dialog
        :visible="digImgWrap"
        uploadType="radio"
        imageType="healthsurvey"
        @close-imgbox="closeImgbox"
        @get-imgsrc="onGetImgsrc"
      ></image-dialog>

      <!-- 选择发送对象 -->
      <dig-table
        :visible="dialogTable"
        :receiver-type="3"
        :table-item="tableItemData"
        table-api="api/admin/v1/onlinecourse/page"
        :selection-data="sendOptions"
        @submit="digTableSubmit"
        @close="closeDialogTable"
      ></dig-table>
    </div>
  </QcNavigationPage>
</template>

<script>
// import editor from "common/editor";
// import ImageDialog from "common/ImageDialog";
// import api from "api/common";
// import DigTable from "./digTable";

export default {
  // components: {
  //   editor, ImageDialog, DigTable
  // },
  data() {
    return {
      digImgWrap: false,
      model: {
        testPaperId: this.$route.query.testPaperId,
        factorId: '',
        title: '',
        priority: '',
        analysis: '',
        factorConditions: [],
        resultConditions: [],
        showRecommendContent: false,
        recommendContents: [],
      },
      factorList: [],
      loading: false,
      contentHeight: 0,
      imgIndex: '',
      subjects: [],
      dataLoading: false,
      dialogTable: false,
      tableItemData: [
        { prop: "title", label: "标题" },
        { prop: "categoryName", label: "分类" },
        { prop: "endDuration", label: "结课天数" },
        { prop: "releaseTime", label: "发布时间" }
      ],
      cacheConditions: [],
      sendOptions: [],
      // lessonBase: `${this.base.baseHost}${this.base.projectName()}/mobile/POUND/xue/courseDetail?wo=1&wot=2&woacm=1&mpl=1&`,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.getHeight();
    };
  },
  created() {
    // console.log(this.$route.query.paperType)
    this.dataLoading = true
    if (this.$route.query.type === 'Combo') {
      this.subjectList()
    } else if (this.$route.query.type === 'Score') {
      this.getFactorList()
    }
  },
  methods: {
    getHeight() {
      this.contentHeight = window.innerHeight - 120 - 180
    },
    // 打开图片对话框
    openImgBox(index) {
      this.digImgWrap = true;
      this.imgIndex = index
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.recommendContents[this.imgIndex].cover = val
      this.imgIndex = ''
    },

    resultGet(type, id) {
      console.log(type, id)
      this.$http[type]({ id }).then(res=>{
        console.log(type, res.data)
        this.model = res.data.data
        if (type === 'resultComboGet' && this.model.resultConditions) {
          this.handleSubject()
        } else if (type === 'resultScoreGet' && this.model.factorConditions) {
          this.handleFactor()
        }
        this.dataLoading = false
      })
    },

    handleFactor() {
      this.factorList.map((label, j) => {
        label.disabled = false
        this.model.factorConditions.map((item, i) => {
          if (item.resultFactorId === label.id) label.disabled = true
        })
      })
    },
    // 分值列表
    getFactorList() {
      this.$http.factorList({testPaperId: this.$route.query.testPaperId}).then(res=>{
        console.log('factorList', res.data)
        this.factorList = res.data.data.map(item => {
          return {
            title: item.title,
            id: item.id,
            disabled: false,
          }
        })
        if (this.$route.query.update === 'Update') {
          // let type = this.$route.query.type === 'score' ? 'resultScoreGet' : 'resultComboGet'
          this.resultGet('resultScoreGet', this.$route.query.id)
        } else {
          this.dataLoading = false
        }
      })
    },
    // 添加分值条件
    addFactorConditions() {
      this.model.factorConditions.push({
        resultFactorId: '',
        pointCompareLogic: '',
        point: '',
        lastConditionLogic: 'and',
      })
    },
    // 删除分值条件
    deleteFactorConditions(i) {
      this.model.factorConditions.splice(i, 1)
      this.factorList.map((label, j) => {
        label.disabled = false
        this.model.factorConditions.map((item, i) => {
          if (item.resultFactorId === label.id) label.disabled = true
        })
      })
    },

    // 添加组合条件
    addResultConditions() {
      if (!this.model.resultConditions) this.model.resultConditions = []
      this.model.resultConditions.push({
        subjectId: '',
        lastConditionLogic: 'and',
        options: [],
        checkboxList: [],
        sortNumber: '',
      })
      this.cacheConditions = this.model.resultConditions.map(item => item.subjectId)
    },
    // 删除组合条件
    deleteResultConditions(i) {
      this.model.resultConditions.splice(i, 1)
      this.cacheConditions = this.model.resultConditions.map(item => item.subjectId)
    },
    // 获取题目列表
    subjectList() {
      this.$http.subjectList({ testPaperId: this.$route.query.testPaperId }).then(res=>{
        if (res.data.data.length) {
          res.data.data.map(item => {
            if (item.options && item.options.length) {
              let subject = {
                sortNumber: item.sortNumber,
                id: item.id,
                options: item.options,
                title: item.title,
                disabled: false,
                type: item.type,
              }
              this.subjects.push(subject)
            }
          })
          console.log('subjects', this.subjects)
        }
        if (this.$route.query.update === 'Update') {
          // let type = this.$route.query.type === 'score' ? 'resultScoreGet' : 'resultComboGet'
          this.resultGet('resultComboGet', this.$route.query.id)
        } else {
          this.dataLoading = false
        }
      })
    },
    // 选择关联题目
    handleSubject(val, event) {
      console.log('handleSubject', val, event)
      if (!this.model.resultConditions || this.model.resultConditions.length === 0) return

      this.model.resultConditions.map((item, i) => {
        if (this.cacheConditions.length && (!this.cacheConditions[i] || this.cacheConditions[i] !== item.subjectId)) {
          item.options = []
        }
        if (item.subjectId) {
          this.subjects.map(subject => {
            if (subject.id === item.subjectId) {
              item.checkboxList = subject.options
            }
          })
        }
      })
      this.cacheConditions = this.model.resultConditions.map(item => item.subjectId)
      this.subjects.map((subject, j) => {
        subject.disabled = false
        this.model.resultConditions.map((item, i) => {
          if (item.subjectId === subject.id) {
            subject.disabled = true
            item.sortNumber = subject.sortNumber
            item.type = subject.type
          }
        })
      })
    },
    allCheck(index) {
      this.model.resultConditions[index].options = this.model.resultConditions[index].checkboxList.map(item => item.id)
    },

    // 获取编辑器内容
    // getContent(content) {
    //   this.model.analysis = content;
    // },
    // 添加商品
    addGoods() {
      if (this.model.recommendContents === null) this.model.recommendContents = []
      this.model.recommendContents.push({
        title: '',
        link: '',
        remark: '',
        cover: '',
      })
    },
    // 删除商品
    deleteGoods(i) {
      this.model.recommendContents.splice(i, 1)
      if (this.sendOptions.length) this.sendOptions.splice(i, 1);
    },

    // 提交
    submit() {
      // this.$refs.editor.getContent()
      console.log('model', this.model)
      if (!this.model.title) {
        this.$message.warning('请输入标题')
        return
      }
      if (!this.model.priority && !this.model.isDefault) {
        this.$message.warning('请输入优先级')
        return
      }
      if (!this.model.analysis) {
        this.$message.warning('请输入结果解析')
        return
      }
      if (!this.model.isDefault) {
        if (this.model.factorConditions && this.model.factorConditions.length === 0 && this.model.resultConditions && this.model.resultConditions.length === 0) {
          this.$message.warning('请添加条件')
          return
        }
        if (this.$route.query.type === 'Score') {
          for (let i = 0; i < this.model.factorConditions.length; i++) {
            let item = this.model.factorConditions[i]
            if (i > 0 && !item.lastConditionLogic) {
              this.$message.warning(`请选择与上一条件关系`)
              return
            }
            if (!item.resultFactorId) {
              this.$message.warning(`请选择分值项`)
              return
            }
            if (!item.pointCompareLogic) {
              this.$message.warning(`请选择分值比较`)
              return
            }
            if (!item.point) {
              this.$message.warning(`请输入分值`)
              return
            }
          }
        } else if (this.$route.query.type === 'Combo') {
          console.log(this.model.resultConditions)
          if(this.model.resultConditions&&this.model.resultConditions.length>0){
            for (let i = 0; i < this.model.resultConditions.length; i++) {
              let item = this.model.resultConditions[i]
              if (i > 0 && !item.lastConditionLogic) {
                this.$message.warning(`请选择与上一条件关系`)
                return
              }
              if (!item.subjectId) {
                this.$message.warning(`请选择关联题目`)
                return
              }
              if (!item.options || item.options.length === 0) {
                this.$message.warning(`请选择关联题目的选项`)
                return
              }
            }
          }else{
            this.$message.warning(`请选择关联题目`)
            return
          }
          
        }
      }
      if (this.model.showRecommendContent) {
        let text = this.$route.query.paperType == 'tool' ? '课程' : '商品'
        if (this.model.recommendContents.length === 0) {
          this.$message.warning('请添加推荐' + text)
          return
        }
        for (let i = 0; i < this.model.recommendContents.length; i++) {
          let item = this.model.recommendContents[i]
          if (!item.cover) {
            this.$message.warning(`请上传推荐${text}图片`)
            return
          }
          if (!item.title) {
            this.$message.warning(`请输入推荐${text}标题`)
            return
          }
          if (item.remark === '') {
            this.$message.warning(`请输入推荐${text}价格`)
            return
          }
          if (!item.link) {
            this.$message.warning(`请输入推荐${text}链接`)
            return
          }
        }
      }
      let model = JSON.parse(JSON.stringify(this.model))
      let { type, update, resultType } = this.$route.query
      let apiType = `${resultType}${type}${update}`
      console.log('apiType', apiType)
      this.loading = true
      this.saveResult(apiType, model)
    },
    saveResult(apiType, model) {
      console.log(apiType, model)
      // try {
        // this.$http[apiType](model).then(res=>{
        //   this.$message.success(res.data.message)
        // this.$router.push(`/main/paper/release?id=${this.$route.query.testPaperId}&paperType=${this.$route.query.paperType}`)
        // })
      // } catch(err) {
      //   this.loading = false
      // }
      this.$http[apiType](model).then(res => {
        this.loading = false
        this.$message.success('创建成功')
        this.$router.push(`/main/paper/release?id=${this.$route.query.testPaperId}&paperType=${this.$route.query.paperType}`)
        
      }).catch((err)=>{
        this.loading = false
        this.$message.error(err.data.message)
      });
    },
    digTableSubmit(data) {
      //  去重
      var _arr = this.sendOptions;
      data.forEach(item => {
        let flag = true;
        for (let j = 0; j < this.sendOptions.length; j++) {
          let item2 = this.sendOptions[j];
          if (item.id == item2.id) {
            flag = false;
            break;
          }
        }
        if (flag) _arr.push(item);
      });
      this.sendOptions = _arr;
      this.model.recommendContents = []
      _arr.map(item => {
        this.model.recommendContents.push({
          title: item.title,
          link: `${this.lessonBase}id=${item.id}`,
          remark: this.util.chu(item.price, 100),
          cover: item.iconUrl,
        })
      })
    },
    closeDialogTable(flag) {
      this.dialogTable = flag;
    },
  }
}
</script>

<style lang="scss" scoped>
.result-edit-box {
  overflow: auto;
  .edit-box {
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      border-bottom: 1px solid #efefef;
      left: 20px;
      right: 0;
    }
    &__title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .t-left {
        width: 120px;
        flex-shrink: 0;
        // letter-spacing: 8px;
      }
    }
    &__factor {
      display: flex;
      .t-left {
        width: 120px;
        flex-shrink: 0;
      }
      .factor-box {
        width: 800px;
        &__title {
          background: rgb(232, 232, 232);
          box-sizing: border-box;
          display: flex;
          margin-bottom: 5px;
          span {
            padding: 10px;
            box-sizing: border-box;
            &:first-child {
              width: 400px;
            }
            &:nth-child(2),
            &:nth-child(3) {
              width: 200px;
            }
          }
        }
        &__item {
          margin-top: 10px;
          &:nth-child(2) {
            margin-top: 0;
          }
          .top {
            width: 400px;
            display: flex;
            align-items: center;
            .top-title {
              flex-shrink: 0;
              margin-right: 10px;
            }
          }
          .bottom {
            margin-top: 5px;
            display: flex;
            align-items: center;
          }
        }
      }
      .factor-box2 {
        width: 800px;
        .factor-box2__item {
          position: relative;
          &:not(:first-child) {
            padding-top: 20px;
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              border-top: 1px dashed #e7e7e7;
            }
          }
          .top {
            width: 400px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .top-title {
              flex-shrink: 0;
              margin-right: 10px;
            }
          }
          &-title {
            display: flex;
            align-items: center;
            .factor-box2__item-move {
              margin-left: 10px;
              font-size: 14px;
              color: rgb(49, 168, 255);
            }
          }
          &-option {
            padding: 10px 10px 10px 20px;
            .choice-box {
              margin-top: 10px;
              &__item {
                display: flex;
                align-items: center;
                margin: 0;
                padding: 10px;
                .el-checkbox__label {
                  display: inline-flex;
                  align-items: center;
                }
                .el-radio__label {
                  display: inline-flex;
                  align-items: center;
                }
                .p-img {
                  width: 200px;
                  line-height: 0;
                  margin-right: 10px;
                  overflow: hidden;
                  img {
                    width: 100%;
                  }
                }
              }
            }
          }
          &-move {
            cursor: pointer;
          }
        }
      }
    }
  }
  .analysis-box {
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      border-bottom: 1px solid #efefef;
      left: 20px;
      right: 0;
    }
  }
  .goods-box {
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .title {
      margin-bottom: 10px;
    }
    &__item {
      border: 1px dashed #e7e7e7;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      width: 920px;
      margin-bottom: 10px;
      position: relative;
      .icon-guanbi2 {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 14px;
        color: rgb(216, 216, 216);
      }
      &-left {
        width: 150px;
        height: 150px;
        overflow: hidden;
        // line-height: 0;
        flex-shrink: 0;
        margin-right: 10px;
        background: rgb(232, 232, 232);
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          font-size: 60px;
        }
        img {
          width: 100%;
        }
      }
      &-right {
        width: 100%;
        .right-title {
          display: flex;
          align-items: center;
          margin-top: 10px;
          span {
            flex-shrink: 0;
          }
        }
      }
    }
  }
}

.result-bottom-btn {
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #e7eaec;
  box-sizing: border-box;
}
</style>
