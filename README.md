# 介绍
el-form-engine基于vue+element, 可解决各种各样的表单需求, 编程中使用form-editor来实现表单需求, 代码量可减少60%左右

## form-editor
实现用schema(表单描述数据)来配置表单

## 进入开发

### 第1步: 安装依赖
```bash
npm i @soneway/el-form-engine
```

### 第2步: 引入element
由于form-engine基于element, 需要引入element

### 第3步: js中注册组件
```javascript
import Vue from 'vue';
import formEngine from '@soneway/el-form-engine';
Vue.use(formEngine);
```

### 第4步: less中引用样式
```less
@import "~@soneway/el-form-engine/dist/css/index.css";
```

### 第5步: html中使用组件
```html
<form-editor></form-editor>
```
