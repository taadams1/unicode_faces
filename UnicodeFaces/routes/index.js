module.exports = {
    getIndex: (req, res) => {
        res.render('index.ejs', {
            title: 'Unicode Faces',
            author: 'Trevor Adams'
        });
                
    }
};