<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8" class="project-cards-container">
        <b-form inline class="mt-1">
          <b-form-group id="input-group-0">
            <b-form-input
              id="input-0"
              size="sm"
              v-model="search.project"
              type="text"
              placeholder="Введите название проекта"
            ></b-form-input>
          </b-form-group>
        </b-form>

        <b-card-group deck v-if="getProjects!=null || getProjects!=undefined">
          <b-card
            v-for="project in projects"
            v-bind:key="project.id"
            v-bind:border-variant="changeProjectSelector(project.id)"
            :img-src="require('../assets/project.png')"
            img-alt="project"
            img-top
            tag="article"
            style="max-width: 10rem; "
            class="mb-1 mt-1 select"
            @click="selectProject(project.id)"
          >
            <b-card-text>{{project.name}}</b-card-text>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col cols="4" class="project-managment-container">

        <div role="tablist" class="mt-1" v-if="selectedProjectId!=-1">

          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block href="#" v-b-toggle.accordion-2 variant="info">Документы</b-button>
            </b-card-header>
            <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                
                <b-input-group  class="mb-2 mr-sm-2 mb-sm-0" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input id="inline-form-input-searchDoc" placeholder="search" v-model="search.document" ></b-form-input>
                </b-input-group>

                <b-button-group class="mt-1" size="sm">
                  <b-button title="Открыть" :disabled="documentDisabled" :to="'/project/'+selectedProjectId+'/document/'+selectedDocumentId">
                    <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="История" v-b-modal.modal-document-history :disabled="documentDisabled">
                    <b-icon icon="clock-history" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>

                <b-button-group class="mt-1" size="sm">
                  <b-button title="Скачать оригинал" @click="downloadOriginDocument(getDocumentById(selectedDocumentId))" :disabled="documentDisabled">
                            <b-icon icon="download" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button title="Сформировать локализацию" @click="downloadDocumentLocalization(getDocumentById(selectedDocumentId))" :disabled="documentDisabled">
                            <b-icon icon="hammer" aria-hidden="true"></b-icon>
                        </b-button>
                </b-button-group>

                <b-list-group class="mt-1" flush v-for="document in documents" v-bind:key="document.id">
                        <b-list-group-item href="#" @click="selectedDocumentId=document.id" v-bind:class="{'active':isSelectedDocument(document.id)}">{{document.name}}</b-list-group-item>
                </b-list-group>

              </b-card-body>
            </b-collapse>
          </b-card>

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
                        <b-button title="Удалить" :disabled="translationDisabled" @click="sendDeleteTranslation(getTranslationsById(selectedTranslationId))">
                            <b-icon icon="dash-circle" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button title="Изменить" v-b-modal.modal-translation-editor :disabled="translationDisabled" @click="fillTranslateEditorModal(getTranslationsById(selectedTranslationId))">
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

          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block href="#" v-b-toggle.accordion-4 variant="info">Команда</b-button>
            </b-card-header>
            <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                
                <b-input-group  class="mb-2 mr-sm-2 mb-sm-0" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input id="inline-form-input-searchPerson" placeholder="search" v-model="search.person"></b-form-input>
                </b-input-group>

                <b-list-group class="mt-1" flush v-for="person in persons" v-bind:key="person.id">
                        <b-list-group-item href="#" @click="selectedPersonId=person.id" v-bind:class="{'active':isSelectedPerson(person.id)}">
                          {{person.name+'#'+person.id}}
                          <b-icon v-if="getOwner!=null & getOwner!=undefined && getOwner.id===person.id" icon="star"></b-icon>
                        </b-list-group-item>
                </b-list-group>

              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

      </b-col>
    </b-row>

    <b-modal id="modal-translation-editor"
      ref="modal-1"
      title="Запись"
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

    <b-modal id="modal-document-history"
      ref="modal-4"
      title="Истоия документа"
      size="xl"
      scrollable
      @show="getDocumentRecords(selectedDocumentId)">

      <b-list-group v-for="record in getRecords" v-bind:key="record.id">
        <b-list-group-item >
          <b-row>
            <b-col cols="12">
            <h4 v-if="record.person!=undefined">{{record.person.name+"|"+formatDate(record.date)}}</h4>
            </b-col>
            <b-col cols="6">
              <b-form-textarea
              rows="5"                    
              no-resize
              class="mt-1"
              plaintext
              v-model="record.origin"
              >
              </b-form-textarea>
            </b-col>
            <b-col cols="6">
              <b-form-textarea
              plaintext
              v-model="record.text"
              rows="5"                    
              no-resize
              class="mt-1"
              >
              </b-form-textarea>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>

    </b-modal>

  </b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "AllProjectsForm",
  data() {
    return {
      search:{
        project: "",
        document:"",
        person:"",
        translation:""
      },
      selectedProjectId:-1,
      selectedDocumentId:-1,
      selectedPersonId:-1,
      selectedTranslationId:-1,
      projects:[],
      documents:[],
      translations:[],
      persons:[],
      translationEditor:{
        origin:"",
        translated:"",
        id:null
      }    
    };
  },
  methods: {
    ...mapActions(["getPersonOwnProjects","getPersonProjects","getProjectDocuments",
    "getProjectPersons","getProjectTranslations",
    "deletePersonFromProject","addPersonToProject",
    "subscribeTranslation","sendPostTranslation",
    "sendDeleteTranslation","patchProject",
    "postProject","deleteProject","postDocument",
    "deleteDocument","getDocumentRecords","downloadOriginDocument",
    "downloadDocumentLocalization","getProjectOwner"]),
    fillTranslateEditorModal(translation={origin:"",translated:"",id:null}){
      this.translationEditor.origin=translation.origin;
      this.translationEditor.translated=translation.translated;
      this.translationEditor.id=translation.id;
    },
    selectProject(id) {
      this.selectedProjectId=id;
      this.getProjectDocuments(id);
      this.getProjectPersons(id);
      this.getProjectTranslations(id);
      this.getProjectOwner(id);
      this.selectedDocumentId=-1;
      this.selectedPersonId=-1;
      this.selectedTranslationId=-1;
      this.subscribeTranslation(id);
      this.projectName=this.getProjectById(id).name;
    },
    formatDate(date){
      let dateStr=date.toString();
      let str='T';
      if (dateStr.includes(str)){
        let i=dateStr.indexOf(str);
        return dateStr.slice(0,i);
      }
      return dateStr
    },
    isSelectedDocument(id){
        return id==this.selectedDocumentId;
    },
    isSelectedProject(id){
        return id==this.selectedProjectId;
    },
    changeProjectSelector(id){
        return this.isSelectedProject(id)?'primary':'light';
    },
    isSelectedPerson(id){
      return this.selectedPersonId==id;
    },
    isSelectedTranslation(id){
      return this.selectedTranslationId==id;
    },
    searchProject(){
      let search=this.search.project;
      let newProjectsArr=[];
      if (this.getProjects!=null && this.getProjects!=undefined){
        this.getProjects.forEach(function(item,index,array){
            if (search.toUpperCase()==="" || item.name.toUpperCase().includes(search.toUpperCase())){
              newProjectsArr.push(item);
            }
        });
        this.projects=newProjectsArr;
      }
    },
    searchUsers(){
      let search=this.search.person;
      let newPersonsArr=[];
      if (this.getOwner!=null && this.getOwner!=undefined){
        let userInfo=this.getOwner.name+"#"+this.getOwner.id;
        if (search.toUpperCase()==="" || userInfo.toUpperCase().includes(search.toUpperCase()))
          newPersonsArr.push(this.getOwner);
      }
      if (this.getPersons!=null && this.getPersons!=undefined){
        this.getPersons.forEach(function(item,index,array){
          let userInfo=item.name+"#"+item.id;
            if (search.toUpperCase()==="" || userInfo.toUpperCase().includes(search.toUpperCase())){
              newPersonsArr.push(item);
            }
        });
      }
      this.persons=newPersonsArr;
    },
    searchDocuments(){
      let search=this.search.document;
      let newDocsArr=[];
      if (this.getDocuments!=null && this.getDocuments!=undefined){
        this.getDocuments.forEach(function(item,index,array){
            if (search.toUpperCase()==="" || item.name.toUpperCase().includes(search.toUpperCase())){
              newDocsArr.push(item);
            }
        });
        this.documents=newDocsArr;
      }
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
    }
  },
  computed: {
    ...mapGetters(["getUser", "getOwnProjects","getProjects",
    "getDocuments","getPersons",
    "getTranslations","getTranslationsById",
    "getProjectById","getRecords","getDocumentById","getOwner"]),
    isValidUserId(){
      return (this.newPersonId!='' && this.newPersonId>0)
    },
    isValidProjectName(){
      return (this.newProject.name.length>0);
    },
    documentDisabled(){
      return (this.selectedDocumentId==-1 || (this.selectedDocumentId!=-1 && this.getDocumentById(this.selectedDocumentId)==null));
    },
    translationDisabled(){
      return (this.selectedTranslationId==-1 || (this.selectedTranslationId!=-1 && this.getTranslationsById(this.selectedTranslationId)==null));
    }
  },
  watch: {
    getProjects(newVal,oldVal){
      this.searchProject();
    },
    getDocuments(newVal,oldVal){
      this.searchDocuments();
    },
    getPersons(){
      this.searchUsers();
    },
    getOwner(){
      this.searchUsers();
    },
    getTranslations(){
      this.searchTranslations();
    },
    'search.project':function(newVal,oldVal){
        this.searchProject();
    },
    'search.document':function(newVal,oldVal){
        this.searchDocuments();
    },
    'search.person':function(){
        this.searchUsers();
    },
    'search.translation':function(){
      this.searchTranslations();
    }
  },
  beforeMount() {
    this.getPersonProjects();
  }
};
</script>

<style scoped>
.project-managment-container {
  background-color: darkgray;
  height: 100vh;
  overflow-y: auto;
}
.project-cards-container {
  height: 100vh;
  overflow-y: auto;
}
.select:hover {
  cursor: pointer;
  background-color: darkgray;
}
</style>