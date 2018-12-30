var mongoose=require('mongoose');
var employeeSchema=require('../schemas/employee');//引入数据表
module.exports=mongoose.model('Employee',employeeSchema);//创建表模型