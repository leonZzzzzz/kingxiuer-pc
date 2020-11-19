<template>
  <QcNavigationPage full content="结果详情" class="wrap">
    <div class="wrap" ref="wrap" v-loading="loading">
      <div :style="{'height': height + 'px'}" style="overflow: auto;">
        <div class="detail-title">
          <div style="line-height:23px;display:flex">
            <span>测评结果：</span>
            <div style="width:600px;">
              <div v-for="(res,index) in result">{{index+1}}.{{res}}</div>
            </div>
          </div>
          <div class="point" v-if="model.pointList && model.pointList.length">
            <div class="point-item" v-for="(point, i) in model.pointList" :key="i">
              <span>{{point.factor}}：</span>
              <span>{{point.point}}</span>
            </div>
          </div>
        </div>
        <div class="detail-content-box" v-if="model.answerList">
          <div class="item" v-for="(item, i) in model.answerList" :key="i">
            <div class="title">
              <p>{{item.sortNumber}}.{{item.title}}</p>
              <div class="img" v-if="item.image" @click="openImgBox(item.image)">
                <img :src="`${imgHost}${item.image}`" alt />
              </div>
            </div>
            <div class="answer" v-if="item.options">
              <template v-for="(option, k) in item.options">
                <div
                  class="answer-item"
                  :key="k"
                  v-if="item.type === 'name' || item.type === 'fill_blank' || item.type === 'remark' || item.type === 'birth_ym' || item.type === 'province_city' || item.type === 'mobile'"
                >
                  <i class="iconfont icon-danxuan1"></i>
                  <div class="answer-item-content">
                    <div class="text">{{option.answer}}</div>
                    <div class="img" v-if="option.image" @click="openImgBox(option.image)">
                      <img :src="`${imgHost}${option.image}`" alt />
                    </div>
                  </div>
                </div>
                <div
                  class="answer-item"
                  :key="k"
                  v-if="(item.type === 'single_choice' || item.type === 'multi_choice' || item.type === 'gender') && option.checked"
                >
                  <i class="iconfont icon-danxuan1"></i>
                  <div class="answer-item-content">
                    <div class="text">{{option.title}}</div>
                    <div class="img" v-if="option.image" @click="openImgBox(option.image)">
                      <img :src="`${imgHost}${option.image}`" alt />
                    </div>
                  </div>
                </div>
                <div
                  class="answer-item"
                  style="margin:15px;color:#999"
                  :key="k"
                  v-if="(item.type === 'single_choice' || item.type === 'multi_choice' || item.type === 'gender') && option.checked"
                >
                  <span v-if="option.analysis">解析：{{option.analysis}}</span>
                </div>
                <div
                  class="answer-item"
                  style="margin:15px;color:#999"
                  :key="k"
                  v-if="item.type === 'name' || item.type === 'fill_blank' || item.type === 'remark' || item.type === 'birth_ym' || item.type === 'province_city' || item.type === 'mobile'"
                >
                  <span v-if="option.analysis">解析：{{option.analysis}}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="detail-bottom">
        <el-button type="primary" @click="$router.go(-1)" size="small">返回</el-button>
      </div>-->

      <el-dialog
        :visible.sync="visible"
        width="500px"
        :append-to-body="true"
        :close-on-press-escape="false"
      >
        <div class="preview-img">
          <img :src="`${imgHost}${previewImg}`" alt />
        </div>
      </el-dialog>
    </div>
  </QcNavigationPage>
</template>

<script>
// import api from "api/common";

export default {
  data() {
    return {
      model: {},
      result:'',
      height: 0,
      loading: false,
      visible: false,
      previewImg: '',
    }
  },
  created() {
    this.answeGet(this.$route.query.id)
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 120 - 50
    },
    getList(){
      this.$http.getTestAnswer({testPaperAnswerId:this.$route.query.id}).then(res=>{
        // res.data.data.forEach((item,index)=>{
        //   this.result+=index+1+'.'+item+';'
        // })
        this.result = res.data.data
      })
    },
    async answeGet(id) {
      this.loading = true
      this.$http.answeGet({id}).then(res=>{
        this.model = res.data.data
        this.loading = false
      })
    },
    openImgBox(img) {
      this.previewImg = img
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
}
.detail-title {
  // height: 50px;
  // line-height: 50px;
  padding: 20px 30px;
  background: rgb(250, 251, 252);
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  .point {
    .point-item {
      margin-top: 10px;
    }
  }
}
.detail-content-box {
  // overflow: auto;
  padding: 20px 30px;
  box-sizing: border-box;
  .item {
    margin-top: 30px;
    &:first-child {
      margin-top: 0;
    }
    .title {
      margin-bottom: 10px;
      .img {
        width: 300px;
        height: 100px;
        overflow: hidden;
        line-height: 0;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
    }
    .answer {
      padding-left: 13px;
      .answer-item {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 8px;
          margin-right: 5px;
          flex-shrink: 0;
        }
        .answer-item-content {
          width: 800px;
          display: flex;
          flex-direction: column;
          padding: 5px;
          .img {
            width: 300px;
            height: 100px;
            overflow: hidden;
            line-height: 0;
            cursor: pointer;
            border: 1px solid rgb(230, 230, 230);
            img {
              width: 100%;
            }
          }
          .text {
            padding-left: 5px;
          }
        }
      }
    }
  }
}
.detail-bottom {
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // right: 0;
  border-top: 1px solid #e7eaec;
  text-align: center;
  box-sizing: border-box;
}
.preview-img {
  text-align: center;
  img {
    max-width: 100%;
  }
}
</style>
