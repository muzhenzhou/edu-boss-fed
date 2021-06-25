import request from '@/utils/request.js'
// 按条件查询角色请求
export const getRolePages = data => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}
// 保存或者更新角色请求
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 获取角色请求
export const getEditRoles = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 删除角色请求
export const deleteRoles = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 获取所有角色
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 给用户分配角色
export const allocateUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色
export const getUserId = userId => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
