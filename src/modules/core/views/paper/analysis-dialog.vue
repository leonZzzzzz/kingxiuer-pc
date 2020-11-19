<template>
  <el-dialog
    title="添加解析"
    :visible.sync="visible"
    width="680px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="analysis-box">
      <div class="option-box">当前选项：{{analysisData.title}}</div>
      <div class="analysis-box__item" v-for="(item, i) in analysis" :key="i">
        <div class="analysis-box__item-title">解析内容{{i+1}}：</div>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入解析内容（不超过200字）"
          maxlength="200"
          class="analysis-box__item-textarea"
          v-model="item.text"
        ></el-input>
        <div class="analysis-box__item-move" v-if="i === 0">
          <p @click="addItem()" v-if="analysis.length < 3">
            <i class="el-icon-plus"></i>添加
          </p>
          <p v-else></p>
        </div>
        <div class="analysis-box__item-move" v-if="i > 0">
          <p @click="deleteItem(i)">
            <i class="el-icon-minus"></i>取消
          </p>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false, true)">取消</el-button>
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: false,
    optionIndex: Number,
    itemIndex: Number,
    analysisData: Object,
  },
  data() {
    return {
      loading: false,
      analysis: [],
    }
  },
  watch: {
    visible(val) {
      if (val) {
        
        this.analysis = []
        if (this.analysisData.analysis && this.analysisData.analysis.length > 0) {
          this.analysis = this.analysisData.analysis.map(item => {
            return {
              text: item
            }
          })

        } else {
          this.analysis.push({text: ''})
        }
        console.log('analysisData', this.analysisData)
      }
    }
  },
  methods: {
    addItem() {
      this.analysis.push({text: ''})
    },
    deleteItem(i) {
      this.analysis.splice(i, 1)
    },
    close() {
      this.$emit('close')
    },
    success() {
      if (this.analysis.length == 1 && !this.analysis[0].text) {
        this.$emit('get-analysis', [], this.optionIndex, this.itemIndex)
        this.close()
        return
      }
      for (let i = 0; i < this.analysis.length; i++) {
        if (!this.analysis[i].text) {
          this.$message.warning(`请填写解析内容${i+1}`)
          return
        }
      }
      let analysis = this.analysis.map(item => item.text)
      console.log('analysis', analysis)
      this.$emit('get-analysis', analysis, this.optionIndex, this.itemIndex)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.analysis-box {
  max-height: 500px;
  overflow: auto;
  .option-box {
    margin-bottom: 10px;
  }
  &__item {
    display: flex;
    margin-bottom: 10px;
    &-title {
      flex-shrink: 0;
    }
    &-move {
      width: 60px;
      flex-shrink: 0;
      margin-left: 10px;
      color: rgb(49, 168, 255);
      p {
        cursor: pointer;
      }
    }
    &-textarea {
      width: 100%;
    }
  }
}
</style>
