<template>
  <div
    class="comment-wrapper"
    :style="{ height: findMaxHight() + 'px' }"
    ref="commentWrapper"
  >
    <!-- 左侧 -->
    <div ref="left" class="comment-wrapper-left">
      <comment-list-item :comments="leftCommentList" />
    </div>
    <!-- 中间 -->
    <div ref="middle" class="comment-wrapper-middle">
      <comment-list-item :comments="middleCommentList" />
    </div>
    <!-- 右侧 -->
    <div ref="right" class="comment-wrapper-right">
      <comment-list-item :comments="rightCommentList" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CommentListItem from './CommentListItem.vue'
export default {
  name: 'CommentList',
  components: { CommentListItem },
  props: {
    comments: Array,
  },
  data() {
    return {
      leftCommentList: [],
      middleCommentList: [],
      rightCommentList: [],
      waterfallHeight: [0, 0, 0], // 记录瀑布流各个列的高度
      triggerDistance: 200, // 目标距离
    }
  },
  methods: {
    ...mapActions(['setIsLoading']),
    // 往三个列表中添加数据
    addData(data) {
      this.waterfallHeight[0] = this.$refs.left.offsetHeight
      this.waterfallHeight[1] = this.$refs.middle.offsetHeight
      this.waterfallHeight[2] = this.$refs.right.offsetHeight

      // 找出当前高度最小的一列
      const minIndex = this.waterfallHeight.indexOf(
        Math.min.apply(null, this.waterfallHeight)
      )

      if (minIndex === 0) {
        this.leftCommentList.push(data)
      } else if (minIndex === 1) {
        this.middleCommentList.push(data)
      } else {
        this.rightCommentList.push(data)
      }
    },
    // 找出最大的高度，设置comment-wrapper的高.(waterfallHeight记录的高度没有添加最后一项)
    findMaxHight() {
      return (
        Math.max.call(
          null,
          this.$refs.left?.offsetHeight,
          this.$refs.middle?.offsetHeight,
          this.$refs.right?.offsetHeight
        ) || 0
      )
    },
    // 加载更多的评论
    loadMoreComment() {
      // 计算评论容器底部与屏幕底部之间的距离
      let distance =
        this.$refs.commentWrapper?.getBoundingClientRect().bottom -
        window.innerHeight
      // 距离小于100、未加载、未获取完全评论，请求加载更多评论数据
      if (distance < this.triggerDistance && !this.isLoading && !this.isEnd) {
        this.setIsLoading(true)
        this.$emit('getMoreComment')
      }
    },
  },
  watch: {
    // 评论变化时，将数据添加到三个数组中
    comments: {
      handler(newComments, oldComment) {
        const len = oldComment.length
        // 重新输入bv号获取新视频评论是，清空原有的左中右三个数组
        if (newComments.length) {
          // 将截取新的评论数据添加到三个数组中
          newComments.slice(len).forEach((item) => {
            this.$nextTick(function () {
              // 确保数据渲染完成
              setTimeout(() => {
                this.addData(item)
              }, 100)
            })
          })
        } else {
          // 原数组清空，三个数组一并清空
          console.log('清空数组啦！')
          this.leftCommentList = []
          this.middleCommentList = []
          this.rightCommentList = []
        }
      },
    },
  },
  computed: {
    isLoading: {
      get() {
        return this.$store.state.isLoading
      },
      set() {},
    },
    isEnd: {
      get() {
        return this.$store.state.isEnd
      },
      set() {},
    },
  },
  mounted() {
    window.addEventListener('scroll', this.loadMoreComment)
  },
}
</script>

<style lang="less" scoped>
.comment-wrapper {
  position: relative;
  &-left,
  &-middle,
  &-right {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 33%;
    margin-right: 20px;
  }
  &-middle {
    left: 34%;
  }
  &-right {
    left: 68%;
  }
}
</style>