module.exports.home = function(req, res){
    return res.end('<h1>Express is Up for Codeial!!</h1>')
}

module.exports.practise = function(req, res){
    return res.end("<h1>Practise Case!</h1>")
}

module.exports.profile = function(req, res){
    return res.end("Profile Page");
}