var mongoose=require('mongoose');
var patientSchema=require('../schemas/patient');//引入数据表
module.exports=mongoose.model('Patient',patientSchema);//创建表模型