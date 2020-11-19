<template>
  <div>
    <QcTable
      ref="table"
      :option="option"
      :menu="menu"
      :column="column"
      :search-form="searchForm"
      @get-list="onGetList"
    ></QcTable>
  </div>
</template>

<script>
import Utils from '@/utils/utils';
export default {
  data() {
    return {
      commonlist:[],
      visible: false,
      updateId: '',
      option: {
        url: '/api/admin/v1/comment/page'
      },
      searchForm:[
        {
          type: 'input',
          formName: 'name',
          label: '用户名',
          value: ''
        },
        {
          type: 'input',
          formName: 'content',
          label: '评论内容',
          value: ''
        },
        {
          type: 'select',
          formName: 'auditStatus',
          label: '状态',
          option: [
            { value: '', label: '全部' },
            { value: '1', label: '待审核' },
            { value: '2', label: '已审核' },
            { value: '3', label: '审核不通过' }
          ],
          value: ''
        },
        {
          label: '创建时间',
          formName: 'startCreateTime_endCreateTime',
          type: 'date-picker',
          el: {
            type: 'datetimerange',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ],
      menu: [
        // {
        //   label: '添加',
        //   type: 'primary',
        //   on: () => {
        //     this.visible = true
        //   }
        // }
      ],
      column: [
        {type: 'index', label: '序号', align: 'center', width: '50px' },
        
        {
          prop: 'memberHeadImage',
          label: '头像',
          width: '120px',
          align: 'center',
          formatter: row => {
            return (
              row.memberHeadImage?
              <el-image src={row.memberHeadImage} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>:<div style="width:120px;text-align:center">-</div>
            )
          }
        },
        { label: '用户昵称', prop: 'nickName',align: 'center',width: '150px', },
        { label: '评论内容', prop: 'content', width: '600px' },
        // { label: '排序号', prop: 'sortNum', align: 'center' },
        {
          label: '状态',
          width: '130px',
          prop: 'auditStatus',
          formatter: row => {
            return { 1: '未审核', 2: '已审核',3:'审核不通过'}[row.auditStatus]
          }
        },
        { label: '创建时间', prop: 'createTime', width: '200px',align: 'center'},
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              row.auditStatus==1?
              <div>
                
                <el-button type="text" onClick={this.passaudit.bind(this,true, row.id)}>
                  通过
                </el-button>
                <el-button type="text" onClick={this.passaudit.bind(this, false,row.id)}>
                  不通过
                </el-button>
                <el-button type="text" onClick={this.GoArticleDetail.bind(this, row.sourceId)}>
                  查看文章详情
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>:
              <div>
                <el-button type="text" onClick={this.GoArticleDetail.bind(this, row.sourceId)}>
                  查看文章详情
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
              
            )
          }
        }
      ]
    }
  },
  methods: {
    onGetList(list) {
      console.log('jjjjj',list)
      this.commonlist = list
    },
    // 去到文章详情
    GoArticleDetail(id){
      this.$router.push({ path:'/main/article/listform',query:{id:id}})
    },
    // 审核通过/不通过
    passaudit(bollen,id){
      if(bollen){
        this.$http.commonpass({id:id}).then((res)=>{
          if(res.data.code==20000){
            this.$message.success('审核成功')
            this.$refs.table.onSearchKeep()
          }
        })
      }else{
        this.$http.discommonpass({id:id}).then((res)=>{
          if(res.data.code==20000){
            this.$message.success('拒绝审核成功')
            this.$refs.table.onSearchKeep()
          }
        })
      }
      
    },
    handleClick(e){
      console.log(e.index)
      this.commonlist=[]
      var status = Number(e.index)+1
      this.status=status
      this.getcomment(status)
    },
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCommon({ id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
    },
    onClose(flag) {
      this.updateId = ''
      this.visible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>

