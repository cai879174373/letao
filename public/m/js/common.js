// 封装一个公共的js文档

goback();
// 使用历史记录的返回上一页函数-->
function goback(){
    $('#header .left ').on('tap', function () {
        //  history.back() 可以返回上一页
        history.back();
    });
}

 



  // 获取url的函数
  function getQureyUrl(name) {
    // 获取当前页面的url
    var pagepath = location.search.substr(1).split('&');
    // console.log(pagepath);
    // 遍历数组  去除search的值
    for (var i = 0; i < pagepath.length; i++) {
        if (pagepath[i].split('=')[0] == name) {
            return decodeURI(pagepath[i].split('=')[1]);
        }
    }
    return '';
    
}





