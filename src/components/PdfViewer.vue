<template>
  <div class="pdfViewer-content">
    <!-- pdfViewer必须放在其它元素的前面，保证不会遮挡其它元素 -->
    <div class="pdfViewer">
      <pdf
        ref="pdf"
        :src="src"
        :style="'width:' + scaleSteps[scaleIndex] + '%'"
        :page="currentPage"
        @loaded="onPdfLoaded"
        @num-pages="pageCount = $event"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
      ></pdf>
    </div>
    <NavBar :navTitle="title" @click-left="onCloseClick" class="title"></NavBar>
    <div class="fixToBottom">
      <!-- click事件加上.prevent后缀用于阻止事件冒泡 -->
      <table>
        <td class="toolbutton">
          <van-button @click.prevent="onPreviousPage">上页</van-button>
        </td>
        <td class="toolbar-text">
          <span>{{currentPage}}/{{pageCount}}</span>
        </td>
        <td class="toolbutton">
          <van-button @click.prevent="onNextPage">下页</van-button>
        </td>
        <td style="width: 4px"/>
        <td class="toolbutton">
          <van-button @click.prevent="onZoomOut">缩小</van-button>
        </td>
        <td class="toolbar-text">
          <span>{{scaleSteps[scaleIndex]}}%</span>
        </td>
        <td class="toolbutton">
          <van-button @click.prevent="onZoomIn">放大</van-button>
        </td>
      </table>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import NavBar from '@/components/NavBar.vue'
import { Toast } from 'vant'

export default {
  components: { pdf, NavBar },
  props: {
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    onLoaded: { type: Function, default: null },
    onClose: { type: Function, default: null }
  },
  data() {
    return {
      src: '',
      currentPage: 1,
      pageCount: 0,
      scaleIndex: 0,
      scaleSteps: [100, 120, 150, 200, 300, 500],
      touchStartPoint: {
        x: 0,
        y: 0,
      },
      containerPos: {
        x: 0,
        y: 0,
      }
    }
  },
  mounted() {
    // 增加监听移动端的touchstart和touchmove事件，在放大预览PDF时可拖动平移显示PDF内容
    document.addEventListener('touchstart', this.onTouchStart)
    document.addEventListener('touchmove', this.onTouchMove)
  },
  methods: {
    // 预览pdf
    preview(url) {
      if (url) {
        this.src = pdf.createLoadingTask(url)
      } else {
        Toast.fail('未指定需要预览的PDF文件url')
      }
    },
    onPdfLoaded() {
      if (this.onLoaded) {
        this.onLoaded()
      }
    },
    onGetPageCount(pageCount) {
      this.pageCount = pageCount
    },
    onPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    onNextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    onZoomIn() {
      if (this.scaleIndex < this.scaleSteps.length) {
        this.scaleIndex++
      }
    },
    onZoomOut() {
      if (this.scaleIndex > 0) {
        this.scaleIndex--
      }
    },
    /**
     * 根据WEB元素的样式提取元素的位置
     * @param {Object} style WEB元素的样式
     */
    extractPoint(style) {
      let point = {
        x: 0,
        y: 0,
      }
      if (style) {
        if (style.left) {
          point.x = parseInt(style.left.substr(0, style.left.length - 1))
        }
        if (style.top) {
          point.y = parseInt(style.top.substr(0, style.top.length - 1))
        }
      }
      return point
    },
    onTouchStart(event) {
      if (this.$refs.pdf) {
        // 保存点击的位置
        this.touchStartPoint.x = event.touches[0].clientX
        this.touchStartPoint.y = event.touches[0].clientY
        // 保存容器的位置
        this.containerPos = this.extractPoint(this.$refs.pdf.$el.style)
      }
    },
    onTouchMove(event) {
      if (this.$refs.pdf) {
        // 计算拖动后当前位置距点击位置的偏移量
        let offset = {
          x: event.touches[0].clientX - this.touchStartPoint.x,
          y: event.touches[0].clientY - this.touchStartPoint.y,
        }
        // 强制将容器的定位方式改为绝对定位
        this.$refs.pdf.$el.style.position = 'absolute'
        // 设置容器的位置（点击时容器的位置加上偏移量）
        this.$refs.pdf.$el.style.top = this.containerPos.y + offset.y + 'px'
        this.$refs.pdf.$el.style.left = this.containerPos.x + offset.x + 'px'
      }
    },
    /**
     * 关闭按钮点击事件（目前并未实现隐藏组件，由调用者处理）
     */
    onCloseClick() {
      if (this.onClose) {
        this.onClose()
      }
    }
  },
  watch: {
    url: {
      handler(value) {
        if (value) {
          this.preview(value);
        }
      }
    },
    immediate: true
  }
}
</script>

<style scoped>
.pdfViewer-content {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.title {
  position: fixed;
  top: 0;
  height: 44px;
  width: 100%;
  background-color: rgba(206, 223, 161);
}
.pdfViewer {
  position: absolute;
  width: 100%;
  top: 44px;
  bottom: 44px;
  background-color: white;
  align-content: center;
  text-align: center;
}
.fixToBottom {
  position: fixed;
  width: 100%;
  height: 44px;
  bottom: 0;
  align-items: center;
  align-content: space-between;
  background-color: rgba(206, 223, 161);
}
.fixToBottom >>> table {
  width: 100%;
  border: none;
  border-spacing: 0px;
}
.toolbutton {
  width: calc(20% - 1px);
}
.toolbutton >>> button {
  width: 100%;
  color: white;
  background-color: #39861f;
}
.toolbar-text {
  width: 10%;
  text-align: center;
}
</style>