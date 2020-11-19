<template>
  <div style="background:#fff;padding:20px">
    <el-form :model="imgModel" ref="model" label-position="left" label-width="140px">
      <el-tabs type="border-card" class="border" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="首页顶部内容配置" name="first">
          <div>
            <el-form-item
              v-for="(item, key) in settingList"
              :key="key"
              :label="item.name"
              :prop="item.key"
              :rules="[{ required: true, message: '请上传' }]"
            >
              <div style="display: flex;">
                <QcImageUpload
                  width="100px"
                  height="100px"
                  :body="{ imageType: 'setting' }"
                  v-model="item.value"
                ></QcImageUpload>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-left: 15px;"
                  @click="saveConfigItem(item)"
                >保存</el-button>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="首页中间内容配置" name="second">
          <div>
            <el-form-item
              v-for="(item, key) in settingList"
              :key="key"
              :label="item.name"
              style="border-bottom: 1px solid #eee;padding-bottom: 20px;"
            >
              <QcImageUpload
                width="100px"
                height="100px"
                :body="{ imageType: 'setting' }"
                v-model="item.value"
              ></QcImageUpload>

              <div style="font-size:14px;color:#999" v-if="item.key=='home_jump'">建议尺寸：700*155</div>
              <div style="font-size:14px;color:#999" v-else>建议尺寸：710*110</div>
              <el-select
                v-model="item.showType"
                @change="currentSel(item)"
                style="width:350px;margin-bottom:10px"
              >
                <el-option
                  v-for="(rel, i) in relevance"
                  :key="i"
                  :label="rel.name"
                  :value="rel.type"
                ></el-option>
              </el-select>
              <div v-if="item.showType=='1'">
                <QcImageUpload
                  width="100px"
                  height="100px"
                  :body="{ imageType: 'setting' }"
                  v-model="item.showValue"
                ></QcImageUpload>
              </div>
              <div v-if="item.showType=='2'">
                <el-input
                  v-if="item.content"
                  v-model="item.content"
                  style="width:350px;display:block"
                ></el-input>
                <el-button style="margin-top:10px" @click="releGraph(item)" size="mini">关联图文</el-button>
              </div>
              <div v-if="item.showType=='3'" style="dispaly:flex">
                <el-select
                  v-model="item.showValue"
                  placeholder="请关联小程序"
                  style="width:150px;margin-bottom:10px;"
                >
                  <el-option
                    :label="pro.name"
                    :value="pro.id"
                    v-for="(pro, i) in programlist"
                    :key="i"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-top:10px;margin-left: 15px;background:#294A7B;color:#fff"
                  @click="saveConfigItem(item)"
                >保存</el-button>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-top:10px;margin-left: 15px;background:#294A7B;color:#fff"
                  @click="reset(item)"
                >重置</el-button>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="说明配置" name="third">
          <div>
            <el-form-item v-for="(item, key) in settingList" :key="key" :label="item.name">
              <div style="display: flex;">
                <QcImageUpload
                  width="100px"
                  height="100px"
                  :body="{ imageType: 'setting' }"
                  v-model="item.value"
                ></QcImageUpload>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-left: 15px;"
                  @click="saveConfigItem(item)"
                >保存</el-button>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="二维码配置" name="fourth">
          <div>
            <el-form-item v-for="(item, key) in settingList" :key="key" :label="item.name">
              <div style="display: flex;">
                <QcImageUpload
                  width="100px"
                  height="100px"
                  :body="{ imageType: 'setting' }"
                  v-model="item.value"
                ></QcImageUpload>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-left: 15px;"
                  @click="saveConfigItem(item)"
                >保存</el-button>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="许愿树开关" name="fifth">
          <div class="switch">
            <span>是否开启许愿树功能</span>
            <el-switch
              class="elswitch"
              @change="changetree"
              active-value="open"
              inactive-value="close"
              v-model="choose.value"
            ></el-switch>
          </div>
        </el-tab-pane>
        <el-tab-pane label="推荐购买" name="sixth">
          <div>
            <el-form-item v-for="(item, key) in settingList" :key="key" :label="item.name">
              <div style="display: flex;">
                <el-select
                  v-model="item.showValue"
                  placeholder="请关联小程序"
                  style="width:150px;margin-bottom:10px;"
                >
                  <el-option
                    :label="pro.name"
                    :value="pro.id"
                    v-for="(pro, i) in programlist"
                    :key="i"
                  ></el-option>
                </el-select>
                <div style="margin-left:20px">
                  <span>是否显示</span>
                  <el-switch
                    style="margin-left:10px"
                    @change="changeBuy($event,item)"
                    v-model="item.isShow"
                  ></el-switch>
                </div>
                <el-button
                  :loading="item.loading"
                  size="small"
                  style="height: 30px;margin-left: 15px;"
                  @click="recommendBuy(item)"
                >保存</el-button>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <QcProductPicker
      :visible="productPickerVisible"
      :module="module"
      @close="onQcProductPickerClose"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import QcProductPicker from '@/components/common/product-picker/Index'
export default {
  components: {
    QcProductPicker
  },
  data() {
    return {
      types: [
        {
          index: 1,
          name: '图文'
        },
        {
          index: 2,
          name: '不跳转'
        }
      ],
      productPickerVisible: false,
      model:{},
      programlist:[],
      activeName:'first',
      imgModel: {},
      choose:{},
      dialogImageUrl: '',
      dialogVisible: false,
      toplist:{},
      centerlist:{},
      bottomlist:{},
      shuominglist:{},
      erweimalist:{},
      top:[
        'calendar_map',
        "security_period",
        "ovulation_phase",
        "follicular_phase",
        "menstrual_period",
      ],
      center:[
        "bottom_security_period",
        "bottom_menstrual_period",
        "bottom_follicular_phase",
        "bottom_ovulation_phase",
        "home_jump"
        // "security_period_value",
        // "menstrual_period_value",
        // "ovulation_phase_value",
        // "follicular_phase_value",
      ],
      // bottom:[
      //   "home_jump",
      //   // "home_jump_value",
      // ],
      shuoming:[
        'tweets_temperature', 
        'tweets_ovulate', 
        'tweets_pregnancy',
      ],
      erweima:[
        'qr_code_clinic', 
        'qr_code_staff', 
        'qr_code_pop_ups', 
      ],
      relevance:[
        {name:'请选择关联内容',type:0},
        {name:'图片',type:1},
        {name:'图文',type:2},
        {name:'小程序',type:3},
      ],
      key:'',
      settingList:[]
    }
  },


  computed: {
    module() {
      return 'Mall'
    }
  },
  created() {
    this.getSetting('calendar_article')
    // this.getConfigList()
    // this.getConfig('wishing_tree_switch')
    this.getProgram()
  },
  methods: {
    // 获取配置列表
    getSetting(parentId){
      this.$http.get('/pc/ksConfig/listByParent.do', {parentId}).then(res => {
        if(parentId=='wishing_tree_switch'){
          this.choose = res.data.data[0]
        }else{
          this.settingList=res.data.data
        }
      })
    },

    // 获取小程序列表
    getProgram(){
      this.$http.MiniProgramList().then((res) => {
        this.programlist=res.data.data.list
      })
    },
    // 切换tab
    handleClick(e){
      var type=''
      if(e.index==0){
        type='calendar_article'
      }else if(e.index==1){
        type='bottom_calendar_article'
      }else if(e.index==2){
        type='tweets'
      }else if(e.index==3){
        type='qr_code'
      }else if(e.index==4){
        type='wishing_tree_switch'
      }else if(e.index==5){
        type='recommend_buy'
      }
      this.settingList=[]
      this.getSetting(type)
    },
    // 推荐购买保存
    recommendBuy(row){
      row.showType='3'
      this.saveConfigItem(row)
    },
    // 获取图片
    onImgListSuccess(e) {
      if (this.rollingImgUrl.length < 9) {
        this.rollingImgUrl.push(e)
      }
    },
    currentSel(row){
      this.settingList.forEach(item=>{
        if(item.key==row.key){
          item.showValue=''
          item.content=''
        }
      })
    },
    changeBuy(e,item){
      // var isShoe = e=='open'?true:false
      // console.log(isShoe)
      // item.isShow=isShoe
      // this.settingList[item.seqNum]=item
      console.log(this.settingList)
    },
     // 许愿树开关
    changetree(e){
      console.log(e)
      this.choose.value=e
      this.saveConfigItem(this.choose)
    },
    releGraph(row){
      console.log(row)
      this.key=row.key
      this.productPickerVisible = true
    },
    // 重置
    reset(row){
      if(row.key=='home_jump'){
        row.value=''
      }
      row.content = '',
      row.showValue='',
      row.showType=0
      this.$http.json('/api/admin/v1/config/update', row).then(res => {
        // item.loading = false
        if (res.data.data === 1) {
          this.$message.success('保存成功')
          this.getProgram()
          this.activeName='second'
        }else{
           this.$message.error('保存失败')
        }
      })
      .catch(function (error) {
        // item.loading = false
      });
    },
    getConfigList() {
      let keyList = [
        'tweets_temperature', //
        'tweets_ovulate', //
        'tweets_pregnancy',// 
        'menstrual_period',//
        'qr_code_clinic', //
        'qr_code_staff', //
        'qr_code_pop_ups', //
        'calendar_map',//
        'security_period',//
        'ovulation_phase',//
        'follicular_phase',//
        "home_jump",//
        "home_jump_value",//

        "bottom_security_period",//
        "bottom_menstrual_period",//
        "bottom_follicular_phase",//
        "bottom_ovulation_phase",//
        "security_period_value",//
        "menstrual_period_value",//
        "ovulation_phase_value",//
        "follicular_phase_value",//
      ]
      // this.imgModel=[]
      this.$http.get('/api/admin/v1/config/list').then(res => {
        res.data.data.forEach(item => {
          // keyList.forEach(val=>{
          //   if(item.key==val){
          //     this.imgModel.push(item)
          //   }
          // })
          if (keyList.indexOf(item.key) != -1) {
            item.loading = false
            this.$set(this.imgModel, item.key, item)
          }
        })
        console.log(this.imgModel)
        this.top.forEach(item=>{
          for(var key in this.imgModel){　　//遍历对象的所有属性，包括原型链上的所有属性
            if(this.imgModel.hasOwnProperty(key)){
              if(key==item){
                this.$set(this.toplist, key, this.imgModel[key])
              }
            }
          }
        })
        this.center.forEach(item=>{
          for(var key in this.imgModel){　　//遍历对象的所有属性，包括原型链上的所有属性
            if(this.imgModel.hasOwnProperty(key)){
              if(key==item){
                this.$set(this.centerlist, key, this.imgModel[key])
              }
            }
          }
        })
        this.shuoming.forEach(item=>{
          for(var key in this.imgModel){　　//遍历对象的所有属性，包括原型链上的所有属性
            if(this.imgModel.hasOwnProperty(key)){
              if(key==item){
                this.$set(this.shuominglist, key, this.imgModel[key])
              }
            }
          }
        })
        this.erweima.forEach(item=>{
          for(var key in this.imgModel){　　//遍历对象的所有属性，包括原型链上的所有属性
            if(this.imgModel.hasOwnProperty(key)){
              if(key==item){
                this.$set(this.erweimalist, key, this.imgModel[key])
              }
            }
          }
        })
      })
    },
    // 根据key获取指定配置
    getConfig(key) {
      this.$http.get(`/api/admin/v1/config/${key}`).then(res => {
          if(res.data.code==20000){
            this.choose=res.data.data
            
          }
      })
    },
    saveConfigItem(item) {
      // if(!value){
      //   this.$message.error('请上传底图')
      //   return
      // }
      if(item.showType==1&&!item.showValue){
         this.$message.error('请上传关联图片后再保存')
         return
      }
      if(item.showType==2&&!item.showValue){
         this.$message.error('请选择关联图文后再保存')
         return
      }
      if(item.showType==3&&!item.showValue){
         this.$message.error('请选择关联小程序后再保存')
         return
      }
      item.loading = true
      this.$http.json('/api/admin/v1/config/update', item).then(res => {
        item.loading = false
        if (res.data.data === 1) {
          this.$message.success('保存成功')
          this.getProgram()
          // this.activeName='second'
        }else{
           this.$message.error('保存失败')
        }
      })
      .catch(function (error) {
        item.loading = false
      });
    },
    // 获取选中文章的id
    onQcProductPickerClose(row) {
      this.productPickerVisible = false
      if(row){
        this.settingList.forEach(item=>{
          if(this.key==item.key){
            item.showValue=row.id
            item.content=row.title
          }
        })
      }
    },
    
  }
}
</script>
<style>
.switch {
  margin: 20px 0;
}
.elswitch {
  margin-left: 200px;
}
.el-image {
  width: 100px;
  height: 100px;
}
</style>

