<template>
  <div>
    <el-card shadow="hover" v-for="comment in comments" :key="comment.rpid">
      <div class="selected" v-show="isSelected(comment.rpid)">
        <i class="el-icon-success"></i>
      </div>
      <div class="comment-item" @click="selectItem(comment.rpid)" :ref="comment.rpid">
        <div class="comment-item-left">
          <!-- 头像 -->
          <div class="user-avatar">
            <img :src="comment.member.avatar" />
          </div>
        </div>
        <div class="comment-item-right">
          <div class="user">
            <span class="user-name">{{ comment.member.uname }}</span>
          </div>
          <p class="context" v-html="transformMessage(comment)"></p>
          <div class="info">
            <span class="info-time" v-show="showTime">{{
              timestampFormat(comment.ctime)
            }}</span>
            <div class="info-like">
              <img src="@/assets/images/like.svg" />
              <span>{{ comment.like }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { timestampFormat } from '@/utils/time'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'CommentListItem',
  props: {
    comments: Array,
  },
  computed: {
    ...mapState(['showTime', 'selectComment']),
  },
  methods: {
    ...mapActions(['setSelectCommment']),
    // 转换评论中表情包
    transformMessage(comment) {
      const { message, emote } = comment.content
      let _message = message
      if (emote) {
        Object.keys(emote).map((item) => {
          const regex = new RegExp(`\\${item}`, 'g')
          _message = _message.replace(
            regex,
            `<img src="${emote[item].url}" style="position: relative; top: 3px; width: 20px; height: 20px; padding: 0 2px" />`
          )
        })
        return _message
      }
      return _message
    },
    // 时间戳转换
    timestampFormat: timestampFormat,
    // 选择评论
    selectItem(rpid) {
      this.setSelectCommment(rpid)
    },
    // 评论是否被选中
    isSelected(rpid) {
      return this.selectComment.indexOf(rpid) !== -1
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-card__body {
  padding: 10px;
  border-radius: 5px;
}
/deep/ .el-card {
  margin-bottom: 10px;
  background-color: #f9f9f9;
  .selected {
      position: absolute;
      right: 10px;
      color: #66b1ff;
    }
}
.comment-item {
  display: flex;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  &-left {
    justify-content: center;
    width: 60px;
    padding-right: 10px;
    box-sizing: border-box;
    .user-avatar {
      img {
        width: 42px;
        border-radius: 50%;
      }
    }
  }
  &-right {
    flex: 1;
    .user {
      &-name {
        font-size: 13px;
        line-height: 18px;
        color: #61666d;
      }
    }
    .context {
      margin: 0 0 5px 0;
      line-height: 24px;
      font-size: 15px;
      color: #18191c;
    }
    .info {
      display: flex;
      color: #9499a0;
      line-height: 18px;
      font-size: 13px;
      &-time {
        margin-right: 20px;
      }
      &-like {
        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        span {
          position: relative;
          top: -3px;
        }
      }
    }
  }
}
</style>