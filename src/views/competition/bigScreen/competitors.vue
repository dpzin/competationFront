<template>
  <div class="competitors">
    <div class="title">大赛</div>
    <div class="smallTitle">POPPING 过海选手</div>
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
    <div class="logo" />
  </div>
</template>

<script>
import { listSeaSelection } from '@/api/competition'

export default {
  data() {
    return {
      list: [],
      competitionProjectId: '2c9abe3f7f8c04c1017f8df0b0740001'
    }
  },
  created() {
    this.getSeaSelectMember()
  },
  methods: {
    getSeaSelectMember() {
      listSeaSelection({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.list = res.data
        console.log(res.data)
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
  padding-top: 35px;
  .title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    color: #ffffff;
  }
  .smallTitle {
    margin-top: 76px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fbff97;
  }
  .main {
    margin: 54px 154px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &:after {
      content: "";
      width: 180px;
    }
    .user {
      text-align: center;
      margin-bottom: 30px;
      height: 70px;
      .userName {
        width: 180px;
        height: 60px;
        line-height: 60px;
        font-size: 27px;
        font-weight: 600;
        color: #ffffff;
        background: url("../../../assets/competition/user.svg") no-repeat;
        background-size: 100% 100%;
      }
      .guest {
        width: 180px;
        font-size: 14px;
        color: #fbff97;
      }
    }
  }
  .logo {
    width: 280px;
    height: 90px;
    background: url("../../../assets/logo.png") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    bottom: 50px;
    right: 50%;
    transform: translate(50%);
  }
}
</style>
