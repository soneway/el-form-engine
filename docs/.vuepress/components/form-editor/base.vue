<template>
  <div class="wrapper">
    <form-editor
      ref="formEditor"
      :schema="schema"
      :value="formData">
    </form-editor>
    <p style="padding-bottom: 20px;">
      <el-button
        type="primary"
        size="small"
        @click="onClick">表单校验
      </el-button>
    </p>
    {{formData}}
  </div>
</template>

<script>
  const schema = {

    text: {
      label: '文本',
      type: 'text',
      rules: [
        { type: 'string', required: true },
        { type: 'string', pattern: '^([1][3,4,5,6,7,8,9])\\d{9}$', message: '不符合正则' },
      ],
      // 栅格布局所占格数
      span: 8,
    },

    number: {
      label: '数字',
      type: 'number',
      span: 8,
      depRules: [
        {
          dep: {
            key: 'text',
            opt: 'reg',
            val: '^([1][3,4,5,6,7,8,9])\\d{9}$',
          },
          type: 'number',
          required: true,
        },
      ],
      depStyles: [
        {
          dep: {
            key: 'text',
            opt: 'eq',
            val: '11',
          },
          type: 'hidden',
        },
      ],
    },

    boolean: {
      label: '布尔值',
      type: 'boolean',
      span: 8,
    },

    textarea: {
      label: '文本域',
      type: 'textarea',
      maxlength: 5,
      default: '11',
      rules: [
        { type: 'string', max: 4 },
      ],
      span: 24,
    },

    radio: {
      // 字符/数字, 如: 'gd'
      label: '单选-radio',
      type: 'radio',
      options: [
        { label: '广东', value: 'gd' },
        { label: '江西', value: 'jx' },
        { label: '山东', value: 'sd' },
      ],
    },

    select: {
      // 字符/数字, 如: 'gd'
      label: '单选-select',
      type: 'select',
      options: [
        { label: '广东', value: 'gd' },
        { label: '江西', value: 'jx' },
        { label: '山东', value: 'sd' },
      ],
      props: {
        filterable: true,
      },
    },

    checkbox: {
      // 数组, 如: ['gd', 'jx']
      label: '多选-checkbox',
      type: 'checkbox',
      options: [
        { label: '广东', value: 'gd' },
        { label: '江西', value: 'jx' },
        { label: '山东', value: 'sd' },
      ],
    },

    multiSelect: {
      // 数组, 如: ['gd', 'jx']
      label: '多选-select',
      type: 'select',
      multiple: true,
      options: [
        { label: '广东', value: 'gd' },
        { label: '江西', value: 'jx' },
        { label: '山东', value: 'sd' },
      ],
      props: {
        filterable: true,
      },
    },

    object: {
      label: '对象',
      type: 'object',
      span: 24,
      fields: {
        text: {
          type: 'text',
          label: '文字',
        },
        number: {
          type: 'number',
        },
        object: {
          type: 'object',
          expand: false,
          fields: {
            name: {
              type: 'text',
              label: '姓名',
            },
            age: {
              type: 'number',
            },
          },
        },
      },
    },

    array: {
      label: '数组',
      type: 'array',
      span: 24,
      fields: {
        name: {
          type: 'text',
          rules: [
            { type: 'string', required: true },
          ],
        },
        age: {
          type: 'number',
        },
      },
    },

    customRender: {
      label: '自定义渲染函数',
      render: (h, { value, keyName, schema, supKeyName }) => <el-input
        value={value[keyName]}
        onInput={(val) => {
          // 手动实现双向绑定
          value[keyName] = val
        }}
      />,
      span: 24,
    },

    daterange: {
      type: 'daterange',
      label: '日期范围',
      span: 8,
    },

    date: {
      type: 'date',
      label: '日期',
      default: +new Date,
      span: 8,
    },

    dates: {
      type: 'dates',
      label: '多日期',
      span: 8,
    },

    year: {
      type: 'year',
      label: '年',
      span:8
    },

    month: {
      type: 'month',
      label: '月',
      span:8
    },

    week: {
      type: 'week',
      label: '周',
      span:8
    },

    datetimerange: {
      type: 'datetimerange',
      label: '日期时间范围',
    },

    datetime: {
      type: 'datetime',
      label: '日期时间',
    },

    timerange: {
      type: 'timerange',
      label: '时间范围',
    },

    time: {
      type: 'time',
      label: '时间',
    },
  }

  export default {
    data () {
      return {
        formData: {},
        schema,
      }
    },

    methods: {
      onClick () {
        this.$refs.formEditor.validate(
          (data) => {
            console.log('验证成功', data)
          },
          (data) => {
            console.log('验证失败', data)
          },
        )
      },
    },

    mounted () {
      setTimeout(() => {
        this.formData = {
          'object': {
            'object': { 'name': '2222', 'age': 3333 },
            'text': '222', 'number': 333333,
          },
        }
      }, 1000)
    },
  }
</script>

<style lang="less">
  .wrapper {

    h2 {
      margin-bottom: 20px;
    }
  }
</style>
