<template>
  <!-- :title="id ? '修改' : '添加'" -->
  <el-dialog
    :title="'添加'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <QcTable :column="column" :search-form="searchForm"></QcTable>
  </el-dialog>
</template>

<script>
// import QcProductPicker from '@/components/common/product-picker/Index'
export default {
  // components: {
  //   QcProductPicker
  // },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    datalist:{
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      proglist:[],
      model: {
        type:'platform',
        columnId:'',
        content:'',
        sortNum: '1'
      },
      productPickerVisible: false,
      loading: false,
      rollingImgUrl:[],
       searchForm: [
        { label: '用户名', formName: 'memberName', type: 'input'},
        { label: '电话', formName: 'memberMobile', type: 'input'},
      ],
      column: [
        {
          label: '序号',
          type:'index',
          align: 'center',
        },
        {
          label: '用户名',
          width: '150px',
          prop: 'nickName'
        },
        {
          label: '联系人电话',
          width: '200px',
          prop: 'mobile'
        },
        {
          label: '操作',
          formatter: row => {
            return (
              <el-button type="primary" size="mini" onClick={this.onSelect.bind(this, row)}>
                使用
              </el-button>
            )
          }
        },
        //console.log('row',row);
      ]
    }
  },
  created() {
    console.log(this.datalist)
    this.programa()
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
          this.getCarousel()
        }
      }
    }
  },
  methods: {
    onChangeType(e) {
      console.log(e)
      e=='false'?this.model.skip==false:this.model.skip==true
      // this.model.skipLinks = ''
      // this.model.productIcon = ''
      // this.model.productName = ''
    },
    pageAttachmentType() {
      this.$http.pageAttachmentType().then(res => {
        this.types = res.data.data
      })
    },
    // 获取栏目
    programa() {
      console.log(this.datalist)
      this.$http.listAttachment().then(res => {
        this.proglist = res.data.data.list
      })
    },
    // 获取栏目id
    getprogam(e){
      console.log(e)
      this.proglist.forEach(item=>{
        if(item.name==e){
          this.model.columnId=item.id
        }
      })
    },
    getCarousel() {
      this.$http.getCarousel({ id: this.id }).then(res => {
        this.model = res.data.data
        // this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    onImgListSuccess(e) {
      console.log(e)
      if (this.rollingImgUrl.length < 9) {
        this.rollingImgUrl.push(e)
      }
    },
    onImgListDelete(index) {
      this.rollingImgUrl.splice(index, 1)
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.attachments=this.rollingImgUrl.toString()
          // model.startTime = model.startTimeAndEndTime[0]
          // model.endTime = model.startTimeAndEndTime[1]
          this.loading = true
          this.saveModel('addarticle', model)
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
<style>
.img-box {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
.img-box .item {
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  border-image: initial;
  overflow: hidden;
  margin: 0px 6px 6px 0px;
}
.img-box .item img {
  width: 100%;
}
.img-box .item .el-icon-error {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  color: rgb(197, 197, 197);
}
</style>