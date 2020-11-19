<template>
  <QcNavigationPage content="添加成员" class="prodocu-page">
    <!-- <el-dialog :visible="visible" title="店铺选择" :before-close="onClose" width="950px"> -->
    <QcTable :option="option" :column="column" :search-form="searchForm"></QcTable>
    <!-- </el-dialog> -->
  </QcNavigationPage>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option: {
        isFull: false,
        height: 750,
        url: '/pc/users/getPage.do'
      },
      model:{
        nickName:'',
        mobile:''
      },
      searchForm: [
        { label: '昵称', formName: 'nickName', type: 'input'},
        { label: '电话', formName: 'mobile', type: 'input'},
        { label: 'ID', formName: 'number', type: 'input'},
      ],
      column: [
        {
          label: '序号',
          type:'index',
          align: 'center',
        },
        { prop: 'imgUrl',
          label: '头像',
          align: 'center',
          formatter: row => {
            return (
              row.imgUrl?
              <el-image src={row.imgUrl} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>:<div style="width:150px;text-align:center">-</div>
            )
          }
        },
        {
          label: 'ID',
          width: '200px',
          prop: 'number'
        },
        {
          label: '昵称',
          width: '200px',
          prop: 'nickName'
        },
        {
          label: '手机号',
          width: '150px',
          prop: 'mobile'
        },
        {
          label: '操作',
          formatter: row => {
            return (
              <el-button type="primary" size="mini" onClick={this.onuser.bind(this, row.id)}>
                使用
              </el-button>
            )
          }
        },
      ]
    }
  },
  created() {
  },
  methods: {
    onuser(id) {
      // this.$emit('onSelect', row)
       this.$http.addCamp({userId:id,campId:this.$route.query.id}).then((res) => {
         console.log(res)
          this.$message.success('添加成功')
          this.$router.go(-1)
      })
      .catch(err => {
        console.log(err)
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
  }
}
</script>
