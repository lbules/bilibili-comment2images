import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  bvId: '', // 视频的bv号
  avId: '', // 视频的av号
  mode: "2", // 排序方式， 0--按时间排序， 2--按热度排序
  showTime: true, // 是否显示时间
  loading: false, // 初始评论加载状态， false--未加载/加载完成， true--加载中
  isLoading: false, // 是否加载更多数据
  isEnd: false, // 是否加载完全部评论
  isDownload: false, // 是否在下载评论图片
  commentsIdList: [], // 所有已加载的评论rpid
  selectComment: [], // 选择的评论
  type: 1 // 评论类型： 1--有转发内容| 视频， 2--带图片动态， 4--纯文字， 2048--其他站内分享
}
const mutations = {
  SET_BVID(state, id) {
    state.bvId = id
  },
  SET_AVID(state, id) {
    state.avId = id
  },
  SET_LOADING(state, bool) {
    state.loading = bool
  },
  SET_ISLOADING(state, bool) {
    state.isLoading = bool
  },
  SET_ISEND(state, bool) {
    state.isEnd = bool
  },
  SET_MODE(state, mode) {
    state.mode = mode
  },
  SET_TIME(state, bool) {
    state.showTime = bool
  },
  SET_COMMENTIDLIST(state, list) {
    list.forEach(item => {
      state.commentsIdList.push(item.rpid)
    })
  },
  SET_SELECTCOMMENT(state, rpid) {
    const index = state.selectComment.indexOf(rpid)
    // 若评论尚未选中，则添加进数组
    if (index === -1) {
      state.selectComment.push(rpid)
    } else {
      // 评论已选中，则从数组中删除
      state.selectComment.splice(index, 1)
    }
  },
  SET_SELECTALL(state, bool) {
    state.selectComment= [] // 清空
    if (bool) {
      // 全选
      state.commentsIdList.forEach(item => {
        state.selectComment.push(item)
      })
    }
  },
  CLEAR_COMMENT(state) {
    state.selectComment = []
    state.commentsIdList = []
  },
  SET_DOWNLOAD(state, bool) {
    state.isDownload = bool
  },
  SET_TYPE(state, type) {
    state.type = type
  }
}
const actions = {
  // bv号
  setBvId(context, id) {
    context.commit('SET_BVID', id)
  },
  // avid
  setAvId(context, id) {
    context.commit('SET_AVID', id)
  },
  // 评论加载状态
  setLodaing(context, bool) {
    context.commit('SET_LOADING', bool)
  },
  // 加载更多评论状态
  setIsLoading(context, bool) {
    context.commit('SET_ISLOADING', bool)
  },
  // 是否加载完全部评论
  setIsEnd(context, bool) {
    context.commit('SET_ISEND', bool)
  },
  // 评论排序
  setMode(context, mode) {
    context.commit('SET_MODE', mode)
  },
  setTime(context, bool) {
    context.commit('SET_TIME', bool)
  },
  // 保存已加载的评论rpid
  setCommentsIdList(context, list) {
    context.commit('SET_COMMENTIDLIST', list)
  },
  // 添加或删除选择的评论
  setSelectCommment(context, rpid) {
    context.commit('SET_SELECTCOMMENT', rpid)
  },
  // 全选 or 取消全选
  setSelectAll(context, bool) {
    context.commit('SET_SELECTALL', bool)
  },
  // 清空评论、选择评论数组
  clearComment(context) {
    context.commit('CLEAR_COMMENT')
  },
  // 禁用评论下载按钮
  setDownload(context, bool) {
    context.commit('SET_DOWNLOAD', bool)
  },
  // 动态类型
  setType(context, type) {
    context.commit('SET_TYPE', type)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})