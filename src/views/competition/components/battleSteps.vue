<template>
  <div>
    <el-steps
      :active="stepActive"
      align-center
    >
      <el-step
        v-for="item in stepsList"
        :key="item.id"
        :title="item.title"
        @click.native="next(item.id)"
      />
    </el-steps>
    <el-table
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
      >
        <template slot-scope="{row}">
          <span>{{ row.leftMember.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rightMemberId"
        label="右边选手"
      >
        <template slot-scope="{row}">
          <span>{{ row.rightMember.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="win"
        label="获胜"
      >
        <template slot-scope="{row}">
          <span>{{ row.winMember.name }}</span>
        </template>
      </el-table-column>
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
    <!-- <el-dialog
      title="录入选手"
      :visible.sync="addPlayerDialog"
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          label="姓名"
          prop="name"
          label-width="100px"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="role"
          label-width="100px"
        >
          <el-radio
            v-model="form.role"
            label="common"
          >common</el-radio>
          <el-radio
            v-model="form.role"
            label="guest"
          >guest</el-radio>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetForm()">取 消</el-button>
        <el-button
          type="primary"
          @click="addPlayer()"
        >确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listBattleTask, listBattleInfo } from '@/api/competition'
export default {
  props: {
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
      list: []
    }
  },
  watch: {
    competitionProjectId() {
      this.getBattleSteps()
    }
  },
  methods: {
    // 获取项目对应的对战步骤表
    getBattleSteps() {
      listBattleTask({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.stepsList = res.data
        this.next(res.data[0].id)
      })
    },
    // 获取表格数据
    next(taskId) {
      listBattleInfo({ taskId, competitionProjectId: this.competitionProjectId }).then(res => {
        this.list = res.data
      })
    },
    // 大屏显示
    bigScreen() {

    },
    // 判决
    judge() {

    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin-bottom: 40px;
}
</style>
