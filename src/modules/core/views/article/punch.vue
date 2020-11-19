<template>
  <el-dialog
    :title="parentId ? '管理员回复' : '管理员点评'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="hide"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="model"
      ref="model"
      label-width="100px"
      label-position="left"
      hide-required-asterisk
    >
      <el-input
        type="textarea"
        v-model="model.content"
        height="100px"
        maxlength="512"
      ></el-input>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide(false)">取 消</el-button>
      <el-button type="primary" @click="addreviews()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    reply: Boolean,

    punchId: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageurl:'http://kingsuer-1255600302.file.myqcloud.com',
      model: {
        content:'',
      },
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
        if (this.punchId) {
          this.model.content=''
          // this.getCommont()
        }
      }
    }
  },
  methods: {
    // 获取点评
    getCommont(){
      this.$http.managerSource({sourceId:this.punchId}).then(res => {
        console.log(res.data.data)
        if(!res.data.data){
          this.$message.error('您还没有点评')
        }
        this.model.content=res.data.data.content
        this.updateId=res.data.data.id
        this.update=true
      }).catch(err=>{
      })
    },
    // 新增
    addreviews() {
      var params = {}
      if(this.parentId){
        params = {sourceId:this.punchId,content:this.model.content,parentId:this.parentId}
      }else{
        params={sourceId:this.punchId,content:this.model.content}
      }
        this.$http.managerSource(params).then(res => {
          this.$message.success(this.parentId?"回复成功":'点评成功')
          this.hide(false)
        }).catch(err=>{
          this.$message.error(err.data.message)
        })
    },
   
    hide(flag) {
      console.log(flag)
      // this.model = this.$options.data().model
      // this.$nextTick(() => {
      //   this.$refs.model.clearValidate()
      // })
      this.$emit('punchClose', flag)
    }
  }
}
</script>
<style lang="scss" scoped>
.dianpin {
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 20px;
}
.dianpin > div {
  border-radius: 5px;
  width: 50px;
  background: #294a7b;
  padding: 10px;
  margin: 0 auto;
}
.result {
  .base-info {
    p {
      margin-top: 20px;
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
