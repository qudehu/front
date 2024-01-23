// 引入yargs，使用commonjs的方式
const yargs = require('yargs');
/**
 * 定义命令行参数tableName，别名为t，描述为表名称，必填
 * 定义命令行参数cover，别名为c，描述为是否覆盖，取舍1或0，默认值为0，非必填
 */
const { tableName, cover } = yargs
  .option('tableName', {
    alias: 't',
    describe: '表名称',
    demandOption: true,
  })
  .option('cover', {
    alias: 'c',
    describe: '是否覆盖',
    default: 0,
  }).argv;
// 控制台打印tableName和cover的值
console.log('tableName:', tableName);
console.log('cover:', cover);
// 引入config
const config = require('config');
/**
 * 配置样例：{
  "apiUrl": "https://lowcode.mldong.com/api/dev/schema/getByTableName",
  "theme": "default",
  "appId": "1631219416960266241",
  "appSecret": "",
  "templates": [
    {
      "name": "首页模板",
      "selected": true,
      "templateFile": "index.art",
      "targetPath": "src/views/<{moduleName}>/<{tableCamelName}>",
      "targetFileName": "index.vue"
    }
  ]
}
 */
// 分别定义apiUrl、theme、appId、appSecret、templates
const { apiUrl, theme, appId, appSecret, templates, componentConfig } = config;
// 控制台打印apiUrl、theme、appId、appSecret、templates的值
console.log('apiUrl:', apiUrl);
console.log('theme:', theme);
console.log('appId:', appId);
console.log('appSecret:', appSecret);
console.log('templates:', templates);
// 引入request请求库
const request = require('request');
// 定义通过接口地址获取元数据方法，入参为表名称
function getMetaData(tableName) {
  // 定义接口地址
  const url = `${apiUrl}?tableName=${tableName}`;
  // 定义请求参数
  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appId,
      appSecret,
    },
  };
  // 发送请求
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}
/**
 * 定义一个函数
 * 过滤templates数组，只保留selected为true的模板
 * 遍历selectedTemplates数组，从templates目录中获取模板文件
 * 返回一个数组，每个元素为selectedTemplates数组的每一项，并增加templateContent字段
 * templateContent字段为模板文件内容
 */
// 引入fs
const fs = require('fs');
function getSelectedTemplates() {
  // 定义一个空数组，用于存储selectedTemplates数组
  const selectedTemplates = [];
  // 遍历templates数组
  templates.forEach((template) => {
    // 判断selected字段是否为true
    if (template.selected) {
      // 定义模板文件路径
      const templateFile = `${__dirname}/templates/${template.templateFile}`;
      if (fs.existsSync(templateFile)) {
        // 同步读取模板文件
        const templateContent = fs.readFileSync(templateFile, 'utf-8');
        // templateContent追加到selectedTemplates数组中
        selectedTemplates.push({
          ...template,
          templateContent,
        });
      }
    }
  });
  return selectedTemplates;
}
// 调用getSelectedTemplates方法，将结果打印到控制台
const selectedTemplates = getSelectedTemplates();
console.log('selectedTemplates:', selectedTemplates);
// 引入art-template
const artTemplate = require('art-template');
// 原始语法的界定符规则
artTemplate.defaults.rules[0].test = /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/;
// 标准语法的界定符规则
artTemplate.defaults.rules[1].test = /<{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}>/;
// 修改art-template的默认配置,禁止压缩
artTemplate.defaults.minimize = false;
// 修改art-template的默认配置,禁止转义
artTemplate.defaults.escape = false;
// 修改art-template的默认配置，导入JSON.stringify函数
artTemplate.defaults.imports.stringify = JSON.stringify;
// 修改art-template的默认配置,打开debug
artTemplate.defaults.debug = true;
// 修改art-template的默认配置,不缓存
artTemplate.defaults.cache = false;
// 引入path
const path = require('path');
/**
 * 定义一个函数，入参为文件地址
 * 如果文件地址所在目录不存在，则创建目录
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
/**
 * 定义一个函数，入参为schema数据和配置对象
 * 遍历selectedTemplates数组，从templates目录中获取模板文件
 * 遍历selectedTemplates数组，根据模板文件内容，替换模板文件中的占位符
 * 遍历selectedTemplates数组，将替换后的模板文件写入到目标文件中
 */
function generate(schema, config) {
  // 定义元数据等于schema数据+config
  const metaData = {
    ...schema,
    config,
  };
  // 遍历selectedTemplates数组
  selectedTemplates.forEach((template) => {
    // 定义模板文件路径
    const templateFile = `${__dirname}/templates/${template.templateFile}`;
    // 定义目标文件路径，需使用art-template渲染占位符
    const targetPath = artTemplate.render(template.targetPath, metaData);
    const targetFileName = artTemplate.render(template.targetFileName, metaData);
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    const targetFile = `${rootDir}/${targetPath}/${targetFileName}`;
    // 如果目标文件所在目录不存在，则创建目录
    mkdirsSync(targetPath);
    // 判断cover字段是否为true，同步写入模板文件到目标文件中
    if (cover) {
      fs.writeFileSync(targetFile, artTemplate.render(template.templateContent, metaData));
    } else {
      if (!fs.existsSync(targetFile)) {
        fs.writeFileSync(targetFile, artTemplate.render(template.templateContent, metaData));
      }
    }
    console.log(templateFile, targetFile);
  });
}
// 定义函数，对schema的columns数据进行二次处理，追加componentProps字段
function handleColumns(columns) {
  // 遍历columns数组
  columns.forEach((column) => {
    // 定义componentProps字段
    column.componentProps = {};
    const keys = componentConfig[column.component]?.propKeys || [];
    column.component = componentConfig[column.component]?.component || column.component;
    Object.keys(column.ext)
      .filter((item) => keys.includes(item))
      .forEach((key) => {
        column.componentProps[key] = column.ext[key];
      });
    if (column.component == 'ApiTreeSelect') {
      column.componentProps = {
        ...column.componentProps,
        replaceFields: {
          key: 'id' || column.ext?.valueField,
          title: 'name' || column.ext?.labelField,
          children: 'children',
          value: 'id' || column.ext?.valueField,
        },
      };
    }
    column.searchComponentProps = {
      ...column.componentProps,
    };
  });
  return columns;
}
getMetaData(tableName).then((body) => {
  // 将body转换为JSON对象
  const schema = JSON.parse(body)?.data;
  // 调用generate方法，将schema数据和配置对象作为入参
  schema.columns = handleColumns(schema.columns);
  generate(schema, config);
});
