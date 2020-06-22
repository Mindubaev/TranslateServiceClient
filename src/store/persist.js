import VuexPersistence from 'vuex-persist'

export const vuexPersist=new VuexPersistence({
    supportCircular: true,
    key:"user-modul",
    storage:window.sessionStorage,
    reducer:(state)=>({user:state.user})
});