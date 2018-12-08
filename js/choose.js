var item = {					        //选树信息
    chooseOrderNo: '',      //选树订单号
    chooseData: {		    //第三位返回的选树信息
        chooseId: '',	    //选树id
        info: '',		    //选树位置信息
        state: 0 		    //选树状态：0未选择 1被选中 2已选择
    }
};
/**
 *
 *     {					        //选树信息
 *      chooseOrderNo: '',      //选树订单号
 *      chooseData: {		    //第三位返回的选树信息
 *          chooseId: '',	    //选树id
 *          info: '',		    //选树位置信息
 *          state: 0 		    //选树状态：0未选择 1被选中 2已选择
 *      }
 *
 */
var chooseOrder = [];

var chooseArr = [];

//树的类别
var treeTypeArr = [
    {
        typeId: '1',
        name: '杨树',
        imgUrl: './img/images/yezi_03.png',
        money: 1000
    },
    {
        typeId: '2',
        name: '梧桐树',
        imgUrl: './img/images/yezi_03.png',
        money: 5000
    },
];

var pTitle = '学森路';
var pId = 1;
var rowNum = 6;
var columnNum = 5;
var chooseNum = 2;
var totalMoney = 0;

var curTree = {};

var tRow = [];
var tColumn = [];

var STATE_0 = '';
//可选
var STATE_1 = './img/images/yezi_03.png';
//不可选
var STATE_2 = './img/images/yezi_05.png';
//已选
var STATE_3 = './img/images/yezi_07.png';
//暂不开放
var STATE_4 = './img/images/yezi_09.png';


/**
 * treeId : 树的id
 * pId : 父级id
 * state : 状态 0可选 1不可选 2已选  3暂不开放
 * imgUrl : 图片
 *
 */
var tree = {
    _rIndex: 0,
    _cIndex: 0,
    treeId: 0,
    pId: pId,
    state: 0,
    imgUrl: './img/images/yezi_03.png'
};

init();
markTree(0, 3, 2,
    {
        treeId: '123456789',
        userName: '姓名:小明<br>班级：123'
    });
markTree(0, 1, 0);
markTree(0, 8, 4);
markTree(0, 9, 4);
markTree(0, 10, 4);

$('#mapMainArea ul li').on('click', function () {
    var state = $(this).data('state');
    var userName = $(this).data('userName');
    if (state === 2 && userName) {
        layer.tips(userName, '#' + this.id);
    }
    if (state === 1) {
        chooseFunc(this);
    }
    if (state === 4) {
        layer.tips('暂不开放', '#' + this.id);
    }
});

//页面初始化
function init() {
    renderTreeType();
    for (var r = 0; r < rowNum; r++) {
        tRow.push({
            rowTitle: '北侧'
        })
    }
    tRow[1].rowTitle = '南侧';

    for (var c = 0; c < chooseNum; c++) {
        tColumn.push({
            columnTitle: ''
        })
    }

    renderRow();
}

//渲染行
function renderRow() {
    $('#mapMainArea').html('');
    for (var r = 0; r < rowNum; r++) {
        var rowTpl = $('#rowTpl').clone()
            .attr('id', 'row_' + r)
            .show()
            .appendTo($('#mapMainArea'));
        //行标题
        var $row_h1 = $(rowTpl).find('h1');
        $($row_h1).text(tRow[r].rowTitle);

        renderColumn(r);

        $('#row_' + r)
            .find('.chtreelul')
            .addClass('treeRow');

        //渲染中间的路
        if ((r) % 2 === 0) {
            var _width = $('#mapMainArea')[0].scrollWidth;

            console.log(_width);
            var rowTitleTpl = $('#rowTitleTpl').clone();
            rowTitleTpl
                .css('width', _width)
                .show().appendTo($('#mapMainArea'));
        }
    }

}

//渲染列
function renderColumn(r) {
    for (var c = 0; c < columnNum; c++) {
        var treeTpl = getTreeTpl()
            .attr('id', pId + '_' + r + '_' + c)
            .data('row', r)
            .data('column', c)
            .data('pid', pId)
            .data('state', 1)
            .show();

        var num = c + 1 < 10 ? '0' + (c + 1) : c + 1;
        $(treeTpl).find('p').text(num);

        $('#row_' + r)
            .find('.chtreelul')
            .append(treeTpl);
    }
}

/**
 *
 * @param r 行
 * @param c 列
 * @param state 状态
 * @param treeId
 */
function markTree(r, c, state, treeInfo) {
    var treeRowSrr = $('.treeRow');
    var $li = $(treeRowSrr[r]).find('li')[c];
    var img = $($li).find('img');
    if (treeInfo && treeInfo.treeId) {
        $($li).data('treeId', treeInfo.treeId);
    }
    $($li).data('state', state);
    if (treeInfo && treeInfo.userName) {
        $($li).data('userName', treeInfo.userName);
    }

    if (state === 0) {
        img.attr('src', STATE_0);
        $($li).html('');
    } else if (state === 1) {
        img.attr('src', STATE_1);
    } else if (state === 2) {
        img.attr('src', STATE_2);
    } else if (state === 3) {
        img.attr('src', STATE_3);
    } else if (state === 4) {
        img.attr('src', STATE_4);
    }
}

function getTreeTpl() {
    return $('#treeTpl').clone().attr('id', '').css('display', 'inline-block');
}

function unChooseFunc(_this) {
    var chooseId = _this.id;
    resetChooseInfo(chooseId);
}

//清空已选
function resetAllChoose() {
    for (var n = 0; n < chooseArr.length; n++) {
        var item = chooseArr[n];

        $('#info_' + item._id).remove();
        $('#' + item._id).find('img').attr('src', STATE_1);
    }
    totalMoney = 0;
    chooseArr = [];
    $('#mapMainArea ul li').off('click').on('click', function () {
        chooseFunc(this);
    });
    renderTotalMoney();

}

//清空
function resetChooseInfo(chooseId) {
    if (chooseId) {
        for (var n = 0; n < chooseArr.length; n++) {
            var tree = chooseArr[n];
            if (tree._id === chooseId) {
                totalMoney -= tree.money;

                $('#info_' + tree._id).remove();
                $('#' + tree._id)
                    .find('img')
                    .attr('src', STATE_1);
                chooseArr.splice(n, 1);
                break;
            }
        }
        $('#' + chooseId).off('click').on('click', function () {
            chooseFunc(this);
        });
    }

    renderTotalMoney();
}

function chooseFunc(_this) {
    if (!curTree.typeId) {
        layer.msg('请先选择树种');
        return;
    }
    var _row = $(_this).data("row");
    var _column = $(_this).data("column");
    var rowTitle = tRow[_row].rowTitle;
    var chooseInfo = pTitle + "-" + rowTitle + "-" + (_column + 1);
    var money = curTree.money;
    totalMoney += money;

    var tree = {
        _id: pId + '_' + _row + '_' + _column,
        _rIndex: _row,
        _cIndex: _column,
        pId: pId,
        state: 3,
        info: chooseInfo,
        money: money,
        treeTypeId: curTree.typeId
    };

    if (chooseArr.length < chooseNum) {
        chooseArr.push(tree);
        console.log(tree);
        renderChooseInfo(tree);
        renderTotalMoney();

        $(_this).off('click').on('click', function () {
            unChooseFunc(_this);
        });
    } else {
        myAlert('只能选' + chooseNum + '颗树');
    }

}

function renderTotalMoney() {
    $('#totalMoney').text(totalMoney);
    $('#totalNum').text(chooseArr.length);
}

function renderChooseInfo(tree) {
    $('#' + tree._id).find('img').attr('src', STATE_3);

    var chooseInfoTpl = $('#chooseInfoTpl').clone().attr('id', 'info_' + tree._id).css('display', 'inline-block');
    $(chooseInfoTpl).find('span').text(tree.info);
    $(chooseInfoTpl).find('.overview_sougb').off('click').on('click', function () {
        resetChooseInfo(tree._id)
    });

    $('#chooseInfoDiv').append(chooseInfoTpl)
}

//生成订单
function makeOrder() {
    chooseOrder = [];
    if (chooseArr) {
        chooseArr.forEach(function (item, i) {
            var order = {					        //选树信息
                money: item.money,
                treeType: item.treeTypeId,
                chooseOrderNo: '',      //选树订单号
                chooseData: {		    //第三位返回的选树信息
                    chooseId: item._id,	    //选树id
                    info: item.info,
                    state: 1 		    //选树状态：0未选择 1被选中 2已选择
                }
            };
            chooseOrder.push(order);
        })
    }
    console.log(chooseOrder);
}

$('.treeType').on('click', function () {
    $('.treeType').removeClass('money');
    $(this).addClass('money');
});

function renderTreeType() {
    treeTypeArr.forEach(function (item, i) {
        var treeItem = '<span class="treeType">' + item.name + '</span>';
        $(treeItem)
            .bind('click', function () {
                chooseTreeType(item);
            })
            .appendTo($('#treeTypeSel'))
    });
}

function chooseTreeType(treeType) {
    curTree = treeType;
    console.log(curTree);
}

function myAlert(msg) {
    layer.config({
        extend: 'red/layer.css',
        skin: 'layui-layer-red' //样式类名
    });
    layer.alert(msg);
}