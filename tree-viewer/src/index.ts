import express from 'express';

const PORT = process.env.PORT || 3006;
(async () => {
    const app = express();
    app.use(express.static('public'));
    app.use(express.json());
    app.listen(PORT, () => {
        console.log('Topic Viewer started at port', PORT);
    })
})();
