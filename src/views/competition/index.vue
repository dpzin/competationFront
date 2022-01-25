<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-create"
        @click="handleCreate"
      >
        创建赛事
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        label="赛事名称"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="比赛日期">
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="competition"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="赛事名称"
          prop="name"
        >
          <el-input v-model="competition.name" />
        </el-form-item>
        <el-form-item
          label="具体地址"
          prop="address"
        >
          <el-input v-model="competition.address" />
        </el-form-item>
        <el-form-item
          label="开始日期"
          prop="startTime"
        >
          <el-date-picker
            v-model="competition.startTime"
            type="date"
            placeholder="请输入比赛开始日期"
          />
        </el-form-item>
        <el-form-item
          label="宣传海报"
          prop="address"
        >
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>

        </el-form-item>
        <el-form-item
          label="大屏背景"
          prop="address"
        >
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCompetitionList } from '@/api/competition'
// import parseTime from "@/utils/index";
export default {
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: true,
      listQuery: {
        title: undefined
      },
      competition: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        address: [{ required: true, message: '必填项', trigger: 'blur' }],
        startTime: [
          {
            type: 'date',
            required: true,
            message: '必填项',
            trigger: 'change'
          }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    console.log('created')
  },
  methods: {
    getList() {
      this.listLoading = false
      getCompetitionList().then((res) => {
        console.log('res', res)
      })
      // this.list = [
      //   {
      //     id: "2c9abe3f7dbcc096017dbcc599a50001",
      //     name: "test服务器",
      //     status: "0",
      //     address: "goodgood",
      //     posterUrl:
      //       "/image/competition/44d0257a-830a-42e9-ac1a-2d22b24d137e.png",
      //     coverUrl:
      //       "/image/competition/369bc7b5-82fb-47c1-9b5b-4fadfb184ea9.jpg",
      //     userId: "111",
      //     startTime: "2021-12-12",
      //     endTime: "2021-12-13",
      //     description: "goodgood",
      //     createTime: "2021-12-15 14:26:46",
      //     updateTime: "2021-12-15 14:26:46",
      //   },
      // ];
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>
