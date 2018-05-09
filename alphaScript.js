$(document).ready(function(){
    //Start: Highlight Rows and Columns of Table
    var topRow = $("table tr").get(0);
    var booth = $(".booth").get(0);
    var col = 0;
    var row = 0;
    var prev = 0;
    var curr = 0;
    var currentVelvet = 0;
    var currentVelvetButton = 0;
    var velvetAnswerDisplay = 0;
    var prevVelvet = 0;
    var prevButton = 0;
    var betGuess = -1;
    var amount = -1;
    var nextAnswer = '?';
    var prevAnswer = '?';
    var allVelvet = $(".velvet");
    var score = 0;
    var multiplier = 0;
    var prevMultiplier = 0;
    var ballValue = 0;
    var prevBallValue = 0;
    var $scoreBoardDisplay = $("#scoreboardDisplay");
    var $multiplierDisplay = $("#multiplierDisplay");
    var $comboDisplay = $("#comboDisplay");
    var $stakeDisplay = $(".stake");
    var combo = 1;
    var vowelValue = 0;
    var timer = 3; //seconds
    var bet_list = "";
    var data = "";
    var max_letter = 25;
    var current_letter = "";
    var end_timestamp = 0;
    var current_timestamp = 0;
    var difference = end_timestamp - current_timestamp;
    var radial_position = new Array(9);
    var timeOfInterval = 1600;
    
    $(allVelvet).toggleClass("defaultVelvet");

    //Start: Update Amount
    $(".amount").change(function()
    {
        amount = $(this).get(0).value;
        //$(this).val("$"+amount);
    });	
    //END: Update Amount


    //Start: Highlight Columns of Table
    $(".velvet").hover(function(e){//Hover In
        currentVelvet = $(this);

        //Ignore Boxes Not bet placed
        if($(currentVelvet).hasClass("noBet"))
            return;

        velvetAnswerDisplay = $(currentVelvet).find(".answer");
        currentVelvetButton = $(currentVelvet).find(".bet").get(0);
        //$(currentVelvetButton).css("background", "#aaffaa");
        //$(currentVelvetButton).css("background", "#ffaaaa");

        //var answer = ($(this).children().children(".component").children().val());

        var parentCol = 0;
        var temp = $(this).get(0).id;
        var box = temp.substr(temp.length-2, temp.length);
        parentCol = box%5;
        //alert(parentCol);
        var column = ".col"+parentCol;
        var velvet = $(this);


        //alert(column);
        col = $(topRow).children(column).get(0);
        //alert($(topRow).children(column).get(0).id);
        $(col).css("background-color", "#eee");
        $(col).css("border-radius", "40px 40px 0px 0px");

        var boxx = parseInt(box)
        var rowCol = Math.floor(boxx/5);
        row = ".velvetRowCol"+rowCol;//parentCol;
        $(row).css("background-color", "#eee");
        $(row).css("border-radius", "0px 40px 40px 0px");


        if($(this).hasClass("betLost"))
           return;
        if($(this).hasClass("betWon"))
            return;

        $(this).children().children(".component").css("visibility", "initial");

    }, function(){//Hover out
        currentVelvet = null;
        currentVelvetButton = null;
        $(col).css("background-color", "#fff");
        $(row).css("background-color", "#fff");
        //var answer = ($(this).children().children(".component").children().val());
        $(this).children().children(".component").css("visibility", "hidden");
    });
    //End: Highlight Columns of Table


    //Start: Update Fields Upon Button Click
    var amount = 0;
    var box = 0;
    var answer = 0;
    var formParent = 0;
    var velvetButton = 0;

    $(".velvet").add(".betBox").click(function(event){
        if(this==event.target){
            var $thisButton = $(this).find(".bet");
            $thisButton.click();     }
    });


    $(".bet").click(function(){
        var answer = $(this).get(0).value;

        if(answer=="Bet")
        {
            prevBallValue = ballValue+vowelValue;
            prevMultiplier = multiplier;
            //canCancel = 1;
            $(this).attr("value", "Cancel");

            $(this).toggleClass("cancel");
            $(this).toggleClass("confirm");

            //console.log(nextAnswer);
            box = $(this).parent().parent().parent().get(0).id;
            currVelvet = box;

            if(!$(currentVelvet).hasClass("betLost"))
            {   
                if(!$(currentVelvet).hasClass("betPending"))
                {
                    if($(currentVelvet).hasClass("defaultVelvet"))
                    {
                        $(currentVelvet).toggleClass("defaultVelvet");   
                    }
                    $(currentVelvet).toggleClass("betPending");  

                    $(velvetAnswerDisplay).html(nextAnswer);
                    //$(velvetYellow).get(0).html(answer);
                }
            }
        }
        else // Reset Cancel
        {

            $(this).attr("value", "Bet");
            //$(this).children().children().children(".answer").html("?");
            $(velvetAnswerDisplay).html("?");
            $(this).children().children(".stake").html("$0");

            $(this).toggleClass("cancel");
            $(this).toggleClass("confirm");


            if(!$(currentVelvet).hasClass("betLost"))
            {   
                if($(currentVelvet).hasClass("betPending"))
                {
                    if(!$(currentVelvet).hasClass("defaultVelvet"))
                    {
                        $(currentVelvet).toggleClass("defaultVelvet");   
                    }

                    $(currentVelvet).toggleClass("betPending");  
                    //$(velvetAnswerDisplay).html(answer);
                    //$(velvetYellow).get(0).html(answer);
                }
            }
        }	
    });
    //End: Update Fields Upon button Click


    $.fn.submit = function()
    {
        var $form = $("#submitBet");
        var url = $form.attr('action');
        var boxId = $("#box").val();
        var boxNumber = boxId.substr(boxId.length-2,boxId.length);
        var posting = 
            $.post(url, 
            {box: boxNumber, 
             choice: $("#choice").val(),
             amount: $("#amount").val()});


    };

    $.fn.updateBall = function(data)
    {
        var $ballDisplay = $("#ballDisplay");
        var $prevBallDisplay = $("#prevBallDisplay");

        var $scoreDisplay = $("#scoreDisplay");
        var temp = data.charCodeAt(0);
        var next = String.fromCharCode(temp+1);

        $scoreDisplay.html("$"+score);
        var $scoreDisplay = $("#scoreDisplay"); 
        $().updateBoard();

        //Data not ending
        //console.log(data);
        if(data !="?") 
        {    
            prevAnswer = data;
            if(next=="Z") //Z is end of line
            {
                ballValue = 25;  
                vowelValue = 0;
                multiplier = 1;
                $prevBallDisplay.html(prevAnswer);
                $ballDisplay.html("?");
                $multiplierDisplay.html("x1");
            }
            else{
                $ballDisplay.html(next);
                $prevBallDisplay.html(data);   
            }
        }
        if(data=="")
        { // Timer > 0
            //ballValue = 1;
            //console.log(next+" "+prevAnswer);
            //if(data=="")

            $prevBallDisplay.html("?");
            $ballDisplay.html("A");
        }

    };

    //Main Cycle
    setInterval(function()
    {
        var char = '';
        var randombox = 0;
        var beta = 0;
        //console.log(bet_list);
        if(bet_list.length>=(max_letter*3))
        {
            //Reset Timer
            data = "";
            //$randomChar = chr(64+rand(1,26));
            bet_list = "";
            $().updateBall(data);

            return;
        }
        if(bet_list.length==0)
        {
            randomBox = 12;//rand(0,24);
            data = "A";
            current_letter = 1;
        }
        else
        {
            char = bet_list.charAt(bet_list.length-3);
            //console.log(char);
            //Not used
            randomBox = 12;//(0,24);
            beta = char.charCodeAt(0);
            beta +=1;
            data = String.fromCharCode(beta); 
            current_letter = beta-64;
        }

        var x = 2;
        var y = 2;
        var max = 5;
        var count = 0;
        for(var i=0; i<bet_list.length; i+=3)
        {
            var boxx = bet_list.charAt(i+1);
            var boxy = bet_list.charAt(i+2);
            var box = boxx+""+boxy;

            //console.log(box);

            //echo($radPosition);
            //echo($current_letter);
            if(randomBox==box)
            {   
                if(current_letter<=17)
                {   
                    var r = 2;
                    if(current_letter<=9)
                        r = 1;
                    
                    radial_position[8] = randomBox;
                    if(x-r>=0) //Up
                    {
                        radial_position[0] = ((x-r)*5+y);
                        //echo ($radial_position[0].",");
                    }
                    else
                        radial_position[0] = 0;
                    if(x+r<max) //Down
                    {
                        radial_position[1] = ((x+r)*5+y);
                        //echo ($radial_position[1].",");
                    }   
                    else
                        radial_position[1] = 0;
                    if(y-r>=0) //Left
                    {    
                        radial_position[2] = ((x)*5+(y-r));
                        //echo ($radial_position[2].",");
                    }
                    else
                        radial_position[2] = 0;
                    if(y+r<max) //Right
                    {  
                        radial_position[3] = ((x)*5+(y+r));
                        //echo ($radial_position[3].",");
                    }
                    else
                        radial_position[3] = 0;

                    /////////////////////////////////////////
                    if(x-r>=0 && y-r>=0) //Diagnol Up Left
                    {
                        radial_position[4] = ((x-r)*5+(y-r));
                        //echo ($radial_position[4].",");
                    }    
                    else
                        radial_position[4] = 0;
                    if(x-r>=0 && y+r<max) //Diagnol Up Right
                    {   
                        radial_position[5] = ((x-r)*5+(y+r));
                        //echo ($radial_position[5].",");
                    }
                    else
                        radial_position[5] = 0;
                    if(x+r<max && y-r>=0) //Diagnol Down Left
                    {
                        radial_position[6] = ((x+r)*5+(y-r));
                        //echo ($radial_position[6].",");
                    }
                    else
                        radial_position[6] = 0;
                    if(x+r>=0 && y+r<max) //Diagnol Down Right
                    {
                        radial_position[7] = ((x+r)*5+(y+r));
                        //echo ($radial_position[7].",");
                    }
                    else
                        radial_position[7] = 0;
                    
                    var option = 9;
                    var minOption = 0;
                    if(current_letter<=5)
                    {
                        option = 4;
                        minOption = 4;
                    } 
                    
                    if(current_letter<=13 && r==2)
                    {
                        option = 4;
                        minOption = 4;
                    } 
                    
                    var position = Math.floor(Math.random() * Math.floor(option))+minOption;
                    randomBox = radial_position[position];
                    i=-3;
                    //console.log(randomBox);
                }
                else 
                {  
                    randomBox = Math.floor(Math.random() * Math.floor(25));
                    i=-3;
                }
            }

            count+=1;
            if(count>100000)
            {  //just in case
                //echo("infinite loop");
                break;
            }
         }


        //Display Letter Info
        //data = 

        if(randomBox>=10)
        {
            bet_list+=data+""+randomBox;
        }
        else
        {
            bet_list+=data+""+0+""+randomBox;
        }
        //console.log(bet_list);
        $().updateBall(data);
    }, timeOfInterval);  

    $.fn.updateBoard = function(data)
    {
        //console.log(bet_list);
        data = bet_list;
        //bet_list = 
        //Return String Of All Letters
        var x = 0;
        var y = 0;
        var allVelvet = $(".velvet");

        //Update Ball Values and Multiplier
        ballValue = (data.length/3)+1 + vowelValue;
        multiplier = 26 -ballValue + vowelValue;   
        $multiplierDisplay.html("x"+multiplier);
        $stakeDisplay.html("$"+ballValue);

        //for(var i =0; i<allVelvet.length;i++)
        //{
          //  var currentVelvet = $(allVelvet).get(i);
        //    var currentVelvetButtonValue = $($(currentVelvetButton).get(0)).val();
        //}


        //Reset All Fields
        if(data=="")
        {
           for(var i =0; i<allVelvet.length;i++)
            {
                var currentVelvet = $(allVelvet).get(i);
                var velvetAnswerDisplay = $(currentVelvet).find(".answer");
                var currentVelvetButton = $(currentVelvet).find(".bet");
                var currentVelvetButtonValue = $($(currentVelvetButton).get(0)).val();
                //console.log(currentVelvetButtonValue);
                if(currentVelvetButtonValue == "Cancel")
                    currentVelvetButton.click();

                //Remove 
                $winLoss = $(currentVelvet).find(".betInfo");
                $winLoss.remove();

                if($(currentVelvet).hasClass("noBet"))
                    $(currentVelvet).toggleClass("noBet");

                if($(currentVelvet).hasClass("missBet"))
                    $(currentVelvet).toggleClass("missBet");

                if($(currentVelvet).hasClass("betPending"))
                {   
                    $(currentVelvet).toggleClass("betPending");  
                    //$(currentVelvetButton).click();
                    $(currentVelvet).toggleClass("defaultVelvet");  
                    $(velvetAnswerDisplay).html("?");
                    //
                    //$(velvetYellow).get(0).html(answer);
                }
                if($(currentVelvet).hasClass("betLost"))
                {
                    $(currentVelvet).toggleClass("betLost"); 
                    //$(currentVelvetButton).click();
                    $(currentVelvet).toggleClass("defaultVelvet");    
                    $(velvetAnswerDisplay).html("?");
                    //$(currentVelvetButton).click();
                    //$(velvetYellow).get(0).html(answer);
                }
                if($(currentVelvet).hasClass("betWon"))
                {
                    $(currentVelvet).toggleClass("betWon"); 
                    //$(currentVelvetButton).click();
                    $(currentVelvet).toggleClass("defaultVelvet");  
                    $(velvetAnswerDisplay).html("?");
                    //$(currentVelvetButton).click();
                    //$(velvetYellow).get(0).html(answer);
                }
            }    
        }

        var answer = 0;
        var velvetAnswerDisplay = 0;
        //Check for Win / Loss Conditions
        //Of the Locations Already Called
        for(var i =0; i<data.length;i+=3)
        {
            //console.log("Check data");
            answer=data.substr(i, 1);
            x=data.substr(i+1, 1);
            y=data.substr(i+2, 1);

            //console.log("X:"+x +"  Y:"+y);
            var temp = answer.charCodeAt(0);
            nextAnswer = String.fromCharCode(temp+1);
            //console.log(nextAnswer);

            var currentVelvet = $("#velvet"+x+y).get(0);
            if(currentVelvet==null)
            {     
                console.log("null");
                continue;
            }

            velvetAnswerDisplay = $(currentVelvet).find(".answer");
            var velvetAnswer = $(velvetAnswerDisplay).get(0).innerHTML;

            //Bet Has Already Lost
            if($(currentVelvet).hasClass("betLost"))
                continue;
            //Bet Has Already Won
            if($(currentVelvet).hasClass("betWon"))
                continue;

            //Has No Bet Pending
            //Default Loss
            if(!$(currentVelvet).hasClass("betPending"))
            {
                //console.log("auto lose");
                if($(currentVelvet).hasClass("defaultVelvet"))
                {
                    $(currentVelvet).toggleClass("defaultVelvet"); 
                    $(currentVelvet).toggleClass("betLost"); 
                    $(velvetAnswerDisplay).html(answer);
                }
                if(!$(currentVelvet).hasClass("noBet"))
                    $(currentVelvet).toggleClass("noBet");
            }
            //Has a Bet Pending
            //Check for Win
            if($(currentVelvet).hasClass("betPending"))
            {
                $(currentVelvet).toggleClass("betPending"); 
                if(velvetAnswer == answer) 
                {//Right Place and Letter
                    //Vowel Multiplier Hidden for Version 1. 
                    //if(answer=="I" || answer=="O" || answer=="U")
                    {    
                        //vowelValue += 5;
                    }

                    score += combo*prevMultiplier*(prevBallValue+vowelValue);
                    $(currentVelvet).append("<div class='betInfo'>$+"+combo*prevMultiplier*(prevBallValue+vowelValue)+"</div>");
                    combo++;
                    $scoreBoardDisplay.html("$"+score);
                    $comboDisplay.html("x"+combo);

                    if(!$(currentVelvet).hasClass("betWon"))
                        $(currentVelvet).toggleClass("betWon"); 
                }
                else{ // Right Place Wrong Letter
                    score += combo*(prevBallValue+vowelValue);
                    $(currentVelvet).append("<div class='betInfo'>$+"+combo*prevBallValue+"</div>");
                    combo++;
                    $scoreBoardDisplay.html("$"+score);
                    $comboDisplay.html("x"+combo);

                    if(!$(currentVelvet).hasClass("betWon missBet"))
                        $(currentVelvet).toggleClass("betWon missBet"); 
                }
            }
            //After Checking for Win 
            //Reset All Pending Bets
            $().resetBoard(answer);
        }
    };

    $.fn.resetBoard = function(data)
    {  
        //Reset All Pending Bets
        for(var i=0; i<allVelvet.length;i++)
        {
            var currentVelvet = $(allVelvet).get(i);
            var velvetAnswerDisplay = $(currentVelvet).find(".answer");
            var currentVelvetButton = $(currentVelvet).find(".bet");
            var currentVelvetButtonValue = $($(currentVelvetButton).get(0)).val();
            //console.log(currentVelvetButtonValue);

            var velvetAnswer = $(velvetAnswerDisplay).get(0).innerHTML;

            if($(currentVelvet).hasClass("betPending"))
            {
                $(currentVelvet).toggleClass("betPending"); 
                if(!$(currentVelvet).hasClass("defaultVelvet"))
                    $(currentVelvet).toggleClass("defaultVelvet");   

                // Wrong Place Right Letter
                //if(velvetAnswer == data)
                {
                //    score += combo*prevMultiplier;
                //    combo++;
                //    $scoreBoardDisplay.html("$"+score);
                //    $comboDisplay.html("x"+combo);
                }
                //else
                {
                score -= prevBallValue;
                combo -= 1;
                if(combo<1)
                    combo = 1;
                $scoreBoardDisplay.html("$"+score);
                $comboDisplay.html("x"+combo);
                }
                $(velvetAnswerDisplay).html("?");
                if(currentVelvetButtonValue == "Cancel")
                    currentVelvetButton.click();
            }
        }
    };
});