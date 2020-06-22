import {downloadBlob} from 'download.js'

export class API{

    constructor(url){
        this.url=url;
    }

    async downloadOriginDocument(documentId,name) {
        console.log("start login");
        let myHeaders=new Headers();
        try{
            let response=await fetch(this.url+"/document/"+documentId+"/file/origin",{
                headers:myHeaders,
                method:"GET",
                mode:"cors",
                credentials:"include",
            });
            if (response.ok){
                let result=await response.blob();
                console.log("finish post request for user data:"+result.toString);
                console.log(JSON.stringify(response));
                downloadBlob(this.formatFileName(name),result);
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async downloadDocumentLocalization(documentId,name) {
        console.log("start login");
        let myHeaders=new Headers();
        try{
            let response=await fetch(this.url+"/document/"+documentId+"/file/translated",{
                headers:myHeaders,
                method:"GET",
                mode:"cors",
                credentials:"include",
            });
            if (response.ok){
                let result=await response.blob();
                console.log("finish post request for user data:"+result.toString);
                console.log(JSON.stringify(response));
                downloadBlob(this.formatFileName(name),result);
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    formatFileName(name){
        if (!name.endsWith(".txt")){
            let i=name.lastIndexOf(".");
            return name.slice(0,i)+".txt"
        }
        return name;
    }

    async loginUser(username,password){
        console.log("start login");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/login",{
                headers:myHeaders,
                method:"POST",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify({username:username,password:password})
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for user data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async logoutUser(){
        console.log("start logout");
        try{
            let response=await fetch(this.url+"/person/logout",{
                method:"GET",
                mode:"cors",
                credentials:"include",
            });
            console.log("finish logout");
        }catch(ex){
            console.log(ex);
        }
    }

    async postUser(name,username,password){
        console.log("start registration");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/person",{
                headers:myHeaders,
                method:"POST",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify({name,username,password})
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for user data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async patchUser(user){
        console.log("start user patch");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/person",{
                headers:myHeaders,
                method:"PATCH",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify(user)
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for user data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getOwnProjects(userId){
        try{
            console.log("start get request for own projects");
            let response=await fetch(this.url+"/person/"+userId+"/ownProjects",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get projects data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getProjects(userId){
        try{
            console.log("start get request for projects");
            let response=await fetch(this.url+"/person/"+userId+"/projects",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get projects data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getProjectOwner(projectId){
        try{
            console.log("start get request for project owner");
            let response=await fetch(this.url+"/project/"+projectId+"/owner",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get project owner data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getProjectDocuments(projectId){
        try{
            console.log("start get request for docs");
            let response=await fetch(this.url+"/project/"+projectId+"/documents",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get projects data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getDocument(id){
        try{
            console.log("start get request for doc");
            let response=await fetch(this.url+"/document/"+id,{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get document data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }    

    async getProjectPersons(projectId){
        try{
            console.log("start get request for team");
            let response=await fetch(this.url+"/project/"+projectId+"/persons",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get team data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getProjectTranslations(projectId){
        try{
            console.log("start get request for translations");
            let response=await fetch(this.url+"/project/"+projectId+"/translations",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get team data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async postPersonToProject(personId,projectId){
        try{
            let myHeaders=new Headers();
            myHeaders.append("Content-Type","application/json");
            let response = await fetch(this.url+"/project/"+projectId+"/persons/"+personId,{
                headers:myHeaders,
                method:"POST",
                mode:"cors",
                credentials: "include"
            });
            let result = await response.json();
            return result;
        }catch(ex)
        {
            console.log(ex);
            return null;
        }
    }

    async deletePersonToProject(personId,projectId){
        try{
            let myHeaders=new Headers();
            myHeaders.append("Content-Type","application/json");
            let response = await fetch(this.url+"/project/"+projectId+"/persons/"+personId,{
                headers:myHeaders,
                method:"DELETE",
                mode:"cors",
                credentials: "include"
            });
            let result = await response.json();
            return result;
        }catch(ex)
        {
            console.log(ex);
            return null;
        }
    }

    async getDocumentParts(documentId){
        try{
            console.log("start get request for parts");
            let response=await fetch(this.url+"/document/"+documentId+"/parts",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get parts data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getDocumentMessages(documentId){
        try{
            console.log("start get request for messages");
            let response=await fetch(this.url+"/document/"+documentId+"/messages",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get messages data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async patchProject(project){
        console.log("start project patch");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/project",{
                headers:myHeaders,
                method:"PATCH",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify(project)
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for project data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async createProject(project){
        console.log("start project create");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/project",{
                headers:myHeaders,
                method:"POST",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify(project)
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish create request for project data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async deleteProject(project){
        console.log("start project delete");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/project/"+project.id,{
                headers:myHeaders,
                method:"DELETE",
                mode:"cors",
                credentials:"include",
            });
            if (response.ok){
                console.log("finish delete request for project data");
                return true;
            }
            return false;
        }catch(ex){
            console.log(ex);
            return false;
        }
    }

    async deleteDocument(document){
        console.log("start document delete");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/document/"+document.id,{
                headers:myHeaders,
                method:"DELETE",
                mode:"cors",
                credentials:"include",
            });
            if (response.ok){
                console.log("finish delete request for document data");
                return true;
            }
            return false;
        }catch(ex){
            console.log(ex);
            return false;
        }
    }

    async patchDocument(document){
        console.log("start document patch");
        let myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
        try{
            let response=await fetch(this.url+"/document/"+document.id,{
                headers:myHeaders,
                method:"PATCH",
                mode:"cors",
                credentials:"include",
                body:JSON.stringify(document)
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish patch request for document data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async postDocumentUsingExpectingSize(file,projectId,expectedSize){
        console.log("start document post");
        let formData=new FormData();
        formData.append("file",file);
        formData.append("projectId",projectId);
        formData.append("expectingSize",expectedSize);
        try{
            let response=await fetch(this.url+"/document/expectingSize",{
                method:"POST",
                mode:"cors",
                credentials:"include",
                body:formData
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for document data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async postDocumentUsingSeporator(file,projectId,separator){
        console.log("start document post");
        let formData=new FormData();
        formData.append("file",file);
        formData.append("projectId",projectId);
        formData.append("separator",separator);
        try{
            let response=await fetch(this.url+"/document/separator",{
                method:"POST",
                mode:"cors",
                credentials:"include",
                body:formData
            });
            if (response.ok){
                let result=await response.json();
                console.log("finish post request for document data:"+result.toString);
                return result;
            }
            return null;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

    async getDocumentRecords(documentId){
        try{
            console.log("start get request for records");
            let response=await fetch(this.url+"/document/"+documentId+"/history",{
                method:"GET",
                mode:"cors",
                credentials:"include"
            });
            let result=await response.json();
            console.log("finish get records data:"+result.toString);
            return result;
        }catch(ex){
            console.log(ex);
            return null;
        }
    }

}