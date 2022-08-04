<template>
  <div class="controller">
    <div class="title">大屏遥控</div>
    <el-tabs
      v-model="active"
      @tab-click="handleClick(active)"
    >
      <el-tab-pane
        v-for="item in projects"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      >
        <div class="content">
          <div class="head">
            <div class="box">
              <img
                src="../../assets/main.png"
                @click="toBigScreen('main')"
              >
              <div class="box-title">主画面</div>
            </div>
            <div class="box">
              <img
                src="../../assets/memberlist.png"
                @click="toBigScreen('competitors',item.id)"
              >
              <div class="box-title">海选名单</div>
            </div>
            <div class="box">
              <img
                src="../../assets/battle_map.png"
                @click="toBigScreen('battleInfo', item.id)"
              >
              <div class="box-title">对战图</div>
            </div>
            <div class="box">
              <img
                src="../../assets/champion.png"
                @click="toBigScreen('champion', item.id)"
              >
              <div class="box-title">冠军</div>
            </div>
          </div>
          <div class="main">
            <el-select
              v-model="task"
              @change="taskChange"
            >
              <el-option
                v-for="option in taskOptions"
                :key="option.id"
                :label="option.title"
                :value="option.id"
              />
            </el-select>
            <div class="list">
              <div
                v-for="battle in battleList"
                :key="battle.id"
                class="battle"
              >
                <div class="name-line">
                  <div
                    class="name"
                    :class="{nameActive: battle.win === battle.leftMemberId}"
                  >{{ battle.leftMemberName }}</div>
                  <img
                    src="../../assets/competition/vs.png"
                    alt=""
                  >
                  <div
                    class="name"
                    :class="{nameActive: battle.win === battle.rightMemberId}"
                  >{{ battle.rightMemberName }}</div>
                </div>
                <el-divider />
                <div class="num-line">
                  <span class="num">组别：第 {{ battle.groupNum }} 组</span>
                  <div>
                    <el-button
                      size="mini"
                      class="btn1"
                      @click="bigScreen(battle.id)"
                    >大屏显示</el-button>
                    <el-button
                      size="mini"
                      :class="battle.win ? 'btn3': 'btn2'"
                      @click="judge(battle)"
                    >{{ battle.win ? '改判': '判决' }}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      width="80%"
      center
      top="25vh"
    >
      <img
        src="../../assets/competition/judge.png"
        style="display: block; margin: auto"
      >
      <div class="battleOptions">
        <div
          class="option"
          :class="{active: winner === battleOptions.leftMemberId}"
          @click="winner=battleOptions.leftMemberId"
        >{{ battleOptions.leftMemberName }}</div>
        <div
          class="option"
          :class="{active: winner === battleOptions.rightMemberId}"
          @click="winner=battleOptions.rightMemberId"
        >{{ battleOptions.rightMemberName }}</div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          class="judgeOk"
          @click="judgeOk()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCompetitionDetail, getCompetitionProject, listBattleTask, listBattleInfo, sendWebSocketMessage, judgeWinner } from '@/api/competition'
export default {
  data() {
    return {
      competitionId: this.$route.query.id,
      domain: process.env.VUE_APP_BASE_API,
      active: '',
      coverUrl: '',
      projects: [],
      task: '',
      taskOptions: [],
      battleList: [],
      battleOptions: {},
      dialogVisible: false,
      winner: '',
      interval: null
    }
  },
  created() {
    this.getCompetition()
    this.updateBattleList()
  },
  destroyed() {
    this.clear()
  },
  methods: {
    async getCompetition() {
      // 获取赛事项目信息
      await getCompetitionProject({ competitionId: this.competitionId }).then(res => {
        this.projects = res.data
        this.active = res.data[0].id
        this.getTaskOptions(res.data[0].id)
      })
      // 获取赛事大屏背景
      await getCompetitionDetail({ id: this.competitionId }).then(res => {
        this.coverUrl = res.data.coverUrl
      })
    },
    // 项目切换事件
    handleClick(active) {
      this.getTaskOptions(active)
    },
    // 获取对战表（32进16...）
    async getTaskOptions(competitionProjectId) {
      await listBattleTask({ competitionProjectId }).then(res => {
        this.taskOptions = res.data
        this.task = res.data[0].id
        this.getBattleList(res.data[0].id)
      })
    },
    // task切换事件
    taskChange(task) {
      this.getBattleList(task)
    },
    // 获取对战列表
    async getBattleList(taskId) {
      await listBattleInfo({ taskId, competitionProjectId: this.active }).then(res => {
        this.battleList = res.data.map(item => {
          return { ...item, leftMemberName: item?.leftMember?.name, rightMemberName: item?.rightMember?.name, winMemberName: item?.winMember?.name }
        })
      })
    },
    // 大屏显示
    bigScreen(id) {
      const params = {
        competitionId: this.competitionId,
        message: JSON.stringify({ type: 'battle1v1', battleId: id })
      }
      sendWebSocketMessage({ ...params }).then()
    },
    // 判决
    judge(row) {
      this.dialogVisible = true
      this.battleOptions = row
    },
    judgeOk() {
      if (this.winner) {
        judgeWinner({ battleId: this.battleOptions.id, winnerId: this.winner }).then(res => {
          this.dialogVisible = false
        })
      }
    },
    // 大屏显示
    async toBigScreen(type, id) {
      const projects = await getCompetitionProject({ ids: [id], competitionId: this.competitionId }).then((res) => {
        return res.data
      })
      const processStatus = projects[0].processStatus
      console.log(processStatus)
      if (processStatus === '0') {
        this.$message({
          message: '海选尚未完成，不可操作！',
          type: 'error'
        })
      } else if (type === 'champion' && processStatus !== '2') {
        this.$message({
          message: '冠军尚未产生，不可操作！',
          type: 'error'
        })
      } else {
        const params = {
          competitionId: this.competitionId,
          message: JSON.stringify({ type, competitionProjectId: processStatus ? this.active : '' })
        }
        sendWebSocketMessage({ ...params }).then()
      }
    },
    // 定时器--实时获取对战列表信息
    updateBattleList() {
      if (this.interval !== null) {
        return
      }
      this.interval = setInterval(() => {
        this.getBattleList(this.task)
      }, 5000)
    },
    // 清除定时器
    clear() {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}
</script>

<style lang="scss" scoped>
.controller {
  width: 100%;
  height: 100%;
  background: #18245c;
  .title {
    background: #00082c;
    height: 46px;
    line-height: 46px;
    font-weight: 600;
    color: #fff;
    font-size: 19px;
    text-align: center;
  }
  .content {
    height: 100%;
    .head {
      padding: 30px 20px;
      padding-bottom: 0;
      background: #00082c;
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .box-title {
          height: 19px;
          font-size: 15px;
          color: #ffffff;
          opacity: 0.5;
          margin: 15px;
        }
      }
    }
    .main {
      width: 100%;
      height: calc(100% - 120px);
      padding: 20px;
      padding-bottom: 0;
      background: #00082c;
      border-radius: 10px;
      margin-top: 10px;
      .list {
        height: calc(100% - 80px);
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .battle {
          width: 100%;
          height: 123px;
          background: #0a185a;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 0;
          }
          .name-line {
            display: flex;
            justify-content: space-between;
            .name {
              width: 138px;
              height: 44px;
              line-height: 44px;
              text-align: center;
              font-size: 15px;
              font-weight: 700;
              color: #cdd6ff;
            }
            .nameActive {
              color: #fbff97;
            }
          }
          .el-divider--horizontal {
            margin: 10px 0;
          }
          .num-line {
            display: flex;
            justify-content: space-between;
            .num {
              color: #ffffff;
              opacity: 0.5;
              font-size: 13px;
              height: 25px;
              line-height: 25px;
            }
            .btn1 {
              border-radius: 16px;
              background: #69a82d;
              width: 75px;
              height: 25px;
              color: #fff;
              border: 0;
            }
            .btn2 {
              border-radius: 16px;
              background: linear-gradient(180deg, #e8b72b 0%, #c43535 100%);
              width: 75px;
              height: 25px;
              color: #fff;
              border: 0;
            }
            .btn3 {
              border: 1px solid #8b92b3;
              border-radius: 16px;
              width: 75px;
              height: 25px;
              color: #8b92b3;
              background: rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-tabs {
  height: calc(100% - 46px);
  .el-tabs__content {
    height: calc(100% - 40px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
.el-tabs__header {
  margin: 0;
  background: #00082c;
}
.el-tabs__item {
  color: #fff;
}
.el-tabs__nav-wrap {
  padding-left: 20px;
}
.el-tabs__active-bar {
  background: #fbff97;
}
.el-tabs__item.is-active {
  color: #fbff97;
  font-weight: 600;
}
.el-select,
.el-input,
.el-input__inner {
  background-color: #00082c;
  color: #cdd6ff;
  border: 0px;
  border-radius: 0px;
  width: 110px;
  font-size: 15px;
}
.battleOptions {
  margin-top: 35px;
  display: flex;
  justify-content: space-between;
  .option {
    width: 125px;
    height: 125px;
    line-height: 125px;
    text-align: center;
    font-size: 21px;
    color: #c43535;
    font-weight: 800;
    border: 2px solid #c43535;
    border-radius: 10px;
  }
  .active {
    background: linear-gradient(180deg, #e8b72b 0%, #c43535 100%);
    color: #fff;
  }
}
.judgeOk {
  background: #c43535;
  color: #fff;
  border: 0;
}
</style>
