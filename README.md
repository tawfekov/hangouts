#Private & Secure Hangouts 
==============

I will Provide a demo soon 

##Instructions on how to setup the demo:


### how to setup hangouts ?
Run in your terminal

```bash 
git clone git@github.com:tawfekov/hangouts.git
```

```bash 
cd hangouts
```

```bash 
npm install
```

```bash 
cd site
```

```bash 
node server.js
```

if you need to run server in debug mode 
```bash 
node server.js -debug 
```

In a version of Chrome that have webRTC support.

go to [localhost:8080](http://localhost:8080)

you will be prompted enter a password , use : 

- username : user ;
- password : password ; 

you can manually change them in `site/server.js` line `9-10`

click allow to see your camera

go to [localhost:8080](http://localhost:8080)

click allow to see your camera and the connection will be made between your to open windows.


if you need to chat with some friends 
### out side your network : 
    - you need to setup portforwarding in your router to point to your machine .
    - send them your realip with port `8080` , example : `http://REALIP:8080/`.
### inside you network :
    - send them your lan ip  with port `8080` , example : `http://192.168.1.120:8080/` .

###License:
`hangouts` is realesed under `MIT` License.

###Developed by:
    [Tawfek Daghistani](https://github.com/tawfekov) , tawfekov@gmail.com
    
based on  [https://github.com/webRTC/webRTC.io](https://github.com/webRTC/webRTC.io).
