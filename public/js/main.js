const FPS              = 60;
const frameInterval    = 1000 / FPS; 
let justPose           = new JustPose(); justPose.init();
let gui                = new GUI(justPose.getCTX);
let timeManagment      = new TimeManagment();
let buttonTakePose     = gui.addButton([30,30,200,100,'Take pose'],'drawButton');
let buttonRecreatePose = gui.addButton([window.innerWidth - 30 - 200 ,30,200,100,'Recreate pose'],'drawButton');

timeManagment.createData('pressedButton', null).createData('poses', null);

timeManagment.passInstance(justPose, 'justPose').passInstance(gui, 'gui');

timeManagment.createTask({repetitive: true, delay: frameInterval, callback: 'justPose.showSkeletons'})
             .createTask({repetitive: true, delay: frameInterval, callback: 'gui.renderGui'})
             .createTask({repetitive: true, delay: frameInterval, callback: inputsDelegation.bind(window), nameOfData: 'pressedButton'})
             .createTask({repetitive: true, delay: frameInterval, callback: 'gui.isButtonPressed', nameOfData: 'poses'})
             .createTask({repetitive: true, delay: frameInterval, callback: 'justPose.getPoses'});

function drawCameraIntoCanvas(timestamp) {
  
    timeManagment.run(timestamp);
    
    window.requestAnimationFrame(drawCameraIntoCanvas);

}

drawCameraIntoCanvas();