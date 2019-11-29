const tf = require('@tensorflow/tfjs');
const faceapi = require('face-api.js');
const async = require('async');

const pos_list = [
    '0000', '0001', '0002', '0003', '0004', '0005',
    '0100', '0101', '0102', '0103', '0104', '0105',
    '0200', '0201', '0202', '0203', '0204', '0205',
    '0300', '0301', '0302', '0303', '0304', '0305',
    '0400', '0401', '0402', '0403', '0404', '0405',
    '0500', '0501', '0502', '0503', '0504', '0505',
    '0600', '0601', '0602', '0603', '0604', '0605'
];

let scoreTotals = [];

let grid = [];
const gridWidth = 18;
const gridHeight = 21;
//prep grid array
for (let y = 0; y < gridHeight; y++) grid.push([]);

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {

    getIndex: (req, res) => {

        const query = 'SELECT pos_id, score_total FROM `posid`';
        db.query(query, (err, result) => {
            if (err) {
                //res.status(500).send({ errormsg: "score_total query failed." });
                console.log("score_total query failed.");
            }
            //console.log(result);
            else {
                result.forEach((score) => {
                    scoreTotals.push({ pos_id: score.pos_id, score: score.score_total, });
                })
            }

            //console.log('SCORE_TOTALS:', scoreTotals);
            //let output = JSON.stringify(scoreTotals);
            res.render('index.ejs', {
                title: 'Unicode Faces',
                author: 'Trevor Adams'
            });

        });



    },

    getArray: (req, res) => {

        grid = [];
        for (let y = 0; y < gridHeight; y++) grid.push([]);



        const fillGrid = function () {
            console.log('entering fillGrid');
            let ypos = 0;
            let xpos = 0;
            //let q = async.queue(42);

            async.forEachOf(scoreTotals, function (value, key, callback) {
                //console.log('entering asyncForEachOf');

                let posQuery = `SELECT uuid, score FROM \`grid\` WHERE pos_id = '${value.pos_id}'`;
                //console.log(`posid: ${value.pos_id}, score: ${value.score}`);
                let totalScore = value.score;

                db.query(posQuery, (err, pos_result) => {
                    //console.log('entering posQuery');
                    if (err) {
                        console.log("position query failed");
                    }
                    else {
                        //console.log('in query, pos_result');
                        for (let y = ypos; y < ypos + 3; y++) {
                            for (let x = xpos; x < xpos + 3; x++) {
                                let weight = Math.floor(Math.random() * totalScore);
                                //console.log('weight: ', weight);
                                let index = 0;
                                pos_result.some((obj) => {
                                    let thisScore = obj.score;
                                    //console.log('some function, obj.uuid: ', obj.uuid);
                                    if (weight <= thisScore) {
                                        //console.log('posQuery result: ', parseInt(obj.uuid));
                                        //console.log(`y: ${y} grid[y]: `, grid[y]);
                                        grid[y].push(obj.uuid);
                                        return true;
                                    }
                                    else {
                                        weight = weight - obj.score;
                                    }
                                });
                            }
                        }
                        xpos += 3;
                        if (xpos >= gridWidth - 1) {
                            xpos = 0;
                            ypos += 3;
                        }

                    }

                    callback();
                });


            }, function (error) {
                if (error) {
                    console.log("query process failed");
                }
                else {
                    let gridOut = JSON.stringify(grid)
                    res.send({ gridOut });
                    //console.log('grid JSON: ', gridOut);
                }
            });

        }
        fillGrid();


    },

    scoreGrid: (req, res) => {
        //console.log('req: ', req);
        //console.log('res: ', res);
        //console.log('req.body :', req.body);
        console.log('updating scores')
        let isFace = req.body.face;
        let grid = req.body.grid;
        let scoreUpdateAmount = '';
        let totalScoreUpdate = scoreUpdateAmount * 9;

        let ypos = 0;
        let xpos = 0;

        //check if face and set score update vars
        if (isFace) {
            scoreUpdateAmount = '+ 5';
        }
        else {
            scoreUpdateAmount = '- 5'
        }

        let updateTotalsQuery = `UPDATE posid SET score_total = score_total + ${totalScoreUpdate}`;
        db.query(updateTotalsQuery, (err, res) => {
            if (err) { console.log('score_total update failed: ', updateTotalsQuery) }
            else {
                for (let i = 0; i < scoreTotals.length; i++) {
                    //if database is updated, update list in memory
                    scoreTotals[i] += totalScoreUpdate;
                }
            }
        })

        async.forEachOf(pos_list, function (value, key, callback) {
            //console.log('entering asyncForEachOf pos_list');

            let index = 0;
            let uuid = '';
            for (let y = ypos; y < ypos + 3; y++) {
                for (let x = xpos; x < xpos + 3; x++) {

                    uuid += grid[y][x];
                    if (y !== ypos + 2 || x !== xpos + 2) {
                        uuid += ','
                    }

                }
            }
            xpos += 3;
            if (xpos >= gridWidth - 1) {
                xpos = 0;
                ypos += 3;
            }
            let scoreQuery = `UPDATE grid SET score = score ${scoreUpdateAmount} WHERE pos_id = ${value} AND uuid IN (${uuid})`;
            console.log('scoreQuery: ', scoreQuery);
            db.query(scoreQuery, (err, res) => {
                if (err) { console.log('scoreQuery failed: ', scoreQuery) }
                else {
                    //console.log('executed: ', scoreQuery)

                    callback()
                }
            })



        }, function (error) {
            if (error) {
                console.log("score update process failed");
            }
            else {
                //let msg = JSON.stringify('Scores Updated');
                //res.set({ 'body': 'Scores Updated' });
                //res.sendStatus(200);
                //console.log(res);
            }
        })
    },

    characterCheck: (req, res) => {
        res.render('characterCheck.ejs', {
            title: 'Character Check',
            author: 'Trevor Adams'
        });
    }
};