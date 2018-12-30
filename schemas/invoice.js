var mongoose=require('mongoose');
//病人费用的表结构
module.exports=new mongoose.Schema({
   itemName:String,//项目名称
    desc:String,//描述
    price:Number,
    count:Number
});