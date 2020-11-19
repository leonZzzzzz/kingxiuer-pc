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
      <el-form-item label="图片" prop="imgUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <QcImageUpload
          :body="{imageType:'attachment'}"
          width="100px"
          height="100px"
          v-model="model.imgUrl"
        ></QcImageUpload>
        <p>建议尺寸750 * 300，大小不超过3M</p>
      </el-form-item>
      <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-select v-model="model.type" style="width:100%;" @change="onChangeType">
          <el-option v-for="item in types" :key="item.index" :label="item.name" :value="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="关联内容"
        prop="articleId"
        :rules="[{ required: true, message: '该字段不能为空'}]"
        v-if="model.type !=='noSkip'"
      >
        <!-- <el-input v-model="model.articleId" v-if="model.skip === 'linkurl'"></el-input> -->
        <el-select
          v-if="model.type==='program'"
          v-model="model.articleId"
          placeholder="请关联小程序"
          style="width:150px;margin-bottom:10px;"
        >
          <el-option :label="pro.name" :value="pro.id" v-for="(pro, i) in programlist" :key="i"></el-option>
        </el-select>
        <div v-if="model.type==='graphic'">
          <QcProductItem
            v-if="model.articleId&&model.content"
            :img="imgHost+model.iconUrl"
            :title="model.content"
          ></QcProductItem>
          <el-button style="margin-top:10px" @click="productPickerVisible = true" size="mini">关联图文</el-button>
        </div>
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
      <el-form-item label="排序" prop="sortNum" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input-number v-model="model.sortNum"></el-input-number>
      </el-form-item>
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
    }
  },
  data() {
    return {
      model: {
        imgUrl: '',
        type:'noSkip',
        articleId:'',
        // skipLinks: '',
        // productIcon: '',
        // productName: '',
        // startTime: '',
        // endTime: '',
        // startTimeAndEndTime: '',
        sortNum: ''
      },
      productPickerVisible: false,
      types: [
        {
          index: 'graphic',
          name: '图文'
        },
        {
          index: 'program',
          name: '小程序'
        },
        {
          index: 'noSkip',
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
      this.getProgram()
      if (val) {
        if (this.id) {
          this.getCarousel()
        }
      }
    }
  },
  methods: {
    onChangeType(e) {
      this.model.articleId=''
      // this.model.skipLinks = ''
      // this.model.productIcon = ''
      // this.model.productName = ''
    },
        // 获取小程序列表
    getProgram(){
      this.$http.MiniProgramList().then((res) => {
        this.programlist=res.data.data.list
      })
    },
    pageAttachmentType() {
      this.$http.pageAttachmentType().then(res => {
        this.types = res.data.data
      })
    },
    getCarousel() {
      this.$http.getCarousel({ id: this.id }).then(res => {
        this.model = res.data.data
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    success() {
      if(this.model.type=='graphic'&&!this.model.content){
        this.$message.error('请选择关联内容')
        return
      }
      if(this.model.type=='program'&&!this.model.articleId){
        this.$message.error('请选择关联内容')
        return
      }
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          // model.startTime = model.startTimeAndEndTime[0]
          // model.endTime = model.startTimeAndEndTime[1]
          // let params={}
          // if(this.id){
          //   params={id:model.id,imgUrl:model.imgUrl,skip:model.skip,sortNum:model.sortNum,articleId:model.articleId}
          // }else{
          //   params={imgUrl:model.imgUrl,skip:model.skip,sortNum:model.sortNum,articleId:model.articleId}
          // }
          
          this.loading = true
          this.saveModel(this.id ? 'updateCarousel' : 'addCarousel', model)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateCarousel' ? '修改成功' : '添加成功',
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
