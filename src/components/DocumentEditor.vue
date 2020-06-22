<template>
  <b-container fluid>
    <b-row>
      <b-col cols="1" class=".document-navigator-container">
        <b-button v-b-toggle.sidebar-1 squared class="nav-button">
            <b-icon icon="chevron-compact-left" aria-hidden="true" class="nav-icon"></b-icon>
        </b-button>
      </b-col>
      <b-col cols="8" class="document-container" id="scrollspy-nested">
            <div v-for="(part,index) in getParts" v-bind:key="part.id">
                <b-row class="mt-2 mr-1 part-container" :id="'part-'+(index+1)+'-contrainer'">
                    <b-col cols="12">
                        <h4 :id="'part-'+(index+1)">№{{index+1}}</h4>
                    </b-col>
                    <b-col cols="5">
                        <b-form-textarea
                            placeholder="оригинал"
                            plaintext :value="part.origin"
                            rows="10"
                            no-resize
                            class="mt-1"
                        >
                        </b-form-textarea>
                    </b-col>
                    <b-col cols="1" class="mt-5" @click="createPartUpdate(part.id,part.translated)">
                            <b-button size="sm" title="Синхронизировать">
                                <b-icon icon="link45deg" aria-hidden="true"></b-icon>
                            </b-button>
                    </b-col>
                    <b-col cols="6">
                        <b-form-textarea
                            placeholder="Перевод"
                            rows="10"                    
                            max-rows="10"
                            no-resize
                            class="mt-1"
                            debounce="250"
                            v-model="part.translated"
                        >
                        </b-form-textarea>
                    </b-col>
                    <b-col cols="12">
                        <b-button v-b-toggle="'comment-collapse-'+(index+1)" variant="info" block size="sm" class="mt-1 mb-1">Коментарии<b-badge class="ml-1" variant="primary" pill>{{part.comments.length}}</b-badge></b-button>
                        <b-collapse :id="'comment-collapse-'+(index+1)">
                            <b-list-group>
                                <b-list-group-item>
                                    <b-button v-b-toggle="'addComment-collapse-'+(index+1)" class="mt-1" title="Новый коментарий">
                                        <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
                                    </b-button>
                                    <b-collapse :id="'addComment-collapse-'+(index+1)">
                                        <b-form-group invalid-feedback="заполните поле">
                                            <b-input-group size="sm">
                                                <b-form-textarea
                                                    id="translate-origin"
                                                    placeholder="Комментарий"
                                                    rows="3"                    
                                                    max-rows="3"
                                                    no-resize
                                                    class="mt-1"
                                                    required
                                                    v-model="newComments[index]"
                                                >
                                                </b-form-textarea>
                                                <b-button class="mt-1 ml-1" title="Отправить" @click="createComment(index)">
                                                    <b-icon icon="chat-dots" aria-hidden="true"></b-icon>
                                                </b-button>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-collapse>
                                </b-list-group-item>
                                <b-list-group-item v-for="comment in part.comments" v-bind:key="comment.id">
                                    <b-card :sub-title="comment.person.name+':'" align="left">
                                        <b-card-text>
                                            {{comment.text}}
                                        </b-card-text>
                                        <b-card-text class="small text-muted" style="text-align:right">{{formatDate(comment.date)}}</b-card-text>
                                    </b-card>
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-col>
                </b-row>
            </div>
      </b-col>
      <b-col cols="3" class="document-navigator-container">
            <b-col cols="12">
                <b-form-group invalid-feedback="заполните поле">
                    <b-form-textarea
                        id="chat"
                        ref="chat"
                        rows="10"                    
                        no-resize
                        class="mt-1 ml-1 mr-1 chat-textArea"
                        required
                        plaintext
                        v-model="chatLog"
                        
                    >
                    </b-form-textarea>
                    <b-input-group size="sm" class="mt-1">
                        <b-form-input class="ml-1" v-model="newMessage"></b-form-input>
                        <b-button class="ml-1 fr" size="sm" title="Отправить" @click="createMesssage(newMessage)">
                            <b-icon icon="chat-dots" aria-hidden="true" scale="1"></b-icon>
                        </b-button>
                    </b-input-group>
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block href="#" v-b-toggle.accordion-3 variant="info">Словарь</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                    
                        <b-input-group  class="mb-2 mr-sm-2 mb-sm-0" size="sm">
                            <b-input-group-prepend is-text>
                                <b-icon icon="search"></b-icon>
                            </b-input-group-prepend>
                            <b-form-input id="inline-form-input-searchTranslation" placeholder="search" v-model="search.translation"></b-form-input>
                        </b-input-group>

                        <b-button-group class="mt-1" size="sm">
                                <b-button title="Дабавить" v-b-modal.modal-translation-editor @click="fillTranslateEditorModal()">
                                    <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
                                </b-button>
                                <b-button title="Удалить" :disabled="!(selectedTranslationId!=-1)" @click="sendDeleteTranslation(getTranslationsById(selectedTranslationId))">
                                    <b-icon icon="dash-circle" aria-hidden="true"></b-icon>
                                </b-button>
                                <b-button title="Изменить" v-b-modal.modal-translation-editor :disabled="!(selectedTranslationId!=-1)" @click="fillTranslateEditorModal(getTranslationsById(selectedTranslationId))">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                </b-button>
                        </b-button-group>

                        <b-list-group role="tablist" class="mt-1" flush v-for="translation in translations" v-bind:key="translation.id">
                                <b-list-group-item href="#" @click="selectedTranslationId=translation.id" >
                                
                                <b-button squared v-b-toggle='"translation-collapse-"+translation.id' size="sm">{{translation.origin}}</b-button>
                                <b-collapse role="tabpanel" accordion="translate-accordion" :id='"translation-collapse-"+translation.id' class="mt-2">
                                    <b-card>{{translation.translated}}</b-card>
                                </b-collapse>

                                </b-list-group-item>
                        </b-list-group>

                    </b-card-body>
                    </b-collapse>
                </b-card>
            </b-col>      
      </b-col>
        <b-sidebar id="sidebar-1" title="Навигация" shadow>
            <div class="px-3 py-2">
                
                <b-navbar v-b-scrollspy:scrollspy-nested class="flex-column">
                    <h5 v-if="getDocument!=null && getDocument!=undefined">{{getDocument.name}}</h5>
                    <b-nav pills vertical v-for="(part,index) in getParts" v-bind:key="part.id">
                        <b-nav-item :href="'#part-'+(index+1)+'-contrainer'">Фрагмент №{{index+1}}</b-nav-item>
                    </b-nav>
                </b-navbar>

            </div>
        </b-sidebar>
    </b-row>

    <b-modal id="modal-translation-editor"
      ref="modal"
      title="Дабовить новую запись"
      @ok="sendPostTranslation(translationEditor)">

      <form ref="form">
        <b-form-group invalid-feedback="заполните поле" label-for="translate-origin" :description="translationEditor.origin.length+'/250'">
          <b-form-textarea
          id="translate-origin"
          placeholder="оригинал"
          rows="3"
          max-rows="8"
          required
          v-model="translationEditor.origin"
          :state="translationEditor.origin.length>0 && translationEditor.origin.length<250"
          >
          </b-form-textarea>
        </b-form-group>

        <b-form-group invalid-feedback="заполните поле" label-for="translate-translated" :description="translationEditor.translated.length+'/250'">
          <b-form-textarea
          id="translate-translated"
          class="mt-1"
          placeholder="перевод"
          rows="3"
          max-rows="8"
          required
          v-model="translationEditor.translated"
          :state="translationEditor.translated.length>0 && translationEditor.translated.length<250"
          >
          </b-form-textarea>
        </b-form-group>

      </form>

    </b-modal>

  </b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    name:"DocumentEditor",
    data(){
        return{
            projectId:this.$route.params.projectId,
            documentId:this.$route.params.documentId,
            newMessage:"",
            chatLog:"",
            newComments:[],
            translations:[],
            selectedTranslationId:-1,
            translationEditor:{
                origin:"",
                translated:"",
                id:null
            },
            search:{
                project: "",
                document:"",
                person:"",
                translation:""
            } 
        }
    },
    methods:{
        ...mapActions(["subscribeTranslation","sendPostTranslation",
        "sendDeleteTranslation","getDocumentParts","subscribePart",
        "sendPart","subscribeComment","sendComment","disconnect",
        "getProjectDocument","getDocumentMessages","sendMessage",
        "subscribeMessage","getProjectTranslations","postDocument"]),
        fillTranslateEditorModal(translation={origin:"",translated:"",id:null}){
            this.translationEditor.origin=translation.origin;
            this.translationEditor.translated=translation.translated;
            this.translationEditor.id=translation.id;
        },
        isSelectedTranslation(id){
            return this.selectedTranslationId==id;
        },
        searchTranslations(){
            let search=this.search.translation;
            let newTranslationsArr=[];
            if (this.getTranslations!=null && this.getTranslations!=undefined){
                this.getTranslations.forEach(function(item,index,array){
                    if (search.toUpperCase()==="" || item.origin.toUpperCase().includes(search.toUpperCase())){
                    newTranslationsArr.push(item);
                    }
                });
                this.translations=newTranslationsArr;
            }
        },
        createMesssage(text){
            let date=new Date();
            this.sendMessage({
                text:text,
                person:this.getUser,
                document:this.getDocument,
                date:date.getFullYear()+"-"+this.makeTwoDigits(date.getMonth()+1)+"-"+date.getDate()
            });
            this.newMessage="";
        },
        makeTwoDigits(num) {
            if( num >= 0 && num <= 9) {
                return "0" + num;
            }
            else{ 
                return "" + num;
            }
        },
        createComment(index){
            let date=new Date();
            this.sendComment({
                text:this.newComments[index],
                person:this.getUser,
                part:this.getParts[index],
                date:date.getFullYear()+"-"+this.makeTwoDigits(date.getMonth()+1)+"-"+date.getDate()
            });
            this.newComments[index]="";
        },
        createPartUpdate(id,translated){
            this.sendPart({id,translated});
        },
        formatDate(date){
            let dateStr=date.toString();
            let str='T';
            if (dateStr.includes(str)){
                let i=dateStr.indexOf(str);
                return dateStr.slice(0,i);
            }
            return dateStr
        }
    },
    computed:{
        ...mapGetters(["getUser","getTranslations","getTranslationsById"
        ,"getParts","getPartById","getDocument","getMessages"])
    },
    watch:{
        getParts(newVal,oldVal){
            if (this.newComments.length!=newVal.length){
                for (let i=0;i<newVal.length;i++){
                    this.newComments[i]="";
                }
            }
        },
        getMessages(newVal,oldVal){
            if (oldVal.length===0 || this.chatLog.length===0){
                for (let i=0;i<newVal.length;i++){
                    let message=newVal[i].person.name+"|"+this.formatDate(newVal[i].date)+": "+newVal[i].text+"\n";
                    this.chatLog=this.chatLog+message;
                }
            }else{
                let message=newVal[newVal.length-1].person.name+"|"+this.formatDate(newVal[newVal.length-1].date)+": "+newVal[newVal.length-1].text+"\n";
                this.chatLog=this.chatLog+message;
            }
        },
        chatLog(){
            this.$nextTick(()=>{
            this.$refs.chat.$el.scrollTop=this.$refs.chat.$el.scrollHeight;
            });
        },
        getTranslations(){
            this.searchTranslations();
        },
        'search.translation':function(){
            this.searchTranslations();
        }
    },
    beforeMount(){
        this.getDocumentParts(this.documentId);
        this.getProjectDocument(this.documentId);
        this.getDocumentMessages(this.documentId);
        this.getProjectTranslations(this.projectId);
        this.subscribeTranslation(this.projectId);
        this.subscribeComment(this.documentId);
        this.subscribePart(this.documentId);
        this.subscribeMessage(this.documentId);
    },
    beforeRouteUpdate (to, from, next) {
        
    }
};
</script>

<style scoped>
.document-navigator-container {
  background-color: darkgray;
  height: 93vh;
  overflow-y: auto;
}
.document-container {
  height: 93vh;
  overflow-y: scroll;
  position:relative;
}
.part-container {
  cursor: pointer;
  background-color:whitesmoke;
}
.nav-icon{
    padding: 45vh 0vh 46vh 0vh;
}
.chat-textArea{
    background-color: whitesmoke;
    border:whitesmoke;
    border-spacing: 2px;
    font-size: 18px;
}
</style>