<template>
  <div>
    <QcNavigationPage content="打卡列表" style="width:900px;margin:0 auto;" v-if="campId">
      <QcTable
        v-if="userId"
        ref="table"
        :option="option2"
        :menu="menu"
        :column="column"
        :search-form="searchForm"
        @get-list="onGetList"
      ></QcTable>
      <QcTable
        v-else
        ref="table"
        :option="campId?option1:option"
        :menu="menu"
        :column="column"
        :search-form="searchForm"
        @get-list="onGetList"
      ></QcTable>
    </QcNavigationPage>
    <div v-else>
      <QcTable
        v-if="userId"
        ref="table"
        :option="option2"
        :menu="menu"
        :column="column"
        :search-form="searchForm"
        @get-list="onGetList"
      ></QcTable>
      <QcTable
        v-else
        ref="table"
        :option="campId?option1:option"
        :menu="menu"
        :column="column"
        :search-form="searchForm"
        @get-list="onGetList"
      ></QcTable>
    </div>
  </div>
</template>

<script>
import Utils from '@/utils/utils';
export default {
  data() {
    return {
      campId:'',
      userId:'',
      commonlist:[],
      visible: false,
      updateId: '',
      option: {
        url: '/pc/clock/page.do'
      },
      option1: {
        url: '/pc/clock/page.do?campId='+this.$route.query.campId
      },
      option2: {
        url: '/pc/clock/page.do?campId='+this.$route.query.campId+'&userId='+this.$route.query.userId
      },
      searchForm:[
         {
          type: 'input',
          formName: 'nickName',
          label: '昵称',
          value: ''
        },
        {
          type: 'select',
          formName: 'category',
          label: '打卡类型',
          option: [
            { value: '', label: '全部' },
            { value: 'movement', label: '运动' },
            { value: 'diet', label: '饮食' },
            { value: 'drink', label: '喝水' },
            { value: 'temperature', label: '体温' },
            { value: 'weight', label: '体重' },
          ],
          value: ''
        },
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
          prop: 'imgUrl',
          label: '头像',
          width: '120px',
          align: 'center',
          formatter: row => {
            return (
              row.imgUrl?
              <el-image src={row.imgUrl} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>:<div style="width:120px;text-align:center">-</div>
            )
          }
        },
        { label: '用户昵称', prop: 'nickName',align: 'center',width: '150px', },
        {
          label: '打卡类型',
          width: '130px',
          prop: 'category',
          formatter: row => {
            return { movement: '运动', diet: '饮食',drink:'喝水',temperature:'体温',weight:'体重'}[row.category]
          }
        },
        { label: '打卡时间', prop: 'clockTime', width: '200px',align: 'center'},
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text" onClick={this.GoArticleDetail.bind(this, row.id)}>
                  查看详情
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {
    this.campId=this.$route.query.campId
    this.userId=this.$route.query.userId
    console.log(this.$route.query.userId)
  },
  methods: {
    onGetList(list) {
      console.log('jjjjj',list)
      this.commonlist = list
    },
    // 去到文章详情
    GoArticleDetail(id){
      this.$router.push({ path:'/main/punch/detail',query:{id:id}})
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

