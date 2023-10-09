let aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }
    let copyProps = (target, source) => {
        Object.getOwnPropertyNames(source)
              .concat(Object.getOwnPropertySymbols(source))
              .forEach((prop) => {
                 if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
               })
    }
    mixins.forEach((mixin) => {
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
}

function savePose(poses){
    timeManagment.removeTask('decrement');
    return {nameOfData: 'savedPose', data: poses};
}

function recreatePose(savedPose){
    console.log(savedPose)
    if(!savedPose[0]){
        console.log('Pose is not defined');
        return;
    }
    timeManagment.removeTask('decrement');
    console.log(justPose.calculatePoseAccuracy(savedPose))
}

let inputsDelegation = (input) => {
    if(input != null){
        switch(input){
            case buttonTakePose:
                console.log('buttonTakePose');
                timeManagment.createData('decrement', 5);
                timeManagment.createTask({repetitive: true, delay: 1000, callback: (number)=>{console.log(number); return {nameOfData: 'decrement', data: number - 1}}, id: 'decrement', nameOfData: 'decrement'});
                timeManagment.createTask({repetitive: false, delay: 6000, callback: savePose.bind(window), nameOfData: 'angle'});
                return {nameOfData: 'pressedButton', data: null}
            case buttonRecreatePose:
                console.log('buttonRecreatePose');
                timeManagment.createData('decrement', 5);
                timeManagment.createTask({repetitive: true, delay: 1000, callback: (number)=>{console.log(number); return {nameOfData: 'decrement', data: number - 1}}, id: 'decrement', nameOfData: 'decrement'});
                timeManagment.createTask({repetitive: false, delay: 6000, callback: recreatePose.bind(window), nameOfData: ['savedPose', 'angle']});
                return {nameOfData: 'pressedButton', data: null}
        }
    }
}