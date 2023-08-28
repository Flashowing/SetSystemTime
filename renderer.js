document.getElementById('setTimeBtn').addEventListener('click', () => {
    const timeInput = document.getElementById('timeInput');
    const time = timeInput.value;
    // 将time解析为yyyy/MM/dd
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const timeStr = `${year}/${month}/${day}`;
    console.log(timeStr);
    window.electronAPI.setTime(timeStr).then((stdout) => {
        // updateTime();
        alert('设置成功');
    }).catch((error) => {
        // updateTime();
        alert('设置失败');
    })
});

document.querySelector("#resetTimeBtn").addEventListener("click", () => {
    console.log("reset time");
    window.electronAPI.setTime("now").then((stdout) => {
        // updateTime();
        alert('设置成功');
    }).catch((error) => {
        // updateTime();
        alert('设置失败');
    })
});
