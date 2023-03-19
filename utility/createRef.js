function createRef(shopRows) {
    const refObj = {};
    if (shopRows.length === 0) {
        return refObj;
    }
    shopRows.forEach(({ shop_name, shop_id }) => {
        refObj[shop_name] = shop_id;
    });

    return refObj;
}

module.exports = createRef;
