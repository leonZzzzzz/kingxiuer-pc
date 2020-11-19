<template>
  <div class="preview-box">
    <!-- 出生年月 -->
    <div class="preview-box__birth_ym" v-if="type === 'birth_ym'">
      <picker :data="dates" v-model="date"></picker>
    </div>
    <!-- 省市 -->
    <div class="preview-box__province_city" v-if="type === 'province_city'">
      <picker :data="addressData" v-model="address" :columns="2"></picker>
    </div>
    <!-- 性别 -->
    <div class="preview-box__gender" v-if="type === 'gender'">
      <el-radio v-model="sex" :label="1" v-for="(option, i) in options" :key="i">
        <img width="50" :src="`${imgHost}${option.image}`" alt v-if="option.image" />
        {{option.title}}
      </el-radio>
    </div>
    <!-- 姓名 -->
    <div class="preview-box__name" v-if="type === 'name'">
      <el-input size="small" style="max-width: 400px;"></el-input>
    </div>
    <!-- 手机号 -->
    <div class="preview-box__name" v-if="type === 'mobile'">
      <el-input size="small" style="max-width: 400px;"></el-input>
    </div>
    <!-- 多选 -->
    <div class="preview-box__multi_choice" v-if="type === 'multi_choice'">
      <el-checkbox-group v-model="checkList" v-if="options.length > 0">
        <el-checkbox
          class="checkbox-item"
          :label="option.id"
          v-for="(option, i) in options"
          :key="i"
        >
          <div class="p-img" v-if="option.image">
            <img :src="`${imgHost}${option.image}`" alt />
          </div>
          {{option.title}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 单选 -->
    <div class="preview-box__single_choice" v-if="type === 'single_choice'">
      <el-radio-group v-model="radio" v-if="options.length > 0">
        <el-radio :label="option.id" class="radio-item" v-for="(option, i) in options" :key="i">
          <div class="p-img" v-if="option.image">
            <img :src="`${imgHost}${option.image}`" alt />
          </div>
          {{option.title}}
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 填空 -->
    <div class="preview-box__fill_blank" v-if="type === 'fill_blank'">
      <el-input size="small" style="max-width: 400px;"></el-input>
    </div>
    <!-- 备注 -->
    <div class="preview-box__remark" v-if="type === 'remark'">
      <el-input
        size="small"
        type="textarea"
        style="max-width: 400px;"
        placeholder="请输入提示语，如：期待您的建议（255字以内）"
        :rows="3"
        :maxlength="255"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { Picker } from 'vux'
import ChinaAddressV4Data from './china_address_v4.json'

let years = []
const date = new Date()
for (var i = 1900; i <= date.getFullYear(); i++) {
  years.push({
    name: i + '年',
    value: i + ''
  })
}
let months = []
for (var i = 1; i <= 12; i++) {
  months.push({
    name: i < 10 ? '0' + i + '月' : i + '月',
    value: i + ''
  })
}

export default {
  components: {
    Picker
  },
  props: {
    type: String,
    options: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      dates: [years, months],
      date: ['1980', '01'],
      sex: '',
      checkList: [],
      radio: '',
      areas: [['广东', '广西'], ['深圳', '广州']],
      area: ['', ''],
      addressData: ChinaAddressV4Data,
      address: ['', ''],
    }
  },
}
</script>

<style lang="scss" scoped>
.preview-box {
  .preview-box__birth_ym,
  .preview-box__province_city {
    width: 400px;
    border: 1px solid rgb(233, 233, 233);
    padding: 10px;
    box-sizing: border-box;
  }
  .preview-box__multi_choice {
    .checkbox-item {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 10px;
      .el-checkbox__label {
        display: inline-flex;
        align-items: center;
      }
    }
  }
  .preview-box__single_choice {
    .radio-item {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 10px;
      .el-radio__label {
        display: inline-flex;
        align-items: center;
      }
    }
  }

  .p-img {
    width: 200px;
    line-height: 0;
    margin-right: 10px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
</style>
