var express=require('express');
var router=express.Router();

router.get('/',function (req,res,next) {
    // console.log('5main'+JSON.stringify(req.userInfo));
    res.render('index',{
        userInfo:req.userInfo
    })
});

router.get('/sign',function (req,res,next) {
    // console.log('12main'+JSON.stringify(res.userInfo));
    if(req.userInfo.code===3){
        res.render('start',{
            userInfo:req.userInfo
        })
    }else{
        res.render('main/sign-in',{
            userInfo:req.userInfo
        })
    }
});

module.exports=router;