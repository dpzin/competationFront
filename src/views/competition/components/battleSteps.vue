<template>
  <div>
    <el-steps
      :active="stepActive"
      align-center
    >
      <el-step
        v-for="item in stepsList"
        :key="item.step"
        :title="item.title"
        @click.native="next(item.step - 1,item.id)"
      />
    </el-steps>
    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        prop="groupNum"
        label="组别"
      >
        <template slot-scope="{row}">
          <span>第{{ row.groupNum }}组</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="leftMemberId"
        label="左边选手"
        :formatter="formatterIdToName"
      />
      <el-table-column
        prop="rightMemberId"
        label="右边选手"
        :formatter="formatterIdToName"
      />
      <el-table-column
        prop="win"
        label="获胜"
        :formatter="formatterIdToName"
      />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            @click="bigScreen(row)"
          >
            大屏显示
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="judge(row)"
          >
            判决
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="判决"
      :visible.sync="judgeDialog"
      width="500px"
    >
      <el-radio
        v-model="winner"
        :label="judgeObj.leftMemberId"
        border
      >{{ judgeObj.leftMemberName }}</el-radio>
      <el-radio
        v-model="winner"
        :label="judgeObj.rightMemberId"
        border
      >{{ judgeObj.rightMemberName }}</el-radio>
      <div slot="footer">
        <el-button @click="judgeDialog = false; winner = ''">取 消</el-button>
        <el-button
          type="primary"
          @click="judgeOk()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBattleTask, listBattleInfo, judgeWinner } from '@/api/competition'
export default {
  props: {
    active: {
      type: String,
      required: true
    },
    competitionProjectId: {
      type: String,
      required: true
    },
    competitionProjectName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      stepActive: 0,
      stepsList: [],
      taskId: '',
      list: [],
      loading: false,
      judgeDialog: false,
      winner: '',
      judgeObj: {} // 当前选择判决的对象
    }
  },
  watch: {
    active() {
      if (this.active.indexOf('-2') > -1) {
        this.getBattleSteps()
      }
    }
  },
  methods: {
    // 获取项目对应的对战步骤表
    async getBattleSteps() {
      await listBattleTask({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.stepsList = res.data
        this.stepActive = res.data[0].step - 1
        this.taskId = res.data[0].id
        this.next(res.data[0].step - 1, res.data[0].id)
      })
    },
    // 获取表格数据
    async next(step, taskId) {
      this.stepActive = step
      this.taskId = taskId
      this.loading = true
      await listBattleInfo({ taskId, competitionProjectId: this.competitionProjectId }).then(res => {
        this.list = res.data.map(item => {
          return { ...item, leftMemberName: item?.leftMember?.name, rightMemberName: item?.rightMember?.name, winMemberName: item?.winMember?.name }
        })
        this.loading = false
      })
    },
    // 根据id获取name
    formatterIdToName(row, column) {
      let member
      switch (column.property) {
        case 'leftMemberId':
          member = 'leftMemberName'
          break
        case 'rightMemberId':
          member = 'rightMemberName'
          break
        case 'win':
          member = 'winMemberName'
          break
        default:
          break
      }
      return row[member]
    },
    // 大屏显示
    bigScreen() {

    },
    // 判决
    judge(row) {
      this.judgeDialog = true
      this.judgeObj = row
    },
    judgeOk() {
      if (this.winner) {
        judgeWinner({ battleId: this.judgeObj.id, winnerId: this.winner }).then(res => {
          this.judgeDialog = false
          this.next(this.stepActive, this.taskId)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin-bottom: 40px;
}
</style>
