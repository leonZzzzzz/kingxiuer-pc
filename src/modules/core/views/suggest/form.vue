<template>
  <el-dialog
    :title="'修改'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
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
      <el-form-item label="类型" prop="suggestType" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.suggestType" style="width:100%;"></el-input>
      </el-form-item>

      <el-form-item label="建议" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.content"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    punchtype: {
      type: String,
      default: ''
    },
    punchcontent: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      model: {
        id:'',
        content:'',
        suggestType:'',
      },
      types: [
        { value: 'movement', label: '运动' },
        { value: 'diet', label: '饮食' },
        { value: 'drink', label: '喝水' },
        { value: 'temperature', label: '体温' },
        { value: 'weight', label: '体重' },
      ],
      loading: false
    }
  },
  // created() {
  //   this.pageAttachmentType()
  // },
  computed: {
    module() {
      console.log()
      return 'Mall'
    }
  },
  watch: {
    visible(val) {
      console.log(val)
      if (val) {
        if (this.id) {
          this.getCarousel()
        }
      }
    }
  },
  methods: {
    onChangeType(e) {
      console.log(e)
      // this.model.skipLinks = ''
      // this.model.productIcon = ''
      // this.model.productName = ''
    },
    pageAttachmentType() {
      this.$http.pageAttachmentType().then(res => {
        this.types = res.data.data
      })
    },
    getCarousel() {
      this.model.id=this.id
      this.model.content=this.punchcontent
      this.types.forEach(item=>{
        if(this.punchtype==item.value){
          this.model.suggestType=item.label
        }
      })
    },
    success() {
      let params={id:this.model.id,content:this.model.content}
      this.$http.updataSettingSuggest(params).then(res => {
        this.$message.success('修改成功')
      }).catch(err=>{
        this.$message.error(err.data.message)
      })
     
    },
    
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    },
    // 获取选中文章的id
    onQcProductPickerClose(row) {
      console.log(row)
      if (row) {
        this.model.articleId = row.id
        this.model.content = row.title 
      }
      this.productPickerVisible = false
    }
  }
}
</script>
