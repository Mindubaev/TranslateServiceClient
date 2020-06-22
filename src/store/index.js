import Vue from 'vue'
import Vuex from 'vuex'
import { API } from '@/API/API.js'
import {SocketAPI} from '@/API/SocketAPI.js'
import {vuexPersist} from '@/store/persist.js';
 
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[vuexPersist.plugin],
  state: {
    API: new API("http://localhost:9090"),
    SocketAPI: new SocketAPI("ws://localhost:9090/queues"),
    user: undefined,
    authFail:false,
    userPatched:true,
    ownProjects:[],
    projects:[],
    documents:[],
    translations:[],
    persons:[],
    parts:[],
    messages:[],
    records:[],
    documentEditor:{
      document:null
    },
    projectOwner:null
  },
  mutations: {
    updateCurrentUser(state, user) {
      if (user != null && user != undefined)
        state.user = user;
    },
    updateAuthFail(state,val){
      state.authFail=val;
    },
    updateUserPatched(state,val){
      state.userPatched=val;
    },
    logoutUser(state){
      state.user=null;
    },
    updateOwnProjects(state,projects){
      state.ownProjects=projects;
    },
    updateProjects(state,projects){
      state.projects=projects;
    },
    updateDocuments(state,documents){
      state.documents=documents;
    },
    updatePersons(state,persons){
      state.persons=persons;
    },
    updateTranslations(state,translations){
      state.translations=translations;
    },
    postTranslation(state,translation){
      let find=false;
      for(let i=0;i<state.translations.length;i++){
        if (state.translations[i].id==translation.id){
          console.log("find["+i+"]"+JSON.stringify(state.translations[i])+"=>"+JSON.stringify(translation));
          Vue.set(state.translations,i,translation);
          find=true;
        }
      }
      if (!find)
        state.translations.push(translation);
    },
    deleteTranslation(state,translation){
      for(let i=0;i<state.translations.length;i++)
        if (state.translations[i].id==translation.id){
          state.translations.splice(i,1);
        }
    },
    updateParts(state,parts){
      console.log(JSON.stringify(parts));
      state.parts=parts;
    },
    updatePart(state,part){
      for (let i=0;i<state.parts.length;i++){
        if (state.parts[i].id===part.id)
          Vue.set(state.parts[i],'translated',part.translated);
      }
    },
    updateComment(state,comment){
      for (let i=0;i<state.parts.length;i++){
        if (state.parts[i].id===comment.partId){
          delete comment.partId;
          state.parts[i].comments.push(comment);
        }
      }
    },
    updateDocument(state,document){
      state.documentEditor.document=document;
    },
    updateMessages(state,messages){
      state.messages=messages;
    },
    updateMessage(state,message){
      state.messages.push(message);
    },
    updateProject(state,project){
      console.log("try to update projects");
      for (let i=0;i<state.projects.length;i++){
        if (state.projects[i].id===project.id){
          Vue.set(state.projects[i],"name",project.name);
        }
      }
      console.log("try to update ownProjects");
      for (let i=0;i<state.ownProjects.length;i++){
        if (state.ownProjects[i].id===project.id){
          Vue.set(state.ownProjects[i],"name",project.name);
        }
        console.log(JSON.stringify(state.ownProjects));
      }
    },
    addProject(state,project){
      state.ownProjects.push(project);
    },
    deleteProject(state,project){
      for (let i=0;i<state.ownProjects.length;i++){
        if (state.ownProjects[i].id===project.id){
          state.ownProjects.splice(i,1);
        }
      }
    },
    deleteDocument(state,document){
      for (let i=0;i<state.documents.length;i++){
        if (state.documents[i].id===document.id){
          state.documents.splice(i,1);
        }
      }
    },
    updateDocumentsName(state,document){
      for (let i=0;i<state.documents.length;i++){
        if (state.documents[i].id===document.id){
          Vue.set(state.documents[i],"name",document.name);
        }
      }
    },
    addDocument(state,document){
      state.documents.push(document);
    },
    updateRecords(state,records){
      state.records=records;
    },
    updateProjectOwner(state,owner){
      state.projectOwner=owner;
    }
  },
  actions: {
    async loginUser(ctx, form) {
      try {
        console.log("try login");
        let API = ctx.getters.getAPI;
        let user = await API.loginUser(form.username, form.password);
        ctx.commit("updateAuthFail",(user==null));
        ctx.commit("updateCurrentUser",user);
        console.log("finish action");
      } catch (ex) {
        console.log(ex);
      }
    },
    async postUser(ctx,form){
      try{
        console.log("try post");
        let API = ctx.getters.getAPI;
        let user = await API.postUser(form.name,form.username,form.password);
        ctx.commit("updateAuthFail",(user==null));
        ctx.commit("updateCurrentUser",user);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async logoutUser(ctx,user){
      let API = ctx.getters.getAPI;
      API.logoutUser();
      ctx.commit("logoutUser");
    },
    async patchUser(ctx,user){
      try{
        console.log("try patch");
        let API = ctx.getters.getAPI;
        let updatedUser = await API.patchUser(user);
        ctx.commit("updateUserPatched",(updatedUser!=null));
        if (updatedUser!=null)
          ctx.commit("updateCurrentUser",updatedUser);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async getPersonOwnProjects(ctx){
      try{
        console.log("try get");
        let API = ctx.getters.getAPI;
        let projects = await API.getOwnProjects(ctx.getters.getUser.id);
        if (projects!=null)
          ctx.commit("updateOwnProjects",projects);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async getProjectDocuments(ctx,projectId){
      try{
        console.log("try get");
        let API = ctx.getters.getAPI;
        let docs = await API.getProjectDocuments(projectId);
        if (docs!=null)
          ctx.commit("updateDocuments",docs);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async getProjectPersons(ctx,projectId){
      try{
        console.log("try get");
        let API = ctx.getters.getAPI;
        let persons = await API.getProjectPersons(projectId);
        if (persons!=null)
          ctx.commit("updatePersons",persons);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async getProjectTranslations(ctx,projectId){
      try{
        console.log("try get");
        let API = ctx.getters.getAPI;
        let translations = await API.getProjectTranslations(projectId);
        if (translations!=null)
          ctx.commit("updateTranslations",translations);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async deletePersonFromProject(ctx,params){
      try{
        let API = ctx.getters.getAPI;
        let persons = await API.deletePersonToProject(params.personId,params.projectId);
        if (persons!=null)
          ctx.commit("updatePersons",persons);
      }catch(ex){
        console.log(ex);
      }
    },
    async addPersonToProject(ctx,params){
      try{
        console.log("params.personId="+params.personId);
        let API = ctx.getters.getAPI;
        let persons = await API.postPersonToProject(params.personId,params.projectId);
        if (persons!=null)
          ctx.commit("updatePersons",persons);
      }catch(ex){
        console.log(ex);
      }
    },
    async subscribeTranslation(ctx,projectId){
      console.log("try subscribe");
      ctx.getters.getSocketAPI.subscribeTranslation(projectId,ctx.commit);
    },
    async sendPostTranslation(ctx,taranslation){
      ctx.getters.getSocketAPI.sendPostTranslation(taranslation);
    },
    async sendDeleteTranslation(ctx,taranslation){
      ctx.getters.getSocketAPI.sendDeleteTranslation(taranslation);
    },
    async getDocumentParts(ctx,documentId){
      try{
        let parts=await ctx.getters.getAPI.getDocumentParts(documentId);
        if (parts!=null)
          ctx.commit("updateParts",parts);
      }catch(ex){
        console.log(ex);
      }
    },
    async subscribePart(ctx,documentId){
      console.log("try subscribe to part");
      ctx.getters.getSocketAPI.subscribePart(documentId,ctx.commit);
    },
    async sendPart(ctx,part){
      ctx.getters.getSocketAPI.sendPart(part);
    },
    async subscribeComment(ctx,documentId){
      console.log("try subscribe to comment");
      ctx.getters.getSocketAPI.subscribeComment(documentId,ctx.commit);
    },
    async sendComment(ctx,comment){
      ctx.getters.getSocketAPI.sendComment(comment);
    },
    async subscribeMessage(ctx,documentId){
      console.log("try subscribe to chat");
      ctx.getters.getSocketAPI.subscribeMessage(documentId,ctx.commit);
    },
    async sendMessage(ctx,message){
      ctx.getters.getSocketAPI.sendMessage(message);
    },
    async disconnect(ctx){
      ctx.getters.getSocketAPI.disconnect();
    },
    async getProjectDocument(ctx,id){
      try{
        let doc=await ctx.getters.getAPI.getDocument(id);
        if (doc!=null)
          ctx.commit("updateDocument",doc);
      }catch(ex){
        console.log(ex);
      }
    },
    async getDocumentMessages(ctx,id){
      try{
        let messages=await ctx.getters.getAPI.getDocumentMessages(id);
        if (messages!=null)
          ctx.commit("updateMessages",messages);
      }catch(ex){
        console.log(ex);
      }
    },
    async patchProject(ctx,project){
      try{
        console.log("try patch project");
        project=await ctx.getters.getAPI.patchProject(project);
        console.log(JSON.stringify(project));
        if (project!=null)
          ctx.commit("updateProject",project);
      }catch(ex){
        console.log(ex);
      }
    },
    async postProject(ctx,project){
      try{
        project=await ctx.getters.getAPI.createProject(project);
        if (project!=null)
          ctx.commit("addProject",project);
      }catch(ex){
        console.log(ex);
      }
    },
    async deleteProject(ctx,project){
      try{
        if (ctx.getters.getAPI.deleteProject(project))
          ctx.commit("deleteProject",project);
      }catch(ex){
        console.log(ex);
      }
    },
    async deleteDocument(ctx,document){
      try{
        if (ctx.getters.getAPI.deleteDocument(document))
          ctx.commit("deleteDocument",document);
      }catch(ex){
        console.log(ex);
      }
    },
    async patchDocument(ctx,document){
      try{
        console.log("try patch");
        let API = ctx.getters.getAPI;
        let newDocument = await API.patchDocument(document);
        if (newDocument!=null)
          ctx.commit("updateDocumentsName",newDocument);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async postDocument(ctx,data){
      try{
        console.log("try post");
        let API = ctx.getters.getAPI;
        let doc;
        if (data.mode=="expectingSize")
          doc = await API.postDocumentUsingExpectingSize(data.file,data.projectId,data.expectedSize);
        else
          doc = await API.postDocumentUsingSeporator(data.file,data.projectId,data.separator);
        if (doc!=null)
          ctx.commit("addDocument",doc);
        console.log("finish action");
      }catch(ex){
        console.log(ex);
      }
    },
    async getDocumentRecords(ctx,documentId){
      try{
        let records=await ctx.getters.getAPI.getDocumentRecords(documentId);
        if (records!=null)
          ctx.commit("updateRecords",records);
      }catch(ex){
        console.log(ex);
      }
    },
    async getPersonProjects(ctx){
      try{
        let projects=await ctx.getters.getAPI.getProjects(ctx.getters.getUser.id);
        if (projects!=null)
          ctx.commit("updateProjects",projects);
      }catch(ex){
        console.log(ex);
      }
    },
    async downloadOriginDocument(ctx,document){
      ctx.getters.getAPI.downloadOriginDocument(document.id,document.name);
    },
    async downloadDocumentLocalization(ctx,document){
      ctx.getters.getAPI.downloadDocumentLocalization(document.id,document.name);
    },
    async getProjectOwner(ctx,projectId){
      try{
        let owner=await ctx.getters.getAPI.getProjectOwner(projectId);
        if (owner!=null)
          ctx.commit("updateProjectOwner",owner);
      }catch(ex){
        console.log(ex);
      }
    }
  },
  modules: {},
  getters: {
    getAPI(state) {
      return state.API;
    },
    getSocketAPI(state){
      return state.SocketAPI;
    },
    getUser(state) {
      return state.user;
    },
    getAuthFail(state) {
      return state.authFail;
    },
    getUserPatched(state) {
      return state.userPatched;
    },
    getOwnProjects(state){
      return state.ownProjects;
    },
    getDocuments(state){
      return state.documents;
    },
    getPersons(state){
      return state.persons;
    },
    getTranslations(state){
      return state.translations;
    },
    getTranslationsById:state=>id=>{
      for (let i=0;i<state.translations.length;i++)
        if (state.translations[i].id==id)
          return state.translations[i];
      return null;
    },
    getParts(state){
      return state.parts;
    },
    getPartById:state=>id=>{
      for (let i=0;i<state.parts.length;i++)
        if (state.parts[i].id==id)
          return state.parts[i];
      return null;
    },
    getDocumentById:state=>id=>{
      for (let i=0;i<state.documents.length;i++)
        if (state.documents[i].id==id)
          return state.documents[i];
      return null;
    },
    getProjectById:state=>id=>{
      for (let i=0;i<state.ownProjects.length;i++)
        if (state.ownProjects[i].id==id)
          return state.ownProjects[i];
      for (let i=0;i<state.projects.length;i++)
        if (state.projects[i].id==id)
          return state.projects[i];
      return null;
    },
    getDocument(state){
      return state.documentEditor.document;
    },
    getMessages(state){
      return state.messages;
    },
    getRecords(state){
      return state.records;
    },
    getProjects(state){
      return state.projects;
    },
    getOwner(state){
      return state.projectOwner;
    }
  }
})
