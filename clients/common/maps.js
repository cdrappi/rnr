function buildMap(items, key) {
    // convert array of JSON objects to object of objects
    let map = {};
    for (let ii = 0; ii < items.length; ii++) {
        let item = items[ii];
        map[item[key]] = item;
    }
    return map;
}

export { buildMap };