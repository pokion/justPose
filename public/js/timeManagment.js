class TimeManagment{
    //this class is only for runing specific functions at delay based on timestamp. For example run function one time after 5000ms or run function every 500ms
    //timestamp is a ms
    constructor(){
        this.tasks        = [];
        this.data         = new Map();
        this.timestamp    = null;
        this.instances    = new Map();
        this.taskToRemove = [];
    }

    passInstance(instanceClass, name){
        this.instances.set(name, instanceClass);
        return this;
    }

    getInstance(instanceName){
        return this.instances.get(instanceName);
    }

    createTask({repetitive, delay, callback, nameOfData, id}){
        this.tasks.push({
            repetitive, 
            delay, 
            callback,
            timeOfLastActivation: this.timestamp || 0,
            dataIndex: nameOfData || null,
            id: id || null
        });
        return this;
    }

    removeTask(id){
        this.taskToRemove.push(id);
    }

    createData(nameOfData, data){
        this.data.set(nameOfData, data);
        return this;
    }

    updateData(dataToUpdate){
        if(!dataToUpdate) return;
        for(let data of new Array(dataToUpdate)){
            this.data.set(data.nameOfData, data.data);
        }
    }

    getDataTask(nameOfData){
        if(typeof nameOfData == 'object'){
            let multipleData = [];
            for(let data of nameOfData){
                multipleData.push(this.data.get(data));
            }
            return multipleData;
        }
        return this.data.get(nameOfData);
    }

    checkIfTimePassToRunTask(lastActivation, delay, timestamp){
        return (lastActivation + delay <= timestamp)
    }

    runTask(task, timestamp){
        if(typeof task.callback === "string"){
            let classReference = task.callback.split('.');
            this.updateData((task.dataIndex == null) ?  this.getInstance(classReference[0])[classReference[1]]() 
                                                     :  this.getInstance(classReference[0])[classReference[1]](this.getDataTask(task.dataIndex), timestamp));
        }else{
            this.updateData((task.dataIndex == null) ?  task.callback() 
                                                     :  task.callback(this.getDataTask(task.dataIndex), timestamp));
        }
        task.timeOfLastActivation = timestamp;
    }

    run(timestamp){
        this.timestamp = timestamp;
        let iterator = this.tasks.length;
 
        while(iterator--){
            if(this.taskToRemove.includes(this.tasks[iterator].id)){
                this.taskToRemove.splice(this.taskToRemove.indexOf(this.tasks[iterator].id), 1)
                this.tasks.splice(iterator, 1);
                continue;
            }

            if(this.checkIfTimePassToRunTask(this.tasks[iterator].timeOfLastActivation, this.tasks[iterator].delay, timestamp)){
                this.runTask(this.tasks[iterator], timestamp);

                if(!this.tasks[iterator].repetitive){
                    this.tasks.splice(iterator, 1);
                }
            }
        }
    }
}