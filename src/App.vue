<template>
  <div id="app">
    <!-- 头部指引 -->
    <header-area @handleComments="getComments" @download="downloadComment" />
    <!-- 评论列表 -->
    <comment-list :comments="comments" @getMoreComment="getMoreComment" />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { mapActions, mapGetters, mapState } from 'vuex'
import { getVideoCommentAPI } from '@/api'
import HeaderArea from '@/components/HeaderArea'
import CommentList from '@/components/CommentList'
export default {
  name: 'App',
  components: { HeaderArea, CommentList },
  data() {
    return {
      comments: [],
      commentNode: {}, // 所有评论节点
      pn: 2, // 第几页评论
    }
  },
  computed: {
    ...mapState(['avId', 'bvId', 'isLoading', 'mode', 'selectComment', 'type']),
    isEnd: {
      get() {
        return this.$store.state.isEnd
      },
      set() {},
    },
  },
  watch: {
    // 排序发生变化时，清空原评论数组
    mode() {
      this.comments = []
    },
    // 输入其他视频的bv号，清空原评论数组
    bvId() {
      this.comments = []
    },
  },
  methods: {
    ...mapActions([
      'setLodaing',
      'setIsLoading',
      'setIsEnd',
      'setCommentsIdList',
      'clearComment',
      'setSelectAll',
      'setDownload',
    ]),
    async getComments() {
      console.log(this.type)
      const res = await getVideoCommentAPI({
        oid: this.avId,
        sort: this.mode,
        type: this.type,
      })
      console.log(res.data.code)
      if (res.data.code == 0) {
        this.comments = [] // 重复获取清空数组
        this.clearComment()
        this.comments = res.data.data.replies
        console.log('初始评论', res.data.data.replies)
        this.setCommentsIdList(res.data.data.replies)
        this.setLodaing(false) // 评论初始化加载完成
      } else if (res.data.code == 12002) {
        alert('该视频评论已关闭！')
      } else {
        alert('评论获取失败！')
      }
    },

    // 加载载更多的评论
    async getMoreComment() {
      const res = await getVideoCommentAPI({
        oid: this.avId,
        sort: this.mode,
        type: this.type,
        pn: this.pn,
      })
      // console.log('更多的评论', res.data.data.replies)
      const newCommentList = res.data.data.replies
      // 评论去重（部分评论可能重复）
      const temp = newCommentList.filter((comment) => {
        const index = this.comments.findIndex(function (item) {
          return item.rpid === comment.rpid
        })
        return index === -1
      })
      // 如果返回的数据为空，则全部加载完成
      if (temp.length !== 0) {
        this.comments = [...this.comments, ...temp] // 新旧评论合并
        this.setCommentsIdList(temp) // 更新保存评论rpid的数组

        this.pn++ // 页数+1
        setTimeout(() => {
          this.setIsLoading(false) // 加载完成
        }, 1000)
      } else {
        this.setIsEnd(true)
        console.log('数据加载完了')
      }
    },
    // 评论转成图片并下载
    downloadComment() {
      // 将选中评论转为图片并下载
      if (this.selectComment.length) {
        this.setDownload(true)
        // 获取所有的评论节点
        for (let i = 0; i < 3; i++) {
          this.commentNode = {
            ...this.commentNode,
            ...this.$children[1].$children[i].$refs,
          }
        }
        this.$nextTick(() => {
          let done = 0
          const zip = new JSZip() // 初始化一个zip打包对象
          const img = zip.folder(this.bvId) // 创建images文件夹用于存放图片
          // 循环遍历出选中的评论节点
          this.selectComment.forEach((item) => {
            let comment = this.commentNode[`${item}`][0]

            let imageName =
              comment.querySelector('.user-name').innerText + `${item}` // 用户名称+rpid作为图片名称
            html2canvas(comment, {
              // 允许跨域（图片相关）
              allowTaint: true,
              // 允许跨域（图片相关）
              useCORS: true,
              // 截图的背景颜色
              backgroundColor: 'transparent',
              // 放大2倍
              scale: 2,
              // 关闭日志
              logging: false,
            })
              .then(
                (canvas) => {
                  let imgData = canvas
                    .toDataURL()
                    .split('data:image/png;base64,')[1]
                  //这个images文件目录中创建一个base64数据为imgData的图像，图像名是上面获取的imaName
                  img.file(imageName + '.png', imgData, { base64: true })
                  done += 1
                },
                function (error) {
                  console.log(error)
                  alert('抱歉！出错啦w(ﾟДﾟ)w\n请重试(ノへ￣、)')
                  return
                }
              )
              .then(() => {
                if (done === this.selectComment.length) {
                  zip.generateAsync({ type: 'blob' }).then((content) => {
                    saveAs(content, this.bvId + '.zip')
                  })
                } else return
                // 结束下载
                this.setDownload(false)
              })
          })
        })
      } else {
        alert('请选择需要下载的评论！')
      }
    }
  }
}
</script>

<style lang="less">
#app {
  width: 80vw;
  margin: 0 auto;
}
</style>
