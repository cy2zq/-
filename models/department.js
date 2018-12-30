var mongoose=require('mongoose');
var departmentSchema=require('../schemas/department');//引入数据表
module.exports=mongoose.model('Department',departmentSchema);//创建表模型