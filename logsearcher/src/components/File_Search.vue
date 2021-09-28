<template lang="html">
  <div class="file_search">
    <div class="input-group mb-3">
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="searchFile" name="searchFile" v-on:change="fileChange">
        <label class="custom-file-label">{{ file_name }}</label>
      </div>
      <div class="input-group-append">
        <span class="input-group-text" id="inputGroupFileAddon02" style="cursor:pointer" v-on:click="fileupload">파일업로드</span>
        <select class="form-control" v-model="timeSet">
          <option value="1">1시간 범위</option>
          <option value="2">5분 범위</option>
        </select>
      </div>
    </div>
    <Spinner :loading="$store.getters.getLodingStatus"/>
    <p style="text-align:center;font-size:20px;">
      결과값 중 시간 범위에 속한 것만 추출할 수 있습니다. (기본 1시간 전후)
    </p>
    <p style="text-align:center;font-size:20px;">
      2번째 행부터 <label style="color:red;font-weight:800;">날짜, 발신번호, 수신번호</label> 또는 <label style="color:red;font-weight:800;">날짜, 발신번호</label> 순으로 입력 <label style="font-size:22px;font-weight:800;">※ 셀 서식은 텍스트 형식</label>
    </p>
    <p style="text-align:center;">
      <img src="images/example.PNG" style="width:50%;padding-right:5%;border-right:1px solid black;"/>
      <img src="images/example2.PNG" style="width:33.3%;margin-left:4.5%"/>
    </p>
    <!--
    <br>
    <p style="text-align:center;font-size:22px;font-weight:800;">
      ※ 셀 서식은 텍스트 형식
    </p>
    -->
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'


export default {
  data(){
    return {
      file_name:"여기를 클릭하여 파일을 올려주세요.",
      file_form: null,
      timeSet:"1",
    }
  },
  components: {
    Spinner
  },
  watch:{
  },
  methods: {
    fileChange(e){
      // 파일 담기
      this.file_form = e.target.files[0];
      // 업로드파일이름표시
      this.file_name = e.target.files[0].name;
    },
    fileupload(){
      if(!this.file_form){
        alert('파일을 올려주세요.');
      } else {
        let lodingTF = this.$store.getters.getLodingStatus;
        if(lodingTF){
          alert('파일업로드 중 입니다.');
        } else {
          var fd = new FormData();
          fd.append("searchFile", this.file_form);
          fd.append("timeSet", this.timeSet);

          this.$http.post('/api/elastic/upload', fd, {
            header: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            // 응답
            if(!response.data.success){
              alert(response.data.message);
            } else{
              this.$http.post('/api/elastic/download', {filePath: response.data.message}, {
                responseType: 'blob',
                header: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then((res) => {
                const blob = new Blob([res.data], { type: res.headers['content-type'] });
                if(window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveOrOpenBlob(blob, this.file_name+'_result.xlsx');
                  return;
                }
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.file_name+'_result.xlsx');
                document.body.appendChild(link);
                link.click();
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
#fileSelect{
  background:black;
}
</style>
