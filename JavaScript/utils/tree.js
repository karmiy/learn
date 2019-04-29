/**
 * 找到树节点里的某一项
 * @param tree：treeData(Array) 如[{key: 1, title: '1', children: [{key: 2, title: '2'}]}]
 * @param key
 * @param callback：(item: 找到的项, index：此项在该级数组的index， arr：该级数组)
 */

export const searchTreeItem = (tree, key, callback) => {
    tree.forEach((item, index, arr) => {
        if (item.key === key) {
            return callback(item, index, arr)
        }
        if (item.children) {
            return searchTreeItem(item.children, key, callback)
        }
    })
}

/**
 * tree转扁平数据
 * @param tree：treeData(Array) 如[{key: 1, title: '1', children: [{key: 2, title: '2'}]}]
 * @param generate：接收数据的数组
 * @param parentKey：顶层的parentKey，可省略
 */
export const generateList = (tree, generate, parentKey) => {
    tree.forEach(item => {
        const {children, ...props} = item;
        generate.push(parentKey ? { ...props, parentKey } : { ...props });
        children && generateList(children, generate, item.key)
    })
}

/**
 * 返回父节点的key值
 * @param key：查询项的key值
 * @param tree：treeData(Array) 如[{key: 1, title: '1', children: [{key: 2, title: '2'}]}]
 * @returns {*}
 */
export const getParentKey = (key, tree) => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children)
            }
        }
    }
    return parentKey
}

const sortTree = function(tree, orderNo){
    tree.sort(function(a, b){
        return a[orderNo] - b[orderNo];
    });
    tree.forEach(item => {
        item.children && sortTree(item.children, orderNo);
    })
}

/**
 * 扁平数据构建树结构，会改变原数组
 * @param data：扁平数据
 * @param key：作为键的项，默认key
 * @param parent：作为父键的项，默认parentKey
 * @param orderNo：作为排序的项
 * @returns {Array}
 */
export const buildTree = (data, key = 'key', parent = 'parentKey', orderNo) => {
    let temps = {},//处理为 1: {key:1, parent:0}的形式
        tree = [];//返回的树结构
    //整理temps
    data.forEach(item => {
        temps[item[key]] = item;
    });
    let item, parentItem;
    let deleteKey = [];//父子节点衔接后需要删除的temps节点
    //衔接父子节点
    for(let k in temps){
        item = temps[k];
        parentItem = temps[item[parent]];
        if(parentItem) {
            if (!parentItem.children) {
                parentItem.children = [];
            }
            parentItem.children.push(item);
            deleteKey.push(k);
        }
        delete item[parent];
    }
    //整理到tree数组中
    for(let k in temps){
        deleteKey.includes(k) ? (delete temps[item]): (tree.push(temps[k]));
    }
    //排序
    orderNo && sortTree(tree, orderNo);
    return tree;
}