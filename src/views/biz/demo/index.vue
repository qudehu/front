<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :showIndexColumn="false"
      :beforeFetch="handleBeforeFetch"
      :rowSelection="rowSelection"
      :formConfig="{ labelWidth: 100, schemas: searchFormSchemas }"
    >
      <!--左上角按钮-->
      <template #tableTitle>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              size: 'middle',
              icon: 'ant-design:plus-outlined',
              onClick: handleAdd.bind(null),
              auth: ['admin', 'biz:demo:save'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null),
              },
              ifShow: () => {
                return checkedKeys.length > 0;
              },
              auth: ['admin', 'biz:demo:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        >
          <template #more>
            <a-button style="margin-left: 8px">
              批量操作
              <DownOutlined />
            </a-button>
          </template>
        </TableAction>
      </template>
      <!--操作项-->
      <template #action="{ record }">
        <TableAction
          :stopButtonPropagation="true"
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              auth: ['admin', 'biz:demo:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '删除',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'biz:demo:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><bizDemoAdd @register="registerAddModal" @success="handleSuccess"
  /></PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { bizDemoDel, bizDemoPage } from '/@/api/biz/demo';
  import bizDemoAdd from './add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  /* eslint-disable */
  const columns = [
    // 列定义
    {
      title: '名称',
      dataIndex: 'name',
      component: 'Input',
      componentProps: {
      },
    },
    {
      title: '多行文本',
      dataIndex: 'inputTextArea',
      component: 'InputTextArea',
      componentProps: {
      },
    },
    {
      title: '自动完成',
      dataIndex: 'autoComplete',
      component: 'AutoComplete',
      componentProps: {
      },
    },
    {
      title: '开关',
      dataIndex: 'mSwitch',
      component: 'Switch',
      componentProps: {
      },
    },
    {
      title: '分割线',
      dataIndex: 'divider',
      component: 'Divider',
      componentProps: {
      },
    },
    {
      title: '远程下拉',
      dataIndex: 'apiSelect',
      component: 'ApiSelect',
      componentProps: {
        api: "/sys/user/select",
      },
    },
    {
      title: '字典',
      dataIndex: 'dict',
      component: 'ApiDict',
      componentProps: {
        code: "sys_role_role_type",
        placeholder: "请选择字典",
        dataType: "String",
      },
    },
    {
      title: '远程树',
      dataIndex: 'apiTreeSelect',
      component: 'ApiCheckboxGroup',
      componentProps: {
        api: "/sys/dept/tree",
      },
    },
    {
      title: '远程单选组',
      dataIndex: 'apiRadioGroup',
      component: 'ApiRadioGroup',
      componentProps: {
        api: "/sys/user/select",
      },
    },
    {
      title: '远程多选组',
      dataIndex: 'apiCheckboxGroup',
      component: 'ApiCheckboxGroup',
      componentProps: {
        valueField: "/test/lv",
      },
    },
    {
      title: '日期',
      dataIndex: 'datePicker',
      component: 'DatePicker',
      componentProps: {
      },
    },
    {
      title: '日期区间选择',
      dataIndex: 'rangePicker',
      component: 'RangePicker',
      componentProps: {
      },
    },
    {
      title: '远程级联选择',
      dataIndex: 'apiCascader',
      component: 'ApiCascader',
      componentProps: {
        api: "/sys/dept/tree",
        labelField: "name",
        valueField: "id",
        asyncFetchParamKey: "m_EQ_parentId",
        numberToString: true,
      },
    },
    {
      title: '文件上传',
      dataIndex: 'upload',
      component: 'Upload',
      componentProps: {
      },
    },
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  /* eslint-disable */
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_LIKE_name',
      label: '名称',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
      },
    },
    {
      field: 'm_EQ_dict',
      label: '字典',
      component: 'ApiDict',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        code: "sys_role_role_type",
        placeholder: "请选择字典",
        dataType: "String",
      },
    },
  ];
  /* eslint-disable */
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: bizDemoPage,
    columns: columns,
  });
  // 选中行id集合
  const checkedKeys = ref([]);
  // 多选处理
  const rowSelection = {
    type: 'checkbox',
    onChange: (keys) => {
      checkedKeys.value = keys;
    },
  };
  const [registerAddModal, { openModal, setModalProps }] = useModal();
  // 打开添加表单
  const handleAdd = (record) => {
    openModal(true, {
      record: {
        parentId: record ? record.id : '',
      },
    });
    setModalProps({ title: '新增演示' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑演示' });
  };
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    ids.push(...unref(checkedKeys));
    bizDemoDel({
      ids: ids,
    }).then(() => {
      message.success('删除成功');
      clearSelectedRowKeys();
      reload();
    });
  };
  // 添加、编辑成功回调
  const handleSuccess = () => {
    reload();
  };
  // 处理查询请求参数
  const handleBeforeFetch = (params) => {
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] == 9999999999) {
          // 删除全部自定义的值-不提交到后端
          delete params[key];
        }
      });
    }
    return params;
  };
</script>

<style lang="less" scoped></style>
