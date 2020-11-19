<template>
  <QcNavigationPage content="信息" class="prodocu-page">
    <el-form :model="model" ref="model" label-position="left" label-width="100px">
      <QcTitle title="基本信息">
        <el-form-item
          label="问卷列表"
          prop="surveyId"
          :rules="[{ required: true, message: '该字段为必填项' }]"
        >
          <el-select v-model="model.surveyId" style="width:450px;">
            <el-option
              :label="item.title"
              :value="item.id"
              v-for="(item, i) in questionList"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空' }]">
          <el-input
            v-model="model.title"
            style="width:450px;"
            maxlength="32"
            placeholder="请输入内容（不超过32字）"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '该字段为必填项' }]">
          <el-select v-model="model.type" style="width:450px;">
            <el-option :label="item.name" :value="item.type" v-for="(item, i) in typeList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="startTime" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-row class="w-750">
            <el-col style="width:450px;">
              <el-form-item
                label-width="0px"
                prop="startTime"
                :rules="[{ required: true, message: '请填写该字段' }]"
              >
                <el-date-picker
                  style="width:100%"
                  type="datetime"
                  placeholder="开始时间"
                  v-model="model.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align:center">-</el-col>
            <el-col style="width:450px;">
              <el-form-item
                label-width="0px"
                prop="endTime"
                :rules="[{ required: true, message: '请填写该字段' }]"
              >
                <el-date-picker
                  style="width:100%"
                  type="datetime"
                  placeholder="结束时间"
                  v-model="model.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </QcTitle>
      <QcTitle title="打卡建议">
        <div>
          <!-- <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="sug1.name" style="width:450px;" readonly="true"></el-input>
          </el-form-item>-->
          <el-form-item label="运动打卡建议">
            <el-input v-model="sug1.content" style="width:450px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <!-- <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="sug2.name" style="width:450px;" readonly="true"></el-input>
          </el-form-item>-->
          <el-form-item label="饮食打卡建议">
            <el-input v-model="sug2.content" style="width:450px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <!-- <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="sug3.name" style="width:450px;" readonly="true"></el-input>
          </el-form-item>-->
          <el-form-item label="喝水打卡建议">
            <el-input v-model="sug3.content" style="width:450px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <!-- <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="sug4.name" style="width:450px;" readonly="true"></el-input>
          </el-form-item>-->
          <el-form-item label="体温打卡建议">
            <el-input v-model="sug4.content" style="width:450px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <!-- <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="sug5.name" style="width:450px;" readonly="true"></el-input>
          </el-form-item>-->
          <el-form-item label="体重打卡建议">
            <el-input v-model="sug5.content" style="width:450px;"></el-input>
          </el-form-item>
        </div>
        <!-- <div class="specif" v-for="(val,index) in propList">
          <div>
            <el-form-item label="打卡类型" :rules="[{ required: true, message: '该字段为必填项' }]">
              <el-select v-model="val.clockCategory" style="width:450px;">
                <el-option
                  :label="item.content"
                  :value="item.clockCategory"
                  v-for="(item, i) in clockList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="建议内容"
              prop="val.content"
              :rules="[{ required: true, message: '该字段为必填项' }]"
            >
              <el-input v-model="val.content" style="width:450px;"></el-input>
            </el-form-item>
          </div>
          <i class="el-icon-error" @click="onImgListDelete(index)"></i>
        </div>
        <div class="addSuggust" @click="addVaule()">
          <el-button type="text">+ 添加</el-button>
        </div>-->

        <el-form-item style="margin-top:20px">
          <el-button type="primary" :loading="loading" @click="onSubmit()">保存</el-button>
        </el-form-item>
      </QcTitle>
    </el-form>
  </QcNavigationPage>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      questionList:[],
      typeList: [
        {name:'体验营',type:'experience'},
        {name:'训练营',type:'training'}
      ],
      clockList:[],
      loading: false,
      model: {
        surveyId:'',
        title:'',
        type:'',
        startTime:'',
        endTime:'',
        suggests:[]
      },
      sug1:{content:'',clockCategory:'movement',name:'运动'},
      sug2:{content:'',clockCategory:'diet',name:'饮食'},
      sug3:{content:'',clockCategory:'drink',name:'喝水'},
      sug4:{content:'',clockCategory:'temperature',name:'体温'},
      sug5:{content:'',clockCategory:'weight',name:'体重'},
      propList:[
        {clockCategory:'',content:''}
      ]
    }
  },
  watch: {
  
  },
  created() {
    if(this.$route.query.id){
      this.getDetail()
    }
    
    this.getQuestion()
    this.getSugges()
  },
  mounted() {
    
  },
  methods: {
    // 获取详情
    getDetail(){
      this.$http.detailSuggest({id:this.$route.query.id}).then(res=>{
        this.model=res.data.data
        var suggests=res.data.data.suggests
        this.sug1=suggests[0]
        this.sug2=suggests[1]
        this.sug3=suggests[2]
        if(suggests.length>=4){
this.sug4=suggests[3]
        this.sug5=suggests[4]
        }
        
        // this.propList=res.data.data.suggests
      })
    },
    // 问卷列表
    getQuestion(){
      this.$http.getSurvey().then(res=>{
        this.questionList=res.data.data.list
        // var list=res.data.data.list
        // list.forEach(item=>{
        //   var timestamp1 = Date.parse(new Date(item.endTime));
        //   var timestamp2 = Date.parse(new Date());
        //   if(timestamp1>timestamp2){
        //     this.questionList.push(item)
        //   }
        // })
      })
    },
    // 获取打卡建议
    getSugges(){
      this.$http.getSettingSuggest().then(res=>{
        this.clockList=res.data.data
      })
    },
    // 添加打卡建议
    addVaule() {
      let data = {clockCategory:'',content:''}
      this.propList.push(data)
    },
    // 删除
    onImgListDelete(index){
      if(this.propList.length==1){
        this.$message.error('至少保留一个打卡建议')
        return
      }
      this.propList.splice(index,1)
    },
    // 提交
    onSubmit(){
      this.model.suggests=[]
       this.$refs.model.validate(flag => {
        if (flag) {
          // if(!this.sug1.content||!this.sug2.content||!this.sug3.content||!this.sug4.content||!this.sug5.content){
          //   this.$message.error('请将打卡建议填写完整')
          //   return
          // }
          this.model.suggests.push(this.sug1)
          this.model.suggests.push(this.sug2)
          this.model.suggests.push(this.sug3)
          this.model.suggests.push(this.sug4)
          this.model.suggests.push(this.sug5)
          if(this.$route.query.id){
            // this.model.suggests=this.propList
            this.$http.updateSuggest(this.model).then(res => {
              if(res.data.code==20000){
                this.$message.success('修改成功')
                this.$router.back()
              }
            })
          }else{
            // this.model.suggests=this.propList
            this.$http.insertsSuggest(this.model).then(res => {
              if(res.data.code==20000){
                this.$message.success('保存成功')
                this.$router.back()
              }
            })
          }
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.specif {
  border: 1px solid #dcdfe6;
  width: 550px;
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
  position: relative;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow: hidden;
  .el-icon-error {
    position: absolute;
    top: 57px;
    right: -20px;
    font-size: 20px;
    color: #ff5433;
  }
}
.specif:hover > .el-icon-error {
  right: 5px;
  position: absolute;
  top: 57px;
  font-size: 20px;
  color: #ff5433;
  transition: all 0.1s ease;
}
.addSuggust {
  width: 590px;
  border: 1px dotted #1bbc3d;
  color: #1bbc3d !important;
  text-align: center;
}

.prodocu-page {
  .img-box {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    .item {
      position: relative;
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      margin: 0 6px 6px 0;
      flex-shrink: 0;
      img {
        width: 100%;
      }
    }
  }
  .product-params {
    display: flex;
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: 0;
    }
    &__label {
      color: #606266;
      flex: 100px 0;
    }
    &__value {
      flex: 350px 0;
    }
  }
  .property-box {
    border: 1px solid #e7eaec;
    padding: 10px;
    // width: 869px;
    .property-item {
      .name {
        background: rgba(0, 0, 0, 0.035);
        padding: 5px 10px;
        display: flex;
        position: relative;
        .delete-btn {
          padding: 8px;
          position: absolute;
          right: 10px;
          top: 50%;
          display: none;
          transform: translateY(-50%);
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
          .delete-btn {
            display: block;
          }
        }
      }
      .value {
        display: flex;
        align-items: baseline;
        padding: 10px;
        .label {
          width: 58px;
        }
        .col {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          .input {
            width: 100px;
            position: relative;
            overflow: hidden;
            margin-right: 10px;
            margin-bottom: 10px;
            i {
              position: absolute;
              top: 12px;
              right: -15px;
              font-size: 14px;
              color: #ff5433;
              transition: all 0.1s ease;
            }
            &:hover {
              i {
                right: 3px;
                cursor: pointer;
              }
            }
          }
        }
      }
      &:hover {
        border-color: #337ab7;
      }
    }
  }
  .property-table {
    border: 1px solid #e7eaec;
    margin-top: 20px;
    // width: 900px;
    border-spacing: 0;
    border-collapse: collapse;
    tr {
      th {
        padding: 5px 10px;
        text-align: center;
        border-left: 1px solid #e7eaec;
        background: #f6f6f6;
        .input-group {
          display: flex;
        }
      }
      td {
        padding: 5px 10px;
        border-top: 1px solid #e7eaec;
        text-align: center;
      }
      td.border-left {
        color: #666;
        border-left: 1px solid #e7eaec;
      }
    }
  }
}
</style>
