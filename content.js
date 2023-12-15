chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.type === 'fetchUserName') {
        // 当popup.js查询当前页面的用户名时，返回之. 
        sendResponse(getUserName())
    }
});

function getUserName() {
    const userName = document.getElementsByClassName('p-name')[0]
    if (userName) {
        return {
            homePage: "True",
            userName: userName.innerText
        }
    }
    else {
        return {
            homePage: "False",
            userName: undefined
        }
    }
}

