
module.exports = function (Club, _, async)
{
    return {
        SetRouting: function (router)
        {
            router.get('/home', this.homePage);
        },

        homePage: function (req, res)
        {
            async.parallel([
                function (callback)
                {
                    try
                    {
                        let result = Club.find().exec();
                        result.then(result =>
                        {
                            callback(null, result);
                        })
                    } catch (err)
                    {
                        console.log({ err });

                    }
                },
                function (callback)
                {

                    try
                    {
                        let countries = Club.aggregate([
                            {
                                $group: { _id: '$country' }
                            }
                        ]);
                        countries.then(country =>
                        {
                            callback(null, country);
                        })
                    } catch (err)
                    {
                        console.log(err);

                    }
                }
            ], (err, result) =>
            {
                const res1 = result[0];
                let res2 = result[1]
                console.log({ res2 });


                let dataChunk = [];
                let chunkSize = 3;
                // Getting data into array of size 3 and displaying over window by modifying on ejs file
                for (let i = 0; i < res1.length; i += chunkSize)
                {
                    dataChunk.push(res1.slice(i, i + chunkSize));
                }
                const countrySort = _.sortBy(res2, '_id');
                console.log({ inhome: req.user });

                res.render('home', {
                    coun: 'FootballKik - Home',
                    user: req.user,
                    data: dataChunk,
                    country: countrySort
                })
            })
        }
    }
}