$(function(){

setInterval(function(){
var today = new Date();
var date = String(today.getFullYear())+'-'+String((today.getMonth()+1)).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
var time = String(today.getHours()).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0') + ":" + String(today.getSeconds()).padStart(2,'0');
$("#time").html(time);
$("#date").html(date);
},1000);


});
