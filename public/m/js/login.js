

$(function(){

    // 执行登陆函数

    login();
    // 封装一个登陆函数
    function login(){
        $('.btn-login').on('tap',function(){
            // 获取输入的用户名
            var username=$('.username').val().trim();
            if(username==''){
                // 运用mui消息提示查件
                mui.toast('请输入用户名!',{ duration:'long', type:'div' });
                return false;
            }
            var password=$('.password').val().trim();
            if(password==''){
                // 运用mui消息提示查件
                mui.toast('请输入密码!',{ duration:'long', type:'div' });
                return false;
            }
            // 发送ajax获取返回数据
            $.ajax({
                url:'/user/login',
                type:'post',
                data:{username:username,password:password},
                success:function(data){
                    console.log(data);
                    if(data.error){
                        // 进到这里表示失败
                        mui.toast(data.message,{ duration:'long', type:'div' }) 
                    }else{
                        // 进到这里表示成功
                        // 跳转到商品详情页面
                        location=getQureyUrl('returnUrl');
                       


                    }
                }
            })
        });
    }

    $('#main .register').on('tap',function(){
        location="register.html"
    })

      // 获取url的函数
      function getQureyUrl(name) {
        // 获取当前页面的url
        var pagepath = location.search.substr(1).split('&');
        // console.log(pagepath);
        // 遍历数组  去除search的值
        for (var i = 0; i < pagepath.length; i++) {
            if (pagepath[i].split('=')[0] == name) {
                return decodeURI(pagepath[i].substr(pagepath[i].indexOf('=')+1));
            }
           
        }
        return null;
    }
    console.log( getQureyUrl('returnUrl'));
})