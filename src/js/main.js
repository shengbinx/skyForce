// 全局存储对象.
var privateStorage = {
    // 常量定义
    "CONSTANTS": {
        // 飞机图片地址
        "PLANE_SRC": {
            // 玩家飞机
            // 正常
            "MY_NORMAL_PLANE": "img/plane_my.gif",
            // 摧毁
            "MY_CRASH_PLANE": "img/crash_my.gif",
            // 敌军飞机
            // 大飞机正常
            "B_NORMAL_PLANE": "img/plane_b.png",
            // 大飞机挨打
            "B_HIT_PLANE": "img/hit_b.png",
            // 大飞机摧毁
            "B_CRASH_PLANE": "img/crash_b.gif",
            // 中飞机正常
            "M_NORMAL_PLANE": "img/plane_m.png",
            // 中飞机挨打
            "M_HIT_PLANE": "img/hit_m.png",
            // 中飞机摧毁
            "M_CRASH_PLANE": "img/crash_m.gif",
            // 小飞机正常
            "S_NORMAL_PLANE": "img/plane_s.png",
            // 小飞机摧毁
            "S_CRASH_PLANE": "img/crash_s.gif"
        },
        // 子弹图片地址
        "BULLET_SRC": "img/bullet.png",
        // 场景类
        "SCENE": {
            // 启动背景图
            "BACKGROUND_START": "img/background_start.png",
            // 开始背景图
            "BACKGROUND_NORMAL": "img/background.png"
        },
        // 游戏配置类
        "GAME": {
            // 设定难度等级分数
            "DIFFICULTY": {
                "LEVEL": 1,
                "SCORES": {
                    "1": 1000,
                    "2": 2000,
                    "3": 5000,
                    "4": 10000,
                    "5": 50000
                }
            },
            // 游戏运行速度，可设定难度等级
            "FREQUENCY": 20,
            // 飞机动画持续时间（击中、摧毁等效果）
            "PLANE_ANIMATION_DURATION": 200,
            // 飞机子弹创建倍率
            "ITEM_CREATE_MULTI": 4,
            // 敌机出现频率
            "ENEMY_PLANE_FREQUENCY": 20,
            // 玩家飞机移动步长
            "MY_PLANE_MOVE_STEP": 16,
            // 玩家子弹移动步长
            "MY_BULLET_MOVE_STEP": 20,
            // 敌军飞机移动步长
            "ENEMY_PLANE_MOVE_STEP": 1,
            // 飞机生命值
            "HP": {
                // 小飞机
                "SMALL": 10,
                // 中飞机
                "MEDIUM": 20,
                // 大飞机
                "BIG": 50
            },
            // 击落奖励分数
            "SCORES": {
                // 小飞机
                "SMALL": 10,
                // 中飞机
                "MEDIUM": 20,
                // 大飞机
                "BIG": 50
            },
            "SIZES": {
                // 场景数据
                "STAGE": {
                    "WIDTH": 320,
                    "HEIGHT": 568,
                    "TOP": 100,
                    "LEFT": 787
                },
                // 飞机尺寸
                "PLANE": {
                    // 玩家飞机
                    "MY": {
                        "WIDTH": 66,
                        "HEIGHT": 80
                    },
                    // 小飞机
                    "SMALL": {
                        "WIDTH": 34,
                        "HEIGHT": 24
                    },
                    // 中飞机
                    "MEDIUM": {
                        "WIDTH": 46,
                        "HEIGHT": 60
                    },
                    // 大飞机
                    "BIG": {
                        "WIDTH": 110,
                        "HEIGHT": 164
                    }
                }
            }
        }
    },
    // 子弹队列
    bullets: {},
    // 敌军飞机队列
    enemyPlanes: {},
    // 游戏循环器
    gamer: null,
    // 玩家飞机
    myPlane: null,
    // 主游戏节点
    mainGameNode: null,
    // 玩家得分
    score: 0,
    // 飞机索引值
    planeIndex: 0,
    // 子弹索引值
    bulletIndex: 0,
    // 创建飞机索引
    planeCreatIndex: 0,
    // 创建飞机副索引
    planeCreatIndex1: 0,
    // 飞机索引前缀
    planePrefix: "p_",
    // 子弹索引前缀
    bulletPrefix: "b_",
    // 游戏运行状态
    gameStatus: "normal"
};
function Plane(posX, posY, key, type, size, normalSrc, crashSrc, hitSrc){
    this.posX = posX;
    this.posY = posY;
    this.key = key;
    this.type = type;
    this.size = size.toUpperCase();
    this.normalSrc = normalSrc;
    this.crashSrc = crashSrc;
    this.hitSrc = hitSrc;
    this.hiting = false;
    this.crashed = false;
    this.imgNode = null;
    this.width = privateStorage.CONSTANTS.GAME.SIZES.PLANE[this.size].WIDTH;
    this.height = privateStorage.CONSTANTS.GAME.SIZES.PLANE[this.size].HEIGHT;
    this.score = privateStorage.CONSTANTS.GAME.SCORES[this.size];
    this.hp = this.type == "my" ? 0 : privateStorage.CONSTANTS.GAME.HP[this.size];
    this.init();
}
Plane.prototype.init = function (){
    this.imgNode = document.createElement("img");
    this.imgNode.setAttribute("class", "plane");
    this.imgNode.src = this.normalSrc;
    this.imgNode.style.top = this.posY + "px";
    this.imgNode.style.left = this.posX + "px";
    privateStorage.mainGameNode.appendChild(this.imgNode);
};
Plane.prototype.changeStatus = function (status){
    var self = this;
    if ("normal" == status){
        self.imgNode.src = self.normalSrc;
    } else if("hit" == status) {
        self.hiting = true;
        self.imgNode.src = self.hitSrc;
        setTimeout(function (){
            self.hiting = false;
            !self.crashed && self.changeStatus("normal");
        }, privateStorage.CONSTANTS.GAME.PLANE_ANIMATION_DURATION);
    } else if("crash" == status) {
        self.crashed = true;
        self.imgNode.src = self.crashSrc;
        if ("my" != self.type){
            setTimeout(function (){
                self.recycle();
            }, privateStorage.CONSTANTS.GAME.PLANE_ANIMATION_DURATION);
        }
    }
};
Plane.prototype.hit = function (){
    if ("enemy" == this.type && !this.crashed){
        this.hp -= 10;
        if ("SMALL" != this.size && !this.hiting){
            this.changeStatus("hit");
        }
        if (this.hp <= 0){
            this.changeStatus("crash");
            setScore(privateStorage.score + this.score);
        }
    }
};
Plane.prototype.setPosition = function (posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.imgNode.style.top = posY + "px";
    this.imgNode.style.left = posX + "px";
};
Plane.prototype.recycle = function (){
    privateStorage.mainGameNode.removeChild(this.imgNode);
    delete privateStorage.enemyPlanes[this.key];
};
Plane.prototype.moveBackward = function (){
    this.posY += privateStorage.CONSTANTS.GAME.ENEMY_PLANE_MOVE_STEP;
    if ((this.posY + this.height) >= privateStorage.CONSTANTS.GAME.SIZES.STAGE.HEIGHT){
        this.recycle();
        return;
    }
    this.imgNode.style.top = this.posY + "px";
};
function Bullet(posX, posY, src, key){
    this.posX = posX;
    this.posY = posY;
    this.src = src;
    this.key = key;
    this.imgNode = null;
    this.init();
}
Bullet.prototype.init = function (){
    this.imgNode = document.createElement("img");
    this.imgNode.setAttribute("class", "bullet");
    this.imgNode.src = this.src;
    this.imgNode.style.top = this.posY + "px";
    this.imgNode.style.left = this.posX + "px";
    privateStorage.mainGameNode.appendChild(this.imgNode);
};
Bullet.prototype.recycle = function (){
    privateStorage.mainGameNode.removeChild(this.imgNode);
    delete privateStorage.bullets[this.key];
};
Bullet.prototype.moveForward = function (){
    this.posY -= privateStorage.CONSTANTS.GAME.MY_BULLET_MOVE_STEP;
    if (this.posY <= 0){
        this.recycle();
        return;
    }
    this.imgNode.style.top = this.posY + "px";
};
function setBackground(node, src){
    node.style.background = "url(" + src + ")";
}
function keyCreator(type){
    if ("bullet" == type){
        return privateStorage.bulletPrefix + privateStorage.bulletIndex++;
    } else if("plane" == type) {
        return privateStorage.planePrefix + privateStorage.planeIndex++;
    }
    return "";
}
function setScore(score){
    var GAME = privateStorage.CONSTANTS.GAME;
    privateStorage.score = score || 0;
    $("totalScore").innerText = privateStorage.score;
    $("currentScore").innerText = privateStorage.score;
    // 提高难度
    if (GAME.DIFFICULTY.LEVEL < 5){
        if (privateStorage.score >= GAME.DIFFICULTY.SCORES[GAME.DIFFICULTY.LEVEL]){
            GAME.DIFFICULTY.LEVEL++;
            GAME.ENEMY_PLANE_MOVE_STEP++;
        }
    }
}
function handleOnMyPlaneMove(e){
    var _e = e || window.event;
    var SIZES = privateStorage.CONSTANTS.GAME.SIZES;
    var posX = _e.clientX - SIZES.STAGE.LEFT;
    var posY = _e.clientY - SIZES.STAGE.TOP;
    var planes = privateStorage.enemyPlanes;
    privateStorage.myPlane.setPosition(posX - parseInt(SIZES.PLANE.MY.WIDTH / 2), posY - parseInt(SIZES.PLANE.MY.HEIGHT / 2));
    // 判断飞机的碰撞
    for (var pKey in planes){
        var plane = planes[pKey];
            pWidth = SIZES.PLANE[plane.size].WIDTH,
            pHeight = SIZES.PLANE[plane.size].HEIGHT;
        if ((posY >= plane.posY && posY <= plane.posY + pHeight) &&
            ((posX <= plane.posX + pWidth) && (posX >= plane.posX))){
            gameOver();
        }
    }
}
function handleOnDocumentMove(e){
    var _e = e || window.event;
    var SIZES = privateStorage.CONSTANTS.GAME.SIZES;
    var posX = _e.clientX;
    var posY = _e.clientY;
    // 鼠标移出游戏区域则移除鼠标滑动事件
    if (posY < SIZES.STAGE.TOP ||
        posY > (SIZES.STAGE.TOP + SIZES.STAGE.HEIGHT) ||
        posX < SIZES.STAGE.LEFT ||
        posX > (SIZES.STAGE.LEFT + SIZES.STAGE.WIDTH)){
        if (privateStorage.gameStatus == "normal"){
            pauseGame();
        }
    // 否则添加鼠标滑动事件
    } else {
        if (privateStorage.gameStatus == "pause"){
            resumeGame();
        }
    }
}
function resetGame(){
    setScore(0);
    privateStorage.myPlane = null;
    privateStorage.bullets = {};
    privateStorage.enemyPlanes = {};
    privateStorage.mainGameNode.innerHTML = "";
    clearInterval(privateStorage.gamer);
    privateStorage.gamer = null;
}
function gamer(){
    var bullets = privateStorage.bullets,
        planes = privateStorage.enemyPlanes,
        planeSrc = privateStorage.CONSTANTS.PLANE_SRC,
        gameConstant = privateStorage.CONSTANTS.GAME,
        stageWidth = privateStorage.CONSTANTS.GAME.SIZES.STAGE.WIDTH;
    privateStorage.planeCreatIndex++;
    // 创建敌机
    if (privateStorage.planeCreatIndex == gameConstant.ENEMY_PLANE_FREQUENCY){
        privateStorage.planeCreatIndex1++;
        // 创建中飞机
        if (privateStorage.planeCreatIndex1 % (parseInt(gameConstant.ENEMY_PLANE_FREQUENCY / 4)) == 0){
            var pWidth = gameConstant.SIZES.PLANE["MEDIUM"].WIDTH,
                planeKey = keyCreator("plane"),
                multiple = Math.floor(stageWidth / pWidth);
            planes[planeKey] = new Plane((Math.floor(Math.random() * multiple)) * pWidth, 0, planeKey, "enemy", "MEDIUM", planeSrc.M_NORMAL_PLANE, planeSrc.M_CRASH_PLANE, planeSrc.M_HIT_PLANE);
        }
        // 创建大飞机
        if (privateStorage.planeCreatIndex1 == gameConstant.ENEMY_PLANE_FREQUENCY){
            var pWidth = gameConstant.SIZES.PLANE["BIG"].WIDTH,
                planeKey = keyCreator("plane"),
                multiple = Math.floor(stageWidth / pWidth);
            planes[planeKey] = new Plane((Math.floor(Math.random() * multiple)) * pWidth, 0, planeKey, "enemy", "BIG", planeSrc.B_NORMAL_PLANE, planeSrc.B_CRASH_PLANE, planeSrc.B_HIT_PLANE);
            privateStorage.planeCreatIndex1 = 0;
        // 创建小飞机
        } else {
            var pWidth = gameConstant.SIZES.PLANE["SMALL"].WIDTH,
                planeKey = keyCreator("plane"),
                multiple = Math.floor(stageWidth / pWidth);
            planes[planeKey] = new Plane((Math.floor(Math.random() * multiple)) * pWidth, 0, planeKey, "enemy", "SMALL", planeSrc.S_NORMAL_PLANE, planeSrc.S_CRASH_PLANE, "");
        }
        privateStorage.planeCreatIndex = 0;
    }
    // 创建自机子弹
    if (privateStorage.planeCreatIndex % parseInt(privateStorage.CONSTANTS.GAME.ENEMY_PLANE_FREQUENCY / 4) == 0){
        var bulletKey = keyCreator("bullet");
        bullets[bulletKey] = new Bullet(privateStorage.myPlane.posX + 30, privateStorage.myPlane.posY, privateStorage.CONSTANTS.BULLET_SRC, bulletKey);
    }
    // 移动所有敌机
    for (var pKey in planes){
        if (planes.hasOwnProperty(pKey)){
            var plane = planes[pKey],
                myPlane = privateStorage.myPlane;
            if (plane instanceof Plane){
                plane.moveBackward();
                // 判断与玩家飞机的碰撞
                if ((plane.posY + plane.height >= myPlane.posY && plane.posY + plane.height <= myPlane.posY + myPlane.height) &&
                        (plane.posX >= myPlane.posX && plane.posX <= myPlane.posX + myPlane.width ||
                            plane.posX + plane.width >= myPlane.posX && plane.posX + plane.width <= myPlane.posX + myPlane.width)){
                    gameOver();
                }
            }
        }
    }
    // 移动自机子弹
    for (var bKey in bullets){
        if (bullets.hasOwnProperty(bKey)){
            var bullet = bullets[bKey];
            if (bullet instanceof Bullet){
                bullet.moveForward();
            }
        }
    }
    // 判断子弹碰撞
    for (var bKey in bullets){
        if (bullets.hasOwnProperty(bKey)){
            var bullet = bullets[bKey];
            for (var pKey in planes){
                if (planes.hasOwnProperty(pKey)){
                    var plane = planes[pKey],
                        _width = privateStorage.CONSTANTS.GAME.SIZES.PLANE[plane.size].WIDTH,
                        _height = privateStorage.CONSTANTS.GAME.SIZES.PLANE[plane.size].HEIGHT;
                    if ((bullet.posY >= plane.posY && bullet.posY <= plane.posY + _height) &&
                            ((bullet.posX <= plane.posX + _width) && (bullet.posX >= plane.posX))){
                        // 回收子弹
                        bullet.recycle();
                        // 处理碰撞
                        plane.hit();
                    }
                }
            }
        }
    }
}
function gameOver(){
    clearInterval(privateStorage.gamer);
    privateStorage.gamer = null;
    if(document.removeEventListener){
        privateStorage.mainGameNode.removeEventListener("mousemove", handleOnMyPlaneMove, true);
        document.removeEventListener("mousemove", handleOnDocumentMove, true);
    } else if(document.detachEvent) {
        privateStorage.mainGameNode.detachEvent("mousemove", handleOnMyPlaneMove);
        document.detachEvent("mousemove", handleOnDocumentMove);
    }
    privateStorage.myPlane.changeStatus("crash");
    $("endSide").style.display = "block";
}
function startGame(){
    resetGame();
    setBackground(privateStorage.mainGameNode, privateStorage.CONSTANTS.SCENE.BACKGROUND_NORMAL);
    privateStorage.myPlane = new Plane(127, 488, "", "my", "MY", privateStorage.CONSTANTS.PLANE_SRC.MY_NORMAL_PLANE, privateStorage.CONSTANTS.PLANE_SRC.MY_CRASH_PLANE, "");
    privateStorage.gamer = setInterval(gamer, privateStorage.CONSTANTS.GAME.FREQUENCY);
    // 开始游戏时绑定鼠标滑动事件
    if (document.addEventListener){
        privateStorage.mainGameNode.addEventListener("mousemove", handleOnMyPlaneMove, true);
        document.addEventListener("mousemove", handleOnDocumentMove, true);
    } else if(document.attachEvent) {
        privateStorage.mainGameNode.attachEvent("mousemove", handleOnMyPlaneMove);
        document.attachEvent("mousemove", handleOnDocumentMove);
    }
}
function pauseGame(){
    clearInterval(privateStorage.gamer);
    privateStorage.gamer = null;
    privateStorage.gameStatus = "pause";
    $("pauseSide").style.display = "block";
    if(document.removeEventListener){
        privateStorage.mainGameNode.removeEventListener("mousemove", handleOnMyPlaneMove, true);
    } else if(document.detachEvent) {
        privateStorage.mainGameNode.detachEvent("mousemove", handleOnMyPlaneMove);
    }
}
function resumeGame(){
    privateStorage.gamer = setInterval(gamer, privateStorage.CONSTANTS.GAME.FREQUENCY);
    privateStorage.gameStatus = "normal";
    $("pauseSide").style.display = "none";
    if (document.addEventListener){
        privateStorage.mainGameNode.addEventListener("mousemove", handleOnMyPlaneMove, true);
    } else if(document.attachEvent) {
        privateStorage.mainGameNode.attachEvent("mousemove", handleOnMyPlaneMove);
    }
}
function $(id){
    return document.getElementById(id);
}
window.onload = function (){
    function startBtnClickHandler(){
        privateStorage.mainGameNode.removeChild($("startBtn"));
        startGame();
    }
    function continueBtnClickHandler(){
        $("endSide").style.display = "none";
        startGame();
    }
    privateStorage.mainGameNode = $("stageSide");
    if (document.addEventListener){
        $("startBtn").addEventListener("click", startBtnClickHandler, true);
        $("continueBtn").addEventListener("click", continueBtnClickHandler, true);
    } else if(document.attachEvent) {
        $("startBtn").attachEvent("click", startBtnClickHandler);
        $("continueBtn").attachEvent("click", continueBtnClickHandler);
    }
};