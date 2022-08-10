<template>
  <div class="judgePage">
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
  </div>
</template>

<script>
import { getProjectMember, inputScore, getJudgesList } from '@/api/competition'
export default {
  data() {
    return {
      competitionProjectId: this.$route.query.projectId,
      judgeId: this.$route.query.judgeId,
      judgeName: '',
      projectName: '',
      contestantList: [], // 海选选手列表（已经签到的）
      contestantLoading: false
    }
  },
  created() {
    this.getJudgeName()
    this.getContestantList()
  },
  methods: {
    // 获取裁判Name
    async getJudgeName() {
      await getJudgesList({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.judgeName = res.data.find(item => item.id === this.judgeId).name
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
          }
          return obj
        })
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
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.judgePage {
  background: #00082c;
  color: #cdd6ff;
  .header {
    font-size: 12px;
    font-weight: bold;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    padding: 16px;
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
}
</style>
