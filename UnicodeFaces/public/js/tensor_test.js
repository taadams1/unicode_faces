let tf = require('@tensorflow/tfjs');

const myModel = tf.sequential();

const uuidOptions = {
    units: 109979,
    activation: 'tahn',
    inputShape: [27, 21],
    name: 'uuid'
}

const outputOptions = {
    units: [27, 21],
    name: 'output'
}

const uuidLayer = tf.layers.dense(uuidOptions);
const outputLayer = tf.layers.dense(outputOptions);

myModel.add(uuidLayer, outputLayer);