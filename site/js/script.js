window.app = {
    videos: [],
    PeerConnection: window.PeerConnection 
                 || window.webkitPeerConnection00 
                 || window.webkitRTCPeerConnection 
                 || window.mozRTCPeerConnection 
                 || window.RTCPeerConnection,

    selectedVideo:"#selectedVideo",
    audio:true,
    onStage:"",
    displayLog:true,
    createVideo: function (socketId) {
        var id      = "remote-"+socketId;
        var element = '<video id="'+id+'" autoplay controls src=""></video>';
        $("#videos").append(element);
        // TODO : update to use jquery live 
        $("#"+id).click(function(e){
            app.selectVideo(e.target.id);
        });
        app.videos.push(id);
        return id;
    },
    removeVideo: function (socketId) {
        var video = $('#remote-' + socketId);
        if (video) {
            app.videos.splice(app.videos.indexOf(video), 1);
            video.fadeOut("slow").remove();
            /// try to remove the big video if its present .
            $(selectedVideo).fadeOut("slow").remove();
        }else{
          app.logMessage("socketId" + socketId + "not found in the dom , please refresh the page");
        }
    },
    selectVideo:function(socketId){
        app.minimizeVideo(app.onStage);
        app.maximizeVideo(socketId);
    },
    maximizeVideo:function(socketId){
        var src = $("#"+socketId).attr("src");
        $("#"+socketId).fadeOut("fast");
        $(selectedVideo).attr({"src":src}).fadeIn("slow");
        app.onStage = socketId;
    },
    minimizeVideo:function(socketId){
        $("#"+socketId).fadeIn("slow");
    },
    setupStream:function(target){
        if (PeerConnection) {
            rtc.createStream({
                "video": {
                    "mandatory": {},
                    "optional": []
                },
                "audio": app.audio,
            }, function (stream) {
                $('#'+target).attr({"src":URL.createObjectURL(stream),"alt":stream});
                //$('#you').play();
                document.getElementById(target).play();
            });
        } else {
            app.logMessage('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
        }
    },
    logMessage:function(message){
        if(app.displayLog){
            console.log(message);
            $("#log").append("<li>" + message + "</li>");
        }
    },
    init: function () {
        app.setupStream("you");
        var rooms = [];
        var room = window.location.hash.slice(1);
        rooms.push(room);
        // connect to socketIO
        if(window.location.protocol === "https:"){
            rtc.connect("wss:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
            app.logMessage("using ssl connection");
        }else{
            rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
            app.logMessage("using plain connection");
        }
        // join event 
        rtc.on('add remote stream', function (stream, socketId) {
            app.logMessage("Adding Remote Stream:# "+ socketId);
            var video = app.createVideo(socketId);
            $("#"+video).attr({"class":"","alt":socketId});
            rtc.attachStream(stream, video);
        });
        // leave event 
        rtc.on('disconnect stream', function (socketId) {
            app.logMessage("Stream:# "+ socketId + " left the chat !");
            app.removeVideo(socketId);
        });
    }
};