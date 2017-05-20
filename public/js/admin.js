$(function(){
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		console.log(id);
		console.log(tr);
		tr.remove();

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id
		})
		.done(function(results) {
			console.log(results);
			if (results.success === 1) {
				if (tr.length > 0) {
					tr.remove();
				}
			}
		})
	})
})