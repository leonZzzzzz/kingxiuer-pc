<template>
  <QcNavigationPage content="配置" :full="true" class="">
    <el-form :model="imgModel" ref="model" label-position="left" label-width="100px">
      <div>
        <!-- <el-form-item label="" prop="title" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.title" class="w-750"></el-input>
        </el-form-item> -->
        
        <el-form-item 
          v-for="item in imgModel"
          :key="item.id"
          :label="item.name" 
          :prop="item.key" 
          :rules="[{ required: true, message: '请上传' }]" 
          >
          <QcImageUpload
            width="100px"
            height="100px"
            :body="{ imageType: 'setting' }"
            v-model="imgModel[item.key].value"
          ></QcImageUpload>
        </el-form-item>
      </div>
    </el-form>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      imgModel: {}
    }
  },
  created() {
    this.getConfigList()
  },
  methods: {
    getConfigList() {
      let keyList = ['tweets_temperature', 'tweets_ovulate', 'tweets_pregnancy', 'qr_code_clinic', 'qr_code_staff', 'qr_code_pop_ups', 'calendar_map']
      this.$http.get('/api/admin/v1/config/list').then(res => {
        res.data.data.forEach(item => {
          if (keyList.indexOf(item.key) != -1) {
            this.imgModel[key] = item
          }
        })
      })
    },
    getConfig(key) {
      // tweets_temperature 体温说明
      // tweets_ovulate 排卵说明
      // tweets_pregnancy 验孕说明
      // qr_code_clinic 诊所二维码
      // qr_code_staff 客服二维码
      // qr_code_pop_ups 公众号引导二维码
      // calendar_map 日历导图
      this.$http.get(`/api/admin/v1/config/${key}`).then(res => {

      })
    },
    updateConfig() {

    }
  }
}
</script>

