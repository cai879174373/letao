$(function () {
    // 搜索  查询 删除 清空
   
    addSearch();
    querySearch();
    deleteSearch();
    inScroll();
    clearSearch();
    gotoSearch();
    
    // 1.给搜索按钮注册点击事件  
    // 2.和获取搜索框的内容 如果内容为快提示错误信息
    // 3,如果内容不为空添加信息到浏览器里面
    // 4,信息存在数组里面
    // 5,数组需要转化成stringify的json存在浏览  


    // 搜索添加记录函数
    function addSearch() {
        $('.btn-search').on('tap', function () {
            var search = $('.btn-input').val().trim();
            console.log(search);
            if (search == '') {
                mui.toast('请输入合法内容!', {
                    duration: 'long',
                    type: 'div'
                })
                return false;
            }
            // 获取当前浏览器保存的历史信息
            var searchHistory = localStorage.getItem('searchHistory');
            // 获取的值转换成数组
            searchHistory = JSON.parse(searchHistory) || [];

            // !!!!!把搜索内容添加到数组中 重复的内容不能添加  遍历数组

            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].key == search) {
                    searchHistory.splice(i, 1);
                    // 每删除一个就是i--一次
                    i--;
                }
            }
            searchHistory.unshift({
                key: search,
                time: new Date().getTime()
            })
            //  把数组的内容添加到浏览器里面
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            // 调用查询函数  把数据渲染到页面上
            querySearch();
            // 清空输入框内容
            $('.btn-input').val('');


            location="productlist.html?search="+search+"&time="+new Date().getTime();

        })
    };
    // 查询函数
    function querySearch() {
        // 获取当前浏览器保存的历史信息
        var searchHistory = localStorage.getItem('searchHistory');
        // 获取的值转换成数组
        searchHistory = JSON.parse(searchHistory) || [];

        //  调用模板
        var html = template('searchTpl', {
            list: searchHistory
        })
        $('.search-history ul').html(html);
    };
    var isDelete=false;
    // 删除函数
    function deleteSearch() {

        $('.search-history ul').on('tap', '.btn-delete', function () {
            // console.log(2);
            var index = $(this).data('id');
            console.log(index);
            // 获取当前浏览器保存的历史信息
            var searchHistory = localStorage.getItem('searchHistory');
            // 获取的值转换成数组
            searchHistory = JSON.parse(searchHistory);
            //删除数组里面这个
            searchHistory.splice(index, 1);
            //  把数组的内容添加到浏览器里面
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            // 调用查询函数  把数据渲染到页面上
            querySearch();
            isDelete=true;

        })

    }

    //删除全部的函数
    function clearSearch() {
        $('.btn-clear').on('tap', function () {
            //   // 获取当前浏览器保存的历史信息 
            //   var searchHistory = localStorage.getItem('searchHistory');
            //   //设置数组为空
            //   searchHistory = [];
            //    //  把数组的内容添加到浏览器里面
            //    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));


            // 删除localStorage里面的键 searchHistory
            localStorage.removeItem('searchHistory');
            // 调用查询函数  把数据渲染到页面上

            querySearch();
        })

    }

// 封装一个点搜索记录跳转的函数
    function gotoSearch(){
        // 给动态添加的li注册一个委托事件
        $('.search-history .mui-table-view').on('tap','li',function(){
            console.log($(this));
            if(isDelete==false){
                //取出data里面的key的值
            var search=$(this).data('search');
            console.log(search);
            //跳转到商品页面
            location="productlist.html?search="+search+"&time="+new Date().getTime();
            }
            isDelete=false;
            
            
        })
    }

   

    // 区域滚动函数
    function inScroll() {
        mui('.mui-scroll-wrapper').scroll({
            indicators: false,
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }

})