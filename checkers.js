var selected = null;
var moved = false;
var jump=true;
var pieceClass;
var enemyClass;
var override = "";
var titleOverride = "";
var regex = /[?&]([^=#]+)=([^&#]*)/g,
    url = window.location.href,
    params = {},
    match;
while(match = regex.exec(url)) {
    params[match[1]] = match[2];
}
if(params.player){
    document.getElementById("mover").innerText = params.player + "'s turn!";
    if(params.player == "white"){
        pieceClass = "wPiece";
        enemyClass = "rPiece";
    }else{
        pieceClass = "rPiece";
        enemyClass = "wPiece";
    }
}else{
    window.onload = function(){
        titleOverride = "SMSCheckers";
        win();
    }
}
function getMoveset(){
    var moveSet = "";
    for(i = 1; i < 8; i+=2){
        for(j = 0; j < 2; j++){
            for(k = 2; k<=8; k+=2){
                child = document.getElementById((i+j) + "x" + (k-j)).childNodes;
                if(child.length > 0){
                    child = child[0];
                    if(child.classList.contains("rPiece")){
                        if(child.classList.contains("king"))
                            moveSet += "R";
                        else
                            moveSet += "r";
                        
                    }else if(child.classList.contains("wPiece")){
                        if(child.classList.contains("king"))
                            moveSet+="W";
                        else
                            moveSet+="w";
                        
                    }else {
                        moveSet+="b";
                    }
                }else{
                    moveSet+="b";
                }
            }
        }
    }
    return moveSet;
}
function checkWin(){
    var enemies = Array.from(document.getElementsByClassName(enemyClass));
    var allies = Array.from(document.getElementsByClassName(pieceClass));
    var w = true;
    if(enemies.length == 0)
        return true;
    enemies.forEach(function(el){
        var row = parseInt(el.parentElement.id[0]);
        var col = parseInt(el.parentElement.id[2]);
        for(i = -1; i < 2; i += 2){
            for(j = -1; j < 2; j+= 2){
                if((row+i) % 9 == 0 || (col+j) % 9 == 0)
                    continue;
                if(document.getElementById((row+i)+"x"+(col+j)).childNodes.length == 0)
                    w = false;
            }
        }
    });
    return w;
    
}
function win(){
    var hide = Array.from(document.getElementsByClassName("piece")).concat(Array.from(document.getElementsByClassName("space"))).concat(Array.from(document.getElementsByClassName("row")));
    hide.push(document.getElementById("mover"));
    hide.push(document.getElementById("urlBox"));
    hide.push(document.getElementById("buttonsDiv"));
    for(i=0;i<hide.length;i++){
        hide[i].style.height="0px";
        hide[i].style.visibility="hidden";
    }
    var winDiv = document.getElementById("winDiv");
    winDiv.style.height="20vh";
    winDiv.style.visibility="visible";
    document.getElementById("winText").innerText=(titleOverride?titleOverride:(params.player + " wins!"));

}
function getURL(){
    return window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + "?board=" + getMoveset() + "&player=" + ((params.player=="white")?"red":"white");
}
function getDefault(){
    return window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + "?board=rrrrrrrrrrrrbbbbbbbbwwwwwwwwwwww&player=white";
}

function select(el){
   if(selected != el){
       if(el.childNodes.length > 0 && !moved){  
        if(selected){
            selected.style.border = "";
            selected = null;
        }
            if(el.childNodes[0].classList.contains(pieceClass)){
                selected = el;
                selected.style.border = "3px solid green";
            }
        }else{ 
            var elRow = parseInt(el.id.charAt(0));
            var elCol = parseInt(el.id.charAt(2));
            var selRow = parseInt(selected.id.charAt(0));
            var selCol= parseInt(selected.id.charAt(2));
            if(((selRow-elRow == 1 && params.player=="white") || (selRow-elRow == -1 && params.player=="red") || (selected.childNodes[0].classList.contains("king") && Math.abs(elRow-selRow) == 1)) && Math.abs(selCol - elCol) == 1 && !moved){
                document.getElementById("mover").style.visibility = "hidden";
                document.getElementById("mover").style.height = "0px";
                document.getElementById("buttonsDiv").style.visibility="visible";
                document.getElementById("buttonsDiv").style.height="10vmin";
                document.getElementById("urlBox").value = getURL();
                el.appendChild(selected.childNodes[0]);
                moved=true;
                jump=false;
                selected.style.border = "";
                selected = null;
                if((params.player=="white" && elRow == 1 )|| (params.player=="red" && elRow == 8)){
                    el.childNodes[0].classList.add("king");
                }
                if(checkWin())
                    win();
            }else if(((selRow-elRow == 2 && params.player=="white") || (selRow-elRow == -2 && params.player=="red") || (selected.childNodes[0].classList.contains("king") && Math.abs(elRow-selRow) == 2)) && Math.abs(selCol - elCol) == 2 && jump){
             pjRow = selRow - (selRow-elRow)/2;
             pjCol = selCol - (selCol-elCol)/2;
             pjSpace = document.getElementById(pjRow + "x" + pjCol)
                 if(pjSpace.childNodes[0].classList.contains(enemyClass)){
                 pjSpace.removeChild(pjSpace.childNodes[0])
                el.appendChild(selected.childNodes[0]);
                moved = true
                selected.style.border = "";
                selected = el;
                selected.style.border = "3px solid green";
                if((params.player=="white" && elRow == 1 )|| (params.player=="red" && elRow == 8)){
                    el.childNodes[0].classList.add("king");
                }

                document.getElementById("mover").style.visibility = "hidden";
                document.getElementById("mover").style.height = "0px";
                document.getElementById("buttonsDiv").style.visibility="visible";
                document.getElementById("buttonsDiv").style.height="10vmin";
                document.getElementById("urlBox").value = getURL();
                if(checkWin())
                    win();
             }
            }

        }
   }
}
for(i = 1; i <= 8; i++){
    var row = document.createElement("TR");
    row.className = "row"
    row.id = "row" + i;
    document.getElementById("board").appendChild(row);
    for(j = 1; j <= 8; j++){
        var space = document.createElement("TD");
        space.setAttribute("onclick","select(this)");
        space.className = "space " + (((j + (i%2)) % 2 == 0)? "white" : "black");
        space.id = i + "x" + j;
        row.appendChild(space);

    }
}
if(params.board){
    for(i = 0; i < params.board.length; i++){
        var piece = document.createElement("SPAN");
        if(params.board.charAt(i) == 'r')
            piece.className="piece rPiece";
        else if(params.board.charAt(i) == 'R')
            piece.className="piece rPiece king";
        else if(params.board.charAt(i) == 'w')
            piece.className="piece wPiece";
        else if(params.board.charAt(i) == "W")
            piece.className="piece wPiece king";
        else
            continue;

        var parent = Math.floor(i/4) + 1 + "x" + (((i % 4+ 1) - (((i % 8) < 4)?0:1))*2 + (((i % 8) < 4)?0:1))
        piece.setAttribute("onclick","function() {document.getElementById(\""+ parent + "\").click}");
        document.getElementById(parent).appendChild(piece);
        
    }
}
document.getElementById('endTurn').addEventListener('click', function(){
  var textarea = document.createElement('textarea');
  textarea.textContent = (override?override:getURL());
  document.body.appendChild(textarea);
  var selection = document.getSelection();
  var range = document.createRange();
//  range.selectNodeContents(textarea);
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);

  console.log('copy success', document.execCommand('copy'));
  selection.removeAllRanges();
  document.body.removeChild(textarea);
  document.body.innerHTML="<h2>Close the Window<br>+ Paste the Link</h2>";
})
function finish(){
    window.close();
}   

