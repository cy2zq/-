
$(function () {
    var $loginBox=$('#loginBox');
    var $registerBox=$('#registerBox');
    var $userInfo=$('#userInfo');

//切换到注册
    $loginBox.find('a').on('click',function () {
        $loginBox.hide();
        $registerBox.show();
    });
//切换到登录
    $registerBox.find('a').on('click',function () {
        $registerBox.hide();
        $loginBox.show();
    });

//注册
$registerBox.find('button').on('click',function () {
    console.log('注册');
    //通过ajax提交请求
    $.ajax({
        type:'post',
        url:'/api/user/register',
        data:{
            username:$registerBox.find('[name="username"]').val(),
            password:$registerBox.find('[name="password"]').val(),
            repassword:$registerBox.find('[name="repassword"]').val()
        },
        dataType:'json',//后端返回的json
        success:function (result) {
            $registerBox.find('.message').html(result.message);//提示信息
            if(result.code===0){//这里也可以写！result.code
                setTimeout(function () {
                    $registerBox.hide();
                    $loginBox.show();
                },1000);
            }

        }
    })
});
// 登录
$loginBox.find('button').on('click',function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            dataType:'json',//后端返回的json
            success:function (result) {
                console.log(result)
                $loginBox.find('.message').html(result.message);//提示信息
                if(result.code==3){
                    window.location.href='/admin/doctor'
                    // window.location.reload();
                    // setTimeout(function () {
                    //     $loginBox.hide();
                    //     $userInfo.show();
                    //     //显示登录用户的信息
                    //     $userInfo.find('.username').html(result.userInfo.username);
                    // },1000);
                }

            }
        })
    });
//退出
$('#logout').on('click',function () {
    $.ajax({
        url:'/api/user/logout',
        success:function (result) {
            if(result.code==0){
                window.location.reload();
            }
        }
    })
}) ;
});