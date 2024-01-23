<template>
  <PageWrapper>
    <BasicTable
      rowKey="id"
      :showTableSetting="true"
      @register="registerTable"
      :useSearchForm="true"
      :beforeFetch="handleBeforeFetch"
      :showIndexColumn="false"
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
              auth: ['admin', 'sys:user:save'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '重置密码',
              icon: 'ant-design:setting-outlined',
              auth: ['admin', 'sys:user:resetPassword'],
              ifShow: () => {
                return checkedKeys.length > 0;
              },
              popConfirm: {
                title: `是否重置该用户密码？`,
                confirm: handleResetPassword.bind(null),
              },
            },
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
              auth: ['admin', 'sys:user:remove'], // 根据权限控制是否显示: 有权限，会显示
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
              auth: ['admin', 'sys:user:update'], // 根据权限控制是否显示: 无权限，不显示
            },
          ]"
          :dropDownActions="[
            {
              label: '扮演用户',
              icon: 'ant-design:play-square-outlined',
              auth: ['admin', 'sys:playUser'],
              popConfirm: {
                title: `是否扮演该用户？`,
                confirm: handlePlayUser.bind(null, record),
              },
            },
            {
              label: '重置密码',
              icon: 'ant-design:setting-outlined',
              auth: ['admin', 'sys:user:resetPassword'],
              popConfirm: {
                title: `是否重置该用户密码？`,
                confirm: handleResetPassword.bind(null, record),
              },
            },
            {
              label: '授权角色',
              icon: 'ant-design:usergroup-add-outlined',
              auth: ['admin', 'sys:user:grantRole'],
              onClick: openGrantRole.bind(null, record),
            },
            {
              label: '删除',
              icon: 'ant-design:delete-outlined',
              popConfirm: {
                title: '确定删除吗？',
                confirm: handleDelete.bind(null, record),
              },
              auth: ['admin', 'sys:user:remove'], // 根据权限控制是否显示: 有权限，会显示
            },
          ]"
        />
      </template> </BasicTable
    ><sysUserAdd @register="registerAddModal" @success="handleSuccess" />
    <GrantRole ref="grantRoleRef" @reload="reload" />
  </PageWrapper>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { sysUserDel, sysUserPage, resetPassword, playUser } from '/@/api/sys/user';
  import sysUserAdd from './add.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { router } from '/@/router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import GrantRole from './grantRole.vue';
  const userStore = useUserStoreWithOut();
  const columns = [
    // 列定义
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '所属角色',
      dataIndex: 'roleIds',
      component: 'ApiSelect',
      componentProps: {
        api: '/sys/role/select',
      },
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: '10%',
      component: 'ApiDict',
      componentProps: {
        code: 'sex',
      },
    },
    {
      title: '手机号码',
      dataIndex: 'mobilePhone',
    },
    {
      title: '联系电话',
      dataIndex: 'tel',
    },
    {
      // flag: 'ACTION',
      title: '操作',
      key: 'ACTION',
      dataIndex: 'ACTION',
      slots: { customRender: 'action' },
    },
  ];
  // 搜索表单
  const searchFormSchemas = [
    {
      field: 'm_LIKE_userName',
      label: '用户名',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      field: 'm_LIKE_realName',
      label: '姓名',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      field: 'm_LIKE_mobilePhone',
      label: '手机号码',
      component: 'Input',
      colProps: {
        xl: 6,
        xxl: 6,
      },
    },
  ];
  // 注册表格
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    api: sysUserPage,
    columns: columns,
  });
  // 授权角色ref
  const grantRoleRef = ref();
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
    setModalProps({ title: '新增用户' });
  };
  // 打开编辑表单
  const handleEdit = (record) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
    setModalProps({ title: '编辑用户' });
  };
  // 多选删除
  const handleDelete = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    ids.push(...unref(checkedKeys));
    sysUserDel({
      ids: ids,
    }).then(() => {
      message.success('删除成功');
      clearSelectedRowKeys();
      reload();
    });
  };
  const handlePlayUser = (record) => {
    playUser({
      userId: record.id,
    }).then((data) => {
      userStore.setToken(data.token);
      userStore.setRefreshToken(data.refreshToken);
      message.success('用户扮演成功！');
      const { closeCurrent } = useTabs(router);
      closeCurrent();
      setTimeout(() => {
        location.reload();
      }, 600);
    });
  };
  // 重置密码
  const handleResetPassword = (record) => {
    const ids = [];
    if (record && record.id) {
      ids.push(record.id);
    }
    ids.push(...unref(checkedKeys));
    resetPassword({
      ids: ids,
    }).then(() => {
      message.success('重置密码成功');
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
  /**
   * 打开授权角色
   * @param {*} record
   */
  const openGrantRole = (record) => {
    grantRoleRef.value?.show(record);
  };
</script>

<style lang="less" scoped></style>
