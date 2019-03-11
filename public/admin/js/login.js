
$(function(){

    // 执行登陆函数

    login();
    // 封装一个登陆函数
    function login(){
        $('.btn-login').on('click',function(){
            // 获取输入的用户名
            var username=$('#username').val().trim();
            if(username==''){
                alert('请输入用户名!')
                return false;
            }
            var password=$('#password').val().trim();
            if(password==''){
                // 运用mui消息提示查件
               alert('请输入密码!')
                return false;
            }
            // 发送ajax获取返回数据
            $.ajax({
                url:'/employee/employeeLogin',
                type:'post',
                data:{username:username,password:password},
                success:function(data){
                    console.log(data);
                    if(data.error){
                        // 进到这里表示失败
                        alert(data.message)
                    }else{
                        // 进到这里表示成功
                        // 跳转到商品详情页面
                        location="index.html";
                       


                    }
                }
            })
        });
    }
});