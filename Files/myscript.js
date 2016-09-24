  $(function() {
    
    var r1, r2, hideD$,
        d$ = $("#change"),
	pt = $("#point"),
        d1 = $(".dice1"),
        d2 = $(".dice2"),
        button = $("button"),
        sel = $("select"),
	bank = 500,
        type = "",
        bet = 0,
        point = 0,
        done = true,
        prevBank = 500,
        
        roll = function(){       
          var j = 0,       
          i = setInterval(function(){ 
            
            r1 = Math.ceil(Math.random()*6);  
            r2 = Math.ceil(Math.random()*6); 
            r3 = ~~(Math.Random * 256);
            
            button.css("color", "rgb(" + ~~(r1/6*255) + "," + ~~(r2/6*255) + "," +r3 + ")");  
            
            //button.css("background-color", "rgb(" + r3 + "," + ~~(r1/6*255) + "," + ~~(r2/6*255) + ")");
            showNum(r1, r2);    
            
            // after 1.5 seconds of rolling
            if(++j === 15){       
              clearInterval(i);     
              onResult(r1 + r2);
            }          
          },100);     
        },
        
        onResult = function(r){    
          
          // so you can't click while it's still rolling
          done = true;
					//
          button.css("color","rgb(0,0,0)"); 
          button.css("background-color", "");
          
          if(point === 0){     
            if(r === 2 || r === 3 || r === 12){              
              bank += type === "pass" ? -bet : r === 2 || r === 3 ? bet : 0;  
              resetBet();
            }else if(r === 7 || r === 11){             
              bank += type === "pass" ? bet : -bet; 
              resetBet();
            }else{           
              point = r;
              pt.html("Point: " + point);                  
            }  
          }else{           
            if(r === point){             
              bank += type === "pass" ? bet : -bet;                  
              pt.html("");        
              point = 0;
              resetBet();
         
            }else if(r === 7){         
              bank += type === "pass" ? -bet : bet;           
              pt.html("");              
              point = 0;   
              resetBet();
            }    
          }
 
          // set the text that shows winnings/ losses
          if(bank !== prevBank){
            if(bank > prevBank){
              d$.css("color", "green");           
              d$.html("+ $ " + (bank - prevBank));              
            }else if(bank < prevBank){
              d$.css("color", "red");             
              d$.html("- $ " + (prevBank - bank));  
            }     
   
            // show and then hide winnings / loss text
            d$.show();
            
            hideD$ = setInterval(function(){
                d$.hide();
                clearInterval(hideD$);   
              }, 2700); 
          }     
          prevBank = bank;   
          
          //update the bank
          $("#money").html("$ " + bank); 

          //update max bet 
          $("#slider" ).slider({max: bank}); 
         
          if(bank === 0) 
            $("#money").css("color", "red");      
        },
        
        resetBet = function(){    
          bet = 0; 
          sel.val("null");               
          $("#slider").slider({value : 0});              
          $("#amount").html("$ 0");
        },
        
        // show random die face
        showNum = function(n1, n2){
          for(var i in d1){
            d1[i].hidden = true;
            d2[i].hidden = true;
          }
          d1[n1-1].hidden = false;
          d2[n2-1].hidden = false;
        },
        
        init = function(){
          showNum(Math.ceil(Math.random()*6), Math.ceil(Math.random()*6));
          pt.html("");
          d$.hide();
        };
    
    init();
      
    button.click(function(e){  
      if(sel.val() !== "null"){
        if(bet !== 0){
          if(bank > 0 && done) 
            roll();
          done = false;
        }else{
          alert("Please choose an amount!");
        }
      }else if (point === 0){
        alert("Please choose a bet type!");
      }  
    });
    
    sel.change(function(e){
      if (point === 0){
        type = e.target.value;
      }else{
        sel.val(type);
        alert("Bet locked in!");
      }
    });
    
    $("#slider").slider({
      min: 0,
      max: 500,   
      value:0,
      slide: function( e, ui ) { 
        if(point === 0){
          $("#amount").html("$ " + ui.value);
          bet = ui.value;
        }else{    
          alert("Bet locked in!");
        }
      }
    });
    
  });