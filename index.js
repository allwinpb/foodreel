var fs = require('fs');
var koa = require('koa');
var app = koa();
var serve = require('koa-static');
var _ = require('lodash');
var router = require('koa-router')();

function packageFood(foods){
  return foods.map(function(food){
    food = food.split('\t')
    return {
      mealPhoto: '/assets/images/' + food[5],
      restaurant: food[1],
      restaurantLogo: '/assets/images/' + food[0],
      meal: food[2],
      redeemCode: Math.random().toString(16).slice(2).toUpperCase(),
      description: food[2] + ' is Food. Food is energy. Q.E.D ' +  food[2] + ' is energy.',
      cost: parseFloat(food[3]),
      calories: parseInt(food[4])
    }
  })
}

function readPreferences(){
  var prefs = fs.readFileSync('employer-preferences.txt').toString().split('\t')
  return {
    mealplan: parseInt(prefs[0]),
    healthRating: parseFloat(prefs[1]),
    maxBudget: parseFloat(prefs[2])
  }
}

function writePreferences(prefs){
  fs.writeFileSync('employer-preferences.txt',[prefs.mealplan, prefs.healthRating, prefs.maxBudget].join('\t'));
}

var foods = packageFood(
  fs.readFileSync('food-items.txt').toString().split('\n')
)

router
.get('/list-food-items', function *(next){
  this.body = JSON.stringify(foods)
})
.get('/get-employer-preferences', function *(next){
  this.body = JSON.stringify(readPreferences())
})
.get('/update-employer-preferences', function *(next){
  var prefs = readPreferences()
  prefs = _.merge(prefs, this.request.query)
  writePreferences(prefs)
  this.body = JSON.stringify(readPreferences())
})
.get('/get-meal-choices', function *(next){
  var filters = this.request.query
  var validFoods = foods.filter(function(food){
    var validBudget = true
    if(filters.maxBudget && food.cost > parseFloat(filters.maxBudget)){
      validBudget = false
    }
    return validBudget
  })
  this.body = JSON.stringify(validFoods)
})
// x-response-time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve('static'))
app.listen(3000);