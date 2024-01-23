<template>
  <BasicModal
    width="60%"
    v-bind="$attrs"
    @register="registerModal"
    okText="确定"
    cancelText="取消"
    title="新增演示"
    @cancel="handleCancel"
    :destroyOnClose="true"
    @ok="handleOk"
    ><BasicForm @register="registerForm"
  /></BasicModal>
</template>
<script setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { bizDemoSaveOrUpdate } from '/@/api/biz/demo';
  import { getAntTreeParents } from '/@/utils/tree';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  /* eslint-disable */
  // 表单元数据配置
  const schemas = [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      rules: [{ required: false, message: '请输入名称', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'inputTextArea',
      label: '多行文本',
      component: 'InputTextArea',
      rules: [{ required: false, message: '请输入多行文本', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'autoComplete',
      label: '自动完成',
      component: 'AutoComplete',
      rules: [{ required: false, message: '请输入自动完成', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'mSwitch',
      label: '开关',
      component: 'Switch',
      rules: [{ required: false, message: '请输入开关', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'divider',
      label: '分割线',
      component: 'Divider',
      rules: [{ required: false, message: '请输入分割线', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'apiSelect',
      label: '远程下拉',
      component: 'ApiSelect',
      rules: [{ required: false, message: '请输入远程下拉', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        api: "/sys/user/select",
      },
    },
    {
      field: 'dict',
      label: '字典',
      component: 'ApiDict',
      rules: [{ required: false, message: '请输入字典', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        code: "sys_role_role_type",
        placeholder: "请选择字典",
        dataType: "String",
      },
    },
    {
      field: 'apiTreeSelect',
      label: '远程树',
      component: 'ApiCheckboxGroup',
      rules: [{ required: false, message: '请输入远程树', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        api: "/sys/dept/tree",
      },
    },
    {
      field: 'apiRadioGroup',
      label: '远程单选组',
      component: 'ApiRadioGroup',
      rules: [{ required: false, message: '请输入远程单选组', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        api: "/sys/user/select",
      },
    },
    {
      field: 'apiCheckboxGroup',
      label: '远程多选组',
      component: 'ApiCheckboxGroup',
      rules: [{ required: false, message: '请输入远程多选组', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        valueField: "/test/lv",
      },
    },
    {
      field: 'datePicker',
      label: '日期',
      component: 'DatePicker',
      rules: [{ required: false, message: '请输入日期', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'rangePicker',
      label: '日期区间选择',
      component: 'RangePicker',
      rules: [{ required: false, message: '请输入日期区间选择', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
    {
      field: 'apiCascader',
      label: '远程级联选择',
      component: 'ApiCascader',
      rules: [{ required: false, message: '请输入远程级联选择', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
        api: "/sys/dept/tree",
        labelField: "name",
        valueField: "id",
        asyncFetchParamKey: "m_EQ_parentId",
        numberToString: true,
      },
    },
    {
      field: 'upload',
      label: '文件上传',
      component: 'Upload',
      rules: [{ required: false, message: '请输入文件上传', trigger: 'blur' }],
      colProps: {
        xl: 24,
        xxl: 24,
      },
      componentProps: {
      },
    },
  ];
  /* eslint-disable */
  const isUpdate = ref(false); // 是否为更新
  let currentRecord = reactive({}); // 当前记录
  let treeData = reactive([]); // 树型数据
  // 注册模态框
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(
    async (data) => {
      if (typeof data.record === 'object') {
        let values = { ...data.record };
        if (values.leaderIds) {
          values.leaderIdList = values.leaderIds.split(',');
        }
        // 初始化表单
        setFieldsValue(values);
        isUpdate.value = data.isUpdate;
        currentRecord = data.record;
      }
    },
  );
  // 注册表单
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: '120px',
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });
  // 关闭模态框事件
  const handleCancel = () => {
    // 重置表单
    resetFields();
  };
  // 提交表单
  const handleOk = () => {
    changeOkLoading(true);
    changeLoading(true);
    validate()
      .then((values) => {
        const formData = { ...values };
        if (isUpdate.value) {
          formData.id = currentRecord.id;
        }
        if (formData.leaderIdList && formData.leaderIdList.length) {
          formData.leaderIds = formData.leaderIdList.join(',');
        }
        // parentId设置默认值
        formData.parentId = formData.parentId ? formData.parentId : '0';
        // 组合名-所有父名称集合
        let mergerNames = getAntTreeParents(formData.parentId, treeData).map((item) => item.title);
        mergerNames.push(formData.name);
        // 设置组合名
        formData.mergerName = mergerNames.join(',');
        // 设置层级
        formData.levelCode = mergerNames.length - 1;
        const successMsg = `${isUpdate.value ? '编辑' : '新增'}演示成功`;
        const failMsg = `${isUpdate.value ? '编辑' : '新增'}演示失败`;
        // 调用添加或编辑接口
        bizDemoSaveOrUpdate(formData, unref(isUpdate))
          .then(() => {
            changeOkLoading(false);
            changeLoading(false);
            // 重置表单
            resetFields();
            // 关闭模态框
            closeModal();
            message.success(successMsg);
            emit('success');
          })
          .catch((e) => {
            changeOkLoading(false);
            changeLoading(false);
            message.error(e || failMsg);
          });
      })
      .catch(() => {
        changeOkLoading(false);
        changeLoading(false);
      });
  };
</script>
