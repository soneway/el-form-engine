import FormEditor from './form-editor'
import FormEditorItem from './form-editor-item'

const components = {
  FormEditor,
  FormEditorItem,
}

function install (Vue) {
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })
}

// install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components,
}
