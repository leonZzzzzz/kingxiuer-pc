<template>
  <div class="wrap" ref="wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="许愿列表" name="first"></el-tab-pane>
      <el-tab-pane label="还愿列表" name="second"></el-tab-pane>
    </el-tabs>
    <QcTable
      v-if="activeName == 'first'"
      ref="table"
      :option="option"
      :searchForm="searchForm"
      :menu="menu"
      :column="column"
      >
    </QcTable>
    <QcTable
      v-else
      ref="table_b"
      :option="option_b"
      :searchForm="searchForm_b"
      :menu="menu_b"
      :column="column_b"
      >
    </QcTable>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config';
export default {
  data() {
    return {
      activeName: 'first',
      searchData: {
        nickName: '',
        mobile: '',
        number: ''
      },
      option: {
        url: '/pc/desire/page.do',
      },
      searchForm: [
        // {type: 'input', formName: 'userName', label: '昵称'},
        // {type: 'input', formName: 'userMobile', label: '手机'},
      ],
      menu: [
        // {type: 'export', url: `${BASEURL}/pc/exportUser.do`}
        {
          type: 'primary',
          label: '刷新',
          on: () => {
            this.$refs.table.onSearch()
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '60px' },
        // {
        //   label: '头像',
        //   formatter: row => {
        //     return (
        //       <el-image
        //         src={row.image}
        //         mode="widthFix"
        //         style="width:50px;height:50px;"></el-image>
        //     )
        //   }
        // },
        { prop: 'userName', label: '昵称' },
        { prop: 'userMobile', label: '手机', width: 120 },
        { prop: 'content', label: '许愿内容' },
        { prop: 'createTime', label: '创建时间' },
      ],
      option_b: {
        url: '/pc/votive/page.do',
      },
      searchForm_b: [
        // {type: 'input', formName: 'userName', label: '昵称'},
        // {type: 'input', formName: 'userMobile', label: '手机'},
      ],
      menu_b: [
        // {type: 'export', url: `${BASEURL}/pc/exportUser.do`}
        {
          type: 'primary',
          label: '刷新',
          on: () => {
            this.$refs.table_b.onSearch()
          }
        }
      ],
      column_b: [
        { type: 'index', label: '序号', align: 'center', width: '60px' },
        // {
        //   label: '头像',
        //   formatter: row => {
        //     return (
        //       <el-image
        //         src={row.image}
        //         mode="widthFix"
        //         style="width:50px;height:50px;"></el-image>
        //     )
        //   }
        // },
        { prop: 'userName', label: '昵称' },
        { prop: 'userMobile', label: '手机', width: 120 },
        { prop: 'content', label: '还愿内容' },
        { prop: 'createTime', label: '创建时间' },
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
.page-wrap{
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}
</style>
