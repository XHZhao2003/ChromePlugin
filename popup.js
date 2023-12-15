$(document).ready(async function () {
    await ChangeDisplay("Empty")
    await UpdateUserName()
})

$("#button").on("click", async function(){
    const userName = await getStorage("userName")
    if(userName){
        await UpdateRepos()
        await ChangeDisplay("Repos")
        return
    }
    await ChangeDisplay("Info")
})



async function setStorage(key, value) {
    // console.warn(`set ${key} to ${JSON.stringify(value)}`)
    let obj = {}; obj[key] = value;
    chrome.storage.session.set(obj)
}

async function getStorage(key) {
    const value = (await chrome.storage.session.get([key]))[key]
    if (!value) {
        // console.warn(`warning: ${key} not found in storage`)
        return null
    }
    return value
}

async function UpdateUserName() {
    let tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    })
    let tab = tabs[0]
    await chrome.tabs.sendMessage(tab.id, { type: 'fetchUserName' })
    .then(async function(res){
        if (res.homePage === "True") {
            await setStorage("userName", res.userName)
            $("#header-content")[0].innerText = "Repos Recommended for " + res.userName
        }    
        else{
            await setStorage("userName", "")
            $("#header-content")[0].innerText = "Repos Recommended"
        }
    })
}

async function UpdateRepos(){
    // Get repos from server
    repos = [{
        userName : "userName for demo",
        repoName: "repoName for demo",
        url : "https://github.com/XHZhao2003"
    }]

    await setStorage("repos", repos)
    $("#body").empty()
    for(repo of repos){
        await AppendRepoDOM(repo.userName, repo.repoName, repo.url)
    }   
}

async function ChangeDisplay(type){
    if(type === "Repos"){
        $("#body").show()
        $("#loading").hide()
        $("#info").hide()
    }
    else if(type === "Loading"){
        $("#body").hide()
        $("#loading").show()
        $("#info").hide()
    }
    else if(type === "Info"){
        $("#body").hide()
        $("#loading").hide()
        $("#info").show()
    }
    else if(type === "Empty"){
        $("#body").hide()
        $("#loading").hide()
        $("#info").hide()
    }
    else{
        console.warn(`Unknown type: ${type}`)
    }
}

async function AppendRepoDOM(userName, repoName, url){
    htmlString = "<div class=\"repo\"><span class=\"user\">" + userName 
            + "</span><div> <a href=\""+ url + "\" target=\"_blank\">" + repoName+ "</a> </div></div>"
    const repo = $(htmlString)
    $("#body").append(repo)
}