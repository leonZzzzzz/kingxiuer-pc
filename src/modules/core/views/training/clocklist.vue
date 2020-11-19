<template>
  <div>
    <QcTable ref="table" :option="userId?option:option1" :column="column" :search-form="searchForm"></QcTable>
    <Result :visible="visible" :id="memberId" :surveyId="surveyId" @onClose="onClose"></Result>
  </div>
</template>

<script>
import Result from './result'
import Utils from '@/utils/utils';
export default {
  components: { Result },
  data() {
    return {
      userId:'',
      visible: false,
      memberId: '',
      surveyId:'',
      option: {
        url: '/pc/clock/page.do?campId='+this.$route.query.campId+'&userId='+this.$route.query.userId
      },
      option1: {
        url: '/pc/clock/page.do?campId='+this.$route.query.campId
      },
      proglist:[],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.$router.push(`/main/training/user?id=${this.$route.query.campId}`)
          }
          // on: () => {
          //   this.visible = true
          //   this.updateId = this.$route.query.campId
          // }
        },
      ],
      searchForm: [
        {
          type: 'input',
          formName: 'nickName',
          label: '昵称',
          value: ''
        },
        {
          type: 'input',
          formName: 'mobile',
          label: '手机号',
          value: ''
        },
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '50px' },
        { prop: 'imgUrl',
          label: '头像',
          align: 'center',
          formatter: row => {
            return (
              <el-image src={row.imgUrl} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            )
          }
        },
        { label: '昵称', prop: 'nickName',},
        { label: '手机号', prop: 'mobile',},
        { label: '加入时间', prop: 'joinTime', width: '150px'},
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              row.isCollect?
                <block>
                  <el-button type="text"  onClick={this.onSelect.bind(this, row.userId)}>
                    查看问卷结果
                  </el-button>
                  <el-button type="text" onClick={this.deleteConfirm.bind(this, row)}>
                    删除
                  </el-button>
                </block>:
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row)}>
                  删除
                </el-button>
            )
          }
        }
      ]
    }
  },
  created() {
    this.userId=this.$route.query.userId
    console.log(this.$route.query.surveyId)
  },
  methods: {
    //查看问卷结果
    onSelect(id){
      this.visible=true
      this.memberId=id
      this.surveyId=this.$route.query.surveyId
      // this.$http.questResult({memberId:id,surveyId:this.$route.query.surveyId}).then((res) => {
        
      // })
    },
    //删除提示框
    deleteConfirm(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCamp({ campId:row.campId,userId:row.userId }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
    },
    onClose(flag) {
      console.log(flag)
      this.updateId = ''
      this.visible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
<style scoped>
.el-table .cell {
  /* width:200px; */
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

