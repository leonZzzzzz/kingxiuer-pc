<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column" :search-form="searchForm"></QcTable>
    <!-- <Member :visible="visible" :id="updateId" @onClose="onClose"></Member> -->
  </div>
</template>

<script>
// import Member from './member'
import Utils from '@/utils/utils';
export default {
  // components: { Member },
  data() {
    return {
      visible: false,
      updateId: '',
      option: {
        url: '/pc/camp/pages.do'
      },
      proglist:[],
      searchForm: [
         {
          type: 'input',
          formName: 'title',
          label: '标题',
          value: ''
        },
        {
          type: 'select',
          formName: 'status',
          label: '状态',
          option: [
            { value: '', label: '全部' },
            { value: 'notstart', label: '未开始' },
            { value: 'processing', label: '进行中' },
            { value: 'over', label: '已结束' }
          ],
          value: ''
        },
        {
          type: 'select',
          formName: 'type',
          label: '类型',
          option: [
            { value: '', label: '全部' },
            { value: 'training', label: '训练营' },
            { value: 'experience', label: '体验营' }
          ],
          value: ''
        }
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: this.insert
        },
        // {
        //   label: '查看或编辑成员',
        //   disabled: ({ selectionRow }) => selectionRow.length == 0,
        //   on: (currentRow, search, selectionRow) => {
        //     console.log(selectionRow)
        //     let ids = selectionRow.map(item => {
        //       return item.id
        //     })
        //     this.productSell(ids.join('_'), 1)
        //   }
        // },
        // {
        //   label: '查看健康收集信息',
        //   disabled: ({ selectionRow }) => selectionRow.length == 0,
        //   on: (currentRow, search, selectionRow) => {
        //     console.log(selectionRow)
        //     let ids = selectionRow.map(item => {
        //       return item.id
        //     })
        //     this.productSell(ids.join('_'), 2)
        //   }
        // },
        // {
        //   label: '查看用户打卡',
        //   disabled: ({ selectionRow }) => selectionRow.length == 0,
        //   on: (currentRow, search, selectionRow) => {
        //     console.log(selectionRow)
        //     let ids = selectionRow.map(item => {
        //       return item.id
        //     })
        //     this.productSell(ids.join('_'), 2)
        //   }
        // },
      ],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { label: '标题', prop: 'title', width: '200px' },
        { 
          label: '类型', prop: 'type',
          formatter: row => {
            return (
                row.type=='experience'?'体验营':'训练营'
            )
          } 
        },
        { 
          label: '状态', prop: 'status',
          formatter: row => {
            return { notstart: '未开始', processing: '进行中',over:'已结束'}[row.status]
          } 
        },
        { label: '开始时间', prop: 'startTime', width: '150px'},
        { label: '结束时间', prop: 'endTime', width: '150px'},
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`./member?campId=${row.id}&surveyId=${row.surveyId}`)
                  }}
                >
                  查看或编辑成员
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    // this.$router.push(`./clocklist?campId=${row.id}`)
                    this.$router.push(`../punch/list?campId=${row.id}`)
                  }}
                >
                  查看打卡列表
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`./form?id=${row.id}`)
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {
    // this.listAttachment()
  },
  methods: {
    insert() {
      this.$router.push("./form");
    },
    // 获取栏目列表
    listAttachment(){
      this.$http.listAttachment().then((res) => {
        // this.proglist = res.data.data.list
        
      })
    },
    // 审核
    productSell(ids, status) {
      ids = ids.split("_")
      // this.$http.checkArtice({ ids, status }).then(() => {
      //   this.selectProduct = []
      //   this.$refs.table.onSearchKeep()
      //   this.$message.success(status==1?'审核通过':'审核不通过')
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
          this.$http.deleteSuggest({ id:row.id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          }).catch(err=>{
            this.$message.error(err.data.message)
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

