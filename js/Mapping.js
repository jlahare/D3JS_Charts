/**
 * @desc 
 * This class is used for Speedometer Graph generation for Right Mechanics.
 * 
 * @version 1.0.0
 * @author  Jayesh Lahare
 * @updated 27 July 2018
 * @link    www.yash.com
 * 
 */

function Mapping()
{
    
}

Mapping.MapTest = function ()
{

    var uniqueDates = [];
    var uniqueSurveyId = [];
    var uniqueSurveyName = [];
    
    console.log("Inside Mapping");
    
   
    var js =   getJson();
    console.log("JSON is : " + js.data);
    var data  = js.data;

    //=======PART - 1 FIND UNIQUE DATES=============/
    for( let i =0 ; i< data.length ; i++)
    {
        let node = data[i];
        console.log("Date is : " + getDateFormatted(node.patient_survey_response.created_at)) ;
        
        var dn = getDateFormatted(node.patient_survey_response.created_at);
        //
        
        var found = false;
        for(var j = 0 ; j< uniqueDates.length ; j++)
        {
            if(dn == uniqueDates[j])
            {
                found = true;
                break;
            }
        }

        if(found == false)
        {
            uniqueDates.push(dn);
        }

    }

    console.log("Unique " + uniqueDates);

   //==============PART - 2 FIND UNIQUE SURVEY ID============//

            for( let i =0 ; i< data.length ; i++)
            {
                let node = data[i];
                //console.log("Date is : " + getDateFormatted(node.patient_survey_response.created_at)) ;
                
                var sid = node.survey.id;
                var sname = node.survey.survey_name;
            
                
                var found = false;
                for(var j = 0 ; j< uniqueSurveyId.length ; j++)
                {
                    if(sid == uniqueSurveyId[j])
                    {
                        found = true;
                        break;
                    }
                }

                if(found == false)
                {
                    uniqueSurveyId.push(sid);
                    uniqueSurveyName.push(sname);
                }

            }

            console.log("uniqueSurveyId " + uniqueSurveyId);

        //=============PART-3 SEPRATE LINES FOR EACH SURVEY===========/

            var lines = new Object();

            //INITIALIZE EARCH ARRAY FOR LINE
            for(let i = 0; i< uniqueSurveyId.length ; i++)
            {
                lines[uniqueSurveyId[i]] = []; // THIS IS THE KEY
            }

            for(let j = 0; j< uniqueSurveyId.length ; j++)
            {
                let sid = uniqueSurveyId[j];
                for( let i =0 ; i< data.length ; i++)
                {
                    let node = data[i];
                    if(sid == node.survey.id)
                    {
                        let point = {
                                        "surveyName": node.survey.survey_name,
                                        "date": getDateFormatted(node.patient_survey_response.created_at),
                                        "score": node.patient_survey_response.original_score
                                    };
                        // console.log("ANA " + JSON.stringify(point));
                        // console.log("PARSING " + JSON.parse(point));
                        console.log("ANA DT " + point.date);

                        lines[sid].push(point); 
                    }
                }
            }
            //FEUUUU

            console.log("LINES : " + JSON.stringify(lines));
            

            //=============PART-4 Finding X LogiC===========/

            var finalLines = new Object();
            
            //INITIALIZE EARCH LINES FOR LINE
            for(let i = 0; i< uniqueSurveyId.length ; i++)
            {
                finalLines[uniqueSurveyId[i]] = []; // THIS IS THE KEY
            }
            

            for(let i =0 ; i< uniqueSurveyId.length ; i++ )
            {
                let uid = uniqueSurveyId[i];
                let line = lines[uid]; // THiS IS SINGLE LINE FOR THAT SUVEY
               
                
                console.log("Reading Line :" + JSON.stringify(line));
                console.log("Line Length : " + line.length);
              
                for( let j = 0 ;j< line.length ; j++ )
                {
                   // var point = line[j] ; // THIS IS SINGLE POINT

                    var p = JSON.parse( JSON.stringify(line[j])); // THIS IS SINGLE POINT
                   console.log("@ " + j + " DT is " + p.date);

               
                    let pointDate = p.date;
                  
                  

                    let pointX = 0;
                    let pointY = p.score;

                    for(let x = 0 ; x < uniqueDates.length ; x++)
                    {
                            let dt = uniqueDates[x];
                            if(pointDate == dt)
                            {
                                //X POSITION OF THIS POINT IS x
                                pointX = x;
                            }
                    }
                    let obj = {
                        "x": pointX,
                        "y": pointY
                    }
                    finalLines[uid].push(obj);

                }
            }

            


            console.log("Final Lines are : " + JSON.stringify(finalLines));

}

getDateFormatted = function(dt)
{
    var d = new Date(dt);
    
    var day = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear();

    return [day, m , y].join("-");
}

getJson = function()
{
    var j =  JSON.parse('{"success":true,"data":[{"id":32,"survey":{"survey_name":"KIOOS","id":32},"patient_survey_response":{"id":83,"created_at":"2018-07-11T22:03:21.000Z","weightage_sum":94,"original_score":94}},{"id":32,"survey":{"survey_name":"KIOOS","id":32},"patient_survey_response":{"id":88,"created_at":"2018-07-12T12:52:22.000Z","weightage_sum":86,"original_score":86}},{"id":28,"survey":{"survey_name":"KOOS Jr","id":28},"patient_survey_response":{"id":141,"created_at":"2018-08-21T03:14:37.000Z","weightage_sum":68.284,"original_score":7}},{"id":29,"survey":{"survey_name":"HOOS Jr","id":29},"patient_survey_response":{"id":135,"created_at":"2018-08-21T02:30:28.000Z","weightage_sum":70.426,"original_score":6}}],"message":""}');
    return j;
}


// var lines = new Object();

//     lines['28'] = [];
//     lines['28'].push("1");
//     lines['28'].push("2");
//     lines['28'].push("3");
//     lines['28'].push("4");

//     lines['29'] = [];
//     lines['29'].push("A");
//     lines['29'].push("B");
//     lines['29'].push("C");
//     lines['29'].push("D");

//     lines['30'] = [];
//     lines['30'].push("@");
//     lines['30'].push("$");
//     lines['30'].push("%");
//     lines['30'].push("*");
//     lines['30'].push("!");


//     console.log("Iterating Arrays " + JSON.stringify(lines));

//     console.log("-----------------------------------");
//     console.log("Iterating # 28");
//     let a = lines['28'];
//     for(let j=0; j< a.length ; j++)
//     {
//         console.log(j + " = " + a[j]);
//     }

//     console.log("-----------------------------------");
//     console.log("Iterating # 29");
//      a = lines['29'];
//     for(let j=0; j< a.length ; j++)
//     {
//         console.log(j + " = " + a[j]);
//     }

//     console.log("-----------------------------------");
//     console.log("Iterating # 30");
//      a = lines['30'];
//     for(let j=0; j< a.length ; j++)
//     {
//         console.log(j + " = " + a[j]);
//     }