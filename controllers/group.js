
module.exports = function ()
{
    return {
        SetRouting: function (router)
        {
            router.get('/group/:name', this.groupPage);
        },
        groupPage: function (req, res)
        {
            console.log({ user: req.user });

            const name = req.params.name;
            res.render('groupchat/group', { title: 'footballkik - Group', user: req.user, groupName: name });
        }
    }
}