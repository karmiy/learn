const poolFactory = function(createFn) {
    const pool = [];

    return {
        create(...args) {
            const obj = pool.length ? pool.shift() : createFn.apply(this, ...args);
        },
        recover(obj) {
            pool.push(obj);
        }
    }
}

const tooltipFactory = poolFactory(function() {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
});

const arr = [];

for (let i = 0, str; str = ['1', '2'][i++];) {
    const tooltip = tooltipFactory.create();
    tooltip.innerHTML = str;
    arr.push(tooltip);
}