import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/sys/login',
  Logout = '/sys/logout',
  GetUserInfo = '/sys/user/info',
  GetPermCode = '/sys/user/permCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
      headers: {
        appCode: (import.meta.env.VITE_APP_CODE || 'platform').toString(),
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.post<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.post<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}
/**
 * 分页查询用户列表
 * @param params 查询参数
 * @returns
 */
export function sysUserPage(data) {
  return defHttp.post({ url: '/sys/user/page', params: data });
}
/**
 * 查询用户列表
 * @param params 查询参数
 * @returns
 */
export function sysUserList(data) {
  return defHttp.post({ url: '/sys/user/list', data });
}
/**
 * 添加用户
 * @param data 参数
 * @returns
 */
export function sysUserAdd(data) {
  return defHttp.post({ url: '/sys/user/save', data });
}
/**
 * 编辑用户
 * @param data 参数
 * @returns
 */
export function sysUserEdit(data) {
  return defHttp.post({ url: '/sys/user/update', data });
}

/**
 * 删除用户
 * @param data 参数
 * @returns
 */
export function sysUserDel(data) {
  return defHttp.post({ url: '/sys/user/remove', data });
}

/**
 * 保存或更新用户
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function sysUserSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return sysUserEdit(data);
  } else {
    return sysUserAdd(data);
  }
}
/**
 * 重置密码
 * @param data 参数
 * @returns
 */
export function resetPassword(data) {
  return defHttp.post({ url: '/sys/user/resetPassword', data });
}
/**
 * 查询用户下拉列表
 * @param params 查询参数
 * @returns
 */
export function sysUserSelect(data) {
  return defHttp.post({ url: '/sys/user/select', data });
}
/**
 * 修改密码
 * @param data
 * @returns
 */
export const updatePwd = (data) => {
  return defHttp.request({
    method: 'post',
    url: '/sys/user/updatePwd',
    data,
  });
};
/**
 * 扮演用户
 * @param data 参数
 * @param headers 请求头
 * @returns
 */
export function playUser(
  data,
  headers = {
    appCode: (import.meta.env.VITE_APP_CODE || 'platform').toString(),
  },
) {
  return defHttp.post<LoginResultModel>({ url: '/sys/playUser', data, headers });
}
/**
 * 退出扮演用户
 * @param data 参数
 * @returns
 */
export function unPlayUser(data) {
  return defHttp.post<LoginResultModel>({ url: '/sys/unPlayUser', data });
}

/**
 * 获取部门用户树
 * @param data 参数
 * @returns
 */
export function getDeptUserTree(data) {
  return defHttp.post<any>({ url: '/sys/user/getDeptUserTree', data });
}
/**
 * 授权角色
 * @param data 参数
 * @returns
 */
export function grantRole(data) {
  return defHttp.post<any>({ url: '/sys/user/grantRole', data });
}
