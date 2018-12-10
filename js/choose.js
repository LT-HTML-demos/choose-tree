var tRow = [];
var tColumn = [];
//总金额
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

/**
 * 页面初始化
 *
 * @param opt.defaultTree 默认树种
 */
function init(opt) {
    var defaultTree = opt ? opt.defaultTree : getTreeById(0);

    renderTreeType();

    renderAreaType();

    for (var r = 0; r < rowNum; r++) {
        tRow.push({
            rowTitle: ''
        })
    }

    for (var c = 0; c < columnNum; c++) {
        tColumn.push({
            columnTitle: ''
        })
    }

    renderRow({
        defaultTree: defaultTree
    });

    $('#mapMainArea ul li').on('click', function () {
        var state = $(this).data('state');
        var content = $(this).data('content');

        if (state === STATE_2 && content) {
            layer.tips(content, '#' + this.id);
        }
        if (state === STATE_1) {
            chooseFunc(this);
        }
        if (state === STATE_4) {
            layer.tips('暂不开放', '#' + this.id);
        }
    });

    $('#areaTypeDiv span').on('click', function () {
        $('#areaTypeDiv span').removeClass('money');
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
function renderRow(opt) {
    var defaultTree = opt ? opt.defaultTree : getTreeById(0);

    $('#mapMainArea').html('');
    for (var r = 0; r < rowNum; r++) {
        var rowTpl = $('#rowTpl').clone()
            .attr('id', 'row_' + r)
            .show()
            .appendTo($('#mapMainArea'));
        //行标题
        var $row_h1 = $(rowTpl).find('h1');
        $($row_h1).text(tRow[r].rowTitle);
        if (dispalyType === 1) {
            $(rowTpl).find('ul').css('padding-left', '70px');
        }
        renderColumn(r, {defaultTree: defaultTree});

        $('#row_' + r)
            .find('.chtreelul')
            .addClass('treeRow');

        if (dispalyType === 1) {
            //渲染中间的路
            $('.treeRow li').css('float', 'initial');
            renderWayTitle(r);
        } else if (dispalyType === 2) {
            $('.chtreelu').css('width', '4rem')
                .css('display', 'inline-block')
                .css('float', 'none')
                .css('height', 'auto');
            $('#mapMainArea').css('height', '800px');
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
                .css('display', 'inline-block')
                .css('float', 'none')
                .html('<div style="width:60px;margin:0 auto;position: absolute;    left: 50px;    white-space: initial;">' + wayTitle + '</div>')
            ;
            rowTitleTpl
                .css('height', scrollHeight)
                .css('width', '10rem')
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
                .html('<div style="letter-spacing:200px">' + wayTitle + '</div>')
            ;
            rowTitleTpl
                .css('width', _width)
                .show().appendTo($('#mapMainArea'));

        }
    })
}

//渲染列
function renderColumn(r, opt) {
    var defaultTree = opt ? opt.defaultTree : getTreeById(0);

    var _treeImg = defaultTree.getImgByState(STATE_1);

    for (var c = 0; c < columnNum; c++) {
        var treeTpl = getTreeTpl()
            .attr('id', pId + '_' + r + '_' + c)
            .data('row', r)
            .data('column', c)
            .data('pid', pId)
            .data('state', STATE_1)
            .data('treeTypeId', defaultTree._id)
            .show();

        $(treeTpl).find('img').attr('src', _treeImg);
        var num = c + 1 < 10 ? '0' + (c + 1) : c + 1;
        $(treeTpl).find('p').text(num);

        $('#row_' + r)
            .find('.chtreelul')
            .append(treeTpl);
    }
}

/**
 *
 * @param opt.row 行
 * @param opt.column 列
 * @param opt.state 状态
 * @param opt.treeInfo 信息
 * @param opt.treeType 树的种类
 * @param opt.money 自定义金额
 */
function markTree(opt) {
    var r = opt.row;
    var c = opt.column;
    var state = opt.state;
    var treeInfo = opt.treeInfo;
    var treeType = opt.treeType;
    var money = opt.money;

    var treeTypeId = '';
    var imgUrl = '';
    if (treeType) {
        treeTypeId = treeType._id;
        imgUrl = treeType.getImgByState(state);
    }

    var treeRowSrr = $('.treeRow');
    var $li = $(treeRowSrr[r]).find('li')[c];
    var $img = $($li).find('img');
    if (state === 0) {
        $($li).html('').css('cursor', 'initial');
    }

    $($li).data('treeTypeId', treeTypeId);
    $($li).data('money', money);
    $($li).data('state', state);
    $($li).data('content', treeInfo.content);

    $img.css('min-height', '32px')
    $img.attr('src', imgUrl);

}

/**
 *
 * @param trees 树列表
 */
function markTrees(trees) {
    for (var i = 0; i < trees.length; i++) {
        var choosedItem = trees[i];
        var row = choosedItem.row;
        var column = choosedItem.column;
        var state = choosedItem.state;
        var treeType = choosedItem.treeType;
        var treeImg = treeType ? treeType.getImgByState(state) : '';
        var content = choosedItem.content;
        var money = choosedItem.money;


        markTree({
            row: row,
            column: column,
            state: state,
            treeImg: treeImg,
            treeType: treeType,
            money: money,
            treeInfo: {
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
        $('#' + item._id).find('img').attr('src', getTreeById(item.treeTypeId).getImgByState(STATE_1));
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
                    .attr('src', getTreeById(tree.treeTypeId).getImgByState(STATE_1));
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
    var treeTypeId = $(_this).data('treeTypeId');
    var tree = getTreeById(treeTypeId);

    var _row = $(_this).data('row');
    var _column = $(_this).data('column');
    var _money = $(_this).data('money');

    var rowTitle = tRow[_row].rowTitle;
    var chooseInfo = pTitle + '-' + rowTitle + '-' + tree.name + '-' + parseInt(_row + 1) + '-' + (_column + 1);
    var money = _money || tree.money;
    totalMoney += money;

    var tree = {
        _id: pId + '_' + _row + '_' + _column,
        _rIndex: _row,
        _cIndex: _column,
        pId: pId,
        state: STATE_3,
        info: chooseInfo,
        money: money,
        treeTypeId: treeTypeId
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
    $('#' + tree._id).find('img').attr('src', getTreeById(tree.treeTypeId).getImgByState(STATE_3));

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
    return chooseOrder;
}

function renderTreeType() {
    treeTypeArr.forEach(function (item, i) {
        var treeItem = '<span class="treeType" style="border: none">' +
            '<img src="' + item.img + '" style="vertical-align: middle;">' +
            item.name +
            '</span>';
        $(treeItem).appendTo($('#treeTypeSel'))
    });
}

function renderAreaType() {
    $('#areaTypeDiv').html('');
    areaArr.forEach(function (item, i) {
        $('#areaTypeDiv').append('<span>' + item.title + '</span>');
    })
}

function myAlert(msg) {
    layer.config({
        extend: 'red/layer.css',
        skin: 'layui-layer-red' //样式类名
    });
    layer.alert(msg);
}

/**
 * 根据treeTpyeId获取树对象
 *
 * @param treeTypeId
 * @returns {{typeId, name, imgUrl, money}|*}
 */
function getTreeById(treeTypeId) {
    for (var i = 0; i < treeTypeArr.length; i++) {
        var tree = treeTypeArr[i];
        if (tree._id === treeTypeId) {
            return tree;
        }
    }
}

// for treeTypeArr.getImgByState
function imgSwitch(state, _this) {
    var curStateImg = '';
    switch (state) {
        case 0:
            curStateImg = _this.state_img_0;
            break;
        case 1:
            curStateImg = _this.state_img_1;
            break;
        case 2:
            curStateImg = _this.state_img_2;
            break;
        case 3:
            curStateImg = _this.state_img_3;
            break;
        case 4:
            curStateImg = _this.state_img_4;
            break;
        default:
            curStateImg = _this.state_img_0;
    }
    return curStateImg;
}