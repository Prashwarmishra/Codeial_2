{
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $('#post-comments-list>ul').prepend(newComment);
                    deleteComment($(' .comment-delete-button', newComment));
                    new ToggleLike($(' .toggle-like-button', newComment));

                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let newCommentDom = function(comment){
        return (`<li id="comment-${ comment._id }">
                    <p>
                        <small>
                            <a class="comment-delete-button" href="/comments/destroy/${ comment._id }">X</a>
                        </small>
                        <small>
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                0 Likes
                            </a>
                        </small>
                        ${ comment.content }
                        <br>
                        <small>
                            ${ comment.user.name }
                        </small>
                    </p>
                </li>`)
    }


    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    createComment();
}