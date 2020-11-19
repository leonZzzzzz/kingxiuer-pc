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
      <el-form-item label="小程序名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>

      <el-form-item label="appId" prop="appId" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.appId"></el-input>
      </el-form-item>
      <el-form-item label="跳转路径" prop="skipUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input v-model="model.skipUrl"></el-input>
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
    appId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    skipUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        name:'',
        appId:'',
        skipUrl:''
      },
      loading: false
    }
  },

  computed: {
    module() {
      return 'Mall'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.model.name=this.name
          this.model.appId=this.appId
          this.model.skipUrl=this.skipUrl
        }
      }
    }
  },
  methods: {
    
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          let params={}
          if(this.id){
            params={id:this.id,name:model.name,appId:model.appId,skipUrl:model.skipUrl}
          }else{
            params={name:model.name,appId:model.appId,skipUrl:model.skipUrl}
          }
          this.loading = true
          this.saveModel(this.id ? 'updateMiniProgram' : 'addMiniProgram', params)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateMiniProgram' ? '修改成功' : '添加成功',
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
