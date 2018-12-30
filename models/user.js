var mongoose=require('mongoose');
var userSchema=require('../schemas/users');//引入数据表

module.exports=mongoose.model('user',userSchema);//创建表模型