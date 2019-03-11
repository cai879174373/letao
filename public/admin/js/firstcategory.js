
var totalpage=0;
var page=1;
$(function(){
    // 执行查询函数
    queryUser();

    addTopcategory();
   

// 封装一个查询函数
    function queryUser(){
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            data:{page:page,pageSize:5},
            success:function(data){
                console.log(data);
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

  

    // 封装一个分页函数
    function initPage(){
        $(function () {
            // var currentPage = 1;
            // var totalPages = 25;
            $(".pagination").bootstrapPaginator({
                bootstrapMajorVersion:3, //对应的bootstrap版本
                currentPage: page, //当前页数
                numberOfPages: 3, //每次显示页数
                totalPages:totalpage, //总页数
                shouldShowPage:true,//是否显示该按钮
                useBootstrapTooltip:true,
                //点击事件
                onPageClicked: function (event, originalEvent, type, nowpage) {
                    page=nowpage;
                    queryUser();
 
                }
            });
 
         });
 
    }

    // 封装一个添加分类的函数
    function addTopcategory(){
        $('.btn-save').on('click', function () {
            // 2. 获取输入框输入分类名称
            var categoryName = $('.btn-category').val().trim();
            if (categoryName == '' || categoryName.length > 3) {
                alert('分类名称不合法不能为空且不能大于3位');
                return false;
            }
            // 3. 调用添加分类的API接口传入当前的分类名称
            $.ajax({
                url: '/category/addTopCategory',
                type: 'post',
                data: {
                    categoryName: categoryName
                },
                success: function (data) {
                    //   4. 判断如果添加成功就调用查询刷新页面
                    if (data.success) {
                        queryUser();
                    }
                }
            });
            // 6. 清空输入框
            $('.btn-category').val('');
        });
    }
});