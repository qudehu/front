import { defHttp } from '/@/utils/http/axios';

/**
 * 分页查询演示列表
 * @param params 查询参数
 * @returns
 */
export function bizDemoPage(data) {
  return defHttp.post({ url: '/biz/demo/page', params: data });
}
/**
 * 查询演示列表
 * @param params 查询参数
 * @returns
 */
export function bizDemoList(data) {
  return defHttp.post({ url: '/biz/demo/list', data });
}
/**
 * 添加演示
 * @param data 参数
 * @returns
 */
export function bizDemoAdd(data) {
  return defHttp.post({ url: '/biz/demo/save', data });
}
/**
 * 编辑演示
 * @param data 参数
 * @returns
 */
export function bizDemoEdit(data) {
  return defHttp.post({ url: '/biz/demo/update', data });
}

/**
 * 删除演示
 * @param data 参数
 * @returns
 */
export function bizDemoDel(data) {
  return defHttp.post({ url: '/biz/demo/remove', data });
}

/**
 * 保存或更新演示
 * @param data 参数
 * @param isUpdate 是否更新
 * @returns
 */
export function bizDemoSaveOrUpdate(data, isUpdate) {
  if (isUpdate) {
    return bizDemoEdit(data);
  } else {
    return bizDemoAdd(data);
  }
}
