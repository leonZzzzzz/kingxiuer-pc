<template>
  <el-dialog
    :title="'点评'"
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
      <el-input type="textarea" v-model="model.reviews" height="100px"></el-input>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <QcProductPicker
      :visible="productPickerVisible"
      :module="module"
      @close="onQcProductPickerClose"
    />
  </el-dialog>
</template>

<script>
import QcProductPicker from '@/components/common/product-picker/Index'
export default {
  components: {
    QcProductPicker
  },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    reviews: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        reviews: '',
        
      },
      productPickerVisible: false,
      types: [
        {
          index: true,
          name: '图文'
        },
        {
          index: false,
          name: '不跳转'
        }
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
      console.log(this.id)
      if (val) {
        if (this.id) {
          this.model.reviews=this.reviews
          // this.getCarousel()
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

    getCarousel() {
      this.$http.getCarousel({ id: this.id }).then(res => {
        this.model = res.data.data
        console.log(this.model)
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    success() {
      if(!this.model.reviews){
        this.$message.error('请输入内容')
        return
      }
      if(!this.reviews){
        this.$http.punchComment({clockId:this.id,reviews:this.model.reviews}).then((res)=>{
          if(res.data.code==20000){
              this.$message.success('点评成功')
              this.close(true)
            }
        })
      }else{
        this.$http.updateComment({id:this.id,reviews:this.model.reviews}).then((res)=>{
          if(res.data.code==20000){
              this.$message.success('修改点评成功')
              this.close(true)
            }
        })
      }
      
    },

    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    },

  }
}
</script>
