<template>
  <div class="judgePage">
    <div v-if="!finish">
      <div class="header">
        <div><i class="el-icon-user-solid" /><span style="margin-left: 10px">JUDGE：{{ judgeName }}</span></div>
        <div><i class="el-icon-trophy-1" /><span style="margin-left: 10px">舞种：{{ projectName }}</span></div>
      </div>
      <el-table
        key="contestantTable"
        v-loading="contestantLoading"
        :data="contestantList"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="no"
          label="号码牌"
          width="66px"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="167px"
        />
        <el-table-column
          prop="score"
          label="分数（10分制）"
        >
          <template slot-scope="{row,$index}">
            <el-input-number
              v-model="row.score"
              size="small"
              :max="10"
              :precision="1"
              controls-position="right"
              @keyup.enter.native="$event.target.blur"
              @blur="enterScope(row, $index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div>进程：{{ already + '/' + total }}</div>
        <el-button
          class="submit"
          @click="dialogVisible = true"
        >提交</el-button>
      </div>
    </div>
    <div
      v-else
      class="success"
    >
      <i
        class="el-icon-circle-check"
        font-size="120px"
      />
      <div>恭喜您提交成功！</div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="80%"
      center
      type="warning"
    >
      <span v-if="total === already">恭喜您已完成本场所有选手的海选评分，比赛海选成绩提交后，分数将无法更改，是否确认提交？</span>
      <span v-else>还有{{ total - already }}位选手未评分，是否继续提交？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="text"
          class="cancel"
          @click="dialogVisible = false"
        >{{ total === already ? '取 消': '返回修改' }}</el-button>
        <el-button
          type="text"
          class="ok"
          @click="submit()"
        >{{ total === already ? '确 定' : '仍然提交' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="secondSubmit"
      width="80%"
      center
      type="warning"
    >
      <span>比赛海选成绩提交后，分数将无法更改，是否确认提交？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="text"
          class="cancel"
          @click="secondSubmit = false"
        >取 消</el-button>
        <el-button
          type="text"
          class="ok"
          @click="judgeSubmit()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectMember, inputScore, getJudgesList, getCompetitionProject, updateJudge } from '@/api/competition'
export default {
  data() {
    return {
      competitionProjectId: this.$route.query.projectId,
      judgeId: this.$route.query.judgeId,
      judgeName: '',
      projectName: '',
      contestantList: [], // 海选选手列表（已经签到的）
      contestantLoading: false,
      total: 0,
      already: 0,
      dialogVisible: false,
      finish: false,
      secondSubmit: false
    }
  },
  created() {
    this.getJudgeName()
  },
  methods: {
    // 获取裁判Name
    async getJudgeName() {
      await getJudgesList({ competitionProjectId: this.competitionProjectId }).then(res => {
        const target = res.data.find(item => item.id === this.judgeId)
        this.judgeName = target.name
        if (target.status === '1') {
          this.finish = true
        } else {
          this.getProjectName()
          this.getContestantList()
        }
      })
    },
    // 获取舞种Name
    async getProjectName() {
      await getCompetitionProject({ ids: [this.competitionProjectId] }).then(res => {
        this.projectName = res.data.find(item => item.id === this.competitionProjectId).name
      })
    },
    // 海选选手列表处理
    async getContestantList() {
      this.contestantLoading = true
      await getProjectMember({
        competitionProjectId: this.competitionProjectId,
        status: 'signed',
        role: 'common'
      }).then(res => {
        this.contestantList = res.data.map(item => {
          const obj = {
            id: item.id,
            no: item.no,
            name: item.name
          }
          if (item.scores.length > 0) {
            obj.score = item.scores.find(score => score.competitionJudgeId === this.judgeId).scope
            if (obj.score) {
              this.already += 1
            }
          }
          return obj
        })
        this.total = res.data.length
        this.contestantLoading = false
      })
    },
    // 录入分数
    enterScope(row, index) {
      // this.$nextTick(_ => {
      //   this.$refs[competitionJudgeId].$refs.input.blur()
      // })
      inputScore({ competitionJudgeId: this.judgeId, competitionMemberId: row.id, scope: row.score }).then(res => {
        this.$message({
          message: '分数录入成功！',
          type: 'success'
        })
        this.$set(this.contestantList, index, row)
        this.already = 0
        this.contestantList.map(item => {
          if (item.score) {
            this.already += 1
          }
        })
      })
    },
    async judgeSubmit() {
      updateJudge({ id: this.judgeId, status: '1' }).then(res => {
        this.finish = true
        this.dialogVisible = false
        this.secondSubmit = false
      })
    },
    // 提交
    submit() {
      if (this.already !== this.total) {
        this.dialogVisible = false
        this.secondSubmit = true
      } else {
        this.judgeSubmit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.judgePage {
  background: #00082c;
  color: #cdd6ff;
  height: 100%;
  .header {
    font-size: 12px;
    font-weight: bold;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }
  .el-table {
    height: calc(100% - 128px);
    overflow-y: auto;
  }
  .el-table th.el-table__cell {
    background-color: #e7e9f4;
  }
  .el-table thead {
    color: #333;
  }
  .el-table {
    border-radius: 15px 15px 0 0;
  }
  .el-input-number--small {
    width: 145px;
  }
  .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 16px;
    color: #cdd6ff;
    background: #07134b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
  }
  .submit {
    background: linear-gradient(180deg, #e8b72b 0%, #c43535 100%);
    border-radius: 18px;
    width: 100px;
    height: 32px;
    border: none;
    color: #fff;
    padding: 0;
  }
}
::v-deep .el-dialog--center .el-dialog__footer {
  padding: 0 !important;
  border-top: 1px solid #ddd !important;
}
::v-deep .el-button + .el-button {
  margin-left: 0;
}
.el-dialog__title {
  font-weight: bold;
}
.dialog-footer {
  font-size: 16px;
  .cancel {
    width: 50%;
    color: #2947cc;
  }
  .ok {
    font-weight: bold;
    color: #2947cc;
    width: 50%;
    border-left: 1px solid #ddd;
  }
  .el-button {
    padding: 16px;
  }
}
.success {
  padding-top: 50%;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  i {
    font-size: 120px;
    color: #7acc29;
    margin-bottom: 30px;
  }
}
</style>
