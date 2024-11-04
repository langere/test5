// 模拟宝藏地图API
class TreasureMap {
    // 获取初始线索
    static getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 经过1秒后，返回在古老图书馆里找到的第一个线索
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }

    // 解码古代文字线索
    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    // 如果没有传入线索，拒绝并返回错误信息
                    reject("没有线索可以解码！");
                }
                // 如果有线索，经过1.5秒后，返回解码成功的信息及宝藏所在位置
                resolve("解码成功！宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }

    // 在神庙中搜索宝藏相关操作
    static searchTemple(location, modifier) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                const adjustedThreshold = 0.5 + modifier;
                if (random < adjustedThreshold) {
                    reject("糟糕！遇到了神庙守卫！");
                } else {
                    // 新增加的情节，经过2秒后，代表解开机关谜题并找到神秘箱子，返回相应信息
                    setTimeout(() => {
                        messageContainer.innerHTML = '';
                        resolve("真是好运！成功找到了一个神秘的箱子...");
                    }, 2000);
                }
            }, 2000);
        });
    }

    // 打开宝藏箱的操作
    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 经过1秒后，返回找到传说中宝藏的信息
                resolve("恭喜！你找到了传说中的宝藏！");
            }, 2000);
        });
    }
}

// 获取动画容器里的图片元素，用于展示不同场景的图片
const currentSceneImg = document.getElementById('current-scene-img');
// 获取消息容器元素，用于展示游戏过程中的各级提示信息
const messageContainer = document.getElementById('message-container');
// 获取虚拟键盘容器元素
const virtualKeyboard = document.getElementById('virtual-keyboard');

// 用于标记是否已经遇到失败情况（如遇到守卫）
let hasFailed = false;

// 等待指定毫秒数的函数，返回一个Promise，用于实现异步等待功能
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 动画展示寻宝过程函数，通过异步操作模拟整个寻宝流程并展示相关动画和提示信息
async function animateTreasureHunt() {
    try {
        // 显示古老图书馆内部图片，作为寻宝的起始场景
        currentSceneImg.src = 'library.jpg';

        // 获取初始线索
        const clue = await TreasureMap.getInitialClue();
        console.log(clue);
        // 在页面上显示找到第一个线索的提示信息
        showMessage("已在古老的图书馆里找到了第一个线索！");

        // 根据初始线索解码古代文字，获取宝藏所在位置信息
        const location = await TreasureMap.decodeAncientScript(clue);
        console.log(location);
        // 在页面上显示解码成功及宝藏位置的提示信息
        messageContainer.innerHTML = '';
        showMessage("已解码线索，宝藏在一座古老的神庙中...");

        // 等待两秒并显示相关提示，模拟前往古老神庙的过程
        await wait(2000).then(() => {
            messageContainer.innerHTML = '';
            showMessage("正在前往古老神庙...");
            // 显示古老神庙图片，切换到神庙场景
            currentSceneImg.src = 'temple.jpg';
        });

        // 显示玩家选择提示
        messageContainer.innerHTML = '';
        showMessage("在神庙中，你可以选择：");
        createVirtualButtons();

        // 获取玩家选择并继续后续异步操作
        playerChoice = await getPlayerChoice();
        console.log("玩家做出的选择：", playerChoice);

        // 根据玩家选择执行相应操作
        if (playerChoice === 1) {
            
            currentSceneImg.src = 'patrol_temple.jpg'; // 显示巡视神庙图片
            await handlePatrolChoice(location);
        } else if (playerChoice === 2) {
            
            currentSceneImg.src = 'dig_ground.jpg'; // 显示挖开地面图片
            await handleDigChoice(location);
        }

        // 如果没有遇到失败情况，才执行打开宝藏箱的操作
        if (!hasFailed) {
            // 打开宝藏箱
            const treasure = await TreasureMap.openTreasureBox();
            console.log(treasure);
            // 在页面上显示找到宝藏的提示信息
            messageContainer.innerHTML = '';
            showMessage("恭喜！你找到了传说中的宝藏！");
        }
    } catch (error) {
        console.error("任务失败：", error);
        // 在页面上显示寻宝任务失败的提示信息
        messageContainer.innerHTML = '';
        showMessage("被守卫击败：" + error);
    }
}

// 处理在神庙内巡视的选择逻辑
async function handlePatrolChoice(location) {
    try {
        messageContainer.innerHTML = '';
        showMessage("四处看看，或许会有发现...");
        let newSuccessRateModifier = (Math.random() * 0.2) - 0.1; // 在 -0.1 到 +0.1 内变化
        if (newSuccessRateModifier > 0) {
            await wait(2000).then(() => {});
            messageContainer.innerHTML = '';
            showMessage("貌似有什么令人不安的东西正在接近");
        } else {
            await wait(2000).then(() => {});
            messageContainer.innerHTML = '';
            showMessage("貌似寻找到了宝藏的踪迹！");
        }
        const box = await TreasureMap.searchTemple(location, newSuccessRateModifier);
        console.log("巡视选择操作 - 搜索神庙结果：", box);
        if (box === "糟糕！遇到了神庙守卫！") {
            currentSceneImg.src = 'temple_guard.jpg';
            // 设置失败标记为true
            hasFailed = true;
        } else {
            currentSceneImg.src = 'temple.jpg'; // 恢复神庙图片
            // 如果成功找到箱子，显示古老神庙内有宝箱图片
            currentSceneImg.src = 'temple_treasure_box.jpg';
            showMessage(box);
        }
    } catch (error) {
        console.error("巡视选择操作失败：", error);
        // 更详细的失败提示信息
        // 显示巡视失败的提示信息并切换到相应失败场景图片
        messageContainer.innerHTML = '';
        showMessage("转角处碰到守卫了！被守卫击败！");
        // 设置失败标记为true
        hasFailed = true;
        // 切换到相应的失败场景图片
        currentSceneImg.src = 'temple_guard.jpg';
    }
}

// 处理敲开地面的选择逻辑
async function handleDigChoice(location) {
    try {
        messageContainer.innerHTML = '';
        showMessage("不管了，这下面肯定有线索！");
        let newSuccessRateModifier = (Math.random() * 0.8) - 0.4; // 在 -0.3 到 +0.3 内变化
        if (newSuccessRateModifier > 0) {
            await wait(2000).then(() => {});
            messageContainer.innerHTML = '';
            showMessage("糟糕！声音貌似引来了什么恐怖的东西！");
        } else {
            await wait(2000).then(() => {});
            messageContainer.innerHTML = '';
            showMessage("这下面就是宝藏！");
        }
        const box = await TreasureMap.searchTemple(location, newSuccessRateModifier);
        console.log("敲开地面选择操作 - 搜索神庙结果：",  box);
        if (box === "糟糕！遇到了神庙守卫！") {
            
            currentSceneImg.src = 'temple_guard.jpg';
            // 设置失败标记为true
            hasFailed = true;
        } else {
            currentSceneImg.src = 'temple.jpg'; // 恢复神庙图片
            // 如果成功找到箱子，显示古老神庙内有宝箱图片
            currentSceneImg.src = 'temple_treasure_box.jpg';
            showMessage(box);
        }
    } catch (error) {
        console.error("敲开地面选择操作失败：", error);
        // 显示敲开地面失败的提示信息并切换到相应失败场景图片
        messageContainer.innerHTML = '';
        showMessage("敲开地面时，你的声音引来了守卫，被守卫击败！");
        // 设置失败标记为true
        hasFailed = true;
        // 切换到相应的失败场景图片
        currentSceneImg.src = 'temple_guard.jpg';
    }
}
// 创建虚拟按钮的函数
function createVirtualButtons() {
    const button1 = document.createElement('button');
    button1.textContent = "在神庙内巡视";
    button1.addEventListener('click', () => {
        handlePlayerChoice(1);
        // 正确设置玩家选择值
        playerChoice = 1;
        // 触发getPlayerChoice函数的resolve，传递选择值
        getPlayerChoice().then(() => {
            return playerChoice;
        });
    });
    virtualKeyboard.appendChild(button1);

    const button2 = document.createElement('button');
    button2.textContent = "敲开地面";
    button2.addEventListener('click', () => {
        handlePlayerChoice(2);
        // 正确设置玩家选择值
        playerChoice = 2;
        // 触发getPlayerChoice函数的resolve，传递选择值
        getPlayerChoice().then(() => {
            return playerChoice;
        });
    });
    virtualKeyboard.appendChild(button2);
}

// 处理玩家选择的函数
function handlePlayerChoice(choice) {
    virtualKeyboard.style.display = 'none';
    return choice;
}

// 获取玩家选择的函数（使用虚拟按钮点击事件）
function getPlayerChoice() {
    return new Promise((resolve) => {
        // 监听虚拟按钮点击事件，将选择值传递给resolve函数
        document.addEventListener('click', function (event) {
            if (event.target.textContent === "在神庙内巡视") {
                resolve(1);
            } else if (event.target.textContent === "敲开地面") {
                resolve(2);
            }
        });
    });
}

// 在页面上显示消息的函数，创建一个新的div元素并添加到消息容器中展示指定消息
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}

// 启动动画寻宝过程，调用函数开始整个寻宝游戏的模拟流程
animateTreasureHunt();