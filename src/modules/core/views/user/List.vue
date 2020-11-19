<template>
  <div class="wrap user" ref="wrap">
    <QcTable ref="table" :option="option" :searchForm="searchForm" :menu="menu" :column="column"></QcTable>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config';
import Utils from '@/utils/utils';
export default {
  data() {
    return {
      searchData: {
        nickName: '',
        mobile: '',
        number: ''
      },
      option: {
        url: '/pc/users/getPage.do',
        // response: {
        //   list: 'data.content0.rows',
        //   total: 'data.content0.total'
        // }
      },
      searchForm: [
        // { formName: 'status', value: ' ',newType:'position' },
        {type: 'input', formName: 'nickName', label: '昵称'},
        {type: 'input', formName: 'mobile', label: '手机'},
        {type: 'input', formName: 'number', label: 'ID'},
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
        {type: 'export', url: `${BASEURL}/pc/users/exportUser.do`}
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '60px' },
        {
          label: '头像',
          formatter: row => {
            return (
              row.imgUrl?
              <el-image
                src={row.imgUrl}
                mode="widthFix"
                style="width:50px;height:50px;"></el-image>:<div style="width:50px;text-align:center">-</div>
            )
          }
        },
        { prop: 'number', label: 'ID' },
        { prop: 'nickName', label: '昵称' },
        { prop: 'mobile', label: '手机', width: 120 },
        { prop: 'birth', label: '出生年月' },
        { prop: 'recentMenstrual', label: '最近一次月经' },
        { prop: 'intervalDay', label: '月经天数' },
        { prop: 'longPeriod', label: '最长间隔天数' },
        { prop: 'shortPeriod', label: '最短间隔天数' },
        { prop: 'location', label: '地理位置' },
        { prop: 'createTime', label: '创建时间', 
          formatter: row => {
            return row.createTime ? Utils.getLocalTime(row.createTime) : ''
          }
        },
        { label: '操作', fixed: 'right',
          formatter: row => {
            return (
              <el-button type='text' size='small' onClick={() => {
                this.jumpDetail(row)
              }}>查看详情</el-button>
            )
          }
        },
      ]
    };
  },
  methods: {
    jumpDetail(row) {
      this.$router.push(`/main/user/${row.id}`);
    }
  }
};

</script>

<style lang="scss" scoped>
.page-wrap {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}
</style>
