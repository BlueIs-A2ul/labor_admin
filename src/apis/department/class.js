import request from "@/utils/request";

const MODEL_BASE_URL = "/user/class";

const API = {
  PAGE: `${MODEL_BASE_URL}/page`,
};

/**
 * id查询
 * @param {string} id 主键
 * @returns
 */
export function getClass(id) {
  return request.get(`${MODEL_BASE_URL}/${id}`);
}

/**
 * 分页查询
 * @returns
 * @param {object} params
 * @param data
 * @param {string|number} params.majorId
 * @param {string} params.key
 * @param {number} params.page
 * @param {number} params.pageSize
 */
export function classPage(params, { majorList = [] }) {
  return request.post(API.PAGE, [...majorList], { params });
}
