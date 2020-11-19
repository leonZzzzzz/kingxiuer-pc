<template>
  <div>
    <QcTable ref="table" :option="option" :column="column" :search-form="searchForm"></QcTable>
    <!-- <Form :visible="visible" :id="updateId" @onClose="onClose"></Form> -->
  </div>
</template>

<script>
// import Form from './form'
import Utils from '@/utils/utils';
export default {
  // components: { Form },
  data() {
    return {
      visible: false,
      updateId: '',
      option: {
        url: '/pc/desire/page.do'
      },
      searchForm: [
        { label: '许愿内容', type: 'input', formName: 'content' },
        // { formName: 'isSell', value: true }
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
            this.$router.push('/main/news/detail')
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center' },
         {
          prop: 'userImgUrl',
          label: '头像',
          align: 'center',
          width: '120px',
          formatter: row => {
            return (
              row.userImgUrl?
              <el-image src={ row.userImgUrl} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>:<div style="width:120px;text-align:center">-</div>
            )
          }
        },
        { prop: 'userName', label: '昵称', align: 'center' },
        { prop: 'userMobile', label: '电话', align: 'center' },
        
        { prop: 'content', label: '许愿内容', align: 'center' },
        // {
        //   label: '是否显示',
        //   align: 'center',
        //   formatter: row => {
        //     return row.isDisplay ? '是' : '否'
        //   }
        // },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        // {
        //   label: '操作',
        //   align: 'center',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text"
        //           onClick={() => {
        //             this.$router.push(`/main/base/news/detail?id=${row.id}`)
        //           }}
        //         >
        //           编辑
        //         </el-button>
        //         <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
        //           删除
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ]
    }
  },
  methods: {
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteNews({ id }).then(() => {
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

