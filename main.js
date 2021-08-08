let fs=require("fs");
let path=require("path");
let request=require("request");
let cheerio=require("cheerio");
let obj = require("./scorecard");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url,cb);
function cb(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statuscode==404){
        console.log("Page Not Found");
    }else{
        mainPageExtracter(html);
    }
}

//first page extraction of link
function mainPageExtracter(html){
    let searchTool = cheerio.load(html);
    let allMatch = searchTool('a[data-hover="View All Results"]');
    let link = allMatch.attr("href");
    let fullLink = `https://www.espncricinfo.com${link}`;
    //console.log(fullLink);

    request(fullLink,newcb);
}

function newcb(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statuscode==404){
        console.log("Page Not Found");
    }else{
        allMatchPage(html);
    }
}

//all matches page extraction 
function allMatchPage(html){
    let searchTool1 = cheerio.load(html);
    let scorecard = searchTool1('a[data-hover="Scorecard"]');
    for(let i=0;i<scorecard.length;i++)
    {
        let value = searchTool1(scorecard[i]);
        let link1 = value.attr("href");
        let fullLink1 = `https://www.espncricinfo.com${link1}`;
        //console.log(fullLink1);
        obj.scoreResult(fullLink1);
    }
}

