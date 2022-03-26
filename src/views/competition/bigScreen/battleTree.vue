<template>
  <div
    class="battleTree"
    :style="{'--widthRate':widthRate ,'--heightRate':heightRate}"
  >
    <div class="title">{{ competitionName }}</div>
    <div class="main">
      <div class="left">
        <div class="roundOne">
          <div
            v-for="(item,index) in user.left.roundOne"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 8"
            :key="item"
            class="line16"
          />
        </div>
        <div class="roundTwo">
          <div
            v-for="(item,index) in user.left.roundTwo"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 4"
            :key="item"
            class="line8"
          />
        </div>
        <div class="roundThree">
          <div
            v-for="(item,index) in user.left.roundThree"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 2"
            :key="item"
            class="line4"
          />
        </div>
        <div class="roundFour">
          <div
            v-for="(item,index) in user.left.roundFour"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div class="line2" />
      </div>
      <div class="center">
        <div class="type">{{ competitionProjectName }}</div>
        <div class="winner">WINNER</div>
        <div class="champion">冠军</div>
        <div class="roundFive">
          <div class="name">{{ user.left.roundFive[0].name }}</div>
          <div class="line1" />
          <div class="name">{{ user.right.roundFive[0].name }}</div>
        </div>
      </div>
      <div class="right">
        <div class="line2 line2-r" />
        <div class="roundFour">
          <div
            v-for="(item,index) in user.right.roundFour"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 2"
            :key="item"
            class="line4 line4-r"
          />
        </div>
        <div class="roundThree">
          <div
            v-for="(item,index) in user.right.roundThree"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 4"
            :key="item"
            class="line8 line8-r"
          />
        </div>
        <div class="roundTwo">
          <div
            v-for="(item,index) in user.right.roundTwo"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
        <div>
          <div
            v-for="(item) in 8"
            :key="item"
            class="line16 line16-r"
          />
        </div>
        <div class="roundOne">
          <div
            v-for="(item,index) in user.right.roundOne"
            :key="index"
            class="name"
          >{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listBigScreenBattleInfo, getCompetitionProject } from '@/api/competition'
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
      user: {},
      competitionProjectName: '',
      widthRate: '1',
      heightRate: '1'
    }
  },
  watch: {
    competitionProjectId() {
      this.getBigScreenInfo(this.competitionProjectId)
    }
  },
  created() {
    this.getBigScreenInfo(this.competitionProjectId)
    this.widthRate = document.body.clientWidth / 1920
    this.heightRate = document.body.clientHeight / 937
  },
  methods: {
    getBigScreenInfo() {
      var ref = this
      listBigScreenBattleInfo({ competitionProjectId: this.competitionProjectId }).then(res => {
        ref.user = res.data
      })
      getCompetitionProject({ ids: [this.competitionProjectId] }).then(res => {
        this.competitionProjectName = res.data[0].name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.battleTree {
  width: 100%;
  height: 100%;
  background: url("../../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
  padding-top: 1.7%;
  .title {
    margin: auto;
    text-align: center;
    font-size: calc(36px * var(--widthRate));
    font-weight: bold;
    width: calc(650px * var(--widthRate));
    height: calc(82px * var(--heightRate));
    line-height: calc(82px * var(--heightRate));
    background: url("../../../assets/competition/title.png") no-repeat;
    background-size: 100% 100%;
  }
  .main {
    display: flex;
    justify-content: center;
    height: calc(844px * var(--heightRate));
    .name {
      width: calc(133px * var(--widthRate));
      height: calc(40px * var(--heightRate));
      text-align: center;
      line-height: calc(40px * var(--heightRate));
      background: url("../../../assets/competition/user.svg") no-repeat;
      background-size: 100% 100%;
    }
    .roundOne {
      display: flex;
      flex-direction: column;
      .name {
        margin-bottom: calc(8px * var(--heightRate));
        &:nth-child(2n) {
          margin-bottom: calc(20px * var(--heightRate));
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line16 {
      background: url("../../../assets/competition/32-16.png") no-repeat;
      background-size: 100% 100%;
      width: calc(30px * var(--widthRate));
      height: calc(48px * var(--heightRate));
      margin-top: calc(60px * var(--heightRate));
      &:first-child {
        margin-top: calc(20px * var(--heightRate));
      }
    }
    .roundTwo {
      display: flex;
      flex-direction: column;
      margin-top: calc(24px * var(--heightRate));
      .name {
        margin-bottom: calc(68px * var(--heightRate));
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line8 {
      background: url("../../../assets/competition/16-8.png") no-repeat;
      background-size: 100% 100%;
      width: calc(30px * var(--widthRate));
      height: calc(108px * var(--heightRate));
      margin-top: calc(108px * var(--heightRate));
      &:first-child {
        margin-top: calc(44px * var(--heightRate));
      }
    }
    .roundThree {
      display: flex;
      flex-direction: column;
      margin-top: calc(78px * var(--heightRate));
      .name {
        margin-bottom: calc(176px * var(--heightRate));
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line4 {
      background: url("../../../assets/competition/8-4.png") no-repeat;
      background-size: 100% 100%;
      width: calc(30px * var(--widthRate));
      height: calc(216px * var(--heightRate));
      margin-top: calc(216px * var(--heightRate));
      &:first-child {
        margin-top: calc(98px * var(--heightRate));
      }
    }
    .roundFour {
      display: flex;
      flex-direction: column;
      margin-top: calc(186px * var(--heightRate));
      .name {
        margin-bottom: calc(392px * var(--heightRate));
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line2 {
      background: url("../../../assets/competition/4-2.png") no-repeat;
      background-size: 100% 100%;
      width: calc(30px * var(--widthRate));
      height: calc(432px * var(--heightRate));
      margin-top: calc(206px * var(--heightRate));
    }
    .left {
      display: flex;
    }
    .right {
      display: flex;
      .line16-r {
        background: url("../../../assets/competition/32-16-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line8-r {
        background: url("../../../assets/competition/16-8-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line4-r {
        background: url("../../../assets/competition/8-4-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line2-r {
        background: url("../../../assets/competition/4-2-r.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .center {
      text-align: center;
      .type {
        height: calc(32px * var(--heightRate));
        font-size: calc(24px * var(--widthRate));
        font-weight: bold;
        margin-top: calc(48px * var(--heightRate));
      }
      .winner {
        color: #fbff97;
        font-weight: 900;
        font-size: calc(40px * var(--widthRate));
        margin-top: calc(160px * var(--heightRate));
      }
      .champion {
        width: calc(133px * var(--widthRate));
        height: calc(40px * var(--heightRate));
        text-align: center;
        line-height: calc(40px * var(--heightRate));
        background: url("../../../assets/competition/champion.png") no-repeat;
        background-size: 100% 100%;
        margin: calc(30px * var(--heightRate)) auto
          calc(46px * var(--heightRate));
      }
      .roundFive {
        display: flex;
        height: calc(40px * var(--heightRate));
        align-items: center;
        .line1 {
          background: url("../../../assets/competition/2-1.png") no-repeat;
          background-size: 100% 100%;
          width: calc(74px * var(--widthRate));
          height: calc(1px * var(--heightRate));
        }
      }
    }
  }
}
</style>
