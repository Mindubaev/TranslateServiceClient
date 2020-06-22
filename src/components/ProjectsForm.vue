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
            <b-button class="ml-1" size="sm" v-b-modal.modal-create-project variant="success">Создать</b-button>
        </b-form>

        <b-card-group deck v-if="getOwnProjects!=null || getOwnProjects!=undefined">
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
              <b-button block href="#" v-b-toggle.accordion-1 variant="info">Настройки проекта</b-button>
            </b-card-header>
            <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>

                    <b-form class="mt-1 mt-1">

                        <b-form-input
                          id="input-projectName"
                          size="sm"
                          v-model="projectName"
                          type="text"
                          placeholder="Введите название проекта"
                          :state="projectName.length>0"
                        ></b-form-input>

                        <b-button class="ml-1 mt-1" size="sm" variant="success"  @click="updateProject(selectedProjectId,projectName)">Изменить</b-button>
                        <b-button class="ml-1 mt-1" size="sm" variant="danger"  @click="removeProject({id:selectedProjectId})">Удалить</b-button>
                    </b-form>

                </b-card-body>
            </b-collapse>
          </b-card>

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
                  <b-button title="Создать" v-b-modal.modal-new-document>
                      <b-icon icon="file-earmark" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="Удалить" @click="removeDocument({id:selectedDocumentId})" :disabled="documentDisabled">
                      <b-icon icon="folder-minus" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>

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
              <b-button block href="#" v-b-toggle.accordion-4 variant="info">Настройка команды</b-button>
            </b-card-header>
            <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                
                <b-input-group  class="mb-2 mr-sm-2 mb-sm-0" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input id="inline-form-input-searchPerson" placeholder="search" v-model="search.person"></b-form-input>
                </b-input-group>

                <b-button-group class="mt-1" size="sm">
                        <b-button title="Пригласить" v-b-modal.modal-add-person>
                          <b-icon icon="person-plus" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button title="Выгнать" :disabled="!(selectedPersonId!=-1)" v-on:click="deletePersonFromProject({personId:selectedPersonId,projectId:selectedProjectId})">
                          <b-icon icon="person-dash" aria-hidden="true"></b-icon>
                        </b-button>
                </b-button-group>

                <b-list-group class="mt-1" flush v-for="person in persons" v-bind:key="person.id">
                        <b-list-group-item href="#" @click="selectedPersonId=person.id" v-bind:class="{'active':isSelectedPerson(person.id)}">{{person.name+'#'+person.id}}</b-list-group-item>
                </b-list-group>

              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

      </b-col>
    </b-row>


    <b-modal id="modal-add-person"
      ref="modal"
      title="Добавить пользователя по #id"
      @show="newPersonId=''"
      @ok="addUserToTeam">

      <form ref="form">
        <b-form-group
          label="#ID"
          label-for="id-input"
          invalid-feedback="id необходимо"
        >
          <b-form-input
            id="name-input"
            type="number"
            :state="isValidUserId"
            v-model="newPersonId"
            required
          ></b-form-input>
        </b-form-group>
      </form>

    </b-modal>

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

    <b-modal id="modal-create-project"
      ref="modal-2"
      title="Создать новый проект"
      @ok.prevent="createProject()"
      @show="newProject.name=''">

      <form ref="form">
        <b-form-group invalid-feedback="заполните поле" label-for="input-add-new-project" >
          <b-form-input id="input-add-new-project" placeholder="введите имя проекта" type="text" v-model="newProject.name" :state="newProject.name.length>0"></b-form-input>
        </b-form-group>

      </form>

    </b-modal>

    <b-modal id="modal-new-document"
      ref="modal-3"
      title="Создать новый документ"
      @show="newDocument.expectedSize=100; newDocument.file=null; newDocument.marker=''; newDocument.mode=''"
      @ok="createDocument(newDocument.file,selectedProjectId,newDocument.expectedSize,newDocument.separator,newDocument.mode,$event)">

      <form ref="form">

        <b-form-file
          v-model="newDocument.file"
          :state="Boolean(newDocument.file)"
          placeholder="Выберете или перетащите файл..."
          drop-placeholder="перетащите файл сюда..."
          accept=".txt, .doc, .docx"
        ></b-form-file>

        <b-form-group label="Способы разметки">
          <b-form-radio required v-model="newDocument.mode" name="some-radios" value="expectingSize">По размеру</b-form-radio>
          <b-form-radio required v-model="newDocument.mode" name="some-radios" value="separator">По метке</b-form-radio>
        </b-form-group>

        <b-form-group invalid-feedback="заполните поле" v-if="newDocument.mode=='expectingSize'" label="Количество символов в фрагменте:" label-for="input-expected-size" >
          <b-form-input v-model="newDocument.expectedSize" :state="newDocument.expectedSize>0" required id="input-expected-size" type="number"></b-form-input>
        </b-form-group>
        <b-form-group invalid-feedback="заполните поле" v-if="newDocument.mode=='separator'" label="Знак разделителя:" label-for="iinput-separator" >
          <b-form-input v-model="newDocument.separator" :state="newDocument.separator.length>0" required id="input-separator" type="text"></b-form-input>
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
  name: "ProjectsForm",
  data() {
    return {
      search:{
        project: "",
        document:"",
        person:"",
        translation:""
      },
      newDocument:{
            file:null,
            expectedSize:100,
            separator:"",
            mode:""
      },
      selectedProjectId:-1,
      selectedDocumentId:-1,
      selectedPersonId:-1,
      selectedTranslationId:-1,
      newPersonId:"",
      projects:[],
      documents:[],
      translations:[],
      persons:[],
      translationEditor:{
        origin:"",
        translated:"",
        id:null
      },
      projectName:"",
      newProject:{
        name:""
      }     
    };
  },
  methods: {
    ...mapActions(["getPersonOwnProjects","getProjectDocuments",
    "getProjectPersons","getProjectTranslations",
    "deletePersonFromProject","addPersonToProject",
    "subscribeTranslation","sendPostTranslation",
    "sendDeleteTranslation","patchProject",
    "postProject","deleteProject","postDocument",
    "deleteDocument","getDocumentRecords","downloadOriginDocument",
    "downloadDocumentLocalization"]),
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
    addUserToTeam(bvModalEvt){
      bvModalEvt.preventDefault();
      if (!this.isValidUserId)
        return ;
      this.$nextTick(() => {
          this.$bvModal.hide('modal-add-person')
      });
      this.addPersonToProject({personId:this.newPersonId,projectId:this.selectedProjectId});
    },
    searchProject(){
      let search=this.search.project;
      let newProjectsArr=[];
      if (this.getOwnProjects!=null && this.getOwnProjects!=undefined){
        this.getOwnProjects.forEach(function(item,index,array){
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
      if (this.getPersons!=null && this.getPersons!=undefined){
        this.getPersons.forEach(function(item,index,array){
          let userInfo=item.name+"#"+item.id;
            if (search.toUpperCase()==="" || userInfo.toUpperCase().includes(search.toUpperCase())){
              newPersonsArr.push(item);
            }
        });
        this.persons=newPersonsArr;
      }
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
    },
    updateProject(id,name){
      if (this.projectName.length>0)
        this.patchProject({id,name});
    },
    removeProject(project){
      this.deleteProject(project);
    },
    removeDocument(document){
      this.deleteDocument(document);
    },
    createProject(){
      if (!this.isValidProjectName)
        return
      this.$nextTick(() => {
          this.$bvModal.hide("modal-create-project")
      });
      this.postProject({name:this.newProject.name});
    },
    createDocument(file,projectId,expectedSize,separator,mode,event){
      event.preventDefault();
      if (file!=null && projectId>0 && mode!=""){
        this.postDocument({file,projectId,expectedSize,separator,mode});
        this.$nextTick(()=>{
          this.$bvModal.hide("modal-new-document");
        });
      }
    }
  },
  computed: {
    ...mapGetters(["getUser", "getOwnProjects",
    "getDocuments","getPersons",
    "getTranslations","getTranslationsById",
    "getProjectById","getRecords","getDocumentById"]),
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
    getOwnProjects(newVal,oldVal){
      this.searchProject();
    },
    getDocuments(newVal,oldVal){
      this.searchDocuments();
    },
    getPersons(){
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
    this.getPersonOwnProjects();
  }
};
</script>

<style scoped>
.project-managment-container {
  background-color: darkgray;
  height: 90;
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
