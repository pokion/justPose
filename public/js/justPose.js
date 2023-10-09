class JustPoseUtils extends aggregation(Draw,MathAdditional){

    constructor(ctx){
        super(ctx);
        this.ctx = ctx;
    }

    drawAngleCircle(a, b, c, radius){
        let angle, distortion, start, end;
    
        if(a.x < b.x && c.x < b.x){
            angle      = this.calcAngleBetweenPoints(a, b, c);
            distortion = (Math.PI - this.calcAngleBetweenPoints(c, b,{x: c.x, y: b.y}));
            distortion = (c.y > b.y) ? distortion : distortion * -1;
    
            start = ((Math.PI - angle) + Math.PI) - distortion;
            end   = (angle + (Math.PI - angle)) - distortion;
        }else if(a.x > b.x && c.x > b.x){

            angle      = this.calcAngleBetweenPoints(a, b, c);
            distortion = (Math.PI - this.calcAngleBetweenPoints(c, b, {x: c.x, y: b.y}));
            distortion = (c.y < b.y) ? distortion : distortion * -1;
    
            let betaAngle = ((Math.PI - angle) + Math.PI) - distortion - Math.PI;
            start         = (Math.PI - angle) - (distortion * 2) - betaAngle;
            end           = (angle + Math.PI) - distortion;
        }else if(a.x < b.x && c.x > b.x){
            angle      = this.calcAngleBetweenPoints(a, b, c);
            distortion = (this.calcAngleBetweenPoints(c, b, {x: c.x, y: b.y}));
            distortion = (c.y > b.y) ? distortion : distortion * -1;
    
            start = ((Math.PI - angle) + Math.PI) - distortion;
            end   = (angle + (Math.PI - angle)) - distortion;
        }else{
            angle      = this.calcAngleBetweenPoints(a, b, c);
            distortion = (Math.PI - this.calcAngleBetweenPoints(c, b, {x: c.x, y: b.y}));
            distortion = (c.y > b.y) ? distortion : distortion * -1;
    
            end   = ((Math.PI - angle) + Math.PI) - distortion -  angle;
            start = (angle + (Math.PI - angle)) - distortion -  angle;
        }
        let rad = radius || 30;
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.arc(b.x, b.y, rad, start, end);
        this.ctx.strokeStyle = "#ff3300";
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    
        return angle;
    }

    drawSkeleton(pose){
        let lineColor = "#009900";
        //nose to left shoulder
        this.drawLine(pose.nose, pose.leftShoulder, lineColor);
    
        //nose to right shoulder
        this.drawLine(pose.nose, pose.rightShoulder, lineColor);
        
        //right shoulder to left shoulder
        this.drawLine(pose.rightShoulder, pose.leftShoulder, lineColor);
    
        //right Shoulder to right elbow
        this.drawLine(pose.rightShoulder, pose.rightElbow, lineColor);
    
        //left Shoulder to left elbow
        this.drawLine(pose.leftShoulder, pose.leftElbow, lineColor);
    
        //left hip to right hip
        this.drawLine(pose.leftHip, pose.rightHip, lineColor);
    
        //right hip to right knee
        this.drawLine(pose.rightHip, pose.rightKnee, lineColor);
    
        //left hip to left knee
        this.drawLine(pose.leftHip, pose.leftKnee, lineColor);
    
        //right knee to right ankle
        this.drawLine(pose.rightKnee, pose.rightAnkle, lineColor);
    
        //left knee to left ankle
        this.drawLine(pose.leftKnee, pose.leftAnkle, lineColor);
    
        //left elbow to left wrist
        this.drawLine(pose.leftElbow, pose.leftWrist, lineColor);
    
        //right elbow to right wrist
        this.drawLine(pose.rightElbow, pose.rightWrist, lineColor);
    
        //right shoulder to right hip
        this.drawLine(pose.rightShoulder, pose.rightHip, lineColor);
    
        //left shoulder to left hip
        this.drawLine(pose.leftShoulder, pose.leftHip, lineColor);
    
        //draw angle circle
        return [this.drawAngleCircle(pose.nose, pose.rightShoulder, pose.leftShoulder),
                this.drawAngleCircle(pose.nose, pose.leftShoulder, pose.rightShoulder),
                this.drawAngleCircle(pose.leftElbow, pose.leftShoulder, pose.leftHip, 40),
                this.drawAngleCircle(pose.leftWrist, pose.leftElbow, pose.leftShoulder),
                this.drawAngleCircle(pose.rightWrist, pose.rightElbow, pose.rightShoulder),
                this.drawAngleCircle(pose.rightShoulder, pose.rightHip, pose.leftHip),
                this.drawAngleCircle(pose.leftShoulder, pose.leftHip, pose.rightHip),
                this.drawAngleCircle(pose.leftHip, pose.leftKnee, pose.leftAnkle),
                this.drawAngleCircle(pose.rightHip, pose.rightKnee, pose.rightAnkle)];
    }

    calculatePoseAccuracy([angles1,angles2]){
        let score = 0;
    
        for(let i=0;i<angles1.length;i++){
            if(Math.abs(angles1[i] - angles2[i]) > 1){
                score += 50;
            }else if(Math.abs(angles1[i] - angles2[i]) < 0.7 && Math.abs(angles1[i] - angles2[i]) > 0.5){
                score += 100;
            }else if(Math.abs(angles1[i] - angles2[i]) < 0.5){
                score += 300;
            }
        }
    
        return score/9;
    }
}

class JustPose extends JustPoseUtils{  

    constructor(options = {}){
        const {scale = 6, 
               canvas = document.getElementById('canvas'),
               videoLive = document.querySelector('#video'),
               previewLive = document.querySelector('#prev')} = options;

        super(canvas.getContext('2d'));
        // DOM elements
        this.canvas     = canvas;      
        this.videoLive  = videoLive;   
        this.prev       = previewLive; 
        this.ctx        = this.canvas.getContext('2d');

        
        //scale of video and setting resolution to DOM elements
        this.scale            = scale;
        this.width            = Math.floor(window.innerWidth / this.scale);
        this.height           = Math.floor(window.innerHeight / this.scale);
        this.videoLive.width  = this.width;
        this.videoLive.height = this.height;
        this.canvas.width     = this.width  * this.scale;
        this.canvas.height    = this.height * this.scale;
        this.prev.width       = this.width  * this.scale;
        this.prev.height      = this.height * this.scale;

        //Media and other variables
        this.stream;
        this.poseNet;
        this.mediaRecorder;
        this.poses = [];
    }

    get getCTX(){
        return this.ctx;
    }

    getPoses(){
        return {data: this.poses, nameOfData: 'poses'};
    }

    async captureVideo(){
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try{
                let stream = await navigator.mediaDevices.getUserMedia({ video: true });

                this.videoLive.srcObject = stream;
                this.videoLive.play();
                this.prev.srcObject = stream;
                this.prev.play();
                return true;
            }catch(error){
                console.error(error);
                return false;
            }
        }
    }

    async settingPoseNet(){
        this.poseNet = await ml5.poseNet(this.videoLive,{flipHorizontal: true, architecture: 'ResNet50', minConfidence: 0.5}, ()=> {console.log('Model Loaded!')});
        this.poseNet.on('pose', this.updatePoses.bind(this));
    }

    scaleOutput(pose){
        for(let property in pose){
            if(property === 'keypoints' || property === 'score'){
                continue;
            }

            pose[property].x *= this.scale;
            pose[property].y *= this.scale;
        }
        return pose;
    }

    updatePoses(results){
        let poseResult = [];
        for(let result of results){
            if(result.pose && result.pose.score > 0.6){
                poseResult.push(this.scaleOutput(result.pose));
            }
        }
        this.poses = poseResult;
    }

    showSkeletons(){
        let angle;
        for(let skeleton of this.poses){
            if(skeleton) angle = this.drawSkeleton(skeleton);
        }

        return {nameOfData: 'angle', data: angle};
    }

    async init(){
        if(await this.captureVideo() == false) return;
        this.settingPoseNet();
    }
}