<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
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
        url: '/pc/column/page.do'
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
        // { type: 'index', label: '序号', align: 'center', width: '50px' },
        { label: '排序', prop: 'sortNum', align: 'center',  width: '50px' },
         {
          prop: 'imgLinks',
          label: '图片',
          align: 'center',
          formatter: row => {
            return (
              <el-image src={this.imgHost + row.iconUrl} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            )
          }
        },
        { label: '名称', prop: 'name' },
        
        { label: '是否显示', prop: 'sortNum',
          formatter: row => {
            return row.isShow?'是':'否'
            // return { product: '商品', noskip: '不跳转' }[row.skip]
          }},
       
        // {
        //   label: '跳转类型',
        //   prop: 'skipType',
        //   formatter: row => {
        //     return !row.skip?'不跳转':'跳转'
        //     // return { product: '商品', noskip: '不跳转' }[row.skip]
        //   }
        // },
        // { label: '关联内容', prop: 'productName' },
        { label: '创建时间', prop: 'createTime', width: '100px',
          // formatter: row => {
          //   return row.createTime ? Utils.getLocalTime(row.createTime) : ''
          // } 
        },
        // { label: '结束时间', prop: 'endTime', width: '100px' },
        // { label: '排序号', prop: 'sortNum', align: 'center' },
        // {
        //   label: '状态',
        //   prop: 'status',
        //   formatter: row => {
        //     return { ended: '已结束', ongoing: '进行中', notstart: '未开始' }[row.status]
        //   }
        // },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            console.log(row)
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.visible = true
                    this.updateId = row.id
                  }}
                >
                  编辑
                </el-button>
                <el-button type="text" onClick={this.reveal.bind(this, row,row.isShow)}>
                  {row.isShow?'隐藏':'显示'}
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
    reveal(row,type){
      if(type){
        row.isShow=false
      }else{
        row.isShow=true
      }
      this.$http.updateAttachment(row).then(()=>{
        this.$refs.table.onSearchKeep()
        this.$message.success(type?'已隐藏':'已显示')
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
          this.$http.deleteAttachment({ id }).then(() => {
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

