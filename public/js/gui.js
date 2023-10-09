class GUI extends Draw{
    constructor(ctx){
        super(ctx);
        this.elements        = new Map();
        this.guiElements     = new Map();
        this.elementsPressed = null;
    }

    addElement(x,y,width,height){
        let id = this.createId();
        this.elements.set(id,{
            start: [x,y],
            end: [x+width, y+height]
        })

        return id;
    }

    addGuiElement({options, functionName}, id){
        id = id || this.createId();
        this.guiElements.set(id,{functionName, options, id});
        return id;
    }

    addButton([x,y,width,height,text], functionName){
        return this.addGuiElement({functionName: functionName, options: [x,y,width,height,text]}, this.addElement(x,y,width,height));
    }

    createId(){
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    ifPointsAreInArea(element, points){
        if(points[0].x >= element.start[0]  &&
           points[0].x <= element.end[0]    &&
           points[0].y >= element.start[1]  &&
           points[0].y <= element.end[1]){
           return [true,0];
        }
        if(points[1].x >= element.start[0]  &&
           points[1].x <= element.end[0]    &&
           points[1].y >= element.start[1]  &&
           points[1].y <= element.end[1]){
            return [true,1];
        }

        return [false];
    }

    isButtonPressed(pose,timestamp){
        if(pose.length < 1) return;
        let leftWrist = pose[0].leftWrist;
        let rightWrist = pose[0].rightWrist;

        for(let element of this.elements){
            let pointInArea = this.ifPointsAreInArea(element[1], [leftWrist,rightWrist]);

            if(pointInArea[0]){
                if(this.elementsPressed == null){
                    this.elementsPressed = {
                        id: element[0],
                        start: timestamp,
                        refresh: timestamp,
                        x: (pointInArea[1]) ? rightWrist.x : leftWrist.x,
                        y: (pointInArea[1]) ? rightWrist.y : leftWrist.y,
                        flagLeave: null
                    }
                }else if(timestamp - this.elementsPressed.start > 2000){
                    this.elementsPressed = null;
                    return {nameOfData: 'pressedButton', data: element[0]};
                }else{
                    this.elementsPressed.refresh = timestamp;
                    this.elementsPressed.x = (pointInArea[1]) ? rightWrist.x : leftWrist.x;
                    this.elementsPressed.y = (pointInArea[1]) ? rightWrist.y : leftWrist.y;
                }
            }
        }

        if(this.elementsPressed != null){
            this.elementsPressed.flagLeave = timestamp;
        }
        if(this.elementsPressed && this.elementsPressed.flagLeave - this.elementsPressed.refresh > 700){
            this.elementsPressed = null;
        }
    }

    renderGui(){
        this.clearCanvas();
        for(let element of this.guiElements){
            this[element[1].functionName](element[1].options);
        }

        if(this.elementsPressed != null){
            this.ctx.beginPath();
            this.ctx.arc(this.elementsPressed.x, this.elementsPressed.y, 30, 0, ((this.elementsPressed.refresh -this.elementsPressed.start) / 2000) * Math.PI * 2);
            this.ctx.strokeStyle = "purple";
            this.ctx.stroke();
        }
    }
}