import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RegistrationForm from '../components/RegistrationForm'
import PersonForm from '../components/PersonForm'
import ProjectsForm from '../components/ProjectsForm'
import DocumentEditor from '../components/DocumentEditor'
import AllProjectsForm from '../components/AllProjectsForm'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Home',
    component: Home
  },
  {
    path: '/registration',
    name: 'RegistrationForm',
    component: RegistrationForm
  },
  {
    path: '/profile',
    name: 'PersonForm',
    component: PersonForm
  },
  {
    path: '/OwnProjects',
    name: 'ProjectsForm',
    component: ProjectsForm
  },
  {
    path: '/projects',
    name: 'AllProjectsForm',
    component: AllProjectsForm
  },
  {
    path:'/project/:projectId/document/:documentId',
    name:'DocumentEditor',
    props:true,
    component:DocumentEditor
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
