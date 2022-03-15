<template>
  <div>
    <el-steps
      :active="stepActive"
      align-center
    >
      <el-step
        title="裁判"
        icon="el-icon-user"
        @click.native="next(0)"
      />
      <el-step
        title="选手报名/签到"
        icon="el-icon-edit"
        @click.native="next(1)"
      />
      <el-step
        title="海选"
        icon="el-icon-tickets"
        @click.native="next(2)"
      />
    </el-steps>
    <div
      v-if="stepActive === 0"
      class="judge"
    >
      <div class="judgeName">{{ competitionProjectName }}的裁判为：</div>
      <el-tag
        v-for="tag in judgesList"
        :key="tag.id"
        closable
        :disable-transitions="false"
        @close="deleteJudge(tag.id)"
      >
        {{ tag.name }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        @keyup.enter.native="addJudge"
        @blur="addJudge"
      />
      <el-button
        v-else
        class="button-new-tag"
        @click="showInput"
      >+ 添加裁判</el-button>
    </div>
    <div v-else-if="stepActive === 1">
      <el-button
        type="primary"
        icon="el-icon-create"
        style="margin-bottom: 20px;"
        @click="addPlayerDialog = true"
      >
        录入选手
      </el-button>
      <el-table
        key="playerTable"
        :data="playerList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="no"
          label="号牌"
        />
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="role"
          label="角色"
        >
          <template slot-scope="{row}">
            <el-tag
              :type="row.role === 'common'? '' : 'danger'"
              size="small"
            >{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :filters="filters"
          :filter-method="filterHandler"
        >
          <template slot-scope="{row}">
            <el-tag
              v-if="row.status === 'unSigned'"
              size="small"
            >未签到</el-tag>
            <el-tag
              v-else
              type="info"
              size="small"
            >已签到</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <div v-if="row.status === 'unSigned'">
              <el-button
                type="primary"
                size="mini"
                @click="sign(row.id, row.name)"
              >
                签到
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table
        key="contestantTable"
        :data="contestantList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="no"
          label="号牌"
        />
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="role"
          label="角色"
        >
          <template slot-scope="{row}">
            <el-tag
              :type="row.role === 'common'? '' : 'danger'"
              size="small"
            >{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="裁判">
          <el-table-column
            v-for="judge in judgesList"
            :key="judge.id"
            :label="judge.name"
          >
            <template slot-scope="{row,$index}">
              <el-input
                v-if="row[judge.id+'edit']"
                v-model="row[judge.id]"
                size="small"
                @keyup.enter.native="enterScope(row, judge.id, $index)"
                @blur="enterScope(row, judge.id, $index)"
              />
              <span v-else>{{ row[judge.id] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="打分">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editScope(row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import { addProjectMember, getProjectMember, memberSign, deleteMember, addProjectJudge, getJudgesList, deleteJudge, inputScore } from '@/api/competition'
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
      judgesList: [], // 裁判列表
      inputVisible: false,
      inputValue: '',
      playerList: [], // 选手列表
      addPlayerDialog: false,
      form: {
        name: '',
        role: 'common'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
        role: [{ required: true, message: '角色不能为空！', trigger: 'blur' }]
      },
      filters: [{ value: 'signed', text: '已签到' }, { value: 'unSigned', text: '未签到' }],
      contestantList: [] // 海选选手列表（已经签到的）
    }
  },
  watch: {
    competitionProjectId() {
      this.getJudgeList()
      this.stepActive = 0
    }
  },
  methods: {
    // 步骤条点击事件
    next(active) {
      this.stepActive = active
      switch (active) {
        case 0:
          this.getJudgeList()
          break
        case 1:
          this.getPlayerList()
          break
        case 2:
          this.getContestantList()
          break
        default:
          break
      }
    },
    // 显示裁判输入框
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 新增裁判
    addJudge() {
      const inputValue = this.inputValue
      if (inputValue) {
        addProjectJudge({ competitionProjectId: this.competitionProjectId, name: this.inputValue }).then(res => {
          this.getJudgeList()
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 删除裁判
    deleteJudge(id) {
      deleteJudge({ id }).then(res => {
        this.getJudgeList()
      })
    },
    // 获取裁判列表
    getJudgeList() {
      getJudgesList({ competitionProjectId: this.competitionProjectId }).then(res => {
        this.judgesList = res.data
      })
    },
    // 重置表单
    resetForm() {
      this.form = {
        name: '',
        role: 'common'
      }
      this.$refs['form'].resetFields()
      this.addPlayerDialog = false
    },
    // 新增选手
    addPlayer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
            competitionProjectId: this.competitionProjectId

          }
          addProjectMember({ ...params }).then(res => {
            this.getPlayerList()
            this.resetForm()
          })
        }
      })
    },
    // 获取参赛选手列表
    getPlayerList() {
      getProjectMember({
        competitionProjectId: this.competitionProjectId
      }).then(res => {
        this.playerList = res.data
      })
    },
    // 选手签到
    sign(id, name) {
      const array = []
      array.push(id)
      memberSign({ ids: array }).then(res => {
        const num = Object.values(res.data)[0]
        const h = this.$createElement
        const message = h('p', null, [
          h('span', null, '选手'),
          h('i', { style: [{ color: 'teal' }, { fontWeight: '600' }, { margin: '0 5px' }] }, name),
          h('span', null, '的号牌为'),
          h('i', {
            style: [{ color: 'teal' }, { fontWeight: '600' }, { margin: '0 5px' }]
          }, num)
        ])
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success',
          center: true
        }).catch(() => { })
        this.getPlayerList()
      })
    },
    // 删除选手
    handleDelete(id) {
      this.$confirm('确定要删除该选手吗？', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        deleteMember({ id }).then(res => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getPlayerList()
        })
      }).catch(() => { })
    },
    // 筛选选手
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 海选选手列表处理
    getContestantList() {
      getProjectMember({
        competitionProjectId: this.competitionProjectId,
        status: 'signed'
      }).then(res => {
        this.contestantList = res.data.map(item => {
          const obj = {
            id: item.id,
            no: item.no,
            name: item.name,
            role: item.role
          }
          item.scores.map(score => {
            obj[score.competitionJudgeId] = score.scope
            obj[score.competitionJudgeId + 'edit'] = false
            // this.$set(obj, score.competitionJudgeId + 'edit', false)
          })
          return obj
        })
        console.log(this.contestantList)
      })
    },
    // 录入分数
    enterScope(row, competitionJudgeId, index) {
      inputScore({ competitionJudgeId, competitionMemberId: row.id, scope: row[competitionJudgeId] }).then(res => {
        this.$message({
          message: '分数录入成功！',
          type: 'success'
        })
        row[competitionJudgeId + 'edit'] = false
        this.$set(row, competitionJudgeId + 'edit', false)
      })
    },
    // 编辑分数
    editScope(row) {
      this.judgesList.map(item => {
        row[item.id + 'edit'] = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.num {
  font-size: 14px;
  font-weight: 600;
  margin: 0 5px;
}
.el-steps {
  margin-bottom: 40px;
}
.judge {
  .judgeName {
    margin-bottom: 20px;
  }
  .el-tag {
    height: 40px;
    line-height: 38px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 40px;
    line-height: 38px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>

<style lang="scss">
.el-step__title.is-finish,
.el-step__title.is-wait {
  color: #999;
}
.el-step__head.is-finish,
.el-step__head.is-wait {
  color: #999;
  border-color: #999;
}
.el-step__title.is-process {
  color: #409eff;
}
.el-step__head.is-process {
  color: #409eff;
  border-color: #409eff;
}
.el-step__line {
  background-color: #999;
}
</style>
