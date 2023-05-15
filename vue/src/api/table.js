import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function insert(data) {
  return request({
    url: '/table/insert',
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
    data
  })
}