var tRow = [];
var tColumn = [];
var curTree = {};
var totalMoney = 0;
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

//页面初始化
function init() {
    renderTreeType();
    renderAreaType();

    for (var r = 0; r < rowNum; r++) {
        tRow.push({
            rowTitle: ''
        })
    }

    for (var c = 0; c < chooseNum; c++) {
        tColumn.push({
            columnTitle: ''
        })
    }

    renderRow();

    $('#mapMainArea ul li').on('click', function () {
        var state = $(this).data('state');
        var content = $(this).data('content');
        if (state === 2 && content) {
            layer.open({
                content: content, skin: 'msg', time: 2 //2秒后自动关闭
            });
        }
        if (state === 1) {
            chooseFunc(this);
        }
        if (state === 4) {
            layer.open({
                content: '暂不开放', skin: 'msg', time: 2 //2秒后自动关闭
            });
        }
    });

    $('.treeType').on('click', function () {
        $('.treeType').removeClass('money');
        $(this).addClass('money');
    });

    $('#areaTypeDiv li a').on('click', function () {
        $('#areaTypeDiv li a').removeClass('money');
        $(this).addClass('money');
    });
}

/**
 * 设置行标题
 *
 * @param row 行号
 * @param title 标题
 */
function setRowTitle(row, title) {
    if (row >= tRow.length) {
        return;
    }
    $('#row_' + row).find('h1').text(title);
    tRow[row].rowTitle = title;
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

        if (dispalyType === 1) {
            //渲染中间的路
            $('.treeRow li').css('float', 'initial');
            renderWayTitle(r);
        } else if (dispalyType === 2) {
            $('.chtreelu').css('width', '.5rem');
            $('.chtreelu').css('margin', '.1rem');
            $('.chtreelu').css('float', 'none');
            $('.chtreelu').css('display', 'inline-block');

            $('#mapMainArea').css('height', '5rem')
                .css('white-space', 'nowrap');

            renderColumnWayTitle(r);
        }
    }

}

//渲染中间的路
function renderColumnWayTitle(row) {
    wayArr.forEach(function (item, i) {
        if (item.column === row) {
            var scrollHeight = $('#mapMainArea')[0].scrollHeight;
            var wayTitle = item.name || pTitle;
            var rowTitleTpl = $('#rowTitleTpl').clone()
                .attr('id', 'row_way_' + i)
                .css('float', 'none')
                .css('display', 'inline-block')
                .html('<div style="width:.3rem;margin:0 auto;    position: absolute;    left: 1.7rem;">' + wayTitle + '</div>')
            ;
            rowTitleTpl
                .css('height', scrollHeight)
                .css('width', '1rem')
                .css('white-space', 'initial')
                .show().appendTo($('#mapMainArea'));
        }
    })
}

//渲染中间的路
function renderWayTitle(row) {
    wayArr.forEach(function (item, i) {
        if (item.row === row) {
            var _width = $('#mapMainArea')[0].scrollWidth;
            var wayTitle = item.name || pTitle;
            var rowTitleTpl = $('#rowTitleTpl').clone()
                .attr('id', 'row_way_' + i)
                .html('<div style="letter-spacing:1rem">' + wayTitle + '</div>')
            ;
            rowTitleTpl
                .css('width', _width)
                .show().appendTo($('#mapMainArea'));

        }
    })
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
function markTree(opt) {
    var r = opt.row;
    var c = opt.column;
    var state = opt.state;
    var treeInfo = opt.treeInfo;
    var treeImg = opt.treeImg;

    var treeRowSrr = $('.treeRow');
    var $li = $(treeRowSrr[r]).find('li')[c];
    var img = $($li).find('img');
    if (treeInfo && treeInfo.treeId) {
        $($li).data('treeId', treeInfo.treeId);
    }
    $($li).data('state', state);
    if (treeInfo && treeInfo.content) {
        $($li).data('content', treeInfo.content);
    }

    if (state === 0) {
        img.attr('src', STATE_0);
        $($li).html('');
    } else if (state === 1) {
        img.attr('src', STATE_1);
    } else if (state === 2) {
        var _img = treeImg || STATE_2;
        img.attr('src', _img);
    } else if (state === 3) {
        img.attr('src', STATE_3);
    } else if (state === 4) {
        img.attr('src', STATE_4);
    }
}

function markTrees(trees) {
    for (var i = 0; i < trees.length; i++) {
        var choosedItem = trees[i];
        var row = choosedItem.row;
        var column = choosedItem.column;
        var state = choosedItem.state;
        var treeImg = choosedItem.treeImg;
        var content = choosedItem.content;

        markTree({
            row: row,
            column: column,
            state: state,
            treeImg: treeImg,
            treeInfo: {
                treeId: '123456789',
                content: content
            }
        });
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
        layer.open({
            content: '请先选择树种',skin: 'msg',time: 2 //2秒后自动关闭
        });
        return;
    }
    var _row = $(_this).data('row');
    var _column = $(_this).data('column');
    var rowTitle = tRow[_row].rowTitle;
    var chooseInfo = pTitle + '-' + rowTitle + '-' + _row + '-' + (_column + 1);
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

function renderAreaType() {
    $('#areaTypeDiv').html('');
    areaArr.forEach(function (item, i) {
        // $('#areaTypeDiv').append('<span>' + item.title + '</span>');
        $('#areaTypeDiv').append('<li><a href="#">' + item.title + '</a></li>');
    })
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