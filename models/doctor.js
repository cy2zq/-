var mongoose=require('mongoose');
var doctorSchema=require('../schemas/doctor');//引入数据表
module.exports=mongoose.model('Doctor',doctorSchema);//创建表模型