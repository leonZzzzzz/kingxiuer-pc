<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <Form
      :visible="visible"
      :id="updateId"
      :appId="appId"
      :skipUrl="skipUrl"
      :name="name"
      @onClose="onClose"
    ></Form>
  </div>
</template>

<script>
import Form from './form'
import Utils from '@/utils/utils';
export default {
  components: { Form },
  data() {
    return {
      name:'',
      appId:'',
      visible: false,
      updateId: '',
      skipUrl:'',
      option: {
        url: '/pc/skipProgram/page.do'
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
        { type: 'index', label: '序号', align: 'center', width: '50px' },
        { label: '小程序名称', prop: 'name', align: 'center' },
        { label: 'AppId', prop: 'appId', width: '200px'},
        { label: '跳转路径', prop: 'skipUrl', width: '300px'},
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
                    this.name=row.name
                    this.appId=row.appId
                    this.skipUrl = row.skipUrl
                  }}
                >编辑
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
          this.$http.deleteMiniProgram({ id }).then(() => {
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

