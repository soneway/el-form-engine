<template>
  <el-col
    :span="span">
    <el-form-item
      v-bind="schema.itemProps"
      :class="_class"
      :style="_style"
      :prop="itemProp"
      :rules="rules"
      :label-width="schema.labelWidth"
      :label="label">

      <RenderCell
        v-if="typeof schema.render === 'function'"
        :schema="schema"
        :keyName="keyName"
        :supKeyName="supKeyName"
        :value="value"
        :render="schema.render">
      </RenderCell>

      <template v-else>
        <el-input
          v-bind="props"
          v-if="isInput"
          v-model="value[keyName]"
          :type="type"
          :maxlength="maxlength"
          :readonly="readonly"
          :disabled="disabled"
          :placeholder="placeholder">
        </el-input>

        <el-radio-group
          v-bind="props"
          v-if="type === 'radio'"
          v-model="value[keyName]"
          :disabled="disabled || readonly">
          <el-radio
            v-bind="item.props"
            v-for="(item, index) in options"
            :label="item.value"
            :key="index">
            {{ item.label }}
          </el-radio>
        </el-radio-group>

        <el-checkbox-group
          v-if="type === 'checkbox'"
          :value="value[keyName] || []"
          @input="(val) => value[keyName] = val"
          :readonly="readonly"
          :disabled="disabled">
          <el-checkbox
            v-bind="item.props"
            v-for="(item, index) in options"
            :label="item.value"
            :key="index">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>

        <el-select
          v-bind="props"
          v-if="type === 'select'"
          v-model="value[keyName]"
          :disabled="disabled || readonly"
          :placeholder="placeholder"
          :multiple="schema.multiple">
          <el-option
            v-for="(item, index) in options"
            :value="item.value"
            :label="item.label"
            :key="index">
            <RenderCell
              v-if="typeof item.render === 'function'"
              :render="item.render"
              :options="options"
              :index="index">
            </RenderCell>
          </el-option>
        </el-select>

        <el-switch
          v-bind="props"
          v-if="type === 'boolean'"
          v-model="value[keyName]"
          :disabled="disabled || readonly">
        </el-switch>

        <div
          v-if="type === 'object'"
          class="object-wrapper"
          :class="{ expand: this.expand }">
          <i
            class="object-toggle-icon el-icon-caret-bottom"
            @click="onToggleClick">
          </i>
          <form-editor-item
            v-for="(item, key) in fields"
            :item-span="24"
            :class="_objectClass"
            :schema="item"
            v-model="objectModel"
            :sup-key-name="itemProp"
            :key="key"
            :key-name="key">
          </form-editor-item>
        </div>

        <div
          v-if="type === 'array'"
          class="array-wrapper">
          <form-editor-item
            v-for="(_, index) in arrayModel"
            :item-span="24"
            :class="_arrayClass"
            :schema="arraySchema"
            v-model="arrayModel"
            :sup-key-name="itemProp"
            :key="index"
            :key-name="index">
            <i
              :title="langMap.deleteItem"
              class="array-delete-icon el-icon-circle-close"
              @click="onItemDeleteClick(index)">
            </i>
          </form-editor-item>
          <i
            class="add-icon el-icon-circle-plus-outline"
            @click="onItemAddClick"> {{ langMap.addItem }}
          </i>
        </div>

        <el-date-picker
          v-bind="props"
          v-if="isDatepicker"
          v-model="value[keyName]"
          :type="type"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled">
        </el-date-picker>

        <el-time-picker
          v-bind="props"
          v-if="isTimepicker"
          v-model="value[keyName]"
          :is-range="type === 'timerange'"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled">
        </el-time-picker>
      </template>

      <slot></slot>

    </el-form-item>
  </el-col>
</template>

<script>
  import Emitter from 'utils-lib/dist/emitter'
  import types from './types'
  import { getReactValue } from 'utils-lib/dist/vue'
  import RenderCell from '../render-cell'
  import $bus from '../../scripts/utils/bus'
  import { getDepConfig } from '../../scripts/utils/helper'
  import lang from '../form-editor/lang'

  const name = 'form-editor-item'

  export default {
    name,
    components: {
      RenderCell,
    },
    mixins: [
      Emitter,
    ],
    inject: [
      'formEditor',
    ],
    props: {
      schema: Object,
      keyName: [String, Number],
      supKeyName: String,
      value: [Object, Array],
      itemSpan: Number,
    },
    data () {
      return {
        expand: this.getExpand(),
        props: this.schema.props || {},
        // 依赖校验规则
        curDepRules: [],
        // 依赖禁用
        depDisabled: undefined,
        // 依赖只读
        depReadonly: undefined,
        // 依赖隐藏
        depHidden: false,
      }
    },
    computed: {
      _class () {
        return [
          name,
          `${name}-${this.type}`,
        ]
      },
      _style () {
        return {
          display: this.depHidden ? 'none' : null,
        }
      },
      _objectClass () {
        return [
          `${name}-object`,
        ]
      },
      _arrayClass () {
        return [
          `${name}-array`,
        ]
      },

      itemProp () {
        const { supKeyName, keyName } = this
        return [supKeyName, keyName]
          .filter((item) => item !== undefined)
          .join('.')
      },

      // 语言
      langMap () {
        return lang[this.formEditor.lang] || lang.en
      },

      // 数据类型
      type () {
        const { schema: { type } } = this
        // 判断类型
        if (types.indexOf(type) !== -1) return type
        // 默认类型
        return 'text'
      },
      // 显示文本
      label () {
        const { schema, keyName } = this
        const label = schema.label || keyName

        // 数组label返回undefined
        if (typeof label === 'number') return

        return label
      },
      // 输入占位符
      placeholder () {
        const { schema: { placeholder }, type, label } = this

        if (placeholder) {
          return placeholder
        }

        const selectTypes = ['select']
        if (selectTypes.includes(type) || this.isDatepicker) {
          return `${this.langMap.pleaseSelect}${label}`
        }

        return `${this.langMap.pleaseInput}${label}`
      },
      // 校验规则
      rules () {
        const { schema: { rules = [] }, curDepRules = [], depHidden } = this

        // 如果被隐藏了不作校验
        if (depHidden) return

        // rules为空
        const mergeRules = [...rules, ...curDepRules]
        if (!mergeRules.length) return

        return mergeRules.map((item) => {
          // 非空校验
          if (item.required) {
            // message为空时,优化message
            if (!item.message) {
              return { ...item, message: `${this.label}${this.langMap.isRequired}` }
            }
          }
          // 正则
          if (item.pattern) {
            return { ...item, pattern: new RegExp(item.pattern) }
          }
          return item
        })
      },

      // 依赖校验规则
      depRules () {
        return this.schema.depRules
      },
      // 依赖样式
      depStyles () {
        return this.schema.depStyles
      },

      // 对象的值
      objectModel () {
        if (this.type !== 'object') return
        return getReactValue(this.value, this.keyName, {})
      },
      // 数组的值
      arrayModel () {
        if (this.type !== 'array') return
        return getReactValue(this.value, this.keyName, [])
      },

      // 对象/数据对象属性集
      fields () {
        return this.schema.fields
      },
      // 选择元素选项
      options () {
        return this.schema.options
      },
      maxlength () {
        return this.schema.maxlength || undefined
      },
      // 数组schema
      arraySchema () {
        const { schema: { expand }, fields } = this
        return { type: 'object', fields, expand }
      },

      // 是否输入框
      isInput () {
        return ['text', 'number', 'textarea'].includes(this.type)
      },
      // 是否日期选择
      isDatepicker () {
        return ['date', 'dates', 'daterange', 'year', 'month', 'week', 'datetime', 'datetimerange'].includes(this.type)
      },
      // 是否时间选择
      isTimepicker () {
        return ['time', 'timerange'].includes(this.type)
      },

      // 只读状态
      readonly () {
        const { schema: { readonly }, depReadonly } = this

        if (depReadonly !== undefined) {
          return depReadonly
        }

        if (readonly !== undefined) {
          return readonly
        }

        return this.formEditor.readonly
      },
      // 禁用状态
      disabled () {
        const { schema: { disabled }, depDisabled } = this

        if (depDisabled !== undefined) {
          return depDisabled
        }

        if (disabled !== undefined) {
          return disabled
        }

        return this.formEditor.disabled
      },
      // 占的格数
      span () {
        return this.schema.span || this.itemSpan || this.formEditor.span
      },
    },
    watch: {
      value () {
        this.dealDefault()
      },
    },

    mounted () {
      this.dealDefault()
      this.initEvent()
    },

    methods: {

      // 初始化事件
      initEvent () {
        $bus.$on('formEditor.value.change', this.depReact)
      },

      // 响应依赖
      depReact () {
        this.initDepRules()
        this.initDepStyles()
      },
      // 初始化依赖校验规则
      initDepRules () {
        const { depRules, formEditor: { value } } = this
        if (!depRules) return
        // 依赖校验
        this.curDepRules = getDepConfig(depRules, value)
      },
      // 初始化依赖样式
      initDepStyles () {
        const { depStyles, formEditor: { value } } = this
        if (!depStyles) return
        // 依赖禁用
        this.depDisabled = getDepConfig(depStyles, value).some(i => i.type === 'disabled')
        // 依赖只读
        this.depReadonly = getDepConfig(depStyles, value).some(i => i.type === 'readonly')
        // 依赖隐藏
        this.depHidden = getDepConfig(depStyles, value).some(i => i.type === 'hidden')
      },

      // 处理默认值
      dealDefault () {
        const { value, keyName, schema } = this
        if (value[keyName] === undefined) {
          // 响应式设置值
          this.$set(value, keyName, schema.default)
        }
      },

      // 是否展开
      getExpand () {
        let { schema: { expand } } = this
        return expand === undefined ? true : expand
      },

      // 对象展开/收起
      onToggleClick () {
        this.expand = !this.expand
      },

      // 数组项目删除
      onItemDeleteClick (index) {
        this.arrayModel.splice(index, 1)
        this.$forceUpdate()
      },

      // 数组项添加
      onItemAddClick () {
        this.arrayModel.push({})
        this.$forceUpdate()
      },

    },
  }
</script>
