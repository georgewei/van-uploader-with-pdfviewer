<!-- 上传文件组件 -->
<template>
  <div>
    <van-uploader
      ref="fileUploader"
      v-model="fileList"
      multiple
      :accept="innerOptions.allowedFileTypes+''"
      :max-count="maxCount"
      :before-read="beforeRead"
      :after-read="afterRead"
      :show-upload="!innerOptions.readonly"
      :deletable="!innerOptions.readonly"
      @delete="onDeleteFile"
    >
      <template #preview-cover="{ filename, url }">
        <div v-if="isPdf(filename)" class="van-image van-uploader__preview-image">
          <img
            src="/static/icon-pdf.jpg"
            class="van-image__img"
            style="object-fit: cover;"
            @click="onPreviewPdf(filename, url)"
          />
        </div>
      </template>
    </van-uploader>
    <PdfViewer v-show="showPdf" ref="pdfViewer" :title="pdfTitle" :onLoaded="onPdfLoaded" :onClose="onClosePdfViewer" />
  </div>
</template>

<script>
import { Toast } from 'vant'
import * as commonUtils from '@/scripts/commonUtils'
import PdfViewer from '@/components/PdfViewer.vue'

export default {
  name: 'FileUploader',
  components: {
    PdfViewer
  },
  props: {
    /**
     * 文件列表
     */
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    /**
     * 上传文件组件选项
     * 选项属性说明参见defaultOptions
     */
    options: {
      type: Object,
      default: () => {
        return Object.assign({}, this.defaultOptions)
      },
    },
    /**
     * 上传文件成功时的回调函数
     * 函数声明
     *   function(fileId);
     * 参数说明
     *   fileId - 文件上传成功后由系统生成的文件ID
     */
    onUploaded: { type: Function, default: null },
    /**
     * 删除文件时的回调函数
     * 函数声明
     *   function(fileId);
     * 参数说明
     *   fileId - 被删除文件的文件ID
     */
    onDelete: { type: Function, default: null },
  },
  data() {
    return {
      defaultOptions: {
        readonly: false, // 是否只能查看已上传的文件
        allowUploadMulti: true, // 是否允许上传多个文件
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'], // 允许上传的文件类型
        compressImage: false, // 是否压缩图片
      },
      fileList: [],
      innerOptions: Object.assign({}, this.defaultOptions),
      pdfTitle: '',
      showPdf: false
    }
  },
  computed: {
    /**
     * 最多允许上传的图片数量（>1即未允许上传多张图片）
     */
    maxCount() {
      return this.innerOptions.allowUploadMulti ? 100 : 1
    },
  },
  methods: {
    beforeRead(file) {
      for (let i = 0; i < this.innerOptions.allowedFileTypes.length; i++) {
        let regexp = new RegExp('^' + this.innerOptions.allowedFileTypes[i] + '$')
        if (regexp.test(file.type)) {
          return true
        }
      }

      // 显示提示信息
      let message = ''
      for (let i = 0; i < this.innerOptions.allowedFileTypes.length; i++) {
        let fileType = this.innerOptions.allowedFileTypes[i]
        message += fileType.substring(fileType.indexOf('/') + 1) + '、'
      }
      message = '只允许上传' + message.substring(0, message.lastIndexOf('、')) + '格式文件'
      Toast.fail(message)

      return false
    },
    afterRead(fileListItem, detail) {
      new Promise((resolve) => {
        let result = {
          fileId: null,
          url: ''
        }
        // 在此上传文件，取得服务器生成的fileId和url
        resolve(result)
      }).then((result) => {
        let filename = fileListItem.file.name
        let fileIndex = detail.index
        this.fileList[fileIndex].id = result.fileId
        this.fileList[fileIndex].url = result.url
        this.fileList[fileIndex].filename = filename
        this.fileList[fileIndex].isImage = commonUtils.isImage(filename)
        this.fileList[fileIndex].isPdf = commonUtils.isPdf(filename)
        // 同步model数据
        this.$emit('input', this.fileList)
        // 调用事件处理回调函数（如果有），调用者可进行关联处理
        if (this.onUploaded) {
          this.onUploaded(result.fileId)
        }
      })
    },
    /**
     * 删除文件事件（）
     * @param {Object} fileListItem 文件列表项（fileList中的元素）
     */
    onDeleteFile(fileListItem) {
      // 同步model数据
      this.$emit('input', this.fileList)
      // 调用事件处理回调函数（如果有），调用者可进行关联处理
      if (this.onDelete) {
        this.onDelete(fileListItem.id)
      }
    },
    /**
     * 自定义预览PDF事件
     * @param {String} filename 文件名
     * @param {String} url PDF文件的Url
     */
    onPreviewPdf(filename, url) {
      this.pdfTitle = filename
      this.$refs.pdfViewer.preview(url)
    },
    onPdfLoaded() {
      this.showPdf = true
    },
    /**
     * 关闭按钮点击事件（隐藏PDF预览组件）
     */
    onClosePdfViewer() {
      this.showPdf = false
    },
    isPdf(filename) {
      return commonUtils.isPdf(filename)
    }
  },
  watch: {
    value: {
      handler(value) {
        this.fileList = value || []
      },
      deep: true,
      immediate: true,
    },
    options: {
      handler(value) {
        this.innerOptions = Object.assign({}, commonUtils.defaultsDeep(value, this.defaultOptions))
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
