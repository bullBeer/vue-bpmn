<template>
  <div class="bpmn-panel">
    <h4 class="panel-header">节点信息</h4>
    <el-form label-position="top" :model="iForm">
      <div v-for="(formItem, itemIndex) in options" :key="itemIndex">
        <el-form-item :label="formItem.title" v-if="formItem.type === 'input'">
          <el-input size="mini" v-model="iForm[formItem.prop]" :placeholder="`请输入${formItem.title}`"></el-input>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'select'">
          <el-select size="mini" v-model="iForm[formItem.prop]" :placeholder="`请选择${formItem.title}`">
            <el-option :label="optionItem.label" :value="optionItem.value" v-for="(optionItem, optionIndex) in formItem.options" :key="optionIndex"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'bpmnPanel',
    props: {
      // 配置参数
      options: {
        default() {
          return [
          //   {
          //     title: '表单名称', // 表单名
          //     prop: 'name', // 表单字段
          //     type: 'input', // 表单类型
          //     value: '', // 表单字段值
          //     options: [{ // select类型表单选项
          //       value: '', // 字段值
          //       label: '' // 字段名
          //     },
          //   ],
          // }
        ]},
      },
      // 表单数据
      form: {
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        iForm: {}
      };
    },
    watch: {
      form(form) {
        this.iForm = form;
      }
    },
    created() {
      // 初始化
      this.options.forEach(item => {
        this.$set(this.iForm, item.prop, item.value)
      })
    },
    methods: {
      
    }
  }
</script>

<style lang="less" scoped>
.bpmn-panel {
  text-align: left;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 260px;
  z-index: 10;
  border-left: 1px solid #ccc;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  &.disabled{
    cursor: not-allowed;
    &:after{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255,255,255,0.5);
    }
  }
  .panel-header{
    font-size: 16px;
    padding: 10px;
    border-bottom: 1px solid #dfdfdf;
  }
  /deep/.el-form-item__label{
    color: #333;
    font-size: 12px;
    padding: 0;
    line-height: 24px;
  }
  /deep/.el-input__inner{
    padding: 0 10px;
  }
  /deep/.el-select{
    display: block;
  }
  .el-form{
    padding: 10px;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
}
</style>
