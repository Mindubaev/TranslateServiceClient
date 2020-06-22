import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"

export class SocketAPI{

    constructor(url){
        this.url=url;
        this.translateStompClient = null;
        this.translateIsConnected=false;
        this.partStompClient=null;
        this.partIsConnected=false;
        this.commentStompClient=null;
        this.commentIsConnected=false;
        this.messageStompClient=null;
        this.messageIsConnected=false;
        this.projectId=0;
        this.documentId=0;
        this.chatId=0;
    }

    subscribePart(documentId,handler){
        try{
            if (this.partIsConnected || this.partStompClient!=null || this.partStompClient!=undefined){
                this.partStompClient.disconnect();
                this.partIsConnected=false;
            }
            if (!this.partIsConnected){
                this.partStompClient = Stomp.client(this.url);
                console.log("try connect "+this.url);
                this.partStompClient.connect({},(frame)=>{
                    this.partIsConnected=true;
                    console.log("connected "+this.url);
                    this.documentId=documentId;
                    this.partStompClient.subscribe("/topic/document/"+documentId+"/part",(message)=>{
                        console.log(message.body)
                        handler("updatePart",JSON.parse(message.body));
                    });
                });
            }
        }catch(ex){
            console.log(ex);
        }
    }

    sendPart(message){
        this.partStompClient.send("/app/document/"+this.documentId+"/part",{},JSON.stringify(message));
    }

    subscribeComment(documentId,handler){
        try{
            if (this.commentIsConnected || this.commentStompClient!=null || this.commentStompClient!=undefined){
                this.commentStompClient.disconnect();
                this.commentIsConnected=false;
            }
            if (!this.commentIsConnected){
                this.commentStompClient = Stomp.client(this.url);
                console.log("try connect "+this.url);
                this.commentStompClient.connect({},(frame)=>{
                    this.commentIsConnected=true;
                    console.log("connected "+this.url);
                    this.documentId=documentId;
                    this.commentStompClient.subscribe("/topic/document/"+documentId+"/comment",(message)=>{
                        console.log(message.body)
                        handler("updateComment",JSON.parse(message.body));
                    });
                });
            }
        }catch(ex){
            console.log(ex);
        }
    }

    sendComment(message){
        this.commentStompClient.send("/app/document/"+this.documentId+"/comment",{},JSON.stringify(message));
    }

    subscribeTranslation(projectId,handler){
        try{
            if (this.translateIsConnected || this.translateStompClient!=null || this.translateStompClient!=undefined){
                this.translateStompClient.disconnect();
                this.translateIsConnected=false;
            }
            if (!this.translateIsConnected){
                this.translateStompClient = Stomp.client(this.url);
                console.log("try connect "+this.url);
                this.translateStompClient.connect({},(frame)=>{
                    this.translateIsConnected=true;
                    console.log("connected "+this.url);
                    this.projectId=projectId;
                    this.translateStompClient.subscribe("/topic/project/"+projectId+"/translation/post",(message)=>{
                        console.log(message.body)
                        handler("postTranslation",JSON.parse(message.body));
                    });
                    this.translateStompClient.subscribe("/topic/project/"+projectId+"/translation/delete",(message)=>{
                        console.log(message.body)
                        handler("deleteTranslation",JSON.parse(message.body));
                    });
                });
            }
        }catch(ex){
            console.log(ex);
        }
    }

    sendPostTranslation(message){
        this.translateStompClient.send("/app/project/"+this.projectId+"/translation/post",{},JSON.stringify(message));
    }

    sendDeleteTranslation(message){
        this.translateStompClient.send("/app/project/"+this.projectId+"/translation/delete",{},JSON.stringify(message));
    }

    subscribeMessage(documentId,handler){
        try{
            if (this.messageIsConnected || this.messageStompClient!=null || this.messageStompClient!=undefined){
                this.messageStompClient.disconnect();
                this.messageIsConnected=false;
            }
            if (!this.messageIsConnected){
                this.messageStompClient = Stomp.client(this.url);
                console.log("try connect "+this.url);
                this.messageStompClient.connect({},(frame)=>{
                    this.messageIsConnected=true;
                    console.log("connected "+this.url);
                    this.chatId=documentId;
                    this.messageStompClient.subscribe("/topic/chat/"+documentId,(message)=>{
                        console.log(message.body)
                        handler("updateMessage",JSON.parse(message.body));
                    });
                });
            }
        }catch(ex){
            console.log(ex);
        }
    }

    sendMessage(message){
        this.messageStompClient.send("/app/chat/"+this.chatId,{},JSON.stringify(message));
    }

    disconnectTranslation(){
        if (this.translateIsConnected || this.translateStompClient!=null || this.translateStompClient!=undefined){
            this.translateStompClient.disconnect();
            this.translateIsConnected=false;
        }
        if (this.partIsConnected || this.partStompClient!=null || this.partStompClient!=undefined){
            this.partStompClient.disconnect();
            this.partIsConnected=false;
        }
        if (this.commentIsConnected || this.commentStompClient!=null || this.commentStompClient!=undefined){
            this.commentStompClient.disconnect();
            this.commentIsConnected=false;
        }
        if(this.messageIsConnected || this.messageStompClient!=null || this.messageStompClient!=undefined){
            this.messageStompClient.disconnect();
            this.messageIsConnected=false;
        }
    }

}