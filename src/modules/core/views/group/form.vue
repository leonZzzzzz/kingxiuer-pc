<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
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
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.name" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortNum">
        <el-input-number v-model="model.seqNum"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <!-- <QcProductPicker
      :visible="productPickerVisible"
      :module="module"
      @close="onQcProductPickerClose"
    />-->
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
    array:{
      type:Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      model: {
        name:'',
        seqNum:''
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
      console.log(this.array)
      if (val) {
        if (this.id) {
          this.getAttachment()
        }
      }
    }
  },
  methods: {
    pageAttachmentType() {
      this.$http.pageAttachmentType().then(res => {
        this.types = res.data.data
      })
    },
    getAttachment() {
      this.$http.examDetail({ id: this.id }).then(res => {
        this.model = res.data.data
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          // model.startTime = model.startTimeAndEndTime[0]
          // model.endTime = model.startTimeAndEndTime[1]
          this.array.name=model.name
          this.array.seqNum=model.seqNum
          let params={}
          if(this.id){
            params=this.array
          }else{
            params={name:model.name,seqNum:model.seqNum,type:5,parentId:0}
          }
          this.loading = true
          this.saveModel(this.id ? 'updateExam' : 'examClass', params)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateExam' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    },
    onQcProductPickerClose(row) {
      if (row) {
        this.model.skipLinks = row.id
        this.model.productName = row.name || row.title
        this.model.productIcon = row.cover || row.iconUrl
      }
      this.productPickerVisible = false
    }
  }
}
</script>
