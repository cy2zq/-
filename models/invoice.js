var mongoose=require('mongoose');
var invoiceSchema=require('../schemas/invoice');//引入数据表

module.exports=mongoose.model('invoice',invoiceSchema);//创建表模型