<template>
  <QcNavigationPage content="设置" :full="true" class>
    <div
      class="wrap"
      ref="wrap"
      v-loading="dataLoading"
      element-loading-text="数据加载中"
      style="position: relative;background:#fff"
    >
      <div class="tabs">
        <div
          class="tabs__item"
          :class="item.index === activeIndex ? 'is-active' : ''"
          v-for="(item, i) in tabs"
          :key="i"
          @click="handleTabClick(item.index)"
        >{{item.name}}</div>
        <el-tooltip
          class="tabs__plus"
          effect="dark"
          content="添加结果二设置"
          placement="top-start"
          @click.native="addSecondResult(1)"
          v-if="tabs.length === 3"
        >
          <!-- <i class="iconfont icon-jia4"></i> -->
        </el-tooltip>
        <el-tooltip
          class="tabs__plus"
          effect="dark"
          content="删除结果二设置"
          placement="top-start"
          @click.native="addSecondResult(2)"
          v-if="tabs.length === 4"
        >
          <i class="iconfont icon-jian"></i>
        </el-tooltip>
        <!-- <el-button type="primary" size="small" class="tabs_back" @click="back()">返回</el-button> -->
      </div>
      <div class="tab-content__box" :style="{'height': contentHeight + 'px'}">
        <div class="tab-content" v-show="activeIndex === 1">
          <el-form :model="model" ref="model" label-position="top" size="small">
            <el-form-item
              label="测评名称"
              prop="title"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-input
                v-model="model.title"
                style="width:400px;"
                maxlength="32"
                placeholder="请输入内容（不超过32字）"
                clearable
              ></el-input>
              <!-- <el-switch v-model="model.showTitle" active-text="显示标题" style="margin-left: 10px;"></el-switch> -->
            </el-form-item>
            <el-form-item label="测评类型" prop="type" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-radio
                v-model="model.type"
                label="score"
                :disabled="$route.query.id !== undefined"
              >分值型</el-radio>
              <el-radio
                v-model="model.type"
                label="combination"
                :disabled="$route.query.id !== undefined"
              >组合型</el-radio>
            </el-form-item>
            <el-form-item
              label="分类"
              prop="categoryId"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-select v-model="model.categoryId" size="small">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, i) in category"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面图" prop="cover" :rules="[{ required: true, message: '该字段不能为空'}]">
              <QcImageUpload v-model="model.cover" width="140px" height="140px"></QcImageUpload>
            </el-form-item>
            <!-- <el-form-item label="问卷海报背景" prop="posterBackground">
              <QcImageUpload v-model="model.posterBackground" width="140px" height="140px"></QcImageUpload>
            </el-form-item>-->
            <el-form-item
              label="分享简介"
              prop="description"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-input
                v-model="model.description"
                style="width:400px;"
                maxlength="64"
                placeholder="请输入内容（不超过64字）"
                type="textarea"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              label="介绍"
              prop="content"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <Editor v-model="model.content"></Editor>
            </el-form-item>-->
            <!-- <el-form-item
              label="测评按钮文字"
              prop="buttonText"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-input
                v-model="model.buttonText"
                style="width:400px;"
                maxlength="8"
                placeholder="请输入内容（不超过8字）"
                clearable
              ></el-input>
            </el-form-item>-->
            <!-- <el-form-item
              label="测评按钮颜色"
              prop="buttonColor"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-color-picker v-model="model.buttonColor" color-format="rgb"></el-color-picker>
            </el-form-item>
            <el-form-item
              label="答题页面背景色"
              prop="themeColor"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <el-color-picker v-model="model.themeColor" color-format="rgb"></el-color-picker>
            </el-form-item>-->
          </el-form>
          <div class="bottom-btn">
            <el-button
              type="primary"
              @click="paperSubmit()"
              style="margin-left: 30px;"
              size="small"
              :loading="loading"
            >保存并下一步</el-button>
          </div>
        </div>
        <div class="tab-content2" v-show="activeIndex === 2">
          <div class="question-left">
            <div class="options-type-group">
              <div class="question-left__item" v-for="(item, i) in optionsType" :key="i">
                <div class="question-left__item__title">{{item.title}}</div>
                <div class="question-left__item__group">
                  <div
                    class="item"
                    v-for="(label, j) in item.group"
                    :key="j"
                    @click="handleChoiceType(label.value,label.name)"
                  >
                    <i class="iconfont" :class="label.icon"></i>
                    {{label.name}}
                  </div>
                </div>
              </div>
            </div>
            <div class="question-left__item" v-if="model.type === 'score'">
              <div class="question-left__item__title">创建分值项</div>
              <div
                class="question-left__item__factor"
                :style="{'max-height': factorHeight + 'px', 'overflow': 'auto'}"
                v-loading="factorLoading"
              >
                <div
                  class="question-left__item__factor-input"
                  v-for="(item, i) in factorList"
                  :key="i"
                >
                  <el-input
                    v-model="item.title"
                    @blur="handleFactor"
                    :data-index="i"
                    maxlength="12"
                  ></el-input>
                  <i class="el-icon-close" @click="deleteFactor(item)"></i>
                </div>
              </div>
              <el-button
                type="text"
                style="color: rgb(49, 168, 255) !important;"
                @click="addFactor()"
              >
                <i class="el-icon-plus" style="margin-right: 5px;"></i>
                添加
              </el-button>
            </div>
          </div>
          <div class="line"></div>
          <div class="blank" v-if="subjects.length === 0">现在可以添加题目啦！点击左侧类型尽情添加吧~</div>
          <div
            class="question-right"
            v-if="subjects.length > 0"
            :style="{'height': subjectHeight + 'px'}"
            style="overflow: auto;"
            ref="content"
          >
            <div class="question-right__group" ref="group">
              <div
                class="question-right__item"
                :class="{'submit-item': item.isSubmit}"
                v-for="(item, i) in subjects"
                :key="i"
              >
                <div class="tag">{{item.type | questionType}}</div>
                <div class="question-right__item-title">
                  <span>{{item.sortNumber}}.{{item.title}}</span>
                  <div class="question-right__item-img" v-if="item.image">
                    <img :src="`${imgHost}${item.image}`" />
                  </div>
                </div>
                <div class="question-right__item-preview">
                  <preview :type="item.type" :options="item.options" />
                </div>
                <div class="question-right__item-edit-box" v-show="!item.isSubmit">
                  <div class="arrow"></div>
                  <div class="title-box">
                    <div class="left">标题文字</div>
                    <div class="picture">图片</div>
                  </div>
                  <div class="edit">
                    <el-input
                      size="small"
                      v-model="item.title"
                      maxlength="60"
                      placeholder="请输入内容（不超过60字）"
                    ></el-input>
                    <div class="upload-img" :class="{'show-delete': item.image}">
                      <div class="img-mask" v-if="item.image" @click="deleteImg('subject', i)"></div>
                      <i class="el-icon-delete" v-if="item.image" @click="deleteImg('subject', i)"></i>
                      <img v-if="item.image" :src="`${imgHost}${item.image}`" style="width: 100%;" />
                      <QcImageUpload
                        v-else
                        style="margin: 1px auto;background: #fff;"
                        v-model="item.image"
                        width="34px"
                        height="33px"
                        icon-size="22px"
                      ></QcImageUpload>
                      <!-- <i
                        v-else
                        class="iconfont icon-tupian q-icon"
                        @click="openImgBox('question', i)"
                      ></i>-->
                    </div>
                  </div>
                  <div class="options-box" v-if="item.options && item.options.length > 0">
                    <el-table :data="item.options" size="small" class="options-box__table">
                      <el-table-column prop="title" label="选项文字">
                        <template slot-scope="scope">
                          <el-input
                            v-model="scope.row.title"
                            size="mini"
                            maxlength="60"
                            placeholder="请输入内容（不超过60字）"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column width="60px" align="center">
                        <template slot-scope="scope">
                          <i
                            class="el-icon-circle-plus-outline q-icon"
                            @click="addOption(i, scope.$index)"
                          ></i>
                          <i
                            class="el-icon-remove-outline q-icon"
                            @click="deleteOption(scope.$index, i)"
                          ></i>
                        </template>
                      </el-table-column>
                      <el-table-column prop="image" label="图片" align="center" width="80px">
                        <template slot-scope="scope">
                          <div
                            class="option-img"
                            :class="{'show-delete': scope.row.image}"
                            v-if="scope.row.image"
                            @click="deleteImg('option', i, scope.$index)"
                          >
                            <img :src="`${imgHost}${scope.row.image}`" alt />
                            <div class="img-mask"></div>
                            <i class="el-icon-delete"></i>
                          </div>
                          <QcImageUpload
                            v-else
                            style="margin: 1px auto;background: #fff;"
                            v-model="scope.row.image"
                            width="34px"
                            height="33px"
                            icon-size="22px"
                          ></QcImageUpload>
                          <!-- <i
                            v-else
                            class="iconfont icon-tupian q-icon"
                            @click="openImgBox('option', i, scope.$index)"
                          ></i>-->
                        </template>
                      </el-table-column>
                      <el-table-column prop="analysis" label="解析" width="50px" align="center">
                        <template slot-scope="scope">
                          <i
                            class="el-icon-edit-outline"
                            style="font-size:22px"
                            :class="{'option-color': scope.row.analysis && scope.row.analysis.length}"
                            @click="addAnalysis(scope.row, scope.$index, i)"
                          ></i>
                        </template>
                      </el-table-column>
                      <el-table-column label="上移下移" width="80px" align="center">
                        <template slot-scope="scope">
                          <i
                            class="el-icon-top"
                            style="font-size:22px"
                            @click="moveOption('prev', scope.$index, i)"
                          ></i>
                          <i
                            class="el-icon-bottom"
                            style="font-size:22px"
                            @click="moveOption('next', scope.$index, i)"
                          ></i>
                        </template>
                      </el-table-column>
                      <template v-if="model.type === 'score'">
                        <el-table-column label="分值项" width="180px" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.subjectFactorId" size="mini">
                              <el-option
                                v-for="(factor, i) in factorList"
                                :key="i"
                                :label="factor.title"
                                :value="factor.id"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="分值" width="100px" align="center">
                          <template slot-scope="scope">
                            <el-input-number
                              :controls="false"
                              v-model="scope.row.subjectFactorPoint"
                              size="mini"
                              style="width: 80px;"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                      </template>
                    </el-table>
                    <el-button
                      type="text"
                      style="color: rgb(49, 168, 255) !important;"
                      @click="addOption(i)"
                    >
                      <i class="iconfont icon-tianjia1" style="margin-right: 5px;"></i>
                      添加选项
                    </el-button>
                  </div>
                  <div class="setting">
                    <span class="setting__title">逻辑设置：</span>
                    <span @click="addRelevance(i)">题目关联</span>
                    <span @click="addSkips(i)">跳题逻辑</span>
                  </div>
                  <div class="question-right__item-btn">
                    <!-- <el-button style="width: 20%; background: rgb(204, 204, 204);" @click="deleteQuestion(i)">取消</el-button> -->
                    <el-button
                      style="width: 20%; background: rgb(204, 204, 204);"
                      @click="handleCancel(i, true)"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      style="width: 80%;"
                      @click="handleSubmit(i, true)"
                    >完成编辑</el-button>
                  </div>
                </div>
                <div class="question-right__item-btn-box">
                  <el-button size="mini" icon="el-icon-search" @click="handleSubmit(i, false)">编辑</el-button>
                  <!-- <el-button size="mini" @click="handleCopy(item, i)">复制</el-button> -->
                  <el-button size="mini" @click="deleteQuestion(i)">删除</el-button>
                  <el-button size="mini" @click="handleMoveTip(i, 'prev')" :disabled="i === 0">上移</el-button>
                  <el-button
                    size="mini"
                    @click="handleMoveTip(i, 'next')"
                    :disabled="subjects.length - 1 === i"
                  >下移</el-button>
                  <el-button size="mini" @click="handleMoveTip(i, 'before')" :disabled="i === 0">最前</el-button>
                  <el-button
                    size="mini"
                    @click="handleMoveTip(i, 'after')"
                    :disabled="subjects.length - 1 === i"
                  >最后</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-btn">
            <el-button
              type="primary"
              @click="subjectSubmit()"
              style="margin-left: 30px;"
              size="small"
              :loading="loading"
            >保存并下一步</el-button>
          </div>
        </div>
        <div class="result-content" v-show="activeIndex === 3">
          <div class="result-box__btn">
            <el-button size="small" type="primary" @click="addResult('Insert')">创建</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="result1.row.id === undefined"
              @click="addResult('Update')"
            >修改</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="result1.row.id === undefined || result1.row.isDefault"
              @click="deleteTip()"
            >删除</el-button>
            <el-button size="small" type="primary" @click="resultPage('result1Page')">刷新</el-button>
          </div>
          <el-table
            :data="result1.list"
            size="small"
            :height="resultBoxHeight"
            highlight-current-row
            @row-click="handleRow"
          >
            <!-- <el-table-column prop="index" label="序号" width="50px" align="center"></el-table-column> -->
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="condition" label="条件"></el-table-column>
            <!-- <el-table-column label="推荐商品">
              <template slot-scope="scope">{{scope.row.showRecommendContent ? '有' : '无'}}</template>
            </el-table-column>-->
            <el-table-column prop="priority" label="优先级"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <!-- <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-popover placement="right" width="250" trigger="click">
                  <qrcode
                    :value="`${shareBase}id=${scope.row.id}`"
                    tag="img"
                    :options="{ size: 250 }"
                  ></qrcode>
                  <p style="text-align: center;">微信扫描二维码</p>
                  <el-button size="mini" slot="reference" type="primary">预览</el-button>
                </el-popover>
              </template>
            </el-table-column>-->
          </el-table>
          <div class="result-box__page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="result1.page.pageNum"
              :page-sizes="[10, 20, 30]"
              :page-size="result1.page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="result1.page.total"
            ></el-pagination>
          </div>
        </div>
        <div class="result-content" v-show="activeIndex === 4">
          <div class="result-box__btn">
            <el-button size="small" type="primary" @click="addResult('Insert')">创建</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="result2.row.id === undefined"
              @click="addResult('Update')"
            >修改</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="result2.row.id === undefined || result2.row.isDefault"
              @click="deleteTip()"
            >删除</el-button>
            <el-button size="small" type="primary" @click="resultPage('result2Page')">刷新</el-button>
          </div>
          <el-table
            :data="result2.list"
            size="small"
            :height="resultBoxHeight"
            highlight-current-row
            @row-click="handleRow"
          >
            <el-table-column prop="sort" label="序号" width="50px" align="center"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="condition" label="条件"></el-table-column>
            <el-table-column label="推荐商品">
              <template slot-scope="scope">{{scope.row.showRecommendContent ? '有' : '无'}}</template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
              <!-- <template slot-scope="scope">
                <el-popover placement="right" width="250" trigger="click">
                  <qrcode
                    :value="`${shareBase}id=${scope.row.id}`"
                    tag="img"
                    :options="{ size: 250 }"
                  ></qrcode>
                  <p style="text-align: center;">微信扫描二维码</p>
                  <el-button size="mini" slot="reference" type="primary">预览</el-button>
                </el-popover>
              </template>-->
            </el-table-column>
          </el-table>
          <div class="result-box__page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="result2.page.pageNum"
              :page-sizes="[10, 20, 30]"
              :page-size="result2.page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="result2.page.total"
            ></el-pagination>
          </div>
        </div>
      </div>

      <image-dialog
        :visible="digImgWrap"
        uploadType="radio"
        imageType="null"
        @close-imgbox="closeImgbox"
        @get-imgsrc="onGetImgsrc"
      ></image-dialog>

      <relevance-dialog
        :visible="digFormWrap"
        :currentData="relevanceData"
        :currentIndex="relevanceIndex"
        :subjects="subjects"
        @close="handleRelevanceClose"
        @get-relevance="handleRelevance"
      ></relevance-dialog>

      <skips-dialog
        :visible="digFormSkips"
        :currentData="skipsData"
        :currentIndex="skipsIndex"
        :subjects="subjects"
        @close="handleSkipsClose"
        @get-skips="handleSkips"
      ></skips-dialog>

      <analysis-dialog
        :visible="digFormAnalysis"
        :optionIndex="analysisOptionIndex"
        :itemIndex="analysisItemIndex"
        :analysisData="analysisData"
        @close="handleAnalysisClose"
        @get-analysis="handleAnalysis"
      ></analysis-dialog>
    </div>
  </QcNavigationPage>
</template>

<script>
// import editor from "common/editor";
// import api from "api/common";
// import ImageDialog from "common/ImageDialog";
import preview from './preview'
import relevanceDialog from './relevance-dialog'
import skipsDialog from './skips-dialog'
import analysisDialog from './analysis-dialog'
import util from "@/assets/js/util";
// import Qrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    // editor,
    // ImageDialog,
    preview,
    relevanceDialog,
    skipsDialog,
    analysisDialog,
    // Qrcode,
  },
  data() {
    return {
      digFormWrap: false,
      digFormSkips: false,
      digFormAnalysis: false,
      loading: false,
      contentHeight: 0,
      subjectHeight: 0,
      digImgWrap: false,
      uploadType: 'radio',
      dataLoading: false,
      tabs: [
        { name: '基础设置', index: 1 },
        { name: '题目设置', index: 2 },
        { name: '结果设置', index: 3 },
      ],
      category: [],
      activeIndex: 1,
      model: {
        title: '',
        categoryId: '',
        showTitle: true,
        type: '',
        cover: '',
        description: '',
        content: 'content',
        buttonText: '立即测评',
        themeColor: '#ffd333',
        buttonColor: '#fff',
        posterBackground: '',
        paperType: this.$route.query.paperType,
      },
      optionsType: [
        {
          title: '个人信息',
          group: [
            { name: '姓名', icon: 'icon-xingming', value: 'name'},
            { name: '手机号码', icon: 'icon-dianhua', value: 'mobile'},
            { name: '性别', icon: 'icon-xingbie', value: 'gender'},
            { name: '出生年月', icon: 'icon-shijian', value: 'birth_ym'},
            { name: '省市', icon: 'icon-didian', value: 'province_city'},
          ]
        },
        {
          title: '题目类型',
          group: [
            { name: '单选', icon: 'icon-danxuan1', value: 'single_choice'},
            { name: '多选', icon: 'icon-danxuan', value: 'multi_choice'},
            { name: '填空', icon: 'icon-tiankong', value: 'fill_blank'},
            { name: '备注', icon: 'icon-xingxing3', value: 'remark'},
          ]
        },
      ],
      subjects: [],
      scrollTop: 0,
      cacheScrollTop: 0,
      imgObj: {
        imgType: '',
      },
      relevanceData: {},
      relevanceIndex: 0,
      skipsData: {},
      skipsIndex: 0,
      analysisOptionIndex: 0,
      analysisItemIndex: 0,
      analysisData: {},
      factorList: [],
      resultBoxHeight: 0,
      result1: {
        list: [],
        page: {
          pageNum: 0,
          pageSize: 10,
          total: 1,
        },
        row: {},
      },
      result2: {
        list: [],
        page: {
          pageNum: 0,
          pageSize: 10,
          total: 1,
        },
        row: {},
      },
      cacheFactorList: [],
      factorHeight: 0,
      factorLoading: false,
      // shareBase: `${this.base.baseHost}${this.base.projectName()}/test-paper/POUND/result?wo=1&wot=2&woacm=1&mpl=1&type=preview&`,
      updateTime: '',
      timer: null,
      // 备份编辑前的数据
      currentSubject: {}
    }
  },
  created() {
    // if(this.base.projectName() != 'detection' && this.$route.query.paperType === 'tool') 
    this.listCategory()
    if (this.$route.query.id) {
      this.dataLoading = true
      // this.paperGet()
      this.promiseAll()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      console.log('onresize')
      this.getHeight();
    };
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer)
      console.log('clearTimeout')
    }
  },
  methods: {
    getHeight() {
      this.contentHeight = window.innerHeight - 120 - 50
      this.subjectHeight = window.innerHeight - 120 - 100
      this.resultBoxHeight = this.contentHeight - 100
      this.factorHeight = this.contentHeight - 398
    },
    back() {
      if (history.length === 2) {
        let paper = this.$route.query.paperType === 'healthy' ? 'paper' : 'toolPaper'
        this.$router.push(`/main/${paper}/list`)
      } else {
        this.$router.back()
      }
    },
    // 切换tab
    handleTabClick(index) {
      if (this.activeIndex === index) return
      if (index > 1 && !this.$route.query.id) {
        this.$message.warning('请先完成基础设置')
        return
      } else if (index > 2 && this.subjects.length === 0) {
        this.$message.warning('请先完成题目设置')
        return
      } else if (index > 3 && this.result1.list.length === 0) {
        this.$message.warning('请先添加结果设置的结果')
        return
      }
      this.activeIndex = index
    },
    // 打开图片对话框
    openImgBox(type, questionIndex, optionIndex) {
      // this.uploadType = type;
      this.digImgWrap = true;
      this.imgObj.imgType = type;
      if (this.activeIndex == 2) {
        
        this.imgObj.questionIndex = questionIndex;
        this.imgObj.optionIndex = optionIndex;
      }
   },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
       if (this.activeIndex == 1) {
         this.model[this.imgObj.imgType] = val;
       } else if (this.activeIndex == 2) {
         let imgObj = this.imgObj;
         if (imgObj.imgType === "question") {
            this.subjects[imgObj.questionIndex].image = val;
         } else if (imgObj.imgType === "option") {
            this.subjects[imgObj.questionIndex].options[imgObj.optionIndex].image = val;
         }
       }
       console.log(this.subjects)
    },
    // 删除图片
    deleteImg(type, index, optionIndex) {
      if (type === 'option') {
        this.subjects[index].options[optionIndex].image = ''
      } else {
        this.subjects[index].image = ''
      }
    },
    // 获取编辑器内容
    getContent(content) {
      this.model.content = content;
    },
    listCategory() {
      this.$http.deteClassify({ type: 5 }).then(res => {
        this.category = res.data.data.list;
      });
     
    },
    promiseAll() {
      let paperGets={},subjectLists={}
      this.$http.detectionDetail({id: this.$route.query.id}).then(res => {
        console.log(res)
        paperGets = res;
        this.paperGet(res.data.data)
      });
      this.$http.subjectList({testPaperId: this.$route.query.id}).then(res => {
        console.log(res)
        subjectLists = res;
        res.data.data.map(item => {
            item.isSubmit = true
          })
        this.subjects = res.data.data
      });

      // Promise.all([paperGets, subjectLists]).then(result => {
      //   console.log('result', result)
      //   this.paperGet(result[0].data.data)
      //   // this.subjectList(result[1].data.data)
      //   let data = result[1].data.data
      //   if (data.length) {
      //     data.map(item => {
      //       item.isSubmit = true
      //     })
      //     this.subjects = data
      //     if (this.$route.query.type === 'insert') {
      //       this.$router.replace(`release?paperType=${this.model.paperType}&id=${this.model.id}`)
      //     }
      //   } else {
      //     this.$router.replace(`release?paperType=${this.model.paperType}&id=${this.model.id}&type=insert`)
      //   }
      // })
    },
    // 获取问卷详情
    paperGet(data) {
      this.model = data
      if (this.model.type === 'score') {
        this.getFactorList()
      }
      // this.subjectList(this.$route.query.id)
      this.resultPage('result1Page')
      this.resultPage('result2Page')
      this.dataLoading = false
      // this.getUpdateTime()
    },
    // 获取问卷最近更新时间
    getUpdateTime() {
      this.$http.getUpdateTime({id: this.$route.query.id}).then(res => {
        console.log(res.data.data)
        console.log('updateTime', this.updateTime)
        if (!this.updateTime || (this.updateTime === res.data.data)) {
          this.updateTime = res.data.data
          this.timer = setTimeout(() => {
            this.getUpdateTime()
          }, 10000)
        } else {
          this.$alert(`本题库已经于${res.data.data}被编辑过，需要刷新获取最新数据`, '提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              this.updateTime = ''
              this.dataLoading = true
              this.promiseAll()
            }
          });
        }
      })
    },
    // 提交问卷
    paperSubmit() {
      // this.$refs.editor.getContent()
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.$route.query.id ? 'updateDetection' : 'insertDetection')
        } else {
          this.$message.warning('请将基础信息填写完整')
        }
      })
    },
    // 保存/修改问卷
    saveModel(type) {
      console.log('type', type)
      this.$http[type](this.model).then(res => {
        console.log('saveModel', res.data)
        this.$message.success(res.data.message)
        this.loading = false
        if (type === 'insertDetection') {
          this.$router.replace(`release?id=${res.data.data}&type=insert&paperType=${this.$route.query.paperType}`)
          this.model.id = res.data.data
          // this.getUpdateTime()
        }
        this.activeIndex = 2
        this.updateTime = ''
      }).catch(()=>{
        this.loading = false
      })
      
    },

    // 分值列表
    getFactorList() {
      this.factorLoading = true
      this.$http.factorList({testPaperId: this.model.id}).then(res => {
        console.log('factorList', res.data)
        let list = res.data.data.map(item => {
          return {
            testPaperId: item.testPaperId,
            title: item.title,
            isPost: true,
            id: item.id
          }
        })
        this.factorList = []
        this.factorList = list
        this.cacheFactorList = JSON.parse(JSON.stringify(list))
        this.factorLoading = false
      })
    },
    // 添加分值
    addFactor() {
      if (this.factorList.length) {
        for (let i = 0; i < this.factorList.length; i++) {
          if (!this.factorList[i].title) {
            this.$message.warning('请将未输入分值项补充')
            return
          }
        }
      }
      this.factorList.push({
        testPaperId: this.model.id,
        title: '',
        isPost: false,
      })
    },
    // 填写分值
    handleFactor(e) {
      let index = Number(e.target.dataset.index)
      let item = this.factorList[index]
      console.log(item)
      if (!item.title) return
      if (item.isPost) {
        let cacheItem = this.cacheFactorList[index]
        if (item.title !== cacheItem.title) this.saveFactor(item, index, 'factorUpdate')
        
      } else {
        this.saveFactor(item, index, 'factorInsert')
      }
    },
    // 保存/修改分值
    saveFactor(item, index, type) {
      this.factorLoading = true
       this.$http[type](item).then(res => {
        console.log(type, res.data)
        if (type === 'factorInsert') this.factorList[index].isPost = true
        this.factorLoading = false
        this.getFactorList()
      }).catch(() => {
        this.factorLoading = false
      })
    },
    // 删除分值
    deleteFactor(item, index) {
      this.factorLoading = true
      this.$http.factorDelete({id: item.id}).then(res => {
        console.log('deleteFactor', res.data)
        this.checkSore(item.id)
        this.getFactorList()
        this.factorLoading = false
      }).catch((err) => {
        this.factorLoading = false
        this.$message.error('请先解除关联后再删除')
      })
    },
    // 删除分值后，将选项中选中的分值清除
    checkSore(id) {
      if (this.subjects.length === 0) return
      this.subjects.map(item => {
        if (item.options && item.options.length) {
          item.options.map(label => {
            if (label.subjectFactorId === id) label.subjectFactorId = ''
          })
        }
      })
    },


    // 选择题目类型添加
    handleChoiceType(type,title) {
      let len = this.subjects.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          if (!this.subjects[i].isSubmit) {
            this.$message.warning('请先完成当前题目编辑')
            return
          }
        }
      }

      this.subjects.push(this.createQuestion(type,title))
      console.log(this.subjects)
      this.$set(this.subjects[this.subjects.length - 1], 'isNew', true)
      this.currentSubject = this.subjects[this.subjects.length - 1]
      this.$nextTick(() => {
        setTimeout(() => {
          let groupHeight = this.$refs.group.offsetHeight
          if (groupHeight > this.contentHeight) {
            this.$refs.content.scrollTop = groupHeight - this.contentHeight + 50
          }
        }, 0)
      })

    },
    // 创建题目
    createQuestion(type,title) {
      let data =  {
        id: util.uuid(),
        title,
        type,
        image: '',
        sortNumber: this.subjects.length + 1,
        isSubmit: false,
        options: [],
      }
      if (type === 'single_choice' || type === 'multi_choice') {
        data.options.push(this.createOptions(1))
      } else if (type === 'gender') {
        data.options.push(this.createOptions(1, '男'))
        data.options.push(this.createOptions(2, '女'))
      }
      return data
    },
    // 创建选项
    createOptions(sortNumber, title) {
      return {
        title: title || '',
        image: '',
        sortNumber: sortNumber || 0,
        analysis: [],
        id: util.uuid(),
        subjectFactorId: '',
        subjectFactorPoint: '0',
      }
    },
    // 添加选项
    addOption(index, sortNumber) {
      console.log(sortNumber !== undefined)
      if (sortNumber !== undefined) {
        console.log('sortNumber')
        this.subjects[index].options.splice(sortNumber+1, 0, this.createOptions())
        this.subjects[index].options.map((item, i) => {
          item.sortNumber = i + 1
        })
      } else {
        let len = this.subjects[index].options.length
        this.subjects[index].options.push(this.createOptions(len+1))
      }
    },
    // 删除选项
    deleteOption(optionIndex, index) {
      if (this.subjects[index].options.length <= 1) {
        this.$message.warning('最少保留一个选项')
        return
      }
      this.subjects[index].options.splice(optionIndex, 1)
    },
    // 取消-还原数据
    handleCancel(index, state) {
      if (this.currentSubject.isNew) {
        this.deleteQuestion(index)
        return
      }
      // this.subjects.splice(index,1)
      // this.subjects.forEach((item,idx)=>{
      //   item.sortNumber = idx+1
      // })
      this.$set(this.subjects, index, this.currentSubject)
      console.log(this.subjects)
      this.handleSubmit(index, true)
    },
    // 题目编辑完成收起
    handleSubmit(index, state) {
      console.log( this.subjects)
      try {
      if (state) {
        let subject = this.subjects[index]
        if (!subject.title) {
          this.$message.warning('请填写标题文字')
          return 
        }
        if (subject.type === 'single_choice' || subject.type === 'multi_choice' || subject.type === 'gender') {
          for (let i = 0; i < subject.options.length; i++) {
            let item = subject.options[i]
            if (item.title === '' || item.title === undefined) {
              this.$message.warning('请填写选项文字')
              return
            }
            if(item.subjectFactorPoint=== '' || item.subjectFactorPoint === undefined){
                this.$message.warning(`请填写第${i+1}个选项的分值`)
                return
              }
          }
        }
      } else {
        for (let i = 0; i < this.subjects.length; i++) {
          let subject = this.subjects[i]
          if (!subject.title) {
            this.$message.warning(`请填写第${i+1}题标题文字`)
            return 
          }
          if (subject.type === 'single_choice' || subject.type === 'multi_choice' || subject.type === 'gender') {
            for (let i = 0; i < subject.options.length; i++) {
              let item = subject.options[i]
              if (item.title === '' || item.title === undefined) {
                this.$message.warning(`请填写第${i+1}题选项文字`)
                return
              }
              if(item.subjectFactorPoint=== '' || item.subjectFactorPoint === undefined){
                this.$message.warning(`请填写第${i+1}个选项的分值`)
                return
              }
            }
          }
          this.subjects[i].isSubmit = true
        }
      }
      if (!state) {
        this.$set(this.subjects[index], 'isNew', false)
        this.currentSubject = JSON.parse(JSON.stringify(this.subjects[index]))
      }
      this.subjects[index].isSubmit = state
      } catch (error) {
        console.log(error)
      }
    },
    // 删除题目
    deleteQuestion(index) {
      let id = this.subjects[index].id

      // 题目关联检查
      for (let i = 0; i < this.subjects.length; i++) {
        let item = this.subjects[i]
        if (item.relevance && i !== index) {
          for (let j = 0; j < item.relevance.subjects.length; j++) {
            if (item.relevance.subjects[j].id === id) {
              item.relevance.subjects[j].options
              this.subjects[index].options
              let h = []
              for (let k = 0; k < item.relevance.subjects[j].options.length; k++) {
                for (let l = 0; l < this.subjects[index].options.length; l++) {
                  if (item.relevance.subjects[j].options[k] === this.subjects[index].options[l].id) {
                    h.push(l+1)
                  }
                }
              }
              if (h.length) {
                this.$message.warning(`第${i+1}题关联于此题的第${h.join(',')}个选项，不能删除此题！`)
                return 
              }
            }
          }
        }
      }

      // 跳题逻辑检查
      for (let i = 0; i < this.subjects.length; i++) {
        let item = this.subjects[i]
        if (item.skips && item.skips.length) {
          for (let j = 0; j < item.skips.length; j++) {
            let skip = item.skips[j]
            if (skip.targetSubjectId === id) {
              for (let k = 0; k < item.options.length; k++) {
                if (item.options[k].id === skip.optionId) {
                  this.$message.warning(`第${i+1}题的第${j+1}个选项设置了跳转到此题，不能删除此题！`)
                  return 
                }
              }
            }
          }
        }
      }

      // 删除
      this.subjects.splice(index, 1)
      this.subjects.map((item, i) => {
        item.sortNumber = i+1
      })
    },
    // 复制题目
    handleCopy(item, i) {
      let data = JSON.parse(JSON.stringify(item))
      data.isSubmit = false
      data.id = util.uuid()
      if (data.relevance) data.relevance = null
      if (data.skips) data.skips = null
      if (data.options && data.options.length) {
        data.options.map(option => {
          option.id = util.uuid()
          // option.analysis = []
          // option.subjectFactorId = ''
          // option.subjectFactorPoint = ''
        })
      }
      this.subjects.splice(i+1, 0, data)
      this.subjects.map((item, i) => {
        item.sortNumber = i+1
        // item.id = util.uuid()
      })
      console.log(this.subjects)
    },
    // 移动题目提示
    handleMoveTip(index, type) {
      if (this.subjects[index].relevance) {
        this.$confirm('若移动本题，本题题目关联将被清除，是否继续？', '提示').then(() => {
          this.handleMove(index, type)
        }).catch(() => {})
      } else if (this.subjects[index].skips) {
        this.$confirm('若移动本题，本题跳题逻辑将被清除，是否继续？', '提示').then(() => {
          this.handleMove(index, type)
        }).catch(() => {})
      } else {
        this.handleMove(index, type)
      }
    },
    // 移动题目
    handleMove(index, type) {
      if (this.subjects.length <= 1) return

      if (type === 'prev') {
        if (index === 0) return
        this.subjects = this.swapArray(this.subjects, index-1, index)
        console.log(this.subjects)
      } else if (type === 'next') {
        if (this.subjects.length - 1 === index) return
        this.subjects = this.swapArray(this.subjects, index, index+1)
        console.log(this.subjects)
      } else if (type === 'before') {
        if (index === 0) return
        let moveNum = index - 0;

        for (let i = 0; i < moveNum; i++) {
          this.swapArray(this.subjects, index, index - 1)
          index--
        }
      } else if (type === 'after') {
        if (this.subjects.length - 1 === index) return
        var moveNum = this.subjects.length - 1 - index

        for (let i = 0; i < moveNum; i++) {
         this.swapArray(this.subjects, index, index + 1)
          index++
        }
      }

      this.subjects.map((item, i) => {
        item.sortNumber = i+1
      })
    },
    // 移动选项
    moveOption(type, optionIndex, index) {
      let options = this.subjects[index].options
      let len = options.length
      
      console.log(type, optionIndex, index)
      if (type === 'prev') {
        if (optionIndex === 0) {
          this.$message.warning('不可移动第一个选项')
          return
        }
        // this.subjects[index].options = this.swapArray(options, optionIndex-1, optionIndex)
        this.$set(this.subjects[index], 'options', this.swapArray(options, optionIndex-1, optionIndex))
      } else if (type === 'next') {
        if (len - 1 === optionIndex) {
          this.$message.warning('不可移动最后一个选项')
          return
        }
        // this.subjects[index].options = this.swapArray(options, optionIndex, optionIndex+1)
        this.$set(this.subjects[index], 'options', this.swapArray(options, optionIndex, optionIndex+1))
      } else {
        this.$message.warning('未知类型')
      }
      console.log(this.subjects[index].options)
    },
    // 交换数组
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },

    // 添加题目关联
    addRelevance(i) {
      if (i === 0) {
        this.$message.warning('第1题不能设置题目关联')
        return
      }
      console.log(this.subjects[i])
      if (!this.subjects[i].title) {
        this.$message.warning('请填写标题文字')
        return
      }
      this.relevanceData = this.subjects[i]
      this.relevanceIndex = i
      this.digFormWrap = true
    },
    // 关闭题目关联窗口
    handleRelevanceClose() {
      this.digFormWrap = false
    },
    // 获取题目关联数据
    handleRelevance(relevance, index) {
      console.log('handleRelevance', relevance)
      if (relevance.subjects.length === 0) {
        if (this.subjects[index].relevance) this.subjects[index].relevance = null
      } else {
        this.subjects[index].relevance = relevance
      }
    },

    // 添加跳题逻辑
    addSkips(i) {
      this.skipsData = this.subjects[i]
      this.skipsIndex = i
      this.digFormSkips = true
    },
    // 关闭跳题逻辑窗口
    handleSkipsClose() {
      this.digFormSkips = false
    },
    // 获取跳题逻辑数据
    handleSkips(skips, index) {
      console.log('skips', skips)
      if (skips.length === 0) {
        if (this.subjects[index].skips) this.subjects[index].skips = null
      } else {
        this.subjects[index].skips = skips
      }
    },

    // 添加解析
    addAnalysis(item, optionIndex, itemIndex) {
      if (!item.title) {
        this.$message.warning('请输入选项文字')
        return
      }
      this.analysisOptionIndex = optionIndex
      this.analysisItemIndex = itemIndex
      this.analysisData = item
      this.digFormAnalysis = true
    },
    // 关闭解析窗口
    handleAnalysisClose() {
      this.digFormAnalysis = false
    },
    // 获取解析数据
    handleAnalysis(item, optionIndex, itemIndex) {
      this.subjects[itemIndex].options[optionIndex].analysis = item
    },

    // 获取题目列表
    subjectList(id) {
      this.$http.subjectList({testPaperId: id}).then(res => {
        console.log(res.data)
        if (res.data.data.length) {
          res.data.data.map(item => {
            item.isSubmit = true
          })
          this.subjects = res.data.data
          if (this.$route.query.type === 'insert') {
            this.$router.replace(`release?paperType=${this.model.paperType}&id=${this.model.id}`)
          }
        } else {
          this.$router.replace(`release?paperType=${this.model.paperType}&id=${this.model.id}&type=insert`)
        }
      })
    },
    // 提交题目
    subjectSubmit() {
      console.log(this.subjects)
      this.loading = true
      this.saveSubject(this.$route.query.type === 'insert' ? 'subjectInsert' : 'subjectUpdate')
    },
    // 保存/修改题目
    saveSubject(type) {
      this.$http[type]({subjects: this.subjects, testPaperId: this.model.id}).then(res => {
        this.$message.success('题目' + res.data.message)
        this.subjectList(this.$route.query.id)
        if (type === 'subjectInsert') {
          this.$router.replace(`release?id=${this.model.id}&paperType=${this.model.paperType}`)
        }
        this.activeIndex = 3
        this.loading = false
        this.updateTime = ''
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.data.message)
      })
    },


    // 结果
    handleSizeChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      let data = this.activeIndex === 3 ? 'result1' : 'result2'
      this[data].page.pageSize = val;
      this[data].page.pageNum = 1;
      this.resultPage(this.activeIndex === 3 ? 'result1Page' : 'result2Page');
    },
    handleCurrentChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      let data = this.activeIndex === 3 ? 'result1' : 'result2'
      this[data].page.pageNum = val;
      this.resultPage(this.activeIndex === 3 ? 'result1Page' : 'result2Page');
    },
    resultPage(type) {
      let data = type === 'result1Page' ? 'result1' : 'result2'
      this.$http[type]({testPaperId: this.model.id, ...this[data].page}).then(res => {
        console.log(type, res.data)
        // let data = type === 'result1Page' ? 'result1' : 'result2'
        this[data].list = res.data.data.list
        this[data].page.pageNum = res.data.data.pageNum
        this[data].page.total = res.data.data.total
        this[data].row = {}
        if (type === 'result2Page' && res.data.data.total && this.tabs.length === 3) {
          this.addSecondResult()
        }
      })
    },
    // 选中结果
    handleRow(row) {
      let data = this.activeIndex === 3 ? 'result1' : 'result2'
      this[data].row = row
    },
    // 添加/修改结果
    addResult(val) {
      let type = this.model.type === 'combination' ? 'Combo' : 'Score'
      let resultType = this.activeIndex === 3 ? 'result1' : 'result2'

      // let routeData = this.$router.resolve({ 
      //   path: 'release/result-edit', 
      //   query: { 
      //     testPaperId: this.model.id,
      //     id: this[resultType].row.id,
      //     resultType: resultType,
      //     type: type,
      //     update: val,
      //     paperType: this.$route.query.paperType
      //   } 
      // })
      // window.open(routeData.href, '_blank')

      this.$router.push({ 
        path: './result-edit', 
        query: { 
          testPaperId: this.model.id,
          id: this[resultType].row.id,
          resultType: resultType,
          type: type,
          update: val,
          paperType: this.$route.query.paperType
        } 
      })
    },
    // 添加副结果
    addSecondResult(val) {
      if (val === 2) {
        if (this.result2.list.length) {
          this.$confirm('是否删除所有结果二设置？', '提示').then(() => {
            this.deleteAllVice()
          }).catch(() => {})
        } else {
          this.tabs.splice(3,1)
          this.handleTabClick(1)
        }
        
      } else {
        this.tabs.push({
          name: '结果二设置', index: 4
        })
        if (val === 1) this.resultPage('result2Page')
      }
    },
    deleteAllVice() {
      this.$http.deleteAllVice({testPaperId: this.$route.query.id}).then(res => {
        console.log(res.data.message)
        this.tabs.splice(3,1)
        this.handleTabClick(1)
        this.resultPage('result2Page')
      })
    },
    deleteTip() {
      this.$confirm('是否删除该结果？', '提示').then(() => {
        this.deleteResult()
      }).catch(() => {})
    },
    deleteResult() {
      let data = this.activeIndex === 3 ? 'result1' : 'result2'
      this.$http.deleteResult({id: this[data].row.id}).then(res => {
        this.$message.success(res.data.message)
        this.resultPage(this.activeIndex === 3 ? 'result1Page' : 'result2Page')
      })
    }
  },
  filters: {
    questionType(val) {
      if (val === "") return "";
      switch (val) {
        case 'single_choice':
          return "单选";
        case 'multi_choice':
          return "多选";
        case 'fill_blank':
          return "填空";
        case 'remark':
          return "备注";
        case 'name':
          return "姓名";
        case 'gender':
          return "性别";
        case 'birth_ym':
          return "年月";
        case 'province_city':
          return "省市";
        case 'mobile':
          return "手机号码";
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background: rgb(241, 244, 246);
  height: 50px;
  align-items: center;
  position: relative;
  &_back {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
  }
  &__item {
    padding: 0 15px;
    color: #909399;
    cursor: pointer;
    line-height: 50px;
    &:hover {
      color: #000;
    }
  }
  .is-active {
    background: #fff;
    color: #000;
  }
  &__plus {
    width: 30px;
    height: 30px;
    background: rgb(234, 234, 234);
    color: rgb(192, 192, 192);
    text-align: center;
    line-height: 30px;
    margin: 0 10px;
    border-radius: 3px;
    cursor: pointer;
    .iconfont {
      font-size: 18px;
    }
  }
}
.tab-content__box {
  overflow: auto;
}
.tab-content2 {
  // padding-bottom: 50px;
  display: flex;
  height: 100%;
  .question-left {
    padding: 20px;
    width: 200px;
    flex-shrink: 0;
    &__item {
      margin-bottom: 20px;
      &__title {
        font-weight: bold;
        margin-bottom: 20px;
      }
      &__group {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 50%;
          padding: 5px 8px;
          box-sizing: border-box;
          cursor: pointer;
          font-size: 14px;
          &:hover {
            background: #f5f5f5;
          }
          .iconfont {
            color: rgb(49, 168, 255);
            font-size: 14px;
          }
        }
      }
      &__factor {
        &-input {
          position: relative;
          padding: 5px 0;
          display: flex;
          align-items: center;
          input {
            padding-right: 25px;
          }
          .iconfont {
            // position: absolute;
            // right: 8px;
            // top: 50%;
            // transform: translateY(-50%);
            color: rgb(157, 157, 157);
            font-size: 12px;
            margin-left: 9px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  .line {
    width: 10px;
    background: rgb(241, 244, 246);
    height: 100%;
  }
  .blank {
    text-align: center;
    width: 100%;
    padding-top: 100px;
    color: rgb(119, 119, 119);
  }
  .question-right {
    width: 100%;
    &__item {
      padding: 30px 30px 50px 30px;
      position: relative;
      // max-width: 800px;
      box-sizing: border-box;
      .tag {
        position: absolute;
        transform: translateX(-100%);
        left: 830px;
        top: 30px;
        background: rgb(102, 102, 102);
        color: #fff;
        padding: 5px 10px 5px 15px;
        font-size: 14px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        line-height: 1;
        white-space: nowrap;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 30px;
        right: 0;
        border-top: 1px solid rgb(233, 233, 233);
      }
      &:first-child {
        &::before {
          border: 0;
        }
      }
      &-title {
        max-width: 740px;
        font-weight: bold;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .question-right__item-img {
          width: 100px;
          overflow: hidden;
          line-height: 0;
          margin-left: 10px;
          img {
            width: 100%;
          }
        }
      }
      &-edit-box {
        margin-top: 25px;
        border: 1px solid rgb(233, 233, 233);
        border-radius: 5px;
        position: relative;
        padding: 15px;
        background: rgb(250, 250, 250);
        width: 800px;
        box-sizing: border-box;
        .arrow {
          width: 15px;
          height: 15px;
          background: rgb(250, 250, 250);
          border-top: 1px solid rgb(233, 233, 233);
          border-left: 1px solid rgb(233, 233, 233);
          position: absolute;
          top: -8px;
          left: 100px;
          transform: rotateZ(45deg);
          box-sizing: border-box;
        }
        .title-box {
          background: rgb(232, 232, 232);
          display: flex;
          padding: 5px;
          justify-content: space-between;
          margin-bottom: 10px;
          .picture {
            width: 70px;
            flex-shrink: 0;
            box-sizing: border-box;
            margin: 0 15px;
          }
        }
        .edit {
          display: flex;
          align-items: center;
          .upload-img {
            width: 70px;
            flex-shrink: 0;
            margin: 0 15px;
            box-sizing: border-box;
            max-height: 50px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
          }
          .show-delete {
            .el-icon-delete {
              display: none;
            }
            &:hover {
              .img-mask {
                background: rgba(0, 0, 0, 0.3);
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s;
                cursor: pointer;
              }
              .el-icon-delete {
                display: block;
                color: #000;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                font-size: 24px;
              }
            }
          }
        }
        .options-box {
          margin-top: 20px;
          .options-box__table {
            width: 100%;
            table {
              width: 100%;
            }
            table th {
              background: rgb(232, 232, 232) !important;
              color: #000;
            }
            .option-img {
              width: 30px;
              height: 30px;
              margin: 0 auto;
              overflow: hidden;
              line-height: 0;
              position: relative;
              cursor: pointer;
              img {
                width: 100%;
              }
            }
            .show-delete {
              &:hover {
                .img-mask {
                  cursor: pointer;
                  background: rgba(0, 0, 0, 0.3);
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  transition: all 0.3s;
                }
                .el-icon-delete {
                  color: #000;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 1;
                }
              }
            }
          }
        }
        .setting {
          border: 1px dashed rgb(216, 216, 216);
          background: rgb(244, 244, 244);
          margin: 30px 0;
          padding: 10px;
          &__title {
            font-weight: bold;
            margin: 0 !important;
            text-decoration: none !important;
            color: rgb(39, 39, 39) !important;
            cursor: default !important;
          }
          span {
            text-decoration: underline;
            margin-left: 15px;
            color: rgb(112, 112, 112);
            cursor: pointer;
          }
        }
        .question-right__item-btn {
          display: flex;
        }
      }
      &-btn-box {
        position: absolute;
        bottom: 15px;
        left: 30px;
        display: none;
      }
    }
    .submit-item {
      &:hover {
        background: rgba(0, 0, 0, 0.03);
        .question-right__item-btn-box {
          display: block;
        }
      }
    }
  }
}
.tab-content {
  // padding-bottom: 50px;
  padding: 20px 20px 70px 20px;
}
.result-content {
  position: relative;
  .result-box__btn {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
  }
  .result-box__page {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
.bottom-btn {
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #e7eaec;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1111;
}

.q-icon {
  font-size: 18px;
  color: rgb(157, 157, 157);
}

.option-color {
  color: rgb(49, 168, 255);
}
</style>
