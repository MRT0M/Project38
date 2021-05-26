class Food {
    constructor(){
        this.image=loadImage('images/Milk.png');
        var foodStock;
    }

    getFoodStock(){
        var foodStockRef=database.ref('Food');
        foodStockRef.on("value",function(data){
            foodStock=data.val();
        });
        this.foodStock=foodStock
    }

    updateFoodStock(foodS){
        database.ref('/').update({
            Food: foodS
        })
    }
    
    bedroom(){
        background(bedroom,550,500)
    }

    washroom(){
        background(garden,550,500)
    }

    garden(){
        background(washroom,550,500)
    }

    display(){
        var x=80,y=125;
        
        imageMode(CENTER);
        //image(this.image,620,220,70,70)

        if(this.foodStock!==0){
            for(var i = 0; i < this.foodStock; i++){
                if(i%10===0){
                    x=80;
                    y=y+50;
                }
                image(this.image,x,y,50,50);
                x=x+30;
            }
        }
    }
}