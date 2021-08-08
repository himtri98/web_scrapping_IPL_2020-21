
let fs=require("fs");
let path=require("path");
let request=require("request");
let cheerio=require("cheerio");


//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-qualifier-1-1237177/full-scorecard";

function scoreResult(url){
    request(url,scorePage);
}

function scorePage(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statuscode==404){
        console.log("Page Not Found");
    }else{
        dataExtraction(html);
    }
}

function dataExtraction(html){
    let scoreSearchTool = cheerio.load(html);

    let teamtables = scoreSearchTool(".Collapsible");
    //let page = scoreSearchTool(teamtables[1]).html()
    //console.log(page);

    for(let i=0;i<teamtables.length;i++)
    {
        let singleTeamName = scoreSearchTool(teamtables[i]).find("h5");

        let teamName = singleTeamName.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();

        let teamPath = path.join(process.cwd(),"answer_dir",teamName);
        
        if(fs.existsSync(teamPath) == false)
        {
            fs.mkdirSync(teamPath);
        }
        
        let batsmanDetail = scoreSearchTool(teamtables[i]).find(".table.batsman tbody tr");
        for(let j=0;j<batsmanDetail.length;j++)
        {
            numberOfTds = scoreSearchTool(batsmanDetail[j]).find("td");

            if(numberOfTds.length == 8){

                let playerName = scoreSearchTool(numberOfTds[0]).text();

                playerName = playerName.split("(")[0];
                playerName = playerName.slice(0,playerName.length-1);
                playerName = playerName.trim();

                console.log(playerName);

                let playerPath = path.join(teamPath,playerName);
                if(fs.existsSync(playerPath) == false)
                {
                    fs.mkdirSync(playerPath);
                }
            }
        }
        console.log("`````````````````````````````````````````````````");
    }
}


module.exports = {
    scoreResult
}