// const path = require('path');
// const fs = require('fs');

module.exports = function (formidable, Club, aws)
{
    return {
        SetRouting: function (router)
        {
            router.get('/dashboard', this.adminPage);

            // router.post('/uploadFile', aws.Upload.any(), this.uploadFile);
            router.post('/uploadFile', aws.Upload.single('upload'), this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },


        adminPage: function (req, res)
        {
            res.render('admin/dashboard')
        },

        adminPostPage: async function (req, res)
        {
            try
            {
                const newClub = new Club();
                newClub.name = req.body.club;
                newClub.country = req.body.country;
                newClub.image = req.body.upload;
                console.log({ body: req.body });
                console.log({ newClub });

                await newClub.save();
                res.render('admin/dashboard');
            } catch (err)
            {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        },


        uploadFile: function (req, res)
        {

            const form = new formidable.IncomingForm();
            // form.uploadDir = path.join(__dirname, '../public/upload');

            form.on('upload', (field, file) =>
            {
                // const oldPath = file.filepath;
                // const newPath = path.join(form.uploadDir, file.originalFilename); 
                // fs.rename(oldPath, newPath, (err) =>
                // {
                //     if (err) throw err;
                //     console.log("File Renamed");
                // });
            });

            form.on('error', err =>
            {
                console.log(err);
            });

            form.on('end', () =>
            {
                console.log("file uploaded successfully");
            });

            form.parse(req);

        }
    }
}