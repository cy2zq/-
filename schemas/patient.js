var mongoose=require('mongoose');
//用户的表结构
module.exports=new mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId, //类型
        ref:'Doctor'//引用
    },
    name:String, //姓名
    patient_id:String,
    age:Number, //年龄
    sex:String, //性别
    phone:String, //电话号码
    email:String, //电子邮件
    address:String, //病人地址
    room:String, //病房号
    nurse:String,//护士
    date:Date//注册日期
});