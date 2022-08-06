(function () {
    let btnAddfolder = document.querySelector("#addFolder");
    let btnTextFile = document.querySelector("#addTextFile");
    //  for Album application
    // let btnAddAlbum = document.querySelector("#addAlbum");
    // end Album application 
    let divBreadCrumb = document.querySelector("#breadCrumb");
    let aRootPath = divBreadCrumb.querySelector("a[purpose='path']");
    let divContianer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle= document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = document.querySelector("#app-close");
    let resources = [];
    let cfid = -1;
    let rid = 0;
    
    
    btnAddfolder.addEventListener('click', addFolder);
    btnTextFile.addEventListener('click', addTextFile);
    //  for Album application
    btnAddAlbum.addEventListener('click', addAlbum);
    //  end Album application
    aRootPath.addEventListener('click', viewFolderFromPath);
    appClose.addEventListener("click", closeApp);

    function closeApp(){
        divAppTitle.innerHTML = "Name of File";
        divAppTitle.setAttribute("rid", "");
        divAppMenuBar.innerHTML = "";
        divAppBody.innerHTML = "";
    }

   
   function addFolder() {
       /*
    ----Add Folder---
    1> we entering name of the folder from user using prompt.
    2> now we are checking if the passed name by user is not equal to null {mtlb name pass kiya hai} but they added spaces in starting or ending . so, we are triming those spaces.
    3> checking the name exists => in our resourses , if our resources name folder = folder name and woh same parent id ka hai jo abhi current id ka hai toh. already exists keh do usko
    4> now pid of this.folder is cfid.
    5> then we just increase rid by one , everytime this function is run rid will plus one .
    6> adding those folder to our HTML sheet .
    7> in our RAM using push method => pushing rid ,name , pid , type.
    8> also saving new folder in our browser storage .
    */
       let fname = prompt("Enter folder's name");
       if(fname != null){
           fname = fname.trim();
        }
        if(!fname){ // empty name validation
            return;
        }
        // uniqueness of name validation
        let alreadyExists = resources.some(f=>f.rname == fname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This folder =>  "+fname+" Already exists !!");
            return;
        }
        let pid = cfid;
        rid++;
        addFolderHTML(fname, rid, pid);
        resources.push({
            rid: rid,
            rname: fname,
            rtype: "Folder",
            pid: cfid,
            
        })
        saveToStorage();
    }

    function addTextFile() {
        let fname = prompt("Enter Text file name ?");
       if(fname != null){
           fname = fname.trim();
        }
        if(!fname){ // empty name validation
            return;
        }
        // uniqueness of name validation
        let alreadyExists = resources.some(f=>f.rname == fname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This file =>  "+fname+" Already exists !!");
            return;
        }
        let pid = cfid;
        rid++;
        addTextFileHTML(fname, rid, pid);
        resources.push({
            rid: rid,
            rname: fname,
            rtype: "Text-file",
            pid: cfid,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            bgColor: "#000000",
            textColor: "#00ff55",
            fontFamily: "cursive",
            fontSize: 22,
            content: "Type here..."
        })
        saveToStorage();
    }
    function deleteAlbum(){
        let spanDelete = this;
        let divAlbum = spanDelete.parentNode;
        let divName = divAlbum.querySelector("[purpose = 'name']");
        let fidTBD = parseInt(divAlbum.getAttribute("rid"));
        let fname = divName.innerHTML;
        let sure = confirm(`Are you sure you want to delete ${fname} ?`);
        if(!sure){
            return;
        }

        // Folder To Be Deleted from HTML.
            divContianer.removeChild(divAlbum);

        // Folder To Be Deleted from RAM.
             let ridx = resources.findIndex(r => r.rid == fidTBD);
             resources.splice(ridx, 1);

        // Folder To Be Deleted from Storage of Browser.
            saveToStorage();
    }
    function deleteTextfile() {
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divName = divTextFile.querySelector("[purpose = 'name']");
        let fidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;
        let sure = confirm(`Are you sure you want to delete ${fname} ?`);
        if(!sure){
            return;
        }

        // Folder To Be Deleted from HTML.
            divContianer.removeChild(divTextFile);

        // Folder To Be Deleted from RAM.
             let ridx = resources.findIndex(r => r.rid == fidTBD);
             resources.splice(ridx, 1);

        // Folder To Be Deleted from Storage of Browser.
            saveToStorage();
    }
    function deleteFolder() {
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");
        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;
        let sure = confirm(`Are you sure you want to delete ${fname} ?`);
        if(!sure){
            return;
        }

        // Folder To Be Deleted from HTML.
            divContianer.removeChild(divFolder);

        // Folder To Be Deleted from RAM.
             deleteHelper(fidTBD);

        // Folder To Be Deleted from Storage of Browser.
            saveToStorage();

    }
    function deleteHelper(deletefolderId){
        let children = resources.filter(f => f.pid == deletefolderId);
        for(let i = 0; i < children.length; i++){
            deleteHelper(children[i].rid);
        }
        let ridx = resources.findIndex(f=>f.rid == deletefolderId);
        console.log(resources[ridx].rname);
        resources.splice(ridx,1);
    }
    function renameFolder() {
        let nfname = prompt("Enter a new Name ?");
        if(nfname != null){
            nfname = nfname.trim();
        }
        if(!nfname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }
        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");
        let ofname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        
        if(nfname == ofname){
            alert("This Name is already in use .");
            return;
        }

        let alreadyExists = resources.some(f => f.rname == nfname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This name of folder Already exists !!");
            return;
        }
        // Change this data in HTML.
        divName.innerHTML = nfname;

        // Change this data in RAM.
        let resourceidOfThis = resources.find(f => f.rid == ridTBU);
        resourceidOfThis.rname = nfname;

        // Change this data in Storage of browser.
        saveToStorage();
    }

    function renameTextfile() {  
        let nfname = prompt("Enter a new file name ?");
        if(nfname != null){
            nfname = nfname.trim();
        }
        if(!nfname){ // empty name validation
            
            return;
        }
        let spanRename = this;
        let divTextFile = spanRename.parentNode;
        let divName = divTextFile.querySelector("[purpose = 'name']");
        let ofname = divName.innerHTML;
        let ridTBU = parseInt(divTextFile.getAttribute("rid"));
        
        if(nfname == ofname){
            alert("This Name is already in use .");
            return;
        }

        let alreadyExists = resources.some(f => f.rname == nfname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This name of folder Already exists !!");
            return;
        }
        // Change this data in HTML.
        divName.innerHTML = nfname;

        // Change this data in RAM.
        let resourceidOfThis = resources.find(f => f.rid == ridTBU);
        resourceidOfThis.rname = nfname;

        // Change this data in Storage of browser.
        saveToStorage();
    }
    function renameAlbum(){
        let nfname = prompt("Enter a new file name ?");
        if(nfname != null){
            nfname = nfname.trim();
        }
        if(!nfname){ // empty name validation
            
            return;
        }
        let spanRename = this;
        let divAlbum = spanRename.parentNode;
        let divName = divAlbum.querySelector("[purpose = 'name']");
        let ofname = divName.innerHTML;
        let ridTBU = parseInt(divAlbum.getAttribute("rid"));
        
        if(nfname == ofname){
            alert("This Name is already in use .");
            return;
        }

        let alreadyExists = resources.some(f => f.rname == nfname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This name of folder Already exists !!");
            return;
        }
        // Change this data in HTML.
        divName.innerHTML = nfname;

        // Change this data in RAM.
        let resourceidOfThis = resources.find(f => f.rid == ridTBU);
        resourceidOfThis.rname = nfname;

        // Change this data in Storage of browser.
        saveToStorage();
    }
    function viewTextFile() {
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action='font-size']");
        let spanforupload = divAppMenuBar.querySelector("[action = 'forupload']");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        spanforupload.addEventListener("click", function(){
            inputUpload.click();
        })
        inputUpload.addEventListener("change", uploadNotepad);

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    
    }
    function downloadNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;
        
        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);
        
        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.rname + ".json");

        aDownload.click();
    }

    function uploadNotepad(){
        let file = window.event.target.files[0]; 
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            let data = window.event.target.result;
            let resource = JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");

            spanBold.setAttribute("pressed", !resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;

            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        })

        reader.readAsText(file);


        
    }
    function saveNotepad(){ 
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();
    }

    function makeNotepadBold(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotepadItalic(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }

    function makeNotepadUnderline(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }

    function changeNotepadBGColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }

    function changeNotepadFontFamily(){ 
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }

    function changeNotepadFontSize(){ 
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize+"px";
    }

    function viewFolder() {
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));
        let pathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(pathTemplate, true);
        aPath.addEventListener('click', viewFolderFromPath);
        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        divBreadCrumb.appendChild(aPath);

        cfid = fid;
        divContianer.innerHTML= "";
        if(resources.find(f=>f.rtype=="Folder")){   
            resources.filter(f=>f.rtype=="Folder").forEach(f => {
                    if (f.pid === cfid) {
                        addFolderHTML(f.rname, f.rid, f.pid);
                    }
                
                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
        if(resources.find(f=>f.rtype=="Text-file")){
            resources.filter(f=>f.rtype=="Text-file").forEach(f => {
                    if (f.pid === cfid) {
                        addTextFileHTML(f.rname, f.rid, f.pid);
                    }
                
                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
        if (resources.find(f => f.rtype == "album")) {
            resources.filter(f => f.rtype == "album").forEach(f => {
                if (f.pid === cfid) {
                    addAlbumHTML(f.rname, f.rid, f.pid);
                }

                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
    }
    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }
        cfid = fid;
        divContianer.innerHTML = "";
        if(resources.find(f=>f.rtype == "Folder")){   
            resources.filter(f=>f.rtype=="Folder").forEach(f => {
                    if (f.pid === cfid) {
                        addFolderHTML(f.rname, f.rid, f.pid);
                    }
                
                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
        if(resources.find(f=>f.rtype == "Text-file")){
            resources.filter(f=>f.rtype=="Text-file").forEach(f => {
                    if (f.pid === cfid) {
                        addTextFileHTML(f.rname, f.rid, f.pid);
                    }
                
                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
        if (resources.find(f => f.rtype == "album")) {
            resources.filter(f => f.rtype == "album").forEach(f => {
                if (f.pid === cfid) {
                    addAlbumHTML(f.rname, f.rid, f.pid);
                }

                if (f.rid > rid) {
                    rid = f.rid;
                }
            })
        }
    }
    function viewAlbum(){
        let spanView = this;
        let divAlbum = spanView.parentNode;
        let divName = divAlbum.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divAlbum.getAttribute("rid"));

        let divAlbumMenuTemplate = templates.content.querySelector("[purpose=album-menu]");
        let divAlbumMenu = document.importNode(divAlbumMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divAlbumMenu);

        let divAlbumBodyTemplate = templates.content.querySelector("[purpose=album-body]");
        let divAlbumBody = document.importNode(divAlbumBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divAlbumBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanAdd= divAlbumMenu.querySelector("[action = 'add']");
        spanAdd.addEventListener("click", addPictureToAlbum);
    }
    function addPictureToAlbum(){
        let url = prompt("Please Enter Image Address url !");
        let img = document.createElement("img");
        img.setAttribute("src", url);
        img.addEventListener("click", showPictureToMain);
        
        let divPictureList = divAppBody.querySelector(".picture-list");
        divPictureList.appendChild(img);

    }
    function showPictureToMain(){
        let divPictureMainImg = divAppBody.querySelector(".picture-main>img");
        divPictureMainImg.setAttribute("src", this.getAttribute("src"));
        let divPictureList = divAppBody.querySelector(".picture-list");
        let imgs = divPictureList.querySelectorAll("img");
        for(let i = 0; i < imgs.length; i++){
            imgs[i].setAttribute("pressed", false);
        }
    
        this.setAttribute("pressed", true);
    }
    function addAlbum(){
        let fname = prompt("Enter Album name's ?");
       if(fname != null){
           fname = fname.trim();
        }
        if(!fname){ // empty name validation
            return;
        }
        // uniqueness of name validation
        let alreadyExists = resources.some(f=>f.rname == fname && f.pid == cfid);
        if(alreadyExists == true){
            alert("This albumr =>  "+fname+" Already exists !!");
            return;
        }
        let pid = cfid;
        rid++;
        addAlbumHTML(fname, rid, pid);
        resources.push({
            rid: rid,
            rname: fname,
            rtype: "album",
            pid: cfid,
            
        })
        saveToStorage();
    }
    function addAlbumHTML(rname , rid , pid){
        let divAlbumTemplate = templates.content.querySelector(".album");
        let divAlbum = document.importNode(divAlbumTemplate , true);

        spanRename = divAlbum.querySelector("[action = 'rename']");
        spanDelete = divAlbum.querySelector("[action = 'delete']");
        spanView = divAlbum.querySelector("[action = 'view']");
        divName = divAlbum.querySelector("[purpose = 'name']");

        divName.innerHTML = rname;
        divAlbum.setAttribute("rid", rid);
        divAlbum.setAttribute("pid", pid)
        spanRename.addEventListener('click', renameAlbum);
        spanDelete.addEventListener('click',deleteAlbum);
        spanView.addEventListener('click',viewAlbum);

        divContianer.appendChild(divAlbum);
    }
    function addFolderHTML(rname , rid , pid){
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate , true);

        spanRename = divFolder.querySelector("[action = 'rename']");
        spanDelete = divFolder.querySelector("[action = 'delete']");
        spanView = divFolder.querySelector("[action = 'view']");
        divName = divFolder.querySelector("[purpose = 'name']");

        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid)
        spanRename.addEventListener('click',renameFolder);
        spanDelete.addEventListener('click',deleteFolder);
        spanView.addEventListener('click',viewFolder);

        divContianer.appendChild(divFolder);
    }
    function addTextFileHTML(rname , rid , pid){
        let divFolderTemplate = templates.content.querySelector(".Text-file");
        let divTextFile = document.importNode(divFolderTemplate , true);

        spanRename = divTextFile.querySelector("[action = 'rename']");
        spanDelete = divTextFile.querySelector("[action = 'delete']");
        spanView = divTextFile.querySelector("[action = 'view']");
        divName = divTextFile.querySelector("[purpose = 'name']");

        divName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid)
        spanRename.addEventListener('click',renameTextfile);
        spanDelete.addEventListener('click',deleteTextfile);
        spanView.addEventListener('click',viewTextFile);

        divContianer.appendChild(divTextFile);
    }
    
    function saveToStorage(){
        let jso = JSON.stringify(resources);
        localStorage.setItem("data", jso);

    }

    function loadFromStorage() {
/*
    -- --Load From Storage --- 
    we use because we want to save our data , even when we try to refresh it basically we load all the previous data from our browser storage
    1> we are getting a data from our browser.
    2> now we are checking that our json is empty or not empty.
    3> the data we are getting it . It is in the JSON fromat . we want it string and we saved our data in our resource array . 
    4> we looped our resource array because "Hum wohi folder ko show karwana chata hai jiska pid match karta ko cfid se . cfid is current folder and pid is parent id"
    5> if our rid is smaller then our storage rid then we replaace it.
*/
        let json = localStorage.getItem("data")
        if (!!json) {
            resources = JSON.parse(json);
            // let typeofFolder =resources.filter(f=>f.rtype=="Folder");
            // let typeofFile=resources.filter(f=>f.rtype=="Text-file");

            if (resources.find(f => f.rtype == "Folder")) {
                resources.filter(f => f.rtype == "Folder").forEach(f => {
                    if (f.pid === cfid) {
                        addFolderHTML(f.rname, f.rid, f.pid);
                    }
                    if (f.rid > rid) {
                        rid = f.rid;
                    }
                })
            }
            if (resources.find(f => f.rtype == "Text-file")) {
                resources.filter(f => f.rtype == "Text-file").forEach(f => {
                    if (f.pid === cfid) {
                        addTextFileHTML(f.rname, f.rid, f.pid);
                    }

                    if (f.rid > rid) {
                        rid = f.rid;
                    }
                })
            }
            if (resources.find(f => f.rtype == "album")) {
                resources.filter(f => f.rtype == "album").forEach(f => {
                    if (f.pid === cfid) {
                        addAlbumHTML(f.rname, f.rid, f.pid);
                    }

                    if (f.rid > rid) {
                        rid = f.rid;
                    }
                })
            }
        }
    }
    loadFromStorage();



})();



