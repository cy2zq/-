关联表
如病人的医生:需要关联医生表
patient:doctor:{
                type:mongoose.Schema.Types.ObjectId, //类型
                ref:'Doctor'//引用
            }
admin:
    Patient.find().sort({_id:-1}).populate('doctor').then(function (patient) {
}
页面
{{patient.doctor.name}}



