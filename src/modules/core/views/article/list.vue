<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column" :search-form="searchForm"></QcTable>
    <Form :visible="visible" :id="updateId" @onClose="onClose"></Form>
  </div>
</template>

<script>
import Form from './form'
import Utils from '@/utils/utils';
export default {
  components: { Form },
  data() {
    return {
      visible: false,
      updateId: '',
      option: {
        url: '/pc/article/page.do'
      },
      proglist:[],
      searchForm: [
        {
          type: 'select',
          formName: 'columnId',
          label: '栏目',
          option: [{ value: '', label: '请选择' }],
          value: ''
        },
        {
          type: 'select',
          formName: 'status',
          label: '状态',
          option: [
            { value: '', label: '全部' },
            { value: '0', label: '待审核' },
            { value: '1', label: '已审核' },
            { value: '2', label: '审核不通过' }
          ],
          value: ''
        },
        {
          type: 'input',
          formName: 'content',
          label: '文章内容',
          value: ''
        },
        {
          type: 'select',
          formName: 'type',
          label: '文章类型',
          option:[
            { value: '', label: '全部' },
            { value: 'user', label: '用户文章' },
            { value: 'platform', label: '平台文章' },
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
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        },
        {
          label: '审核通过',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map(item => {
              return item.id
            })
            this.productSell(ids.join('_'), 1)
          }
        },
        {
          label: '审核不通过',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map(item => {
              return item.id
            })
            this.productSell(ids.join('_'), 2)
          }
        },
      ],
      column: [
        {
          type: 'selection'
        },
        { label: '用户', prop: 'nickName', width: '100px' },
        { label: '栏目', prop: 'columnName' },
        { label: '文章内容', prop: 'content' },
        {
          prop: 'imgLinks',
          label: '图片',
          align: 'center',
          formatter: row => {
            row.imagelist=row.attachments.split(',')
            return (
              row.attachments!=''?
                <el-image v-for="(menuButton, index) in row.imagelist" src={this.imgHost + row.imagelist[0]} style="width:50px;height:50px">
                  <div slot="error" class="el-image__error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>:'-'
            )
          }
        },
        
        {
          align: 'center',
          label: '状态',
          prop: 'status',
          formatter: row => {
            return row.type=='user'? { 0: '待审核', 1: '审核通过', 2: '审核未通过' }[row.status]
            :'-'
          }
        },
        { 
          label: '文章类型', prop: 'type',
          formatter: row => {
            return (
                row.type=='user'?'用户文章':'平台文章'
            )
          } 
        },
        {
          align: 'center',
          label: '是否置顶',
          prop: 'isTop',
          formatter: row => {
            return row.isTop?'是':'否'
          }
        },
        { label: '创建时间', prop: 'createTime', width: '100px',
          // formatter: row => {
          //   return row.createTime ? Utils.getLocalTime(row.createTime) : ''
          // } 
        },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              // row.status==0?
              // <div>
              //   <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id,1)}>
              //     审核通过
              //   </el-button>
              //   <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id,2)}>
              //     审核不通过
              //   </el-button>
              //   <el-button
              //     type="text"
              //     onClick={() => {
              //       this.$router.push(`/main/article/listform?id=${row.id}`)
              //     }}
              //   >
              //     查看详情
              //   </el-button>
                
              //   <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
              //     删除
              //   </el-button>
              // </div>
              // :
              <div>
                <el-button type="text" onClick={this.stick.bind(this, row)}>
                  {row.isTop?'取消置顶':'置顶'}
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/article/listform?id=${row.id}`)
                  }}
                >
                  查看详情
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
  created() {
    this.listAttachment()
  },
  methods: {
    // 置顶
    stick(row){
      this.$http.articleIsTop({id:row.id}).then((res) => {
        this.$message.success(row.isTop?'取消置顶':'置顶成功')
        this.$refs.table.onSearchKeep()
        // this.proglist = res.data.data.list
        // res.data.data.list.map(item => {
        //   this.searchForm[0].option.push({ value: item.id, label: item.name })
        // })
      })
    },
    // 获取栏目列表
    listAttachment(){
      this.$http.listAttachment().then((res) => {
        // this.proglist = res.data.data.list
        res.data.data.list.map(item => {
          this.searchForm[0].option.push({ value: item.id, label: item.name })
        })
      })
    },
    // 审核
    productSell(ids, status) {
      ids = ids.split("_")
      this.$http.checkArtice({ ids, status }).then(() => {
        this.selectProduct = []
        this.$refs.table.onSearchKeep()
        this.$message.success(status==1?'审核通过':'审核不通过')
      })
    },
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteartice({ id }).then(() => {
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
<style>
.el-table .cell {
  /* width:200px; */
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

