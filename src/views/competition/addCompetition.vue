<template>
  <div>
    <el-form
      ref="form"
      :rules="rules"
      :model="competition"
      label-position="left"
      label-width="140px"
      style="width: 500px; margin-left:50px; margin-top:20px;"
    >
      <el-form-item
        label="赛事名称"
        prop="name"
      >
        <el-input
          v-model="competition.name"
          clearable
          placeholder="请输入赛事名称"
        />
      </el-form-item>
      <el-form-item
        label="赛事地址"
        prop="address"
      >
        <el-input
          v-model="competition.address"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入赛事地址"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="比赛时间"
        prop="startTime"
      >
        <el-date-picker
          v-model="competition.startTime"
          type="datetime"
          placeholder="请选择比赛日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        label="赛事项目"
        prop="projects"
      >
        <el-checkbox-group v-model="competition.projects">
          <el-checkbox label="POPPING" />
          <el-checkbox label="HIP-HOP" />
          <el-checkbox label="BREAKING" />
          <el-checkbox label="LOCKING" />
          <el-checkbox label="JAZZ" />
          <el-checkbox label="FREE-STYLE" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="参赛费用"
        prop="price"
      >
        <el-input-number v-model="competition.price" />
      </el-form-item>
      <el-form-item
        label="海选"
        prop="eliminateMemberSize"
      >
        <el-select
          v-model="competition.eliminateMemberSize"
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectNum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="赛事描述"
        prop="description"
      >
        <el-input
          v-model="competition.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请输入赛事描述"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="宣传海报"
        prop="posterUrl"
      >
        <el-upload
          :action="domain + '/bjss/uploadPhotos'"
          list-type="picture-card"
          accept=".jpg,.png,.jpeg"
          :on-success="playBillSuccess"
          :limit="1"
          :file-list="competition.posterUrl"
          :on-exceed="limit"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item
        label="大屏主背景"
        prop="coverUrl"
      >
        <el-upload
          :action="domain + '/bjss/uploadPhotos'"
          list-type="picture-card"
          accept=".jpg,.png,.jpeg"
          :on-success="backgroundSuccess"
          :limit="1"
          :file-list="competition.coverUrl"
          :on-exceed="limit"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item
        label="大屏对战LOGO"
        prop="battleIconUrl"
      >
        <el-upload
          :action="domain + '/bjss/uploadPhotos'"
          list-type="picture-card"
          accept=".jpg,.png,.jpeg"
          :on-success="logoSuccess"
          :limit="1"
          :file-list="competition.battleIconUrl"
          :on-exceed="limit"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item
        label="赞助商LOGO"
        prop="sponsorUrlList"
      >
        <el-upload
          :action="domain + '/bjss/uploadPhotos'"
          list-type="picture-card"
          accept=".jpg,.png,.jpeg"
          :on-success="sponsorSuccess"
          :file-list="competition.sponsorUrlList"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit()"
        >
          确认
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCompetition, getCompetitionDetail, updateCompetition } from '@/api/competition'
export default {
  data() {
    return {
      competition: {
        name: '',
        address: '',
        startTime: '',
        posterUrl: [],
        coverUrl: [],
        battleIconUrl: [],
        sponsorUrlList: [],
        price: 0,
        eliminateMemberSize: 32,
        projects: []
      },
      rules: {
        name: [{ required: true, message: '赛事名称不能为空！', trigger: 'blur' }],
        address: [{ required: true, message: '赛事地址不能为空！', trigger: 'blur' }],
        startTime: [
          {
            required: true,
            message: '比赛日期时间不能为空！',
            trigger: 'blur'
          }
        ],
        projects: [{ required: true, message: '赛事项目不能为空！', trigger: 'blur' }],
        price: [{ required: true, message: '参数费用不能为空！', trigger: 'blur' }],
        posterUrl: [{ required: true, message: '宣传海报不能为空！', trigger: 'blur' }],
        coverUrl: [{ required: true, message: '大屏主背景不能为空！', trigger: 'blur' }],
        battleIconUrl: [{ required: true, message: '大屏对战LOGO不能为空！', trigger: 'blur' }]
      },
      domain: process.env.VUE_APP_BASE_API,
      selectNum: [{ value: 16, label: '16强' }, { value: 32, label: '32强' }]

    }
  },
  created() {
    if (this.$route.query.id) {
      getCompetitionDetail({ id: this.$route.query.id }).then(res => {
        this.competition = res.data
        this.competition.posterUrl = [{ url: this.domain + res.data.posterUrl }]
        this.competition.coverUrl = [{ url: this.domain + res.data.coverUrl }]
        this.competition.battleIconUrl = [{ url: this.domain + res.data.battleIconUrl }]
        this.competition.sponsorUrlList = res.data.sponsorUrlList.map(item => {
          return { url: this.domain + item }
        })
      })
    }
  },
  methods: {
    // 上传文件格式限制
    beforeAvatarUpload(file) {
      const FileExt = file.name.replace(/.+\./, '').toLowerCase()
      const flag = ['jpg', 'png', 'jpeg'].includes(FileExt)
      if (!flag) this.$message.error('仅支持上传jpg、png、jpeg格式文件')
      return flag
    },
    // 文件超出个数限制
    limit(files) {
      if (files) {
        this.$message({
          message: '只能上传一张图片！',
          type: 'error'
        })
      }
    },
    // 上传海报
    playBillSuccess(res) {
      this.competition.posterUrl = [{ url: this.domain + res.data }]
    },
    // 上传背景
    backgroundSuccess(res) {
      this.competition.coverUrl = [{ url: this.domain + res.data }]
    },
    // 上传大屏对战logo
    logoSuccess(res) {
      this.competition.battleIconUrl = [{ url: this.domain + res.data }]
    },
    // 上传赞助商logo
    sponsorSuccess(res) {
      this.competition.sponsorUrlList.push({ url: this.domain + res.data })
    },
    // 清空表单并移除校验
    resetForm() {
      this.competition = {
        name: '',
        address: '',
        startTime: '',
        posterUrl: [],
        coverUrl: [],
        battleIconUrl: [],
        sponsorUrlList: [],
        price: 0,
        projects: []
      }
      this.$refs['form'].resetFields()
    },
    // 文件地址处理
    formatFile(file) {
      if (file.length === 1) {
        const str = file[0].url
        return str.slice(str.indexOf('/image'))
      } else {
        return file.map(item => {
          return item.url.slice(item.url.indexOf('/image'))
        })
      }
    },
    // 提交赛事
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('确定要提交表单吗？').then(_ => {
            this.competition.posterUrl = this.formatFile(this.competition.posterUrl)
            this.competition.coverUrl = this.formatFile(this.competition.coverUrl)
            this.competition.battleIconUrl = this.formatFile(this.competition.battleIconUrl)
            this.competition.sponsorUrlList = this.formatFile(this.competition.sponsorUrlList)
            const api = this.$route.query.id ? updateCompetition({ ...this.competition, id: this.$route.query.id }) : addCompetition(this.competition)
            api.then(res => {
              this.resetForm()
              this.$router.push(`/competition/list`)
            })
          })
        }
      })
    }
  }
}
</script>
