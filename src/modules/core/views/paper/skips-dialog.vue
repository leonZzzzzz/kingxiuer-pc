<template>
  <el-dialog
    title="跳题逻辑"
    :visible.sync="visible"
    width="680px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="skips-box">
      <div class="skips-box__item">
        <el-checkbox
          v-model="type.option"
          @change="handleOption"
          class="skips-box__item-check"
          :disabled="!currentData.options || currentData.options.length === 0"
        >按选项跳题</el-checkbox>
        <el-table
          :data="optionSkips"
          size="small"
          border
          stripe
          class="skips-table"
          v-if="type.option"
        >
          <el-table-column width="50px">
            <template slot-scope="scope">
              <span>选择</span>
            </template>
          </el-table-column>
          <el-table-column prop="optionText" label="选项" width="200px"></el-table-column>
          <el-table-column label="跳转到">
            <template slot-scope="scope">
              <div class="target-type-box">
                <el-select
                  v-model="scope.row.targetType"
                  size="mini"
                  style="width: 120px; flex-shrink: 0;"
                  placeholder="跳题目标类型"
                >
                  <el-option label="跳到指定题目" value="subject"></el-option>
                  <el-option label="直接提交问卷" value="submit"></el-option>
                </el-select>
                <el-select
                  v-model="scope.row.targetSubjectId"
                  v-if="scope.row.targetType === 'subject'"
                  size="mini"
                  style="width: 100%; margin-left: 5px;"
                  placeholder="请选择题目"
                >
                  <el-option
                    v-for="(subject, s) in skipsSubjects"
                    :key="s"
                    :label="`${subject.sortNumber}.${subject.title}`"
                    :value="subject.id"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="skips-box__item">
        <el-checkbox
          v-model="type.always"
          @change="handleAlways"
          class="skips-box__item-check"
        >无条件跳题</el-checkbox>
        <div v-if="type.always" class="always-box">
          <p>填写此题后跳转到</p>
          <div class="target-type-box">
            <el-select
              v-model="alwaysSkips[0].targetType"
              size="mini"
              style="width: 120px; flex-shrink: 0;"
              placeholder="跳题目标类型"
            >
              <el-option label="跳到指定题目" value="subject"></el-option>
              <el-option label="直接提交问卷" value="submit"></el-option>
            </el-select>
            <el-select
              v-model="alwaysSkips[0].targetSubjectId"
              v-if="alwaysSkips[0].targetType === 'subject'"
              size="mini"
              style="width: 100%; margin-left: 5px;"
              placeholder="请选择题目"
            >
              <el-option
                v-for="(subject, s) in skipsSubjects"
                :key="s"
                :label="subject.title"
                :value="subject.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentData: Object,
    currentIndex: Number,
    subjects: Array,
  },
  data() {
    return {
      loading: false,
      type: {
        option: false,
        always: false,
      },
      optionSkips: [],
      alwaysSkips: [
        {
          type: 'always',
          optionId: '',
          optionText: '',
          targetType: '',
          targetSubjectId: '',
        }
      ],
      skipsSubjects: [],
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.subjects.map((item, i) => {
          if (i > this.currentIndex) {
            this.skipsSubjects.push(item)
          }
        })
        console.log('currentData', this.currentData)
        if (this.currentData.skips && this.currentData.skips.length > 0) {
          let skips = this.currentData.skips
          if (skips[0].type === 'option') {
            this.type.option = true
            this.optionSkips = skips
          }
          if (skips[0].type === 'always') {
            this.type.always = true
            this.alwaysSkips = skips
          }
        }
        if (this.optionSkips.length === 0) {
          this.currentData.options.map((item, i) => {
            let option = {
              type: 'option',
              optionId: item.id,
              optionText: item.title,
              targetType: '',
              targetSubjectId: '',
            }
            this.optionSkips.push(option)
          })
        }
      }
    }
  },

  methods: {
    handleOption(val) {
      if (val) this.type.always = false
    },
    handleAlways(val) {
      if (val) this.type.option = false
    },

    reset() {
      this.skipsSubjects = []
      this.optionSkips = []
      this.alwaysSkips = [
        {
          type: 'always',
          optionId: '',
          optionText: '',
          targetType: '',
          targetSubjectId: '',
        }
      ]
      this.type = {
        option: false,
        always: false,
      }
    },
    close() {
      this.reset()
      this.$emit('close')
    },
    success() {
      let skips = []
      if (this.type.option) {
        let optionSkips = JSON.parse(JSON.stringify(this.optionSkips))
        for (let i = 0; i < optionSkips.length; i++) {
          let item = optionSkips[i]
          if (!item.targetType) {
            this.$message.warning('请选择跳题目标类型')
            return
          }
          if (item.targetType === 'submit') optionSkips[i].targetSubjectId = '' 
          if (item.targetType === 'subject' && !item.targetSubjectId) {
            this.$message.warning('请选择题目')
            return
          }
        }
        skips = optionSkips
      } else if (this.type.always) {
        let alwaysSkips = JSON.parse(JSON.stringify(this.alwaysSkips))
        let item = alwaysSkips[0]
        if (!item.targetType) {
          this.$message.warning('请选择跳题目标类型')
        }
        if (item.targetType === 'submit') alwaysSkips[0].targetSubjectId = '' 
        if (item.targetType === 'subject' && !item.targetSubjectId) {
          this.$message.warning('请选择题目')
          return
        }

        skips = alwaysSkips
      }
      console.log('skips', skips)
      this.$emit('get-skips', skips, this.currentIndex)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.skips-table {
  table th {
    background: #fafafa !important;
    color: #000;
  }
}
.skips-box {
  &__item {
    margin-bottom: 20px;
    &-check {
      margin-bottom: 10px;
    }
  }
}
.target-type-box {
  display: flex;
}
.always-box {
  margin-left: 24px;
}
</style>
