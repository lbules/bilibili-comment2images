<template>
  <div class="head">
    <el-container>
      <el-row>
        <el-col :span="12">
          <div class="header-logo">
            <h1>bilibili评论转图片神器</h1>
            <img src="@/assets/images/bg.png" alt="" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="header- guide">
            <img src="@/assets/images/BilibiliBVId.gif" alt="" />
            <p>
              此工具由可将Bilibili视频/动态评论区里的评论转换成PNG图片。应用场景如：呈现观众评论、评论互动、频道Q&amp;A，将会陆续完善其他功能，敬请期待。
            </p>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
              >
                {{ activity }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
      </el-row>

      <el-divider> </el-divider>
      <el-main>
        <el-row type="flex" justify="start" :gutter="20">
          <el-col :span="4">
            <el-input
              v-model="bvId"
              placeholder="请输入BV号"
              class="search-input"
              @change="getVideoAvId"
            ></el-input>
          </el-col>
          <!-- 排序方式 -->
          <el-col :span="4">
            <el-select v-model="sort" placeholder="热度排序">
              <el-option label="时间排序" value="0"> </el-option>
              <el-option label="热度排序" value="2"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              v-show="showButton"
              type="primary"
              :disabled="loading"
              :loading="loading"
              @click="handleComments"
              >获取评论</el-button
            >
          </el-col>
          <!-- 显示时间 -->
          <el-col :span="4">
            <el-button
              v-show="commentsIdList.length"
              @click="showTime = !showTime"
              :class="{ unselect: !showTime }"
              type="primary"
              >显示时间</el-button
            >
          </el-col>
          <!-- 是否全选 -->
          <el-col :span="4">
            <el-button
              v-show="commentsIdList.length"
              @click="selecAllComment"
              type="primary"
              >{{ selectAll ? '全选' : '取消全选' }}</el-button
            >
          </el-col>

          <el-col :span="4">
            <el-button
              v-show="commentsIdList.length"
              type="primary"
              :disabled="isDownload"
              :loading="loading"
              @click="handleDownload"
              >下载</el-button
            >
          </el-col>
        </el-row>
        <router-view />
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getAid } from '@/utils/bv2aid'
import { getDynamicInfoAPI } from '@/api'
export default {
  name: 'HeaderArea',
  data() {
    return {
      bvId: '', // 输入的bv号
      showButton: false, //是否显示按钮
      sort: '', // 排序方式
      showTime: true, // 是否显示时间
      selectAll: true, // 全选按钮状态
      activities: [
        '步骤1： 输入bv号或动态id',
        '步骤2： 获取评论',
        '步骤3： 选择评论',
        '步骤4： 打包下载',
      ],
    }
  },
  watch: {
    // 更新排序方式
    sort(newValue) {
      this.setMode(newValue)
    },
    showTime(newValue) {
      this.setTime(newValue)
    },
    // 选择的评论发生变化时，判断是选中全部
    selectComment(newValue) {
      if (newValue.length !== this.commentsIdList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
    },
    commentsIdList(newValue) {
      if (newValue.length !== this.selectComment.length) {
        this.selectAll = true
      }
    },
  },
  computed: {
    ...mapState(['commentsIdList', 'selectComment', 'isDownload']),
    loading: {
      get() {
        this.$store.state.loading
      },
      set() {},
    },
  },
  methods: {
    ...mapActions([
      'setBvId',
      'setAvId',
      'setLodaing',
      'setMode',
      'setTime',
      'setSelectAll',
      'setType',
    ]),

    // 输入框失去焦点时，获取bv号对应的avid
    async getVideoAvId() {
      if (this.bvId) {
        this.showButton = true // 显示获取按钮
        this.setBvId(this.bvId) // 保存bv号
        // 根据是否有BV前缀，判断是视频还是动态
        if (this.bvId.slice(0, 2) === 'BV') {
          console.log('视频评论')
          this.setAvId(getAid(this.bvId)) // 根据bv号获取avid，用于获取oid
        } else {
          // 动态评论
          const res = await getDynamicInfoAPI({
            dynamicId: this.bvId,
          })
          console.log('这是动态', res.data.data.card.desc)
          let dynamicType = res.data.data.card.desc.type // 动态类型
          console.log('动态类型type:', dynamicType)
          if (dynamicType == 2) {
            console.log('type = 2')
            this.setAvId(res.data.data.card.desc.rid)
            this.setType(11)
          } else {
            console.log('type = 1,4,2048')
            this.setAvId(this.bvId)
            this.setType(17)
          }
        }
      }
    },

    // 通知父组件获取评论数据
    handleComments() {
      this.setLodaing(true)
      this.$emit('handleComments')
    },
    // 全选、取消全选
    selecAllComment() {
      this.setSelectAll(this.selectAll)
      this.selectAll = !this.selectAll
    },
    // 下载
    handleDownload() {
      this.$emit('download')
    },
  },
}
</script>

<style lang="less" scoped>
.header-logo {
  h1 {
    text-align: center;
    color: #769fff;
  }
  img {
    width: 100%;
  }
}
.search-input {
  input {
    max-width: 180px;
  }
}
/deep/ .el-switch {
  top: 8px;
  left: 5px;
}

.unselect {
  color: #fff;
  background-color: #eee;
  border-color: #eee;
}
</style>