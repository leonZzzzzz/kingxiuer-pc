<template>
  <el-dialog
    title="题目关联"
    :visible.sync="visible"
    width="680px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="relevance-box">
      <div class="relevance-box__current">
        <span style="width: 100px; display: inline-block;">当前题目：</span>
        {{currentData.sortNumber}}.{{currentData.title}}
      </div>
      <div class="relevance-box__content" v-if="this.model.subjects.length > 0">
        <div class="relevance-box__item" v-for="(item, i) in model.subjects" :key="i">
          <div class="relevance-box__item-title">
            <span class="relevance-box__item-title-num">关联题目{{i+1}}：</span>
            <el-select
              placeholder="请选择关联的题目"
              size="small"
              style="width: 100%;"
              v-model="item.id"
              @change="handleQuestions"
            >
              <el-option
                v-for="(subject, j) in relevanceSubjects"
                :key="j"
                :label="`${subject.sortNumber}.${subject.title}`"
                :value="subject.id"
                :disabled="subject.disabled"
              ></el-option>
            </el-select>
            <div class="relevance-box__item-move" @click="addItem()" v-if="i === 0">
              <i class="el-icon-plus"></i>
              更多
            </div>
            <div class="relevance-box__item-move" @click="deleteItem(i)" v-else>
              <i class="el-icon-minus"></i>
              取消
            </div>
          </div>
          <div class="relevance-box__item-options" v-if="item.id">
            <div>当”关联题目{{i+1}}“选择下面的选项：</div>
            <el-button size="mini" @click="reverseElection(i)" :disabled="item.id === ''">反选</el-button>
            <el-checkbox-group
              class="choice-box"
              v-model="item.options"
              v-if="item.checkboxList && item.checkboxList.length > 0"
            >
              <el-checkbox
                class="choice-box__item"
                :label="option.id"
                v-for="(option, i) in item.checkboxList"
                :key="i"
              >
                <div class="p-img" v-if="option.image">
                  <img :src="`${imgHost}${option.image}`" alt />
                </div>
                {{option.title}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-else>本题之前无单选题或多选题可关联，请确认前面题型包含单选题或多选题</div>
      <div class="relevance-move-box" v-if="model.subjects.length > 1">
        <div class="relevance-move-box__title">多题关联时：多题之间</div>
        <div class="relevance-move-box__content">
          <el-radio v-model="model.logic" label="and">为”且“的关系（同时满足）</el-radio>
          <el-radio v-model="model.logic" label="or">为”或“的关系（满足一题即可）</el-radio>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false, true)">删除关联</el-button>
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
      model: {
        logic: 'and',
        subjects: [],
      },
      cacheSubjects: [],
      relevanceSubjects: [],
      loading: false,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log('currentData', this.currentData)
        this.cacheSubjects = []
        this.relevanceSubjects = []
        this.model = {
          logic: '',
          subjects: [],
        }

        this.model = Object.assign(this.model, this.currentData.relevance)

        
        console.log('visible', this.model)
        
        // 放入可关联的题目（单选，多选）
        this.subjects.map((item, i) => {
          if (item.sortNumber < this.currentData.sortNumber && (item.type === 'single_choice' || item.type === 'multi_choice' || item.type === 'gender')) {
            item.disabled = false
            this.relevanceSubjects.push(item)
          }
        })

        // 没有关联过，默认一个
        if (this.relevanceSubjects.length > 0 && this.model.subjects.length === 0) {
          this.model.subjects.push(this.createdSubjects())
        }

        // 已关联题目
        if (this.model.subjects.length > 0) {
          this.model.subjects.map(item => {
            console.log('item.id', item.id)
            this.handleQuestions(item.id)
          })
        }

        // console.log('model', this.model)
      }
    },
    // model: {
    //   handler(nVal, oVal) {
    //     console.log('model')
    //     console.log(nVal, oVal)
    //   },
    //   deep: true
    // }
  },
  methods: {
    createdSubjects() {
      let data = {
        id: '',
        options: [],
        checkboxList: [],
        // checkList: [],
      }
      return data
    },
    // 添加关联
    addItem() {
      if (this.relevanceSubjects.length <= this.model.subjects.length) {
        this.$message.warning('已超过可关联题目数量')
        return
      }
      this.model.subjects.push(this.createdSubjects())
    },
    // 删除关联
    deleteItem(i) {
      this.model.subjects.splice(i, 1)
      this.relevanceSubjects.map((label, j) => {
        label.disabled = false
        this.model.subjects.map((item, i) => {
          if (item.id === label.id) label.disabled = true
        })
      })
      // if (this.model.subjects.length <= 1) this.model.logic = ''
    },
    // 选择题目
    handleQuestions(val) {
      let index = this.relevanceSubjects.findIndex(item => {
        return item.id === val
      })
      console.log('handleQuestions', index)
      if (index === -1) return
      let options = this.relevanceSubjects[index].options
      console.log('index', index, options)
      let subjects = this.model.subjects
      // if (subjects.length === 1 && this.cacheSubjects.length === 0 && (!this.model.subjects[0].options || this.model.subjects[0].options.length === 0)) {
      //   this.model.subjects[0].options = []
      //   this.$set(this.model.subjects[0], 'checkboxList', options)
      // } else {
      //   console.log('??????????')
      //   for (let i = 0; i < this.model.subjects.length; i++) {
      //     let item = this.model.subjects[i]
      //     let cacheItem = this.cacheSubjects[i]
      //     if (!cacheItem || item.id !== cacheItem.id) {
      //       this.$set(this.model.subjects[i], 'checkboxList', options)
      //     }
      //   }
      // }

      this.model.subjects.map((item, i) => {
        if (item.id === val) {
          if (item.checkboxList) item.checkboxList = options
          else this.$set(this.model.subjects[i], 'checkboxList', options)
        }
      })

      this.cacheSubjects = JSON.parse(JSON.stringify(this.model.subjects))
      this.relevanceSubjects.map((label, j) => {
        label.disabled = false
        this.model.subjects.map((item, i) => {
          if (item.id === label.id) label.disabled = true
        })
      })
    },
    // 反选 
    reverseElection(index) {
      let subject = this.model.subjects[index]
      let options = []
      if (subject.options.length === 0) {
        options = subject.checkboxList.map(checkbox => checkbox.id)
        console.log(options)
      } else if (subject.options.length  === subject.checkboxList.length) {
        options = []
      } else {
        let listId = subject.checkboxList.map(checkbox => checkbox.id)
        for (let i = 0; i < listId.length; i++) {
          for (let j = 0; j < subject.options.length; j++) {
            if (listId[i] === subject.options[j]) {
              listId.splice(i, 1)
              i--
            }
          }
        }
        options = listId
      }
      this.model.subjects[index].options = options
    },

    close(done, state) {
      if (state) {
        this.model = {
          logic: '',
          subjects: []
        }
        this.$emit('get-relevance', this.model, this.currentIndex)
      }
      this.$emit('close')
    },
    success() {
      for (let i = 0; i < this.model.subjects.length; i++) {
        let item = this.model.subjects[i]
        if (!item.id) {
          this.$message.warning(`请选择关联题目${i+1}`)
          return
        }
        if (item.options.length === 0) {
           this.$message.warning(`请选择关联题目${i+1}的选项`)
          return
        }
      }
      if (this.model.subjects.length > 1 && !this.model.logic) {
        this.$message.warning('请选择多题关联时关系')
        return
      }
      
      if (this.model.subjects.length === 1) {
        this.model.logic = 'and'
      }
      console.log(this.model)

      this.$emit('get-relevance', this.model, this.currentIndex)
      this.close()
    },
  }
}
</script>

<style lang="scss" scoped>
.relevance-box {
  max-height: 500px;
  overflow: auto;
  &__current {
    margin-bottom: 10px;
  }
  &__content {
    .relevance-box__item {
      margin-bottom: 10px;
      &-title {
        display: flex;
        width: 100%;
        align-items: center;
        margin-bottom: 10px;
        &-num {
          flex-shrink: 0;
          width: 100px;
        }
        .relevance-box__item-move {
          width: 80px;
          flex-shrink: 0;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      &-options {
        margin-left: 100px;
        .choice-box {
          margin-top: 10px;
          &__item {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 10px;
            .el-checkbox__label {
              display: inline-flex;
              align-items: center;
            }
            .el-radio__label {
              display: inline-flex;
              align-items: center;
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
        }
      }
    }
  }
  .relevance-move-box {
    margin-top: 10px;
    &__content {
      margin-left: 100px;
    }
  }
}
</style>