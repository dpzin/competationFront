<template>
  <div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item,index) in projects"
        :key="index"
        :label="item.name"
        :name="index.toString()"
      >
        <el-steps
          :active="stepActive"
          align-center
        >
          <el-step
            title="报名/签到"
            icon="el-icon-edit"
          />
          <el-step
            title="海选"
            icon="el-icon-tickets"
          />
        </el-steps>
        <div v-if="stepActive === 1">
          <el-button
            type="primary"
            icon="el-icon-create"
            style="margin: 20px 0;"
            @click="addPlayerDialog = true"
          >
            录入选手
          </el-button>
          <el-table
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
                    @click="sign(row.id)"
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
          <el-button
            style="margin-top: 12px;"
            @click="next"
          >下一步</el-button>
        </div>
        <div v-else>
          <el-button
            style="margin-top: 12px;"
            @click="goBack"
          >上一步</el-button>
          <el-table
            title="海选选手名单"
            :data="data"
            style="width: 100%"
          >
            <el-table-column
              prop="num"
              label="号牌"
            />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
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
import { getCompetitionProject, addCompetitionMember, getCompetitionMember, memberSign } from '@/api/competition'
export default {
  data() {
    return {
      projects: [],
      activeName: '0',
      stepActive: 1,
      playerList: [],
      addPlayerDialog: false,
      form: {
        name: '',
        role: 'common'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
        role: [{ required: true, message: '角色不能为空！', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      getCompetitionProject({ competitionId: this.$route.query.id }).then(res => {
        this.projects = res.data
        this.getPlayerList()
      })
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    next() {
      if (this.stepActive++ > 2) this.active = 0
    },
    goBack() {
      if (this.stepActive-- < 0) this.active = 0
    },
    // 重置表单
    resetForm() {
      this.form = {
        name: ''
      }
      this.addPlayerDialog = false
    },
    // 新增选手
    addPlayer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
            competitionProjectId: this.projects[Number(this.activeName)].id

          }
          addCompetitionMember({ ...params }).then(res => {
            this.getPlayerList()
            this.resetForm()
          })
        }
      })
    },
    // 获取参赛选手列表
    getPlayerList() {
      getCompetitionMember({
        competitionProjectId: this.projects[Number(this.activeName)].id
      }).then(res => {
        this.playerList = res.data
      })
    },
    // 选手签到
    sign(id) {
      const array = []
      array.push(id)
      memberSign({ ids: array }).then(res => {
        const num = Object.values(res.data)[0]
        console.log(Object.values(res.data))

        this.$confirm(`该选手的号牌为${<span class='num'>{num}</span>}?`, '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          type: 'success',
          center: true
        }).then(() => {
          this.getPlayerList()
        })
      })
    },
    // 删除选手
    handleDelete(id) {

    }
  }
}
</script>

<style lang="scss">
.el-tabs__item {
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 16px;
}
.el-tabs__nav {
  margin-left: 20px;
}
.el-tab-pane {
  margin: 20px;
}
</style>

<style lang="scss" scoped>
.num {
  font-size: 14px;
  font-weight: 600;
  margin: 0 5px;
}
</style>
