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
        v-show="!finishFlag"
        class="button-new-tag"
        @click="showInput"
      >+ 添加裁判</el-button>
    </div>
    <div v-else-if="stepActive === 1">
      <el-button
        v-show="!finishFlag"
        type="primary"
        icon="el-icon-create"
        style="margin-bottom: 20px;"
        @click="addPlayerDialog = true"
      >
        录入选手
      </el-button>
      <el-button
        v-show="!finishFlag"
        type="primary"
        icon="el-icon-create"
        style="margin-bottom: 20px;"
        @click="downloadExcel"
      >
        下载Excel(已签到)
      </el-button>
      <el-table
        key="playerTable"
        v-loading="playerLoading"
        :data="playerList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="no"
          label="号码牌"
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
            >
              {{ row.role }}
            </el-tag>
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
        <el-table-column
          prop="telephone"
          label="手机号"
        />
        <el-table-column
          v-if="!finishFlag"
          label="操作"
        >
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
      <el-button
        v-show="!finishFlag"
        type="primary"
        style="margin-bottom: 15px"
        @click="enterAllScore()"
      >
        录入分数
      </el-button>
      <el-button
        v-show="!finishFlag"
        type="primary"
        @click="getBattleTree()"
      >
        生成对战图
      </el-button>
      <el-table
        key="contestantTable"
        v-loading="contestantLoading"
        :data="contestantList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="changeSort"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          prop="no"
          label="号码牌"
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
        <el-table-column label="裁判（10分制）">
          <el-table-column
            v-for="judge in judgesList"
            :key="judge.id"
            :label="judge.name"
            :prop="judge.id"
          >
            <template slot-scope="{row,$index}">
              <el-input-number
                v-if="row[judge.id+'edit']"
                :ref="judge.id"
                v-model="row[judge.id]"
                size="small"
                :max="10"
                :min="0"
                :precision="1"
                @keyup.enter.native="$event.target.blur"
                @blur="enterScope(row, judge.id, $index)"
              />
              <span v-else>{{ row[judge.id] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="总分"
          prop="allScore"
          sortable="custom"
        >
          <template slot-scope="{row}">
            <span>{{ row.allScore === 0 ? '' : row.allScore }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!finishFlag"
          label="打分"
        >
          <template slot-scope="{row, $index}">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editScope(row,$index)"
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
    <el-dialog
      :visible.sync="secondChoose"
      width="600px"
    >
      <div slot="title">
        <div>{{ secondChooseInfo.errorMessage }}</div>
        <div class="tip">（需要选择 <i> {{ secondChooseInfo.selectNum }} </i>名选手过海）</div>
      </div>
      <div>需要二海的选手如下：</div>
      <el-form
        ref="secondChooseFrom"
        :model="secondForm"
        :rules="secondRules"
      >
        <el-form-item prop="player">
          <el-checkbox-group v-model="secondForm.player">
            <el-checkbox
              v-for="item in secondChooseInfo.member"
              :key="item.id"
              :label="item.id"
            >{{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetSecondChooseForm()">取 消</el-button>
        <el-button
          type="primary"
          @click="secondChoosePlayer()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProjectMember, getProjectMember, memberSign, deleteMember, addProjectJudge, getJudgesList, deleteJudge, inputScore, generateBattleInfo, updateAudition2Result } from '@/api/competition'
export default {
  props: {
    competitionProjectId: {
      type: String,
      required: true
    },
    competitionProjectName: {
      type: String,
      required: true
    },
    processStatus: {
      type: String,
      required: true
    }
  },
  data() {
    const validateSecondPlayer = (rule, value, callback) => {
      if (value.length !== this.secondChooseInfo.selectNum) {
        callback(new Error(`请选择${this.secondChooseInfo.selectNum}名选手!`))
      } else {
        callback()
      }
    }
    return {
      stepActive: 0,
      judgesList: [], // 裁判列表
      inputVisible: false,
      inputValue: '',
      playerList: [], // 选手列表
      playerLoading: false,
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
      contestantList: [], // 海选选手列表（已经签到的）
      contestantLoading: false,
      secondChoose: false, // 二海选择
      secondChooseInfo: {}, // 二海信息
      secondForm: {
        player: []
      },
      secondRules: {
        player: [
          { type: 'array', required: true, validator: validateSecondPlayer, trigger: 'change' }
        ]
      },
      finishFlag: this.processStatus !== '0' // 海选是否完成 processStatus 0 未完成
    }
  },
  watch: {
    competitionProjectId() {
      this.getJudgeList()
      this.stepActive = 0
    },
    processStatus() {
      this.finishFlag = this.processStatus !== '0'
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
    async getPlayerList() {
      this.playerLoading = true
      await getProjectMember({
        competitionProjectId: this.competitionProjectId
      }).then(res => {
        this.playerLoading = false
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
          h('span', null, '的号码牌为'),
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
            name: item.name,
            role: item.role,
            allScore: 0
          }
          item.scores.map(score => {
            obj[score.competitionJudgeId] = score.scope
            obj[score.competitionJudgeId + 'edit'] = false
            obj.allScore = parseFloat((obj.allScore + score.scope).toFixed(1))
          })
          return obj
        })
        this.contestantLoading = false
      })
    },
    // 录入分数
    enterScope(row, competitionJudgeId, index) {
      this.$nextTick(_ => {
        this.$refs[competitionJudgeId].$refs.input.blur()
      })
      inputScore({ competitionJudgeId, competitionMemberId: row.id, scope: row[competitionJudgeId] }).then(res => {
        this.$message({
          message: '分数录入成功！',
          type: 'success'
        })
        row.allScore = 0
        this.judgesList.map(item => {
          if (row[item.id]) {
            row.allScore += Number(row[item.id])
          }
        })
        row[competitionJudgeId + 'edit'] = false
        this.$set(this.contestantList, index, row)
      })
    },
    // 编辑分数
    editScope(row, index) {
      this.judgesList.map(item => {
        row[item.id + 'edit'] = true
      })
      this.$set(this.contestantList, index, row)
    },
    // 录入分数（全部可编辑）
    enterAllScore() {
      this.contestantList.map((item, index) => {
        this.judgesList.map(obj => {
          item[obj.id + 'edit'] = true
        })
        this.$set(this.contestantList, index, item)
      })
    },
    // 表格排序
    changeSort(column) {
      if (!column.prop || !column.order || !this.contestantList || !this.contestantList.length) return this.contestantList
      var reverse = column.order === 'descending' ? -1 : 1
      if (column.prop === 'allScore') {
        return this.contestantList.sort((a, b) => {
          return reverse * (a['allScore'] - b['allScore'])
        })
      }
    },
    // 生成对战表
    getBattleTree() {
      generateBattleInfo({ competitionProjectId: this.competitionProjectId }).then(res => {
        if (res.errorCode) {
          this.secondChoose = true
          this.secondChooseInfo = res.data
          this.secondChooseInfo.errorMessage = res.errorMessage
        } else {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.finishFlag = true
        }
      })
    },
    // 重置二海选择表单
    resetSecondChooseForm() {
      this.secondForm = {
        player: []
      }
      this.$refs['secondChooseFrom'].resetFields()
      this.secondChoose = false
    },
    // 二海选手
    secondChoosePlayer() {
      this.$refs['secondChooseFrom'].validate((valid) => {
        if (valid) {
          updateAudition2Result({ ids: this.secondForm.player }).then(res => {
            this.resetSecondChooseForm()
            this.getBattleTree()
          })
        }
      })
    },
    // 下载Excel
    downloadExcel() {
      debugger
      if (this.judgesList.length === 0) {
        this.$message({
          message: '裁判未录入, 不可下载',
          type: 'error'
        })
        return
      }

      window.location.href = process.env.VUE_APP_BASE_API + '/bjss/downloadSeaMemberExcel?id=' + this.competitionProjectId
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

.tip {
  font-size: 12px;
  font-weight: 500;
  color: red;
  margin-top: 5px;
}
</style>
