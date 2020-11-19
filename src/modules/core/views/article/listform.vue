<template>
  <QcNavigationPage content="文章详情" :full="true">
    <div
      style="
        background: #fff;
        padding: 20px;
        display: flex;
        border-bottom: 1px solid #eee;
      "
    >
      <div class="text">
        <div class="label">发布人头像：</div>
        <el-image
          v-if="model.imgUrl"
          style="width: 50px; height: 50px"
          :src="model.imgUrl"
        ></el-image>
        <div v-else style="width: 50px; text-align: center">-</div>
      </div>
      <div class="text">
        <div class="label">发布人昵称：</div>
        {{ model.nickName }}
      </div>
      <div class="text">
        <div class="label">文章类型：</div>
        {{ model.type == "user" ? "用户文章" : "平台文章" }}
      </div>
      <div class="text">
        <div class="label">栏目名称：</div>
        {{ model.columnName }}
      </div>
    </div>
    <div
      style="
        background: #fff;
        padding: 20px;
        margin-top: 20px;
        border-bottom: 1px solid #eee;
      "
    >
      <div class="text">
        <div class="label">文章内容：</div>
        <div style="width: 770px; line-height: 25px; margin-top: -4px">
          {{ model.content }}
        </div>
      </div>
      <div class="text">
        <div class="label">图片：</div>
        <div style="width: 770px" v-if="model.attachments != ''">
          <el-image
            v-for="(img, index) in model.imagelist"
            style="width: 100px; height: 100px"
            :preview-src-list="model.imagelist"
            :src="img"
          ></el-image>
        </div>
        <div v-else>-</div>
      </div>
    </div>
    <div
      style="
        background: #fff;
        padding: 20px;
        margin-top: 20px;
        border-bottom: 1px solid #eee;
      "
    >
      <div class="text">
        <div class="label">点赞数：</div>
        <div style="width: 770px; line-height: 25px; margin-top: -4px">
          {{ model.praiseQuantity }}
        </div>
      </div>
      <div class="text" v-if="praiselist.length > 0">
        <div class="label">点赞人：</div>
        <div style="width: 770px; line-height: 25px; margin-top: -4px">
          <span v-if="praiselist.length > 1">
            <span v-for="val in praiselist">{{ val.memberName }}，</span>
          </span>
          <span v-else>
            <span v-for="val in praiselist">{{ val.memberName }}</span>
          </span>
        </div>
      </div>
      <!-- <div class="text" style="justify-content:space-between">
        <div class="label">管理员评论：</div>
        <div style="color:rgb(64, 158, 255)" @click="managerpunch()">管理员点评</div>
      </div>-->
    </div>
    <div style="background: #fff; padding: 20px; margin-top: 20px">
      <div class="common">评论</div>
      <div class="wrap" style="width: 925px">
        <el-tabs
          type="border-card"
          class="border"
          @tab-click="handleClick"
          v-model="activeName"
        >
          <el-tab-pane label="未审核" name="first">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5">
                  <td width="150" style="padding: 20px">昵称</td>
                  <td width="500" style>评论</td>
                  <td width="200" style="text-align: center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="commonlist.length > 0">
              <table
                cellpadding="10"
                cellspacing="0"
                class="table"
                v-for="(item, orderIndex) in commonlist"
                :key="orderIndex"
              >
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align: left; padding: 20px"
                    >
                      {{ item.nickName }}
                    </td>
                    <td width="500" style="padding: 20px 0">
                      {{ item.content }}
                    </td>
                    <td
                      class="bb1"
                      width="200"
                      style="
                        color: rgb(64, 158, 255);
                        cursor: pointer;
                        text-align: center;
                      "
                    >
                      <span
                        style="margin-right: 30px"
                        @click="passaudit(true, item)"
                        >通过</span
                      >
                      <span
                        style="margin-right: 30px"
                        @click="passaudit(false, item)"
                        >不通过</span
                      >
                      <span @click="deleterepay(false, item)">删除</span>
                    </td>
                  </tr>
                  <!-- 回复 -->
                  <div v-if="item.subComments.length > 0" class="common_repay">
                    <tr v-for="val in item.subComments">
                      <td
                        class="bb1"
                        width="150"
                        style="
                          text-align: left;
                          padding-bottom: 20px;
                          padding-left: 20px;
                        "
                      >
                        {{ val.nickName }}
                      </td>
                      <td width="500" style="padding-bottom: 20px">
                        {{ val.content }}
                      </td>
                      <td
                        class="bb1"
                        width="200"
                        style="
                          color: rgb(64, 158, 255);
                          cursor: pointer;
                          text-align: center;
                          padding-bottom: 20px;
                        "
                      >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(true, val)"
                          >通过</span
                        >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 2"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 3"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >通过</span
                        >
                        <span @click="deleterepay(false, val)">删除</span>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="
                padding: 60px;
                text-align: center;
                color: #717171;
                font-size: 14px;
              "
            >
              暂无数据
            </div>
          </el-tab-pane>
          <el-tab-pane label="已审核" name="second">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5">
                  <td width="150" style="padding: 20px">昵称</td>
                  <td width="500" style>评论</td>
                  <td width="200" style="text-align: center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="commonlist.length > 0">
              <table
                cellpadding="10"
                cellspacing="0"
                class="table"
                v-for="(item, orderIndex) in commonlist"
                :key="orderIndex"
              >
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align: left; padding: 20px"
                    >
                      {{ item.nickName }}
                    </td>
                    <td width="500" style="padding: 20px 0">
                      {{ item.content }}
                    </td>
                    <td
                      class="bb1"
                      width="200"
                      style="
                        color: rgb(64, 158, 255);
                        cursor: pointer;
                        text-align: center;
                      "
                    >
                      <span
                        style="margin-right: 30px"
                        @click="managerreply(true, item)"
                        >回复</span
                      >
                      <span
                        style="margin-right: 30px"
                        @click="passaudit(false, item)"
                        >不通过</span
                      >
                      <span @click="deleterepay(true, item)">删除</span>
                    </td>
                  </tr>
                  <div v-if="item.subComments.length > 0" class="common_repay">
                    <tr v-for="val in item.subComments">
                      <td
                        class="bb1"
                        width="150"
                        style="
                          text-align: left;
                          padding-bottom: 20px;
                          padding-left: 20px;
                        "
                      >
                        {{ val.nickName }}
                      </td>
                      <td width="500" style="padding-bottom: 20px">
                        {{ val.content }}
                      </td>
                      <td
                        class="bb1"
                        width="200"
                        style="
                          color: rgb(64, 158, 255);
                          cursor: pointer;
                          text-align: center;
                          padding-bottom: 20px;
                        "
                      >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(true, val)"
                          >通过</span
                        >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 2"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 3"
                          style="margin-right: 30px"
                          @click="passaudit(true, val)"
                          >通过</span
                        >
                        <span @click="deleterepay(false, val)">删除</span>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="
                padding: 60px;
                text-align: center;
                color: #717171;
                font-size: 14px;
              "
            >
              暂无数据
            </div>
          </el-tab-pane>
          <el-tab-pane label="审核不通过" name="third">
            <table cellpadding="0" cellspacing="0" class="theader">
              <tbody>
                <tr style="background: #ebeef5">
                  <td width="150" style="padding: 20px">昵称</td>
                  <td width="500" style>评论</td>
                  <td width="200" style="text-align: center">操作</td>
                </tr>
              </tbody>
            </table>
            <div v-if="commonlist.length > 0">
              <table
                cellpadding="10"
                cellspacing="0"
                class="table"
                v-for="(item, orderIndex) in commonlist"
                :key="orderIndex"
              >
                <tbody class="tbody_row">
                  <tr>
                    <td
                      class="bb1"
                      width="150"
                      style="text-align: left; padding: 20px"
                    >
                      {{ item.nickName }}
                    </td>
                    <td width="500" style="padding: 20px 0">
                      {{ item.content }}
                    </td>
                    <td
                      class="bb1"
                      width="200"
                      style="
                        color: rgb(64, 158, 255);
                        cursor: pointer;
                        text-align: center;
                      "
                    >
                      <span
                        style="margin-right: 30px"
                        @click="passaudit(true, item)"
                        >通过</span
                      >
                      <span @click="deleterepay(true, item)">删除</span>
                    </td>
                  </tr>
                  <div v-if="item.subComments.length > 0" class="common_repay">
                    <tr v-for="val in item.subComments">
                      <td
                        class="bb1"
                        width="150"
                        style="
                          text-align: left;
                          padding-bottom: 20px;
                          padding-left: 20px;
                        "
                      >
                        {{ val.nickName }}
                      </td>
                      <td width="500" style="padding-bottom: 20px">
                        {{ val.content }}
                      </td>
                      <td
                        class="bb1"
                        width="200"
                        style="
                          color: rgb(64, 158, 255);
                          cursor: pointer;
                          text-align: center;
                          padding-bottom: 20px;
                        "
                      >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(true, val)"
                          >通过</span
                        >
                        <span
                          v-if="val.auditStatus == 1"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 2"
                          style="margin-right: 30px"
                          @click="passaudit(false, val)"
                          >不通过</span
                        >
                        <span
                          v-if="val.auditStatus == 3"
                          style="margin-right: 30px"
                          @click="passaudit(true, val)"
                          >通过</span
                        >
                        <span @click="deleterepay(false, val)">删除</span>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
            <div
              v-else
              style="
                padding: 60px;
                text-align: center;
                color: #717171;
                font-size: 14px;
              "
            >
              暂无数据
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div
        style="color: rgb(64, 158, 255); margin-top: 20px"
        @click="managerpunch()"
      >
        管理员点评
      </div>
    </div>
    <Common :visible="visible" :id="updateId" @onClose="onClose"></Common>
    <Punch
      :visible="punch"
      :punchId="punchId"
      :reply="reply"
      :parentId="parentId"
      @punchClose="punchClose"
    ></Punch>
  </QcNavigationPage>
</template>

<script>
import Common from './common'
import Punch from './punch'
import Utils from '@/utils/utils';
export default {
  components: { Common,Punch },
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
    return {
      reload: this.reload                                              
    }
  },
  data() {
    return {
      activeName:'first',
      punch:false,
      punchId:'',
      parentId:'',
      reply:true,
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
      // searchForm:[
      //   { formName: '', value: ' ',newType:'' },
      // ],
      // menu: [
      //   {
      //     label: '添加',
      //     type: 'primary',
      //     on: () => {
      //       this.visible = true
      //     }
      //   }
      // ],
      
    }
  },
  created() {
    console.log(this.$route.params)
    this.getarticle()
    this.getPeason()
    this.getcomment(1)
  },
  methods: {
    reload(){
      this.isReloadData=false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    // 管理员回复
    managerreply(bloo,row){
      this.punch=true
      this.punchId=this.$route.query.id
      this.parentId=row.id
      this.reply=true
    },
    // 查看回复
    checkcommon(val){
      this.visible = true
    },
    // 获取详情
    getarticle(){
      this.$http.getarticle({ id:this.$route.query.id }).then((res) => {
        this.model=res.data.data
        this.model.imagelist=[]
        var imgs=this.model.attachments.split(',')
        imgs.forEach(item=>{
          item=this.imgHost+item
          this.model.imagelist.push(item)
        })
        // this.model.imagelist = this.model.attachments.split(',')
        // console.log(this.model)
        this.$refs.table.onSearchKeep()
      })
    },
    // 获取点赞人员
    getPeason(){
      this.$http.giveZan({sourceId:this.$route.query.id}).then((res)=>{
        this.praiselist=res.data.data.list
      })
    },
    handleClick(e){
      this.commonlist=[]
      var status = Number(e.index)+1
      this.status=status
      this.getcomment(status)
    },
    // 获取评论列表
    getcomment(status){
      // this.$http.commonArticle({sourceId:this.$route.query.id,auditStatus:status}).then((res)=>{
      this.$http.againSource({sourceId:this.$route.query.id,auditStatus:status}).then((res)=>{
        // console.log(res.data.data.list)
         this.commonlist = res.data.data.list
      })
    },
    // 审核通过/不通过
    passaudit(bollen,row){
      if(bollen){
        this.$http.commonpass({id:row.id}).then((res)=>{
          if(res.data.code==20000){
            // this.$refs.uploadfile.onSearchKeep()
            this.$message.success('审核成功')
            this.getcomment(this.status)
          }
        })
      }else{
        this.$http.discommonpass({id:row.id}).then((res)=>{
          if(res.data.code==20000){
            // this.$refs.uploadfile.onSearchKeep()
            this.$message.success('拒绝审核成功')
            this.getcomment(this.status)
          }
        })
      }
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
    // 管理员点评
    managerpunch(){
      this.punch=true
      this.punchId=this.$route.query.id
      
    },
    onClose(flag) {
      this.updateId = ''
      this.visible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    },
    punchClose(flag) {
      this.punchId = ''
      this.punch = false
      this.parentId=""
      this.activeName='second'
      this.getcomment(2)
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
<style>
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
