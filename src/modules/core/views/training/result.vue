<template>
  <div>
    <el-dialog
      :title="'问卷结果'"
      :visible.sync="visible"
      width="600px"
      :append-to-body="true"
      :before-close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="result">
        <div class="base-info">
          <h3>问卷基本信息</h3>
          <p>问卷名称：{{ result.title }}</p>
          <!-- <p>开始时间：{{ result.startTime }}</p>
          <p>结束时间：{{ result.endTime }}</p>-->
          <!-- <p>目前参与人数：{{ result.joinNum }}人</p> -->
        </div>
        <div class="result-list">
          <h3>问卷结果</h3>
          <div
            v-for="(resd,idx) in answerlist"
            style="border-bottom:1px solid #ddd;padding-bottom:15px"
          >
            <div
              v-if="item.type == 3"
              class="result-item"
              v-for="(item, index) in resd.surveyQuestions"
              :key="item.id"
            >
              <p>
                <span>{{ index + 1 }}、{{ item.title }}</span>
                <!-- <span style="color: #666; padding: 0 10px;">(默认显示最新5条)</span> -->
                <!-- <span style="color: #fec02d;cursor: pointer;" @click="openDialogTable(item.id)">查看全部>>></span> -->
              </p>
              <p class="option" v-for="answer in item.answerList" :key="answer.id">
                <span style="color: #666;">{{ answer.textAnswer }}</span>
              </p>
            </div>
            <div v-else class="result-item">
              <p>{{ index + 1 }}、{{ item.title }}</p>
              <img
                v-if="item.picture"
                style="width: 300px;height: 100px;overflow: hidden;"
                :src="`${imgHost}${item.picture}`"
                alt
              />
              <p class="option" v-for="(answer, index) in item.optionList" :key="index">
                <!-- <el-progress
                    class="progress"
                    :percentage="
                      result.joinNum
                        ? (((answer.chooseNum||0)  / result.joinNum) * 100).toFixed(2)
                        : 0
                    "
                    color="#fec02d"
                ></el-progress>-->
                <span style="display:block;margin-bottom:5px;">{{ answer.value }}</span>
                <img
                  v-if="answer.picture"
                  style="width: 300px;height: 100px;overflow: hidden;"
                  :src="`${imgHost}${answer.picture}`"
                />
              </p>
            </div>
            <div class="base-info" style="display:flex;justify-content:space-between">
              <p style="width:440px;">问卷结果点评：{{resd.reviewsContent?resd.reviewsContent:'-'}}</p>
              <div style="margin-top:25px;color:#294A7B">
                <span @click="clickPunch(resd.surveyMemberId)">{{resd.reviewsContent?'修改点评':'点评'}}</span>
                <span
                  @click="deletePunch(resd.reviewsId)"
                  v-if="resd.reviewsContent"
                  style="margin-left:20px"
                >删除</span>
              </div>
            </div>
            <!-- <div class="dianpin">
              <div @click="clickPunch(resd.surveyMemberId)">{{resd.reviewsContent?'修改点评':'点评'}}</div>
              <div @click="clickPunch2(resd.surveyMemberId)">删除</div>
            </div>-->
          </div>
        </div>
      </div>
    </el-dialog>
    <Punch
      :visible="showpunch"
      :memberId="memberId"
      :surveyMemberId="surveyMemberId"
      @closePunch="closePunch"
    ></Punch>
    <!-- <Punchl
      :visible="showpunch"
      :memberId="memberId"
      :surveyMemberId="surveyMemberId"
      @closePunch="closePunch"
    ></Punchl>-->
  </div>
</template>

<script>
import Punch from './punch'
// import Punchl from './punchl'
export default {
  components: { Punch },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    surveyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      answerlist:[],
      contentReview:'',
      showpunch:false,
      surveyMemberId:'',
      memberId:'',
      result:{},
      imageurl:'http://kingsuer-1255600302.file.myqcloud.com',
      model: {
        name:'',
        iconUrl: '',
        sortNum: '',
        parentId:0,
        type:0,
        isHasChild:0
      },
      productPickerVisible: false,
      loading: false
    }
  },
  // created() {
  //   this.pageAttachmentType()
  // },
  computed: {
    module() {
      return 'Mall'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.getAttachment()
          // this.getCommont()
        }
      }
    }
  },
  methods: {
    // 获取点评
    getCommont(){
      this.$http.getCommont({memberId:this.id,surveyId:this.surveyId}).then(res => {
        this.contentReview=res.data.data.content
        // this.updateId=res.data.data.id
        // this.update=true
      }).catch(err=>{
      })
    },
    getAttachment() {
      this.$http.questResult({ memberId: this.id,surveyId:this.surveyId }).then(res => {
        // console.log(res.data.data.SurveyMember)
        this.result = res.data.data.survey
        this.answerlist = res.data.data.answer
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    // 删除点评
    deletePunch(id){
      this.$http.deleteCommont({ id: id}).then(res => {
        this.$message.success('删除成功')
        this.getAttachment()
        // console.log(res.data.data.SurveyMember)
        // this.result = res.data.data.survey
        // this.answerlist = res.data.data.answer
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
   clickPunch(surveyMemberId){
     this.showpunch=true
     this.surveyMemberId = surveyMemberId
   },
   clickPunch2(surveyMemberId){
     this.showpunch=true
     this.surveyMemberId = surveyMemberId
   },
    close(flag) {
      console.log(flag)
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.contentReview=''
      this.$emit('onClose', flag)
    },
    closePunch(flag) {
      console.log(flag)
      this.onlyread=false
      this.surveyMemberId=''
      this.showpunch = false
      this.getAttachment()
      // if (typeof flag == 'boolean' && flag) {
      //   this.$refs.table.onSearchKeep()
      // }
    }
   
  },
 
  
  
}
</script>
<style lang="scss" scoped>
.dianpin {
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.dianpin > div {
  border-radius: 5px;
  width: 80px;
  background: #294a7b;
  padding: 10px;
  margin: 0 auto;
}
.result {
  .base-info {
    p {
      margin-top: 20px;
      line-height: 25px;
    }
  }
  .result-list {
    margin-top: 25px;
    .result-item {
      p {
        margin-top: 25px;
      }
      .option {
        margin-left: 10px;
      }
      .progress {
        display: inline-block;
        width: 200px;
      }
    }
  }
}
</style>
