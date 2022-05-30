import request from "../utils/request";

// 获取视频评论数据
export const getVideoCommentAPI = ({
  type = 1,
  pn = 1,
  ps = 20,
  sort = 2,
  oid
}) => {
  return request({
    url: '/api/x/v2/reply',
    params: {
      type,
      pn,
      ps,
      sort,
      oid
    }
  })
}

// 获取动态的信息
export const getDynamicInfoAPI = ({dynamicId}) =>{
  return request({
    url: '/dy/dynamic_svr/v1/dynamic_svr/get_dynamic_detail',
    params: {
      dynamic_id: dynamicId
    }
  })
}