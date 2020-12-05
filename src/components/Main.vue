<template>
  <div>
    <NavBar
      navTitle="Van-uploader with PDF viewer" class="title"
    ></NavBar>
    <div class="content">
      <div class="comment">
        <p>A demo which extends &lt;van-uploader&gt; to support previewing PDF files.</p>
        <p>please run this demo on a mobile device, or emulated mobile mode in Chrome.</p>
      </div>
      <van-form>
        <van-field
          style="background: rgba(255, 255, 255, 0.4)"
          name="test"
          label="Files"
        >
          <template #input>
            <FileUploader v-model="fileList" :options="uploaderOptions" />
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="fixToBottom">
      <van-button class="submit_btn" type="primary" color="#39861f">Submit</van-button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import FileUploader from '@/components/FileUploader.vue'

export default {
  name: 'HelloWorld',
  components: {
    NavBar,
    FileUploader
  },
  data() {
    return {
      fileList: [
        {
          id: 0,
          filename: 'flower.jpg',
          isImage: true,
          isPdf: false,
          url: '/static/flower.jpg'
        },
        {
          id: 1,
          filename: 'test.pdf',
          isImage: false,
          isPdf: true,
          url: '/static/test.pdf'
        }
      ],
      uploaderOptions: {}
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  position: absolute;
  height: calc(100vh - 106px);
  overflow-y: auto;
  top: 44px;
  box-sizing: border-box;
}
.title {
  position: fixed;
  top: 0;
  left: 0;
  height: 44px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: #39861f;
  background-color: rgba(206, 223, 161);
}
.comment {
  width: 100%;
}
.submit_btn {
  width: calc(100% - 10px);
  border-radius: 5px;
  margin: 0 5px;
  margin-top: 10px;
}
.fixToBottom {
  position: fixed;
  top: calc(100vh - 62px);
  height: 62px;
  width: 100%;
  align-items: center;
  align-content: space-between;
  background-color: rgba(206, 223, 161);
}
</style>
