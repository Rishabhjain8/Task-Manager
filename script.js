let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightgreen", "lightpink", "red", "black"];
let modalPriorityColor = colors[colors.length - 1];
let toolBoxColors = document.querySelectorAll(".priority-color");

let allColors = document.querySelectorAll(".color");
let modalShow = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let taskArr = [];

if(localStorage.getItem("task_manager")){
    taskArr = JSON.parse(localStorage.getItem("task_manager"));
    taskArr.forEach((taskObj) => {
        createTask(taskObj.taskColor, taskObj.taskContent, taskObj.taskId);
    });
}

allColors.forEach((color) => {
    color.addEventListener("click", (e) => {
        allColors.forEach((colorB) => {
            colorB.classList.remove("border");
        });
        color.classList.add("border");
        modalPriorityColor = color;
    });
})

for(let i = 0;i < toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolColor = toolBoxColors[i].classList[0];

        let filterTask = taskArr.filter((taskObj) => {
            return currentToolColor === taskObj.taskColor;
        });

        let allTaskCont = document.querySelectorAll(".task-cont");
        for(let i = 0;i < allTaskCont.length;i++){
            allTaskCont[i].remove();
        }

        filterTask.forEach((taskObj) => {
            createTask(taskObj.taskColor, taskObj.taskContent, taskObj.taskId);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        let allTaskCont = document.querySelectorAll(".task-cont");
        for(let i = 0;i < allTaskCont.length;i++){
            allTaskCont[i].remove();
        }

        taskArr.forEach((taskObj) => {
            createTask(taskObj.taskColor, taskObj.taskContent, taskObj.taskId);
        })
    })
}

addBtn.addEventListener("click", (e) => {
    modalShow = !modalShow;

    if(modalShow){
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none";
    }
});

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;

    if(textareaCont.value !== ""){
        if(key === "Control"){
            createTask(modalPriorityColor.classList[0], textareaCont.value);
            setModalToDefault();
        }
    }
})

function createTask(taskColor, taskContent, taskId){
    let id = taskId || shortid();
    let taskCont = document.createElement("div");
    taskCont.setAttribute("class", "task-cont");
    console.log(taskColor);
    taskCont.innerHTML = `
            <div class = "task-color ${taskColor}"></div>
            <div class = "task-id">#${id}</div>
            <div class = "task-content">${taskContent}</div>
            <div class = "task-lock">
                <i class="fas fa-lock"></i>
            </div>
    `;
    mainCont.appendChild(taskCont);

    if(!taskId){
        taskArr.push({taskColor, taskContent, taskId: id});
        localStorage.setItem("task_manager", JSON.stringify(taskArr));

    }
    removeTask(taskCont, id);
    handleLock(taskCont, id);
    colorHandler(taskCont, id);
}

function removeTask(task, id){

    task.addEventListener("click", (e) => {
        if(!removeFlag){
            return;
        }
    
        let idx = getTaskidx(id);
        taskArr.splice(idx, 1);
        localStorage.setItem("task_manager", JSON.stringify(taskArr));
        task.remove();
    });
}

function handleLock(task, id){
    let taskLockElem = task.querySelector(".task-lock");
    let taskLock = taskLockElem.children[0];
    let taskarea = task.querySelector(".task-content");
    taskLock.addEventListener("click", (e) => {
        let taskareaidx = getTaskidx(id);
        if(taskLock.classList.contains(lockClass)){
            taskLock.classList.remove(lockClass);
            taskLock.classList.add(unlockClass);
            taskarea.setAttribute("contenteditable", true);
        }
        else{
            taskLock.classList.remove(unlockClass);
            taskLock.classList.add(lockClass);
            taskarea.setAttribute("contenteditable", false);
        }

        taskArr[taskareaidx].taskContent = taskarea.innerText;
        localStorage.setItem("task_manager", JSON.stringify(taskArr));
    })
}

function colorHandler(task, id){
    let taskidx = getTaskidx(id);
    let taskColor = task.querySelector(".task-color");
    taskColor.addEventListener("click", (e) => {
        let currTaskcolor = taskColor.classList[1];

        let taskcolorIndex = colors.findIndex((color) => {
            return currTaskcolor === color;
        })
        let newColorIndex = (taskcolorIndex + 1)%colors.length;
        let newColor = colors[newColorIndex];

        taskColor.classList.remove(currTaskcolor);
        taskColor.classList.add(newColor);

        taskArr[taskidx].taskColor = newColor;
        localStorage.setItem("task_manager", JSON.stringify(taskArr));
    })
}

function getTaskidx(id){
    let taskidx = taskArr.findIndex((taskObj) => {
        return taskObj.taskId === id;
    })

    return taskidx;
}

function setModalToDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allColors[allColors.length - 1].classList.add("border");
}