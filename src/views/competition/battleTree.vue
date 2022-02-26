<template>
  <div class="battleTree">
    <div class="title">大赛</div>
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
        <div class="type">POPPING</div>
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
export default {
  data() {
    return {
      user: {
        left: { roundOne: [{ name: '一' }, { name: '二' }, { name: '三' }, { name: '四' }, { name: '五' }, { name: '六' }, { name: '七' }, { name: '八' }, { name: '九' }, { name: '十' }, { name: '十一' }, { name: '十二' }, { name: '十三' }, { name: '十四' }, { name: '十五' }, { name: '十六' }], roundTwo: [{ name: '2-1' }, { name: '2-2' }, { name: '2-3' }, { name: '2-4' }, { name: '2-5' }, { name: '2-6' }, { name: '2-7' }, { name: '2-8' }], roundThree: [{ name: '3-1' }, { name: '3-2' }, { name: '3-3' }, { name: '3-4' }], roundFour: [{ name: '4-1' }, { name: '4-2' }], roundFive: [{ name: '5-1' }] }, right: { roundOne: [{ name: '一' }, { name: '二' }, { name: '三' }, { name: '四' }, { name: '五' }, { name: '六' }, { name: '七' }, { name: '八' }, { name: '九' }, { name: '十' }, { name: '十一' }, { name: '十二' }, { name: '十三' }, { name: '十四' }, { name: '十五' }, { name: '十六' }], roundTwo: [{ name: '2-1' }, { name: '2-2' }, { name: '2-3' }, { name: '2-4' }, { name: '2-5' }, { name: '2-6' }, { name: '2-7' }, { name: '2-8' }], roundThree: [{ name: '3-1' }, { name: '3-2' }, { name: '3-3' }, { name: '3-4' }], roundFour: [{ name: '4-1' }, { name: '4-2' }], roundFive: [{ name: '5-1' }] }, champion: '冠军'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.battleTree {
  width: 100%;
  height: 100%;
  background: url("../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
  .title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    padding-top: 2.5%;
    height: 90px;
  }
  .main {
    display: flex;
    justify-content: center;
    height: 844px;
    .name {
      width: 133px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url("../../assets/competition/user.svg") no-repeat;
      background-size: 100% 100%;
    }
    .roundOne {
      display: flex;
      flex-direction: column;
      .name {
        margin-bottom: 8px;
        &:nth-child(2n) {
          margin-bottom: 20px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line16 {
      background: url("../../assets/competition/32-16.png") no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 48px;
      margin-top: 60px;
      &:first-child {
        margin-top: 20px;
      }
    }
    .roundTwo {
      display: flex;
      flex-direction: column;
      margin-top: 24px;
      .name {
        margin-bottom: 68px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line8 {
      background: url("../../assets/competition/16-8.png") no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 108px;
      margin-top: 108px;
      &:first-child {
        margin-top: 44px;
      }
    }
    .roundThree {
      display: flex;
      flex-direction: column;
      margin-top: 78px;
      .name {
        margin-bottom: 176px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line4 {
      background: url("../../assets/competition/8-4.png") no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 216px;
      margin-top: 216px;
      &:first-child {
        margin-top: 98px;
      }
    }
    .roundFour {
      display: flex;
      flex-direction: column;
      margin-top: 186px;
      .name {
        margin-bottom: 392px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .line2 {
      background: url("../../assets/competition/4-2.png") no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 432px;
      margin-top: 206px;
    }
    .left {
      display: flex;
    }
    .right {
      display: flex;
      .line16-r {
        background: url("../../assets/competition/32-16-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line8-r {
        background: url("../../assets/competition/16-8-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line4-r {
        background: url("../../assets/competition/8-4-r.png") no-repeat;
        background-size: 100% 100%;
      }
      .line2-r {
        background: url("../../assets/competition/4-2-r.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .center {
      text-align: center;
      .type {
        height: 32px;
        font-size: 24px;
        font-weight: bold;
        margin-top: 48px;
      }
      .winner {
        color: #fbff97;
        font-weight: 900;
        font-size: 40px;
        margin-top: 160px;
      }
      .champion {
        width: 133px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: url("../../assets/competition/champion.png") no-repeat;
        background-size: 100% 100%;
        margin: 30px auto 46px;
      }
      .roundFive {
        display: flex;
        height: 40px;
        align-items: center;
        .line1 {
          background: url("../../assets/competition/2-1.png") no-repeat;
          background-size: 100% 100%;
          width: 74px;
          height: 1px;
        }
      }
    }
  }
}
</style>
