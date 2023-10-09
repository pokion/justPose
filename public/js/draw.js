class Draw{

    constructor(ctx){
        this.ctx = ctx;
    }

    drawLine(a, b, color){
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }

    drawCircle(x,y){
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
    }

    drawRectangle(x, y, width, height){
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
    }

    drawText(x, y, text){
        this.ctx.font="20px Comic Sans MS";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
    }

    drawButton([x, y, width, height, text]){
        this.drawRectangle(x, y, width, height);
        this.drawText((x + (width / 2)), (y + (height / 2)), text)
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}