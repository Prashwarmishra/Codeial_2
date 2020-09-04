const commentMailer = require("../mailer/comment_mailer");
const queue = require("../config/kue");


queue.process('emails', function(job, done){
    console.log("The email worker is working using queues, ", job.data);

    commentMailer.newComment(job.data);
    done();
})