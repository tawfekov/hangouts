var app = {
    videos: [],
    PeerConnection: window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection,
    selectedVideo:"#selectedVideo",
    audio:true,
    createVideo: function (socketId) {
        var id      = "remote-"+socketId;
        var element = '<video id="'+id+'" autoplay controls src=""></video>';
        $("#videos").append(element);
        $("#"+id).click(function(e){
            app.selectVideo(e.target.id);
        }).attr("alt",id);
        app.videos.push(id);
        return id;
    },
    removeVideo: function (socketId) {
        var video = $('#remote-' + socketId);
        if (video) {
            app.videos.splice(app.videos.indexOf(video), 1);
            video.fadeOut("slow").remove();
            /// try to remove the big video if its present .
            $("video[alt=remote-"+socketId+"]").fadeOut("slow").remove();
        }else{
          console.log("socketId" + socketId + "not found in the dom , please refresh the page");
        }
    },
    selectVideo:function(socketId){
        var src = $("#"+socketId).attr("src");
        $(selectedVideo).attr({"src":src,"alt":socketId}).fadeIn("slow");
        $("#"+socketId).fadeOut("fast");
    },
    init: function () {
        if (PeerConnection) {
            rtc.createStream({
                "video": {
                    "mandatory": {},
                    "optional": []
                },
                "audio": app.audio,
            }, function (stream) {
                $('#you').attr({"src":URL.createObjectURL(stream),"alt":stream});
                //$('#you').play();
                document.getElementById('you').play();
            });
        } else {
            alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
        }
        var rooms = [];
        var room = window.location.hash.slice(1);
        rooms.push(room);
        // connect to socketIO
        rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
        console.log("created room with the name :" + room);
        // join event 
        rtc.on('add remote stream', function (stream, socketId) {
            console.log("Adding Remote Stream:# "+ socketId);
            var video = app.createVideo(socketId);
            $("#"+video).attr({"class":"","alt":socketId});
            $("#log").append("<li>Adding Remote Stream:# "+ socketId + "</li>");
            rtc.attachStream(stream, video);
        });
        // leave event 
        rtc.on('disconnect stream', function (socketId) {
            console.log('remove ' + socketId);
            $("#log").append("<li>Stream:# "+ socketId + " left the chat </li>");
            app.removeVideo(socketId);
        });
    }
}
window.app = app ;