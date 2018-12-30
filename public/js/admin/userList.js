window.onload=function () {
    $.ajax({

        type:'post',
        url:'/api/user/test',
        dataType:'json',//后端返回的json
        success:function (result) {
            data=result.message;
            // console.log(data);
            $('#table').bootstrapTable({
                        data:data,
                        columns:[{checkbox:true},{
                            field: 'isAdmin',
                            title: 'isAdmin'
                        }, {
                            field: '_id',
                            title: 'id'
                        }, {
                            field: 'username',
                            title: 'username'
                        }, {
                            field: 'password',
                            title: 'password'
                        }]

            });
            $('#table').bootstrapTable('hideColumn','_id');
        }
    });
};
