<template>
  <div>
    <QcTable ref="table" :option="option" :column="column"></QcTable>
    <Form
      :visible="visible"
      :id="updateId"
      :punchtype="punchtype"
      :punchcontent="punchcontent"
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
      visible: false,
      punchtype:'',
      punchcontent:'',
      updateId: '',
      option: {
        url: '/pc/ksConfig/getSettingSuggest.do'
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
        {type: 'index', label: '序号', align: 'center', width: '50px' },
        {
          label: '打卡类型',
          prop: 'clockCategory',
          formatter: row => {
            return { movement: '运动', diet: '饮食',drink:'喝水',temperature:'体温',weight:'体重'}[row.clockCategory]
          }
        },
        // { label: '建议内容', prop: 'content', width: '100px'},
        // {
        //   label: '操作',
        //   align: 'center',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text"
        //           onClick={() => {
        //             this.visible = true
        //             this.updateId = row.id
        //             this.punchtype = row.clockCategory
        //             this.punchcontent = row.content
        //           }}>编辑</el-button>
        //       </div>
        //     )
        //   }
        // }
      ]
    }
  },
  methods: {
    //启用，停用
    productSell(id, status) {
      if(status=='stopUsing'){
        status='enable'
      }else{
        status='stopUsing'
      }
      this.$http.updateCarousel({ id, status }).then(() => {
        this.$refs.table.onSearchKeep()
        this.$message.success(status=='enable'?'已启用':'已停用')
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
          this.$http.deleteCarousel({ id }).then(() => {
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

