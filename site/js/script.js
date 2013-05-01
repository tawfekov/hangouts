var app = {
    videos: [],
    PeerConnection: window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection,
    createVideo: function (socketId) {
        var Id      = "remote-"+socketId;
        var element = '<video id="'+Id+'" autoplay controls src=""></video>';
        $("#videos").append(element);
        $("#"+Id).addClass("thumbnail");
        app.videos.push(Id);
        return Id;
    },
    removeVideo: function (socketId) {
        var video = $('#remote-' + socketId);
        if (video) {
            app.videos.splice(app.videos.indexOf(video), 1);
            video.remove();
        }else{
          console.log("socketId" + socketId + "not found in the dom , please refresh the page");
        }
    },
    selectVideo:function(socketId){
        $("#selectedVideo video.big").remove();

    },
    init: function () {
        if (PeerConnection) {
            rtc.createStream({
                "video": {
                    "mandatory": {},
                    "optional": []
                },
                "audio": false
            }, function (stream) {
                $('#you').attr("src" , URL.createObjectURL(stream));
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
            $("#"+video).attr("class", "");
            console.log(video);
            rtc.attachStream(stream, video);
        });
        // leave event 
        rtc.on('disconnect stream', function (data) {
            console.log('remove ' + data);
            app.removeVideo(data);
        });
    }
}
window.app = app ;