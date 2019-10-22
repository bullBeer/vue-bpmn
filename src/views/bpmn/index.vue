<template>
  <div class="bpmn-container">
    <div class="bpmn-view"></div>
    <bpmn-panel :class="{disabled: !propertieListLength || panelDisabled}" :form="form" :options="currentFormOptions"></bpmn-panel>
    <!-- <ul class="io-zoom io-control io-control-list">
      <li>
        <button title="zoom in" jsaction="click:bio.zoomIn">
          <span class="icon-plus">+</span>
        </button>
      </li>
      <li>
        <hr/>
      </li>
      <li>
        <button href title="zoom out" jsaction="click:bio.zoomOut">
          <span class="icon-minus">-</span>
        </button>
      </li>
    </ul> -->
    <div class="ft-btns">
      <el-button type="primary" size="small">保存</el-button>
      <el-button size="small" @click="saveBpmnXML">导出</el-button>
    </div>
  </div>
</template>

<script>
import Modeler from '@/libs/bpmn/bpmn-modeler.development.js'
import customTranslate from  '@/libs/bpmn-i18n/customTranslate/customTranslate'
import bpmnXML from '@/libs/bpmn/newDiagramXML'
import bpmnPanel from './components/bpmnPanel'

export default {
  name: 'home',
  data() {
    return {
      bpmnModel: null,
      // 当前节点表单类型配置
      currentFormOptions: [],
      // 不同类型表单配置
      formOptions: {
        // 节点类型
        'shape': [
          {
            type: 'input',
            title: '名称',
            prop: 'name',
            value: ''
          },
          {
            type: 'select',
            title: '处理类型',
            prop: 'disposeType',
            value: '',
            options: [
              {label: '处理类型1', value: '1'},
              {label: '处理类型2', value: '2'},
              {label: '处理类型3', value: '3'},
            ],
          },
          {
            type: 'select',
            title: '处理人',
            prop: 'assignee',
            value: '',
            options: [
              {label: '处理人1', value: '1'},
              {label: '处理人2', value: '2'},
              {label: '处理人3', value: '3'},
            ],
          },
          {
            type: 'select',
            title: '知会',
            prop: 'receiver',
            value: '',
            options: [
              {label: '知会1', value: '1'},
              {label: '知会2', value: '2'},
              {label: '知会3', value: '3'},
            ],
          },
          {
            type: 'select',
            title: '任务类型',
            prop: 'taskType',
            value: '',
            options: [
              {label: '任务类型1', value: '1'},
              {label: '任务类型2', value: '2'},
              {label: '任务类型3', value: '3'},
            ],
          },
          {
            type: 'select',
            title: '表单字段',
            prop: 'field',
            value: '',
            options: [
              {label: '表单字段1', value: '1'},
              {label: '表单字段2', value: '2'},
              {label: '表单字段3', value: '3'},
            ],
          },
          {
            type: 'input',
            title: '流传条件',
            prop: 'spreadDesc',
            value: ''
          }
        ],
        // 节点文本注释
        'bpmn:TextAnnotation': [
          {
            type: 'input',
            title: '节点注释',
            prop: 'text',
            value: ''
          }
        ],
        // 关联线条
        'bpmn:SequenceFlow': [
          {
            type: 'input',
            title: '名称',
            prop: 'name',
            value: ''
          }
        ],
        // 文本注解线条
        'bpmn:Association': [
          {
            type: 'input',
            title: '名称',
            prop: 'name',
            value: ''
          }
        ]
      },
      form: {},
      // 节点属性
      properties: null,
      // 生成的节点元素属性存放列表: 元素id => 元素属性
      propertieList: {},
      // 当前节点id
      currentElId: null,

      panelDisabled: false,

    }
  },
  computed: {
    propertieListLength() {
      return Object.keys(this.propertieList).length;
    }
  },
  created() {
    // 初始化表单面板
    this.currentFormOptions = this.formOptions['shape'];
    this.currentFormOptions.forEach(item => {
      this.$set(this.form, item.prop, item.value);
    })
  },
  mounted() {
    this.initBpmn();
    
  },
  watch: {
    form: {
      handler(properties) {
        if (this.currentElId) {
          this.setShapeProperties(this.currentElId, properties)
        }
      },
      deep: true
    }
  },
  methods: {
    // 根据不同类型表单创建节点属性
    createProperties(formOptions) {
      const properties = {};
      formOptions.forEach(item => {
        properties[item.prop] = item.value;
      })
      return properties;
    },
    // 初始化
    initBpmn() {
      this.bpmnModel = new Modeler({
        container: '.bpmn-view',
        additionalModules: [
          {
            // 汉化
            translate: [ 'value', customTranslate]
          }
        ]
      });
      this.bpmnModel.importXML(bpmnXML, err => {
        if (err) {
          console.log('error rendering', err);
        } else {
          console.log('we are good!');
        }
      });
      const eventBus = this.bpmnModel.get('eventBus');
      // 事件监听
      eventBus.on('shape.changed', e => {
        console.log('shape.changed ',e)
      })
      // 点击元素|自动选中
      eventBus.on(['element.click', 'autoPlace.end'], evt => {
        console.log('点击元素|自动选中: ', evt);
        this.panelDisabled = false;
        setTimeout(() => {
          const element = (evt.element || evt.shape);
          const id = element.businessObject.id;
          if (this.propertieList[id]) {
            this.currentBusinessObject = element.businessObject;
            this.updateCurrentOptions(element.type);
            this.updateForm(id);
          }
        }, 0)
      })
      // 节点文本编辑完成
      eventBus.on('directEditing.complete', () => {
        // 更新表单
        const currentBusinessObject = this.currentBusinessObject;
        if (currentBusinessObject) {
          const id = currentBusinessObject.id;
          if ('text' in currentBusinessObject) {
            this.propertieList[id].text = currentBusinessObject.text;
          } else {
            this.propertieList[id].name = currentBusinessObject.name;
          }
          this.updateForm(id);
        }
      })
      // 删除元素
      eventBus.on(['element.remove', 'connection.remove'], evt => {
        console.log('删除元素: ', evt.element.businessObject.id)
        this.$delete(this.propertieList, evt.element.businessObject.id);
        this.panelDisabled = true;
      })
      // 新增元素
      eventBus.on('element.add', evt => {
        console.log('添加元素: ', evt)
        this.panelDisabled = false;
        // setTimeout处理无法确定dom创建完成
        setTimeout(() => {
          const id = evt.element.businessObject.id;
          if (!this.propertieList[id]) {
            this.updateCurrentOptions(evt.element.type, formOptions => {
              this.$set(this.propertieList, id, this.cloneJSON(this.createProperties(formOptions)))
            });
            this.updateForm(id);
          }
        }, 0)
      })
    },
    // 设置节点属性
    setShapeProperties(shapeId, options) {
      const modeling = this.bpmnModel.get('modeling');
      const shape = this.bpmnModel.get('elementRegistry').get(shapeId);
      modeling.updateProperties(shape, options);
    },

    // 更新表单
    updateForm(elementId) {
      this.form = this.propertieList[elementId];
      this.currentElId = elementId;
    },

    // 更新当前节点对应表单配置
    updateCurrentOptions(type, handler) {
      switch(type) {
        // 节点注释
        case 'bpmn:TextAnnotation':
          this.currentFormOptions = this.formOptions[type];
          handler && handler(this.formOptions[type]);
          break;
        // 节点名称
        case 'bpmn:SequenceFlow':
          this.currentFormOptions = this.formOptions[type];
          handler && handler(this.formOptions[type]);
          break;
        case 'bpmn:Association':
          this.currentFormOptions = this.formOptions[type];
          handler && handler(this.formOptions[type]);
          break;
        default:
          this.currentFormOptions = this.formOptions['shape'];
          handler && handler(this.formOptions['shape']);
      }
    },

    cloneJSON(json) {
      return JSON.parse(JSON.stringify(json))
    },

    // 保存bpmnXML
    saveBpmnXML() {
      this.bpmnModel.saveXML({ format: true }, (err, xml) => {
        if (err) {
          return console.error('could not save BPMN 2.0 diagram', err);
        }
        console.log('DIAGRAM', xml);
      });
    },
  },
  components: {
    bpmnPanel
  }
}
</script>


<style lang="less" scoped>
@import './less/index.less';
</style>
