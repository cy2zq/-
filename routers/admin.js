var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Employee = require('../models/employee');
var Department = require('../models/department');
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');
var Invoice = require('../models/invoice');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('你不是管理员');
        return;
    }
    next();
});

/***********************************索引界面***********************************************/
//部门:http://localhost:8082/admin/---index
router.get('/', function (req, res, next) {
    //limit(number)限制数据条数；skip(2)忽视2条
    var page = Number(req.query.page || 1);
    var limit = 4;
    Employee.count().then(function (count) {
        pages = Number(Math.ceil(count / limit));//计算总页数
        page = Number(Math.min(page, pages));//取值不能超过pages
        page = Number(Math.max(page, 1));//取值不能小于1
        var skip = (page - 1) * limit;
        Employee.find().limit(limit).skip(skip).populate('department').then(function (employee) {
            res.render('admin/index', {
                userInfo: req.userInfo,
                employee: employee,
                limit: limit,
                count: count,
                page: page
            });
        });
    });
});
//医生站主页面(chart):http://localhost:8082/admin/doctor---start
router.get('/doctor', function (req, res, next) {
    res.render('doctor/start', {
        userInfo: req.userInfo
    });
});
/***********************************索引界面***********************************************/

router.get('/doctor/profile', function (req, res, next) {
    console.log('进入医生简介')
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        res.render('doctor/doctor_profile', {
            userInfo: req.userInfo,
            doctor: doctor
        });
    })

});
router.get('/patient/profile', function (req, res, next) {
    console.log('进入病人简介');
    Patient.find().sort({_id: -1}).then(function (patient) {
        res.render('doctor/patient_profile', {
            userInfo: req.userInfo,
            patient: patient
        });
    })

});
router.get('/patient/invoice', function (req, res, next) {
    console.log('进入病人费用清单');
    Invoice.find().sort({_id: -1}).then(function (invoice) {
        res.render('doctor/patient_invoice', {
            userInfo: req.userInfo,
            invoice: invoice
        });
    })
});
// new Invoice({
//     itemName:'大换药',
//     desc:'瞧一瞧，看一看，治不好，不要钱',
//     price:998,
//     count:4
// }).save().then(5unction () {
//
// })
// 添加医生的保存
router.get('/doctor/schedule', function (req, res, next) {
    console.log('进入医生进程安排');
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        res.render('doctor/doctor_schedule', {
            userInfo: req.userInfo,
            doctor: doctor
        });
    })

});
router.get('/doctor/appointment', function (req, res, next) {
    console.log('进入医生预约');
    res.render('doctor/doctor_appointment', {
        userInfo: req.userInfo

    });
});
/***************************医生(doctor)的增删改查 START*********************************************/
//医生的查询
router.get('/doctors', function (req, res, next) {
    console.log('进入医生列表');
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        res.render('doctor/doctors', {
            userInfo: req.userInfo,
            doctor: doctor
        });
    })
});
//医生的增加(get)和增加后的保存(post)
router.get('/doctor/add', function (req, res, next) {
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        res.render('doctor/doctor_add', {
            userInfo: req.userInfo,
            doctor: doctor
        })
    })
});
router.post('/doctor/add', function (req, res, next) {
    new Doctor({// 保存数据到数据库
        name: req.body.name,
        title: req.body.title,
        birth: req.body.birth,
        phone: req.body.phone,
        sex: req.body.sex,
        email: req.body.email,
    }).save().then(function (fs) {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/doctors'
        });
    })
});
//医生的删除
router.get('/doctor/delete', function (req, res, next) {
    //获取要删除的分类id
    var id = req.query.id || '';
    Doctor.remove({
        _id: id
    }).then(function () {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/doctors'
        });
    })
});
//医生的修改(get)和修改后的保存(post)
router.get('/doctor/edit', function (req, res, next) {
    // console.log('进入医生的修改62');
    // 获取要修改的员工信息,并且以表单形式展示
    var id = req.query.id || '';
    var doctor = [];

    Department.find().sort({_id: -1}).then(function (doctor) {
        doctor = doctor;
        return Doctor.findOne({//获取要修改的分类信息
            _id: id
        }).then(function (doctor) {
            if (!doctor) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('doctor/doctor_edit', {
                    userInfo: req.userInfo,
                    doctor: doctor
                });
            }
        });
    })
});
router.post('/doctor/edit', function (req, res, next) {
// console.log(184+req.body.dept)
    // 获取要修改的分类信息,并且以表单形式展示
    var id = req.query.id || '';
    Doctor.update({
        _id: id
    }, {
        name: req.body.name,
        title: req.body.title,
        birth: req.body.birth,
        phone: req.body.phone,
        sex: req.body.sex,
        email: req.body.email

    }).then(function () {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/doctors'
        });
    })
});
/***************************医生的增删改查 END*********************************************/

/***************************病人(patient)的增删改查 START*********************************************/
router.get('/patients', function (req, res, next) {
    console.log('进入病人列表');
    Patient.find().sort({_id: -1}).populate('doctor').then(function (patient) {
        res.render('doctor/patients', {
            userInfo: req.userInfo,
            patient: patient
        })
    })
});
router.get('/patient/add', function (req, res, next) {
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        // Patient.find().sort({_id:-1}).then(function (patient) {
        res.render('doctor/patient_add', {
            userInfo: req.userInfo,
            doctor: doctor
        })
    })
});
router.post('/patient/add', function (req, res, next) {
    new Patient({
        doctor: req.body.doctor,
        name: req.body.name,
        patient_id: req.body.patient_id,
        age: req.body.age,
        sex: req.body.sex,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        room: req.body.room, //病房号
        nurse: req.body.nurse,//护士
        date: req.body.date//注册日期
    }).save().then(function (fs) {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/patients'
        })
    })
});
router.get('/patient/delete', function (req, res, next) {
    //根据ID删除此条数据
    var id = req.query.id || '';
    Patient.remove({
        _id: id
    }).then(function () {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/patients'
        })
    })
});
router.get('/patient/edit', function (req, res, next) {
    //通过ID获取此条数据
    var id = req.query.id || '';
    var patient = [];
    Doctor.find().sort({_id: -1}).then(function (doctor) {
        patient = patient;
        return Patient.findOne({
            _id: id
        }).then(function (patient) {
            if (!patient) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('doctor/patient_edit', {
                    userInfo: req.userInfo,
                    patient: patient,
                    doctor: doctor
                });
            }
        })
    });
});
router.post('/patient/edit', function (req, res, next) {
    //根据ID更新数据
    var id = req.query.id || '';
    Patient.update({_id: id}, {
        doctor: req.body.doctor,
        name: req.body.name,
        patient_id: req.body.patient_id,
        age: req.body.age,
        sex: req.body.sex,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        room: req.body.room, //病房号
        nurse: req.body.nurse,//护士
        date: req.body.date//注册日期
    }).then(function () {
        res.render('doctor/success', {
            userInfo: req.userInfo,
            message: '修改完成',
            url: '/admin/patients'
        })
    })
});
/***************************病人的增删改查 END*********************************************/

/***************************员工(employee)的增删改查 START*********************************************/
//员工增加
router.get('/employee/add', function (req, res, next) {
    Department.find().sort({_id: -1}).then(function (department) {
        // Employee.find().sort({_id:-1}).then(function (employee) {
        res.render('admin/employee_add', {
            userInfo: req.userInfo,
            department: department
            // employee:employee
            // })
        })
    })
});
router.post('/employee/add', function (req, res, next) {
    new Employee({// 保存数据到数据库
        department: req.body.dept,
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone,
        sex: req.body.sex,//这里的req.body.category5b3b11872551841e70f62d4e只是id
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    }).save().then(function (fs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin'
        });
    })
});
//员工的删除
router.get('/employee/delete', function (req, res, next) {
    //获取要删除的分类id
    var id = req.query.id || '';
    Employee.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/employee'
        });
    })
});
//员工的修改
router.get('/employee/edit', function (req, res, next) {
    // 获取要修改的员工信息,并且以表单形式展示
    var id = req.query.id || '';
    var employee = [];

    Department.find().sort({_id: -1}).then(function (department) {
        employee = employee;
        return Employee.findOne({//获取要修改的分类信息
            _id: id
        }).then(function (employee) {
            if (!employee) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('admin/employee_edit', {
                    userInfo: req.userInfo,
                    employee: employee,
                    department: department
                });
            }
        });
    })


});
router.post('/employee/edit', function (req, res, next) {

    // 获取要修改的分类信息,并且以表单形式展示
    var id = req.query.id || '';
    Employee.update({
        _id: id
    }, {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone,
        sex: req.body.sex,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        department: req.body.dept

    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容修改成功',
            url: '/admin/employee'
        });
    })
});
//员工查询
router.get('/employee', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    Employee.count().then(function (count) {
        pages = Number(Math.ceil(count / limit));//计算总页数
        page = Number(Math.min(page, pages));//取值不能超过pages
        page = Number(Math.max(page, 1));//取值不能小于1
        var skip = (page - 1) * limit;

        Employee.find().sort({_id: -1}).limit(limit).skip(skip).populate('department').then(function (employee) {
            res.render('admin/index', {
                userInfo: req.userInfo,
                employee: employee,
                page: page,
                limit: limit,
                pages: pages,
                count: count
            });
        });
    });
});
/***************************员工(employee)的增删改查 END*********************************************/

/***************************部门(department)的增删改查 START*********************************************/
router.get('/department/add', function (req, res, next) {
    Department.find().sort({_id: -1}).then(function (employee) {
        res.render('admin/department_add', {
            userInfo: req.userInfo,
            employee: employee
        })
    })

});
router.post('/department/add', function (req, res, next) {
    new Department({// 保存数据到数据库
        deptName: req.body.deptName,
        deptDescription: req.body.deptDescription
    }).save().then(function (fs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/department'
        });

    })
});
router.get('/department/delete', function (req, res, next) {
    //获取要删除的分类id
    var id = req.query.id || '';
    Department.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/department'
        });
    })
});
router.get('/department/edit', function (req, res, next) {
    // 获取要修改的员工信息,并且以表单形式展示
    var id = req.query.id || '';
    var department = [];
    Department.find().sort({_id: -1}).then(function (department) {
        department = department;
        return Department.findOne({//获取要修改的分类信息
            _id: id
        }).then(function (department) {
            if (!department) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('admin/department_edit', {
                    userInfo: req.userInfo,
                    department: department
                });
            }
        });
    })


});
router.post('/department/edit', function (req, res, next) {
    // 获取要修改的分类信息,并且以表单形式展示
    var id = req.query.id || '';
    Department.update({
        _id: id
    }, {
        deptName: req.body.deptName,
        deptDescription: req.body.deptDescription

    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容修改成功',
            url: '/admin/department'
        });
    })
});
router.get('/department', function (req, res, next) {
    Department.find().sort({_id: -1}).then(function (department) {
        res.render('admin/department_index', {
            userInfo: req.userInfo,
            department: department
        })
    })

});
/***************************部门(department)的增删改查 END*********************************************/

module.exports = router;