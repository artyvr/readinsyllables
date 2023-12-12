<template>
  <div id="app">
    <div class="container">
      <h1>Чи-та-ем по сло-гам</h1>
      <div class="toolbar">
        <span class="toolbarBtn" @click="clearInput" ref="clearBtn">Очистить</span>
        <span> | </span>
        <span class="toolbarBtn" @click="print" ref="printBtn">Печать</span>
        <span> | </span>
        <span class="toolbarBtn" @click="copy" ref="copyBtn">Копировать</span>
        <span> | </span>
        <span class="toolbarElement"> Шрифт <input class="fontSizeInput" type="number" v-model="fontSize" size="2" @input="changeFontSize"></span>
      </div>
      <div class="editor">
        <textarea class="inputTxt" :value="inputTxt" @input="update" autofocus placeholder="Текст"></textarea>
        <textarea class="output" ref="output" id="output" v-html="output" placeholder="Текст по слогам" readonly :style="{ 'font-size': fontSize + 'px'  }"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { syllabify } from 'syllables-ru'

export default {
  name: 'App',

  data: () => ({
    inputTxt: '',
    fontSize: 17
  }),

  computed: {
    output() {
      return syllabify(this.cleanText(this.inputTxt), {separator: '-'})
    }
  },

  methods: {
    update: debounce(function (e) {
      this.inputTxt = e.target.value
    }, 100),

    changeFontSize: function(event) {
      if(event.target.value > 1){
        this.fontSize = event.target.value;
      }
      else {
        this.fontSize = 1
      }
    },

    cleanText(txt){
      var str = txt.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
      return str.replace(/(«|»)/g, '"');
    },

    clearInput(){
      this.inputTxt = ''
      this.$refs.clearBtn.classList.add('red')
      this.fontSize = 17
      setTimeout(() => { 
          this.$refs.clearBtn.classList.remove('red')
        }, 300);
    },

    addParagraph(txt){
      return txt.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
    },

    print(){
      var text = this.$refs.output.textContent;
      if (text){
        this.$refs.printBtn.classList.add('blue')
        var WinPrint = window.open('', 'newwin', 'toolbar=no,location=no,scrollbars=no,status=no,menubar=no');
        WinPrint.document.write(this.addParagraph(text));
        WinPrint.document.body.setAttribute('style', 'font-size: ' + this.fontSize + 'px');
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
        setTimeout(() => { 
          this.$refs.printBtn.classList.remove('blue')
        }, 100);
      }
    },

    copy(){
      var text = this.$refs.output.innerHTML;
      if(text){
        navigator.clipboard.writeText(text)
        this.$refs.copyBtn.innerHTML = 'Скопировано'
        this.$refs.copyBtn.classList.add('blue')
        this.$refs.output.classList.add('copyAnimation')
        setTimeout(() => { 
          this.$refs.copyBtn.innerHTML = 'Копировать';
          this.$refs.copyBtn.classList.remove('blue')
          this.$refs.output.classList.remove('copyAnimation')
        }, 1000);
      }
    },

  }

}
</script>

<style>
@font-face {
  font-family: "Montserrat-Thin";
  src: local("Montserrat-Thin"),
   url(./assets/fonts/Montserrat/Montserrat-Thin.ttf) format("truetype");
}

@font-face {
  font-family: "Montserrat-Light";
  src: local("Montserrat-Light"),
   url(./assets/fonts/Montserrat/Montserrat-Light.ttf) format("truetype");
}

@font-face {
  font-family: "Montserrat-Medium";
  src: local("Montserrat-Medium"),
   url(./assets/fonts/Montserrat/Montserrat-Medium.ttf) format("truetype");
}

#app {
  font-family: "Montserrat-Thin";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top: 40px;
}

body {
  margin: 20px;
}

.editor {
  height: 80vh;
  display: flex;
}

input{
  outline : none;
}

.inputTxt,
.output {
  overflow: auto;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  font-size: 14px;
  outline : none;
  resize: none;
}

.inputTxt {
  border: none;
  border-right: 1px solid #ccc;
  background-color: #f6f6f6;
  font-family: 'Monaco', courier, monospace;
}

.output{
  font-family: "Montserrat-Medium";
}

.fontSizeInput{
  width: 50px;
}

.toolbar {
  font-family: "Montserrat-Light";
  padding: 5px;
  color: #65696d;
}

.toolbarBtn {
  cursor: pointer;
  transition: 0.3s;
}

.red {
  color:rgb(245, 53, 53);
}

.blue{
  color: rgb(10, 133, 173);
}

.copyAnimation{
  box-shadow: 0 0 6px 2px rgba(10, 133, 173);
  border: none;
  transition: 0.3s;
}

textarea:focus{
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
  border: none;
}

</style>
