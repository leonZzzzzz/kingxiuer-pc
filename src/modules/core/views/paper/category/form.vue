<template>
<el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top" size="small">
      <el-form-item class="item-text">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.name" maxlength="32" placeholder="建议4字内（不超过32字）"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input-number v-model="model.seqNum"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="代码" prop="code" :rules="[{ required: false, message: '该字段不能为空'}]">
          <el-input v-model="model.code"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="说明" prop="info">
          <el-input v-model="model.info" maxlength="32" placeholder="建议12字内（不超过32字）"></el-input>
        </el-form-item> -->
      </el-form-item>
      <!-- <el-form-item label="图标" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <p class="img-tips">建议尺寸：60*60</p>
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.iconUrl" :src="`${imgHost}${model.iconUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
  <image-dialog :visible="digImgWrap" uploadType="radio" imageType='actType' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
</el-dialog>
</template>

<script>
import ImageDialog from "common/ImageDialog";
import api from "api/common.js";

export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    },
    categoryParent: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    ImageDialog
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: "",
        code: "",
        iconUrl: "",
        info: "",
        seqNum: 0,
        type: 5,
        // parentId: ""
      },
      loading: false,
      dataLoading: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        // this.model.type = this.categoryParent.type;
        // this.model.parentId = this.categoryParent.id;
        console.log(this.model)
        // console.log(this.categoryParent)
        if (this.id != "") {
          this.dataLoading = true;
          this.detail();
        }
      }
    }
  },
  methods: {
    //获取
    detail() {
      api.getCategory({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .addCategory(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //修改
    update() {
      api
        .updateCategory(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.update();
          } else {
            this.save();
          }
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.model = this.reduc();
      this.$emit("close", flag);
    },
    reduc() {
      let model = {
        name: "",
        code: "",
        iconUrl: "",
        info: "",
        seqNum: 0,
        type: 1,
        // parentId: "40914b72bc094ae18646f607e1cbb2fd"
      }
      return model
    },
    // 打开图片对话框
    openImgBox() {
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.iconUrl = val;
    }
  }
};
</script>

