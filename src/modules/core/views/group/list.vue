<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <Form :visible="visible" :id="updateId" @onClose="onClose" :array="array"></Form>
  </div>
</template>

<script>
import Form from './form'
import Utils from '@/utils/utils';
export default {
  components: { Form },
  data() {
    return {
      array:{},
      visible: false,
      updateId: '',
      option: {
        url: 'api/admin/v1/category/page?type=5'
      },
      searchForm:[
        { formName: '', value: ' ',newType:'' },
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        }
      ],
      column: [
        { prop: 'seqNum', label: '序号', align: 'center', width: '50px' },
        { label: '名称', prop: 'name' },
        { label: '创建时间', prop: 'createTime', width: '100px'},
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.visible = true
                    this.updateId = row.id
                    this.array=row
                  }}
                >
                  编辑
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
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteExam({ id }).then(() => {
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

