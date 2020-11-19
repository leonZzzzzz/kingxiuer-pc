<template>
  <QcNavigationPage content="打卡详情" :full="true">
    <div>
      <div style="background:#fff;padding:20px;display:flex;border-bottom:1px solid #eee">
        <div class="text">
          <div class="label">头像：</div>
          <el-image v-if="model.imgUrl" style="width: 50px; height: 50px" :src="model.imgUrl"></el-image>
          <div v-else style="width:120px;text-align:center">-</div>
        </div>
        <div class="text">
          <div class="label">昵称：</div>
          {{model.nickName}}
        </div>

        <div class="text">
          <div class="label">打卡类型：</div>
          <span v-if="model.category=='diet'">饮食</span>
          <span v-if="model.category=='movement'">运动</span>
          <span v-if="model.category=='drink'">喝水</span>
          <span v-if="model.category=='temperature'">体温</span>
          <span v-if="model.category=='weight'">体重</span>
        </div>
        <div class="text">
          <div class="label">打卡时间：</div>
          {{model.clockTime}}
        </div>
      </div>
      <div style="background:#fff;padding:20px;margin-top:20px">
        <div class="text">
          <div class="label">打卡内容：</div>
          <div style="width:770px;line-height:25px;margin-top:-4px" v-if="model.category=='diet'">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5;width:770px;">
                  <td width="150" style="padding:20px;">食物类型</td>
                  <td width="300" style="text-align:center">食物名称</td>
                  <td width="200" style="text-align:center">食物数量（碗）</td>
                  <td width="200" style="text-align:center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="model.valuelist.length > 0">
              <table cellpadding="10" cellspacing="0" class="table">
                <tbody class="tbody_row">
                  <tr
                    style="width:770px;"
                    v-for="(item, orderIndex) in model.valuelist"
                    :key="orderIndex"
                  >
                    <td
                      width="500"
                      class="bb1"
                      style="text-align:left;padding:20px;"
                    >{{ item.foodType }}</td>
                    <td width="700" style="text-align:center;padding:20px;">{{item.food}}</td>
                    <td width="420" style="text-align:center;padding:20px;">{{item.consumption}}</td>
                    <td
                      :rowspan="model.valuelist.length"
                      class="bb1"
                      width="420"
                      v-if="orderIndex==0"
                      style="color: rgb(64, 158, 255);cursor: pointer;text-align:center;padding:20px; "
                    >
                      <span @click="passaudit(model.id)">点评</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
            >暂无数据</div>
          </div>
          <div
            style="width:770px;line-height:25px;margin-top:-4px"
            v-if="model.category=='movement'"
          >
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5;">
                  <td width="150" style="padding:20px;">运动项目</td>
                  <td width="300" style="text-align:center">运动时长（分钟）</td>
                  <td width="200" style="text-align:center">心率（次/分钟）</td>
                  <td width="200" style="text-align:center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="model.valuelist!=' '">
              <table cellpadding="10" cellspacing="0" class="table">
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align:left;padding:20px"
                    >{{ model.valuelist.project }}</td>
                    <td width="300" style="text-align:center">{{model.valuelist.exerciseTime}}</td>
                    <td width="200" style="text-align:center">{{model.valuelist.exerciseCentrality}}</td>
                    <td
                      class="bb1"
                      width="200"
                      style="color: rgb(64, 158, 255);cursor: pointer;text-align:center"
                    >
                      <span @click="passaudit(model.id)">点评</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
            >暂无数据</div>
          </div>
          <div
            style="width:770px;line-height:25px;margin-top:-4px"
            v-if="model.category=='temperature'"
          >
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5;">
                  <td width="150" style="padding:20px;">入睡时间</td>
                  <td width="300" style="text-align:center">起床时间</td>
                  <td width="200" style="text-align:center">备注</td>
                  <td width="200" style="text-align:center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="model.valuelist!=' '">
              <table cellpadding="10" cellspacing="0" class="table">
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align:left;padding:20px"
                    >{{ model.valuelist.sleepTime }}</td>
                    <td width="300" style="text-align:center">{{model.valuelist.wakeUpTime}}</td>
                    <td width="200" style="text-align:center">{{model.valuelist.remark}}</td>
                    <td
                      class="bb1"
                      width="200"
                      style="color: rgb(64, 158, 255);cursor: pointer;text-align:center"
                    >
                      <span @click="passaudit(model.id)">点评</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
            >暂无数据</div>
          </div>
          <div style="width:770px;line-height:25px;margin-top:-4px" v-if="model.category=='drink'">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5;">
                  <td width="150" style="padding:20px;">喝水量（ml）</td>
                  <td width="200" style="text-align:center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="model.valuelist!=' '">
              <table cellpadding="10" cellspacing="0" class="table">
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align:left;padding:20px"
                    >{{ model.valuelist.waterIntake }}</td>
                    <td
                      class="bb1"
                      width="200"
                      style="color: rgb(64, 158, 255);cursor: pointer;text-align:center"
                    >
                      <span @click="passaudit(model.id)">点评</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
            >暂无数据</div>
          </div>
          <div style="width:770px;line-height:25px;margin-top:-4px" v-if="model.category=='weight'">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5;">
                  <td width="150" style="padding:20px;">体重（kg）</td>
                  <td width="200" style="text-align:center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="model.valuelist!=' '">
              <table cellpadding="10" cellspacing="0" class="table">
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align:left;padding:20px"
                    >{{ model.valuelist.bodyWeight }}</td>
                    <td
                      class="bb1"
                      width="200"
                      style="color: rgb(64, 158, 255);cursor: pointer;text-align:center"
                    >
                      <span @click="passaudit(model.id)">点评</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
            >暂无数据</div>
          </div>
        </div>
        <div class="text">
          <div class="label">图片：</div>
          <div style="width:770px;" v-if="model.attachments!=''">
            <el-image
              v-for="(img,index) in model.imagelist"
              style="width: 100px; height: 100px"
              :preview-src-list="model.imagelist"
              :src="img"
            ></el-image>
          </div>
          <div v-else>-</div>
        </div>
        <div class="text">
          <div class="label">点评内容：</div>
          <div style="width:770px;" v-if="model.reviews.length>0">
            <div class="reviewclass" v-for="(text,i) in model.reviews">
              <div style="width:600px">{{i+1}}，{{text.reviews}}</div>
              <div class="reviewbtn">
                <span @click="updatereview(text)">修改</span>
                <span @click="deletereview(text)">删除</span>
              </div>
            </div>
          </div>
          <div v-else>-</div>
        </div>
      </div>

      <Form :visible="visible" :id="updateId" :reviews="reviews" @onClose="onClose"></Form>
    </div>
  </QcNavigationPage>
</template>

<script>
import Form from './form'
import Utils from '@/utils/utils';
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { Form },
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
    return {
      reload: this.reload                                              
    }
  },
  data() {
    return {
      reviews:'',
      showPreview: false,
      previewImages: [],
      isReloadData:true,
      imgHost:'http://kingsuer-1255600302.file.myqcloud.com',
      visible: false,
      updateId: '',
      model:{},
      commonlist:[],
      status:'1',
      option: {
        url: '/pc/carousel/page.do'
      },
      praiselist:[],

    }
  },
  created() {
    this.getarticle()
  },
  methods: {
    closeViewer() {
      this.showPreview = false;
    },
    reload(){
      this.isReloadData=false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    // 获取详情
    getarticle(){
      this.$http.punchDetail({ id:this.$route.query.id }).then((res) => {
        this.model=res.data.data
        this.model.imagelist=[]
        var imgs=this.model.attachments.split(',')
        imgs.forEach(item=>{
          item=this.imgHost+item
          this.model.imagelist.push(item)
        })
        this.model.valuelist = JSON.parse(res.data.data.value)
        console.log(this.model)
        // console.log(this.model)
        // this.$refs.table.onSearchKeep()
      })
    },
    // 点评
    passaudit(id){
      console.log(id)
      this.updateId = id
      this.reviews = ''
      this.visible=true
    },
    // 修改点评
    updatereview(view){
      this.updateId = view.id
      this.reviews = view.reviews
      this.visible=true
    },
    // 删除点评
    deletereview(view){
       this.$confirm('是否删除该点评?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteComment({id:view.id}).then((res)=>{
            this.$message.success('删除成功')
            this.getarticle()
          })
        })
        .catch(() => {
          return
        })
      
    },
   
    handleClick(e){
      this.commonlist=[]
      var status = Number(e.index)+1
      this.status=status
      this.getcomment(status)
    },
   
   
    //删除提示框
    deleterepay(boolen,row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCommon({ id :row.id}).then(() => {
            // this.$refs.uploadfile.onSearchKeep()
            this.$message.success('删除成功')
            if(this.status){
              this.getcomment(this.status)
            }else{
              this.getcomment(1)
            }
            
          })
        })
        .catch(() => {
          return
        })
    },
    onClose(flag) {
      this.updateId = ''
      this.visible = false
      if (typeof flag == 'boolean' && flag) {
        this.getarticle()
      }
    }
  }
}
</script>
<style>
.reviewclass {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.reviewbtn > span {
  color: rgb(64, 158, 255);
  margin-left: 20px;
}
.text {
  margin: 15px;
  display: flex;
  font-size: 16px;
}
.el-image {
  margin-left: 10px;
}
.common {
  padding: 10px 0;
  /* border-top: 1px solid #eee; */
  /* margin-top: 20px; */
}
.label {
  width: 100px;
  text-align: right;
}
.tbody_row {
  display: inline-block;
  border-bottom: 1px solid #eee;
}
.common_repay {
  width: 870px;
  margin-left: 20px;
  background: #eee;
  padding-top: 20px;
  margin-bottom: 20px;
}
</style>
