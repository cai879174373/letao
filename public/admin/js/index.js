
var totalpage=0;
var page=1;
$(function(){
    // 执行查询函数
    queryUser();
    updateUser();

// 封装一个查询函数
    function queryUser(){
        $.ajax({
            url:'/user/queryUser',
            data:{page:page,pageSize:5},
            success:function(data){
                // console.log(data);
                // 调用模板
                var html=template('ueryUserUrl',data);
                //添加到页面上
                $('#main .content tbody').html(html);
                totalpage=Math.ceil(data.total/data.size);
                // console.log(totalpage);
                // 执行分页函数
                initPage();

            }
        })
    }

    // 封装一个修改按钮的函数
    function updateUser(){
        //给禁止按钮注册一个点击事件 动态添加需要委托
        $('#main .content tbody').on('click','.btn-using',function(){
            // 获取当前按钮的isdelete值
            var isDelete=$(this).data('isdelete');
            // console.log(isDelete);
            if(isDelete==1){
                isDelete=0;
            }else{
                isDelete=1;
            }
            // console.log(isDelete);
        // 重新设置给页面上
            $(this).data('isdelete',isDelete);
            var id=$(this).data('id');
            // 发送ajax请求
            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{id:id,isDelete:isDelete},
                success:function(data){
                    // console.log(data);
                    if(data.success){
                        // 重新调用查询
                        queryUser();
                    }
                }
            })

        })

    }

    // 封装一个分页函数
    function initPage(){
        var pages=[];
         for(var i=1;i<=totalpage;i++){
            pages.push(i);
         }
        //  调用模板
        var html=template('pagingTpl',{pages:pages,page:page});
        $('.pagination').html(html);

        // 点击跳转  给下面的li委托注册事件
        $('.pagination li').on('click',function(){
            // 获取当前点击的li
            page=$(this).data('page');
            console.log(page);
            // 执行调用查询
            queryUser();
        })
    }
});