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
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <QcImageUpload
          :body="{imageType:'attachment'}"
          width="100px"
          height="100px"
          v-model="model.iconUrl"
        ></QcImageUpload>
        <p>建议尺寸220 * 220，大小不超过3M</p>
      </el-form-item>

      <!-- <el-form-item
        label="有效期"
        prop="startTimeAndEndTime"
        :rules="[{ required: true, message: '该字段不能为空'}]"
      >
        <el-date-picker
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="model.startTimeAndEndTime"
        ></el-date-picker>
      </el-form-item>-->
      <el-form-item label="排序">
        <el-input-number v-model="model.sortNum"></el-input-number>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-switch
          class="elswitch"
          @change="changetree"
          active-value="open"
          inactive-value="close"
          v-model="model.isShow"
        ></el-switch>
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
    }
  },
  data() {
    return {
      model: {
        name:'',
        iconUrl: '',
        sortNum: '',
        parentId:0,
        type:0,
        isHasChild:0,
        isShow:'open'
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
      if (val) {
        if (this.id) {
          this.getAttachment()
        }
      }
    }
  },
  methods: {
    // 是否显示
    changetree(e){
      this.model.isShow=e
    },
    pageAttachmentType() {
      this.$http.pageAttachmentType().then(res => {
        this.types = res.data.data
      })
    },
    getAttachment() {
      this.$http.getAttachment({ id: this.id }).then(res => {
        this.model = res.data.data
        if(this.model.isShow){
          this.model.isShow='open'
        }else{
          this.model.isShow='close'
        }
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          // model.startTime = model.startTimeAndEndTime[0]
          // model.endTime = model.startTimeAndEndTime[1]
          let params={}
          if(this.id){
            params={id:model.id,name:model.name,iconUrl: model.iconUrl,sortNum: model.sortNum,parentId:0,type:0,isHasChild:0,isShow:model.isShow=='open'?true:false}
          }else{
            params={name:model.name,iconUrl: model.iconUrl,sortNum: model.sortNum,parentId:0,type:0,isHasChild:0,isShow:model.isShow=='open'?true:false}
          }
          this.loading = true
          this.saveModel(this.id ? 'updateAttachment' : 'addAttachment', params)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateAttachment' ? '修改成功' : '添加成功',
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
