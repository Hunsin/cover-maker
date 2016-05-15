"use strict";
var express = require("express"),
    router = express.Router(),
    firebase = require("firebase"),
    webshot = require("webshot");

var options = {
        screenSize: {
            width: 1920,
            height: 1080
        },
        siteType: "html"
    },
    template = `<!DOCTYPE html>
            <html>
                <head>
                	<meta charset="UTF8">
                    <style type="text/css">
                        * {
                			box-sizing: border-box;
            				font-family: "Noto Sans", "Noto Sans CJK TC";
            				font-size: 32px;
                		}
                		
                		body {
                			margin: 0;
                		}
            
            			.experience-text {
            				margin: 0 60px 0 480px;
            			    
            			    width: 1380px;
            				height: 44px;
            			    line-height: 44px;
            			    
            			    text-align: right;
            			}
            			
            			.experience-text {
            				border: none;
            				padding: 0;
            				
            				overflow: hidden;
            			}

            			.experience-text:nth-child([expFocus]) {
            			    color: red;
            			}

            			.img-area {
            				overflow: hidden;
            			}

            			.img-area img {
            				position: relative;
            				height: auto;
            			}

                        #cover-background {
                			position: relative;
                	
                			width: inherit;
                			height: 860px;
                		}
                
                		#cover-container {
                			display: block;
                			position: relative;
                			margin: 0 auto;
                			width: 1920px;
                			height: 1080px;
                		}
                		
                		#cover-location {
                			position: absolute;
                			top: 780px;
                			
                			width: 320px;
                			height: 80px;
                			line-height: 80px;
                			
                			text-align: center;
                			background-color: transparent;
                		}
                		
                		#experience-box {
                		    position: absolute;
                		    top: 860px;
            				padding-top: 24px;
                
                			display: -webkit-flex;
                			display: -ms-flexbox;
                			display: flex;
                			-webkit-flex-flow: row-reverse wrap;
                			flex-flow: row-reverse wrap;
                			align-content: flex-start;
                		    width: inherit;
                		    height: 220px;
                			
                		    background-image: url(https://ioh-cover-maker-hunsin.c9users.io/cover-editor/poster-brand.png);
                		    background-size: cover;
                		}
                		
                		#cover-avatar {
                			position: absolute;
                			top: 460px;
                			
                			width: 320px;
                			height: 320px;
                			border: 10px solid;
                			border-color: #FFF;
                		}
                    </style>
                </head>
                <body>
                    <div id="cover-container">
            
            			<!-- background image -->
            			<div class="img-area" id="cover-background">
            				<img id="background" src="https://ioh-cover-maker-hunsin.c9users.io[backUrl]"
            					 style="top: [backTop]px; left: [backLeft]px; width: [backWidth]px">
            			</div>
            
            			<!-- avatar image -->
            			<div class="img-area" id="cover-avatar" style="left: [avaPos]px;"> 
            				<img id="avatar" src="https://ioh-cover-maker-hunsin.c9users.io[avaUrl]"
            					 style="top: [avaTop]px; left: [avaLeft]px; width: [avaWidth]px">
            			</div>
            
            			<!-- location -->
            			<div id="cover-location" style="left: [avaPos]px; color: [locColor]">[loc]</div>
            			<div id="experience-box">
            				<div class="experience-text">[name]</div>
            				<div class="experience-text">[expI]</div>
            				<div class="experience-text">[expII]</div>
            				<div class="experience-text">[expIII]</div>
            			</div>
            		</div>
                </body>
            </html>`;

router.get("/export/:userId", function(req, res) {
    let ref = new firebase(`https://ioh-cover-maker.firebaseio.com/speakers/${req.params.userId}`);
    ref.once("value", function(snapshot) {
        let speaker = snapshot.val(),
            shot = template.replace("[avaLeft]", speaker.avatar.Left * 2)
                           .replace("[avaTop]", speaker.avatar.Top * 2)
                           .replace("[avaUrl]", speaker.avatar.URL)
                           .replace("[avaWidth]", speaker.avatar.Width * 2)
                           .replace(/\[avaPos]/g, speaker.avatarPosition * 2)
                           .replace("[backLeft]", speaker.background.Left * 2)
                           .replace("[backTop]", speaker.background.Top * 2)
                           .replace("[backUrl]", speaker.background.URL)
                           .replace("[backWidth]", speaker.background.Width * 2)
                           .replace("[expI]", speaker.experience[0])
                           .replace("[expII]", speaker.experience[1])
                           .replace("[expIII]", speaker.experience[2])
                           .replace("[expFocus]", ++speaker.experienceFocus)
                           .replace("[loc]", speaker.location)
                           .replace("[locColor]", speaker.locationColor)
                           .replace("[name]", speaker.name);

        webshot(shot, `public/uploads/cover${req.params.userId}.png`, options, function(err) {
            if (err) console.log(err);
            res.redirect(`/uploads/cover${req.params.userId}.png`);
        });
    });
});

module.exports = router;