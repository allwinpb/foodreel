var height2b1a = parseFloat(d3.select("#cost").style("width"))*0.37;
var width2b1a = height2b1a*2.5


var chartCost = c3.generate({
    bindto: '#cost',
    padding: {
        top: 0,
        bottom: 25,
    },
    size: {
        height: height2b1a,
        width: width2b1a
    },
    data: {
        x : 'keys',
        url: 'csv/cost_total.csv',
        type: 'bar',
        labels: false,
    },
    color: {pattern:['#00cc99']},
    // grid: {
    //     y: {
    //         lines: [{value:0}]
    //     }
    // },

    axis: {
        // rotated: true,
        x: {
            type: 'categorized',
            tick: {
                rotate: 45,
                multiline: false,
                width: 230
            },
            
        },
        // y: {
        //  show: false,
  //   }
        
    },


    onresize: function(){
        var height1a  = parseFloat(d3.select("#cost").style("width"))*0.64;
        var width1a = height1a*1.5
        chartCost.resize({
          height: height1a,
          width: width1a
        });
    }
});


function changeGraph1(d) {
    var chartSelection = d.getAttribute('option');
   
    setTimeout(function () {
        chartCost.unload()
    }, 200);
    setTimeout(function () {
        chartCost.load({
             x : 'keys',
             url: 'csv/' + chartSelection,
        });
    }, 500);    
    var property = d.getAttribute('property');
    document.getElementById("title").innerHTML = property 
}


