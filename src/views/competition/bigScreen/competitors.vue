<template>
  <div class="competitors">
    <div class="title">{{ competitionName }}</div>
    <div class="smallTitle">{{ competitionProjectName }} 过海选手</div>
    <div class="main">
      <div
        v-for="item in list"
        :key="item.id"
        class="user"
      >
        <div class="userName">{{ item.name }}</div>
        <div
          v-if="item.role === 'guest'"
          class="guest"
        >{{ item.role }}</div>
      </div>
    </div>
    <!-- <div class="logo" /> -->
    <div class="logo">本赛事系统由苏州工业园区不羁软件工作室提供</div>
  </div>
</template>

<script>
import { listSeaSelection, getCompetitionProject } from '@/api/competition'
export default {
  props: {
    competitionProjectId: {
      type: String,
      required: true
    },
    competitionName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      competitionProjectName: ''
    }
  },
  created() {
    this.getSeaSelectMember()
  },
  methods: {
    getSeaSelectMember() {
      listSeaSelection({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.list = res.data
      })
      getCompetitionProject({ ids: [this.competitionProjectId] }).then(res => {
        this.competitionProjectName = res.data[0].name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.competitors {
  width: 100%;
  height: 100%;
  background: url("../../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 1.7%;
  .title {
    margin: auto;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    width: 650px;
    height: 82px;
    line-height: 82px;
    color: #fff;
    background: url("../../../assets/competition/title.png") no-repeat;
    background-size: 100% 100%;
  }
  .smallTitle {
    height: 28px;
    line-height: 28px;
    margin-top: 4%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fbff97;
  }
  .main {
    width: calc(100% - 308px);
    height: calc(94.3% - 218px);
    margin: 54px 154px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .user {
      flex: 0 0 12.5%;
      text-align: center;
      margin-bottom: 30px;
      height: 70px;
      .userName {
        width: 89.5%;
        height: 60px;
        line-height: 60px;
        font-size: 27px;
        font-weight: 600;
        color: #ffffff;
        background: url("../../../assets/competition/user.svg") no-repeat;
        background-size: 100% 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .guest {
        width: 89.5%;
        font-size: 14px;
        color: #fbff97;
      }
    }
  }
  // .logo {
  //   width: 280px;
  //   height: 90px;
  //   background: url("../../../assets/logo.png") no-repeat;
  //   background-size: 100% 100%;
  //   position: fixed;
  //   bottom: 50px;
  //   right: 50%;
  //   transform: translate(50%);
  // }
  .logo {
    position: fixed;
    bottom: 5%;
    right: 50%;
    transform: translate(50%);
    color: #fff;
    font-size: 20px;
    letter-spacing: 10px;
    opacity: 0.5;
  }
}
</style>
