const dependable = require('dependable');
const path = require('path');

const container = dependable.container();
const simpleDependencies = [
    ['_', 'lodash'],,
    ['passport', 'passport']
    // ['users', 'users']
    //  ['users', './controllers/users']
];

simpleDependencies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    })
}
);

// const users = container.invoke('users', '_');

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function () {
    return container;
});

module.exports = container;